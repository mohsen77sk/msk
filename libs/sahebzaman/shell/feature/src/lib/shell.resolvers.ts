import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UserService } from '@msk/sahebzaman/shell/core/user';
import { NavigationService } from '@msk/sahebzaman/shell/core/navigation';

export const initialDataResolver = () => {
  const userService = inject(UserService);
  const navigationService = inject(NavigationService);

  // Fork join multiple API endpoint calls to wait all of them to finish
  return forkJoin([userService.get(), navigationService.get()]);
};
