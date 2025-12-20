import { Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { TranslocoDirective } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MskFullscreenComponent } from '@msk/shared/ui/fullscreen';
import { MskNavigationService, MskVerticalNavigationComponent } from '@msk/shared/ui/navigation';
import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';
import { DocsNavigationService, Navigation } from '@msk/docs/shell/core/navigation';
import { cloneDeep } from 'lodash-es';
import { DocsLanguagesComponent } from '../../common/languages/languages.component';
import { DocsPageTitleComponent } from '../../common/page-title/page-title.component';

@Component({
  selector: 'doc-layout-material',
  templateUrl: './material.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MskFullscreenComponent,
    MskVerticalNavigationComponent,
    DocsLanguagesComponent,
    DocsPageTitleComponent,
    TranslocoDirective
],
})
export class DocsLayoutMaterialComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _navigationService = inject(DocsNavigationService);
  private _mskNavigationService = inject(MskNavigationService);
  private _mskMediaWatcherService = inject(MskMediaWatcherService);

  navigation!: Navigation;
  isScreenSmall!: boolean;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to navigation data
    this._navigationService.navigation$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((navigation: Navigation) => {
        this.navigation = cloneDeep(navigation);
      });

    // Subscribe to media changes
    this._mskMediaWatcherService.onMediaChange$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle navigation
   */
  toggleMainNavigation(): void {
    // Get the navigation
    const navigation = this._mskNavigationService.getComponent<MskVerticalNavigationComponent>('mainNavigation');

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }
}
