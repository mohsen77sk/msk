import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { StoreService, Store } from '@msk/mirza/shell/core/store';

@Component({
  selector: 'mz-settings',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [TranslocoDirective, MatIconModule, MatRippleModule, MskAvatarComponent],
})
export class SettingsComponent {
  private _storeService = inject(StoreService);

  currentStore = toSignal(this._storeService.currentStore$);
}
