import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
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
import { Observable, catchError, filter, finalize, merge, of, switchMap } from 'rxjs';
import { DefaultPeopleSortDirection, DefaultPeopleSortId, Person } from '../people.types';
import { PeopleService } from '../people.service';
import { UsersStatusComponent } from '../common/status/status.component';

@Component({
  standalone: true,
  selector: 'main-people-list',
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
    UsersStatusComponent,
  ],
})
export class PeopleListComponent implements OnInit, AfterViewInit {
  private _destroyRef = inject(DestroyRef);
  private _peopleService = inject(PeopleService);
  private _scrollDispatcher = inject(ScrollDispatcher);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) private _paginator!: MatPaginator;
  @ViewChild(MatSort) private _sort!: MatSort;

  isLoading = false;
  isFabCollapses = false;
  lastOffsetScroll = 0;
  pageSizeOptions = MskPageSizeOptions;
  pagination!: MskPagination;
  persons$!: Observable<Person[] | null>;
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
    // Get the scrolling
    this._scrollDispatcher
      .scrolled()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((data) => data !== undefined)
      )
      .subscribe((data) => {
        // Check for scrolling
        const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
        this.isFabCollapses = scrollTop > 10 ? this.lastOffsetScroll < scrollTop : false;
        this.lastOffsetScroll = scrollTop;
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the pagination
    this._peopleService.pagination$
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

    // Get the persons list
    this.persons$ = this._peopleService._persons$;
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      // Set the initial sort
      this._sort.sort({
        id: DefaultPeopleSortId,
        start: DefaultPeopleSortDirection,
        disableClear: true,
      });

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // If the user changes the sort order...
      this._sort.sortChange.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
        // Reset back to the first page
        this._paginator.pageIndex = 0;
      });

      // Get persons if sort or page changes
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(switchMap(() => this.getPersons()))
        .subscribe();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get persons list
   *
   * @param firstPage
   */
  getPersons(firstPage = false): Observable<unknown> {
    // Set isLoading to true
    this.isLoading = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    return this._peopleService
      .getPersons(
        firstPage ? 1 : this._paginator.pageIndex + 1,
        this._paginator.pageSize,
        `${this._sort.active} ${this._sort.direction}`
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
