import { AfterViewInit, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MskNavigationService, MskVerticalNavigationComponent } from '@msk/shared/ui/navigation';
import { filter } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[mskPageName]',
  exportAs: 'mskPageName',
})
export class MskPageNameDirective implements AfterViewInit {
  private _router = inject(Router);
  private _destroyRef = inject(DestroyRef);
  private _elementRef = inject(ElementRef);
  private _activatedRoute = inject(ActivatedRoute);
  private _mskNavigationService = inject(MskNavigationService);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    // Init the navigation
    this.setCurrentPage();

    // Subscribe to route change
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(() => this.setCurrentPage());
  }

  /**
   * Set current page name
   */
  setCurrentPage() {
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
    // Set title of current navigation in element
    this._elementRef.nativeElement.innerText = this._mskNavigationService.getItem(idPath, navigation.navigation)?.title;
  }
}
