import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MskLayoutConfigService } from '@msk/shared/services/config';
import { MskSplashScreenService } from '@msk/shared/services/splash-screen';
import { AvailableLangsIds, availableLangs } from '@msk/shared/utils/transloco';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Locale } from 'date-fns';
import { locale, localeDate } from '../../layout.types';

@Component({
  selector: 'oc-layout-language-dialog',
  templateUrl: './layout-language-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatRadioModule, MatDialogModule, TranslocoDirective],
})
export class LayoutLanguageDialogComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _dateAdapter = inject(DateAdapter<Locale>);
  private _translocoService = inject(TranslocoService);
  private _layoutConfigService = inject(MskLayoutConfigService);
  private _splashScreenService = inject(MskSplashScreenService);

  availableLangs = availableLangs;
  activeLang!: AvailableLangsIds;

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
      this.activeLang = activeLang as AvailableLangsIds;
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
  setActiveLang(event: MatRadioChange): void {
    // Show splash screen
    this._splashScreenService.show();
    setTimeout(() => {
      // Set the active locale
      this._dateAdapter.setLocale(localeDate[event.value as AvailableLangsIds]);
      // Set the active lang
      this._translocoService.setActiveLang(event.value);
      // Set the active locale in config
      this._layoutConfigService.config = {
        locale: locale[event.value as AvailableLangsIds],
      };
      // reload
      window.location.reload();
    }, 1000);
  }
}
