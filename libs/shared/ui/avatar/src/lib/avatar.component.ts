import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, input, ViewEncapsulation } from '@angular/core';

@Component({
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

  private _colors = [
    'monochrome',
    'pink',
    'rose',
    'red',
    'orange',
    'yellow',
    'chartreuse',
    'green',
    'teal',
    'cyan',
    'blue',
    'indigo',
    'purple',
  ];

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Host binding for component classes
   */
  @HostBinding('class')
  get classList(): object {
    return {
      'size-6': this.size() === 'small',
      'text-label-medium': this.size() === 'small',
      'size-10': this.size() === 'medium',
      'text-title-medium': this.size() === 'medium',
      'size-24': this.size() === 'big',
      'text-headline-large': this.size() === 'big',
      block: true,
    };
  }

  /**
   * Getter label
   */
  get label(): string {
    return this.name().charAt(0).toUpperCase();
  }

  /**
   * Getter color
   */
  get color(): string {
    const sumCharCode = this.name()
      .split('')
      .reduce((sum, current) => sum + current.charCodeAt(0), 0);

    return this._colors[sumCharCode % this._colors.length];
  }
}
