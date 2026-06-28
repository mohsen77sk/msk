import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { MskHttpCacheEntry, MskHttpCacheOptions } from './http-cache.types';

@Injectable({ providedIn: 'root' })
export class MskHttpCacheService {
  /**
   * In-memory cache container for request observables.
   * Keyed by URL + normalized request params.
   */
  private readonly _cache = new Map<string, MskHttpCacheEntry>();

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Returns a cached observable for the given key or creates a new one.
   * Uses shareReplay so the same request is shared across multiple subscribers.
   */
  get<T>(key: string, factory: () => Observable<T>, options: MskHttpCacheOptions = {}): Observable<T> {
    const { forceReload = false, ttl = 0 } = options;
    const now = Date.now();
    const existing = this._cache.get(key);

    if (existing && !forceReload && !this.isExpired(existing, now)) {
      return existing.observable as Observable<T>;
    }

    const observable$ = factory().pipe(
      tap({
        error: () => this.invalidate(key),
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this._cache.set(key, {
      observable: observable$,
      expiresAt: ttl > 0 ? now + ttl : undefined,
    });

    return observable$;
  }

  /**
   * Remove a single cache entry by exact key.
   */
  invalidate(key: string): void {
    this._cache.delete(key);
  }

  /**
   * Remove all cache entries that start with the provided prefix.
   * Useful for invalidating all requests for a given endpoint.
   */
  invalidatePrefix(prefix: string): void {
    for (const key of Array.from(this._cache.keys())) {
      if (key.startsWith(prefix)) {
        this._cache.delete(key);
      }
    }
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this._cache.clear();
  }

  /**
   * Build a stable cache key from request URL and params.
   * Normalizes params so object order does not change the key.
   */
  buildCacheKey(url: string, params?: object): string {
    const paramsKey = params ? JSON.stringify(this.normalizeParams(params)) : '';
    return `${url}|${paramsKey}`;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Returns whether the cached entry has expired.
   * Expired entries are removed or refreshed on next access.
   */
  private isExpired(entry: MskHttpCacheEntry, now: number): boolean {
    return entry.expiresAt != null && now > entry.expiresAt;
  }

  /**
   * Normalize request params so the cache key is stable.
   * Sorts object keys recursively and preserves arrays.
   */
  private normalizeParams(value: unknown): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeParams(item));
    }

    if (typeof value === 'object') {
      return Object.keys(value as object)
        .sort()
        .reduce<Record<string, unknown>>((result, key) => {
          const item = (value as Record<string, unknown>)[key];
          result[key] = this.normalizeParams(item);
          return result;
        }, {});
    }

    return value;
  }
}
