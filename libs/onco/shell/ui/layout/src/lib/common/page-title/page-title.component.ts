import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MskNavigationService, MskVerticalNavigationComponent } from '@msk/shared/ui/navigation';
import { filter } from 'rxjs';

@Component({
  selector: 'oc-page-title',
  templateUrl: './page-title.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent implements AfterViewInit {
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _mskNavigationService = inject(MskNavigationService);

  currentTitle = signal<string>('');

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
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this.getCurrentTitle());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

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
    this.currentTitle.set(this._mskNavigationService.getItem(idPath, navigation.navigation())?.title ?? '');
  }
}
