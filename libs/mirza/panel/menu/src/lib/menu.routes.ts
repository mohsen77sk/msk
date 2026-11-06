import { Routes } from '@angular/router';
import { MenuComponent } from './menu.component';
import { provideMenuTranslocoScope } from './menu.scope';

// The menu's products (selection and order). Its on/off switch, address and QR code live in the
// store settings page (menu dialogs); this page is opened from there.
export const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    providers: [provideMenuTranslocoScope()],
  },
];
