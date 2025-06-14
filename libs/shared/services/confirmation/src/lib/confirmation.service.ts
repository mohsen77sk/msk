
import { inject, Injectable, DOCUMENT } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MskConfirmationConfig } from './confirmation.types';
import { MskConfirmationDialogComponent } from './dialog/dialog.component';
import { merge } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class MskConfirmationService {
  private _document: Document = inject(DOCUMENT);
  private _matDialog: MatDialog = inject(MatDialog);

  private _defaultConfig: MskConfirmationConfig = {
    title: '',
    message: '',
    actions: {
      confirm: {
        show: true,
        label: 'Confirm',
      },
      cancel: {
        show: true,
        label: 'Cancel',
      },
    },
    dismissible: false,
  };

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Opens the confirm dialog
   *
   * @param config
   * @returns
   */
  open(config: MskConfirmationConfig = {}): MatDialogRef<MskConfirmationDialogComponent> {
    // Merge the user config with the default config
    const userConfig = merge({}, this._defaultConfig, config);

    // Open the dialog
    return this._matDialog.open(MskConfirmationDialogComponent, {
      autoFocus: false,
      direction: this._document.body.getAttribute('dir') as Direction,
      disableClose: !userConfig.dismissible,
      data: userConfig,
      panelClass: 'msk-confirmation-dialog-panel',
    });
  }
}
