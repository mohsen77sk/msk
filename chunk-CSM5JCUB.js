import{a as y}from"./chunk-N6MFMQS3.js";import{b as K,c as Q,d as ee,e as te}from"./chunk-VOKD7PTO.js";import{O as Y,ea as W,ha as J,ja as re}from"./chunk-HKIA5WVT.js";import{$b as E,Ab as m,Db as j,Ea as I,Eb as u,Fb as M,Ga as X,Gb as N,Ha as O,Ib as H,Ka as $,Kb as x,La as z,Nc as q,Ob as r,Pb as e,Qb as s,Qc as G,Ra as V,Rc as B,Ub as U,Uc as Z,ba as A,bc as b,ca as D,ea as P,g as h,gb as p,ha as d,hb as g,ma as c,mc as t,na as R,q as v,uc as f,xa as w,xb as F,ya as S}from"./chunk-7YKTGSEM.js";var k=(()=>{class n{constructor(){this._auto$=new h(!0),this._mode$=new h("indeterminate"),this._progress$=new h(0),this._show$=new h(!1),this._urlMap=new Map}get auto$(){return this._auto$.asObservable()}get mode$(){return this._mode$.asObservable()}get progress$(){return this._progress$.asObservable()}get show$(){return this._show$.asObservable()}show(){this._show$.next(!0)}hide(){this._show$.next(!1)}setAutoMode(i){this._auto$.next(i)}setMode(i){this._mode$.next(i)}setProgress(i){if(i<0||i>100){console.error("Progress value must be between 0 and 100!");return}this._progress$.next(i)}setLoadingStatus(i,a){if(!a){console.error("The request URL must be provided!");return}i===!0?(this._urlMap.set(a,i),this._show$.next(!0)):i===!1&&this._urlMap.has(a)&&this._urlMap.delete(a),this._urlMap.size===0&&this._show$.next(!1)}static{this.\u0275fac=function(a){return new(a||n)}}static{this.\u0275prov=A({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();function oe(n,l){if(n&1){let i=U();r(0,"div",22)(1,"button",23),E("click",function(){w(i);let o=b();return S(o.showLoadingBar())}),t(2,"Show loading bar"),e(),r(3,"button",23),E("click",function(){w(i);let o=b();return S(o.hideLoadingBar())}),t(4,"Hide loading bar"),e()()}}function se(n,l){n&1&&(r(0,"textarea",24),t(1,`              <div class="mx-auto flex space-x-4">
                <button mat-flat-button (click)="showLoadingBar()">Show loading bar</button>
                <button mat-flat-button (click)="hideLoadingBar()">Hide loading bar</button>
              </div>
            `),e()),n&2&&u("lang","html")}function me(n,l){n&1&&(r(0,"textarea",24),t(1,`              /**
                * Constructor
                */
              constructor(private _mskLoadingService: MskLoadingBarService) {}

              /**
                * Show the loading bar
                */
              showLoadingBar(): void {
                this._mskLoadingService.show();
              }

              /**
                * Hide the loading bar
                */
              hideLoadingBar(): void {
                this._mskLoadingService.hide();
              }
            `),e()),n&2&&u("lang","typescript")}var Se=(()=>{class n{constructor(){this._mskLoadingService=d(k)}showLoadingBar(){this._mskLoadingService.show()}hideLoadingBar(){this._mskLoadingService.hide()}static{this.\u0275fac=function(a){return new(a||n)}}static{this.\u0275cmp=c({type:n,selectors:[["msk-docs-loading-bar"]],standalone:!0,features:[f],decls:106,vars:1,consts:[[1,"page-layout","content-scroll","md:py-4"],[1,"content","prose","max-w-full"],[1,"sticky-header","mt-4","md:mt-0"],["msk-highlight","","lang","typescript"],[1,"sticky-header"],["msk-highlight","","lang","html"],[1,"msk-mat-card-filled","flex-shrink-0","overflow-auto","p-4"],[1,"m-0"],[1,"text-md","text-secondary"],[1,"msk-mat-card-filled","mt-4"],[1,"text-secondary","text-title-small","border-b","px-6","py-3"],[1,"p-6"],[1,"example-viewer"],[1,"header"],[1,"title"],[1,"action"],["mat-stretch-tabs","false",3,"animationDuration"],["label","Preview"],["matTabContent",""],["label","HTML"],["label","Typescript"],[1,"mb-6"],[1,"mx-auto","flex","space-x-4"],["mat-flat-button","",3,"click"],["msk-highlight","",3,"lang"]],template:function(a,o){a&1&&(r(0,"div",0)(1,"div",1)(2,"h3",2),t(3,"Component"),e(),r(4,"textarea",3),t(5,`      import { MskLoadingBarComponent } from '@msk/shared/ui/loading-bar';
    `),e(),r(6,"p")(7,"strong"),t(8,"msk-loading-bar"),e(),t(9," is a small component to show the loading status at the top of the page. It can be configured to the "),r(10,"strong"),t(11,"Auto Mode"),e(),t(12," to show/hide automatically on each HTTP request. It can also be toggled manually using its service. "),e(),r(13,"p")(14,"strong"),t(15,"Exported as: "),e(),r(16,"code"),t(17,"mskLoadingBar"),e()(),r(18,"h3",4),t(19,"Usage"),e(),r(20,"p"),t(21," Here's the basic usage of the "),r(22,"code"),t(23,"msk-loading-bar"),e(),t(24,". We already placed the component to the layout templates for you but you can always move it! "),e(),r(25,"textarea",5),t(26,"      <"),t(27,"msk-loading-bar>"),t(28,"<"),t(29,"/msk-loading-bar>"),t(30,`
    `),e(),r(31,"h3",4),t(32,"Properties"),e(),r(33,"div",6)(34,"table",7)(35,"thead")(36,"tr")(37,"th"),t(38,"Name"),e(),r(39,"th"),t(40,"Description"),e(),r(41,"th"),t(42,"Default"),e()()(),r(43,"tbody")(44,"tr")(45,"td",8),t(46,"autoMode: "),r(47,"i"),t(48,"<boolean>"),e()(),r(49,"td"),t(50,"Turn on or off the Auto Mode."),e(),r(51,"td")(52,"code"),t(53,"true"),e()()()()()(),r(54,"h3",4),t(55,"Service"),e(),r(56,"p")(57,"code"),t(58,"MskLoadingService"),e(),t(59," can be injected to control the loading bar from anywhere."),e(),r(60,"div",9)(61,"div",10),t(62,"show(): void;"),e(),r(63,"div",11),t(64,"Shows the loading bar"),e()(),r(65,"div",9)(66,"div",10),t(67,"hide(): void;"),e(),r(68,"div",11),t(69,"Hides the loading bar"),e()(),r(70,"div",9)(71,"div",10),t(72,"setAutoMode(value: boolean): void;"),e(),r(73,"div",11),t(74," Sets the Auto Mode. In Auto mode, loading bar will show when there is an HTTP request and it will hide when all HTTP requests are completed or failed. "),e()(),r(75,"div",9)(76,"div",10),t(77," setMode(value: 'determinate' | 'indeterminate'): void; "),e(),r(78,"div",11),t(79,"Sets the mode of the underlying "),r(80,"code"),t(81,"MatProgressBar"),e(),t(82," component."),e()(),r(83,"div",9)(84,"div",10),t(85,"setProgress(value: number): void;"),e(),r(86,"div",11),t(87," Sets the progress manually. Only available on "),r(88,"code"),t(89,"determinate"),e(),t(90," mode. "),e()(),r(91,"h3",4),t(92,"Examples"),e(),r(93,"div",12)(94,"div",13)(95,"div",14),t(96,"Show / hide the loading bar manually"),e(),s(97,"div",15),e(),r(98,"mat-tab-group",16)(99,"mat-tab",17),m(100,oe,5,0,"ng-template",18),e(),r(101,"mat-tab",19),m(102,se,2,1,"ng-template",18),e(),r(103,"mat-tab",20),m(104,me,2,1,"ng-template",18),e()()(),s(105,"div",21),e()()),a&2&&(p(98),u("animationDuration","0ms"))},dependencies:[re,te,K,Q,ee,J,W],encapsulation:2})}}return n})();function le(n,l){n&1&&s(0,"div",2)}var de=new P("MAT_PROGRESS_BAR_DEFAULT_OPTIONS");var ne=(()=>{class n{constructor(i,a,o,L,_){this._elementRef=i,this._ngZone=a,this._changeDetectorRef=o,this._animationMode=L,this._isNoopAnimation=!1,this._defaultColor="primary",this._value=0,this._bufferValue=0,this.animationEnd=new X,this._mode="determinate",this._transitionendHandler=T=>{this.animationEnd.observers.length===0||!T.target||!T.target.classList.contains("mdc-linear-progress__primary-bar")||(this.mode==="determinate"||this.mode==="buffer")&&this._ngZone.run(()=>this.animationEnd.next({value:this.value}))},this._isNoopAnimation=L==="NoopAnimations",_&&(_.color&&(this.color=this._defaultColor=_.color),this.mode=_.mode||this.mode)}get color(){return this._color||this._defaultColor}set color(i){this._color=i}get value(){return this._value}set value(i){this._value=ie(i||0),this._changeDetectorRef.markForCheck()}get bufferValue(){return this._bufferValue||0}set bufferValue(i){this._bufferValue=ie(i||0),this._changeDetectorRef.markForCheck()}get mode(){return this._mode}set mode(i){this._mode=i,this._changeDetectorRef.markForCheck()}ngAfterViewInit(){this._ngZone.runOutsideAngular(()=>{this._elementRef.nativeElement.addEventListener("transitionend",this._transitionendHandler)})}ngOnDestroy(){this._elementRef.nativeElement.removeEventListener("transitionend",this._transitionendHandler)}_getPrimaryBarTransform(){return`scaleX(${this._isIndeterminate()?1:this.value/100})`}_getBufferBarFlexBasis(){return`${this.mode==="buffer"?this.bufferValue:100}%`}_isIndeterminate(){return this.mode==="indeterminate"||this.mode==="query"}static{this.\u0275fac=function(a){return new(a||n)(g(z),g(O),g(q),g(V,8),g(de,8))}}static{this.\u0275cmp=c({type:n,selectors:[["mat-progress-bar"]],hostAttrs:["role","progressbar","aria-valuemin","0","aria-valuemax","100","tabindex","-1",1,"mat-mdc-progress-bar","mdc-linear-progress"],hostVars:10,hostBindings:function(a,o){a&2&&(j("aria-valuenow",o._isIndeterminate()?null:o.value)("mode",o.mode),H("mat-"+o.color),N("_mat-animation-noopable",o._isNoopAnimation)("mdc-linear-progress--animation-ready",!o._isNoopAnimation)("mdc-linear-progress--indeterminate",o._isIndeterminate()))},inputs:{color:"color",value:[2,"value","value",B],bufferValue:[2,"bufferValue","bufferValue",B],mode:"mode"},outputs:{animationEnd:"animationEnd"},exportAs:["matProgressBar"],standalone:!0,features:[F,f],decls:7,vars:5,consts:[["aria-hidden","true",1,"mdc-linear-progress__buffer"],[1,"mdc-linear-progress__buffer-bar"],[1,"mdc-linear-progress__buffer-dots"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__primary-bar"],[1,"mdc-linear-progress__bar-inner"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__secondary-bar"]],template:function(a,o){a&1&&(r(0,"div",0),s(1,"div",1),m(2,le,1,0,"div",2),e(),r(3,"div",3),s(4,"span",4),e(),r(5,"div",5),s(6,"span",4),e()),a&2&&(p(),M("flex-basis",o._getBufferBarFlexBasis()),p(),x(o.mode==="buffer"?2:-1),p(),M("transform",o._getPrimaryBarTransform()))},styles:[`.mat-mdc-progress-bar{display:block;text-align:start}.mat-mdc-progress-bar[mode=query]{transform:scaleX(-1)}.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner{animation:none}.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar{transition:transform 1ms}.mdc-linear-progress{position:relative;width:100%;transform:translateZ(0);outline:1px solid rgba(0,0,0,0);overflow-x:hidden;transition:opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);height:max(var(--mdc-linear-progress-track-height),var(--mdc-linear-progress-active-indicator-height))}.cdk-high-contrast-active .mdc-linear-progress{outline-color:CanvasText}.mdc-linear-progress__bar{position:absolute;top:0;bottom:0;margin:auto 0;width:100%;animation:none;transform-origin:top left;transition:transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);height:var(--mdc-linear-progress-active-indicator-height)}.mdc-linear-progress--indeterminate .mdc-linear-progress__bar{transition:none}[dir=rtl] .mdc-linear-progress__bar{right:0;transform-origin:center right}.mdc-linear-progress__bar-inner{display:inline-block;position:absolute;width:100%;animation:none;border-top-style:solid;border-color:var(--mdc-linear-progress-active-indicator-color, var(--mat-app-primary));border-top-width:var(--mdc-linear-progress-active-indicator-height)}.mdc-linear-progress__buffer{display:flex;position:absolute;top:0;bottom:0;margin:auto 0;width:100%;overflow:hidden;height:var(--mdc-linear-progress-track-height);border-radius:var(--mdc-linear-progress-track-shape, var(--mat-app-corner-none))}.mdc-linear-progress__buffer-dots{-webkit-mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");background-repeat:repeat-x;flex:auto;transform:rotate(180deg);animation:mdc-linear-progress-buffering 250ms infinite linear;background-color:var(--mdc-linear-progress-track-color, var(--mat-app-surface-variant))}.cdk-high-contrast-active .mdc-linear-progress__buffer-dots{background-color:ButtonBorder}[dir=rtl] .mdc-linear-progress__buffer-dots{animation:mdc-linear-progress-buffering-reverse 250ms infinite linear;transform:rotate(0)}.mdc-linear-progress__buffer-bar{flex:0 1 100%;transition:flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);background-color:var(--mdc-linear-progress-track-color, var(--mat-app-surface-variant))}.mdc-linear-progress__primary-bar{transform:scaleX(0)}.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{left:-145.166611%}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation:mdc-linear-progress-primary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-primary-indeterminate-scale 2s infinite linear}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation-name:mdc-linear-progress-primary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{right:-145.166611%;left:auto}.mdc-linear-progress__secondary-bar{display:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{left:-54.888891%;display:block}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation:mdc-linear-progress-secondary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-secondary-indeterminate-scale 2s infinite linear}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation-name:mdc-linear-progress-secondary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{right:-54.888891%;left:auto}@keyframes mdc-linear-progress-buffering{from{transform:rotate(180deg) translateX(calc(var(--mdc-linear-progress-track-height) * -2.5))}}@keyframes mdc-linear-progress-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%)}100%{transform:translateX(200.611057%)}}@keyframes mdc-linear-progress-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%)}100%{transform:translateX(160.277782%)}}@keyframes mdc-linear-progress-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(-83.67142%)}100%{transform:translateX(-200.611057%)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(-37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(-84.386165%)}100%{transform:translateX(-160.277782%)}}@keyframes mdc-linear-progress-buffering-reverse{from{transform:translateX(-10px)}}`],encapsulation:2,changeDetection:0})}}return n})();function ie(n,l=0,i=100){return Math.max(l,Math.min(i,n))}var ae=(()=>{class n{static{this.\u0275fac=function(a){return new(a||n)}}static{this.\u0275mod=R({type:n})}static{this.\u0275inj=D({imports:[Y]})}}return n})();function pe(n,l){if(n&1&&s(0,"mat-progress-bar",0),n&2){let i=b();u("mode",i.mode)("value",i.progress)}}var Ne=(()=>{class n{constructor(){this._destroyRef=d(I),this._mskLoadingBarService=d(k),this.autoMode=$(!0,{transform:G}),this.progress=0,this.show=!1,Z(()=>{this._mskLoadingBarService.setAutoMode(this.autoMode())})}ngOnInit(){this._mskLoadingBarService.mode$.pipe(y(this._destroyRef),v(i=>this.mode=i)).subscribe(),this._mskLoadingBarService.progress$.pipe(y(this._destroyRef),v(i=>this.progress=i)).subscribe(),this._mskLoadingBarService.show$.pipe(y(this._destroyRef),v(i=>this.show=i)).subscribe()}static{this.\u0275fac=function(a){return new(a||n)}}static{this.\u0275cmp=c({type:n,selectors:[["msk-loading-bar"]],inputs:{autoMode:[1,"autoMode"]},exportAs:["mskLoadingBar"],standalone:!0,features:[f],decls:1,vars:1,consts:[[3,"mode","value"]],template:function(a,o){a&1&&m(0,pe,1,2,"mat-progress-bar",0),a&2&&x(o.show?0:-1)},dependencies:[ae,ne],styles:[`msk-loading-bar{position:fixed;top:0;z-index:999;width:100%;height:6px}
`],encapsulation:2})}}return n})();export{k as a,Se as b,Ne as c};