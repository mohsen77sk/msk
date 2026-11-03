import { Component, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskHttpErrorResponse } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskHandleFormErrors, MskValidateFormFields, FormError } from '@msk/shared/utils/error-handler';
import { StoreAccessService } from '@msk/mirza/shell/core/store';
import { EMPTY, Observable, catchError, tap } from 'rxjs';
import { MembersService } from '../members.service';
import { StoreMember, StoreRole } from '../members.types';

export interface MemberDialogData {
  // No member = add one
  member?: StoreMember;
  roles: StoreRole[];
}

@Component({
  selector: 'mz-member-dialog',
  templateUrl: './member-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    TranslocoDirective,
    MskAlertComponent,
    MskDialogComponent,
    MskSpinnerDirective,
  ],
})
export class MemberDialogComponent implements OnInit {
  readonly data = inject<MemberDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<MemberDialogComponent>);
  private _formBuilder = inject(FormBuilder);
  private _translocoService = inject(TranslocoService);
  private _confirmationService = inject(MskConfirmationService);
  private _storeAccessService = inject(StoreAccessService);
  private _membersService = inject(MembersService);

  // Only an owner can give, change or take away the owner role (the API enforces it too)
  private _isOwner = computed(() => this._storeAccessService.access()?.role.key === 'owner');
  roles = computed(() => this.data.roles.filter((role) => this._isOwner() || !role.isOwner));
  readOnly = computed(() => !!this.data.member && this.data.member.role.key === 'owner' && !this._isOwner());

  form = this._formBuilder.nonNullable.group({
    phone: ['', [Validators.required, Validators.pattern(/^(\+989\d{9}|989\d{9}|09\d{9})$/)]],
    firstName: ['', Validators.maxLength(255)],
    lastName: ['', Validators.maxLength(255)],
    roleId: [0, Validators.min(1)],
  });
  formErrors: FormError = {};

  alert = signal({ show: false, message: '' });

  ngOnInit(): void {
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);

    const member = this.data.member;
    if (member) {
      // Only the role changes for an existing member
      this.form.patchValue({ phone: member.phoneNumber, roleId: member.role.id });
      this.form.controls.phone.disable();
      this.form.controls.firstName.disable();
      this.form.controls.lastName.disable();
      if (this.readOnly()) this.form.controls.roleId.disable();
    }
  }

  /**
   * Add the member, or save the new role
   */
  save(): void {
    MskValidateFormFields(this.form);
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const member = this.data.member;
    const request: Observable<unknown> = member
      ? this._membersService.updateMemberRole(member.userId, value.roleId)
      : this._membersService.addMember({
          phone: value.phone,
          roleId: value.roleId,
          firstName: value.firstName.trim() || undefined,
          lastName: value.lastName.trim() || undefined,
        });

    this.form.disable();
    this.alert.set({ show: false, message: '' });
    request
      .pipe(
        tap(() => this.dialogRef.close(true)),
        catchError((response) => this._fail(response)),
      )
      .subscribe();
  }

  /**
   * Take the member out of the store (their account stays)
   */
  remove(): void {
    const member = this.data.member;
    if (!member) return;

    this._confirmationService
      .open({
        title: this._translocoService.translate('members.members.remove'),
        message: this._translocoService.translate('members.members.remove-message', {
          name: member.fullName || member.phoneNumber,
        }),
        actions: {
          confirm: { label: this._translocoService.translate('delete') },
          cancel: { label: this._translocoService.translate('cancel') },
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result !== 'confirmed') return;
        this._membersService
          .removeMember(member.userId)
          .pipe(
            tap(() => this.dialogRef.close(true)),
            catchError((response) => this._fail(response)),
          )
          .subscribe();
      });
  }

  private _fail(response: MskHttpErrorResponse): Observable<never> {
    this.form.enable();
    if (this.data.member) {
      this.form.controls.phone.disable();
      this.form.controls.firstName.disable();
      this.form.controls.lastName.disable();
    }
    this.alert.set({ show: true, message: response.error?.message || response.message });
    return EMPTY;
  }
}
