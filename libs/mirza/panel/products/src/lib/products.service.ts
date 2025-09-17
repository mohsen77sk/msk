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
import { Product, DefaultProductsSortData, ICreateProduct } from './products.types';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _changes = new Subject<MskChangeEvent<Product>>();

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stream of CRUD changes for in-place list updates
   */
  get changes$(): Observable<MskChangeEvent<Product>> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get products
   *
   * @param params
   */
  getProducts(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultProductsSortData.active} ${DefaultProductsSortData.direction}`,
    },
  ): Observable<MskPageData<Product>> {
    return this._httpClient
      .get<MskPagingResponse<Product>>(`${this._appConfig.apiEndpoint}/product`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Product(item)),
          });
        }),
      );
  }

  /**
   * Get lookup products
   */
  getLookupProducts(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultProductsSortData.active} ${DefaultProductsSortData.direction}`,
    },
  ): Observable<MskPageData<Product>> {
    return this._httpClient
      .get<MskPagingResponse<Product>>(`${this._appConfig.apiEndpoint}/product`, {
        params: convertToMirzaPagingRequest(params),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Product(item)),
          });
        }),
      );
  }

  /**
   * Get product
   *
   * @param id
   */
  getProduct(id: number | string): Observable<Product> {
    return this._httpClient
      .get<Product>(`${this._appConfig.apiEndpoint}/product/${id}`)
      .pipe(map((response) => new Product(response)));
  }

  /**
   * Create product
   *
   * @param product
   */
  createProduct(product: ICreateProduct): Observable<Product> {
    return this._httpClient.post<Product>(`${this._appConfig.apiEndpoint}/product`, product).pipe(
      map((response) => new Product(response)),
      tap((product) => this._changes.next({ type: 'create', item: product })),
    );
  }

  /**
   * Update product
   *
   * @param product
   */
  updateProduct(product: ICreateProduct): Observable<Product> {
    return this._httpClient.patch<Product>(`${this._appConfig.apiEndpoint}/product/${product.id}`, product).pipe(
      map((response) => new Product(response)),
      tap((product) => this._changes.next({ type: 'update', item: product })),
    );
  }

  /**
   * Delete product
   *
   * @param product
   */
  deleteProduct(product: Product): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this._appConfig.apiEndpoint}/product/${product.id}`).pipe(
      map((response) => response),
      tap(() => this._changes.next({ type: 'delete', id: product.id })),
    );
  }
}
