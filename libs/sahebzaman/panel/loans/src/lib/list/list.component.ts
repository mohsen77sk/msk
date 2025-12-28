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
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { MskSortMenuComponent, SortMenuItem } from '@msk/shared/ui/sort-menu';
import { MskDataSource, MskSort } from '@msk/shared/data-access';
import { MskFabExtendedCollapseDirective } from '@msk/shared/directives/fab-extended-collapse';
import { LoanService } from '../loans.service';
import { DefaultLoansSortData, Loan } from '../loans.types';

@Component({
  selector: 'sz-loans-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MskSortMenuComponent,
    MskFabExtendedCollapseDirective,
  ],
})
export class LoansListComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _loanService = inject(LoanService);
  private _viewport = viewChild.required(CdkVirtualScrollViewport);

  dataSource!: MskDataSource<Loan>;

  sortItems: SortMenuItem[] = [{ key: 'code', label: 'loans.sort.code' }];
  sortData = new MskSort({
    active: DefaultLoansSortData.active,
    direction: DefaultLoansSortData.direction,
  });
  search = new FormControl<string>('');
  filterForm: FormGroup = new FormGroup({
    isActive: new FormControl<boolean | null>(null),
  });

  trackById = (i: number, item: Loan | undefined) => item?.id ?? i;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource = new MskDataSource<Loan>(
      (params) => this._loanService.getLoans(params),
      this.sortData,
      this.search.valueChanges,
      this.filterForm.valueChanges,
    );

    // Subscribe to LoanService changes and update the data source accordingly
    this._loanService.changesLoans$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((evt) => {
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
