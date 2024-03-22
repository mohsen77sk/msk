import { Inject, Injectable } from '@angular/core';
import { merge } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { LAYOUT_CONFIG } from './config.constants';
import { LayoutConfig } from './config.types';

@Injectable({ providedIn: 'root' })
export class LayoutConfigService {
  private _config: BehaviorSubject<LayoutConfig>;

  /**
   * Constructor
   */
  constructor(@Inject(LAYOUT_CONFIG) config: LayoutConfig) {
    // Private
    this._config = new BehaviorSubject(this._getFromStorage() ?? config);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for config
   */
  set config(value: LayoutConfig) {
    // Merge the new config over to the current config
    const config = merge({}, this._config.getValue(), value);

    // Set the new config
    this._setToStorage(config);

    // Execute the observable
    this._config.next(config);
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
    this._setToStorage(this.config);
    this._config.next(this.config);
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
}
