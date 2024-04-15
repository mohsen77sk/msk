import { Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MskServiceWorkerSnackBarComponent } from './service-worker-snack-bar/service-worker-snack-bar.component';

@Injectable({ providedIn: 'root' })
export class MskServiceWorkerService {
  /**
   * Constructor
   */
  constructor(private _swUpdate: SwUpdate, private _matSnackBar: MatSnackBar) {
    // If the service worker is enabled
    if (_swUpdate.isEnabled) {
      // Check for update
      _swUpdate.checkForUpdate();

      // Version is ready
      _swUpdate.versionUpdates.subscribe((res: VersionEvent) => {
        if (res.type === 'VERSION_READY') {
          // Show message
          _matSnackBar.openFromComponent(MskServiceWorkerSnackBarComponent, {
            duration: 10000,
          });
        }
      });
    } else {
      console.warn('Not enable Service Worker 🙁');
    }
  }
}
