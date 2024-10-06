import { FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * Validate all form fields
 *
 * @param formGroup FormGroup
 */
export function MskValidateFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach((field) => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched();
      control.updateValueAndValidity();
    } else if (control instanceof FormGroup) {
      MskValidateFormFields(control);
    } else if (control instanceof FormArray) {
      control.controls.forEach((f) => {
        MskValidateFormFields(f as FormGroup);
      });
    }
  });
}
