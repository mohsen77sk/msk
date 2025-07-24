import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, inject, Injector, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MskDialogDataAction } from '@msk/shared/data-access';
import { SalesListComponent } from '../list/list.component';
import { SalesCardDetailsComponent } from './details/details.component';

@Component({
  selector: 'mz-sales-card',
  template: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class SalesCardComponent implements OnInit {
  private _router = inject(Router);
  private _injector = inject(Injector);
  private _matDialog = inject(MatDialog);
  private _activatedRoute = inject(ActivatedRoute);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const action = this._activatedRoute.snapshot.url[1].path as MskDialogDataAction;

    // Launch the modal
    this._matDialog
      .open(SalesCardDetailsComponent, {
        autoFocus: action !== 'view',
        disableClose: action !== 'view',
        data: {
          action: signal(action),
          item: signal(this._activatedRoute.snapshot.data['card']),
        },
      })
      .afterClosed()
      .subscribe((result) => {
        // Refresh list if needed
        if (action === 'new' && result != 'cancelled') {
          this._injector.get(SalesListComponent).getSales().subscribe();
        }
        // Go back to list page
        this._router.navigate([this._activatedRoute.snapshot.url.map(() => '../').join('')], {
          relativeTo: this._activatedRoute,
        });
      });
  }
}
