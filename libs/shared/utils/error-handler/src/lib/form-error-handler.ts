import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';

export interface FormError {
  [key: string]: any;
}

export class MskHandleFormErrors {
  private _transloco!: TranslocoService;

  /**
   * Listen's for invalid status of the form given and find's it's errors.
   *
   * @param form Form to be listened
   * @param errorObject Error object which to set errors.
   * @param translocoService Translate service for errors.
   */
  constructor(form: FormGroup, errorObject: object, translocoService: TranslocoService) {
    this._transloco = translocoService;
    this._handleFormErrors(form, errorObject);
  }

  /**
   * Listen's for invalid status of the form given and find's it's errors.
   *
   * @param form Form to be listened
   * @param errorObject Error object which to set errors.
   */
  private _handleFormErrors(form: FormGroup, errorObject: object): void {
    form.statusChanges.subscribe(() => {
      this._findErrors(form, errorObject);
    });
  }

  /**
   * Find which control contains the error and set required { control -> error message } combination
   * into the errorObject given previously.
   *
   * @param formGroup
   * @param errorObject
   */
  private _findErrors(formGroup: FormGroup, errorObject: FormError): void {
    Object.keys(formGroup.controls).forEach((field: string) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        this._findErrorsOnFormControls(errorObject, control, field);
      } else if (control instanceof FormGroup) {
        Object.defineProperty(errorObject, field, {
          value: {},
          writable: true,
        });
        this._findErrors(control, errorObject[field]);
      } else if (control instanceof FormArray) {
        Object.defineProperty(errorObject, field, {
          value: [],
          writable: true,
        });
        control.controls.forEach((f) => this._findErrors(f as FormGroup, errorObject[field]));
      }
    });
  }

  /**
   * If control has error, Set error for field on error object
   *
   * @param errorObject
   * @param control
   * @param field
   */
  private _findErrorsOnFormControls(errorObject: FormError, control: FormControl, field: string): void {
    // If has error on control
    if (control.invalid && (control.dirty || control.touched)) {
      // Set error to errorObject
      Object.defineProperty(errorObject, field, {
        writable: true,
        configurable: true,
        value: this._getErrorMessage(control.errors),
      });
    } else {
      // Remove field from error object if no error exists on this field anymore.
      delete errorObject[field];
    }
  }

  /**
   * Find's error type and get's a message value for this type.
   *
   * @param errors Validation Error obj.
   */
  private _getErrorMessage(errors: ValidationErrors | null): string {
    if (!errors) {
      return '';
    }

    if (errors['serverError']) {
      return errors['serverError'];
    } else if (errors['required']) {
      return this._transloco.translate('error-validation.required');
    } else if (errors['minlength']) {
      return this._transloco.translate('error-validation.min-length', { min: errors['minlength'].requiredLength });
    } else if (errors['maxlength']) {
      return this._transloco.translate('error-validation.max-length', { max: errors['maxlength'].requiredLength });
    } else if (errors['min']) {
      return this._transloco.translate('error-validation.min', { min: errors['min'].min });
    } else if (errors['max']) {
      return this._transloco.translate('error-validation.max', { max: errors['max'].max });
    } else if (errors['email']) {
      return this._transloco.translate('error-validation.email');
    } else if (errors['pattern']) {
      return this._transloco.translate('error-validation.pattern');
    } else if (errors['iranianIBAN']) {
      return this._transloco.translate('error-validation.iranian-iban');
    } else if (errors['passwordMismatch']) {
      return this._transloco.translate('error-validation.passwords-must-match');
    } else {
      return '';
    }
  }
}
