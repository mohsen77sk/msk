import { FormGroup } from '@angular/forms';
import { MskErrorResponseItem } from '@msk/shared/data-access';
import { camelCase } from 'lodash-es';

/**
 * Takes server error obj and set errors to appropriate fields at form given.
 *
 * @param serverError Error object that is received from the server
 * @param form Form to which errors belong to.
 * @param errorObject Error object which to set errors.
 */
export function MskSetServerErrorsFormFields(serverErrors: MskErrorResponseItem, form: FormGroup): void {
  if (!serverErrors) {
    return;
  }

  Object.keys(serverErrors).forEach((item) => {
    form.get(camelCase(item))?.setErrors({ serverError: serverErrors[item][0] });
  });
}
