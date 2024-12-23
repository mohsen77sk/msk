import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MskDialogDataAction } from '@msk/shared/data-access';
import { AccountsListComponent } from '../list/list.component';
import { AccountsCardDetailsComponent } from './details/details.component';

@Component({
  standalone: true,
  selector: 'main-accounts-card',
  template: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AccountsCardComponent implements OnInit {
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
      .open(AccountsCardDetailsComponent, {
        autoFocus: action !== 'view',
        disableClose: action !== 'view',
        data: {
          action,
          item: this._activatedRoute.snapshot.data['card'],
        },
      })
      .afterClosed()
      .subscribe((result) => {
        // Refresh list if needed
        if (action === 'new' && result != 'cancelled') {
          this._injector.get(AccountsListComponent).getAccounts().subscribe();
        }
        // Go back to list page
        this._router.navigate([this._activatedRoute.snapshot.url.map(() => '../').join('')], {
          relativeTo: this._activatedRoute,
        });
      });
  }
}
