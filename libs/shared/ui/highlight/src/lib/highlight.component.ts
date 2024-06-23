/* eslint-disable @angular-eslint/component-selector */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EmbeddedViewRef,
  Input,
  OnChanges,
  SecurityContext,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MskHighlightService } from './highlight.service';

@Component({
  standalone: true,
  selector: 'textarea[msk-highlight]',
  templateUrl: './highlight.component.html',
  styleUrl: './highlight.component.scss',
  exportAs: 'mskHighlight',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class MskHighlightComponent implements OnChanges, AfterViewInit {
  @Input() code!: string;
  @Input() lang!: string;
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;

  highlightedCode!: string | null;
  private _viewRef!: EmbeddedViewRef<any> | null;

  /**
   * Constructor
   */
  constructor(
    private _elementRef: ElementRef,
    private _domSanitizer: DomSanitizer,
    private _viewContainerRef: ViewContainerRef,
    private _mskHighlightService: MskHighlightService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On changes
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Code & Lang
    if ('code' in changes || 'lang' in changes) {
      // Return if the viewContainerRef is not available
      if (!this._viewContainerRef.length) {
        return;
      }

      // Highlight and insert the code
      this._highlightAndInsert();
    }
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    // Return if there is no language set
    if (!this.lang) {
      return;
    }

    // If there is no code input, get the code from
    // the textarea
    if (!this.code) {
      // Get the code
      this.code = this._elementRef.nativeElement.value;
    }

    // Highlight and insert
    this._highlightAndInsert();
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
    if (!this.templateRef) {
      return;
    }

    // Return if the code or language is not defined
    if (!this.code || !this.lang) {
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
      this._mskHighlightService.highlight(this.code, this.lang)
    );

    // Return if the highlighted code is null
    if (this.highlightedCode === null) {
      return;
    }

    // Render and insert the template
    this._viewRef = this._viewContainerRef.createEmbeddedView(this.templateRef, {
      highlightedCode: this.highlightedCode,
      lang: this.lang,
    });

    // Detect the changes
    this._viewRef.detectChanges();
  }
}
