import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { mskAnimations } from '@msk/shared/animations';
import { MskUtilsService } from '@msk/shared/services/utils';
import { MskAlertService } from './alert.service';
import { MskAlertAppearance, MskAlertType } from './alert.types';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'msk-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  exportAs: 'mskAlert',
  animations: mskAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule],
})
export class MskAlertComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _mskAlertService = inject(MskAlertService);
  private _mskUtilsService = inject(MskUtilsService);

  hasDismissed = signal(false);

  name = input<string>(this._mskUtilsService.randomId());
  type = input<MskAlertType>('basic');
  showIcon = input(true, { transform: booleanAttribute });
  dismissed = input(false, { transform: booleanAttribute });
  dismissible = input(false, { transform: booleanAttribute });
  appearance = input<MskAlertAppearance>('soft');
  dismissedChanged = output<boolean>();

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      this._toggleDismiss(this.dismissed());
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Host binding for component classes
   */
  @HostBinding('class') get classList(): object {
    return {
      [`msk-alert-appearance-${this.appearance()}`]: true,
      'msk-alert-dismissed': this.hasDismissed(),
      'msk-alert-dismissible': this.dismissible(),
      'msk-alert-show-icon': this.showIcon(),
      [`msk-alert-type-${this.type()}`]: true,
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the dismiss calls
    this._mskAlertService.onDismiss
      .pipe(
        filter((name) => this.name() === name),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(() => this.dismiss());

    // Subscribe to the show calls
    this._mskAlertService.onShow
      .pipe(
        filter((name) => this.name() === name),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(() => this.show());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Dismiss the alert
   */
  dismiss(): void {
    // Return if the alert is already dismissed
    if (this.hasDismissed()) {
      return;
    }

    // Dismiss the alert
    this._toggleDismiss(true);
  }

  /**
   * Show the dismissed alert
   */
  show(): void {
    // Return if the alert is already showing
    if (!this.hasDismissed()) {
      return;
    }

    // Show the alert
    this._toggleDismiss(false);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Dismiss/show the alert
   *
   * @param dismissed
   * @private
   */
  private _toggleDismiss(dismissed: boolean): void {
    // Return if the alert is not dismissible
    if (!this.dismissible()) {
      return;
    }

    // Set the dismissed
    this.hasDismissed.set(dismissed);

    // Execute the observable
    this.dismissedChanged.emit(dismissed);
  }
}
