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
import { startWith } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { mskAnimations } from '@msk/shared/animations';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { MskEmptyStateComponent } from '@msk/shared/ui/empty-state';
import { DateRange, DateRangeFactory, MskFilterDateComponent } from '@msk/shared/ui/filter-date';
import { MskFilterMenuComponent } from '@msk/shared/ui/filter-menu';
import { MskSortMenuComponent, SortMenuItem } from '@msk/shared/ui/sort-menu';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { MskFabExtendedCollapseDirective } from '@msk/shared/directives/fab-extended-collapse';
import { MskDataSource, MskLookupItem, MskSort } from '@msk/shared/data-access';
import { PaymentTypeService } from '@msk/mirza/shell/core/payment-type';
import { SaleInvoice, DefaultSalesSortData } from '../sales.types';
import { SalesService } from '../sales.service';
import { CustomersService, DefaultCustomersSortData } from '@msk/mirza/panel/customers';
import { DefaultProductsSortData, ProductsService } from '@msk/mirza/panel/products';
import { Locale } from 'date-fns';

@Component({
  selector: 'mz-sales-list',
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
export class SalesListComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _salesService = inject(SalesService);
  private _productsService = inject(ProductsService);
  private _customersService = inject(CustomersService);
  private _paymentTypeService = inject(PaymentTypeService);
  private _viewport = viewChild.required(CdkVirtualScrollViewport);
  private _matDateLocale = inject(MAT_DATE_LOCALE) as Locale;

  dataSource!: MskDataSource<SaleInvoice>;

  sortItems: SortMenuItem[] = [
    { key: 'number', label: 'sales.sort.number' },
    { key: 'saleDate', label: 'sales.sort.createdAt' },
  ];
  sortData = new MskSort({
    active: DefaultSalesSortData.active,
    direction: DefaultSalesSortData.direction,
  });
  search = new FormControl<string>('');
  filterForm: FormGroup = new FormGroup({
    dateRange: new FormControl<DateRange | null>(DateRangeFactory.fromKey('today', this._matDateLocale)),
    customerId: new FormControl<number | null>(null),
    productId: new FormControl<number | null>(null),
    paymentType: new FormControl<string | null>(null),
  });
  customerLookupDS!: MskDataSource<MskLookupItem>;
  productLookupDS!: MskDataSource<MskLookupItem>;
  paymentTypeLookupDS!: MskDataSource<MskLookupItem>;

  trackById = (i: number, item: SaleInvoice | undefined) => item?.id ?? i;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource = new MskDataSource<SaleInvoice>(
      (params) => this._salesService.getSaleInvoices(params),
      this.sortData,
      this.search.valueChanges,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    );

    // Subscribe to SalesService changes and update the data source accordingly
    this._salesService.changes$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((evt) => {
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

    // Set customer collection
    this.customerLookupDS = new MskDataSource<MskLookupItem>(
      (params) => this._customersService.getLookupCustomers(params),
      new MskSort(DefaultCustomersSortData),
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
