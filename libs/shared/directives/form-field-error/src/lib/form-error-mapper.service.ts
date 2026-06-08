import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MskValidationError } from './form-field-error.types';

@Injectable({
  providedIn: 'root',
})
export class MskFormErrorMapperService {
  private readonly transloco = inject(TranslocoService);

  getMessage(error: MskValidationError | undefined): string {
    if (!error) {
      return '';
    }

    switch (error.kind) {
      case 'required':
        return this.transloco.translate('error-validation.required');

      case 'email':
        return this.transloco.translate('error-validation.email');

      case 'pattern':
        return this.transloco.translate('error-validation.pattern');

      case 'minLength':
        return this.transloco.translate('error-validation.min-length', {
          min: error.minLength,
        });

      case 'maxLength':
        return this.transloco.translate('error-validation.max-length', {
          max: error.maxLength,
        });

      case 'min':
        return this.transloco.translate('error-validation.min', {
          min: error.min,
        });

      case 'max':
        return this.transloco.translate('error-validation.max', {
          max: error.max,
        });

      case 'iranianIBAN':
        return this.transloco.translate('error-validation.iranian-iban');

      case 'passwordMismatch':
        return this.transloco.translate('error-validation.passwords-must-match');

      case 'serverError':
        return error.message;

      default:
        return '';
    }
  }
}
