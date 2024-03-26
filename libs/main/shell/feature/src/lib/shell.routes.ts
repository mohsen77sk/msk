import { Route } from '@angular/router';
import { MainLayoutComponent } from '@msk/main/shell/ui/layout';

export const mainRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    data: {
      layoutType: 'empty',
    },
    children: [],
  },
];
