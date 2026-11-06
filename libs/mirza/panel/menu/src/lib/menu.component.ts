import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskDataSource, MskHttpErrorResponse, MskSort } from '@msk/shared/data-access';
import { DefaultProductsSortData, Product, ProductsService } from '@msk/mirza/panel/products';
import { MenuProductGroup } from './menu.types';
import { MenuService } from './menu.service';

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
    MatProgressSpinnerModule,
    TranslocoDirective,
    MskCurrencyPipe,
    MskAlertComponent,
    MskSpinnerDirective,
  ],
})
export class MenuComponent implements OnInit {
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _destroyRef = inject(DestroyRef);
  private _menuService = inject(MenuService);
  private _productsService = inject(ProductsService);
  private _snackbarService = inject(MskSnackbarService);
  private _translocoService = inject(TranslocoService);

  readonly isLoading = signal(true);
  readonly loadFailed = signal(false);
  readonly alert = signal({ show: false, message: '' });

  // Selected products, always kept grouped by category in display order
  readonly selected = signal<Product[]>([]);
  readonly productsDirty = signal(false);
  readonly savingProducts = signal(false);

  readonly groups = computed(() => groupByCategory(this.selected()));
  readonly selectedIds = computed(() => new Set(this.selected().map((product) => product.id)));

  search = new FormControl<string>('');
  productsDataSource!: MskDataSource<Product>;

  trackById = (i: number, item: Product | undefined) => item?.id ?? i;

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

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

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
}
