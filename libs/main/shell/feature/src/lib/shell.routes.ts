import { Route } from '@angular/router';
import { LayoutComponent } from '@msk/main/shell/ui/layout';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    data: {
      layoutType: 'empty',
    },
    children: [],
  },
];
