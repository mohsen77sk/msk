import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';
import { mskAnimations } from '@msk/shared/animations';

@Component({
  selector: 'doc-animations',
  templateUrl: './animations.component.html',
  styleUrl: './animations.component.css',
  encapsulation: ViewEncapsulation.None,
  animations: mskAnimations,
  imports: [MskHighlightComponent, MatTabsModule, MatButtonModule, MatSelectModule, MatFormFieldModule],
})
export class DocsAnimationsComponent implements OnInit {
  animationStates!: any;
  visibilityStates!: any;

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the defaults
    this.animationStates = {
      expandCollapse: 'expanded',
      fadeIn: {
        direction: 'in',
        in: '*',
        top: '*',
        bottom: '*',
        left: '*',
        right: '*',
      },
      fadeOut: {
        direction: 'out',
        out: '*',
        top: '*',
        bottom: '*',
        left: '*',
        right: '*',
      },
      shake: {
        shake: true,
      },
      slideIn: {
        direction: 'top',
        top: '*',
        bottom: '*',
        left: '*',
        right: '*',
      },
      slideOut: {
        direction: 'top',
        top: '*',
        bottom: '*',
        left: '*',
        right: '*',
      },
      zoomIn: {
        in: '*',
      },
      zoomOut: {
        out: '*',
      },
    };

    this.visibilityStates = {
      expandCollapse: true,
      fadeIn: {
        in: true,
        top: true,
        bottom: true,
        left: true,
        right: true,
      },
      fadeOut: {
        out: true,
        top: true,
        bottom: true,
        left: true,
        right: true,
      },
      shake: {
        shake: true,
      },
      slideIn: {
        top: true,
        bottom: true,
        left: true,
        right: true,
      },
      slideOut: {
        top: true,
        bottom: true,
        left: true,
        right: true,
      },
      zoomIn: {
        in: true,
      },
      zoomOut: {
        out: true,
      },
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle animation state
   *
   * @param animation
   * @param firstState
   * @param secondState
   * @param timeout
   */
  toggleAnimationState(
    animation: string,
    firstState: string | boolean,
    secondState: string | boolean,
    timeout = 500
  ): void {
    // Split the animation
    const animationPath = animation.split('.');

    // Toggle the animation state
    this.animationStates[animationPath[0]][animationPath[1]] = firstState;

    setTimeout(() => {
      this.animationStates[animationPath[0]][animationPath[1]] = secondState;
    }, timeout);
  }

  /**
   * Toggle visibility state
   *
   * @param animation
   * @param timeout
   */
  toggleVisibilityState(animation: string, timeout = 500): void {
    // Split the animation
    const animationPath = animation.split('.');

    // Toggle the visibility status
    this.visibilityStates[animationPath[0]][animationPath[1]] = false;
    this.animationStates[animationPath[0]][animationPath[1]] = 'void';

    setTimeout(() => {
      this.visibilityStates[animationPath[0]][animationPath[1]] = true;
      this.animationStates[animationPath[0]][animationPath[1]] = '*';
    }, timeout);
  }
}
