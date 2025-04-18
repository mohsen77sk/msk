import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
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
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskPageData, MskPageSizeOptions } from '@msk/shared/data-access';
import { EMPTY, Observable, catchError, finalize, map, merge, switchMap, tap } from 'rxjs';
import { DefaultAccountSortDirection, DefaultAccountSortId, Account } from '../accounts.types';
import { AccountService } from '../accounts.service';
import { AccountsStatusComponent } from '../common/status/status.component';

@Component({
  selector: 'main-accounts-list',
  templateUrl: './list.component.html',
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
    MskAvatarComponent,
    AccountsStatusComponent,
  ],
})
export class AccountsListComponent implements OnInit, AfterViewInit {
  private _destroyRef = inject(DestroyRef);
  private _accountService = inject(AccountService);

  private _gridContent = viewChild.required(CdkScrollable);
  private _paginator = viewChild.required(MatPaginator);
  private _sort = new MatSort(); // viewChild.required(MatSort);

  isLoading = signal(false);
  isFabCollapses = signal(false);
  lastOffsetScroll = 0;
  pageSizeOptions = MskPageSizeOptions;
  accounts$!: Observable<MskPageData<Account>>;
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
    // Get the account list
    this.accounts$ = this._accountService.accounts$;
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      // Set the initial sort
      this._sort.sort({
        id: DefaultAccountSortId,
        start: DefaultAccountSortDirection,
        disableClear: true,
      });

      // If the user changes the sort order...
      // Reset back to the first page
      this._sort.sortChange
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => (this._paginator().pageIndex = 0))
        )
        .subscribe();

      // Get persons if sort or page changes
      merge(this._sort.sortChange, this._paginator().page)
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
          if (this.isFabCollapses() !== isFabCollapses) {
            this.isFabCollapses.set(isFabCollapses);
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
    this.isLoading.set(true);
    // Call api
    return this._accountService
      .getAccounts(
        firstPage ? 1 : this._paginator().pageIndex + 1,
        this._paginator().pageSize,
        `${this._sort.active} ${this._sort.direction}`
      )
      .pipe(
        catchError((response) => {
          // Show error
          // ---
          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      );
  }
}
