import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MskDialogData } from '@msk/shared/data-access';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskConfirmationService } from '@msk/shared/services/confirmation';
import { Product, ProductUnit, ProductsService } from '@msk/mirza/panel/products';
import { PaymentType, PaymentTypesService } from '@msk/mirza/panel/payment-types';
import { VendorsService } from '@msk/mirza/panel/vendors';
import { PurchasesCardDetailsComponent } from './details.component';
import { PurchasesService } from '../../purchases.service';
import { PurchaseInvoice } from '../../purchases.types';

const highSellPriceProduct: Product = {
  id: 1,
  name: 'Product A',
  unit: ProductUnit.PIECE,
  sellPrice: 999999,
};

const paymentType: PaymentType = { id: 1, name: 'Cash', isDefault: true };

describe('PurchasesCardDetailsComponent', () => {
  function createComponent(item: PurchaseInvoice | undefined = undefined) {
    TestBed.configureTestingModule({
      imports: [PurchasesCardDetailsComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            action: signal(item ? 'edit' : 'new'),
            item: signal(item),
          } satisfies MskDialogData<PurchaseInvoice | undefined>,
        },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: VendorsService, useValue: { getVendors: jest.fn() } },
        { provide: ProductsService, useValue: { getProducts: jest.fn() } },
        { provide: PaymentTypesService, useValue: { getPaymentTypes: jest.fn() } },
        {
          provide: PurchasesService,
          useValue: {
            createPurchaseInvoice: jest.fn().mockReturnValue(of({})),
            updatePurchaseInvoice: jest.fn().mockReturnValue(of({})),
          },
        },
        { provide: TranslocoService, useValue: { translate: jest.fn((key: string) => key) } },
        { provide: MskSnackbarService, useValue: { error: jest.fn() } },
        { provide: MskConfirmationService, useValue: { open: jest.fn() } },
      ],
    });

    const fixture = TestBed.createComponent(PurchasesCardDetailsComponent);
    const component = fixture.componentInstance;
    // Drive the form directly rather than rendering the template (autocomplete
    // panels/virtual-scroll overlays aren't relevant to the pricing logic under test).
    component.ngOnInit();
    return component;
  }

  it('should create', () => {
    const component = createComponent();
    expect(component).toBeTruthy();
  });

  it('does not set the row total from product.sellPrice when a product is selected', () => {
    const component = createComponent();
    const row = component.purchaseItems.at(0);

    row.controls.product.setValue(highSellPriceProduct);

    expect(row.controls.total.value).toBe(0);
  });

  it('does not recalculate the row total when quantity changes', () => {
    const component = createComponent();
    const row = component.purchaseItems.at(0);

    row.controls.total.setValue(600000);
    row.controls.quantity.setValue(5);

    expect(row.controls.total.value).toBe(600000);
  });

  it('sums manually entered row totals directly (not quantity * total) and subtracts discount', () => {
    const component = createComponent();

    const first = component.purchaseItems.at(0);
    first.controls.product.setValue(highSellPriceProduct);
    first.controls.quantity.setValue(3);
    first.controls.total.setValue(600000);

    component.addPurchaseItem();
    const second = component.purchaseItems.at(1);
    second.controls.quantity.setValue(5);
    second.controls.total.setValue(250000);

    expect(component.form.controls.total.value).toBe(850000);

    component.form.controls.discount.setValue(50000);
    expect(component.form.controls.total.value).toBe(800000);
  });

  it('recalculates the total after a row is removed', () => {
    const component = createComponent();

    component.purchaseItems.at(0).controls.total.setValue(600000);
    component.addPurchaseItem();
    component.purchaseItems.at(1).controls.total.setValue(250000);
    expect(component.form.controls.total.value).toBe(850000);

    component.removePurchaseItem(1);
    expect(component.form.controls.total.value).toBe(600000);
  });

  it('preserves the persisted item total when loading an existing purchase, even with a higher sellPrice product', () => {
    const existing = {
      id: 5,
      number: '5',
      date: new Date().toISOString(),
      vendor: undefined,
      paymentTypes: [{ id: 1, paymentType, paymentTypeId: 1, value: 600000 }],
      purchaseItems: [{ product: highSellPriceProduct, productId: 1, quantity: 2, total: 600000 }],
      discount: 0,
      total: 600000,
      note: '',
    } as unknown as PurchaseInvoice;

    const component = createComponent(existing);

    expect(component.purchaseItems.at(0).controls.total.value).toBe(600000);
    expect(component.purchaseItems.at(0).controls.total.value).not.toBe(
      (highSellPriceProduct.sellPrice ?? 0) * 2,
    );
  });

  it('maps the request payload to productId/quantity/total only, without the product object or sellPrice', () => {
    const component = createComponent();
    const purchasesService = TestBed.inject(PurchasesService);

    component.purchaseItems.at(0).controls.product.setValue(highSellPriceProduct);
    component.purchaseItems.at(0).controls.quantity.setValue(3);
    component.purchaseItems.at(0).controls.total.setValue(600000);
    component.paymentTypes.at(0).controls.paymentType.setValue(paymentType);

    component.saveAndClose();

    expect(purchasesService.createPurchaseInvoice).toHaveBeenCalledWith(
      expect.objectContaining({
        purchaseItems: [{ productId: 1, quantity: 3, total: 600000 }],
      }),
    );
    const payload = (purchasesService.createPurchaseInvoice as jest.Mock).mock.calls[0][0];
    expect(payload.purchaseItems[0]).not.toHaveProperty('sellPrice');
    expect(payload.purchaseItems[0]).not.toHaveProperty('product');
  });
});
