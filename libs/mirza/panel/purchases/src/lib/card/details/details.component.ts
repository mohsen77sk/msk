import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
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
import { PaymentType } from '@msk/mirza/shell/core/payment-type';
import { DefaultVendorsSortData, Vendor, VendorsService } from '@msk/mirza/panel/vendors';

import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { mskAnimations } from '@msk/shared/animations';
import { catchError, combineLatest, distinctUntilChanged, EMPTY, map, startWith, tap } from 'rxjs';
import { PurchasesService } from '../../purchases.service';
import {
  ICreatePurchaseInvoice,
  IPaymentTypeForm,
  IPurchaseForm,
  IPurchaseItemForm,
  PurchaseInvoice,
} from '../../purchases.types';
import { DefaultProductsSortData, Product, ProductsService } from '@msk/mirza/panel/products';

@Component({
  selector: 'mz-purchases-details',
  templateUrl: './details.component.html',
  animations: mskAnimations,
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
    MatSelectModule,
    MatDialogModule,
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
export class PurchasesCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<PurchaseInvoice | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<PurchasesCardDetailsComponent>);
  private _destroyRef = inject(DestroyRef);
  private _formBuilder = inject(FormBuilder);
  private _vendorsService = inject(VendorsService);
  private _productsService = inject(ProductsService);
  private _purchasesService = inject(PurchasesService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);

  form!: FormGroup<IPurchaseForm>;
  formErrors: FormError = {};
  paymentTypeList: PaymentType[] = Object.values(PaymentType);
  productDSList: MskDataSource<Product>[] = [];
  vendorDS!: MskDataSource<Vendor>;

  alert = signal({
    show: false,
    message: '',
  });

  /**
   * Get the purchase items form array
   */
  get purchaseItems(): FormArray<FormGroup<IPurchaseItemForm>> {
    return this.form.controls.purchaseItems;
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
    this.form = this._formBuilder.group<IPurchaseForm>({
      id: this._formBuilder.control(0, Validators.required),
      vendor: this._formBuilder.control(null),
      date: this._formBuilder.control(new Date(new Date().setHours(0, 0, 0, 0)), Validators.required),
      purchaseItems: this._formBuilder.array<FormGroup>([], Validators.required),
      paymentTypes: this._formBuilder.array<FormGroup>([], Validators.required),
      discount: this._formBuilder.control(0, [Validators.required, Validators.min(0)]),
      total: this._formBuilder.control(0, [Validators.required, Validators.min(0)]),
      note: this._formBuilder.control(''),
    });
    this.addPaymentType();
    this.addPurchaseItem();
    // Handling errors
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);
    // Patch value form
    if (this.data.item()) {
      this.data.item()?.paymentTypes.forEach((v, i) => i !== 0 && this.addPaymentType());
      this.data.item()?.purchaseItems.forEach((v, i) => i !== 0 && this.addPurchaseItem());
      this.form.patchValue(this.data.item() || {});
    }
    // Set vendor collection
    this.vendorDS = new MskDataSource<Vendor>(
      (params) => this._vendorsService.getVendors(params),
      new MskSort(DefaultVendorsSortData),
      this.form.controls.vendor.valueChanges,
    );

    // Subscribe to form changes to update total dynamically
    combineLatest([
      this.form.controls.purchaseItems.valueChanges.pipe(startWith(this.form.controls.purchaseItems.value)),
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
   * @param value vendor
   */
  vendorDisplayFn(value: Vendor): string {
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
   * Add a purchase item row in form
   */
  addPurchaseItem(): void {
    const group = this._formBuilder.group<IPurchaseItemForm>({
      product: this._formBuilder.control<Product | null>(null, Validators.required),
      quantity: this._formBuilder.control(1, [Validators.required, Validators.min(1)]),
      total: this._formBuilder.control(0, [Validators.required, Validators.min(0)]),
    });
    this.purchaseItems.push(group);

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
   * Remove a purchase item row in form
   * @param index index of the purchase item to remove
   */
  removePurchaseItem(index: number): void {
    this.purchaseItems.removeAt(index);
    this.productDSList.splice(index, 1);
  }

  /**
   * Add a payment type row in form
   */
  addPaymentType(): void {
    const group = this._formBuilder.group<IPaymentTypeForm>({
      paymentType: this._formBuilder.control(PaymentType.POSE, Validators.required),
      value: this._formBuilder.control(0, [Validators.required, Validators.min(0)]),
    });
    this.paymentTypes.push(group);
  }

  /**
   * Remove a payment type row in form
   * @param index index of the payment type to remove
   */
  removePaymentType(index: number): void {
    this.paymentTypes.removeAt(index);
  }

  /**
   * delete the purchase invoice
   */
  deleteInvoice(): void {
    // Open the confirmation dialog
    const confirmation = this._mskConfirmationService.open({
      title: this._translocoService.translate('purchases.delete'),
      message: this._translocoService.translate('purchases.delete-message', {
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

      this._purchasesService
        .deletePurchaseInvoice(this.data.item() as PurchaseInvoice)
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

    const model: ICreatePurchaseInvoice = {
      id: this.form.controls.id.value ?? 0,
      vendorId: this.form.controls.vendor.value?.id ?? null,
      date: this.form.controls.date.value?.toISOString() ?? new Date().toISOString(),
      paymentTypes: this.form.controls.paymentTypes.controls.map((x) => ({
        paymentType: x.controls.paymentType.value as PaymentType,
        value: x.controls.value.value ?? 0,
      })),
      purchaseItems: this.form.controls.purchaseItems.controls.map((x) => ({
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
        ? this._purchasesService.updatePurchaseInvoice(model)
        : this._purchasesService.createPurchaseInvoice(model);

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
   * Computed total calculation: sum of all purchaseItems.total - discount
   */
  _computedTotal(): number {
    if (!this.form) return 0;

    const purchaseItemsTotal = this.purchaseItems.controls.reduce((sum, item) => {
      return sum + (item.controls.total.value || 0);
    }, 0);

    const discount = this.form.controls.discount.value || 0;

    return Math.max(0, purchaseItemsTotal - discount);
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
}
