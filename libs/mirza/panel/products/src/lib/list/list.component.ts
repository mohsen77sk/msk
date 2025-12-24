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
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskFilterMenuComponent } from '@msk/shared/ui/filter-menu';
import { MskEmptyStateComponent } from '@msk/shared/ui/empty-state';
import { MskSortMenuComponent, SortMenuItem } from '@msk/shared/ui/sort-menu';
import { MskDataSource, MskLookupItem, MskSort } from '@msk/shared/data-access';
import { MskFabExtendedCollapseDirective } from '@msk/shared/directives/fab-extended-collapse';
import { DefaultProductCategorySortData, ProductCategoriesService } from '@msk/mirza/panel/product-categories';
import { DefaultProductsSortData, Product } from '../products.types';
import { ProductsService } from '../products.service';

@Component({
  selector: 'mz-products-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MskCurrencyPipe,
    MskAvatarComponent,
    MskSortMenuComponent,
    MskFilterMenuComponent,
    MskEmptyStateComponent,
    MskFabExtendedCollapseDirective,
  ],
})
export class ProductsListComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _productsService = inject(ProductsService);
  private _viewport = viewChild.required(CdkVirtualScrollViewport);
  private _productCategoriesService = inject(ProductCategoriesService);

  dataSource!: MskDataSource<Product>;

  sortItems: SortMenuItem[] = [
    { key: 'name', label: 'products.sort.name' },
    { key: 'createdAt', label: 'products.sort.createdAt' },
  ];
  sortData = new MskSort({
    active: DefaultProductsSortData.active,
    direction: DefaultProductsSortData.direction,
  });
  search = new FormControl<string>('');
  filterForm: FormGroup = new FormGroup({
    categoryId: new FormControl<number | null>(null),
  });
  categoryLookupDS!: MskDataSource<MskLookupItem>;

  trackById = (i: number, item: Product | undefined) => item?.id ?? i;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource = new MskDataSource<Product>(
      (params) => this._productsService.getProducts(params),
      this.sortData,
      this.search.valueChanges,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    );

    // Subscribe to ProductsService changes and update the data source accordingly
    this._productsService.changes$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((evt) => {
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

    // Set category collection
    this.categoryLookupDS = new MskDataSource<MskLookupItem>(
      (params) => this._productCategoriesService.getLookupProductCategories(params),
      new MskSort(DefaultProductCategorySortData),
    );
  }
}
