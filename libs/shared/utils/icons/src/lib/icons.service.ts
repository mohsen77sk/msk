import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MskIconsService {
  /**
   * Constructor
   */
  constructor() {
    const domSanitizer = inject(DomSanitizer);
    const matIconRegistry = inject(MatIconRegistry);

    // Register default icons class
    matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');

    // Register icon sets
    matIconRegistry.addSvgIconSetInNamespace(
      'heroicons_outline',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg')
    );
    matIconRegistry.addSvgIconSetInNamespace(
      'heroicons_solid',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-solid.svg')
    );
  }
}
