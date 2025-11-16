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
import { MskDialogData, MskHttpErrorResponse, MskLookupItem, MskLookupResponse } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskMaskDirective } from '@msk/shared/directives/mask';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskSelectSearchDirective } from '@msk/shared/directives/select-search';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { MskDatepickerTouchUiDirective } from '@msk/shared/directives/datepicker-touch-ui';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { mskAnimations } from '@msk/shared/animations';
import { PeopleService } from '@msk/sahebzaman/panel/people';
import { AccountService } from '../../accounts.service';
import {
  Account,
  AccountTransactionTypeEnum,
  ICloseAccount,
  ICreateAccountTransaction,
  IUpdateAccount,
} from '../../accounts.types';
import { AccountsCreateTransactionComponent } from '../../common/create-transaction/create-transaction.component';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'sz-people-details',
  templateUrl: './details.component.html',
  animations: mskAnimations,
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
    MskAvatarComponent,
    MskDialogComponent,
    MskMaskDirective,
    MskSpinnerDirective,
    MskSelectSearchDirective,
    MskCurrencySymbolDirective,
    MskDatepickerTouchUiDirective,
    MskCurrencyPipe,
    MskDateTimePipe,
  ],
})
export class AccountsCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<Account | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<AccountsCardDetailsComponent>);
  private _matDialog = inject(MatDialog);
  private _formBuilder = inject(FormBuilder);
  private _peopleService = inject(PeopleService);
  private _accountService = inject(AccountService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);

  form!: FormGroup;
  formErrors: FormError = {};
  personList$: Observable<MskLookupResponse> = this._peopleService.getLookupPersons();
  accountTypeList$: Observable<MskLookupResponse> = this._accountService.getLookupAccountTypes();
  AccountTransactionTypeEnum = AccountTransactionTypeEnum;
  isLoadingBalance = signal(false);

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
      personId: [[], Validators.required],
      accountTypeId: ['', Validators.required],
      initCredit: ['', [Validators.required, Validators.min(1000)]],
      createDate: [new Date(new Date().setHours(0, 0, 0, 0)), Validators.required],
      note: '',
    });
    // Handling errors
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);
    // Patch value form
    this.form.patchValue(this.data.item() || {});
    this.form.get('personId')?.patchValue(this.data.item()?.persons.map((x) => x.id) || []);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for selected persons
   */
  personIdTitles(personList: MskLookupItem[] | null): string {
    const ids: number[] = this.form.get('personId')?.value;
    const firesName = personList?.find((p) => p.id === ids[0])?.name;
    return firesName + (ids.length > 1 ? ` (+${ids.length - 1} ${this._translocoService.translate('other')})` : '');
  }

  /**
   * Go to edit mode
   */
  editMode(): void {
    this.data.action.set('edit');
    this.form.get('initCredit')?.clearValidators();
  }

  /**
   * Update the status
   */
  updateStatus(): void {
    const isActive = this.data.item()?.isActive;
    // Open the confirmation dialog
    const confirmation = this._mskConfirmationService.open({
      title: this._translocoService.translate(isActive ? 'accounts.deactivate' : 'accounts.activate'),
      message: this._translocoService.translate(
        isActive ? 'accounts.deactivate-message' : 'accounts.activate-message',
        {
          name: this.data.item()?.fullName,
        },
      ),
      actions: {
        confirm: { label: this._translocoService.translate(isActive ? 'close' : 'open') },
        cancel: { label: this._translocoService.translate('cancel') },
      },
    });
    // Subscribe to the confirmation dialog
    confirmation.afterClosed().subscribe((result) => {
      // If don't confirm, return
      if (result !== 'confirmed') return;

      // If confirm
      const model = {
        id: this.data.item()?.id,
        closeDate: new Date(new Date().setMinutes(new Date().getMinutes() - 1, 0, 0)),
      } as ICloseAccount;

      this._accountService
        .closeAccount(model)
        .pipe(
          map((response) => {
            // Update the account
            this.data.item.set(response);
          }),
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
   * Open the create transaction dialog
   *
   * @param transactionType
   */
  openCreateTransaction(transactionType: AccountTransactionTypeEnum): void {
    // Launch the modal
    this._matDialog
      .open(AccountsCreateTransactionComponent, {
        autoFocus: true,
        disableClose: true,
        data: {
          action: signal('new'),
          item: signal<ICreateAccountTransaction>({
            sourceAccountId: this.data.item()?.id ?? 0,
            transactionType: transactionType,
          }),
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result != 'cancelled') {
          // Set loading balance
          this.isLoadingBalance.set(true);
          // Get the balance
          this._accountService
            .getBalanceAccount(this.data.item()?.id ?? 0)
            .pipe(
              tap((response) => {
                // Update the balance value
                this.data.item.set({ ...this.data.item(), balance: response.balance } as Account);
                this.isLoadingBalance.set(false);
              }),
              catchError((response: MskHttpErrorResponse) => {
                // Show error
                this._mskSnackbarService.error(response.error.message);
                // Update the balance value
                this.data.item.set({ ...this.data.item(), balance: 0 } as Account);
                // Show balance
                this.isLoadingBalance.set(false);
                // Return
                return EMPTY;
              }),
            )
            .subscribe();
        }
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
        ? this._accountService.updateAccount({
            id: this.form.value.id,
            personId: this.form.value.personId,
            note: this.form.value.note,
          } as IUpdateAccount)
        : this._accountService.createAccount(this.form.value);

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
