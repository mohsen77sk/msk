import { inject } from '@angular/core';
import { forkJoin, tap } from 'rxjs';
import { UserService } from '@msk/mirza/shell/core/user';
import { StoreService } from '@msk/mirza/shell/core/store';
import { NavigationService } from '@msk/mirza/shell/core/navigation';

export const initialDataResolver = () => {
  const userService = inject(UserService);
  const storeService = inject(StoreService);
  const navigationService = inject(NavigationService);

  // Fork join multiple API endpoint calls to wait all of them to finish
  return forkJoin([
    userService.get(),
    storeService.getAll().pipe(tap((res) => (storeService.currentStore = res.filter((x) => x.isActive)[0]))),
    navigationService.get(),
  ]);
};
