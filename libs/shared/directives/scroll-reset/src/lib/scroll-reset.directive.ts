import { DestroyRef, Directive, ElementRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[mskScrollReset]',
  exportAs: 'mskScrollReset',
})
export class MskScrollResetDirective implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _elementRef = inject(ElementRef);
  private _router = inject(Router);

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
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(() => {
        // Reset the element's scroll position to the top
        this._elementRef.nativeElement.scrollTop = 0;
      });
  }
}
