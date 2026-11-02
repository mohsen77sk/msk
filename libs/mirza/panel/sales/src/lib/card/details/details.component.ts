import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject, signal, DestroyRef, ViewChild, computed } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MskDataSource, MskDialogData, MskHttpErrorResponse, MskSort } from '@msk/shared/data-access';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskMaskDirective } from '@msk/shared/directives/mask';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskAutoFocusDirective } from '@msk/shared/directives/autoFocus';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { MskDatepickerTouchUiDirective } from '@msk/shared/directives/datepicker-touch-ui';
import { LockupPaymentTypeSortData, PaymentType, PaymentTypesService } from '@msk/mirza/panel/payment-types';
import { Customer, CustomersService, DefaultCustomersSortData } from '@msk/mirza/panel/customers';
import { DefaultProductsSortData, Product, ProductsService } from '@msk/mirza/panel/products';
import { Store, StoreService } from '@msk/mirza/shell/core/store';

import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  filter,
  forkJoin,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { SalesService } from '../../sales.service';
import {
  ICreateSaleInvoice,
  IPaymentTypeForm,
  ISaleItemForm,
  ISalesForm,
  SaleInvoice,
  SaleInvoiceItem,
  SaleSource,
} from '../../sales.types';
import { SaleReceiptPrintService } from '../../print/print.service';
import { ReceiptPrintData } from '../../print/print.types';
import { SaleReceiptPrintComponent } from '../../print/print.component';
import { SALE_RECEIPT_PRINT_STYLES } from '../../print/print.styles';
import { InvoicePrintData } from '../../print/invoice-print.types';
import { InvoicePdfPreviewDialogComponent } from '../../print/invoice-pdf-preview-dialog/invoice-pdf-preview-dialog.component';

const MELLAT_POS_PAYMENT_TYPE_NAME = 'دستگاه POS ملت';
// sale-item.note is varchar(255)
const SALE_ITEM_NOTE_MAX_LENGTH = 255;

/**
 * Text typed in the customer field must be picked from the list; an empty field means no customer
 * @param control
 */
function customerPickedValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return typeof value === 'string' && value.trim() ? { customerNotPicked: true } : null;
}

@Component({
  selector: 'mz-sales-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgTemplateOutlet,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    TranslocoPipe,
    TranslocoDirective,
    MskCurrencyPipe,
    MskDateTimePipe,
    MskAlertComponent,
    MskDialogComponent,
    MskMaskDirective,
    MskSpinnerDirective,
    MskAutoFocusDirective,
    MskCurrencySymbolDirective,
    MskDatepickerTouchUiDirective,
    SaleReceiptPrintComponent,
  ],
  providers: [SaleReceiptPrintService],
})
export class SalesCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<SaleInvoice | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<SalesCardDetailsComponent>);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);
  private _formBuilder = inject(FormBuilder);
  private _salesService = inject(SalesService);
  private _productsService = inject(ProductsService);
  private _customersService = inject(CustomersService);
  private _paymentTypeService = inject(PaymentTypesService);
  private _printService = inject(SaleReceiptPrintService);
  private _storeService = inject(StoreService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);

  @ViewChild(SaleReceiptPrintComponent)
  private _receiptPrint?: SaleReceiptPrintComponent;

  isNew = computed(() => this.data.action() === 'new');
  readonly noteMaxLength = SALE_ITEM_NOTE_MAX_LENGTH;
  readonly sourceIcons: Record<SaleSource, string> = {
    manual: 'edit_note',
    pos: 'point_of_sale',
    snappfood: 'delivery_dining',
  };

  form!: FormGroup<ISalesForm>;
  formErrors: FormError = {};
  paymentTypeDSList: MskDataSource<PaymentType>[] = [];
  productDSList: MskDataSource<Product>[] = [];
  customerDS!: MskDataSource<Customer>;

  alert = signal({
    show: false,
    message: '',
  });
  showCustomer = signal(!this.isNew());
  showDate = signal(!this.isNew());
  showNote = signal(!this.isNew());

  // Payment rows loaded with the sale: already paid, never sent to the card reader again
  private _savedPaymentRows = new Set<FormGroup<IPaymentTypeForm>>();
  // Rows added in this edit that were already sent to the card reader
  private _cardReaderSentRows = signal(new Set<FormGroup<IPaymentTypeForm>>());

  // Not editable: an edit keeps the stored values and the server checks the total with them
  tax = computed(() => this.data.item()?.tax ?? 0);
  deliveryFee = computed(() => this.data.item()?.deliveryFee ?? 0);
  savedItemsSubtotal = computed(() =>
    (this.data.item()?.saleItems ?? []).reduce((sum, item) => sum + (item.total || 0), 0),
  );

  receiptData = computed<ReceiptPrintData | null>(() => {
    if (this.isNew()) return null;
    return new ReceiptPrintData(this.data.item() as SaleInvoice, this._storeService.currentStore as Store);
  });

  invoiceData = computed<InvoicePrintData | null>(() => {
    if (this.isNew()) return null;
    return new InvoicePrintData(this.data.item() as SaleInvoice, this._storeService.currentStore);
  });

  /**
   * Get the sale items form array
   */
  get saleItems(): FormArray<FormGroup<ISaleItemForm>> {
    return this.form.controls.saleItems;
  }

  /**
   * Get the payment types form array
   */
  get paymentTypes(): FormArray<FormGroup<IPaymentTypeForm>> {
    return this.form.controls.paymentTypes;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.form = this._formBuilder.group<ISalesForm>({
      id: this._formBuilder.control(0, Validators.required),
      customer: this._formBuilder.control<Customer | null>(null, customerPickedValidator),
      saleDate: this._formBuilder.control(new Date(new Date().setHours(0, 0, 0, 0)), Validators.required),
      saleItems: this._formBuilder.array<FormGroup>([], Validators.required),
      paymentTypes: this._formBuilder.array<FormGroup>([], Validators.required),
      discount: this._formBuilder.control(0, [
        Validators.required,
        Validators.min(0),
        // Server rule SALE_DISCOUNT_EXCEEDS_SUBTOTAL
        (control: AbstractControl): ValidationErrors | null =>
          (Number(control.value) || 0) > this.itemsSubtotal() ? { discountExceedsSubtotal: true } : null,
      ]),
      total: this._formBuilder.control(0, [Validators.required, Validators.min(0)]),
      note: this._formBuilder.control(''),
    });
    this.addPaymentType();
    this.addSaleItem();
    // Handling errors
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);
    // Patch value form
    if (this.data.item()) {
      this.data.item()?.paymentTypes.forEach((v, i) => i !== 0 && this.addPaymentType());
      this.data.item()?.saleItems.forEach((v, i) => i !== 0 && this.addSaleItem());
      this.form.patchValue(this.data.item() || {});
      // Lines saved before unitPrice was stored keep the price they were sold at, as the server derives it
      this.saleItems.controls.forEach(({ controls }) => {
        if (controls.unitPrice.value === null && controls.quantity.value) {
          controls.unitPrice.setValue((controls.total.value ?? 0) / controls.quantity.value, { emitEvent: false });
        }
      });
      this.paymentTypes.controls.forEach((row) => this._savedPaymentRows.add(row));
    }
    // Set customer collection
    this.customerDS = new MskDataSource<Customer>(
      (params) => this._customersService.getCustomers(params),
      new MskSort(DefaultCustomersSortData),
      this.form.controls.customer.valueChanges,
    );

    // Subscribe to form changes to update total dynamically
    combineLatest([
      this.form.controls.saleItems.valueChanges.pipe(startWith(this.form.controls.saleItems.value)),
      this.form.controls.discount.valueChanges.pipe(startWith(this.form.controls.discount.value)),
    ])
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        // The discount limit follows the lines
        this.form.controls.discount.updateValueAndValidity({ emitEvent: false });
        const total = this._computedTotal();
        this.form.controls.total.setValue(total, { emitEvent: false });
        // Update first payment type if not changed by user
        if (
          this.form.controls.paymentTypes.at(0).controls.value.pristine &&
          this.form.controls.paymentTypes.length === 1
        ) {
          this.form.controls.paymentTypes.at(0).controls.value.setValue(total, { emitEvent: false });
        }
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sum of the line totals, before discount, tax and delivery fee
   */
  itemsSubtotal(): number {
    if (!this.form) return 0;

    return this.saleItems.controls.reduce((sum, item) => sum + (item.controls.total.value || 0), 0);
  }

  /**
   * Unit price a saved line was sold at (total / quantity on lines saved before it was stored)
   * @param item saved sale line
   */
  savedUnitPrice(item: SaleInvoiceItem): number {
    return item.unitPrice ?? (item.quantity ? item.total / item.quantity : 0);
  }

  /**
   * Unit price a form line is priced at: the saved price, or the product's sell price for a new
   * or changed line
   * @param line sale line form
   */
  lineUnitPrice(line: FormGroup<ISaleItemForm>): number {
    const product = line.controls.product.value;
    const sellPrice = product && typeof product === 'object' ? product.sellPrice : undefined;
    return line.controls.unitPrice.value ?? sellPrice ?? 0;
  }

  /**
   * Go to edit mode
   */
  editMode(): void {
    if (this.data.action() !== 'view') return;

    this.data.action.set('edit');
  }

  /**
   * Open this customer detail dialog
   * @param customerId customerId
   */
  viewCustomer(customerId: number | undefined): void {
    if (customerId === undefined) return;

    forkJoin([this._customersService.getCustomer(customerId), this._customersService.getCustomerSummary(customerId)])
      .pipe(
        switchMap((response) => {
          return this._customersService.openCustomerDialog({
            action: signal('view'),
            item: signal({ customer: response[0], summery: response[1] }),
          });
        }),
      )
      .subscribe();
  }

  /**
   * Get the customer name
   * @param value customer
   */
  customerDisplayFn(value: Customer): string {
    return value?.name;
  }

  /**
   * Get the product name
   * @param value product
   */
  productDisplayFn(value: Product): string {
    return value?.name;
  }

  /**
   * Get the paymentType name
   * @param value paymentType
   */
  paymentTypeDisplayFn(value: PaymentType): string {
    return value?.name;
  }

  /**
   * Add a sale item row in form
   */
  addSaleItem(): void {
    const group = this._formBuilder.group<ISaleItemForm>({
      product: this._formBuilder.control<Product | null>(null, Validators.required),
      quantity: this._formBuilder.control(1, [Validators.required, Validators.min(1)]),
      total: this._formBuilder.control(0, [Validators.required, Validators.min(0)]),
      unitPrice: this._formBuilder.control<number | null>(null),
      note: this._formBuilder.control<string | null>(null, Validators.maxLength(SALE_ITEM_NOTE_MAX_LENGTH)),
    });
    this.saleItems.push(group);

    // A saved line keeps the price it was sold at; a new or changed product uses its sell price
    combineLatest([
      group.controls.product.valueChanges.pipe(startWith(group.controls.product.value)),
      group.controls.quantity.valueChanges.pipe(startWith(group.controls.quantity.value)),
    ])
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map(([product, quantity]) => {
          const unitPrice = group.controls.unitPrice.value ?? product?.sellPrice ?? 0;
          group.controls.total.setValue(unitPrice * (quantity ?? 0));
        }),
      )
      .subscribe();

    // Picking a different product resets the line. Typing in the field or picking the same product
    // again keeps it. Patching a saved line sets product, quantity and total first, then unitPrice and note
    group.controls.product.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((product): product is Product => !!product && typeof product === 'object'),
        distinctUntilChanged((previous, current) => previous.id === current.id),
        tap(() => {
          group.controls.unitPrice.setValue(null);
          group.controls.note.setValue(null);
          group.controls.quantity.setValue(1);
        }),
      )
      .subscribe();

    // Create a new DataSource for this row
    this.productDSList.push(
      new MskDataSource<Product>(
        (params) => this._productsService.getProducts({ ...params, purpose: 'sale' }),
        new MskSort(DefaultProductsSortData),
        group.controls.product.valueChanges,
      ),
    );
  }

  /**
   * Remove a sale item row in form
   * @param index index of the sale item to remove
   */
  removeSaleItem(index: number): void {
    if (this.saleItems.length <= 1) return;

    this.saleItems.removeAt(index);
    this.productDSList.splice(index, 1);
  }

  /**
   * Add a payment type row in form
   * @param prefillRemaining start the row with the amount still unpaid (a row the user adds)
   */
  addPaymentType(prefillRemaining = false): void {
    const remaining = prefillRemaining ? Math.max(0, this.paymentsDifference()) : 0;
    const group = this._formBuilder.group<IPaymentTypeForm>({
      paymentType: this._formBuilder.control<PaymentType | null>(null, Validators.required),
      value: this._formBuilder.control(remaining, [Validators.required, Validators.min(0)]),
    });
    this.paymentTypes.push(group);

    // Create a new DataSource for this row
    this.paymentTypeDSList.push(
      new MskDataSource<PaymentType>(
        (params) =>
          this._paymentTypeService.getPaymentTypes(params).pipe(
            tap((res) => {
              if (this.isNew() && this.paymentTypes.length === 1) {
                this.paymentTypes
                  .at(0)
                  .get('paymentType')
                  ?.setValue(res.items.find((x) => x.isDefault === true) ?? null);
              }
            }),
          ),
        new MskSort(LockupPaymentTypeSortData),
        group.controls.paymentType.valueChanges,
      ),
    );
  }

  /**
   * Remove a payment type row in form
   * @param index index of the payment type to remove
   */
  removePaymentType(index: number): void {
    if (this.paymentTypes.length <= 1) return;

    this._savedPaymentRows.delete(this.paymentTypes.at(index));
    this.paymentTypes.removeAt(index);
    this.paymentTypeDSList.splice(index, 1);
  }

  /**
   * Payable total minus the sum of the payments: > 0 still unpaid, < 0 paid over
   */
  paymentsDifference(): number {
    if (!this.form) return 0;

    return (this.form.controls.total.value || 0) - this._paymentsTotal();
  }

  /**
   * Whether a payment row can be sent to the card reader by hand: only a Mellat row added
   * in this edit, not sent yet. Saving an edit never calls the card reader.
   * @param row payment row
   */
  canSendToCardReader(row: FormGroup<IPaymentTypeForm>): boolean {
    return (
      this.data.action() === 'edit' &&
      this._salesService.isMellatPosBridgeEnabled &&
      !this._savedPaymentRows.has(row) &&
      !this._cardReaderSentRows().has(row) &&
      this._isMellatPaymentRow(row) &&
      (row.controls.value.value ?? 0) > 0
    );
  }

  /**
   * Send one new payment row's amount to the card reader
   * @param row payment row
   */
  sendToCardReader(row: FormGroup<IPaymentTypeForm>): void {
    if (!this.canSendToCardReader(row)) return;

    // Mark it first so a double click can't start a second transaction
    this._cardReaderSentRows.update((rows) => new Set(rows).add(row));
    this._salesService
      .testDevelopmentMellatPosConnection(row.controls.value.value ?? 0)
      .pipe(
        tap(() => this._mskSnackbarService.success(this._translocoService.translate('sales.cardReaderSent'))),
        catchError(() => {
          this._cardReaderSentRows.update((rows) => {
            const next = new Set(rows);
            next.delete(row);
            return next;
          });
          this._mskSnackbarService.error(this._translocoService.translate('sales.errors.cardReaderFailed'));
          return EMPTY;
        }),
      )
      .subscribe();
  }

  /**
   * Print the current sale as an 80mm thermal receipt
   */
  printReceipt(): void {
    const receiptHtml = this._receiptPrint?.html;

    if (!receiptHtml) {
      this._mskSnackbarService.error(this._translocoService.translate('sales.errors.printWindowBlocked'));
      return;
    }

    const opened = this._printService.print({
      html: receiptHtml,
      title: this._translocoService.translate('sales.print-receipt'),
      styles: SALE_RECEIPT_PRINT_STYLES,
      windowFeatures: 'width=360,height=640',
    });

    if (!opened) {
      this._mskSnackbarService.error(this._translocoService.translate('sales.errors.printWindowBlocked'));
    }
  }

  /**
   * Export the current sale as an A4 PDF invoice (فاکتور فروش), previewed
   * in a dialog before download - see InvoicePdfPreviewDialogComponent.
   */
  printInvoice(): void {
    const invoiceData = this.invoiceData();

    if (!invoiceData) {
      this._mskSnackbarService.error(this._translocoService.translate('sales.errors.printWindowBlocked'));
      return;
    }

    this._dialog
      .open(InvoicePdfPreviewDialogComponent, {
        data: { invoiceData },
      })
      .afterClosed()
      .subscribe();
  }

  /**
   * delete the sale invoice
   */
  deleteInvoice(): void {
    // Open the confirmation dialog
    const confirmation = this._mskConfirmationService.open({
      title: this._translocoService.translate('sales.delete'),
      message: this._translocoService.translate('sales.delete-message', {
        number: this.data.item()?.number,
      }),
      actions: {
        confirm: { label: this._translocoService.translate('delete') },
        cancel: { label: this._translocoService.translate('cancel') },
      },
    });
    // Subscribe to the confirmation dialog
    confirmation.afterClosed().subscribe((result) => {
      // If don't confirm, return
      if (result !== 'confirmed') return;

      this._salesService
        .deleteSaleInvoice(this.data.item() as SaleInvoice)
        .pipe(
          map((response) => this.dialogRef.close(response)),
          catchError((response) => {
            // Show error
            this._mskSnackbarService.error(response.error.message);
            // Return
            return EMPTY;
          }),
        )
        .subscribe();
    });
  }

  /**
   * Save and close
   */
  saveAndClose(): void {
    // Validate all form fields
    MskValidateFormFields(this.form);

    // Return if the form is invalid
    if (this.form.invalid) {
      return;
    }

    // Check logical validations
    if (!this._isPaymentTypesValueEqualByTotal()) {
      this.alert.set({
        show: true,
        message: this._translocoService.translate('sales.errors.paymentTypesValueMustEqualByTotal'),
      });
      return;
    }

    // Disable the form
    this.form.disable();

    // Reset the alert
    this.alert.set({ show: false, message: '' });

    const model: ICreateSaleInvoice = {
      id: this.form.controls.id.value ?? 0,
      // An empty field clears the customer; typed text never gets here (customerPickedValidator)
      customerId: this.form.controls.customer.value?.id ?? null,
      saleDate: this.form.controls.saleDate.value?.toISOString() ?? new Date().toISOString(),
      paymentTypes: this.form.controls.paymentTypes.controls.map((x) => ({
        paymentTypeId: x.controls.paymentType.value?.id ?? 0,
        value: x.controls.value.value ?? 0,
      })),
      saleItems: this.form.controls.saleItems.controls.map((x) => ({
        productId: x.controls.product.value?.id ?? 0,
        quantity: x.controls.quantity.value ?? 0,
        total: x.controls.total.value ?? 0,
        unitPrice: x.controls.unitPrice.value ?? undefined,
        note: x.controls.note.value?.trim() || undefined,
      })),
      discount: this.form.controls.discount.value ?? 0,
      total: this.form.controls.total.value ?? 0,
      note: this.form.controls.note.value ?? '',
    };

    const isEdit = this.data.action() === 'edit';
    const saveRequest = isEdit
      ? this._salesService.updateSaleInvoice(model)
      : this._salesService.createSaleInvoice(model);
    // Only a new sale goes to the card reader on save; an edit never does (see sendToCardReader)
    const result =
      !isEdit && this._shouldTestMellatPosConnection()
        ? this._salesService.testDevelopmentMellatPosConnection(model.total).pipe(switchMap(() => saveRequest))
        : saveRequest;

    result
      .pipe(
        tap((response) => this.dialogRef.close(response)),
        catchError((response: MskHttpErrorResponse) => {
          // Re-enable the form
          this.form.enable();
          // Set the alert
          this.alert.set({ show: true, message: response.error?.message || response.message });
          // Set validation error message
          if (response.error?.errors) {
            MskSetServerErrorsFormFields(response.error.errors, this.form);
          }
          if (response.error?.code === 'SALE_DISCOUNT_EXCEEDS_SUBTOTAL') {
            this.form.controls.discount.setErrors({ discountExceedsSubtotal: true });
            this.form.controls.discount.markAsTouched();
          }
          // Return
          return EMPTY;
        }),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Computed total, as the server checks it: sum of saleItems.total - discount + tax + delivery fee
   */
  private _computedTotal(): number {
    if (!this.form) return 0;

    const discount = this.form.controls.discount.value || 0;

    return Math.max(0, this.itemsSubtotal() - discount) + this.tax() + this.deliveryFee();
  }

  /**
   * Check paymentTypesValue is equal by total value in form
   */
  private _isPaymentTypesValueEqualByTotal(): boolean {
    if (!this.form) return false;

    return this.paymentsDifference() === 0;
  }

  /**
   * Sum of all payment rows
   */
  private _paymentsTotal(): number {
    return this.paymentTypes.controls.reduce((sum, item) => sum + (Number(item.controls.value.value) || 0), 0);
  }

  /**
   * Check whether any selected payment type should trigger the local Mellat POS bridge.
   */
  private _shouldTestMellatPosConnection(): boolean {
    return this.paymentTypes.controls.some((paymentType) => this._isMellatPaymentRow(paymentType));
  }

  /**
   * Whether a payment row is paid with the Mellat card reader
   * @param row payment row
   */
  private _isMellatPaymentRow(row: FormGroup<IPaymentTypeForm>): boolean {
    return row.controls.paymentType.value?.name === MELLAT_POS_PAYMENT_TYPE_NAME;
  }
}
