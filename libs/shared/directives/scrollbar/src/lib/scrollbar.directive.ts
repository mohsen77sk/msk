import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { merge } from 'lodash-es';
import PerfectScrollbar from 'perfect-scrollbar';
import { debounceTime, fromEvent } from 'rxjs';
import { ScrollbarGeometry, ScrollbarPosition } from './scrollbar.types';

/**
 * Wrapper directive for the Perfect Scrollbar: https://github.com/mdbootstrap/perfect-scrollbar
 */
@Directive({
  standalone: true,
  selector: '[mskScrollbar]',
  exportAs: 'mskScrollbar',
})
export class MskScrollbarDirective implements OnChanges, OnInit, OnDestroy {
  destroyRef = inject(DestroyRef);

  @Input() mskScrollbar = true;
  @Input() mskScrollbarOptions!: PerfectScrollbar.Options;

  private _animation: number | undefined;
  private _options: PerfectScrollbar.Options | undefined;
  private _ps: PerfectScrollbar | undefined;

  /**
   * Constructor
   */
  constructor(private _elementRef: ElementRef, private _platform: Platform) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for _elementRef
   */
  get elementRef(): ElementRef {
    return this._elementRef;
  }

  /**
   * Getter for _ps
   */
  get ps(): PerfectScrollbar | undefined {
    return this._ps;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On changes
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Enabled
    if ('scrollbar' in changes) {
      // Interpret empty string as 'true'
      this.mskScrollbar = coerceBooleanProperty(changes['scrollbar'].currentValue);

      // If enabled, init the directive
      if (this.mskScrollbar) {
        this._init();
      }
      // Otherwise destroy it
      else {
        this._destroy();
      }
    }

    // Scrollbar options
    if ('scrollbarOptions' in changes) {
      // Merge the options
      this._options = merge({}, this._options, changes['scrollbarOptions'].currentValue);

      // Return if not initialized
      if (!this._ps) {
        return;
      }

      // Destroy and re-init the PerfectScrollbar to update its options
      setTimeout(() => {
        this._destroy();
      });

      setTimeout(() => {
        this._init();
      });
    }
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to window resize event
    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(150))
      .subscribe(() => {
        // Update the PerfectScrollbar
        this.update();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this._destroy();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Is enabled
   */
  isEnabled(): boolean {
    return this.mskScrollbar;
  }

  /**
   * Update the scrollbar
   */
  update(): void {
    // Return if not initialized
    if (!this._ps) {
      return;
    }

    // Update the PerfectScrollbar
    this._ps.update();
  }

  /**
   * Destroy the scrollbar
   */
  destroy(): void {
    this.ngOnDestroy();
  }

  /**
   * Returns the geometry of the scrollable element
   *
   * @param prefix
   */
  geometry(prefix = 'scroll'): ScrollbarGeometry {
    return new ScrollbarGeometry(
      this._elementRef.nativeElement[prefix + 'Left'],
      this._elementRef.nativeElement[prefix + 'Top'],
      this._elementRef.nativeElement[prefix + 'Width'],
      this._elementRef.nativeElement[prefix + 'Height']
    );
  }

  /**
   * Returns the position of the scrollable element
   *
   * @param absolute
   */
  position(absolute = false): ScrollbarPosition {
    let scrollbarPosition;

    if (!absolute && this._ps) {
      scrollbarPosition = new ScrollbarPosition(this._ps.reach.x || 0, this._ps.reach.y || 0);
    } else {
      scrollbarPosition = new ScrollbarPosition(
        this._elementRef.nativeElement.scrollLeft,
        this._elementRef.nativeElement.scrollTop
      );
    }

    return scrollbarPosition;
  }

  /**
   * Scroll to
   *
   * @param x
   * @param y
   * @param speed
   */
  scrollTo(x: number, y?: number, speed?: number): void {
    if (y == null && speed == null) {
      this.animateScrolling('scrollTop', x, speed);
    } else {
      if (x != null) {
        this.animateScrolling('scrollLeft', x, speed);
      }

      if (y != null) {
        this.animateScrolling('scrollTop', y, speed);
      }
    }
  }

  /**
   * Scroll to X
   *
   * @param x
   * @param speed
   */
  scrollToX(x: number, speed?: number): void {
    this.animateScrolling('scrollLeft', x, speed);
  }

  /**
   * Scroll to Y
   *
   * @param y
   * @param speed
   */
  scrollToY(y: number, speed?: number): void {
    this.animateScrolling('scrollTop', y, speed);
  }

  /**
   * Scroll to top
   *
   * @param offset
   * @param speed
   */
  scrollToTop(offset = 0, speed?: number): void {
    this.animateScrolling('scrollTop', offset, speed);
  }

  /**
   * Scroll to bottom
   *
   * @param offset
   * @param speed
   */
  scrollToBottom(offset = 0, speed?: number): void {
    const top = this._elementRef.nativeElement.scrollHeight - this._elementRef.nativeElement.clientHeight;
    this.animateScrolling('scrollTop', top - offset, speed);
  }

  /**
   * Scroll to left
   *
   * @param offset
   * @param speed
   */
  scrollToLeft(offset = 0, speed?: number): void {
    this.animateScrolling('scrollLeft', offset, speed);
  }

  /**
   * Scroll to right
   *
   * @param offset
   * @param speed
   */
  scrollToRight(offset = 0, speed?: number): void {
    const left = this._elementRef.nativeElement.scrollWidth - this._elementRef.nativeElement.clientWidth;
    this.animateScrolling('scrollLeft', left - offset, speed);
  }

  /**
   * Scroll to element
   *
   * @param qs
   * @param offset
   * @param ignoreVisible If true, scrollToElement won't happen if element is already inside the current viewport
   * @param speed
   */
  scrollToElement(qs: string, offset = 0, ignoreVisible = false, speed?: number): void {
    const element = this._elementRef.nativeElement.querySelector(qs);

    if (!element) {
      return;
    }

    const elementPos = element.getBoundingClientRect();
    const scrollerPos = this._elementRef.nativeElement.getBoundingClientRect();

    if (this._elementRef.nativeElement.classList.contains('ps--active-x')) {
      if (ignoreVisible && elementPos.right <= scrollerPos.right - Math.abs(offset)) {
        return;
      }

      const currentPos = this._elementRef.nativeElement['scrollLeft'];
      const position = elementPos.left - scrollerPos.left + currentPos;

      this.animateScrolling('scrollLeft', position + offset, speed);
    }

    if (this._elementRef.nativeElement.classList.contains('ps--active-y')) {
      if (ignoreVisible && elementPos.bottom <= scrollerPos.bottom - Math.abs(offset)) {
        return;
      }

      const currentPos = this._elementRef.nativeElement['scrollTop'];
      const position = elementPos.top - scrollerPos.top + currentPos;

      this.animateScrolling('scrollTop', position + offset, speed);
    }
  }

  /**
   * Animate scrolling
   *
   * @param target
   * @param value
   * @param speed
   */
  animateScrolling(target: string, value: number, speed?: number): void {
    if (this._animation) {
      window.cancelAnimationFrame(this._animation);
      this._animation = undefined;
    }

    if (!speed || typeof window === 'undefined') {
      this._elementRef.nativeElement[target] = value;
    } else if (value !== this._elementRef.nativeElement[target]) {
      let newValue = 0;
      let scrollCount = 0;

      let oldTimestamp = performance.now();
      let oldValue = this._elementRef.nativeElement[target];

      const cosParameter = (oldValue - value) / 2;

      const step = (newTimestamp: number): void => {
        scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));
        newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));

        // Only continue animation if scroll position has not changed
        if (this._elementRef.nativeElement[target] === oldValue) {
          if (scrollCount >= Math.PI) {
            this.animateScrolling(target, value, 0);
          } else {
            this._elementRef.nativeElement[target] = newValue;

            // On a zoomed out page the resulting offset may differ
            oldValue = this._elementRef.nativeElement[target];
            oldTimestamp = newTimestamp;

            this._animation = window.requestAnimationFrame(step);
          }
        }
      };

      window.requestAnimationFrame(step);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Initialize
   *
   * @private
   */
  private _init(): void {
    // Return if already initialized
    if (this._ps) {
      return;
    }

    // Return if on mobile or not on browser
    if (this._platform.ANDROID || this._platform.IOS || !this._platform.isBrowser) {
      this.mskScrollbar = false;
      return;
    }

    // Initialize the PerfectScrollbar
    this._ps = new PerfectScrollbar(this._elementRef.nativeElement, { ...this._options });
  }

  /**
   * Destroy
   *
   * @private
   */
  private _destroy(): void {
    // Return if not initialized
    if (!this._ps) {
      return;
    }

    // Destroy the PerfectScrollbar
    this._ps.destroy();

    // Clean up
    this._ps = undefined;
  }
}
