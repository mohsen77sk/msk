import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MainNavigationService } from '@msk/main/shell/core/navigation';

export const initialMainDataResolver = () => {
  const navigationService = inject(MainNavigationService);

  // Fork join multiple API endpoint calls to wait all of them to finish
  return forkJoin([navigationService.get()]);
};
