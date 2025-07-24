import { AsyncPipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MskDialogData, MskHttpErrorResponse, MskLookupItem } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskMaskDirective } from '@msk/shared/directives/mask';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskSelectSearchDirective } from '@msk/shared/directives/select-search';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { PaymentType } from '@msk/mirza/shell/core/payment-type';
import { VendorsService } from '@msk/mirza/panel/vendors';

import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { mskAnimations } from '@msk/shared/animations';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';
import { PurchasesService } from '../../purchases.service';
import { PurchaseInvoice } from '../../purchases.types';

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
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDialogModule,
    TranslocoPipe,
    TranslocoDirective,
    MskAlertComponent,
    MskDialogComponent,
    MskMaskDirective,
    MskSpinnerDirective,
    MskSelectSearchDirective,
    MskCurrencySymbolDirective,
  ],
})
export class PurchasesCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<PurchaseInvoice | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<PurchasesCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _vendorsService = inject(VendorsService);
  private _purchasesService = inject(PurchasesService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);

  form!: FormGroup;
  formErrors: FormError = {};
  paymentTypeList: PaymentType[] = Object.values(PaymentType);
  productList$: Observable<MskLookupItem[]> = this._vendorsService.getLookupVendors();
  vendorList$: Observable<MskLookupItem[]> = this._vendorsService.getLookupVendors();

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
      vendorId: [0, Validators.required],
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
   * Add a purchase item row in form
   */
  addPurchaseItem(): void {
    const group = this._formBuilder.group({
      productId: [0, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [0, [Validators.required, Validators.min(0)]],
    });
    this.purchaseItems.push(group);
  }

  /**
   * Remove a purchase item row in form
   * @param index index of the purchase item to remove
   */
  removePurchaseItem(index: number): void {
    this.purchaseItems.removeAt(index);
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

    const result =
      this.data.action() === 'edit'
        ? this._purchasesService.updatePurchaseInvoice(this.form.value)
        : this._purchasesService.createPurchaseInvoice(this.form.value);

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
