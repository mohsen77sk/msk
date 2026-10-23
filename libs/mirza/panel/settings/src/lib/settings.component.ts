import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { StoreService } from '@msk/mirza/shell/core/store';
import { finalize } from 'rxjs';
import { NameDialogComponent } from './common/name-dialog/name-dialog.component';
import { NationalIdDialogComponent } from './common/national-id-dialog/national-id-dialog.component';
import { EconomicCodeDialogComponent } from './common/economic-code-dialog/economic-code-dialog.component';
import { PhoneDialogComponent } from './common/phone-dialog/phone-dialog.component';
import { PostalCodeDialogComponent } from './common/postal-code-dialog/postal-code-dialog.component';
import { AddressDialogComponent } from './common/address-dialog/address-dialog.component';

@Component({
  selector: 'mz-settings',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    TranslocoDirective,
    MatIconModule,
    MatRippleModule,
    MatDialogModule,
    MskAvatarComponent,
    MskSpinnerDirective,
  ],
})
export class SettingsComponent {
  private _dialog = inject(MatDialog);
  private _storeService = inject(StoreService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);

  currentStore = toSignal(this._storeService.currentStore$);
  isLogoUploading = signal<boolean>(false);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Upload current store logo
   *
   * @param event
   */
  uploadCurrentStoreLogo(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this._mskSnackbarService.error(this._translocoService.translate('upload-image.ext-error'));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this._mskSnackbarService.error(this._translocoService.translate('upload-image.size-error'));
      return;
    }

    this.isLogoUploading.set(true);

    this._storeService
      .uploadStoreLogo(this.currentStore()?.id ?? 0, file)
      .pipe(finalize(() => this.isLogoUploading.set(false)))
      .subscribe({
        error: () => {
          this._mskSnackbarService.error(this._translocoService.translate('upload-image.upload-error'));
        },
      });
  }

  openNameDialog(): void {
    this._dialog.open(NameDialogComponent).afterClosed().subscribe();
  }

  openNationalIdDialog(): void {
    this._dialog.open(NationalIdDialogComponent).afterClosed().subscribe();
  }

  openEconomicCodeDialog(): void {
    this._dialog.open(EconomicCodeDialogComponent).afterClosed().subscribe();
  }

  openPhoneDialog(): void {
    this._dialog.open(PhoneDialogComponent).afterClosed().subscribe();
  }

  openPostalCodeDialog(): void {
    this._dialog.open(PostalCodeDialogComponent).afterClosed().subscribe();
  }

  openAddressDialog(): void {
    this._dialog.open(AddressDialogComponent).afterClosed().subscribe();
  }
}
