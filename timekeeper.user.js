// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.4.11
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

(()=>{var xr=Object.create;var lo=Object.defineProperty;var Tr=Object.getOwnPropertyDescriptor;var Er=Object.getOwnPropertyNames;var kr=Object.getPrototypeOf,Sr=Object.prototype.hasOwnProperty;var uo=(e,i)=>()=>(i||e((i={exports:{}}).exports,i),i.exports);var Lr=(e,i,r,s)=>{if(i&&typeof i=="object"||typeof i=="function")for(let c of Er(i))!Sr.call(e,c)&&c!==r&&lo(e,c,{get:()=>i[c],enumerable:!(s=Tr(i,c))||s.enumerable});return e};var co=(e,i,r)=>(r=e!=null?xr(kr(e)):{},Lr(i||!e||!e.__esModule?lo(r,"default",{value:e,enumerable:!0}):r,e));var mo=uo((wi,xi)=>{(function(e,i){typeof wi=="object"&&typeof xi<"u"?xi.exports=i():typeof define=="function"&&define.amd?define(i):(e=typeof globalThis<"u"?globalThis:e||self).dayjs=i()})(wi,(function(){"use strict";var e=1e3,i=6e4,r=36e5,s="millisecond",c="second",n="minute",h="hour",l="day",k="week",w="month",T="quarter",H="year",P="date",M="Invalid Date",j=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,ee=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,ne={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(z){var I=["th","st","nd","rd"],E=z%100;return"["+z+(I[(E-20)%10]||I[E]||I[0])+"]"}},te=function(z,I,E){var A=String(z);return!A||A.length>=I?z:""+Array(I+1-A.length).join(E)+z},K={s:te,z:function(z){var I=-z.utcOffset(),E=Math.abs(I),A=Math.floor(E/60),D=E%60;return(I<=0?"+":"-")+te(A,2,"0")+":"+te(D,2,"0")},m:function z(I,E){if(I.date()<E.date())return-z(E,I);var A=12*(E.year()-I.year())+(E.month()-I.month()),D=I.clone().add(A,w),O=E-D<0,F=I.clone().add(A+(O?-1:1),w);return+(-(A+(E-D)/(O?D-F:F-D))||0)},a:function(z){return z<0?Math.ceil(z)||0:Math.floor(z)},p:function(z){return{M:w,y:H,w:k,d:l,D:P,h,m:n,s:c,ms:s,Q:T}[z]||String(z||"").toLowerCase().replace(/s$/,"")},u:function(z){return z===void 0}},ce="en",Z={};Z[ce]=ne;var ye="$isDayjsObject",ke=function(z){return z instanceof ve||!(!z||!z[ye])},se=function z(I,E,A){var D;if(!I)return ce;if(typeof I=="string"){var O=I.toLowerCase();Z[O]&&(D=O),E&&(Z[O]=E,D=O);var F=I.split("-");if(!D&&F.length>1)return z(F[0])}else{var J=I.name;Z[J]=I,D=J}return!A&&D&&(ce=D),D||!A&&ce},N=function(z,I){if(ke(z))return z.clone();var E=typeof I=="object"?I:{};return E.date=z,E.args=arguments,new ve(E)},C=K;C.l=se,C.i=ke,C.w=function(z,I){return N(z,{locale:I.$L,utc:I.$u,x:I.$x,$offset:I.$offset})};var ve=(function(){function z(E){this.$L=se(E.locale,null,!0),this.parse(E),this.$x=this.$x||E.x||{},this[ye]=!0}var I=z.prototype;return I.parse=function(E){this.$d=(function(A){var D=A.date,O=A.utc;if(D===null)return new Date(NaN);if(C.u(D))return new Date;if(D instanceof Date)return new Date(D);if(typeof D=="string"&&!/Z$/i.test(D)){var F=D.match(j);if(F){var J=F[2]-1||0,pe=(F[7]||"0").substring(0,3);return O?new Date(Date.UTC(F[1],J,F[3]||1,F[4]||0,F[5]||0,F[6]||0,pe)):new Date(F[1],J,F[3]||1,F[4]||0,F[5]||0,F[6]||0,pe)}}return new Date(D)})(E),this.init()},I.init=function(){var E=this.$d;this.$y=E.getFullYear(),this.$M=E.getMonth(),this.$D=E.getDate(),this.$W=E.getDay(),this.$H=E.getHours(),this.$m=E.getMinutes(),this.$s=E.getSeconds(),this.$ms=E.getMilliseconds()},I.$utils=function(){return C},I.isValid=function(){return this.$d.toString()!==M},I.isSame=function(E,A){var D=N(E);return this.startOf(A)<=D&&D<=this.endOf(A)},I.isAfter=function(E,A){return N(E)<this.startOf(A)},I.isBefore=function(E,A){return this.endOf(A)<N(E)},I.$g=function(E,A,D){return C.u(E)?this[A]:this.set(D,E)},I.unix=function(){return Math.floor(this.valueOf()/1e3)},I.valueOf=function(){return this.$d.getTime()},I.startOf=function(E,A){var D=this,O=!!C.u(A)||A,F=C.p(E),J=function(Xe,Se){var Qe=C.w(D.$u?Date.UTC(D.$y,Se,Xe):new Date(D.$y,Se,Xe),D);return O?Qe:Qe.endOf(l)},pe=function(Xe,Se){return C.w(D.toDate()[Xe].apply(D.toDate("s"),(O?[0,0,0,0]:[23,59,59,999]).slice(Se)),D)},ie=this.$W,le=this.$M,he=this.$D,Y="set"+(this.$u?"UTC":"");switch(F){case H:return O?J(1,0):J(31,11);case w:return O?J(1,le):J(0,le+1);case k:var me=this.$locale().weekStart||0,Ue=(ie<me?ie+7:ie)-me;return J(O?he-Ue:he+(6-Ue),le);case l:case P:return pe(Y+"Hours",0);case h:return pe(Y+"Minutes",1);case n:return pe(Y+"Seconds",2);case c:return pe(Y+"Milliseconds",3);default:return this.clone()}},I.endOf=function(E){return this.startOf(E,!1)},I.$set=function(E,A){var D,O=C.p(E),F="set"+(this.$u?"UTC":""),J=(D={},D[l]=F+"Date",D[P]=F+"Date",D[w]=F+"Month",D[H]=F+"FullYear",D[h]=F+"Hours",D[n]=F+"Minutes",D[c]=F+"Seconds",D[s]=F+"Milliseconds",D)[O],pe=O===l?this.$D+(A-this.$W):A;if(O===w||O===H){var ie=this.clone().set(P,1);ie.$d[J](pe),ie.init(),this.$d=ie.set(P,Math.min(this.$D,ie.daysInMonth())).$d}else J&&this.$d[J](pe);return this.init(),this},I.set=function(E,A){return this.clone().$set(E,A)},I.get=function(E){return this[C.p(E)]()},I.add=function(E,A){var D,O=this;E=Number(E);var F=C.p(A),J=function(le){var he=N(O);return C.w(he.date(he.date()+Math.round(le*E)),O)};if(F===w)return this.set(w,this.$M+E);if(F===H)return this.set(H,this.$y+E);if(F===l)return J(1);if(F===k)return J(7);var pe=(D={},D[n]=i,D[h]=r,D[c]=e,D)[F]||1,ie=this.$d.getTime()+E*pe;return C.w(ie,this)},I.subtract=function(E,A){return this.add(-1*E,A)},I.format=function(E){var A=this,D=this.$locale();if(!this.isValid())return D.invalidDate||M;var O=E||"YYYY-MM-DDTHH:mm:ssZ",F=C.z(this),J=this.$H,pe=this.$m,ie=this.$M,le=D.weekdays,he=D.months,Y=D.meridiem,me=function(Se,Qe,ot,mt){return Se&&(Se[Qe]||Se(A,O))||ot[Qe].slice(0,mt)},Ue=function(Se){return C.s(J%12||12,Se,"0")},Xe=Y||function(Se,Qe,ot){var mt=Se<12?"AM":"PM";return ot?mt.toLowerCase():mt};return O.replace(ee,(function(Se,Qe){return Qe||(function(ot){switch(ot){case"YY":return String(A.$y).slice(-2);case"YYYY":return C.s(A.$y,4,"0");case"M":return ie+1;case"MM":return C.s(ie+1,2,"0");case"MMM":return me(D.monthsShort,ie,he,3);case"MMMM":return me(he,ie);case"D":return A.$D;case"DD":return C.s(A.$D,2,"0");case"d":return String(A.$W);case"dd":return me(D.weekdaysMin,A.$W,le,2);case"ddd":return me(D.weekdaysShort,A.$W,le,3);case"dddd":return le[A.$W];case"H":return String(J);case"HH":return C.s(J,2,"0");case"h":return Ue(1);case"hh":return Ue(2);case"a":return Xe(J,pe,!0);case"A":return Xe(J,pe,!1);case"m":return String(pe);case"mm":return C.s(pe,2,"0");case"s":return String(A.$s);case"ss":return C.s(A.$s,2,"0");case"SSS":return C.s(A.$ms,3,"0");case"Z":return F}return null})(Se)||F.replace(":","")}))},I.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},I.diff=function(E,A,D){var O,F=this,J=C.p(A),pe=N(E),ie=(pe.utcOffset()-this.utcOffset())*i,le=this-pe,he=function(){return C.m(F,pe)};switch(J){case H:O=he()/12;break;case w:O=he();break;case T:O=he()/3;break;case k:O=(le-ie)/6048e5;break;case l:O=(le-ie)/864e5;break;case h:O=le/r;break;case n:O=le/i;break;case c:O=le/e;break;default:O=le}return D?O:C.a(O)},I.daysInMonth=function(){return this.endOf(w).$D},I.$locale=function(){return Z[this.$L]},I.locale=function(E,A){if(!E)return this.$L;var D=this.clone(),O=se(E,A,!0);return O&&(D.$L=O),D},I.clone=function(){return C.w(this.$d,this)},I.toDate=function(){return new Date(this.valueOf())},I.toJSON=function(){return this.isValid()?this.toISOString():null},I.toISOString=function(){return this.$d.toISOString()},I.toString=function(){return this.$d.toUTCString()},z})(),Te=ve.prototype;return N.prototype=Te,[["$ms",s],["$s",c],["$m",n],["$H",h],["$W",l],["$M",w],["$y",H],["$D",P]].forEach((function(z){Te[z[1]]=function(I){return this.$g(I,z[0],z[1])}})),N.extend=function(z,I){return z.$i||(z(I,ve,N),z.$i=!0),N},N.locale=se,N.isDayjs=ke,N.unix=function(z){return N(1e3*z)},N.en=Z[ce],N.Ls=Z,N.p={},N}))});var fo=uo((Ti,Ei)=>{(function(e,i){typeof Ti=="object"&&typeof Ei<"u"?Ei.exports=i():typeof define=="function"&&define.amd?define(i):(e=typeof globalThis<"u"?globalThis:e||self).dayjs_plugin_utc=i()})(Ti,(function(){"use strict";var e="minute",i=/[+-]\d\d(?::?\d\d)?/g,r=/([+-]|\d\d)/g;return function(s,c,n){var h=c.prototype;n.utc=function(M){var j={date:M,utc:!0,args:arguments};return new c(j)},h.utc=function(M){var j=n(this.toDate(),{locale:this.$L,utc:!0});return M?j.add(this.utcOffset(),e):j},h.local=function(){return n(this.toDate(),{locale:this.$L,utc:!1})};var l=h.parse;h.parse=function(M){M.utc&&(this.$u=!0),this.$utils().u(M.$offset)||(this.$offset=M.$offset),l.call(this,M)};var k=h.init;h.init=function(){if(this.$u){var M=this.$d;this.$y=M.getUTCFullYear(),this.$M=M.getUTCMonth(),this.$D=M.getUTCDate(),this.$W=M.getUTCDay(),this.$H=M.getUTCHours(),this.$m=M.getUTCMinutes(),this.$s=M.getUTCSeconds(),this.$ms=M.getUTCMilliseconds()}else k.call(this)};var w=h.utcOffset;h.utcOffset=function(M,j){var ee=this.$utils().u;if(ee(M))return this.$u?0:ee(this.$offset)?w.call(this):this.$offset;if(typeof M=="string"&&(M=(function(ce){ce===void 0&&(ce="");var Z=ce.match(i);if(!Z)return null;var ye=(""+Z[0]).match(r)||["-",0,0],ke=ye[0],se=60*+ye[1]+ +ye[2];return se===0?0:ke==="+"?se:-se})(M),M===null))return this;var ne=Math.abs(M)<=16?60*M:M;if(ne===0)return this.utc(j);var te=this.clone();if(j)return te.$offset=ne,te.$u=!1,te;var K=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();return(te=this.local().add(ne+K,e)).$offset=ne,te.$x.$localOffset=K,te};var T=h.format;h.format=function(M){var j=M||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return T.call(this,j)},h.valueOf=function(){var M=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||this.$d.getTimezoneOffset());return this.$d.valueOf()-6e4*M},h.isUTC=function(){return!!this.$u},h.toISOString=function(){return this.toDate().toISOString()},h.toString=function(){return this.toDate().toUTCString()};var H=h.toDate;h.toDate=function(M){return M==="s"&&this.$offset?n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():H.call(this)};var P=h.diff;h.diff=function(M,j,ee){if(M&&this.$u===M.$u)return P.call(this,M,j,ee);var ne=this.local(),te=n(M).local();return P.call(ne,te,j,ee)}}}))});var Xn=co(mo()),po=co(fo());Xn.default.extend(po.default);function u(e,...i){let r="debug",s=[...i];i.length>0&&typeof i[i.length-1]=="string"&&["debug","info","warn","error"].includes(i[i.length-1])&&(r=s.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[r](`${n} ${e}`,...s)}function kt(e,i=e){let r=Math.max(0,Math.floor(e)*1e3),s=i<3600?"mm:ss":i>=36e3?"HH:mm:ss":"H:mm:ss";return Xn.default.utc(r).format(s)}function ki(e,i=window.location.href){try{let r=new URL(i);return r.searchParams.set("t",`${e}s`),r.toString()}catch{return`https://www.youtube.com/watch?v=${i.search(/[?&]v=/)>=0?i.split(/[?&]v=/)[1].split(/&/)[0]:i.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function vn(){return(0,Xn.default)().utc().format("YYYY-MM-DD--HH-mm-ss")}var Mr=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function ho(){let e=new Date,i=e.getFullYear(),r=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let s of Mr){let c=new Date(i,s.month-1,s.day),n=c.getTime()-e.getTime(),h=n/(1e3*60*60*24);if(h<=5&&h>=-2)return u(`Current date: ${r}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(h)}`),s.emoji;if(h<-2&&(c=new Date(i+1,s.month-1,s.day),n=c.getTime()-e.getTime(),h=n/(1e3*60*60*24),h<=5&&h>=-2))return u(`Current date: ${r}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(h)}`),s.emoji;if(h>5&&(c=new Date(i-1,s.month-1,s.day),n=c.getTime()-e.getTime(),h=n/(1e3*60*60*24),h<=5&&h>=-2))return u(`Current date: ${r}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(h)}`),s.emoji}return u(`Current date: ${r}, No holiday emoji (not within range)`),null}var tt=null,Xt=null,Dr=500,Pt=null,bn=!1,St=null;function Ir(){return(!tt||!document.body.contains(tt))&&(tt=document.createElement("div"),tt.className="ytls-tooltip",tt.style.pointerEvents="none",document.body.appendChild(tt),window.addEventListener("scroll",go,!0),window.addEventListener("resize",go,!0)),tt}function Cr(e,i,r){let c=window.innerWidth,n=window.innerHeight,h=e.getBoundingClientRect(),l=h.width,k=h.height,w=i+10,T=r+10;w+l>c-10&&(w=i-l-10),T+k>n-10&&(T=r-k-10),w=Math.max(10,Math.min(w,c-l-10)),T=Math.max(10,Math.min(T,n-k-10)),e.style.left=`${w}px`,e.style.top=`${T}px`}function yo(e,i){let s=window.innerWidth,c=window.innerHeight,n=i.getBoundingClientRect(),h=e.getBoundingClientRect(),l=h.width,k=h.height,w=Math.round(n.right+8),T=Math.round(n.top);w+l>s-8&&(w=Math.round(n.left-l-8)),w=Math.max(8,Math.min(w,s-l-8)),T+k>c-8&&(T=Math.round(n.bottom-k)),T=Math.max(8,Math.min(T,c-k-8)),e.style.left=`${w}px`,e.style.top=`${T}px`}function go(){if(!(!tt||!Pt)&&tt.classList.contains("ytls-tooltip-visible"))try{yo(tt,Pt)}catch{}}function Ar(e=50){St&&(clearTimeout(St),St=null),!bn&&(St=setTimeout(()=>{Si(),St=null},e))}function $r(e,i,r,s){Xt&&clearTimeout(Xt),s&&(Pt=s,bn=!0),Xt=setTimeout(()=>{let c=Ir();c.textContent=e,c.classList.remove("ytls-tooltip-visible"),s?requestAnimationFrame(()=>{yo(c,s),requestAnimationFrame(()=>{c.classList.add("ytls-tooltip-visible")})}):(Cr(c,i,r),requestAnimationFrame(()=>{c.classList.add("ytls-tooltip-visible")}))},Dr)}function Si(){Xt&&(clearTimeout(Xt),Xt=null),St&&(clearTimeout(St),St=null),tt&&tt.classList.remove("ytls-tooltip-visible"),Pt=null,bn=!1}function ct(e,i){let r=0,s=0,c=k=>{r=k.clientX,s=k.clientY,bn=!0,Pt=e;let w=typeof i=="function"?i():i;w&&$r(w,r,s,e)},n=k=>{r=k.clientX,s=k.clientY},h=()=>{bn=!1,Ar()};e.addEventListener("mouseenter",c),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",h);let l=new MutationObserver(()=>{try{if(!document.body.contains(e))Pt===e&&Si();else{let k=window.getComputedStyle(e);(k.display==="none"||k.visibility==="hidden"||k.opacity==="0")&&Pt===e&&Si()}}catch{}});try{l.observe(e,{attributes:!0,attributeFilter:["class","style"]}),l.observe(document.body,{childList:!0,subtree:!0})}catch{}e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",c),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",h);try{l.disconnect()}catch{}delete e.__tooltipObserver},e.__tooltipObserver=l}var vo=`
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

`;var Pe=Uint8Array,Ke=Uint16Array,Ai=Int32Array,$i=new Pe([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Bi=new Pe([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),bo=new Pe([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),So=function(e,i){for(var r=new Ke(31),s=0;s<31;++s)r[s]=i+=1<<e[s-1];for(var c=new Ai(r[30]),s=1;s<30;++s)for(var n=r[s];n<r[s+1];++n)c[n]=n-r[s]<<5|s;return{b:r,r:c}},Lo=So($i,2),Br=Lo.b,Mi=Lo.r;Br[28]=258,Mi[258]=28;var Mo=So(Bi,0),da=Mo.b,wo=Mo.r,Di=new Ke(32768);for(ae=0;ae<32768;++ae)vt=(ae&43690)>>1|(ae&21845)<<1,vt=(vt&52428)>>2|(vt&13107)<<2,vt=(vt&61680)>>4|(vt&3855)<<4,Di[ae]=((vt&65280)>>8|(vt&255)<<8)>>1;var vt,ae,Tn=(function(e,i,r){for(var s=e.length,c=0,n=new Ke(i);c<s;++c)e[c]&&++n[e[c]-1];var h=new Ke(i);for(c=1;c<i;++c)h[c]=h[c-1]+n[c-1]<<1;var l;if(r){l=new Ke(1<<i);var k=15-i;for(c=0;c<s;++c)if(e[c])for(var w=c<<4|e[c],T=i-e[c],H=h[e[c]-1]++<<T,P=H|(1<<T)-1;H<=P;++H)l[Di[H]>>k]=w}else for(l=new Ke(s),c=0;c<s;++c)e[c]&&(l[c]=Di[h[e[c]-1]++]>>15-e[c]);return l}),Ot=new Pe(288);for(ae=0;ae<144;++ae)Ot[ae]=8;var ae;for(ae=144;ae<256;++ae)Ot[ae]=9;var ae;for(ae=256;ae<280;++ae)Ot[ae]=7;var ae;for(ae=280;ae<288;++ae)Ot[ae]=8;var ae,Qn=new Pe(32);for(ae=0;ae<32;++ae)Qn[ae]=5;var ae,zr=Tn(Ot,9,0);var Hr=Tn(Qn,5,0);var Do=function(e){return(e+7)/8|0},Io=function(e,i,r){return(i==null||i<0)&&(i=0),(r==null||r>e.length)&&(r=e.length),new Pe(e.subarray(i,r))};var Pr=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],ti=function(e,i,r){var s=new Error(i||Pr[e]);if(s.code=e,Error.captureStackTrace&&Error.captureStackTrace(s,ti),!r)throw s;return s};var bt=function(e,i,r){r<<=i&7;var s=i/8|0;e[s]|=r,e[s+1]|=r>>8},wn=function(e,i,r){r<<=i&7;var s=i/8|0;e[s]|=r,e[s+1]|=r>>8,e[s+2]|=r>>16},Li=function(e,i){for(var r=[],s=0;s<e.length;++s)e[s]&&r.push({s,f:e[s]});var c=r.length,n=r.slice();if(!c)return{t:Ao,l:0};if(c==1){var h=new Pe(r[0].s+1);return h[r[0].s]=1,{t:h,l:1}}r.sort(function(ye,ke){return ye.f-ke.f}),r.push({s:-1,f:25001});var l=r[0],k=r[1],w=0,T=1,H=2;for(r[0]={s:-1,f:l.f+k.f,l,r:k};T!=c-1;)l=r[r[w].f<r[H].f?w++:H++],k=r[w!=T&&r[w].f<r[H].f?w++:H++],r[T++]={s:-1,f:l.f+k.f,l,r:k};for(var P=n[0].s,s=1;s<c;++s)n[s].s>P&&(P=n[s].s);var M=new Ke(P+1),j=Ii(r[T-1],M,0);if(j>i){var s=0,ee=0,ne=j-i,te=1<<ne;for(n.sort(function(ke,se){return M[se.s]-M[ke.s]||ke.f-se.f});s<c;++s){var K=n[s].s;if(M[K]>i)ee+=te-(1<<j-M[K]),M[K]=i;else break}for(ee>>=ne;ee>0;){var ce=n[s].s;M[ce]<i?ee-=1<<i-M[ce]++-1:++s}for(;s>=0&&ee;--s){var Z=n[s].s;M[Z]==i&&(--M[Z],++ee)}j=i}return{t:new Pe(M),l:j}},Ii=function(e,i,r){return e.s==-1?Math.max(Ii(e.l,i,r+1),Ii(e.r,i,r+1)):i[e.s]=r},xo=function(e){for(var i=e.length;i&&!e[--i];);for(var r=new Ke(++i),s=0,c=e[0],n=1,h=function(k){r[s++]=k},l=1;l<=i;++l)if(e[l]==c&&l!=i)++n;else{if(!c&&n>2){for(;n>138;n-=138)h(32754);n>2&&(h(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(h(c),--n;n>6;n-=6)h(8304);n>2&&(h(n-3<<5|8208),n=0)}for(;n--;)h(c);n=1,c=e[l]}return{c:r.subarray(0,s),n:i}},xn=function(e,i){for(var r=0,s=0;s<i.length;++s)r+=e[s]*i[s];return r},Co=function(e,i,r){var s=r.length,c=Do(i+2);e[c]=s&255,e[c+1]=s>>8,e[c+2]=e[c]^255,e[c+3]=e[c+1]^255;for(var n=0;n<s;++n)e[c+n+4]=r[n];return(c+4+s)*8},To=function(e,i,r,s,c,n,h,l,k,w,T){bt(i,T++,r),++c[256];for(var H=Li(c,15),P=H.t,M=H.l,j=Li(n,15),ee=j.t,ne=j.l,te=xo(P),K=te.c,ce=te.n,Z=xo(ee),ye=Z.c,ke=Z.n,se=new Ke(19),N=0;N<K.length;++N)++se[K[N]&31];for(var N=0;N<ye.length;++N)++se[ye[N]&31];for(var C=Li(se,7),ve=C.t,Te=C.l,z=19;z>4&&!ve[bo[z-1]];--z);var I=w+5<<3,E=xn(c,Ot)+xn(n,Qn)+h,A=xn(c,P)+xn(n,ee)+h+14+3*z+xn(se,ve)+2*se[16]+3*se[17]+7*se[18];if(k>=0&&I<=E&&I<=A)return Co(i,T,e.subarray(k,k+w));var D,O,F,J;if(bt(i,T,1+(A<E)),T+=2,A<E){D=Tn(P,M,0),O=P,F=Tn(ee,ne,0),J=ee;var pe=Tn(ve,Te,0);bt(i,T,ce-257),bt(i,T+5,ke-1),bt(i,T+10,z-4),T+=14;for(var N=0;N<z;++N)bt(i,T+3*N,ve[bo[N]]);T+=3*z;for(var ie=[K,ye],le=0;le<2;++le)for(var he=ie[le],N=0;N<he.length;++N){var Y=he[N]&31;bt(i,T,pe[Y]),T+=ve[Y],Y>15&&(bt(i,T,he[N]>>5&127),T+=he[N]>>12)}}else D=zr,O=Ot,F=Hr,J=Qn;for(var N=0;N<l;++N){var me=s[N];if(me>255){var Y=me>>18&31;wn(i,T,D[Y+257]),T+=O[Y+257],Y>7&&(bt(i,T,me>>23&31),T+=$i[Y]);var Ue=me&31;wn(i,T,F[Ue]),T+=J[Ue],Ue>3&&(wn(i,T,me>>5&8191),T+=Bi[Ue])}else wn(i,T,D[me]),T+=O[me]}return wn(i,T,D[256]),T+O[256]},Or=new Ai([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Ao=new Pe(0),Fr=function(e,i,r,s,c,n){var h=n.z||e.length,l=new Pe(s+h+5*(1+Math.ceil(h/7e3))+c),k=l.subarray(s,l.length-c),w=n.l,T=(n.r||0)&7;if(i){T&&(k[0]=n.r>>3);for(var H=Or[i-1],P=H>>13,M=H&8191,j=(1<<r)-1,ee=n.p||new Ke(32768),ne=n.h||new Ke(j+1),te=Math.ceil(r/3),K=2*te,ce=function(Ge){return(e[Ge]^e[Ge+1]<<te^e[Ge+2]<<K)&j},Z=new Ai(25e3),ye=new Ke(288),ke=new Ke(32),se=0,N=0,C=n.i||0,ve=0,Te=n.w||0,z=0;C+2<h;++C){var I=ce(C),E=C&32767,A=ne[I];if(ee[E]=A,ne[I]=E,Te<=C){var D=h-C;if((se>7e3||ve>24576)&&(D>423||!w)){T=To(e,k,0,Z,ye,ke,N,ve,z,C-z,T),ve=se=N=0,z=C;for(var O=0;O<286;++O)ye[O]=0;for(var O=0;O<30;++O)ke[O]=0}var F=2,J=0,pe=M,ie=E-A&32767;if(D>2&&I==ce(C-ie))for(var le=Math.min(P,D)-1,he=Math.min(32767,C),Y=Math.min(258,D);ie<=he&&--pe&&E!=A;){if(e[C+F]==e[C+F-ie]){for(var me=0;me<Y&&e[C+me]==e[C+me-ie];++me);if(me>F){if(F=me,J=ie,me>le)break;for(var Ue=Math.min(ie,me-2),Xe=0,O=0;O<Ue;++O){var Se=C-ie+O&32767,Qe=ee[Se],ot=Se-Qe&32767;ot>Xe&&(Xe=ot,A=Se)}}}E=A,A=ee[E],ie+=E-A&32767}if(J){Z[ve++]=268435456|Mi[F]<<18|wo[J];var mt=Mi[F]&31,Ft=wo[J]&31;N+=$i[mt]+Bi[Ft],++ye[257+mt],++ke[Ft],Te=C+F,++se}else Z[ve++]=e[C],++ye[e[C]]}}for(C=Math.max(C,Te);C<h;++C)Z[ve++]=e[C],++ye[e[C]];T=To(e,k,w,Z,ye,ke,N,ve,z,C-z,T),w||(n.r=T&7|k[T/8|0]<<3,T-=7,n.h=ne,n.p=ee,n.i=C,n.w=Te)}else{for(var C=n.w||0;C<h+w;C+=65535){var Lt=C+65535;Lt>=h&&(k[T/8|0]=w,Lt=h),T=Co(k,T+1,e.subarray(C,Lt))}n.i=h}return Io(l,0,s+Do(T)+c)},Rr=(function(){for(var e=new Int32Array(256),i=0;i<256;++i){for(var r=i,s=9;--s;)r=(r&1&&-306674912)^r>>>1;e[i]=r}return e})(),Nr=function(){var e=-1;return{p:function(i){for(var r=e,s=0;s<i.length;++s)r=Rr[r&255^i[s]]^r>>>8;e=r},d:function(){return~e}}};var _r=function(e,i,r,s,c){if(!c&&(c={l:1},i.dictionary)){var n=i.dictionary.subarray(-32768),h=new Pe(n.length+e.length);h.set(n),h.set(e,n.length),e=h,c.w=n.length}return Fr(e,i.level==null?6:i.level,i.mem==null?c.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+i.mem,r,s,c)},$o=function(e,i){var r={};for(var s in e)r[s]=e[s];for(var s in i)r[s]=i[s];return r};var He=function(e,i,r){for(;r;++i)e[i]=r,r>>>=8};function Ur(e,i){return _r(e,i||{},0,0)}var Bo=function(e,i,r,s){for(var c in e){var n=e[c],h=i+c,l=s;Array.isArray(n)&&(l=$o(s,n[1]),n=n[0]),n instanceof Pe?r[h]=[n,l]:(r[h+="/"]=[new Pe(0),l],Bo(n,h,r,s))}},Eo=typeof TextEncoder<"u"&&new TextEncoder,Gr=typeof TextDecoder<"u"&&new TextDecoder,qr=0;try{Gr.decode(Ao,{stream:!0}),qr=1}catch{}function ei(e,i){if(i){for(var r=new Pe(e.length),s=0;s<e.length;++s)r[s]=e.charCodeAt(s);return r}if(Eo)return Eo.encode(e);for(var c=e.length,n=new Pe(e.length+(e.length>>1)),h=0,l=function(T){n[h++]=T},s=0;s<c;++s){if(h+5>n.length){var k=new Pe(h+8+(c-s<<1));k.set(n),n=k}var w=e.charCodeAt(s);w<128||i?l(w):w<2048?(l(192|w>>6),l(128|w&63)):w>55295&&w<57344?(w=65536+(w&1047552)|e.charCodeAt(++s)&1023,l(240|w>>18),l(128|w>>12&63),l(128|w>>6&63),l(128|w&63)):(l(224|w>>12),l(128|w>>6&63),l(128|w&63))}return Io(n,0,h)}var Ci=function(e){var i=0;if(e)for(var r in e){var s=e[r].length;s>65535&&ti(9),i+=s+4}return i},ko=function(e,i,r,s,c,n,h,l){var k=s.length,w=r.extra,T=l&&l.length,H=Ci(w);He(e,i,h!=null?33639248:67324752),i+=4,h!=null&&(e[i++]=20,e[i++]=r.os),e[i]=20,i+=2,e[i++]=r.flag<<1|(n<0&&8),e[i++]=c&&8,e[i++]=r.compression&255,e[i++]=r.compression>>8;var P=new Date(r.mtime==null?Date.now():r.mtime),M=P.getFullYear()-1980;if((M<0||M>119)&&ti(10),He(e,i,M<<25|P.getMonth()+1<<21|P.getDate()<<16|P.getHours()<<11|P.getMinutes()<<5|P.getSeconds()>>1),i+=4,n!=-1&&(He(e,i,r.crc),He(e,i+4,n<0?-n-2:n),He(e,i+8,r.size)),He(e,i+12,k),He(e,i+14,H),i+=16,h!=null&&(He(e,i,T),He(e,i+6,r.attrs),He(e,i+10,h),i+=14),e.set(s,i),i+=k,H)for(var j in w){var ee=w[j],ne=ee.length;He(e,i,+j),He(e,i+2,ne),e.set(ee,i+4),i+=4+ne}return T&&(e.set(l,i),i+=T),i},jr=function(e,i,r,s,c){He(e,i,101010256),He(e,i+8,r),He(e,i+10,r),He(e,i+12,s),He(e,i+16,c)};function zo(e,i){i||(i={});var r={},s=[];Bo(e,"",r,i);var c=0,n=0;for(var h in r){var l=r[h],k=l[0],w=l[1],T=w.level==0?0:8,H=ei(h),P=H.length,M=w.comment,j=M&&ei(M),ee=j&&j.length,ne=Ci(w.extra);P>65535&&ti(11);var te=T?Ur(k,w):k,K=te.length,ce=Nr();ce.p(k),s.push($o(w,{size:k.length,crc:ce.d(),c:te,f:H,m:j,u:P!=h.length||j&&M.length!=ee,o:c,compression:T})),c+=30+P+ne+K,n+=76+2*(P+ne)+(ee||0)+K}for(var Z=new Pe(n+22),ye=c,ke=n-c,se=0;se<s.length;++se){var H=s[se];ko(Z,H.o,H,H.f,H.u,H.c.length);var N=30+H.f.length+Ci(H.extra);Z.set(H.c,H.o+N),ko(Z,c,H,H.f,H.u,H.c.length,H.o,H.m),c+=16+N+(H.m?H.m.length:0)}return jr(Z,c,s.length,ke,ye),Z}var W={isSignedIn:!1,accessToken:null,userName:null,email:null},dt=!0,Je=30,it=null,en=!1,Qt=0,nt=null,zi=null,Me=null,ue=null,ni=null;function Fo(e){zi=e}function Ro(e){Me=e}function No(e){ue=e}function Hi(e){ni=e}var Ho=!1;function _o(){if(!Ho)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),Ho=!0}catch{}}var Uo=null,En=null,kn=null;function Pi(e){Uo=e}function oi(e){En=e}function ri(e){kn=e}var Po="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Vr="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Yr="https://www.youtube.com/",Wr=30*1e3,Kr=1800*1e3,Oo=5,ii=null,Ze=null;async function Oi(){try{let e=await kn("googleAuthState");e&&typeof e=="object"&&(W={...W,...e},Ln(),W.isSignedIn&&W.accessToken&&await nn(!0))}catch(e){u("Failed to load Google auth state:",e,"error")}}async function ai(){try{await En("googleAuthState",W)}catch(e){u("Failed to save Google auth state:",e,"error")}}function Ln(){zi&&(zi.style.display="none")}function je(e,i){if(ue){if(ue.style.fontWeight="bold",e==="authenticating"){for(_o(),ue.style.color="#ffa500";ue.firstChild;)ue.removeChild(ue.firstChild);let r=document.createElement("span");r.className="tk-auth-spinner";let s=document.createTextNode(` ${i||"Authorizing with Google\u2026"}`);ue.appendChild(r),ue.appendChild(s);return}if(e==="error"){ue.textContent=`\u274C ${i||"Authorization failed"}`,ue.style.color="#ff4d4f",Ee();return}W.isSignedIn?(ue.textContent="\u2705 Signed in",ue.style.color="#52c41a",ue.removeAttribute("title"),W.userName?(ue.onmouseenter=()=>{ue.textContent=`\u2705 Signed in as ${W.userName}`},ue.onmouseleave=()=>{ue.textContent="\u2705 Signed in"}):(ue.onmouseenter=null,ue.onmouseleave=null)):(ue.textContent="\u274C Not signed in",ue.style.color="#ff4d4f",ue.removeAttribute("title"),ue.onmouseenter=null,ue.onmouseleave=null),Ee()}}function Zr(){ue&&(_o(),ue.classList.remove("tk-auth-blink"),ue.offsetWidth,ue.classList.add("tk-auth-blink"),setTimeout(()=>{ue.classList.remove("tk-auth-blink")},1200))}function Jr(e){return new Promise((i,r)=>{if(!e){u&&u("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}u&&u("OAuth monitor: starting to monitor popup for token");let s=Date.now(),c=300*1e3,n="timekeeper_oauth",h=null,l=null,k=null,w=()=>{if(h){try{h.close()}catch{}h=null}l&&(clearInterval(l),l=null),k&&(clearInterval(k),k=null)};try{h=new BroadcastChannel(n),u&&u("OAuth monitor: BroadcastChannel created successfully"),h.onmessage=P=>{if(u&&u("OAuth monitor: received BroadcastChannel message",P.data),P.data?.type==="timekeeper_oauth_token"&&P.data?.token){u&&u("OAuth monitor: token received via BroadcastChannel"),w();try{e.close()}catch{}i(P.data.token)}else if(P.data?.type==="timekeeper_oauth_error"){u&&u("OAuth monitor: error received via BroadcastChannel",P.data.error,"error"),w();try{e.close()}catch{}r(new Error(P.data.error||"OAuth failed"))}}}catch(P){u&&u("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",P)}u&&u("OAuth monitor: setting up IndexedDB polling");let T=Date.now();l=setInterval(async()=>{try{let P=indexedDB.open("ytls-timestamps-db",3);P.onsuccess=()=>{let M=P.result,ne=M.transaction("settings","readonly").objectStore("settings").get("oauth_message");ne.onsuccess=()=>{let te=ne.result;if(te&&te.value){let K=te.value;if(K.timestamp&&K.timestamp>T){if(u&&u("OAuth monitor: received IndexedDB message",K),K.type==="timekeeper_oauth_token"&&K.token){u&&u("OAuth monitor: token received via IndexedDB"),w();try{e.close()}catch{}M.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(K.token)}else if(K.type==="timekeeper_oauth_error"){u&&u("OAuth monitor: error received via IndexedDB",K.error,"error"),w();try{e.close()}catch{}M.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(K.error||"OAuth failed"))}T=K.timestamp}}M.close()}}}catch(P){u&&u("OAuth monitor: IndexedDB polling error",P,"error")}},500),k=setInterval(()=>{if(Date.now()-s>c){u&&u("OAuth monitor: popup timed out after 5 minutes",null,"error"),w();try{e.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function Go(){if(!Po){je("error","Google Client ID not configured");return}try{u&&u("OAuth signin: starting OAuth flow"),je("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",Po),e.searchParams.set("redirect_uri",Yr),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Vr),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),u&&u("OAuth signin: opening popup");let i=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!i){u&&u("OAuth signin: popup blocked by browser",null,"error"),je("error","Popup blocked. Please enable popups for YouTube.");return}u&&u("OAuth signin: popup opened successfully"),je("authenticating","Waiting for authentication...");try{let r=await Jr(i),s=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${r}`}});if(s.ok){let c=await s.json();W.accessToken=r,W.isSignedIn=!0,W.userName=c.name,W.email=c.email,await ai(),Ln(),je(),Ee(),await nn(),u?u(`Successfully authenticated as ${c.name}`):console.log(`[Timekeeper] Successfully authenticated as ${c.name}`)}else throw new Error("Failed to fetch user info")}catch(r){let s=r instanceof Error?r.message:"Authentication failed";u?u("OAuth failed:",r,"error"):console.error("[Timekeeper] OAuth failed:",r),je("error",s);return}}catch(e){let i=e instanceof Error?e.message:"Sign in failed";u?u("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),je("error",`Failed to sign in: ${i}`)}}async function qo(){if(!window.opener||window.opener===window)return!1;u&&u("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return u&&u("OAuth popup: no hash params found"),!1;let i=e.startsWith("#")?e.substring(1):e,r=new URLSearchParams(i),s=r.get("state");if(u&&u("OAuth popup: hash params found, state="+s),s!=="timekeeper_auth")return u&&u("OAuth popup: not our OAuth flow (wrong state)"),!1;let c=r.get("error"),n=r.get("access_token"),h="timekeeper_oauth";if(c){try{let l=new BroadcastChannel(h);l.postMessage({type:"timekeeper_oauth_error",error:r.get("error_description")||c}),l.close()}catch{let k={type:"timekeeper_oauth_error",error:r.get("error_description")||c,timestamp:Date.now()},w=indexedDB.open("ytls-timestamps-db",3);w.onsuccess=()=>{let T=w.result;T.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:k}),T.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){u&&u("OAuth popup: access token found, broadcasting to opener");try{let l=new BroadcastChannel(h);l.postMessage({type:"timekeeper_oauth_token",token:n}),l.close(),u&&u("OAuth popup: token broadcast via BroadcastChannel")}catch(l){u&&u("OAuth popup: BroadcastChannel failed, using IndexedDB",l);let k={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},w=indexedDB.open("ytls-timestamps-db",3);w.onsuccess=()=>{let T=w.result;T.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:k}),T.close()},u&&u("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function jo(){W={isSignedIn:!1,accessToken:null,userName:null,email:null},await ai(),Ln(),je(),Ee()}async function Vo(){if(!W.isSignedIn||!W.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${W.accessToken}`}});return e.status===401?(await Yo({silent:!0}),!1):e.ok}catch(e){return u("Failed to verify auth state:",e,"error"),!1}}async function Xr(e){let i={Authorization:`Bearer ${e}`},s=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,c=await fetch(s,{headers:i});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error("drive search failed");let n=await c.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let h=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...i,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(h.status===401)throw new Error("unauthorized");if(!h.ok)throw new Error("drive folder create failed");return(await h.json()).id}async function Qr(e,i,r){let s=`name='${e}' and '${i}' in parents and trashed=false`,c=encodeURIComponent(s),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${c}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${r}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let h=await n.json();return h.files&&h.files.length>0?h.files[0].id:null}function ea(e,i){let r=ei(e),s=i.replace(/\\/g,"/").replace(/^\/+/,"");return s.endsWith(".json")||(s+=".json"),zo({[s]:[r,{level:6,mtime:new Date,os:0}]})}async function ta(e,i,r,s){let c=e.replace(/\.json$/,".zip"),n=await Qr(c,r,s),h=new TextEncoder().encode(i).length,l=ea(i,e),k=l.length;u(`Compressing data: ${h} bytes -> ${k} bytes (${Math.round(100-k/h*100)}% reduction)`);let w="-------314159265358979",T=`\r
--${w}\r
`,H=`\r
--${w}--`,P=n?{name:c,mimeType:"application/zip"}:{name:c,mimeType:"application/zip",parents:[r]},M=8192,j="";for(let Z=0;Z<l.length;Z+=M){let ye=l.subarray(Z,Math.min(Z+M,l.length));j+=String.fromCharCode.apply(null,Array.from(ye))}let ee=btoa(j),ne=T+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(P)+T+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+ee+H,te,K;n?(te=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,K="PATCH"):(te="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",K="POST");let ce=await fetch(te,{method:K,headers:{Authorization:`Bearer ${s}`,"Content-Type":`multipart/related; boundary=${w}`},body:ne});if(ce.status===401)throw new Error("unauthorized");if(!ce.ok)throw new Error("drive upload failed")}async function Yo(e){u("Auth expired, clearing token",null,"warn"),W.isSignedIn=!1,W.accessToken=null,await ai(),je("error","Authorization expired. Please sign in again."),Ee()}async function na(e){if(!W.isSignedIn||!W.accessToken){e?.silent||je("error","Please sign in to Google Drive first");return}try{let{json:i,filename:r,totalVideos:s,totalTimestamps:c}=await Uo();if(c===0){e?.silent||u("Skipping export: no timestamps to back up");return}let n=await Xr(W.accessToken);await ta(r,i,n,W.accessToken),u(`Exported to Google Drive (${r}) with ${s} videos / ${c} timestamps.`)}catch(i){throw i.message==="unauthorized"?(await Yo({silent:e?.silent}),i):(u("Drive export failed:",i,"error"),e?.silent||je("error","Failed to export to Google Drive."),i)}}async function Wo(){try{let e=await kn("autoBackupEnabled"),i=await kn("autoBackupIntervalMinutes"),r=await kn("lastAutoBackupAt");typeof e=="boolean"&&(dt=e),typeof i=="number"&&i>0&&(Je=i),typeof r=="number"&&r>0&&(it=r)}catch(e){u("Failed to load auto backup settings:",e,"error")}}async function Fi(){try{await En("autoBackupEnabled",dt),await En("autoBackupIntervalMinutes",Je),await En("lastAutoBackupAt",it??0)}catch(e){u("Failed to save auto backup settings:",e,"error")}}function ia(){ii&&(clearInterval(ii),ii=null),Ze&&(clearTimeout(Ze),Ze=null)}function tn(e){try{let i=new Date(e),r=new Date,s=i.toDateString()===r.toDateString(),c=i.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return s?c:`${i.toLocaleDateString()} ${c}`}catch{return""}}function Ko(){return dt?en?"#4285f4":nt&&nt>0?"#ffa500":W.isSignedIn&&it?"#52c41a":W.isSignedIn?"#ffa500":"#ff4d4f":"#ff4d4f"}function Ee(){if(!Me)return;let e="",i="";if(!dt)e="\u{1F501} Backup: Off",Me.onmouseenter=null,Me.onmouseleave=null;else if(en)e="\u{1F501} Backing up\u2026",Me.onmouseenter=null,Me.onmouseleave=null;else if(nt&&nt>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(nt/6e4)}m`,Me.onmouseenter=null,Me.onmouseleave=null;else if(it){e=`\u{1F5C4}\uFE0F Last backup: ${tn(it)}`;let r=it+Math.max(1,Je)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${tn(r)}`,Me.onmouseenter=()=>{Me.textContent=i},Me.onmouseleave=()=>{Me.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let r=Date.now()+Math.max(1,Je)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${tn(r)}`,Me.onmouseenter=()=>{Me.textContent=i},Me.onmouseleave=()=>{Me.textContent=e}}Me.textContent=e,Me.style.display=e?"inline":"none";try{let r=Ko();Me.style.color=r}catch{}si()}function si(){if(!ni)return;let e=Ko();ni.style.backgroundColor=e,ct(ni,()=>{let i="";if(!dt)i="Auto backup is disabled";else if(en)i="Backup in progress";else if(nt&&nt>0)i=`Retrying backup in ${Math.ceil(nt/6e4)}m`;else if(W.isSignedIn&&it){let r=it+Math.max(1,Je)*60*1e3,s=tn(r);i=`Last backup: ${tn(it)}
Next backup: ${s}`}else if(W.isSignedIn){let r=Date.now()+Math.max(1,Je)*60*1e3;i=`No backup yet
Next backup: ${tn(r)}`}else i="Not signed in to Google Drive";return i})}async function Sn(e=!0){if(!W.isSignedIn||!W.accessToken){e||Zr();return}if(Ze){u("Auto backup: backoff in progress, skipping scheduled run");return}if(!en){en=!0,Ee();try{await na({silent:e}),it=Date.now(),Qt=0,nt=null,Ze&&(clearTimeout(Ze),Ze=null),await Fi()}catch(i){if(u("Auto backup failed:",i,"error"),i.message==="unauthorized")u("Auth error detected, clearing token and stopping retries",null,"warn"),W.isSignedIn=!1,W.accessToken=null,await ai(),je("error","Authorization expired. Please sign in again."),Ee(),Qt=0,nt=null,Ze&&(clearTimeout(Ze),Ze=null);else if(Qt<Oo){Qt+=1;let c=Math.min(Wr*Math.pow(2,Qt-1),Kr);nt=c,Ze&&clearTimeout(Ze),Ze=setTimeout(()=>{Sn(!0)},c),u(`Scheduling backup retry ${Qt}/${Oo} in ${Math.round(c/1e3)}s`),Ee()}else nt=null}finally{en=!1,Ee()}}}async function nn(e=!1){if(ia(),!!dt&&!(!W.isSignedIn||!W.accessToken)){if(ii=setInterval(()=>{Sn(!0)},Math.max(1,Je)*60*1e3),!e){let i=Date.now(),r=Math.max(1,Je)*60*1e3;(!it||i-it>=r)&&Sn(!0)}Ee()}}async function Zo(){dt=!dt,await Fi(),await nn(),Ee()}async function Jo(){let e=prompt("Set Auto Backup interval (minutes):",String(Je));if(e===null)return;let i=Math.floor(Number(e));if(!Number.isFinite(i)||i<5||i>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Je=i,await Fi(),await nn(),Ee()}var Ri=window.location.hash;if(Ri&&Ri.length>1){let e=new URLSearchParams(Ri.substring(1));if(e.get("state")==="timekeeper_auth"){let r=e.get("access_token");if(r){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",r.length,"characters");try{let s=new BroadcastChannel("timekeeper_oauth"),c={type:"timekeeper_oauth_token",token:r};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:c.type,tokenLength:r.length}),s.postMessage(c),s.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(s){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",s);let c={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},n=indexedDB.open("ytls-timestamps-db",3);n.onsuccess=()=>{let h=n.result,l=h.transaction("settings","readwrite");l.objectStore("settings").put({key:"oauth_message",value:c}),l.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",c.timestamp),h.close()}}}if(history.replaceState){let s=window.location.pathname+window.location.search;history.replaceState(null,"",s)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(t){return GM.getValue(`timekeeper_${t}`,void 0)}function i(t,o){return GM.setValue(`timekeeper_${t}`,JSON.stringify(o))}if(ri(e),oi(i),await qo()){u("OAuth popup detected, broadcasting token and closing");return}await Oi();let s=["/watch","/live"];function c(t=window.location.href){try{let o=new URL(t);return o.origin!=="https://www.youtube.com"?!1:s.some(a=>o.pathname===a||o.pathname.startsWith(`${a}/`))}catch(o){return u("Timekeeper failed to parse URL for support check:",o,"error"),!1}}let n=null,h=null,l=null,k=null,w=null,T=null,H=null,P=null,M=250,j=null,ee=!1;function ne(){return n?n.getBoundingClientRect():null}function te(t,o,a){t&&(qe={x:Math.round(typeof o=="number"?o:t.left),y:Math.round(typeof a=="number"?a:t.top),width:Math.round(t.width),height:Math.round(t.height)})}function K(t=!0){if(!n)return;_t();let o=ne();o&&(o.width||o.height)&&(te(o),t&&(jn("windowPosition",qe),on({type:"window_position_updated",position:qe,timestamp:Date.now()})))}function ce(){if(!n||!h||!k||!l)return;let t=40,o=we();if(o.length>0)t=o[0].offsetHeight;else{let a=document.createElement("li");a.style.visibility="hidden",a.style.position="absolute",a.textContent="00:00 Example",l.appendChild(a),t=a.offsetHeight,l.removeChild(a)}M=h.offsetHeight+k.offsetHeight+t,n.style.minHeight=M+"px"}function Z(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),K(!0)})}function ye(t=450){Le&&(clearTimeout(Le),Le=null),Le=setTimeout(()=>{C(),Z(),Le=null},t)}function ke(){Le&&(clearTimeout(Le),Le=null)}function se(){l&&(l.style.visibility="hidden",u("Hiding timestamps during show animation")),Z(),ye()}function N(){C(),ke(),rt&&(clearTimeout(rt),rt=null),rt=setTimeout(()=>{n&&(n.style.display="none",to(),rt=null)},400)}function C(){if(!l){Ve&&(Ve(),Ve=null,ft=null,wt=null);return}if(!wt){l.style.visibility==="hidden"&&(l.style.visibility="",u("Restoring timestamp visibility (no deferred fragment)")),Ve&&(Ve(),Ve=null,ft=null);return}u("Appending deferred timestamps after animation"),l.appendChild(wt),wt=null,l.style.visibility==="hidden"&&(l.style.visibility="",u("Restoring timestamp visibility after append")),Ve&&(Ve(),Ve=null,ft=null),lt(),Fe(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let t=Y(),o=t?Math.floor(t.getCurrentTime()):It();Number.isFinite(o)&&$t(o,!1)}let ve=null,Te=!1,z="ytls-timestamp-pending-delete",I="ytls-timestamp-highlight",E="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",A="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function D(){let t=o=>{let a=new Image;a.src=o};t(E),t(A)}D();async function O(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(t=>setTimeout(t,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(t=>setTimeout(t,100));await new Promise(t=>setTimeout(t,200))}let F=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],J=5e3,pe=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function ie(t){return pe.has(t)}function le(){return document.querySelector("video")}let he=null;function Y(){if(he&&document.contains(he))return he;let t=document.getElementById("movie_player");return t&&document.contains(t)?t:null}function me(t){return F.every(o=>typeof t?.[o]=="function"?!0:ie(o)?!!le():!1)}function Ue(t){return F.filter(o=>typeof t?.[o]=="function"?!1:ie(o)?!le():!0)}async function Xe(t=J){let o=Date.now();for(;Date.now()-o<t;){let m=Y();if(me(m))return m;await new Promise(g=>setTimeout(g,100))}let a=Y();return me(a),a}let Se="timestampOffsetSeconds",Qe=-5,ot="shiftClickTimeSkipSeconds",mt=10,Ft=300,Lt=300,Ge=null;function Ni(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function _i(){if(Ni()&&!Ge)try{Ge=new BroadcastChannel("ytls_timestamp_channel"),Ge.onmessage=Ui}catch(t){u("Failed to create BroadcastChannel:",t,"warn"),Ge=null}}function on(t){if(!Ni()){u("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(_i(),!Ge){u("No BroadcastChannel available to post message","warn");return}try{Ge.postMessage(t)}catch(o){u("BroadcastChannel error, reopening:",o,"warn");try{Ge=new BroadcastChannel("ytls_timestamp_channel"),Ge.onmessage=Ui,Ge.postMessage(t)}catch(a){u("Failed to reopen BroadcastChannel:",a,"error")}}}function Ui(t){if(u("Received message from another tab:",t.data),!(!c()||!l||!n)&&t.data){if(t.data.type==="timestamps_updated"&&t.data.videoId===De)u("Debouncing timestamp load due to external update for video:",t.data.videoId),clearTimeout(an),an=setTimeout(()=>{u("Reloading timestamps due to external update for video:",t.data.videoId),Ji()},500);else if(t.data.type==="window_position_updated"&&n){let o=t.data.position;if(o&&typeof o.x=="number"&&typeof o.y=="number"){n.style.left=`${o.x}px`,n.style.top=`${o.y}px`,n.style.right="auto",n.style.bottom="auto",typeof o.width=="number"&&o.width>0&&(n.style.width=`${o.width}px`),typeof o.height=="number"&&o.height>0&&(n.style.height=`${o.height}px`);let a=n.getBoundingClientRect();qe={x:Math.round(o.x),y:Math.round(o.y),width:Math.round(a.width),height:Math.round(a.height)};let m=document.documentElement.clientWidth,g=document.documentElement.clientHeight;(a.left<0||a.top<0||a.right>m||a.bottom>g)&&_t()}}}}_i();let Rt=await GM.getValue(Se);(typeof Rt!="number"||Number.isNaN(Rt))&&(Rt=Qe,await GM.setValue(Se,Rt));let rn=await GM.getValue(ot);(typeof rn!="number"||Number.isNaN(rn))&&(rn=mt,await GM.setValue(ot,rn));let an=null,Mt=new Map,Mn=!1,G=null,Dn=null,De=null,rt=null,Le=null,wt=null,ft=null,Ve=null,xt=null,In=!1,qe=null,li=!1,Cn=null,An=null,$n=null,Bn=null,zn=null,Hn=null,Pn=null,sn=null,ln=null,un=null,at=null,st=null,Gi=0,cn=!1,Dt=null,dn=null;function we(){return l?Array.from(l.querySelectorAll("li")).filter(t=>!!t.querySelector("a[data-time]")):[]}function ui(){return we().map(t=>{let o=t.querySelector("a[data-time]"),a=o?.dataset.time;if(!o||!a)return null;let m=Number.parseInt(a,10);if(!Number.isFinite(m))return null;let v=t.querySelector("input")?.value??"",d=t.dataset.guid??crypto.randomUUID();return t.dataset.guid||(t.dataset.guid=d),{start:m,comment:v,guid:d}}).filter(ji)}function It(){if(dn!==null)return dn;let t=we();return dn=t.length>0?Math.max(...t.map(o=>{let a=o.querySelector("a[data-time]")?.getAttribute("data-time");return a?Number.parseInt(a,10):0})):0,dn}function On(){dn=null}function Xo(t){let o=t.querySelector(".time-diff");return o?(o.textContent?.trim()||"").startsWith("-"):!1}function Qo(t,o){return t?o?"\u2514\u2500 ":"\u251C\u2500 ":""}function mn(t){return t.startsWith("\u251C\u2500 ")||t.startsWith("\u2514\u2500 ")?1:0}function qi(t){return t.replace(/^[├└]─\s/,"")}function er(t){let o=we();if(t>=o.length-1)return"\u2514\u2500 ";let a=o[t+1].querySelector("input");return a&&mn(a.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function lt(){if(!l)return;let t=we(),o=!0,a=0,m=t.length;for(;o&&a<m;)o=!1,a++,t.forEach((g,v)=>{let d=g.querySelector("input");if(!d||!(mn(d.value)===1))return;let S=!1;if(v<t.length-1){let q=t[v+1].querySelector("input");q&&(S=!(mn(q.value)===1))}else S=!0;let L=qi(d.value),$=`${Qo(!0,S)}${L}`;d.value!==$&&(d.value=$,o=!0)})}function Ct(){if(l){for(;l.firstChild;)l.removeChild(l.firstChild);wt&&(wt=null),Ve&&(Ve(),Ve=null,ft=null)}}function fn(){if(!l||Te||wt)return;Array.from(l.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||ci("No timestamps for this video")}function ci(t){if(!l)return;Ct();let o=document.createElement("li");o.className="ytls-placeholder",o.textContent=t,l.appendChild(o),l.style.overflowY="hidden"}function di(){if(!l)return;let t=l.querySelector(".ytls-placeholder");t&&t.remove(),l.style.overflowY=""}function mi(t){if(!(!n||!l)){if(Te=t,t)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),ci("Loading timestamps...");else if(di(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),w){let o=Y();if(o){let a=o.getCurrentTime(),m=Number.isFinite(a)?Math.max(0,Math.floor(a)):Math.max(0,It()),g=Math.floor(m/3600),v=Math.floor(m/60)%60,d=m%60,{isLive:y}=o.getVideoData()||{isLive:!1},S=l?we().map(B=>{let $=B.querySelector("a[data-time]");return $?parseFloat($.getAttribute("data-time")??"0"):0}):[],L="";if(S.length>0)if(y){let B=Math.max(1,m/60),$=S.filter(q=>q<=m);if($.length>0){let q=($.length/B).toFixed(2);parseFloat(q)>0&&(L=` (${q}/min)`)}}else{let B=o.getDuration(),$=Number.isFinite(B)&&B>0?B:0,q=Math.max(1,$/60),xe=(S.length/q).toFixed(1);parseFloat(xe)>0&&(L=` (${xe}/min)`)}w.textContent=`\u23F3${g?g+":"+String(v).padStart(2,"0"):v}:${String(d).padStart(2,"0")}${L}`}}!Te&&l&&!l.querySelector(".ytls-error-message")&&fn(),pt()}}function ji(t){return!!t&&Number.isFinite(t.start)&&typeof t.comment=="string"&&typeof t.guid=="string"}function Fn(t,o){t.textContent=kt(o),t.dataset.time=String(o),t.href=ki(o,window.location.href)}let Rn=null,Nn=null,At=!1;function tr(t){if(!t||typeof t.getVideoData!="function"||!t.getVideoData()?.isLive)return!1;if(typeof t.getProgressState=="function"){let a=t.getProgressState(),m=Number(a?.seekableEnd??a?.liveHead??a?.head??a?.duration),g=Number(a?.current??t.getCurrentTime?.());if(Number.isFinite(m)&&Number.isFinite(g))return m-g>2}return!1}function $t(t,o){if(!Number.isFinite(t))return;let a=_n(t);pn(a,o)}function _n(t){if(!Number.isFinite(t))return null;let o=we();if(o.length===0)return null;let a=null,m=-1/0;for(let g of o){let d=g.querySelector("a[data-time]")?.dataset.time;if(!d)continue;let y=Number.parseInt(d,10);Number.isFinite(y)&&y<=t&&y>m&&(m=y,a=g)}return a}function pn(t,o=!1){if(!t)return;if(we().forEach(m=>{m.classList.contains(z)||m.classList.remove(I)}),!t.classList.contains(z)&&(t.classList.add(I),o&&!Mn))try{if(l instanceof HTMLElement){let m=t.getBoundingClientRect(),g=l.getBoundingClientRect();!(m.bottom<g.top||m.top>g.bottom)||t.scrollIntoView({behavior:"smooth",block:"center"})}else t.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{t.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function nr(t){if(!l||l.querySelector(".ytls-error-message")||!Number.isFinite(t)||t===0)return!1;let o=we();if(o.length===0)return!1;let a=!1;return o.forEach(m=>{let g=m.querySelector("a[data-time]"),v=g?.dataset.time;if(!g||!v)return;let d=Number.parseInt(v,10);if(!Number.isFinite(d))return;let y=Math.max(0,d+t);y!==d&&(Fn(g,y),a=!0)}),a?(gn(),lt(),Fe(),Gn(De),Dt=null,!0):!1}function Vi(t,o={}){if(!Number.isFinite(t)||t===0)return!1;if(!nr(t)){if(o.alertOnNoChange){let d=o.failureMessage??"Offset did not change any timestamps.";alert(d)}return!1}let m=o.logLabel??"bulk offset";u(`Timestamps changed: Offset all timestamps by ${t>0?"+":""}${t} seconds (${m})`);let g=Y(),v=g?Math.floor(g.getCurrentTime()):0;if(Number.isFinite(v)){let d=_n(v);pn(d,!1)}return!0}function Yi(t){if(!l||Te)return;let o=t.target instanceof HTMLElement?t.target:null;if(o)if(o.dataset.time){t.preventDefault();let a=Number(o.dataset.time);if(Number.isFinite(a)){At=!0;let g=Y();g&&g.seekTo(a),setTimeout(()=>{At=!1},500)}let m=o.closest("li");m&&(we().forEach(g=>{g.classList.contains(z)||g.classList.remove(I)}),m.classList.contains(z)||(m.classList.add(I),m.scrollIntoView({behavior:"smooth",block:"center"})))}else if(o.dataset.increment){t.preventDefault();let m=o.parentElement?.querySelector("a[data-time]");if(!m||!m.dataset.time)return;let g=parseInt(m.dataset.time,10),v=parseInt(o.dataset.increment,10);if("shiftKey"in t&&t.shiftKey&&(v*=rn),"altKey"in t?t.altKey:!1){Vi(v,{logLabel:"Alt adjust"});return}let S=Math.max(0,g+v);u(`Timestamps changed: Timestamp time incremented from ${g} to ${S}`),Fn(m,S),On();let L=o.closest("li");if(Nn=S,Rn&&clearTimeout(Rn),At=!0,Rn=setTimeout(()=>{if(Nn!==null){let B=Y();B&&B.seekTo(Nn)}Rn=null,Nn=null,setTimeout(()=>{At=!1},500)},500),gn(),lt(),Fe(),L){let B=L.querySelector("input"),$=L.dataset.guid;B&&$&&(Nt(De,$,S,B.value),Dt=$)}}else o.dataset.action==="clear"&&(t.preventDefault(),u("Timestamps changed: All timestamps cleared from UI"),l.textContent="",On(),Fe(),Un(),Gn(De,{allowEmpty:!0}),Dt=null,fn())}function hn(t,o="",a=!1,m=null,g=!0){if(!l)return null;let v=Math.max(0,t),d=m??crypto.randomUUID(),y=document.createElement("li"),S=document.createElement("div"),L=document.createElement("span"),B=document.createElement("span"),$=document.createElement("span"),q=document.createElement("a"),xe=document.createElement("span"),X=document.createElement("input"),oe=document.createElement("button");y.dataset.guid=d,S.className="time-row";let Re=document.createElement("div");Re.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",ct(Re,"Click to toggle indent");let $e=document.createElement("span");$e.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let Be=()=>{let be=mn(X.value);$e.textContent=be===1?"\u25C0":"\u25B6"},Tt=be=>{be.stopPropagation();let re=mn(X.value),Ie=qi(X.value),ze=re===0?1:0,ge="";if(ze===1){let et=we().indexOf(y);ge=er(et)}X.value=`${ge}${Ie}`,Be(),lt();let Ce=Number.parseInt(q.dataset.time??"0",10);Nt(De,d,Ce,X.value)};Re.onclick=Tt,Re.append($e),y.style.cssText="position:relative;padding-left:20px;",y.addEventListener("mouseenter",()=>{Be(),$e.style.display="inline"}),y.addEventListener("mouseleave",()=>{$e.style.display="none"}),y.addEventListener("mouseleave",()=>{y.dataset.guid===Dt&&Xo(y)&&Wi()}),X.value=o||"",X.style.cssText="width:100%;margin-top:5px;display:block;",X.type="text",X.setAttribute("inputmode","text"),X.autocapitalize="off",X.autocomplete="off",X.spellcheck=!1,X.addEventListener("focusin",()=>{cn=!1}),X.addEventListener("focusout",be=>{let re=be.relatedTarget,Ie=Date.now()-Gi<250,ze=!!re&&!!n&&n.contains(re);!Ie&&!ze&&(cn=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(X.focus({preventScroll:!0}),cn=!1)},0))}),X.addEventListener("input",be=>{let re=be;if(re&&(re.isComposing||re.inputType==="insertCompositionText"))return;let Ie=Mt.get(d);Ie&&clearTimeout(Ie);let ze=setTimeout(()=>{let ge=Number.parseInt(q.dataset.time??"0",10);Nt(De,d,ge,X.value),Mt.delete(d)},500);Mt.set(d,ze)}),X.addEventListener("compositionend",()=>{let be=Number.parseInt(q.dataset.time??"0",10);setTimeout(()=>{Nt(De,d,be,X.value)},50)}),L.textContent="\u2796",L.dataset.increment="-1",L.style.cursor="pointer",L.style.margin="0px",L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),$.textContent="\u2795",$.dataset.increment="1",$.style.cursor="pointer",$.style.margin="0px",$.addEventListener("mouseenter",()=>{$.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),$.addEventListener("mouseleave",()=>{$.style.textShadow="none"}),B.textContent="\u23FA\uFE0F",B.style.cursor="pointer",B.style.margin="0px",ct(B,"Set to current playback time"),B.addEventListener("mouseenter",()=>{B.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),B.addEventListener("mouseleave",()=>{B.style.textShadow="none"}),B.onclick=()=>{let be=Y(),re=be?Math.floor(be.getCurrentTime()):0;Number.isFinite(re)&&(u(`Timestamps changedset to current playback time ${re}`),Fn(q,re),gn(),lt(),Nt(De,d,re,X.value),Dt=d)},Fn(q,v),On(),oe.textContent="\u{1F5D1}\uFE0F",oe.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",oe.addEventListener("mouseenter",()=>{oe.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),oe.addEventListener("mouseleave",()=>{oe.style.textShadow="none"}),oe.onclick=()=>{let be=null,re=null,Ie=null,ze=()=>{try{y.removeEventListener("click",re,!0)}catch{}try{document.removeEventListener("click",re,!0)}catch{}if(l)try{l.removeEventListener("mouseleave",Ie)}catch{}be&&(clearTimeout(be),be=null)};if(y.dataset.deleteConfirmed==="true"){u("Timestamps changed: Timestamp deleted");let ge=y.dataset.guid??"",Ce=Mt.get(ge);Ce&&(clearTimeout(Ce),Mt.delete(ge)),ze(),y.remove(),On(),gn(),lt(),Fe(),Un(),ir(De,ge),Dt=null,fn()}else{y.dataset.deleteConfirmed="true",y.classList.add(z),y.classList.remove(I);let ge=()=>{y.dataset.deleteConfirmed="false",y.classList.remove(z);let Ce=Y(),ut=Ce?Ce.getCurrentTime():0,et=Number.parseInt(y.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(ut)&&Number.isFinite(et)&&ut>=et&&y.classList.add(I),ze()};re=Ce=>{Ce.target!==oe&&ge()},Ie=()=>{y.dataset.deleteConfirmed==="true"&&ge()},y.addEventListener("click",re,!0),document.addEventListener("click",re,!0),l&&l.addEventListener("mouseleave",Ie),be=setTimeout(()=>{y.dataset.deleteConfirmed==="true"&&ge(),ze()},5e3)}},xe.className="time-diff",xe.style.color="#888",xe.style.marginLeft="5px",S.append(L,B,$,q,xe,oe),y.append(Re,S,X);let ht=Number.parseInt(q.dataset.time??"0",10);if(g){di();let be=!1,re=we();for(let Ie=0;Ie<re.length;Ie++){let ze=re[Ie],Ce=ze.querySelector("a[data-time]")?.dataset.time;if(!Ce)continue;let ut=Number.parseInt(Ce,10);if(Number.isFinite(ut)&&ht<ut){l.insertBefore(y,ze),be=!0;let et=re[Ie-1];if(et){let Yt=et.querySelector("a[data-time]")?.dataset.time;if(Yt){let Wt=Number.parseInt(Yt,10);Number.isFinite(Wt)&&(xe.textContent=kt(ht-Wt))}}else xe.textContent="";let Vt=ze.querySelector(".time-diff");Vt&&(Vt.textContent=kt(ut-ht));break}}if(!be&&(l.appendChild(y),re.length>0)){let ge=re[re.length-1].querySelector("a[data-time]")?.dataset.time;if(ge){let Ce=Number.parseInt(ge,10);Number.isFinite(Ce)&&(xe.textContent=kt(ht-Ce))}}y.scrollIntoView({behavior:"smooth",block:"center"}),Un(),lt(),Fe(),a||(Nt(De,d,v,o),Dt=d,pn(y,!1))}else X.__ytls_li=y;return X}function gn(){if(!l||l.querySelector(".ytls-error-message"))return;let t=we();t.forEach((o,a)=>{let m=o.querySelector(".time-diff");if(!m)return;let v=o.querySelector("a[data-time]")?.dataset.time;if(!v){m.textContent="";return}let d=Number.parseInt(v,10);if(!Number.isFinite(d)){m.textContent="";return}if(a===0){m.textContent="";return}let L=t[a-1].querySelector("a[data-time]")?.dataset.time;if(!L){m.textContent="";return}let B=Number.parseInt(L,10);if(!Number.isFinite(B)){m.textContent="";return}let $=d-B,q=$<0?"-":"";m.textContent=` ${q}${kt(Math.abs($))}`})}function Wi(){if(!l||l.querySelector(".ytls-error-message")||Te)return;let t=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)){let d=document.activeElement,S=d.closest("li")?.dataset.guid;if(S){let L=d.selectionStart??d.value.length,B=d.selectionEnd??L,$=d.scrollLeft;t={guid:S,start:L,end:B,scroll:$}}}let o=we();if(o.length===0)return;let a=o.map(d=>d.dataset.guid),m=o.map(d=>{let y=d.querySelector("a[data-time]"),S=y?.dataset.time;if(!y||!S)return null;let L=Number.parseInt(S,10);if(!Number.isFinite(L))return null;let B=d.dataset.guid??"";return{time:L,guid:B,element:d}}).filter(d=>d!==null).sort((d,y)=>{let S=d.time-y.time;return S!==0?S:d.guid.localeCompare(y.guid)}),g=m.map(d=>d.guid),v=a.length!==g.length||a.some((d,y)=>d!==g[y]);for(;l.firstChild;)l.removeChild(l.firstChild);if(m.forEach(d=>{l.appendChild(d.element)}),gn(),lt(),Fe(),t){let y=we().find(S=>S.dataset.guid===t.guid)?.querySelector("input");if(y)try{y.focus({preventScroll:!0})}catch{}}v&&(u("Timestamps changed: Timestamps sorted"),Gn(De))}function Un(){if(!l||!n||!h||!k)return;let t=we().length;typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea();let o=n.getBoundingClientRect(),a=h.getBoundingClientRect(),m=k.getBoundingClientRect(),g=Math.max(0,o.height-(a.height+m.height));t===0?(fn(),l.style.overflowY="hidden"):l.style.overflowY=l.scrollHeight>g?"auto":"hidden"}function Fe(){if(!l)return;let t=le(),o=document.querySelector(".ytp-progress-bar"),a=Y(),m=a?a.getVideoData():null,g=!!m&&!!m.isLive;if(!t||!o||!isFinite(t.duration)||g)return;Zi(),we().map(d=>{let y=d.querySelector("a[data-time]"),S=y?.dataset.time;if(!y||!S)return null;let L=Number.parseInt(S,10);if(!Number.isFinite(L))return null;let $=d.querySelector("input")?.value??"",q=d.dataset.guid??crypto.randomUUID();return d.dataset.guid||(d.dataset.guid=q),{start:L,comment:$,guid:q}}).filter(ji).forEach(d=>{if(!Number.isFinite(d.start))return;let y=document.createElement("div");y.className="ytls-marker",y.style.position="absolute",y.style.height="100%",y.style.width="2px",y.style.backgroundColor="#ff0000",y.style.cursor="pointer",y.style.left=d.start/t.duration*100+"%",y.dataset.time=String(d.start),y.addEventListener("click",()=>{let S=Y();S&&S.seekTo(d.start)}),o.appendChild(y)})}function Gn(t,o={}){if(!l||l.querySelector(".ytls-error-message")||!t)return;if(Te){u("Save blocked: timestamps are currently loading");return}lt();let a=ui().sort((m,g)=>m.start-g.start);if(a.length===0&&!o.allowEmpty){u("Save skipped: no timestamps to save");return}Qi(t,a).then(()=>u(`Successfully saved ${a.length} timestamps for ${t} to IndexedDB`)).catch(m=>u(`Failed to save timestamps for ${t} to IndexedDB:`,m,"error")),on({type:"timestamps_updated",videoId:t,action:"saved"})}function Nt(t,o,a,m){if(!t||Te)return;let g={guid:o,start:a,comment:m};u(`Saving timestamp: guid=${o}, start=${a}, comment="${m}"`),pr(t,g).catch(v=>u(`Failed to save timestamp ${o}:`,v,"error")),on({type:"timestamps_updated",videoId:t,action:"saved"})}function ir(t,o){!t||Te||(u(`Deleting timestamp: guid=${o}`),hr(t,o).catch(a=>u(`Failed to delete timestamp ${o}:`,a,"error")),on({type:"timestamps_updated",videoId:t,action:"saved"}))}async function Ki(t){if(!l||l.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let o=De;if(!o)return;u(`Exporting timestamps for video ID: ${o}`);let a=ui(),m=Math.max(It(),0),g=vn();if(t==="json"){let v=new Blob([JSON.stringify(a,null,2)],{type:"application/json"}),d=URL.createObjectURL(v),y=document.createElement("a");y.href=d,y.download=`timestamps-${o}-${g}.json`,y.click(),URL.revokeObjectURL(d)}else if(t==="text"){let v=a.map(L=>{let B=kt(L.start,m),$=`${L.comment} <!-- guid:${L.guid} -->`.trimStart();return`${B} ${$}`}).join(`
`),d=new Blob([v],{type:"text/plain"}),y=URL.createObjectURL(d),S=document.createElement("a");S.href=y,S.download=`timestamps-${o}-${g}.txt`,S.click(),URL.revokeObjectURL(y)}}function fi(t){if(!n||!l){u("Timekeeper error:",t,"error");return}Ct();let o=document.createElement("li");o.textContent=t,o.classList.add("ytls-error-message"),o.style.color="#ff6b6b",o.style.fontWeight="bold",o.style.padding="8px",o.style.background="rgba(255, 0, 0, 0.1)",l.appendChild(o),Fe()}function Zi(){document.querySelectorAll(".ytls-marker").forEach(t=>t.remove())}function _t(){if(!n||!document.body.contains(n))return;let t=n.getBoundingClientRect(),o=document.documentElement.clientWidth,a=document.documentElement.clientHeight,m=t.width,g=t.height;if(t.left<0&&(n.style.left="0",n.style.right="auto"),t.right>o){let v=Math.max(0,o-m);n.style.left=`${v}px`,n.style.right="auto"}if(t.top<0&&(n.style.top="0",n.style.bottom="auto"),t.bottom>a){let v=Math.max(0,a-g);n.style.top=`${v}px`,n.style.bottom="auto"}}function or(){if(Cn&&(document.removeEventListener("mousemove",Cn),Cn=null),An&&(document.removeEventListener("mouseup",An),An=null),sn&&(document.removeEventListener("keydown",sn),sn=null),$n&&(window.removeEventListener("resize",$n),$n=null),ln&&(document.removeEventListener("pointerdown",ln,!0),ln=null),un&&(document.removeEventListener("pointerup",un,!0),un=null),at){try{at.disconnect()}catch{}at=null}if(st){try{st.disconnect()}catch{}st=null}let t=le();t&&(Bn&&(t.removeEventListener("timeupdate",Bn),Bn=null),zn&&(t.removeEventListener("pause",zn),zn=null),Hn&&(t.removeEventListener("play",Hn),Hn=null),Pn&&(t.removeEventListener("seeking",Pn),Pn=null))}function rr(){Zi(),Mt.forEach(o=>clearTimeout(o)),Mt.clear(),an&&(clearTimeout(an),an=null),ve&&(clearInterval(ve),ve=null),rt&&(clearTimeout(rt),rt=null),or();try{Ge.close()}catch{}if(G&&G.parentNode===document.body&&document.body.removeChild(G),G=null,Dn=null,Mn=!1,De=null,at){try{at.disconnect()}catch{}at=null}if(st){try{st.disconnect()}catch{}st=null}n&&n.parentNode&&n.remove();let t=document.getElementById("ytls-header-button");t&&t.parentNode&&t.remove(),xt=null,In=!1,qe=null,Ct(),n=null,h=null,l=null,k=null,w=null,T=null,H=null,he=null}async function ar(){let t=pi();if(!t)return he=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let o=await Xe();if(!me(o)){let a=Ue(o),m=a.length?` Missing methods: ${a.join(", ")}.`:"",g=o?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return he=null,{ok:!1,message:`${g}${m} Try refreshing once playback is ready.`}}return he=o,{ok:!0,player:o,videoId:t}}async function Ji(){if(!n||!l)return;let t=l.scrollTop,o=!0,a=()=>{if(!l||!o)return;let m=Math.max(0,l.scrollHeight-l.clientHeight);l.scrollTop=Math.min(t,m)};try{let m=await ar();if(!m.ok){fi(m.message),Ct(),Fe();return}let{videoId:g}=m,v=[];try{let d=await gr(g);d?(v=d.map(y=>({...y,guid:y.guid||crypto.randomUUID()})),u(`Loaded ${v.length} timestamps from IndexedDB for ${g}`)):u(`No timestamps found in IndexedDB for ${g}`)}catch(d){u(`Failed to load timestamps from IndexedDB for ${g}:`,d,"error"),fi("Failed to load timestamps from IndexedDB. Try refreshing the page."),Fe();return}if(v.length>0){v.sort((B,$)=>B.start-$.start),Ct(),di();let d=document.createDocumentFragment();v.forEach(B=>{let q=hn(B.start,B.comment,!0,B.guid,!1).__ytls_li;q&&d.appendChild(q)}),n&&n.classList.contains("ytls-zoom-in")&&Le!=null?(u("Deferring timestamp DOM append until show animation completes"),wt=d,ft||(ft=new Promise(B=>{Ve=B})),await ft):l&&(l.appendChild(d),lt(),Fe(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let S=Y(),L=S?Math.floor(S.getCurrentTime()):It();Number.isFinite(L)&&($t(L,!1),o=!1)}else Ct(),ci("No timestamps for this video"),Fe(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(m){u("Unexpected error while loading timestamps:",m,"error"),fi("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{ft&&await ft,requestAnimationFrame(a),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),l&&!l.querySelector(".ytls-error-message")&&fn()}}function pi(){let o=new URLSearchParams(location.search).get("v");if(o)return o;let a=document.querySelector('meta[itemprop="identifier"]');return a?.content?a.content:null}function sr(){let t=le();if(!t)return;let o=()=>{if(!l)return;let d=Y(),y=d?Math.floor(d.getCurrentTime()):0;if(!Number.isFinite(y))return;let S=_n(y);pn(S,!1)},a=d=>{try{let y=new URL(window.location.href);d!==null&&Number.isFinite(d)?y.searchParams.set("t",`${Math.floor(d)}s`):y.searchParams.delete("t"),window.history.replaceState({},"",y.toString())}catch{}},m=()=>{let d=Y(),y=d?Math.floor(d.getCurrentTime()):NaN;if(Number.isFinite(y)){a(y);try{$t(y,!0)}catch(S){u("Failed to highlight nearest timestamp on pause:",S,"warn")}}},g=()=>{a(null);try{let d=Y(),y=d?Math.floor(d.getCurrentTime()):NaN;Number.isFinite(y)&&$t(y,!0)}catch(d){u("Failed to highlight nearest timestamp on play:",d,"warn")}},v=()=>{let d=le();if(!d)return;let y=Y(),S=y?Math.floor(y.getCurrentTime()):0;if(!Number.isFinite(S))return;d.paused&&a(S);let L=_n(S);pn(L,!0)};Bn=o,zn=m,Hn=g,Pn=v,t.addEventListener("timeupdate",o),t.addEventListener("pause",m),t.addEventListener("play",g),t.addEventListener("seeking",v)}let lr="ytls-timestamps-db",ur=3,Ut="timestamps",Ye="timestamps_v2",qn="settings",Gt=null,qt=null;function jt(){if(Gt)try{if(Gt.objectStoreNames.length>=0)return Promise.resolve(Gt)}catch(t){u("IndexedDB connection is no longer usable:",t,"warn"),Gt=null}return qt||(qt=fr().then(t=>(Gt=t,qt=null,t.onclose=()=>{u("IndexedDB connection closed unexpectedly","warn"),Gt=null},t.onerror=o=>{u("IndexedDB connection error:",o,"error")},t)).catch(t=>{throw qt=null,t}),qt)}async function Xi(){let t={},o=await eo(Ye),a=new Map;for(let v of o){let d=v;a.has(d.video_id)||a.set(d.video_id,[]),a.get(d.video_id).push({guid:d.guid,start:d.start,comment:d.comment})}for(let[v,d]of a)t[`ytls-${v}`]={video_id:v,timestamps:d.sort((y,S)=>y.start-S.start)};return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:a.size,totalTimestamps:o.length}}async function cr(){try{let{json:t,filename:o,totalVideos:a,totalTimestamps:m}=await Xi(),g=new Blob([t],{type:"application/json"}),v=URL.createObjectURL(g),d=document.createElement("a");d.href=v,d.download=o,d.click(),URL.revokeObjectURL(v),u(`Exported ${a} videos with ${m} timestamps`)}catch(t){throw u("Failed to export data:",t,"error"),t}}async function dr(){let t=await eo(Ye);if(!Array.isArray(t)||t.length===0){let L=`Tag,Timestamp,URL
`,B=`timestamps-${vn()}.csv`;return{csv:L,filename:B,totalVideos:0,totalTimestamps:0}}let o=new Map;for(let L of t)o.has(L.video_id)||o.set(L.video_id,[]),o.get(L.video_id).push({start:L.start,comment:L.comment});let a=[];a.push("Tag,Timestamp,URL");let m=0,g=L=>`"${String(L).replace(/"/g,'""')}"`,v=L=>{let B=Math.floor(L/3600),$=Math.floor(L%3600/60),q=String(L%60).padStart(2,"0");return`${String(B).padStart(2,"0")}:${String($).padStart(2,"0")}:${q}`},d=Array.from(o.keys()).sort();for(let L of d){let B=o.get(L).sort(($,q)=>$.start-q.start);for(let $ of B){let q=$.comment,xe=v($.start),X=ki($.start,`https://www.youtube.com/watch?v=${L}`);a.push([g(q),g(xe),g(X)].join(",")),m++}}let y=a.join(`
`),S=`timestamps-${vn()}.csv`;return{csv:y,filename:S,totalVideos:o.size,totalTimestamps:m}}async function mr(){try{let{csv:t,filename:o,totalVideos:a,totalTimestamps:m}=await dr(),g=new Blob([t],{type:"text/csv;charset=utf-8;"}),v=URL.createObjectURL(g),d=document.createElement("a");d.href=v,d.download=o,d.click(),URL.revokeObjectURL(v),u(`Exported ${a} videos with ${m} timestamps (CSV)`)}catch(t){throw u("Failed to export CSV data:",t,"error"),t}}function fr(){return new Promise((t,o)=>{let a=indexedDB.open(lr,ur);a.onupgradeneeded=m=>{let g=m.target.result,v=m.oldVersion,d=m.target.transaction;if(v<1&&g.createObjectStore(Ut,{keyPath:"video_id"}),v<2&&!g.objectStoreNames.contains(qn)&&g.createObjectStore(qn,{keyPath:"key"}),v<3){if(g.objectStoreNames.contains(Ut)){u("Exporting backup before v2 migration...");let L=d.objectStore(Ut).getAll();L.onsuccess=()=>{let B=L.result;if(B.length>0)try{let $={},q=0;B.forEach(Re=>{if(Array.isArray(Re.timestamps)&&Re.timestamps.length>0){let $e=Re.timestamps.map(Be=>({guid:Be.guid||crypto.randomUUID(),start:Be.start,comment:Be.comment}));$[`ytls-${Re.video_id}`]={video_id:Re.video_id,timestamps:$e.sort((Be,Tt)=>Be.start-Tt.start)},q+=$e.length}});let xe=new Blob([JSON.stringify($,null,2)],{type:"application/json"}),X=URL.createObjectURL(xe),oe=document.createElement("a");oe.href=X,oe.download=`timekeeper-data-${vn()}.json`,oe.click(),URL.revokeObjectURL(X),u(`Pre-migration backup exported: ${B.length} videos, ${q} timestamps`)}catch($){u("Failed to export pre-migration backup:",$,"error")}}}let y=g.createObjectStore(Ye,{keyPath:"guid"});if(y.createIndex("video_id","video_id",{unique:!1}),y.createIndex("video_start",["video_id","start"],{unique:!1}),g.objectStoreNames.contains(Ut)){let L=d.objectStore(Ut).getAll();L.onsuccess=()=>{let B=L.result;if(B.length>0){let $=0;B.forEach(q=>{Array.isArray(q.timestamps)&&q.timestamps.length>0&&q.timestamps.forEach(xe=>{y.put({guid:xe.guid||crypto.randomUUID(),video_id:q.video_id,start:xe.start,comment:xe.comment}),$++})}),u(`Migrated ${$} timestamps from ${B.length} videos to v2 store`)}},g.deleteObjectStore(Ut),u("Deleted old timestamps store after migration to v2")}}},a.onsuccess=m=>{t(m.target.result)},a.onerror=m=>{let g=m.target.error;o(g??new Error("Failed to open IndexedDB"))}})}function hi(t,o,a){return jt().then(m=>new Promise((g,v)=>{let d;try{d=m.transaction(t,o)}catch(L){v(new Error(`Failed to create transaction for ${t}: ${L}`));return}let y=d.objectStore(t),S;try{S=a(y)}catch(L){v(new Error(`Failed to execute operation on ${t}: ${L}`));return}S&&(S.onsuccess=()=>g(S.result),S.onerror=()=>v(S.error??new Error(`IndexedDB ${o} operation failed`))),d.oncomplete=()=>{S||g(void 0)},d.onerror=()=>v(d.error??new Error("IndexedDB transaction failed")),d.onabort=()=>v(d.error??new Error("IndexedDB transaction aborted"))}))}function Qi(t,o){return jt().then(a=>new Promise((m,g)=>{let v;try{v=a.transaction([Ye],"readwrite")}catch(L){g(new Error(`Failed to create transaction: ${L}`));return}let d=v.objectStore(Ye),S=d.index("video_id").getAll(IDBKeyRange.only(t));S.onsuccess=()=>{try{let L=S.result,B=new Set(o.map($=>$.guid));L.forEach($=>{B.has($.guid)||d.delete($.guid)}),o.forEach($=>{d.put({guid:$.guid,video_id:t,start:$.start,comment:$.comment})})}catch(L){u("Error during save operation:",L,"error")}},S.onerror=()=>{g(S.error??new Error("Failed to get existing records"))},v.oncomplete=()=>m(),v.onerror=()=>g(v.error??new Error("Failed to save to IndexedDB")),v.onabort=()=>g(v.error??new Error("Transaction aborted during save"))}))}function pr(t,o){return jt().then(a=>new Promise((m,g)=>{let v;try{v=a.transaction([Ye],"readwrite")}catch(S){g(new Error(`Failed to create transaction: ${S}`));return}let y=v.objectStore(Ye).put({guid:o.guid,video_id:t,start:o.start,comment:o.comment});y.onerror=()=>{g(y.error??new Error("Failed to put timestamp"))},v.oncomplete=()=>m(),v.onerror=()=>g(v.error??new Error("Failed to save single timestamp to IndexedDB")),v.onabort=()=>g(v.error??new Error("Transaction aborted during single timestamp save"))}))}function hr(t,o){return u(`Deleting timestamp ${o} for video ${t}`),jt().then(a=>new Promise((m,g)=>{let v;try{v=a.transaction([Ye],"readwrite")}catch(S){g(new Error(`Failed to create transaction: ${S}`));return}let y=v.objectStore(Ye).delete(o);y.onerror=()=>{g(y.error??new Error("Failed to delete timestamp"))},v.oncomplete=()=>m(),v.onerror=()=>g(v.error??new Error("Failed to delete single timestamp from IndexedDB")),v.onabort=()=>g(v.error??new Error("Transaction aborted during timestamp deletion"))}))}function gr(t){return jt().then(o=>new Promise(a=>{let m;try{m=o.transaction([Ye],"readonly")}catch(y){u("Failed to create read transaction:",y,"warn"),a(null);return}let d=m.objectStore(Ye).index("video_id").getAll(IDBKeyRange.only(t));d.onsuccess=()=>{let y=d.result;if(y.length>0){let S=y.map(L=>({guid:L.guid,start:L.start,comment:L.comment})).sort((L,B)=>L.start-B.start);a(S)}else a(null)},d.onerror=()=>{u("Failed to load timestamps:",d.error,"warn"),a(null)},m.onabort=()=>{u("Transaction aborted during load:",m.error,"warn"),a(null)}}))}function yr(t){return jt().then(o=>new Promise((a,m)=>{let g;try{g=o.transaction([Ye],"readwrite")}catch(S){m(new Error(`Failed to create transaction: ${S}`));return}let v=g.objectStore(Ye),y=v.index("video_id").getAll(IDBKeyRange.only(t));y.onsuccess=()=>{try{y.result.forEach(L=>{v.delete(L.guid)})}catch(S){u("Error during remove operation:",S,"error")}},y.onerror=()=>{m(y.error??new Error("Failed to get records for removal"))},g.oncomplete=()=>a(),g.onerror=()=>m(g.error??new Error("Failed to remove timestamps")),g.onabort=()=>m(g.error??new Error("Transaction aborted during timestamp removal"))}))}function eo(t){return hi(t,"readonly",o=>o.getAll()).then(o=>Array.isArray(o)?o:[])}function jn(t,o){hi(qn,"readwrite",a=>{a.put({key:t,value:o})}).catch(a=>{u(`Failed to save setting '${t}' to IndexedDB:`,a,"error")})}function gi(t){return hi(qn,"readonly",o=>o.get(t)).then(o=>o?.value).catch(o=>{u(`Failed to load setting '${t}' from IndexedDB:`,o,"error")})}function to(){if(!n)return;let t=n.style.display!=="none";jn("uiVisible",t)}function pt(t){let o=typeof t=="boolean"?t:!!n&&n.style.display!=="none",a=document.getElementById("ytls-header-button");a instanceof HTMLButtonElement&&a.setAttribute("aria-pressed",String(o)),xt&&!In&&xt.src!==E&&(xt.src=E)}function vr(){n&&gi("uiVisible").then(t=>{let o=t;typeof o=="boolean"?(o?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",pt(o)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),pt(!0))}).catch(t=>{u("Failed to load UI visibility state:",t,"error"),n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),pt(!0)})}function yi(t){if(!n){u("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(u("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(g=>{g!==n&&g.remove()}),document.body.appendChild(n));let o=document.querySelectorAll("#ytls-pane");o.length>1&&(u(`ERROR: Multiple panes detected in togglePaneVisibility (${o.length}), cleaning up`),o.forEach(g=>{g!==n&&g.remove()})),rt&&(clearTimeout(rt),rt=null);let a=n.style.display==="none";(typeof t=="boolean"?t:a)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),pt(!0),to(),se(),Le&&(clearTimeout(Le),Le=null),Le=setTimeout(()=>{C(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),K(!0);try{let g=Y(),v=g?Math.floor(g.getCurrentTime()):NaN;Number.isFinite(v)&&$t(v,!0)}catch(g){u("Failed to scroll to nearest timestamp after toggle:",g,"warn")}Le=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),pt(!1),N())}function no(t){if(!l){u("UI is not initialized; cannot import timestamps.","warn");return}let o=!1;try{let a=JSON.parse(t),m=null;if(Array.isArray(a))m=a;else if(typeof a=="object"&&a!==null){let g=De;if(g){let v=`timekeeper-${g}`;a[v]&&Array.isArray(a[v].timestamps)&&(m=a[v].timestamps,u(`Found timestamps for current video (${g}) in export format`,"info"))}if(!m){let v=Object.keys(a).filter(d=>d.startsWith("ytls-"));if(v.length===1&&Array.isArray(a[v[0]].timestamps)){m=a[v[0]].timestamps;let d=a[v[0]].video_id;u(`Found timestamps for video ${d} in export format`,"info")}}}m&&Array.isArray(m)?m.every(v=>typeof v.start=="number"&&typeof v.comment=="string")?(m.forEach(v=>{if(v.guid){let d=we().find(y=>y.dataset.guid===v.guid);if(d){let y=d.querySelector("input");y&&(y.value=v.comment)}else hn(v.start,v.comment,!1,v.guid)}else hn(v.start,v.comment,!1,crypto.randomUUID())}),o=!0):u("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):u("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!o){let a=t.split(`
`).map(m=>m.trim()).filter(m=>m);if(a.length>0){let m=!1;a.forEach(g=>{let v=g.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(v){m=!0;let d=parseInt(v[1])||0,y=parseInt(v[2]),S=parseInt(v[3]),L=d*3600+y*60+S,B=v[4]?v[4].trim():"",$=null,q=B,xe=B.match(/<!--\s*guid:([^>]+?)\s*-->/);xe&&($=xe[1].trim(),q=B.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let X;if($&&(X=we().find(oe=>oe.dataset.guid===$)),!X&&!$&&(X=we().find(oe=>{if(oe.dataset.guid)return!1;let $e=oe.querySelector("a[data-time]")?.dataset.time;if(!$e)return!1;let Be=Number.parseInt($e,10);return Number.isFinite(Be)&&Be===L})),X){let oe=X.querySelector("input");oe&&(oe.value=q)}else hn(L,q,!1,$||crypto.randomUUID())}}),m&&(o=!0)}}o?(u("Timestamps changed: Imported timestamps from file/clipboard"),lt(),Gn(De),Fe(),Un()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function br(){if(li){u("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){li=!0;try{let m=function(){if(Te||At)return;let f=le(),p=Y();if(!f&&!p)return;let b=p?p.getCurrentTime():0,x=Number.isFinite(b)?Math.max(0,Math.floor(b)):Math.max(0,It()),R=Math.floor(x/3600),U=Math.floor(x/60)%60,_=x%60,{isLive:Q}=p?p.getVideoData()||{isLive:!1}:{isLive:!1},V=p?tr(p):!1,fe=l?we().map(de=>{let Ae=de.querySelector("a[data-time]");return Ae?parseFloat(Ae.getAttribute("data-time")??"0"):0}):[],Ne="";if(fe.length>0)if(Q){let de=Math.max(1,x/60),Ae=fe.filter(_e=>_e<=x);if(Ae.length>0){let _e=(Ae.length/de).toFixed(2);parseFloat(_e)>0&&(Ne=` (${_e}/min)`)}}else{let de=p?p.getDuration():0,Ae=Number.isFinite(de)&&de>0?de:f&&Number.isFinite(f.duration)&&f.duration>0?f.duration:0,_e=Math.max(1,Ae/60),gt=(fe.length/_e).toFixed(1);parseFloat(gt)>0&&(Ne=` (${gt}/min)`)}w.textContent=`\u23F3${R?R+":"+String(U).padStart(2,"0"):U}:${String(_).padStart(2,"0")}${Ne}`,w.style.color=V?"#ff4d4f":"",fe.length>0&&$t(x,!1)},oe=function(f,p,b){let x=document.createElement("button");return x.textContent=f,ct(x,p),x.classList.add("ytls-settings-modal-button"),x.onclick=b,x},Re=function(f="general"){if(G&&G.parentNode===document.body){let Oe=document.getElementById("ytls-save-modal"),Et=document.getElementById("ytls-load-modal"),yt=document.getElementById("ytls-delete-all-modal");Oe&&document.body.contains(Oe)&&document.body.removeChild(Oe),Et&&document.body.contains(Et)&&document.body.removeChild(Et),yt&&document.body.contains(yt)&&document.body.removeChild(yt),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",$e)},300);return}G=document.createElement("div"),G.id="ytls-settings-modal",G.classList.remove("ytls-fade-out"),G.classList.add("ytls-fade-in");let p=document.createElement("div");p.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let x=document.createElement("button");x.className="ytls-modal-close-button",x.textContent="\u2715",x.onclick=()=>{if(G&&G.parentNode===document.body){let Oe=document.getElementById("ytls-save-modal"),Et=document.getElementById("ytls-load-modal"),yt=document.getElementById("ytls-delete-all-modal");Oe&&document.body.contains(Oe)&&document.body.removeChild(Oe),Et&&document.body.contains(Et)&&document.body.removeChild(Et),yt&&document.body.contains(yt)&&document.body.removeChild(yt),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",$e)},300)}};let R=document.createElement("div");R.id="ytls-settings-content";let U=document.createElement("h3");U.className="ytls-section-heading",U.textContent="General",U.style.display="none";let _=document.createElement("div"),Q=document.createElement("div");Q.className="ytls-button-grid";function V(Oe){_.style.display=Oe==="general"?"block":"none",Q.style.display=Oe==="drive"?"block":"none",fe.classList.toggle("active",Oe==="general"),de.classList.toggle("active",Oe==="drive"),U.textContent=Oe==="general"?"General":"Google Drive"}let fe=document.createElement("button");fe.textContent="\u{1F6E0}\uFE0F";let Ne=document.createElement("span");Ne.className="ytls-tab-text",Ne.textContent=" General",fe.appendChild(Ne),ct(fe,"General settings"),fe.classList.add("ytls-settings-modal-button"),fe.onclick=()=>V("general");let de=document.createElement("button");de.textContent="\u2601\uFE0F";let Ae=document.createElement("span");Ae.className="ytls-tab-text",Ae.textContent=" Backup",de.appendChild(Ae),ct(de,"Google Drive sign-in and backup"),de.classList.add("ytls-settings-modal-button"),de.onclick=async()=>{W.isSignedIn&&await Vo(),V("drive")},b.appendChild(fe),b.appendChild(de),p.appendChild(b),p.appendChild(x),G.appendChild(p),_.className="ytls-button-grid",_.appendChild(oe("\u{1F4BE} Save","Save As...",Tt.onclick)),_.appendChild(oe("\u{1F4C2} Load","Load",ht.onclick)),_.appendChild(oe("\u{1F4E4} Export All","Export All Data",be.onclick)),_.appendChild(oe("\u{1F4E5} Import All","Import All Data",re.onclick)),_.appendChild(oe("\u{1F4C4} Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await mr()}catch{alert("Failed to export CSV: Could not read from database.")}}));let _e=oe(W.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",W.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{W.isSignedIn?await jo():await Go(),_e.textContent=W.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",ct(_e,W.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),typeof Ee=="function"&&Ee()});Q.appendChild(_e);let gt=oe(dt?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await Zo(),gt.textContent=dt?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off",typeof Ee=="function"&&Ee()});Q.appendChild(gt);let zt=oe(`\u23F1\uFE0F Backup Interval: ${Je}min`,"Set periodic backup interval (minutes)",async()=>{await Jo(),zt.textContent=`\u23F1\uFE0F Backup Interval: ${Je}min`,typeof Ee=="function"&&Ee()});Q.appendChild(zt),Q.appendChild(oe("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await Sn(!1),typeof Ee=="function"&&Ee()}));let We=document.createElement("div");We.style.marginTop="15px",We.style.paddingTop="10px",We.style.borderTop="1px solid #555",We.style.fontSize="12px",We.style.color="#aaa";let Ht=document.createElement("div");Ht.style.marginBottom="8px",Ht.style.fontWeight="bold",We.appendChild(Ht),No(Ht);let bi=document.createElement("div");bi.style.marginBottom="8px",Fo(bi),We.appendChild(bi);let so=document.createElement("div");Ro(so),We.appendChild(so),Q.appendChild(We),je(),Ln(),Ee(),R.appendChild(U),R.appendChild(_),R.appendChild(Q),V(f),G.appendChild(R),document.body.appendChild(G),requestAnimationFrame(()=>{let Oe=G.getBoundingClientRect(),yt=(window.innerHeight-Oe.height)/2;G.style.top=`${Math.max(20,yt)}px`,G.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Be,!0),document.addEventListener("keydown",$e)},0)},$e=function(f){if(f.key==="Escape"&&G&&G.parentNode===document.body){let p=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");if(p||b||x)return;f.preventDefault(),p&&document.body.contains(p)&&document.body.removeChild(p),b&&document.body.contains(b)&&document.body.removeChild(b),x&&document.body.contains(x)&&document.body.removeChild(x),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",$e)},300)}},Be=function(f){if(Dn&&Dn.contains(f.target))return;let p=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");p&&p.contains(f.target)||b&&b.contains(f.target)||x&&x.contains(f.target)||G&&G.contains(f.target)||(p&&document.body.contains(p)&&document.body.removeChild(p),b&&document.body.contains(b)&&document.body.removeChild(b),x&&document.body.contains(x)&&document.body.removeChild(x),G&&G.parentNode===document.body&&(G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",$e)},300)))},Ie=function(){n&&(u("Loading window position from IndexedDB"),gi("windowPosition").then(f=>{if(f&&typeof f.x=="number"&&typeof f.y=="number"){let b=f;n.style.left=`${b.x}px`,n.style.top=`${b.y}px`,n.style.right="auto",n.style.bottom="auto",typeof b.width=="number"&&b.width>0?n.style.width=`${b.width}px`:(n.style.width=`${Ft}px`,u(`No stored window width found, using default width ${Ft}px`)),typeof b.height=="number"&&b.height>0?n.style.height=`${b.height}px`:(n.style.height=`${Lt}px`,u(`No stored window height found, using default height ${Lt}px`));let x=ne();te(x,b.x,b.y),u("Restored window position from IndexedDB:",qe)}else u("No window position found in IndexedDB, applying default size and leaving default position"),n.style.width=`${Ft}px`,n.style.height=`${Lt}px`,qe=null;_t();let p=ne();p&&(p.width||p.height)&&te(p),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(f=>{u("failed to load pane position from IndexedDB:",f,"warn"),_t();let p=ne();p&&(p.width||p.height)&&(qe={x:Math.max(0,Math.round(p.left)),y:0,width:Math.round(p.width),height:Math.round(p.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},ze=function(){if(!n)return;let f=ne();if(!f)return;let p={x:Math.max(0,Math.round(f.left)),y:Math.max(0,Math.round(f.top)),width:Math.round(f.width),height:Math.round(f.height)};if(qe&&qe.x===p.x&&qe.y===p.y&&qe.width===p.width&&qe.height===p.height){u("Skipping window position save; position and size unchanged");return}qe={...p},u(`Saving window position and size to IndexedDB: x=${p.x}, y=${p.y}, width=${p.width}, height=${p.height}`),jn("windowPosition",p),on({type:"window_position_updated",position:p,timestamp:Date.now()})},Kn=function(f,p){f.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",ze(),yn())}),f.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),Kt=!0,Bt=p,ro=b.clientX,ao=b.clientY;let x=n.getBoundingClientRect();Zt=x.width,Jt=x.height,Yn=x.left,Wn=x.top,p==="top-left"||p==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},yn=function(){if(n&&h&&k&&l){let f=n.getBoundingClientRect(),p=h.getBoundingClientRect(),b=k.getBoundingClientRect(),x=f.height-(p.height+b.height);l.style.maxHeight=x>0?x+"px":"0px",l.style.overflowY=x>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(f=>f.remove()),n=document.createElement("div"),h=document.createElement("div"),l=document.createElement("ul"),k=document.createElement("div"),w=document.createElement("span"),T=document.createElement("style"),H=document.createElement("span"),P=document.createElement("span"),P.classList.add("ytls-backup-indicator"),P.style.cursor="pointer",P.style.backgroundColor="#666",P.onclick=f=>{f.stopPropagation(),Re("drive")},l.addEventListener("mouseenter",()=>{Mn=!0,cn=!1}),l.addEventListener("mouseleave",()=>{if(Mn=!1,cn)return;let f=Y(),p=f?Math.floor(f.getCurrentTime()):It();$t(p,!1);let b=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)&&(b=document.activeElement.closest("li")?.dataset.guid??null),Wi(),b){let R=we().find(U=>U.dataset.guid===b)?.querySelector("input");if(R)try{R.focus({preventScroll:!0})}catch{}}}),n.id="ytls-pane",h.id="ytls-pane-header",h.addEventListener("dblclick",f=>{let p=f.target instanceof HTMLElement?f.target:null;p&&(p.closest("a")||p.closest("button")||p.closest("#ytls-current-time")||p.closest(".ytls-version-display")||p.closest(".ytls-backup-indicator"))||(f.preventDefault(),yi(!1))});let t=f=>{try{f.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(f=>{n.addEventListener(f,t)}),n.addEventListener("keydown",f=>{try{f.stopPropagation()}catch{}}),n.addEventListener("keyup",f=>{try{f.stopPropagation()}catch{}}),n.addEventListener("focus",f=>{try{f.stopPropagation()}catch{}},!0),n.addEventListener("blur",f=>{try{f.stopPropagation()}catch{}},!0);let o=GM_info.script.version;H.textContent=`v${o}`,H.classList.add("ytls-version-display");let a=document.createElement("span");a.style.display="inline-flex",a.style.alignItems="center",a.style.gap="6px",a.appendChild(H),a.appendChild(P),w.id="ytls-current-time",w.textContent="\u23F3",w.onclick=()=>{At=!0;let f=Y();f&&f.seekToLiveHead(),setTimeout(()=>{At=!1},500)},m(),ve&&clearInterval(ve),ve=setInterval(m,1e3),k.id="ytls-buttons";let g=(f,p)=>()=>{f.classList.remove("ytls-fade-in"),f.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(f)&&document.body.removeChild(f),p&&p()},300)},v=f=>p=>{p.key==="Escape"&&(p.preventDefault(),p.stopPropagation(),f())},d=f=>{setTimeout(()=>{document.addEventListener("keydown",f)},0)},y=(f,p)=>b=>{f.contains(b.target)||p()},S=f=>{setTimeout(()=>{document.addEventListener("click",f,!0)},0)},xe=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!l||l.querySelector(".ytls-error-message")||Te)return;let f=typeof Rt<"u"?Rt:0,p=Y(),b=p?Math.floor(p.getCurrentTime()+f):0;if(!Number.isFinite(b))return;let x=hn(b,"");x&&x.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>Re()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(f){if(!l||l.querySelector(".ytls-error-message")||Te){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let p=ui(),b=Math.max(It(),0);if(p.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let x=f.ctrlKey,R=p.map(U=>{let _=kt(U.start,b);return x?`${_} ${U.comment} <!-- guid:${U.guid} -->`.trimStart():`${_} ${U.comment}`}).join(`
`);navigator.clipboard.writeText(R).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(U=>{u("Failed to copy timestamps: ",U,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!l||l.querySelector(".ytls-error-message")||Te)return;if(we().length===0){alert("No timestamps available to offset.");return}let p=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(p===null)return;let b=p.trim();if(b.length===0)return;let x=Number.parseInt(b,10);if(!Number.isFinite(x)){alert("Please enter a valid integer number of seconds.");return}x!==0&&Vi(x,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let f=pi();if(!f){alert("Unable to determine current video ID.");return}let p=document.createElement("div");p.id="ytls-delete-all-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let x=document.createElement("p");x.textContent=f,x.style.fontFamily="monospace",x.style.fontSize="12px",x.style.marginBottom="15px",x.style.color="#aaa";let R=document.createElement("button");R.classList.add("ytls-save-modal-button"),R.style.background="#d32f2f",R.style.position="relative",R.style.overflow="hidden";let U=null,_=0,Q=null,V=document.createElement("div");V.style.position="absolute",V.style.left="0",V.style.top="0",V.style.height="100%",V.style.width="0%",V.style.background="#ff6b6b",V.style.transition="none",V.style.pointerEvents="none",R.appendChild(V);let fe=document.createElement("span");fe.textContent="Hold to Delete All",fe.style.position="relative",fe.style.zIndex="1",R.appendChild(fe);let Ne=()=>{if(!_)return;let We=Date.now()-_,Ht=Math.min(We/5e3*100,100);V.style.width=`${Ht}%`,Ht<100&&(Q=requestAnimationFrame(Ne))},de=()=>{U&&(clearTimeout(U),U=null),Q&&(cancelAnimationFrame(Q),Q=null),_=0,V.style.width="0%",fe.textContent="Hold to Delete All"};R.onmousedown=()=>{_=Date.now(),fe.textContent="Deleting...",Q=requestAnimationFrame(Ne),U=setTimeout(async()=>{de(),p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(p)&&document.body.removeChild(p);try{await yr(f),vi()}catch(We){u("Failed to delete all timestamps:",We,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},R.onmouseup=de,R.onmouseleave=de;let Ae=null,_e=null,gt=g(p,()=>{de(),Ae&&document.removeEventListener("keydown",Ae),_e&&document.removeEventListener("click",_e,!0)});Ae=v(gt),_e=y(p,gt);let zt=document.createElement("button");zt.textContent="Cancel",zt.classList.add("ytls-save-modal-cancel-button"),zt.onclick=gt,p.appendChild(b),p.appendChild(x),p.appendChild(R),p.appendChild(zt),document.body.appendChild(p),d(Ae),S(_e)}}],X=ho();xe.forEach(f=>{let p=document.createElement("button");if(p.textContent=f.label,ct(p,f.title),p.classList.add("ytls-main-button"),f.label==="\u{1F423}"&&X){let b=document.createElement("span");b.textContent=X,b.classList.add("ytls-holiday-emoji"),p.appendChild(b)}f.label==="\u{1F4CB}"?p.onclick=function(b){f.action.call(this,b)}:p.onclick=f.action,f.label==="\u2699\uFE0F"&&(Dn=p),k.appendChild(p)});let Tt=document.createElement("button");Tt.textContent="\u{1F4BE} Save",Tt.classList.add("ytls-file-operation-button"),Tt.onclick=()=>{let f=document.createElement("div");f.id="ytls-save-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let p=document.createElement("p");p.textContent="Save as:";let b=null,x=null,R=g(f,()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0)});b=v(R),x=y(f,R);let U=document.createElement("button");U.textContent="JSON",U.classList.add("ytls-save-modal-button"),U.onclick=()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),g(f,()=>Ki("json"))()};let _=document.createElement("button");_.textContent="Plain Text",_.classList.add("ytls-save-modal-button"),_.onclick=()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),g(f,()=>Ki("text"))()};let Q=document.createElement("button");Q.textContent="Cancel",Q.classList.add("ytls-save-modal-cancel-button"),Q.onclick=R,f.appendChild(p),f.appendChild(U),f.appendChild(_),f.appendChild(Q),document.body.appendChild(f),d(b),S(x)};let ht=document.createElement("button");ht.textContent="\u{1F4C2} Load",ht.classList.add("ytls-file-operation-button"),ht.onclick=()=>{let f=document.createElement("div");f.id="ytls-load-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let p=document.createElement("p");p.textContent="Load from:";let b=null,x=null,R=g(f,()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0)});b=v(R),x=y(f,R);let U=document.createElement("button");U.textContent="File",U.classList.add("ytls-save-modal-button"),U.onclick=()=>{let V=document.createElement("input");V.type="file",V.accept=".json,.txt",V.classList.add("ytls-hidden-file-input"),V.onchange=fe=>{let Ne=fe.target.files?.[0];if(!Ne)return;b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),R();let de=new FileReader;de.onload=()=>{let Ae=String(de.result).trim();no(Ae)},de.readAsText(Ne)},V.click()};let _=document.createElement("button");_.textContent="Clipboard",_.classList.add("ytls-save-modal-button"),_.onclick=async()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),g(f,async()=>{try{let V=await navigator.clipboard.readText();V?no(V.trim()):alert("Clipboard is empty.")}catch(V){u("Failed to read from clipboard: ",V,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let Q=document.createElement("button");Q.textContent="Cancel",Q.classList.add("ytls-save-modal-cancel-button"),Q.onclick=R,f.appendChild(p),f.appendChild(U),f.appendChild(_),f.appendChild(Q),document.body.appendChild(f),d(b),S(x)};let be=document.createElement("button");be.textContent="\u{1F4E4} Export",be.classList.add("ytls-file-operation-button"),be.onclick=async()=>{try{await cr()}catch{alert("Failed to export data: Could not read from database.")}};let re=document.createElement("button");re.textContent="\u{1F4E5} Import",re.classList.add("ytls-file-operation-button"),re.onclick=()=>{let f=document.createElement("input");f.type="file",f.accept=".json",f.classList.add("ytls-hidden-file-input"),f.onchange=p=>{let b=p.target.files?.[0];if(!b)return;let x=new FileReader;x.onload=()=>{try{let R=JSON.parse(String(x.result)),U=[];for(let _ in R)if(Object.prototype.hasOwnProperty.call(R,_)&&_.startsWith("ytls-")){let Q=_.substring(5),V=R[_];if(V&&typeof V.video_id=="string"&&Array.isArray(V.timestamps)){let fe=V.timestamps.map(de=>({...de,guid:de.guid||crypto.randomUUID()})),Ne=Qi(Q,fe).then(()=>u(`Imported ${Q} to IndexedDB`)).catch(de=>u(`Failed to import ${Q} to IndexedDB:`,de,"error"));U.push(Ne)}else u(`Skipping key ${_} during import due to unexpected data format.`,"warn")}Promise.all(U).then(()=>{vi()}).catch(_=>{alert("An error occurred during import to IndexedDB. Check console for details."),u("Overall import error:",_,"error")})}catch(R){alert(`Failed to import data. Please ensure the file is in the correct format.
`+R.message),u("Import error:",R,"error")}},x.readAsText(b)},f.click()},T.textContent=vo,l.onclick=f=>{Yi(f)},l.ontouchstart=f=>{Yi(f)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",Ie(),setTimeout(()=>_t(),10);let ge=!1,Ce,ut,et=!1;n.addEventListener("mousedown",f=>{let p=f.target;p instanceof Element&&(p instanceof HTMLInputElement||p instanceof HTMLTextAreaElement||p!==h&&!h.contains(p)&&window.getComputedStyle(p).cursor==="pointer"||(ge=!0,et=!1,Ce=f.clientX-n.getBoundingClientRect().left,ut=f.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",Cn=f=>{if(!ge)return;et=!0;let p=f.clientX-Ce,b=f.clientY-ut,x=n.getBoundingClientRect(),R=x.width,U=x.height,_=document.documentElement.clientWidth,Q=document.documentElement.clientHeight;p=Math.max(0,Math.min(p,_-R)),b=Math.max(0,Math.min(b,Q-U)),n.style.left=`${p}px`,n.style.top=`${b}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",An=()=>{if(!ge)return;ge=!1;let f=et;setTimeout(()=>{et=!1},50),_t(),setTimeout(()=>{f&&ze()},200)}),n.addEventListener("dragstart",f=>f.preventDefault());let Vt=document.createElement("div"),Vn=document.createElement("div"),Yt=document.createElement("div"),Wt=document.createElement("div");Vt.id="ytls-resize-tl",Vn.id="ytls-resize-tr",Yt.id="ytls-resize-bl",Wt.id="ytls-resize-br";let Kt=!1,ro=0,ao=0,Zt=0,Jt=0,Yn=0,Wn=0,Bt=null;Kn(Vt,"top-left"),Kn(Vn,"top-right"),Kn(Yt,"bottom-left"),Kn(Wt,"bottom-right"),document.addEventListener("mousemove",f=>{if(!Kt||!n||!Bt)return;let p=f.clientX-ro,b=f.clientY-ao,x=Zt,R=Jt,U=Yn,_=Wn,Q=document.documentElement.clientWidth,V=document.documentElement.clientHeight;Bt==="bottom-right"?(x=Math.max(200,Math.min(800,Zt+p)),R=Math.max(250,Math.min(V,Jt+b))):Bt==="top-left"?(x=Math.max(200,Math.min(800,Zt-p)),U=Yn+p,R=Math.max(250,Math.min(V,Jt-b)),_=Wn+b):Bt==="top-right"?(x=Math.max(200,Math.min(800,Zt+p)),R=Math.max(250,Math.min(V,Jt-b)),_=Wn+b):Bt==="bottom-left"&&(x=Math.max(200,Math.min(800,Zt-p)),U=Yn+p,R=Math.max(250,Math.min(V,Jt+b))),U=Math.max(0,Math.min(U,Q-x)),_=Math.max(0,Math.min(_,V-R)),n.style.width=`${x}px`,n.style.height=`${R}px`,n.style.left=`${U}px`,n.style.top=`${_}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{Kt&&(Kt=!1,Bt=null,document.body.style.cursor="",K(!0))});let Zn=null;window.addEventListener("resize",$n=()=>{Zn&&clearTimeout(Zn),Zn=setTimeout(()=>{K(!0),Zn=null},200)}),h.appendChild(w),h.appendChild(a);let Jn=document.createElement("div");if(Jn.id="ytls-content",Jn.append(l),Jn.append(k),n.append(h,Jn,T,Vt,Vn,Yt,Wt),n.addEventListener("mousemove",f=>{try{if(ge||Kt)return;let p=n.getBoundingClientRect(),b=20,x=f.clientX,R=f.clientY,U=x-p.left<=b,_=p.right-x<=b,Q=R-p.top<=b,V=p.bottom-R<=b,fe="";Q&&U||V&&_?fe="nwse-resize":Q&&_||V&&U?fe="nesw-resize":fe="",document.body.style.cursor=fe}catch{}}),n.addEventListener("mouseleave",()=>{!Kt&&!ge&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=yn,setTimeout(()=>{if(yn(),n&&h&&k&&l){let f=40,p=we();if(p.length>0)f=p[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",l.appendChild(b),f=b.offsetHeight,l.removeChild(b)}M=h.offsetHeight+k.offsetHeight+f,n.style.minHeight=M+"px"}},0),window.addEventListener("resize",yn),st){try{st.disconnect()}catch{}st=null}st=new ResizeObserver(yn),st.observe(n),ln||document.addEventListener("pointerdown",ln=()=>{Gi=Date.now()},!0),un||document.addEventListener("pointerup",un=()=>{},!0)}finally{li=!1}}}async function wr(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(a=>{a!==n&&(u("Removing duplicate pane element from DOM"),a.remove())}),document.body.contains(n)){u("Pane already in DOM, skipping append");return}await vr(),typeof Pi=="function"&&Pi(Xi),typeof oi=="function"&&oi(jn),typeof ri=="function"&&ri(gi),typeof Hi=="function"&&Hi(P),await Oi(),await Wo(),await nn(),typeof si=="function"&&si();let o=document.querySelectorAll("#ytls-pane");if(o.length>0&&(u(`WARNING: Found ${o.length} existing pane(s) in DOM, removing all`),o.forEach(a=>a.remove())),document.body.contains(n)){u("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(n),u("Pane successfully appended to DOM"),se(),Le&&(clearTimeout(Le),Le=null),Le=setTimeout(()=>{C(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),K(!0),Le=null},450),at){try{at.disconnect()}catch{}at=null}at=new MutationObserver(()=>{let a=document.querySelectorAll("#ytls-pane");a.length>1&&(u(`CRITICAL: Multiple panes detected (${a.length}), removing duplicates`),a.forEach((m,g)=>{(g>0||n&&m!==n)&&m.remove()}))}),at.observe(document.body,{childList:!0,subtree:!0})}function io(t=0){if(document.getElementById("ytls-header-button")){pt();return}let o=document.querySelector("#logo");if(!o||!o.parentElement){t<10&&setTimeout(()=>io(t+1),300);return}let a=document.createElement("button");a.id="ytls-header-button",a.type="button",a.className="ytls-header-button",ct(a,"Toggle Timekeeper UI"),a.setAttribute("aria-label","Toggle Timekeeper UI");let m=document.createElement("img");m.src=E,m.alt="",m.decoding="async",a.appendChild(m),xt=m,a.addEventListener("mouseenter",()=>{xt&&(In=!0,xt.src=A)}),a.addEventListener("mouseleave",()=>{xt&&(In=!1,pt())}),a.addEventListener("click",()=>{n&&!document.body.contains(n)&&(u("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),yi()}),o.insertAdjacentElement("afterend",a),pt(),u("Timekeeper header button added next to YouTube logo")}function oo(){if(ee)return;ee=!0;let t=history.pushState,o=history.replaceState;function a(){try{let m=new Event("locationchange");window.dispatchEvent(m)}catch{}}history.pushState=function(){let m=t.apply(this,arguments);return a(),m},history.replaceState=function(){let m=o.apply(this,arguments);return a(),m},window.addEventListener("popstate",a),window.addEventListener("locationchange",()=>{window.location.href!==j&&u("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function vi(){if(!c()){rr();return}j=window.location.href,document.querySelectorAll("#ytls-pane").forEach((o,a)=>{(a>0||n&&o!==n)&&o.remove()}),await O(),await br(),De=pi();let t=document.title;u("Page Title:",t),u("Video ID:",De),u("Current URL:",window.location.href),mi(!0),Ct(),Fe(),await Ji(),Fe(),mi(!1),u("Timestamps loaded and UI unlocked for video:",De),await wr(),io(),sr()}oo(),window.addEventListener("yt-navigate-start",()=>{u("Navigation started (yt-navigate-start event fired)"),c()&&n&&l&&(u("Locking UI and showing loading state for navigation"),mi(!0))}),sn=t=>{t.ctrlKey&&t.altKey&&t.shiftKey&&(t.key==="T"||t.key==="t")&&(t.preventDefault(),yi(),u("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",sn),window.addEventListener("yt-navigate-finish",()=>{u("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==j?vi():u("Navigation finished but URL already handled, skipping.")}),oo(),u("Timekeeper initialized and waiting for navigation events")})();})();

