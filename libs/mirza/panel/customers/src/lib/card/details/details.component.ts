import { NgTemplateOutlet, DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskDataSource, MskDialogData, MskHttpErrorResponse, MskSort } from '@msk/shared/data-access';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { Customer, CustomerSummary, GenderEnum, CustomerOrderRow } from '../../customers.types';
import { CustomersService } from '../../customers.service';
import { catchError, distinctUntilChanged, EMPTY, filter, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'mz-customers-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgTemplateOutlet,
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDialogModule,
    TranslocoDirective,
    MskCurrencyPipe,
    MskDateTimePipe,
    MskAlertComponent,
    MskAvatarComponent,
    MskDialogComponent,
    MskSpinnerDirective,
  ],
})
export class CustomersCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<{ customer: Customer; summery: CustomerSummary } | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CustomersCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _customerService = inject(CustomersService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);

  private _dialogContent = viewChild(MskDialogComponent);
  readonly isShowNameHeader = toSignal(
    toObservable(this._dialogContent).pipe(
      filter((dialogContent): dialogContent is MskDialogComponent => dialogContent !== undefined),
      switchMap((dialogContent) =>
        dialogContent
          .dialogContent()
          .elementScrolled()
          .pipe(
            map(({ target }) => (target as HTMLElement).scrollTop > 180),
            distinctUntilChanged(),
          ),
      ),
    ),
    { initialValue: false },
  );

  form!: FormGroup;
  formErrors: FormError = {};
  genderKeys = Object.keys(GenderEnum).filter((v) => isNaN(Number(v)));
  ordersDataSource: MskDataSource<CustomerOrderRow> = new MskDataSource<CustomerOrderRow>(
    (params) => this._customerService.getCustomerOrders(params),
    new MskSort({ active: 'saleDate', direction: 'desc' }),
    undefined,
    of({ customerId: this.data.item()?.customer?.id }),
  );

  alert = signal({
    show: false,
    message: '',
  });

  trackById = (i: number, item: CustomerOrderRow | undefined) => item?.id ?? i;

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
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      gender: ['', Validators.required],
      contactNumber: ['', Validators.pattern(/^(?:\+98|0)?9\d{9}$/)],
      address: '',
      note: '',
    });
    // Handling errors
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);
    // Patch value form
    this.form.patchValue(this.data.item()?.customer || {});
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
   * delete the customer
   */
  deleteCustomer(): void {
    // Open the confirmation dialog
    const confirmation = this._mskConfirmationService.open({
      title: this._translocoService.translate('customers.delete'),
      message: this._translocoService.translate('customers.delete-message', {
        name: this.data.item()?.customer?.name,
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

      this._customerService
        .deleteCustomer(this.data.item()?.customer as Customer)
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

    // Disable the form
    this.form.disable();

    // Reset the alert
    this.alert.set({ show: false, message: '' });

    const result =
      this.data.action() === 'edit'
        ? this._customerService.updateCustomer(this.form.value)
        : this._customerService.createCustomer(this.form.value);

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
}
