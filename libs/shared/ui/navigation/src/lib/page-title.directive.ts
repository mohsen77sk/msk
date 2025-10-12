import { Directive, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MskNavigationService } from './navigation.service';
import { MskVerticalNavigationComponent } from './vertical/vertical-navigation.component';

@Directive({
  selector: '[mskPageTitle]',
  exportAs: 'mskPageTitle',
})
export class MskPageTitleDirective implements OnInit {
  private _router = inject(Router);
  private _destroyRef = inject(DestroyRef);
  private _mskNavigationService = inject(MskNavigationService);

  /**
   * Signal containing the current page title
   */
  pageTitle = signal<string>('');

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Initialize the page title
    this._getCurrentTitle();

    // Subscribe to route changes
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this._getCurrentTitle());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get current page title from navigation
   */
  private _getCurrentTitle(): void {
    const segments = this._router.url.split('/').filter((s) => s);
    const idPath = this._getIdPath(segments);

    const navigation = this._mskNavigationService.getComponent<MskVerticalNavigationComponent>('mainNavigation');
    const navigationItem = navigation?.navigation
      ? this._mskNavigationService.getItem(idPath, navigation.navigation())
      : null;

    this.pageTitle.set(navigationItem?.title ?? this._getFallbackTitle(segments));
  }

  /**
   * Extract navigation ID path from URL segments
   */
  private _getIdPath(segments: string[]): string {
    const cardIndex = segments.indexOf('card');
    const relevantSegments = cardIndex !== -1 ? segments.slice(0, cardIndex) : segments;
    return relevantSegments.join('.');
  }

  /**
   * Get fallback title based on URL segments
   */
  private _getFallbackTitle(segments: string[]): string {
    if (!segments.length) return 'Home';

    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
