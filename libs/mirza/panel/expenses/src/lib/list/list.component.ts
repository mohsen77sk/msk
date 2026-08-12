import { Component, DestroyRef, OnInit, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { MskEmptyStateComponent } from '@msk/shared/ui/empty-state';
import { MskSortMenuComponent, SortMenuItem } from '@msk/shared/ui/sort-menu';
import { MskDataSource, MskSort } from '@msk/shared/data-access';
import { MskFabExtendedCollapseDirective } from '@msk/shared/directives/fab-extended-collapse';
import { DefaultExpenseSortData, Expense } from '../expenses.types';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'mz-expenses-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
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
    TranslocoPipe,
    MskCurrencyPipe,
    MskDateTimePipe,
    MskSortMenuComponent,
    MskEmptyStateComponent,
    MskFabExtendedCollapseDirective,
  ],
})
export class ExpensesListComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _expensesService = inject(ExpensesService);
  private _viewport = viewChild.required(CdkVirtualScrollViewport);

  dataSource!: MskDataSource<Expense>;

  sortItems: SortMenuItem[] = [
    { key: 'date', label: 'expenses.sort.date' },
    { key: 'cost', label: 'expenses.sort.cost' },
    { key: 'createdAt', label: 'expenses.sort.createdAt' },
  ];
  sortData = new MskSort({
    active: DefaultExpenseSortData.active,
    direction: DefaultExpenseSortData.direction,
  });
  search = new FormControl<string>('');

  trackById = (i: number, item: Expense | undefined) => item?.id ?? i;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource = new MskDataSource<Expense>(
      (params) => this._expensesService.getExpenses(params),
      this.sortData,
      this.search.valueChanges,
    );

    // Subscribe to expense changes and update the data source accordingly
    this._expensesService.changes$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((evt) => {
      switch (evt.type) {
        case 'create':
          this.dataSource.refresh();
          this._viewport().scrollToIndex(0, 'auto');
          break;
        case 'update':
          this.dataSource.updateWhere((e) => e.id === evt.item.id, evt.item);
          break;
        case 'delete':
          this.dataSource.removeWhere((e) => e.id === evt.id);
          break;
      }
    });
  }
}
