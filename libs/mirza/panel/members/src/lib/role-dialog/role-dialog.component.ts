import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskHttpErrorResponse } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskHandleFormErrors, MskValidateFormFields, FormError } from '@msk/shared/utils/error-handler';
import { STORE_PERMISSIONS, StorePermission } from '@msk/mirza/shell/core/store';
import { EMPTY, Observable, catchError, tap } from 'rxjs';
import { MembersService } from '../members.service';
import { STORE_ROLE_NAME_MAX_LENGTH, StoreRole } from '../members.types';

export interface RoleDialogData {
  // No role = add one
  role?: StoreRole;
}

@Component({
  selector: 'mz-role-dialog',
  templateUrl: './role-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDialogModule,
    TranslocoDirective,
    MskAlertComponent,
    MskDialogComponent,
    MskSpinnerDirective,
  ],
})
export class RoleDialogComponent implements OnInit {
  readonly data = inject<RoleDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<RoleDialogComponent>);
  private _formBuilder = inject(FormBuilder);
  private _translocoService = inject(TranslocoService);
  private _confirmationService = inject(MskConfirmationService);
  private _membersService = inject(MembersService);

  readonly allPermissions = STORE_PERMISSIONS;
  readonly nameMaxLength = STORE_ROLE_NAME_MAX_LENGTH;
  // The owner role always has everything and is never edited
  readonly readOnly = !!this.data.role?.isOwner;
  // Only roles the store added itself can be deleted
  readonly canDelete = !!this.data.role && this.data.role.key === null;

  form = this._formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(STORE_ROLE_NAME_MAX_LENGTH)]],
  });
  formErrors: FormError = {};
  selected = signal(new Set<StorePermission>());

  alert = signal({ show: false, message: '' });

  ngOnInit(): void {
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);

    const role = this.data.role;
    if (role) {
      this.form.patchValue({ name: role.name });
      this.selected.set(new Set(role.permissions));
    }
    if (this.readOnly) this.form.disable();
  }

  /**
   * @param permission
   * @param checked
   */
  toggle(permission: StorePermission, checked: boolean): void {
    const next = new Set(this.selected());
    if (checked) {
      next.add(permission);
    } else {
      next.delete(permission);
    }
    this.selected.set(next);
  }

  save(): void {
    MskValidateFormFields(this.form);
    if (this.form.invalid || this.readOnly) return;

    const body = {
      name: this.form.getRawValue().name.trim(),
      // Keep the API's order
      permissions: STORE_PERMISSIONS.filter((permission) => this.selected().has(permission)),
    };
    const role = this.data.role;
    const request: Observable<unknown> = role
      ? this._membersService.updateRole(role.id, body)
      : this._membersService.createRole(body);

    this.form.disable();
    this.alert.set({ show: false, message: '' });
    request
      .pipe(
        tap(() => this.dialogRef.close(true)),
        catchError((response) => this._fail(response)),
      )
      .subscribe();
  }

  delete(): void {
    const role = this.data.role;
    if (!role) return;

    this._confirmationService
      .open({
        title: this._translocoService.translate('members.roles.delete'),
        message: this._translocoService.translate('members.roles.delete-message', { name: role.name }),
        actions: {
          confirm: { label: this._translocoService.translate('delete') },
          cancel: { label: this._translocoService.translate('cancel') },
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result !== 'confirmed') return;
        this._membersService
          .deleteRole(role.id)
          .pipe(
            tap(() => this.dialogRef.close(true)),
            catchError((response) => this._fail(response)),
          )
          .subscribe();
      });
  }

  private _fail(response: MskHttpErrorResponse): Observable<never> {
    this.form.enable();
    this.alert.set({ show: true, message: response.error?.message || response.message });
    return EMPTY;
  }
}
