import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskMaskDirective } from '@msk/shared/directives/mask';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskSelectSearchDirective } from '@msk/shared/directives/select-search';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { MskDatepickerTouchUiDirective } from '@msk/shared/directives/datepicker-touch-ui';
import {
  FormError,
  MskHandleFormErrors,
  MskSetServerErrorsFormFields,
  MskValidateFormFields,
} from '@msk/shared/utils/error-handler';
import { MskDialogData, MskHttpErrorResponse, MskLookupResponse } from '@msk/shared/data-access';
import { AccountService } from '../../accounts.service';
import { AccountTransactionTypeEnum, ICreateAccountTransaction } from '../../accounts.types';
import { catchError, EMPTY, Observable, tap } from 'rxjs';

@Component({
  selector: 'sz-accounts-transaction',
  templateUrl: './create-transaction.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
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
    MskDatepickerTouchUiDirective,
  ],
})
export class AccountsCreateTransactionComponent implements OnInit {
  readonly data = inject<MskDialogData<ICreateAccountTransaction>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<AccountsCreateTransactionComponent>);
  private _formBuilder = inject(FormBuilder);
  private _accountService = inject(AccountService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);

  form!: FormGroup;
  formErrors: FormError = {};
  accountList$: Observable<MskLookupResponse> = this._accountService.getLookupAccounts();
  AccountTransactionTypeEnum = AccountTransactionTypeEnum;

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
      sourceAccountId: [0, Validators.required],
      destinationAccountId: [0, Validators.required],
      transactionType: [0, Validators.required],
      amount: ['', [Validators.required, Validators.min(1000)]],
      date: [new Date(new Date().setHours(0, 0, 0, 0)), Validators.required],
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

    this._accountService
      .createAccountTransaction(this.form.value)
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
