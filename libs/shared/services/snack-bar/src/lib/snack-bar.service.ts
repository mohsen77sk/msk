import { Direction } from '@angular/cdk/bidi';
import { inject, Injectable, DOCUMENT } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { MskSnackbarComponent } from './snack-bar/snack-bar.component';
import { MskSnackBarConfig } from './snack-bar.types';

@Injectable({ providedIn: 'root' })
export class MskSnackbarService {
  private _document: Document = inject(DOCUMENT);
  private _matSnackBar: MatSnackBar = inject(MatSnackBar);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * open basic snackbar
   *
   * @param message
   * @param title
   * @param dismissible
   */
  basic(message: string, title?: string, dismissible?: boolean): MatSnackBarRef<MskSnackbarComponent> {
    return this.open({
      type: 'basic',
      title: title,
      message: message,
      dismissible: dismissible ?? false,
    });
  }

  /**
   * open info snackbar
   *
   * @param message
   * @param title
   * @param dismissible
   */
  info(message: string, title?: string, dismissible?: boolean): MatSnackBarRef<MskSnackbarComponent> {
    return this.open({
      type: 'info',
      title: title,
      message: message,
      dismissible: dismissible ?? false,
    });
  }

  /**
   * open success snackbar
   *
   * @param message
   * @param title
   * @param dismissible
   */
  success(message: string, title?: string, dismissible?: boolean): MatSnackBarRef<MskSnackbarComponent> {
    return this.open({
      type: 'success',
      title: title,
      message: message,
      dismissible: dismissible ?? false,
    });
  }

  /**
   * open warning snackbar
   *
   * @param message
   * @param title
   * @param dismissible
   */
  warning(message: string, title?: string, dismissible?: boolean): MatSnackBarRef<MskSnackbarComponent> {
    return this.open({
      type: 'warning',
      title: title,
      message: message,
      dismissible: dismissible ?? false,
    });
  }

  /**
   * open error snackbar
   *
   * @param message
   * @param title
   * @param dismissible
   */
  error(message: string, title?: string, dismissible?: boolean): MatSnackBarRef<MskSnackbarComponent> {
    return this.open({
      type: 'error',
      title: title,
      message: message,
      dismissible: dismissible ?? false,
    });
  }

  /**
   * Open the snackbar
   *
   * @param config
   * @returns
   */
  open(config: MskSnackBarConfig): MatSnackBarRef<MskSnackbarComponent> {
    // Merge the user config with the default config
    const userConfig: MatSnackBarConfig = {
      duration: config.dismissible ? 99999999 : 5000,
      direction: this._document.body.getAttribute('dir') as Direction,
      data: config,
    };

    // Open the snackBar
    return this._matSnackBar.openFromComponent(MskSnackbarComponent, userConfig);
  }
}
