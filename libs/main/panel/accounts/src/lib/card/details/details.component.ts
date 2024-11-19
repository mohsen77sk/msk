import { NgTemplateOutlet, CurrencyPipe, AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  inject,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
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
import { MskDialogData, MskHttpErrorResponse, MskLookupItem, MskLookupResponse } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskSelectSearchDirective } from '@msk/shared/directives/select-search';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
} from '@msk/shared/utils/error-handler';
import { mskAnimations } from '@msk/shared/animations';
import { PeopleService } from '@msk/main/panel/people';
import { Account, ICloseAccount, IUpdateAccount } from '../../accounts.types';
import { AccountService } from '../../accounts.service';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'main-people-details',
  templateUrl: './details.component.html',
  animations: mskAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    AsyncPipe,
    CurrencyPipe,
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
    MskAvatarComponent,
    MskDialogComponent,
    MskSpinnerDirective,
    MskSelectSearchDirective,
    MskDateTimePipe,
  ],
})
export class AccountsCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<Account | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<AccountsCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _peopleService = inject(PeopleService);
  private _accountService = inject(AccountService);
  private _translocoService = inject(TranslocoService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _mskConfirmationService = inject(MskConfirmationService);

  form!: FormGroup;
  formErrors: any = {};
  personList$: Observable<MskLookupResponse> = this._peopleService.getLookupPersons();
  accountTypeList$: Observable<MskLookupResponse> = this._accountService.getLookupAccountTypes();

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
    this.form.patchValue(this.data.item || {});
    this.form.get('personId')?.patchValue(this.data.item?.persons.map((x) => x.id) || []);
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
    this.data.action = 'edit';
    this.form.get('initCredit')?.clearValidators();
  }

  /**
   * Update the status
   */
  updateStatus(): void {
    const isActive = this.data.item?.isActive;
    // Open the confirmation dialog
    const confirmation = this._mskConfirmationService.open({
      title: this._translocoService.translate(isActive ? 'accounts.deactivate' : 'accounts.activate'),
      message: this._translocoService.translate(
        isActive ? 'accounts.deactivate-message' : 'accounts.activate-message',
        {
          name: this.data.item?.fullName,
        }
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
        id: this.data.item?.id,
        closeDate: new Date(new Date().setSeconds(0, 0)),
      } as ICloseAccount;

      this._accountService
        .closeAccount(model)
        .pipe(
          map((response) => {
            // Update the account
            this.data.item = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
          }),
          catchError((response) => {
            // Show error
            // ---
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
      this.data.action === 'edit'
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
          MskSetServerErrorsFormFields(response.error.errors, this.form);
          // Return
          return EMPTY;
        })
      )
      .subscribe();
  }
}
