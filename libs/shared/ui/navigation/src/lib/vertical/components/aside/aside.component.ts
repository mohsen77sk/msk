
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  effect,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs';
import { MskVerticalNavigationBasicItemComponent } from '../basic/basic.component';
import { MskVerticalNavigationCollapsableItemComponent } from '../collapsable/collapsable.component';
import { MskVerticalNavigationDividerItemComponent } from '../divider/divider.component';
import { MskVerticalNavigationGroupItemComponent } from '../group/group.component';
import { MskVerticalNavigationComponent } from '../../vertical-navigation.component';
import { MskNavigationService } from '../../../navigation.service';
import { MskNavigationItem } from '../../../navigation.types';

@Component({
  selector: 'msk-vertical-navigation-aside-item',
  templateUrl: './aside.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatTooltipModule,
    MskVerticalNavigationBasicItemComponent,
    MskVerticalNavigationCollapsableItemComponent,
    MskVerticalNavigationDividerItemComponent,
    MskVerticalNavigationGroupItemComponent
],
})
export class MskVerticalNavigationAsideItemComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _mskNavigationService = inject(MskNavigationService);

  name = input.required<string>();
  item = input.required<MskNavigationItem>();
  activeItemId = input<string>();
  autoCollapse = input<boolean>(false);
  skipChildren = input<boolean>(false);

  active = false;
  private _mskVerticalNavigationComponent!: MskVerticalNavigationComponent;

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      this._markIfActive(this._router.url);
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Mark if active
    this._markIfActive(this._router.url);

    // Attach a listener to the NavigationEnd event
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((event: NavigationEnd) => {
        // Mark if active
        this._markIfActive(event.urlAfterRedirects);
      });

    // Get the parent navigation component
    this._mskVerticalNavigationComponent = this._mskNavigationService.getComponent(this.name());

    // Subscribe to onRefreshed on the navigation component
    this._mskVerticalNavigationComponent.onRefreshed.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check if the given item has the given url
   * in one of its children
   *
   * @param item
   * @param currentUrl
   * @private
   */
  private _hasActiveChild(item: MskNavigationItem, currentUrl: string): boolean {
    const children = item.children;

    if (!children) {
      return false;
    }

    for (const child of children) {
      if (child.children) {
        if (this._hasActiveChild(child, currentUrl)) {
          return true;
        }
      }

      // Skip items other than 'basic'
      if (child.type !== 'basic') {
        continue;
      }

      // Check if the child has a link and is active
      if (child.link && this._router.isActive(child.link, child.exactMatch || false)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Decide and mark if the item is active
   *
   * @private
   */
  private _markIfActive(currentUrl: string): void {
    // Check if the activeItemId is equals to this item id
    this.active = this.activeItemId() === this.item().id;

    // If the aside has a children that is active,
    // always mark it as active
    if (this._hasActiveChild(this.item(), currentUrl)) {
      this.active = true;
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
}
