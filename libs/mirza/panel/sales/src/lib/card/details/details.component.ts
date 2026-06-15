import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChildren,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { MskDatepickerTouchUiDirective } from '@msk/shared/directives/datepicker-touch-ui';
import { LockupPaymentTypeSortData, PaymentType, PaymentTypesService } from '@msk/mirza/panel/payment-types';
import { Customer, CustomersService, DefaultCustomersSortData } from '@msk/mirza/panel/customers';
import { DefaultProductsSortData, Product, ProductsService } from '@msk/mirza/panel/products';

import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { catchError, combineLatest, distinctUntilChanged, EMPTY, map, startWith, tap } from 'rxjs';
import { SalesService } from '../../sales.service';
import { ICreateSaleInvoice, IPaymentTypeForm, ISaleItemForm, ISalesForm, SaleInvoice } from '../../sales.types';

@Component({
  selector: 'mz-sales-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MskCurrencySymbolDirective,
    MskDatepickerTouchUiDirective,
  ],
})
export class SalesCardDetailsComponent implements OnInit, AfterViewInit {
  readonly data = inject<MskDialogData<SaleInvoice | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<SalesCardDetailsComponent>);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _destroyRef = inject(DestroyRef);
  private _formBuilder = inject(FormBuilder);
  private _salesService = inject(SalesService);
  private _productsService = inject(ProductsService);
  private _customersService = inject(CustomersService);
  private _paymentTypeService = inject(PaymentTypesService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);

  @ViewChildren('productInput')
  private _productInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('quantityInput')
  private _quantityInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('paymentValueInput')
  private _paymentValueInputs!: QueryList<ElementRef<HTMLInputElement>>;

  form!: FormGroup<ISalesForm>;
  formErrors: FormError = {};
  paymentTypeDSList: MskDataSource<PaymentType>[] = [];
  productDSList: MskDataSource<Product>[] = [];
  customerDS!: MskDataSource<Customer>;
  private _defaultPaymentTypeApplied = false;

  alert = signal({
    show: false,
    message: '',
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
      customer: this._formBuilder.control(null),
      saleDate: this._formBuilder.control(new Date(new Date().setHours(0, 0, 0, 0)), Validators.required),
      saleItems: this._formBuilder.array<FormGroup>([], Validators.required),
      paymentTypes: this._formBuilder.array<FormGroup>([], Validators.required),
      discount: this._formBuilder.control(0, [Validators.required, Validators.min(0)]),
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

  ngAfterViewInit(): void {
    if (this.data.action() === 'new') {
      requestAnimationFrame(() => this.focusProductSearch());
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Go to edit mode
   */
  editMode(): void {
    this.data.action.set('edit');
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
   * Focus a product search input by row index
   */
  focusProductSearch(index = 0): void {
    this._focusInput(this._productInputs, index);
  }

  /**
   * Focus a product search input by row index
   */
  focusProductRow(index: number): void {
    this.focusProductSearch(index);
  }

  /**
   * Focus the last product search input
   */
  focusLastProductRow(): void {
    this.focusProductRow(this.saleItems.length - 1);
  }

  /**
   * Focus a quantity input by row index
   */
  focusQuantity(index: number): void {
    queueMicrotask(() => this._focusInput(this._quantityInputs, index, true));
  }

  /**
   * Focus a payment amount input by row index
   */
  focusPayment(index = 0): void {
    this._focusInput(this._paymentValueInputs, index, true);
  }

  /**
   * Fold duplicate product selections into the existing sale item row
   */
  handleProductSelected(index: number, selectedProduct: Product | undefined): void {
    if (!selectedProduct) {
      return;
    }

    const existingIndex = this.saleItems.controls.findIndex((item, itemIndex) => {
      return itemIndex !== index && item.controls.product.value?.id === selectedProduct.id;
    });

    if (existingIndex === -1) {
      this.focusQuantity(index);
      return;
    }

    const existingItem = this.saleItems.at(existingIndex);
    const existingQuantity = Number(existingItem.controls.quantity.value ?? 0) || 0;

    existingItem.controls.quantity.setValue(Math.max(1, existingQuantity + 1));

    if (this.saleItems.length > 1) {
      this.removeSaleItem(index);
      this._changeDetectorRef.detectChanges();
    }

    const focusedIndex = existingIndex > index ? existingIndex - 1 : existingIndex;
    this.focusQuantity(focusedIndex);
  }

  /**
   * Add a sale item row in form
   */
  addSaleItem(): void {
    const group = this._formBuilder.group<ISaleItemForm>({
      product: this._formBuilder.control<Product | null>(null, Validators.required),
      quantity: this._formBuilder.control(1, [Validators.required, Validators.min(1)]),
      total: this._formBuilder.control(0, [Validators.required, Validators.min(0)]),
    });
    this.saleItems.push(group);

    combineLatest([
      group.controls.product.valueChanges.pipe(startWith(group.controls.product.value)),
      group.controls.quantity.valueChanges.pipe(startWith(group.controls.quantity.value)),
    ])
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map(([product, quantity]) => {
          group.controls.total.setValue((product?.sellPrice ?? 0) * (quantity ?? 0));
        }),
      )
      .subscribe();

    group.controls.product.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        distinctUntilChanged(),
        tap(() => group.controls.quantity.setValue(1)),
      )
      .subscribe();

    // Create a new DataSource for this row
    this.productDSList.push(
      new MskDataSource<Product>(
        (params) => this._productsService.getProducts(params),
        new MskSort(DefaultProductsSortData),
        group.controls.product.valueChanges,
      ),
    );
  }

  /**
   * Add a sale item row and focus its product search input
   */
  addProductRowAndFocus(): void {
    if (this.form.disabled) {
      return;
    }

    this.addSaleItem();
    this._changeDetectorRef.detectChanges();
    requestAnimationFrame(() => this.focusLastProductRow());
  }

  /**
   * Remove a sale item row in form
   * @param index index of the sale item to remove
   */
  removeSaleItem(index: number): void {
    this.saleItems.removeAt(index);
    this.productDSList.splice(index, 1);
  }

  /**
   * Add a payment type row in form
   */
  addPaymentType(): void {
    const group = this._formBuilder.group<IPaymentTypeForm>({
      paymentType: this._formBuilder.control<PaymentType | null>(null, Validators.required),
      value: this._formBuilder.control(0, [Validators.required, Validators.min(0)]),
    });
    this.paymentTypes.push(group);

    const paymentTypeIndex = this.paymentTypes.length - 1;

    // Create a new DataSource for this row
    this.paymentTypeDSList.push(
      new MskDataSource<PaymentType>(
        (params) =>
          this._paymentTypeService
            .getPaymentTypes(params)
            .pipe(tap((pageData) => this._applyDefaultPaymentType(paymentTypeIndex, pageData.items[0]))),
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
    this.paymentTypes.removeAt(index);
  }

  /**
   * Handle keyboard shortcuts scoped to the sale form
   */
  handleSaleFormKeydown(event: KeyboardEvent): void {
    if (this.form.disabled) {
      return;
    }

    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.saveAndClose();
      return;
    }

    if (event.altKey && event.key.toLowerCase() === 'p') {
      event.preventDefault();
      event.stopPropagation();
      this.focusProductSearch();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      event.stopPropagation();
      this.focusProductSearch();
      return;
    }

    if (event.altKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      event.stopPropagation();
      this.addProductRowAndFocus();
      return;
    }

    if (event.altKey && event.key.toLowerCase() === 'm') {
      event.preventDefault();
      event.stopPropagation();
      this.focusPayment();
    }
  }

  /**
   * Handle quantity keyboard flow inside a sale item row
   */
  handleQuantityKeydown(event: KeyboardEvent, index: number): void {
    const quantityControl = this.saleItems.at(index).controls.quantity;
    const currentQuantity = Number(quantityControl.value ?? 1) || 1;

    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this._focusNextProductRow(index);
      return;
    }

    if (event.key === '+') {
      event.preventDefault();
      quantityControl.setValue(currentQuantity + 1);
      return;
    }

    if (event.key === '-') {
      event.preventDefault();
      quantityControl.setValue(Math.max(1, currentQuantity - 1));
    }
  }

  /**
   * Remove a row from keyboard only when the user is not typing in a field
   */
  handleSaleItemRowKeydown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'Delete' || this.saleItems.length <= 1 || this._isTypingTarget(event.target)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.removeSaleItem(index);
    this._changeDetectorRef.detectChanges();
    this.focusProductSearch(Math.min(index, this.saleItems.length - 1));
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
      })),
      discount: this.form.controls.discount.value ?? 0,
      total: this.form.controls.total.value ?? 0,
      note: this.form.controls.note.value ?? '',
    };

    const result =
      this.data.action() === 'edit'
        ? this._salesService.updateSaleInvoice(model)
        : this._salesService.createSaleInvoice(model);

    result
      .pipe(
        tap((response) => this.dialogRef.close(response)),
        catchError((response: MskHttpErrorResponse) => {
          // Re-enable the form
          this.form.enable();
          // Set the alert
          this.alert.set({ show: true, message: response.error.message });
          // Set validation error message
          if (response.error.errors) {
            MskSetServerErrorsFormFields(response.error.errors, this.form);
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
   * Computed total calculation: sum of all saleItems.total - discount
   */
  _computedTotal(): number {
    if (!this.form) return 0;

    const saleItemsTotal = this.saleItems.controls.reduce((sum, item) => {
      return sum + (item.controls.total.value || 0);
    }, 0);

    const discount = this.form.controls.discount.value || 0;

    return Math.max(0, saleItemsTotal - discount);
  }

  /**
   * Check paymentTypesValue is equal by total value in form
   */
  _isPaymentTypesValueEqualByTotal(): boolean {
    if (!this.form) return false;

    const paymentTypesTotal = this.paymentTypes.controls.reduce((sum, item) => {
      return sum + (item.controls.value.value || 0);
    }, 0);

    const total = this.form.controls.total.value || 0;

    return paymentTypesTotal === total;
  }

  private _focusNextProductRow(index: number): void {
    const nextEmptyProductIndex = this.saleItems.controls.findIndex((item, itemIndex) => {
      return itemIndex > index && !item.controls.product.value;
    });

    if (nextEmptyProductIndex !== -1) {
      this.focusProductRow(nextEmptyProductIndex);
      return;
    }

    this.addProductRowAndFocus();
  }

  private _focusInput(inputs: QueryList<ElementRef<HTMLInputElement>>, index: number, select = false): void {
    const input = inputs.get(index)?.nativeElement;

    if (!input) {
      return;
    }

    input.focus();

    if (select) {
      input.select();
    }
  }

  private _isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
  }

  private _applyDefaultPaymentType(index: number, paymentType: PaymentType | undefined): void {
    if (
      this._defaultPaymentTypeApplied ||
      this.data.action() !== 'new' ||
      index !== 0 ||
      !paymentType ||
      this.paymentTypes.length !== 1
    ) {
      return;
    }

    const paymentTypeForm = this.paymentTypes.at(0);

    if (paymentTypeForm.controls.paymentType.value || paymentTypeForm.controls.value.dirty) {
      return;
    }

    paymentTypeForm.controls.paymentType.setValue(paymentType, { emitEvent: false });
    paymentTypeForm.controls.value.setValue(this.form.controls.total.value ?? 0, { emitEvent: false });
    paymentTypeForm.controls.paymentType.markAsPristine();
    paymentTypeForm.controls.value.markAsPristine();
    this._defaultPaymentTypeApplied = true;
    this._changeDetectorRef.markForCheck();
  }
}
