import {o as o_}from'./chunk-CJhblC_p.js';import {I as II,y as yi,U as UD,O as Oc}from'./main-CI3NTU53.js';var c=class a{static \u0275fac=function(n){return new(n||a)};static \u0275cmp=II({type:a,selectors:[["doc-media-watcher"]],decls:26,vars:0,consts:[["dir","ltr",1,"page-layout","content-scroll","md:py-4"],[1,"content","prose","max-w-full"],[1,"sticky-header","mt-4","md:mt-0"],["msk-highlight","","lang","typescript"],[1,"sticky-header"]],template:function(n,m){n&1&&(yi(0,"div",0)(1,"div",1)(2,"h3",2),UD(3,"Service"),Oc(),yi(4,"textarea",3),UD(5,`      import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';
    `),Oc(),yi(6,"p")(7,"strong"),UD(8,"MskMediaWatcherService"),Oc(),UD(9," is a singleton service to watch media changes. It automatically registers the breakpoints from layout configuration, so you can use the service without needing to configure it first. "),Oc(),yi(10,"h3",4),UD(11,"Methods"),Oc(),yi(12,"p"),UD(13,"To watch changes on registered breakpoints, you can use the "),yi(14,"code"),UD(15,"onMediaChange$"),Oc(),UD(16," getter:"),Oc(),yi(17,"textarea",3),UD(18,`      import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';

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
    `),Oc(),yi(19,"p"),UD(20,"You can also listen for custom media queries using "),yi(21,"code"),UD(22,"onMediaQueryChange$(query: string)"),Oc(),UD(23," method:"),Oc(),yi(24,"textarea",3),UD(25,`      import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';

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
    `),Oc()()());},dependencies:[o_],encapsulation:2})};export{c as DocsMediaWatcherComponent};