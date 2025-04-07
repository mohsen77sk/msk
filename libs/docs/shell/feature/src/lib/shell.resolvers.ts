import { inject } from '@angular/core';
import { DocsNavigationService } from '@msk/docs/shell/core/navigation';
import { forkJoin } from 'rxjs';

export const initialDocsDataResolver = () => {
  const navigationService = inject(DocsNavigationService);

  // Fork join multiple API endpoint calls to wait all of them to finish
  return forkJoin([navigationService.get()]);
};
