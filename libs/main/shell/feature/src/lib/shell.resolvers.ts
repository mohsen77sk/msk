import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MainUserService } from '@msk/main/shell/core/user';
import { MainNavigationService } from '@msk/main/shell/core/navigation';

export const initialMainDataResolver = () => {
  const userService = inject(MainUserService);
  const navigationService = inject(MainNavigationService);

  // Fork join multiple API endpoint calls to wait all of them to finish
  return forkJoin([userService.get(), navigationService.get()]);
};
