import { FieldTree, ValidationError } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { MskHttpErrorResponse } from '@msk/shared/data-access';
import { mapServerErrors } from './map-server-errors';

export interface MskFormSubmissionErrorResult {
  alertMessage: string;
  validationErrors: ValidationError[] | null;
}

export function isMskHttpError(error: unknown): error is MskHttpErrorResponse {
  return (
    error instanceof HttpErrorResponse &&
    !!error.error &&
    typeof error.error === 'object' &&
    typeof error.error.message === 'string'
  );
}

export function parseSubmissionError<T>(error: unknown, form: FieldTree<T>): MskFormSubmissionErrorResult {
  if (isMskHttpError(error)) {
    return {
      alertMessage: error.error.message,
      validationErrors: error.error.errors ? mapServerErrors(error.error.errors, form) : null,
    };
  }

  if (error instanceof Error) {
    return {
      alertMessage: error.message,
      validationErrors: null,
    };
  }

  return {
    alertMessage: 'Unknown error',
    validationErrors: null,
  };
}
