import { NgValidationError } from '@angular/forms/signals';

export interface ServerValidationError {
  kind: 'serverError';
  message: string;
}

export interface PasswordMismatchError {
  kind: 'passwordMismatch';
}

export interface IranianIbanError {
  kind: 'iranianIBAN';
}

export type MskValidationError = NgValidationError | ServerValidationError | PasswordMismatchError | IranianIbanError;
