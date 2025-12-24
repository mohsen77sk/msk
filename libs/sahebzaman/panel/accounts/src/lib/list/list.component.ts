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
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskSortMenuComponent, SortMenuItem } from '@msk/shared/ui/sort-menu';
import { MskDataSource, MskSort } from '@msk/shared/data-access';
import { MskFabExtendedCollapseDirective } from '@msk/shared/directives/fab-extended-collapse';
import { AccountService } from '../accounts.service';
import { DefaultAccountsSortData, Account } from '../accounts.types';
import { AccountsStatusComponent } from '../common/status/status.component';

@Component({
  selector: 'sz-accounts-list',
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
    MskAvatarComponent,
    MskSortMenuComponent,
    AccountsStatusComponent,
    MskFabExtendedCollapseDirective,
  ],
})
export class AccountsListComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _accountService = inject(AccountService);
  private _viewport = viewChild.required(CdkVirtualScrollViewport);

  dataSource!: MskDataSource<Account>;

  sortItems: SortMenuItem[] = [{ key: 'code', label: 'accounts.sort.code' }];
  sortData = new MskSort({
    active: DefaultAccountsSortData.active,
    direction: DefaultAccountsSortData.direction,
  });
  search = new FormControl<string>('');
  filterForm: FormGroup = new FormGroup({
    isActive: new FormControl<boolean | null>(null),
  });

  trackById = (i: number, item: Account | undefined) => item?.id ?? i;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource = new MskDataSource<Account>(
      (params) => this._accountService.getAccounts(params),
      this.sortData,
      this.search.valueChanges,
      this.filterForm.valueChanges,
    );

    // Subscribe to AccountService changes and update the data source accordingly
    this._accountService.changesAccounts$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((evt) => {
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
