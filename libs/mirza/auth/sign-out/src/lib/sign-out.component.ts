import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { finalize, takeWhile, tap, timer } from 'rxjs';

@Component({
  selector: 'mz-sign-out',
  templateUrl: './sign-out.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoDirective],
})
export class SignOutComponent implements OnInit {
  private _router = inject(Router);
  private _destroyRef = inject(DestroyRef);

  countdown = signal(5);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Redirect after the countdown
    timer(1000, 1000)
      .pipe(
        finalize(() => this._router.navigate(['sign-in'])),
        takeWhile(() => this.countdown() > 0),
        takeUntilDestroyed(this._destroyRef),
        tap(() => this.countdown.set(this.countdown() - 1))
      )
      .subscribe();
  }
}
