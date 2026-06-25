import { afterNextRender, Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[mskAutoFocus]',
  exportAs: 'mskAutoFocus',
})
export class MskAutoFocusDirective {
  private _elementRef = inject(ElementRef<HTMLElement>);

  shouldFocus = input<boolean | string>(true, { alias: 'mskAutoFocus' });

  /**
   * constructor
   */
  constructor() {
    afterNextRender(() => {
      const val = this.shouldFocus();
      if (val || val === '') {
        this._elementRef.nativeElement.focus();
      }
    });
  }
}
