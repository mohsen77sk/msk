import { AsyncPipe } from '@angular/common';
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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslocoDirective } from '@jsverse/transloco';
import { mskAnimations } from '@msk/shared/animations';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskPageData, MskPageSizeOptions, MskPagingRequest, MskSort } from '@msk/shared/data-access';
import { MskFabExtendedCollapseDirective } from '@msk/shared/directives/fab-extended-collapse';
import { EMPTY, Observable, catchError, debounceTime, finalize, merge, switchMap, tap } from 'rxjs';
import { DefaultPeopleSortData, Person } from '../people.types';
import { PeopleService } from '../people.service';
import { PeopleStatusComponent } from '../common/status/status.component';

@Component({
  selector: 'sz-people-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: mskAnimations,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    TranslocoDirective,
    MskAvatarComponent,
    PeopleStatusComponent,
    MskFabExtendedCollapseDirective,
  ],
})
export class PeopleListComponent implements OnInit, AfterViewInit {
  private _destroyRef = inject(DestroyRef);
  private _peopleService = inject(PeopleService);

  private _paginator = viewChild.required(MatPaginator);
  private _sort = new MskSort({
    active: DefaultPeopleSortData.active,
    direction: DefaultPeopleSortData.direction,
  });

  isLoading = signal(false);
  pageSizeOptions = MskPageSizeOptions;
  persons$!: Observable<MskPageData<Person>>;
  filterForm: FormGroup = new FormGroup({
    search: new FormControl<string>(''),
    isActive: new FormControl<boolean | null>(null),
  });

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for change of filter value
   */
  get filterValueChange(): Observable<unknown> {
    return this.filterForm.valueChanges.pipe(debounceTime(300));
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the persons list
    this.persons$ = this._peopleService.persons$;
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    // If the user changes the sort order or add filter...
    // Reset back to the first page
    merge(this._sort.sortChange, this.filterValueChange)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap(() => (this._paginator().pageIndex = 0)),
      )
      .subscribe();

    // Get customers if sort or page or filter changes
    merge(this._sort.sortChange, this._paginator().page, this.filterValueChange)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        switchMap(() => this.getPersons()),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get persons list
   */
  getPersons(): Observable<unknown> {
    // Set isLoading to true
    this.isLoading.set(true);
    // Call api
    return this._peopleService
      .getPersons(new MskPagingRequest(this._paginator(), this._sort, this.filterForm.value))
      .pipe(
        catchError((response) => {
          // Show error
          // ---
          return EMPTY;
        }),
        finalize(() => {
          // Set isLoading to false
          this.isLoading.set(false);
        }),
      );
  }
}
