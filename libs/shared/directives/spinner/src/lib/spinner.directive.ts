import {
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  ViewContainerRef,
  inject,
  numberAttribute,
  booleanAttribute,
  Renderer2,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  standalone: true,
  selector: '[mskSpinner]',
  exportAs: 'mskSpinner',
})
export class MskSpinnerDirective {
  private _renderer = inject(Renderer2);
  private _elementRef = inject(ElementRef);
  private _viewContainerRef = inject(ViewContainerRef);

  private _isSpinnerExist = false;
  private _spinnerParent!: HTMLDivElement;
  private _spinner!: ComponentRef<MatProgressSpinner>;

  /**
   * Directive value - show or hide spinner
   */
  @Input({ transform: booleanAttribute })
  set mskSpinner(val: boolean) {
    val ? this.show() : this.hide();
  }

  /**
   * Spinner diameter (will set width and height of svg)
   */
  @Input({ transform: numberAttribute }) mskSpinnerDiameter = 24;

  /**
   * constructor
   */
  constructor() {
    // Create parent division for spinner
    this._spinnerParent = document.createElement('div');
    this._spinnerParent.classList.add('absolute', 'inset-0', 'flex', 'items-center', 'justify-center', 'z-99999');
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  @HostBinding('class') get classList(): object {
    return {
      relative: this._isSpinnerExist,
      'overflow-hidden': this._isSpinnerExist,
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Hide
   */
  hide() {
    if (this._isSpinnerExist) {
      // Remove spinner
      this._viewContainerRef.remove();
      // Remove parent spinner
      this._renderer.removeChild(this._elementRef.nativeElement, this._spinnerParent);
      // Set flag to false
      this._isSpinnerExist = false;
    }
  }

  /**
   * Show
   */
  show() {
    if (!this._isSpinnerExist) {
      // Create spinner
      this._spinner = this._viewContainerRef.createComponent(MatProgressSpinner);
      this._spinner.instance.mode = 'indeterminate';
      this._spinner.instance.diameter = this.mskSpinnerDiameter;
      // Add spinner to parent division
      this._renderer.appendChild(this._spinnerParent, this._spinner.location.nativeElement);
      // Add parent spinner to host element
      this._renderer.appendChild(this._elementRef.nativeElement, this._spinnerParent);
      // Set flag to true
      this._isSpinnerExist = true;
    }
  }
}
