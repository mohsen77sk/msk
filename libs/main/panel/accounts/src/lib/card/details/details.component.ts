import { NgTemplateOutlet, CurrencyPipe } from '@angular/common';
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
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskDialogData, MskHttpErrorResponse } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
} from '@msk/shared/utils/error-handler';
import { mskAnimations } from '@msk/shared/animations';
import { Account } from '../../accounts.types';
import { AccountService } from '../../accounts.service';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'main-people-details',
  templateUrl: './details.component.html',
  animations: mskAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
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
    TranslocoDirective,
    MskAlertComponent,
    MskAvatarComponent,
    MskDialogComponent,
    MskSpinnerDirective,
    MskDateTimePipe,
  ],
})
export class AccountsCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<Account | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<AccountsCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _accountService = inject(AccountService);
  private _translocoService = inject(TranslocoService);

  form!: FormGroup;
  formErrors: any = {};

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
      personId: [[0], Validators.required],
      accountTypeId: ['', Validators.required],
      initCredit: [0, [Validators.required, Validators.min(1000)]],
      createDate: [new Date(), Validators.required],
      note: '',
    });
    // Handling errors
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);
    // Patch value form
    this.form.patchValue(this.data.item || {});
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

    const result =
      this.data.action === 'edit'
        ? this._accountService.updateAccount(this.form.value)
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
