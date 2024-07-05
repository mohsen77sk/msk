import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MskLayoutConfigService } from '@msk/shared/services/config';
import { AvailableLangsIds, availableLangs } from '@msk/shared/utils/transloco';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { faIR } from 'date-fns-jalali/locale';

const locale = {
  en: 'en-US',
  fa: 'fa-IR',
};

const localeDate = {
  en: enUS,
  fa: faIR,
};

@Component({
  standalone: true,
  selector: 'main-layout-language-dialog',
  templateUrl: './layout-language-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatRadioModule, MatDialogModule, TranslocoDirective],
})
export class MainLayoutLanguageDialogComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _dateAdapter = inject(DateAdapter<Locale>);
  private _translocoService = inject(TranslocoService);
  private _layoutConfigService = inject(MskLayoutConfigService);

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
    // Set the active locale
    this._dateAdapter.setLocale(localeDate[event.value as AvailableLangsIds]);
    // Set the active lang
    this._translocoService.setActiveLang(event.value);
    // Set the active locale in config
    this._layoutConfigService.config = {
      locale: locale[event.value as AvailableLangsIds],
    };
  }
}
