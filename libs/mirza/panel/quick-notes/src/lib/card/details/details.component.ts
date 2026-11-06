import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskDialogData, MskHttpErrorResponse } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskStateChipComponent } from '@msk/shared/ui/state-chip';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { ProductCategory } from '@msk/mirza/panel/product-categories';
import { catchError, EMPTY, map, of, tap } from 'rxjs';
import { QuickNotesService } from '../../quick-notes.service';
import { QUICK_NOTE_LABEL_MAX_LENGTH, QuickNote } from '../../quick-notes.types';

@Component({
  selector: 'mz-quick-notes-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgTemplateOutlet,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDialogModule,
    TranslocoDirective,
    MskAlertComponent,
    MskStateChipComponent,
    MskDialogComponent,
    MskSpinnerDirective,
  ],
})
export class QuickNotesCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<QuickNote | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<QuickNotesCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);
  private _quickNotesService = inject(QuickNotesService);

  readonly labelMaxLength = QUICK_NOTE_LABEL_MAX_LENGTH;

  form = this._formBuilder.group({
    label: this._formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(QUICK_NOTE_LABEL_MAX_LENGTH),
    ]),
    isActive: this._formBuilder.nonNullable.control(true),
    // Empty = all products
    categoryIds: this._formBuilder.nonNullable.control<number[]>([]),
  });
  formErrors: FormError = {};

  alert = signal({
    show: false,
    message: '',
  });

  categories = toSignal(
    this._quickNotesService.getAllCategories().pipe(catchError(() => of([] as ProductCategory[]))),
    { initialValue: [] as ProductCategory[] },
  );

  // Names of the saved scope; empty = all products
  scopeNames = computed(() => {
    const ids = this.data.item()?.categoryIds ?? [];
    return this.categories()
      .filter((category) => ids.includes(category.id))
      .map((category) => category.name);
  });

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Handling errors
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);
    // Patch value form
    const item = this.data.item();
    if (item) {
      this.form.patchValue({ label: item.label, isActive: item.isActive, categoryIds: item.categoryIds });
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Go to edit mode
   */
  editMode(): void {
    if (this.data.action() !== 'view') return;

    this.data.action.set('edit');
  }

  /**
   * Delete the quick note. Sales keep their note text.
   */
  deleteQuickNote(): void {
    // Open the confirmation dialog
    const confirmation = this._mskConfirmationService.open({
      title: this._translocoService.translate('quickNotes.delete'),
      message: this._translocoService.translate('quickNotes.delete-message', {
        name: this.data.item()?.label,
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

      this._quickNotesService
        .deleteQuickNote(this.data.item() as QuickNote)
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

    const value = this.form.getRawValue();
    const body = { label: value.label.trim(), isActive: value.isActive, categoryIds: value.categoryIds };

    // Disable the form
    this.form.disable();

    // Reset the alert
    this.alert.set({ show: false, message: '' });

    const result =
      this.data.action() === 'edit'
        ? this._quickNotesService.updateQuickNote({ ...body, id: this.data.item()?.id ?? 0 })
        : this._quickNotesService.createQuickNote(body);

    result
      .pipe(
        tap((response) => this.dialogRef.close(response)),
        catchError((response: MskHttpErrorResponse) => {
          // Re-enable the form
          this.form.enable();
          // Set the alert
          this.alert.set({
            show: true,
            message:
              response.error?.code === 'QUICK_NOTE_LABEL_TAKEN'
                ? this._translocoService.translate('quickNotes.errors.labelTaken')
                : response.error?.message || response.message,
          });
          // Set validation error message
          if (response.error?.errors) {
            MskSetServerErrorsFormFields(response.error.errors, this.form);
          }
          // Return
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
