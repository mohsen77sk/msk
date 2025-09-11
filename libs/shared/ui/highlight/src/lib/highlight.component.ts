/* eslint-disable @angular-eslint/component-selector */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EmbeddedViewRef,
  SecurityContext,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MskHighlightService } from './highlight.service';

@Component({
  selector: 'textarea[msk-highlight]',
  templateUrl: './highlight.component.html',
  styleUrl: './highlight.component.css',
  exportAs: 'mskHighlight',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, ClipboardModule, MatIconModule, MatButtonModule],
})
export class MskHighlightComponent implements AfterViewInit {
  private _clipboard = inject(Clipboard);
  private _elementRef = inject(ElementRef);
  private _domSanitizer = inject(DomSanitizer);
  private _viewContainerRef = inject(ViewContainerRef);
  private _mskHighlightService = inject(MskHighlightService);

  code = model<string>();
  lang = input.required<string>();
  templateRef = viewChild.required(TemplateRef);

  isCopied = signal<boolean>(false);
  highlightedCode!: string | null;
  private _viewRef!: EmbeddedViewRef<unknown> | null;

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      // Return if the viewContainerRef is not available
      if (!this._viewContainerRef.length) {
        return;
      }

      // Highlight and insert the code
      this._highlightAndInsert();
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    // If there is no code input, get the code from
    // the textarea
    if (!this.code()) {
      // Get the code
      this.code.update(() => this._elementRef.nativeElement.value);
    }

    // Highlight and insert
    this._highlightAndInsert();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Copy the code
   */
  copyCode(): void {
    this.isCopied.set(true);
    this._clipboard.copy(this.code() || '');

    // Use requestAnimationFrame for better performance in zoneless
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.isCopied.set(false);
      }, 1000);
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Highlight and insert the highlighted code
   *
   * @private
   */
  private _highlightAndInsert(): void {
    // Return if the template reference is not available
    if (!this.templateRef()) {
      return;
    }

    // Return if the code or language is not defined
    if (!this.code() || !this.lang()) {
      return;
    }

    // Destroy the component if there is already one
    if (this._viewRef) {
      this._viewRef.destroy();
      this._viewRef = null;
    }

    // Highlight and sanitize the code just in case
    this.highlightedCode = this._domSanitizer.sanitize(
      SecurityContext.HTML,
      this._mskHighlightService.highlight(this.code() || '', this.lang()),
    );

    // Return if the highlighted code is null
    if (this.highlightedCode === null) {
      return;
    }

    // Render and insert the template
    this._viewRef = this._viewContainerRef.createEmbeddedView(this.templateRef(), {
      highlightedCode: this.highlightedCode,
      lang: this.lang,
    });
  }
}
