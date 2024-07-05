import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MskNavigationService, MskVerticalNavigationComponent } from '@msk/shared/ui/navigation';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'main-page-title',
  templateUrl: './page-title.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatIcon],
})
export class MainPageTitleComponent implements AfterViewInit {
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _mskNavigationService = inject(MskNavigationService);

  currentTitle!: string;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    // Init the navigation
    this.getCurrentTitle();

    // Subscribe to route change
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(() => this.getCurrentTitle());
  }

  /**
   * Get current page title
   */
  getCurrentTitle() {
    // Segment on path url
    const segment = this._router.url.split('/');
    // Remove root path segment
    segment.shift();
    // Remove params from path segment
    Object.values(this._activatedRoute.snapshot.params).forEach(() => segment.pop());
    // Convert path to id of navigation item
    const idPath = segment.join('.');
    // Get the navigation
    const navigation = this._mskNavigationService.getComponent<MskVerticalNavigationComponent>('mainNavigation');
    // Set title of current navigation
    this.currentTitle = this._mskNavigationService.getItem(idPath, navigation.navigation)?.title ?? '';
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
}
