import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskHttpErrorResponse } from '@msk/shared/data-access';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { StoreService } from '@msk/mirza/shell/core/store';
import { LockupPaymentTypeSortData, PaymentTypesService } from '@msk/mirza/panel/payment-types';
import { SaleInvoice, SaleReceiptPrinter, SalesService } from '@msk/mirza/panel/sales';
import { catchError, EMPTY, finalize, forkJoin } from 'rxjs';
import { PosService } from './pos.service';
import { PosCartStore } from './pos-cart.store';
import { PosCatalog } from './pos.types';
import { PosProductsComponent } from './products/pos-products.component';
import { PosCartComponent } from './cart/pos-cart.component';
import { PosCustomerComponent } from './customer/pos-customer.component';
import { PosPayComponent } from './pay/pos-pay.component';

const PAYMENT_TYPES_PAGE_SIZE = 50;
const SALE_SNACKBAR_DURATION = 8000;

@Component({
  selector: 'mz-pos',
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PosCartStore],
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
    PosProductsComponent,
    PosCartComponent,
    PosCustomerComponent,
    PosPayComponent,
  ],
})
export class PosComponent {
  private _destroyRef = inject(DestroyRef);
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _posService = inject(PosService);
  private _salesService = inject(SalesService);
  private _paymentTypesService = inject(PaymentTypesService);
  private _receiptPrinter = inject(SaleReceiptPrinter);
  private _storeService = inject(StoreService);
  private _matSnackBar = inject(MatSnackBar);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _translocoService = inject(TranslocoService);
  readonly cart = inject(PosCartStore);

  readonly storeName = this._storeService.currentStore?.name ?? '';
  readonly catalog = signal<PosCatalog | null>(null);
  // Which quick notes a cart line gets
  readonly categoryIdByProduct = computed(
    () => new Map((this.catalog()?.products ?? []).map((product) => [product.id, product.categoryId] as const)),
  );
  readonly loadError = signal('');
  readonly showShortcuts = signal(false);

  private _products = viewChild(PosProductsComponent);

  /**
   * Constructor
   */
  constructor() {
    this.load();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Catalog and payment types, once per visit
   */
  load(): void {
    this.loadError.set('');
    forkJoin([
      this._posService.getCatalog(),
      this._paymentTypesService.getPaymentTypes({
        page: 1,
        pageSize: PAYMENT_TYPES_PAGE_SIZE,
        sortBy: `${LockupPaymentTypeSortData.active} ${LockupPaymentTypeSortData.direction}`,
      }),
    ])
      .pipe(
        catchError((response: MskHttpErrorResponse) => {
          this.loadError.set(response.error?.message || this._translocoService.translate('pos.errors.load-failed'));
          return EMPTY;
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(([catalog, paymentTypes]) => {
        this.cart.setPaymentTypes(paymentTypes.items);
        this.catalog.set(catalog);
      });
  }

  focusInput(): void {
    this._products()?.focus();
  }

  /**
   * Back to the code input after a click on a card, line, chip or button of the POS. Not on touch
   * screens, where focusing the input would pop up the on-screen keyboard.
   * @param event
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if ((event as PointerEvent).pointerType === 'touch') return;
    const target = event.target as HTMLElement | null;
    if (!target || !this._elementRef.nativeElement.contains(target)) return;
    if (target.closest('input, textarea, form, [data-pos-keep-focus]')) return;
    if (target.closest('button, a')) this.focusInput();
  }

  /**
   * POST /sale
   */
  submit(): void {
    if (!this.cart.canSubmit()) return;

    const payload = this.cart.toPayload();
    this.cart.submitting.set(true);
    this._salesService
      .createSale(payload)
      .pipe(
        finalize(() => this.cart.submitting.set(false)),
        catchError((response: MskHttpErrorResponse) => {
          this._mskSnackbarService.error(
            response.error?.message || this._translocoService.translate('pos.errors.save-failed'),
          );
          return EMPTY;
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((sale) => {
        this.cart.clear();
        this.focusInput();
        this._showSaved(sale);
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Snackbar with a print action; printing runs inside the click so the popup is allowed
   * @param sale
   */
  private _showSaved(sale: SaleInvoice): void {
    this._matSnackBar
      .open(
        this._translocoService.translate('pos.sale-saved', { number: sale.number }),
        this._translocoService.translate('pos.print'),
        { duration: SALE_SNACKBAR_DURATION },
      )
      .onAction()
      .subscribe(() => {
        const printed = this._receiptPrinter.print(
          sale,
          this._storeService.currentStore,
          this._translocoService.translate('pos.print-title', { number: sale.number }),
        );
        if (!printed) {
          this._mskSnackbarService.error(this._translocoService.translate('pos.errors.print-blocked'));
        }
        this.focusInput();
      });
  }
}
