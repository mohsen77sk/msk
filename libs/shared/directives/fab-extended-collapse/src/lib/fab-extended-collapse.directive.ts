import { DestroyRef, Directive, ElementRef, OnInit, inject, input, signal, Renderer2 } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { fromEvent, map, tap } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[mskFabExtendedCollapse]',
  exportAs: 'mskFabExtendedCollapse',
})
export class MskFabExtendedCollapseDirective implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);

  private readonly _class = 'mat-mdc-extended-fab-collapses';
  private _lastOffsetScroll = 0;
  private _isCollapsed = signal(false);
  private _isCollapsed$ = toObservable(this._isCollapsed);

  /**
   * Scrollable element to monitor for scroll events
   */
  mskFabExtendedCollapse = input<CdkScrollable | HTMLElement>();

  /**
   * Scroll threshold before considering scroll direction (default: 10px)
   */
  mskFabScrollThreshold = input<number>(10);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the scrollable target or find the closest scrollable parent
    const scrollableElement = this.mskFabExtendedCollapse() || this._findScrollableParent() || window;

    // Subscribe to scroll events
    if (scrollableElement instanceof CdkScrollable) {
      // Use CdkScrollable's elementScrolled method
      scrollableElement
        .elementScrolled()
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          map((data) => (data.target as HTMLElement).scrollTop || 0),
          tap((scrollTop: number) => {
            const shouldCollapse =
              scrollTop > this.mskFabScrollThreshold() ? this._lastOffsetScroll < scrollTop : false;

            // Update the collapsed state
            this._isCollapsed.set(shouldCollapse);

            // Update last offset scroll
            this._lastOffsetScroll = scrollTop;
          }),
        )
        .subscribe();
    } else {
      // Use regular scroll event
      fromEvent(scrollableElement, 'scroll')
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          map(() => this._getScrollTop(scrollableElement)),
          tap((scrollTop: number) => {
            const shouldCollapse =
              scrollTop > this.mskFabScrollThreshold() ? this._lastOffsetScroll < scrollTop : false;

            // Update the collapsed state
            this._isCollapsed.set(shouldCollapse);

            // Update last offset scroll
            this._lastOffsetScroll = scrollTop;
          }),
        )
        .subscribe();
    }

    // Effect to automatically add/remove CSS class
    this._isCollapsed$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((value) => {
          if (value) {
            this._renderer.addClass(this._elementRef.nativeElement, this._class);
          } else {
            this._renderer.removeClass(this._elementRef.nativeElement, this._class);
          }
        }),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the current collapsed state
   */
  getCollapsedState(): boolean {
    return this._isCollapsed();
  }

  /**
   * Manually set the collapsed state
   */
  setCollapsedState(collapsed: boolean): void {
    this._isCollapsed.set(collapsed);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _findScrollableParent(): Element | null {
    let element = this._elementRef.nativeElement.parentElement;
    while (element) {
      const style = window.getComputedStyle(element);
      if (
        style.overflow === 'auto' ||
        style.overflow === 'scroll' ||
        style.overflowY === 'auto' ||
        style.overflowY === 'scroll'
      ) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }

  private _getScrollTop(element: Element | Window): number {
    if (element === window) {
      return window.pageYOffset || document.documentElement.scrollTop;
    }
    return (element as Element).scrollTop || 0;
  }
}
