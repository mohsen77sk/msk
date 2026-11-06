import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { PublicMenu } from './public-menu.types';

@Injectable({ providedIn: 'root' })
export class PublicMenuService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get a published menu by its public slug.
   * The `/public/` path is excluded from the auth interceptor, so no Authorization or Store-Id header is sent.
   *
   * @param slug
   */
  getMenu(slug: string): Observable<PublicMenu> {
    return this._httpClient
      .get<PublicMenu>(`${this._appConfig.apiEndpoint}/public/menu/${encodeURIComponent(slug)}`)
      .pipe(map((response) => new PublicMenu(response)));
  }
}
