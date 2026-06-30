import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { CatalogOnboardingComponent } from './catalog-onboarding.component';

describe('CatalogOnboardingComponent', () => {
  let component: CatalogOnboardingComponent;
  let fixture: ComponentFixture<CatalogOnboardingComponent>;
  let categoriesService: {
    createProductCategory: jest.Mock;
  };
  let productsService: {
    createProduct: jest.Mock;
  };
  let snackbarService: {
    success: jest.Mock;
    error: jest.Mock;
  };

  beforeEach(async () => {
    const [{ ProductCategoriesService }, { ProductsService }] = await Promise.all([
      import('@msk/mirza/panel/product-categories'),
      import('@msk/mirza/panel/products'),
    ]);

    categoriesService = {
      createProductCategory: jest.fn((payload: { name: string }) =>
        of({ id: payload.name === 'Drinks' ? 10 : 20, ...payload }),
      ),
    };
    productsService = {
      createProduct: jest.fn((payload) => of({ id: 100, ...payload })),
    };
    snackbarService = {
      success: jest.fn(),
      error: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        MskTranslocoTestingModule({
          langs: {
            en: {
              onboarding: {
                'category-name-required': 'Category names are required.',
                'product-name-required': 'Product names are required.',
                'duplicate-category-name': 'Category names must be unique.',
                'duplicate-product-name': 'Product names must be unique.',
                'non-negative-values': 'Price, cost, and quantity must be zero or greater.',
                'catalog-created': 'Starter catalog created.',
                'catalog-error': 'Could not create the starter catalog.',
                'category-create-failed': 'Could not create category "{{ name }}": {{ message }}',
                'product-create-failed': 'Could not create product "{{ name }}": {{ message }}',
              },
            },
          },
        }),
        CatalogOnboardingComponent,
      ],
      providers: [
        provideRouter([]),
        { provide: ProductCategoriesService, useValue: categoriesService },
        { provide: ProductsService, useValue: productsService },
        { provide: MskSnackbarService, useValue: snackbarService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders the suggested categories and products', () => {
    const values = Array.from(fixture.nativeElement.querySelectorAll('input')).map(
      (input) => (input as HTMLInputElement).value,
    );

    expect(values).toContain('Drinks');
    expect(values).toContain('Food');
    expect(values).toContain('Espresso');
  });

  it('skips catalog onboarding and redirects to first sale onboarding', async () => {
    const router = TestBed.inject(Router);
    const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    await component.skip();

    expect(navigateByUrl).toHaveBeenCalledWith('/onboarding/first-sale');
    expect(categoriesService.createProductCategory).not.toHaveBeenCalled();
    expect(productsService.createProduct).not.toHaveBeenCalled();
  });

  it('creates selected categories before selected products', async () => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    component.categories.set([
      { selected: true, name: 'Drinks' },
      { selected: false, name: 'Food' },
    ]);
    component.products.set([
      { selected: true, name: 'Espresso', categoryName: 'Drinks', sellPrice: 120, cost: 80, quantity: 5 },
    ]);

    await component.createCatalog();

    expect(categoriesService.createProductCategory).toHaveBeenCalledWith({ name: 'Drinks' });
    expect(productsService.createProduct).toHaveBeenCalledWith({
      name: 'Espresso',
      unit: 'piece',
      quantity: 5,
      cost: 80,
      sellPrice: 120,
      categoryId: 10,
    });
    expect(categoriesService.createProductCategory.mock.invocationCallOrder[0]).toBeLessThan(
      productsService.createProduct.mock.invocationCallOrder[0],
    );
  });

  it('sends product defaults and categoryId when a matching category is available', async () => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    component.categories.set([{ selected: true, name: 'Drinks' }]);
    component.products.set([
      { selected: true, name: 'Tea', categoryName: 'Drinks', sellPrice: null, cost: null, quantity: null },
    ]);

    await component.createCatalog();

    expect(productsService.createProduct).toHaveBeenCalledWith({
      name: 'Tea',
      unit: 'piece',
      quantity: 0,
      cost: 0,
      sellPrice: 0,
      categoryId: 10,
    });
  });

  it('validates duplicate and invalid local names before calling APIs', async () => {
    component.categories.set([
      { selected: true, name: 'Drinks' },
      { selected: true, name: ' drinks ' },
    ]);

    await component.createCatalog();

    expect(component.alert()).toEqual(expect.objectContaining({ type: 'error' }));
    expect(categoriesService.createProductCategory).not.toHaveBeenCalled();
    expect(productsService.createProduct).not.toHaveBeenCalled();
  });

  it('validates negative product values before calling APIs', async () => {
    component.categories.set([]);
    component.products.set([
      { selected: true, name: 'Tea', categoryName: 'Drinks', sellPrice: -1, cost: 0, quantity: 0 },
    ]);

    await component.createCatalog();

    expect(component.alert()).toEqual(expect.objectContaining({ type: 'error' }));
    expect(productsService.createProduct).not.toHaveBeenCalled();
  });

  it('reports the item name when an API call fails', async () => {
    categoriesService.createProductCategory.mockReturnValueOnce(throwError(() => new Error('Server error')));

    await component.createCatalog();

    expect(component.alert()?.message).toContain('Drinks');
    expect(component.alert()?.message).toContain('Server error');
    expect(productsService.createProduct).not.toHaveBeenCalled();
  });

  it('updates category selection from the UI', () => {
    const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));

    checkbox.triggerEventHandler('change', { checked: false });

    expect(component.categories()[0].selected).toBe(false);
  });
});
