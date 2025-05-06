import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';
import { MskLoadingBarService } from '@msk/shared/ui/loading-bar';

@Component({
  selector: 'doc-loading-bar',
  templateUrl: './loading-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MskHighlightComponent, MatTabsModule, MatButtonModule],
})
export class DocLoadingBarComponent {
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
