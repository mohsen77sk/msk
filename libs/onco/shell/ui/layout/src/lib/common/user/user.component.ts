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
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { LayoutScheme, MskLayoutConfigService } from '@msk/shared/services/config';
import { UserService, User } from '@msk/onco/shell/core/user';
import { availableLangs } from '@msk/shared/constants';
import { LayoutSchemeDialogComponent } from '../layout-scheme-dialog/layout-scheme-dialog.component';
import { LayoutLanguageDialogComponent } from '../layout-language-dialog/layout-language-dialog.component';
import { tap } from 'rxjs';

@Component({
  selector: 'oc-user',
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
  private _translocoService = inject(TranslocoService);
  private _layoutConfigService = inject(MskLayoutConfigService);

  showAvatar = input(true, { transform: booleanAttribute });

  user = signal<User | null>(null);
  activeLang = signal<string>('');
  layoutScheme = signal<LayoutScheme>('auto');

  activeLangLabel = computed(() => availableLangs.find((x) => x.id === this.activeLang())?.label ?? '');

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

    // Subscribe to config changes
    this._layoutConfigService.config$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((config) => {
          this.layoutScheme.set(config.scheme);
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
   * Sign out
   */
  signOut(): void {
    this._router.navigate(['/sign-out']);
  }
}
