import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MskDialogData, MskHttpErrorResponse, MskLookupResponse } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskMaskDirective } from '@msk/shared/directives/mask';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskSelectSearchDirective } from '@msk/shared/directives/select-search';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { MskDatepickerTouchUiDirective } from '@msk/shared/directives/datepicker-touch-ui';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { MskNumToWordsPipe } from '@msk/shared/pipes/num-to-words';
import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { AccountService } from '@msk/sahebzaman/panel/accounts';
import { LoanService } from '../../loans.service';
import { Loan, IUpdateLoan } from '../../loans.types';
import { catchError, EMPTY, Observable, tap } from 'rxjs';

@Component({
  selector: 'sz-people-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    TranslocoPipe,
    TranslocoDirective,
    MskAlertComponent,
    MskDialogComponent,
    MskMaskDirective,
    MskSpinnerDirective,
    MskSelectSearchDirective,
    MskCurrencySymbolDirective,
    MskDatepickerTouchUiDirective,
    MskCurrencyPipe,
    MskDateTimePipe,
    MskNumToWordsPipe,
  ],
})
export class LoansCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<Loan | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<LoansCardDetailsComponent>);
  private _matDialog = inject(MatDialog);
  private _formBuilder = inject(FormBuilder);
  private _accountService = inject(AccountService);
  private _loanService = inject(LoanService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);

  form!: FormGroup;
  formErrors: FormError = {};
  accountList$: Observable<MskLookupResponse> = this._accountService.getLookupAccounts();
  loanTypeList$: Observable<MskLookupResponse> = this._loanService.getLookupLoanTypes();

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
      accountId: ['', Validators.required],
      loanTypeId: ['', Validators.required],
      createDate: [new Date(new Date().setHours(0, 0, 0, 0)), Validators.required],
      amount: ['', [Validators.required, Validators.min(1000)]],
      installmentCount: ['', [Validators.required, Validators.min(1)]],
      installmentInterval: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
      interestRates: [0, [Validators.required, Validators.min(0)]],
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
        ? this._loanService.updateLoan({
            id: this.form.value.id,
            accountId: this.form.value.accountId,
            note: this.form.value.note,
          } as IUpdateLoan)
        : this._loanService.createLoan(this.form.value);

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
