import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  selector: 'doc-media-watcher',
  templateUrl: './media-watcher.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MskHighlightComponent],
})
export class DocsMediaWatcherComponent {}
