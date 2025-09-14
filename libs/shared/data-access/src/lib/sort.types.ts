import { EventEmitter } from '@angular/core';

export type MskSortDirection = 'asc' | 'desc' | '';

/**
 * Interface for sortable objects.
 */
export interface MskSortable {
  readonly active: string;
  readonly direction?: MskSortDirection;
}

/**
 * Configuration for sorting operations.
 * Emits sortChange event when active field or direction changes.
 */
export class MskSort {
  private _active: string;
  private _direction: MskSortDirection;
  private readonly _defaultOptions: MskSortable | undefined;

  /**
   * Event emitted when the sort state changes (active field or direction).
   */
  readonly sortChange: EventEmitter<MskSort> = new EventEmitter<MskSort>();

  /**
   * Gets the currently active sort field.
   */
  get active(): string {
    return this._active;
  }

  /**
   * Gets the current sort direction.
   */
  get direction(): MskSortDirection {
    return this._direction;
  }

  /**
   * Creates a new MskSort instance.
   * @param defaultOptions - Initial sort configuration
   */
  constructor(defaultOptions?: MskSortable) {
    this._defaultOptions = defaultOptions;
    this._active = defaultOptions?.active ?? '';
    this._direction = defaultOptions?.direction ?? '';

    this.sortChange.emit(this);
  }

  /**
   * Sorts by the specified field and direction.
   * @param sortable - The sortable configuration
   * @throws {Error} When sortable.active is empty or invalid
   */
  sort(sortable: MskSortable): void {
    if (!sortable.active?.trim()) {
      throw new Error('Sort active field cannot be empty');
    }

    const newActive = sortable.active.trim();

    if (this._active !== newActive) {
      this._active = newActive;
      this._direction = sortable.direction ?? 'asc';
    } else {
      this._direction = this._direction === 'asc' ? 'desc' : 'asc';
    }

    this.sortChange.emit(this);
  }

  /**
   * Clears the current sort configuration and resets to defaults.
   */
  clear(): void {
    this._active = this._defaultOptions?.active ?? '';
    this._direction = this._defaultOptions?.direction ?? '';
    this.sortChange.emit(this);
  }

  /**
   * Creates a copy of the current sort configuration.
   * @returns A new MskSort instance with the same configuration
   */
  clone(): MskSort {
    return new MskSort({
      active: this._active,
      direction: this._direction,
    });
  }

  /**
   * Checks if the sort is currently active.
   * @returns True if a field is being sorted
   */
  isActive(): boolean {
    return Boolean(this._active?.trim());
  }

  /**
   * Checks if the sort is currently ascending.
   * @returns True if direction is 'asc'
   */
  isAscending(): boolean {
    return this._direction === 'asc';
  }

  /**
   * Checks if the sort is currently descending.
   * @returns True if direction is 'desc'
   */
  isDescending(): boolean {
    return this._direction === 'desc';
  }

  /**
   * Gets the current sort configuration as an object.
   * @returns Current sort configuration
   */
  toObject(): MskSortable {
    return {
      active: this._active,
      direction: this._direction,
    };
  }

  /**
   * Creates a string representation of the current sort.
   * @returns Sort string in format "field direction"
   */
  toString(): string {
    if (!this.isActive()) {
      return '';
    }
    return `${this._active} ${this._direction}`;
  }
}
