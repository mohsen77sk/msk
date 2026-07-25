import { Component, OnInit, Renderer2, ViewEncapsulation, inject, DOCUMENT, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BidiModule } from '@angular/cdk/bidi';
import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';
import { MskPlatformService } from '@msk/shared/services/platform';
import { LayoutScheme, LayoutType } from '@msk/shared/services/config';
import { MskLayoutConfigService } from '@msk/shared/services/config';
import { MskLoadingBarComponent } from '@msk/shared/ui/loading-bar';
import { combineLatest, filter, map, startWith } from 'rxjs';
import { LayoutEmptyComponent } from './layouts/empty/empty.component';
import { LayoutMaterialComponent } from './layouts/material/material.component';

@Component({
  selector: 'sz-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  encapsulation: ViewEncapsulation.None,
  imports: [BidiModule, MskLoadingBarComponent, LayoutEmptyComponent, LayoutMaterialComponent],
})
export class LayoutComponent implements OnInit {
  private _router = inject(Router);
  private _document = inject(DOCUMENT);
  private _renderer2 = inject(Renderer2);
  private _activatedRoute = inject(ActivatedRoute);
  private _mskPlatformService = inject(MskPlatformService);
  private _mskLayoutConfigService = inject(MskLayoutConfigService);
  private _mskMediaWatcherService = inject(MskMediaWatcherService);

  private readonly _schemeAndTheme = toSignal(
    combineLatest([
      this._mskLayoutConfigService.config$,
      this._mskMediaWatcherService.onMediaQueryChange$([
        '(prefers-color-scheme: dark)',
        '(prefers-color-scheme: light)',
      ]),
    ]).pipe(
      map(([config, mql]) => {
        let scheme: LayoutScheme = config.scheme;

        if (config.scheme === 'auto') {
          scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
        }

        return { scheme, theme: config.theme };
      }),
    ),
    { requireSync: true },
  );

  private readonly _navigationEnd = toSignal(
    this._router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      startWith(null),
    ),
  );

  readonly layoutConfig = toSignal(this._mskLayoutConfigService.config$, { requireSync: true });
  readonly layoutScheme = computed(() => this._schemeAndTheme().scheme);
  readonly layoutTheme = computed(() => this._schemeAndTheme().theme);

  readonly layoutType = computed(() => {
    this._navigationEnd(); // dependency
    const config = this.layoutConfig();

    let route = this._activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    let type: LayoutType = config.type;

    const layoutFromQueryParam = route.snapshot.queryParamMap.get('layoutType') as LayoutType | null;
    if (layoutFromQueryParam) {
      type = layoutFromQueryParam;
    }

    for (const path of route.pathFromRoot) {
      const layoutFromData = path.routeConfig?.data?.['layoutType'] as LayoutType | undefined;
      if (layoutFromData) {
        type = layoutFromData;
      }
    }

    return type;
  });

  /**
   * constructor
   */
  constructor() {
    // Scheme
    effect(() => {
      const scheme = this.layoutScheme();
      this._document.body.classList.remove('light', 'dark');
      this._document.body.classList.add(scheme);
    });

    // Theme
    effect(() => {
      const theme = this.layoutTheme();

      this._document.body.classList.forEach((className) => {
        if (className.startsWith('theme-')) {
          this._document.body.classList.remove(className, className.split('-')[1]);
        }
      });

      this._document.body.classList.add(theme);
    });

    // Direction + lang
    effect(() => {
      const config = this.layoutConfig();
      this._document.documentElement.setAttribute('lang', config.lang);
      this._document.documentElement.setAttribute('dir', config.direction);
      this._document.body.setAttribute('dir', config.direction);
    });

    // Meta theme-color
    effect(() => {
      const scheme = this.layoutScheme();
      const meta = this._document.querySelector('meta[name="theme-color"]');
      if (!meta) return;

      const color = getComputedStyle(this._document.documentElement)
        .getPropertyValue('--mat-sys-surface-container')
        .trim();

      if (!color) return;

      const [light, dark] = color
        .replace('light-dark(', '')
        .replace(')', '')
        .split(',')
        .map((v) => v.trim());

      meta.setAttribute('content', scheme === 'light' ? light : dark);
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the OS name
    this._renderer2.addClass(this._document.body, this._mskPlatformService.osName);
  }
}
