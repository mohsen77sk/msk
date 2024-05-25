import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateAdapter } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
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
  selector: 'main-languages',
  templateUrl: './languages.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatMenuModule, MatButtonModule, MatTooltipModule, NgTemplateOutlet, TranslocoDirective],
})
export class MainLanguagesComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  dateAdapter = inject(DateAdapter<Locale>);
  translocoService = inject(TranslocoService);
  layoutConfigService = inject(MskLayoutConfigService);

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
    this.translocoService.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((activeLang) => {
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
   * @param lang
   */
  setActiveLang(lang: AvailableLangsIds): void {
    // Set the active locale
    this.dateAdapter.setLocale(localeDate[lang]);
    // Set the active lang
    this.translocoService.setActiveLang(lang);
    // Set the active locale in config
    this.layoutConfigService.config = {
      locale: locale[lang],
    };
  }
}
