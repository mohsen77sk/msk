import{b as $e,c as Be,d as Ne,e as Ve,f as Oe,g as vt,h as Pe,i as je,j as He,k as ze,l as Ge,m as Ue,n as Qe,o as We,p as Ye}from"./chunk-MVFZCIZH.js";import{a as qe}from"./chunk-XPPBJ7TH.js";import{c as Re}from"./chunk-CFLNYORV.js";import{b as Le,c as ht}from"./chunk-HSXKEKXY.js";import{fa as H,g as ke,ga as we}from"./chunk-HEZWVIV4.js";import{a as Ee,b as Me,d as Ie,i as be}from"./chunk-FE6UMCBO.js";import{a as Fe}from"./chunk-FF7LV7NV.js";import{a as pe,b as O,c as de,d as ue,f as Te}from"./chunk-IYNNFGH3.js";import"./chunk-I3ROGWBB.js";import{b as oe,c as X,d as Z,e as re}from"./chunk-O4YY32B3.js";import{a as fe,b as at}from"./chunk-XXCT4XK3.js";import{c as De}from"./chunk-HMXM2B6P.js";import{a as K}from"./chunk-DYXZEK2U.js";import{a as ft,b as ye,c as Ae,d as _t}from"./chunk-LW3G366B.js";import{A as dt,B as ut,a as _e,b as he,c as ve,g as ge,h as ot,i as Ce,j as rt,l as w,n as st,o as ct,p as xe,r as bt,t as lt,u as mt,w as pt,z as Se}from"./chunk-Y6ONTVHQ.js";import"./chunk-K4N75KFR.js";import"./chunk-IH7PG2K6.js";import{k as it}from"./chunk-4ZQQP3ZL.js";import"./chunk-PA7MYXRC.js";import{Z as tt,_ as et,ba as se,ga as ce,ha as le,ia as me,ja as nt,la as N,ma as V}from"./chunk-CUPWY2MF.js";import"./chunk-LXK3JGZ5.js";import{b as ae}from"./chunk-3FGYITUY.js";import{j as It,m as Y,o as ie,p as J,r as ne}from"./chunk-775XZAEP.js";import{$ as D,$b as Qt,A as Vt,Ba as Gt,Bc as Et,Cc as Jt,Dc as Kt,E as T,Eb as _,Ec as I,Hc as g,Ia as L,Ic as x,Ja as U,Jc as Mt,Kc as j,M as Ot,Mc as W,Nb as f,Nc as Xt,Pc as Zt,Sc as te,Tb as y,Ub as Dt,Vb as $,Wb as B,Wc as ee,Xb as s,Y as Pt,Yb as r,Zb as h,_b as Ut,ac as Wt,ba as jt,bc as Q,ca as Ht,g as St,h as Rt,hc as E,ia as m,ib as a,j as yt,jc as d,l as $t,m as Bt,nb as qt,q as C,qb as P,rb as At,rc as kt,sc as Yt,ta as G,tc as M,ua as q,uc as c,vc as p,w as Nt,wc as v,xb as A,za as zt,zb as R}from"./chunk-URZL6SS3.js";import{a as z,b as Ft,c as Lt}from"./chunk-2R6CW7ES.js";var Je=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275cmp=A({type:e,selectors:[["main-accounts"]],decls:1,vars:0,template:function(i,n){i&1&&h(0,"router-outlet")},dependencies:[X],encapsulation:2,changeDetection:0})}}return e})();var gt="code",Ct="asc",k=class{constructor(o){this.id=o.id,this.code=o.code,this.accountTypeId=o.accountTypeId,this.accountTypeName=o.accountTypeName,this.createDate=new Date(o.createDate),this.closeDate=o.closeDate?new Date(o.closeDate):void 0,this.balance=o.balance,this.persons=o.persons?.map(t=>new Tt(t)),this.note=o.note,this.isActive=o.isActive}get fullName(){return this.accountTypeName+" "+this.persons.map(o=>o.name).join("/")}},Tt=class{constructor(o){this.id=o.id,this.code=o.code,this.name=o.name}};var F=(()=>{class e{constructor(){this._appConfig=m(Fe),this._httpClient=m(ae),this._pagination=new St(null),this._accounts=new St(null)}get pagination$(){return this._pagination.asObservable()}get accounts$(){return this._accounts.asObservable()}getAccounts(t=1,i=10,n=`${gt} ${Ct}`){return this._httpClient.get(`${this._appConfig.apiEndpoint}/api/account/all`,{params:{page:t,pageSize:i,sortBy:n}}).pipe(C(l=>({pagination:new Be(l),items:l.items.map(u=>new k(u))})),D(l=>{this._pagination.next(l.pagination),this._accounts.next(l.items)}))}getLookupAccounts(){return this._httpClient.get(`${this._appConfig.apiEndpoint}/api/account/lookup`).pipe(C(t=>t))}getLookupAccountTypes(){return this._httpClient.get(`${this._appConfig.apiEndpoint}/api/accountType/lookup`).pipe(C(t=>t))}getAccount(t){return this._httpClient.get(`${this._appConfig.apiEndpoint}/api/account/${t}`).pipe(C(i=>new k(i)))}getBalanceAccount(t){return this._httpClient.get(`${this._appConfig.apiEndpoint}/api/account/${t}/balance`).pipe(C(i=>i))}getAccountWithBalance(t){return Nt([this.getAccount(t),this.getBalanceAccount(t)]).pipe(C(i=>new k(z(z({},i[0]),i[1]))))}createAccount(t){return this._httpClient.post(`${this._appConfig.apiEndpoint}/api/account`,t).pipe(C(i=>new k(i)))}updateAccount(t){return this._httpClient.put(`${this._appConfig.apiEndpoint}/api/account`,t).pipe(C(i=>new k(i)),D(i=>{if(this._accounts.value){let n=this._accounts.value.findIndex(l=>l.id===i.id)??0;this._accounts.value[n]=i,this._accounts.next(this._accounts.value)}}))}closeAccount(t){return this._httpClient.post(`${this._appConfig.apiEndpoint}/api/account/close`,t).pipe(C(i=>new k(Ft(z({},i),{balance:0}))),D(i=>{if(this._accounts.value){let n=this._accounts.value.findIndex(l=>l.id===i.id)??0;this._accounts.value[n]=i,this._accounts.next(this._accounts.value)}}))}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275prov=Ht({token:e,factory:e.\u0275fac,providedIn:"root"})}}return e})();var ai=e=>[e];function oi(e,o){if(e&1&&(Ut(0),s(1,"mat-icon",1),c(2),r(),Qt()),e&2){let t=o.$implicit,i=d();a(),f("ngClass",I(3,ai,i.value()?"text-green-400":"text-red-400"))("matTooltip",i.value()?t("active"):t("inactive")),a(),v(" ",i.value()?"check_circle":"cancel"," ")}}var Xe=(()=>{class e{constructor(){this.value=L(!0,{transform:te})}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275cmp=A({type:e,selectors:[["main-accounts-status"]],inputs:{value:[1,"value"]},decls:1,vars:0,consts:[[4,"transloco"],[1,"text-green-400",3,"ngClass","matTooltip"]],template:function(i,n){i&1&&_(0,oi,3,5,"ng-container",0)},dependencies:[Y,V,N,at,fe,O],styles:[`main-accounts-status{display:flex}
`],encapsulation:2,changeDetection:0})}}return e})();var li=(e,o)=>o.id,mi=()=>["card","new"],pi=e=>({"mat-mdc-extended-fab-collapses":e}),di=e=>["card","view",e];function ui(e,o){if(e&1&&(s(0,"div",11)(1,"form",12)(2,"div",13)(3,"mat-icon"),c(4,"search"),r(),h(5,"input",14),r()()()),e&2){let t=o.$implicit,i=d();a(),f("formGroup",i.filterForm),a(4),f("placeholder",t("accounts.search"))}}function fi(e,o){if(e&1&&(s(0,"div",20)(1,"div",21),c(2),r(),s(3,"div",22)(4,"span"),c(5),r()()()),e&2){let t=d().$implicit;a(2),v(" ",t.fullName," "),a(3),v("#",t.code,"")}}function _i(e,o){if(e&1&&(s(0,"div",4)(1,"div",15),h(2,"msk-avatar",16),r(),_(3,fi,6,2,"div",17),s(4,"div",18),h(5,"main-accounts-status",19),r()()),e&2){let t=o.$implicit;f("routerLink",I(4,di,t.id)),a(2),f("name",t.persons[0].name),a(),f("translocoRead","accounts.details"),a(2),f("value",t.isActive)}}function hi(e,o){if(e&1&&(s(0,"div",5),c(1),r()),e&2){let t=o.$implicit;a(),v(" ",t("accounts.empty-list")," ")}}function vi(e,o){e&1&&_(0,hi,2,1,"div",23)}function gi(e,o){if(e&1&&(s(0,"span"),c(1),r()),e&2){let t=o.$implicit;a(),p(t("new"))}}var xt=(()=>{class e{constructor(){this._destroyRef=m(Gt),this._accountService=m(F),this._gridContent=At.required(it),this._paginator=At.required(H),this._sort=new Ve,this.isLoading=P(!1),this.isFabCollapses=P(!1),this.lastOffsetScroll=0,this.pageSizeOptions=$e,this.filterForm=new xe({search:new bt(""),isActive:new bt(null)})}ngOnInit(){this.accounts$=this._accountService.accounts$,this.pagination$=this._accountService.pagination$}ngAfterViewInit(){this._sort&&this._paginator&&(this._sort.sort({id:gt,start:Ct,disableClear:!0}),this._sort.sortChange.pipe(K(this._destroyRef),D(()=>this._paginator().pageIndex=0)).subscribe(),Vt(this._sort.sortChange,this._paginator().page).pipe(K(this._destroyRef),Pt(()=>this.getAccounts())).subscribe()),this._gridContent().elementScrolled().pipe(K(this._destroyRef),C(t=>t.target.scrollTop||0),D(t=>{let i=t>10?this.lastOffsetScroll<t:!1;this.isFabCollapses()!==i&&this.isFabCollapses.set(i),this.lastOffsetScroll=t})).subscribe()}getAccounts(t=!1){return this.isLoading.set(!0),this._accountService.getAccounts(t?1:this._paginator().pageIndex+1,this._paginator().pageSize,`${this._sort.active} ${this._sort.direction}`).pipe(T(i=>$t()),Ot(()=>{this.isLoading.set(!1)}))}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275cmp=A({type:e,selectors:[["main-accounts-list"]],viewQuery:function(i,n){i&1&&(kt(n._gridContent,it,5),kt(n._paginator,H,5)),i&2&&Yt(2)},decls:19,vars:21,consts:[[1,"page-layout","grid-scroll"],["class","header",4,"transloco"],[1,"content"],["cdkScrollable","",1,"content-grid"],["matRipple","",1,"content-grid-item","tow-line",3,"routerLink"],[1,"text-secondary","p-8","text-center","text-xl","font-semibold","tracking-tight","sm:p-16"],[1,"content-fab-container"],["mat-fab","","extended","",3,"routerLink","ngClass"],[4,"transloco"],[1,"content-paginator",3,"length","pageIndex","pageSize","pageSizeOptions","showFirstLastButtons","disabled"],[1,"pointer-events-none","invisible","absolute","h-0","w-0","opacity-0"],[1,"header"],[1,"flex","w-full","items-center",3,"formGroup"],[1,"msk-mat-search-bar","w-full"],["formControlName","search","autocomplete","off",3,"placeholder"],[1,"content-grid-item-avatar"],[3,"name"],["class","content-grid-item-content",4,"transloco","translocoRead"],[1,"content-grid-item-end"],[3,"value"],[1,"content-grid-item-content"],[1,"truncate"],[1,"flex","items-center","gap-2","truncate"],["class","text-secondary p-8 text-center text-xl font-semibold tracking-tight sm:p-16",4,"transloco"]],template:function(i,n){if(i&1&&(s(0,"div",0),_(1,ui,6,2,"div",1),s(2,"div",2)(3,"div",3),$(4,_i,6,6,"div",4,li,!1,vi,1,0,"div",5),g(7,"async"),r(),s(8,"div",6)(9,"button",7)(10,"mat-icon"),c(11,"add"),r(),_(12,gi,2,1,"span",8),r()(),h(13,"mat-paginator",9),g(14,"async"),g(15,"async"),g(16,"async"),r()(),s(17,"div",10),h(18,"router-outlet"),r()),i&2){let l,u,S;a(4),B(x(7,10,n.accounts$)),a(5),f("routerLink",Kt(18,mi))("ngClass",I(19,pi,n.isFabCollapses()))("@zoomIn",void 0),a(4),f("length",(l=x(14,12,n.pagination$))==null?null:l.total)("pageIndex",(u=x(15,14,n.pagination$))==null?null:u.pageIndex)("pageSize",(S=x(16,16,n.pagination$))==null?null:S.pageSize)("pageSizeOptions",n.pageSizeOptions)("showFirstLastButtons",!0)("disabled",n.isLoading())}},dependencies:[J,Y,dt,lt,rt,st,ct,ut,mt,pt,re,X,it,V,N,ke,ht,et,tt,nt,le,ot,Oe,we,H,O,vt,Xe],encapsulation:2,data:{animation:_t},changeDetection:0})}}return e})();var Ze=(()=>{class e{constructor(){this._elementRef=m(U),this._localeId=m(W)}onInput(t){let i=this._elementRef.nativeElement.value.replace(/[^\d.-]/g,"");if(this.onChange){let n=parseFloat(i);this.onChange(isNaN(n)?"":n)}this._formatInputValue()}onBlur(t){this.onTouched&&this.onTouched(),this._formatInputValue()}writeValue(t){if(t){let i=It(t,this._localeId,"","","1.0-2");this._elementRef.nativeElement.value=i}else this._elementRef.nativeElement.value=""}registerOnChange(t){this.onChange=t}registerOnTouched(t){this.onTouched=t}setDisabledState(t){this._elementRef.nativeElement.disabled=t}_formatInputValue(){let t=this._elementRef.nativeElement.value.replace(/[^\d.-]/g,"");if(t){let i=parseFloat(t);if(!isNaN(i)){let n=It(i,this._localeId,"","","1.0-2");this._elementRef.nativeElement.value=n}}else this._elementRef.nativeElement.value=""}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275dir=R({type:e,selectors:[["input","mskCurrencyMask",""],["textarea","mskCurrencyMask",""]],hostBindings:function(i,n){i&1&&E("input",function(u){return n.onInput(u)})("blur",function(u){return n.onBlur(u)})},exportAs:["mskCurrencyMask"],features:[Jt([{provide:Ce,useExisting:jt(()=>e),multi:!0}])]})}}return e})();var ti=(()=>{class e{constructor(){this._elementRef=m(U),this._localeId=m(W),this._currencyCode=m(Xt)}ngOnInit(){let t=Intl.NumberFormat(this._localeId,{style:"currency",currency:this._currencyCode}).formatToParts().find(i=>i.type==="currency")?.value||this._currencyCode;this._elementRef.nativeElement.innerHTML=t}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275dir=R({type:e,selectors:[["","mskCurrencySymbol",""]],exportAs:["mskCurrencySymbol"]})}}return e})();var ei=(()=>{class e{constructor(){this._renderer=m(qt),this._matSelect=m(ft),this.searchList=L([]),this.searchItems=L.required(),this.searchPlaceholder=L("search ..."),this.filteredList=new Rt(1),ee(()=>{this._list=this.searchList(),this.filteredList.next(this._list?this._list.slice():[])})}get showSearch(){return this._list&&this._list.length>5}onOpenedChange(t){if(!this.showSearch)return;if(!t){this.filteredList.next(this._list.slice());return}this._initMultipleHandling();let i=this._renderer.createElement("input");this._renderer.setAttribute(i,"placeholder",this.searchPlaceholder()),this._renderer.addClass(i,"mdc-text-field__input"),this._renderer.listen(i,"input",()=>{let u=i.value?i.value.toLowerCase():"";this.filteredList.next(this._list.filter(S=>this.searchItems()==null?this._includes(S,u):typeof this.searchItems()=="string"?this._includes(S[this.searchItems()],u):Array.isArray(this.searchItems())?this.searchItems().some(ni=>this._includes(S[ni],u)):!0)),setTimeout(()=>this._matSelect._keyManager.setFirstItemActive(),0)});let n=this._renderer.createElement("mat-option");this._renderer.setAttribute(n,"role","option"),this._renderer.addClass(n,"mat-mdc-option"),this._renderer.addClass(n,"mdc-list-item"),this._renderer.addClass(n,"z-999"),this._renderer.addClass(n,"top-0"),this._renderer.addClass(n,"sticky"),this._renderer.addClass(n,"border-b"),this._renderer.setStyle(n,"background","inherit"),this._renderer.appendChild(n,i);let l=document.querySelector(".mat-mdc-select-panel");if(!l)throw new Error("Cannot find mat select panel");this._renderer.setStyle(l,"padding-top","0"),this._renderer.insertBefore(l,n,l.firstChild),i.focus()}_includes(t,i){return t.toString().toLowerCase().includes(i)}_initMultipleHandling(){this._previousSelectedValues=this._matSelect.value,this._matSelect.valueChange?.subscribe(t=>{let i=!1,n=t&&Array.isArray(t)?[...t]:[];if(this._matSelect.multiple&&this._previousSelectedValues&&Array.isArray(this._previousSelectedValues)){(!t||!Array.isArray(t))&&(t=[]);let l=this._matSelect.options.map(u=>u.value);this._previousSelectedValues.forEach(u=>{!n.some(S=>this._matSelect.compareWith(S,u))&&!l.some(S=>this._matSelect.compareWith(S,u))&&(n.push(u),i=!0)})}this._previousSelectedValues=n,i&&this._matSelect._onChange(n)})}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275dir=R({type:e,selectors:[["","mskSelectSearch",""]],hostBindings:function(i,n){i&1&&E("openedChange",function(u){return n.onOpenedChange(u)})},inputs:{searchList:[1,"searchList"],searchItems:[1,"searchItems"],searchPlaceholder:[1,"searchPlaceholder"]},exportAs:["mskSelectSearch"]})}}return e})();var Ci=(e,o)=>o.id,xi=e=>({code:e}),Si=e=>({t:e});function yi(e,o){if(e&1){let t=Q();s(0,"button",11),E("click",function(){G(t);let n=d(3);return q(n.editMode())}),s(1,"mat-icon",12),c(2,"edit"),r()()}}function Ai(e,o){if(e&1&&_(0,yi,3,0,"button",10),e&2){let t=d(2);y(t.data.item!=null&&t.data.item.isActive?0:-1)}}function Di(e,o){if(e&1&&(s(0,"span"),c(1),r()),e&2){let t=o.$implicit,i=d(3);a(),p(i.form.enabled?t("save"):"")}}function ki(e,o){if(e&1){let t=Q();s(0,"button",13),E("click",function(){G(t);let n=d(2);return q(n.saveAndClose())}),_(1,Di,2,1,"span",14),r()}if(e&2){let t=d(2);f("disabled",t.form.disabled)("mskSpinner",t.form.disabled)}}function Ei(e,o){if(e&1&&(s(0,"msk-dialog",8),Wt(1,9),_(2,Ai,1,1,"ng-template",null,2,j)(4,ki,2,2,"ng-template",null,3,j),r()),e&2){let t=o.$implicit,i=M(3),n=M(5),l=d(),u=M(2),S=M(4);f("title",t(l.data.action,I(6,xi,l.data.item==null?null:l.data.item.code)))("hasAction",l.data.action!=="view")("primaryAction",n)("trailing",i),a(),f("ngTemplateOutlet",l.data.action==="view"?u:S)("ngTemplateOutletContext",I(8,Si,t))}}function Mi(e,o){if(e&1&&(s(0,"div",19)(1,"button",25)(2,"mat-icon",26),c(3,"arrow_upward"),r(),c(4),r(),s(5,"button",27)(6,"mat-icon",26),c(7,"arrow_downward"),r(),c(8),r(),s(9,"button",27)(10,"mat-icon",26),c(11,"swap_horiz"),r(),c(12),r()()),e&2){let t=o.$implicit;a(4),v(" ",t("deposit")," "),a(4),v(" ",t("withdraw")," "),a(4),v(" ",t("transfer")," ")}}function Ii(e,o){e&1&&_(0,Mi,13,3,"div",24)}function bi(e,o){if(e&1&&(s(0,"div",22)(1,"div",28),h(2,"msk-avatar",29),r(),s(3,"div",30)(4,"span"),c(5),r(),s(6,"span"),c(7),r()(),s(8,"div",28)(9,"mat-icon",31),c(10,"open_in_new"),r()()()),e&2){let t=o.$implicit;a(2),f("name",t.name),a(3),p(t.name),a(2),v("#",t.code,"")}}function Ti(e,o){if(e&1&&(s(0,"div",23)(1,"div",28)(2,"mat-icon"),c(3,"credit_card_gear"),r()(),s(4,"div",30)(5,"span"),c(6),r(),s(7,"span"),c(8),r()()()),e&2){let t=d().t,i=d();a(6),p(i.data.item==null?null:i.data.item.accountTypeName),a(2),p(t("accountType"))}}function wi(e,o){if(e&1&&(s(0,"div",23)(1,"div",28)(2,"mat-icon"),c(3,"calendar_add_on"),r()(),s(4,"div",30)(5,"span"),c(6),g(7,"mskDateTime"),r(),s(8,"span"),c(9),r()()()),e&2){let t=d().t,i=d();a(6),p(Mt(7,2,i.data.item==null?null:i.data.item.createDate,"longDate")||"-"),a(3),p(t("createDate"))}}function Fi(e,o){if(e&1&&(s(0,"div",23)(1,"div",28)(2,"mat-icon"),c(3,"event_busy"),r()(),s(4,"div",30)(5,"span"),c(6),g(7,"mskDateTime"),r(),s(8,"span"),c(9),r()()()),e&2){let t=d().t,i=d();a(6),p(Mt(7,2,i.data.item==null?null:i.data.item.closeDate,"longDate")||"-"),a(3),p(t("closeDate"))}}function Li(e,o){if(e&1&&(s(0,"div",20)(1,"div",21),c(2),r(),s(3,"div",23)(4,"div",28)(5,"mat-icon"),c(6,"sticky_note_2"),r()(),s(7,"div",30)(8,"span"),c(9),r()()()()),e&2){let t=d().t,i=d();a(2),p(t("note")),a(7),p(i.data.item==null?null:i.data.item.note)}}function Ri(e,o){if(e&1){let t=Q();s(0,"div",34)(1,"div",21),c(2),r(),s(3,"div",35),E("click",function(){G(t);let n=d(3);return q(n.updateStatus())}),s(4,"div",28)(5,"mat-icon",36),c(6," cancel "),r()(),s(7,"div",30)(8,"span",36),c(9),r()()()()}if(e&2){let t=o.$implicit;a(2),p(t("settings")),a(7),v(" ",t("accounts.deactivate")," ")}}function $i(e,o){e&1&&(h(0,"div",32),_(1,Ri,10,2,"div",33))}function Bi(e,o){if(e&1&&(s(0,"div",15)(1,"span",16),c(2),r(),s(3,"span",17),c(4),g(5,"number"),h(6,"small",18),r()(),_(7,Ii,1,0,"div",19),s(8,"div",20)(9,"div",21),c(10),r(),$(11,bi,11,3,"div",22,Ci),r(),s(13,"div",20)(14,"div",21),c(15),r(),_(16,Ti,9,2,"div",23)(17,wi,10,5,"div",23)(18,Fi,10,5,"div",23),r(),_(19,Li,10,2,"div",20)(20,$i,2,0)),e&2){let t=o.t,i=d();a(2),p(t("credit")),a(2),v(" ",x(5,10,i.data.item==null?null:i.data.item.balance)," "),a(3),y(i.data.item!=null&&i.data.item.isActive?7:-1),a(3),p(t("owners")),a(),B(i.data.item==null?null:i.data.item.persons),a(4),p(t("about")),a(),y(i.data.item!=null&&i.data.item.accountTypeName?16:-1),a(),y(i.data.item!=null&&i.data.item.createDate?17:-1),a(),y(i.data.item!=null&&i.data.item.closeDate?18:-1),a(),y(i.data.item!=null&&i.data.item.note?19:-1),a(),y(i.data.item!=null&&i.data.item.isActive?20:-1)}}function Ni(e,o){if(e&1&&(s(0,"msk-alert",38)(1,"span",45),c(2),r(),c(3),r()),e&2){let t=o.$implicit;a(2),p(t("info-edit-title")),a(),v(" ",t("info-edit-description")," ")}}function Vi(e,o){e&1&&_(0,Ni,4,2,"msk-alert",44),e&2&&f("translocoRead","accounts")}function Oi(e,o){if(e&1&&(s(0,"msk-alert",39),c(1),r()),e&2){let t=d(2);f("@shake",void 0),a(),v(" ",t.alert().message," ")}}function Pi(e,o){if(e&1&&(s(0,"mat-option",42),c(1),r()),e&2){let t=o.$implicit;f("value",t.id),a(),p(t.name)}}function ji(e,o){if(e&1&&(s(0,"div",40)(1,"mat-form-field")(2,"mat-label"),c(3),r(),Et(4),g(5,"async"),s(6,"mat-select",46,5),g(8,"transloco"),$(9,Pi,2,2,"mat-option",42,Dt),g(11,"async"),r(),s(12,"mat-error"),c(13),r()(),s(14,"mat-form-field")(15,"mat-label"),c(16),r(),h(17,"input",47)(18,"mat-datepicker-toggle",48)(19,"mat-datepicker",null,6),s(21,"mat-error"),c(22),r()()()),e&2){let t=M(7),i=M(20),n=d().t,l=d();a(3),p(n("accountType"));let u=x(5,9,l.accountTypeList$);a(3),f("searchList",u)("searchItems","name")("searchPlaceholder",x(8,11,"search")),a(3),B(x(11,13,t.filteredList)),a(4),p(l.formErrors.accountTypeId),a(3),p(n("createDate")),a(),f("matDatepicker",i),a(),f("for",i),a(4),p(l.formErrors.createDate)}}function Hi(e,o){if(e&1&&(s(0,"mat-option",42),c(1),r()),e&2){let t=o.$implicit;f("value",t.id),a(),p(t.name)}}function zi(e,o){if(e&1&&(s(0,"mat-form-field")(1,"mat-label"),c(2),r(),h(3,"input",49)(4,"span",50),s(5,"mat-error"),c(6),r()()),e&2){let t=d().t,i=d();a(2),p(t("initCredit")),a(4),p(i.formErrors.initCredit)}}function Gi(e,o){if(e&1&&(s(0,"form",37),_(1,Vi,1,1,"msk-alert",38)(2,Oi,2,2,"msk-alert",39)(3,ji,23,15,"div",40),s(4,"mat-form-field")(5,"mat-label"),c(6),r(),Et(7),g(8,"async"),s(9,"mat-select",41,4),g(11,"transloco"),s(12,"mat-select-trigger"),c(13),r(),$(14,Hi,2,2,"mat-option",42,Dt),g(16,"async"),r(),s(17,"mat-error"),c(18),r()(),_(19,zi,7,2,"mat-form-field"),s(20,"mat-form-field"),h(21,"textarea",43),s(22,"mat-error"),c(23),r()()()),e&2){let t=o.t,i=M(10),n=d();f("formGroup",n.form),a(),y(n.data.action==="edit"?1:-1),a(),y(n.alert().show?2:-1),a(),y(n.data.action==="new"?3:-1),a(3),p(t("owners"));let l=x(8,14,n.personList$);a(3),f("searchList",l)("searchItems","name")("searchPlaceholder",x(11,16,"search")),a(4),p(n.personIdTitles(l)),a(),B(x(16,18,i.filteredList)),a(4),p(n.formErrors.personId),a(),y(n.data.action==="new"?19:-1),a(2),f("placeholder",t("note"))("rows",2),a(2),p(n.formErrors.note)}}var ii=(()=>{class e{constructor(){this.data=m(Me),this.dialogRef=m(Ee),this._formBuilder=m(Se),this._peopleService=m(Ne),this._accountService=m(F),this._translocoService=m(pe),this._changeDetectorRef=m(Zt),this._mskConfirmationService=m(qe),this.formErrors={},this.personList$=this._peopleService.getLookupPersons(),this.accountTypeList$=this._accountService.getLookupAccountTypes(),this.alert=P({show:!1,message:""})}ngOnInit(){this.form=this._formBuilder.group({id:[0,w.required],personId:[[],w.required],accountTypeId:["",w.required],initCredit:["",[w.required,w.min(1e3)]],createDate:[new Date(new Date().setHours(0,0,0,0)),w.required],note:""}),new Qe(this.form,this.formErrors,this._translocoService),this.form.patchValue(this.data.item||{}),this.form.get("personId")?.patchValue(this.data.item?.persons.map(t=>t.id)||[])}personIdTitles(t){let i=this.form.get("personId")?.value;return t?.find(l=>l.id===i[0])?.name+(i.length>1?` (+${i.length-1} ${this._translocoService.translate("other")})`:"")}editMode(){this.data.action="edit",this.form.get("initCredit")?.clearValidators()}updateStatus(){let t=this.data.item?.isActive;this._mskConfirmationService.open({title:this._translocoService.translate(t?"accounts.deactivate":"accounts.activate"),message:this._translocoService.translate(t?"accounts.deactivate-message":"accounts.activate-message",{name:this.data.item?.fullName}),actions:{confirm:{label:this._translocoService.translate(t?"close":"open")},cancel:{label:this._translocoService.translate("cancel")}}}).afterClosed().subscribe(n=>{if(n!=="confirmed")return;let l={id:this.data.item?.id,closeDate:new Date(new Date().setMinutes(new Date().getMinutes()-1,0,0))};this._accountService.closeAccount(l).pipe(C(u=>{this.data.item=u,this._changeDetectorRef.markForCheck()}),T(u=>yt)).subscribe()})}saveAndClose(){if(Ye(this.form),this.form.invalid)return;this.form.disable(),this.alert.set({show:!1,message:""}),(this.data.action==="edit"?this._accountService.updateAccount({id:this.form.value.id,personId:this.form.value.personId,note:this.form.value.note}):this._accountService.createAccount(this.form.value)).pipe(D(i=>this.dialogRef.close(i)),T(i=>(this.form.enable(),this.alert.set({show:!0,message:i.error.message}),We(i.error.errors,this.form),yt))).subscribe()}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275cmp=A({type:e,selectors:[["main-people-details"]],decls:5,vars:1,consts:[["viewTemplate",""],["formTemplate",""],["trailing",""],["primaryAction",""],["searchPersons","mskSelectSearch"],["searchAccountTypes","mskSelectSearch"],["picker",""],[3,"title","hasAction","primaryAction","trailing",4,"transloco","translocoRead"],[3,"title","hasAction","primaryAction","trailing"],["msk-dialog-content","",3,"ngTemplateOutlet","ngTemplateOutletContext"],["mat-icon-button",""],["mat-icon-button","",3,"click"],[1,"mat-icon-rtl-mirror","text-current"],["mat-button","",3,"click","disabled","mskSpinner"],[4,"transloco"],[1,"flex","flex-col","gap-4","p-4"],[1,"text-on-surface-variant","text-label-medium"],[1,"text-on-surface","text-title-large"],["mskCurrencySymbol",""],[1,"grid","grid-cols-3","gap-4","py-4"],[1,"msk-mat-card-filled","mb-2","p-4"],[1,"text-secondary","mb-2","font-bold"],["matRipple","",1,"msk-list-item","-mx-4","cursor-pointer"],[1,"msk-list-item","-mx-4"],["class","grid grid-cols-3 gap-4 py-4",4,"transloco"],["mat-flat-button",""],[1,"hidden","sm:block"],["mat-stroked-button",""],[1,"msk-list-item-icon"],[3,"name"],[1,"msk-list-item-content"],[1,"mat-icon-rtl-mirror"],[1,"my-4","border-t"],["class","mb-2",4,"transloco"],[1,"mb-2"],["matRipple","",1,"msk-list-item","-mx-6","cursor-pointer","gap-2",3,"click"],[1,"!text-error"],[1,"flex","flex-auto","flex-col","gap-y-2",3,"formGroup"],["appearance","outline","type","info","dismissible","",1,"mb-4"],["appearance","outline","type","error",1,"mb-4"],[1,"flex","flex-col","gap-x-4","sm:flex-row","[&>*]:flex-1"],["formControlName","personId","multiple","","mskSelectSearch","",3,"searchList","searchItems","searchPlaceholder"],[3,"value"],["matInput","","formControlName","note",3,"placeholder","rows"],["class","mb-4","appearance","outline","type","info","dismissible","",4,"transloco","translocoRead"],["mskAlertTitle",""],["formControlName","accountTypeId","mskSelectSearch","",3,"searchList","searchItems","searchPlaceholder"],["matInput","","formControlName","createDate",3,"matDatepicker"],["matIconSuffix","",3,"for"],["matInput","","formControlName","initCredit","mskCurrencyMask","","autocomplete","off"],["matTextSuffix","","mskCurrencySymbol",""]],template:function(i,n){i&1&&_(0,Ei,6,10,"msk-dialog",7)(1,Bi,21,12,"ng-template",null,0,j)(3,Gi,24,20,"ng-template",null,1,j),i&2&&f("translocoRead","accounts.details")},dependencies:[ie,J,ne,dt,lt,rt,st,ct,ut,mt,pt,V,N,ht,Le,ge,_e,he,ve,et,tt,nt,ce,me,Ae,ft,ye,se,at,ot,ze,Pe,je,He,be,de,O,De,vt,Ge,Re,Ze,ti,ei,Ue],encapsulation:2,data:{animation:_t},changeDetection:0})}}return e})();var wt=(()=>{class e{constructor(){this._router=m(Z),this._injector=m(zt),this._matDialog=m(Ie),this._activatedRoute=m(oe)}ngOnInit(){let t=this._activatedRoute.snapshot.url[1].path;this._matDialog.open(ii,{autoFocus:t!=="view",disableClose:t!=="view",data:{action:t,item:this._activatedRoute.snapshot.data.card}}).afterClosed().subscribe(i=>{t==="new"&&i!="cancelled"&&this._injector.get(xt).getAccounts().subscribe(),this._router.navigate([this._activatedRoute.snapshot.url.map(()=>"../").join("")],{relativeTo:this._activatedRoute})})}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275cmp=A({type:e,selectors:[["main-accounts-card"]],decls:0,vars:0,template:function(i,n){},encapsulation:2,changeDetection:0})}}return e})();var qi=Lt({"./i18n/en.json":()=>import("./chunk-V4WTMKZN.js"),"./i18n/fa.json":()=>import("./chunk-HTZE5BF4.js")});var Ui=(e,o)=>{let t=m(F),i=m(Z);return t.getAccountWithBalance(e.paramMap.get("id")??0).pipe(T(n=>{console.error(n);let l=o.url.split("/").slice(0,-1).join("/");return i.navigateByUrl(l),Bt(()=>new Error(n.message))}))},po=[{path:"",component:Je,providers:[ue({scope:"accounts",loader:Te((e,o)=>qi(`./${o}/${e}.json`))})],children:[{path:"",component:xt,resolve:{persons:()=>m(F).getAccounts()},children:[{path:"card/new",component:wt,resolve:{}},{path:"card/view/:id",component:wt,resolve:{card:Ui}}]}]}];export{Je as AccountsComponent,po as routes};
