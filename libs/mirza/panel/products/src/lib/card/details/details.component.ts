import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MskDataSource, MskDialogData, MskHttpErrorResponse, MskSort } from '@msk/shared/data-access';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { MskMaskDirective } from '@msk/shared/directives/mask';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { MskStateChipComponent } from '@msk/shared/ui/state-chip';

import {
  MskHandleFormErrors,
  MskValidateFormFields,
  MskSetServerErrorsFormFields,
  FormError,
} from '@msk/shared/utils/error-handler';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { ProductsService } from '../../products.service';
import { ICreateProduct, Product, ProductUnit } from '../../products.types';
import {
  ProductCategoriesService,
  ProductCategory,
  DefaultProductCategorySortData,
} from '@msk/mirza/panel/product-categories';

/**
 * A product must be sellable, purchasable, or both
 * @param group product form
 */
function purposeRequiredValidator(group: AbstractControl): ValidationErrors | null {
  const isSellable = group.get('isSellable')?.value;
  const isPurchasable = group.get('isPurchasable')?.value;
  return isSellable || isPurchasable ? null : { purposeRequired: true };
}

@Component({
  selector: 'mz-product-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    DecimalPipe,
    NgTemplateOutlet,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDialogModule,
    TranslocoPipe,
    TranslocoDirective,
    MskCurrencyPipe,
    MskAlertComponent,
    MskDialogComponent,
    MskMaskDirective,
    MskSpinnerDirective,
    MskCurrencySymbolDirective,
    MskStateChipComponent,
  ],
})
export class ProductCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<Product | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ProductCardDetailsComponent>);
  private _destroyRef = inject(DestroyRef);
  private _formBuilder = inject(FormBuilder);
  private _productsService = inject(ProductsService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _mskConfirmationService = inject(MskConfirmationService);
  private _productCategoriesService = inject(ProductCategoriesService);

  form!: FormGroup;
  formErrors: FormError = {};
  unitList: ProductUnit[] = Object.values(ProductUnit);
  categoryDS!: MskDataSource<ProductCategory>;

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
    this.form = this._formBuilder.group(
      {
        id: [0, Validators.required],
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        category: null,
        quantity: null,
        unit: [ProductUnit.PIECE, Validators.required],
        cost: [0, Validators.required],
        sellPrice: [0, Validators.required],
        note: '',
        isSellable: true,
        isPurchasable: true,
      },
      { validators: purposeRequiredValidator },
    );
    // Sell price is only required for sellable products
    this.form
      .get('isSellable')
      ?.valueChanges.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((isSellable: boolean) => {
        const sellPrice = this.form.get('sellPrice');
        sellPrice?.setValidators(isSellable ? Validators.required : null);
        sellPrice?.updateValueAndValidity();
      });
    // Handling errors
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);
    // Patch value form
    this.form.patchValue(this.data.item() || {});
    // Set category collection
    this.categoryDS = new MskDataSource<ProductCategory>(
      (params) => this._productCategoriesService.getProductCategories(params),
      new MskSort(DefaultProductCategorySortData),
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
  categoryDisplayFn(value: ProductCategory): string {
    return value?.name;
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

    const model: ICreateProduct = {
      id: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
      categoryId: this.form.get('category')?.value?.id,
      unit: this.form.get('unit')?.value,
      quantity: this.form.get('quantity')?.value,
      cost: this.form.get('cost')?.value,
      // Purchase-only products store 0 as sell price
      sellPrice: this.form.get('isSellable')?.value ? this.form.get('sellPrice')?.value : 0,
      note: this.form.get('note')?.value,
      isSellable: this.form.get('isSellable')?.value,
      isPurchasable: this.form.get('isPurchasable')?.value,
    };

    const result =
      this.data.action() === 'edit'
        ? this._productsService.updateProduct(model)
        : this._productsService.createProduct(model);

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
