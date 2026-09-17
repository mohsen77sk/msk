import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MskDialogDataAction } from '@msk/shared/data-access';
import { SalesCardDetailsComponent } from './details/details.component';
import { SaleInvoice, SalesDetailsCloseResult } from '../sales.types';

@Component({
  selector: 'mz-sales-card',
  template: '',
  encapsulation: ViewEncapsulation.None,
  imports: [],
})
export class SalesCardComponent implements OnInit {
  private _router = inject(Router);
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
      .subscribe((result: SaleInvoice | SalesDetailsCloseResult | undefined) => {
        // Customer name was clicked in the details dialog - go to that
        // customer's own detail dialog instead of back to the sales list.
        if (result && 'navigateToCustomerId' in result) {
          this._router.navigate(['/panel/customers/card/view', result.navigateToCustomerId]);
          return;
        }
        // Go back to list page
        this._router.navigate([this._activatedRoute.snapshot.url.map(() => '../').join('')], {
          relativeTo: this._activatedRoute,
        });
      });
  }
}
