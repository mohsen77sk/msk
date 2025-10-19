import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { mskAnimations } from '@msk/shared/animations';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { MskEmptyStateComponent } from '@msk/shared/ui/empty-state';
import { MskFilterDateComponent } from '@msk/shared/ui/filter-date';
import { MskFilterMenuComponent } from '@msk/shared/ui/filter-menu';
import { MskSortMenuComponent, SortMenuItem } from '@msk/shared/ui/sort-menu';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { MskFabExtendedCollapseDirective } from '@msk/shared/directives/fab-extended-collapse';
import { MskDataSource, MskLookupItem, MskSort } from '@msk/shared/data-access';
import { PaymentTypeService } from '@msk/mirza/shell/core/payment-type';
import { PurchaseInvoice, DefaultPurchasesSortData } from '../purchases.types';
import { PurchasesService } from '../purchases.service';
import { DefaultVendorsSortData, VendorsService } from '@msk/mirza/panel/vendors';
import { DefaultProductsSortData, ProductsService } from '@msk/mirza/panel/products';

@Component({
  selector: 'mz-purchases-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: mskAnimations,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    ScrollingModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatFormFieldModule,
    TranslocoDirective,
    MskDateTimePipe,
    MskSortMenuComponent,
    MskFilterDateComponent,
    MskFilterMenuComponent,
    MskEmptyStateComponent,
    MskCurrencySymbolDirective,
    MskFabExtendedCollapseDirective,
  ],
})
export class PurchasesListComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _vendorsService = inject(VendorsService);
  private _productsService = inject(ProductsService);
  private _purchasesService = inject(PurchasesService);
  private _paymentTypeService = inject(PaymentTypeService);
  private _viewport = viewChild.required(CdkVirtualScrollViewport);

  dataSource!: MskDataSource<PurchaseInvoice>;

  sortItems: SortMenuItem[] = [
    { key: 'number', label: 'purchases.sort.number' },
    { key: 'date', label: 'purchases.sort.createdAt' },
  ];
  sortData = new MskSort({
    active: DefaultPurchasesSortData.active,
    direction: DefaultPurchasesSortData.direction,
  });
  search = new FormControl<string>('');
  filterForm: FormGroup = new FormGroup({
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
    vendorId: new FormControl<number | null>(null),
    productId: new FormControl<number | null>(null),
    paymentType: new FormControl<string | null>(null),
  });
  vendorLookupDS!: MskDataSource<MskLookupItem>;
  productLookupDS!: MskDataSource<MskLookupItem>;
  paymentTypeLookupDS!: MskDataSource<MskLookupItem>;

  trackById = (i: number, item: PurchaseInvoice | undefined) => item?.id ?? i;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource = new MskDataSource<PurchaseInvoice>(
      (params) => this._purchasesService.getPurchaseInvoices(params),
      this.sortData,
      this.search.valueChanges,
      this.filterForm.valueChanges,
    );

    // Subscribe to PurchasesService changes and update the data source accordingly
    this._purchasesService.changes$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((evt) => {
      switch (evt.type) {
        case 'create':
          this.dataSource.refresh();
          this._viewport().scrollToIndex(0, 'auto');
          break;
        case 'update':
          this.dataSource.updateWhere((p) => p.id === evt.item.id, evt.item);
          break;
        case 'delete':
          this.dataSource.removeWhere((p) => p.id === evt.id);
          break;
      }
    });

    // Set vendor collection
    this.vendorLookupDS = new MskDataSource<MskLookupItem>(
      (params) => this._vendorsService.getLookupVendors(params),
      new MskSort(DefaultVendorsSortData),
    );
    // Set product collection
    this.productLookupDS = new MskDataSource<MskLookupItem>(
      (params) => this._productsService.getLookupProducts(params),
      new MskSort(DefaultProductsSortData),
    );
    // Set paymentType collection
    this.paymentTypeLookupDS = new MskDataSource<MskLookupItem>(
      (params) => this._paymentTypeService.getLookupPaymentTypes(params),
      new MskSort(),
    );
  }
}
