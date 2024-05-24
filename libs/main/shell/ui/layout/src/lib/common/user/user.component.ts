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
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { LayoutScheme, MskLayoutConfigService } from '@msk/shared/services/config';
import { availableLangs } from '@msk/shared/utils/transloco';
import { MainUserService, User } from '@msk/main/shell/core/user';

@Component({
  standalone: true,
  selector: 'main-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatMenuModule, MatIconModule, MatButtonModule, TranslocoDirective],
})
export class MainUserComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  userService = inject(MainUserService);
  translocoService = inject(TranslocoService);
  layoutConfigService = inject(MskLayoutConfigService);
  changeDetectorRef = inject(ChangeDetectorRef);

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
    this.userService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user: User) => {
      // Get the current user
      this.user = user;
      // Mark for check
      this.changeDetectorRef.markForCheck();
    });

    // Subscribe to config changes
    this.layoutConfigService.config$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((config) => {
      // Get the scheme config
      this.layoutScheme = config.scheme;
    });

    // Subscribe to language changes
    this.translocoService.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((activeLang) => {
      // Get the active lang
      this.activeLang = availableLangs.find((x) => x.id === activeLang)?.label ?? '';
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign out
   */
  signOut(): void {
    this.router.navigate(['/sign-out']);
  }
}
