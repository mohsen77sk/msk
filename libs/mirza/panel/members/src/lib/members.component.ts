import { Component, DestroyRef, OnInit, ViewContainerRef, ViewEncapsulation, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoDirective } from '@jsverse/transloco';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskEmptyStateComponent } from '@msk/shared/ui/empty-state';
import { catchError, forkJoin, of, startWith, switchMap } from 'rxjs';
import { MembersService } from './members.service';
import { StoreMember, StoreRole } from './members.types';
import { MemberDialogComponent, MemberDialogData } from './member-dialog/member-dialog.component';
import { RoleDialogComponent, RoleDialogData } from './role-dialog/role-dialog.component';

@Component({
  selector: 'mz-members',
  templateUrl: './members.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatIconModule,
    MatTabsModule,
    MatRippleModule,
    MatButtonModule,
    TranslocoDirective,
    MskAvatarComponent,
    MskEmptyStateComponent,
  ],
})
export class MembersComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _matDialog = inject(MatDialog);
  private _viewContainerRef = inject(ViewContainerRef);
  private _membersService = inject(MembersService);

  members = signal<StoreMember[] | null>(null);
  roles = signal<StoreRole[]>([]);
  tabIndex = signal(0);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._membersService.changes$
      .pipe(
        startWith(undefined),
        switchMap(() =>
          forkJoin([this._membersService.getMembers(), this._membersService.getRoles()]).pipe(
            catchError(() => of([[], []] as [StoreMember[], StoreRole[]])),
          ),
        ),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(([members, roles]) => {
        this.members.set(members);
        this.roles.set(roles);
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Add a member (no argument) or change one's role
   *
   * @param member
   */
  openMember(member?: StoreMember): void {
    this._matDialog.open<MemberDialogComponent, MemberDialogData>(MemberDialogComponent, {
      viewContainerRef: this._viewContainerRef,
      autoFocus: !member,
      data: { member, roles: this.roles() },
    });
  }

  /**
   * Add a role (no argument) or edit one
   *
   * @param role
   */
  openRole(role?: StoreRole): void {
    this._matDialog.open<RoleDialogComponent, RoleDialogData>(RoleDialogComponent, {
      viewContainerRef: this._viewContainerRef,
      autoFocus: !role,
      data: { role },
    });
  }
}
