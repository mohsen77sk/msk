import { AfterViewInit, Component, DOCUMENT, ViewEncapsulation, inject } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MenuConfig } from '../menu.types';
import { downloadMenuQrCode, menuPublicUrl, renderMenuQrCode } from '../menu-qr';

/**
 * Public link and QR code of a menu that has a slug
 */
@Component({
  selector: 'mz-menu-share-dialog',
  templateUrl: './menu-share-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, TranslocoDirective, MskAlertComponent],
})
export class MenuShareDialogComponent implements AfterViewInit {
  readonly data = inject<{ menu: MenuConfig }>(MAT_DIALOG_DATA);
  private _dialogRef = inject(MatDialogRef<MenuShareDialogComponent>);
  private _document = inject(DOCUMENT);
  private _clipboard = inject(Clipboard);
  private _snackbarService = inject(MskSnackbarService);
  private _translocoService = inject(TranslocoService);

  readonly url = menuPublicUrl(inject(MSK_APP_CONFIG).frontendOrigin, this.data.menu.slug) ?? '';
  readonly qrCode = this.url ? renderMenuQrCode(this._document, this.url) : null;

  ngAfterViewInit(): void {
    this._dialogRef.updateSize('480px');
  }

  copyUrl(): void {
    if (this.url && this._clipboard.copy(this.url)) {
      this._snackbarService.success(this._translocoService.translate('menu.share.copied'));
    }
  }

  download(format: 'png' | 'svg'): void {
    if (this.qrCode && this.data.menu.slug) {
      downloadMenuQrCode(this._document, this.qrCode, this.data.menu.slug, format);
    }
  }
}
