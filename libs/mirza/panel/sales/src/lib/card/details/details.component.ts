import { AsyncPipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { mskAnimations } from '@msk/shared/animations';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';
import { SalesService } from '../../sales.service';
import { SaleInvoice } from '../../sales.types';
import { CustomersService } from '@msk/mirza/panel/customers';

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
export class SalesCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<SaleInvoice | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<SalesCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _salesService = inject(SalesService);
  private _customersService = inject(CustomersService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);

  form!: FormGroup;
  formErrors: FormError = {};
  customerList$: Observable<MskLookupItem[]> = this._customersService.getLookupCustomers();

  alert = signal({
    show: false,
    message: '',
  });

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
      customerId: [0, Validators.required],
      saleDate: [new Date(new Date().setHours(0, 0, 0, 0)), Validators.required],
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

    const result =
      this.data.action() === 'edit'
        ? this._salesService.updateSaleInvoice(this.form.value)
        : this._salesService.createSaleInvoice(this.form.value);

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
