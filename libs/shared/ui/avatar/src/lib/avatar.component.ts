import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  selector: 'msk-avatar',
  templateUrl: './avatar.component.html',
  exportAs: 'mskAvatar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class MskAvatarComponent {
  name = input.required<string>();
  imageUrl = input<string>();

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
