import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MskLayoutConfigService } from '@msk/shared/services/config';
import { MskSplashScreenService } from '@msk/shared/services/splash-screen';
import { MskAvailableLangsIds, availableLangs, LANG_BY_ID } from '@msk/shared/constants';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'mz-layout-language-dialog',
  templateUrl: './layout-language-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatRadioModule, MatDialogModule, TranslocoDirective],
})
export class LayoutLanguageDialogComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _translocoService = inject(TranslocoService);
  private _layoutConfigService = inject(MskLayoutConfigService);
  private _splashScreenService = inject(MskSplashScreenService);

  availableLangs = availableLangs;
  activeLang!: MskAvailableLangsIds;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to language changes
    this._translocoService.langChanges$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((activeLang) => {
      // Get the active lang
      this.activeLang = activeLang as MskAvailableLangsIds;
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set the active lang
   *
   * @param event
   */
  setActiveLang(event: MatRadioChange<MskAvailableLangsIds>): void {
    // Show splash screen
    this._splashScreenService.show();

    setTimeout(() => {
      // Set the active locale in config
      this._layoutConfigService.config = {
        lang: LANG_BY_ID[event.value].id,
        direction: LANG_BY_ID[event.value].direction,
      };
      // reload
      window.location.reload();
    }, 1000);
  }
}
