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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskEmptyStateComponent } from '@msk/shared/ui/empty-state';
import { MskSortMenuComponent, SortMenuItem } from '@msk/shared/ui/sort-menu';
import { MskFabExtendedCollapseDirective } from '@msk/shared/directives/fab-extended-collapse';
import { MskDataSource, MskSort } from '@msk/shared/data-access';
import { Vendor, DefaultVendorsSortData } from '../vendors.types';
import { VendorsService } from '../vendors.service';

@Component({
  selector: 'mz-vendors-list',
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
    MskEmptyStateComponent,
    MskFabExtendedCollapseDirective,
  ],
})
export class VendorsListComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _vendorsService = inject(VendorsService);

  private _viewport = viewChild.required(CdkVirtualScrollViewport);

  dataSource!: MskDataSource<Vendor>;

  sortItems: SortMenuItem[] = [
    { key: 'name', label: 'vendors.sort.name' },
    { key: 'createdAt', label: 'vendors.sort.createdAt' },
  ];
  sortData = new MskSort({
    active: DefaultVendorsSortData.active,
    direction: DefaultVendorsSortData.direction,
  });
  search = new FormControl<string>('');

  trackById = (i: number, item: Vendor | undefined) => item?.id ?? i;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource = new MskDataSource<Vendor>(
      (params) => this._vendorsService.getVendors(params),
      this.sortData,
      this.search.valueChanges,
    );

    // Subscribe to VendorsService changes and update the data source accordingly
    this._vendorsService.changes$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((evt) => {
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
