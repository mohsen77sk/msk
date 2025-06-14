import { ChangeDetectionStrategy, Component, HostBinding, inject, ViewEncapsulation } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel } from '@angular/material/snack-bar';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'msk-service-worker-snack-bar',
  templateUrl: './service-worker-snack-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSnackBarAction,
    MatSnackBarActions,
    MatSnackBarLabel,
    TranslocoDirective,
  ],
})
export class MskServiceWorkerSnackBarComponent {
  private _swUpdate = inject(SwUpdate);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Host binding for component classes
   */
  @HostBinding('class.flex')

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reload
   */
  reload(): void {
    this._swUpdate.activateUpdate().then(() => document.location.reload());
  }
}
