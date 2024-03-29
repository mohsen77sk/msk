import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@msk/client/web-app/shell/core/auth';
import { Subject, timer, finalize, takeUntil, takeWhile, tap } from 'rxjs';

@Component({
  selector: 'msk-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignOutComponent implements OnInit, OnDestroy {
  countdown = 5;

  private _unsubscribeAll: Subject<void> = new Subject();

  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Sign out
    this._authService.signOut();

    // Redirect after the countdown
    timer(1000, 1000)
      .pipe(
        finalize(() => {
          this._router.navigate(['sign-in']);
        }),
        takeWhile(() => this.countdown > 0),
        takeUntil(this._unsubscribeAll),
        tap(() => this.countdown--),
      )
      .subscribe();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
