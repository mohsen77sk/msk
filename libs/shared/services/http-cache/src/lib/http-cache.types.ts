import { Observable } from 'rxjs';

export interface MskHttpCacheOptions {
  ttl?: number;
  forceReload?: boolean;
}

export interface MskHttpCacheEntry {
  observable: Observable<unknown>;
  expiresAt?: number;
}
