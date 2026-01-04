// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.4.18
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

(()=>{var Br=Object.create;var yo=Object.defineProperty;var Hr=Object.getOwnPropertyDescriptor;var zr=Object.getOwnPropertyNames;var Pr=Object.getPrototypeOf,Or=Object.prototype.hasOwnProperty;var vo=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var Fr=(e,t,i,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of zr(t))!Or.call(e,l)&&l!==i&&yo(e,l,{get:()=>t[l],enumerable:!(r=Hr(t,l))||r.enumerable});return e};var bo=(e,t,i)=>(i=e!=null?Br(Pr(e)):{},Fr(t||!e||!e.__esModule?yo(i,"default",{value:e,enumerable:!0}):i,e));var wo=vo((xi,Ti)=>{(function(e,t){typeof xi=="object"&&typeof Ti<"u"?Ti.exports=t():typeof define=="function"&&define.amd?define(t):(e=typeof globalThis<"u"?globalThis:e||self).dayjs=t()})(xi,(function(){"use strict";var e=1e3,t=6e4,i=36e5,r="millisecond",l="second",n="minute",f="hour",a="day",b="week",y="month",T="quarter",I="year",$="date",k="Invalid Date",U=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,V=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,Q={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(B){var M=["th","st","nd","rd"],S=B%100;return"["+B+(M[(S-20)%10]||M[S]||M[0])+"]"}},ee=function(B,M,S){var A=String(B);return!A||A.length>=M?B:""+Array(M+1-A.length).join(S)+B},Z={s:ee,z:function(B){var M=-B.utcOffset(),S=Math.abs(M),A=Math.floor(S/60),L=S%60;return(M<=0?"+":"-")+ee(A,2,"0")+":"+ee(L,2,"0")},m:function B(M,S){if(M.date()<S.date())return-B(S,M);var A=12*(S.year()-M.year())+(S.month()-M.month()),L=M.clone().add(A,y),H=S-L<0,F=M.clone().add(A+(H?-1:1),y);return+(-(A+(S-L)/(H?L-F:F-L))||0)},a:function(B){return B<0?Math.ceil(B)||0:Math.floor(B)},p:function(B){return{M:y,y:I,w:b,d:a,D:$,h:f,m:n,s:l,ms:r,Q:T}[B]||String(B||"").toLowerCase().replace(/s$/,"")},u:function(B){return B===void 0}},ce="en",J={};J[ce]=Q;var fe="$isDayjsObject",we=function(B){return B instanceof pe||!(!B||!B[fe])},ae=function B(M,S,A){var L;if(!M)return ce;if(typeof M=="string"){var H=M.toLowerCase();J[H]&&(L=H),S&&(J[H]=S,L=H);var F=M.split("-");if(!L&&F.length>1)return B(F[0])}else{var X=M.name;J[X]=M,L=X}return!A&&L&&(ce=L),L||!A&&ce},R=function(B,M){if(we(B))return B.clone();var S=typeof M=="object"?M:{};return S.date=B,S.args=arguments,new pe(S)},C=Z;C.l=ae,C.i=we,C.w=function(B,M){return R(B,{locale:M.$L,utc:M.$u,x:M.$x,$offset:M.$offset})};var pe=(function(){function B(S){this.$L=ae(S.locale,null,!0),this.parse(S),this.$x=this.$x||S.x||{},this[fe]=!0}var M=B.prototype;return M.parse=function(S){this.$d=(function(A){var L=A.date,H=A.utc;if(L===null)return new Date(NaN);if(C.u(L))return new Date;if(L instanceof Date)return new Date(L);if(typeof L=="string"&&!/Z$/i.test(L)){var F=L.match(U);if(F){var X=F[2]-1||0,de=(F[7]||"0").substring(0,3);return H?new Date(Date.UTC(F[1],X,F[3]||1,F[4]||0,F[5]||0,F[6]||0,de)):new Date(F[1],X,F[3]||1,F[4]||0,F[5]||0,F[6]||0,de)}}return new Date(L)})(S),this.init()},M.init=function(){var S=this.$d;this.$y=S.getFullYear(),this.$M=S.getMonth(),this.$D=S.getDate(),this.$W=S.getDay(),this.$H=S.getHours(),this.$m=S.getMinutes(),this.$s=S.getSeconds(),this.$ms=S.getMilliseconds()},M.$utils=function(){return C},M.isValid=function(){return this.$d.toString()!==k},M.isSame=function(S,A){var L=R(S);return this.startOf(A)<=L&&L<=this.endOf(A)},M.isAfter=function(S,A){return R(S)<this.startOf(A)},M.isBefore=function(S,A){return this.endOf(A)<R(S)},M.$g=function(S,A,L){return C.u(S)?this[A]:this.set(L,S)},M.unix=function(){return Math.floor(this.valueOf()/1e3)},M.valueOf=function(){return this.$d.getTime()},M.startOf=function(S,A){var L=this,H=!!C.u(A)||A,F=C.p(S),X=function(Ze,xe){var Je=C.w(L.$u?Date.UTC(L.$y,xe,Ze):new Date(L.$y,xe,Ze),L);return H?Je:Je.endOf(a)},de=function(Ze,xe){return C.w(L.toDate()[Ze].apply(L.toDate("s"),(H?[0,0,0,0]:[23,59,59,999]).slice(xe)),L)},te=this.$W,se=this.$M,me=this.$D,W="set"+(this.$u?"UTC":"");switch(F){case I:return H?X(1,0):X(31,11);case y:return H?X(1,se):X(0,se+1);case b:var ue=this.$locale().weekStart||0,Oe=(te<ue?te+7:te)-ue;return X(H?me-Oe:me+(6-Oe),se);case a:case $:return de(W+"Hours",0);case f:return de(W+"Minutes",1);case n:return de(W+"Seconds",2);case l:return de(W+"Milliseconds",3);default:return this.clone()}},M.endOf=function(S){return this.startOf(S,!1)},M.$set=function(S,A){var L,H=C.p(S),F="set"+(this.$u?"UTC":""),X=(L={},L[a]=F+"Date",L[$]=F+"Date",L[y]=F+"Month",L[I]=F+"FullYear",L[f]=F+"Hours",L[n]=F+"Minutes",L[l]=F+"Seconds",L[r]=F+"Milliseconds",L)[H],de=H===a?this.$D+(A-this.$W):A;if(H===y||H===I){var te=this.clone().set($,1);te.$d[X](de),te.init(),this.$d=te.set($,Math.min(this.$D,te.daysInMonth())).$d}else X&&this.$d[X](de);return this.init(),this},M.set=function(S,A){return this.clone().$set(S,A)},M.get=function(S){return this[C.p(S)]()},M.add=function(S,A){var L,H=this;S=Number(S);var F=C.p(A),X=function(se){var me=R(H);return C.w(me.date(me.date()+Math.round(se*S)),H)};if(F===y)return this.set(y,this.$M+S);if(F===I)return this.set(I,this.$y+S);if(F===a)return X(1);if(F===b)return X(7);var de=(L={},L[n]=t,L[f]=i,L[l]=e,L)[F]||1,te=this.$d.getTime()+S*de;return C.w(te,this)},M.subtract=function(S,A){return this.add(-1*S,A)},M.format=function(S){var A=this,L=this.$locale();if(!this.isValid())return L.invalidDate||k;var H=S||"YYYY-MM-DDTHH:mm:ssZ",F=C.z(this),X=this.$H,de=this.$m,te=this.$M,se=L.weekdays,me=L.months,W=L.meridiem,ue=function(xe,Je,it,dt){return xe&&(xe[Je]||xe(A,H))||it[Je].slice(0,dt)},Oe=function(xe){return C.s(X%12||12,xe,"0")},Ze=W||function(xe,Je,it){var dt=xe<12?"AM":"PM";return it?dt.toLowerCase():dt};return H.replace(V,(function(xe,Je){return Je||(function(it){switch(it){case"YY":return String(A.$y).slice(-2);case"YYYY":return C.s(A.$y,4,"0");case"M":return te+1;case"MM":return C.s(te+1,2,"0");case"MMM":return ue(L.monthsShort,te,me,3);case"MMMM":return ue(me,te);case"D":return A.$D;case"DD":return C.s(A.$D,2,"0");case"d":return String(A.$W);case"dd":return ue(L.weekdaysMin,A.$W,se,2);case"ddd":return ue(L.weekdaysShort,A.$W,se,3);case"dddd":return se[A.$W];case"H":return String(X);case"HH":return C.s(X,2,"0");case"h":return Oe(1);case"hh":return Oe(2);case"a":return Ze(X,de,!0);case"A":return Ze(X,de,!1);case"m":return String(de);case"mm":return C.s(de,2,"0");case"s":return String(A.$s);case"ss":return C.s(A.$s,2,"0");case"SSS":return C.s(A.$ms,3,"0");case"Z":return F}return null})(xe)||F.replace(":","")}))},M.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},M.diff=function(S,A,L){var H,F=this,X=C.p(A),de=R(S),te=(de.utcOffset()-this.utcOffset())*t,se=this-de,me=function(){return C.m(F,de)};switch(X){case I:H=me()/12;break;case y:H=me();break;case T:H=me()/3;break;case b:H=(se-te)/6048e5;break;case a:H=(se-te)/864e5;break;case f:H=se/i;break;case n:H=se/t;break;case l:H=se/e;break;default:H=se}return L?H:C.a(H)},M.daysInMonth=function(){return this.endOf(y).$D},M.$locale=function(){return J[this.$L]},M.locale=function(S,A){if(!S)return this.$L;var L=this.clone(),H=ae(S,A,!0);return H&&(L.$L=H),L},M.clone=function(){return C.w(this.$d,this)},M.toDate=function(){return new Date(this.valueOf())},M.toJSON=function(){return this.isValid()?this.toISOString():null},M.toISOString=function(){return this.$d.toISOString()},M.toString=function(){return this.$d.toUTCString()},B})(),ye=pe.prototype;return R.prototype=ye,[["$ms",r],["$s",l],["$m",n],["$H",f],["$W",a],["$M",y],["$y",I],["$D",$]].forEach((function(B){ye[B[1]]=function(M){return this.$g(M,B[0],B[1])}})),R.extend=function(B,M){return B.$i||(B(M,pe,R),B.$i=!0),R},R.locale=ae,R.isDayjs=we,R.unix=function(B){return R(1e3*B)},R.en=J[ce],R.Ls=J,R.p={},R}))});var xo=vo((Ei,ki)=>{(function(e,t){typeof Ei=="object"&&typeof ki<"u"?ki.exports=t():typeof define=="function"&&define.amd?define(t):(e=typeof globalThis<"u"?globalThis:e||self).dayjs_plugin_utc=t()})(Ei,(function(){"use strict";var e="minute",t=/[+-]\d\d(?::?\d\d)?/g,i=/([+-]|\d\d)/g;return function(r,l,n){var f=l.prototype;n.utc=function(k){var U={date:k,utc:!0,args:arguments};return new l(U)},f.utc=function(k){var U=n(this.toDate(),{locale:this.$L,utc:!0});return k?U.add(this.utcOffset(),e):U},f.local=function(){return n(this.toDate(),{locale:this.$L,utc:!1})};var a=f.parse;f.parse=function(k){k.utc&&(this.$u=!0),this.$utils().u(k.$offset)||(this.$offset=k.$offset),a.call(this,k)};var b=f.init;f.init=function(){if(this.$u){var k=this.$d;this.$y=k.getUTCFullYear(),this.$M=k.getUTCMonth(),this.$D=k.getUTCDate(),this.$W=k.getUTCDay(),this.$H=k.getUTCHours(),this.$m=k.getUTCMinutes(),this.$s=k.getUTCSeconds(),this.$ms=k.getUTCMilliseconds()}else b.call(this)};var y=f.utcOffset;f.utcOffset=function(k,U){var V=this.$utils().u;if(V(k))return this.$u?0:V(this.$offset)?y.call(this):this.$offset;if(typeof k=="string"&&(k=(function(ce){ce===void 0&&(ce="");var J=ce.match(t);if(!J)return null;var fe=(""+J[0]).match(i)||["-",0,0],we=fe[0],ae=60*+fe[1]+ +fe[2];return ae===0?0:we==="+"?ae:-ae})(k),k===null))return this;var Q=Math.abs(k)<=16?60*k:k;if(Q===0)return this.utc(U);var ee=this.clone();if(U)return ee.$offset=Q,ee.$u=!1,ee;var Z=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();return(ee=this.local().add(Q+Z,e)).$offset=Q,ee.$x.$localOffset=Z,ee};var T=f.format;f.format=function(k){var U=k||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return T.call(this,U)},f.valueOf=function(){var k=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||this.$d.getTimezoneOffset());return this.$d.valueOf()-6e4*k},f.isUTC=function(){return!!this.$u},f.toISOString=function(){return this.toDate().toISOString()},f.toString=function(){return this.toDate().toUTCString()};var I=f.toDate;f.toDate=function(k){return k==="s"&&this.$offset?n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():I.call(this)};var $=f.diff;f.diff=function(k,U,V){if(k&&this.$u===k.$u)return $.call(this,k,U,V);var Q=this.local(),ee=n(k).local();return $.call(Q,ee,U,V)}}}))});var Zn=bo(wo()),To=bo(xo());Zn.default.extend(To.default);function c(e,...t){let i="debug",r=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(i=r.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[i](`${n} ${e}`,...r)}function kt(e,t=e){let i=Math.max(0,Math.floor(e)*1e3),r=t<3600?"mm:ss":t>=36e3?"HH:mm:ss":"H:mm:ss";return Zn.default.utc(i).format(r)}function Si(e,t=window.location.href){try{let i=new URL(t);return i.searchParams.set("t",`${e}s`),i.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Wt(){return(0,Zn.default)().utc().format("YYYY-MM-DD--HH-mm-ss")}var Nr=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function Eo(){let e=new Date,t=e.getFullYear(),i=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let r of Nr){let l=new Date(t,r.month-1,r.day),n=l.getTime()-e.getTime(),f=n/(1e3*60*60*24);if(f<=5&&f>=-2)return c(`Current date: ${i}, Selected emoji: ${r.emoji} (${r.name}), Days until holiday: ${Math.ceil(f)}`),r.emoji;if(f<-2&&(l=new Date(t+1,r.month-1,r.day),n=l.getTime()-e.getTime(),f=n/(1e3*60*60*24),f<=5&&f>=-2))return c(`Current date: ${i}, Selected emoji: ${r.emoji} (${r.name}), Days until holiday: ${Math.ceil(f)}`),r.emoji;if(f>5&&(l=new Date(t-1,r.month-1,r.day),n=l.getTime()-e.getTime(),f=n/(1e3*60*60*24),f<=5&&f>=-2))return c(`Current date: ${i}, Selected emoji: ${r.emoji} (${r.name}), Days until holiday: ${Math.ceil(f)}`),r.emoji}return c(`Current date: ${i}, No holiday emoji (not within range)`),null}var et=null,Kt=null,Rr=500,Ot=null,bn=!1,St=null;function _r(){return(!et||!document.body.contains(et))&&(et=document.createElement("div"),et.className="ytls-tooltip",et.style.pointerEvents="none",document.body.appendChild(et),window.addEventListener("scroll",ko,!0),window.addEventListener("resize",ko,!0)),et}function Ur(e,t,i){let l=window.innerWidth,n=window.innerHeight,f=e.getBoundingClientRect(),a=f.width,b=f.height,y=t+10,T=i+10;y+a>l-10&&(y=t-a-10),T+b>n-10&&(T=i-b-10),y=Math.max(10,Math.min(y,l-a-10)),T=Math.max(10,Math.min(T,n-b-10)),e.style.left=`${y}px`,e.style.top=`${T}px`}function So(e,t){let r=window.innerWidth,l=window.innerHeight,n=t.getBoundingClientRect(),f=e.getBoundingClientRect(),a=f.width,b=f.height,y=Math.round(n.right+8),T=Math.round(n.top);y+a>r-8&&(y=Math.round(n.left-a-8)),y=Math.max(8,Math.min(y,r-a-8)),T+b>l-8&&(T=Math.round(n.bottom-b)),T=Math.max(8,Math.min(T,l-b-8)),e.style.left=`${y}px`,e.style.top=`${T}px`}function ko(){if(!(!et||!Ot)&&et.classList.contains("ytls-tooltip-visible"))try{So(et,Ot)}catch{}}function Gr(e=50){St&&(clearTimeout(St),St=null),!bn&&(St=setTimeout(()=>{Li(),St=null},e))}function jr(e,t,i,r){Kt&&clearTimeout(Kt),r&&(Ot=r,bn=!0),Kt=setTimeout(()=>{let l=_r();l.textContent=e,l.classList.remove("ytls-tooltip-visible"),r?requestAnimationFrame(()=>{So(l,r),requestAnimationFrame(()=>{l.classList.add("ytls-tooltip-visible")})}):(Ur(l,t,i),requestAnimationFrame(()=>{l.classList.add("ytls-tooltip-visible")}))},Rr)}function Li(){Kt&&(clearTimeout(Kt),Kt=null),St&&(clearTimeout(St),St=null),et&&et.classList.remove("ytls-tooltip-visible"),Ot=null,bn=!1}function lt(e,t){let i=0,r=0,l=b=>{i=b.clientX,r=b.clientY,bn=!0,Ot=e;let y=typeof t=="function"?t():t;y&&jr(y,i,r,e)},n=b=>{i=b.clientX,r=b.clientY},f=()=>{bn=!1,Gr()};e.addEventListener("mouseenter",l),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",f);let a=new MutationObserver(()=>{try{if(!document.body.contains(e))Ot===e&&Li();else{let b=window.getComputedStyle(e);(b.display==="none"||b.visibility==="hidden"||b.opacity==="0")&&Ot===e&&Li()}}catch{}});try{a.observe(e,{attributes:!0,attributeFilter:["class","style"]}),a.observe(document.body,{childList:!0,subtree:!0})}catch{}e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",l),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",f);try{a.disconnect()}catch{}delete e.__tooltipObserver},e.__tooltipObserver=a}var Mi=new WeakMap;function Di(e,t,i,r){if(!e&&!Mi.has(t))return!1;let l=Mi.get(t)??new WeakMap;Mi.set(t,l);let n=l.get(i)??new Set;l.set(i,n);let f=n.has(r);return e?n.add(r):n.delete(r),f&&e}function qr(e,t){let i=e.target;if(i instanceof Text&&(i=i.parentElement),i instanceof Element&&e.currentTarget instanceof Node){let r=i.closest(t);if(r&&e.currentTarget.contains(r))return r}}function Vr(e,t,i,r={}){let{signal:l,base:n=document}=r;if(l?.aborted)return;let{once:f,...a}=r,b=n instanceof Document?n.documentElement:n,y=!!(typeof r=="object"?r.capture:r),T=k=>{let U=qr(k,String(e));if(U){let V=Object.assign(k,{delegateTarget:U});i.call(b,V),f&&(b.removeEventListener(t,T,a),Di(!1,b,i,I))}},I=JSON.stringify({selector:e,type:t,capture:y});Di(!0,b,i,I)||b.addEventListener(t,T,a),l?.addEventListener("abort",()=>{Di(!1,b,i,I)})}var Pe=Vr;var Yr=(e,t)=>t.some(i=>e instanceof i),Lo,Mo;function Wr(){return Lo||(Lo=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Kr(){return Mo||(Mo=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Do=new WeakMap,Ci=new WeakMap,Io=new WeakMap,Ii=new WeakMap,$i=new WeakMap;function Zr(e){let t=new Promise((i,r)=>{let l=()=>{e.removeEventListener("success",n),e.removeEventListener("error",f)},n=()=>{i(ut(e.result)),l()},f=()=>{r(e.error),l()};e.addEventListener("success",n),e.addEventListener("error",f)});return t.then(i=>{i instanceof IDBCursor&&Do.set(i,e)}).catch(()=>{}),$i.set(t,e),t}function Jr(e){if(Ci.has(e))return;let t=new Promise((i,r)=>{let l=()=>{e.removeEventListener("complete",n),e.removeEventListener("error",f),e.removeEventListener("abort",f)},n=()=>{i(),l()},f=()=>{r(e.error||new DOMException("AbortError","AbortError")),l()};e.addEventListener("complete",n),e.addEventListener("error",f),e.addEventListener("abort",f)});Ci.set(e,t)}var Ai={get(e,t,i){if(e instanceof IDBTransaction){if(t==="done")return Ci.get(e);if(t==="objectStoreNames")return e.objectStoreNames||Io.get(e);if(t==="store")return i.objectStoreNames[1]?void 0:i.objectStore(i.objectStoreNames[0])}return ut(e[t])},set(e,t,i){return e[t]=i,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Co(e){Ai=e(Ai)}function Xr(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...i){let r=e.call(Jn(this),t,...i);return Io.set(r,t.sort?t.sort():[t]),ut(r)}:Kr().includes(e)?function(...t){return e.apply(Jn(this),t),ut(Do.get(this))}:function(...t){return ut(e.apply(Jn(this),t))}}function Qr(e){return typeof e=="function"?Xr(e):(e instanceof IDBTransaction&&Jr(e),Yr(e,Wr())?new Proxy(e,Ai):e)}function ut(e){if(e instanceof IDBRequest)return Zr(e);if(Ii.has(e))return Ii.get(e);let t=Qr(e);return t!==e&&(Ii.set(e,t),$i.set(t,e)),t}var Jn=e=>$i.get(e);function $o(e,t,{blocked:i,upgrade:r,blocking:l,terminated:n}={}){let f=indexedDB.open(e,t),a=ut(f);return r&&f.addEventListener("upgradeneeded",b=>{r(ut(f.result),b.oldVersion,b.newVersion,ut(f.transaction),b)}),i&&f.addEventListener("blocked",b=>i(b.oldVersion,b.newVersion,b)),a.then(b=>{n&&b.addEventListener("close",()=>n()),l&&b.addEventListener("versionchange",y=>l(y.oldVersion,y.newVersion,y))}).catch(()=>{}),a}var ea=["get","getKey","getAll","getAllKeys","count"],ta=["put","add","delete","clear"],Bi=new Map;function Ao(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Bi.get(t))return Bi.get(t);let i=t.replace(/FromIndex$/,""),r=t!==i,l=ta.includes(i);if(!(i in(r?IDBIndex:IDBObjectStore).prototype)||!(l||ea.includes(i)))return;let n=async function(f,...a){let b=this.transaction(f,l?"readwrite":"readonly"),y=b.store;return r&&(y=y.index(a.shift())),(await Promise.all([y[i](...a),l&&b.done]))[0]};return Bi.set(t,n),n}Co(e=>({...e,get:(t,i,r)=>Ao(t,i)||e.get(t,i,r),has:(t,i)=>!!Ao(t,i)||e.has(t,i)}));var na="ytls-timestamps-db",ia=3,Zt="timestamps",gt="timestamps_v2",Xn="settings",wn=null;function Lt(){return wn||(wn=$o(na,ia,{upgrade(e,t,i,r){if(t<1&&e.createObjectStore(Zt,{keyPath:"video_id"}),t<2&&!e.objectStoreNames.contains(Xn)&&e.createObjectStore(Xn,{keyPath:"key"}),t<3){if(e.objectStoreNames.contains(Zt))try{let f=r.objectStore(Zt).getAll();f.onsuccess=()=>{try{let a=f.result;if(a.length>0){let b={},y=0;a.forEach(k=>{if(Array.isArray(k.timestamps)&&k.timestamps.length>0){let U=k.timestamps.map(V=>({guid:V.guid||crypto.randomUUID(),start:V.start,comment:V.comment}));b[`ytls-${k.video_id}`]={video_id:k.video_id,timestamps:U.sort((V,Q)=>V.start-Q.start)},y+=U.length}});let T=new Blob([JSON.stringify(b,null,2)],{type:"application/json"}),I=URL.createObjectURL(T),$=document.createElement("a");$.href=I,$.download=`timekeeper-data-${Wt()}.json`,$.click(),URL.revokeObjectURL(I),c(`Pre-migration backup exported: ${a.length} videos, ${y} timestamps`)}}catch(a){c("Failed to export pre-migration backup:",a,"error")}}}catch(n){c("Failed to inspect v1 store during migration:",n,"warn")}let l=e.createObjectStore(gt,{keyPath:"guid"});if(l.createIndex("video_id","video_id",{unique:!1}),l.createIndex("video_start",["video_id","start"],{unique:!1}),e.objectStoreNames.contains(Zt))try{let f=r.objectStore(Zt).getAll();f.onsuccess=()=>{let a=f.result;if(a.length>0){let b=0;a.forEach(y=>{Array.isArray(y.timestamps)&&y.timestamps.length>0&&y.timestamps.forEach(T=>{l.put({guid:T.guid||crypto.randomUUID(),video_id:y.video_id,start:T.start,comment:T.comment}),b++})}),c(`Migrated ${b} timestamps from ${a.length} videos to v2 store`)}},e.deleteObjectStore(Zt),c("Deleted old timestamps store after migration to v2")}catch(n){c("Failed during migration:",n,"error")}}}}).catch(e=>{throw c("Failed to open database, will retry on next access:",e,"error"),wn=null,e}),wn)}async function Hi(e){try{let i=await(await Lt()).getAll(e);return Array.isArray(i)?i:[]}catch(t){return c("Failed to getAll from IndexedDB:",t,"error"),[]}}async function zi(e,t){try{let i=await Lt(),r=await i.getAllFromIndex(gt,"video_id",e),l=new Set(t.map(n=>n.guid));for(let n of r)l.has(n.guid)||await i.delete(gt,n.guid);for(let n of t)await i.put(gt,{guid:n.guid,video_id:e,start:n.start,comment:n.comment})}catch(i){throw c("Failed to save to IndexedDB:",i,"error"),i}}async function Bo(e,t){try{await(await Lt()).put(gt,{guid:t.guid,video_id:e,start:t.start,comment:t.comment})}catch(i){throw c("Failed to save single timestamp to IndexedDB:",i,"error"),i}}async function Ho(e,t){c(`Deleting timestamp ${t} for video ${e}`);try{await(await Lt()).delete(gt,t)}catch(i){throw c("Failed to delete timestamp from IndexedDB:",i,"error"),i}}async function zo(e){try{let i=await(await Lt()).getAllFromIndex(gt,"video_id",e);return!i||i.length===0?null:i.map(l=>({guid:l.guid,start:l.start,comment:l.comment})).sort((l,n)=>l.start-n.start)}catch(t){return c("Failed to load timestamps from IndexedDB:",t,"warn"),null}}async function Po(e){try{let t=await Lt(),i=await t.getAllFromIndex(gt,"video_id",e);for(let r of i)await t.delete(gt,r.guid)}catch(t){throw c("Failed to remove timestamps from IndexedDB:",t,"error"),t}}async function Jt(e,t){try{await(await Lt()).put(Xn,{key:e,value:t})}catch(i){throw c(`Failed to save setting '${e}' to IndexedDB:`,i,"error"),i}}async function Qn(e){try{return(await(await Lt()).get(Xn,e))?.value}catch(t){c(`Failed to load setting '${e}' from IndexedDB:`,t,"error");return}}var Oo=`
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

`;var Ae=Uint8Array,Ye=Uint16Array,_i=Int32Array,Ui=new Ae([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Gi=new Ae([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Fo=new Ae([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),jo=function(e,t){for(var i=new Ye(31),r=0;r<31;++r)i[r]=t+=1<<e[r-1];for(var l=new _i(i[30]),r=1;r<30;++r)for(var n=i[r];n<i[r+1];++n)l[n]=n-i[r]<<5|r;return{b:i,r:l}},qo=jo(Ui,2),oa=qo.b,Oi=qo.r;oa[28]=258,Oi[258]=28;var Vo=jo(Gi,0),Qa=Vo.b,No=Vo.r,Fi=new Ye(32768);for(re=0;re<32768;++re)yt=(re&43690)>>1|(re&21845)<<1,yt=(yt&52428)>>2|(yt&13107)<<2,yt=(yt&61680)>>4|(yt&3855)<<4,Fi[re]=((yt&65280)>>8|(yt&255)<<8)>>1;var yt,re,En=(function(e,t,i){for(var r=e.length,l=0,n=new Ye(t);l<r;++l)e[l]&&++n[e[l]-1];var f=new Ye(t);for(l=1;l<t;++l)f[l]=f[l-1]+n[l-1]<<1;var a;if(i){a=new Ye(1<<t);var b=15-t;for(l=0;l<r;++l)if(e[l])for(var y=l<<4|e[l],T=t-e[l],I=f[e[l]-1]++<<T,$=I|(1<<T)-1;I<=$;++I)a[Fi[I]>>b]=y}else for(a=new Ye(r),l=0;l<r;++l)e[l]&&(a[l]=Fi[f[e[l]-1]++]>>15-e[l]);return a}),Ft=new Ae(288);for(re=0;re<144;++re)Ft[re]=8;var re;for(re=144;re<256;++re)Ft[re]=9;var re;for(re=256;re<280;++re)Ft[re]=7;var re;for(re=280;re<288;++re)Ft[re]=8;var re,ei=new Ae(32);for(re=0;re<32;++re)ei[re]=5;var re,ra=En(Ft,9,0);var aa=En(ei,5,0);var Yo=function(e){return(e+7)/8|0},Wo=function(e,t,i){return(t==null||t<0)&&(t=0),(i==null||i>e.length)&&(i=e.length),new Ae(e.subarray(t,i))};var sa=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],ni=function(e,t,i){var r=new Error(t||sa[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,ni),!i)throw r;return r};var vt=function(e,t,i){i<<=t&7;var r=t/8|0;e[r]|=i,e[r+1]|=i>>8},xn=function(e,t,i){i<<=t&7;var r=t/8|0;e[r]|=i,e[r+1]|=i>>8,e[r+2]|=i>>16},Pi=function(e,t){for(var i=[],r=0;r<e.length;++r)e[r]&&i.push({s:r,f:e[r]});var l=i.length,n=i.slice();if(!l)return{t:Zo,l:0};if(l==1){var f=new Ae(i[0].s+1);return f[i[0].s]=1,{t:f,l:1}}i.sort(function(fe,we){return fe.f-we.f}),i.push({s:-1,f:25001});var a=i[0],b=i[1],y=0,T=1,I=2;for(i[0]={s:-1,f:a.f+b.f,l:a,r:b};T!=l-1;)a=i[i[y].f<i[I].f?y++:I++],b=i[y!=T&&i[y].f<i[I].f?y++:I++],i[T++]={s:-1,f:a.f+b.f,l:a,r:b};for(var $=n[0].s,r=1;r<l;++r)n[r].s>$&&($=n[r].s);var k=new Ye($+1),U=Ni(i[T-1],k,0);if(U>t){var r=0,V=0,Q=U-t,ee=1<<Q;for(n.sort(function(we,ae){return k[ae.s]-k[we.s]||we.f-ae.f});r<l;++r){var Z=n[r].s;if(k[Z]>t)V+=ee-(1<<U-k[Z]),k[Z]=t;else break}for(V>>=Q;V>0;){var ce=n[r].s;k[ce]<t?V-=1<<t-k[ce]++-1:++r}for(;r>=0&&V;--r){var J=n[r].s;k[J]==t&&(--k[J],++V)}U=t}return{t:new Ae(k),l:U}},Ni=function(e,t,i){return e.s==-1?Math.max(Ni(e.l,t,i+1),Ni(e.r,t,i+1)):t[e.s]=i},Ro=function(e){for(var t=e.length;t&&!e[--t];);for(var i=new Ye(++t),r=0,l=e[0],n=1,f=function(b){i[r++]=b},a=1;a<=t;++a)if(e[a]==l&&a!=t)++n;else{if(!l&&n>2){for(;n>138;n-=138)f(32754);n>2&&(f(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(f(l),--n;n>6;n-=6)f(8304);n>2&&(f(n-3<<5|8208),n=0)}for(;n--;)f(l);n=1,l=e[a]}return{c:i.subarray(0,r),n:t}},Tn=function(e,t){for(var i=0,r=0;r<t.length;++r)i+=e[r]*t[r];return i},Ko=function(e,t,i){var r=i.length,l=Yo(t+2);e[l]=r&255,e[l+1]=r>>8,e[l+2]=e[l]^255,e[l+3]=e[l+1]^255;for(var n=0;n<r;++n)e[l+n+4]=i[n];return(l+4+r)*8},_o=function(e,t,i,r,l,n,f,a,b,y,T){vt(t,T++,i),++l[256];for(var I=Pi(l,15),$=I.t,k=I.l,U=Pi(n,15),V=U.t,Q=U.l,ee=Ro($),Z=ee.c,ce=ee.n,J=Ro(V),fe=J.c,we=J.n,ae=new Ye(19),R=0;R<Z.length;++R)++ae[Z[R]&31];for(var R=0;R<fe.length;++R)++ae[fe[R]&31];for(var C=Pi(ae,7),pe=C.t,ye=C.l,B=19;B>4&&!pe[Fo[B-1]];--B);var M=y+5<<3,S=Tn(l,Ft)+Tn(n,ei)+f,A=Tn(l,$)+Tn(n,V)+f+14+3*B+Tn(ae,pe)+2*ae[16]+3*ae[17]+7*ae[18];if(b>=0&&M<=S&&M<=A)return Ko(t,T,e.subarray(b,b+y));var L,H,F,X;if(vt(t,T,1+(A<S)),T+=2,A<S){L=En($,k,0),H=$,F=En(V,Q,0),X=V;var de=En(pe,ye,0);vt(t,T,ce-257),vt(t,T+5,we-1),vt(t,T+10,B-4),T+=14;for(var R=0;R<B;++R)vt(t,T+3*R,pe[Fo[R]]);T+=3*B;for(var te=[Z,fe],se=0;se<2;++se)for(var me=te[se],R=0;R<me.length;++R){var W=me[R]&31;vt(t,T,de[W]),T+=pe[W],W>15&&(vt(t,T,me[R]>>5&127),T+=me[R]>>12)}}else L=ra,H=Ft,F=aa,X=ei;for(var R=0;R<a;++R){var ue=r[R];if(ue>255){var W=ue>>18&31;xn(t,T,L[W+257]),T+=H[W+257],W>7&&(vt(t,T,ue>>23&31),T+=Ui[W]);var Oe=ue&31;xn(t,T,F[Oe]),T+=X[Oe],Oe>3&&(xn(t,T,ue>>5&8191),T+=Gi[Oe])}else xn(t,T,L[ue]),T+=H[ue]}return xn(t,T,L[256]),T+H[256]},la=new _i([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Zo=new Ae(0),ca=function(e,t,i,r,l,n){var f=n.z||e.length,a=new Ae(r+f+5*(1+Math.ceil(f/7e3))+l),b=a.subarray(r,a.length-l),y=n.l,T=(n.r||0)&7;if(t){T&&(b[0]=n.r>>3);for(var I=la[t-1],$=I>>13,k=I&8191,U=(1<<i)-1,V=n.p||new Ye(32768),Q=n.h||new Ye(U+1),ee=Math.ceil(i/3),Z=2*ee,ce=function(Fe){return(e[Fe]^e[Fe+1]<<ee^e[Fe+2]<<Z)&U},J=new _i(25e3),fe=new Ye(288),we=new Ye(32),ae=0,R=0,C=n.i||0,pe=0,ye=n.w||0,B=0;C+2<f;++C){var M=ce(C),S=C&32767,A=Q[M];if(V[S]=A,Q[M]=S,ye<=C){var L=f-C;if((ae>7e3||pe>24576)&&(L>423||!y)){T=_o(e,b,0,J,fe,we,R,pe,B,C-B,T),pe=ae=R=0,B=C;for(var H=0;H<286;++H)fe[H]=0;for(var H=0;H<30;++H)we[H]=0}var F=2,X=0,de=k,te=S-A&32767;if(L>2&&M==ce(C-te))for(var se=Math.min($,L)-1,me=Math.min(32767,C),W=Math.min(258,L);te<=me&&--de&&S!=A;){if(e[C+F]==e[C+F-te]){for(var ue=0;ue<W&&e[C+ue]==e[C+ue-te];++ue);if(ue>F){if(F=ue,X=te,ue>se)break;for(var Oe=Math.min(te,ue-2),Ze=0,H=0;H<Oe;++H){var xe=C-te+H&32767,Je=V[xe],it=xe-Je&32767;it>Ze&&(Ze=it,A=xe)}}}S=A,A=V[S],te+=S-A&32767}if(X){J[pe++]=268435456|Oi[F]<<18|No[X];var dt=Oi[F]&31,Nt=No[X]&31;R+=Ui[dt]+Gi[Nt],++fe[257+dt],++we[Nt],ye=C+F,++ae}else J[pe++]=e[C],++fe[e[C]]}}for(C=Math.max(C,ye);C<f;++C)J[pe++]=e[C],++fe[e[C]];T=_o(e,b,y,J,fe,we,R,pe,B,C-B,T),y||(n.r=T&7|b[T/8|0]<<3,T-=7,n.h=Q,n.p=V,n.i=C,n.w=ye)}else{for(var C=n.w||0;C<f+y;C+=65535){var Mt=C+65535;Mt>=f&&(b[T/8|0]=y,Mt=f),T=Ko(b,T+1,e.subarray(C,Mt))}n.i=f}return Wo(a,0,r+Yo(T)+l)},ua=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var i=t,r=9;--r;)i=(i&1&&-306674912)^i>>>1;e[t]=i}return e})(),da=function(){var e=-1;return{p:function(t){for(var i=e,r=0;r<t.length;++r)i=ua[i&255^t[r]]^i>>>8;e=i},d:function(){return~e}}};var ma=function(e,t,i,r,l){if(!l&&(l={l:1},t.dictionary)){var n=t.dictionary.subarray(-32768),f=new Ae(n.length+e.length);f.set(n),f.set(e,n.length),e=f,l.w=n.length}return ca(e,t.level==null?6:t.level,t.mem==null?l.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,i,r,l)},Jo=function(e,t){var i={};for(var r in e)i[r]=e[r];for(var r in t)i[r]=t[r];return i};var Ce=function(e,t,i){for(;i;++t)e[t]=i,i>>>=8};function fa(e,t){return ma(e,t||{},0,0)}var Xo=function(e,t,i,r){for(var l in e){var n=e[l],f=t+l,a=r;Array.isArray(n)&&(a=Jo(r,n[1]),n=n[0]),n instanceof Ae?i[f]=[n,a]:(i[f+="/"]=[new Ae(0),a],Xo(n,f,i,r))}},Uo=typeof TextEncoder<"u"&&new TextEncoder,pa=typeof TextDecoder<"u"&&new TextDecoder,ha=0;try{pa.decode(Zo,{stream:!0}),ha=1}catch{}function ti(e,t){if(t){for(var i=new Ae(e.length),r=0;r<e.length;++r)i[r]=e.charCodeAt(r);return i}if(Uo)return Uo.encode(e);for(var l=e.length,n=new Ae(e.length+(e.length>>1)),f=0,a=function(T){n[f++]=T},r=0;r<l;++r){if(f+5>n.length){var b=new Ae(f+8+(l-r<<1));b.set(n),n=b}var y=e.charCodeAt(r);y<128||t?a(y):y<2048?(a(192|y>>6),a(128|y&63)):y>55295&&y<57344?(y=65536+(y&1047552)|e.charCodeAt(++r)&1023,a(240|y>>18),a(128|y>>12&63),a(128|y>>6&63),a(128|y&63)):(a(224|y>>12),a(128|y>>6&63),a(128|y&63))}return Wo(n,0,f)}var Ri=function(e){var t=0;if(e)for(var i in e){var r=e[i].length;r>65535&&ni(9),t+=r+4}return t},Go=function(e,t,i,r,l,n,f,a){var b=r.length,y=i.extra,T=a&&a.length,I=Ri(y);Ce(e,t,f!=null?33639248:67324752),t+=4,f!=null&&(e[t++]=20,e[t++]=i.os),e[t]=20,t+=2,e[t++]=i.flag<<1|(n<0&&8),e[t++]=l&&8,e[t++]=i.compression&255,e[t++]=i.compression>>8;var $=new Date(i.mtime==null?Date.now():i.mtime),k=$.getFullYear()-1980;if((k<0||k>119)&&ni(10),Ce(e,t,k<<25|$.getMonth()+1<<21|$.getDate()<<16|$.getHours()<<11|$.getMinutes()<<5|$.getSeconds()>>1),t+=4,n!=-1&&(Ce(e,t,i.crc),Ce(e,t+4,n<0?-n-2:n),Ce(e,t+8,i.size)),Ce(e,t+12,b),Ce(e,t+14,I),t+=16,f!=null&&(Ce(e,t,T),Ce(e,t+6,i.attrs),Ce(e,t+10,f),t+=14),e.set(r,t),t+=b,I)for(var U in y){var V=y[U],Q=V.length;Ce(e,t,+U),Ce(e,t+2,Q),e.set(V,t+4),t+=4+Q}return T&&(e.set(a,t),t+=T),t},ga=function(e,t,i,r,l){Ce(e,t,101010256),Ce(e,t+8,i),Ce(e,t+10,i),Ce(e,t+12,r),Ce(e,t+16,l)};function Qo(e,t){t||(t={});var i={},r=[];Xo(e,"",i,t);var l=0,n=0;for(var f in i){var a=i[f],b=a[0],y=a[1],T=y.level==0?0:8,I=ti(f),$=I.length,k=y.comment,U=k&&ti(k),V=U&&U.length,Q=Ri(y.extra);$>65535&&ni(11);var ee=T?fa(b,y):b,Z=ee.length,ce=da();ce.p(b),r.push(Jo(y,{size:b.length,crc:ce.d(),c:ee,f:I,m:U,u:$!=f.length||U&&k.length!=V,o:l,compression:T})),l+=30+$+Q+Z,n+=76+2*($+Q)+(V||0)+Z}for(var J=new Ae(n+22),fe=l,we=n-l,ae=0;ae<r.length;++ae){var I=r[ae];Go(J,I.o,I,I.f,I.u,I.c.length);var R=30+I.f.length+Ri(I.extra);J.set(I.c,I.o+R),Go(J,l,I,I.f,I.u,I.c.length,I.o,I.m),l+=16+R+(I.m?I.m.length:0)}return ga(J,l,r.length,we,fe),J}var K={isSignedIn:!1,accessToken:null,userName:null,email:null},ct=!0,Ke=30,nt=null,Qt=!1,Xt=0,tt=null,ji=null,ke=null,le=null,ii=null;function ir(e){ji=e}function or(e){ke=e}function rr(e){le=e}function qi(e){ii=e}var er=!1;function ar(){if(!er)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),er=!0}catch{}}var sr=null,kn=null,Sn=null;function Vi(e){sr=e}function ri(e){kn=e}function ai(e){Sn=e}var tr="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",ya="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",va="https://www.youtube.com/",ba=30*1e3,wa=1800*1e3,nr=5,oi=null,We=null;async function Yi(){try{let e=await Sn("googleAuthState");e&&typeof e=="object"&&(K={...K,...e},Mn(),K.isSignedIn&&K.accessToken&&await tn(!0))}catch(e){c("Failed to load Google auth state:",e,"error")}}async function si(){try{await kn("googleAuthState",K)}catch(e){c("Failed to save Google auth state:",e,"error")}}function Mn(){ji&&(ji.style.display="none")}function Ue(e,t){if(le){if(le.style.fontWeight="bold",e==="authenticating"){for(ar(),le.style.color="#ffa500";le.firstChild;)le.removeChild(le.firstChild);let i=document.createElement("span");i.className="tk-auth-spinner";let r=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);le.appendChild(i),le.appendChild(r);return}if(e==="error"){le.textContent=`\u274C ${t||"Authorization failed"}`,le.style.color="#ff4d4f",be();return}K.isSignedIn?(le.textContent="\u2705 Signed in",le.style.color="#52c41a",le.removeAttribute("title"),K.userName?(le.onmouseenter=()=>{le.textContent=`\u2705 Signed in as ${K.userName}`},le.onmouseleave=()=>{le.textContent="\u2705 Signed in"}):(le.onmouseenter=null,le.onmouseleave=null)):(le.textContent="\u274C Not signed in",le.style.color="#ff4d4f",le.removeAttribute("title"),le.onmouseenter=null,le.onmouseleave=null),be()}}function xa(){le&&(ar(),le.classList.remove("tk-auth-blink"),le.offsetWidth,le.classList.add("tk-auth-blink"),setTimeout(()=>{le.classList.remove("tk-auth-blink")},1200))}function Ta(e){return new Promise((t,i)=>{if(!e){c&&c("OAuth monitor: popup is null",null,"error"),i(new Error("Failed to open popup"));return}c&&c("OAuth monitor: starting to monitor popup for token");let r=Date.now(),l=300*1e3,n="timekeeper_oauth",f=null,a=null,b=null,y=()=>{if(f){try{f.close()}catch{}f=null}a&&(clearInterval(a),a=null),b&&(clearInterval(b),b=null)};try{f=new BroadcastChannel(n),c&&c("OAuth monitor: BroadcastChannel created successfully"),f.onmessage=$=>{if(c&&c("OAuth monitor: received BroadcastChannel message",$.data),$.data?.type==="timekeeper_oauth_token"&&$.data?.token){c&&c("OAuth monitor: token received via BroadcastChannel"),y();try{e.close()}catch{}t($.data.token)}else if($.data?.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via BroadcastChannel",$.data.error,"error"),y();try{e.close()}catch{}i(new Error($.data.error||"OAuth failed"))}}}catch($){c&&c("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",$)}c&&c("OAuth monitor: setting up IndexedDB polling");let T=Date.now();a=setInterval(async()=>{try{let $=indexedDB.open("ytls-timestamps-db",3);$.onsuccess=()=>{let k=$.result,Q=k.transaction("settings","readonly").objectStore("settings").get("oauth_message");Q.onsuccess=()=>{let ee=Q.result;if(ee&&ee.value){let Z=ee.value;if(Z.timestamp&&Z.timestamp>T){if(c&&c("OAuth monitor: received IndexedDB message",Z),Z.type==="timekeeper_oauth_token"&&Z.token){c&&c("OAuth monitor: token received via IndexedDB"),y();try{e.close()}catch{}k.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),t(Z.token)}else if(Z.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via IndexedDB",Z.error,"error"),y();try{e.close()}catch{}k.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(new Error(Z.error||"OAuth failed"))}T=Z.timestamp}}k.close()}}}catch($){c&&c("OAuth monitor: IndexedDB polling error",$,"error")}},500),b=setInterval(()=>{if(Date.now()-r>l){c&&c("OAuth monitor: popup timed out after 5 minutes",null,"error"),y();try{e.close()}catch{}i(new Error("OAuth popup timed out"));return}},1e3)})}async function lr(){if(!tr){Ue("error","Google Client ID not configured");return}try{c&&c("OAuth signin: starting OAuth flow"),Ue("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",tr),e.searchParams.set("redirect_uri",va),e.searchParams.set("response_type","token"),e.searchParams.set("scope",ya),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),c&&c("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){c&&c("OAuth signin: popup blocked by browser",null,"error"),Ue("error","Popup blocked. Please enable popups for YouTube.");return}c&&c("OAuth signin: popup opened successfully"),Ue("authenticating","Waiting for authentication...");try{let i=await Ta(t),r=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${i}`}});if(r.ok){let l=await r.json();K.accessToken=i,K.isSignedIn=!0,K.userName=l.name,K.email=l.email,await si(),Mn(),Ue(),be(),await tn(),c?c(`Successfully authenticated as ${l.name}`):console.log(`[Timekeeper] Successfully authenticated as ${l.name}`)}else throw new Error("Failed to fetch user info")}catch(i){let r=i instanceof Error?i.message:"Authentication failed";c?c("OAuth failed:",i,"error"):console.error("[Timekeeper] OAuth failed:",i),Ue("error",r);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";c?c("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Ue("error",`Failed to sign in: ${t}`)}}async function cr(){if(!window.opener||window.opener===window)return!1;c&&c("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return c&&c("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,i=new URLSearchParams(t),r=i.get("state");if(c&&c("OAuth popup: hash params found, state="+r),r!=="timekeeper_auth")return c&&c("OAuth popup: not our OAuth flow (wrong state)"),!1;let l=i.get("error"),n=i.get("access_token"),f="timekeeper_oauth";if(l){try{let a=new BroadcastChannel(f);a.postMessage({type:"timekeeper_oauth_error",error:i.get("error_description")||l}),a.close()}catch{let b={type:"timekeeper_oauth_error",error:i.get("error_description")||l,timestamp:Date.now()},y=indexedDB.open("ytls-timestamps-db",3);y.onsuccess=()=>{let T=y.result;T.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:b}),T.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){c&&c("OAuth popup: access token found, broadcasting to opener");try{let a=new BroadcastChannel(f);a.postMessage({type:"timekeeper_oauth_token",token:n}),a.close(),c&&c("OAuth popup: token broadcast via BroadcastChannel")}catch(a){c&&c("OAuth popup: BroadcastChannel failed, using IndexedDB",a);let b={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},y=indexedDB.open("ytls-timestamps-db",3);y.onsuccess=()=>{let T=y.result;T.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:b}),T.close()},c&&c("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function ur(){K={isSignedIn:!1,accessToken:null,userName:null,email:null},await si(),Mn(),Ue(),be()}async function dr(){if(!K.isSignedIn||!K.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${K.accessToken}`}});return e.status===401?(await mr({silent:!0}),!1):e.ok}catch(e){return c("Failed to verify auth state:",e,"error"),!1}}async function Ea(e){let t={Authorization:`Bearer ${e}`},r=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,l=await fetch(r,{headers:t});if(l.status===401)throw new Error("unauthorized");if(!l.ok)throw new Error("drive search failed");let n=await l.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let f=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(f.status===401)throw new Error("unauthorized");if(!f.ok)throw new Error("drive folder create failed");return(await f.json()).id}async function ka(e,t,i){let r=`name='${e}' and '${t}' in parents and trashed=false`,l=encodeURIComponent(r),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${l}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${i}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let f=await n.json();return f.files&&f.files.length>0?f.files[0].id:null}function Sa(e,t){let i=ti(e),r=t.replace(/\\/g,"/").replace(/^\/+/,"");return r.endsWith(".json")||(r+=".json"),Qo({[r]:[i,{level:6,mtime:new Date,os:0}]})}async function La(e,t,i,r){let l=e.replace(/\.json$/,".zip"),n=await ka(l,i,r),f=new TextEncoder().encode(t).length,a=Sa(t,e),b=a.length;c(`Compressing data: ${f} bytes -> ${b} bytes (${Math.round(100-b/f*100)}% reduction)`);let y="-------314159265358979",T=`\r
--${y}\r
`,I=`\r
--${y}--`,$=n?{name:l,mimeType:"application/zip"}:{name:l,mimeType:"application/zip",parents:[i]},k=8192,U="";for(let J=0;J<a.length;J+=k){let fe=a.subarray(J,Math.min(J+k,a.length));U+=String.fromCharCode.apply(null,Array.from(fe))}let V=btoa(U),Q=T+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify($)+T+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+V+I,ee,Z;n?(ee=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,Z="PATCH"):(ee="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",Z="POST");let ce=await fetch(ee,{method:Z,headers:{Authorization:`Bearer ${r}`,"Content-Type":`multipart/related; boundary=${y}`},body:Q});if(ce.status===401)throw new Error("unauthorized");if(!ce.ok)throw new Error("drive upload failed")}async function mr(e){c("Auth expired, clearing token",null,"warn"),K.isSignedIn=!1,K.accessToken=null,await si(),Ue("error","Authorization expired. Please sign in again."),be()}async function Ma(e){if(!K.isSignedIn||!K.accessToken){e?.silent||Ue("error","Please sign in to Google Drive first");return}try{let{json:t,filename:i,totalVideos:r,totalTimestamps:l}=await sr();if(l===0){e?.silent||c("Skipping export: no timestamps to back up");return}let n=await Ea(K.accessToken);await La(i,t,n,K.accessToken),c(`Exported to Google Drive (${i}) with ${r} videos / ${l} timestamps.`)}catch(t){throw t.message==="unauthorized"?(await mr({silent:e?.silent}),t):(c("Drive export failed:",t,"error"),e?.silent||Ue("error","Failed to export to Google Drive."),t)}}async function fr(){try{let e=await Sn("autoBackupEnabled"),t=await Sn("autoBackupIntervalMinutes"),i=await Sn("lastAutoBackupAt");typeof e=="boolean"&&(ct=e),typeof t=="number"&&t>0&&(Ke=t),typeof i=="number"&&i>0&&(nt=i)}catch(e){c("Failed to load auto backup settings:",e,"error")}}async function Wi(){try{await kn("autoBackupEnabled",ct),await kn("autoBackupIntervalMinutes",Ke),await kn("lastAutoBackupAt",nt??0)}catch(e){c("Failed to save auto backup settings:",e,"error")}}function Da(){oi&&(clearInterval(oi),oi=null),We&&(clearTimeout(We),We=null)}function en(e){try{let t=new Date(e),i=new Date,r=t.toDateString()===i.toDateString(),l=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r?l:`${t.toLocaleDateString()} ${l}`}catch{return""}}function pr(){return ct?Qt?"#4285f4":tt&&tt>0?"#ffa500":K.isSignedIn&&nt?"#52c41a":K.isSignedIn?"#ffa500":"#ff4d4f":"#ff4d4f"}function be(){if(!ke)return;let e="",t="";if(!ct)e="\u{1F501} Backup: Off",ke.onmouseenter=null,ke.onmouseleave=null;else if(Qt)e="\u{1F501} Backing up\u2026",ke.onmouseenter=null,ke.onmouseleave=null;else if(tt&&tt>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(tt/6e4)}m`,ke.onmouseenter=null,ke.onmouseleave=null;else if(nt){e=`\u{1F5C4}\uFE0F Last backup: ${en(nt)}`;let i=nt+Math.max(1,Ke)*60*1e3;t=`\u{1F5C4}\uFE0F Next backup: ${en(i)}`,ke.onmouseenter=()=>{ke.textContent=t},ke.onmouseleave=()=>{ke.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let i=Date.now()+Math.max(1,Ke)*60*1e3;t=`\u{1F5C4}\uFE0F Next backup: ${en(i)}`,ke.onmouseenter=()=>{ke.textContent=t},ke.onmouseleave=()=>{ke.textContent=e}}ke.textContent=e,ke.style.display=e?"inline":"none";try{let i=pr();ke.style.color=i}catch{}li()}function li(){if(!ii)return;let e=pr();ii.style.backgroundColor=e,lt(ii,()=>{let t="";if(!ct)t="Auto backup is disabled";else if(Qt)t="Backup in progress";else if(tt&&tt>0)t=`Retrying backup in ${Math.ceil(tt/6e4)}m`;else if(K.isSignedIn&&nt){let i=nt+Math.max(1,Ke)*60*1e3,r=en(i);t=`Last backup: ${en(nt)}
Next backup: ${r}`}else if(K.isSignedIn){let i=Date.now()+Math.max(1,Ke)*60*1e3;t=`No backup yet
Next backup: ${en(i)}`}else t="Not signed in to Google Drive";return t})}async function Ln(e=!0){if(!K.isSignedIn||!K.accessToken){e||xa();return}if(We){c("Auto backup: backoff in progress, skipping scheduled run");return}if(!Qt){Qt=!0,be();try{await Ma({silent:e}),nt=Date.now(),Xt=0,tt=null,We&&(clearTimeout(We),We=null),await Wi()}catch(t){if(c("Auto backup failed:",t,"error"),t.message==="unauthorized")c("Auth error detected, clearing token and stopping retries",null,"warn"),K.isSignedIn=!1,K.accessToken=null,await si(),Ue("error","Authorization expired. Please sign in again."),be(),Xt=0,tt=null,We&&(clearTimeout(We),We=null);else if(Xt<nr){Xt+=1;let l=Math.min(ba*Math.pow(2,Xt-1),wa);tt=l,We&&clearTimeout(We),We=setTimeout(()=>{Ln(!0)},l),c(`Scheduling backup retry ${Xt}/${nr} in ${Math.round(l/1e3)}s`),be()}else tt=null}finally{Qt=!1,be()}}}async function tn(e=!1){if(Da(),!!ct&&!(!K.isSignedIn||!K.accessToken)){if(oi=setInterval(()=>{Ln(!0)},Math.max(1,Ke)*60*1e3),!e){let t=Date.now(),i=Math.max(1,Ke)*60*1e3;(!nt||t-nt>=i)&&Ln(!0)}be()}}async function hr(){ct=!ct,await Wi(),await tn(),be()}async function gr(){let e=prompt("Set Auto Backup interval (minutes):",String(Ke));if(e===null)return;let t=Math.floor(Number(e));if(!Number.isFinite(t)||t<5||t>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Ke=t,await Wi(),await tn(),be()}var Ki=window.location.hash;if(Ki&&Ki.length>1){let e=new URLSearchParams(Ki.substring(1));if(e.get("state")==="timekeeper_auth"){let i=e.get("access_token");if(i){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",i.length,"characters");try{let r=new BroadcastChannel("timekeeper_oauth"),l={type:"timekeeper_oauth_token",token:i};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:l.type,tokenLength:i.length}),r.postMessage(l),r.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(r){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",r);let l={type:"timekeeper_oauth_token",token:i,timestamp:Date.now()};Jt("oauth_message",l).then(()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",l.timestamp)}).catch(n=>{console.log("[Timekeeper] Failed to save oauth_message to IndexedDB:",n)})}if(history.replaceState){let r=window.location.pathname+window.location.search;history.replaceState(null,"",r)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(o){return GM.getValue(`timekeeper_${o}`,void 0)}function t(o,s){return GM.setValue(`timekeeper_${o}`,JSON.stringify(s))}if(ai(e),ri(t),await cr()){c("OAuth popup detected, broadcasting token and closing");return}await Yi();let r=["/watch","/live"];function l(o=window.location.href){try{let s=new URL(o);return s.origin!=="https://www.youtube.com"?!1:r.some(m=>s.pathname===m||s.pathname.startsWith(`${m}/`))}catch(s){return c("Timekeeper failed to parse URL for support check:",s,"error"),!1}}let n=null,f=null,a=null,b=null,y=null,T=null,I=null,$=null,k=250,U=null,V=!1;function Q(){return n?n.getBoundingClientRect():null}function ee(o,s,m){o&&(Ne={x:Math.round(typeof s=="number"?s:o.left),y:Math.round(typeof m=="number"?m:o.top),width:Math.round(o.width),height:Math.round(o.height)})}function Z(o=!0){if(!n)return;Ut();let s=Q();s&&(s.width||s.height)&&(ee(s),o&&(Jt("windowPosition",Ne).catch(m=>c(`Failed to save window position: ${m}`,"error")),nn({type:"window_position_updated",position:Ne,timestamp:Date.now()})))}function ce(){if(!n||!f||!b||!a)return;let o=40,s=ge();if(s.length>0)o=s[0].offsetHeight;else{let m=document.createElement("li");m.style.visibility="hidden",m.style.position="absolute",m.textContent="00:00 Example",a.appendChild(m),o=m.offsetHeight,a.removeChild(m)}k=f.offsetHeight+b.offsetHeight+o,n.style.minHeight=k+"px"}function J(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),Z(!0)})}function fe(o=450){Te&&(clearTimeout(Te),Te=null),Te=setTimeout(()=>{C(),J(),Te=null},o)}function we(){Te&&(clearTimeout(Te),Te=null)}function ae(){a&&(a.style.visibility="hidden",c("Hiding timestamps during show animation")),J(),fe()}function R(){C(),we(),ot&&(clearTimeout(ot),ot=null),ot=setTimeout(()=>{n&&(n.style.display="none",co(),ot=null)},400)}function C(){if(!a){Ge&&(Ge(),Ge=null,mt=null,bt=null);return}if(!bt){a.style.visibility==="hidden"&&(a.style.visibility="",c("Restoring timestamp visibility (no deferred fragment)")),Ge&&(Ge(),Ge=null,mt=null);return}c("Appending deferred timestamps after animation"),a.appendChild(bt),bt=null,a.style.visibility==="hidden"&&(a.style.visibility="",c("Restoring timestamp visibility after append")),Ge&&(Ge(),Ge=null,mt=null),st(),ze(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let o=W(),s=o?Math.floor(o.getCurrentTime()):Ct();Number.isFinite(s)&&Bt(s,!1)}let pe=null,ye=!1,B="ytls-timestamp-pending-delete",M="ytls-timestamp-highlight",S="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",A="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function L(){let o=s=>{let m=new Image;m.src=s};o(S),o(A)}L();async function H(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(o=>setTimeout(o,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(o=>setTimeout(o,100));await new Promise(o=>setTimeout(o,200))}let F=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],X=5e3,de=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function te(o){return de.has(o)}function se(){return document.querySelector("video")}let me=null;function W(){if(me&&document.contains(me))return me;let o=document.getElementById("movie_player");return o&&document.contains(o)?o:null}function ue(o){return F.every(s=>typeof o?.[s]=="function"?!0:te(s)?!!se():!1)}function Oe(o){return F.filter(s=>typeof o?.[s]=="function"?!1:te(s)?!se():!0)}async function Ze(o=X){let s=Date.now();for(;Date.now()-s<o;){let h=W();if(ue(h))return h;await new Promise(x=>setTimeout(x,100))}let m=W();return ue(m),m}let xe="timestampOffsetSeconds",Je=-5,it="shiftClickTimeSkipSeconds",dt=10,Nt=300,Mt=300,Fe=null;function Zi(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Ji(){if(Zi()&&!Fe)try{Fe=new BroadcastChannel("ytls_timestamp_channel"),Fe.onmessage=Xi}catch(o){c("Failed to create BroadcastChannel:",o,"warn"),Fe=null}}function nn(o){if(!Zi()){c("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Ji(),!Fe){c("No BroadcastChannel available to post message","warn");return}try{Fe.postMessage(o)}catch(s){c("BroadcastChannel error, reopening:",s,"warn");try{Fe=new BroadcastChannel("ytls_timestamp_channel"),Fe.onmessage=Xi,Fe.postMessage(o)}catch(m){c("Failed to reopen BroadcastChannel:",m,"error")}}}function Xi(o){if(c("Received message from another tab:",o.data),!(!l()||!a||!n)&&o.data){if(o.data.type==="timestamps_updated"&&o.data.videoId===Se)c("Debouncing timestamp load due to external update for video:",o.data.videoId),clearTimeout(rn),rn=setTimeout(()=>{c("Reloading timestamps due to external update for video:",o.data.videoId),so()},500);else if(o.data.type==="window_position_updated"&&n){let s=o.data.position;if(s&&typeof s.x=="number"&&typeof s.y=="number"){n.style.left=`${s.x}px`,n.style.top=`${s.y}px`,n.style.right="auto",n.style.bottom="auto",typeof s.width=="number"&&s.width>0&&(n.style.width=`${s.width}px`),typeof s.height=="number"&&s.height>0&&(n.style.height=`${s.height}px`);let m=n.getBoundingClientRect();Ne={x:Math.round(s.x),y:Math.round(s.y),width:Math.round(m.width),height:Math.round(m.height)};let h=document.documentElement.clientWidth,x=document.documentElement.clientHeight;(m.left<0||m.top<0||m.right>h||m.bottom>x)&&Ut()}}}}Ji();let Rt=await GM.getValue(xe);(typeof Rt!="number"||Number.isNaN(Rt))&&(Rt=Je,await GM.setValue(xe,Rt));let on=await GM.getValue(it);(typeof on!="number"||Number.isNaN(on))&&(on=dt,await GM.setValue(it,on));let rn=null,Dt=new Map,Dn=!1,Y=null,In=null,Se=null,ot=null,Te=null,bt=null,mt=null,Ge=null,wt=null,Cn=!1,Ne=null,ci=!1,An=null,$n=null,Bn=null,Hn=null,zn=null,Pn=null,On=null,an=null,sn=null,ln=null,rt=null,at=null,Qi=0,cn=!1,It=null,un=null;function ge(){return a?Array.from(a.querySelectorAll("li")).filter(o=>!!o.querySelector("a[data-time]")):[]}function ui(){return ge().map(o=>{let s=o.querySelector("a[data-time]"),m=s?.dataset.time;if(!s||!m)return null;let h=Number.parseInt(m,10);if(!Number.isFinite(h))return null;let E=o.querySelector("input")?.value??"",g=o.dataset.guid??crypto.randomUUID();return o.dataset.guid||(o.dataset.guid=g),{start:h,comment:E,guid:g}}).filter(to)}function Ct(){if(un!==null)return un;let o=ge();return un=o.length>0?Math.max(...o.map(s=>{let m=s.querySelector("a[data-time]")?.getAttribute("data-time");return m?Number.parseInt(m,10):0})):0,un}function Fn(){un=null}function yr(o){let s=o.querySelector(".time-diff");return s?(s.textContent?.trim()||"").startsWith("-"):!1}function vr(o,s){return o?s?"\u2514\u2500 ":"\u251C\u2500 ":""}function dn(o){return o.startsWith("\u251C\u2500 ")||o.startsWith("\u2514\u2500 ")?1:0}function eo(o){return o.replace(/^[├└]─\s/,"")}function br(o){let s=ge();if(o>=s.length-1)return"\u2514\u2500 ";let m=s[o+1].querySelector("input");return m&&dn(m.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function st(){if(!a)return;let o=ge(),s=!0,m=0,h=o.length;for(;s&&m<h;)s=!1,m++,o.forEach((x,E)=>{let g=x.querySelector("input");if(!g||!(dn(g.value)===1))return;let z=!1;if(E<o.length-1){let ne=o[E+1].querySelector("input");ne&&(z=!(dn(ne.value)===1))}else z=!0;let P=eo(g.value),G=`${vr(!0,z)}${P}`;g.value!==G&&(g.value=G,s=!0)})}function At(){if(a){for(;a.firstChild;)a.removeChild(a.firstChild);bt&&(bt=null),Ge&&(Ge(),Ge=null,mt=null)}}function mn(){if(!a||ye||bt)return;Array.from(a.children).some(s=>!s.classList.contains("ytls-placeholder")&&!s.classList.contains("ytls-error-message"))||di("No timestamps for this video")}function di(o){if(!a)return;At();let s=document.createElement("li");s.className="ytls-placeholder",s.textContent=o,a.appendChild(s),a.style.overflowY="hidden"}function mi(){if(!a)return;let o=a.querySelector(".ytls-placeholder");o&&o.remove(),a.style.overflowY=""}function fi(o){if(!(!n||!a)){if(ye=o,o)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),di("Loading timestamps...");else if(mi(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),y){let s=W();if(s){let m=s.getCurrentTime(),h=Number.isFinite(m)?Math.max(0,Math.floor(m)):Math.max(0,Ct()),x=Math.floor(h/3600),E=Math.floor(h/60)%60,g=h%60,{isLive:w}=s.getVideoData()||{isLive:!1},z=a?ge().map(_=>{let G=_.querySelector("a[data-time]");return G?parseFloat(G.getAttribute("data-time")??"0"):0}):[],P="";if(z.length>0)if(w){let _=Math.max(1,h/60),G=z.filter(ne=>ne<=h);if(G.length>0){let ne=(G.length/_).toFixed(2);parseFloat(ne)>0&&(P=` (${ne}/min)`)}}else{let _=s.getDuration(),G=Number.isFinite(_)&&_>0?_:0,ne=Math.max(1,G/60),Le=(z.length/ne).toFixed(1);parseFloat(Le)>0&&(P=` (${Le}/min)`)}y.textContent=`\u23F3${x?x+":"+String(E).padStart(2,"0"):E}:${String(g).padStart(2,"0")}${P}`}}!ye&&a&&!a.querySelector(".ytls-error-message")&&mn(),xt()}}function to(o){return!!o&&Number.isFinite(o.start)&&typeof o.comment=="string"&&typeof o.guid=="string"}function Nn(o,s){o.textContent=kt(s),o.dataset.time=String(s),o.href=Si(s,window.location.href)}let Rn=null,_n=null,$t=!1;function wr(o){if(!o||typeof o.getVideoData!="function"||!o.getVideoData()?.isLive)return!1;if(typeof o.getProgressState=="function"){let m=o.getProgressState(),h=Number(m?.seekableEnd??m?.liveHead??m?.head??m?.duration),x=Number(m?.current??o.getCurrentTime?.());if(Number.isFinite(h)&&Number.isFinite(x))return h-x>2}return!1}function Bt(o,s){if(!Number.isFinite(o))return;let m=Un(o);fn(m,s)}function Un(o){if(!Number.isFinite(o))return null;let s=ge();if(s.length===0)return null;let m=null,h=-1/0;for(let x of s){let g=x.querySelector("a[data-time]")?.dataset.time;if(!g)continue;let w=Number.parseInt(g,10);Number.isFinite(w)&&w<=o&&w>h&&(h=w,m=x)}return m}function fn(o,s=!1){if(!o)return;if(ge().forEach(h=>{h.classList.contains(B)||h.classList.remove(M)}),!o.classList.contains(B)&&(o.classList.add(M),s&&!Dn))try{if(a instanceof HTMLElement){let h=o.getBoundingClientRect(),x=a.getBoundingClientRect();!(h.bottom<x.top||h.top>x.bottom)||o.scrollIntoView({behavior:"smooth",block:"center"})}else o.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{o.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function xr(o){if(!a||a.querySelector(".ytls-error-message")||!Number.isFinite(o)||o===0)return!1;let s=ge();if(s.length===0)return!1;let m=!1;return s.forEach(h=>{let x=h.querySelector("a[data-time]"),E=x?.dataset.time;if(!x||!E)return;let g=Number.parseInt(E,10);if(!Number.isFinite(g))return;let w=Math.max(0,g+o);w!==g&&(Nn(x,w),m=!0)}),m?(hn(),st(),ze(),jn(Se),It=null,!0):!1}function no(o,s={}){if(!Number.isFinite(o)||o===0)return!1;if(!xr(o)){if(s.alertOnNoChange){let g=s.failureMessage??"Offset did not change any timestamps.";alert(g)}return!1}let h=s.logLabel??"bulk offset";c(`Timestamps changed: Offset all timestamps by ${o>0?"+":""}${o} seconds (${h})`);let x=W(),E=x?Math.floor(x.getCurrentTime()):0;if(Number.isFinite(E)){let g=Un(E);fn(g,!1)}return!0}function io(o){if(!a||ye)return;let s=o.target instanceof HTMLElement?o.target:null;if(s)if(s.dataset.time){o.preventDefault();let m=Number(s.dataset.time);if(Number.isFinite(m)){$t=!0;let x=W();x&&x.seekTo(m),setTimeout(()=>{$t=!1},500)}let h=s.closest("li");h&&(ge().forEach(x=>{x.classList.contains(B)||x.classList.remove(M)}),h.classList.contains(B)||(h.classList.add(M),h.scrollIntoView({behavior:"smooth",block:"center"})))}else if(s.dataset.increment){o.preventDefault();let h=s.parentElement?.querySelector("a[data-time]");if(!h||!h.dataset.time)return;let x=parseInt(h.dataset.time,10),E=parseInt(s.dataset.increment,10);if("shiftKey"in o&&o.shiftKey&&(E*=on),"altKey"in o?o.altKey:!1){no(E,{logLabel:"Alt adjust"});return}let z=Math.max(0,x+E);c(`Timestamps changed: Timestamp time incremented from ${x} to ${z}`),Nn(h,z),Fn();let P=s.closest("li");if(_n=z,Rn&&clearTimeout(Rn),$t=!0,Rn=setTimeout(()=>{if(_n!==null){let _=W();_&&_.seekTo(_n)}Rn=null,_n=null,setTimeout(()=>{$t=!1},500)},500),hn(),st(),ze(),P){let _=P.querySelector("input"),G=P.dataset.guid;_&&G&&(_t(Se,G,z,_.value),It=G)}}else s.dataset.action==="clear"&&(o.preventDefault(),c("Timestamps changed: All timestamps cleared from UI"),a.textContent="",Fn(),ze(),Gn(),jn(Se,{allowEmpty:!0}),It=null,mn())}function pn(o,s="",m=!1,h=null,x=!0){if(!a)return null;let E=Math.max(0,o),g=h??crypto.randomUUID(),w=document.createElement("li"),z=document.createElement("div"),P=document.createElement("span"),_=document.createElement("span"),G=document.createElement("span"),ne=document.createElement("a"),Le=document.createElement("span"),ve=document.createElement("input"),he=document.createElement("button");w.dataset.guid=g,z.className="time-row";let ft=document.createElement("div");ft.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",ft.dataset.action="toggle-indent",lt(ft,"Click to toggle indent");let Xe=document.createElement("span");Xe.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;",Xe.className="indent-toggle",ft.append(Xe),w.style.cssText="position:relative;padding-left:20px;",ve.value=s||"",ve.style.cssText="width:100%;margin-top:5px;display:block;",ve.type="text",ve.setAttribute("inputmode","text"),ve.autocapitalize="off",ve.autocomplete="off",ve.spellcheck=!1,ve.dataset.action="comment",P.textContent="\u2796",P.dataset.increment="-1",P.style.cursor="pointer",P.style.margin="0px",P.className="ts-button ts-minus",G.textContent="\u2795",G.dataset.increment="1",G.style.cursor="pointer",G.style.margin="0px",G.className="ts-button ts-plus",_.textContent="\u23FA\uFE0F",_.style.cursor="pointer",_.style.margin="0px",_.className="ts-button ts-record",_.dataset.action="record",lt(_,"Set to current playback time"),Nn(ne,E),Fn(),he.textContent="\u{1F5D1}\uFE0F",he.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",he.className="ts-button ts-delete",he.dataset.action="delete",he.__deleteHandler=()=>{let Qe=null,Me=null,Re=null,qe=()=>{try{w.removeEventListener("click",Me,!0)}catch{}try{document.removeEventListener("click",Me,!0)}catch{}if(a)try{a.removeEventListener("mouseleave",Re)}catch{}Qe&&(clearTimeout(Qe),Qe=null)};if(w.dataset.deleteConfirmed==="true"){c("Timestamps changed: Timestamp deleted");let $e=w.dataset.guid??"",Be=Dt.get($e);Be&&(clearTimeout(Be),Dt.delete($e)),qe(),w.remove(),Fn(),hn(),st(),ze(),Gn(),Tr(Se,$e),It=null,mn()}else{w.dataset.deleteConfirmed="true",w.classList.add(B),w.classList.remove(M);let $e=()=>{w.dataset.deleteConfirmed="false",w.classList.remove(B);let Be=W(),_e=Be?Be.getCurrentTime():0,Tt=Number.parseInt(w.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(_e)&&Number.isFinite(Tt)&&_e>=Tt&&w.classList.add(M),qe()};Me=Be=>{Be.target!==he&&$e()},Re=()=>{w.dataset.deleteConfirmed==="true"&&$e()},w.addEventListener("click",Me,!0),document.addEventListener("click",Me,!0),a&&a.addEventListener("mouseleave",Re),Qe=setTimeout(()=>{w.dataset.deleteConfirmed==="true"&&$e(),qe()},5e3)}},Le.className="time-diff",Le.style.color="#888",Le.style.marginLeft="5px",z.append(P,_,G,ne,Le,he),w.append(ft,z,ve);let je=Number.parseInt(ne.dataset.time??"0",10);if(x){mi();let Qe=!1,Me=ge();for(let Re=0;Re<Me.length;Re++){let qe=Me[Re],Be=qe.querySelector("a[data-time]")?.dataset.time;if(!Be)continue;let _e=Number.parseInt(Be,10);if(Number.isFinite(_e)&&je<_e){a.insertBefore(w,qe),Qe=!0;let Tt=Me[Re-1];if(Tt){let Gt=Tt.querySelector("a[data-time]")?.dataset.time;if(Gt){let jt=Number.parseInt(Gt,10);Number.isFinite(jt)&&(Le.textContent=kt(je-jt))}}else Le.textContent="";let gn=qe.querySelector(".time-diff");gn&&(gn.textContent=kt(_e-je));break}}if(!Qe&&(a.appendChild(w),Me.length>0)){let $e=Me[Me.length-1].querySelector("a[data-time]")?.dataset.time;if($e){let Be=Number.parseInt($e,10);Number.isFinite(Be)&&(Le.textContent=kt(je-Be))}}w.scrollIntoView({behavior:"smooth",block:"center"}),Gn(),st(),ze(),m||(_t(Se,g,E,s),It=g,fn(w,!1))}else ve.__ytls_li=w;return ve}function hn(){if(!a||a.querySelector(".ytls-error-message"))return;let o=ge();o.forEach((s,m)=>{let h=s.querySelector(".time-diff");if(!h)return;let E=s.querySelector("a[data-time]")?.dataset.time;if(!E){h.textContent="";return}let g=Number.parseInt(E,10);if(!Number.isFinite(g)){h.textContent="";return}if(m===0){h.textContent="";return}let P=o[m-1].querySelector("a[data-time]")?.dataset.time;if(!P){h.textContent="";return}let _=Number.parseInt(P,10);if(!Number.isFinite(_)){h.textContent="";return}let G=g-_,ne=G<0?"-":"";h.textContent=` ${ne}${kt(Math.abs(G))}`})}function oo(){if(!a||a.querySelector(".ytls-error-message")||ye)return;let o=null;if(document.activeElement instanceof HTMLInputElement&&a.contains(document.activeElement)){let g=document.activeElement,z=g.closest("li")?.dataset.guid;if(z){let P=g.selectionStart??g.value.length,_=g.selectionEnd??P,G=g.scrollLeft;o={guid:z,start:P,end:_,scroll:G}}}let s=ge();if(s.length===0)return;let m=s.map(g=>g.dataset.guid),h=s.map(g=>{let w=g.querySelector("a[data-time]"),z=w?.dataset.time;if(!w||!z)return null;let P=Number.parseInt(z,10);if(!Number.isFinite(P))return null;let _=g.dataset.guid??"";return{time:P,guid:_,element:g}}).filter(g=>g!==null).sort((g,w)=>{let z=g.time-w.time;return z!==0?z:g.guid.localeCompare(w.guid)}),x=h.map(g=>g.guid),E=m.length!==x.length||m.some((g,w)=>g!==x[w]);for(;a.firstChild;)a.removeChild(a.firstChild);if(h.forEach(g=>{a.appendChild(g.element)}),hn(),st(),ze(),o){let w=ge().find(z=>z.dataset.guid===o.guid)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}E&&(c("Timestamps changed: Timestamps sorted"),jn(Se))}function Gn(){if(!a||!n||!f||!b)return;let o=ge().length;typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea();let s=n.getBoundingClientRect(),m=f.getBoundingClientRect(),h=b.getBoundingClientRect(),x=Math.max(0,s.height-(m.height+h.height));o===0?(mn(),a.style.overflowY="hidden"):a.style.overflowY=a.scrollHeight>x?"auto":"hidden"}function ze(){if(!a)return;let o=se(),s=document.querySelector(".ytp-progress-bar"),m=W(),h=m?m.getVideoData():null,x=!!h&&!!h.isLive;if(!o||!s||!isFinite(o.duration)||x)return;ao(),ge().map(g=>{let w=g.querySelector("a[data-time]"),z=w?.dataset.time;if(!w||!z)return null;let P=Number.parseInt(z,10);if(!Number.isFinite(P))return null;let G=g.querySelector("input")?.value??"",ne=g.dataset.guid??crypto.randomUUID();return g.dataset.guid||(g.dataset.guid=ne),{start:P,comment:G,guid:ne}}).filter(to).forEach(g=>{if(!Number.isFinite(g.start))return;let w=document.createElement("div");w.className="ytls-marker",w.style.position="absolute",w.style.height="100%",w.style.width="2px",w.style.backgroundColor="#ff0000",w.style.cursor="pointer",w.style.left=g.start/o.duration*100+"%",w.dataset.time=String(g.start),w.addEventListener("click",()=>{let z=W();z&&z.seekTo(g.start)}),s.appendChild(w)})}function jn(o,s={}){if(!a||a.querySelector(".ytls-error-message")||!o)return;if(ye){c("Save blocked: timestamps are currently loading");return}st();let m=ui().sort((h,x)=>h.start-x.start);if(m.length===0&&!s.allowEmpty){c("Save skipped: no timestamps to save");return}zi(o,m).then(()=>c(`Successfully saved ${m.length} timestamps for ${o} to IndexedDB`)).catch(h=>c(`Failed to save timestamps for ${o} to IndexedDB:`,h,"error")),nn({type:"timestamps_updated",videoId:o,action:"saved"})}function _t(o,s,m,h){if(!o||ye)return;let x={guid:s,start:m,comment:h};c(`Saving timestamp: guid=${s}, start=${m}, comment="${h}"`),Bo(o,x).catch(E=>c(`Failed to save timestamp ${s}:`,E,"error")),nn({type:"timestamps_updated",videoId:o,action:"saved"})}function Tr(o,s){!o||ye||(c(`Deleting timestamp: guid=${s}`),Ho(o,s).catch(m=>c(`Failed to delete timestamp ${s}:`,m,"error")),nn({type:"timestamps_updated",videoId:o,action:"saved"}))}async function ro(o){if(!a||a.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let s=Se;if(!s)return;c(`Exporting timestamps for video ID: ${s}`);let m=ui(),h=Math.max(Ct(),0),x=Wt();if(o==="json"){let E=new Blob([JSON.stringify(m,null,2)],{type:"application/json"}),g=URL.createObjectURL(E),w=document.createElement("a");w.href=g,w.download=`timestamps-${s}-${x}.json`,w.click(),URL.revokeObjectURL(g)}else if(o==="text"){let E=m.map(P=>{let _=kt(P.start,h),G=`${P.comment} <!-- guid:${P.guid} -->`.trimStart();return`${_} ${G}`}).join(`
`),g=new Blob([E],{type:"text/plain"}),w=URL.createObjectURL(g),z=document.createElement("a");z.href=w,z.download=`timestamps-${s}-${x}.txt`,z.click(),URL.revokeObjectURL(w)}}function pi(o){if(!n||!a){c("Timekeeper error:",o,"error");return}At();let s=document.createElement("li");s.textContent=o,s.classList.add("ytls-error-message"),s.style.color="#ff6b6b",s.style.fontWeight="bold",s.style.padding="8px",s.style.background="rgba(255, 0, 0, 0.1)",a.appendChild(s),ze()}function ao(){document.querySelectorAll(".ytls-marker").forEach(o=>o.remove())}function Ut(){if(!n||!document.body.contains(n))return;let o=n.getBoundingClientRect(),s=document.documentElement.clientWidth,m=document.documentElement.clientHeight,h=o.width,x=o.height;if(o.left<0&&(n.style.left="0",n.style.right="auto"),o.right>s){let E=Math.max(0,s-h);n.style.left=`${E}px`,n.style.right="auto"}if(o.top<0&&(n.style.top="0",n.style.bottom="auto"),o.bottom>m){let E=Math.max(0,m-x);n.style.top=`${E}px`,n.style.bottom="auto"}}function Er(){if(An&&(document.removeEventListener("mousemove",An),An=null),$n&&(document.removeEventListener("mouseup",$n),$n=null),an&&(document.removeEventListener("keydown",an),an=null),Bn&&(window.removeEventListener("resize",Bn),Bn=null),sn&&(document.removeEventListener("pointerdown",sn,!0),sn=null),ln&&(document.removeEventListener("pointerup",ln,!0),ln=null),rt){try{rt.disconnect()}catch{}rt=null}if(at){try{at.disconnect()}catch{}at=null}let o=se();o&&(Hn&&(o.removeEventListener("timeupdate",Hn),Hn=null),zn&&(o.removeEventListener("pause",zn),zn=null),Pn&&(o.removeEventListener("play",Pn),Pn=null),On&&(o.removeEventListener("seeking",On),On=null))}function kr(){ao(),Dt.forEach(s=>clearTimeout(s)),Dt.clear(),rn&&(clearTimeout(rn),rn=null),pe&&(clearInterval(pe),pe=null),ot&&(clearTimeout(ot),ot=null),Er();try{Fe.close()}catch{}if(Y&&Y.parentNode===document.body&&document.body.removeChild(Y),Y=null,In=null,Dn=!1,Se=null,rt){try{rt.disconnect()}catch{}rt=null}if(at){try{at.disconnect()}catch{}at=null}n&&n.parentNode&&n.remove();let o=document.getElementById("ytls-header-button");o&&o.parentNode&&o.remove(),wt=null,Cn=!1,Ne=null,At(),n=null,f=null,a=null,b=null,y=null,T=null,I=null,me=null}async function Sr(){let o=hi();if(!o)return me=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let s=await Ze();if(!ue(s)){let m=Oe(s),h=m.length?` Missing methods: ${m.join(", ")}.`:"",x=s?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return me=null,{ok:!1,message:`${x}${h} Try refreshing once playback is ready.`}}return me=s,{ok:!0,player:s,videoId:o}}async function so(){if(!n||!a)return;let o=a.scrollTop,s=!0,m=()=>{if(!a||!s)return;let h=Math.max(0,a.scrollHeight-a.clientHeight);a.scrollTop=Math.min(o,h)};try{let h=await Sr();if(!h.ok){pi(h.message),At(),ze();return}let{videoId:x}=h,E=[];try{let g=await zo(x);g?(E=g.map(w=>({...w,guid:w.guid||crypto.randomUUID()})),c(`Loaded ${E.length} timestamps from IndexedDB for ${x}`)):c(`No timestamps found in IndexedDB for ${x}`)}catch(g){c(`Failed to load timestamps from IndexedDB for ${x}:`,g,"error"),pi("Failed to load timestamps from IndexedDB. Try refreshing the page."),ze();return}if(E.length>0){E.sort((_,G)=>_.start-G.start),At(),mi();let g=document.createDocumentFragment();E.forEach(_=>{let ne=pn(_.start,_.comment,!0,_.guid,!1).__ytls_li;ne&&g.appendChild(ne)}),n&&n.classList.contains("ytls-zoom-in")&&Te!=null?(c("Deferring timestamp DOM append until show animation completes"),bt=g,mt||(mt=new Promise(_=>{Ge=_})),await mt):a&&(a.appendChild(g),st(),ze(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let z=W(),P=z?Math.floor(z.getCurrentTime()):Ct();Number.isFinite(P)&&(Bt(P,!1),s=!1)}else At(),di("No timestamps for this video"),ze(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(h){c("Unexpected error while loading timestamps:",h,"error"),pi("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{mt&&await mt,requestAnimationFrame(m),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),a&&!a.querySelector(".ytls-error-message")&&mn()}}function hi(){let s=new URLSearchParams(location.search).get("v");if(s)return s;let m=document.querySelector('meta[itemprop="identifier"]');return m?.content?m.content:null}function Lr(){let o=se();if(!o)return;let s=()=>{if(!a)return;let g=W(),w=g?Math.floor(g.getCurrentTime()):0;if(!Number.isFinite(w))return;let z=Un(w);fn(z,!1)},m=g=>{try{let w=new URL(window.location.href);g!==null&&Number.isFinite(g)?w.searchParams.set("t",`${Math.floor(g)}s`):w.searchParams.delete("t"),window.history.replaceState({},"",w.toString())}catch{}},h=()=>{let g=W(),w=g?Math.floor(g.getCurrentTime()):NaN;if(Number.isFinite(w)){m(w);try{Bt(w,!0)}catch(z){c("Failed to highlight nearest timestamp on pause:",z,"warn")}}},x=()=>{m(null);try{let g=W(),w=g?Math.floor(g.getCurrentTime()):NaN;Number.isFinite(w)&&Bt(w,!0)}catch(g){c("Failed to highlight nearest timestamp on play:",g,"warn")}},E=()=>{let g=se();if(!g)return;let w=W(),z=w?Math.floor(w.getCurrentTime()):0;if(!Number.isFinite(z))return;g.paused&&m(z);let P=Un(z);fn(P,!0)};Hn=s,zn=h,Pn=x,On=E,o.addEventListener("timeupdate",s),o.addEventListener("pause",h),o.addEventListener("play",x),o.addEventListener("seeking",E)}async function lo(){let o={},s=await Hi("timestamps_v2"),m=new Map;for(let E of s){let g=E;m.has(g.video_id)||m.set(g.video_id,[]),m.get(g.video_id).push({guid:g.guid,start:g.start,comment:g.comment})}for(let[E,g]of m)o[`ytls-${E}`]={video_id:E,timestamps:g.sort((w,z)=>w.start-z.start)};return{json:JSON.stringify(o,null,2),filename:"timekeeper-data.json",totalVideos:m.size,totalTimestamps:s.length}}async function Mr(){try{let{json:o,filename:s,totalVideos:m,totalTimestamps:h}=await lo(),x=new Blob([o],{type:"application/json"}),E=URL.createObjectURL(x),g=document.createElement("a");g.href=E,g.download=s,g.click(),URL.revokeObjectURL(E),c(`Exported ${m} videos with ${h} timestamps`)}catch(o){throw c("Failed to export data:",o,"error"),o}}async function Dr(){let o=await Hi("timestamps_v2");if(!Array.isArray(o)||o.length===0){let P=`Tag,Timestamp,URL
`,_=`timestamps-${Wt()}.csv`;return{csv:P,filename:_,totalVideos:0,totalTimestamps:0}}let s=new Map;for(let P of o)s.has(P.video_id)||s.set(P.video_id,[]),s.get(P.video_id).push({start:P.start,comment:P.comment});let m=[];m.push("Tag,Timestamp,URL");let h=0,x=P=>`"${String(P).replace(/"/g,'""')}"`,E=P=>{let _=Math.floor(P/3600),G=Math.floor(P%3600/60),ne=String(P%60).padStart(2,"0");return`${String(_).padStart(2,"0")}:${String(G).padStart(2,"0")}:${ne}`},g=Array.from(s.keys()).sort();for(let P of g){let _=s.get(P).sort((G,ne)=>G.start-ne.start);for(let G of _){let ne=G.comment,Le=E(G.start),ve=Si(G.start,`https://www.youtube.com/watch?v=${P}`);m.push([x(ne),x(Le),x(ve)].join(",")),h++}}let w=m.join(`
`),z=`timestamps-${Wt()}.csv`;return{csv:w,filename:z,totalVideos:s.size,totalTimestamps:h}}async function Ir(){try{let{csv:o,filename:s,totalVideos:m,totalTimestamps:h}=await Dr(),x=new Blob([o],{type:"text/csv;charset=utf-8;"}),E=URL.createObjectURL(x),g=document.createElement("a");g.href=E,g.download=s,g.click(),URL.revokeObjectURL(E),c(`Exported ${m} videos with ${h} timestamps (CSV)`)}catch(o){throw c("Failed to export CSV data:",o,"error"),o}}function co(){if(!n)return;let o=n.style.display!=="none";Jt("uiVisible",o).catch(s=>c(`Failed to save UI visibility state: ${s}`,"error"))}function xt(o){let s=typeof o=="boolean"?o:!!n&&n.style.display!=="none",m=document.getElementById("ytls-header-button");m instanceof HTMLButtonElement&&m.setAttribute("aria-pressed",String(s)),wt&&!Cn&&wt.src!==S&&(wt.src=S)}async function Cr(){if(!n)return;let s=await Qn("uiVisible");typeof s=="boolean"?(s?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",xt(s)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),xt(!0))}function gi(o){if(!n){c("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(c("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(x=>{x!==n&&x.remove()}),document.body.appendChild(n));let s=document.querySelectorAll("#ytls-pane");s.length>1&&(c(`ERROR: Multiple panes detected in togglePaneVisibility (${s.length}), cleaning up`),s.forEach(x=>{x!==n&&x.remove()})),ot&&(clearTimeout(ot),ot=null);let m=n.style.display==="none";(typeof o=="boolean"?o:m)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),xt(!0),co(),ae(),Te&&(clearTimeout(Te),Te=null),Te=setTimeout(()=>{C(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),Z(!0);try{let x=W(),E=x?Math.floor(x.getCurrentTime()):NaN;Number.isFinite(E)&&Bt(E,!0)}catch(x){c("Failed to scroll to nearest timestamp after toggle:",x,"warn")}Te=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),xt(!1),R())}function uo(o){if(!a){c("UI is not initialized; cannot import timestamps.","warn");return}let s=!1;try{let m=JSON.parse(o),h=null;if(Array.isArray(m))h=m;else if(typeof m=="object"&&m!==null){let x=Se;if(x){let E=`timekeeper-${x}`;m[E]&&Array.isArray(m[E].timestamps)&&(h=m[E].timestamps,c(`Found timestamps for current video (${x}) in export format`,"info"))}if(!h){let E=Object.keys(m).filter(g=>g.startsWith("ytls-"));if(E.length===1&&Array.isArray(m[E[0]].timestamps)){h=m[E[0]].timestamps;let g=m[E[0]].video_id;c(`Found timestamps for video ${g} in export format`,"info")}}}h&&Array.isArray(h)?h.every(E=>typeof E.start=="number"&&typeof E.comment=="string")?(h.forEach(E=>{if(E.guid){let g=ge().find(w=>w.dataset.guid===E.guid);if(g){let w=g.querySelector("input");w&&(w.value=E.comment)}else pn(E.start,E.comment,!1,E.guid)}else pn(E.start,E.comment,!1,crypto.randomUUID())}),s=!0):c("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):c("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!s){let m=o.split(`
`).map(h=>h.trim()).filter(h=>h);if(m.length>0){let h=!1;m.forEach(x=>{let E=x.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(E){h=!0;let g=parseInt(E[1])||0,w=parseInt(E[2]),z=parseInt(E[3]),P=g*3600+w*60+z,_=E[4]?E[4].trim():"",G=null,ne=_,Le=_.match(/<!--\s*guid:([^>]+?)\s*-->/);Le&&(G=Le[1].trim(),ne=_.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let ve;if(G&&(ve=ge().find(he=>he.dataset.guid===G)),!ve&&!G&&(ve=ge().find(he=>{if(he.dataset.guid)return!1;let Xe=he.querySelector("a[data-time]")?.dataset.time;if(!Xe)return!1;let je=Number.parseInt(Xe,10);return Number.isFinite(je)&&je===P})),ve){let he=ve.querySelector("input");he&&(he.value=ne)}else pn(P,ne,!1,G||crypto.randomUUID())}}),h&&(s=!0)}}s?(c("Timestamps changed: Imported timestamps from file/clipboard"),st(),jn(Se),ze(),Gn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Ar(){if(ci){c("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){ci=!0;try{let h=function(){if(ye||$t)return;let d=se(),u=W();if(!d&&!u)return;let p=u?u.getCurrentTime():0,v=Number.isFinite(p)?Math.max(0,Math.floor(p)):Math.max(0,Ct()),D=Math.floor(v/3600),O=Math.floor(v/60)%60,N=v%60,{isLive:j}=u?u.getVideoData()||{isLive:!1}:{isLive:!1},q=u?wr(u):!1,oe=a?ge().map(ie=>{let Ee=ie.querySelector("a[data-time]");return Ee?parseFloat(Ee.getAttribute("data-time")??"0"):0}):[],De="";if(oe.length>0)if(j){let ie=Math.max(1,v/60),Ee=oe.filter(Ie=>Ie<=v);if(Ee.length>0){let Ie=(Ee.length/ie).toFixed(2);parseFloat(Ie)>0&&(De=` (${Ie}/min)`)}}else{let ie=u?u.getDuration():0,Ee=Number.isFinite(ie)&&ie>0?ie:d&&Number.isFinite(d.duration)&&d.duration>0?d.duration:0,Ie=Math.max(1,Ee/60),pt=(oe.length/Ie).toFixed(1);parseFloat(pt)>0&&(De=` (${pt}/min)`)}y.textContent=`\u23F3${D?D+":"+String(O).padStart(2,"0"):O}:${String(N).padStart(2,"0")}${De}`,y.style.color=q?"#ff4d4f":"",oe.length>0&&Bt(v,!1)},he=function(d,u,p){let v=document.createElement("button");return v.textContent=d,lt(v,u),v.classList.add("ytls-settings-modal-button"),v.onclick=p,v},ft=function(d="general"){if(Y&&Y.parentNode===document.body){let He=document.getElementById("ytls-save-modal"),Et=document.getElementById("ytls-load-modal"),ht=document.getElementById("ytls-delete-all-modal");He&&document.body.contains(He)&&document.body.removeChild(He),Et&&document.body.contains(Et)&&document.body.removeChild(Et),ht&&document.body.contains(ht)&&document.body.removeChild(ht),Y.classList.remove("ytls-fade-in"),Y.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Y)&&document.body.removeChild(Y),Y=null,document.removeEventListener("click",je,!0),document.removeEventListener("keydown",Xe)},300);return}Y=document.createElement("div"),Y.id="ytls-settings-modal",Y.classList.remove("ytls-fade-out"),Y.classList.add("ytls-fade-in");let u=document.createElement("div");u.className="ytls-modal-header";let p=document.createElement("div");p.id="ytls-settings-nav";let v=document.createElement("button");v.className="ytls-modal-close-button",v.textContent="\u2715",v.onclick=()=>{if(Y&&Y.parentNode===document.body){let He=document.getElementById("ytls-save-modal"),Et=document.getElementById("ytls-load-modal"),ht=document.getElementById("ytls-delete-all-modal");He&&document.body.contains(He)&&document.body.removeChild(He),Et&&document.body.contains(Et)&&document.body.removeChild(Et),ht&&document.body.contains(ht)&&document.body.removeChild(ht),Y.classList.remove("ytls-fade-in"),Y.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Y)&&document.body.removeChild(Y),Y=null,document.removeEventListener("click",je,!0),document.removeEventListener("keydown",Xe)},300)}};let D=document.createElement("div");D.id="ytls-settings-content";let O=document.createElement("h3");O.className="ytls-section-heading",O.textContent="General",O.style.display="none";let N=document.createElement("div"),j=document.createElement("div");j.className="ytls-button-grid";function q(He){N.style.display=He==="general"?"block":"none",j.style.display=He==="drive"?"block":"none",oe.classList.toggle("active",He==="general"),ie.classList.toggle("active",He==="drive"),O.textContent=He==="general"?"General":"Google Drive"}let oe=document.createElement("button");oe.textContent="\u{1F6E0}\uFE0F";let De=document.createElement("span");De.className="ytls-tab-text",De.textContent=" General",oe.appendChild(De),lt(oe,"General settings"),oe.classList.add("ytls-settings-modal-button"),oe.onclick=()=>q("general");let ie=document.createElement("button");ie.textContent="\u2601\uFE0F";let Ee=document.createElement("span");Ee.className="ytls-tab-text",Ee.textContent=" Backup",ie.appendChild(Ee),lt(ie,"Google Drive sign-in and backup"),ie.classList.add("ytls-settings-modal-button"),ie.onclick=async()=>{K.isSignedIn&&await dr(),q("drive")},p.appendChild(oe),p.appendChild(ie),u.appendChild(p),u.appendChild(v),Y.appendChild(u),N.className="ytls-button-grid",N.appendChild(he("\u{1F4BE} Save","Save As...",Qe.onclick)),N.appendChild(he("\u{1F4C2} Load","Load",Me.onclick)),N.appendChild(he("\u{1F4E4} Export All","Export All Data",Re.onclick)),N.appendChild(he("\u{1F4E5} Import All","Import All Data",qe.onclick)),N.appendChild(he("\u{1F4C4} Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await Ir()}catch{alert("Failed to export CSV: Could not read from database.")}}));let Ie=he(K.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",K.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{K.isSignedIn?await ur():await lr(),Ie.textContent=K.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",lt(Ie,K.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),typeof be=="function"&&be()});j.appendChild(Ie);let pt=he(ct?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await hr(),pt.textContent=ct?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off",typeof be=="function"&&be()});j.appendChild(pt);let zt=he(`\u23F1\uFE0F Backup Interval: ${Ke}min`,"Set periodic backup interval (minutes)",async()=>{await gr(),zt.textContent=`\u23F1\uFE0F Backup Interval: ${Ke}min`,typeof be=="function"&&be()});j.appendChild(zt),j.appendChild(he("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await Ln(!1),typeof be=="function"&&be()}));let Ve=document.createElement("div");Ve.style.marginTop="15px",Ve.style.paddingTop="10px",Ve.style.borderTop="1px solid #555",Ve.style.fontSize="12px",Ve.style.color="#aaa";let Pt=document.createElement("div");Pt.style.marginBottom="8px",Pt.style.fontWeight="bold",Ve.appendChild(Pt),rr(Pt);let wi=document.createElement("div");wi.style.marginBottom="8px",ir(wi),Ve.appendChild(wi);let go=document.createElement("div");or(go),Ve.appendChild(go),j.appendChild(Ve),Ue(),Mn(),be(),D.appendChild(O),D.appendChild(N),D.appendChild(j),q(d),Y.appendChild(D),document.body.appendChild(Y),requestAnimationFrame(()=>{let He=Y.getBoundingClientRect(),ht=(window.innerHeight-He.height)/2;Y.style.top=`${Math.max(20,ht)}px`,Y.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",je,!0),document.addEventListener("keydown",Xe)},0)},Xe=function(d){if(d.key==="Escape"&&Y&&Y.parentNode===document.body){let u=document.getElementById("ytls-save-modal"),p=document.getElementById("ytls-load-modal"),v=document.getElementById("ytls-delete-all-modal");if(u||p||v)return;d.preventDefault(),u&&document.body.contains(u)&&document.body.removeChild(u),p&&document.body.contains(p)&&document.body.removeChild(p),v&&document.body.contains(v)&&document.body.removeChild(v),Y.classList.remove("ytls-fade-in"),Y.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Y)&&document.body.removeChild(Y),Y=null,document.removeEventListener("click",je,!0),document.removeEventListener("keydown",Xe)},300)}},je=function(d){if(In&&In.contains(d.target))return;let u=document.getElementById("ytls-save-modal"),p=document.getElementById("ytls-load-modal"),v=document.getElementById("ytls-delete-all-modal");u&&u.contains(d.target)||p&&p.contains(d.target)||v&&v.contains(d.target)||Y&&Y.contains(d.target)||(u&&document.body.contains(u)&&document.body.removeChild(u),p&&document.body.contains(p)&&document.body.removeChild(p),v&&document.body.contains(v)&&document.body.removeChild(v),Y&&Y.parentNode===document.body&&(Y.classList.remove("ytls-fade-in"),Y.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Y)&&document.body.removeChild(Y),Y=null,document.removeEventListener("click",je,!0),document.removeEventListener("keydown",Xe)},300)))},$e=function(){n&&(c("Loading window position from IndexedDB"),Qn("windowPosition").then(d=>{if(d&&typeof d.x=="number"&&typeof d.y=="number"){let p=d;n.style.left=`${p.x}px`,n.style.top=`${p.y}px`,n.style.right="auto",n.style.bottom="auto",typeof p.width=="number"&&p.width>0?n.style.width=`${p.width}px`:(n.style.width=`${Nt}px`,c(`No stored window width found, using default width ${Nt}px`)),typeof p.height=="number"&&p.height>0?n.style.height=`${p.height}px`:(n.style.height=`${Mt}px`,c(`No stored window height found, using default height ${Mt}px`));let v=Q();ee(v,p.x,p.y),c("Restored window position from IndexedDB:",Ne)}else c("No window position found in IndexedDB, applying default size and leaving default position"),n.style.width=`${Nt}px`,n.style.height=`${Mt}px`,Ne=null;Ut();let u=Q();u&&(u.width||u.height)&&ee(u),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(d=>{c("failed to load pane position from IndexedDB:",d,"warn"),Ut();let u=Q();u&&(u.width||u.height)&&(Ne={x:Math.max(0,Math.round(u.left)),y:0,width:Math.round(u.width),height:Math.round(u.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},Be=function(){if(!n)return;let d=Q();if(!d)return;let u={x:Math.max(0,Math.round(d.left)),y:Math.max(0,Math.round(d.top)),width:Math.round(d.width),height:Math.round(d.height)};if(Ne&&Ne.x===u.x&&Ne.y===u.y&&Ne.width===u.width&&Ne.height===u.height){c("Skipping window position save; position and size unchanged");return}Ne={...u},c(`Saving window position and size to IndexedDB: x=${u.x}, y=${u.y}, width=${u.width}, height=${u.height}`),Jt("windowPosition",u).catch(p=>c(`Failed to save window position: ${p}`,"error")),nn({type:"window_position_updated",position:u,timestamp:Date.now()})},Yn=function(d,u){d.addEventListener("dblclick",p=>{p.preventDefault(),p.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",Be(),vn())}),d.addEventListener("mousedown",p=>{p.preventDefault(),p.stopPropagation(),qt=!0,Ht=u,po=p.clientX,ho=p.clientY;let v=n.getBoundingClientRect();Vt=v.width,Yt=v.height,qn=v.left,Vn=v.top,u==="top-left"||u==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},vn=function(){if(n&&f&&b&&a){let d=n.getBoundingClientRect(),u=f.getBoundingClientRect(),p=b.getBoundingClientRect(),v=d.height-(u.height+p.height);a.style.maxHeight=v>0?v+"px":"0px",a.style.overflowY=v>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(d=>d.remove()),n=document.createElement("div"),f=document.createElement("div"),a=document.createElement("ul"),b=document.createElement("div"),y=document.createElement("span"),T=document.createElement("style"),I=document.createElement("span"),$=document.createElement("span"),$.classList.add("ytls-backup-indicator"),$.style.cursor="pointer",$.style.backgroundColor="#666",$.onclick=d=>{d.stopPropagation(),ft("drive")},a.addEventListener("mouseenter",()=>{Dn=!0,cn=!1}),a.addEventListener("mouseleave",()=>{if(Dn=!1,cn)return;let d=W(),u=d?Math.floor(d.getCurrentTime()):Ct();Bt(u,!1);let p=null;if(document.activeElement instanceof HTMLInputElement&&a.contains(document.activeElement)&&(p=document.activeElement.closest("li")?.dataset.guid??null),oo(),p){let D=ge().find(O=>O.dataset.guid===p)?.querySelector("input");if(D)try{D.focus({preventScroll:!0})}catch{}}}),Pe("li .ts-button","mouseenter",d=>{let u=d.target;u.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"},{base:a}),Pe("li .ts-button","mouseleave",d=>{let u=d.target;u.style.textShadow="none"},{base:a}),Pe("li .ts-delete","mouseenter",d=>{let u=d.target;u.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"},{base:a}),Pe("li","mouseenter",d=>{let u=d.target,p=u.querySelector(".indent-toggle");if(p){let v=u.querySelector('input[data-action="comment"]');if(v){let D=dn(v.value);p.textContent=D===1?"\u25C0":"\u25B6"}p.style.display="inline"}},{base:a}),Pe("li","mouseleave",d=>{let u=d.target,p=u.querySelector(".indent-toggle");p&&(p.style.display="none"),u.dataset.guid===It&&yr(u)&&oo()},{base:a}),Pe('[data-action="toggle-indent"]',"click",d=>{d.stopPropagation();let u=d.target,p=u.closest("li");if(!p)return;let v=p.querySelector('input[data-action="comment"]'),D=p.querySelector("a[data-time]");if(!v||!D)return;let O=dn(v.value),N=eo(v.value),j=O===0?1:0,q="";if(j===1){let Ie=ge().indexOf(p);q=br(Ie)}v.value=`${q}${N}`;let oe=u.querySelector(".indent-toggle");oe&&(oe.textContent=j===1?"\u25C0":"\u25B6"),st();let De=Number.parseInt(D.dataset.time??"0",10),ie=p.dataset.guid;ie&&_t(Se,ie,De,v.value)},{base:a}),Pe('[data-action="comment"]',"focusin",()=>{cn=!1},{base:a}),Pe('[data-action="comment"]',"focusout",d=>{let u=d.relatedTarget,p=Date.now()-Qi<250,v=!!u&&!!n&&n.contains(u);if(!p&&!v){cn=!0;let D=d.target;setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(D.focus({preventScroll:!0}),cn=!1)},0)}},{base:a}),Pe('[data-action="comment"]',"input",d=>{let u=d;if(u&&(u.isComposing||u.inputType==="insertCompositionText"))return;let p=d.target,v=p.closest("li");if(!v)return;let D=v.dataset.guid;if(!D)return;let O=Dt.get(D);O&&clearTimeout(O);let N=setTimeout(()=>{let j=v.querySelector("a[data-time]"),q=Number.parseInt(j?.dataset.time??"0",10);_t(Se,D,q,p.value),Dt.delete(D)},500);Dt.set(D,N)},{base:a}),Pe('[data-action="comment"]',"compositionend",d=>{let u=d.target,p=u.closest("li");if(!p)return;let v=p.dataset.guid;v&&setTimeout(()=>{let D=p.querySelector("a[data-time]"),O=Number.parseInt(D?.dataset.time??"0",10);_t(Se,v,O,u.value)},50)},{base:a}),Pe('[data-action="record"]',"click",d=>{let p=d.target.closest("li");if(!p)return;let v=p.querySelector("a[data-time]"),D=p.querySelector('input[data-action="comment"]'),O=p.dataset.guid;if(!v||!D||!O)return;let N=W(),j=N?Math.floor(N.getCurrentTime()):0;Number.isFinite(j)&&(c(`Timestamps changed: set to current playback time ${j}`),Nn(v,j),hn(),st(),_t(Se,O,j,D.value),It=O)},{base:a}),Pe('[data-action="delete"]',"click",d=>{let u=d.target;if(!u.closest("li"))return;let v=u.__deleteHandler;v&&v()},{base:a}),n.id="ytls-pane",f.id="ytls-pane-header",f.addEventListener("dblclick",d=>{let u=d.target instanceof HTMLElement?d.target:null;u&&(u.closest("a")||u.closest("button")||u.closest("#ytls-current-time")||u.closest(".ytls-version-display")||u.closest(".ytls-backup-indicator"))||(d.preventDefault(),gi(!1))});let o=d=>{try{d.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(d=>{n.addEventListener(d,o)}),n.addEventListener("keydown",d=>{try{d.stopPropagation()}catch{}}),n.addEventListener("keyup",d=>{try{d.stopPropagation()}catch{}}),n.addEventListener("focus",d=>{try{d.stopPropagation()}catch{}},!0),n.addEventListener("blur",d=>{try{d.stopPropagation()}catch{}},!0);let s=GM_info.script.version;I.textContent=`v${s}`,I.classList.add("ytls-version-display");let m=document.createElement("span");m.style.display="inline-flex",m.style.alignItems="center",m.style.gap="6px",m.appendChild(I),m.appendChild($),y.id="ytls-current-time",y.textContent="\u23F3",y.onclick=()=>{$t=!0;let d=W();d&&d.seekToLiveHead(),setTimeout(()=>{$t=!1},500)},h(),pe&&clearInterval(pe),pe=setInterval(h,1e3),b.id="ytls-buttons";let x=(d,u)=>()=>{d.classList.remove("ytls-fade-in"),d.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(d)&&document.body.removeChild(d),u&&u()},300)},E=d=>u=>{u.key==="Escape"&&(u.preventDefault(),u.stopPropagation(),d())},g=d=>{setTimeout(()=>{document.addEventListener("keydown",d)},0)},w=(d,u)=>p=>{d.contains(p.target)||u()},z=d=>{setTimeout(()=>{document.addEventListener("click",d,!0)},0)},Le=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!a||a.querySelector(".ytls-error-message")||ye)return;let d=typeof Rt<"u"?Rt:0,u=W(),p=u?Math.floor(u.getCurrentTime()+d):0;if(!Number.isFinite(p))return;let v=pn(p,"");v&&v.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>ft()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(d){if(!a||a.querySelector(".ytls-error-message")||ye){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let u=ui(),p=Math.max(Ct(),0);if(u.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let v=d.ctrlKey,D=u.map(O=>{let N=kt(O.start,p);return v?`${N} ${O.comment} <!-- guid:${O.guid} -->`.trimStart():`${N} ${O.comment}`}).join(`
`);navigator.clipboard.writeText(D).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(O=>{c("Failed to copy timestamps: ",O,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!a||a.querySelector(".ytls-error-message")||ye)return;if(ge().length===0){alert("No timestamps available to offset.");return}let u=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(u===null)return;let p=u.trim();if(p.length===0)return;let v=Number.parseInt(p,10);if(!Number.isFinite(v)){alert("Please enter a valid integer number of seconds.");return}v!==0&&no(v,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let d=hi();if(!d){alert("Unable to determine current video ID.");return}let u=document.createElement("div");u.id="ytls-delete-all-modal",u.classList.remove("ytls-fade-out"),u.classList.add("ytls-fade-in");let p=document.createElement("p");p.textContent="Hold the button to delete all timestamps for:",p.style.marginBottom="10px";let v=document.createElement("p");v.textContent=d,v.style.fontFamily="monospace",v.style.fontSize="12px",v.style.marginBottom="15px",v.style.color="#aaa";let D=document.createElement("button");D.classList.add("ytls-save-modal-button"),D.style.background="#d32f2f",D.style.position="relative",D.style.overflow="hidden";let O=null,N=0,j=null,q=document.createElement("div");q.style.position="absolute",q.style.left="0",q.style.top="0",q.style.height="100%",q.style.width="0%",q.style.background="#ff6b6b",q.style.transition="none",q.style.pointerEvents="none",D.appendChild(q);let oe=document.createElement("span");oe.textContent="Hold to Delete All",oe.style.position="relative",oe.style.zIndex="1",D.appendChild(oe);let De=()=>{if(!N)return;let Ve=Date.now()-N,Pt=Math.min(Ve/5e3*100,100);q.style.width=`${Pt}%`,Pt<100&&(j=requestAnimationFrame(De))},ie=()=>{O&&(clearTimeout(O),O=null),j&&(cancelAnimationFrame(j),j=null),N=0,q.style.width="0%",oe.textContent="Hold to Delete All"};D.onmousedown=()=>{N=Date.now(),oe.textContent="Deleting...",j=requestAnimationFrame(De),O=setTimeout(async()=>{ie(),u.classList.remove("ytls-fade-in"),u.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(u)&&document.body.removeChild(u);try{await Po(d),yi()}catch(Ve){c("Failed to delete all timestamps:",Ve,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},D.onmouseup=ie,D.onmouseleave=ie;let Ee=null,Ie=null,pt=x(u,()=>{ie(),Ee&&document.removeEventListener("keydown",Ee),Ie&&document.removeEventListener("click",Ie,!0)});Ee=E(pt),Ie=w(u,pt);let zt=document.createElement("button");zt.textContent="Cancel",zt.classList.add("ytls-save-modal-cancel-button"),zt.onclick=pt,u.appendChild(p),u.appendChild(v),u.appendChild(D),u.appendChild(zt),document.body.appendChild(u),g(Ee),z(Ie)}}],ve=Eo();Le.forEach(d=>{let u=document.createElement("button");if(u.textContent=d.label,lt(u,d.title),u.classList.add("ytls-main-button"),d.label==="\u{1F423}"&&ve){let p=document.createElement("span");p.textContent=ve,p.classList.add("ytls-holiday-emoji"),u.appendChild(p)}d.label==="\u{1F4CB}"?u.onclick=function(p){d.action.call(this,p)}:u.onclick=d.action,d.label==="\u2699\uFE0F"&&(In=u),b.appendChild(u)});let Qe=document.createElement("button");Qe.textContent="\u{1F4BE} Save",Qe.classList.add("ytls-file-operation-button"),Qe.onclick=()=>{let d=document.createElement("div");d.id="ytls-save-modal",d.classList.remove("ytls-fade-out"),d.classList.add("ytls-fade-in");let u=document.createElement("p");u.textContent="Save as:";let p=null,v=null,D=x(d,()=>{p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0)});p=E(D),v=w(d,D);let O=document.createElement("button");O.textContent="JSON",O.classList.add("ytls-save-modal-button"),O.onclick=()=>{p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0),x(d,()=>ro("json"))()};let N=document.createElement("button");N.textContent="Plain Text",N.classList.add("ytls-save-modal-button"),N.onclick=()=>{p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0),x(d,()=>ro("text"))()};let j=document.createElement("button");j.textContent="Cancel",j.classList.add("ytls-save-modal-cancel-button"),j.onclick=D,d.appendChild(u),d.appendChild(O),d.appendChild(N),d.appendChild(j),document.body.appendChild(d),g(p),z(v)};let Me=document.createElement("button");Me.textContent="\u{1F4C2} Load",Me.classList.add("ytls-file-operation-button"),Me.onclick=()=>{let d=document.createElement("div");d.id="ytls-load-modal",d.classList.remove("ytls-fade-out"),d.classList.add("ytls-fade-in");let u=document.createElement("p");u.textContent="Load from:";let p=null,v=null,D=x(d,()=>{p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0)});p=E(D),v=w(d,D);let O=document.createElement("button");O.textContent="File",O.classList.add("ytls-save-modal-button"),O.onclick=()=>{let q=document.createElement("input");q.type="file",q.accept=".json,.txt",q.classList.add("ytls-hidden-file-input"),q.onchange=oe=>{let De=oe.target.files?.[0];if(!De)return;p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0),D();let ie=new FileReader;ie.onload=()=>{let Ee=String(ie.result).trim();uo(Ee)},ie.readAsText(De)},q.click()};let N=document.createElement("button");N.textContent="Clipboard",N.classList.add("ytls-save-modal-button"),N.onclick=async()=>{p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0),x(d,async()=>{try{let q=await navigator.clipboard.readText();q?uo(q.trim()):alert("Clipboard is empty.")}catch(q){c("Failed to read from clipboard: ",q,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let j=document.createElement("button");j.textContent="Cancel",j.classList.add("ytls-save-modal-cancel-button"),j.onclick=D,d.appendChild(u),d.appendChild(O),d.appendChild(N),d.appendChild(j),document.body.appendChild(d),g(p),z(v)};let Re=document.createElement("button");Re.textContent="\u{1F4E4} Export",Re.classList.add("ytls-file-operation-button"),Re.onclick=async()=>{try{await Mr()}catch{alert("Failed to export data: Could not read from database.")}};let qe=document.createElement("button");qe.textContent="\u{1F4E5} Import",qe.classList.add("ytls-file-operation-button"),qe.onclick=()=>{let d=document.createElement("input");d.type="file",d.accept=".json",d.classList.add("ytls-hidden-file-input"),d.onchange=u=>{let p=u.target.files?.[0];if(!p)return;let v=new FileReader;v.onload=()=>{try{let D=JSON.parse(String(v.result)),O=[];for(let N in D)if(Object.prototype.hasOwnProperty.call(D,N)&&N.startsWith("ytls-")){let j=N.substring(5),q=D[N];if(q&&typeof q.video_id=="string"&&Array.isArray(q.timestamps)){let oe=q.timestamps.map(ie=>({...ie,guid:ie.guid||crypto.randomUUID()})),De=zi(j,oe).then(()=>c(`Imported ${j} to IndexedDB`)).catch(ie=>c(`Failed to import ${j} to IndexedDB:`,ie,"error"));O.push(De)}else c(`Skipping key ${N} during import due to unexpected data format.`,"warn")}Promise.all(O).then(()=>{yi()}).catch(N=>{alert("An error occurred during import to IndexedDB. Check console for details."),c("Overall import error:",N,"error")})}catch(D){alert(`Failed to import data. Please ensure the file is in the correct format.
`+D.message),c("Import error:",D,"error")}},v.readAsText(p)},d.click()},T.textContent=Oo,a.onclick=d=>{io(d)},a.ontouchstart=d=>{io(d)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",$e(),setTimeout(()=>Ut(),10);let _e=!1,Tt,gn,yn=!1;n.addEventListener("mousedown",d=>{let u=d.target;u instanceof Element&&(u instanceof HTMLInputElement||u instanceof HTMLTextAreaElement||u!==f&&!f.contains(u)&&window.getComputedStyle(u).cursor==="pointer"||(_e=!0,yn=!1,Tt=d.clientX-n.getBoundingClientRect().left,gn=d.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",An=d=>{if(!_e)return;yn=!0;let u=d.clientX-Tt,p=d.clientY-gn,v=n.getBoundingClientRect(),D=v.width,O=v.height,N=document.documentElement.clientWidth,j=document.documentElement.clientHeight;u=Math.max(0,Math.min(u,N-D)),p=Math.max(0,Math.min(p,j-O)),n.style.left=`${u}px`,n.style.top=`${p}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",$n=()=>{if(!_e)return;_e=!1;let d=yn;setTimeout(()=>{yn=!1},50),Ut(),setTimeout(()=>{d&&Be()},200)}),n.addEventListener("dragstart",d=>d.preventDefault());let Gt=document.createElement("div"),jt=document.createElement("div"),vi=document.createElement("div"),bi=document.createElement("div");Gt.id="ytls-resize-tl",jt.id="ytls-resize-tr",vi.id="ytls-resize-bl",bi.id="ytls-resize-br";let qt=!1,po=0,ho=0,Vt=0,Yt=0,qn=0,Vn=0,Ht=null;Yn(Gt,"top-left"),Yn(jt,"top-right"),Yn(vi,"bottom-left"),Yn(bi,"bottom-right"),document.addEventListener("mousemove",d=>{if(!qt||!n||!Ht)return;let u=d.clientX-po,p=d.clientY-ho,v=Vt,D=Yt,O=qn,N=Vn,j=document.documentElement.clientWidth,q=document.documentElement.clientHeight;Ht==="bottom-right"?(v=Math.max(200,Math.min(800,Vt+u)),D=Math.max(250,Math.min(q,Yt+p))):Ht==="top-left"?(v=Math.max(200,Math.min(800,Vt-u)),O=qn+u,D=Math.max(250,Math.min(q,Yt-p)),N=Vn+p):Ht==="top-right"?(v=Math.max(200,Math.min(800,Vt+u)),D=Math.max(250,Math.min(q,Yt-p)),N=Vn+p):Ht==="bottom-left"&&(v=Math.max(200,Math.min(800,Vt-u)),O=qn+u,D=Math.max(250,Math.min(q,Yt+p))),O=Math.max(0,Math.min(O,j-v)),N=Math.max(0,Math.min(N,q-D)),n.style.width=`${v}px`,n.style.height=`${D}px`,n.style.left=`${O}px`,n.style.top=`${N}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{qt&&(qt=!1,Ht=null,document.body.style.cursor="",Z(!0))});let Wn=null;window.addEventListener("resize",Bn=()=>{Wn&&clearTimeout(Wn),Wn=setTimeout(()=>{Z(!0),Wn=null},200)}),f.appendChild(y),f.appendChild(m);let Kn=document.createElement("div");if(Kn.id="ytls-content",Kn.append(a),Kn.append(b),n.append(f,Kn,T,Gt,jt,vi,bi),n.addEventListener("mousemove",d=>{try{if(_e||qt)return;let u=n.getBoundingClientRect(),p=20,v=d.clientX,D=d.clientY,O=v-u.left<=p,N=u.right-v<=p,j=D-u.top<=p,q=u.bottom-D<=p,oe="";j&&O||q&&N?oe="nwse-resize":j&&N||q&&O?oe="nesw-resize":oe="",document.body.style.cursor=oe}catch{}}),n.addEventListener("mouseleave",()=>{!qt&&!_e&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=vn,setTimeout(()=>{if(vn(),n&&f&&b&&a){let d=40,u=ge();if(u.length>0)d=u[0].offsetHeight;else{let p=document.createElement("li");p.style.visibility="hidden",p.style.position="absolute",p.textContent="00:00 Example",a.appendChild(p),d=p.offsetHeight,a.removeChild(p)}k=f.offsetHeight+b.offsetHeight+d,n.style.minHeight=k+"px"}},0),window.addEventListener("resize",vn),at){try{at.disconnect()}catch{}at=null}at=new ResizeObserver(vn),at.observe(n),sn||document.addEventListener("pointerdown",sn=()=>{Qi=Date.now()},!0),ln||document.addEventListener("pointerup",ln=()=>{},!0)}finally{ci=!1}}}async function $r(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(m=>{m!==n&&(c("Removing duplicate pane element from DOM"),m.remove())}),document.body.contains(n)){c("Pane already in DOM, skipping append");return}await Cr(),typeof Vi=="function"&&Vi(lo),typeof ri=="function"&&ri(Jt),typeof ai=="function"&&ai(Qn),typeof qi=="function"&&qi($),await Yi(),await fr(),await tn(),typeof li=="function"&&li();let s=document.querySelectorAll("#ytls-pane");if(s.length>0&&(c(`WARNING: Found ${s.length} existing pane(s) in DOM, removing all`),s.forEach(m=>m.remove())),document.body.contains(n)){c("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(n),c("Pane successfully appended to DOM"),ae(),Te&&(clearTimeout(Te),Te=null),Te=setTimeout(()=>{C(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),Z(!0),Te=null},450),rt){try{rt.disconnect()}catch{}rt=null}rt=new MutationObserver(()=>{let m=document.querySelectorAll("#ytls-pane");m.length>1&&(c(`CRITICAL: Multiple panes detected (${m.length}), removing duplicates`),m.forEach((h,x)=>{(x>0||n&&h!==n)&&h.remove()}))}),rt.observe(document.body,{childList:!0,subtree:!0})}function mo(o=0){if(document.getElementById("ytls-header-button")){xt();return}let s=document.querySelector("#logo");if(!s||!s.parentElement){o<10&&setTimeout(()=>mo(o+1),300);return}let m=document.createElement("button");m.id="ytls-header-button",m.type="button",m.className="ytls-header-button",lt(m,"Toggle Timekeeper UI"),m.setAttribute("aria-label","Toggle Timekeeper UI");let h=document.createElement("img");h.src=S,h.alt="",h.decoding="async",m.appendChild(h),wt=h,m.addEventListener("mouseenter",()=>{wt&&(Cn=!0,wt.src=A)}),m.addEventListener("mouseleave",()=>{wt&&(Cn=!1,xt())}),m.addEventListener("click",()=>{n&&!document.body.contains(n)&&(c("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),gi()}),s.insertAdjacentElement("afterend",m),xt(),c("Timekeeper header button added next to YouTube logo")}function fo(){if(V)return;V=!0;let o=history.pushState,s=history.replaceState;function m(){try{let h=new Event("locationchange");window.dispatchEvent(h)}catch{}}history.pushState=function(){let h=o.apply(this,arguments);return m(),h},history.replaceState=function(){let h=s.apply(this,arguments);return m(),h},window.addEventListener("popstate",m),window.addEventListener("locationchange",()=>{window.location.href!==U&&c("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function yi(){if(!l()){kr();return}U=window.location.href,document.querySelectorAll("#ytls-pane").forEach((s,m)=>{(m>0||n&&s!==n)&&s.remove()}),await H(),await Ar(),Se=hi();let o=document.title;c("Page Title:",o),c("Video ID:",Se),c("Current URL:",window.location.href),fi(!0),At(),ze(),await so(),ze(),fi(!1),c("Timestamps loaded and UI unlocked for video:",Se),await $r(),mo(),Lr()}fo(),window.addEventListener("yt-navigate-start",()=>{c("Navigation started (yt-navigate-start event fired)"),l()&&n&&a&&(c("Locking UI and showing loading state for navigation"),fi(!0))}),an=o=>{o.ctrlKey&&o.altKey&&o.shiftKey&&(o.key==="T"||o.key==="t")&&(o.preventDefault(),gi(),c("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",an),window.addEventListener("yt-navigate-finish",()=>{c("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==U?yi():c("Navigation finished but URL already handled, skipping.")}),fo(),c("Timekeeper initialized and waiting for navigation events")})();})();

