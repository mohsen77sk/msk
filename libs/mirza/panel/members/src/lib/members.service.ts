import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { Observable, Subject, map, tap } from 'rxjs';
import { IAddStoreMember, ISaveStoreRole, StoreMember, StoreRole } from './members.types';

@Injectable({ providedIn: 'root' })
export class MembersService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Any change to members or roles (a role's member count changes with its members)
  private _changes = new Subject<void>();

  get changes$(): Observable<void> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Members
  // -----------------------------------------------------------------------------------------------------

  getMembers(): Observable<StoreMember[]> {
    return this._httpClient
      .get<StoreMember[]>(`${this._appConfig.apiEndpoint}/store-member`)
      .pipe(map((response) => response.map((item) => new StoreMember(item))));
  }

  /**
   * Add a member by phone; an unknown phone gets a new account
   *
   * @param member
   */
  addMember(member: IAddStoreMember): Observable<StoreMember> {
    return this._httpClient.post<StoreMember>(`${this._appConfig.apiEndpoint}/store-member`, member).pipe(
      map((response) => new StoreMember(response)),
      tap(() => this._changes.next()),
    );
  }

  /**
   * @param userId
   * @param roleId
   */
  updateMemberRole(userId: number, roleId: number): Observable<StoreMember> {
    return this._httpClient
      .patch<StoreMember>(`${this._appConfig.apiEndpoint}/store-member/${userId}`, { roleId })
      .pipe(
        map((response) => new StoreMember(response)),
        tap(() => this._changes.next()),
      );
  }

  /**
   * @param userId
   */
  removeMember(userId: number): Observable<unknown> {
    return this._httpClient
      .delete(`${this._appConfig.apiEndpoint}/store-member/${userId}`)
      .pipe(tap(() => this._changes.next()));
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Roles
  // -----------------------------------------------------------------------------------------------------

  getRoles(): Observable<StoreRole[]> {
    return this._httpClient
      .get<StoreRole[]>(`${this._appConfig.apiEndpoint}/store-role`)
      .pipe(map((response) => response.map((item) => new StoreRole(item))));
  }

  /**
   * @param role
   */
  createRole(role: ISaveStoreRole): Observable<StoreRole> {
    return this._httpClient.post<StoreRole>(`${this._appConfig.apiEndpoint}/store-role`, role).pipe(
      map((response) => new StoreRole(response)),
      tap(() => this._changes.next()),
    );
  }

  /**
   * @param id
   * @param role
   */
  updateRole(id: number, role: ISaveStoreRole): Observable<StoreRole> {
    return this._httpClient.patch<StoreRole>(`${this._appConfig.apiEndpoint}/store-role/${id}`, role).pipe(
      map((response) => new StoreRole(response)),
      tap(() => this._changes.next()),
    );
  }

  /**
   * Only roles the store added itself, and only without members
   *
   * @param id
   */
  deleteRole(id: number): Observable<unknown> {
    return this._httpClient
      .delete(`${this._appConfig.apiEndpoint}/store-role/${id}`)
      .pipe(tap(() => this._changes.next()));
  }
}
