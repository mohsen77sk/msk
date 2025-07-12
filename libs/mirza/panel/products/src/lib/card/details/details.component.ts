import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
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
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MskDialogData, MskHttpErrorResponse } from '@msk/shared/data-access';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskCurrencyMaskDirective } from '@msk/shared/directives/currency-mask';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { MskSelectSearchDirective } from '@msk/shared/directives/select-search';

import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { mskAnimations } from '@msk/shared/animations';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { ProductsService } from '../../products.service';
import { Product } from '../../products.types';

@Component({
  selector: 'mz-product-details',
  templateUrl: './details.component.html',
  animations: mskAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
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
    MskDialogComponent,
    MskSpinnerDirective,
    MskCurrencyMaskDirective,
    MskCurrencySymbolDirective,
    MskSelectSearchDirective,
  ],
})
export class ProductCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<Product | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ProductCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _productsService = inject(ProductsService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);

  form!: FormGroup;
  formErrors: FormError = {};

  alert = signal({
    show: false,
    message: '',
  });

  unitList: { id: string; name: string }[] = [];

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
      unit: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      cost: 0,
      sellPrice: 0,
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
   * delete the product
   */
  deleteProduct(): void {
    // Open the confirmation dialog
    const confirmation = this._mskConfirmationService.open({
      title: this._translocoService.translate('products.delete'),
      message: this._translocoService.translate('products.delete-message', {
        name: this.data.item()?.name,
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

      this._productsService
        .deleteProduct(this.data.item() as Product)
        .pipe(
          map((response) => this.dialogRef.close(response)),
          catchError((response) => {
            // Show error
            this._mskSnackbarService.error(response.error.message);
            // Return
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
      this.data.action() === 'edit'
        ? this._productsService.updateProduct(this.form.value)
        : this._productsService.createProduct(this.form.value);

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
        })
      )
      .subscribe();
  }
}
