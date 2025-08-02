import { AsyncPipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, inject, signal } from '@angular/core';
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
import { MskDataSource, MskDialogData, MskHttpErrorResponse } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskMaskDirective } from '@msk/shared/directives/mask';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { PaymentType } from '@msk/mirza/shell/core/payment-type';
import { Vendor, VendorsService } from '@msk/mirza/panel/vendors';

import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { mskAnimations } from '@msk/shared/animations';
import { catchError, EMPTY, map, Observable, of, tap } from 'rxjs';
import { PurchasesService } from '../../purchases.service';
import { ICreatePurchaseInvoice, PurchaseInvoice } from '../../purchases.types';
import { Product, ProductsService } from '@msk/mirza/panel/products';

@Component({
  selector: 'mz-purchases-details',
  templateUrl: './details.component.html',
  animations: mskAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DecimalPipe,
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
    MskAlertComponent,
    MskDialogComponent,
    MskMaskDirective,
    MskSpinnerDirective,
    MskCurrencySymbolDirective,
  ],
})
export class PurchasesCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<PurchaseInvoice | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<PurchasesCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _vendorsService = inject(VendorsService);
  private _productsService = inject(ProductsService);
  private _purchasesService = inject(PurchasesService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);

  form!: FormGroup;
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
  get purchaseItems(): FormArray {
    return this.form.get('purchaseItems') as FormArray;
  }

  /**
   * Get the payment types form array
   */
  get paymentTypes(): FormArray {
    return this.form.get('paymentTypes') as FormArray;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.form = this._formBuilder.group({
      id: [0, Validators.required],
      vendor: [null, Validators.required],
      date: [new Date(new Date().setHours(0, 0, 0, 0)), Validators.required],
      purchaseItems: this._formBuilder.array([], Validators.required),
      paymentTypes: this._formBuilder.array([], Validators.required),
      discount: ['', [Validators.required, Validators.min(0)]],
      total: ['', [Validators.required, Validators.min(0)]],
      note: '',
    });
    // Handling errors
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);
    // Patch value form
    this.form.patchValue(this.data.item() || {});
    // Set vendor collection
    this.vendorDS = new MskDataSource<Vendor>(
      (page, pageSize, search) => this._vendorsService.getLookupVendors(page, pageSize, search),
      this.form.get('vendor')?.valueChanges
    );
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
    const group = this._formBuilder.group({
      productId: [0, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [0, [Validators.required, Validators.min(0)]],
    });
    this.purchaseItems.push(group);

    // Create a new DataSource for this row
    this.productDSList.push(
      new MskDataSource<Product>(
        (page, pageSize, search) => this._productsService.getLookupProducts(page, pageSize, search),
        group.get('productId')?.valueChanges
      )
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
    const group = this._formBuilder.group({
      type: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
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
        name: this.data.item()?.number,
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
          })
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

    // Disable the form
    this.form.disable();

    // Reset the alert
    this.alert.set({ show: false, message: '' });

    const model: ICreatePurchaseInvoice = {
      id: this.form.get('id')?.value,
      vendorId: this.form.get('vendor')?.value?.id,
      date: this.form.get('date')?.value,
      paymentTypes: this.form.get('paymentTypes')?.value,
      purchaseItems: this.form.get('purchaseItems')?.value,
      discount: this.form.get('discount')?.value,
      total: this.form.get('total')?.value,
      note: this.form.get('note')?.value,
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
        })
      )
      .subscribe();
  }
}
