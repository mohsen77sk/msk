import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  HostBinding,
  inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { mskAnimations } from '@msk/shared/animations';
import { filter } from 'rxjs';
import { MskVerticalNavigationBasicItemComponent } from '../basic/basic.component';
import { MskVerticalNavigationDividerItemComponent } from '../divider/divider.component';
import { MskVerticalNavigationGroupItemComponent } from '../group/group.component';
import { MskVerticalNavigationComponent } from '../../vertical-navigation.component';
import { MskNavigationService } from '../../../navigation.service';
import { MskNavigationItem } from '../../../navigation.types';

@Component({
  standalone: true,
  selector: 'msk-vertical-navigation-collapsable-item',
  templateUrl: './collapsable.component.html',
  animations: mskAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    MatIconModule,
    MatTooltipModule,
    MskVerticalNavigationBasicItemComponent,
    forwardRef(() => MskVerticalNavigationCollapsableItemComponent),
    MskVerticalNavigationDividerItemComponent,
    forwardRef(() => MskVerticalNavigationGroupItemComponent),
  ],
})
export class MskVerticalNavigationCollapsableItemComponent implements OnInit {
  destroyRef = inject(DestroyRef);

  @Input() autoCollapse!: boolean;
  @Input() item!: MskNavigationItem;
  @Input() name!: string;

  isCollapsed = true;
  isExpanded = false;
  private _mskVerticalNavigationComponent!: MskVerticalNavigationComponent;

  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _mskNavigationService: MskNavigationService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Host binding for component classes
   */
  @HostBinding('class') get classList(): object {
    return {
      'msk-vertical-navigation-item-collapsed': this.isCollapsed,
      'msk-vertical-navigation-item-expanded': this.isExpanded,
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the parent navigation component
    this._mskVerticalNavigationComponent = this._mskNavigationService.getComponent(this.name);

    // If the item has a children that has a matching url with the current url, expand...
    if (this._hasActiveChild(this.item, this._router.url)) {
      this.expand();
    }
    // Otherwise...
    else {
      // If the autoCollapse is on, collapse...
      if (this.autoCollapse) {
        this.collapse();
      }
    }

    // Listen for the onCollapsableItemCollapsed from the service
    this._mskVerticalNavigationComponent.onCollapsableItemCollapsed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((collapsedItem) => {
        // Check if the collapsed item is null
        if (collapsedItem === null) {
          return;
        }

        // Collapse if this is a children of the collapsed item
        if (this._isChildrenOf(collapsedItem, this.item)) {
          this.collapse();
        }
      });

    // Listen for the onCollapsableItemExpanded from the service if the autoCollapse is on
    if (this.autoCollapse) {
      this._mskVerticalNavigationComponent.onCollapsableItemExpanded
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((expandedItem) => {
          // Check if the expanded item is null
          if (expandedItem === null) {
            return;
          }

          // Check if this is a parent of the expanded item
          if (this._isChildrenOf(this.item, expandedItem)) {
            return;
          }

          // Check if this has a children with a matching url with the current active url
          if (this._hasActiveChild(this.item, this._router.url)) {
            return;
          }

          // Check if this is the expanded item
          if (this.item === expandedItem) {
            return;
          }

          // If none of the above conditions are matched, collapse this item
          this.collapse();
        });
    }

    // Attach a listener to the NavigationEnd event
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => {
        // If the item has a children that has a matching url with the current url, expand...
        if (this._hasActiveChild(this.item, event.urlAfterRedirects)) {
          this.expand();
        }
        // Otherwise...
        else {
          // If the autoCollapse is on, collapse...
          if (this.autoCollapse) {
            this.collapse();
          }
        }
      });

    // Subscribe to onRefreshed on the navigation component
    this._mskVerticalNavigationComponent.onRefreshed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Collapse
   */
  collapse(): void {
    // Return if the item is disabled
    if (this.item.disabled) {
      return;
    }

    // Return if the item is already collapsed
    if (this.isCollapsed) {
      return;
    }

    // Collapse it
    this.isCollapsed = true;
    this.isExpanded = !this.isCollapsed;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Execute the observable
    this._mskVerticalNavigationComponent.onCollapsableItemCollapsed.next(this.item);
  }

  /**
   * Expand
   */
  expand(): void {
    // Return if the item is disabled
    if (this.item.disabled) {
      return;
    }

    // Return if the item is already expanded
    if (!this.isCollapsed) {
      return;
    }

    // Expand it
    this.isCollapsed = false;
    this.isExpanded = !this.isCollapsed;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Execute the observable
    this._mskVerticalNavigationComponent.onCollapsableItemExpanded.next(this.item);
  }

  /**
   * Toggle collapsable
   */
  toggleCollapsable(): void {
    // Toggle collapse/expand
    if (this.isCollapsed) {
      this.expand();
    } else {
      this.collapse();
    }
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

      // Check if the child has a link and is active
      if (child.link && this._router.isActive(child.link, child.exactMatch || false)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if this is a children
   * of the given item
   *
   * @param parent
   * @param item
   * @private
   */
  private _isChildrenOf(parent: MskNavigationItem, item: MskNavigationItem): boolean {
    const children = parent.children;

    if (!children) {
      return false;
    }

    if (children.indexOf(item) > -1) {
      return true;
    }

    for (const child of children) {
      if (child.children) {
        if (this._isChildrenOf(child, item)) {
          return true;
        }
      }
    }

    return false;
  }
}
