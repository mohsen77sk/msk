import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MskAlertComponent, MskAlertType } from '@msk/shared/ui/alert';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { Observable } from 'rxjs';

interface StarterCategory {
  selected: boolean;
  name: string;
}

interface StarterProduct {
  selected: boolean;
  name: string;
  categoryName: string;
  sellPrice: number | null;
  cost: number | null;
  quantity: number | null;
}

type StarterList = 'category' | 'product';

interface CatalogServices {
  categoriesService: {
    createProductCategory(payload: { name: string }): Observable<{ id: number; name: string }>;
  };
  productsService: {
    createProduct(payload: {
      name: string;
      unit: string;
      quantity: number;
      cost: number;
      sellPrice: number;
      categoryId?: number;
    }): Observable<unknown>;
  };
}

@Component({
  selector: 'mz-catalog-onboarding',
  templateUrl: './catalog-onboarding.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MskAlertComponent,
    MskSpinnerDirective,
  ],
})
export class CatalogOnboardingComponent {
  private _router = inject(Router);
  private _injector = inject(Injector);
  private _translocoService = inject(TranslocoService);
  private _snackbarService = inject(MskSnackbarService);

  creating = signal(false);
  alert = signal<{ type: MskAlertType; message: string } | null>(null);

  categories = signal<StarterCategory[]>([
    { selected: true, name: 'Drinks' },
    { selected: true, name: 'Food' },
    { selected: true, name: 'Other' },
  ]);

  products = signal<StarterProduct[]>([
    { selected: true, name: 'Espresso', categoryName: 'Drinks', sellPrice: null, cost: null, quantity: null },
    { selected: true, name: 'Americano', categoryName: 'Drinks', sellPrice: null, cost: null, quantity: null },
    { selected: true, name: 'Tea', categoryName: 'Drinks', sellPrice: null, cost: null, quantity: null },
    { selected: true, name: 'Cake', categoryName: 'Food', sellPrice: null, cost: null, quantity: null },
  ]);

  selectedCount = computed(
    () =>
      this.categories().filter((category) => category.selected).length +
      this.products().filter((product) => product.selected).length,
  );

  updateCategory(index: number, patch: Partial<StarterCategory>): void {
    this.categories.update((categories) =>
      categories.map((category, itemIndex) => (itemIndex === index ? { ...category, ...patch } : category)),
    );
  }

  updateProduct(index: number, patch: Partial<StarterProduct>): void {
    this.products.update((products) =>
      products.map((product, itemIndex) => (itemIndex === index ? { ...product, ...patch } : product)),
    );
  }

  async createCatalog(): Promise<void> {
    this.alert.set(null);
    const validationError = this.getValidationError();

    if (validationError) {
      this.alert.set({ type: 'error', message: validationError });
      return;
    }

    const selectedCategories = this.categories().filter((category) => category.selected);
    const selectedProducts = this.products().filter((product) => product.selected);

    if (!selectedCategories.length && !selectedProducts.length) {
      await this.skip();
      return;
    }

    this.creating.set(true);

    try {
      const { categoriesService, productsService } = await this.getCatalogServices();
      const categoryIdsByName = new Map<string, number>();

      for (const category of selectedCategories) {
        try {
          const createdCategory = await firstValueFrom(
            categoriesService.createProductCategory({ name: category.name.trim() }),
          );
          categoryIdsByName.set(this.normalizeName(createdCategory.name), createdCategory.id);
        } catch (error) {
          throw new Error(this.translateFailure('category', category.name, error));
        }
      }

      for (const product of selectedProducts) {
        try {
          const categoryId = categoryIdsByName.get(this.normalizeName(product.categoryName));
          await firstValueFrom(
            productsService.createProduct({
              name: product.name.trim(),
              unit: 'piece',
              quantity: product.quantity ?? 0,
              cost: product.cost ?? 0,
              sellPrice: product.sellPrice ?? 0,
              ...(categoryId ? { categoryId } : {}),
            }),
          );
        } catch (error) {
          throw new Error(this.translateFailure('product', product.name, error));
        }
      }

      this._snackbarService.success(this._translocoService.translate('onboarding.catalog-created'));
      await this._router.navigateByUrl('/onboarding/first-sale');
    } catch (error) {
      this.alert.set({
        type: 'error',
        message: error instanceof Error ? error.message : this._translocoService.translate('onboarding.catalog-error'),
      });
    } finally {
      this.creating.set(false);
    }
  }

  async skip(): Promise<void> {
    await this._router.navigateByUrl('/onboarding/first-sale');
  }

  getValidationError(): string | null {
    const selectedCategories = this.categories().filter((category) => category.selected);
    const selectedProducts = this.products().filter((product) => product.selected);

    if (selectedCategories.some((category) => !category.name.trim())) {
      return this._translocoService.translate('onboarding.category-name-required');
    }

    if (selectedProducts.some((product) => !product.name.trim())) {
      return this._translocoService.translate('onboarding.product-name-required');
    }

    if (this.hasDuplicateNames(selectedCategories.map((category) => category.name))) {
      return this._translocoService.translate('onboarding.duplicate-category-name');
    }

    if (this.hasDuplicateNames(selectedProducts.map((product) => product.name))) {
      return this._translocoService.translate('onboarding.duplicate-product-name');
    }

    if (
      selectedProducts.some(
        (product) =>
          !this.isNonNegative(product.sellPrice) ||
          !this.isNonNegative(product.cost) ||
          !this.isNonNegative(product.quantity),
      )
    ) {
      return this._translocoService.translate('onboarding.non-negative-values');
    }

    return null;
  }

  private hasDuplicateNames(names: string[]): boolean {
    const normalizedNames = names.map((name) => this.normalizeName(name)).filter(Boolean);

    return new Set(normalizedNames).size !== normalizedNames.length;
  }

  private normalizeName(name: string): string {
    return name.trim().toLocaleLowerCase();
  }

  private isNonNegative(value: number | null): boolean {
    const normalizedValue = Number(value ?? 0);

    return Number.isFinite(normalizedValue) && normalizedValue >= 0;
  }

  private translateFailure(type: StarterList, name: string, error: unknown): string {
    const message = this.getErrorMessage(error);

    return this._translocoService.translate(`onboarding.${type}-create-failed`, {
      name: name.trim(),
      message,
    });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error && 'error' in error) {
      const response = error as { error?: { message?: string } };
      return response.error?.message ?? this._translocoService.translate('onboarding.catalog-error');
    }

    return this._translocoService.translate('onboarding.catalog-error');
  }

  private async getCatalogServices(): Promise<CatalogServices> {
    const [{ ProductCategoriesService }, { ProductsService }] = await Promise.all([
      import('@msk/mirza/panel/product-categories'),
      import('@msk/mirza/panel/products'),
    ]);

    return {
      categoriesService: this._injector.get(ProductCategoriesService),
      productsService: this._injector.get(ProductsService),
    };
  }
}
