// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.4.22
// @description  Enhanced timestamp tool for YouTube videos
// @author       Silent Shout
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @noframes
// @icon         https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @homepageURL  https://github.com/KamoTimestamps/timekeeper
// @supportURL   https://github.com/KamoTimestamps/timekeeper/issues
// @downloadURL  https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @updateURL    https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @license MIT
// ==/UserScript==

"use strict";(()=>{var Ga=Object.create;var Yi=Object.defineProperty;var ja=Object.getOwnPropertyDescriptor;var qa=Object.getOwnPropertyNames;var Wa=Object.getPrototypeOf,Va=Object.prototype.hasOwnProperty;var Ki=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var Ya=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of qa(t))!Va.call(e,r)&&r!==n&&Yi(e,r,{get:()=>t[r],enumerable:!(i=ja(t,r))||i.enumerable});return e};var Ji=(e,t,n)=>(n=e!=null?Ga(Wa(e)):{},Ya(t||!e||!e.__esModule?Yi(n,"default",{value:e,enumerable:!0}):n,e));var Zi=Ki((Ro,Uo)=>{(function(e,t){typeof Ro=="object"&&typeof Uo<"u"?Uo.exports=t():typeof define=="function"&&define.amd?define(t):(e=typeof globalThis<"u"?globalThis:e||self).dayjs=t()})(Ro,(function(){"use strict";var e=1e3,t=6e4,n=36e5,i="millisecond",r="second",o="minute",l="hour",a="day",g="week",c="month",v="quarter",m="year",E="date",w="Invalid Date",B=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,N=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,G={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(I){var D=["th","st","nd","rd"],M=I%100;return"["+I+(D[(M-20)%10]||D[M]||D[0])+"]"}},P=function(I,D,M){var $=String(I);return!$||$.length>=D?I:""+Array(D+1-$.length).join(M)+I},H={s:P,z:function(I){var D=-I.utcOffset(),M=Math.abs(D),$=Math.floor(M/60),L=M%60;return(D<=0?"+":"-")+P($,2,"0")+":"+P(L,2,"0")},m:function I(D,M){if(D.date()<M.date())return-I(M,D);var $=12*(M.year()-D.year())+(M.month()-D.month()),L=D.clone().add($,c),z=M-L<0,U=D.clone().add($+(z?-1:1),c);return+(-($+(M-L)/(z?L-U:U-L))||0)},a:function(I){return I<0?Math.ceil(I)||0:Math.floor(I)},p:function(I){return{M:c,y:m,w:g,d:a,D:E,h:l,m:o,s:r,ms:i,Q:v}[I]||String(I||"").toLowerCase().replace(/s$/,"")},u:function(I){return I===void 0}},ee="en",Y={};Y[ee]=G;var ue="$isDayjsObject",me=function(I){return I instanceof de||!(!I||!I[ue])},ne=function I(D,M,$){var L;if(!D)return ee;if(typeof D=="string"){var z=D.toLowerCase();Y[z]&&(L=z),M&&(Y[z]=M,L=z);var U=D.split("-");if(!L&&U.length>1)return I(U[0])}else{var te=D.name;Y[te]=D,L=te}return!$&&L&&(ee=L),L||!$&&ee},R=function(I,D){if(me(I))return I.clone();var M=typeof D=="object"?D:{};return M.date=I,M.args=arguments,new de(M)},C=H;C.l=ne,C.i=me,C.w=function(I,D){return R(I,{locale:D.$L,utc:D.$u,x:D.$x,$offset:D.$offset})};var de=(function(){function I(M){this.$L=ne(M.locale,null,!0),this.parse(M),this.$x=this.$x||M.x||{},this[ue]=!0}var D=I.prototype;return D.parse=function(M){this.$d=(function($){var L=$.date,z=$.utc;if(L===null)return new Date(NaN);if(C.u(L))return new Date;if(L instanceof Date)return new Date(L);if(typeof L=="string"&&!/Z$/i.test(L)){var U=L.match(B);if(U){var te=U[2]-1||0,pe=(U[7]||"0").substring(0,3);return z?new Date(Date.UTC(U[1],te,U[3]||1,U[4]||0,U[5]||0,U[6]||0,pe)):new Date(U[1],te,U[3]||1,U[4]||0,U[5]||0,U[6]||0,pe)}}return new Date(L)})(M),this.init()},D.init=function(){var M=this.$d;this.$y=M.getFullYear(),this.$M=M.getMonth(),this.$D=M.getDate(),this.$W=M.getDay(),this.$H=M.getHours(),this.$m=M.getMinutes(),this.$s=M.getSeconds(),this.$ms=M.getMilliseconds()},D.$utils=function(){return C},D.isValid=function(){return this.$d.toString()!==w},D.isSame=function(M,$){var L=R(M);return this.startOf($)<=L&&L<=this.endOf($)},D.isAfter=function(M,$){return R(M)<this.startOf($)},D.isBefore=function(M,$){return this.endOf($)<R(M)},D.$g=function(M,$,L){return C.u(M)?this[$]:this.set(L,M)},D.unix=function(){return Math.floor(this.valueOf()/1e3)},D.valueOf=function(){return this.$d.getTime()},D.startOf=function(M,$){var L=this,z=!!C.u($)||$,U=C.p(M),te=function(Ye,ke){var Ke=C.w(L.$u?Date.UTC(L.$y,ke,Ye):new Date(L.$y,ke,Ye),L);return z?Ke:Ke.endOf(a)},pe=function(Ye,ke){return C.w(L.toDate()[Ye].apply(L.toDate("s"),(z?[0,0,0,0]:[23,59,59,999]).slice(ke)),L)},re=this.$W,ce=this.$M,he=this.$D,X="set"+(this.$u?"UTC":"");switch(U){case m:return z?te(1,0):te(31,11);case c:return z?te(1,ce):te(0,ce+1);case g:var fe=this.$locale().weekStart||0,Fe=(re<fe?re+7:re)-fe;return te(z?he-Fe:he+(6-Fe),ce);case a:case E:return pe(X+"Hours",0);case l:return pe(X+"Minutes",1);case o:return pe(X+"Seconds",2);case r:return pe(X+"Milliseconds",3);default:return this.clone()}},D.endOf=function(M){return this.startOf(M,!1)},D.$set=function(M,$){var L,z=C.p(M),U="set"+(this.$u?"UTC":""),te=(L={},L[a]=U+"Date",L[E]=U+"Date",L[c]=U+"Month",L[m]=U+"FullYear",L[l]=U+"Hours",L[o]=U+"Minutes",L[r]=U+"Seconds",L[i]=U+"Milliseconds",L)[z],pe=z===a?this.$D+($-this.$W):$;if(z===c||z===m){var re=this.clone().set(E,1);re.$d[te](pe),re.init(),this.$d=re.set(E,Math.min(this.$D,re.daysInMonth())).$d}else te&&this.$d[te](pe);return this.init(),this},D.set=function(M,$){return this.clone().$set(M,$)},D.get=function(M){return this[C.p(M)]()},D.add=function(M,$){var L,z=this;M=Number(M);var U=C.p($),te=function(ce){var he=R(z);return C.w(he.date(he.date()+Math.round(ce*M)),z)};if(U===c)return this.set(c,this.$M+M);if(U===m)return this.set(m,this.$y+M);if(U===a)return te(1);if(U===g)return te(7);var pe=(L={},L[o]=t,L[l]=n,L[r]=e,L)[U]||1,re=this.$d.getTime()+M*pe;return C.w(re,this)},D.subtract=function(M,$){return this.add(-1*M,$)},D.format=function(M){var $=this,L=this.$locale();if(!this.isValid())return L.invalidDate||w;var z=M||"YYYY-MM-DDTHH:mm:ssZ",U=C.z(this),te=this.$H,pe=this.$m,re=this.$M,ce=L.weekdays,he=L.months,X=L.meridiem,fe=function(ke,Ke,nt,ct){return ke&&(ke[Ke]||ke($,z))||nt[Ke].slice(0,ct)},Fe=function(ke){return C.s(te%12||12,ke,"0")},Ye=X||function(ke,Ke,nt){var ct=ke<12?"AM":"PM";return nt?ct.toLowerCase():ct};return z.replace(N,(function(ke,Ke){return Ke||(function(nt){switch(nt){case"YY":return String($.$y).slice(-2);case"YYYY":return C.s($.$y,4,"0");case"M":return re+1;case"MM":return C.s(re+1,2,"0");case"MMM":return fe(L.monthsShort,re,he,3);case"MMMM":return fe(he,re);case"D":return $.$D;case"DD":return C.s($.$D,2,"0");case"d":return String($.$W);case"dd":return fe(L.weekdaysMin,$.$W,ce,2);case"ddd":return fe(L.weekdaysShort,$.$W,ce,3);case"dddd":return ce[$.$W];case"H":return String(te);case"HH":return C.s(te,2,"0");case"h":return Fe(1);case"hh":return Fe(2);case"a":return Ye(te,pe,!0);case"A":return Ye(te,pe,!1);case"m":return String(pe);case"mm":return C.s(pe,2,"0");case"s":return String($.$s);case"ss":return C.s($.$s,2,"0");case"SSS":return C.s($.$ms,3,"0");case"Z":return U}return null})(ke)||U.replace(":","")}))},D.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},D.diff=function(M,$,L){var z,U=this,te=C.p($),pe=R(M),re=(pe.utcOffset()-this.utcOffset())*t,ce=this-pe,he=function(){return C.m(U,pe)};switch(te){case m:z=he()/12;break;case c:z=he();break;case v:z=he()/3;break;case g:z=(ce-re)/6048e5;break;case a:z=(ce-re)/864e5;break;case l:z=ce/n;break;case o:z=ce/t;break;case r:z=ce/e;break;default:z=ce}return L?z:C.a(z)},D.daysInMonth=function(){return this.endOf(c).$D},D.$locale=function(){return Y[this.$L]},D.locale=function(M,$){if(!M)return this.$L;var L=this.clone(),z=ne(M,$,!0);return z&&(L.$L=z),L},D.clone=function(){return C.w(this.$d,this)},D.toDate=function(){return new Date(this.valueOf())},D.toJSON=function(){return this.isValid()?this.toISOString():null},D.toISOString=function(){return this.$d.toISOString()},D.toString=function(){return this.$d.toUTCString()},I})(),oe=de.prototype;return R.prototype=oe,[["$ms",i],["$s",r],["$m",o],["$H",l],["$W",a],["$M",c],["$y",m],["$D",E]].forEach((function(I){oe[I[1]]=function(D){return this.$g(D,I[0],I[1])}})),R.extend=function(I,D){return I.$i||(I(D,de,R),I.$i=!0),R},R.locale=ne,R.isDayjs=me,R.unix=function(I){return R(1e3*I)},R.en=Y[ee],R.Ls=Y,R.p={},R}))});var Xi=Ki((Go,jo)=>{(function(e,t){typeof Go=="object"&&typeof jo<"u"?jo.exports=t():typeof define=="function"&&define.amd?define(t):(e=typeof globalThis<"u"?globalThis:e||self).dayjs_plugin_utc=t()})(Go,(function(){"use strict";var e="minute",t=/[+-]\d\d(?::?\d\d)?/g,n=/([+-]|\d\d)/g;return function(i,r,o){var l=r.prototype;o.utc=function(w){var B={date:w,utc:!0,args:arguments};return new r(B)},l.utc=function(w){var B=o(this.toDate(),{locale:this.$L,utc:!0});return w?B.add(this.utcOffset(),e):B},l.local=function(){return o(this.toDate(),{locale:this.$L,utc:!1})};var a=l.parse;l.parse=function(w){w.utc&&(this.$u=!0),this.$utils().u(w.$offset)||(this.$offset=w.$offset),a.call(this,w)};var g=l.init;l.init=function(){if(this.$u){var w=this.$d;this.$y=w.getUTCFullYear(),this.$M=w.getUTCMonth(),this.$D=w.getUTCDate(),this.$W=w.getUTCDay(),this.$H=w.getUTCHours(),this.$m=w.getUTCMinutes(),this.$s=w.getUTCSeconds(),this.$ms=w.getUTCMilliseconds()}else g.call(this)};var c=l.utcOffset;l.utcOffset=function(w,B){var N=this.$utils().u;if(N(w))return this.$u?0:N(this.$offset)?c.call(this):this.$offset;if(typeof w=="string"&&(w=(function(ee){ee===void 0&&(ee="");var Y=ee.match(t);if(!Y)return null;var ue=(""+Y[0]).match(n)||["-",0,0],me=ue[0],ne=60*+ue[1]+ +ue[2];return ne===0?0:me==="+"?ne:-ne})(w),w===null))return this;var G=Math.abs(w)<=16?60*w:w;if(G===0)return this.utc(B);var P=this.clone();if(B)return P.$offset=G,P.$u=!1,P;var H=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();return(P=this.local().add(G+H,e)).$offset=G,P.$x.$localOffset=H,P};var v=l.format;l.format=function(w){var B=w||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return v.call(this,B)},l.valueOf=function(){var w=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||this.$d.getTimezoneOffset());return this.$d.valueOf()-6e4*w},l.isUTC=function(){return!!this.$u},l.toISOString=function(){return this.toDate().toISOString()},l.toString=function(){return this.toDate().toUTCString()};var m=l.toDate;l.toDate=function(w){return w==="s"&&this.$offset?o(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():m.call(this)};var E=l.diff;l.diff=function(w,B,N){if(w&&this.$u===w.$u)return E.call(this,w,B,N);var G=this.local(),P=o(w).local();return E.call(G,P,B,N)}}}))});var oo=Ji(Zi()),Qi=Ji(Xi());oo.default.extend(Qi.default);function f(e,...t){let n="debug",i=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=i.pop());let o=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${o} ${e}`,...i)}function kt(e,t=e){let n=Math.max(0,Math.floor(e)*1e3),i=t<3600?"mm:ss":t>=36e3?"HH:mm:ss":"H:mm:ss";return oo.default.utc(n).format(i)}function qo(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Jt(){return(0,oo.default)().utc().format("YYYY-MM-DD--HH-mm-ss")}var Ka=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function er(){let e=new Date,t=e.getFullYear(),n=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let i of Ka){let r=new Date(t,i.month-1,i.day),o=r.getTime()-e.getTime(),l=o/(1e3*60*60*24);if(l<=5&&l>=-2)return f(`Current date: ${n}, Selected emoji: ${i.emoji} (${i.name}), Days until holiday: ${Math.ceil(l)}`),i.emoji;if(l<-2&&(r=new Date(t+1,i.month-1,i.day),o=r.getTime()-e.getTime(),l=o/(1e3*60*60*24),l<=5&&l>=-2))return f(`Current date: ${n}, Selected emoji: ${i.emoji} (${i.name}), Days until holiday: ${Math.ceil(l)}`),i.emoji;if(l>5&&(r=new Date(t-1,i.month-1,i.day),o=r.getTime()-e.getTime(),l=o/(1e3*60*60*24),l<=5&&l>=-2))return f(`Current date: ${n}, Selected emoji: ${i.emoji} (${i.name}), Days until holiday: ${Math.ceil(l)}`),i.emoji}return f(`Current date: ${n}, No holiday emoji (not within range)`),null}var Xe=null,Zt=null,Ja=250,Ft=null,xn=!1,Et=null;function Za(){return(!Xe||!document.body.contains(Xe))&&(Xe=document.createElement("div"),Xe.className="ytls-tooltip",Xe.style.pointerEvents="none",document.body.appendChild(Xe),window.addEventListener("scroll",tr,!0),window.addEventListener("resize",tr,!0)),Xe}function Xa(e,t,n){let r=window.innerWidth,o=window.innerHeight,l=e.getBoundingClientRect(),a=l.width,g=l.height,c=t+10,v=n+10;c+a>r-10&&(c=t-a-10),v+g>o-10&&(v=n-g-10),c=Math.max(10,Math.min(c,r-a-10)),v=Math.max(10,Math.min(v,o-g-10)),e.style.left=`${c}px`,e.style.top=`${v}px`}function nr(e,t){let i=window.innerWidth,r=window.innerHeight,o=t.getBoundingClientRect(),l=e.getBoundingClientRect(),a=l.width,g=l.height,c=Math.round(o.right+8),v=Math.round(o.top);c+a>i-8&&(c=Math.round(o.left-a-8)),c=Math.max(8,Math.min(c,i-a-8)),v+g>r-8&&(v=Math.round(o.bottom-g)),v=Math.max(8,Math.min(v,r-g-8)),e.style.left=`${c}px`,e.style.top=`${v}px`}function tr(){if(!(!Xe||!Ft)&&Xe.classList.contains("ytls-tooltip-visible"))try{nr(Xe,Ft)}catch{}}function Qa(e=50){Et&&(clearTimeout(Et),Et=null),!xn&&(Et=setTimeout(()=>{Wo(),Et=null},e))}function es(e,t,n,i){Zt&&clearTimeout(Zt),i&&(Ft=i,xn=!0),Zt=setTimeout(()=>{let r=Za();r.textContent=e,r.classList.remove("ytls-tooltip-visible"),i?requestAnimationFrame(()=>{nr(r,i),requestAnimationFrame(()=>{r.classList.add("ytls-tooltip-visible")})}):(Xa(r,t,n),requestAnimationFrame(()=>{r.classList.add("ytls-tooltip-visible")}))},Ja)}function Wo(){Zt&&(clearTimeout(Zt),Zt=null),Et&&(clearTimeout(Et),Et=null),Xe&&Xe.classList.remove("ytls-tooltip-visible"),Ft=null,xn=!1}function Qe(e,t){let n=0,i=0,r=g=>{n=g.clientX,i=g.clientY,xn=!0,Ft=e;let c=typeof t=="function"?t():t;c&&es(c,n,i,e)},o=g=>{n=g.clientX,i=g.clientY},l=()=>{xn=!1,Qa()};e.addEventListener("mouseenter",r),e.addEventListener("mousemove",o),e.addEventListener("mouseleave",l);let a=new MutationObserver(()=>{try{if(!document.body.contains(e))Ft===e&&Wo();else{let g=window.getComputedStyle(e);(g.display==="none"||g.visibility==="hidden"||g.opacity==="0")&&Ft===e&&Wo()}}catch{}});try{a.observe(e,{attributes:!0,attributeFilter:["class","style"]}),a.observe(document.body,{childList:!0,subtree:!0})}catch{}e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",r),e.removeEventListener("mousemove",o),e.removeEventListener("mouseleave",l);try{a.disconnect()}catch{}delete e.__tooltipObserver},e.__tooltipObserver=a}var so,ve,sr,ts,Ot,or,lr,ur,cr,Jo,Vo,Yo,ns,kn={},dr=[],os=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,lo=Array.isArray;function pt(e,t){for(var n in t)e[n]=t[n];return e}function Zo(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function uo(e,t,n){var i,r,o,l={};for(o in t)o=="key"?i=t[o]:o=="ref"?r=t[o]:l[o]=t[o];if(arguments.length>2&&(l.children=arguments.length>3?so.call(arguments,2):n),typeof e=="function"&&e.defaultProps!=null)for(o in e.defaultProps)l[o]===void 0&&(l[o]=e.defaultProps[o]);return ro(e,l,i,r,null)}function ro(e,t,n,i,r){var o={type:e,props:t,key:n,ref:i,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:r??++sr,__i:-1,__u:0};return r==null&&ve.vnode!=null&&ve.vnode(o),o}function co(e){return e.children}function Tn(e,t){this.props=e,this.context=t}function Xt(e,t){if(t==null)return e.__?Xt(e.__,e.__i+1):null;for(var n;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null)return n.__e;return typeof e.type=="function"?Xt(e):null}function fr(e){var t,n;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null){e.__e=e.__c.base=n.__e;break}return fr(e)}}function ir(e){(!e.__d&&(e.__d=!0)&&Ot.push(e)&&!ao.__r++||or!=ve.debounceRendering)&&((or=ve.debounceRendering)||lr)(ao)}function ao(){for(var e,t,n,i,r,o,l,a=1;Ot.length;)Ot.length>a&&Ot.sort(ur),e=Ot.shift(),a=Ot.length,e.__d&&(n=void 0,i=void 0,r=(i=(t=e).__v).__e,o=[],l=[],t.__P&&((n=pt({},i)).__v=i.__v+1,ve.vnode&&ve.vnode(n),Xo(t.__P,n,i,t.__n,t.__P.namespaceURI,32&i.__u?[r]:null,o,r??Xt(i),!!(32&i.__u),l),n.__v=i.__v,n.__.__k[n.__i]=n,hr(o,n,l),i.__e=i.__=null,n.__e!=r&&fr(n)));ao.__r=0}function mr(e,t,n,i,r,o,l,a,g,c,v){var m,E,w,B,N,G,P,H=i&&i.__k||dr,ee=t.length;for(g=is(n,t,H,g,ee),m=0;m<ee;m++)(w=n.__k[m])!=null&&(E=w.__i==-1?kn:H[w.__i]||kn,w.__i=m,G=Xo(e,w,E,r,o,l,a,g,c,v),B=w.__e,w.ref&&E.ref!=w.ref&&(E.ref&&Qo(E.ref,null,w),v.push(w.ref,w.__c||B,w)),N==null&&B!=null&&(N=B),(P=!!(4&w.__u))||E.__k===w.__k?g=pr(w,g,e,P):typeof w.type=="function"&&G!==void 0?g=G:B&&(g=B.nextSibling),w.__u&=-7);return n.__e=N,g}function is(e,t,n,i,r){var o,l,a,g,c,v=n.length,m=v,E=0;for(e.__k=new Array(r),o=0;o<r;o++)(l=t[o])!=null&&typeof l!="boolean"&&typeof l!="function"?(typeof l=="string"||typeof l=="number"||typeof l=="bigint"||l.constructor==String?l=e.__k[o]=ro(null,l,null,null,null):lo(l)?l=e.__k[o]=ro(co,{children:l},null,null,null):l.constructor==null&&l.__b>0?l=e.__k[o]=ro(l.type,l.props,l.key,l.ref?l.ref:null,l.__v):e.__k[o]=l,g=o+E,l.__=e,l.__b=e.__b+1,a=null,(c=l.__i=rs(l,n,g,m))!=-1&&(m--,(a=n[c])&&(a.__u|=2)),a==null||a.__v==null?(c==-1&&(r>v?E--:r<v&&E++),typeof l.type!="function"&&(l.__u|=4)):c!=g&&(c==g-1?E--:c==g+1?E++:(c>g?E--:E++,l.__u|=4))):e.__k[o]=null;if(m)for(o=0;o<v;o++)(a=n[o])!=null&&(2&a.__u)==0&&(a.__e==i&&(i=Xt(a)),vr(a,a));return i}function pr(e,t,n,i){var r,o;if(typeof e.type=="function"){for(r=e.__k,o=0;r&&o<r.length;o++)r[o]&&(r[o].__=e,t=pr(r[o],t,n,i));return t}e.__e!=t&&(i&&(t&&e.type&&!t.parentNode&&(t=Xt(e)),n.insertBefore(e.__e,t||null)),t=e.__e);do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function rs(e,t,n,i){var r,o,l,a=e.key,g=e.type,c=t[n],v=c!=null&&(2&c.__u)==0;if(c===null&&a==null||v&&a==c.key&&g==c.type)return n;if(i>(v?1:0)){for(r=n-1,o=n+1;r>=0||o<t.length;)if((c=t[l=r>=0?r--:o++])!=null&&(2&c.__u)==0&&a==c.key&&g==c.type)return l}return-1}function rr(e,t,n){t[0]=="-"?e.setProperty(t,n??""):e[t]=n==null?"":typeof n!="number"||os.test(t)?n:n+"px"}function io(e,t,n,i,r){var o,l;e:if(t=="style")if(typeof n=="string")e.style.cssText=n;else{if(typeof i=="string"&&(e.style.cssText=i=""),i)for(t in i)n&&t in n||rr(e.style,t,"");if(n)for(t in n)i&&n[t]==i[t]||rr(e.style,t,n[t])}else if(t[0]=="o"&&t[1]=="n")o=t!=(t=t.replace(cr,"$1")),l=t.toLowerCase(),t=l in e||t=="onFocusOut"||t=="onFocusIn"?l.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+o]=n,n?i?n.u=i.u:(n.u=Jo,e.addEventListener(t,o?Yo:Vo,o)):e.removeEventListener(t,o?Yo:Vo,o);else{if(r=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=n??"";break e}catch{}typeof n=="function"||(n==null||n===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&n==1?"":n))}}function ar(e){return function(t){if(this.l){var n=this.l[t.type+e];if(t.t==null)t.t=Jo++;else if(t.t<n.u)return;return n(ve.event?ve.event(t):t)}}}function Xo(e,t,n,i,r,o,l,a,g,c){var v,m,E,w,B,N,G,P,H,ee,Y,ue,me,ne,R,C,de,oe=t.type;if(t.constructor!=null)return null;128&n.__u&&(g=!!(32&n.__u),o=[a=t.__e=n.__e]),(v=ve.__b)&&v(t);e:if(typeof oe=="function")try{if(P=t.props,H="prototype"in oe&&oe.prototype.render,ee=(v=oe.contextType)&&i[v.__c],Y=v?ee?ee.props.value:v.__:i,n.__c?G=(m=t.__c=n.__c).__=m.__E:(H?t.__c=m=new oe(P,Y):(t.__c=m=new Tn(P,Y),m.constructor=oe,m.render=ss),ee&&ee.sub(m),m.state||(m.state={}),m.__n=i,E=m.__d=!0,m.__h=[],m._sb=[]),H&&m.__s==null&&(m.__s=m.state),H&&oe.getDerivedStateFromProps!=null&&(m.__s==m.state&&(m.__s=pt({},m.__s)),pt(m.__s,oe.getDerivedStateFromProps(P,m.__s))),w=m.props,B=m.state,m.__v=t,E)H&&oe.getDerivedStateFromProps==null&&m.componentWillMount!=null&&m.componentWillMount(),H&&m.componentDidMount!=null&&m.__h.push(m.componentDidMount);else{if(H&&oe.getDerivedStateFromProps==null&&P!==w&&m.componentWillReceiveProps!=null&&m.componentWillReceiveProps(P,Y),t.__v==n.__v||!m.__e&&m.shouldComponentUpdate!=null&&m.shouldComponentUpdate(P,m.__s,Y)===!1){for(t.__v!=n.__v&&(m.props=P,m.state=m.__s,m.__d=!1),t.__e=n.__e,t.__k=n.__k,t.__k.some(function(I){I&&(I.__=t)}),ue=0;ue<m._sb.length;ue++)m.__h.push(m._sb[ue]);m._sb=[],m.__h.length&&l.push(m);break e}m.componentWillUpdate!=null&&m.componentWillUpdate(P,m.__s,Y),H&&m.componentDidUpdate!=null&&m.__h.push(function(){m.componentDidUpdate(w,B,N)})}if(m.context=Y,m.props=P,m.__P=e,m.__e=!1,me=ve.__r,ne=0,H){for(m.state=m.__s,m.__d=!1,me&&me(t),v=m.render(m.props,m.state,m.context),R=0;R<m._sb.length;R++)m.__h.push(m._sb[R]);m._sb=[]}else do m.__d=!1,me&&me(t),v=m.render(m.props,m.state,m.context),m.state=m.__s;while(m.__d&&++ne<25);m.state=m.__s,m.getChildContext!=null&&(i=pt(pt({},i),m.getChildContext())),H&&!E&&m.getSnapshotBeforeUpdate!=null&&(N=m.getSnapshotBeforeUpdate(w,B)),C=v,v!=null&&v.type===co&&v.key==null&&(C=gr(v.props.children)),a=mr(e,lo(C)?C:[C],t,n,i,r,o,l,a,g,c),m.base=t.__e,t.__u&=-161,m.__h.length&&l.push(m),G&&(m.__E=m.__=null)}catch(I){if(t.__v=null,g||o!=null)if(I.then){for(t.__u|=g?160:128;a&&a.nodeType==8&&a.nextSibling;)a=a.nextSibling;o[o.indexOf(a)]=null,t.__e=a}else{for(de=o.length;de--;)Zo(o[de]);Ko(t)}else t.__e=n.__e,t.__k=n.__k,I.then||Ko(t);ve.__e(I,t,n)}else o==null&&t.__v==n.__v?(t.__k=n.__k,t.__e=n.__e):a=t.__e=as(n.__e,t,n,i,r,o,l,g,c);return(v=ve.diffed)&&v(t),128&t.__u?void 0:a}function Ko(e){e&&e.__c&&(e.__c.__e=!0),e&&e.__k&&e.__k.forEach(Ko)}function hr(e,t,n){for(var i=0;i<n.length;i++)Qo(n[i],n[++i],n[++i]);ve.__c&&ve.__c(t,e),e.some(function(r){try{e=r.__h,r.__h=[],e.some(function(o){o.call(r)})}catch(o){ve.__e(o,r.__v)}})}function gr(e){return typeof e!="object"||e==null||e.__b&&e.__b>0?e:lo(e)?e.map(gr):pt({},e)}function as(e,t,n,i,r,o,l,a,g){var c,v,m,E,w,B,N,G=n.props||kn,P=t.props,H=t.type;if(H=="svg"?r="http://www.w3.org/2000/svg":H=="math"?r="http://www.w3.org/1998/Math/MathML":r||(r="http://www.w3.org/1999/xhtml"),o!=null){for(c=0;c<o.length;c++)if((w=o[c])&&"setAttribute"in w==!!H&&(H?w.localName==H:w.nodeType==3)){e=w,o[c]=null;break}}if(e==null){if(H==null)return document.createTextNode(P);e=document.createElementNS(r,H,P.is&&P),a&&(ve.__m&&ve.__m(t,o),a=!1),o=null}if(H==null)G===P||a&&e.data==P||(e.data=P);else{if(o=o&&so.call(e.childNodes),!a&&o!=null)for(G={},c=0;c<e.attributes.length;c++)G[(w=e.attributes[c]).name]=w.value;for(c in G)if(w=G[c],c!="children"){if(c=="dangerouslySetInnerHTML")m=w;else if(!(c in P)){if(c=="value"&&"defaultValue"in P||c=="checked"&&"defaultChecked"in P)continue;io(e,c,null,w,r)}}for(c in P)w=P[c],c=="children"?E=w:c=="dangerouslySetInnerHTML"?v=w:c=="value"?B=w:c=="checked"?N=w:a&&typeof w!="function"||G[c]===w||io(e,c,w,G[c],r);if(v)a||m&&(v.__html==m.__html||v.__html==e.innerHTML)||(e.innerHTML=v.__html),t.__k=[];else if(m&&(e.innerHTML=""),mr(t.type=="template"?e.content:e,lo(E)?E:[E],t,n,i,H=="foreignObject"?"http://www.w3.org/1999/xhtml":r,o,l,o?o[0]:n.__k&&Xt(n,0),a,g),o!=null)for(c=o.length;c--;)Zo(o[c]);a||(c="value",H=="progress"&&B==null?e.removeAttribute("value"):B!=null&&(B!==e[c]||H=="progress"&&!B||H=="option"&&B!=G[c])&&io(e,c,B,G[c],r),c="checked",N!=null&&N!=e[c]&&io(e,c,N,G[c],r))}return e}function Qo(e,t,n){try{if(typeof e=="function"){var i=typeof e.__u=="function";i&&e.__u(),i&&t==null||(e.__u=e(t))}else e.current=t}catch(r){ve.__e(r,n)}}function vr(e,t,n){var i,r;if(ve.unmount&&ve.unmount(e),(i=e.ref)&&(i.current&&i.current!=e.__e||Qo(i,null,t)),(i=e.__c)!=null){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(o){ve.__e(o,t)}i.base=i.__P=null}if(i=e.__k)for(r=0;r<i.length;r++)i[r]&&vr(i[r],t,n||typeof e.type!="function");n||Zo(e.__e),e.__c=e.__=e.__e=void 0}function ss(e,t,n){return this.constructor(e,n)}function ht(e,t,n){var i,r,o,l;t==document&&(t=document.documentElement),ve.__&&ve.__(e,t),r=(i=typeof n=="function")?null:n&&n.__k||t.__k,o=[],l=[],Xo(t,e=(!i&&n||t).__k=uo(co,null,[e]),r||kn,kn,t.namespaceURI,!i&&n?[n]:r?null:t.firstChild?so.call(t.childNodes):null,o,!i&&n?n:r?r.__e:t.firstChild,i,l),hr(o,e,l)}so=dr.slice,ve={__e:function(e,t,n,i){for(var r,o,l;t=t.__;)if((r=t.__c)&&!r.__)try{if((o=r.constructor)&&o.getDerivedStateFromError!=null&&(r.setState(o.getDerivedStateFromError(e)),l=r.__d),r.componentDidCatch!=null&&(r.componentDidCatch(e,i||{}),l=r.__d),l)return r.__E=r}catch(a){e=a}throw e}},sr=0,ts=function(e){return e!=null&&e.constructor==null},Tn.prototype.setState=function(e,t){var n;n=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=pt({},this.state),typeof e=="function"&&(e=e(pt({},n),this.props)),e&&pt(n,e),e!=null&&this.__v&&(t&&this._sb.push(t),ir(this))},Tn.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),ir(this))},Tn.prototype.render=co,Ot=[],lr=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,ur=function(e,t){return e.__v.__b-t.__v.__b},ao.__r=0,cr=/(PointerCapture)$|Capture$/i,Jo=0,Vo=ar(!1),Yo=ar(!0),ns=0;var br=function(e,t,n,i){var r;t[0]=0;for(var o=1;o<t.length;o++){var l=t[o++],a=t[o]?(t[0]|=l?1:2,n[t[o++]]):t[++o];l===3?i[0]=a:l===4?i[1]=Object.assign(i[1]||{},a):l===5?(i[1]=i[1]||{})[t[++o]]=a:l===6?i[1][t[++o]]+=a+"":l?(r=e.apply(a,br(e,a,n,["",null])),i.push(r),a[0]?t[0]|=2:(t[o-2]=0,t[o]=r)):i.push(a)}return i},yr=new Map;function wr(e){var t=yr.get(this);return t||(t=new Map,yr.set(this,t)),(t=br(this,t.get(e)||(t.set(e,t=(function(n){for(var i,r,o=1,l="",a="",g=[0],c=function(E){o===1&&(E||(l=l.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?g.push(0,E,l):o===3&&(E||l)?(g.push(3,E,l),o=2):o===2&&l==="..."&&E?g.push(4,E,0):o===2&&l&&!E?g.push(5,0,!0,l):o>=5&&((l||!E&&o===5)&&(g.push(o,0,l,r),o=6),E&&(g.push(o,E,0,r),o=6)),l=""},v=0;v<n.length;v++){v&&(o===1&&c(),c(v));for(var m=0;m<n[v].length;m++)i=n[v][m],o===1?i==="<"?(c(),g=[g],o=3):l+=i:o===4?l==="--"&&i===">"?(o=1,l=""):l=i+l[0]:a?i===a?a="":l+=i:i==='"'||i==="'"?a=i:i===">"?(c(),o=1):o&&(i==="="?(o=5,r=l,l=""):i==="/"&&(o<5||n[v][m+1]===">")?(c(),o===3&&(g=g[0]),o=g,(g=g[0]).push(2,0,o),o=0):i===" "||i==="	"||i===`
`||i==="\r"?(c(),o=2):l+=i),o===3&&l==="!--"&&(o=4,g=g[0])}return c(),g})(e)),t),arguments,[])).length>1?t:t[0]}var gt=wr.bind(uo);var mo,Re,ei,_r,ti=0,Dr=[],Ee=ve,xr=Ee.__b,Tr=Ee.__r,kr=Ee.diffed,Er=Ee.__c,Sr=Ee.unmount,Mr=Ee.__;function Cr(e,t){Ee.__h&&Ee.__h(Re,e,ti||t),ti=0;var n=Re.__H||(Re.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({}),n.__[e]}function Ir(e,t){var n=Cr(mo++,3);!Ee.__s&&Ar(n.__H,t)&&(n.__=e,n.u=t,Re.__H.__h.push(n))}function po(e){return ti=5,ls(function(){return{current:e}},[])}function ls(e,t){var n=Cr(mo++,7);return Ar(n.__H,t)&&(n.__=e(),n.__H=t,n.__h=e),n.__}function us(){for(var e;e=Dr.shift();)if(e.__P&&e.__H)try{e.__H.__h.forEach(fo),e.__H.__h.forEach(ni),e.__H.__h=[]}catch(t){e.__H.__h=[],Ee.__e(t,e.__v)}}Ee.__b=function(e){Re=null,xr&&xr(e)},Ee.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Mr&&Mr(e,t)},Ee.__r=function(e){Tr&&Tr(e),mo=0;var t=(Re=e.__c).__H;t&&(ei===Re?(t.__h=[],Re.__h=[],t.__.forEach(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0})):(t.__h.forEach(fo),t.__h.forEach(ni),t.__h=[],mo=0)),ei=Re},Ee.diffed=function(e){kr&&kr(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Dr.push(t)!==1&&_r===Ee.requestAnimationFrame||((_r=Ee.requestAnimationFrame)||cs)(us)),t.__H.__.forEach(function(n){n.u&&(n.__H=n.u),n.u=void 0})),ei=Re=null},Ee.__c=function(e,t){t.some(function(n){try{n.__h.forEach(fo),n.__h=n.__h.filter(function(i){return!i.__||ni(i)})}catch(i){t.some(function(r){r.__h&&(r.__h=[])}),t=[],Ee.__e(i,n.__v)}}),Er&&Er(e,t)},Ee.unmount=function(e){Sr&&Sr(e);var t,n=e.__c;n&&n.__H&&(n.__H.__.forEach(function(i){try{fo(i)}catch(r){t=r}}),n.__H=void 0,t&&Ee.__e(t,n.__v))};var Lr=typeof requestAnimationFrame=="function";function cs(e){var t,n=function(){clearTimeout(i),Lr&&cancelAnimationFrame(t),setTimeout(e)},i=setTimeout(n,35);Lr&&(t=requestAnimationFrame(n))}function fo(e){var t=Re,n=e.__c;typeof n=="function"&&(e.__c=void 0,n()),Re=t}function ni(e){var t=Re;e.__c=e.__(),Re=t}function Ar(e,t){return!e||e.length!==t.length||t.some(function(n,i){return n!==e[i]})}function $r(e,t,n,i){let r=document.createElement("li");return r.dataset.guid=e,r.style.cssText="position:relative;padding-left:20px;",ht(gt`
    <${ds}
      start=${t}
      comment=${n}
      formatTime=${i}
    />
  `,r),r}function ds({start:e,comment:t,formatTime:n}){let i=po(null),r=po(null),o=po(null);return Ir(()=>{i.current&&n(i.current,e),r.current&&Qe(r.current,"Click to toggle indent"),o.current&&Qe(o.current,"Set to current playback time")},[]),gt`
    <div
      ref=${r}
      style="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;"
      data-action="toggle-indent">
      <span class="indent-toggle" style="color:#999;font-size:12px;pointer-events:none;display:none;"></span>
    </div>

    <div class="time-row">
      <span class="ts-button ts-minus" data-increment="-1" style="cursor:pointer;margin:0px;">➖</span>
      <span
        ref=${o}
        class="ts-button ts-record"
        data-action="record"
        style="cursor:pointer;margin:0px;">⏺️</span>
      <span class="ts-button ts-plus" data-increment="1" style="cursor:pointer;margin:0px;">➕</span>
      <a ref=${i} data-time="${e}"></a>
      <span class="time-diff" style="color:#888;margin-left:5px;"></span>
      <button class="ts-button ts-delete" data-action="delete"
              style="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;">🗑️</button>
    </div>

    <input
      type="text"
      value="${t||""}"
      data-action="comment"
      style="width:100%;margin-top:5px;display:block;"
      inputmode="text"
      autocapitalize="off"
      autocomplete="off"
      spellcheck=${!1} />
  `}function Br(e){let t=document.createElement("li");return t.className="ytls-error-message",ht(gt`
    <div style="padding: 1em; text-align: center; color: #ff6b6b; font-style: italic;">
      ${e}
    </div>
  `,t),t}function Hr(e){let t=document.createElement("li");return t.className="ytls-placeholder",ht(gt`
    <div style="padding: 2em; text-align: center; color: #999; font-style: italic;">
      ${e}
    </div>
  `,t),t}function Nt(e,t,n){for(;e.firstChild;)e.removeChild(e.firstChild);t==="authenticating"?ht(gt`
      <span class="tk-auth-spinner"></span>
      <span> ${n||"Authorizing with Google\u2026"}</span>
    `,e):t==="error"?ht(gt`
      <span>❌ ${n||"Authorization failed"}</span>
    `,e):t==="none"?ht(gt`
      <span>❌ Not signed in</span>
    `,e):t==="success"&&ht(gt`
      <span>✅ ${n||"Connected"}</span>
    `,e)}var oi=new WeakMap;function ii(e,t,n,i){if(!e&&!oi.has(t))return!1;let r=oi.get(t)??new WeakMap;oi.set(t,r);let o=r.get(n)??new Set;r.set(n,o);let l=o.has(i);return e?o.add(i):o.delete(i),l&&e}function fs(e,t){let n=e.target;if(n instanceof Text&&(n=n.parentElement),n instanceof Element&&e.currentTarget instanceof Node){let i=n.closest(t);if(i&&e.currentTarget.contains(i))return i}}function ms(e,t,n,i={}){let{signal:r,base:o=document}=i;if(r?.aborted)return;let{once:l,...a}=i,g=o instanceof Document?o.documentElement:o,c=!!(typeof i=="object"?i.capture:i),v=w=>{let B=fs(w,String(e));if(B){let N=Object.assign(w,{delegateTarget:B});n.call(g,N),l&&(g.removeEventListener(t,v,a),ii(!1,g,n,m))}},m=JSON.stringify({selector:e,type:t,capture:c});ii(!0,g,n,m)||g.addEventListener(t,v,a),r?.addEventListener("abort",()=>{ii(!1,g,n,m)})}var ze=ms;var ps=(e,t)=>t.some(n=>e instanceof n),Pr,zr;function hs(){return Pr||(Pr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function gs(){return zr||(zr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Fr=new WeakMap,ai=new WeakMap,Or=new WeakMap,ri=new WeakMap,li=new WeakMap;function vs(e){let t=new Promise((n,i)=>{let r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",l)},o=()=>{n(ut(e.result)),r()},l=()=>{i(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",l)});return t.then(n=>{n instanceof IDBCursor&&Fr.set(n,e)}).catch(()=>{}),li.set(t,e),t}function ys(e){if(ai.has(e))return;let t=new Promise((n,i)=>{let r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",l),e.removeEventListener("abort",l)},o=()=>{n(),r()},l=()=>{i(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",l),e.addEventListener("abort",l)});ai.set(e,t)}var si={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return ai.get(e);if(t==="objectStoreNames")return e.objectStoreNames||Or.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ut(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Nr(e){si=e(si)}function bs(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){let i=e.call(ho(this),t,...n);return Or.set(i,t.sort?t.sort():[t]),ut(i)}:gs().includes(e)?function(...t){return e.apply(ho(this),t),ut(Fr.get(this))}:function(...t){return ut(e.apply(ho(this),t))}}function ws(e){return typeof e=="function"?bs(e):(e instanceof IDBTransaction&&ys(e),ps(e,hs())?new Proxy(e,si):e)}function ut(e){if(e instanceof IDBRequest)return vs(e);if(ri.has(e))return ri.get(e);let t=ws(e);return t!==e&&(ri.set(e,t),li.set(t,e)),t}var ho=e=>li.get(e);function Ur(e,t,{blocked:n,upgrade:i,blocking:r,terminated:o}={}){let l=indexedDB.open(e,t),a=ut(l);return i&&l.addEventListener("upgradeneeded",g=>{i(ut(l.result),g.oldVersion,g.newVersion,ut(l.transaction),g)}),n&&l.addEventListener("blocked",g=>n(g.oldVersion,g.newVersion,g)),a.then(g=>{o&&g.addEventListener("close",()=>o()),r&&g.addEventListener("versionchange",c=>r(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}var _s=["get","getKey","getAll","getAllKeys","count"],xs=["put","add","delete","clear"],ui=new Map;function Rr(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(ui.get(t))return ui.get(t);let n=t.replace(/FromIndex$/,""),i=t!==n,r=xs.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!(r||_s.includes(n)))return;let o=async function(l,...a){let g=this.transaction(l,r?"readwrite":"readonly"),c=g.store;return i&&(c=c.index(a.shift())),(await Promise.all([c[n](...a),r&&g.done]))[0]};return ui.set(t,o),o}Nr(e=>({...e,get:(t,n,i)=>Rr(t,n)||e.get(t,n,i),has:(t,n)=>!!Rr(t,n)||e.has(t,n)}));var Ts="ytls-timestamps-db",ks=3,Qt="timestamps",vt="timestamps_v2",go="settings",En=null;function St(){return En||(En=Ur(Ts,ks,{upgrade(e,t,n,i){if(t<1&&e.createObjectStore(Qt,{keyPath:"video_id"}),t<2&&!e.objectStoreNames.contains(go)&&e.createObjectStore(go,{keyPath:"key"}),t<3){if(e.objectStoreNames.contains(Qt))try{let l=i.objectStore(Qt).getAll();l.onsuccess=()=>{try{let a=l.result;if(a.length>0){let g={},c=0;a.forEach(w=>{if(Array.isArray(w.timestamps)&&w.timestamps.length>0){let B=w.timestamps.map(N=>({guid:N.guid||crypto.randomUUID(),start:N.start,comment:N.comment}));g[`ytls-${w.video_id}`]={video_id:w.video_id,timestamps:B.sort((N,G)=>N.start-G.start)},c+=B.length}});let v=new Blob([JSON.stringify(g,null,2)],{type:"application/json"}),m=URL.createObjectURL(v),E=document.createElement("a");E.href=m,E.download=`timekeeper-data-${Jt()}.json`,E.click(),URL.revokeObjectURL(m),f(`Pre-migration backup exported: ${a.length} videos, ${c} timestamps`)}}catch(a){f("Failed to export pre-migration backup:",a,"error")}}}catch(o){f("Failed to inspect v1 store during migration:",o,"warn")}let r=e.createObjectStore(vt,{keyPath:"guid"});if(r.createIndex("video_id","video_id",{unique:!1}),r.createIndex("video_start",["video_id","start"],{unique:!1}),e.objectStoreNames.contains(Qt))try{let l=i.objectStore(Qt).getAll();l.onsuccess=()=>{let a=l.result;if(a.length>0){let g=0;a.forEach(c=>{Array.isArray(c.timestamps)&&c.timestamps.length>0&&c.timestamps.forEach(v=>{r.put({guid:v.guid||crypto.randomUUID(),video_id:c.video_id,start:v.start,comment:v.comment}),g++})}),f(`Migrated ${g} timestamps from ${a.length} videos to v2 store`)}},e.deleteObjectStore(Qt),f("Deleted old timestamps store after migration to v2")}catch(o){f("Failed during migration:",o,"error")}}}}).catch(e=>{throw f("Failed to open database, will retry on next access:",e,"error"),En=null,e}),En)}async function ci(e){try{let n=await(await St()).getAll(e);return n.length===0?[]:n}catch(t){return f("Failed to getAll from IndexedDB:",t,"error"),[]}}async function di(e,t){try{let n=await St(),i=await n.getAllFromIndex(vt,"video_id",e),r=new Set(t.map(o=>o.guid));for(let o of i)r.has(o.guid)||await n.delete(vt,o.guid);for(let o of t)await n.put(vt,{guid:o.guid,video_id:e,start:o.start,comment:o.comment})}catch(n){throw f("Failed to save to IndexedDB:",n,"error"),n}}async function Gr(e,t){try{await(await St()).put(vt,{guid:t.guid,video_id:e,start:t.start,comment:t.comment})}catch(n){throw f("Failed to save single timestamp to IndexedDB:",n,"error"),n}}async function jr(e,t){f(`Deleting timestamp ${t} for video ${e}`);try{await(await St()).delete(vt,t)}catch(n){throw f("Failed to delete timestamp from IndexedDB:",n,"error"),n}}async function qr(e){try{let n=await(await St()).getAllFromIndex(vt,"video_id",e);return!n||n.length===0?null:n.map(r=>({guid:r.guid,start:r.start,comment:r.comment})).sort((r,o)=>r.start-o.start)}catch(t){return f("Failed to load timestamps from IndexedDB:",t,"warn"),null}}async function Wr(e){try{let t=await St(),n=await t.getAllFromIndex(vt,"video_id",e);for(let i of n)await t.delete(vt,i.guid)}catch(t){throw f("Failed to remove timestamps from IndexedDB:",t,"error"),t}}async function en(e,t){try{await(await St()).put(go,{key:e,value:t})}catch(n){throw f(`Failed to save setting '${e}' to IndexedDB:`,n,"error"),n}}async function vo(e){try{return(await(await St()).get(go,e))?.value}catch(t){f(`Failed to load setting '${e}' from IndexedDB:`,t,"error");return}}var Vr=`
  #ytls-pane {
    background: rgba(19, 19, 19, 0.8);
    text-align: left;
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 0;
    margin: 0;
    border-radius: 12px; /* Add rounded corners */
    border: 1px solid rgba(85, 85, 85, 0.8); /* Add a thin grey border */
    opacity: 0.9;
    z-index: 5000;
    font-family: Arial, sans-serif;
    width: 300px;
    height: 90vh;
    min-width: 300px;
    max-width: 800px;
    min-height: 400px;
    max-height: 90vh;
    user-select: none; /* Prevent text selection in pane */
    display: flex;
    flex-direction: column;
    will-change: width, height;
    transform: translateZ(0);
    backface-visibility: hidden;
    contain: layout style paint;
    overflow: hidden;
  }
  #ytls-pane:hover {
    opacity: 1;
  }
  /* Legacy corner handle: keep element for resize behavior but hide visual indicator */
  /* Legacy corner handle kept for compatibility but hidden visually */
  #ytls-resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: auto; /* no visible corner cursor */
    z-index: 10;
    pointer-events: none; /* legacy handle inactive, corners handle events */
    background: transparent;
    margin: 0;
    padding: 0;
  }
  #ytls-resize-handle::before {
    display: none; /* remove the triangular corner indicator */
    content: none;
  }

  /* Corner handles for diagonal resize */
  #ytls-resize-tl,
  #ytls-resize-tr,
  #ytls-resize-bl,
  #ytls-resize-br {
    position: absolute;
    /* Use 16px click areas for corner resize handlers to match touch targets and reduce accidental drags */
    width: 16px;
    height: 16px;
    z-index: 11;
    background: transparent;
    pointer-events: auto;
  }
  #ytls-resize-tl { top: 0; left: 0; cursor: nwse-resize; }
  #ytls-resize-tr { top: 0; right: 0; cursor: nesw-resize; }
  #ytls-resize-bl { bottom: 0; left: 0; cursor: nesw-resize; }
  #ytls-resize-br { bottom: 0; right: 0; cursor: nwse-resize; }
  #ytls-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    box-sizing: border-box;
    position: relative;
  }
  #ytls-content ul {
    flex: 1 1 auto;
    overflow-y: auto;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-height: 0;
    z-index: 1;
  }

  /* Placeholder message shown centered in the list area while loading or when empty */
  #ytls-content ul li.ytls-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    color: #bfbfbf;
    font-size: 14px;
    font-style: italic;
    padding: 12px;
    text-align: center;
    box-sizing: border-box;
  }
  #ytls-pane-header {
    position: relative;
    z-index: 2;
  }
  #ytls-buttons {
    position: relative;
    z-index: 2;
    flex-shrink: 0;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding: 10px 18px 10px 16px;
    background: linear-gradient(0deg, #23272b 0%, #212121 100%);
    border-radius: 0 0 12px 12px;
    border-top: 1px solid #23272b;
    margin-top: auto;
  }
  #ytls-pane li {
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    margin: 0 !important;
    border: none;
    border-top: 1px solid rgba(85, 85, 85, 0.8);
    user-select: none; /* Prevent text selection in timestamp items */
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
  }
  #ytls-pane li:first-child {
    border-top: none;
  }
  #ytls-pane li.ytls-timestamp-highlight {
    background: rgb(31, 37, 29);
  }
  #ytls-pane li.ytls-timestamp-pending-delete {
    background: rgba(128, 0, 0, 0.8);
  }
  #ytls-pane .time-row {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  #ytls-pane .time-row a {
    flex-grow: 1; /* Allow the timestamp text to take up available space */
    max-width: 100%; /* Constrain the width to the parent container */
    text-align: left; /* Align the text to the left */
    overflow: hidden; /* Prevent overflow */
    text-overflow: ellipsis; /* Add ellipsis for long text */
    white-space: nowrap; /* Prevent wrapping */
  }
  #ytls-pane .ytls-marker {
    position: absolute;
    height: 100%;
    width: 2px;
    background-color: #ff0000;
    cursor: pointer;
  }
  #ytls-pane span,
  #ytls-pane a,
  #ytls-pane input {
    background: none;
    color: white;
    font-family: inherit;
    font-size: 14px;
    text-decoration: none;
    border: none;
    outline: none;
  }
  /* Ensure editing controls behave like editable fields despite parent user-select:none */
  #ytls-pane input,
  #ytls-pane textarea {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    caret-color: white;
  }
  #ytls-buttons {
    flex-shrink: 0;
    display: flex;
    gap: 5px;
    justify-content: space-between;
    padding: 8px 12px;
    background: rgb(33, 33, 33);
    border-radius: 0 0 12px 12px;
    border-top: 1px solid rgba(85, 85, 85, 0.8);
    z-index: 2;
    /* Ensure it stays at the bottom */
  }
  #ytls-buttons button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Styles for main control buttons */
  .ytls-main-button {
    background: rgb(39, 39, 39);
    color: white;
    font-size: 24px;
    border: none;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    position: relative;
  }
  .ytls-main-button:hover {
    background: rgb(63, 63, 63);
  }
  .ytls-holiday-emoji {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 0.25em;
    pointer-events: none;
  }

  /* Pane header and utility styles */
  #ytls-pane-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 18px 10px 16px;
    white-space: nowrap;
    cursor: default;
    border-radius: 12px 12px 0 0;
    border: none;
    background: linear-gradient(180deg, #23272b 0%, #212121 100%);
    box-shadow: 0 1px 0 0 #23272b;
    flex-shrink: 0;
    color: #fafafa;
  }
  #ytls-pane .ytls-version-display {
    font-size:14px;
    color:#666;
    margin-left:auto;
    padding-right:5px;
    cursor:default;
  }
  #ytls-pane .ytls-google-user-display {
    font-size:12px;
    color:#4285f4;
    margin-left:8px;
    padding:2px 6px;
    cursor:default;
    background:rgba(66, 133, 244, 0.1);
    border-radius:4px;
  }
  #ytls-pane .ytls-backup-status-display {
    font-size:12px;
    color:#9acd32; /* yellowgreen */
    margin-left:8px;
    padding:2px 6px;
    cursor:default;
    background:rgba(154, 205, 50, 0.12);
    border-radius:4px;
  }
  #ytls-current-time {
    color:white;
    font-size:14px;
    cursor:pointer;
    position:relative;
  }

  /* Backup status indicator (colored dot) */
  .ytls-backup-indicator {
    display:inline-block;
    width:8px;
    height:8px;
    border-radius:50%;
    background-color:#666;
    cursor:help;
    flex-shrink:0;
  }

  /* Shared modal container styles */
  #ytls-settings-modal {
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    background:#1a1a1a;
    padding:8px;
    border-radius:10px;
    z-index:10000;
    color:white;
    text-align:center;
    width:200px;
    box-shadow:0 0 10px rgba(0,0,0,0.5);
  }
  #ytls-save-modal,
  #ytls-load-modal,
  #ytls-delete-all-modal {
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    background:#333;
    padding:8px;
    border-radius:10px;
    z-index:10000;
    color:white;
    text-align:center;
    width:fit-content;
    max-width:90vw;
    box-shadow:0 0 10px rgba(0,0,0,0.5);
  }

  /* Modal header with tabs and close button */
  .ytls-modal-header {
    display:flex;
    align-items:flex-end;
    margin-bottom:0;
    gap:10px;
  }

  /* Modal close button (X in header) */
  .ytls-modal-close-button {
    position:absolute;
    top:8px;
    right:8px;
    width:16px;
    height:16px;
    background:#ff4444;
    color:white;
    border:none;
    border-radius:3px;
    font-size:14px;
    font-weight:bold;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    line-height:1;
    padding:0;
    flex-shrink:0;
    z-index:1;
  }
  .ytls-modal-close-button:hover {
    background:#ff6666;
  }

  /* Styles for settings modal */
  #ytls-settings-content {
    display:flex;
    flex-direction:column;
    gap:10px;
    align-items:center;
    background:#2a2a2a;
    border:2px solid #3a3a3a;
    border-radius:0 4px 4px 4px;
    padding:10px;
    margin-top:-2px;
    position:relative;
    z-index:1;
  }

  /* Section heading */
  .ytls-section-heading {
    margin:0 0 10px 0;
    padding:0;
    font-size:16px;
    font-weight:bold;
    color:#fff;
    text-align:center;
  }

  /* Settings nav (tabs) */
  #ytls-settings-nav {
    display:flex;
    gap:6px;
    flex:0;
  }
  #ytls-settings-nav .ytls-settings-modal-button {
    flex:0;
    width:auto;
    height:24px;
    margin-bottom:0;
    background: #2a2a2a;
    font-size:13px;
    padding:0 8px;
    display:flex;
    align-items:center;
    justify-content:center;
    line-height:1;
    border:2px solid transparent;
    border-radius:4px 4px 0 0;
    border-bottom:2px solid transparent;
    white-space:nowrap;
    position:relative;
  }
  #ytls-settings-nav .ytls-settings-modal-button .ytls-tab-text {
    display:none;
  }
  #ytls-settings-nav .ytls-settings-modal-button.active .ytls-tab-text {
    display:inline;
  }
  #ytls-settings-nav .ytls-settings-modal-button:hover {
    background: #3a3a3a;
  }
  #ytls-settings-nav .ytls-settings-modal-button.active {
    background:#2a2a2a;
    border:2px solid #3a3a3a;
    border-bottom:2px solid #2a2a2a;
    z-index:2;
  }

  /* Button grid container */
  .ytls-button-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
    width: 100%;
  }

  /* Styles for buttons in the settings modal */
  .ytls-settings-modal-button {
    width: 100%;
    height: 32px;
    background: #555;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
    padding: 0 8px;
  }
  .ytls-settings-modal-button:hover {
    background: #777; /* Example hover effect */
  }

  /* Shared styles for modal copy */
  #ytls-save-modal p,
  #ytls-load-modal p,
  #ytls-delete-all-modal p {
    margin-bottom:15px;
    font-size:16px;
  }
  .ytls-save-modal-button {
    background:#555;
    color:white;
    padding:10px 20px;
    border:none;
    border-radius:5px;
    cursor:pointer;
    margin-right:10px; /* Applied to both JSON and Text buttons, last one will have extra margin if not overridden */
  }
  .ytls-save-modal-button:last-of-type { /* Remove margin from the last button of this type in the modal */
    margin-right:0;
  }
  .ytls-save-modal-cancel-button {
    background:#444;
    color:white;
    padding:10px 20px;
    border:none;
    border-radius:5px;
    cursor:pointer;
    margin-top:15px;
    display:block;
    width:100%;
  }

  /* Styles for file operation buttons (Save, Load, Export, Import) if they were to be displayed directly */
  /* Note: These buttons (saveBtn, loadBtn, etc.) are not directly added to the UI with these styles. */
  /* Their onclick handlers are used by the settings modal buttons which use .ytls-settings-modal-button. */
  .ytls-file-operation-button {
    background: #555;
    color: white;
    font-size: 12px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .ytls-file-operation-button:hover {
    background: #777; /* Example hover effect */
  }

  .ytls-hidden-file-input {
    display:none;
  }

  #ytls-header-button {
    align-items:center;
    background:transparent;
    border:none;
    color:var(--yt-spec-text-primary, currentColor);
    cursor:pointer;
    display:inline-flex;
    font-size:20px;
    height:40px;
    margin-left:6px;
    padding:0 6px;
    text-decoration:none;
  }
  #ytls-header-button:hover {
    color:var(--yt-spec-call-to-action, #3ea6ff);
  }
  #ytls-header-button:focus-visible {
    outline:2px solid var(--yt-spec-call-to-action, #3ea6ff);
    outline-offset:2px;
  }
  #ytls-header-button img {
    display:block;
    height:32px;
    max-width:48px;
    pointer-events:none;
    width:auto;
  }

  /* Shared fade animations for pane and modals */
  .ytls-fade-in {
    animation: fadeIn 0.3s ease-in-out forwards;
  }

  .ytls-fade-out {
    animation: fadeOut 0.3s ease-in-out forwards;
  }

  /* Zoom animations for pane expand/collapse */
  .ytls-zoom-in {
    animation: zoomIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    transform-origin: center center;
  }

  .ytls-zoom-out {
    animation: zoomOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    transform-origin: center center;
  }

  /* Fade-in animation for modals */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Fade-out animation for modals */
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  /* Zoom-in animation - expand from point */
  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.1);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Zoom-out animation - collapse to point */
  @keyframes zoomOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.1);
    }
  }

  /* Custom tooltip styles */
  .ytls-tooltip {
    position: fixed;
    background: rgba(97, 97, 97, 0.92);
    color: #fff;
    padding: 8px 10px;
    border-radius: 2px;
    font-size: 12px;
    font-family: "Roboto", "Arial", sans-serif;
    font-weight: normal;
    line-height: 1.4;
    letter-spacing: 0.2px;
    z-index: 10001;
    pointer-events: none;
    white-space: pre-line;
    max-width: 300px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.0, 0.0, 0.2, 1);
  }
  .ytls-tooltip.ytls-tooltip-visible {
    opacity: 1;
  }

`;var Be=Uint8Array,qe=Uint16Array,vi=Int32Array,yi=new Be([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),bi=new Be([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Yr=new Be([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),ea=function(e,t){for(var n=new qe(31),i=0;i<31;++i)n[i]=t+=1<<e[i-1];for(var r=new vi(n[30]),i=1;i<30;++i)for(var o=n[i];o<n[i+1];++o)r[o]=o-n[i]<<5|i;return{b:n,r}},ta=ea(yi,2),Es=ta.b,mi=ta.r;Es[28]=258,mi[258]=28;var na=ea(bi,0),Hl=na.b,Kr=na.r,pi=new qe(32768);for(le=0;le<32768;++le)yt=(le&43690)>>1|(le&21845)<<1,yt=(yt&52428)>>2|(yt&13107)<<2,yt=(yt&61680)>>4|(yt&3855)<<4,pi[le]=((yt&65280)>>8|(yt&255)<<8)>>1;var yt,le,Ln=(function(e,t,n){for(var i=e.length,r=0,o=new qe(t);r<i;++r)e[r]&&++o[e[r]-1];var l=new qe(t);for(r=1;r<t;++r)l[r]=l[r-1]+o[r-1]<<1;var a;if(n){a=new qe(1<<t);var g=15-t;for(r=0;r<i;++r)if(e[r])for(var c=r<<4|e[r],v=t-e[r],m=l[e[r]-1]++<<v,E=m|(1<<v)-1;m<=E;++m)a[pi[m]>>g]=c}else for(a=new qe(i),r=0;r<i;++r)e[r]&&(a[r]=pi[l[e[r]-1]++]>>15-e[r]);return a}),Rt=new Be(288);for(le=0;le<144;++le)Rt[le]=8;var le;for(le=144;le<256;++le)Rt[le]=9;var le;for(le=256;le<280;++le)Rt[le]=7;var le;for(le=280;le<288;++le)Rt[le]=8;var le,yo=new Be(32);for(le=0;le<32;++le)yo[le]=5;var le,Ss=Ln(Rt,9,0);var Ms=Ln(yo,5,0);var oa=function(e){return(e+7)/8|0},ia=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new Be(e.subarray(t,n))};var Ls=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],wo=function(e,t,n){var i=new Error(t||Ls[e]);if(i.code=e,Error.captureStackTrace&&Error.captureStackTrace(i,wo),!n)throw i;return i};var bt=function(e,t,n){n<<=t&7;var i=t/8|0;e[i]|=n,e[i+1]|=n>>8},Sn=function(e,t,n){n<<=t&7;var i=t/8|0;e[i]|=n,e[i+1]|=n>>8,e[i+2]|=n>>16},fi=function(e,t){for(var n=[],i=0;i<e.length;++i)e[i]&&n.push({s:i,f:e[i]});var r=n.length,o=n.slice();if(!r)return{t:aa,l:0};if(r==1){var l=new Be(n[0].s+1);return l[n[0].s]=1,{t:l,l:1}}n.sort(function(ue,me){return ue.f-me.f}),n.push({s:-1,f:25001});var a=n[0],g=n[1],c=0,v=1,m=2;for(n[0]={s:-1,f:a.f+g.f,l:a,r:g};v!=r-1;)a=n[n[c].f<n[m].f?c++:m++],g=n[c!=v&&n[c].f<n[m].f?c++:m++],n[v++]={s:-1,f:a.f+g.f,l:a,r:g};for(var E=o[0].s,i=1;i<r;++i)o[i].s>E&&(E=o[i].s);var w=new qe(E+1),B=hi(n[v-1],w,0);if(B>t){var i=0,N=0,G=B-t,P=1<<G;for(o.sort(function(me,ne){return w[ne.s]-w[me.s]||me.f-ne.f});i<r;++i){var H=o[i].s;if(w[H]>t)N+=P-(1<<B-w[H]),w[H]=t;else break}for(N>>=G;N>0;){var ee=o[i].s;w[ee]<t?N-=1<<t-w[ee]++-1:++i}for(;i>=0&&N;--i){var Y=o[i].s;w[Y]==t&&(--w[Y],++N)}B=t}return{t:new Be(w),l:B}},hi=function(e,t,n){return e.s==-1?Math.max(hi(e.l,t,n+1),hi(e.r,t,n+1)):t[e.s]=n},Jr=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new qe(++t),i=0,r=e[0],o=1,l=function(g){n[i++]=g},a=1;a<=t;++a)if(e[a]==r&&a!=t)++o;else{if(!r&&o>2){for(;o>138;o-=138)l(32754);o>2&&(l(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(l(r),--o;o>6;o-=6)l(8304);o>2&&(l(o-3<<5|8208),o=0)}for(;o--;)l(r);o=1,r=e[a]}return{c:n.subarray(0,i),n:t}},Mn=function(e,t){for(var n=0,i=0;i<t.length;++i)n+=e[i]*t[i];return n},ra=function(e,t,n){var i=n.length,r=oa(t+2);e[r]=i&255,e[r+1]=i>>8,e[r+2]=e[r]^255,e[r+3]=e[r+1]^255;for(var o=0;o<i;++o)e[r+o+4]=n[o];return(r+4+i)*8},Zr=function(e,t,n,i,r,o,l,a,g,c,v){bt(t,v++,n),++r[256];for(var m=fi(r,15),E=m.t,w=m.l,B=fi(o,15),N=B.t,G=B.l,P=Jr(E),H=P.c,ee=P.n,Y=Jr(N),ue=Y.c,me=Y.n,ne=new qe(19),R=0;R<H.length;++R)++ne[H[R]&31];for(var R=0;R<ue.length;++R)++ne[ue[R]&31];for(var C=fi(ne,7),de=C.t,oe=C.l,I=19;I>4&&!de[Yr[I-1]];--I);var D=c+5<<3,M=Mn(r,Rt)+Mn(o,yo)+l,$=Mn(r,E)+Mn(o,N)+l+14+3*I+Mn(ne,de)+2*ne[16]+3*ne[17]+7*ne[18];if(g>=0&&D<=M&&D<=$)return ra(t,v,e.subarray(g,g+c));var L,z,U,te;if(bt(t,v,1+($<M)),v+=2,$<M){L=Ln(E,w,0),z=E,U=Ln(N,G,0),te=N;var pe=Ln(de,oe,0);bt(t,v,ee-257),bt(t,v+5,me-1),bt(t,v+10,I-4),v+=14;for(var R=0;R<I;++R)bt(t,v+3*R,de[Yr[R]]);v+=3*I;for(var re=[H,ue],ce=0;ce<2;++ce)for(var he=re[ce],R=0;R<he.length;++R){var X=he[R]&31;bt(t,v,pe[X]),v+=de[X],X>15&&(bt(t,v,he[R]>>5&127),v+=he[R]>>12)}}else L=Ss,z=Rt,U=Ms,te=yo;for(var R=0;R<a;++R){var fe=i[R];if(fe>255){var X=fe>>18&31;Sn(t,v,L[X+257]),v+=z[X+257],X>7&&(bt(t,v,fe>>23&31),v+=yi[X]);var Fe=fe&31;Sn(t,v,U[Fe]),v+=te[Fe],Fe>3&&(Sn(t,v,fe>>5&8191),v+=bi[Fe])}else Sn(t,v,L[fe]),v+=z[fe]}return Sn(t,v,L[256]),v+z[256]},Ds=new vi([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),aa=new Be(0),Cs=function(e,t,n,i,r,o){var l=o.z||e.length,a=new Be(i+l+5*(1+Math.ceil(l/7e3))+r),g=a.subarray(i,a.length-r),c=o.l,v=(o.r||0)&7;if(t){v&&(g[0]=o.r>>3);for(var m=Ds[t-1],E=m>>13,w=m&8191,B=(1<<n)-1,N=o.p||new qe(32768),G=o.h||new qe(B+1),P=Math.ceil(n/3),H=2*P,ee=function(Oe){return(e[Oe]^e[Oe+1]<<P^e[Oe+2]<<H)&B},Y=new vi(25e3),ue=new qe(288),me=new qe(32),ne=0,R=0,C=o.i||0,de=0,oe=o.w||0,I=0;C+2<l;++C){var D=ee(C),M=C&32767,$=G[D];if(N[M]=$,G[D]=M,oe<=C){var L=l-C;if((ne>7e3||de>24576)&&(L>423||!c)){v=Zr(e,g,0,Y,ue,me,R,de,I,C-I,v),de=ne=R=0,I=C;for(var z=0;z<286;++z)ue[z]=0;for(var z=0;z<30;++z)me[z]=0}var U=2,te=0,pe=w,re=M-$&32767;if(L>2&&D==ee(C-re))for(var ce=Math.min(E,L)-1,he=Math.min(32767,C),X=Math.min(258,L);re<=he&&--pe&&M!=$;){if(e[C+U]==e[C+U-re]){for(var fe=0;fe<X&&e[C+fe]==e[C+fe-re];++fe);if(fe>U){if(U=fe,te=re,fe>ce)break;for(var Fe=Math.min(re,fe-2),Ye=0,z=0;z<Fe;++z){var ke=C-re+z&32767,Ke=N[ke],nt=ke-Ke&32767;nt>Ye&&(Ye=nt,$=ke)}}}M=$,$=N[M],re+=M-$&32767}if(te){Y[de++]=268435456|mi[U]<<18|Kr[te];var ct=mi[U]&31,Ut=Kr[te]&31;R+=yi[ct]+bi[Ut],++ue[257+ct],++me[Ut],oe=C+U,++ne}else Y[de++]=e[C],++ue[e[C]]}}for(C=Math.max(C,oe);C<l;++C)Y[de++]=e[C],++ue[e[C]];v=Zr(e,g,c,Y,ue,me,R,de,I,C-I,v),c||(o.r=v&7|g[v/8|0]<<3,v-=7,o.h=G,o.p=N,o.i=C,o.w=oe)}else{for(var C=o.w||0;C<l+c;C+=65535){var Mt=C+65535;Mt>=l&&(g[v/8|0]=c,Mt=l),v=ra(g,v+1,e.subarray(C,Mt))}o.i=l}return ia(a,0,i+oa(v)+r)},Is=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,i=9;--i;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),As=function(){var e=-1;return{p:function(t){for(var n=e,i=0;i<t.length;++i)n=Is[n&255^t[i]]^n>>>8;e=n},d:function(){return~e}}};var $s=function(e,t,n,i,r){if(!r&&(r={l:1},t.dictionary)){var o=t.dictionary.subarray(-32768),l=new Be(o.length+e.length);l.set(o),l.set(e,o.length),e=l,r.w=o.length}return Cs(e,t.level==null?6:t.level,t.mem==null?r.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,i,r)},sa=function(e,t){var n={};for(var i in e)n[i]=e[i];for(var i in t)n[i]=t[i];return n};var $e=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function Bs(e,t){return $s(e,t||{},0,0)}var la=function(e,t,n,i){for(var r in e){var o=e[r],l=t+r,a=i;Array.isArray(o)&&(a=sa(i,o[1]),o=o[0]),o instanceof Be?n[l]=[o,a]:(n[l+="/"]=[new Be(0),a],la(o,l,n,i))}},Xr=typeof TextEncoder<"u"&&new TextEncoder,Hs=typeof TextDecoder<"u"&&new TextDecoder,Ps=0;try{Hs.decode(aa,{stream:!0}),Ps=1}catch{}function bo(e,t){if(t){for(var n=new Be(e.length),i=0;i<e.length;++i)n[i]=e.charCodeAt(i);return n}if(Xr)return Xr.encode(e);for(var r=e.length,o=new Be(e.length+(e.length>>1)),l=0,a=function(v){o[l++]=v},i=0;i<r;++i){if(l+5>o.length){var g=new Be(l+8+(r-i<<1));g.set(o),o=g}var c=e.charCodeAt(i);c<128||t?a(c):c<2048?(a(192|c>>6),a(128|c&63)):c>55295&&c<57344?(c=65536+(c&1047552)|e.charCodeAt(++i)&1023,a(240|c>>18),a(128|c>>12&63),a(128|c>>6&63),a(128|c&63)):(a(224|c>>12),a(128|c>>6&63),a(128|c&63))}return ia(o,0,l)}var gi=function(e){var t=0;if(e)for(var n in e){var i=e[n].length;i>65535&&wo(9),t+=i+4}return t},Qr=function(e,t,n,i,r,o,l,a){var g=i.length,c=n.extra,v=a&&a.length,m=gi(c);$e(e,t,l!=null?33639248:67324752),t+=4,l!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(o<0&&8),e[t++]=r&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var E=new Date(n.mtime==null?Date.now():n.mtime),w=E.getFullYear()-1980;if((w<0||w>119)&&wo(10),$e(e,t,w<<25|E.getMonth()+1<<21|E.getDate()<<16|E.getHours()<<11|E.getMinutes()<<5|E.getSeconds()>>1),t+=4,o!=-1&&($e(e,t,n.crc),$e(e,t+4,o<0?-o-2:o),$e(e,t+8,n.size)),$e(e,t+12,g),$e(e,t+14,m),t+=16,l!=null&&($e(e,t,v),$e(e,t+6,n.attrs),$e(e,t+10,l),t+=14),e.set(i,t),t+=g,m)for(var B in c){var N=c[B],G=N.length;$e(e,t,+B),$e(e,t+2,G),e.set(N,t+4),t+=4+G}return v&&(e.set(a,t),t+=v),t},zs=function(e,t,n,i,r){$e(e,t,101010256),$e(e,t+8,n),$e(e,t+10,n),$e(e,t+12,i),$e(e,t+16,r)};function ua(e,t){t||(t={});var n={},i=[];la(e,"",n,t);var r=0,o=0;for(var l in n){var a=n[l],g=a[0],c=a[1],v=c.level==0?0:8,m=bo(l),E=m.length,w=c.comment,B=w&&bo(w),N=B&&B.length,G=gi(c.extra);E>65535&&wo(11);var P=v?Bs(g,c):g,H=P.length,ee=As();ee.p(g),i.push(sa(c,{size:g.length,crc:ee.d(),c:P,f:m,m:B,u:E!=l.length||B&&w.length!=N,o:r,compression:v})),r+=30+E+G+H,o+=76+2*(E+G)+(N||0)+H}for(var Y=new Be(o+22),ue=r,me=o-r,ne=0;ne<i.length;++ne){var m=i[ne];Qr(Y,m.o,m,m.f,m.u,m.c.length);var R=30+m.f.length+gi(m.extra);Y.set(m.c,m.o+R),Qr(Y,r,m,m.f,m.u,m.c.length,m.o,m.m),r+=16+R+(m.m?m.m.length:0)}return zs(Y,r,i.length,me,ue),Y}var Q={isSignedIn:!1,accessToken:null,userName:null,email:null},st=!0,Ve=30,tt=null,nn=!1,tn=0,et=null,wi=null,Le=null,ye=null,_o=null;function ma(e){wi=e}function pa(e){Le=e}function ha(e){ye=e}function _i(e){_o=e}var ca=!1;function ga(){if(!ca)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),ca=!0}catch{}}var va=null,Dn=null,Cn=null;function xi(e){va=e}function To(e){Dn=e}function ko(e){Cn=e}var da="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Fs="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Os="https://www.youtube.com/",Ns=30*1e3,Rs=1800*1e3,fa=5,xo=null,We=null;async function Ti(){try{let e=await Cn("googleAuthState");e&&typeof e=="object"&&(Q={...Q,...e},An(),Q.isSignedIn&&Q.accessToken&&await rn(!0))}catch(e){f("Failed to load Google auth state:",e,"error")}}async function Eo(){try{await Dn("googleAuthState",Q)}catch(e){f("Failed to save Google auth state:",e,"error")}}function An(){wi&&(wi.style.display="none")}function Ue(e,t){if(ye){if(ye.style.fontWeight="bold",e==="authenticating"){ga(),ye.style.color="#ffa500",Nt(ye,"authenticating",t);return}if(e==="error"){ye.style.color="#ff4d4f",Nt(ye,"error",t),Te();return}Q.isSignedIn?(ye.style.color="#52c41a",Nt(ye,"success","Signed in"),ye.removeAttribute("title"),Q.userName?(ye.onmouseenter=()=>{Nt(ye,"success",`Signed in as ${Q.userName}`)},ye.onmouseleave=()=>{Nt(ye,"success","Signed in")}):(ye.onmouseenter=null,ye.onmouseleave=null)):(ye.style.color="#ff4d4f",Nt(ye,"none"),ye.removeAttribute("title"),ye.onmouseenter=null,ye.onmouseleave=null),Te()}}function Us(){ye&&(ga(),ye.classList.remove("tk-auth-blink"),ye.offsetWidth,ye.classList.add("tk-auth-blink"),setTimeout(()=>{ye.classList.remove("tk-auth-blink")},1200))}function Gs(e){return new Promise((t,n)=>{if(!e){f&&f("OAuth monitor: popup is null",null,"error"),n(new Error("Failed to open popup"));return}f&&f("OAuth monitor: starting to monitor popup for token");let i=Date.now(),r=300*1e3,o="timekeeper_oauth",l=null,a=null,g=null,c=()=>{if(l){try{l.close()}catch{}l=null}a&&(clearInterval(a),a=null),g&&(clearInterval(g),g=null)};try{l=new BroadcastChannel(o),f&&f("OAuth monitor: BroadcastChannel created successfully"),l.onmessage=E=>{if(f&&f("OAuth monitor: received BroadcastChannel message",E.data),E.data?.type==="timekeeper_oauth_token"&&E.data?.token){f&&f("OAuth monitor: token received via BroadcastChannel"),c();try{e.close()}catch{}t(E.data.token)}else if(E.data?.type==="timekeeper_oauth_error"){f&&f("OAuth monitor: error received via BroadcastChannel",E.data.error,"error"),c();try{e.close()}catch{}n(new Error(E.data.error||"OAuth failed"))}}}catch(E){f&&f("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",E)}f&&f("OAuth monitor: setting up IndexedDB polling");let v=Date.now();a=setInterval(async()=>{try{let E=indexedDB.open("ytls-timestamps-db",3);E.onsuccess=()=>{let w=E.result,G=w.transaction("settings","readonly").objectStore("settings").get("oauth_message");G.onsuccess=()=>{let P=G.result;if(P&&P.value){let H=P.value;if(H.timestamp&&H.timestamp>v){if(f&&f("OAuth monitor: received IndexedDB message",H),H.type==="timekeeper_oauth_token"&&H.token){f&&f("OAuth monitor: token received via IndexedDB"),c();try{e.close()}catch{}w.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),t(H.token)}else if(H.type==="timekeeper_oauth_error"){f&&f("OAuth monitor: error received via IndexedDB",H.error,"error"),c();try{e.close()}catch{}w.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(new Error(H.error||"OAuth failed"))}v=H.timestamp}}w.close()}}}catch(E){f&&f("OAuth monitor: IndexedDB polling error",E,"error")}},500),g=setInterval(()=>{if(Date.now()-i>r){f&&f("OAuth monitor: popup timed out after 5 minutes",null,"error"),c();try{e.close()}catch{}n(new Error("OAuth popup timed out"));return}},1e3)})}async function ya(){if(!da){Ue("error","Google Client ID not configured");return}try{f&&f("OAuth signin: starting OAuth flow"),Ue("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",da),e.searchParams.set("redirect_uri",Os),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Fs),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),f&&f("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){f&&f("OAuth signin: popup blocked by browser",null,"error"),Ue("error","Popup blocked. Please enable popups for YouTube.");return}f&&f("OAuth signin: popup opened successfully"),Ue("authenticating","Waiting for authentication...");try{let n=await Gs(t),i=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(i.ok){let r=await i.json();Q.accessToken=n,Q.isSignedIn=!0,Q.userName=r.name,Q.email=r.email,await Eo(),An(),Ue(),Te(),await rn(),f?f(`Successfully authenticated as ${r.name}`):console.log(`[Timekeeper] Successfully authenticated as ${r.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let i=n instanceof Error?n.message:"Authentication failed";f?f("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),Ue("error",i);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";f?f("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Ue("error",`Failed to sign in: ${t}`)}}async function ba(){if(!window.opener||window.opener===window)return!1;f&&f("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return f&&f("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),i=n.get("state");if(f&&f("OAuth popup: hash params found, state="+i),i!=="timekeeper_auth")return f&&f("OAuth popup: not our OAuth flow (wrong state)"),!1;let r=n.get("error"),o=n.get("access_token"),l="timekeeper_oauth";if(r){try{let a=new BroadcastChannel(l);a.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||r}),a.close()}catch{let g={type:"timekeeper_oauth_error",error:n.get("error_description")||r,timestamp:Date.now()},c=indexedDB.open("ytls-timestamps-db",3);c.onsuccess=()=>{let v=c.result;v.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:g}),v.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(o){f&&f("OAuth popup: access token found, broadcasting to opener");try{let a=new BroadcastChannel(l);a.postMessage({type:"timekeeper_oauth_token",token:o}),a.close(),f&&f("OAuth popup: token broadcast via BroadcastChannel")}catch(a){f&&f("OAuth popup: BroadcastChannel failed, using IndexedDB",a);let g={type:"timekeeper_oauth_token",token:o,timestamp:Date.now()},c=indexedDB.open("ytls-timestamps-db",3);c.onsuccess=()=>{let v=c.result;v.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:g}),v.close()},f&&f("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function wa(){Q={isSignedIn:!1,accessToken:null,userName:null,email:null},await Eo(),An(),Ue(),Te()}async function _a(){if(!Q.isSignedIn||!Q.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${Q.accessToken}`}});return e.status===401?(await xa({silent:!0}),!1):e.ok}catch(e){return f("Failed to verify auth state:",e,"error"),!1}}async function js(e){let t={Authorization:`Bearer ${e}`},i=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,r=await fetch(i,{headers:t});if(r.status===401)throw new Error("unauthorized");if(!r.ok)throw new Error("drive search failed");let o=await r.json();if(Array.isArray(o.files)&&o.files.length>0)return o.files[0].id;let l=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(l.status===401)throw new Error("unauthorized");if(!l.ok)throw new Error("drive folder create failed");return(await l.json()).id}async function qs(e,t,n){let i=`name='${e}' and '${t}' in parents and trashed=false`,r=encodeURIComponent(i),o=await fetch(`https://www.googleapis.com/drive/v3/files?q=${r}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)return null;let l=await o.json();return l.files&&l.files.length>0?l.files[0].id:null}function Ws(e,t){let n=bo(e),i=t.replace(/\\/g,"/").replace(/^\/+/,"");return i.endsWith(".json")||(i+=".json"),ua({[i]:[n,{level:6,mtime:new Date,os:0}]})}async function Vs(e,t,n,i){let r=e.replace(/\.json$/,".zip"),o=await qs(r,n,i),l=new TextEncoder().encode(t).length,a=Ws(t,e),g=a.length;f(`Compressing data: ${l} bytes -> ${g} bytes (${Math.round(100-g/l*100)}% reduction)`);let c="-------314159265358979",v=`\r
--${c}\r
`,m=`\r
--${c}--`,E=o?{name:r,mimeType:"application/zip"}:{name:r,mimeType:"application/zip",parents:[n]},w=8192,B="";for(let Y=0;Y<a.length;Y+=w){let ue=a.subarray(Y,Math.min(Y+w,a.length));B+=String.fromCharCode.apply(null,Array.from(ue))}let N=btoa(B),G=v+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(E)+v+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+N+m,P,H;o?(P=`https://www.googleapis.com/upload/drive/v3/files/${o}?uploadType=multipart&fields=id,name`,H="PATCH"):(P="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",H="POST");let ee=await fetch(P,{method:H,headers:{Authorization:`Bearer ${i}`,"Content-Type":`multipart/related; boundary=${c}`},body:G});if(ee.status===401)throw new Error("unauthorized");if(!ee.ok)throw new Error("drive upload failed")}async function xa(e){f("Auth expired, clearing token",null,"warn"),Q.isSignedIn=!1,Q.accessToken=null,await Eo(),Ue("error","Authorization expired. Please sign in again."),Te()}async function Ys(e){if(!Q.isSignedIn||!Q.accessToken){e?.silent||Ue("error","Please sign in to Google Drive first");return}try{let{json:t,filename:n,totalVideos:i,totalTimestamps:r}=await va();if(r===0){e?.silent||f("Skipping export: no timestamps to back up");return}let o=await js(Q.accessToken);await Vs(n,t,o,Q.accessToken),f(`Exported to Google Drive (${n}) with ${i} videos / ${r} timestamps.`)}catch(t){throw t.message==="unauthorized"?(await xa({silent:e?.silent}),t):(f("Drive export failed:",t,"error"),e?.silent||Ue("error","Failed to export to Google Drive."),t)}}async function Ta(){try{let e=await Cn("autoBackupEnabled"),t=await Cn("autoBackupIntervalMinutes"),n=await Cn("lastAutoBackupAt");typeof e=="boolean"&&(st=e),typeof t=="number"&&t>0&&(Ve=t),typeof n=="number"&&n>0&&(tt=n)}catch(e){f("Failed to load auto backup settings:",e,"error")}}async function ki(){try{await Dn("autoBackupEnabled",st),await Dn("autoBackupIntervalMinutes",Ve),await Dn("lastAutoBackupAt",tt??0)}catch(e){f("Failed to save auto backup settings:",e,"error")}}function Ks(){xo&&(clearInterval(xo),xo=null),We&&(clearTimeout(We),We=null)}function on(e){try{let t=new Date(e),n=new Date,i=t.toDateString()===n.toDateString(),r=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return i?r:`${t.toLocaleDateString()} ${r}`}catch{return""}}function ka(){return st?nn?"#4285f4":et&&et>0?"#ffa500":Q.isSignedIn&&tt?"#52c41a":Q.isSignedIn?"#ffa500":"#ff4d4f":"#ff4d4f"}function Te(){if(!Le)return;let e="",t="";if(!st)e="\u{1F501} Backup: Off",Le.onmouseenter=null,Le.onmouseleave=null;else if(nn)e="\u{1F501} Backing up\u2026",Le.onmouseenter=null,Le.onmouseleave=null;else if(et&&et>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(et/6e4)}m`,Le.onmouseenter=null,Le.onmouseleave=null;else if(tt){e=`\u{1F5C4}\uFE0F Last backup: ${on(tt)}`;let n=tt+Math.max(1,Ve)*60*1e3;t=`\u{1F5C4}\uFE0F Next backup: ${on(n)}`,Le.onmouseenter=()=>{Le.textContent=t},Le.onmouseleave=()=>{Le.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let n=Date.now()+Math.max(1,Ve)*60*1e3;t=`\u{1F5C4}\uFE0F Next backup: ${on(n)}`,Le.onmouseenter=()=>{Le.textContent=t},Le.onmouseleave=()=>{Le.textContent=e}}Le.textContent=e,Le.style.display=e?"inline":"none";try{let n=ka();Le.style.color=n}catch{}So()}function So(){if(!_o)return;let e=ka();_o.style.backgroundColor=e,Qe(_o,()=>{let t="";if(!st)t="Auto backup is disabled";else if(nn)t="Backup in progress";else if(et&&et>0)t=`Retrying backup in ${Math.ceil(et/6e4)}m`;else if(Q.isSignedIn&&tt){let n=tt+Math.max(1,Ve)*60*1e3,i=on(n);t=`Last backup: ${on(tt)}
Next backup: ${i}`}else if(Q.isSignedIn){let n=Date.now()+Math.max(1,Ve)*60*1e3;t=`No backup yet
Next backup: ${on(n)}`}else t="Not signed in to Google Drive";return t})}async function In(e=!0){if(!Q.isSignedIn||!Q.accessToken){e||Us();return}if(We){f("Auto backup: backoff in progress, skipping scheduled run");return}if(!nn){nn=!0,Te();try{await Ys({silent:e}),tt=Date.now(),tn=0,et=null,We&&(clearTimeout(We),We=null),await ki()}catch(t){if(f("Auto backup failed:",t,"error"),t.message==="unauthorized")f("Auth error detected, clearing token and stopping retries",null,"warn"),Q.isSignedIn=!1,Q.accessToken=null,await Eo(),Ue("error","Authorization expired. Please sign in again."),Te(),tn=0,et=null,We&&(clearTimeout(We),We=null);else if(tn<fa){tn+=1;let r=Math.min(Ns*Math.pow(2,tn-1),Rs);et=r,We&&clearTimeout(We),We=setTimeout(()=>{In(!0)},r),f(`Scheduling backup retry ${tn}/${fa} in ${Math.round(r/1e3)}s`),Te()}else et=null}finally{nn=!1,Te()}}}async function rn(e=!1){if(Ks(),!!st&&!(!Q.isSignedIn||!Q.accessToken)){if(xo=setInterval(()=>{In(!0)},Math.max(1,Ve)*60*1e3),!e){let t=Date.now(),n=Math.max(1,Ve)*60*1e3;(!tt||t-tt>=n)&&In(!0)}Te()}}async function Ea(){st=!st,await ki(),await rn(),Te()}async function Sa(){let e=prompt("Set Auto Backup interval (minutes):",String(Ve));if(e===null)return;let t=Math.floor(Number(e));if(!Number.isFinite(t)||t<5||t>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Ve=t,await ki(),await rn(),Te()}var Ei=window.location.hash;if(Ei&&Ei.length>1){let e=new URLSearchParams(Ei.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let i=new BroadcastChannel("timekeeper_oauth"),r={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:r.type,tokenLength:n.length}),i.postMessage(r),i.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(i){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",i);let r={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()};en("oauth_message",r).then(()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",r.timestamp)}).catch(o=>{console.log("[Timekeeper] Failed to save oauth_message to IndexedDB:",o)})}if(history.replaceState){let i=window.location.pathname+window.location.search;history.replaceState(null,"",i)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(s){return GM.getValue(`timekeeper_${s}`,void 0)}function t(s,u){return GM.setValue(`timekeeper_${s}`,JSON.stringify(u))}if(ko?.(e),To?.(t),await ba()){f("OAuth popup detected, broadcasting token and closing");return}await Ti();let i=["/watch","/live"];function r(s=window.location.href){try{let u=new URL(s);return u.origin!=="https://www.youtube.com"?!1:i.some(p=>u.pathname===p||u.pathname.startsWith(`${p}/`))}catch(u){return f("Timekeeper failed to parse URL for support check:",u,"error"),!1}}let o=null,l=null,a=null,g=null,c=null,v=null,m=null,E=null,w=250,B=null,N=!1;function G(){return o?o.getBoundingClientRect():null}function P(s,u,p){s&&(Ne={x:Math.round(typeof u=="number"?u:s.left),y:Math.round(typeof p=="number"?p:s.top),width:Math.round(s.width),height:Math.round(s.height)})}function H(s=!0){if(!o)return;qt();let u=G();u&&(u.width||u.height)&&(P(u),s&&(en("windowPosition",Ne).catch(p=>f(`Failed to save window position: ${p}`,"error")),an({type:"window_position_updated",position:Ne,timestamp:Date.now()})))}function ee(){if(!o||!l||!g||!a)return;let s=40,u=be();if(u.length>0)s=u[0].offsetHeight;else{let p=document.createElement("li");p.style.visibility="hidden",p.style.position="absolute",p.textContent="00:00 Example",a.appendChild(p),s=p.offsetHeight,a.removeChild(p)}w=l.offsetHeight+g.offsetHeight+s,o.style.minHeight=w+"px"}function Y(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ee(),H(!0)})}function ue(s=450){Se&&(clearTimeout(Se),Se=null),Se=setTimeout(()=>{C(),Y(),Se=null},s)}function me(){Se&&(clearTimeout(Se),Se=null)}function ne(){a&&(a.style.visibility="hidden",f("Hiding timestamps during show animation")),Y(),ue()}function R(){C(),me(),ot&&(clearTimeout(ot),ot=null),ot=setTimeout(()=>{o&&(o.style.display="none",Oi(),ot=null)},400)}function C(){if(!a){Ge&&(Ge(),Ge=null,dt=null,wt=null);return}if(!wt){a.style.visibility==="hidden"&&(a.style.visibility="",f("Restoring timestamp visibility (no deferred fragment)")),Ge&&(Ge(),Ge=null,dt=null);return}f("Appending deferred timestamps after animation"),a.appendChild(wt),wt=null,a.style.visibility==="hidden"&&(a.style.visibility="",f("Restoring timestamp visibility after append")),Ge&&(Ge(),Ge=null,dt=null),at(),Pe(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let s=X(),u=s?Math.floor(s.getCurrentTime()):Ct();Number.isFinite(u)&&$t(u,!1)}let de=null,oe=!1,I="ytls-timestamp-pending-delete",D="ytls-timestamp-highlight",M="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",$="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function L(){let s=u=>{let p=new Image;p.src=u};s(M),s($)}L();async function z(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(s=>setTimeout(s,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(s=>setTimeout(s,100));await new Promise(s=>setTimeout(s,200))}let U=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],te=5e3,pe=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function re(s){return pe.has(s)}function ce(){return document.querySelector("video")}let he=null;function X(){if(he&&document.contains(he))return he;let s=document.getElementById("movie_player");return s&&document.contains(s)?s:null}function fe(s){return U.every(u=>typeof s?.[u]=="function"?!0:re(u)?!!ce():!1)}function Fe(s){return U.filter(u=>typeof s?.[u]=="function"?!1:re(u)?!ce():!0)}async function Ye(s=te){let u=Date.now();for(;Date.now()-u<s;){let _=X();if(fe(_))return _;await new Promise(k=>setTimeout(k,100))}let p=X();return fe(p),p}let ke="timestampOffsetSeconds",Ke=-5,nt="shiftClickTimeSkipSeconds",ct=10,Ut=300,Mt=300,Oe=null;function Si(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Mi(){if(Si()&&!Oe)try{Oe=new BroadcastChannel("ytls_timestamp_channel"),Oe.onmessage=Li}catch(s){f("Failed to create BroadcastChannel:",s,"warn"),Oe=null}}function an(s){if(!Si()){f("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Mi(),!Oe){f("No BroadcastChannel available to post message","warn");return}try{Oe.postMessage(s)}catch(u){f("BroadcastChannel error, reopening:",u,"warn");try{Oe=new BroadcastChannel("ytls_timestamp_channel"),Oe.onmessage=Li,Oe.postMessage(s)}catch(p){f("Failed to reopen BroadcastChannel:",p,"error")}}}function Li(s){if(f("Received message from another tab:",s.data),!(!r()||!a||!o)&&s.data){if(s.data.type==="timestamps_updated"&&s.data.videoId===De)f("Debouncing timestamp load due to external update for video:",s.data.videoId),clearTimeout(ln),ln=setTimeout(()=>{f("Reloading timestamps due to external update for video:",s.data.videoId),zi()},500);else if(s.data.type==="window_position_updated"&&o){let u=s.data.position;if(u&&typeof u.x=="number"&&typeof u.y=="number"){o.style.left=`${u.x}px`,o.style.top=`${u.y}px`,o.style.right="auto",o.style.bottom="auto",typeof u.width=="number"&&u.width>0&&(o.style.width=`${u.width}px`),typeof u.height=="number"&&u.height>0&&(o.style.height=`${u.height}px`);let p=o.getBoundingClientRect();Ne={x:Math.round(u.x),y:Math.round(u.y),width:Math.round(p.width),height:Math.round(p.height)};let _=document.documentElement.clientWidth,k=document.documentElement.clientHeight;(p.left<0||p.top<0||p.right>_||p.bottom>k)&&qt()}}}}Mi();let Gt=await GM.getValue(ke);(typeof Gt!="number"||Number.isNaN(Gt))&&(Gt=Ke,await GM.setValue(ke,Gt));let sn=await GM.getValue(nt);(typeof sn!="number"||Number.isNaN(sn))&&(sn=ct,await GM.setValue(nt,sn));let ln=null,Lt=new Map,$n=!1,Z=null,Bn=null,De=null,ot=null,Se=null,wt=null,dt=null,Ge=null,_t=null,Hn=!1,Ne=null,Mo=!1,Pn=null,zn=null,Fn=null,On=null,Nn=null,Rn=null,Un=null,un=null,cn=null,dn=null,it=null,rt=null,Di=0,fn=!1,Dt=null,mn=null;function be(){return a?Array.from(a.querySelectorAll("li")).filter(s=>!!s.querySelector("a[data-time]")):[]}function Lo(){return be().map(s=>{let u=s.querySelector("a[data-time]"),p=u?.dataset.time;if(!u||!p)return null;let _=Number.parseInt(p,10);if(!Number.isFinite(_))return null;let S=s.querySelector("input")?.value??"",b=s.dataset.guid??crypto.randomUUID();return s.dataset.guid||(s.dataset.guid=b),{start:_,comment:S,guid:b}}).filter(Ii)}function Ct(){if(mn!==null)return mn;let s=be();return mn=s.length>0?Math.max(...s.map(u=>{let p=u.querySelector("a[data-time]")?.getAttribute("data-time");return p?Number.parseInt(p,10):0})):0,mn}function Gn(){mn=null}function Ma(s){let u=s.querySelector(".time-diff");return u?(u.textContent?.trim()||"").startsWith("-"):!1}function La(s,u){return s?u?"\u2514\u2500 ":"\u251C\u2500 ":""}function pn(s){return s.startsWith("\u251C\u2500 ")||s.startsWith("\u2514\u2500 ")?1:0}function Ci(s){return s.replace(/^[├└]─\s/,"")}function Da(s){let u=be();if(s>=u.length-1)return"\u2514\u2500 ";let p=u[s+1].querySelector("input");return p&&pn(p.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function at(){if(!a)return;let s=be(),u=!0,p=0,_=s.length;for(;u&&p<_;)u=!1,p++,s.forEach((k,S)=>{let b=k.querySelector("input");if(!b||!(pn(b.value)===1))return;let F=!1;if(S<s.length-1){let ie=s[S+1].querySelector("input");ie&&(F=!(pn(ie.value)===1))}else F=!0;let q=Ci(b.value),J=`${La(!0,F)}${q}`;b.value!==J&&(b.value=J,u=!0)})}function It(){if(a){for(;a.firstChild;)a.removeChild(a.firstChild);wt&&(wt=null),Ge&&(Ge(),Ge=null,dt=null)}}function hn(){if(!a||oe||wt)return;Array.from(a.children).some(u=>!u.classList.contains("ytls-placeholder")&&!u.classList.contains("ytls-error-message"))||Do("No timestamps for this video")}function Do(s){if(!a)return;It();let u=Hr(s);a.appendChild(u),a.style.overflowY="hidden"}function Co(){if(!a)return;let s=a.querySelector(".ytls-placeholder");s&&s.remove(),a.style.overflowY=""}function Io(s){if(!(!o||!a)){if(oe=s,s)o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),Do("Loading timestamps...");else if(Co(),o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),c){let u=X();if(u){let p=u.getCurrentTime(),_=Number.isFinite(p)?Math.max(0,Math.floor(p)):Math.max(0,Ct()),k=Math.floor(_/3600),S=Math.floor(_/60)%60,b=_%60,{isLive:T}=u.getVideoData()||{isLive:!1},F=a?be().map(K=>{let J=K.querySelector("a[data-time]");return J?parseFloat(J.getAttribute("data-time")??"0"):0}):[],q="";if(F.length>0)if(T){let K=Math.max(1,_/60),J=F.filter(ie=>ie<=_);if(J.length>0){let ie=(J.length/K).toFixed(2);parseFloat(ie)>0&&(q=` (${ie}/min)`)}}else{let K=u.getDuration(),J=Number.isFinite(K)&&K>0?K:0,ie=Math.max(1,J/60),Ce=(F.length/ie).toFixed(1);parseFloat(Ce)>0&&(q=` (${Ce}/min)`)}c.textContent=`\u23F3${k?k+":"+String(S).padStart(2,"0"):S}:${String(b).padStart(2,"0")}${q}`}}!oe&&a&&!a.querySelector(".ytls-error-message")&&hn(),xt()}}function Ii(s){return!!s&&Number.isFinite(s.start)&&typeof s.comment=="string"&&typeof s.guid=="string"}function jn(s,u){s.textContent=kt(u),s.dataset.time=String(u),s.href=qo(u,window.location.href)}let qn=null,Wn=null,At=!1;function Ca(s){if(!s||typeof s.getVideoData!="function"||!s.getVideoData()?.isLive)return!1;if(typeof s.getProgressState=="function"){let p=s.getProgressState(),_=Number(p?.seekableEnd??p?.liveHead??p?.head??p?.duration),k=Number(p?.current??s.getCurrentTime?.());if(Number.isFinite(_)&&Number.isFinite(k))return _-k>2}return!1}function $t(s,u){if(!Number.isFinite(s))return;let p=Vn(s);gn(p,u)}function Vn(s){if(!Number.isFinite(s))return null;let u=be();if(u.length===0)return null;let p=null,_=-1/0;for(let k of u){let b=k.querySelector("a[data-time]")?.dataset.time;if(!b)continue;let T=Number.parseInt(b,10);Number.isFinite(T)&&T<=s&&T>_&&(_=T,p=k)}return p}function gn(s,u=!1){if(!s)return;if(be().forEach(_=>{_.classList.contains(I)||_.classList.remove(D)}),!s.classList.contains(I)&&(s.classList.add(D),u&&!$n))try{if(a instanceof HTMLElement){let _=s.getBoundingClientRect(),k=a.getBoundingClientRect();!(_.bottom<k.top||_.top>k.bottom)||s.scrollIntoView({behavior:"smooth",block:"center"})}else s.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{s.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Ia(s){if(!a||a.querySelector(".ytls-error-message")||!Number.isFinite(s)||s===0)return!1;let u=be();if(u.length===0)return!1;let p=!1;return u.forEach(_=>{let k=_.querySelector("a[data-time]"),S=k?.dataset.time;if(!k||!S)return;let b=Number.parseInt(S,10);if(!Number.isFinite(b))return;let T=Math.max(0,b+s);T!==b&&(jn(k,T),p=!0)}),p?(yn(),at(),Pe(),Kn(De),Dt=null,!0):!1}function Ai(s,u={}){if(!Number.isFinite(s)||s===0)return!1;if(!Ia(s)){if(u.alertOnNoChange){let b=u.failureMessage??"Offset did not change any timestamps.";alert(b)}return!1}let _=u.logLabel??"bulk offset";f(`Timestamps changed: Offset all timestamps by ${s>0?"+":""}${s} seconds (${_})`);let k=X(),S=k?Math.floor(k.getCurrentTime()):0;if(Number.isFinite(S)){let b=Vn(S);gn(b,!1)}return!0}function $i(s){if(!a||oe)return;let u=s.target instanceof HTMLElement?s.target:null;if(u)if(u.dataset.time){s.preventDefault();let p=Number(u.dataset.time);if(Number.isFinite(p)){At=!0;let k=X();k&&k.seekTo(p),setTimeout(()=>{At=!1},500)}let _=u.closest("li");_&&(be().forEach(k=>{k.classList.contains(I)||k.classList.remove(D)}),_.classList.contains(I)||(_.classList.add(D),_.scrollIntoView({behavior:"smooth",block:"center"})))}else if(u.dataset.increment){s.preventDefault();let _=u.parentElement?.querySelector("a[data-time]");if(!_||!_.dataset.time)return;let k=parseInt(_.dataset.time,10),S=parseInt(u.dataset.increment,10);if("shiftKey"in s&&s.shiftKey&&(S*=sn),"altKey"in s?s.altKey:!1){Ai(S,{logLabel:"Alt adjust"});return}let F=Math.max(0,k+S);f(`Timestamps changed: Timestamp time incremented from ${k} to ${F}`),jn(_,F),Gn();let q=u.closest("li");if(Wn=F,qn&&clearTimeout(qn),At=!0,qn=setTimeout(()=>{if(Wn!==null){let K=X();K&&K.seekTo(Wn)}qn=null,Wn=null,setTimeout(()=>{At=!1},500)},500),yn(),at(),Pe(),q){let K=q.querySelector("input"),J=q.dataset.guid;K&&J&&(jt(De,J,F,K.value),Dt=J)}}else u.dataset.action==="clear"&&(s.preventDefault(),f("Timestamps changed: All timestamps cleared from UI"),a.textContent="",Gn(),Pe(),Yn(),Kn(De,{allowEmpty:!0}),Dt=null,hn())}function vn(s,u="",p=!1,_=null,k=!0){if(!a)return null;let S=Math.max(0,s),b=_??crypto.randomUUID(),T=$r(b,S,u,jn),F=T.querySelector('input[data-action="comment"]'),q=T.querySelector("a[data-time]"),K=T.querySelector(".ts-delete"),J=T.querySelector(".time-diff");Gn(),K.__deleteHandler=()=>{let Ce=null,we=null,ge=null,Je=()=>{try{T.removeEventListener("click",we,!0)}catch{}try{document.removeEventListener("click",we,!0)}catch{}if(a)try{a.removeEventListener("mouseleave",ge)}catch{}Ce&&(clearTimeout(Ce),Ce=null)};if(T.dataset.deleteConfirmed==="true"){f("Timestamps changed: Timestamp deleted");let _e=T.dataset.guid??"",xe=Lt.get(_e);xe&&(clearTimeout(xe),Lt.delete(_e)),Je(),T.remove(),Gn(),yn(),at(),Pe(),Yn(),Aa(De,_e),Dt=null,hn()}else{T.dataset.deleteConfirmed="true",T.classList.add(I),T.classList.remove(D);let _e=()=>{T.dataset.deleteConfirmed="false",T.classList.remove(I);let xe=X(),Ze=xe?xe.getCurrentTime():0,lt=Number.parseInt(T.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(Ze)&&Number.isFinite(lt)&&Ze>=lt&&T.classList.add(D),Je()};we=xe=>{xe.target!==K&&_e()},ge=()=>{T.dataset.deleteConfirmed==="true"&&_e()},T.addEventListener("click",we,!0),document.addEventListener("click",we,!0),a&&a.addEventListener("mouseleave",ge),Ce=setTimeout(()=>{T.dataset.deleteConfirmed==="true"&&_e(),Je()},5e3)}};let ie=Number.parseInt(q.dataset.time??"0",10);if(k){Co();let Ce=!1,we=be();for(let ge=0;ge<we.length;ge++){let Je=we[ge],xe=Je.querySelector("a[data-time]")?.dataset.time;if(!xe)continue;let Ze=Number.parseInt(xe,10);if(Number.isFinite(Ze)&&ie<Ze){a.insertBefore(T,Je),Ce=!0;let lt=we[ge-1];if(lt){let Jn=lt.querySelector("a[data-time]")?.dataset.time;if(Jn){let wn=Number.parseInt(Jn,10);Number.isFinite(wn)&&(J.textContent=kt(ie-wn))}}else J.textContent="";let Bt=Je.querySelector(".time-diff");Bt&&(Bt.textContent=kt(Ze-ie));break}}if(!Ce&&(a.appendChild(T),we.length>0)){let _e=we[we.length-1].querySelector("a[data-time]")?.dataset.time;if(_e){let xe=Number.parseInt(_e,10);Number.isFinite(xe)&&(J.textContent=kt(ie-xe))}}T.scrollIntoView({behavior:"smooth",block:"center"}),Yn(),at(),Pe(),p||(jt(De,b,S,u),Dt=b,gn(T,!1))}else F.__ytls_li=T;return F}function yn(){if(!a||a.querySelector(".ytls-error-message"))return;let s=be();s.forEach((u,p)=>{let _=u.querySelector(".time-diff");if(!_)return;let S=u.querySelector("a[data-time]")?.dataset.time;if(!S){_.textContent="";return}let b=Number.parseInt(S,10);if(!Number.isFinite(b)){_.textContent="";return}if(p===0){_.textContent="";return}let q=s[p-1].querySelector("a[data-time]")?.dataset.time;if(!q){_.textContent="";return}let K=Number.parseInt(q,10);if(!Number.isFinite(K)){_.textContent="";return}let J=b-K,ie=J<0?"-":"";_.textContent=` ${ie}${kt(Math.abs(J))}`})}function Bi(){if(!a||a.querySelector(".ytls-error-message")||oe)return;let s=null;if(document.activeElement instanceof HTMLInputElement&&a.contains(document.activeElement)){let b=document.activeElement,F=b.closest("li")?.dataset.guid;if(F){let q=b.selectionStart??b.value.length,K=b.selectionEnd??q,J=b.scrollLeft;s={guid:F,start:q,end:K,scroll:J}}}let u=be();if(u.length===0)return;let p=u.map(b=>b.dataset.guid),_=u.map(b=>{let T=b.querySelector("a[data-time]"),F=T?.dataset.time;if(!T||!F)return null;let q=Number.parseInt(F,10);if(!Number.isFinite(q))return null;let K=b.dataset.guid??"";return{time:q,guid:K,element:b}}).filter(b=>b!==null).sort((b,T)=>{let F=b.time-T.time;return F!==0?F:b.guid.localeCompare(T.guid)}),k=_.map(b=>b.guid),S=p.length!==k.length||p.some((b,T)=>b!==k[T]);for(;a.firstChild;)a.removeChild(a.firstChild);if(_.forEach(b=>{a.appendChild(b.element)}),yn(),at(),Pe(),s){let T=be().find(F=>F.dataset.guid===s.guid)?.querySelector("input");if(T)try{T.focus({preventScroll:!0})}catch{}}S&&(f("Timestamps changed: Timestamps sorted"),Kn(De))}function Yn(){if(!a||!o||!l||!g)return;let s=be().length;typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea();let u=o.getBoundingClientRect(),p=l.getBoundingClientRect(),_=g.getBoundingClientRect(),k=Math.max(0,u.height-(p.height+_.height));s===0?(hn(),a.style.overflowY="hidden"):a.style.overflowY=a.scrollHeight>k?"auto":"hidden"}function Pe(){if(!a)return;let s=ce(),u=document.querySelector(".ytp-progress-bar"),p=X(),_=p?p.getVideoData():null,k=!!_&&!!_.isLive;if(!s||!u||!isFinite(s.duration)||k)return;Pi(),be().map(b=>{let T=b.querySelector("a[data-time]"),F=T?.dataset.time;if(!T||!F)return null;let q=Number.parseInt(F,10);if(!Number.isFinite(q))return null;let J=b.querySelector("input")?.value??"",ie=b.dataset.guid??crypto.randomUUID();return b.dataset.guid||(b.dataset.guid=ie),{start:q,comment:J,guid:ie}}).filter(Ii).forEach(b=>{if(!Number.isFinite(b.start))return;let T=document.createElement("div");T.className="ytls-marker",T.style.position="absolute",T.style.height="100%",T.style.width="2px",T.style.backgroundColor="#ff0000",T.style.cursor="pointer",T.style.left=b.start/s.duration*100+"%",T.dataset.time=String(b.start),T.addEventListener("click",()=>{let F=X();F&&F.seekTo(b.start)}),u.appendChild(T)})}function Kn(s,u={}){if(!a||a.querySelector(".ytls-error-message")||!s)return;if(oe){f("Save blocked: timestamps are currently loading");return}at();let p=Lo().sort((_,k)=>_.start-k.start);if(p.length===0&&!u.allowEmpty){f("Save skipped: no timestamps to save");return}di(s,p).then(()=>f(`Successfully saved ${p.length} timestamps for ${s} to IndexedDB`)).catch(_=>f(`Failed to save timestamps for ${s} to IndexedDB:`,_,"error")),an({type:"timestamps_updated",videoId:s,action:"saved"})}function jt(s,u,p,_){if(!s||oe)return;let k={guid:u,start:p,comment:_};f(`Saving timestamp: guid=${u}, start=${p}, comment="${_}"`),Gr(s,k).catch(S=>f(`Failed to save timestamp ${u}:`,S,"error")),an({type:"timestamps_updated",videoId:s,action:"saved"})}function Aa(s,u){!s||oe||(f(`Deleting timestamp: guid=${u}`),jr(s,u).catch(p=>f(`Failed to delete timestamp ${u}:`,p,"error")),an({type:"timestamps_updated",videoId:s,action:"saved"}))}async function Hi(s){if(!a||a.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let u=De;if(!u)return;f(`Exporting timestamps for video ID: ${u}`);let p=Lo(),_=Math.max(Ct(),0),k=Jt();if(s==="json"){let S=new Blob([JSON.stringify(p,null,2)],{type:"application/json"}),b=URL.createObjectURL(S),T=document.createElement("a");T.href=b,T.download=`timestamps-${u}-${k}.json`,T.click(),URL.revokeObjectURL(b)}else if(s==="text"){let S=p.map(q=>{let K=kt(q.start,_),J=`${q.comment} <!-- guid:${q.guid} -->`.trimStart();return`${K} ${J}`}).join(`
`),b=new Blob([S],{type:"text/plain"}),T=URL.createObjectURL(b),F=document.createElement("a");F.href=T,F.download=`timestamps-${u}-${k}.txt`,F.click(),URL.revokeObjectURL(T)}}function Ao(s){if(!o||!a){f("Timekeeper error:",s,"error");return}It();let u=Br(s);a.appendChild(u),Pe()}function Pi(){document.querySelectorAll(".ytls-marker").forEach(s=>s.remove())}function qt(){if(!o||!document.body.contains(o))return;let s=o.getBoundingClientRect(),u=document.documentElement.clientWidth,p=document.documentElement.clientHeight,_=s.width,k=s.height;if(s.left<0&&(o.style.left="0",o.style.right="auto"),s.right>u){let S=Math.max(0,u-_);o.style.left=`${S}px`,o.style.right="auto"}if(s.top<0&&(o.style.top="0",o.style.bottom="auto"),s.bottom>p){let S=Math.max(0,p-k);o.style.top=`${S}px`,o.style.bottom="auto"}}function $a(){if(Pn&&(document.removeEventListener("mousemove",Pn),Pn=null),zn&&(document.removeEventListener("mouseup",zn),zn=null),un&&(document.removeEventListener("keydown",un),un=null),Fn&&(window.removeEventListener("resize",Fn),Fn=null),cn&&(document.removeEventListener("pointerdown",cn,!0),cn=null),dn&&(document.removeEventListener("pointerup",dn,!0),dn=null),it){try{it.disconnect()}catch{}it=null}if(rt){try{rt.disconnect()}catch{}rt=null}let s=ce();s&&(On&&(s.removeEventListener("timeupdate",On),On=null),Nn&&(s.removeEventListener("pause",Nn),Nn=null),Rn&&(s.removeEventListener("play",Rn),Rn=null),Un&&(s.removeEventListener("seeking",Un),Un=null))}function Ba(){Pi(),Lt.forEach(u=>clearTimeout(u)),Lt.clear(),ln&&(clearTimeout(ln),ln=null),de&&(clearInterval(de),de=null),ot&&(clearTimeout(ot),ot=null),$a();try{Oe.close()}catch{}if(Z&&Z.parentNode===document.body&&document.body.removeChild(Z),Z=null,Bn=null,$n=!1,De=null,it){try{it.disconnect()}catch{}it=null}if(rt){try{rt.disconnect()}catch{}rt=null}o&&o.parentNode&&o.remove();let s=document.getElementById("ytls-header-button");s&&s.parentNode&&s.remove(),_t=null,Hn=!1,Ne=null,It(),o=null,l=null,a=null,g=null,c=null,v=null,m=null,he=null}async function Ha(){let s=$o();if(!s)return he=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let u=await Ye();if(!fe(u)){let p=Fe(u),_=p.length?` Missing methods: ${p.join(", ")}.`:"",k=u?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return he=null,{ok:!1,message:`${k}${_} Try refreshing once playback is ready.`}}return he=u,{ok:!0,player:u,videoId:s}}async function zi(){if(!o||!a)return;let s=a.scrollTop,u=!0,p=()=>{if(!a||!u)return;let _=Math.max(0,a.scrollHeight-a.clientHeight);a.scrollTop=Math.min(s,_)};try{let _=await Ha();if(!_.ok){Ao(_.message),It(),Pe();return}let{videoId:k}=_,S=[];try{let b=await qr(k);b?(S=b.map(T=>({...T,guid:T.guid||crypto.randomUUID()})),f(`Loaded ${S.length} timestamps from IndexedDB for ${k}`)):f(`No timestamps found in IndexedDB for ${k}`)}catch(b){f(`Failed to load timestamps from IndexedDB for ${k}:`,b,"error"),Ao("Failed to load timestamps from IndexedDB. Try refreshing the page."),Pe();return}if(S.length>0){S=S.sort((K,J)=>K.start-J.start),It(),Co();let b=document.createDocumentFragment();S.forEach(K=>{let ie=vn(K.start,K.comment,!0,K.guid,!1).__ytls_li;ie&&b.appendChild(ie)}),o&&o.classList.contains("ytls-zoom-in")&&Se!=null?(f("Deferring timestamp DOM append until show animation completes"),wt=b,dt||(dt=new Promise(K=>{Ge=K})),await dt):a&&(a.appendChild(b),at(),Pe(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let F=X(),q=F?Math.floor(F.getCurrentTime()):Ct();Number.isFinite(q)&&($t(q,!1),u=!1)}else It(),Do("No timestamps for this video"),Pe(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(_){f("Unexpected error while loading timestamps:",_,"error"),Ao("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{dt&&await dt,requestAnimationFrame(p),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),a&&!a.querySelector(".ytls-error-message")&&hn()}}function $o(){let u=new URLSearchParams(location.search).get("v");if(u)return u;let p=document.querySelector('meta[itemprop="identifier"]');return p?.content?p.content:null}function Pa(){let s=ce();if(!s)return;let u=()=>{if(!a)return;let b=X(),T=b?Math.floor(b.getCurrentTime()):0;if(!Number.isFinite(T))return;let F=Vn(T);gn(F,!1)},p=b=>{try{let T=new URL(window.location.href);b!==null&&Number.isFinite(b)?T.searchParams.set("t",`${Math.floor(b)}s`):T.searchParams.delete("t"),window.history.replaceState({},"",T.toString())}catch{}},_=()=>{let b=X(),T=b?Math.floor(b.getCurrentTime()):NaN;if(Number.isFinite(T)){p(T);try{$t(T,!0)}catch(F){f("Failed to highlight nearest timestamp on pause:",F,"warn")}}},k=()=>{p(null);try{let b=X(),T=b?Math.floor(b.getCurrentTime()):NaN;Number.isFinite(T)&&$t(T,!0)}catch(b){f("Failed to highlight nearest timestamp on play:",b,"warn")}},S=()=>{let b=ce();if(!b)return;let T=X(),F=T?Math.floor(T.getCurrentTime()):0;if(!Number.isFinite(F))return;b.paused&&p(F);let q=Vn(F);gn(q,!0)};On=u,Nn=_,Rn=k,Un=S,s.addEventListener("timeupdate",u),s.addEventListener("pause",_),s.addEventListener("play",k),s.addEventListener("seeking",S)}async function Fi(){let s={},u=await ci("timestamps_v2"),p=new Map;for(let S of u){let b=S;p.has(b.video_id)||p.set(b.video_id,[]),p.get(b.video_id).push({guid:b.guid,start:b.start,comment:b.comment})}for(let[S,b]of p)s[`ytls-${S}`]={video_id:S,timestamps:b.sort((T,F)=>T.start-F.start)};return{json:JSON.stringify(s,null,2),filename:"timekeeper-data.json",totalVideos:p.size,totalTimestamps:u.length}}async function za(){try{let{json:s,filename:u,totalVideos:p,totalTimestamps:_}=await Fi(),k=new Blob([s],{type:"application/json"}),S=URL.createObjectURL(k),b=document.createElement("a");b.href=S,b.download=u,b.click(),URL.revokeObjectURL(S),f(`Exported ${p} videos with ${_} timestamps`)}catch(s){throw f("Failed to export data:",s,"error"),s}}async function Fa(){let s=await ci("timestamps_v2");if(!Array.isArray(s)||s.length===0){let q=`Tag,Timestamp,URL
`,K=`timestamps-${Jt()}.csv`;return{csv:q,filename:K,totalVideos:0,totalTimestamps:0}}let u=new Map;for(let q of s)u.has(q.video_id)||u.set(q.video_id,[]),u.get(q.video_id).push({start:q.start,comment:q.comment});let p=[];p.push("Tag,Timestamp,URL");let _=0,k=q=>`"${String(q).replace(/"/g,'""')}"`,S=q=>{let K=Math.floor(q/3600),J=Math.floor(q%3600/60),ie=String(q%60).padStart(2,"0");return`${String(K).padStart(2,"0")}:${String(J).padStart(2,"0")}:${ie}`},b=Array.from(u.keys()).sort();for(let q of b){let K=u.get(q).sort((J,ie)=>J.start-ie.start);for(let J of K){let ie=J.comment,Ce=S(J.start),we=qo(J.start,`https://www.youtube.com/watch?v=${q}`);p.push([k(ie),k(Ce),k(we)].join(",")),_++}}let T=p.join(`
`),F=`timestamps-${Jt()}.csv`;return{csv:T,filename:F,totalVideos:u.size,totalTimestamps:_}}async function Oa(){try{let{csv:s,filename:u,totalVideos:p,totalTimestamps:_}=await Fa(),k=new Blob([s],{type:"text/csv;charset=utf-8;"}),S=URL.createObjectURL(k),b=document.createElement("a");b.href=S,b.download=u,b.click(),URL.revokeObjectURL(S),f(`Exported ${p} videos with ${_} timestamps (CSV)`)}catch(s){throw f("Failed to export CSV data:",s,"error"),s}}function Oi(){if(!o)return;let s=o.style.display!=="none";en("uiVisible",s).catch(u=>f(`Failed to save UI visibility state: ${u}`,"error"))}function xt(s){let u=typeof s=="boolean"?s:!!o&&o.style.display!=="none",p=document.getElementById("ytls-header-button");p instanceof HTMLButtonElement&&p.setAttribute("aria-pressed",String(u)),_t&&!Hn&&_t.src!==M&&(_t.src=M)}async function Na(){if(!o)return;let u=await vo("uiVisible");typeof u=="boolean"?(u?(o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in")):o.style.display="none",xt(u)):(o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),xt(!0))}function Bo(s){if(!o){f("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(o)||(f("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(k=>{k!==o&&k.remove()}),document.body.appendChild(o));let u=document.querySelectorAll("#ytls-pane");u.length>1&&(f(`ERROR: Multiple panes detected in togglePaneVisibility (${u.length}), cleaning up`),u.forEach(k=>{k!==o&&k.remove()})),ot&&(clearTimeout(ot),ot=null);let p=o.style.display==="none";(typeof s=="boolean"?s:p)?(o.style.display="flex",o.classList.remove("ytls-fade-out"),o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),xt(!0),Oi(),ne(),Se&&(clearTimeout(Se),Se=null),Se=setTimeout(()=>{C(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ee(),H(!0);try{let k=X(),S=k?Math.floor(k.getCurrentTime()):NaN;Number.isFinite(S)&&$t(S,!0)}catch(k){f("Failed to scroll to nearest timestamp after toggle:",k,"warn")}Se=null},450)):(o.classList.remove("ytls-fade-in"),o.classList.remove("ytls-zoom-in"),o.classList.add("ytls-zoom-out"),xt(!1),R())}function Ni(s){if(!a){f("UI is not initialized; cannot import timestamps.","warn");return}let u=!1;try{let p=JSON.parse(s),_=null;if(Array.isArray(p))_=p;else if(typeof p=="object"&&p!==null){let k=De;if(k){let S=`timekeeper-${k}`;p[S]&&Array.isArray(p[S].timestamps)&&(_=p[S].timestamps,f(`Found timestamps for current video (${k}) in export format`,"info"))}if(!_){let S=Object.keys(p).filter(b=>b.startsWith("ytls-"));if(S.length===1&&Array.isArray(p[S[0]].timestamps)){_=p[S[0]].timestamps;let b=p[S[0]].video_id;f(`Found timestamps for video ${b} in export format`,"info")}}}_&&Array.isArray(_)?_.every(S=>typeof S.start=="number"&&typeof S.comment=="string")?(_.forEach(S=>{if(S.guid){let b=be().find(T=>T.dataset.guid===S.guid);if(b){let T=b.querySelector("input");T&&(T.value=S.comment)}else vn(S.start,S.comment,!1,S.guid)}else vn(S.start,S.comment,!1,crypto.randomUUID())}),u=!0):f("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):f("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!u){let p=s.split(`
`).map(_=>_.trim()).filter(_=>_);if(p.length>0){let _=!1;p.forEach(k=>{let S=k.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(S){_=!0;let b=parseInt(S[1])||0,T=parseInt(S[2]),F=parseInt(S[3]),q=b*3600+T*60+F,K=S[4]?S[4].trim():"",J=null,ie=K,Ce=K.match(/<!--\s*guid:([^>]+?)\s*-->/);Ce&&(J=Ce[1].trim(),ie=K.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let we;if(J&&(we=be().find(ge=>ge.dataset.guid===J)),!we&&!J&&(we=be().find(ge=>{if(ge.dataset.guid)return!1;let _e=ge.querySelector("a[data-time]")?.dataset.time;if(!_e)return!1;let xe=Number.parseInt(_e,10);return Number.isFinite(xe)&&xe===q})),we){let ge=we.querySelector("input");ge&&(ge.value=ie)}else vn(q,ie,!1,J||crypto.randomUUID())}}),_&&(u=!0)}}u?(f("Timestamps changed: Imported timestamps from file/clipboard"),at(),Kn(De),Pe(),Yn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Ra(){if(Mo){f("Pane initialization already in progress, skipping duplicate call");return}if(!(o&&document.body.contains(o))){Mo=!0;try{let _=function(){if(oe||At)return;let h=ce(),d=X();if(!h&&!d)return;let y=d?d.getCurrentTime():0,x=Number.isFinite(y)?Math.max(0,Math.floor(y)):Math.max(0,Ct()),A=Math.floor(x/3600),O=Math.floor(x/60)%60,j=x%60,{isLive:W}=d?d.getVideoData()||{isLive:!1}:{isLive:!1},V=d?Ca(d):!1,se=a?be().map(ae=>{let Me=ae.querySelector("a[data-time]");return Me?parseFloat(Me.getAttribute("data-time")??"0"):0}):[],Ie="";if(se.length>0)if(W){let ae=Math.max(1,x/60),Me=se.filter(Ae=>Ae<=x);if(Me.length>0){let Ae=(Me.length/ae).toFixed(2);parseFloat(Ae)>0&&(Ie=` (${Ae}/min)`)}}else{let ae=d?d.getDuration():0,Me=Number.isFinite(ae)&&ae>0?ae:h&&Number.isFinite(h.duration)&&h.duration>0?h.duration:0,Ae=Math.max(1,Me/60),ft=(se.length/Ae).toFixed(1);parseFloat(ft)>0&&(Ie=` (${ft}/min)`)}c.textContent=`\u23F3${A?A+":"+String(O).padStart(2,"0"):O}:${String(j).padStart(2,"0")}${Ie}`,c.style.color=V?"#ff4d4f":"",se.length>0&&$t(x,!1)},ge=function(h,d,y){let x=document.createElement("button");return x.textContent=h,Qe(x,d),x.classList.add("ytls-settings-modal-button"),x.onclick=y,x},Je=function(h="general"){if(Z&&Z.parentNode===document.body){let He=document.getElementById("ytls-save-modal"),Tt=document.getElementById("ytls-load-modal"),mt=document.getElementById("ytls-delete-all-modal");He&&document.body.contains(He)&&document.body.removeChild(He),Tt&&document.body.contains(Tt)&&document.body.removeChild(Tt),mt&&document.body.contains(mt)&&document.body.removeChild(mt),Z.classList.remove("ytls-fade-in"),Z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Z)&&document.body.removeChild(Z),Z=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",_e)},300);return}Z=document.createElement("div"),Z.id="ytls-settings-modal",Z.classList.remove("ytls-fade-out"),Z.classList.add("ytls-fade-in");let d=document.createElement("div");d.className="ytls-modal-header";let y=document.createElement("div");y.id="ytls-settings-nav";let x=document.createElement("button");x.className="ytls-modal-close-button",x.textContent="\u2715",x.onclick=()=>{if(Z&&Z.parentNode===document.body){let He=document.getElementById("ytls-save-modal"),Tt=document.getElementById("ytls-load-modal"),mt=document.getElementById("ytls-delete-all-modal");He&&document.body.contains(He)&&document.body.removeChild(He),Tt&&document.body.contains(Tt)&&document.body.removeChild(Tt),mt&&document.body.contains(mt)&&document.body.removeChild(mt),Z.classList.remove("ytls-fade-in"),Z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Z)&&document.body.removeChild(Z),Z=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",_e)},300)}};let A=document.createElement("div");A.id="ytls-settings-content";let O=document.createElement("h3");O.className="ytls-section-heading",O.textContent="General",O.style.display="none";let j=document.createElement("div"),W=document.createElement("div");W.className="ytls-button-grid";function V(He){j.style.display=He==="general"?"block":"none",W.style.display=He==="drive"?"block":"none",se.classList.toggle("active",He==="general"),ae.classList.toggle("active",He==="drive"),O.textContent=He==="general"?"General":"Google Drive"}let se=document.createElement("button");se.textContent="\u{1F6E0}\uFE0F";let Ie=document.createElement("span");Ie.className="ytls-tab-text",Ie.textContent=" General",se.appendChild(Ie),Qe(se,"General settings"),se.classList.add("ytls-settings-modal-button"),se.onclick=()=>V("general");let ae=document.createElement("button");ae.textContent="\u2601\uFE0F";let Me=document.createElement("span");Me.className="ytls-tab-text",Me.textContent=" Backup",ae.appendChild(Me),Qe(ae,"Google Drive sign-in and backup"),ae.classList.add("ytls-settings-modal-button"),ae.onclick=async()=>{Q.isSignedIn&&await _a(),V("drive")},y.appendChild(se),y.appendChild(ae),d.appendChild(y),d.appendChild(x),Z.appendChild(d),j.className="ytls-button-grid",j.appendChild(ge("\u{1F4BE} Save","Save As...",Ze.onclick)),j.appendChild(ge("\u{1F4C2} Load","Load",lt.onclick)),j.appendChild(ge("\u{1F4E4} Export All","Export All Data",Bt.onclick)),j.appendChild(ge("\u{1F4E5} Import All","Import All Data",bn.onclick)),j.appendChild(ge("\u{1F4C4} Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await Oa()}catch{alert("Failed to export CSV: Could not read from database.")}}));let Ae=ge(Q.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",Q.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{Q.isSignedIn?await wa():await ya(),Ae.textContent=Q.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",Qe(Ae,Q.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),typeof Te=="function"&&Te()});W.appendChild(Ae);let ft=ge(st?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await Ea(),ft.textContent=st?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off",typeof Te=="function"&&Te()});W.appendChild(ft);let Pt=ge(`\u23F1\uFE0F Backup Interval: ${Ve}min`,"Set periodic backup interval (minutes)",async()=>{await Sa(),Pt.textContent=`\u23F1\uFE0F Backup Interval: ${Ve}min`,typeof Te=="function"&&Te()});W.appendChild(Pt),W.appendChild(ge("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await In(!1),typeof Te=="function"&&Te()}));let je=document.createElement("div");je.style.marginTop="15px",je.style.paddingTop="10px",je.style.borderTop="1px solid #555",je.style.fontSize="12px",je.style.color="#aaa";let zt=document.createElement("div");zt.style.marginBottom="8px",zt.style.fontWeight="bold",je.appendChild(zt),ha(zt);let No=document.createElement("div");No.style.marginBottom="8px",ma(No),je.appendChild(No);let Vi=document.createElement("div");pa(Vi),je.appendChild(Vi),W.appendChild(je),Ue(),An(),Te(),A.appendChild(O),A.appendChild(j),A.appendChild(W),V(h),Z.appendChild(A),document.body.appendChild(Z),requestAnimationFrame(()=>{let He=Z.getBoundingClientRect(),mt=(window.innerHeight-He.height)/2;Z.style.top=`${Math.max(20,mt)}px`,Z.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",xe,!0),document.addEventListener("keydown",_e)},0)},_e=function(h){if(h.key==="Escape"&&Z&&Z.parentNode===document.body){let d=document.getElementById("ytls-save-modal"),y=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");if(d||y||x)return;h.preventDefault(),d&&document.body.contains(d)&&document.body.removeChild(d),y&&document.body.contains(y)&&document.body.removeChild(y),x&&document.body.contains(x)&&document.body.removeChild(x),Z.classList.remove("ytls-fade-in"),Z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Z)&&document.body.removeChild(Z),Z=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",_e)},300)}},xe=function(h){if(Bn&&Bn.contains(h.target))return;let d=document.getElementById("ytls-save-modal"),y=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");d&&d.contains(h.target)||y&&y.contains(h.target)||x&&x.contains(h.target)||Z&&Z.contains(h.target)||(d&&document.body.contains(d)&&document.body.removeChild(d),y&&document.body.contains(y)&&document.body.removeChild(y),x&&document.body.contains(x)&&document.body.removeChild(x),Z&&Z.parentNode===document.body&&(Z.classList.remove("ytls-fade-in"),Z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Z)&&document.body.removeChild(Z),Z=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",_e)},300)))},Jn=function(){o&&(f("Loading window position from IndexedDB"),vo("windowPosition").then(h=>{let d=h;if(d&&typeof d.x=="number"&&typeof d.y=="number"){o.style.left=`${d.x}px`,o.style.top=`${d.y}px`,o.style.right="auto",o.style.bottom="auto",typeof d.width=="number"&&d.width>0?o.style.width=`${d.width}px`:(o.style.width=`${Ut}px`,f(`No stored window width found, using default width ${Ut}px`)),typeof d.height=="number"&&d.height>0?o.style.height=`${d.height}px`:(o.style.height=`${Mt}px`,f(`No stored window height found, using default height ${Mt}px`));let x=G();P(x,d.x,d.y),f("Restored window position from IndexedDB:",Ne)}else f("No window position found in IndexedDB, applying default size and leaving default position"),o.style.width=`${Ut}px`,o.style.height=`${Mt}px`,Ne=null;qt();let y=G();y&&(y.width||y.height)&&P(y),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(h=>{f("failed to load pane position from IndexedDB:",h,"warn"),qt();let d=G();d&&(d.width||d.height)&&(Ne={x:Math.max(0,Math.round(d.left)),y:0,width:Math.round(d.width),height:Math.round(d.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},wn=function(){if(!o)return;let h=G();if(!h)return;let d={x:Math.max(0,Math.round(h.left)),y:Math.max(0,Math.round(h.top)),width:Math.round(h.width),height:Math.round(h.height)};if(Ne&&Ne.x===d.x&&Ne.y===d.y&&Ne.width===d.width&&Ne.height===d.height){f("Skipping window position save; position and size unchanged");return}Ne={...d},f(`Saving window position and size to IndexedDB: x=${d.x}, y=${d.y}, width=${d.width}, height=${d.height}`),en("windowPosition",d).catch(y=>f(`Failed to save window position: ${y}`,"error")),an({type:"window_position_updated",position:d,timestamp:Date.now()})},eo=function(h,d){h.addEventListener("dblclick",y=>{y.preventDefault(),y.stopPropagation(),o&&(o.style.width="300px",o.style.height="300px",wn(),_n())}),h.addEventListener("mousedown",y=>{y.preventDefault(),y.stopPropagation(),Vt=!0,Ht=d,qi=y.clientX,Wi=y.clientY;let x=o.getBoundingClientRect();Yt=x.width,Kt=x.height,Xn=x.left,Qn=x.top,d==="top-left"||d==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},_n=function(){if(o&&l&&g&&a){let h=o.getBoundingClientRect(),d=l.getBoundingClientRect(),y=g.getBoundingClientRect(),x=h.height-(d.height+y.height);a.style.maxHeight=x>0?x+"px":"0px",a.style.overflowY=x>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(h=>h.remove()),o=document.createElement("div"),l=document.createElement("div"),a=document.createElement("ul"),g=document.createElement("div"),c=document.createElement("span"),v=document.createElement("style"),m=document.createElement("span"),E=document.createElement("span"),E.classList.add("ytls-backup-indicator"),E.style.cursor="pointer",E.style.backgroundColor="#666",E.onclick=h=>{h.stopPropagation(),Je("drive")},a.addEventListener("mouseenter",()=>{$n=!0,fn=!1}),a.addEventListener("mouseleave",()=>{if($n=!1,fn)return;let h=X(),d=h?Math.floor(h.getCurrentTime()):Ct();$t(d,!1);let y=null;if(document.activeElement instanceof HTMLInputElement&&a.contains(document.activeElement)&&(y=document.activeElement.closest("li")?.dataset.guid??null),Bi(),y){let A=be().find(O=>O.dataset.guid===y)?.querySelector("input");if(A)try{A.focus({preventScroll:!0})}catch{}}}),ze("li .ts-button","mouseenter",h=>{let d=h.target;d.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"},{base:a}),ze("li .ts-button","mouseleave",h=>{let d=h.target;d.style.textShadow="none"},{base:a}),ze("li .ts-delete","mouseenter",h=>{let d=h.target;d.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"},{base:a}),ze("li","mouseenter",h=>{let d=h.target,y=d.querySelector(".indent-toggle");if(y){let x=d.querySelector('input[data-action="comment"]');if(x){let A=pn(x.value);y.textContent=A===1?"\u25C0":"\u25B6"}y.style.display="inline"}},{base:a}),ze("li","mouseleave",h=>{let d=h.target,y=d.querySelector(".indent-toggle");y&&(y.style.display="none"),d.dataset.guid===Dt&&Ma(d)&&Bi()},{base:a}),ze('[data-action="toggle-indent"]',"click",h=>{h.stopPropagation();let d=h.target,y=d.closest("li");if(!y)return;let x=y.querySelector('input[data-action="comment"]'),A=y.querySelector("a[data-time]");if(!x||!A)return;let O=pn(x.value),j=Ci(x.value),W=O===0?1:0,V="";if(W===1){let Ae=be().indexOf(y);V=Da(Ae)}x.value=`${V}${j}`;let se=d.querySelector(".indent-toggle");se&&(se.textContent=W===1?"\u25C0":"\u25B6"),at();let Ie=Number.parseInt(A.dataset.time??"0",10),ae=y.dataset.guid;ae&&jt(De,ae,Ie,x.value)},{base:a}),ze('[data-action="comment"]',"focusin",()=>{fn=!1},{base:a}),ze('[data-action="comment"]',"focusout",h=>{let d=h.relatedTarget,y=Date.now()-Di<250,x=!!d&&!!o&&o.contains(d);if(!y&&!x){fn=!0;let A=h.target;setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(A.focus({preventScroll:!0}),fn=!1)},0)}},{base:a}),ze('[data-action="comment"]',"input",h=>{let d=h;if(d&&(d.isComposing||d.inputType==="insertCompositionText"))return;let y=h.target,x=y.closest("li");if(!x)return;let A=x.dataset.guid;if(!A)return;let O=Lt.get(A);O&&clearTimeout(O);let j=setTimeout(()=>{let W=x.querySelector("a[data-time]"),V=Number.parseInt(W?.dataset.time??"0",10);jt(De,A,V,y.value),Lt.delete(A)},500);Lt.set(A,j)},{base:a}),ze('[data-action="comment"]',"compositionend",h=>{let d=h.target,y=d.closest("li");if(!y)return;let x=y.dataset.guid;x&&setTimeout(()=>{let A=y.querySelector("a[data-time]"),O=Number.parseInt(A?.dataset.time??"0",10);jt(De,x,O,d.value)},50)},{base:a}),ze('[data-action="record"]',"click",h=>{let y=h.target.closest("li");if(!y)return;let x=y.querySelector("a[data-time]"),A=y.querySelector('input[data-action="comment"]'),O=y.dataset.guid;if(!x||!A||!O)return;let j=X(),W=j?Math.floor(j.getCurrentTime()):0;Number.isFinite(W)&&(f(`Timestamps changed: set to current playback time ${W}`),jn(x,W),yn(),at(),jt(De,O,W,A.value),Dt=O)},{base:a}),ze('[data-action="delete"]',"click",h=>{let d=h.target;if(!d.closest("li"))return;let x=d.__deleteHandler;x&&x()},{base:a}),o.id="ytls-pane",l.id="ytls-pane-header",l.addEventListener("dblclick",h=>{let d=h.target instanceof HTMLElement?h.target:null;d&&(d.closest("a")||d.closest("button")||d.closest("#ytls-current-time")||d.closest(".ytls-version-display")||d.closest(".ytls-backup-indicator"))||(h.preventDefault(),Bo(!1))});let s=h=>{try{h.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(h=>{o.addEventListener(h,s)}),o.addEventListener("keydown",h=>{try{h.stopPropagation()}catch{}}),o.addEventListener("keyup",h=>{try{h.stopPropagation()}catch{}}),o.addEventListener("focus",h=>{try{h.stopPropagation()}catch{}},!0),o.addEventListener("blur",h=>{try{h.stopPropagation()}catch{}},!0);let u=GM_info.script.version;m.textContent=`v${u}`,m.classList.add("ytls-version-display");let p=document.createElement("span");p.style.display="inline-flex",p.style.alignItems="center",p.style.gap="6px",p.appendChild(m),p.appendChild(E),c.id="ytls-current-time",c.textContent="\u23F3",c.onclick=()=>{At=!0;let h=X();h&&h.seekToLiveHead(),setTimeout(()=>{At=!1},500)},_(),de&&clearInterval(de),de=setInterval(_,1e3),g.id="ytls-buttons";let k=(h,d)=>()=>{h.classList.remove("ytls-fade-in"),h.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(h)&&document.body.removeChild(h),d&&d()},300)},S=h=>d=>{d.key==="Escape"&&(d.preventDefault(),d.stopPropagation(),h())},b=h=>{setTimeout(()=>{document.addEventListener("keydown",h)},0)},T=(h,d)=>y=>{h.contains(y.target)||d()},F=h=>{setTimeout(()=>{document.addEventListener("click",h,!0)},0)},Ce=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!a||a.querySelector(".ytls-error-message")||oe)return;let h=typeof Gt<"u"?Gt:0,d=X(),y=d?Math.floor(d.getCurrentTime()+h):0;if(!Number.isFinite(y))return;let x=vn(y,"");x&&x.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>Je()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(h){if(!a||a.querySelector(".ytls-error-message")||oe){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let d=Lo(),y=Math.max(Ct(),0);if(d.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let x=h.ctrlKey,A=d.map(O=>{let j=kt(O.start,y);return x?`${j} ${O.comment} <!-- guid:${O.guid} -->`.trimStart():`${j} ${O.comment}`}).join(`
`);navigator.clipboard.writeText(A).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(O=>{f("Failed to copy timestamps: ",O,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!a||a.querySelector(".ytls-error-message")||oe)return;if(be().length===0){alert("No timestamps available to offset.");return}let d=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(d===null)return;let y=d.trim();if(y.length===0)return;let x=Number.parseInt(y,10);if(!Number.isFinite(x)){alert("Please enter a valid integer number of seconds.");return}x!==0&&Ai(x,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let h=$o();if(!h){alert("Unable to determine current video ID.");return}let d=document.createElement("div");d.id="ytls-delete-all-modal",d.classList.remove("ytls-fade-out"),d.classList.add("ytls-fade-in");let y=document.createElement("p");y.textContent="Hold the button to delete all timestamps for:",y.style.marginBottom="10px";let x=document.createElement("p");x.textContent=h,x.style.fontFamily="monospace",x.style.fontSize="12px",x.style.marginBottom="15px",x.style.color="#aaa";let A=document.createElement("button");A.classList.add("ytls-save-modal-button"),A.style.background="#d32f2f",A.style.position="relative",A.style.overflow="hidden";let O=null,j=0,W=null,V=document.createElement("div");V.style.position="absolute",V.style.left="0",V.style.top="0",V.style.height="100%",V.style.width="0%",V.style.background="#ff6b6b",V.style.transition="none",V.style.pointerEvents="none",A.appendChild(V);let se=document.createElement("span");se.textContent="Hold to Delete All",se.style.position="relative",se.style.zIndex="1",A.appendChild(se);let Ie=()=>{if(!j)return;let je=Date.now()-j,zt=Math.min(je/5e3*100,100);V.style.width=`${zt}%`,zt<100&&(W=requestAnimationFrame(Ie))},ae=()=>{O&&(clearTimeout(O),O=null),W&&(cancelAnimationFrame(W),W=null),j=0,V.style.width="0%",se.textContent="Hold to Delete All"};A.onmousedown=()=>{j=Date.now(),se.textContent="Deleting...",W=requestAnimationFrame(Ie),O=setTimeout(async()=>{ae(),d.classList.remove("ytls-fade-in"),d.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(d)&&document.body.removeChild(d);try{await Wr(h),Ho()}catch(je){f("Failed to delete all timestamps:",je,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},A.onmouseup=ae,A.onmouseleave=ae;let Me=null,Ae=null,ft=k(d,()=>{ae(),Me&&document.removeEventListener("keydown",Me),Ae&&document.removeEventListener("click",Ae,!0)});Me=S(ft),Ae=T(d,ft);let Pt=document.createElement("button");Pt.textContent="Cancel",Pt.classList.add("ytls-save-modal-cancel-button"),Pt.onclick=ft,d.appendChild(y),d.appendChild(x),d.appendChild(A),d.appendChild(Pt),document.body.appendChild(d),b(Me),F(Ae)}}],we=er();Ce.forEach(h=>{let d=document.createElement("button");if(d.textContent=h.label,Qe(d,h.title),d.classList.add("ytls-main-button"),h.label==="\u{1F423}"&&we){let y=document.createElement("span");y.textContent=we,y.classList.add("ytls-holiday-emoji"),d.appendChild(y)}h.label==="\u{1F4CB}"?d.onclick=function(y){h.action.call(this,y)}:d.onclick=h.action,h.label==="\u2699\uFE0F"&&(Bn=d),g.appendChild(d)});let Ze=document.createElement("button");Ze.textContent="\u{1F4BE} Save",Ze.classList.add("ytls-file-operation-button"),Ze.onclick=()=>{let h=document.createElement("div");h.id="ytls-save-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let d=document.createElement("p");d.textContent="Save as:";let y=null,x=null,A=k(h,()=>{y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0)});y=S(A),x=T(h,A);let O=document.createElement("button");O.textContent="JSON",O.classList.add("ytls-save-modal-button"),O.onclick=()=>{y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0),k(h,()=>Hi("json"))()};let j=document.createElement("button");j.textContent="Plain Text",j.classList.add("ytls-save-modal-button"),j.onclick=()=>{y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0),k(h,()=>Hi("text"))()};let W=document.createElement("button");W.textContent="Cancel",W.classList.add("ytls-save-modal-cancel-button"),W.onclick=A,h.appendChild(d),h.appendChild(O),h.appendChild(j),h.appendChild(W),document.body.appendChild(h),b(y),F(x)};let lt=document.createElement("button");lt.textContent="\u{1F4C2} Load",lt.classList.add("ytls-file-operation-button"),lt.onclick=()=>{let h=document.createElement("div");h.id="ytls-load-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let d=document.createElement("p");d.textContent="Load from:";let y=null,x=null,A=k(h,()=>{y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0)});y=S(A),x=T(h,A);let O=document.createElement("button");O.textContent="File",O.classList.add("ytls-save-modal-button"),O.onclick=()=>{let V=document.createElement("input");V.type="file",V.accept=".json,.txt",V.classList.add("ytls-hidden-file-input"),V.onchange=se=>{let Ie=se.target.files?.[0];if(!Ie)return;y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0),A();let ae=new FileReader;ae.onload=()=>{let Me=String(ae.result).trim();Ni(Me)},ae.readAsText(Ie)},V.click()};let j=document.createElement("button");j.textContent="Clipboard",j.classList.add("ytls-save-modal-button"),j.onclick=async()=>{y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0),k(h,async()=>{try{let V=await navigator.clipboard.readText();V?Ni(V.trim()):alert("Clipboard is empty.")}catch(V){f("Failed to read from clipboard: ",V,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let W=document.createElement("button");W.textContent="Cancel",W.classList.add("ytls-save-modal-cancel-button"),W.onclick=A,h.appendChild(d),h.appendChild(O),h.appendChild(j),h.appendChild(W),document.body.appendChild(h),b(y),F(x)};let Bt=document.createElement("button");Bt.textContent="\u{1F4E4} Export",Bt.classList.add("ytls-file-operation-button"),Bt.onclick=async()=>{try{await za()}catch{alert("Failed to export data: Could not read from database.")}};let bn=document.createElement("button");bn.textContent="\u{1F4E5} Import",bn.classList.add("ytls-file-operation-button"),bn.onclick=()=>{let h=document.createElement("input");h.type="file",h.accept=".json",h.classList.add("ytls-hidden-file-input"),h.onchange=d=>{let y=d.target.files?.[0];if(!y)return;let x=new FileReader;x.onload=()=>{try{let A=JSON.parse(String(x.result)),O=[];for(let j in A)if(Object.prototype.hasOwnProperty.call(A,j)&&j.startsWith("ytls-")){let W=j.substring(5),V=A[j];if(V&&typeof V.video_id=="string"&&Array.isArray(V.timestamps)){let se=V.timestamps.map(ae=>({...ae,guid:ae.guid||crypto.randomUUID()})),Ie=di(W,se).then(()=>f(`Imported ${W} to IndexedDB`)).catch(ae=>f(`Failed to import ${W} to IndexedDB:`,ae,"error"));O.push(Ie)}else f(`Skipping key ${j} during import due to unexpected data format.`,"warn")}Promise.all(O).then(()=>{Ho()}).catch(j=>{alert("An error occurred during import to IndexedDB. Check console for details."),f("Overall import error:",j,"error")})}catch(A){alert(`Failed to import data. Please ensure the file is in the correct format.
`+A.message),f("Import error:",A,"error")}},x.readAsText(y)},h.click()},v.textContent=Vr,a.onclick=h=>{$i(h)},a.ontouchstart=h=>{$i(h)},o.style.position="fixed",o.style.bottom="0",o.style.right="0",o.style.transition="none",Jn(),setTimeout(()=>qt(),10);let Wt=!1,Gi,ji,Zn=!1;o.addEventListener("mousedown",h=>{let d=h.target;d instanceof Element&&(d instanceof HTMLInputElement||d instanceof HTMLTextAreaElement||d!==l&&!l.contains(d)&&window.getComputedStyle(d).cursor==="pointer"||(Wt=!0,Zn=!1,Gi=h.clientX-o.getBoundingClientRect().left,ji=h.clientY-o.getBoundingClientRect().top,o.style.transition="none"))}),document.addEventListener("mousemove",Pn=h=>{if(!Wt)return;Zn=!0;let d=h.clientX-Gi,y=h.clientY-ji,x=o.getBoundingClientRect(),A=x.width,O=x.height,j=document.documentElement.clientWidth,W=document.documentElement.clientHeight;d=Math.max(0,Math.min(d,j-A)),y=Math.max(0,Math.min(y,W-O)),o.style.left=`${d}px`,o.style.top=`${y}px`,o.style.right="auto",o.style.bottom="auto"}),document.addEventListener("mouseup",zn=()=>{if(!Wt)return;Wt=!1;let h=Zn;setTimeout(()=>{Zn=!1},50),qt(),setTimeout(()=>{h&&wn()},200)}),o.addEventListener("dragstart",h=>h.preventDefault());let Po=document.createElement("div"),zo=document.createElement("div"),Fo=document.createElement("div"),Oo=document.createElement("div");Po.id="ytls-resize-tl",zo.id="ytls-resize-tr",Fo.id="ytls-resize-bl",Oo.id="ytls-resize-br";let Vt=!1,qi=0,Wi=0,Yt=0,Kt=0,Xn=0,Qn=0,Ht=null;eo(Po,"top-left"),eo(zo,"top-right"),eo(Fo,"bottom-left"),eo(Oo,"bottom-right"),document.addEventListener("mousemove",h=>{if(!Vt||!o||!Ht)return;let d=h.clientX-qi,y=h.clientY-Wi,x=Yt,A=Kt,O=Xn,j=Qn,W=document.documentElement.clientWidth,V=document.documentElement.clientHeight;Ht==="bottom-right"?(x=Math.max(200,Math.min(800,Yt+d)),A=Math.max(250,Math.min(V,Kt+y))):Ht==="top-left"?(x=Math.max(200,Math.min(800,Yt-d)),O=Xn+d,A=Math.max(250,Math.min(V,Kt-y)),j=Qn+y):Ht==="top-right"?(x=Math.max(200,Math.min(800,Yt+d)),A=Math.max(250,Math.min(V,Kt-y)),j=Qn+y):Ht==="bottom-left"&&(x=Math.max(200,Math.min(800,Yt-d)),O=Xn+d,A=Math.max(250,Math.min(V,Kt+y))),O=Math.max(0,Math.min(O,W-x)),j=Math.max(0,Math.min(j,V-A)),o.style.width=`${x}px`,o.style.height=`${A}px`,o.style.left=`${O}px`,o.style.top=`${j}px`,o.style.right="auto",o.style.bottom="auto"}),document.addEventListener("mouseup",()=>{Vt&&(Vt=!1,Ht=null,document.body.style.cursor="",H(!0))});let to=null;window.addEventListener("resize",Fn=()=>{to&&clearTimeout(to),to=setTimeout(()=>{H(!0),to=null},200)}),l.appendChild(c),l.appendChild(p);let no=document.createElement("div");if(no.id="ytls-content",no.append(a),no.append(g),o.append(l,no,v,Po,zo,Fo,Oo),o.addEventListener("mousemove",h=>{try{if(Wt||Vt)return;let d=o.getBoundingClientRect(),y=20,x=h.clientX,A=h.clientY,O=x-d.left<=y,j=d.right-x<=y,W=A-d.top<=y,V=d.bottom-A<=y,se="";W&&O||V&&j?se="nwse-resize":W&&j||V&&O?se="nesw-resize":se="",document.body.style.cursor=se}catch{}}),o.addEventListener("mouseleave",()=>{!Vt&&!Wt&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=_n,setTimeout(()=>{if(_n(),o&&l&&g&&a){let h=40,d=be();if(d.length>0)h=d[0].offsetHeight;else{let y=document.createElement("li");y.style.visibility="hidden",y.style.position="absolute",y.textContent="00:00 Example",a.appendChild(y),h=y.offsetHeight,a.removeChild(y)}w=l.offsetHeight+g.offsetHeight+h,o.style.minHeight=w+"px"}},0),window.addEventListener("resize",_n),rt){try{rt.disconnect()}catch{}rt=null}rt=new ResizeObserver(_n),rt.observe(o),cn||document.addEventListener("pointerdown",cn=()=>{Di=Date.now()},!0),dn||document.addEventListener("pointerup",dn=()=>{},!0)}finally{Mo=!1}}}async function Ua(){if(!o)return;if(document.querySelectorAll("#ytls-pane").forEach(p=>{p!==o&&(f("Removing duplicate pane element from DOM"),p.remove())}),document.body.contains(o)){f("Pane already in DOM, skipping append");return}await Na(),typeof xi=="function"&&xi(Fi),typeof To=="function"&&To(en),typeof ko=="function"&&ko(vo),typeof _i=="function"&&_i(E),await Ti(),await Ta(),await rn(),typeof So=="function"&&So();let u=document.querySelectorAll("#ytls-pane");if(u.length>0&&(f(`WARNING: Found ${u.length} existing pane(s) in DOM, removing all`),u.forEach(p=>p.remove())),document.body.contains(o)){f("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(o),f("Pane successfully appended to DOM"),ne(),Se&&(clearTimeout(Se),Se=null),Se=setTimeout(()=>{C(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ee(),H(!0),Se=null},450),it){try{it.disconnect()}catch{}it=null}it=new MutationObserver(()=>{let p=document.querySelectorAll("#ytls-pane");p.length>1&&(f(`CRITICAL: Multiple panes detected (${p.length}), removing duplicates`),p.forEach((_,k)=>{(k>0||o&&_!==o)&&_.remove()}))}),it.observe(document.body,{childList:!0,subtree:!0})}function Ri(s=0){if(document.getElementById("ytls-header-button")){xt();return}let u=document.querySelector("#logo");if(!u||!u.parentElement){s<10&&setTimeout(()=>Ri(s+1),300);return}let p=document.createElement("button");p.id="ytls-header-button",p.type="button",p.className="ytls-header-button",Qe(p,"Toggle Timekeeper UI"),p.setAttribute("aria-label","Toggle Timekeeper UI");let _=document.createElement("img");_.src=M,_.alt="",_.decoding="async",p.appendChild(_),_t=_,p.addEventListener("mouseenter",()=>{_t&&(Hn=!0,_t.src=$)}),p.addEventListener("mouseleave",()=>{_t&&(Hn=!1,xt())}),p.addEventListener("click",()=>{o&&!document.body.contains(o)&&(f("Pane not in DOM, re-appending before toggle"),document.body.appendChild(o)),Bo()}),u.insertAdjacentElement("afterend",p),xt(),f("Timekeeper header button added next to YouTube logo")}function Ui(){if(N)return;N=!0;let s=history.pushState,u=history.replaceState;function p(){try{let _=new Event("locationchange");window.dispatchEvent(_)}catch{}}history.pushState=function(_,k,S){let b=s.apply(this,arguments);return p(),b},history.replaceState=function(_,k,S){let b=u.apply(this,arguments);return p(),b},window.addEventListener("popstate",p),window.addEventListener("locationchange",()=>{window.location.href!==B&&f("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function Ho(){if(!r()){Ba();return}B=window.location.href,document.querySelectorAll("#ytls-pane").forEach((u,p)=>{(p>0||o&&u!==o)&&u.remove()}),await z(),await Ra(),De=$o();let s=document.title;f("Page Title:",s),f("Video ID:",De),f("Current URL:",window.location.href),Io(!0),It(),Pe(),await zi(),Pe(),Io(!1),f("Timestamps loaded and UI unlocked for video:",De),await Ua(),Ri(),Pa()}Ui(),window.addEventListener("yt-navigate-start",()=>{f("Navigation started (yt-navigate-start event fired)"),r()&&o&&a&&(f("Locking UI and showing loading state for navigation"),Io(!0))}),un=s=>{s.ctrlKey&&s.altKey&&s.shiftKey&&(s.key==="T"||s.key==="t")&&(s.preventDefault(),Bo(),f("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",un),window.addEventListener("yt-navigate-finish",()=>{f("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==B?Ho():f("Navigation finished but URL already handled, skipping.")}),Ui(),f("Timekeeper initialized and waiting for navigation events")})();})();

