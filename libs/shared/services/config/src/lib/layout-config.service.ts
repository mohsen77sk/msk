import { inject, Injectable } from '@angular/core';
import { merge } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { MSK_LAYOUT_CONFIG } from './layout-config.constants';
import { LayoutConfig } from './layout-config.types';

@Injectable({ providedIn: 'root' })
export class MskLayoutConfigService {
  private _defaultConfig: LayoutConfig = inject(MSK_LAYOUT_CONFIG);

  private _config: BehaviorSubject<LayoutConfig>;

  /**
   * Constructor
   */
  constructor() {
    // If all config keys match between storage and default, reset storage to default config
    if (this._areObjectKeysEqual(this._getFromStorage(), this._defaultConfig)) {
      this._setToStorage(this._defaultConfig);
    }
    // Private
    this._config = new BehaviorSubject(this._getFromStorage() ?? this._defaultConfig);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for config
   */
  set config(value: Partial<LayoutConfig>) {
    // Merge the new config over to the current config
    const config = merge({}, this._config.getValue(), value);

    // Set the new config
    this._setToStorage(config);

    // Execute the observable
    this._config.next(config);
  }

  get config(): LayoutConfig {
    return this._config.value;
  }

  get config$(): Observable<LayoutConfig> {
    return this._config.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resets the config to the default
   */
  reset(): void {
    // Set the config
    this._setToStorage(this._defaultConfig);
    this._config.next(this._defaultConfig);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set config to storage
   *
   * @param config
   * @private
   */
  private _setToStorage(config: LayoutConfig): void {
    localStorage.setItem('layoutConfigToken', btoa(JSON.stringify(config)));
  }

  /**
   * Get config from storage
   *
   * @private
   */
  private _getFromStorage(): LayoutConfig | null {
    const data = localStorage.getItem('layoutConfigToken');
    try {
      return JSON.parse(atob(data ?? ''));
    } catch {
      return null;
    }
  }

  /**
   * Checks whether the keys of two objects are equal (deep equality).
   * Only compares keys, not values for primitives. For nested objects,
   * recursively compares keys.
   *
   * @param obj1 First object to compare
   * @param obj2 Second object to compare
   * @returns true if objects have the same structure of keys, false otherwise
   */
  private _areObjectKeysEqual(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1 || {});
    const keys2 = Object.keys(obj2 || {});

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key)) return false;

      const val1 = obj1[key];
      const val2 = obj2[key];

      const bothObjects = val1 && val2 && typeof val1 === 'object' && typeof val2 === 'object';

      if (bothObjects) {
        if (!this._areObjectKeysEqual(val1, val2)) return false;
      }
    }

    return true;
  }
}
