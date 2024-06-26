import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewEncapsulation,
  forwardRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MskVerticalNavigationBasicItemComponent } from '../basic/basic.component';
import { MskVerticalNavigationCollapsableItemComponent } from '../collapsable/collapsable.component';
import { MskVerticalNavigationDividerItemComponent } from '../divider/divider.component';
import { MskVerticalNavigationComponent } from '../../vertical-navigation.component';
import { MskNavigationService } from '../../../navigation.service';
import { MskNavigationItem } from '../../../navigation.types';

@Component({
  standalone: true,
  selector: 'msk-vertical-navigation-group-item',
  templateUrl: './group.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    MatIconModule,
    MskVerticalNavigationBasicItemComponent,
    forwardRef(() => MskVerticalNavigationCollapsableItemComponent),
    MskVerticalNavigationDividerItemComponent,
    forwardRef(() => MskVerticalNavigationGroupItemComponent),
  ],
})
export class MskVerticalNavigationGroupItemComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _mskNavigationService = inject(MskNavigationService);

  @Input() autoCollapse!: boolean;
  @Input() item!: MskNavigationItem;
  @Input() name!: string;

  private _mskVerticalNavigationComponent!: MskVerticalNavigationComponent;

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
    this._mskVerticalNavigationComponent.onRefreshed.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }
}
