import { ValidationError, FieldTree } from '@angular/forms/signals';
import { MskErrorResponseItem } from '@msk/shared/data-access';
import { camelCase } from 'lodash-es';

export function mapServerErrors<T>(serverErrors: MskErrorResponseItem, form: FieldTree<T>): ValidationError[] {
  const errors: ValidationError[] = [];

  Object.entries(serverErrors).forEach(([key, messages]) => {
    const field = (form as any)[camelCase(key)];

    if (!field) {
      return;
    }

    errors.push({
      kind: 'serverError',
      message: messages[0],
      fieldTree: field,
    } as any);
  });

  return errors;
}
