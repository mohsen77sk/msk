import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MskSplashScreenService } from '@msk/shared/services/splash-screen';
import { LayoutCurrencyCode, MskLayoutConfigService } from '@msk/shared/services/config';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'mz-layout-currency-dialog',
  templateUrl: './layout-currency-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatRadioModule, MatDialogModule, TranslocoDirective],
})
export class LayoutCurrencyDialogComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _layoutConfigService = inject(MskLayoutConfigService);
  private _splashScreenService = inject(MskSplashScreenService);

  layoutCurrencyCode!: LayoutCurrencyCode;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this._layoutConfigService.config$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((config) => {
      // Get the config
      this.layoutCurrencyCode = config.currencyCode;
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set the active currency
   *
   * @param event
   */
  setCurrencyCode(event: MatRadioChange): void {
    // Show splash screen
    this._splashScreenService.show();

    setTimeout(() => {
      // Set the active currencyCode in config
      this._layoutConfigService.config = {
        currencyCode: event.value,
      };
      // reload
      window.location.reload();
    }, 1000);
  }
}
