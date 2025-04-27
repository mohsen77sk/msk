import { Component, DestroyRef, OnInit, ViewEncapsulation, booleanAttribute, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { MskLoadingBarService } from './loading-bar.service';
import { map } from 'rxjs';

@Component({
  selector: 'msk-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.css'],
  exportAs: 'mskLoadingBar',
  encapsulation: ViewEncapsulation.None,
  imports: [MatProgressBarModule],
})
export class MskLoadingBarComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _mskLoadingBarService = inject(MskLoadingBarService);

  autoMode = input(true, { transform: booleanAttribute });
  mode!: ProgressBarMode;
  progress = 0;
  show = false;

  /**
   * Constructor
   */
  constructor() {
    // Set the auto mode in the service
    toObservable(this.autoMode).subscribe((autoMode) => {
      this._mskLoadingBarService.setAutoMode(autoMode);
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the service
    this._mskLoadingBarService.mode$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((value) => (this.mode = value))
      )
      .subscribe();

    this._mskLoadingBarService.progress$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((value) => (this.progress = value))
      )
      .subscribe();

    this._mskLoadingBarService.show$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((value) => (this.show = value))
      )
      .subscribe();
  }
}
