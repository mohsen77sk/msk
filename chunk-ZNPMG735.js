import{$b as ae,Hc as ce,Ia as re,Ic as de,Na as T,Nc as le,Oc as he,Qc as k,Rc as fe,Sa as se,Wc as $,Zb as ue,_b as A,ac as y,ba as ee,da as p,ea as te,ga as I,ia as F,ja as E,jb as g,lb as oe,pa as ne,pb as P,qa as M,qb as N,ra as L,ya as ie}from"./chunk-UNU5BRXV.js";var we=null;function x(){return we}function Nt(t){we??=t}var De=class{};var W=new I(""),K=(()=>{class t{historyGo(e){throw new Error("")}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275prov=p({token:t,factory:()=>E(ve),providedIn:"platform"})}}return t})(),kt=new I(""),ve=(()=>{class t extends K{constructor(){super(),this._doc=E(W),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return x().getBaseHref(this._doc)}onPopState(e){let n=x().getGlobalEventTarget(this._doc,"window");return n.addEventListener("popstate",e,!1),()=>n.removeEventListener("popstate",e)}onHashChange(e){let n=x().getGlobalEventTarget(this._doc,"window");return n.addEventListener("hashchange",e,!1),()=>n.removeEventListener("hashchange",e)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(e){this._location.pathname=e}pushState(e,n,i){this._history.pushState(e,n,i)}replaceState(e,n,i){this._history.replaceState(e,n,i)}forward(){this._history.forward()}back(){this._history.back()}historyGo(e=0){this._history.go(e)}getState(){return this._history.state}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275prov=p({token:t,factory:()=>new t,providedIn:"platform"})}}return t})();function X(t,r){if(t.length==0)return r;if(r.length==0)return t;let e=0;return t.endsWith("/")&&e++,r.startsWith("/")&&e++,e==2?t+r.substring(1):e==1?t+r:t+"/"+r}function ge(t){let r=t.match(/#|\?|$/),e=r&&r.index||t.length,n=e-(t[e-1]==="/"?1:0);return t.slice(0,n)+t.slice(e)}function m(t){return t&&t[0]!=="?"?"?"+t:t}var O=(()=>{class t{historyGo(e){throw new Error("")}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275prov=p({token:t,factory:()=>E(Ie),providedIn:"root"})}}return t})(),Ae=new I(""),Ie=(()=>{class t extends O{constructor(e,n){super(),this._platformLocation=e,this._removeListenerFns=[],this._baseHref=n??this._platformLocation.getBaseHrefFromDOM()??E(W).location?.origin??""}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}prepareExternalUrl(e){return X(this._baseHref,e)}path(e=!1){let n=this._platformLocation.pathname+m(this._platformLocation.search),i=this._platformLocation.hash;return i&&e?`${n}${i}`:n}pushState(e,n,i,s){let o=this.prepareExternalUrl(i+m(s));this._platformLocation.pushState(e,n,o)}replaceState(e,n,i,s){let o=this.prepareExternalUrl(i+m(s));this._platformLocation.replaceState(e,n,o)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static{this.\u0275fac=function(n){return new(n||t)(F(K),F(Ae,8))}}static{this.\u0275prov=p({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})(),$t=(()=>{class t extends O{constructor(e,n){super(),this._platformLocation=e,this._baseHref="",this._removeListenerFns=[],n!=null&&(this._baseHref=n)}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}path(e=!1){let n=this._platformLocation.hash??"#";return n.length>0?n.substring(1):n}prepareExternalUrl(e){let n=X(this._baseHref,e);return n.length>0?"#"+n:n}pushState(e,n,i,s){let o=this.prepareExternalUrl(i+m(s));o.length==0&&(o=this._platformLocation.pathname),this._platformLocation.pushState(e,n,o)}replaceState(e,n,i,s){let o=this.prepareExternalUrl(i+m(s));o.length==0&&(o=this._platformLocation.pathname),this._platformLocation.replaceState(e,n,o)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static{this.\u0275fac=function(n){return new(n||t)(F(K),F(Ae,8))}}static{this.\u0275prov=p({token:t,factory:t.\u0275fac})}}return t})(),Me=(()=>{class t{constructor(e){this._subject=new re,this._urlChangeListeners=[],this._urlChangeSubscription=null,this._locationStrategy=e;let n=this._locationStrategy.getBaseHref();this._basePath=Oe(ge(pe(n))),this._locationStrategy.onPopState(i=>{this._subject.emit({url:this.path(!0),pop:!0,state:i.state,type:i.type})})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(e=!1){return this.normalize(this._locationStrategy.path(e))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(e,n=""){return this.path()==this.normalize(e+m(n))}normalize(e){return t.stripTrailingSlash(Be(this._basePath,pe(e)))}prepareExternalUrl(e){return e&&e[0]!=="/"&&(e="/"+e),this._locationStrategy.prepareExternalUrl(e)}go(e,n="",i=null){this._locationStrategy.pushState(i,"",e,n),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+m(n)),i)}replaceState(e,n="",i=null){this._locationStrategy.replaceState(i,"",e,n),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+m(n)),i)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(e=0){this._locationStrategy.historyGo?.(e)}onUrlChange(e){return this._urlChangeListeners.push(e),this._urlChangeSubscription??=this.subscribe(n=>{this._notifyUrlChangeListeners(n.url,n.state)}),()=>{let n=this._urlChangeListeners.indexOf(e);this._urlChangeListeners.splice(n,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(e="",n){this._urlChangeListeners.forEach(i=>i(e,n))}subscribe(e,n,i){return this._subject.subscribe({next:e,error:n,complete:i})}static{this.normalizeQueryParams=m}static{this.joinWithSlash=X}static{this.stripTrailingSlash=ge}static{this.\u0275fac=function(n){return new(n||t)(F(O))}}static{this.\u0275prov=p({token:t,factory:()=>Le(),providedIn:"root"})}}return t})();function Le(){return new Me(F(O))}function Be(t,r){if(!t||!r.startsWith(t))return r;let e=r.substring(t.length);return e===""||["/",";","?","#"].includes(e[0])?e:r}function pe(t){return t.replace(/\/index.html$/,"")}function Oe(t){if(new RegExp("^(https?:)?//").test(t)){let[,e]=t.split(/\/\/[^\/]+/);return e}return t}var Se={ADP:[void 0,void 0,0],AFN:[void 0,"\u060B",0],ALL:[void 0,void 0,0],AMD:[void 0,"\u058F",2],AOA:[void 0,"Kz"],ARS:[void 0,"$"],AUD:["A$","$"],AZN:[void 0,"\u20BC"],BAM:[void 0,"KM"],BBD:[void 0,"$"],BDT:[void 0,"\u09F3"],BHD:[void 0,void 0,3],BIF:[void 0,void 0,0],BMD:[void 0,"$"],BND:[void 0,"$"],BOB:[void 0,"Bs"],BRL:["R$"],BSD:[void 0,"$"],BWP:[void 0,"P"],BYN:[void 0,void 0,2],BYR:[void 0,void 0,0],BZD:[void 0,"$"],CAD:["CA$","$",2],CHF:[void 0,void 0,2],CLF:[void 0,void 0,4],CLP:[void 0,"$",0],CNY:["CN\xA5","\xA5"],COP:[void 0,"$",2],CRC:[void 0,"\u20A1",2],CUC:[void 0,"$"],CUP:[void 0,"$"],CZK:[void 0,"K\u010D",2],DJF:[void 0,void 0,0],DKK:[void 0,"kr",2],DOP:[void 0,"$"],EGP:[void 0,"E\xA3"],ESP:[void 0,"\u20A7",0],EUR:["\u20AC"],FJD:[void 0,"$"],FKP:[void 0,"\xA3"],GBP:["\xA3"],GEL:[void 0,"\u20BE"],GHS:[void 0,"GH\u20B5"],GIP:[void 0,"\xA3"],GNF:[void 0,"FG",0],GTQ:[void 0,"Q"],GYD:[void 0,"$",2],HKD:["HK$","$"],HNL:[void 0,"L"],HRK:[void 0,"kn"],HUF:[void 0,"Ft",2],IDR:[void 0,"Rp",2],ILS:["\u20AA"],INR:["\u20B9"],IQD:[void 0,void 0,0],IRR:[void 0,void 0,0],ISK:[void 0,"kr",0],ITL:[void 0,void 0,0],JMD:[void 0,"$"],JOD:[void 0,void 0,3],JPY:["\xA5",void 0,0],KHR:[void 0,"\u17DB"],KMF:[void 0,"CF",0],KPW:[void 0,"\u20A9",0],KRW:["\u20A9",void 0,0],KWD:[void 0,void 0,3],KYD:[void 0,"$"],KZT:[void 0,"\u20B8"],LAK:[void 0,"\u20AD",0],LBP:[void 0,"L\xA3",0],LKR:[void 0,"Rs"],LRD:[void 0,"$"],LTL:[void 0,"Lt"],LUF:[void 0,void 0,0],LVL:[void 0,"Ls"],LYD:[void 0,void 0,3],MGA:[void 0,"Ar",0],MGF:[void 0,void 0,0],MMK:[void 0,"K",0],MNT:[void 0,"\u20AE",2],MRO:[void 0,void 0,0],MUR:[void 0,"Rs",2],MXN:["MX$","$"],MYR:[void 0,"RM"],NAD:[void 0,"$"],NGN:[void 0,"\u20A6"],NIO:[void 0,"C$"],NOK:[void 0,"kr",2],NPR:[void 0,"Rs"],NZD:["NZ$","$"],OMR:[void 0,void 0,3],PHP:["\u20B1"],PKR:[void 0,"Rs",2],PLN:[void 0,"z\u0142"],PYG:[void 0,"\u20B2",0],RON:[void 0,"lei"],RSD:[void 0,void 0,0],RUB:[void 0,"\u20BD"],RWF:[void 0,"RF",0],SBD:[void 0,"$"],SEK:[void 0,"kr",2],SGD:[void 0,"$"],SHP:[void 0,"\xA3"],SLE:[void 0,void 0,2],SLL:[void 0,void 0,0],SOS:[void 0,void 0,0],SRD:[void 0,"$"],SSP:[void 0,"\xA3"],STD:[void 0,void 0,0],STN:[void 0,"Db"],SYP:[void 0,"\xA3",0],THB:[void 0,"\u0E3F"],TMM:[void 0,void 0,0],TND:[void 0,void 0,3],TOP:[void 0,"T$"],TRL:[void 0,void 0,0],TRY:[void 0,"\u20BA"],TTD:[void 0,"$"],TWD:["NT$","$",2],TZS:[void 0,void 0,2],UAH:[void 0,"\u20B4"],UGX:[void 0,void 0,0],USD:["$"],UYI:[void 0,void 0,0],UYU:[void 0,"$"],UYW:[void 0,void 0,4],UZS:[void 0,void 0,2],VEF:[void 0,"Bs",2],VND:["\u20AB",void 0,0],VUV:[void 0,void 0,0],XAF:["FCFA",void 0,0],XCD:["EC$","$"],XOF:["F\u202FCFA",void 0,0],XPF:["CFPF",void 0,0],XXX:["\xA4"],YER:[void 0,void 0,0],ZAR:[void 0,"R"],ZMK:[void 0,void 0,0],ZMW:[void 0,"ZK"],ZWD:[void 0,void 0,0]},be=function(t){return t[t.Decimal=0]="Decimal",t[t.Percent=1]="Percent",t[t.Currency=2]="Currency",t[t.Scientific=3]="Scientific",t}(be||{});var C={Decimal:0,Group:1,List:2,PercentSign:3,PlusSign:4,MinusSign:5,Exponential:6,SuperscriptingExponent:7,PerMille:8,Infinity:9,NaN:10,TimeSeparator:11,CurrencyDecimal:12,CurrencyGroup:13};function S(t,r){let e=A(t),n=e[y.NumberSymbols][r];if(typeof n>"u"){if(r===C.CurrencyDecimal)return e[y.NumberSymbols][C.Decimal];if(r===C.CurrencyGroup)return e[y.NumberSymbols][C.Group]}return n}function Re(t,r){return A(t)[y.NumberFormats][r]}function xt(t){return ae(t)}function Te(t){return A(t)[y.Currencies]}function Ut(t){return A(t)[y.Directionality]}function Pe(t,r,e="en"){let n=Te(e)[t]||Se[t]||[],i=n[1];return r==="narrow"&&typeof i=="string"?i:n[0]||t}var Ne=2;function ke(t){let r,e=Se[t];return e&&(r=e[2]),typeof r=="number"?r:Ne}var $e=/^(\d+)?\.((\d+)(-(\d+))?)?$/,me=22,B=".",b="0",xe=";",Ue=",",U="#",Ce="\xA4";function ze(t,r,e,n,i,s,o=!1){let u="",h=!1;if(!isFinite(t))u=S(e,C.Infinity);else{let d=He(t);o&&(d=Ge(d));let l=r.minInt,a=r.minFrac,f=r.maxFrac;if(s){let w=s.match($e);if(w===null)throw new Error(`${s} is not a valid digit info`);let J=w[1],R=w[3],Q=w[5];J!=null&&(l=z(J)),R!=null&&(a=z(R)),Q!=null?f=z(Q):R!=null&&a>f&&(f=a)}Ye(d,a,f);let c=d.digits,D=d.integerLen,q=d.exponent,_=[];for(h=c.every(w=>!w);D<l;D++)c.unshift(0);for(;D<0;D++)c.unshift(0);D>0?_=c.splice(D,c.length):(_=c,c=[0]);let v=[];for(c.length>=r.lgSize&&v.unshift(c.splice(-r.lgSize,c.length).join(""));c.length>r.gSize;)v.unshift(c.splice(-r.gSize,c.length).join(""));c.length&&v.unshift(c.join("")),u=v.join(S(e,n)),_.length&&(u+=S(e,i)+_.join("")),q&&(u+=S(e,C.Exponential)+"+"+q)}return t<0&&!h?u=r.negPre+u+r.negSuf:u=r.posPre+u+r.posSuf,u}function Ve(t,r,e,n,i){let s=Re(r,be.Currency),o=je(s,S(r,C.MinusSign));return o.minFrac=ke(n),o.maxFrac=o.minFrac,ze(t,o,r,C.CurrencyGroup,C.CurrencyDecimal,i).replace(Ce,e).replace(Ce,"").trim()}function je(t,r="-"){let e={minInt:1,minFrac:0,maxFrac:0,posPre:"",posSuf:"",negPre:"",negSuf:"",gSize:0,lgSize:0},n=t.split(xe),i=n[0],s=n[1],o=i.indexOf(B)!==-1?i.split(B):[i.substring(0,i.lastIndexOf(b)+1),i.substring(i.lastIndexOf(b)+1)],u=o[0],h=o[1]||"";e.posPre=u.substring(0,u.indexOf(U));for(let l=0;l<h.length;l++){let a=h.charAt(l);a===b?e.minFrac=e.maxFrac=l+1:a===U?e.maxFrac=l+1:e.posSuf+=a}let d=u.split(Ue);if(e.gSize=d[1]?d[1].length:0,e.lgSize=d[2]||d[1]?(d[2]||d[1]).length:0,s){let l=i.length-e.posPre.length-e.posSuf.length,a=s.indexOf(U);e.negPre=s.substring(0,a).replace(/'/g,""),e.negSuf=s.slice(a+l).replace(/'/g,"")}else e.negPre=r+e.posPre,e.negSuf=e.posSuf;return e}function Ge(t){if(t.digits[0]===0)return t;let r=t.digits.length-t.integerLen;return t.exponent?t.exponent+=2:(r===0?t.digits.push(0,0):r===1&&t.digits.push(0),t.integerLen+=2),t}function He(t){let r=Math.abs(t)+"",e=0,n,i,s,o,u;for((i=r.indexOf(B))>-1&&(r=r.replace(B,"")),(s=r.search(/e/i))>0?(i<0&&(i=s),i+=+r.slice(s+1),r=r.substring(0,s)):i<0&&(i=r.length),s=0;r.charAt(s)===b;s++);if(s===(u=r.length))n=[0],i=1;else{for(u--;r.charAt(u)===b;)u--;for(i-=s,n=[],o=0;s<=u;s++,o++)n[o]=Number(r.charAt(s))}return i>me&&(n=n.splice(0,me-1),e=i-1,i=1),{digits:n,exponent:e,integerLen:i}}function Ye(t,r,e){if(r>e)throw new Error(`The minimum number of digits after fraction (${r}) is higher than the maximum (${e}).`);let n=t.digits,i=n.length-t.integerLen,s=Math.min(Math.max(r,i),e),o=s+t.integerLen,u=n[o];if(o>0){n.splice(Math.max(t.integerLen,o));for(let a=o;a<n.length;a++)n[a]=0}else{i=Math.max(0,i),t.integerLen=1,n.length=Math.max(1,o=s+1),n[0]=0;for(let a=1;a<o;a++)n[a]=0}if(u>=5)if(o-1<0){for(let a=0;a>o;a--)n.unshift(0),t.integerLen++;n.unshift(1),t.integerLen++}else n[o-1]++;for(;i<Math.max(0,s);i++)n.push(0);let h=s!==0,d=r+t.integerLen,l=n.reduceRight(function(a,f,c,D){return f=f+a,D[c]=f<10?f:f-10,h&&(D[c]===0&&c>=d?D.pop():h=!1),f>=10?1:0},0);l&&(n.unshift(l),t.integerLen++)}function z(t){let r=parseInt(t);if(isNaN(r))throw new Error("Invalid integer literal when parsing "+t);return r}function zt(t,r,e){return ue(t,r,e)}function Vt(t,r){r=encodeURIComponent(r);for(let e of t.split(";")){let n=e.indexOf("="),[i,s]=n==-1?[e,""]:[e.slice(0,n),e.slice(n+1)];if(i.trim()===r)return decodeURIComponent(s)}return null}var V=/\s+/,Fe=[],jt=(()=>{class t{constructor(e,n){this._ngEl=e,this._renderer=n,this.initialClasses=Fe,this.stateMap=new Map}set klass(e){this.initialClasses=e!=null?e.trim().split(V):Fe}set ngClass(e){this.rawClass=typeof e=="string"?e.trim().split(V):e}ngDoCheck(){for(let n of this.initialClasses)this._updateState(n,!0);let e=this.rawClass;if(Array.isArray(e)||e instanceof Set)for(let n of e)this._updateState(n,!0);else if(e!=null)for(let n of Object.keys(e))this._updateState(n,!!e[n]);this._applyStateDiff()}_updateState(e,n){let i=this.stateMap.get(e);i!==void 0?(i.enabled!==n&&(i.changed=!0,i.enabled=n),i.touched=!0):this.stateMap.set(e,{enabled:n,changed:!0,touched:!0})}_applyStateDiff(){for(let e of this.stateMap){let n=e[0],i=e[1];i.changed?(this._toggleClass(n,i.enabled),i.changed=!1):i.touched||(i.enabled&&this._toggleClass(n,!1),this.stateMap.delete(n)),i.touched=!1}}_toggleClass(e,n){e=e.trim(),e.length>0&&e.split(V).forEach(i=>{n?this._renderer.addClass(this._ngEl.nativeElement,i):this._renderer.removeClass(this._ngEl.nativeElement,i)})}static{this.\u0275fac=function(n){return new(n||t)(g(T),g(P))}}static{this.\u0275dir=M({type:t,selectors:[["","ngClass",""]],inputs:{klass:[0,"class","klass"],ngClass:"ngClass"},standalone:!0})}}return t})();var j=class{constructor(r,e,n,i){this.$implicit=r,this.ngForOf=e,this.index=n,this.count=i}get first(){return this.index===0}get last(){return this.index===this.count-1}get even(){return this.index%2===0}get odd(){return!this.even}},Gt=(()=>{class t{set ngForOf(e){this._ngForOf=e,this._ngForOfDirty=!0}set ngForTrackBy(e){this._trackByFn=e}get ngForTrackBy(){return this._trackByFn}constructor(e,n,i){this._viewContainer=e,this._template=n,this._differs=i,this._ngForOf=null,this._ngForOfDirty=!0,this._differ=null}set ngForTemplate(e){e&&(this._template=e)}ngDoCheck(){if(this._ngForOfDirty){this._ngForOfDirty=!1;let e=this._ngForOf;if(!this._differ&&e)if(0)try{}catch{}else this._differ=this._differs.find(e).create(this.ngForTrackBy)}if(this._differ){let e=this._differ.diff(this._ngForOf);e&&this._applyChanges(e)}}_applyChanges(e){let n=this._viewContainer;e.forEachOperation((i,s,o)=>{if(i.previousIndex==null)n.createEmbeddedView(this._template,new j(i.item,this._ngForOf,-1,-1),o===null?void 0:o);else if(o==null)n.remove(s===null?void 0:s);else if(s!==null){let u=n.get(s);n.move(u,o),Ee(u,i)}});for(let i=0,s=n.length;i<s;i++){let u=n.get(i).context;u.index=i,u.count=s,u.ngForOf=this._ngForOf}e.forEachIdentityChange(i=>{let s=n.get(i.currentIndex);Ee(s,i)})}static ngTemplateContextGuard(e,n){return!0}static{this.\u0275fac=function(n){return new(n||t)(g(N),g(oe),g(fe))}}static{this.\u0275dir=M({type:t,selectors:[["","ngFor","","ngForOf",""]],inputs:{ngForOf:"ngForOf",ngForTrackBy:"ngForTrackBy",ngForTemplate:"ngForTemplate"},standalone:!0})}}return t})();function Ee(t,r){t.context.$implicit=r.item}var Ht=(()=>{class t{constructor(e){this._viewContainerRef=e,this._viewRef=null,this.ngTemplateOutletContext=null,this.ngTemplateOutlet=null,this.ngTemplateOutletInjector=null}ngOnChanges(e){if(this._shouldRecreateView(e)){let n=this._viewContainerRef;if(this._viewRef&&n.remove(n.indexOf(this._viewRef)),!this.ngTemplateOutlet){this._viewRef=null;return}let i=this._createContextForwardProxy();this._viewRef=n.createEmbeddedView(this.ngTemplateOutlet,i,{injector:this.ngTemplateOutletInjector??void 0})}}_shouldRecreateView(e){return!!e.ngTemplateOutlet||!!e.ngTemplateOutletInjector}_createContextForwardProxy(){return new Proxy({},{set:(e,n,i)=>this.ngTemplateOutletContext?Reflect.set(this.ngTemplateOutletContext,n,i):!1,get:(e,n,i)=>{if(this.ngTemplateOutletContext)return Reflect.get(this.ngTemplateOutletContext,n,i)}})}static{this.\u0275fac=function(n){return new(n||t)(g(N))}}static{this.\u0275dir=M({type:t,selectors:[["","ngTemplateOutlet",""]],inputs:{ngTemplateOutletContext:"ngTemplateOutletContext",ngTemplateOutlet:"ngTemplateOutlet",ngTemplateOutletInjector:"ngTemplateOutletInjector"},standalone:!0,features:[ie]})}}return t})();function _e(t,r){return new ee(2100,!1)}var G=class{createSubscription(r,e){return $(()=>r.subscribe({next:e,error:n=>{throw n}}))}dispose(r){$(()=>r.unsubscribe())}},H=class{createSubscription(r,e){return r.then(e,n=>{throw n})}dispose(r){}},Ze=new H,We=new G,Yt=(()=>{class t{constructor(e){this._latestValue=null,this.markForCheckOnValueUpdate=!0,this._subscription=null,this._obj=null,this._strategy=null,this._ref=e}ngOnDestroy(){this._subscription&&this._dispose(),this._ref=null}transform(e){if(!this._obj){if(e)try{this.markForCheckOnValueUpdate=!1,this._subscribe(e)}finally{this.markForCheckOnValueUpdate=!0}return this._latestValue}return e!==this._obj?(this._dispose(),this.transform(e)):this._latestValue}_subscribe(e){this._obj=e,this._strategy=this._selectStrategy(e),this._subscription=this._strategy.createSubscription(e,n=>this._updateLatestValue(e,n))}_selectStrategy(e){if(ce(e))return Ze;if(de(e))return We;throw _e(t,e)}_dispose(){this._strategy.dispose(this._subscription),this._latestValue=null,this._subscription=null,this._obj=null}_updateLatestValue(e,n){e===this._obj&&(this._latestValue=n,this.markForCheckOnValueUpdate&&this._ref?.markForCheck())}static{this.\u0275fac=function(n){return new(n||t)(g(k,16))}}static{this.\u0275pipe=L({name:"async",type:t,pure:!1,standalone:!0})}}return t})();var Zt=(()=>{class t{transform(e){return JSON.stringify(e,null,2)}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275pipe=L({name:"json",type:t,pure:!1,standalone:!0})}}return t})();var Wt=(()=>{class t{constructor(e,n="USD"){this._locale=e,this._defaultCurrencyCode=n}transform(e,n=this._defaultCurrencyCode,i="symbol",s,o){if(!Ke(e))return null;o||=this._locale,typeof i=="boolean"&&(i=i?"symbol":"code");let u=n||this._defaultCurrencyCode;i!=="code"&&(i==="symbol"||i==="symbol-narrow"?u=Pe(u,i==="symbol"?"wide":"narrow",o):u=i);try{let h=Xe(e);return Ve(h,o,u,n,s)}catch(h){throw _e(t,h.message)}}static{this.\u0275fac=function(n){return new(n||t)(g(le,16),g(he,16))}}static{this.\u0275pipe=L({name:"currency",type:t,pure:!0,standalone:!0})}}return t})();function Ke(t){return!(t==null||t===""||t!==t)}function Xe(t){if(typeof t=="string"&&!isNaN(Number(t)-parseFloat(t)))return Number(t);if(typeof t!="number")throw new Error(`${t} is not a number`);return t}var Kt=(()=>{class t{static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275mod=ne({type:t})}static{this.\u0275inj=te({})}}return t})(),qe="browser",Je="server";function Qe(t){return t===qe}function Xt(t){return t===Je}var qt=(()=>{class t{static{this.\u0275prov=p({token:t,providedIn:"root",factory:()=>Qe(E(se))?new Y(E(W),window):new Z})}}return t})(),Y=class{constructor(r,e){this.document=r,this.window=e,this.offset=()=>[0,0]}setOffset(r){Array.isArray(r)?this.offset=()=>r:this.offset=r}getScrollPosition(){return[this.window.scrollX,this.window.scrollY]}scrollToPosition(r){this.window.scrollTo(r[0],r[1])}scrollToAnchor(r){let e=et(this.document,r);e&&(this.scrollToElement(e),e.focus())}setHistoryScrollRestoration(r){this.window.history.scrollRestoration=r}scrollToElement(r){let e=r.getBoundingClientRect(),n=e.left+this.window.pageXOffset,i=e.top+this.window.pageYOffset,s=this.offset();this.window.scrollTo(n-s[0],i-s[1])}};function et(t,r){let e=t.getElementById(r)||t.getElementsByName(r)[0];if(e)return e;if(typeof t.createTreeWalker=="function"&&t.body&&typeof t.body.attachShadow=="function"){let n=t.createTreeWalker(t.body,NodeFilter.SHOW_ELEMENT),i=n.currentNode;for(;i;){let s=i.shadowRoot;if(s){let o=s.getElementById(r)||s.querySelector(`[name="${r}"]`);if(o)return o}i=n.nextNode()}}return null}var Z=class{setOffset(r){}getScrollPosition(){return[0,0]}scrollToPosition(r){}scrollToAnchor(r){}setHistoryScrollRestoration(r){}},ye=class{};export{x as a,Nt as b,De as c,W as d,kt as e,O as f,Ie as g,$t as h,Me as i,xt as j,Ut as k,zt as l,Vt as m,jt as n,Gt as o,Ht as p,Yt as q,Zt as r,Wt as s,Kt as t,qe as u,Qe as v,Xt as w,qt as x,ye as y};
