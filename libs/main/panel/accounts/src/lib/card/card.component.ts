import { getLocaleDirection } from '@angular/common';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
  Injector,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Direction } from '@angular/cdk/bidi';
import { MatDialog } from '@angular/material/dialog';
import { MskDialogDataAction } from '@msk/shared/data-access';
import { MskLayoutConfigService } from '@msk/shared/services/config';
import { AccountsListComponent } from '../list/list.component';
import { AccountsCardDetailsComponent } from './details/details.component';
import { map } from 'rxjs';

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
  private _destroyRef = inject(DestroyRef);
  private _activatedRoute = inject(ActivatedRoute);
  private _mskLayoutConfigService = inject(MskLayoutConfigService);

  layoutDirection!: Direction;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const action = this._activatedRoute.snapshot.url[1].path as MskDialogDataAction;

    // Subscribe to config changes
    this._mskLayoutConfigService.config$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((config) => (this.layoutDirection = getLocaleDirection(config.locale)))
      )
      .subscribe();

    // Launch the modal
    this._matDialog
      .open(AccountsCardDetailsComponent, {
        autoFocus: action !== 'view',
        disableClose: action !== 'view',
        direction: this.layoutDirection,
        data: {
          action,
          item: this._activatedRoute.snapshot.data['card'],
        },
      })
      .afterClosed()
      .subscribe((result) => {
        // Refresh list if needed
        if (action !== 'view' && result != 'cancelled') {
          this._injector.get(AccountsListComponent).getAccounts().subscribe();
        }
        // Go back to list page
        this._router.navigate([this._activatedRoute.snapshot.url.map(() => '../').join('')], {
          relativeTo: this._activatedRoute,
        });
      });
  }
}
