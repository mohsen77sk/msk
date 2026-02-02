import{a as s}from"./chunk-N37Z3SHL.js";import"./chunk-Y3SPGUIH.js";import"./chunk-Y2A3HBIZ.js";import"./chunk-WZX4W77J.js";import{Gb as i,Hb as t,hc as e,ib as r}from"./chunk-R7N7VMSE.js";import"./chunk-2R6CW7ES.js";var c=class a{static \u0275fac=function(n){return new(n||a)};static \u0275cmp=r({type:a,selectors:[["doc-media-watcher"]],decls:26,vars:0,consts:[["dir","ltr",1,"page-layout","content-scroll","md:py-4"],[1,"content","prose","max-w-full"],[1,"sticky-header","mt-4","md:mt-0"],["msk-highlight","","lang","typescript"],[1,"sticky-header"]],template:function(n,m){n&1&&(i(0,"div",0)(1,"div",1)(2,"h3",2),e(3,"Service"),t(),i(4,"textarea",3),e(5,`      import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';
    `),t(),i(6,"p")(7,"strong"),e(8,"MskMediaWatcherService"),t(),e(9," is a singleton service to watch media changes. It automatically registers the breakpoints from layout configuration, so you can use the service without needing to configure it first. "),t(),i(10,"h3",4),e(11,"Methods"),t(),i(12,"p"),e(13,"To watch changes on registered breakpoints, you can use the "),i(14,"code"),e(15,"onMediaChange$"),t(),e(16," getter:"),t(),i(17,"textarea",3),e(18,`      import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';

      private _mskMediaWatcherService = inject(MskMediaWatcherService);

      /**
       * On init
       */
      ngOnInit(): void {
        this._mskMediaWatcherService.onMediaChange$.subscribe(({ matchingAliases }) => {
          // Check if the screen is small
          this.isFullScreen.set(!matchingAliases.includes('md'));
        });
      }
    `),t(),i(19,"p"),e(20,"You can also listen for custom media queries using "),i(21,"code"),e(22,"onMediaQueryChange$(query: string)"),t(),e(23," method:"),t(),i(24,"textarea",3),e(25,`      import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';

      private _mskMediaWatcherService = inject(MskMediaWatcherService);

      /**
       * On init
       */
      ngOnInit(): void {
        this._mskMediaWatcherService.onMediaQueryChange$([
          '(prefers-color-scheme: dark)',
          '(prefers-color-scheme: light)',
        ]).subscribe((mql) => {
          // If the scheme is set to 'auto'...
          if (config.scheme === 'auto') {
            // Decide the scheme using the media query
            options.scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
          }
        });
      }
    `),t()()())},dependencies:[s],encapsulation:2})};export{c as DocsMediaWatcherComponent};
