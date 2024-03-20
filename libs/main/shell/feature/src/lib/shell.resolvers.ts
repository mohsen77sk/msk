import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';

export const initialDataResolver = () => {
  // Fork join multiple API endpoint calls to wait all of them to finish
  return forkJoin([]);
};
