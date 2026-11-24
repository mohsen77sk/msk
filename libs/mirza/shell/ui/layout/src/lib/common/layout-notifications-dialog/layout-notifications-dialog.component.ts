import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoDirective } from '@jsverse/transloco';
import { NotificationsService } from '@msk/mirza/shell/core/notifications';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';

@Component({
  selector: 'mz-layout-notifications-dialog',
  templateUrl: './layout-notifications-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MatDialogModule, MatSlideToggleModule, MatButtonModule, MatIconModule, TranslocoDirective],
})
export class LayoutNotificationsDialogComponent {
  private _snackbar = inject(MskSnackbarService);
  readonly notifications = inject(NotificationsService);

  /** Turn browser notifications on or off for this device. */
  async toggle(event: MatSlideToggleChange): Promise<void> {
    if (event.checked) {
      const ok = await this.notifications.enablePush();
      if (!ok) {
        event.source.checked = false;
        this._snackbar.error('فعال‌سازی نوتیف انجام نشد. اجازهٔ اعلان مرورگر را بررسی کنید.');
      }
    } else {
      await this.notifications.disablePush();
    }
  }

  async test(): Promise<void> {
    this.notifications.playSound();
    try {
      await this.notifications.sendTest();
    } catch {
      this._snackbar.error('ارسال نوتیف آزمایشی ناموفق بود.');
    }
  }
}
