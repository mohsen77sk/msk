import { Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MskNavigationService, MskVerticalNavigationComponent } from '@msk/shared/ui/navigation';
import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';
import { MainNavigationService, Navigation } from '@msk/main/shell/core/navigation';
import { cloneDeep } from 'lodash-es';

@Component({
  standalone: true,
  selector: 'main-layout-material',
  templateUrl: './material.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [NgIf, RouterOutlet, MatIconModule, MskVerticalNavigationComponent],
})
export class MainLayoutMaterialComponent implements OnInit {
  destroyRef = inject(DestroyRef);

  navigation!: Navigation;
  isScreenSmall!: boolean;

  /**
   * Constructor
   */
  constructor(
    private _navigationService: MainNavigationService,
    private _mskNavigationService: MskNavigationService,
    private _mskMediaWatcherService: MskMediaWatcherService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to navigation data
    this._navigationService.navigation$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((navigation: Navigation) => {
        this.navigation = cloneDeep(navigation);
      });

    // Subscribe to media changes
    this._mskMediaWatcherService.onMediaChange$
      .pipe(takeUntilDestroyed(this.destroyRef))
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
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this._mskNavigationService.getComponent<MskVerticalNavigationComponent>(name);

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }
}
