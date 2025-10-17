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
import { MskSortMenuComponent, SortMenuItem } from '@msk/shared/ui/sort-menu';
import { MskCurrencySymbolDirective } from '@msk/shared/directives/currency-symbol';
import { MskFabExtendedCollapseDirective } from '@msk/shared/directives/fab-extended-collapse';
import { MskDataSource, MskSort } from '@msk/shared/data-access';
import { SaleInvoice, DefaultSalesSortData } from '../sales.types';
import { SalesService } from '../sales.service';

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
    MskEmptyStateComponent,
    MskCurrencySymbolDirective,
    MskFabExtendedCollapseDirective,
  ],
})
export class SalesListComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _salesService = inject(SalesService);
  private _viewport = viewChild.required(CdkVirtualScrollViewport);

  dataSource!: MskDataSource<SaleInvoice>;

  sortItems: SortMenuItem[] = [
    { key: 'number', label: 'sales.sort.number' },
    { key: 'createdAt', label: 'sales.sort.createdAt' },
  ];
  sortData = new MskSort({
    active: DefaultSalesSortData.active,
    direction: DefaultSalesSortData.direction,
  });
  search = new FormControl<string>('');
  filterForm: FormGroup = new FormGroup({
    isActive: new FormControl<boolean | null>(null),
  });

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
  }
}
