import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
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
export class MskAlertComponent implements OnChanges, OnInit {
  destroyRef = inject(DestroyRef);

  @Input() appearance: MskAlertAppearance = 'soft';
  @Input() dismissed = false;
  @Input() dismissible = false;
  @Input() name: string = this._mskUtilsService.randomId();
  @Input() showIcon = true;
  @Input() type: MskAlertType = 'basic';
  @Output() readonly dismissedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _mskAlertService: MskAlertService,
    private _mskUtilsService: MskUtilsService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Host binding for component classes
   */
  @HostBinding('class') get classList(): object {
    return {
      [`msk-alert-appearance-${this.appearance}`]: true,
      'msk-alert-dismissed': this.dismissed,
      'msk-alert-dismissible': this.dismissible,
      'msk-alert-show-icon': this.showIcon,
      [`msk-alert-type-${this.type}`]: true,
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On changes
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Dismissed
    if ('dismissed' in changes) {
      // Coerce the value to a boolean
      this.dismissed = coerceBooleanProperty(changes['dismissed'].currentValue);

      // Dismiss/show the alert
      this._toggleDismiss(this.dismissed);
    }

    // Dismissible
    if ('dismissible' in changes) {
      // Coerce the value to a boolean
      this.dismissible = coerceBooleanProperty(changes['dismissible'].currentValue);
    }

    // Show icon
    if ('showIcon' in changes) {
      // Coerce the value to a boolean
      this.showIcon = coerceBooleanProperty(changes['showIcon'].currentValue);
    }
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the dismiss calls
    this._mskAlertService.onDismiss
      .pipe(
        filter((name) => this.name === name),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // Dismiss the alert
        this.dismiss();
      });

    // Subscribe to the show calls
    this._mskAlertService.onShow
      .pipe(
        filter((name) => this.name === name),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // Show the alert
        this.show();
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Dismiss the alert
   */
  dismiss(): void {
    // Return if the alert is already dismissed
    if (this.dismissed) {
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
    if (!this.dismissed) {
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
    if (!this.dismissible) {
      return;
    }

    // Set the dismissed
    this.dismissed = dismissed;

    // Execute the observable
    this.dismissedChanged.next(this.dismissed);

    // Notify the change detector
    this._changeDetectorRef.markForCheck();
  }
}
