import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs';

@Injectable()
export class MskSplashScreenService {
  /**
   * Constructor
   */
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _router: Router,
  ) {
    // Hide it on the first NavigationEnd event
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => {
        this.hide();
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the splash screen
   */
  show(): void {
    this._document.body.classList.remove('msk-splash-screen-hidden');
  }

  /**
   * Hide the splash screen
   */
  hide(): void {
    this._document.body.classList.add('msk-splash-screen-hidden');
  }
}
