import { DestroyRef, Directive, ElementRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[libScrollReset]',
  exportAs: 'libScrollReset',
})
export class ScrollResetDirective implements OnInit {
  destroyRef = inject(DestroyRef);

  /**
   * Constructor
   */
  constructor(private _elementRef: ElementRef, private _router: Router) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to NavigationEnd event
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // Reset the element's scroll position to the top
        this._elementRef.nativeElement.scrollTop = 0;
      });
  }
}
