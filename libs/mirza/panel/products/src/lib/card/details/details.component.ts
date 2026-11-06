import { DecimalPipe, NgTemplateOutlet, PercentPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
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
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
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
import { normalizeDigits } from '@msk/shared/utils/number';
import { catchError, EMPTY, map, startWith, tap } from 'rxjs';
import { ProductsService } from '../../products.service';
import {
  DefaultProductsSortData,
  ICreateProduct,
  Product,
  ProductRecipe,
  ProductRecipeIngredient,
  ProductUnit,
} from '../../products.types';
import {
  ProductCategoriesService,
  ProductCategory,
  DefaultProductCategorySortData,
} from '@msk/mirza/panel/product-categories';

/**
 * A product must be sellable, purchasable, or have a recipe
 * @param group product form
 */
function purposeRequiredValidator(group: AbstractControl): ValidationErrors | null {
  const isSellable = group.get('isSellable')?.value;
  const isPurchasable = group.get('isPurchasable')?.value;
  const hasRecipe = ((group.get('recipeItems') as FormArray | null)?.length ?? 0) > 0;
  return isSellable || isPurchasable || hasRecipe ? null : { purposeRequired: true };
}

/**
 * Product code: empty, or a whole number 1-9999 (Persian/Arabic digits allowed)
 * @param control code control
 */
function productCodeValidator(control: AbstractControl): ValidationErrors | null {
  const code = parseProductCode(control.value);
  if (code === null) return null;
  if (Number.isNaN(code)) return { pattern: true };
  if (code < 1) return { min: { min: 1 } };
  if (code > 9999) return { max: { max: 9999 } };
  return null;
}

/**
 * null when empty, NaN when not a whole number
 * @param value
 */
function parseProductCode(value: unknown): number | null {
  const text = normalizeDigits(String(value ?? '')).trim();
  if (!text) return null;
  return /^\d+$/.test(text) ? Number(text) : NaN;
}

/**
 * The ingredient must be picked from the list, not just typed
 * @param control ingredient control
 */
function ingredientSelectedValidator(control: AbstractControl): ValidationErrors | null {
  return control.value && typeof control.value === 'object' ? null : { required: true };
}

/**
 * Amount a recipe line actually consumes: the waste is the share of the input
 * that is lost (same formula as the backend RecipeService)
 * @param quantity
 * @param wastePercent
 */
function effectiveRecipeQuantity(quantity: number, wastePercent: number | null): number {
  return quantity / (1 - (wastePercent ?? 0) / 100);
}

interface RecipeItemFormValue {
  ingredient: ProductRecipeIngredient | string | null;
  quantity: number | null;
  wastePercent: number | null;
}

@Component({
  selector: 'mz-product-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    DecimalPipe,
    PercentPipe,
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
    MskDateTimePipe,
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
  ingredientDSList: MskDataSource<Product>[] = [];

  // Saved recipe (view mode) and live cost of the edited recipe
  readonly recipe = signal<ProductRecipe | null>(null);
  readonly recipeLoaded = signal(false);
  readonly recipeCost = signal<{ cost: number | null; margin: number | null } | null>(null);
  // Cost follows the last purchase and is not edited by hand
  readonly costFromPurchase = signal(false);

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
        code: [null as string | number | null, productCodeValidator],
        category: null,
        quantity: null,
        unit: [ProductUnit.PIECE, Validators.required],
        cost: [0, Validators.required],
        sellPrice: [0, Validators.required],
        note: '',
        isSellable: true,
        isPurchasable: true,
        recipeItems: this._formBuilder.array([]),
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
    this.costFromPurchase.set(this.data.item()?.costFromPurchase ?? false);
    // Set category collection
    this.categoryDS = new MskDataSource<ProductCategory>(
      (params) => this._productCategoriesService.getProductCategories(params),
      new MskSort(DefaultProductCategorySortData),
      this.form.get('category')?.valueChanges,
    );
    // Recompute recipe cost and margin on every change
    this.form.valueChanges
      .pipe(startWith(this.form.value), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._updateRecipeCost());
    // Load the saved recipe; until it arrives the recipe is left untouched on save
    const productId = this.data.item()?.id;
    if (productId) {
      this._productsService
        .getProductRecipe(productId)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((recipe) => {
          this.recipe.set(recipe);
          recipe.items.forEach((line) => this.addRecipeItem(line.ingredient, line.quantity, line.wastePercent));
          this.recipeLoaded.set(true);
        });
    } else {
      this.recipeLoaded.set(true);
    }
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
   * Open the saved product as a new one: same fields and recipe, stock 0
   */
  duplicate(): void {
    this.form.patchValue({
      id: 0,
      name: `${this.form.get('name')?.value} ${this._translocoService.translate('products.details.copy-suffix')}`,
      quantity: 0,
      // Codes are unique per store
      code: null,
    });
    // The copy has no purchases yet, so its cost starts as a manual value
    this.costFromPurchase.set(false);
    this.data.action.set('new');
  }

  /**
   * Get the category name
   * @param value category
   */
  categoryDisplayFn(value: ProductCategory): string {
    return value?.name;
  }

  /**
   * Recipe item rows
   */
  get recipeItems(): FormArray {
    return this.form.get('recipeItems') as FormArray;
  }

  /**
   * Get the ingredient name
   * @param value ingredient
   */
  ingredientDisplayFn(value: ProductRecipeIngredient): string {
    return value?.name;
  }

  /**
   * Add a recipe row
   * @param ingredient
   * @param quantity
   * @param wastePercent
   */
  addRecipeItem(
    ingredient: ProductRecipeIngredient | null = null,
    quantity: number | null = null,
    wastePercent = 0,
  ): void {
    const group = this._formBuilder.group({
      ingredient: [ingredient, ingredientSelectedValidator],
      quantity: [quantity, [Validators.required, Validators.min(0.001)]],
      wastePercent: [wastePercent, [Validators.min(0), Validators.max(99.99)]],
    });
    this.recipeItems.push(group);

    // Ingredients: purchasable or intermediate products, never this product itself
    const productId = this.data.item()?.id;
    this.ingredientDSList.push(
      new MskDataSource<Product>(
        (params) =>
          this._productsService.getProducts({
            ...params,
            purpose: 'ingredient',
            ...(productId ? { excludeId: productId } : {}),
          }),
        new MskSort(DefaultProductsSortData),
        group.get('ingredient')?.valueChanges,
      ),
    );
  }

  /**
   * Remove a recipe row
   * @param index
   */
  removeRecipeItem(index: number): void {
    this.recipeItems.removeAt(index);
    this.ingredientDSList.splice(index, 1);
  }

  /**
   * Unit of the row's selected ingredient
   * @param row
   */
  recipeUnitOf(row: AbstractControl): ProductUnit | undefined {
    const ingredient = (row.value as RecipeItemFormValue).ingredient;
    return ingredient && typeof ingredient === 'object' ? ingredient.unit : undefined;
  }

  /**
   * Quantity of one recipe row including its waste, or null while incomplete
   * @param row
   */
  recipeEffectiveQuantityOf(row: AbstractControl): number | null {
    const { quantity, wastePercent } = row.value as RecipeItemFormValue;
    if (!quantity) return null;
    return effectiveRecipeQuantity(quantity, wastePercent);
  }

  /**
   * Cost of one recipe row (waste included), or null if unknown
   * @param row
   */
  recipeLineCostOf(row: AbstractControl): number | null {
    const { ingredient } = row.value as RecipeItemFormValue;
    const effectiveQuantity = this.recipeEffectiveQuantityOf(row);
    if (!ingredient || typeof ingredient !== 'object' || effectiveQuantity === null) return null;
    return ingredient.effectiveCost == null ? null : ingredient.effectiveCost * effectiveQuantity;
  }

  /**
   * Margin of a cost against the sell price, or null if not applicable
   * @param cost
   * @param sellPrice
   */
  marginOf(cost: number | null | undefined, sellPrice: number | null | undefined): number | null {
    if (cost == null || !sellPrice) return null;
    return (sellPrice - cost) / sellPrice;
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
      code: parseProductCode(this.form.get('code')?.value),
      categoryId: this.form.get('category')?.value?.id,
      unit: this.form.get('unit')?.value,
      quantity: this.form.get('quantity')?.value,
      cost: this.form.get('cost')?.value,
      // Purchase-only products store 0 as sell price
      sellPrice: this.form.get('isSellable')?.value ? this.form.get('sellPrice')?.value : 0,
      note: this.form.get('note')?.value,
      isSellable: this.form.get('isSellable')?.value,
      isPurchasable: this.form.get('isPurchasable')?.value,
      recipeItems: this.recipeLoaded()
        ? (this.recipeItems.getRawValue() as RecipeItemFormValue[]).map((row) => ({
            ingredientId: (row.ingredient as ProductRecipeIngredient).id,
            quantity: Number(row.quantity),
            wastePercent: Number(row.wastePercent) || 0,
          }))
        : undefined,
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
          // Duplicate code in this store: show it on the code field
          if (response.error.code === 'PRODUCT_CODE_TAKEN') {
            this.form.get('code')?.setErrors({
              serverError: this._translocoService.translate('products.details.code-taken'),
            });
            return EMPTY;
          }
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

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sum of the filled recipe rows; null as soon as one ingredient has no cost
   */
  private _updateRecipeCost(): void {
    const rows = this.recipeItems.controls;
    if (!rows.length) {
      this.recipeCost.set(null);
      return;
    }

    let cost: number | null = 0;
    for (const row of rows) {
      const { ingredient, quantity } = row.value as RecipeItemFormValue;
      // Rows still being filled in do not count yet
      if (!ingredient || typeof ingredient !== 'object' || !quantity) continue;
      const lineCost = this.recipeLineCostOf(row);
      if (lineCost === null) {
        cost = null;
        break;
      }
      cost += lineCost;
    }

    const sellPrice = this.form.get('isSellable')?.value ? Number(this.form.get('sellPrice')?.value) : null;
    this.recipeCost.set({ cost, margin: this.marginOf(cost, sellPrice) });
  }
}
