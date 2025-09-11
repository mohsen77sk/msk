import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AnimationBuilder, AnimationPlayer, animate, style } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { Directionality } from '@angular/cdk/bidi';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { mskAnimations } from '@msk/shared/animations';
import { MskUtilsService } from '@msk/shared/services/utils';
import { MskScrollbarDirective } from '@msk/shared/directives/scrollbar';
import { ReplaySubject, Subscription, delay, filter, map, merge, pairwise } from 'rxjs';
import { MskVerticalNavigationAsideItemComponent } from './components/aside/aside.component';
import { MskVerticalNavigationBasicItemComponent } from './components/basic/basic.component';
import { MskVerticalNavigationCollapsableItemComponent } from './components/collapsable/collapsable.component';
import { MskVerticalNavigationDividerItemComponent } from './components/divider/divider.component';
import { MskVerticalNavigationGroupItemComponent } from './components/group/group.component';
import { MskNavigationService } from '../navigation.service';
import {
  MskNavigationItem,
  MskVerticalNavigationAppearance,
  MskVerticalNavigationMode,
  MskVerticalNavigationPosition,
} from '../navigation.types';

@Component({
  selector: 'msk-vertical-navigation',
  templateUrl: './vertical-navigation.component.html',
  styleUrls: ['./styles/default.css', './styles/rail.css'],
  exportAs: 'mskVerticalNavigation',
  animations: mskAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MskScrollbarDirective,
    MskVerticalNavigationAsideItemComponent,
    MskVerticalNavigationBasicItemComponent,
    MskVerticalNavigationCollapsableItemComponent,
    MskVerticalNavigationDividerItemComponent,
    MskVerticalNavigationGroupItemComponent,
  ],
})
export class MskVerticalNavigationComponent implements OnInit, AfterViewInit, OnDestroy {
  private _destroyRef = inject(DestroyRef);
  private _animationBuilder = inject(AnimationBuilder);
  private _elementRef = inject(ElementRef);
  private _renderer2 = inject(Renderer2);
  private _router = inject(Router);
  private _dir = inject(Directionality);
  private _scrollStrategyOptions = inject(ScrollStrategyOptions);
  private _mskNavigationService = inject(MskNavigationService);
  private _mskUtilsService = inject(MskUtilsService);

  navigation = input.required<MskNavigationItem[]>();
  name = input<string>(this._mskUtilsService.randomId());
  inner = input(false, { transform: booleanAttribute });
  autoCollapse = input(true, { transform: booleanAttribute });
  transparentOverlay = input(false, { transform: booleanAttribute });
  opened = model(true);
  mode = model<MskVerticalNavigationMode>('side');
  position = model<MskVerticalNavigationPosition>('start');
  appearance = model<MskVerticalNavigationAppearance>('default');
  //
  private _navigationContent = viewChild.required<ElementRef>('navigationContent');

  activeAsideItemId: string | null = null;
  onCollapsableItemCollapsed: ReplaySubject<MskNavigationItem> = new ReplaySubject<MskNavigationItem>(1);
  onCollapsableItemExpanded: ReplaySubject<MskNavigationItem> = new ReplaySubject<MskNavigationItem>(1);
  onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private _hovered = false;
  private _animationsEnabled = false;
  private _overlay: HTMLElement | undefined;
  private _asideOverlay: HTMLElement | undefined;
  private readonly _handleOverlayClick: () => void;
  private readonly _handleAsideOverlayClick: () => void;
  private _player!: AnimationPlayer;
  private _scrollStrategy: ScrollStrategy = this._scrollStrategyOptions.block();
  private _mskScrollbarDirectives!: QueryList<MskScrollbarDirective>;
  private _mskScrollbarDirectivesSubscription!: Subscription;

  /**
   * Constructor
   */
  constructor() {
    toObservable(this.appearance).pipe(map(() => this._fixNavigationData()));
    toObservable(this.navigation).pipe(map(() => this._fixNavigationData()));

    toObservable(this.mode).pipe(
      pairwise(),
      map(([previousMode, currentMode]) => {
        // Disable the animations
        this._disableAnimations();

        // If the mode changes: 'over -> side'
        if (previousMode === 'over' && currentMode === 'side') {
          // Hide the overlay
          this._hideOverlay();
        }

        // If the mode changes: 'side -> over'
        if (previousMode === 'side' && currentMode === 'over') {
          // Close the aside
          this.closeAside();

          // If the navigation is opened
          if (this.opened()) {
            // Show the overlay
            this._showOverlay();
          }
        }

        // Enable the animations after a delay
        // The delay must be bigger than the current transition-duration
        // to make sure nothing will be animated while the mode changing
        requestAnimationFrame(() => {
          setTimeout(() => {
            this._enableAnimations();
          }, 500);
        });
      }),
    );

    this._handleAsideOverlayClick = (): void => {
      this.closeAside();
    };
    this._handleOverlayClick = (): void => {
      this.close();
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Host binding for component classes
   */
  @HostBinding('class') get classList(): object {
    return {
      'msk-vertical-navigation-animations-enabled': this._animationsEnabled,
      [`msk-vertical-navigation-appearance-${this.appearance()}`]: true,
      'msk-vertical-navigation-hover': this._hovered,
      'msk-vertical-navigation-inner': this.inner(),
      'msk-vertical-navigation-mode-over': this.mode() === 'over',
      'msk-vertical-navigation-mode-side': this.mode() === 'side',
      'msk-vertical-navigation-opened': this.opened(),
      'msk-vertical-navigation-position-start': this.position() === 'start',
      'msk-vertical-navigation-position-end': this.position() === 'end',
    };
  }

  /**
   * Host binding for component inline styles
   */
  @HostBinding('style') get styleList(): object {
    return {
      visibility: this.opened() ? 'visible' : 'hidden',
    };
  }

  /**
   * Setter for mskScrollbarDirectives
   */
  @ViewChildren(MskScrollbarDirective)
  set mskScrollbarDirectives(mskScrollbarDirectives: QueryList<MskScrollbarDirective>) {
    // Store the directives
    this._mskScrollbarDirectives = mskScrollbarDirectives;

    // Return if there are no directives
    if (mskScrollbarDirectives.length === 0) {
      return;
    }

    // Unsubscribe the previous subscriptions
    if (this._mskScrollbarDirectivesSubscription) {
      this._mskScrollbarDirectivesSubscription.unsubscribe();
    }

    // Update the scrollbars on collapsable items' collapse/expand
    this._mskScrollbarDirectivesSubscription = merge(this.onCollapsableItemCollapsed, this.onCollapsableItemExpanded)
      .pipe(takeUntilDestroyed(this._destroyRef), delay(250))
      .subscribe(() => {
        // Loop through the scrollbars and update them
        mskScrollbarDirectives.forEach((mskScrollbarDirective) => {
          mskScrollbarDirective.update();
        });
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Decorated methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On mouseenter
   */
  @HostListener('mouseenter')
  onMouseenter(): void {
    // Enable the animations
    this._enableAnimations();

    // Set the hovered
    this._hovered = true;
  }

  /**
   * On mouseleave
   */
  @HostListener('mouseleave')
  onMouseleave(): void {
    // Enable the animations
    this._enableAnimations();

    // Set the hovered
    this._hovered = false;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Register the navigation component
    this._mskNavigationService.registerComponent(this.name(), this);

    // Subscribe to the 'NavigationEnd' event
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => {
        // If the mode is 'over' and the navigation is opened...
        if (this.mode() === 'over' && this.opened()) {
          // Close the navigation
          this.close();
        }

        // If the mode is 'side' and the aside is active...
        if (this.mode() === 'side' && this.activeAsideItemId) {
          // Close the aside
          this.closeAside();
        }
      });
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      // Return if 'navigation content' element does not exist
      if (!this._navigationContent()) {
        return;
      }

      // If 'navigation content' element doesn't have
      // perfect scrollbar activated on it...
      if (!this._navigationContent().nativeElement.classList.contains('ps')) {
        // Find the active item
        const activeItem = this._navigationContent().nativeElement.querySelector(
          '.msk-vertical-navigation-item-active',
        );

        // If the active item exists, scroll it into view
        if (activeItem) {
          activeItem.scrollIntoView();
        }
      }
      // Otherwise
      else {
        // Go through all the scrollbar directives
        this._mskScrollbarDirectives.forEach((mskScrollbarDirective) => {
          // Skip if not enabled
          if (!mskScrollbarDirective.isEnabled()) {
            return;
          }

          // Scroll to the active element
          mskScrollbarDirective.scrollToElement('.msk-vertical-navigation-item-active', -120, true);
        });
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Forcefully close the navigation and aside in case they are opened
    this.close();
    this.closeAside();

    // Deregister the navigation component from the registry
    this._mskNavigationService.deregisterComponent(this.name());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Refresh the component to apply the changes
   */
  refresh(): void {
    // Execute the observable
    this.onRefreshed.next(true);
  }

  /**
   * Open the navigation
   */
  open(): void {
    // Return if the navigation is already open
    if (this.opened()) {
      return;
    }

    // Set the opened
    this._toggleOpened(true);
  }

  /**
   * Close the navigation
   */
  close(): void {
    // Return if the navigation is already closed
    if (!this.opened) {
      return;
    }

    // Close the aside
    this.closeAside();

    // Set the opened
    this._toggleOpened(false);
  }

  /**
   * Toggle the navigation
   */
  toggle(): void {
    // Toggle
    if (this.opened()) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open the aside
   *
   * @param item
   */
  openAside(item: MskNavigationItem): void {
    // Return if the item is disabled
    if (item.disabled || !item.id) {
      return;
    }

    // Open
    this.activeAsideItemId = item.id;

    // Show the aside overlay
    this._showAsideOverlay();
  }

  /**
   * Close the aside
   */
  closeAside(): void {
    // Close
    this.activeAsideItemId = null;

    // Hide the aside overlay
    this._hideAsideOverlay();
  }

  /**
   * Toggle the aside
   *
   * @param item
   */
  toggleAside(item: MskNavigationItem): void {
    // Toggle
    if (this.activeAsideItemId === item.id) {
      this.closeAside();
    } else {
      this.openAside(item);
    }
  }

  /**
   * Direction is rtl
   *
   * @returns boolean
   */
  isRtl(): boolean {
    return this._dir.value === 'rtl';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Enable the animations
   *
   * @private
   */
  private _enableAnimations(): void {
    // Return if the animations are already enabled
    if (this._animationsEnabled) {
      return;
    }

    // Enable the animations
    this._animationsEnabled = true;
  }

  /**
   * Disable the animations
   *
   * @private
   */
  private _disableAnimations(): void {
    // Return if the animations are already disabled
    if (!this._animationsEnabled) {
      return;
    }

    // Disable the animations
    this._animationsEnabled = false;
  }

  /**
   * Show the overlay
   *
   * @private
   */
  private _showOverlay(): void {
    // Return if there is already an overlay
    if (this._asideOverlay) {
      return;
    }

    // Create the overlay element
    this._overlay = this._renderer2.createElement('div');

    // Add a class to the overlay element
    this._overlay?.classList.add('msk-vertical-navigation-overlay');

    // Add a class depending on the transparentOverlay option
    if (this.transparentOverlay()) {
      this._overlay?.classList.add('msk-vertical-navigation-overlay-transparent');
    }

    // Append the overlay to the parent of the navigation
    this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._overlay);

    // Enable block scroll strategy
    this._scrollStrategy.enable();

    // Create the enter animation and attach it to the player
    this._player = this._animationBuilder
      .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))])
      .create(this._overlay);

    // Play the animation
    this._player.play();

    // Add an event listener to the overlay
    this._overlay?.addEventListener('click', this._handleOverlayClick);
  }

  /**
   * Hide the overlay
   *
   * @private
   */
  private _hideOverlay(): void {
    if (!this._overlay) {
      return;
    }

    // Create the leave animation and attach it to the player
    this._player = this._animationBuilder
      .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))])
      .create(this._overlay);

    // Play the animation
    this._player.play();

    // Once the animation is done...
    this._player.onDone(() => {
      // If the overlay still exists...
      if (this._overlay) {
        // Remove the event listener
        this._overlay.removeEventListener('click', this._handleOverlayClick);

        // Remove the overlay
        this._overlay?.parentNode?.removeChild(this._overlay);
        this._overlay = undefined;
      }

      // Disable block scroll strategy
      this._scrollStrategy.disable();
    });
  }

  /**
   * Show the aside overlay
   *
   * @private
   */
  private _showAsideOverlay(): void {
    // Return if there is already an overlay
    if (this._asideOverlay) {
      return;
    }

    // Create the aside overlay element
    this._asideOverlay = this._renderer2.createElement('div');

    // Add a class to the aside overlay element
    this._asideOverlay?.classList.add('msk-vertical-navigation-aside-overlay');

    // Append the aside overlay to the parent of the navigation
    this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._asideOverlay);

    // Create the enter animation and attach it to the player
    this._player = this._animationBuilder
      .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))])
      .create(this._asideOverlay);

    // Play the animation
    this._player.play();

    // Add an event listener to the aside overlay
    this._asideOverlay?.addEventListener('click', this._handleAsideOverlayClick);
  }

  /**
   * Hide the aside overlay
   *
   * @private
   */
  private _hideAsideOverlay(): void {
    if (!this._asideOverlay) {
      return;
    }

    // Create the leave animation and attach it to the player
    this._player = this._animationBuilder
      .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))])
      .create(this._asideOverlay);

    // Play the animation
    this._player.play();

    // Once the animation is done...
    this._player.onDone(() => {
      // If the aside overlay still exists...
      if (this._asideOverlay) {
        // Remove the event listener
        this._asideOverlay.removeEventListener('click', this._handleAsideOverlayClick);

        // Remove the aside overlay
        this._asideOverlay?.parentNode?.removeChild(this._asideOverlay);
        this._asideOverlay = undefined;
      }
    });
  }

  /**
   * Open/close the navigation
   *
   * @param open
   * @private
   */
  private _toggleOpened(open: boolean): void {
    // Set the opened
    this.opened.set(open);

    // Enable the animations
    this._enableAnimations();

    // If the navigation opened, and the mode
    // is 'over', show the overlay
    if (this.mode() === 'over') {
      if (this.opened()) {
        this._showOverlay();
      } else {
        this._hideOverlay();
      }
    }
  }

  /**
   * Fix navigation data by appearance
   *
   * @private
   */
  private _fixNavigationData(): void {
    // If the appearance is 'default'
    if (this.appearance() === 'default') {
      this.navigation().forEach((item) => (item.type === 'aside' ? (item.type = 'group') : null));
    }

    // If the appearance is 'rail'
    if (this.appearance() === 'rail') {
      this.navigation().forEach((item) => (item.type === 'group' ? (item.type = 'aside') : null));
    }
  }
}
