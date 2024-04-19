import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { MskVerticalNavigationComponent } from '../../vertical-navigation.component';
import { MskNavigationService } from '../../../navigation.service';
import { MskNavigationItem } from '../../../navigation.types';

@Component({
  standalone: true,
  selector: 'msk-vertical-navigation-divider-item',
  templateUrl: './divider.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class MskVerticalNavigationDividerItemComponent implements OnInit {
  destroyRef = inject(DestroyRef);

  @Input() item!: MskNavigationItem;
  @Input() name!: string;

  private _mskVerticalNavigationComponent!: MskVerticalNavigationComponent;

  /**
   * Constructor
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _mskNavigationService: MskNavigationService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the parent navigation component
    this._mskVerticalNavigationComponent = this._mskNavigationService.getComponent(this.name);

    // Subscribe to onRefreshed on the navigation component
    this._mskVerticalNavigationComponent.onRefreshed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }
}
