import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';
import { MskLoadingBarService } from '../loading-bar.service';

@Component({
  selector: 'msk-docs-loading-bar',
  templateUrl: './docs-loading-bar.component.html',
  styleUrl: './docs-loading-bar.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MskHighlightComponent, MatTabsModule, MatButtonModule],
})
export class MskDocsLoadingBarComponent {
  private _mskLoadingService = inject(MskLoadingBarService);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the loading bar
   */
  showLoadingBar(): void {
    this._mskLoadingService.show();
  }

  /**
   * Hide the loading bar
   */
  hideLoadingBar(): void {
    this._mskLoadingService.hide();
  }
}
