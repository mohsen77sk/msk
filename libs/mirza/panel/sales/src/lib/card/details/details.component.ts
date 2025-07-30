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
import { MskDialogData, MskHttpErrorResponse, MskLookupItem } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskMaskDirective } from '@msk/shared/directives/mask';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { PaymentType } from '@msk/mirza/shell/core/payment-type';
import { Customer, CustomerDataSource, CustomersService } from '@msk/mirza/panel/customers';
import { ProductsService } from '@msk/mirza/panel/products';

import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { mskAnimations } from '@msk/shared/animations';
import { catchError, EMPTY, map, Observable, of, tap } from 'rxjs';
import { SalesService } from '../../sales.service';
import { ICreateSaleInvoice, SaleInvoice } from '../../sales.types';

@Component({
  selector: 'mz-sales-details',
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
    MatDialogModule,
    MatSelectModule,
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
export class SalesCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<SaleInvoice | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<SalesCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _salesService = inject(SalesService);
  private _productsService = inject(ProductsService);
  private _customersService = inject(CustomersService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);

  form!: FormGroup;
  formErrors: FormError = {};
  paymentTypeList: PaymentType[] = Object.values(PaymentType);
  productList$: Observable<MskLookupItem[]> = of([]);
  customerDS!: CustomerDataSource;

  alert = signal({
    show: false,
    message: '',
  });

  /**
   * Get the sale items form array
   */
  get saleItems(): FormArray {
    return this.form.get('saleItems') as FormArray;
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
      customer: [null, Validators.required],
      saleDate: [new Date(new Date().setHours(0, 0, 0, 0)), Validators.required],
      saleItems: this._formBuilder.array([], Validators.required),
      paymentTypes: this._formBuilder.array([], Validators.required),
      discount: ['', [Validators.required, Validators.min(0)]],
      total: ['', [Validators.required, Validators.min(0)]],
      note: '',
    });
    this.addPaymentType();
    this.addSaleItem();
    // Handling errors
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);
    // Patch value form
    this.form.patchValue(this.data.item() || {});
    // Set customer collection
    this.customerDS = new CustomerDataSource(this._customersService, this.form.get('customer')?.valueChanges);
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
   * Add a sale item row in form
   */
  addSaleItem(): void {
    const group = this._formBuilder.group({
      productId: [0, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [0, [Validators.required, Validators.min(0)]],
    });
    this.saleItems.push(group);
  }

  /**
   * Remove a sale item row in form
   * @param index index of the sale item to remove
   */
  removeSaleItem(index: number): void {
    this.saleItems.removeAt(index);
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
   * delete the sale invoice
   */
  deleteInvoice(): void {
    // Open the confirmation dialog
    const confirmation = this._mskConfirmationService.open({
      title: this._translocoService.translate('sales.delete'),
      message: this._translocoService.translate('sales.delete-message', {
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

      this._salesService
        .deleteSaleInvoice(this.data.item() as SaleInvoice)
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

    const model: ICreateSaleInvoice = {
      id: this.form.get('id')?.value,
      customerId: this.form.get('customer')?.value?.id,
      saleDate: this.form.get('saleDate')?.value,
      paymentTypes: this.form.get('paymentTypes')?.value,
      saleItems: this.form.get('saleItems')?.value,
      discount: this.form.get('discount')?.value,
      total: this.form.get('total')?.value,
      note: this.form.get('note')?.value,
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
        })
      )
      .subscribe();
  }
}
