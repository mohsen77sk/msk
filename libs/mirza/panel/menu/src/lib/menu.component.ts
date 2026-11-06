import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskValidateFormFields } from '@msk/shared/utils/error-handler';
import { MskDataSource, MskHttpErrorResponse, MskSort } from '@msk/shared/data-access';
import { DefaultProductsSortData, Product, ProductsService } from '@msk/mirza/panel/products';
import { encode, renderSVG } from 'uqr';
import {
  MENU_SLUG_MAX_LENGTH,
  MENU_SLUG_MIN_LENGTH,
  MENU_SLUG_PATTERN,
  MenuConfig,
  MenuProductGroup,
  RESERVED_MENU_SLUGS,
} from './menu.types';
import { MenuService } from './menu.service';

// Medium-high error correction and a 4-module quiet zone keep printed codes scannable.
const QR_OPTIONS = { ecc: 'Q', border: 4 } as const;
const QR_PNG_MIN_SIZE = 1024;

/**
 * Group products by category, keeping the order in which categories first appear
 *
 * @param products
 */
function groupByCategory(products: Product[]): MenuProductGroup[] {
  const groups = new Map<number | null, MenuProductGroup>();
  for (const product of products) {
    const key = product.category?.id ?? null;
    const group = groups.get(key) ?? { category: product.category, products: [] };
    group.products.push(product);
    groups.set(key, group);
  }
  return [...groups.values()];
}

function reservedSlugValidator(control: AbstractControl<string>): ValidationErrors | null {
  return RESERVED_MENU_SLUGS.includes(control.value) ? { reserved: true } : null;
}

@Component({
  selector: 'mz-menu',
  templateUrl: './menu.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    DragDropModule,
    ScrollingModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
    MskCurrencyPipe,
    MskAlertComponent,
    MskSpinnerDirective,
  ],
})
export class MenuComponent implements OnInit {
  private _document = inject(DOCUMENT);
  private _clipboard = inject(Clipboard);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _destroyRef = inject(DestroyRef);
  private _appConfig = inject(MSK_APP_CONFIG);
  private _formBuilder = inject(FormBuilder);
  private _menuService = inject(MenuService);
  private _productsService = inject(ProductsService);
  private _snackbarService = inject(MskSnackbarService);
  private _translocoService = inject(TranslocoService);

  readonly slugMinLength = MENU_SLUG_MIN_LENGTH;
  readonly slugMaxLength = MENU_SLUG_MAX_LENGTH;

  readonly isLoading = signal(true);
  readonly loadFailed = signal(false);
  readonly alert = signal({ show: false, message: '' });

  // Last saved settings (the public URL and QR code always reflect saved state)
  readonly savedSlug = signal<string | null>(null);
  readonly savedEnabled = signal(false);
  readonly savingSettings = signal(false);

  // Selected products, always kept grouped by category in display order
  readonly selected = signal<Product[]>([]);
  readonly productsDirty = signal(false);
  readonly savingProducts = signal(false);

  readonly groups = computed(() => groupByCategory(this.selected()));
  readonly selectedIds = computed(() => new Set(this.selected().map((product) => product.id)));

  readonly publicUrl = computed(() => {
    const slug = this.savedSlug();
    const origin = this._appConfig.frontendOrigin;
    return slug && origin ? `${origin}/menu/${slug}` : null;
  });

  readonly qrCode = computed(() => {
    const url = this.publicUrl();
    return url ? this._renderQrCode(url) : null;
  });

  settingsForm = this._formBuilder.nonNullable.group({
    enabled: [false],
    slug: [
      '',
      [
        Validators.required,
        Validators.minLength(MENU_SLUG_MIN_LENGTH),
        Validators.maxLength(MENU_SLUG_MAX_LENGTH),
        Validators.pattern(MENU_SLUG_PATTERN),
        reservedSlugValidator,
      ],
    ],
  });

  search = new FormControl<string>('');
  productsDataSource!: MskDataSource<Product>;

  trackById = (i: number, item: Product | undefined) => item?.id ?? i;

  get slugControl(): FormControl<string> {
    return this.settingsForm.controls.slug;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.productsDataSource = new MskDataSource<Product>(
      (params) => this._productsService.getProducts(params),
      new MskSort(DefaultProductsSortData),
      this.search.valueChanges,
    );

    // cdkVirtualFor renders new pages during change detection only; mark this OnPush view
    // when a page load finishes so the picker shows fetched products without user interaction.
    this.productsDataSource.loading$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._changeDetectorRef.markForCheck());

    this._menuService
      .getMenu()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (menu) => {
          this.settingsForm.reset({ enabled: menu.enabled, slug: menu.slug ?? '' });
          this._applySavedSettings(menu);
          this._setSelected(menu.products);
          this.productsDirty.set(false);
          this.isLoading.set(false);
        },
        error: () => {
          this.loadFailed.set(true);
          this.isLoading.set(false);
        },
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Trim and lowercase the slug, matching the backend normalization
   */
  normalizeSlug(): void {
    const normalized = this.slugControl.value.trim().toLowerCase();
    if (normalized !== this.slugControl.value) {
      this.slugControl.setValue(normalized);
    }
  }

  /**
   * Save the enabled state and slug
   */
  saveSettings(): void {
    this.normalizeSlug();
    MskValidateFormFields(this.settingsForm);
    if (this.settingsForm.invalid) {
      return;
    }

    const payload = this.settingsForm.getRawValue();
    this.settingsForm.disable();
    this.savingSettings.set(true);
    this.alert.set({ show: false, message: '' });

    this._menuService.updateMenu(payload).subscribe({
      next: (menu) => {
        this.savingSettings.set(false);
        this.settingsForm.enable();
        this.settingsForm.reset({ enabled: menu.enabled, slug: menu.slug ?? '' });
        this._applySavedSettings(menu);
        this._snackbarService.success(this._translocoService.translate('menu.settings.saved'));
      },
      error: (response: MskHttpErrorResponse) => {
        this.savingSettings.set(false);
        // Enable first: enable() re-runs validation and would clear the server error below
        this.settingsForm.enable();
        if (response.status === 409) {
          this.slugControl.setErrors({ taken: true });
          this.slugControl.markAsTouched();
          return;
        }
        this.alert.set({ show: true, message: this._errorMessage(response) });
      },
    });
  }

  /**
   * Add or remove a product from the menu
   *
   * @param product
   */
  toggleProduct(product: Product): void {
    if (this.selectedIds().has(product.id)) {
      this.removeProduct(product);
      return;
    }
    this._setSelected([...this.selected(), product]);
    this.productsDirty.set(true);
  }

  /**
   * Remove a product from the menu
   *
   * @param product
   */
  removeProduct(product: Product): void {
    this._setSelected(this.selected().filter((item) => item.id !== product.id));
    this.productsDirty.set(true);
  }

  /**
   * Reorder products inside a category
   *
   * @param groupIndex
   * @param event
   */
  dropProduct(groupIndex: number, event: CdkDragDrop<Product[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const groups = this.groups().map((group) => ({ ...group, products: [...group.products] }));
    moveItemInArray(groups[groupIndex].products, event.previousIndex, event.currentIndex);
    this._setSelected(groups.flatMap((group) => group.products));
    this.productsDirty.set(true);
  }

  /**
   * Move a product one position up or down inside its category
   *
   * @param groupIndex
   * @param productIndex
   * @param offset
   */
  moveProduct(groupIndex: number, productIndex: number, offset: -1 | 1): void {
    const groups = this.groups().map((group) => ({ ...group, products: [...group.products] }));
    moveItemInArray(groups[groupIndex].products, productIndex, productIndex + offset);
    this._setSelected(groups.flatMap((group) => group.products));
    this.productsDirty.set(true);
  }

  /**
   * Move a whole category one position up or down
   *
   * @param groupIndex
   * @param offset
   */
  moveGroup(groupIndex: number, offset: -1 | 1): void {
    const groups = [...this.groups()];
    moveItemInArray(groups, groupIndex, groupIndex + offset);
    this._setSelected(groups.flatMap((group) => group.products));
    this.productsDirty.set(true);
  }

  /**
   * Save the selected products and their order
   */
  saveProducts(): void {
    this.savingProducts.set(true);
    this.alert.set({ show: false, message: '' });

    this._menuService.setProducts(this.selected().map((product) => product.id)).subscribe({
      next: (menu) => {
        this._setSelected(menu.products);
        this.productsDirty.set(false);
        this.savingProducts.set(false);
        this._snackbarService.success(this._translocoService.translate('menu.products.saved'));
      },
      error: (response: MskHttpErrorResponse) => {
        this.savingProducts.set(false);
        this.alert.set({ show: true, message: this._errorMessage(response) });
      },
    });
  }

  /**
   * Copy the public URL
   */
  copyUrl(): void {
    const url = this.publicUrl();
    if (url && this._clipboard.copy(url)) {
      this._snackbarService.success(this._translocoService.translate('menu.share.copied'));
    }
  }

  /**
   * Download the QR code
   *
   * @param format
   */
  downloadQrCode(format: 'png' | 'svg'): void {
    const qrCode = this.qrCode();
    const slug = this.savedSlug();
    if (!qrCode || !slug) {
      return;
    }

    const href =
      format === 'png' ? qrCode.png : URL.createObjectURL(new Blob([qrCode.svg], { type: 'image/svg+xml' }));
    const link = this._document.createElement('a');
    link.href = href;
    link.download = `menu-qr-${slug}.${format}`;
    link.click();

    if (format === 'svg') {
      setTimeout(() => URL.revokeObjectURL(href));
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _applySavedSettings(menu: MenuConfig): void {
    this.savedSlug.set(menu.slug);
    this.savedEnabled.set(menu.enabled);
  }

  private _setSelected(products: Product[]): void {
    this.selected.set(groupByCategory(products).flatMap((group) => group.products));
  }

  private _errorMessage(response: MskHttpErrorResponse): string {
    // Nest's ValidationPipe returns `message` as a string array; other errors return a string.
    const message: unknown = response.error?.message;
    if (Array.isArray(message)) {
      return message.join('\n');
    }
    return typeof message === 'string' ? message : response.message;
  }

  private _renderQrCode(url: string): { png: string; svg: string } | null {
    const qr = encode(url, QR_OPTIONS);
    const scale = Math.ceil(QR_PNG_MIN_SIZE / qr.size);
    const canvas = this._document.createElement('canvas');
    canvas.width = qr.size * scale;
    canvas.height = qr.size * scale;

    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    qr.data.forEach((row, y) =>
      row.forEach((dark, x) => {
        if (dark) {
          context.fillRect(x * scale, y * scale, scale, scale);
        }
      }),
    );

    return { png: canvas.toDataURL('image/png'), svg: renderSVG(url, QR_OPTIONS) };
  }
}
