import { Component, DestroyRef, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';
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
  private _destroyRef = inject(DestroyRef);

  // The single currently-open dialog, if any - the only source of truth
  // for "is a dialog open right now". Each afterClosed() handler (below)
  // compares itself against this before doing anything, so a close event
  // from a dialog that's already been superseded (by a newer combineLatest
  // emission opening a replacement) is recognized as stale and ignored,
  // rather than stacking a second dialog or firing a stray navigation.
  private _dialogRef?: MatDialogRef<SalesCardDetailsComponent>;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribed, not read once from .snapshot - Angular's default route
    // reuse strategy keeps this component instance alive when only the
    // :id param changes (card/view/:id1 -> card/view/:id2 is the same
    // route config), so ngOnInit itself never re-runs for that. Reading
    // .snapshot once here would leave the dialog stuck showing whichever
    // order it was first opened for, even though the URL/resolved data
    // have already moved on.
    //
    // This can genuinely fire more than once for what's effectively the
    // same navigation - .url and .data are independent BehaviorSubjects
    // that don't necessarily settle in lockstep, so combineLatest can emit
    // an initial pairing followed quickly by a corrected one. The
    // _dialogRef-close-before-open below (replace, don't stack) handles
    // that safely regardless of how many times this fires.
    combineLatest([this._activatedRoute.url, this._activatedRoute.data])
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(([urlSegments, data]) => {
        const action = urlSegments[1].path as MskDialogDataAction;

        // Replace, don't stack, if a dialog from a previous emission (or a
        // previous :id) is still open. Safe to call even if _dialogRef is
        // already closed/undefined.
        this._dialogRef?.close();

        // Launch the modal
        const dialogRef = this._matDialog.open(SalesCardDetailsComponent, {
          autoFocus: action !== 'view',
          disableClose: action !== 'view',
          data: {
            action: signal(action),
            item: signal(data['card']),
          },
        });
        this._dialogRef = dialogRef;

        dialogRef
          .afterClosed()
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe((result: SaleInvoice | SalesDetailsCloseResult | undefined) => {
            // Stale close - _dialogRef has already moved on to a newer
            // dialog (opened above, or by a later emission entirely), so
            // this particular closure carries no navigation intent.
            if (this._dialogRef !== dialogRef) return;
            this._dialogRef = undefined;

            // Customer name was clicked in the details dialog - go to that
            // customer's own detail dialog instead of back to the sales list.
            if (result && 'navigateToCustomerId' in result) {
              this._router.navigate(['/panel/customers/card/view', result.navigateToCustomerId]);
              return;
            }
            // Go back to list page. Absolute, not the previous
            // .snapshot.url.map(() => '../').join('') relative-segment
            // trick - that counted 3 '../' (one per URL segment consumed
            // by the single 'card/view/:id' route config: 'card', 'view',
            // ':id'), but this route is only one level below the sales
            // list's own route node in the ActivatedRoute tree, so it
            // overshot past /panel/sales instead of landing on it.
            this._router.navigate(['/panel/sales']);
          });
      });
  }
}
