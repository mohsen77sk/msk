import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MskServiceWorkerSnackBarComponent } from './service-worker-snack-bar/service-worker-snack-bar.component';

@Injectable({ providedIn: 'root' })
export class MskServiceWorkerService {
  private _swUpdate = inject(SwUpdate);
  private _matSnackBar = inject(MatSnackBar);

  /**
   * Constructor
   */
  constructor() {
    // If the service worker is enabled
    if (this._swUpdate.isEnabled) {
      // Check for update
      this._swUpdate.checkForUpdate();

      // Version is ready
      this._swUpdate.versionUpdates.subscribe((res: VersionEvent) => {
        if (res.type === 'VERSION_READY') {
          // Show message
          this._matSnackBar.openFromComponent(MskServiceWorkerSnackBarComponent, {
            duration: 10000,
          });
        }
      });
    } else {
      console.warn('Not enable Service Worker 🙁');
    }
  }
}
