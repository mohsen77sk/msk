import { Component, DestroyRef, OnInit, inject, signal, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { StoreService } from '@msk/mirza/shell/core/store';
import {
  MenuConfig,
  MenuService,
  MenuSettingsDialogComponent,
  MenuSettingsDialogData,
  MenuShareDialogComponent,
} from '@msk/mirza/panel/menu';
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
    RouterLink,
    TranslocoDirective,
    MatIconModule,
    MatRippleModule,
    MatDialogModule,
    MatSlideToggleModule,
    MskAvatarComponent,
    MskSpinnerDirective,
  ],
})
export class SettingsComponent implements OnInit {
  private _dialog = inject(MatDialog);
  private _storeService = inject(StoreService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);
  private _menuService = inject(MenuService);
  private _destroyRef = inject(DestroyRef);

  currentStore = toSignal(this._storeService.currentStore$);
  isLogoUploading = signal<boolean>(false);

  // Digital menu (on/off, address, QR); its products are edited on /panel/menu
  menu = signal<MenuConfig | null>(null);
  menuLoadFailed = signal(false);
  menuSaving = signal(false);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._menuService
      .getMenu()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (menu) => this.menu.set(menu),
        error: () => this.menuLoadFailed.set(true),
      });
  }

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

  /**
   * Switch the public menu on or off. Switching on a menu that has no address yet opens the
   * settings dialog instead, since the address is required.
   *
   * @param enabled
   * @param toggle
   */
  toggleMenu(enabled: boolean, toggle: MatSlideToggle): void {
    const menu = this.menu();
    if (!menu) return;

    if (enabled && !menu.slug) {
      toggle.checked = false;
      this.openMenuSettingsDialog(true);
      return;
    }

    this.menuSaving.set(true);
    this._menuService
      .updateMenu({ enabled, slug: menu.slug ?? '' })
      .pipe(finalize(() => this.menuSaving.set(false)))
      .subscribe({
        next: (saved) => this.menu.set(saved),
        error: () => {
          toggle.checked = menu.enabled;
          this._mskSnackbarService.error(this._translocoService.translate('settings.menu-load-error'));
        },
      });
  }

  openMenuSettingsDialog(enabled?: boolean): void {
    const menu = this.menu();
    if (!menu) return;
    const data: MenuSettingsDialogData = { menu, enabled };
    this._dialog
      .open(MenuSettingsDialogComponent, { data })
      .afterClosed()
      .subscribe((saved?: MenuConfig) => saved && this.menu.set(saved));
  }

  openMenuShareDialog(): void {
    const menu = this.menu();
    if (menu?.slug) this._dialog.open(MenuShareDialogComponent, { data: { menu } });
  }
}
