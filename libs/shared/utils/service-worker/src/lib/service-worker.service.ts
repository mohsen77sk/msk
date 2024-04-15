import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class MskServiceWorkerService {
  /**
   * Constructor
   */
  constructor() {
    const swUpdate = inject(SwUpdate);

    // If the service worker is enabled
    if (swUpdate.isEnabled) {
      // Check for update
      swUpdate.checkForUpdate();

      // Version is ready
      swUpdate.versionUpdates.subscribe((res: VersionEvent) => {
        if (res.type === 'VERSION_READY') {
          //
          // This section must be updated to the latest version
          //
        }
      });
    } else {
      console.warn('Not enable Service Worker 🙁');
    }
  }
}
