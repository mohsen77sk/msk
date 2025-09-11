import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  inject,
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
import { availableLangs } from '@msk/shared/utils/transloco';
import { UserService, User } from '@msk/sahebzaman/shell/core/user';
import { LayoutSchemeDialogComponent } from '../layout-scheme-dialog/layout-scheme-dialog.component';
import { LayoutLanguageDialogComponent } from '../layout-language-dialog/layout-language-dialog.component';

@Component({
  selector: 'sz-user',
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

  @Input({ transform: booleanAttribute }) showAvatar = true;
  user = signal<User | null>(null);
  activeLang = signal<string>('');
  layoutScheme = signal<LayoutScheme>('auto');

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to user changes
    this._userService.user$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((user) => {
      // Update the user signal
      this.user.set(user);
    });

    // Subscribe to config changes
    this._layoutConfigService.config$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((config) => {
      // Update the layout scheme signal
      this.layoutScheme.set(config.scheme);
    });

    // Subscribe to language changes
    this._translocoService.langChanges$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((activeLang) => {
      // Update the active lang signal
      this.activeLang.set(availableLangs.find((x) => x.id === activeLang)?.label ?? '');
    });
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
