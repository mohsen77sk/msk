import { Directive, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MskNavigationService } from './navigation.service';
import { MskVerticalNavigationComponent } from './vertical/vertical-navigation.component';

@Directive({
  selector: '[mskPageTitle]',
  standalone: true,
  exportAs: 'mskPageTitle',
})
export class MskPageTitleDirective implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _mskNavigationService = inject(MskNavigationService);

  /**
   * Signal containing the current page title
   */
  pageTitle = signal<string>('');

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Initialize the page title
    this.getCurrentTitle();

    // Subscribe to route changes
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this.getCurrentTitle());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get current page title from navigation
   */
  private getCurrentTitle(): void {
    try {
      // Segment on path url
      const segment = this._router.url.split('/');
      // Remove root path segment
      segment.shift();
      // Remove params from path segment
      Object.values(this._activatedRoute.snapshot.params).forEach(() => segment.pop());
      // Convert path to id of navigation item
      const idPath = segment.join('.');

      // Get the navigation component
      const navigation = this._mskNavigationService.getComponent<MskVerticalNavigationComponent>('mainNavigation');

      if (navigation?.navigation) {
        // Set title of current navigation
        const navigationItem = this._mskNavigationService.getItem(idPath, navigation.navigation());
        this.pageTitle.set(navigationItem?.title ?? '');
      } else {
        // Fallback to URL-based title if navigation not found
        this.pageTitle.set(this._getFallbackTitle(segment));
      }
    } catch (error) {
      console.warn('Error getting page title:', error);
      // Fallback to URL-based title
      const segment = this._router.url.split('/').filter((s) => s);
      this.pageTitle.set(this._getFallbackTitle(segment));
    }
  }

  /**
   * Get fallback title based on URL segments
   */
  private _getFallbackTitle(segments: string[]): string {
    if (segments.length === 0) {
      return 'Home';
    }

    // Capitalize and format the last segment
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
