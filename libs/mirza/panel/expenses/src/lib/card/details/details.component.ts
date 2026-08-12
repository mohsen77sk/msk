import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MskDataSource, MskDialogData, MskHttpErrorResponse, MskSort } from '@msk/shared/data-access';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskMaskDirective } from '@msk/shared/directives/mask';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskDatepickerTouchUiDirective } from '@msk/shared/directives/datepicker-touch-ui';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { ExpensesService } from '../../expenses.service';
import { DefaultExpenseCategorySortData, Expense, ExpenseCategory, ICreateExpense } from '../../expenses.types';

@Component({
  selector: 'mz-expenses-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgTemplateOutlet,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatDialogModule,
    TranslocoDirective,
    TranslocoPipe,
    MskCurrencyPipe,
    MskDateTimePipe,
    MskAlertComponent,
    MskDialogComponent,
    MskMaskDirective,
    MskSpinnerDirective,
    MskDatepickerTouchUiDirective,
    MskCurrencySymbolDirective,
  ],
})
export class ExpensesCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<Expense | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ExpensesCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);
  private _expensesService = inject(ExpensesService);

  form!: FormGroup;
  formErrors: FormError = {};
  categoryDS!: MskDataSource<ExpenseCategory>;

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
      cost: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.maxLength(255)],
      category: null,
      date: this._formBuilder.control(new Date(new Date().setHours(0, 0, 0, 0)), Validators.required),
    });
    // Handling errors
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);
    // Patch value form
    this.form.patchValue(this.data.item() || {});
    // Set category collection
    this.categoryDS = new MskDataSource<ExpenseCategory>(
      (params) => this._expensesService.getExpenseCategories(params),
      new MskSort(DefaultExpenseCategorySortData),
      this.form.get('category')?.valueChanges,
    );
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
   * Get the category name
   * @param value category
   */
  categoryDisplayFn(value: ExpenseCategory): string {
    return value?.name;
  }

  /**
   * Delete the expense
   */
  deleteExpense(): void {
    // Open the confirmation dialog
    const confirmation = this._mskConfirmationService.open({
      title: this._translocoService.translate('expenses.delete'),
      message: this._translocoService.translate('expenses.delete-message', {
        description: this.data.item()?.description,
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

      this._expensesService
        .deleteExpense(this.data.item() as Expense)
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

    // The category control holds either an ExpenseCategory (an existing
    // category picked from the autocomplete) or a plain string (a new
    // category name typed but not selected) - the backend accepts either
    // categoryId or categoryName (see CreateExpenseDto), never both.
    const categoryValue = this.form.get('category')?.value;
    const categoryId = categoryValue && typeof categoryValue === 'object' ? categoryValue.id : undefined;
    const categoryName =
      categoryValue && typeof categoryValue === 'string' && categoryValue.trim() ? categoryValue.trim() : undefined;

    const model: ICreateExpense = {
      id: this.form.get('id')?.value,
      cost: this.form.get('cost')?.value,
      description: this.form.get('description')?.value,
      categoryId,
      categoryName,
      date: this.form.get('date')?.value?.toISOString() ?? new Date().toISOString(),
    };

    const result =
      this.data.action() === 'edit'
        ? this._expensesService.updateExpense(model)
        : this._expensesService.createExpense(model);

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
