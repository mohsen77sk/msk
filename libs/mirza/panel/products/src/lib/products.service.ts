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
} from '@msk/shared/data-access';
import { Product, DefaultProductsSortDirection, DefaultProductsSortId } from './products.types';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _products: BehaviorSubject<MskPageData<Product>> = new BehaviorSubject<MskPageData<Product>>(EmptyPageData);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for products
   */
  get products$(): Observable<MskPageData<Product>> {
    return this._products.asObservable();
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
      sortBy: `${DefaultProductsSortId} ${DefaultProductsSortDirection}`,
    }
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
        tap((response) => this._products.next(response))
      );
  }

  /**
   * Get lookup products
   */
  getLookupProducts(page = 1, pageSize = 10, search = ''): Observable<MskPageData<Product>> {
    return this._httpClient
      .get<MskPagingResponse<Product>>(`${this._appConfig.apiEndpoint}/product`, {
        params: convertToMirzaPagingRequest({
          page,
          pageSize,
          sortBy: `${DefaultProductsSortId} ${DefaultProductsSortDirection}`,
          search,
        }),
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Product(item)),
          });
        })
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
  createProduct(product: Product): Observable<Product> {
    return this._httpClient
      .post<Product>(`${this._appConfig.apiEndpoint}/product`, product)
      .pipe(map((response) => new Product(response)));
  }

  /**
   * Update product
   *
   * @param product
   */
  updateProduct(product: Product): Observable<Product> {
    return this._httpClient.patch<Product>(`${this._appConfig.apiEndpoint}/product/${product.id}`, product).pipe(
      map((response) => new Product(response)),
      // Update the products
      tap((newProduct) => {
        if (this._products.value) {
          const index = this._products.value.items.findIndex((x) => x.id === newProduct.id) ?? 0;
          this._products.value.items[index] = newProduct;
          this._products.next(this._products.value);
        }
      })
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
      // remove the products
      tap(() => {
        if (this._products.value) {
          const index = this._products.value.items.findIndex((x) => x.id === product.id);
          if (index > -1) {
            this._products.value.items.splice(index, 1);
            this._products.next(this._products.value);
          }
        }
      })
    );
  }
}
