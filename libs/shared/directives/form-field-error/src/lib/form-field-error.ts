import { Directive, ElementRef, effect, inject, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { MskFormErrorMapperService } from './form-error-mapper.service';
import { MskValidationError } from './form-field-error.types';

@Directive({
  selector: 'mat-error[mskFormFieldError]',
})
export class MskFormFieldErrorDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly mapper = inject(MskFormErrorMapperService);

  mskFormField = input.required<FieldTree<string, string>>({ alias: 'mskFormFieldError' });

  constructor() {
    effect(() => {
      const state = this.mskFormField()();

      const error = state.errors()?.[0] as MskValidationError | undefined;

      this.elementRef.nativeElement.textContent = this.mapper.getMessage(error);
    });
  }
}
