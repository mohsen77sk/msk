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
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  authService = inject(MainAuthService);

  countdown = 5;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Sign out
    this.authService.signOut();

    // Redirect after the countdown
    timer(1000, 1000)
      .pipe(
        finalize(() => this.router.navigate(['sign-in'])),
        takeWhile(() => this.countdown > 0),
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.countdown--)
      )
      .subscribe();
  }
}
