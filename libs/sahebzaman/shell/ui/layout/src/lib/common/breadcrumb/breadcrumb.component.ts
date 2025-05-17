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
  selector: 'sz-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatIcon],
})
export class MainBreadcrumbComponent implements AfterViewInit {
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _mskNavigationService = inject(MskNavigationService);

  breadcrumb: { id: string; title: string }[] = [];

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    // Init the navigation
    this.createBreadcrumb();

    // Subscribe to route change
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(() => this.createBreadcrumb());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create breadcrumb
   */
  createBreadcrumb() {
    // Segment on path url
    const segment = this._router.url.split('/');
    // Get the navigation
    const navigation = this._mskNavigationService.getComponent<MskVerticalNavigationComponent>('mainNavigation');
    // Remove root path segment
    segment.shift();
    // Remove params from path segment
    Object.values(this._activatedRoute.snapshot.params).forEach(() => segment.pop());
    // Create breadcrumb
    segment.forEach((item, index) => {
      // Convert path to id of navigation item
      const idPath = segment.slice(0, index + 1).reduce((previous, current) => `${previous}.${current}`);
      // Push the navigation path
      this.breadcrumb.push({
        id: idPath,
        title: this._mskNavigationService.getItem(idPath, navigation.navigation())?.title ?? '',
      });
    });
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
}
