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
import { Customer, DefaultCustomersSortData } from '../customers.types';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'mz-customers-list',
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
    MskFabExtendedCollapseDirective,
  ],
})
export class CustomersListComponent implements OnInit, AfterViewInit {
  private _destroyRef = inject(DestroyRef);
  private _customersService = inject(CustomersService);

  private _paginator = viewChild.required(MatPaginator);
  private _sort = new MskSort({
    active: DefaultCustomersSortData.active,
    direction: DefaultCustomersSortData.direction,
  });

  isLoading = signal(false);
  pageSizeOptions = MskPageSizeOptions;
  customers$!: Observable<MskPageData<Customer>>;
  filterForm: FormGroup = new FormGroup({
    search: new FormControl<string>(''),
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
    // Get the customers list
    this.customers$ = this._customersService.customers$;
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
        switchMap(() => this.getCustomers()),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get customers list
   */
  getCustomers(): Observable<unknown> {
    // Set isLoading to true
    this.isLoading.set(true);
    // Call api
    return this._customersService
      .getCustomers(new MskPagingRequest(this._paginator(), this._sort, this.filterForm.value))
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
