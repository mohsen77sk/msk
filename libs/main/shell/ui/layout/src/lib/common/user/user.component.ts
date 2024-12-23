import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { LayoutScheme, MskLayoutConfigService } from '@msk/shared/services/config';
import { availableLangs } from '@msk/shared/utils/transloco';
import { MainUserService, User } from '@msk/main/shell/core/user';
import { MainLayoutSchemeDialogComponent } from '../layout-scheme-dialog/layout-scheme-dialog.component';
import { MainLayoutLanguageDialogComponent } from '../layout-language-dialog/layout-language-dialog.component';

@Component({
  standalone: true,
  selector: 'main-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TranslocoDirective,
    MainLayoutSchemeDialogComponent,
    MainLayoutLanguageDialogComponent,
  ],
})
export class MainUserComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  private _userService = inject(MainUserService);
  private _translocoService = inject(TranslocoService);
  private _layoutConfigService = inject(MskLayoutConfigService);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  @Input({ transform: booleanAttribute }) showAvatar = true;
  user!: User;

  activeLang!: string;
  layoutScheme!: LayoutScheme;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to user changes
    this._userService.user$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((user) => {
      // Get the current user
      this.user = user;
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });

    // Subscribe to config changes
    this._layoutConfigService.config$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((config) => {
      // Get the config
      this.layoutScheme = config.scheme;
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });

    // Subscribe to language changes
    this._translocoService.langChanges$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((activeLang) => {
      // Get the active lang
      this.activeLang = availableLangs.find((x) => x.id === activeLang)?.label ?? '';
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open schema dialog
   */
  openLayoutSchemeDialog() {
    this._dialog.open(MainLayoutSchemeDialogComponent).afterClosed().subscribe();
  }

  /**
   * Open language dialog
   */
  openLayoutLanguageDialog() {
    this._dialog.open(MainLayoutLanguageDialogComponent).afterClosed().subscribe();
  }

  /**
   * Sign out
   */
  signOut(): void {
    this._router.navigate(['/sign-out']);
  }
}
