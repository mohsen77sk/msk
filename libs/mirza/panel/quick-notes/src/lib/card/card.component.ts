import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MskDialogDataAction } from '@msk/shared/data-access';
import { QuickNotesService } from '../quick-notes.service';

@Component({
  selector: 'mz-quick-notes-card',
  template: '',
  encapsulation: ViewEncapsulation.None,
  imports: [],
})
export class QuickNotesCardComponent implements OnInit {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _quickNotesService = inject(QuickNotesService);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const action = this._activatedRoute.snapshot.url[1].path as MskDialogDataAction;

    // Launch the modal
    this._quickNotesService
      .openQuickNoteDialog({
        action: signal(action),
        item: signal(this._activatedRoute.snapshot.data['card']),
      })
      .subscribe(() => {
        // Go back to list page
        this._router.navigate([this._activatedRoute.snapshot.url.map(() => '../').join('')], {
          relativeTo: this._activatedRoute,
        });
      });
  }
}
