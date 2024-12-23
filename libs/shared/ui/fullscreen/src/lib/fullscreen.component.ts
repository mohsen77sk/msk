import { ChangeDetectionStrategy, Component, TemplateRef, ViewEncapsulation, inject, input } from '@angular/core';
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'msk-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss'],
  exportAs: 'mskFullscreen',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, NgTemplateOutlet],
})
export class MskFullscreenComponent {
  private _document = inject(DOCUMENT);

  iconTpl = input<TemplateRef<unknown>>();
  tooltip = input<string>();

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle the fullscreen mode
   */
  toggleFullscreen(): void {
    if (!this._document.fullscreenEnabled) {
      console.log('Fullscreen is not available in this browser.');
      return;
    }

    // Check if the fullscreen is already open
    const fullScreen = this._document.fullscreenElement;

    // Toggle the fullscreen
    if (fullScreen) {
      this._document.exitFullscreen();
    } else {
      this._document.documentElement.requestFullscreen().catch(() => {
        console.error('Entering fullscreen mode failed.');
      });
    }
  }
}
