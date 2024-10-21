import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  selector: 'msk-avatar',
  templateUrl: './avatar.component.html',
  exportAs: 'mskAvatar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class MskAvatarComponent {
  name = input.required<string>();
  imageUrl = input<string>();
  size = input<'small' | 'medium' | 'big'>('medium');

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter label
   */
  get label(): string {
    return this.name().charAt(0).toUpperCase();
  }
}
