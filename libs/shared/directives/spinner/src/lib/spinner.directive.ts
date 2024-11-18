import {
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  ViewContainerRef,
  inject,
  numberAttribute,
  booleanAttribute,
  Renderer2,
  input,
  effect,
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

  private readonly MAT_SELECT = 'MAT-SELECT';

  /**
   * Directive value - show or hide spinner
   */
  mskSpinner = input(true, { transform: booleanAttribute });

  /**
   * Spinner diameter (will set width and height of svg)
   */
  mskSpinnerDiameter = input(24, { transform: numberAttribute });

  /**
   * constructor
   */
  constructor() {
    // Create parent division for spinner
    this._spinnerParent = document.createElement('div');
    this._spinnerParent.classList.add('absolute', 'inset-0', 'flex', 'items-center', 'justify-center', 'z-99999');
    //
    effect(() => (this.mskSpinner() ? this.show() : this.hide()));
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for nativeElement tagName
   */
  get nativeElementTagName(): string {
    return this._elementRef.nativeElement.tagName;
  }

  @HostBinding('class') get classList(): object {
    return {
      relative: this.nativeElementTagName !== this.MAT_SELECT && this._isSpinnerExist,
      'overflow-hidden': this.nativeElementTagName !== this.MAT_SELECT && this._isSpinnerExist,
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
      this._spinner.instance.diameter = this.mskSpinnerDiameter();

      // Add spinner to parent division
      this._renderer.appendChild(this._spinnerParent, this._spinner.location.nativeElement);

      // Add parent spinner to host element
      switch (this.nativeElementTagName) {
        case this.MAT_SELECT:
          // render in mat-form-field-flex
          this._renderer.appendChild(this._elementRef.nativeElement.parentElement?.parentElement, this._spinnerParent);
          break;

        default:
          // render in root element
          this._renderer.appendChild(this._elementRef.nativeElement, this._spinnerParent);
          break;
      }

      // Set flag to true
      this._isSpinnerExist = true;
    }
  }
}
