import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslocoDirective } from '@jsverse/transloco';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { LayoutScheme, MskLayoutConfigService } from '@msk/shared/services/config';
import { availableCurrencies, availableLangs } from '@msk/shared/constants';
import { UserService, User } from '@msk/mirza/shell/core/user';
import { StoreService, Store } from '@msk/mirza/shell/core/store';
import { LayoutSchemeDialogComponent } from '../layout-scheme-dialog/layout-scheme-dialog.component';
import { LayoutLanguageDialogComponent } from '../layout-language-dialog/layout-language-dialog.component';
import { LayoutCurrencyDialogComponent } from '../layout-currency-dialog/layout-currency-dialog.component';
import { tap } from 'rxjs';

@Component({
  selector: 'mz-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TranslocoDirective,
    MskAvatarComponent,
  ],
})
export class UserComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  private _userService = inject(UserService);
  private _storeService = inject(StoreService);
  private _layoutConfigService = inject(MskLayoutConfigService);

  showAvatar = input(true, { transform: booleanAttribute });

  user = signal<User | null>(null);
  activeLang = signal<string>('');
  activeCurrency = signal<string>('');
  layoutScheme = signal<LayoutScheme>('auto');
  stores = signal<Store[]>([]);
  currentStore = signal<Store | null>(null);
  showMoreStores = signal<boolean>(false);

  activeLangLabel = computed(() => availableLangs.find((x) => x.id === this.activeLang())?.label ?? '');
  activeCurrencyLabel = computed(() => availableCurrencies.find((x) => x.code === this.activeCurrency())?.label ?? '');

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to user changes
    this._userService.user$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((user) => this.user.set(user)),
      )
      .subscribe();

    // Subscribe to stores changes
    this._storeService.stores$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((stores) => this.stores.set(stores)),
      )
      .subscribe();

    // Subscribe to current store changes
    this._storeService.currentStore$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((store) => this.currentStore.set(store)),
      )
      .subscribe();

    // Subscribe to config changes
    this._layoutConfigService.config$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((config) => {
          this.activeLang.set(config.lang);
          this.layoutScheme.set(config.scheme);
          this.activeCurrency.set(config.currency);
        }),
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open schema dialog
   */
  openLayoutSchemeDialog() {
    this._dialog.open(LayoutSchemeDialogComponent).afterClosed().subscribe();
  }

  /**
   * Open language dialog
   */
  openLayoutLanguageDialog() {
    this._dialog.open(LayoutLanguageDialogComponent).afterClosed().subscribe();
  }

  /**
   * Open currency dialog
   */
  openLayoutCurrencyDialog() {
    this._dialog.open(LayoutCurrencyDialogComponent).afterClosed().subscribe();
  }

  /**
   * Toggle more stores
   */
  toggleMoreStores() {
    this.showMoreStores.set(!this.showMoreStores());
  }

  /**
   * Select active store
   * @param store
   */
  selectActiveStore(store: Store) {
    if (this.currentStore()?.id === store.id) {
      return;
    }

    this._storeService.currentStore = store;
    this._router.navigate(['/panel/redirect']);
  }

  /**
   * Sign out
   */
  signOut(): void {
    this._router.navigate(['/sign-out']);
  }
}
