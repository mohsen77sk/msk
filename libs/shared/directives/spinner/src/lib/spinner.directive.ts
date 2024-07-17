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
  OnInit,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  standalone: true,
  selector: '[mskSpinner]',
  exportAs: 'mskSpinner',
})
export class MskSpinnerDirective implements OnInit {
  private _renderer = inject(Renderer2);
  private _elementRef = inject(ElementRef);
  private _viewContainerRef = inject(ViewContainerRef);

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

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  @HostBinding('class.relative') isSpinnerExist = false;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    // Create parent division for spinner
    this._spinnerParent = document.createElement('div');
    this._spinnerParent.classList.add('absolute', 'inset-0', 'flex', 'items-center', 'justify-center', 'z-99999');
    this._spinnerParent.style.backgroundColor = 'var(--mat-ripple-color)';
    // Create spinner
    this._spinner = this._viewContainerRef.createComponent(MatProgressSpinner);
    this._spinner.instance.mode = 'indeterminate';
    this._spinner.instance.diameter = this.mskSpinnerDiameter;
    this._spinner.changeDetectorRef.detectChanges();
    // Add spinner to parent division
    this._renderer.appendChild(this._spinnerParent, this._spinner.location.nativeElement);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Hide
   */
  hide() {
    if (this.isSpinnerExist) {
      // remove parent spinner to host element
      this._renderer.removeChild(this._elementRef.nativeElement, this._spinnerParent);
      this.isSpinnerExist = false;
    }
  }

  /**
   * Show
   */
  show() {
    if (!this.isSpinnerExist) {
      // Add parent spinner to host element
      this._renderer.appendChild(this._elementRef.nativeElement, this._spinnerParent);
      this.isSpinnerExist = true;
    }
  }
}
