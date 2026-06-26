import { Injectable } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class MskUtilsService {
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the equivalent "IsActiveMatchOptions" options for "exact = true".
   */
  get exactMatchOptions(): IsActiveMatchOptions {
    return {
      paths: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
      queryParams: 'exact',
    };
  }

  /**
   * Get the equivalent "IsActiveMatchOptions" options for "exact = false".
   */
  get subsetMatchOptions(): IsActiveMatchOptions {
    return {
      paths: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
      queryParams: 'subset',
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Generates a random id
   */
  randomId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let name = '';

    for (let i = 0; i < 10; i++) {
      name += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return name;
  }

  /**
   * Convert number to short format
   * @param value
   */
  abbrNumber(value?: number): string {
    if (value == null) return '';

    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (abs >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (abs >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return value.toString();
  }

  /**
   * Convert Json to encode string
   * @param value
   */
  encodeBase64Json(value: object) {
    const json = JSON.stringify(value);
    const bytes = new TextEncoder().encode(json);

    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary);
  }

  /**
   * Convert encode string to Json
   * @param value
   */
  decodeBase64Json(value: string) {
    const binary = atob(value ?? '');
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  }
}
