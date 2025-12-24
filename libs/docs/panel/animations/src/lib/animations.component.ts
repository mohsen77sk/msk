import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  selector: 'doc-animations',
  templateUrl: './animations.component.html',
  styleUrl: './animations.component.css',
  encapsulation: ViewEncapsulation.None,
  imports: [MskHighlightComponent, MatTabsModule, MatButtonModule, MatSelectModule, MatFormFieldModule],
})
export class DocsAnimationsComponent {
  expandVisible = true;
  shakeOn = true;
  fadeInOn = true;
  fadeOutOn = true;
  zoomInOn = true;
  zoomOutOn = true;
  slideInOn = true;
  slideOutOn = true;
  slideInDir: 'top' | 'bottom' | 'left' | 'right' = 'top';
  slideOutDir: 'top' | 'bottom' | 'left' | 'right' = 'top';

  toggleBool(key: keyof DocsAnimationsComponent): void {
    // @ts-expect-error index access on component fields
    this[key] = false;

    setTimeout(() => {
      // @ts-expect-error index access on component fields
      this[key] = true;
    }, 500);
  }
}
