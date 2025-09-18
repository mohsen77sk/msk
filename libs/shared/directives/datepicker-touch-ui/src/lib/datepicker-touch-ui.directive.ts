import { DestroyRef, Directive, OnInit, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDatepicker } from '@angular/material/datepicker';
import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';

@Directive({
  standalone: true,
  selector: '[mskDatepickerTouchUi]',
  exportAs: 'mskDatepickerTouchUi',
})
export class MskDatepickerTouchUiDirective implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _datepicker = inject(MatDatepicker);
  private _mediaWatcher = inject(MskMediaWatcherService);

  /** Transform helper to normalize input to a non-empty alias. */
  private _aliasTransform = (value: unknown): string => {
    const v = (value ?? '').toString().trim();
    return v.length > 0 ? v : 'md';
  };

  /** Breakpoint alias via directive input. Accepts empty or missing -> defaults to 'md'. */
  mskDatepickerTouchUi = input<string, string>('md', { transform: this._aliasTransform });

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._mediaWatcher.onMediaChange$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ matchingAliases }) => {
      // If the alias is NOT matched, we consider the screen smaller than that alias
      // and enable touch UI for the datepicker. Otherwise, disable it.
      this._datepicker.touchUi = !matchingAliases.includes(this.mskDatepickerTouchUi());
    });
  }
}
