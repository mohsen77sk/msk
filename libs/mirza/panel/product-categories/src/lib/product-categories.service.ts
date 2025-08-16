import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import {
  MskPagingResponse,
  MskPageData,
  EmptyPageData,
  MskPagingRequest,
  convertToMirzaPagingRequest,
  MskLookupResponse,
  MskLookupItem,
} from '@msk/shared/data-access';
import {
  ProductCategory,
  DefaultProductCategoriesSortDirection,
  DefaultProductCategoriesSortId,
} from './product-categories.types';

@Injectable({ providedIn: 'root' })
export class ProductCategoriesService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _productCategories: BehaviorSubject<MskPageData<ProductCategory>> = new BehaviorSubject<
    MskPageData<ProductCategory>
  >(EmptyPageData);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for productCategories
   */
  get productCategories$(): Observable<MskPageData<ProductCategory>> {
    return this._productCategories.asObservable();
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
      sortBy: `${DefaultProductCategoriesSortId} ${DefaultProductCategoriesSortDirection}`,
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
        tap((response) => this._productCategories.next(response)),
      );
  }

  /**
   * Get lookup product categories
   */
  getLookupProductCategories(page = 1, pageSize = 10, search = ''): Observable<MskPageData<ProductCategory>> {
    return this._httpClient
      .get<MskPagingResponse<ProductCategory>>(`${this._appConfig.apiEndpoint}/category`, {
        params: convertToMirzaPagingRequest({
          page,
          pageSize,
          sortBy: `${DefaultProductCategoriesSortId} ${DefaultProductCategoriesSortDirection}`,
          search,
        }),
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
    return this._httpClient
      .post<ProductCategory>(`${this._appConfig.apiEndpoint}/category`, productCategory)
      .pipe(map((response) => new ProductCategory(response)));
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
        // Update the productCategories
        tap((newProductCategory) => {
          if (this._productCategories.value) {
            const index = this._productCategories.value.items.findIndex((x) => x.id === newProductCategory.id) ?? 0;
            this._productCategories.value.items[index] = newProductCategory;
            this._productCategories.next(this._productCategories.value);
          }
        }),
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
      // remove the productCategories
      tap(() => {
        if (this._productCategories.value) {
          const index = this._productCategories.value.items.findIndex((x) => x.id === productCategory.id);
          if (index > -1) {
            this._productCategories.value.items.splice(index, 1);
            this._productCategories.next(this._productCategories.value);
          }
        }
      }),
    );
  }
}
