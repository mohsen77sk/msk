import{S as F}from"./chunk-CUPWY2MF.js";import{o as z}from"./chunk-775XZAEP.js";import{Db as x,Eb as R,Ia as f,Ja as l,Kc as I,Mb as o,Nb as p,Ob as _,Pa as w,Pb as P,Rb as u,Sc as B,Tc as d,Wc as L,Xb as a,Yb as m,Zb as v,ac as g,da as S,fa as k,ia as n,ib as s,jc as A,nb as y,nc as D,ob as b,oc as N,pc as O,tc as W,va as h,wa as E,xb as C,yb as T,zb as M}from"./chunk-URZL6SS3.js";var G=["determinateSpinner"];function Q(i,q){if(i&1&&(h(),a(0,"svg",11),v(1,"circle",12),m()),i&2){let e=A();o("viewBox",e._viewBox()),s(),_("stroke-dasharray",e._strokeCircumference(),"px")("stroke-dashoffset",e._strokeCircumference()/2,"px")("stroke-width",e._circleStrokeWidth(),"%"),o("r",e._circleRadius())}}var U=new k("mat-progress-spinner-default-options",{providedIn:"root",factory:Y});function Y(){return{diameter:V}}var V=100,$=10,j=(()=>{class i{_elementRef=n(l);_noopAnimations;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor="primary";_determinateCircle;constructor(){let e=n(w,{optional:!0}),r=n(U);this._noopAnimations=e==="NoopAnimations"&&!!r&&!r._forceAnimations,this.mode=this._elementRef.nativeElement.nodeName.toLowerCase()==="mat-spinner"?"indeterminate":"determinate",r&&(r.color&&(this.color=this._defaultColor=r.color),r.diameter&&(this.diameter=r.diameter),r.strokeWidth&&(this.strokeWidth=r.strokeWidth))}mode;get value(){return this.mode==="determinate"?this._value:0}set value(e){this._value=Math.max(0,Math.min(100,e||0))}_value=0;get diameter(){return this._diameter}set diameter(e){this._diameter=e||0}_diameter=V;get strokeWidth(){return this._strokeWidth??this.diameter/10}set strokeWidth(e){this._strokeWidth=e||0}_strokeWidth;_circleRadius(){return(this.diameter-$)/2}_viewBox(){let e=this._circleRadius()*2+this.strokeWidth;return`0 0 ${e} ${e}`}_strokeCircumference(){return 2*Math.PI*this._circleRadius()}_strokeDashOffset(){return this.mode==="determinate"?this._strokeCircumference()*(100-this._value)/100:null}_circleStrokeWidth(){return this.strokeWidth/this.diameter*100}static \u0275fac=function(r){return new(r||i)};static \u0275cmp=C({type:i,selectors:[["mat-progress-spinner"],["mat-spinner"]],viewQuery:function(r,t){if(r&1&&D(G,5),r&2){let c;N(c=O())&&(t._determinateCircle=c.first)}},hostAttrs:["role","progressbar","tabindex","-1",1,"mat-mdc-progress-spinner","mdc-circular-progress"],hostVars:18,hostBindings:function(r,t){r&2&&(o("aria-valuemin",0)("aria-valuemax",100)("aria-valuenow",t.mode==="determinate"?t.value:null)("mode",t.mode),u("mat-"+t.color),_("width",t.diameter,"px")("height",t.diameter,"px")("--mdc-circular-progress-size",t.diameter+"px")("--mdc-circular-progress-active-indicator-width",t.diameter+"px"),P("_mat-animation-noopable",t._noopAnimations)("mdc-circular-progress--indeterminate",t.mode==="indeterminate"))},inputs:{color:"color",mode:"mode",value:[2,"value","value",d],diameter:[2,"diameter","diameter",d],strokeWidth:[2,"strokeWidth","strokeWidth",d]},exportAs:["matProgressSpinner"],features:[x],decls:14,vars:11,consts:[["circle",""],["determinateSpinner",""],["aria-hidden","true",1,"mdc-circular-progress__determinate-container"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__determinate-circle-graphic"],["cx","50%","cy","50%",1,"mdc-circular-progress__determinate-circle"],["aria-hidden","true",1,"mdc-circular-progress__indeterminate-container"],[1,"mdc-circular-progress__spinner-layer"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-left"],[3,"ngTemplateOutlet"],[1,"mdc-circular-progress__gap-patch"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-right"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__indeterminate-circle-graphic"],["cx","50%","cy","50%"]],template:function(r,t){if(r&1&&(R(0,Q,2,8,"ng-template",null,0,I),a(2,"div",2,1),h(),a(4,"svg",3),v(5,"circle",4),m()(),E(),a(6,"div",5)(7,"div",6)(8,"div",7),g(9,8),m(),a(10,"div",9),g(11,8),m(),a(12,"div",10),g(13,8),m()()()),r&2){let c=W(1);s(4),o("viewBox",t._viewBox()),s(),_("stroke-dasharray",t._strokeCircumference(),"px")("stroke-dashoffset",t._strokeDashOffset(),"px")("stroke-width",t._circleStrokeWidth(),"%"),o("r",t._circleRadius()),s(4),p("ngTemplateOutlet",c),s(2),p("ngTemplateOutlet",c),s(2),p("ngTemplateOutlet",c)}},dependencies:[z],styles:[".mat-mdc-progress-spinner{display:block;overflow:hidden;line-height:0;position:relative;direction:ltr;transition:opacity 250ms cubic-bezier(0.4, 0, 0.6, 1)}.mat-mdc-progress-spinner circle{stroke-width:var(--mdc-circular-progress-active-indicator-width, 4px)}.mat-mdc-progress-spinner._mat-animation-noopable,.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__determinate-circle{transition:none !important}.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-circle-graphic,.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__spinner-layer,.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container{animation:none !important}.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container circle{stroke-dasharray:0 !important}@media(forced-colors: active){.mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic,.mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle{stroke:currentColor;stroke:CanvasText}}.mdc-circular-progress__determinate-container,.mdc-circular-progress__indeterminate-circle-graphic,.mdc-circular-progress__indeterminate-container,.mdc-circular-progress__spinner-layer{position:absolute;width:100%;height:100%}.mdc-circular-progress__determinate-container{transform:rotate(-90deg)}.mdc-circular-progress--indeterminate .mdc-circular-progress__determinate-container{opacity:0}.mdc-circular-progress__indeterminate-container{font-size:0;letter-spacing:0;white-space:nowrap;opacity:0}.mdc-circular-progress--indeterminate .mdc-circular-progress__indeterminate-container{opacity:1;animation:mdc-circular-progress-container-rotate 1568.2352941176ms linear infinite}.mdc-circular-progress__determinate-circle-graphic,.mdc-circular-progress__indeterminate-circle-graphic{fill:rgba(0,0,0,0)}.mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,.mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic{stroke:var(--mdc-circular-progress-active-indicator-color, var(--mat-sys-primary))}@media(forced-colors: active){.mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,.mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic{stroke:CanvasText}}.mdc-circular-progress__determinate-circle{transition:stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1)}.mdc-circular-progress__gap-patch{position:absolute;top:0;left:47.5%;box-sizing:border-box;width:5%;height:100%;overflow:hidden}.mdc-circular-progress__gap-patch .mdc-circular-progress__indeterminate-circle-graphic{left:-900%;width:2000%;transform:rotate(180deg)}.mdc-circular-progress__circle-clipper .mdc-circular-progress__indeterminate-circle-graphic{width:200%}.mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic{left:-100%}.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-left .mdc-circular-progress__indeterminate-circle-graphic{animation:mdc-circular-progress-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic{animation:mdc-circular-progress-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress__circle-clipper{display:inline-flex;position:relative;width:50%;height:100%;overflow:hidden}.mdc-circular-progress--indeterminate .mdc-circular-progress__spinner-layer{animation:mdc-circular-progress-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}@keyframes mdc-circular-progress-container-rotate{to{transform:rotate(360deg)}}@keyframes mdc-circular-progress-spinner-layer-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes mdc-circular-progress-left-spin{from{transform:rotate(265deg)}50%{transform:rotate(130deg)}to{transform:rotate(265deg)}}@keyframes mdc-circular-progress-right-spin{from{transform:rotate(-265deg)}50%{transform:rotate(-130deg)}to{transform:rotate(-265deg)}}"],encapsulation:2,changeDetection:0})}return i})();var se=(()=>{class i{static \u0275fac=function(r){return new(r||i)};static \u0275mod=T({type:i});static \u0275inj=S({imports:[F]})}return i})();var le=(()=>{class i{constructor(){this._renderer=n(y),this._elementRef=n(l),this._viewContainerRef=n(b),this._isSpinnerExist=!1,this.MAT_SELECT="MAT-SELECT",this.mskSpinner=f(!0,{transform:B}),this.mskSpinnerDiameter=f(24,{transform:d}),this._spinnerParent=document.createElement("div"),this._spinnerParent.classList.add("absolute","inset-0","flex","items-center","justify-center","z-99999"),L(()=>this.mskSpinner()?this.show():this.hide())}get nativeElementTagName(){return this._elementRef.nativeElement.tagName}get classList(){return{relative:this.nativeElementTagName!==this.MAT_SELECT&&this._isSpinnerExist,"overflow-hidden":this.nativeElementTagName!==this.MAT_SELECT&&this._isSpinnerExist}}hide(){this._isSpinnerExist&&(this._viewContainerRef.remove(),this._renderer.removeChild(this._elementRef.nativeElement,this._spinnerParent),this._isSpinnerExist=!1)}show(){if(!this._isSpinnerExist){switch(this._spinner=this._viewContainerRef.createComponent(j),this._spinner.instance.mode="indeterminate",this._spinner.instance.diameter=this.mskSpinnerDiameter(),this._renderer.appendChild(this._spinnerParent,this._spinner.location.nativeElement),this.nativeElementTagName){case this.MAT_SELECT:this._renderer.appendChild(this._elementRef.nativeElement.parentElement?.parentElement,this._spinnerParent);break;default:this._renderer.appendChild(this._elementRef.nativeElement,this._spinnerParent);break}this._isSpinnerExist=!0}}static{this.\u0275fac=function(r){return new(r||i)}}static{this.\u0275dir=M({type:i,selectors:[["","mskSpinner",""]],hostVars:2,hostBindings:function(r,t){r&2&&u(t.classList)},inputs:{mskSpinner:[1,"mskSpinner"],mskSpinnerDiameter:[1,"mskSpinnerDiameter"]},exportAs:["mskSpinner"]})}}return i})();export{j as a,se as b,le as c};