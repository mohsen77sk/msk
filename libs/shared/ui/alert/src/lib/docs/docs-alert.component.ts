import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';
import { MskAlertComponent } from '../alert.component';
import { MskAlertService } from '../alert.service';

@Component({
  selector: 'msk-docs-alert',
  templateUrl: './docs-alert.component.html',
  styleUrl: './docs-alert.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MskAlertComponent, MskHighlightComponent, MatTabsModule, MatButtonModule],
})
export class MskDocsAlertComponent {
  private _mskAlertService = inject(MskAlertService);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Dismiss the alert via the service
   *
   * @param name
   */
  dismiss(name: string): void {
    this._mskAlertService.dismiss(name);
  }

  /**
   * Show the alert via the service
   *
   * @param name
   */
  show(name: string): void {
    this._mskAlertService.show(name);
  }
}
