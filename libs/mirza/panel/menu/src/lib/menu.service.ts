import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { IMenuConfigResponse, MenuConfig, UpdateMenuRequest } from './menu.types';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the current store's menu configuration
   */
  getMenu(): Observable<MenuConfig> {
    return this._httpClient
      .get<IMenuConfigResponse>(`${this._appConfig.apiEndpoint}/menu`)
      .pipe(map((response) => new MenuConfig(response)));
  }

  /**
   * Update the enabled state and public slug
   *
   * @param payload
   */
  updateMenu(payload: UpdateMenuRequest): Observable<MenuConfig> {
    return this._httpClient
      .patch<IMenuConfigResponse>(`${this._appConfig.apiEndpoint}/menu`, payload)
      .pipe(map((response) => new MenuConfig(response)));
  }

  /**
   * Replace the menu products; the array order is the display order
   *
   * @param productIds
   */
  setProducts(productIds: number[]): Observable<MenuConfig> {
    return this._httpClient
      .put<IMenuConfigResponse>(`${this._appConfig.apiEndpoint}/menu/products`, { productIds })
      .pipe(map((response) => new MenuConfig(response)));
  }
}
