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
import { TranslocoDirective } from '@ngneat/transloco';
import { MainUserService, User } from '@msk/main/shell/core/user';

@Component({
  standalone: true,
  selector: 'main-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatMenuModule, MatIconModule, MatButtonModule, TranslocoDirective],
})
export class MainUserComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  userService = inject(MainUserService);
  changeDetectorRef = inject(ChangeDetectorRef);

  @Input({ transform: booleanAttribute }) showAvatar = true;
  user!: User;

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
