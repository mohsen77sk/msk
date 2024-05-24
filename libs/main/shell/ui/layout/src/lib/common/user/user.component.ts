import { NgClass, getLocaleDirection } from '@angular/common';
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
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { LayoutScheme, MskLayoutConfigService } from '@msk/shared/services/config';
import { availableLangs } from '@msk/shared/utils/transloco';
import { MainUserService, User } from '@msk/main/shell/core/user';
import { MainLayoutSchemeDialogComponent } from '../layout-scheme-dialog/layout-scheme-dialog.component';
import { MainLayoutLanguageDialogComponent } from '../layout-language-dialog/layout-language-dialog.component';
import { Direction } from '@angular/cdk/bidi';

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
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  dialog = inject(MatDialog);
  userService = inject(MainUserService);
  translocoService = inject(TranslocoService);
  layoutConfigService = inject(MskLayoutConfigService);
  changeDetectorRef = inject(ChangeDetectorRef);

  @Input({ transform: booleanAttribute }) showAvatar = true;
  user!: User;

  activeLang!: string;
  layoutScheme!: LayoutScheme;
  layoutDirection!: Direction;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to user changes
    this.userService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      // Get the current user
      this.user = user;
      // Mark for check
      this.changeDetectorRef.markForCheck();
    });

    // Subscribe to config changes
    this.layoutConfigService.config$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((config) => {
      // Get the config
      this.layoutScheme = config.scheme;
      this.layoutDirection = getLocaleDirection(config.locale);
      // Mark for check
      this.changeDetectorRef.markForCheck();
    });

    // Subscribe to language changes
    this.translocoService.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((activeLang) => {
      // Get the active lang
      this.activeLang = availableLangs.find((x) => x.id === activeLang)?.label ?? '';
      // Mark for check
      this.changeDetectorRef.markForCheck();
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open schema dialog
   */
  openLayoutSchemeDialog() {
    this.dialog.open(MainLayoutSchemeDialogComponent, { direction: this.layoutDirection }).afterClosed().subscribe();
  }

  /**
   * Open language dialog
   */
  openLayoutLanguageDialog() {
    this.dialog.open(MainLayoutLanguageDialogComponent, { direction: this.layoutDirection }).afterClosed().subscribe();
  }

  /**
   * Sign out
   */
  signOut(): void {
    this.router.navigate(['/sign-out']);
  }
}
