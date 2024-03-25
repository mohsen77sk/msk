import {
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { LoadingBarService } from './loading-bar.service';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lib-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [NgIf, MatProgressBarModule],
})
export class LoadingBarComponent implements OnChanges, OnInit {
  destroyRef = inject(DestroyRef);

  @Input() autoMode = true;
  mode!: ProgressBarMode;
  progress = 0;
  show = false;

  /**
   * Constructor
   */
  constructor(private _loadingBarService: LoadingBarService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On changes
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Auto mode
    if ('autoMode' in changes) {
      // Set the auto mode in the service
      this._loadingBarService.setAutoMode(coerceBooleanProperty(changes['autoMode'].currentValue));
    }
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the service
    this._loadingBarService.mode$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((value) => (this.mode = value))
      )
      .subscribe();

    this._loadingBarService.progress$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((value) => (this.progress = value))
      )
      .subscribe();

    this._loadingBarService.show$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((value) => (this.show = value))
      )
      .subscribe();
  }
}
