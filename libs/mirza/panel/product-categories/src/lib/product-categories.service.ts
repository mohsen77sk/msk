import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import {
  MskPagingResponse,
  MskPageData,
  MskPagingRequest,
  convertToMirzaPagingRequest,
  MskChangeEvent,
} from '@msk/shared/data-access';
import { ProductCategory, DefaultProductCategorySortData } from './product-categories.types';

@Injectable({ providedIn: 'root' })
export class ProductCategoriesService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _changes = new Subject<MskChangeEvent<ProductCategory>>();

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stream of CRUD changes for in-place list updates
   */
  get changes$(): Observable<MskChangeEvent<ProductCategory>> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get productCategories
   *
   * @param params
   */
  getProductCategories(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultProductCategorySortData.active} ${DefaultProductCategorySortData.direction}`,
    },
  ): Observable<MskPageData<ProductCategory>> {
    return this._httpClient
      .get<MskPagingResponse<ProductCategory>>(`${this._appConfig.apiEndpoint}/category`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new ProductCategory(item)),
          });
        }),
      );
  }

  /**
   * Get lookup product categories
   */
  getLookupProductCategories(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultProductCategorySortData.active} ${DefaultProductCategorySortData.direction}`,
    },
  ): Observable<MskPageData<ProductCategory>> {
    return this._httpClient
      .get<MskPagingResponse<ProductCategory>>(`${this._appConfig.apiEndpoint}/category`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new ProductCategory(item)),
          });
        }),
      );
  }

  /**
   * Get productCategory
   *
   * @param id
   */
  getProductCategory(id: number | string): Observable<ProductCategory> {
    return this._httpClient
      .get<ProductCategory>(`${this._appConfig.apiEndpoint}/category/${id}`)
      .pipe(map((response) => new ProductCategory(response)));
  }

  /**
   * Create productCategory
   *
   * @param productCategory
   */
  createProductCategory(productCategory: ProductCategory): Observable<ProductCategory> {
    return this._httpClient.post<ProductCategory>(`${this._appConfig.apiEndpoint}/category`, productCategory).pipe(
      map((response) => new ProductCategory(response)),
      tap((productCategory) => this._changes.next({ type: 'create', item: productCategory })),
    );
  }

  /**
   * Update productCategory
   *
   * @param productCategory
   */
  updateProductCategory(productCategory: ProductCategory): Observable<ProductCategory> {
    return this._httpClient
      .patch<ProductCategory>(`${this._appConfig.apiEndpoint}/category/${productCategory.id}`, productCategory)
      .pipe(
        map((response) => new ProductCategory(response)),
        tap((productCategory) => this._changes.next({ type: 'update', item: productCategory })),
      );
  }

  /**
   * Delete productCategory
   *
   * @param productCategory
   */
  deleteProductCategory(productCategory: ProductCategory): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this._appConfig.apiEndpoint}/category/${productCategory.id}`).pipe(
      map((response) => response),
      tap(() => this._changes.next({ type: 'delete', id: productCategory.id })),
    );
  }
}
