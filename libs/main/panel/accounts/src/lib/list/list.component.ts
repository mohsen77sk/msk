import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslocoDirective } from '@jsverse/transloco';
import { mskAnimations } from '@msk/shared/animations';
import { MskPageSizeOptions, MskPagination } from '@msk/shared/data-access';
import { Observable, catchError, filter, finalize, map, merge, of, switchMap, tap } from 'rxjs';
import { DefaultAccountSortDirection, DefaultAccountSortId, Account } from '../accounts.types';
import { AccountService } from '../accounts.service';

@Component({
  standalone: true,
  selector: 'main-accounts-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: mskAnimations,
  imports: [
    AsyncPipe,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    CdkScrollable,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    TranslocoDirective,
  ],
})
export class AccountsListComponent implements OnInit, AfterViewInit {
  private _destroyRef = inject(DestroyRef);
  private _accountService = inject(AccountService);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _gridContent = viewChild.required(CdkScrollable);
  private _paginator = viewChild.required(MatPaginator);
  private _sort = viewChild.required(MatSort);

  isLoading = false;
  isFabCollapses = false;
  lastOffsetScroll = 0;
  pageSizeOptions = MskPageSizeOptions;
  pagination!: MskPagination;
  accounts$!: Observable<Account[] | null>;
  filterForm: FormGroup = new FormGroup({
    search: new FormControl<string>(''),
    isActive: new FormControl<boolean | null>(null),
  });

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the pagination
    this._accountService.pagination$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((pagination): pagination is MskPagination => !!pagination)
      )
      .subscribe((pagination) => {
        // Update the pagination
        this.pagination = pagination;
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the account list
    this.accounts$ = this._accountService._accounts$;
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      // Set the initial sort
      this._sort().sort({
        id: DefaultAccountSortId,
        start: DefaultAccountSortDirection,
        disableClear: true,
      });

      // If the user changes the sort order...
      // Reset back to the first page
      this._sort()
        .sortChange.pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => (this._paginator().pageIndex = 0))
        )
        .subscribe();

      // Get persons if sort or page changes
      merge(this._sort().sortChange, this._paginator().page)
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(() => this.getAccounts())
        )
        .subscribe();
    }

    // Get the scrolling
    this._gridContent()
      .elementScrolled()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((data) => (data.target as HTMLElement).scrollTop || 0),
        tap((scrollTop) => {
          const isFabCollapses = scrollTop > 10 ? this.lastOffsetScroll < scrollTop : false;
          // If the FAB collapses state has changed...
          if (this.isFabCollapses !== isFabCollapses) {
            this.isFabCollapses = isFabCollapses;
            this._changeDetectorRef.markForCheck();
          }
          // Update lastOffsetScroll
          this.lastOffsetScroll = scrollTop;
        })
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get account list
   *
   * @param firstPage
   */
  getAccounts(firstPage = false): Observable<unknown> {
    // Set isLoading to true
    this.isLoading = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    return this._accountService
      .getAccounts(
        firstPage ? 1 : this._paginator().pageIndex + 1,
        this._paginator().pageSize,
        `${this._sort().active} ${this._sort().direction}`
      )
      .pipe(
        catchError((response) => {
          // Show error
          // ---
          return of();
        }),
        finalize(() => {
          // Set isLoading to false
          this.isLoading = false;
          // Mark for check
          this._changeDetectorRef.markForCheck();
        })
      );
  }
}
