import { Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { MainAuthService } from '@msk/main/shell/core/auth';
import { finalize, takeWhile, tap, timer } from 'rxjs';

@Component({
  standalone: true,
  selector: 'main-sign-out',
  templateUrl: './sign-out.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, TranslocoDirective],
})
export class SignOutComponent implements OnInit {
  private _router = inject(Router);
  private _destroyRef = inject(DestroyRef);
  private _authService = inject(MainAuthService);

  countdown = 5;

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
        finalize(() => this._router.navigate(['sign-in'])),
        takeWhile(() => this.countdown > 0),
        takeUntilDestroyed(this._destroyRef),
        tap(() => this.countdown--)
      )
      .subscribe();
  }
}
