// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.3.8.722
// @description  Enhanced timestamp tool for YouTube videos with DVR/rewind enablement for live streams
// @author       Silent Shout
// @match        https://www.youtube.com/*
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/client/assets/Kamo_64px_Indexed.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @connect      *
// @homepageURL  https://github.com/KamoTimestamps/timekeeper
// @supportURL   https://github.com/KamoTimestamps/timekeeper/issues
// @downloadURL  https://raw.githubusercontent.com/KamoTimestamps/timekeeper/devel/timekeeper.devel.user.js
// @updateURL    https://raw.githubusercontent.com/KamoTimestamps/timekeeper/devel/timekeeper.devel.user.js
// @license MIT
// ==/UserScript==

(()=>{var Sd=Object.defineProperty;var xd=(e,t)=>{for(var n in t)Sd(e,n,{get:t[n],enumerable:!0})};var To=class extends Error{},Qe=(e,t)=>{throw new To(`${e||"value"}: expected ${t}`)};function Et(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(o){if(o instanceof To)return{success:!1,error:o};throw o}},array:()=>kd(t)};return t}var As=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function W(){return Et((e,t)=>typeof e=="string"?e:Qe(t,"string"))}function _t(){return Et((e,t)=>typeof e=="boolean"?e:Qe(t,"boolean"))}function Ce(e={}){return Et((t,n)=>typeof t!="number"||Number.isNaN(t)?Qe(n,"number"):(e.finite&&!Number.isFinite(t)&&Qe(n,"finite number"),e.int&&!Number.isInteger(t)&&Qe(n,"integer"),e.nonnegative&&t<0&&Qe(n,"number >= 0"),e.positive&&t<=0&&Qe(n,"number > 0"),e.min!==void 0&&t<e.min&&Qe(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&Qe(n,`number <= ${e.max}`),t))}function be(e){return Et((t,n)=>t===void 0?void 0:e.run(t,n))}function Ze(e){return Et((t,n)=>t===null?null:e.run(t,n))}function Je(e,t){return Et((n,o)=>{try{return e.run(n,o)}catch(a){if(a instanceof To)return t;throw a}})}function kd(e){return Et((t,n)=>Array.isArray(t)?t.map((o,a)=>e.run(o,`${n}[${a}]`)):Qe(n,"array"))}function Td(e){return Et((t,n)=>{if(!As(t))return Qe(n,"object");let o={};for(let a of Object.keys(t))o[a]=e.run(t[a],n?`${n}.${a}`:a);return o})}function Se(e){let t=Et((n,o)=>{if(!As(n))return Qe(o,"object");let a={};for(let r of Object.keys(e)){let c=e[r].run(n[r],o?`${o}.${r}`:r);c!==void 0&&(a[r]=c)}return a});return Object.assign(t,{extend:n=>Se({...e,...n}),partial:()=>{let n={};for(let o of Object.keys(e))n[o]=be(e[o]);return Se(n)}})}var Ad=Et((e,t)=>typeof e=="string"&&e.length>0?e:Qe(t,"non-empty string")),Lr=Se({guid:Ad,start:Ce({finite:!0,nonnegative:!0}),comment:W(),write_counter:be(Ce({int:!0,positive:!0})),deleted_at:Je(be(Ce()),void 0)}),Ao=Lr.array(),hn=Lr.extend({video_id:W(),device_id:be(W())}),Es=Se({x:Ce({finite:!0}),y:Ce({finite:!0}),width:be(Ce({finite:!0,positive:!0})),height:be(Ce({finite:!0,positive:!0}))}),Cr=Se({video_id:W(),timestamps:Ao}),Ms=Td(Cr),Ts=Se({isSignedIn:Je(_t(),!1),accessToken:Je(Ze(W()),null),userName:Je(Ze(W()),null),email:Je(Ze(W()),null)}),Mi=Je(Et((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return Qe(t,"valid JSON string for auth state")}return Ts.run(n,t)}return Ts.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),Yn={isSignedIn:!1,accessToken:null,accessTokenExpiresAt:null,refreshToken:null,userId:null,userName:null,email:null},Ii=Je(Se({isSignedIn:Je(_t(),!1),accessToken:Je(Ze(W()),null),accessTokenExpiresAt:Je(Ze(Ce({finite:!0})),null),refreshToken:Je(Ze(W()),null),userId:Je(Ze(W()),null),userName:Je(Ze(W()),null),email:Je(Ze(W()),null)}),Yn),Ed=Se({autoBackupEnabled:_t(),autoBackupIntervalMinutes:Ce({int:!0,min:5,max:1440}),lastAutoBackupAt:be(Ze(Ce({int:!0,positive:!0})))}),Li=Ed;var Is=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 5l0 14" />
  <path d="M5 12l14 0" />
</svg>`;var Ls=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-alarm-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 13a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
  <path d="M7 4l-2.75 2" />
  <path d="M17 4l2.75 2" />
  <path d="M10 13h4" />
  <path d="M12 11v4" />
</svg>`;var Cs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12l14 0" />
</svg>`;var Bs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M9 12h6" />
  <path d="M12 9v6" />
</svg>`;var Rs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l6 0" />
</svg>`;var Ds=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 7l16 0" />
  <path d="M10 11l0 6" />
  <path d="M14 11l0 6" />
  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
</svg>`;var Ps=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
  <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
</svg>`;var _s=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
</svg>`;var Os=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-clock-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" />
  <path d="M16 19h6" />
  <path d="M19 16v6" />
  <path d="M12 7v5l3 3" />
</svg>`;var Hs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
</svg>`;var Ns=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
</svg>`;var zs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
</svg>`;var Gs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l2 2l4 -4" />
</svg>`;var Fs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-horizontal"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 6l8 0" />
  <path d="M16 6l4 0" />
  <path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 12l2 0" />
  <path d="M10 12l10 0" />
  <path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 18l11 0" />
  <path d="M19 18l1 0" />
</svg>`;var Us=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" />
</svg>`;var Vs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
  <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M14 4l0 4l-6 0l0 -4" />
</svg>`;var qs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
</svg>`;var js=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-export"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
</svg>`;var $s=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
</svg>`;var Ws=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
</svg>`;var Ys=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
</svg>`;var Ks=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
</svg>`;var Xs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
</svg>`;var Js=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-star"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
</svg>`;var Qs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
</svg>`;var Zs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
</svg>`;var el=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
</svg>`;var tl=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
</svg>`;var nl=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
</svg>`;var ol=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
</svg>`;var rl=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
</svg>`;var il=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
</svg>`;var al=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var ap={plus:Is,"alarm-plus":Ls,minus:Cs,"circle-plus":Bs,"circle-minus":Rs,trash:Ds,clipboard:Ps,settings:_s,"clock-plus":Os,"current-location":Hs,"player-record":Ns,"circle-x":zs,"circle-check":Gs,"adjustments-horizontal":Fs,cloud:Us,"device-floppy":Vs,"folder-open":qs,"file-export":js,"file-import":$s,"file-spreadsheet":Ws,login:Ys,logout:Ks,refresh:Xs,star:Js,"alert-triangle":Qs,database:Zs,server:el,world:tl,"plug-connected":nl,key:ol,x:rl,"indent-increase":il,"indent-decrease":al},sl="http://www.w3.org/2000/svg",sp=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,lp=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,cp=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,ll=new Map;function cl(e){let t={};for(let n of e.matchAll(cp))t[n[1]]=n[2];return t}function up(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function dp(e){let t=up(e).match(sp);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,o]=t,a=document.createElementNS(sl,"svg"),r=cl(n);for(let[c,s]of Object.entries(r))c!=="class"&&a.setAttribute(c,s);for(let c of o.matchAll(lp)){let[,s,h]=c,m=document.createElementNS(sl,s),v=cl(h);for(let[f,y]of Object.entries(v))m.setAttribute(f,y);a.appendChild(m)}return a}function pp(e){let t=ll.get(e);if(t)return t;let n=dp(ap[e]);return ll.set(e,n),n}function Rn(e,t=20){let n=pp(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function Ge(e,t,n){e.replaceChildren(Rn(t,n))}function K(e,t,n,o){e.replaceChildren(Rn(t,o),document.createTextNode("\xA0"+n))}var ul="5.3.8";var Br=ul+"+2b11cf3",Ci=null;function l(e,...t){let n="debug",o=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=o.pop());let a=`[Timekeeper v${Br}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...o)}var Rr=e=>String(e).padStart(2,"0");function gn(e,t=e){let n=Math.floor(e/3600),o=Math.floor(e%3600/60),a=Rr(e%60);return t<3600?`${t>=600?Rr(o):o}:${a}`:`${t>=36e3?Rr(n):n}:${Rr(o)}:${a}`}function Dr(e,t){return gn(e,Math.max(e,t))}function Bi(e,t){let n=Math.max(0,...e.map(o=>o.start));return e.map(o=>{let a=gn(o.start,n),r=t?`${o.comment} <!-- guid:${o.guid} -->`.trimStart():o.comment;return`${a} ${r}`}).join(`
`)}function dl(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Dn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var pl=`#ytls-pane {
  background: rgba(19, 19, 19, 0.8);
  text-align: left;
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0;
  margin: 0;
  border-radius: 12px;
  /* Add rounded corners */
  border: 1px solid rgba(85, 85, 85, 0.8);
  /* Add a thin grey border */
  opacity: 0.9;
  z-index: 5000;
  font-family: Arial, sans-serif;
  width: 300px;
  height: 90vh;
  min-width: 300px;
  max-width: 800px;
  min-height: 400px;
  max-height: 90vh;
  user-select: none;
  /* Prevent text selection in pane */
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
  cursor: auto;
  /* no visible corner cursor */
  z-index: 10;
  pointer-events: none;
  /* legacy handle inactive, corners handle events */
  background: transparent;
  margin: 0;
  padding: 0;
}

#ytls-resize-handle::before {
  display: none;
  /* remove the triangular corner indicator */
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

#ytls-resize-tl {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

#ytls-resize-tr {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}

#ytls-resize-bl {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

#ytls-resize-br {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}

#ytls-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  position: relative;
}

/* Wrapper that gives the custom scrollbar a positioned ancestor covering only the list area */
#ytls-list-wrapper {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

#ytls-content ul {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 !important;
  border: none !important;
  box-sizing: border-box;
  scrollbar-width: none;
  /* Firefox: hide native scrollbar */
}

#ytls-content ul::-webkit-scrollbar {
  display: none;
  /* WebKit: hide native scrollbar */
}

/* Custom overlay scrollbar track */
.ytls-scrollbar-track {
  --ytls-scrollbar-size: 10px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--ytls-scrollbar-size);
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.ytls-scrollbar-track.ytls-scrollbar-visible {
  opacity: 1;
}

/* Custom overlay scrollbar thumb */
.ytls-scrollbar-thumb {
  position: absolute;
  right: 2px;
  width: calc(var(--ytls-scrollbar-size) - 4px);
  min-height: 30px;
  background: rgba(255, 255, 255, 0.42);
  border-radius: 999px;
  transition: background 0.15s ease;
}

.ytls-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.62);
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
  background: #131313;
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
  user-select: none;
  /* Prevent text selection in timestamp items */
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

#ytls-pane li:first-child {
  border-top: none;
}

#ytls-pane li.ytls-timestamp-highlight {
  background: rgba(35, 48, 36, 0.8);
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
  flex: 0 0 8ch;
  /* Reserve fixed hh:mm:ss width so controls don't shift */
  width: 8ch;
  min-width: 8ch;
  max-width: 8ch;
  display: inline-block;
  text-align: left;
  /* Align the text to the left */
  overflow: hidden;
  /* Prevent overflow */
  text-overflow: ellipsis;
  /* Add ellipsis for long text */
  white-space: nowrap;
  /* Prevent wrapping */
  font-variant-numeric: tabular-nums;
}

#ytls-pane .time-row .time-diff {
  flex-grow: 1;
  /* Allow time-diff to fill remaining space */
  text-align: right;
  /* Align time diff text to the right, next to trash icon */
}

#ytls-pane .time-row .ytls-row-controls {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 5px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

#ytls-pane li:hover .time-row .ytls-row-controls {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.ytp-progress-bar .ytls-marker {
  position: absolute;
  height: 100%;
  width: 2px;
  background-color: #ff0000;
  cursor: pointer;
}

#ytls-pane [data-time] {
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
  background: #131313;
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
  border: none;
  border-radius: 5px;
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  touch-action: manipulation;
}

.ytls-main-button:hover {
  background: rgb(63, 63, 63);
}

.ytls-main-button svg {
  display: block;
  width: 24px;
  height: 24px;
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
  font-size: 14px;
  color: #666;
  margin-left: auto;
  padding-right: 5px;
  cursor: default;
}

#ytls-pane .ytls-google-user-display {
  font-size: 12px;
  color: #4285f4;
  margin-left: 8px;
  padding: 2px 6px;
  cursor: default;
  background: rgba(66, 133, 244, 0.1);
  border-radius: 4px;
}

#ytls-pane .ytls-backup-status-display {
  font-size: 12px;
  color: #9acd32;
  /* yellowgreen */
  margin-left: 8px;
  padding: 2px 6px;
  cursor: default;
  background: rgba(154, 205, 50, 0.12);
  border-radius: 4px;
}

#ytls-members-badge {
  display: none;
  align-items: center;
  margin-right: 4px;
  color: #52c41a;
}

#ytls-members-badge svg {
  fill: currentColor;
}

#ytls-current-time {
  color: white;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

#ytls-playback-speed {
  color: white;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  padding: 0 2px;
  border-radius: 3px;
  outline: none;
  display: inline-block;
  width: 5ch;
  text-align: center;
  transition: filter 0.2s ease;
}

#ytls-playback-speed:hover {
  text-decoration: underline;
}

#ytls-playback-speed.ytls-playback-speed-active {
  color: #f4ba78;
}

#ytls-playback-speed-group {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  align-self: center;
}

/* Backup status indicator (colored dot) */
.ytls-backup-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #666;
  cursor: help;
  flex-shrink: 0;
}

@keyframes ytls-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.25;
  }
}

.ytls-backup-indicator--pulsing {
  animation: ytls-pulse 1.6s ease-in-out infinite;
}

/* Shared modal container styles */
#ytls-settings-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1a1a;
  padding: 8px;
  border-radius: 10px;
  z-index: 10000;
  color: white;
  text-align: center;
  width: 200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

#ytls-save-modal,
#ytls-load-modal,
#ytls-delete-all-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #333;
  padding: 8px;
  border-radius: 10px;
  z-index: 10000;
  color: white;
  text-align: center;
  width: fit-content;
  max-width: 90vw;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Modal header with tabs and close button */
.ytls-modal-header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 0;
  gap: 10px;
}

/* Modal close button (X in header) */
.ytls-modal-close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  z-index: 1;
}

.ytls-modal-close-button:hover {
  background: #ff6666;
}

/* Styles for settings modal */
#ytls-settings-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  border-radius: 0 4px 4px 4px;
  padding: 10px;
  margin-top: -2px;
  position: relative;
  z-index: 1;
}

/* Section heading */
.ytls-section-heading {
  margin: 0 0 10px 0;
  padding: 0;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

/* Settings nav (tabs) */
#ytls-settings-nav {
  display: flex;
  gap: 6px;
  flex: 0;
}

#ytls-settings-nav .ytls-settings-modal-button {
  flex: 0;
  width: auto;
  height: 24px;
  margin-bottom: 0;
  background: #2a2a2a;
  font-size: 13px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid transparent;
  border-radius: 4px 4px 0 0;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  position: relative;
}

#ytls-settings-nav .ytls-settings-modal-button .ytls-tab-text {
  display: none;
}

#ytls-settings-nav .ytls-settings-modal-button.active .ytls-tab-text {
  display: inline;
}

#ytls-settings-nav .ytls-settings-modal-button:hover {
  background: #3a3a3a;
}

#ytls-settings-nav .ytls-settings-modal-button.active {
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  border-bottom: 2px solid #2a2a2a;
  z-index: 2;
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
  gap: 4px;
}

.ytls-settings-modal-button:hover {
  background: #777;
  /* Example hover effect */
}

/* Tabler icon sizing in pane controls */
#ytls-pane .time-row span svg,
#ytls-pane .time-row button svg {
  display: block;
  flex-shrink: 0;
  pointer-events: none;
}

/* Route SVG clicks to their parent controls for consistent interaction */
.ytls-main-button svg,
.ytls-settings-modal-button svg,
.ytls-save-modal-button svg,
.ytls-save-modal-cancel-button svg,
.ytls-modal-close-button svg,
#ytls-header-button svg {
  pointer-events: none;
}

/* Reduce mobile tap delay for button-like controls */
.ytls-row-control,
.ytls-settings-modal-button,
.ytls-save-modal-button,
.ytls-save-modal-cancel-button,
.ytls-modal-close-button,
#ytls-header-button,
#ytls-buttons button {
  touch-action: manipulation;
}

/* Shared styles for modal copy */
#ytls-save-modal p,
#ytls-load-modal p,
#ytls-delete-all-modal p {
  margin-bottom: 15px;
  font-size: 16px;
}

.ytls-save-modal-button {
  background: #555;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  /* Applied to both JSON and Text buttons, last one will have extra margin if not overridden */
}

.ytls-save-modal-button:last-of-type {
  /* Remove margin from the last button of this type in the modal */
  margin-right: 0;
}

.ytls-save-modal-cancel-button {
  background: #444;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  display: block;
  width: 100%;
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
  background: #777;
  /* Example hover effect */
}

.ytls-hidden-file-input {
  display: none;
}

#ytls-header-button {
  align-items: center;
  background: transparent;
  border: none;
  color: var(--yt-spec-text-primary, currentColor);
  cursor: pointer;
  display: inline-flex;
  font-size: 20px;
  height: 40px;
  margin-left: 6px;
  padding: 0 6px;
  text-decoration: none;
}

#ytls-header-button:hover {
  color: var(--yt-spec-call-to-action, #3ea6ff);
}

#ytls-header-button:focus-visible {
  outline: 2px solid var(--yt-spec-call-to-action, #3ea6ff);
  outline-offset: 2px;
}

#ytls-header-button img {
  display: block;
  height: 32px;
  max-width: 48px;
  pointer-events: none;
  width: auto;
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
`;var Pr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISKNpo4IcAAAL9UExURQAAAP/abf7Zaf/Yaf7Ya//XaP/WZv/VZf/VY//UYf/SYv/SYPvTZf/QZ//ObP7QYPzRYP7QXfjRZv7Kdv7PW/3OX//FgPnOXv7MVv/ChP3LWPzLWv7Bhf3EeP++jfXJZPXKW/rIWPvIVffIWv+4lvvGVfPIXvHJXvrFV/vFU/61nPvFUP6zn/i5ivrCU/2yl/6vovvBTP+tp/6upPjBUPbBVPPCVfG8ee3EWOnEXvm+UPu0fvq+SO/AV/m9TPq1cvm9Svq9Req/YPm1Zva7Tvi6Tfi6S/m3V/G8T+e/Vvi5R+20ePi3Sui3bvi3RPe2S/Snn/a1R/e0R/G3ReW6Uve0QOm5Seu3Tei4T/eyRvaySOC6VvaxPuyzSuO1V+W1T922Udi0UuCvS+WtRuqrPNSwU+SbldiqZ+epP9mpSNamT86qT96kP82pSuKhOsemStifPdedN8OiTMufQtGOidaaOMKhSNmYNMyVRb2cR9OUM+yFLuuEL+iDLcWSOM+NLbaVQ8iMMrqQPON+K72Be99/KMaGNK2QQcGFOsmEI9h7JdV7IaiLP9l2KMd+HLCFNKyAVdVyJc14Gr97LqKHPLx6Ms1zJ8Z4GMJ4Hrx6Icd2Fqpyb89tI5yAOJ17SaV7MsNtJrhwKqB5NJd8Npd6O7xsHsRlHpt1MaVyJbZnJJB1MbljII11NZtwI5ZmX7BhIYZvL41rKohpLoJqLZBkIKJaHp9eEKpVGXhjLXthL5hUHHxdIo9RFnRaJnBcJnFYKXNVJ3RSG2lWI4JIF25PJWlON2ZPJmpOGmFRIWVNHGhKImNKHXNCC1hIHVxAHlRDIWg5EVc9HU5AGGM1D0w8HlA8E1I5HEc6Fkw3EFcxEEo0GkQ2G0UxGT8tGDswEUwoCzsuFj8oJj0tDDsrGDksFzgpFkMkCjQnFjMpDTAjFS0lDC0iFDEiCDcdCSoiCikgFCYeByQcEzAYBSoaBSQcByIbBykUBBwVBRcSBBoLAhQNAw8JBAsKAwcGAgAAAN3XOCgAAAABdFJOUwBA5thmAAAGaElEQVR42u2WW2wUVRjH/2dmdy7doduy7S6XQltaIaCiYlJEhYpRo1aMJEbxQgQvRI0YNPESjVGjiS/qiz5ojEEfBKOEgNJQQKRcWy6FSmtoramlpVCWUsre5rI75ziXLXTd1t2++eAvk8zszPl+5/+d3cke/E9eUG3g1KnuYTqxIoygtWx5b+3qVatf/7pZQ54YHU17mzpUW5Jq/uiJCtlnE3ri81PZKQiy6T16IAqPVH7dnLLwroZ6nUOa0keenJ+HYOjbAyd0MxCUA5U1xzb2ArhiUN553pNTQPd8+asKQA755ye3XQYg6SDpcc++Ozm3oH7teQ4UIN6SQT09Kp3C88qbUk4BTm5sPa4RQCVgsCjSNYDYBu/y1bdzuQV08LdDejIZ3X2OgALFD+CPvmEYrHDBkqU1HPIgun7da+tWVImCIHi9XqFq5RtvrXvpmZfe+j5KkYUHWcQ3f9kBDRQu7MzuRcUFPh9ie3335yMY+v6rVgCUEZaWDP4SmFkIPh7TTU1CrjUI//DZ6XQ9dR8zcIQUlCjVYnhq3TI5h2Bow2e9DIwBjIJQBhAOjCMAJ1dVqoG6B6V/FWg/fmjVAxSM2uU8YFoK20AImXK9NnX5gxxGk/mJ7tpw/oaVL668SWB2FzxM0wTPKCxY+ZPLr5nd/1MjxbjQ5tUVrzZ09bQ3vDqZ9xAPcbGueK/y3KYTPV1H1z+6toWOm6Bn855VTy8qEv3VD6+SKUy4mDwFfezxGwu9hRV314V/Do8nMA7+sHTZDAMwUHTH9YyHRXGxbWCkujZEYSEuKGvelxpbQA9sIPNnUlDrSE5eAAt+5esfvGArcGtZEoxSIFTZ1dBCxxR0bj1ZNUWABQMEkQf4NXUlqaVrLAMt8Jj2vBSeKeaeHUNjCeL128qJRmEnSJmGblr1dw/0hDtuXsGDGHa5AYsBdfjQQZotoLt2+xTS3g+XoePEXLLw4gUGrbf2cR7tEYCCAv2dMeNwwymaJWja3l5skiOHNWeiRGMb56vx9jAAl6ILp6OtMQELqh/ewUvKtl19/3yZPvz2SDBmsvB36m0loOf3fqOzaTNQCiAFzKrdaNSLd8zg6aXWLVqZADSe+eq5jJ/yAriQC+TOciV2+kcDTHykelIhgAii2w+Dk+pC05LdJ+MCHGZuGVMA2qd5oRJQgEzni+DAulSOEUiMmCFLmWFwW1hzDCMUaLptJQyQjSgceEFnBETnrCuMEBy9iPfORBp2GZwjIIDqh4MCw663x5IYuZLgtCuHzdNNdh0IjYaTsCDOkZRkCbxpSoNR+wYHgBqU4+yRBr2n9v0raxD7uH5yKpVCt2FQWDAGZp+kgH/SsIFoXHPnt/EwLy/AMLkVr8y6Imj+OOIDPK1nMQJ1DBAFwdInqVufyfRP6ri0gK7/oowwmC3DGGVwFJl/TJm8/LaS/hbCrToBYcN6xltKyVUBwRi0tlPONfecs1WImhiNtVjEqXbP2RzvgpuA1p9wliOGNDlmHiHWFoGbIKy5XRuYGOFeV8DCEGEhC5gYHYPUEZg6bLgiHhNjwG3BPnQJgFKKCSGo0bSgxCAMgFhZNKF6GYYrQJkvBhEE4jUC8kcMQUgLpsyNwaF02gQMAUMuSrdQUa1qOkCQmpe/QQ7SuaWuAMEa6kQgMG+qkJEXQkjWZldwrgA3LPndgLMMiWtr/HmFKC4fDt0VHHmd6aZPL84RbIOGAv3Pc1HkoqhK6nrqxSDSCbi7Hk5aGYiuiWLCc+3i2TlSCP5ysfeBZSVu3w7dmzf1zSuFBkAEePRcvGAaGBMZQkkonlr0WA03SoDhxq37uIpSDbaCMGjxATUO0BRggocJWwt4Aij2KHpf5ZKH5nAYLQA9Ub+tv6BCIbZBBwOFCg9sItbJElk+HzwFnH5+XmXtYplDpgCJxo5zvX9FBMVXwIEwgJqwMWCjSdAcTUycNfXOW0q47F3a/iYieiODQ7HuqMmbsmLPByLoloyAOQFi0/xKYaFfmbVYRJYgsaMFRBJEyYwkEqoaMxXE7KbBCJO0y6UQZNnr9yrQotrU+yqzt7opA4wlVAJJUAKAMDeYTCZHOoj0x2Xwmg71EhgbZ6PZ2nla19P3hMDshZNwFb2tsz+pwSklk4JVNSLG4GLb/p31Djv3tyWQgdF59VnrWXPcrS5lFBYc4ZBFisHdOfP4b/E301Ck7f/BFa8AAAAASUVORK5CYII=",ml="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISFPUHnAAAAAMAUExURQAAAAAAAAcGARIMAhkNAR0OABgRAx4SAyMRASEVAyMVAigXAiEZBicYAiMbBiwZASsaAzAZACkbBC0cAi0dBjAdAjMeAykhCTIfAzQfAzAhBzUgAjghAy0kCzkiAzQkBzwkAz0kAzklBz8lA0AmBEEmAz4nBUEnBEQoBEUpAz0rCzgtD0ErCUcqA0EsB0crBEkrA0YsB0osAksuBU0uA08vBEQyD0E0E0kyDlExBVIxBFQzB1U0BUg3Ek83D0o6Flc5DFQ6DlQ8E1Y9E08/GFo/EF4+Dlw/EVVBF2U+CFtBFWg/CFxFGGVEEllHHGRGFmJHF2BKGpg7BGBOHmlMGWxNGG1NGZ1BCGhQHWZRIaJGDZ9ID3NWHnNYIXpXHW9aJJ5NE4VWGadOEntbIIBbH6RRFXlhKKhWFn9iJbBWGIJlKItjI39nKoZmJq9cGohsK5RqJqxjI7lgHYhuL41tK7ZjH5xxKpF0L7dqIJV0LsFqI5R4M7FxHbRwKpd7NJx7MqZ5LclvJcN1D5t/N8F1Jql9MKOBNK9+LsJ6G6GCOM54KreAKsl8GL9+Mr+AM7OEM8CBJ7iEMqqKPMyCH9h+Lq+KO82DLa+MO7GMO86GJMGLM8iJN7GQP9yFMeGFMMeOObeTPuWIMsOSOsiRN+SLNLqXQteRMb2YQdmTLtCWOsGaQ76bRe2ONeqRN9aYOcidRO+SONqZM8WeRdWbO9ScP/CUOcahRuGbNu+XOtuePMikSOGeNtSiQ92gOtiiRdqiQM6oSuGlPuelP9KrS9iqSemmPOepQe6oPdavTe6rQeqsROGvS+iuRvGtQfKtQNy0UOWyTfevQ/awQfOxRfexRPezQ/O0R/ezReq3UPe0RvG2SeO6Uvm1R/i2R++5TPi4SOe9VO28Uvm6TPO+Ufq9TezBV/q+T+/BVvHBVfrAUPDFWPvDUvzEU/fGV/PHWvXHWfzGVvXKW/3IWPrLWfrLXPjMXP3LWf7NWvzOXf/PXP/PXv3QXv7QXP7RXf/RXf/SYIi9XXwAAAABdFJOUwBA5thmAAAHkUlEQVR42sXWa3BU5R3H8e//eZ6zt+wlIQRqsBIC4w2QqKhAA52K1tYqqKjIiDpUHd60HaszHX3hdCo6tbXSVvFSBtsyjFqsoJVRvLWK4WLjpWhBAcWgYGgIm012N7vZ3XPpZmOCyW6ovupnzvNiz5z/7/znOf/ds/zfyXFOeowk5SelYrkeF+g74oA34kIRtyy6jEj99b9ct37d729ZOFZk8JyEv33Dbb9as+aBFbctmioio3cgfGfhOTUUZXr3bH31MB4I82bOmjIu7NeQtxMHWt7ahDdqwGm3zBatMNguibe2/S0P8y648LSwYkhm39PPfoBXMUD40XURpUMhH3Yu7WS7tr+x9+LFZ0QZLvnyui+aMIxgNdbahMZaQDDc6wvnZcn8ekaKXlpnbazcgbprQVDXxCjxcuntdadHhXK5N+5s9SruwcIl04OhGmvwus5qn49KkvevwKsUwNxZcyfXhz3D//DKjYc8UIzg0XLfxpYXt73Xdqgr7XIcwShFinJzJnTs2/LCxhe2HnYYlOvKeQz32cGKT0E4b3nz0XgPsWjduGM1hV00jrf4kvYtqUoBwvxl33MlBj5/OHCsIvTN1j2nnlLtH5qlznVPUOEpCNcvm57tczDBUvkx2QOff8KUSbEqjE12b+uODQWPkQGCumXppEQe7YuGLIbJd2eOtHXmIpGqMOm25173KoyycOKy66qTNiYcsQwjpLod92gy3pkD7JYX8BgZIJy+/CqVtrUOR32U8ZIJF+jJUbR11WdlAcX6n17iZj10JOKjgkImWYBMBhNy0xse7BtIkGH1dg5UTVSoyOs7tHdXR5rw+Gnjcusfdb3hgzRu+SV2QWGNWk+qdfXKlY+uXbtqxX1P9iy4FvlygFjLF/bf34qGhMo616547PPmm2699Yez339wzac/uBI5NkjCvMaPsoQj442mMndva/D65qZYFb2fbt3xamLRhfHXhvZAaI5lMviC0bqJjVMmRP1UkPyECTWGonz8o+2vsjh+f9xDvpjfn0QOHT2cTXa0dwVObpg+qzHK8WS7Ejufjl3294fxFP1OvPzUk5ovunrxtTfe+uPv8tLKX6zc2n38b3J4zpUdR+cvGNhEUUvP07ndzzyy6pHn/hW9+o475vesv/t3H7uMLhyh6Romnn+CKBBuvqKm46nf3veXzdv+8czqNYcW3PnzxXVv/uEgo5NIMDTn7NDMy9EI1yyt73jqz/vdgPGJLrS3cfYp585qijVEGJ02GTTBQIcgly5rSm9YnTBaa6u4jJy05KoQ2Ibj8eJJGzu9Wcm5S8/OH2iJC57SopSI6Xj+30DlejvZncy4gJRedNHzlXXFzGz+nR0K19BfrtGqbXM3FSV3Pr7ynhWrXmq3IRDWWlGnllzkudlP8qItRBRaDMIHB6jk44fueXD9sxseuffX2zIQtChSi8bkVbZHA0qDFrQS2vfYlHF3PrDxY1sE9j/5m2cz+MKiQJ2ZBTel0BqlBHyA5NvylDn4xx0oAYXQsm6bTdDv9te4aJD+BWhxUUCqvIPM5nfppwW0r+XxA/gCFqg+lNSMpxSslItWfEmudyip8+28IPgosV7ZksMn2MoB9Y1atBlsBAR8hqLet59c3TL4QPYNTKaLiFLQ1RrHqCJwdfjkEB4lPgQs6wQN9n/++tCmrY/9qWOgl4/SFpS2jSLP+vAgwsAnE5o7B0pDhFs6W9vkx9798CY1Y0b0n4+XEpwjMvxneP9BlKa4lKWl8VsxpQWUKIUYpjVi71y7u6F56tRZE97Z1EvZO8iQ6rW1AoNGE1185Glb9WeIgN1wca27+4lPG2bEIDaDHZPnGjz/8ATXb5mCAiWIgYlLL6tVRotPizDpqrPUkQ0D9RCb5t+0H8wYxBIYeqNFajAaDCgFNP3s1C17+3wCVdMXnRPqfXFfw1k1lIyZ+u7zdWP8U2sSlLilg9NOAAfMYGP1181678N2zz/ujNkTDB9uH3PWWAboE+PvnjnXTDnlTfAGW/C8qRNBg2JQVdO1t9979123XznRkNuVnBRkUGBy9LU4Y+fViBFXycDQTZsfG+jAKuAywFRXD960zuzpDAdr8QehirGTdr59kWne9XIO7fQfYC6cqXBdlDF5ypnZ+dZEuw064A8GIN132DE1N/B6wiOQsRy37vKb68Bxwdi4BcqEzmzIdSe6u0g7pHO4tVGg/qYpr+8/6lKITrvg+/WA64C0ORKuE0ZwjhTvBXm84lK2E5g8hqJc/L2dPU7VyefWhyhKddrIfk/839CMlO3opUQUSkt46K9rxsb4DP28zpSDySvtFsoDAhE37zD4oKzIYD0hhhQKDpjicgqBCm8OUnlc5SrQvuoAFWRz4Mr7+E2FTQAvney/A6JCUWMol+/sc3ANFCjkAlTowZ/LFdC6SltUbqBY7xQ7wG9iMUMlno0RKuvrzAIFo1wKZKoqB4jFaPKJPOCiguC6haTD15PvzjhQcETfmQbE1X7ha+jrSTngQpWqCpVmMpH0+Mq8VLzbwXUhUGMCkT4HBxJ21OIrse10Mo8LikAsZCSaS1LkpJxogK/A6Un1gSPGpao6LP8Fy8nbmCTqYikAAAAASUVORK5CYII=";var et=null,Kn=null,mp=250,Ot=null,Xn=!1,tt=null,Eo=[];function fp(){return(!et||!document.body.contains(et))&&(et=document.createElement("div"),et.className="ytls-tooltip",et.style.pointerEvents="none",document.body.appendChild(et),window.addEventListener("scroll",fl,!0),window.addEventListener("resize",fl,!0)),et}function hp(e,t,n){let a=window.innerWidth,r=window.innerHeight,c=e.getBoundingClientRect(),s=c.width,h=c.height,m=t+10,v=n+10;m+s>a-10&&(m=t-s-10),v+h>r-10&&(v=n-h-10),m=Math.max(10,Math.min(m,a-s-10)),v=Math.max(10,Math.min(v,r-h-10)),e.style.left=`${m}px`,e.style.top=`${v}px`}function hl(e,t){let o=window.innerWidth,a=window.innerHeight,r=t.getBoundingClientRect(),c=e.getBoundingClientRect(),s=c.width,h=c.height,m=Math.round(r.left+r.width/2-s/2),v=Math.round(r.top-h-8);v<8&&(v=Math.round(r.bottom+8)),m<8&&(m=Math.round(r.left)),m+s>o-8&&(m=Math.round(r.right-s)),m=Math.max(8,Math.min(m,o-s-8)),v=Math.max(8,Math.min(v,a-h-8)),e.style.left=`${m}px`,e.style.top=`${v}px`}function fl(){if(!(!et||!Ot)&&et.classList.contains("ytls-tooltip-visible"))try{hl(et,Ot)}catch{}}function gp(e=50){tt&&(clearTimeout(tt),tt=null),!Xn&&(tt=setTimeout(()=>{Mo(),tt=null},e))}function yp(e,t,n,o){tt&&(clearTimeout(tt),tt=null),Ot&&o&&Ot!==o&&et?.classList.contains("ytls-tooltip-visible")&&et.classList.remove("ytls-tooltip-visible"),Kn&&clearTimeout(Kn),o&&(Ot=o,Xn=!0),Kn=setTimeout(()=>{let a=fp();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),o?requestAnimationFrame(()=>{hl(a,o),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(hp(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},mp)}function Mo(){Kn&&(clearTimeout(Kn),Kn=null),tt&&(clearTimeout(tt),tt=null),et&&et.classList.remove("ytls-tooltip-visible"),Ot=null,Xn=!1}function Ri(){Mo()}function De(e,t){let n=0,o=0,a=m=>{n=m.clientX,o=m.clientY,tt&&(clearTimeout(tt),tt=null),Xn=!0,Ot=e;let v=typeof t=="function"?t():t;v&&yp(v,n,o,e)},r=m=>{n=m.clientX,o=m.clientY},c=()=>{Ot===e&&(Xn=!1,gp())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",r),e.addEventListener("mouseleave",c);let s=m=>{Xn=!1,Ot===e&&Mo()};e.addEventListener("click",s,!0);let h=new MutationObserver(()=>{if(Ot===e)try{let m=window.getComputedStyle(e);(m.display==="none"||m.visibility==="hidden"||m.opacity==="0")&&Mo()}catch{}});try{h.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}Eo.push(h),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",r),e.removeEventListener("mouseleave",c),e.removeEventListener("click",s,!0);try{h.disconnect()}catch{}let m=Eo.indexOf(h);m!==-1&&Eo.splice(m,1),delete e.__tooltipObserver},e.__tooltipObserver=h}function gl(){for(let e of Eo)try{e.disconnect()}catch{}Eo.length=0,Mo()}var Nr={};xd(Nr,{addTimestamp:()=>kp,buildExportCsvPayload:()=>Bp,buildExportPayload:()=>Lp,deleteSingleTimestampFromIndexedDB:()=>Mp,exportAllTimestamps:()=>Cp,exportAllTimestampsCsv:()=>Rp,getRecordsChangedSince:()=>Gi,loadFromIndexedDB:()=>zi,loadGlobalSettings:()=>Yt,mergeBackupData:()=>Dp,mergeRemoteRecords:()=>Fi,onTimestampsWritten:()=>Ui,removeFromIndexedDB:()=>Ip,saveGlobalSettings:()=>wn,saveRowsToIndexedDB:()=>Tp,saveSingleTimestampToIndexedDB:()=>Ep,saveToIndexedDB:()=>Ap});var vp="ytls-timestamps-db",wp=5,Jn="timestamps",mt="timestamps_v2",vn="settings",yn=null,Qn=null;function _r(){if(yn)try{return yn.objectStoreNames,Promise.resolve(yn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),yn=null}return Qn||(Qn=bp().then(e=>(yn=e,Qn=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),yn=null},e.onversionchange=()=>{l("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),yn===e&&(yn=null)},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw Qn=null,e}),Qn)}function yl(e,t){let n=crypto.randomUUID(),o=0,a=e.openCursor();a.onsuccess=r=>{let c=r.target.result;c?(o++,c.update({...c.value,write_counter:o,device_id:n}),c.continue()):(t.put({key:"write_counter",value:o}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${o} records, device_id=${n}`))},a.onerror=()=>{l("Lamport migration: cursor error during backfill",a.error,"error")}}function bp(){return new Promise((e,t)=>{let n=indexedDB.open(vp,wp);n.onupgradeneeded=o=>{let a=o.target.result,r=o.oldVersion,c=o.target.transaction;if(r<1&&a.createObjectStore(Jn,{keyPath:"video_id"}),r<2&&!a.objectStoreNames.contains(vn)&&a.createObjectStore(vn,{keyPath:"key"}),r<3){if(a.objectStoreNames.contains(Jn)){l("Exporting backup before v2 migration...");let v=c.objectStore(Jn).getAll();v.onsuccess=()=>{let f=Cr.array().safeParse(v.result);if(f.success&&f.data.length>0)try{let y={},E=0;f.data.forEach(q=>{if(q.timestamps.length>0){let ee=Ao.parse(q.timestamps);y[`ytls-${q.video_id}`]={video_id:q.video_id,timestamps:[...ee].sort((O,j)=>O.start-j.start)},E+=ee.length}});let I=new Blob([JSON.stringify(y,null,2)],{type:"application/json"}),P=URL.createObjectURL(I),G=document.createElement("a");G.href=P,G.download=`timekeeper-data-${Dn()}.json`,G.click(),URL.revokeObjectURL(P),l(`Pre-migration backup exported: ${f.data.length} videos, ${E} timestamps`)}catch(y){l("Failed to export pre-migration backup:",y,"error")}else f.success||l("Skipping pre-migration backup: legacy data failed validation",f.error.message,"warn")}}let h=a.createObjectStore(mt,{keyPath:"guid"});if(h.createIndex("video_id","video_id",{unique:!1}),h.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(Jn)){let v=c.objectStore(Jn).getAll();v.onsuccess=()=>{let f=Cr.array().safeParse(v.result);if(f.success&&f.data.length>0){let y=0;f.data.forEach(E=>{E.timestamps.length>0&&E.timestamps.forEach(I=>{h.put({guid:I.guid,video_id:E.video_id,start:I.start,comment:I.comment}),y++})}),l(`Migrated ${y} timestamps from ${f.data.length} videos to v2 store`)}else f.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",f.error.message,"warn");r<4&&yl(c.objectStore(mt),c.objectStore(vn))},a.deleteObjectStore(Jn),l("Deleted old timestamps store after migration to v2")}}r===3&&yl(c.objectStore(mt),c.objectStore(vn));let s=c.objectStore(mt);s.indexNames.contains("write_counter")||s.createIndex("write_counter","write_counter",{unique:!1})},n.onsuccess=o=>{e(o.target.result)},n.onerror=o=>{let a=o.target.error;t(a??new Error("Failed to open IndexedDB"))},n.onblocked=()=>{l("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function Or(e,t,n){return _r().then(o=>new Promise((a,r)=>{let c;try{c=o.transaction(e,t)}catch(m){r(new Error(`Failed to create transaction for ${e}: ${m}`));return}let s=c.objectStore(e),h;try{h=n(s)}catch(m){r(new Error(`Failed to execute operation on ${e}: ${m}`));return}h&&(h.onsuccess=()=>a(h.result),h.onerror=()=>r(h.error??new Error(`IndexedDB ${t} operation failed`))),c.oncomplete=()=>{h||a(void 0)},c.onerror=()=>r(c.error??new Error("IndexedDB transaction failed")),c.onabort=()=>r(c.error??new Error("IndexedDB transaction aborted"))}))}var Di=new Set;function vl(e){return Di.add(e),()=>Di.delete(e)}function Sp(){for(let e of Di)try{e()}catch(t){l("Timestamp write listener failed:",t,"error")}}function Io(e,{silent:t=!1}={}){return _r().then(n=>new Promise((o,a)=>{let r;try{r=n.transaction([mt,vn],"readwrite")}catch(c){a(new Error(`Failed to create transaction: ${c}`));return}r.oncomplete=()=>{o(),t||Sp()},r.onerror=()=>a(new Error(`IndexedDB write failed: ${r.error?.message??"unknown"}`)),r.onabort=()=>a(new Error(`IndexedDB transaction aborted: ${r.error?.message??"unknown"}`));try{e(r.objectStore(mt),r.objectStore(vn))}catch(c){try{r.abort()}catch{}a(c instanceof Error?c:new Error(String(c)))}}))}function Lo(e,t){let n=e.get("write_counter");n.onsuccess=()=>{let o=typeof n.result?.value=="number"?n.result.value:0;e.put({key:"write_counter",value:t(o)})}}function wl(e,t){let n=Ao.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return Io((a,r)=>{let c=a.index("video_id").getAll(IDBKeyRange.only(e));c.onsuccess=()=>{let s=c.result??[],h=new Map(s.map(f=>[f.guid,f])),m=new Set(o.map(f=>f.guid)),v=Date.now();Lo(r,f=>{let y=f;return s.forEach(E=>{!m.has(E.guid)&&!E.deleted_at&&(y++,a.put({...E,deleted_at:v,write_counter:y}))}),o.forEach(E=>{let I=h.get(E.guid);I&&!I.deleted_at&&!E.deleted_at&&I.start===E.start&&I.comment===E.comment||(y++,a.put({guid:E.guid,video_id:e,start:E.start,comment:E.comment,write_counter:y,deleted_at:E.deleted_at??I?.deleted_at??void 0}))}),y})}})}function Pi(e,t){let n=Ao.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return o.length===0?Promise.resolve():Io((a,r)=>{Lo(r,c=>{let s=c;return o.forEach(h=>{s++,a.put({guid:h.guid,video_id:e,start:h.start,comment:h.comment,write_counter:s,deleted_at:h.deleted_at})}),s})})}function bl(e,t){return Pi(e,[t])}function _i(e,t={}){return e.length===0?Promise.resolve():Io((n,o)=>{Lo(o,a=>{let r=a;return e.forEach(c=>{c.write_counter!==void 0&&c.write_counter>r&&(r=c.write_counter)}),e.forEach(c=>{let s={guid:c.guid,video_id:c.video_id,start:c.start,comment:c.comment,deleted_at:c.deleted_at,write_counter:c.write_counter??++r};n.put(s)}),r+1})},t)}function Sl(e){return l(`Soft-deleting timestamp ${e}`),Io((t,n)=>{let o=t.get(e);o.onsuccess=()=>{let a=o.result;a&&Lo(n,r=>(t.put({...a,deleted_at:Date.now(),write_counter:r+1}),r+1))}})}function xl(e){return _r().then(t=>new Promise((n,o)=>{let a;try{a=t.transaction([mt],"readonly")}catch(c){let s=`Failed to create read transaction: ${c}`;l(s,c,"error"),o(new Error(s));return}a.onabort=()=>{let c=`Transaction aborted during load: ${a.error?.message??"unknown"}`;l(c,a.error,"error"),o(new Error(c))};let r=a.objectStore(mt).index("video_id").getAll(IDBKeyRange.only(e));r.onsuccess=()=>{try{let c=r.result.filter(m=>!m.deleted_at),s=[],h=0;for(let m of c){let v=Lr.safeParse({guid:m.guid,start:m.start,comment:m.comment});v.success?s.push(v.data):h++}if(h>0&&l(`Skipped ${h} stored timestamps for ${e} that failed validation`,null,"warn"),s.length===0){h>0?o(new Error(`Stored timestamps for this video failed validation (${h} rows)`)):n(null);return}n(s.sort((m,v)=>m.start-v.start))}catch(c){o(c)}},r.onerror=()=>{let c=`Failed to load timestamps from IndexedDB: ${r.error?.message??"unknown error"}`;l(c,r.error,"error"),o(new Error(c))}}))}function kl(e){return Io((t,n)=>{let o=t.index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{let a=o.result??[],r=Date.now();Lo(n,c=>{let s=c;return a.forEach(h=>{h.deleted_at||(s++,t.put({...h,deleted_at:r,write_counter:s}))}),s})}})}function Hr(){return Or(mt,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function Tl(e){return Or(mt,"readonly",t=>t.index("write_counter").getAll(IDBKeyRange.lowerBound(e,!0))).then(t=>Array.isArray(t)?t:[])}function Al(e){return e.length===0?Promise.resolve([]):_r().then(t=>new Promise((n,o)=>{let a=[],r=t.transaction(mt,"readonly"),c=r.objectStore(mt);for(let s of e)c.get(s).onsuccess=h=>{let m=h.target.result;m&&a.push(m)};r.oncomplete=()=>n(a),r.onerror=()=>o(r.error??new Error("IndexedDB read failed")),r.onabort=()=>o(r.error??new Error("IndexedDB read aborted"))}))}function El(e,t){return Or(vn,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function Ml(e){return Or(vn,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function Oi({includeDeleted:e=!1}={}){let t={},n=await Hr(),o=[],a=0;for(let f of n){let y=hn.safeParse(f);y.success?o.push(y.data):a++}a>0&&l(`Skipped ${a} timestamp rows that failed validation during export`,null,"warn");let c=[...e?o:o.filter(f=>!f.deleted_at)].sort((f,y)=>{let E=f.video_id.localeCompare(y.video_id);if(E!==0)return E;let I=f.start-y.start;return I!==0?I:f.guid.localeCompare(y.guid)}),s=new Map;for(let f of c)s.has(f.video_id)||s.set(f.video_id,[]),s.get(f.video_id).push({guid:f.guid,start:f.start,comment:f.comment,write_counter:f.write_counter,deleted_at:f.deleted_at});let h=Array.from(s.keys()).sort((f,y)=>f.localeCompare(y));for(let f of h){let y=s.get(f);t[`ytls-${f}`]={video_id:f,timestamps:y}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:c.length,invalidRows:a}}async function Cl(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:o}=await Oi(),a=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(a),c=document.createElement("a");c.href=r,c.download=t,c.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function Hi(){let e=hn.array().safeParse((await Hr()).filter(m=>!m.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let m=`Tag,Timestamp,URL
`,v=`timestamps-${Dn()}.csv`;return{csv:m,filename:v,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let m of t)n.has(m.video_id)||n.set(m.video_id,[]),n.get(m.video_id).push({start:m.start,comment:m.comment});let o=[];o.push("Tag,Timestamp,URL");let a=0,r=m=>`"${String(m).replace(/"/g,'""')}"`,c=Array.from(n.keys()).sort();for(let m of c){let v=n.get(m).sort((f,y)=>f.start-y.start);for(let f of v){let y=f.comment,E=gn(f.start,36e3),I=dl(f.start,`https://www.youtube.com/watch?v=${m}`);o.push([r(y),r(E),r(I)].join(",")),a++}}let s=o.join(`
`),h=`timestamps-${Dn()}.csv`;return{csv:s,filename:h,totalVideos:n.size,totalTimestamps:a}}async function Bl(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:o}=await Hi(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(a),c=document.createElement("a");c.href=r,c.download=t,c.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function Ni(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return bl(e,t)}async function Rl(e,t){if(!e)throw new Error("Video ID is required");return Pi(e,t)}async function Dl(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return wl(e,t)}async function Pl(e){if(!e)throw new Error("GUID is required");return Sl(e)}async function _l(e){if(!e)throw new Error("Video ID is required");return kl(e)}async function Ol(e){if(!e)throw new Error("Video ID is required");return xl(e)}async function Hl(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=Ms.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let o=await Hr(),a=new Map;for(let h of o)a.set(h.guid,h);let r=0,c=0,s=[];for(let[,h]of Object.entries(n.data)){let{video_id:m,timestamps:v}=h,f=0;for(let y of v){let E=a.get(y.guid);Nl(E,m,y)&&(s.push({guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),a.set(y.guid,{...E??{},guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),f++,c++)}f>0&&r++}return await _i(s),{mergedVideos:r,mergedTimestamps:c}}function Ll(e,t){return JSON.stringify([e,t.start,t.comment,t.deleted_at??null])}function Nl(e,t,n){return e?e.write_counter===void 0||n.write_counter===void 0?!1:n.write_counter!==e.write_counter?n.write_counter>e.write_counter:Ll(t,n)>Ll(e.video_id,e):!0}async function zl(e){let t=[];for(let n of await Tl(e)){let o=hn.safeParse(n);if(!o.success||o.data.write_counter===void 0)continue;let{guid:a,video_id:r,start:c,comment:s,write_counter:h,deleted_at:m}=o.data;t.push({guid:a,video_id:r,start:c,comment:s,write_counter:h,...m!==void 0?{deleted_at:m}:{}})}return t}async function Gl(e){let t=new Map;for(let a of await Al(e.map(r=>r.guid)))t.set(a.guid,a);let n=[],o=new Set;for(let a of e)Nl(t.get(a.guid),a.video_id,a)&&(n.push(a),o.add(a.video_id));return await _i(n,{silent:!0}),{mergedVideos:o.size,mergedTimestamps:n.length}}function Fl(e,t){if(!e)throw new Error("Setting key is required");return El(e,t)}async function Ul(e){if(!e)throw new Error("Setting key is required");return Ml(e)}function kp(e,t){return Ni(e,t)}function Tp(e,t){return Rl(e,t)}function Ap(e,t){return Dl(e,t)}function Ep(e,t){return Ni(e,t)}function zi(e){return Ol(e)}function Mp(e,t){return Pl(t)}function Ip(e){return _l(e)}function wn(e,t){return Fl(e,t)}function Yt(e){return Ul(e)}function Lp(e){return Oi(e)}function Cp(){return Cl()}function Bp(){return Hi()}function Rp(){return Bl()}function Dp(e){return Hl(e)}function Gi(e){return zl(e)}function Fi(e){return Gl(e)}function Ui(e){return vl(e)}function zr(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function Gr(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Vi(e,t){if(!e)return;Gr(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function Vl(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function Co(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function ql(e,t){if(!e)return;Gr(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
    color: #ff4d4f;
    text-align: center;
    padding: 16px;
    background: rgba(255, 0, 0, 0.08);
    border: 1px solid rgba(255, 77, 79, 0.3);
    border-radius: 6px;
    margin: 8px;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.5;
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${Pp(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function jl(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Pp(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function $l(e,t){if(!e||t||Co(e))return;Array.from(e.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||Vi(e,"No timestamps for this video")}function Wl(e){if(!e)return[];let t=zr(e),n=[];return t.forEach(o=>{let a=o.querySelector("[data-time]"),r=o.querySelector("input"),c=o.dataset.guid;if(!a||!r||!c)return;let s=a.dataset.time;if(!s)return;let h=Number.parseInt(s,10);Number.isFinite(h)&&n.push({guid:c,start:h,comment:r.value})}),n.sort((o,a)=>o.start-a.start)}function Yl(e){if(!e)return 0;let t=zr(e),n=0;return t.forEach(o=>{let r=o.querySelector("[data-time]")?.dataset.time;if(r){let c=Number.parseInt(r,10);Number.isFinite(c)&&(n=Math.max(n,c))}}),n}var Op={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},syncAuthState:Yn,autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1,autoBackupFailed:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},st=JSON.parse(JSON.stringify(Op));function lt(){return st}function Fr(e){st={...st,...e,auth:{...st.auth,...e.auth||{}},ui:{...st.ui,...e.ui||{}},timestamps:{...st.timestamps,...e.timestamps||{}}}}function Kt(e,t){Fr({auth:{...st.auth,[e]:t}})}function Ur(e,t){Fr({ui:{...st.ui,[e]:t}})}function Ht(){return st.auth.googleAuthState}function Mt(e){Kt("googleAuthState",e)}function Kl(){return st.auth.syncAuthState}function Zn(e){Kt("syncAuthState",e)}function qi(e){Kt("autoBackupEnabled",e)}function ji(e){Kt("autoBackupIntervalMinutes",e)}function $i(e){Kt("isAutoBackupRunning",e)}function Vr(e){Kt("autoBackupFailed",e)}function Bo(e){Kt("autoBackupRetryAttempts",e)}function eo(e){Kt("autoBackupBackoffMs",e)}function Wi(e){Kt("lastAutoBackupAt",e)}function Xl(e){Ur("minPaneHeight",e)}function Jl(e){Ur("panePosition",e)}function Ql(e){Ur("lastHandledUrl",e)}function Zl(e){Ur("urlChangeHandlersSetup",e)}function ec(e){Fr({timestamps:{...st.timestamps,items:e}})}function Yi(e){Fr({timestamps:{...st.timestamps,dbError:e}})}function tc(){return st.timestamps.dbError}var Pn=typeof unsafeWindow<"u"?unsafeWindow:window,sc=43200*14,nc="html5_max_live_dvr_window_plus_margin_secs";function Xt(e){return e!=null&&typeof e=="object"}function oc(e){let{streamingData:t,videoDetails:n,playerConfig:o,microformat:a}=e;if(!Xt(n)||!n.isLive)return;let r=n.isLiveDvrEnabled===!0;if(n.isLiveDvrEnabled=!0,!r&&Xt(o)){let c=o.mediaCommonConfig;if(Xt(c)){c.useServerDrivenAbr=!1;let s=c.serverPlaybackStartConfig;Xt(s)&&(s.enable=!1)}}if(Xt(t)){let c=t;if(Array.isArray(c.adaptiveFormats)&&Hp(a))for(let s of c.adaptiveFormats)s.maxDvrDurationSec=sc}}function Hp(e){if(!Xt(e))return!1;let t=e.playerMicroformatRenderer;if(!Xt(t))return!1;let n=t.liveBroadcastDetails;if(!Xt(n))return!1;let o=n.startTimestamp;return!o||typeof o!="string"?!1:(Date.now()-new Date(o).getTime())/1e3>43200}function Xi(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(oc(t),!0):t.playerResponse&&Xt(t.playerResponse)&&t.playerResponse.videoDetails?(oc(t.playerResponse),!0):!1}function Np(){let e=Object.getOwnPropertyDescriptor(Pn,"ytInitialPlayerResponse"),t=e&&e.set,n=Pn.ytInitialPlayerResponse;if(!Xi(n))try{Object.defineProperty(Pn,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(o){t&&t.call(this,o),n=o,Xi(o)&&Object.defineProperty(Pn,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:o})}})}catch{}}var rc=!1;function zp(){if(rc)return;rc=!0;let e=JSON.parse;JSON.parse=function(t,n){let o=e.call(this,t,n);try{Xi(o)}catch{}return o}}function ic(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let o=n;for(let a in o){let r=o[a];if(r&&typeof r.serializedExperimentFlags=="string"){let c=r.serializedExperimentFlags,s=c.replace(new RegExp(`${nc}=[\\d.]+`),`${nc}=${sc}`);s!==c&&(r.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function ac(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let o=t.apply(this,n);try{ic(e)}catch{}return o});try{ic(e)}catch{}return e}function Gp(){let e={};Pn.ytcfg&&(e=ac(Pn.ytcfg));try{Object.defineProperty(Pn,"ytcfg",{configurable:!0,get(){return e},set(t){e=ac(t)}})}catch{}}function lc(){Np(),zp(),Gp(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var Fp="BADGE_STYLE_TYPE_MEMBERS_ONLY";function Ro(e){return typeof e=="object"&&e!==null}function cc(e,t=0){return!Ro(e)||t>8?!1:e.style===Fp?!0:Object.values(e).some(n=>cc(n,t+1))}function uc(e,t){let n=Ro(t)?t.videoDetails:void 0;if(!Ro(n)||typeof n.videoId!="string"||typeof n.channelId!="string")return null;let o=e?.contents?.twoColumnWatchNextResults?.results?.results?.contents;if(!Array.isArray(o))return null;let a=o.find(r=>Ro(r)&&Ro(r.videoPrimaryInfoRenderer));return a?{videoId:n.videoId,channelId:n.channelId,membersOnly:cc(a.videoPrimaryInfoRenderer)}:null}var Ji="#author-name, #author-text";function dc(){return window.top!==window.self&&window.location.pathname.startsWith("/live_chat")}function Qi(e){let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=t.nextNode();n;n=t.nextNode()){let o=n.nodeValue??"";if(o.trim()){/^\s*@/.test(o)&&(n.nodeValue=o.replace(/^(\s*)@/,"$1"));return}}}function Zi(e){if(e.nodeType===Node.TEXT_NODE){let t=e.parentElement?.closest(Ji);t&&Qi(t);return}e instanceof Element&&(e.matches(Ji)&&Qi(e),e.querySelectorAll(Ji).forEach(Qi))}function pc(){let e=new MutationObserver(t=>{for(let n of t)n.type==="characterData"?Zi(n.target):n.addedNodes.forEach(Zi)});document.documentElement&&Zi(document.documentElement),e.observe(document,{childList:!0,subtree:!0,characterData:!0})}var he=Uint8Array,ct=Uint16Array,ua=Int32Array,qr=new he([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),jr=new he([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ra=new he([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),wc=function(e,t){for(var n=new ct(31),o=0;o<31;++o)n[o]=t+=1<<e[o-1];for(var a=new ua(n[30]),o=1;o<30;++o)for(var r=n[o];r<n[o+1];++r)a[r]=r-n[o]<<5|o;return{b:n,r:a}},bc=wc(qr,2),Sc=bc.b,ia=bc.r;Sc[28]=258,ia[258]=28;var xc=wc(jr,0),Up=xc.b,mc=xc.r,aa=new ct(32768);for(X=0;X<32768;++X)Jt=(X&43690)>>1|(X&21845)<<1,Jt=(Jt&52428)>>2|(Jt&13107)<<2,Jt=(Jt&61680)>>4|(Jt&3855)<<4,aa[X]=((Jt&65280)>>8|(Jt&255)<<8)>>1;var Jt,X,zt=(function(e,t,n){for(var o=e.length,a=0,r=new ct(t);a<o;++a)e[a]&&++r[e[a]-1];var c=new ct(t);for(a=1;a<t;++a)c[a]=c[a-1]+r[a-1]<<1;var s;if(n){s=new ct(1<<t);var h=15-t;for(a=0;a<o;++a)if(e[a])for(var m=a<<4|e[a],v=t-e[a],f=c[e[a]-1]++<<v,y=f|(1<<v)-1;f<=y;++f)s[aa[f]>>h]=m}else for(s=new ct(o),a=0;a<o;++a)e[a]&&(s[a]=aa[c[e[a]-1]++]>>15-e[a]);return s}),bn=new he(288);for(X=0;X<144;++X)bn[X]=8;var X;for(X=144;X<256;++X)bn[X]=9;var X;for(X=256;X<280;++X)bn[X]=7;var X;for(X=280;X<288;++X)bn[X]=8;var X,_o=new he(32);for(X=0;X<32;++X)_o[X]=5;var X,Vp=zt(bn,9,0),qp=zt(bn,9,1),jp=zt(_o,5,0),$p=zt(_o,5,1),ea=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},It=function(e,t,n){var o=t/8|0;return(e[o]|e[o+1]<<8)>>(t&7)&n},ta=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},da=function(e){return(e+7)/8|0},Oo=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new he(e.subarray(t,n))};var Wp=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Fe=function(e,t,n){var o=new Error(t||Wp[e]);if(o.code=e,Error.captureStackTrace&&Error.captureStackTrace(o,Fe),!n)throw o;return o},Yp=function(e,t,n,o){var a=e.length,r=o?o.length:0;if(!a||t.f&&!t.l)return n||new he(0);var c=!n,s=c||t.i!=2,h=t.i;c&&(n=new he(a*3));var m=function(rt){var Y=n.length;if(rt>Y){var Gt=new he(Math.max(Y*2,rt));Gt.set(n),n=Gt}},v=t.f||0,f=t.p||0,y=t.b||0,E=t.l,I=t.d,P=t.m,G=t.n,q=a*8;do{if(!E){v=It(e,f,1);var ee=It(e,f+1,3);if(f+=3,ee)if(ee==1)E=qp,I=$p,P=9,G=5;else if(ee==2){var ge=It(e,f,31)+257,de=It(e,f+10,15)+4,F=ge+It(e,f+5,31)+1;f+=14;for(var R=new he(F),me=new he(19),oe=0;oe<de;++oe)me[ra[oe]]=It(e,f+oe*3,7);f+=de*3;for(var xe=ea(me),Ye=(1<<xe)-1,Pe=zt(me,xe,1),oe=0;oe<F;){var _e=Pe[It(e,f,Ye)];f+=_e&15;var O=_e>>4;if(O<16)R[oe++]=O;else{var Te=0,se=0;for(O==16?(se=3+It(e,f,3),f+=2,Te=R[oe-1]):O==17?(se=3+It(e,f,7),f+=3):O==18&&(se=11+It(e,f,127),f+=7);se--;)R[oe++]=Te}}var Oe=R.subarray(0,ge),Ae=R.subarray(ge);P=ea(Oe),G=ea(Ae),E=zt(Oe,P,1),I=zt(Ae,G,1)}else Fe(1);else{var O=da(f)+4,j=e[O-4]|e[O-3]<<8,ae=O+j;if(ae>a){h&&Fe(0);break}s&&m(y+j),n.set(e.subarray(O,ae),y),t.b=y+=j,t.p=f=ae*8,t.f=v;continue}if(f>q){h&&Fe(0);break}}s&&m(y+131072);for(var Lt=(1<<P)-1,Ee=(1<<G)-1,ye=f;;ye=f){var Te=E[ta(e,f)&Lt],ve=Te>>4;if(f+=Te&15,f>q){h&&Fe(0);break}if(Te||Fe(2),ve<256)n[y++]=ve;else if(ve==256){ye=f,E=null;break}else{var le=ve-254;if(ve>264){var oe=ve-257,ce=qr[oe];le=It(e,f,(1<<ce)-1)+Sc[oe],f+=ce}var ot=I[ta(e,f)&Ee],tn=ot>>4;ot||Fe(3),f+=ot&15;var Ae=Up[tn];if(tn>3){var ce=jr[tn];Ae+=ta(e,f)&(1<<ce)-1,f+=ce}if(f>q){h&&Fe(0);break}s&&m(y+131072);var nn=y+le;if(y<Ae){var An=r-Ae,Be=Math.min(Ae,nn);for(An+y<0&&Fe(3);y<Be;++y)n[y]=o[An+y]}for(;y<nn;++y)n[y]=n[y-Ae]}}t.l=E,t.p=ye,t.b=y,t.f=v,E&&(v=1,t.m=P,t.d=I,t.n=G)}while(!v);return y!=n.length&&c?Oo(n,0,y):n.subarray(0,y)},Qt=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8},Do=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8,e[o+2]|=n>>16},na=function(e,t){for(var n=[],o=0;o<e.length;++o)e[o]&&n.push({s:o,f:e[o]});var a=n.length,r=n.slice();if(!a)return{t:Tc,l:0};if(a==1){var c=new he(n[0].s+1);return c[n[0].s]=1,{t:c,l:1}}n.sort(function(ae,ge){return ae.f-ge.f}),n.push({s:-1,f:25001});var s=n[0],h=n[1],m=0,v=1,f=2;for(n[0]={s:-1,f:s.f+h.f,l:s,r:h};v!=a-1;)s=n[n[m].f<n[f].f?m++:f++],h=n[m!=v&&n[m].f<n[f].f?m++:f++],n[v++]={s:-1,f:s.f+h.f,l:s,r:h};for(var y=r[0].s,o=1;o<a;++o)r[o].s>y&&(y=r[o].s);var E=new ct(y+1),I=sa(n[v-1],E,0);if(I>t){var o=0,P=0,G=I-t,q=1<<G;for(r.sort(function(ge,de){return E[de.s]-E[ge.s]||ge.f-de.f});o<a;++o){var ee=r[o].s;if(E[ee]>t)P+=q-(1<<I-E[ee]),E[ee]=t;else break}for(P>>=G;P>0;){var O=r[o].s;E[O]<t?P-=1<<t-E[O]++-1:++o}for(;o>=0&&P;--o){var j=r[o].s;E[j]==t&&(--E[j],++P)}I=t}return{t:new he(E),l:I}},sa=function(e,t,n){return e.s==-1?Math.max(sa(e.l,t,n+1),sa(e.r,t,n+1)):t[e.s]=n},fc=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new ct(++t),o=0,a=e[0],r=1,c=function(h){n[o++]=h},s=1;s<=t;++s)if(e[s]==a&&s!=t)++r;else{if(!a&&r>2){for(;r>138;r-=138)c(32754);r>2&&(c(r>10?r-11<<5|28690:r-3<<5|12305),r=0)}else if(r>3){for(c(a),--r;r>6;r-=6)c(8304);r>2&&(c(r-3<<5|8208),r=0)}for(;r--;)c(a);r=1,a=e[s]}return{c:n.subarray(0,o),n:t}},Po=function(e,t){for(var n=0,o=0;o<t.length;++o)n+=e[o]*t[o];return n},kc=function(e,t,n){var o=n.length,a=da(t+2);e[a]=o&255,e[a+1]=o>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var r=0;r<o;++r)e[a+r+4]=n[r];return(a+4+o)*8},hc=function(e,t,n,o,a,r,c,s,h,m,v){Qt(t,v++,n),++a[256];for(var f=na(a,15),y=f.t,E=f.l,I=na(r,15),P=I.t,G=I.l,q=fc(y),ee=q.c,O=q.n,j=fc(P),ae=j.c,ge=j.n,de=new ct(19),F=0;F<ee.length;++F)++de[ee[F]&31];for(var F=0;F<ae.length;++F)++de[ae[F]&31];for(var R=na(de,7),me=R.t,oe=R.l,xe=19;xe>4&&!me[ra[xe-1]];--xe);var Ye=m+5<<3,Pe=Po(a,bn)+Po(r,_o)+c,_e=Po(a,y)+Po(r,P)+c+14+3*xe+Po(de,me)+2*de[16]+3*de[17]+7*de[18];if(h>=0&&Ye<=Pe&&Ye<=_e)return kc(t,v,e.subarray(h,h+m));var Te,se,Oe,Ae;if(Qt(t,v,1+(_e<Pe)),v+=2,_e<Pe){Te=zt(y,E,0),se=y,Oe=zt(P,G,0),Ae=P;var Lt=zt(me,oe,0);Qt(t,v,O-257),Qt(t,v+5,ge-1),Qt(t,v+10,xe-4),v+=14;for(var F=0;F<xe;++F)Qt(t,v+3*F,me[ra[F]]);v+=3*xe;for(var Ee=[ee,ae],ye=0;ye<2;++ye)for(var ve=Ee[ye],F=0;F<ve.length;++F){var le=ve[F]&31;Qt(t,v,Lt[le]),v+=me[le],le>15&&(Qt(t,v,ve[F]>>5&127),v+=ve[F]>>12)}}else Te=Vp,se=bn,Oe=jp,Ae=_o;for(var F=0;F<s;++F){var ce=o[F];if(ce>255){var le=ce>>18&31;Do(t,v,Te[le+257]),v+=se[le+257],le>7&&(Qt(t,v,ce>>23&31),v+=qr[le]);var ot=ce&31;Do(t,v,Oe[ot]),v+=Ae[ot],ot>3&&(Do(t,v,ce>>5&8191),v+=jr[ot])}else Do(t,v,Te[ce]),v+=se[ce]}return Do(t,v,Te[256]),v+se[256]},Kp=new ua([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Tc=new he(0),Xp=function(e,t,n,o,a,r){var c=r.z||e.length,s=new he(o+c+5*(1+Math.ceil(c/7e3))+a),h=s.subarray(o,s.length-a),m=r.l,v=(r.r||0)&7;if(t){v&&(h[0]=r.r>>3);for(var f=Kp[t-1],y=f>>13,E=f&8191,I=(1<<n)-1,P=r.p||new ct(32768),G=r.h||new ct(I+1),q=Math.ceil(n/3),ee=2*q,O=function(ao){return(e[ao]^e[ao+1]<<q^e[ao+2]<<ee)&I},j=new ua(25e3),ae=new ct(288),ge=new ct(32),de=0,F=0,R=r.i||0,me=0,oe=r.w||0,xe=0;R+2<c;++R){var Ye=O(R),Pe=R&32767,_e=G[Ye];if(P[Pe]=_e,G[Ye]=Pe,oe<=R){var Te=c-R;if((de>7e3||me>24576)&&(Te>423||!m)){v=hc(e,h,0,j,ae,ge,F,me,xe,R-xe,v),me=de=F=0,xe=R;for(var se=0;se<286;++se)ae[se]=0;for(var se=0;se<30;++se)ge[se]=0}var Oe=2,Ae=0,Lt=E,Ee=Pe-_e&32767;if(Te>2&&Ye==O(R-Ee))for(var ye=Math.min(y,Te)-1,ve=Math.min(32767,R),le=Math.min(258,Te);Ee<=ve&&--Lt&&Pe!=_e;){if(e[R+Oe]==e[R+Oe-Ee]){for(var ce=0;ce<le&&e[R+ce]==e[R+ce-Ee];++ce);if(ce>Oe){if(Oe=ce,Ae=Ee,ce>ye)break;for(var ot=Math.min(Ee,ce-2),tn=0,se=0;se<ot;++se){var nn=R-Ee+se&32767,An=P[nn],Be=nn-An&32767;Be>tn&&(tn=Be,_e=nn)}}}Pe=_e,_e=P[Pe],Ee+=Pe-_e&32767}if(Ae){j[me++]=268435456|ia[Oe]<<18|mc[Ae];var rt=ia[Oe]&31,Y=mc[Ae]&31;F+=qr[rt]+jr[Y],++ae[257+rt],++ge[Y],oe=R+Oe,++de}else j[me++]=e[R],++ae[e[R]]}}for(R=Math.max(R,oe);R<c;++R)j[me++]=e[R],++ae[e[R]];v=hc(e,h,m,j,ae,ge,F,me,xe,R-xe,v),m||(r.r=v&7|h[v/8|0]<<3,v-=7,r.h=G,r.p=P,r.i=R,r.w=oe)}else{for(var R=r.w||0;R<c+m;R+=65535){var Gt=R+65535;Gt>=c&&(h[v/8|0]=m,Gt=c),v=kc(h,v+1,e.subarray(R,Gt))}r.i=c}return Oo(s,0,o+da(v)+a)},Jp=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,o=9;--o;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),Qp=function(){var e=-1;return{p:function(t){for(var n=e,o=0;o<t.length;++o)n=Jp[n&255^t[o]]^n>>>8;e=n},d:function(){return~e}}};var Zp=function(e,t,n,o,a){if(!a&&(a={l:1},t.dictionary)){var r=t.dictionary.subarray(-32768),c=new he(r.length+e.length);c.set(r),c.set(e,r.length),e=c,a.w=r.length}return Xp(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,o,a)},Ac=function(e,t){var n={};for(var o in e)n[o]=e[o];for(var o in t)n[o]=t[o];return n};var Nt=function(e,t){return e[t]|e[t+1]<<8},ft=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},oa=function(e,t){return ft(e,t)+ft(e,t+4)*4294967296},ze=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function em(e,t){return Zp(e,t||{},0,0)}function tm(e,t){return Yp(e,{i:2},t&&t.out,t&&t.dictionary)}var Ec=function(e,t,n,o){for(var a in e){var r=e[a],c=t+a,s=o;Array.isArray(r)&&(s=Ac(o,r[1]),r=r[0]),ArrayBuffer.isView(r)?n[c]=[r,s]:(n[c+="/"]=[new he(0),s],Ec(r,c,n,o))}},gc=typeof TextEncoder<"u"&&new TextEncoder,la=typeof TextDecoder<"u"&&new TextDecoder,nm=0;try{la.decode(Tc,{stream:!0}),nm=1}catch{}var om=function(e){for(var t="",n=0;;){var o=e[n++],a=(o>127)+(o>223)+(o>239);if(n+a>e.length)return{s:t,r:Oo(e,n-1)};a?a==3?(o=((o&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|o>>10,56320|o&1023)):a&1?t+=String.fromCharCode((o&31)<<6|e[n++]&63):t+=String.fromCharCode((o&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(o)}};function yc(e,t){if(t){for(var n=new he(e.length),o=0;o<e.length;++o)n[o]=e.charCodeAt(o);return n}if(gc)return gc.encode(e);for(var a=e.length,r=new he(e.length+(e.length>>1)),c=0,s=function(v){r[c++]=v},o=0;o<a;++o){if(c+5>r.length){var h=new he(c+8+(a-o<<1));h.set(r),r=h}var m=e.charCodeAt(o);m<128||t?s(m):m<2048?(s(192|m>>6),s(128|m&63)):m>55295&&m<57344?(m=65536+(m&1047552)|e.charCodeAt(++o)&1023,s(240|m>>18),s(128|m>>12&63),s(128|m>>6&63),s(128|m&63)):(s(224|m>>12),s(128|m>>6&63),s(128|m&63))}return Oo(r,0,c)}function rm(e,t){if(t){for(var n="",o=0;o<e.length;o+=16384)n+=String.fromCharCode.apply(null,e.subarray(o,o+16384));return n}else{if(la)return la.decode(e);var a=om(e),r=a.s,n=a.r;return n.length&&Fe(8),r}}var im=function(e,t){return t+30+Nt(e,t+26)+Nt(e,t+28)},am=function(e,t,n){var o=Nt(e,t+28),a=Nt(e,t+30),r=rm(e.subarray(t+46,t+46+o),!(Nt(e,t+8)&2048)),c=t+46+o,s=sm(e,c,a,n,ft(e,t+20),ft(e,t+24),ft(e,t+42)),h=s[0],m=s[1],v=s[2];return[Nt(e,t+10),h,m,r,c+a+Nt(e,t+32),v]},sm=function(e,t,n,o,a,r,c){var s=a==4294967295,h=r==4294967295,m=c==4294967295,v=t+n,f=s+h+m;if(o&&f){for(;t+4<v;t+=4+Nt(e,t+2))if(Nt(e,t)==1)return[s?oa(e,t+4+8*h):a,h?oa(e,t+4):r,m?oa(e,t+4+8*(h+s)):c,1];o<2&&Fe(13)}return[a,r,c,0]},ca=function(e){var t=0;if(e)for(var n in e){var o=e[n].length;o>65535&&Fe(9),t+=o+4}return t},vc=function(e,t,n,o,a,r,c,s){var h=o.length,m=n.extra,v=s&&s.length,f=ca(m);ze(e,t,c!=null?33639248:67324752),t+=4,c!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(r<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),E=y.getFullYear()-1980;if((E<0||E>119)&&Fe(10),ze(e,t,E<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),t+=4,r!=-1&&(ze(e,t,n.crc),ze(e,t+4,r<0?-r-2:r),ze(e,t+8,n.size)),ze(e,t+12,h),ze(e,t+14,f),t+=16,c!=null&&(ze(e,t,v),ze(e,t+6,n.attrs),ze(e,t+10,c),t+=14),e.set(o,t),t+=h,f)for(var I in m){var P=m[I],G=P.length;ze(e,t,+I),ze(e,t+2,G),e.set(P,t+4),t+=4+G}return v&&(e.set(s,t),t+=v),t},lm=function(e,t,n,o,a){ze(e,t,101010256),ze(e,t+8,n),ze(e,t+10,n),ze(e,t+12,o),ze(e,t+16,a)};function Mc(e,t){t||(t={});var n={},o=[];Ec(e,"",n,t);var a=0,r=0;for(var c in n){var s=n[c],h=s[0],m=s[1],v=m.level==0?0:8,f=yc(c),y=f.length,E=m.comment,I=E&&yc(E),P=I&&I.length,G=ca(m.extra);y>65535&&Fe(11);var q=v?em(h,m):h,ee=q.length,O=Qp();O.p(h),o.push(Ac(m,{size:h.length,crc:O.d(),c:q,f,m:I,u:y!=c.length||I&&E.length!=P,o:a,compression:v})),a+=30+y+G+ee,r+=76+2*(y+G)+(P||0)+ee}for(var j=new he(r+22),ae=a,ge=r-a,de=0;de<o.length;++de){var f=o[de];vc(j,f.o,f,f.f,f.u,f.c.length);var F=30+f.f.length+ca(f.extra);j.set(f.c,f.o+F),vc(j,a,f,f.f,f.u,f.c.length,f.o,f.m),a+=16+F+(f.m?f.m.length:0)}return lm(j,a,o.length,ge,ae),j}function Ic(e,t){for(var n={},o=e.length-22;ft(e,o)!=101010256;--o)(!o||e.length-o>65558)&&Fe(13);var a=Nt(e,o+8);if(!a)return{};var r=ft(e,o+16),c=ft(e,o-20)==117853008;if(c){var s=ft(e,o-12);c=ft(e,s)==101075792,c&&(a=ft(e,s+32),r=ft(e,s+48))}for(var h=t&&t.filter,m=0;m<a;++m){var v=am(e,r,c),f=v[0],y=v[1],E=v[2],I=v[3],P=v[4],G=v[5],q=im(e,G);r=P,(!h||h({name:I,size:y,originalSize:E,compression:f}))&&(f?f==8?n[I]=tm(e.subarray(q,q+y),{out:new he(E)}):Fe(14,"unknown compression type "+f):n[I]=Oo(e,q,q+y))}return n}var ei="https://devel.kamotimestamps.com",_c="308989572223-cdnvpn65mc51oqneu7po3og51uf5ahsb.apps.googleusercontent.com",cm="https://www.youtube.com/",Oc="timekeeper_sync_auth",Hc="timekeeper_sync_oauth",_n="syncAuthState",Nc="syncCursors",um=500,dm=5e3,Lc=200,pm=500,mm=60*1e3,fm=60*1e3,hm=300*1e3;function Hn(){return!!(ei&&_c)}var zc=Se({accessToken:W(),accessTokenExpiresAt:Ce({finite:!0}),refreshToken:W(),user:Se({id:W(),email:W(),displayName:Ze(W())})}),gm=Se({records:hn.array(),seq:Ce({int:!0,nonnegative:!0}),hasMore:_t()}),ym=Se({known:_t(),membersOnly:Ze(_t()),channelId:Ze(W())}),vm=Se({rejected:hn.array(),fromSeq:Ce({int:!0,nonnegative:!0}),seq:Ce({int:!0,nonnegative:!0})}),wm=Se({type:W(),seq:be(Ce({int:!0,nonnegative:!0})),fromSeq:be(Ce({int:!0,nonnegative:!0})),records:be(hn.array())}),bm=Se({type:W(),idToken:be(W()),error:be(W())}),xn=class extends Error{},Xr=class extends Error{constructor(n,o){super(o);this.httpStatus=n}},Sm=e=>e instanceof Xr&&e.httpStatus>=400&&e.httpStatus<500&&e.httpStatus!==408&&e.httpStatus!==429,Ho="signed-out",Wr="",Jr="idle",ma=null,no=new Set,Gc=new Map,zo=new Map,ut=!0,Zt=null,Sn=null,ti=0,to=null,Cc=0,en=!0,No=null,va=0,fa=null,Bc=!1,$e={pushCounter:0,pullSeq:0},wa=new Map,Rc=Promise.resolve(),Yr=!1,$r=null,Qr="",pa=!1,ni=null,Fc=null,ha=null,Kr=null,Uc=null;function We(){return Kl()}function Vc(e){Fc=e}function qc(e){ha=e}function jc(e){Kr=e}function $c(e){Uc=e}var Wc="#52c41a",Yc="#ff4d4f",On="#ffa500";function Go(){let e=We();if(ha){let t=ha;if(t.style.fontWeight="bold",t.onmouseenter=null,t.onmouseleave=null,!Hn())K(t,"alert-triangle","Sync backend is not configured in this build"),t.style.color=On;else if(!e.isSignedIn)K(t,"circle-x","Not signed in"),t.style.color=Yc;else{K(t,"circle-check","Signed in"),t.style.color=Wc;let n=e.userName;n&&(t.onmouseenter=()=>K(t,"circle-check",`Signed in as ${n}`),t.onmouseleave=()=>K(t,"circle-check","Signed in"))}}if(Kr){let{text:t,color:n}=Kc(e);Kr.textContent=t,Kr.style.color=n}Uc?.(),Xc?.()}function Kc(e=We()){if(Ho==="error")return{text:Wr||"Sync error",color:Yc,busy:!1};if(Ho==="connecting")return{text:Wr||"Connecting\u2026",color:On,busy:!0};if(e.isSignedIn&&Ho==="offline")return{text:Wr||"Offline. Retrying\u2026",color:On,busy:!1};if(e.isSignedIn&&Ho==="online"){if(Jr==="failed")return{text:"Sync failed. Retrying\u2026",color:On,busy:!1};let t=Jr==="running",n=t?"Syncing\u2026":"Live sync on";return!t&&ma&&(n+=` \xB7 last synced ${new Date(ma).toLocaleTimeString()}`),!t&&no.size>0?(n+=` \xB7 ${no.size} timestamp${no.size===1?"":"s"} could not be synced`,{text:n,color:On,busy:!1}):{text:n,color:t?On:Wc,busy:t}}return{text:"",color:"#aaa",busy:!1}}var xm="#4285f4";function oi(){if(!Hn()||!We().isSignedIn)return null;let{text:e,color:t,busy:n}=Kc();return e?{color:n?xm:t,tooltip:`Sync: ${e}`}:{color:On,tooltip:"Sync: starting\u2026"}}var Xc=null;function Jc(e){Xc=e}function ht(e,t=""){Ho=e,Wr=t,Go()}function Dc(e){Jr=e,Go()}function Qc(){return typeof GM<"u"&&GM&&typeof GM.getValue=="function"&&typeof GM.setValue=="function"?GM:null}async function Zc(){let e=Qc();if(!e)return Yt(_n);let t=await e.getValue(_n);if(t!=null)return t;let n=await Yt(_n);return n&&(await e.setValue(_n,n),await wn(_n,null)),n??void 0}async function ri(){try{let e=Qc();e?await e.setValue(_n,We()):await wn(_n,We())}catch(e){l("Failed to save sync auth state:",e,"error")}}function Fo(){wn(Nc,{userId:We().userId,...$e})}async function km(){let e=await Yt(Nc);e&&e.userId===We().userId&&typeof e.pushCounter=="number"&&typeof e.pullSeq=="number"?$e={pushCounter:e.pushCounter,pullSeq:e.pullSeq}:$e={pushCounter:0,pullSeq:0}}function ba(e,t){return fetch(`${ei}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function eu(e){ni=null,Zn({isSignedIn:!0,accessToken:e.accessToken,accessTokenExpiresAt:e.accessTokenExpiresAt,refreshToken:e.refreshToken,userId:e.user.id,userName:e.user.displayName,email:e.user.email})}var tu=e=>!!e.accessToken&&e.accessToken!==ni&&!!e.accessTokenExpiresAt&&e.accessTokenExpiresAt-Date.now()>mm;async function Tm(e){return typeof navigator<"u"&&navigator.locks?await navigator.locks.request("timekeeper-sync-refresh",e):e()}async function Am(){let e=await Zc();if(e==null)return;let t=Ii.safeParse(e);t.success&&Zn(t.data)}function Em(){return $r??($r=Tm(async()=>{await Am();let e=We();if(!e.isSignedIn||!e.refreshToken)throw new xn("Not signed in");if(tu(e))return e.accessToken;let t=await ba("/auth/refresh",{refreshToken:e.refreshToken});if(t.status===401)throw new xn("Session expired");if(!t.ok)throw new Error(`Token refresh failed (HTTP ${t.status})`);let n=zc.safeParse(await t.json());if(!n.success)throw new Error("Unexpected token refresh response");return eu(n.data),await ri(),n.data.accessToken}).finally(()=>{$r=null})),$r}async function nu(){let e=We();if(!e.isSignedIn||!e.refreshToken)throw new xn("Not signed in");return tu(e)?e.accessToken:Em()}async function ou(e,t,n=!0){let o=await nu(),a=await fetch(`${ei}${e}`,{method:t.method,headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:t.body===void 0?void 0:JSON.stringify(t.body)});if(a.status===401){if(!n)throw new xn("Session expired");return ni=o,ou(e,t,!1)}return a}async function Zr(e,t,n){let o=await ou(e,t);if(!o.ok)throw new Xr(o.status,`${t.method} ${e} failed (HTTP ${o.status})`);let a=n.safeParse(await o.json());if(!a.success)throw new Error(`Unexpected response from ${e}`);return a.data}function Mm(e){try{let t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(t.padEnd(Math.ceil(t.length/4)*4,"=")))}catch{return null}}function Im(e,t,n){return new Promise((o,a)=>{let r=()=>{clearTimeout(c),e.close();try{t.close()}catch{}},c=setTimeout(()=>{r(),a(new Error("Sign-in timed out"))},hm);e.onmessage=s=>{let h=bm.safeParse(s.data);if(h.success){if(h.data.type==="timekeeper_sync_oauth_error")r(),a(new Error(h.data.error||"Google sign-in failed"));else if(h.data.type==="timekeeper_sync_oauth_token"&&h.data.idToken){if(Mm(h.data.idToken)?.nonce!==n)return;r(),o(h.data.idToken)}}}})}function ru(){let e=window.location.hash;if(!e||e.length<=1)return!1;let t=new URLSearchParams(e.substring(1));if(t.get("state")!==Oc)return!1;let n=t.get("id_token"),o=t.get("error_description")||t.get("error");if(!n&&!o)return!1;try{let a=new BroadcastChannel(Hc);a.postMessage(o?{type:"timekeeper_sync_oauth_error",error:o}:{type:"timekeeper_sync_oauth_token",idToken:n}),a.close()}catch(a){console.error("[Timekeeper] Failed to hand sync sign-in result to the opener:",a)}return history.replaceState&&history.replaceState(null,"",window.location.pathname+window.location.search),window.close(),!0}async function iu(){if(!Hn()){ht("error","Sync backend is not configured in this build");return}if(We().isSignedIn||pa)return;pa=!0,ht("connecting","Opening Google sign-in\u2026");let e=crypto.randomUUID(),t=new BroadcastChannel(Hc);try{let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",_c),n.searchParams.set("redirect_uri",cm),n.searchParams.set("response_type","id_token"),n.searchParams.set("scope","openid email profile"),n.searchParams.set("nonce",e),n.searchParams.set("state",Oc),n.searchParams.set("prompt","select_account");let o=window.open(n.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!o)throw new Error("Popup blocked. Please enable popups for YouTube.");ht("connecting","Waiting for Google sign-in\u2026");let a=await Im(t,o,e);ht("connecting","Signing in to Timekeeper Sync\u2026");let r=await ba("/auth/google",{idToken:a});if(!r.ok)throw new Error(r.status===401?"Google sign-in was rejected by the server":`Sign-in failed (HTTP ${r.status})`);let c=zc.safeParse(await r.json());if(!c.success)throw new Error("Unexpected response from the sync server");eu(c.data),await ri(),$e={pushCounter:0,pullSeq:0},Fo(),l(`Signed in to Timekeeper Sync as ${c.data.user.displayName??"an account with no display name"}`),await pu()}catch(n){t.close(),l("Sync sign-in failed:",n,"error"),ht("error",n instanceof Error?n.message:"Sign-in failed")}finally{pa=!1}}var ga=e=>`${e.channelId}:${e.membersOnly}`;function au(e){Gc.set(e.videoId,e),ut||Lm(e)}async function Lm(e){let t=ga(e);if(zo.get(e.videoId)!==t)try{if(!(await zi(e.videoId))?.some(a=>!a.deleted_at))return;let o=await Zr(`/videos/${encodeURIComponent(e.videoId)}/access`,{method:"GET"},ym);(!o.known||o.membersOnly!==e.membersOnly||o.channelId!==e.channelId)&&await Zr("/videos/access",{method:"POST",body:{videos:[e]}},Se({ok:_t()})),zo.set(e.videoId,t)}catch(n){l("Reporting the members-only status failed:",n,"warn")}}async function su(){let{refreshToken:e}=We();if(mu(),Zn(Yn),$e={pushCounter:0,pullSeq:0},wa.clear(),no.clear(),zo.clear(),await ri(),Fo(),ht("signed-out"),e&&Hn())try{await ba("/auth/logout",{refreshToken:e})}catch(t){l("Sync logout request failed:",t,"warn")}}function lu(){mu(),Zn(Yn),ri(),ht("error","Session expired. Please sign in again.")}function cu(e){let t=Rc.then(e);return Rc=t.catch(()=>{}),t}function oo(){ut||Yr||(Yr=!0,cu(async()=>{Yr=!1,await Rm()}).catch(e=>l("Sync: cycle crashed:",e,"error")))}async function Sa(e){if(e.length!==0){for(let t of e)wa.set(t.guid,t.write_counter??0);await Fi(e),Fc?.([...new Set(e.map(t=>t.video_id))])}}function uu(e,t){return e>$e.pullSeq?(en=!0,!1):(t>$e.pullSeq&&($e.pullSeq=t,Fo()),!0)}async function Cm(){for(;;){let e=await Zr(`/sync/pull?since=${$e.pullSeq}&limit=${pm}`,{method:"GET"},gm);await Sa(e.records);let t=e.seq!==$e.pullSeq;if($e.pullSeq=e.seq,Fo(),!e.hasMore||!t)return}}async function ya(e){try{let t=[...new Set(e.map(o=>o.video_id))].map(o=>Gc.get(o)).filter(o=>!!o&&zo.get(o.videoId)!==ga(o)),n=await Zr("/sync/push",{method:"POST",body:{deviceId:Qr,records:e,videos:t}},vm);for(let o of t)zo.set(o.videoId,ga(o));await Sa(n.rejected);for(let o of e)no.delete(o.guid);uu(n.fromSeq,n.seq)||oo()}catch(t){if(!Sm(t))throw t;if(e.length>1){let n=e.length>>1;await ya(e.slice(0,n)),await ya(e.slice(n));return}no.add(e[0].guid),l(`Sync: server refused timestamp ${e[0].guid}; leaving it local-only:`,t,"warn")}}async function Bm(){let e=await Gi($e.pushCounter);if(e.length===0)return;let t=e.filter(n=>(wa.get(n.guid)??0)<n.write_counter);for(let n=0;n<t.length;n+=Lc)await ya(t.slice(n,n+Lc));$e.pushCounter=Math.max($e.pushCounter,e[e.length-1].write_counter),Fo()}async function Rm(){if(ut)return;Dc("running");let e="idle";try{(en||!Zt)&&(await Cm(),en=!1),await Bm(),ma=Date.now(),va=0}catch(t){if(t instanceof xn){lu();return}l("Sync cycle failed:",t,"warn"),en=!0,e="failed",Dm()}finally{Dc(e)}}function du(e){return Math.min(fm,1e3*2**e)*(.5+Math.random()/2)}function Dm(){ut||No||(No=setTimeout(()=>{No=null,oo()},du(va++)))}function Pm(){if(ut)return;let e=Date.now();to?clearTimeout(to):Cc=e;let t=Math.max(0,Math.min(um,Cc+dm-e));to=setTimeout(()=>{to=null,oo()},t)}function xa(){ut||(en=!0,Zt||(ti=0,Sn&&clearTimeout(Sn),Sn=null,ka()),oo())}function Pc(){ut||Sn||(Sn=setTimeout(()=>{Sn=null,ka()},du(ti++)))}async function ka(){if(ut||Zt)return;ht("connecting");let e;try{e=await nu()}catch(n){return n instanceof xn?lu():(l("Sync: could not get an access token:",n,"warn"),ht("offline"),Pc())}if(ut||Zt)return;let t=new WebSocket(`${ei.replace(/^http/,"ws")}/sync/ws`);Zt=t,t.onopen=()=>t.send(JSON.stringify({type:"auth",token:e,deviceId:Qr})),t.onmessage=n=>{let o;try{o=JSON.parse(String(n.data))}catch{return}let a=wm.safeParse(o);if(a.success){if(a.data.type==="ready")ti=0,ht("online"),(a.data.seq===void 0||a.data.seq!==$e.pullSeq)&&(en=!0),oo();else if(a.data.type==="changes"&&a.data.records){let{fromSeq:r,seq:c,records:s}=a.data;cu(async()=>{await Sa(s),(r===void 0||c===void 0)&&(en=!0),(en||!uu(r,c))&&oo()}).catch(h=>l("Sync: failed to apply live changes:",h,"error"))}}},t.onclose=n=>{Zt===t&&(Zt=null),en=!0,!ut&&(n.code===4401&&(ni=e),ht("offline"),Pc())},t.onerror=()=>{}}async function pu(){if(ut){if(!Qr){let e=await Yt("device_id");Qr=typeof e=="string"&&e?e:crypto.randomUUID()}ut=!1,Jr="idle",va=0,ti=0,fa=Ui(Pm),Bc||(Bc=!0,window.addEventListener("online",()=>xa())),await ka()}}function mu(){ut=!0,fa?.(),fa=null;for(let t of[to,No,Sn])t&&clearTimeout(t);to=No=Sn=null,Yr=!1;let e=Zt;Zt=null;try{e?.close()}catch{}}async function fu(){if(!Hn()){Go();return}try{let e=Ii.safeParse(await Zc());e.success&&Zn(e.data);let t=We();t.isSignedIn&&t.refreshToken?(await km(),await pu()):ht("signed-out")}catch(e){l("Failed to load sync auth state:",e,"error")}}function gt(){return Ht()}var yt={get isSignedIn(){return Ht().isSignedIn},get accessToken(){return Ht().accessToken},get userName(){return Ht().userName},get email(){return Ht().email},set isSignedIn(e){let t=Ht();Mt({...t,isSignedIn:e})},set accessToken(e){let t=Ht();Mt({...t,accessToken:e})},set userName(e){let t=Ht();Mt({...t,userName:e})},set email(e){let t=Ht();Mt({...t,email:e})}};function $o(){return lt().auth.autoBackupEnabled}function kn(){return lt().auth.autoBackupIntervalMinutes}var Aa=null,Ue=null,te=null,Nn=null;function wu(e){Aa=e}function bu(e){Ue=e}function Su(e){te=e}function xu(e){Nn=e}var hu=!1;function ku(){if(!hu)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),hu=!0}catch{}}var Tu=null,Ea=null,Uo=null,Vo=null,Ma=null;function Au(e){Tu=e}function Eu(e){Ea=e}function Ia(e){Uo=e}function La(e){Vo=e}function Mu(e){Ma=e}var si="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Iu="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Lu="https://www.youtube.com/",Om=new Date(Date.UTC(2e3,0,1,0,0,0)),Hm=30*1e3,Nm=1800*1e3,gu=5,ai=null,Ve=null;async function Ca(){try{let e=await Vo("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=Mi.safeParse(e);if(n.success){let o=gt();Mt({...o,...n.data});let a=gt();a.isSignedIn&&a.accessToken&&l(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),io();let r=gt();r.isSignedIn&&r.accessToken&&await Tn(!0)}else if(e!==void 0){let o=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:o,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function Wo(){try{let e=gt(),t=Mi.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await Uo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function io(){Aa&&(Aa.style.display="none")}function nt(e,t){if(!te)return;if(te.style.fontWeight="bold",e==="authenticating"){ku(),te.style.color="#ffa500",te.replaceChildren();let o=document.createElement("span");o.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);te.appendChild(o),te.appendChild(a);return}if(e==="error"){K(te,"circle-x",t||"Authorization failed"),te.style.color="#ff4d4f",ke();return}let n=gt();n.isSignedIn?(K(te,"circle-check","Signed in"),te.style.color="#52c41a",te.removeAttribute("title"),n.userName?(te.onmouseenter=()=>{K(te,"circle-check",`Signed in as ${n.userName}`)},te.onmouseleave=()=>{K(te,"circle-check","Signed in")}):(te.onmouseenter=null,te.onmouseleave=null)):(K(te,"circle-x","Not signed in"),te.style.color="#ff4d4f",te.removeAttribute("title"),te.onmouseenter=null,te.onmouseleave=null),ke()}function zm(){te&&(ku(),te.classList.remove("tk-auth-blink"),te.offsetWidth,te.classList.add("tk-auth-blink"),setTimeout(()=>{te.classList.remove("tk-auth-blink")},1200))}function Cu(e,t=300*1e3){return new Promise((n,o)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),o(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let a=Date.now(),r="timekeeper_oauth",c=null,s=null,h=null,m=()=>{if(c){try{c.close()}catch{}c=null}s&&(clearInterval(s),s=null),h&&(clearInterval(h),h=null)};try{c=new BroadcastChannel(r),l&&l("OAuth monitor: BroadcastChannel created successfully"),c.onmessage=y=>{let E=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;l&&l("OAuth monitor: received BroadcastChannel message",E);let I=Se({type:W(),token:be(W()),error:be(W())}).safeParse(y.data);if(!I.success){l&&l("OAuth monitor: invalid message format",I.error,"warn");return}if(I.data.type==="timekeeper_oauth_token"&&I.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),m();try{e.close()}catch{}n(I.data.token)}else if(I.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",I.data.error,"error"),m();try{e.close()}catch{}o(new Error(I.data.error||"OAuth failed"))}}}catch(y){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}l&&l("OAuth monitor: setting up IndexedDB polling");let v=Date.now();s=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let E=y.result,G=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");G.onsuccess=()=>{let q=G.result;if(q&&q.value){let ee=q.value,O=Se({type:W(),token:be(W()),error:be(W()),timestamp:be(Ce())}).safeParse(ee);if(!O.success){l&&l("OAuth monitor: invalid IndexedDB message format",O.error,"warn");return}if(O.data.timestamp&&O.data.timestamp>v){let j=O.data.token?{...O.data,token:"[REDACTED]"}:O.data;if(l&&l("OAuth monitor: received IndexedDB message",j),O.data.type==="timekeeper_oauth_token"&&O.data.token){l&&l("OAuth monitor: token received via IndexedDB"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(O.data.token)}else if(O.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",O.data.error,"error"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),o(new Error(O.data.error||"OAuth failed"))}v=O.data.timestamp||Date.now()}}E.close()}}}catch(y){l&&l("OAuth monitor: IndexedDB polling error",y,"error")}},500),h=setInterval(()=>{if(Date.now()-a>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),m();try{e.close()}catch{}o(new Error("OAuth popup timed out"));return}},1e3)})}async function Bu(){if(!si){nt("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),nt("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",si),e.searchParams.set("redirect_uri",Lu),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Iu),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),nt("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),nt("authenticating","Waiting for authentication...");try{let n=await Cu(t),o=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(o.ok){let a=await o.json(),r=Se({name:be(W()),email:be(W())}).safeParse(a);if(!r.success)throw l&&l("Failed to validate user info response",r.error,"error"),new Error("Invalid user info response");let c=r.data;Mt({isSignedIn:!0,accessToken:n,userName:c.name||null,email:c.email||null}),await Wo(),io(),nt(),ke(),await Tn(),l?l(`Successfully authenticated as ${c.name}`):console.log(`[Timekeeper] Successfully authenticated as ${c.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let o=n instanceof Error?n.message:"Authentication failed";l?l("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),nt("error",o);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),nt("error",`Failed to sign in: ${t}`)}}async function Gm(){let e=gt(),t=e.email;if(!si||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",si),n.searchParams.set("redirect_uri",Lu),n.searchParams.set("response_type","token"),n.searchParams.set("scope",Iu),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let o=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!o)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await Cu(o,15e3);return Mt({...e,isSignedIn:!0,accessToken:a}),await Wo(),io(),nt(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){l("Silent OAuth: silent refresh failed",a,"warn");try{o.close()}catch{}return!1}}async function Ru(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),o=n.get("state");if(l&&l("OAuth popup: hash params found, state="+o),o!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),r=n.get("access_token"),c="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let h={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",h);let m=indexedDB.open("ytls-timestamps-db",4);m.onsuccess=()=>{let v=m.result,y=v.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});y.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",y.error,"error")},v.close()},m.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",m.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(r){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_token",token:r}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let h={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},m={...h,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",m);let v=indexedDB.open("ytls-timestamps-db",4);v.onsuccess=()=>{let f=v.result,E=f.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});E.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",E.error,"error")},f.close()},v.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",v.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Du(){Mt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Wo(),await Tn(),io(),nt(),ke()}async function Pu(){let e=gt();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await Hu({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function li(){let e=gt();return e.isSignedIn&&!!e.accessToken}function Ba(){return li()}function Fm(){let e=[];return li()&&e.push("Google Drive"),e}function Um(e){let t=Ic(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function _u(e){let t={Authorization:`Bearer ${e}`},o=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(o,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let r=await a.json();if(Array.isArray(r.files)&&r.files.length>0)return r.files[0].id;let c=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error("drive folder create failed");return(await c.json()).id}async function Ou(e,t,n){let o=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(o),r=encodeURIComponent("modifiedTime desc"),c=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&orderBy=${r}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error(`drive search failed (${c.status})`);let s=await c.json();return s.files&&s.files.length>0?s.files[0].id:null}async function yu(e){let t=await _u(e),n=await Ou("timekeeper-data.zip",t,e);if(!n)return null;let o=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)throw new Error(`drive download failed (${o.status})`);let a=await o.arrayBuffer();try{return Um(a)}catch(r){return l("Remote backup could not be decoded; the next upload will replace it:",r,"warn"),null}}async function Vm(){if(!Ea)return;let e=gt();if(!e.isSignedIn||!e.accessToken)return;let t;try{t=await yu(e.accessToken)}catch(a){if(a.message!=="unauthorized")throw a;await Hu({silent:!0});let r=gt();if(!r.isSignedIn||!r.accessToken)throw a;t=await yu(r.accessToken)}if(!t)return;let{mergedVideos:n,mergedTimestamps:o}=await Ea(t);o>0&&(l(`Pre-backup merge: added ${o} timestamps from ${n} videos from remote`),Ma&&Ma())}function qm(e,t){let n=new TextEncoder().encode(e),o=t.replace(/\\/g,"/").replace(/^\/+/,"");return o.endsWith(".json")||(o+=".json"),Mc({[o]:[n,{level:6,mtime:Om,os:0}]})}async function jm(e,t,n,o){let a=e.replace(/\.json$/,".zip"),r=await Ou(a,n,o),c=new TextEncoder().encode(t).length,s=qm(t,e),h=s.length;l(`Compressing data: ${c} bytes -> ${h} bytes (${Math.round(100-h/c*100)}% reduction)`);let m="-------314159265358979",v=`\r
--${m}\r
`,f=`\r
--${m}--`,y=r?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},E=8192,I="";for(let j=0;j<s.length;j+=E){let ae=s.subarray(j,Math.min(j+E,s.length));I+=String.fromCharCode.apply(null,Array.from(ae))}let P=btoa(I),G=v+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+v+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+P+f,q,ee;r?(q=`https://www.googleapis.com/upload/drive/v3/files/${r}?uploadType=multipart&fields=id,name`,ee="PATCH"):(q="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",ee="POST");let O=await fetch(q,{method:ee,headers:{Authorization:`Bearer ${o}`,"Content-Type":`multipart/related; boundary=${m}`},body:G});if(O.status===401)throw new Error("unauthorized");if(!O.ok)throw new Error("drive upload failed")}async function Hu(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await Gm()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),Mt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Wo(),await Tn(),nt("error","Authorization expired. Please sign in again."),ke())}async function $m(e){if(!li())throw e?.silent||nt("error","Configure a backup destination first"),new Error("no-backup-destination");await Vm();let t=await Tu({includeDeleted:!0});if(t.totalTimestamps===0){if(t.invalidRows>0)throw new Error(`export-invalid-data: ${t.invalidRows} stored rows failed validation`);return e?.silent||l("Skipping export: no timestamps to back up"),"skipped"}let n=gt();if(!n.accessToken)throw new Error("unauthorized");let o=await _u(n.accessToken);return await jm(t.filename,t.json,o,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`),"uploaded"}async function Nu(){try{let[e,t,n]=await Promise.all([Vo("lastAutoBackupAt"),Vo("autoBackupEnabled"),Vo("autoBackupIntervalMinutes")]),o=Li.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});o.success?(typeof o.data.autoBackupEnabled=="boolean"&&qi(o.data.autoBackupEnabled),typeof o.data.autoBackupIntervalMinutes=="number"&&ji(o.data.autoBackupIntervalMinutes),typeof o.data.lastAutoBackupAt=="number"&&Wi(o.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",o.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function Ra(){try{let e=lt().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=Li.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([Uo("autoBackupEnabled",e.autoBackupEnabled),Uo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),Uo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Wm(){ai&&(clearInterval(ai),ai=null),Ve&&(clearTimeout(Ve),Ve=null)}function qo(e){try{let t=new Date(e),n=new Date,o=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return o?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function ii(){let e=Fm();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function Da(){let e=lt().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?{kind:"running"}:e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?{kind:"retrying",backoffMs:e.autoBackupBackoffMs}:Ba()?e.autoBackupFailed?{kind:"failed"}:e.lastAutoBackupAt?{kind:"healthy",lastAt:e.lastAutoBackupAt}:{kind:"never"}:{kind:"no-destination"}:{kind:"off"}}function zu(){switch(Da().kind){case"running":return"#4285f4";case"retrying":case"never":return"#ffa500";case"healthy":return"#52c41a";case"off":case"no-destination":case"failed":return"#ff4d4f"}}function ke(){if(ci(),!Ue)return;let e=Da();switch(Ue.onmouseenter=null,Ue.onmouseleave=null,e.kind){case"off":K(Ue,"refresh","Backup: Off");break;case"running":K(Ue,"refresh","Backing up\u2026");break;case"retrying":K(Ue,"alert-triangle",`Retry in ${Math.ceil(e.backoffMs/6e4)}m`);break;case"no-destination":K(Ue,"alert-triangle","Backup target missing");break;case"failed":K(Ue,"alert-triangle","Backup failed");break;case"healthy":case"never":{let n=e.kind==="healthy"?`Last backup: ${qo(e.lastAt)}`:"Last backup: never",o=(e.kind==="healthy"?e.lastAt:Date.now())+Math.max(1,kn())*60*1e3,a=`Next backup: ${qo(o)}`;Ue.onmouseenter=()=>{K(Ue,"database",a)},Ue.onmouseleave=()=>{K(Ue,"database",n)},K(Ue,"database",n);break}}Ue.style.display="inline";let t=zu();Ue.style.color=t}var Ta="ytls-backup-indicator--pulsing",Ym="#4285f4",ro=null;function Km(e,t){ro&&(e.removeEventListener("animationiteration",ro),ro=null),t===Ym?(e.style.backgroundColor=t,e.classList.add(Ta)):e.classList.contains(Ta)?(ro=()=>{Nn&&(Nn.classList.remove(Ta),Nn.style.backgroundColor=t,ro=null)},e.addEventListener("animationiteration",ro,{once:!0})):e.style.backgroundColor=t}function Xm(){let e=Da(),t=Math.max(1,kn())*60*1e3;switch(e.kind){case"off":return"Auto backup is disabled";case"running":return"Backup in progress";case"retrying":return`Retrying backup in ${Math.ceil(e.backoffMs/6e4)}m`;case"no-destination":return ii();case"failed":return`Backup failed. Will try again at the next scheduled backup
${ii()}`;case"healthy":return`Last backup: ${qo(e.lastAt)}
Next backup: ${qo(e.lastAt+t)}
${ii()}`;case"never":return`No backup yet
Next backup: ${qo(Date.now()+t)}
${ii()}`}}function vu(){return oi()??{color:zu(),tooltip:Xm()}}function ci(){Nn&&(Km(Nn,vu().color),De(Nn,()=>vu().tooltip))}async function jo(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!Ba()){t||(ke(),li()||zm());return}if(Ve){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(Ve),Ve=null,eo(null),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!lt().auth.isAutoBackupRunning){$i(!0),ke();try{await $m({silent:t})==="uploaded"&&Wi(Date.now()),Bo(0),eo(null),Vr(!1),Ve&&(clearTimeout(Ve),Ve=null),await Ra()}catch(o){if(l("Auto backup failed:",o,"error"),o.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let r=gt();Mt({...r,accessToken:null,isSignedIn:!1}),await Wo(),nt("error","Authorization expired. Please sign in again."),ke(),Bo(0),eo(null),Vr(!1),Ve&&(clearTimeout(Ve),Ve=null)}else if(lt().auth.autoBackupRetryAttempts<gu){let r=lt().auth.autoBackupRetryAttempts+1;Bo(r);let s=Math.min(Hm*Math.pow(2,r-1),Nm);eo(s),Ve&&clearTimeout(Ve),Ve=setTimeout(()=>{Ve=null,jo({silent:!0})},s),l(`Scheduling backup retry ${r}/${gu} in ${Math.round(s/1e3)}s`),ke()}else eo(null),Bo(0),Vr(!0)}finally{$i(!1),ke()}}}async function Tn(e=!1){if(Wm(),!!$o()&&Ba()){if(ai=setInterval(()=>{jo({silent:!0})},Math.max(1,kn())*60*1e3),!e){let t=Date.now(),n=Math.max(1,kn())*60*1e3,o=lt().auth.lastAutoBackupAt;(!o||t-o>=n)&&jo({silent:!0})}ke()}}async function Gu(){let e=$o();qi(!e),await Ra(),await Tn(),ke()}async function Fu(){let e=kn(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}ji(n),await Ra(),await Tn(),ke()}function Pa(e,t){return Yt(e).then(n=>n!==void 0?n:t)}function _a(e,t){return wn(e,t),Promise.resolve()}var Oa=window.location.hash;if(Oa&&Oa.length>1){let e=new URLSearchParams(Oa.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let o=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),o.postMessage(a),o.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(o){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",o);let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},r=indexedDB.open("ytls-timestamps-db",4);r.onsuccess=()=>{let c=r.result,s=c.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",a.timestamp),c.close()}}}if(history.replaceState){let o=window.location.pathname+window.location.search;history.replaceState(null,"",o)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}if(ru())throw new Error("OAuth window closed");pc();dc()||lc();(async function(){"use strict";if(window.top!==window.self)return;function e(i){return Pa(i,void 0)}function t(i,u){return _a(i,u)}La(e),Ia(t);try{let i=await Yt("device_id"),u=typeof i=="string"&&i.length>0?i:crypto.randomUUID();await wn("device_id",u),l(`Lamport: device_id = ${u}`)}catch(i){l("Lamport: failed to initialize device_id:",i,"warn")}if(await Ru()){l("OAuth popup detected, broadcasting token and closing");return}await Ca();let o=["/watch","/live"];function a(i=window.location.href){try{let u=new URL(i);return u.origin!=="https://www.youtube.com"?!1:o.some(d=>u.pathname===d||u.pathname.startsWith(`${d}/`))}catch(u){return l("Timekeeper failed to parse URL for support check:",u,"error"),!1}}let r=null,c=null,s=null,h=null,m=null,v=null,f=null,y=null,E=(()=>{try{let i=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(i)&&i>0&&i!==1?Math.min(i,4):2}catch{return 2}})(),I=!1,P=null,G=null,q=250,ee=null;function O(){return lt().ui.minPaneHeight}function j(i){Xl(i)}function ae(i){Ql(i)}function ge(){return lt().ui.urlChangeHandlersSetup}function de(i){Zl(i)}function F(){return lt().ui.panePosition}function R(i){Jl(i)}function me(i){ec(i)}function oe(){return r?r.getBoundingClientRect():null}function xe(i,u,d){i&&R({x:Math.round(typeof u=="number"?u:i.left),y:Math.round(typeof d=="number"?d:i.top),width:Math.round(i.width),height:Math.round(i.height)})}function Ye(i=!0){if(!r)return;Fn();let u=oe();if(u&&(u.width||u.height)&&(xe(u),i)){let d=F();fr("windowPosition",d),En({type:"window_position_updated",position:d,timestamp:Date.now()})}}function Pe(){if(!r||!c||!h||!s)return;let i=40,u=Re();if(u.length>0)i=u[0].offsetHeight;else{let d=document.createElement("li");d.style.visibility="hidden",d.style.position="absolute",d.textContent="00:00 Example",s.appendChild(d),i=d.offsetHeight,s.removeChild(d)}q=c.offsetHeight+h.offsetHeight+i,j(q),r.style.minHeight=O()+"px"}function _e(){requestAnimationFrame(()=>{He?.(),Pe(),Ye(!0)})}function Te(i=450){Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{Lt(),_e(),Ie=null},i)}function se(){Ie&&(clearTimeout(Ie),Ie=null)}function Oe(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),_e(),Te()}function Ae(){Lt(),se(),vt&&(clearTimeout(vt),vt=null),vt=setTimeout(()=>{r&&(r.style.display="none",ss(),vt=null)},400)}function Lt(){if(!s){it&&(it(),it=null,Ut=null,In=null);return}if(!In){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),it&&(it(),it=null,Ut=null);return}l("Appending deferred timestamps after animation"),s.appendChild(In),In=null,sn(),ln(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),it&&(it(),it=null,Ut=null),Bt(),qe(),He&&requestAnimationFrame(He),xt(!0)}let Ee=null,ye=!1,ve="ytls-timestamp-pending-delete",le="ytls-timestamp-highlight";async function ce(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(i=>setTimeout(i,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(i=>setTimeout(i,100));await new Promise(i=>setTimeout(i,200))}let ot=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],tn=5e3,nn=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function An(i){return nn.has(i)}function Be(){return document.querySelector("video")}let rt=null;function Y(){if(rt&&document.contains(rt))return rt;let i=document.getElementById("movie_player");return i&&document.contains(i)?i:null}function Gt(i){return(Math.round(i*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function ao(i){let u=i===1?2:i;E=u;try{localStorage.setItem("ytls-last-speed",String(u))}catch{}}function ui(i){if(!y)return;let u=typeof i=="number"?i:Be()?.playbackRate??1,d=Gt(u);y.dataset.speed!==d&&(y.dataset.speed=d,y.textContent=`${d}x`,y.setAttribute("aria-label",`Playback speed ${d}x`)),Math.abs(u-1)>.01?y.classList.add("ytls-playback-speed-active"):y.classList.remove("ytls-playback-speed-active")}function Uu(i){let u=Y(),d=Be();if(I=!0,u&&typeof u.setPlaybackRate=="function")u.setPlaybackRate(i);else if(d)d.playbackRate=i;else return I=!1,!1;return ui(i),!0}function Ha(){let i=Be()?.playbackRate;return Number.isFinite(i)?Uu(Math.abs(i-1)<=.001?E:1):!1}function Vu(i){return i instanceof Element?!!i.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function di(i){return ot.every(u=>typeof i?.[u]=="function"?!0:An(u)?!!Be():!1)}function qu(i){return ot.filter(u=>typeof i?.[u]=="function"?!1:An(u)?!Be():!0)}async function ju(i=tn){let u=Date.now();for(;Date.now()-u<i;){let b=Y();if(di(b))return b;await new Promise(x=>setTimeout(x,100))}let d=Y();return di(d),d}let Na="timestampOffsetSeconds",$u=-5,za="shiftClickTimeSkipSeconds",Wu=10,pi=300,mi=300,Ct=null;function Ga(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Fa(){if(Ga()&&!Ct)try{Ct=new BroadcastChannel("ytls_timestamp_channel"),Ct.onmessage=Ua}catch(i){l("Failed to create BroadcastChannel:",i,"warn"),Ct=null}}function En(i){if(!Ga()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Fa(),!Ct){l("No BroadcastChannel available to post message","warn");return}try{Ct.postMessage(i)}catch(u){l("BroadcastChannel error, reopening:",u,"warn");try{Ct=new BroadcastChannel("ytls_timestamp_channel"),Ct.onmessage=Ua,Ct.postMessage(i)}catch(d){l("Failed to reopen BroadcastChannel:",d,"error")}}}function Ua(i){if(l("Received message from another tab:",i.data),!(!a()||!s||!r)&&i.data){if(i.data.type==="timestamps_updated"&&i.data.videoId===Me)l("Debouncing timestamp load due to external update for video:",i.data.videoId),clearTimeout(lo),lo=setTimeout(()=>{l("Reloading timestamps due to external update for video:",i.data.videoId),mr()},500);else if(i.data.type==="window_position_updated"&&r){let u=i.data.position;if(u&&typeof u.x=="number"&&typeof u.y=="number"){r.style.left=`${u.x}px`,r.style.top=`${u.y}px`,r.style.right="auto",r.style.bottom="auto",typeof u.width=="number"&&u.width>0&&(r.style.width=`${u.width}px`),typeof u.height=="number"&&u.height>0&&(r.style.height=`${u.height}px`);let d=r.getBoundingClientRect();R({x:Math.round(u.x),y:Math.round(u.y),width:Math.round(d.width),height:Math.round(d.height)});let b=document.documentElement.clientWidth,x=document.documentElement.clientHeight;(d.left<0||d.top<0||d.right>b||d.bottom>x)&&Fn()}}}}Fa();let zn=await Pa(Na);(typeof zn!="number"||Number.isNaN(zn))&&(zn=$u,await _a(Na,zn));let so=await Pa(za);(typeof so!="number"||Number.isNaN(so))&&(so=Wu,await _a(za,so));let lo=null,Ft=new Map,Mn=!1,H=null,Yo=null,Me=null,vt=null,Ie=null,wt=null,Ke=null,on=null,fi=!1,He=null,In=null,Ut=null,it=null,rn=null,Ko=!1,hi=!1,Xo=null,Jo=null,Qo=null,Zo=null,er=null,tr=null,nr=null,or=null,co=null,uo=null,po=null,bt=null,St=null,Va=0,mo=!1,Ln=null,fo=null,Gn=null,qa=null,ho=null;function rr(){if(!s)return{items:[],starts:[]};if(qa!==s||!ho?(ho?.disconnect(),ho=new MutationObserver(()=>{Gn=null}),ho.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),qa=s,Gn=null):ho.takeRecords().length>0&&(Gn=null),!Gn){let i=zr(s),u=new Array(i.length);for(let d=0;d<i.length;d++){let b=i[d].querySelector("[data-time]")?.dataset.time;u[d]=b?Number.parseInt(b,10):NaN}Gn={items:i,starts:u}}return Gn}function Re(){return rr().items}function gi(){return Wl(s)}function an(){return fo!==null||(fo=Yl(s)),fo}function sn(){fo=null}function ir(i=Y(),u=Be()){let d=i?.getDuration?.();return Number.isFinite(d)&&d>0?d:Number.isFinite(u?.duration)&&u.duration>0?u.duration:0}function ja(){return ir()||an()}function Yu(i){let u=i.querySelector(".time-diff");return u?(u.textContent?.trim()||"").startsWith("-"):!1}let Ku="\u251C\u2500 ",$a="\u2514\u2500 ",Wa=/^[├└]─\s/;function ar(i){return Wa.test(i)}function Ya(i){return i.replace(Wa,"")}function Ka(i){let u=Re();if(i>=u.length-1)return $a;let x=u[i+1].querySelector("input");return x&&ar(x.value)?Ku:$a}function Xu(i,u){return`${Ka(u)}${i}`}function Bt(){if(!s)return;Re().forEach((u,d)=>{let b=u.querySelector("input");if(!b||!ar(b.value))return;let x=Ya(b.value),A=Xu(x,d);b.value!==A&&(b.value=A)})}function go(){Gr(s),In&&(In=null),it&&(it(),it=null,Ut=null)}function yo(){$l(s,ye)}function Xa(i){Vi(s,i)}function yi(){Vl(s)}function vi(i){if(!(!r||!s)){if(ye=i,i)r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),Xa("Loading timestamps...");else if(yi(),r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),m){let u=Y();if(u){let d=u.getCurrentTime(),b=Number.isFinite(d)?Math.max(0,Math.floor(d)):Math.max(0,an());m.textContent=Dr(b,ir(u))}}!ye&&s&&!Co(s)&&yo(),Vt()}}function sr(i,u){i.dataset.time=String(u),i.textContent=gn(u,ja())}let lr=null,cr=null,Rt=!1;function Ja(i,u){if(!i||typeof i.getVideoData!="function"||!(u!==void 0?u:!!i.getVideoData()?.isLive))return!1;if(typeof i.getProgressState=="function"){let b=i.getProgressState(),x=Number(b?.seekableEnd??b?.liveHead??b?.head??b?.duration),A=Number(b?.current??i.getCurrentTime?.());if(Number.isFinite(x)&&Number.isFinite(A))return x-A>2}return!1}function Ju(i,u){if(!Number.isFinite(i))return;let d=Qa(i);wi(d,u)}function xt(i=!1,u){if(Mn&&!i)return;let d;if(typeof u=="number"&&Number.isFinite(u))d=Math.max(0,Math.floor(u));else{let b=Y(),x=b?b.getCurrentTime():NaN;d=Number.isFinite(x)?Math.max(0,Math.floor(x)):Math.max(0,an())}Number.isFinite(d)&&Ju(d,i)}function Qa(i){if(!Number.isFinite(i))return null;let{items:u,starts:d}=rr(),b=-1,x=-1/0;for(let A=0;A<d.length;A++){let k=d[A];k<=i&&k>x&&(x=k,b=A)}return b>=0?u[b]:null}function wi(i,u=!1){let d=s?s.getElementsByClassName(le):null;if(!(!!d&&(i?d.length===1&&d[0]===i:d.length===0))&&d)for(let x of Array.from(d))x.classList.contains(ve)||x.classList.remove(le);if(i&&!i.classList.contains(ve)&&(i.classList.add(le),u))try{if(s instanceof HTMLElement){let x=i.getBoundingClientRect(),A=s.getBoundingClientRect();!(x.bottom<A.top||x.top>A.bottom)||i.scrollIntoView({behavior:"smooth",block:"center"})}else i.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{i.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Qu(i){if(kt()||!Number.isFinite(i)||i===0)return!1;let u=Re();if(u.length===0)return!1;let d=[];return u.forEach(b=>{let x=b.querySelector("[data-time]"),A=x?.dataset.time;if(!x||!A)return;let k=Number.parseInt(A,10);if(!Number.isFinite(k))return;let S=Math.max(0,k+i);if(S!==k){sr(x,S);let L=b.dataset.guid;L&&d.push({guid:L,start:S,comment:b.querySelector("input")?.value??""})}}),d.length===0?!1:(ln(),Bt(),qe(),bi(),ns(Me,d),Ln=null,!0)}function Za(i,u={}){if(!Number.isFinite(i)||i===0)return!1;if(!Qu(i)){if(u.alertOnNoChange){let k=u.failureMessage??"Offset did not change any timestamps.";alert(k)}return!1}let b=u.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${i>0?"+":""}${i} seconds (${b})`);let x=Y(),A=x?Math.floor(x.getCurrentTime()):0;if(Number.isFinite(A)){let k=Qa(A);wi(k,!1)}return!0}function es(i){if(!s||ye)return;let u=i.target instanceof Element?i.target:null;if(!u)return;let d=u.closest("[data-time]"),b=u.closest("[data-increment]"),x=u.closest("[data-action]");if(d?.dataset.time){i.preventDefault();let A=Number(d.dataset.time);if(Number.isFinite(A)){l(`Seeking to timestamp ${A}`),Rt=!0;let S=Y();S&&S.seekTo(A),setTimeout(()=>{Rt=!1},500)}let k=d.closest("li");k&&(Re().forEach(S=>{S.classList.contains(ve)||S.classList.remove(le)}),k.classList.contains(ve)||(k.classList.add(le),k.scrollIntoView({behavior:"smooth",block:"center"})))}else if(b?.dataset.increment){i.preventDefault();let A=b.closest("li"),k=A?.querySelector("[data-time]");if(!k||!k.dataset.time)return;let S=parseInt(k.dataset.time,10),L=parseInt(b.dataset.increment,10);if("shiftKey"in i&&i.shiftKey&&(L*=so),"altKey"in i?i.altKey:!1){Za(L,{logLabel:"Alt adjust"});return}let U=Math.max(0,S+L);if(l(`Timestamps changed: Timestamp time incremented from ${S} to ${U}`),sn(),sr(k,U),cr=U,lr&&clearTimeout(lr),Rt=!0,lr=setTimeout(()=>{if(cr!==null){let ne=Y();ne&&ne.seekTo(cr)}lr=null,cr=null,setTimeout(()=>{Rt=!1},500)},500),ln(),Bt(),qe(),A){let ne=A.querySelector("input"),we=A.dataset.guid;ne&&we&&(pr(Me,we,U,ne.value),Ln=we)}}else x?.dataset.action==="clear"&&(i.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",sn(),qe(),ur(),td(),me([]),ed(Me),Ln=null,yo())}function vo(i,u="",d=!1,b=null,x=!0){if(!s)return null;let A=Math.max(0,i),k=b??crypto.randomUUID(),S=document.createElement("li"),L=document.createElement("div"),C=document.createElement("span"),D=document.createElement("span"),U=document.createElement("span"),ne=document.createElement("div"),we=document.createElement("span"),dt=document.createElement("span"),J=document.createElement("input"),re=document.createElement("button");S.dataset.guid=k,L.className="time-row",ne.className="ytls-row-controls";let Ne=document.createElement("div");Ne.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",De(Ne,"Click to toggle indent");let at=document.createElement("span");at.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let Tt=()=>{let V=J.offsetTop,N=J.offsetHeight||20;Ne.style.top=`${V}px`,Ne.style.height=`${N}px`},Dt=()=>{Ge(at,ar(J.value)?"indent-decrease":"indent-increase",18)},Un="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",cn=V=>{let N=at.querySelector("svg");N&&(N.style.transition="filter 0.15s ease",N.style.filter=V?Un:"none")},Vn=V=>{V.stopPropagation();let N=ar(J.value),ue=Ya(J.value),Z="";if(!N){let pt=Re().indexOf(S);Z=Ka(pt)}J.value=Z?`${Z}${ue}`:ue,Dt(),Bt();let fe=Number.parseInt(we.dataset.time??"0",10);pr(Me,k,fe,J.value)};Ne.onclick=Vn,Ne.append(at),Ne.addEventListener("mouseenter",()=>{cn(!0)}),Ne.addEventListener("mouseleave",()=>{cn(!1)}),S.style.cssText="position:relative;padding-left:20px;",S.addEventListener("mouseenter",()=>{Tt(),Dt(),at.style.display="inline"}),S.addEventListener("mouseleave",()=>{cn(!1),at.style.display="none"}),S.addEventListener("mouseleave",()=>{S.dataset.guid===Ln&&Yu(S)&&ts()}),J.value=u||"",J.style.cssText="width:100%;margin-top:5px;display:block;",J.type="text",J.setAttribute("inputmode","text"),J.autocapitalize="off",J.autocomplete="off",J.spellcheck=!1,requestAnimationFrame(Tt);let So=!1;J.addEventListener("focusin",()=>{mo=!1,So=!1}),J.addEventListener("focusout",V=>{let N=V.relatedTarget,ue=Date.now()-Va<250,Z=!!N&&!!r&&r.contains(N);!ue&&!Z&&!So&&(mo=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(J.focus({preventScroll:!0}),mo=!1)},0))}),J.addEventListener("keydown",V=>{(V.key==="Escape"||V.key==="Esc")&&(V.preventDefault(),So=!0,J.blur())});let xo=V=>{let N=Ft.get(k);N&&clearTimeout(N.timeoutId);let ue=Me,Z=()=>{let fe=Ft.get(k);fe&&(clearTimeout(fe.timeoutId),Ft.delete(k)),os(ue,k,Number.parseInt(we.dataset.time??"0",10),J.value)};Ft.set(k,{timeoutId:setTimeout(Z,V),flush:Z})};J.addEventListener("input",V=>{let N=V;N&&(N.isComposing||N.inputType==="insertCompositionText")||xo(500)}),J.addEventListener("compositionend",()=>{xo(50)});let qt="#f4ba78",hr="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",gr="#c8452d",yr="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",Bn=(V,N=qt,ue=hr)=>{V.style.color=N;let Z=V.querySelector("svg");Z&&(Z.style.transition="filter 0.15s ease"),V.addEventListener("mouseenter",()=>{Z&&(Z.style.filter=ue)}),V.addEventListener("mouseleave",()=>{Z&&(Z.style.filter="none")})};Ge(C,"circle-minus",18),C.classList.add("ytls-row-control"),C.dataset.increment="-1",C.style.cursor="pointer",C.style.margin="0px",Bn(C),Ge(U,"circle-plus",18),U.classList.add("ytls-row-control"),U.dataset.increment="1",U.style.cursor="pointer",U.style.margin="0px",Bn(U),Ge(D,"current-location",18),D.classList.add("ytls-row-control"),D.style.cursor="pointer",D.style.margin="0px",De(D,"Set to current playback time"),Bn(D),D.onclick=()=>{let V=Y(),N=V?Math.floor(V.getCurrentTime()):0;Number.isFinite(N)&&(l(`Timestamps changed: set to current playback time ${N}`),sn(),sr(we,N),ln(),Bt(),pr(Me,k,N,J.value),Ln=k)},sn(),sr(we,A),we.addEventListener("click",V=>{V.preventDefault(),V.stopPropagation();let N=Number(we.dataset.time);if(!Number.isFinite(N))return;l(`Seeking to timestamp ${N}`),Rt=!0;let ue=Y();ue&&ue.seekTo(N);let Z=Be();Z?.paused&&Z.play(),setTimeout(()=>{Rt=!1},500),s?.querySelectorAll(`.${le}`).forEach(fe=>fe.classList.remove(le)),S.classList.contains(ve)||(S.classList.add(le),S.scrollIntoView({behavior:"smooth",block:"center"}))}),Ge(re,"trash",16),re.classList.add("ytls-row-control"),re.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",Bn(re,gr,yr),re.onclick=()=>{let V=null,N=null,ue=null,Z=()=>{try{S.removeEventListener("click",N,!0)}catch{}try{document.removeEventListener("click",N,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",ue)}catch{}V&&(clearTimeout(V),V=null)};if(S.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let fe=S.dataset.guid??"",je=Ft.get(fe);je&&(clearTimeout(je.timeoutId),Ft.delete(fe)),Z(),S.remove(),sn(),ln(),Bt(),qe(),ur(),nd(Me,fe),Ln=null,yo()}else{S.dataset.deleteConfirmed="true",S.classList.add(ve),S.classList.remove(le);let fe=()=>{S.dataset.deleteConfirmed="false",S.classList.remove(ve);let je=Y(),pt=je?je.getCurrentTime():0,Pt=Number.parseInt(S.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(pt)&&Number.isFinite(Pt)&&pt>=Pt&&S.classList.add(le),Z()};N=je=>{je.target!==re&&fe()},ue=()=>{S.dataset.deleteConfirmed==="true"&&fe()},S.addEventListener("click",N,!0),document.addEventListener("click",N,!0),s&&s.addEventListener("mouseleave",ue),V=setTimeout(()=>{S.dataset.deleteConfirmed==="true"&&fe(),Z()},5e3)}},dt.className="time-diff",dt.style.color="#888",dt.style.marginLeft="5px",ne.append(C,D,U,re),L.append(we,ne,dt),S.append(Ne,L,J);let vr=Number.parseInt(we.dataset.time??"0",10);if(x){yi();let V=!1,N=Re();for(let ue=0;ue<N.length;ue++){let Z=N[ue],je=Z.querySelector("[data-time]")?.dataset.time;if(!je)continue;let pt=Number.parseInt(je,10);if(Number.isFinite(pt)&&vr<pt){s.insertBefore(S,Z),V=!0;break}}V||s.appendChild(S),S.scrollIntoView({behavior:"smooth",block:"center"}),sn(),ln(),ur(),Bt(),qe(),d||(pr(Me,k,A,u),Ln=k,wi(S,!1))}else J.__ytls_li=S;return J}function ln(){if(kt())return;let i=ja(),u=Re();u.forEach((d,b)=>{let x=d.querySelector(".time-diff"),A=d.querySelector("[data-time]"),k=A?.dataset.time;if(A&&k){let dt=Number.parseInt(k,10);Number.isFinite(dt)&&(A.textContent=gn(dt,i))}if(!x)return;if(!k){x.textContent="";return}let S=Number.parseInt(k,10);if(!Number.isFinite(S)){x.textContent="";return}if(b===0){x.textContent="";return}let D=u[b-1].querySelector("[data-time]")?.dataset.time;if(!D){x.textContent="";return}let U=Number.parseInt(D,10);if(!Number.isFinite(U)){x.textContent="";return}let ne=S-U,we=ne<0?"-":"";x.textContent=` ${we}${gn(Math.abs(ne))}`})}function ts(){if(kt())return;let i=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let k=document.activeElement,L=k.closest("li")?.dataset.guid;if(L){let C=k.selectionStart??k.value.length,D=k.selectionEnd??C,U=k.scrollLeft;i={guid:L,start:C,end:D,scroll:U}}}let u=Re();if(u.length===0)return;let d=u.map(k=>k.dataset.guid),b=u.map(k=>{let S=k.querySelector("[data-time]"),L=S?.dataset.time;if(!S||!L)return null;let C=Number.parseInt(L,10);if(!Number.isFinite(C))return null;let D=k.dataset.guid??"";return{time:C,guid:D,element:k}}).filter(k=>k!==null).sort((k,S)=>{let L=k.time-S.time;return L!==0?L:k.guid.localeCompare(S.guid)}),x=b.map(k=>k.guid),A=d.length!==x.length||d.some((k,S)=>k!==x[S]);if(s.replaceChildren(),b.forEach(k=>{s.appendChild(k.element)}),ln(),Bt(),qe(),i){let S=Re().find(L=>L.dataset.guid===i.guid)?.querySelector("input");if(S)try{S.focus({preventScroll:!0})}catch{}}A&&(l("Timestamps changed: Timestamps sorted"),bi())}function ur(){if(!s||!r||!c||!h)return;let i=Re().length;He?.();let u=r.getBoundingClientRect(),d=c.getBoundingClientRect(),b=h.getBoundingClientRect(),x=Math.max(0,u.height-(d.height+b.height));i===0?(yo(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>x?"auto":"hidden"}function qe(){if(!s)return;let i=Be(),u=document.querySelector(".ytp-progress-bar"),d=Y(),b=d?d.getVideoData():null,x=!!b&&!!b.isLive;if(!i||!u||!isFinite(i.duration)||x)return;is();let{items:A,starts:k}=rr(),S=i.duration,L=document.createDocumentFragment();A.forEach((C,D)=>{let U=k[D];if(!Number.isFinite(U))return;C.dataset.guid||(C.dataset.guid=crypto.randomUUID());let ne=document.createElement("div");ne.className="ytls-marker",ne.style.left=U/S*100+"%",ne.dataset.time=String(U),L.appendChild(ne)}),u.appendChild(L),Zu(u)}function Zu(i){i.dataset.ytlsMarkerClicks||(i.dataset.ytlsMarkerClicks="1",i.addEventListener("click",u=>{let d=u.target?.closest?.(".ytls-marker");if(!d)return;let b=Number(d.dataset.time),x=Y();x&&Number.isFinite(b)&&x.seekTo(b)}))}function bi(){me(gi().sort((i,u)=>i.start-u.start))}function ns(i,u){!i||u.length===0||ye||kt()||(cd(i,u).then(()=>{l(`Saved ${u.length} timestamps for ${i} to IndexedDB`),s&&wo()}).catch(d=>{let b=`Failed to save timestamps: ${d.message}`;l(`Failed to save timestamps for ${i} to IndexedDB:`,d,"error"),Cn(b)}),En({type:"timestamps_updated",videoId:i,action:"saved"}))}function ed(i){!i||ye||kt()||(as(i).then(()=>{s&&wo()}).catch(u=>{let d=`Failed to clear timestamps: ${u.message}`;l(`Failed to clear timestamps for ${i}:`,u,"error"),Cn(d)}),En({type:"timestamps_updated",videoId:i,action:"saved"}))}function dr(){for(let{flush:i}of[...Ft.values()])i()}function td(){Ft.forEach(({timeoutId:i})=>clearTimeout(i)),Ft.clear()}function pr(i,u,d,b){!i||ye||kt()||os(i,u,d,b)}function os(i,u,d,b){if(!i)return;let x={guid:u,start:d,comment:b};l(`Saving timestamp: guid=${u}, start=${d}, comment="${b}"`),ud(i,x).then(()=>{s&&wo()}).catch(A=>{let k=`Failed to save timestamp: ${A.message}`;l(`Failed to save timestamp ${u}:`,A,"error"),Cn(k)}),En({type:"timestamps_updated",videoId:i,action:"saved"})}function nd(i,u){!i||ye||kt()||(dd(i,u).then(()=>{s&&wo()}).catch(d=>{let b=`Failed to delete timestamp: ${d.message}`;l(`Failed to delete timestamp ${u}:`,d,"error"),Cn(b)}),En({type:"timestamps_updated",videoId:i,action:"saved"}))}async function rs(i){if(kt()){alert("Cannot export timestamps while an error is being displayed.");return}let u=Me;if(!u)return;l(`Exporting timestamps for video ID: ${u}`);let d=gi(),b=Dn();if(i==="json"){let x=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),A=URL.createObjectURL(x),k=document.createElement("a");k.href=A,k.download=`timestamps-${u}-${b}.json`,k.click(),URL.revokeObjectURL(A)}else if(i==="text"){let x=Bi(d,!0),A=new Blob([x],{type:"text/plain"}),k=URL.createObjectURL(A),S=document.createElement("a");S.href=k,S.download=`timestamps-${u}-${b}.txt`,S.click(),URL.revokeObjectURL(k)}}function Cn(i){if(!r||!s){l("Timekeeper error:",i,"error");return}ql(s,i),Yi(i),qe()}function wo(){s&&(jl(s),Yi(null))}function kt(){return!!(!s||Co(s)||ye||tc()!==null)}function is(){document.querySelectorAll(".ytls-marker").forEach(i=>i.remove())}function Fn(){if(!r||!document.body.contains(r))return;let i=r.getBoundingClientRect(),u=document.documentElement.clientWidth,d=document.documentElement.clientHeight,b=i.width,x=i.height;if(i.left<0&&(r.style.left="0",r.style.right="auto"),i.right>u){let A=Math.max(0,u-b);r.style.left=`${A}px`,r.style.right="auto"}if(i.top<0&&(r.style.top="0",r.style.bottom="auto"),i.bottom>d){let A=Math.max(0,d-x);r.style.top=`${A}px`,r.style.bottom="auto"}}function od(){if(Xo&&(document.removeEventListener("mousemove",Xo),Xo=null),Jo&&(document.removeEventListener("mouseup",Jo),Jo=null),co&&(document.removeEventListener("keydown",co),co=null),Qo&&(window.removeEventListener("resize",Qo),Qo=null),uo&&(document.removeEventListener("pointerdown",uo,!0),uo=null),po&&(document.removeEventListener("pointerup",po,!0),po=null),bt){try{bt.disconnect()}catch{}bt=null}if(St){try{St.disconnect()}catch{}St=null}let i=Be();i&&(Zo&&(i.removeEventListener("timeupdate",Zo),Zo=null),er&&(i.removeEventListener("pause",er),er=null),tr&&(i.removeEventListener("play",tr),tr=null),nr&&(i.removeEventListener("seeking",nr),nr=null),or&&(i.removeEventListener("ratechange",or),or=null))}function rd(){is(),dr(),lo&&(clearTimeout(lo),lo=null),Ee&&(clearInterval(Ee),Ee=null),vt&&(clearTimeout(vt),vt=null),od(),gl();try{Ct.close()}catch{}if(H&&H.parentNode===document.body&&document.body.removeChild(H),H=null,Yo=null,Mn=!1,Me=null,bt){try{bt.disconnect()}catch{}bt=null}if(St){try{St.disconnect()}catch{}St=null}r&&r.parentNode&&r.remove();let i=document.getElementById("ytls-header-button");i&&i.parentNode&&i.remove(),rn=null,Ko=!1,R(null),go(),r=null,c=null,s=null,h=null,Ke=null,on=null,He=null,m=null,v=null,y=null,P=null,rt=null}async function id(){let i=bo();if(!i)return rt=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let u=await ju();if(!di(u)){let d=qu(u),b=d.length?` Missing methods: ${d.join(", ")}.`:"",x=u?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return rt=null,{ok:!1,message:`${x}${b} Try refreshing once playback is ready.`}}return rt=u,{ok:!0,player:u,videoId:i}}async function mr(){if(!r||!s)return;let i=s.scrollTop,u=!0,d=()=>{if(!s||!u)return;let b=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(i,b)};try{let b=await id();if(!b.ok){Cn(b.message),go(),qe();return}let{videoId:x}=b,A=[];try{let k=await pd(x);k?(A=k.map(S=>({...S,guid:S.guid||crypto.randomUUID()})),l(`Loaded ${A.length} timestamps from IndexedDB for ${x}`),wo()):l(`No timestamps found in IndexedDB for ${x}`)}catch(k){let S=`Failed to load timestamps: ${k.message}`;l(`Failed to load timestamps from IndexedDB for ${x}:`,k,"error"),Cn(S),qe();return}if(A.length>0){A.sort((L,C)=>L.start-C.start),go(),yi();let k=document.createDocumentFragment();A.forEach(L=>{let D=vo(L.start,L.comment,!0,L.guid,!1).__ytls_li;D&&k.appendChild(D)}),r&&r.classList.contains("ytls-zoom-in")&&Ie!=null?(l("Deferring timestamp DOM append until show animation completes"),In=k,Ut||(Ut=new Promise(L=>{it=L})),await Ut):s&&(s.appendChild(k),sn(),ln(),Bt(),qe(),He&&requestAnimationFrame(He)),me(A),xt(!0),u=!1}else go(),Xa("No timestamps for this video"),qe(),me([]),He&&requestAnimationFrame(He)}catch(b){l("Unexpected error while loading timestamps:",b,"error"),Cn("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Ut&&await Ut,requestAnimationFrame(d),He&&requestAnimationFrame(He),s&&!Co(s)&&yo()}}function bo(){let u=new URLSearchParams(location.search).get("v");if(u)return u;let d=document.querySelector('meta[itemprop="identifier"]');return d?.content?d.content:null}function ad(i=null,u=null){if(!m)return;let d=Be(),b=u||Y();if(!d&&!b)return;let x=i!==null?i:b?b.getCurrentTime():0,A=Number.isFinite(x)?Math.max(0,Math.floor(x)):Math.max(0,an()),{isLive:k}=b?b.getVideoData()||{isLive:!1}:{isLive:!1},S=b?Ja(b,!!k):!1;m.textContent=Dr(A,ir(b,d)),m.style.color=S?"#ff4d4f":""}function sd(){let i=Be();if(!i)return;let u=NaN,d=null,b=()=>{if(!s)return;let C=Y(),D=C?Math.floor(C.getCurrentTime()):0;if(!Number.isFinite(D))return;let U=rr();if(D===u&&U===d)return;let ne=!!m&&!ye&&!Rt;ne&&ad(D,C),xt(!1,D),ne&&!Mn&&(u=D,d=U)},x=C=>{try{let D=new URL(window.location.href);C!==null&&Number.isFinite(C)?D.searchParams.set("t",`${Math.floor(C)}s`):D.searchParams.delete("t"),window.history.replaceState(window.history.state,"",D.toString())}catch{}},A=()=>{let C=Y(),D=C?C.getCurrentTime():NaN,U=Number.isFinite(D)?Math.max(0,Math.floor(D)):Math.max(0,an());if(Number.isFinite(U)){x(U);try{xt(!0)}catch(ne){l("Failed to highlight nearest timestamp on pause:",ne,"warn")}}},k=()=>{x(null);try{let C=Y(),D=C?C.getCurrentTime():NaN,U=Number.isFinite(D)?Math.max(0,Math.floor(D)):Math.max(0,an());Number.isFinite(U)&&xt(!0)}catch(C){l("Failed to highlight nearest timestamp on play:",C,"warn")}},S=()=>{let C=Be();if(!C)return;let D=Y(),U=D?Math.floor(D.getCurrentTime()):0;Number.isFinite(U)&&(C.paused&&x(U),xt(!0,U))},L=()=>{let C=i.playbackRate;I?I=!1:ao(C),ui(C)};Zo=b,er=A,tr=k,nr=S,or=L,i.addEventListener("timeupdate",b),i.addEventListener("pause",A),i.addEventListener("play",k),i.addEventListener("seeking",S),i.addEventListener("ratechange",L)}let{saveToIndexedDB:ld,saveRowsToIndexedDB:cd,saveSingleTimestampToIndexedDB:ud,deleteSingleTimestampFromIndexedDB:dd,loadFromIndexedDB:pd,removeFromIndexedDB:as,saveGlobalSettings:fr,loadGlobalSettings:Si,buildExportPayload:md,mergeBackupData:fd,exportAllTimestamps:hd,exportAllTimestampsCsv:gd}=Nr;function ss(){if(!r)return;let i=r.style.display!=="none";fr("uiVisible",i)}function Vt(i){let u=typeof i=="boolean"?i:!!r&&r.style.display!=="none",d=document.getElementById("ytls-header-button");d instanceof HTMLButtonElement&&d.setAttribute("aria-pressed",String(u)),rn&&!Ko&&rn.src!==Pr&&(rn.src=Pr)}function yd(){r&&Si("uiVisible").then(i=>{let u=_t().safeParse(i),d=u.success?u.data:void 0;typeof d=="boolean"?(d?(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in")):r.style.display="none",Vt(d)):(!u.success&&i!==void 0&&l("UI visibility state failed validation, defaulting to visible",u.error.message,"warn"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),Vt(!0))}).catch(i=>{l("Failed to load UI visibility state:",i,"error"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),Vt(!0)})}function xi(i){if(!r){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(r)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(x=>{x!==r&&x.remove()}),document.body.appendChild(r));let u=document.querySelectorAll("#ytls-pane");u.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${u.length}), cleaning up`),u.forEach(x=>{x!==r&&x.remove()})),vt&&(clearTimeout(vt),vt=null);let d=r.style.display==="none";(typeof i=="boolean"?i:d)?(r.style.display="flex",r.classList.remove("ytls-fade-out"),r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),Vt(!0),ss(),Oe(),Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{Lt(),He?.(),Pe(),Ye(!0);try{xt(!0)}catch(x){l("Failed to scroll to nearest timestamp after toggle:",x,"warn")}Ie=null},450)):(r.classList.remove("ytls-fade-in"),r.classList.remove("ytls-zoom-in"),r.classList.add("ytls-zoom-out"),Vt(!1),Ae())}function ls(i){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let u=!1,d=[],b=(x,A)=>{let k=x.querySelector("input");if(!k)return;k.value=A;let S=x.dataset.guid,L=Number.parseInt(x.querySelector("[data-time]")?.dataset.time??"",10);S&&Number.isFinite(L)&&d.push({guid:S,start:L,comment:A})};try{let x=JSON.parse(i),A=null;if(Array.isArray(x))A=x;else if(typeof x=="object"&&x!==null){let k=Me;if(k){let S=`timekeeper-${k}`;x[S]&&Array.isArray(x[S].timestamps)&&(A=x[S].timestamps,l(`Found timestamps for current video (${k}) in export format`,"info"))}if(!A){let S=Object.keys(x).filter(L=>L.startsWith("ytls-"));if(S.length===1&&Array.isArray(x[S[0]].timestamps)){A=x[S[0]].timestamps;let L=x[S[0]].video_id;l(`Found timestamps for video ${L} in export format`,"info")}}}A&&Array.isArray(A)?A.every(S=>typeof S.start=="number"&&typeof S.comment=="string")?(A.forEach(S=>{if(S.guid){let L=Re().find(C=>C.dataset.guid===S.guid);L?b(L,S.comment):vo(S.start,S.comment,!1,S.guid)}else vo(S.start,S.comment,!1,crypto.randomUUID())}),u=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!u){let x=i.split(`
`).map(A=>A.trim()).filter(A=>A);if(x.length>0){let A=!1;x.forEach(k=>{let S=k.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(S){A=!0;let L=parseInt(S[1])||0,C=parseInt(S[2]),D=parseInt(S[3]),U=L*3600+C*60+D,ne=S[4]?S[4].trim():"",we=null,dt=ne,J=ne.match(/<!--\s*guid:([^>]+?)\s*-->/);J&&(we=J[1].trim(),dt=ne.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let re;we&&(re=Re().find(Ne=>Ne.dataset.guid===we)),!re&&!we&&(re=Re().find(Ne=>{if(Ne.dataset.guid)return!1;let Tt=Ne.querySelector("[data-time]")?.dataset.time;if(!Tt)return!1;let Dt=Number.parseInt(Tt,10);return Number.isFinite(Dt)&&Dt===U})),re?b(re,dt):vo(U,dt,!1,we||crypto.randomUUID())}}),A&&(u=!0)}}u?(l("Timestamps changed: Imported timestamps from file/clipboard"),Bt(),bi(),ns(Me,d),qe(),ur()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function vd(){if(hi){l("Pane initialization already in progress, skipping duplicate call");return}if(!(r&&document.body.contains(r))){hi=!0;try{let x=function(p=null,g=null){if(!m)return;let w=Be(),T=g||Y();if(!w&&!T)return;let M=p!==null?p:T?T.getCurrentTime():0,$=Number.isFinite(M)?Math.max(0,Math.floor(M)):Math.max(0,an()),{isLive:_}=T?T.getVideoData()||{isLive:!1}:{isLive:!1},z=T?Ja(T,!!_):!1;m.textContent=Dr($,ir(T,w)),m.style.color=z?"#ff4d4f":"",b(!!_);try{ui()}catch{}},A=function(){if(ye||Rt)return;let p=Y();if(!p)return;let g=p.getCurrentTime(),w=Number.isFinite(g)?Math.max(0,Math.floor(g)):Math.max(0,an());x(w,p),(s?Re():[]).length>0&&xt(!1,w)},re=function(p,g,w,T){let M=document.createElement("button");return T?K(M,T,p):M.textContent=p,De(M,g),M.classList.add("ytls-settings-modal-button"),M.onclick=w,M},Ne=function(p="general"){if(H&&H.parentNode===document.body){let ie=document.getElementById("ytls-save-modal"),fn=document.getElementById("ytls-load-modal"),Wt=document.getElementById("ytls-delete-all-modal");ie&&document.body.contains(ie)&&document.body.removeChild(ie),fn&&document.body.contains(fn)&&document.body.removeChild(fn),Wt&&document.body.contains(Wt)&&document.body.removeChild(Wt),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",Tt,!0),document.removeEventListener("keydown",at)},300);return}H=document.createElement("div"),H.id="ytls-settings-modal",H.classList.remove("ytls-fade-out"),H.classList.add("ytls-fade-in");let g=document.createElement("div");g.className="ytls-modal-header";let w=document.createElement("div");w.id="ytls-settings-nav";let T=document.createElement("button");T.className="ytls-modal-close-button",Ge(T,"x",14),T.onclick=()=>{if(H&&H.parentNode===document.body){let ie=document.getElementById("ytls-save-modal"),fn=document.getElementById("ytls-load-modal"),Wt=document.getElementById("ytls-delete-all-modal");ie&&document.body.contains(ie)&&document.body.removeChild(ie),fn&&document.body.contains(fn)&&document.body.removeChild(fn),Wt&&document.body.contains(Wt)&&document.body.removeChild(Wt),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",Tt,!0),document.removeEventListener("keydown",at)},300)}};let M=document.createElement("div");M.id="ytls-settings-content";let $=document.createElement("h3");$.className="ytls-section-heading",$.textContent="General",$.style.display="none";let _=document.createElement("div"),z=document.createElement("div");z.className="ytls-button-grid";let B=document.createElement("div");B.className="ytls-button-grid";function Q(ie){_.style.display=ie==="general"?"block":"none",z.style.display=ie==="google"?"block":"none",B.style.display=ie==="sync"?"block":"none",pe.classList.toggle("active",ie==="general"),Xe.classList.toggle("active",ie==="google"),At.classList.toggle("active",ie==="sync"),$.textContent=ie==="general"?"General":ie==="google"?"Google":"Sync"}let pe=document.createElement("button");pe.appendChild(Rn("adjustments-horizontal",16));let Le=document.createElement("span");Le.className="ytls-tab-text",Le.textContent=" General",pe.appendChild(Le),De(pe,"General settings"),pe.classList.add("ytls-settings-modal-button"),pe.onclick=()=>Q("general");let Xe=document.createElement("button");Xe.appendChild(Rn("cloud",16));let dn=document.createElement("span");dn.className="ytls-tab-text",dn.textContent=" Google",Xe.appendChild(dn),De(Xe,"Google Drive backup settings"),Xe.classList.add("ytls-settings-modal-button"),Xe.onclick=async()=>{yt.isSignedIn&&await Pu(),Q("google")};let At=document.createElement("button");At.appendChild(Rn("server",16));let pn=document.createElement("span");pn.className="ytls-tab-text",pn.textContent=" Sync",At.appendChild(pn),De(At,"Live sync across devices"),At.classList.add("ytls-settings-modal-button"),At.onclick=()=>Q("sync"),w.appendChild(pe),w.appendChild(Xe),w.appendChild(At),g.appendChild(w),g.appendChild(T),H.appendChild(g),_.className="ytls-button-grid",_.appendChild(re("Save","Save As...",Dt.onclick,"device-floppy")),_.appendChild(re("Load","Load",Un.onclick,"folder-open")),_.appendChild(re("Export All","Export All Data",cn.onclick,"file-export")),_.appendChild(re("Import All","Import All Data",Vn.onclick,"file-import")),_.appendChild(re("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await gd()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let jt=re(yt.isSignedIn?"Sign Out":"Sign In",yt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{yt.isSignedIn?await Du():await Bu(),K(jt,yt.isSignedIn?"logout":"login",yt.isSignedIn?"Sign Out":"Sign In"),De(jt,yt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ke()},yt.isSignedIn?"logout":"login"),ko=re($o()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await Gu(),Ar(),ke()},"refresh"),bs=re(`Backup Interval: ${kn()}min`,"Set periodic backup interval (minutes)",async()=>{await Fu(),Ar(),ke()},"clock-plus"),Ar=()=>{K(jt,yt.isSignedIn?"logout":"login",yt.isSignedIn?"Sign Out":"Sign In"),De(jt,yt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),K(ko,"refresh",$o()?"Auto Backup: On":"Auto Backup: Off"),K(bs,"clock-plus",`Backup Interval: ${kn()}min`),typeof ke=="function"&&ke()};z.appendChild(jt),z.appendChild(ko),z.appendChild(bs),z.appendChild(re("Backup Now","Run a backup immediately",async()=>{await jo({silent:!1,skipBackoff:!0}),Ar()},"database"));let $t=document.createElement("div");$t.style.marginTop="15px",$t.style.paddingTop="10px",$t.style.borderTop="1px solid #555",$t.style.fontSize="12px",$t.style.color="#aaa";let Er=document.createElement("div");Er.style.marginBottom="8px",Er.style.fontWeight="bold",$t.appendChild(Er),Su(Er);let Ei=document.createElement("div");Ei.style.marginBottom="8px",wu(Ei),$t.appendChild(Ei);let Ss=document.createElement("div");bu(Ss),$t.appendChild(Ss),z.appendChild($t),nt(),io(),ke(),Ar();let Mr=re("Sign In","Sign in to Timekeeper Sync with Google",async()=>{We().isSignedIn?await su():await iu()},"login"),xs=re("Sync Now","Sync with the server immediately",()=>xa(),"refresh");$c(()=>{let ie=We().isSignedIn;K(Mr,ie?"logout":"login",ie?"Sign Out":"Sign In"),De(Mr,ie?"Sign out of Timekeeper Sync":"Sign in to Timekeeper Sync with Google"),Mr.disabled=!ie&&!Hn(),xs.disabled=!ie}),B.appendChild(Mr),B.appendChild(xs);let mn=document.createElement("div");mn.style.marginTop="15px",mn.style.paddingTop="10px",mn.style.borderTop="1px solid #555",mn.style.fontSize="12px",mn.style.color="#aaa";let Ir=document.createElement("div");Ir.style.marginBottom="8px",Ir.style.fontWeight="bold",mn.appendChild(Ir),qc(Ir);let ks=document.createElement("div");mn.appendChild(ks),jc(ks),B.appendChild(mn),Go(),M.appendChild($),M.appendChild(_),M.appendChild(z),M.appendChild(B),Q(p==="drive"?"google":p),H.appendChild(M),document.body.appendChild(H),requestAnimationFrame(()=>{let ie=H.getBoundingClientRect(),Wt=(window.innerHeight-ie.height)/2;H.style.top=`${Math.max(20,Wt)}px`,H.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Tt,!0),document.addEventListener("keydown",at)},0)},at=function(p){if(p.key==="Escape"&&H&&H.parentNode===document.body){let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),T=document.getElementById("ytls-delete-all-modal");if(g||w||T)return;p.preventDefault(),g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),T&&document.body.contains(T)&&document.body.removeChild(T),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",Tt,!0),document.removeEventListener("keydown",at)},300)}},Tt=function(p){if(Yo&&Yo.contains(p.target))return;let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),T=document.getElementById("ytls-delete-all-modal");g&&g.contains(p.target)||w&&w.contains(p.target)||T&&T.contains(p.target)||H&&H.contains(p.target)||(g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),T&&document.body.contains(T)&&document.body.removeChild(T),H&&H.parentNode===document.body&&(H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",Tt,!0),document.removeEventListener("keydown",at)},300)))},So=function(){r&&(l("Loading window position from IndexedDB"),Si("windowPosition").then(p=>{let g=Es.safeParse(p);if(g.success){let T=g.data;r.style.left=`${T.x}px`,r.style.top=`${T.y}px`,r.style.right="auto",r.style.bottom="auto",typeof T.width=="number"&&T.width>0?r.style.width=`${T.width}px`:(r.style.width=`${pi}px`,l(`No stored window width found, using default width ${pi}px`)),typeof T.height=="number"&&T.height>0?r.style.height=`${T.height}px`:(r.style.height=`${mi}px`,l(`No stored window height found, using default height ${mi}px`));let M=oe();xe(M,T.x,T.y),l("Restored window position from IndexedDB:",F())}else g.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",g.error.message,"warn"),r.style.width=`${pi}px`,r.style.height=`${mi}px`,R(null);Fn();let w=oe();w&&(w.width||w.height)&&xe(w),He?.()}).catch(p=>{l("failed to load pane position from IndexedDB:",p,"warn"),Fn();let g=oe();g&&(g.width||g.height)&&R({x:Math.max(0,Math.round(g.left)),y:0,width:Math.round(g.width),height:Math.round(g.height)}),He?.()}))},xo=function(){if(!r)return;let p=oe();if(!p)return;let g={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)},w=F();if(w&&w.x===g.x&&w.y===g.y&&w.width===g.width&&w.height===g.height){l("Skipping window position save; position and size unchanged");return}R({...g}),l(`Saving window position and size to IndexedDB: x=${g.x}, y=${g.y}, width=${g.width}, height=${g.height}`),fr("windowPosition",g),En({type:"window_position_updated",position:g,timestamp:Date.now()})},Sr=function(p,g){p.addEventListener("dblclick",w=>{w.preventDefault(),w.stopPropagation(),r&&(r.style.width="300px",r.style.height="300px",xo(),Tr())}),p.addEventListener("mousedown",w=>{w.preventDefault(),w.stopPropagation(),Pt=!0,un=g,ms=w.clientX,fs=w.clientY;let T=r.getBoundingClientRect();qn=T.width,jn=T.height,wr=T.left,br=T.top,hs=document.documentElement.clientWidth,gs=document.documentElement.clientHeight,g==="top-left"||g==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},vs=function(){if(!s||!on)return;let{scrollTop:p,scrollHeight:g,clientHeight:w}=s;if(g<=w)return;let T=Math.max(30,w/g*w),M=p/(g-w)*(w-T);on.style.height=`${T}px`,on.style.top=`${M}px`},ws=function(){Ke&&(Ai===null&&(Ai=requestAnimationFrame(()=>{Ai=null,vs()})),Ke.classList.add("ytls-scrollbar-visible"),wt&&clearTimeout(wt),wt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),wt=null},500))},Tr=function(){if(r&&c&&h&&s){let p=r.getBoundingClientRect(),g=c.getBoundingClientRect(),w=h.getBoundingClientRect(),T=p.height-(g.height+w.height);s.style.maxHeight=T>0?T+"px":"0px",s.style.overflowY=T>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),!document.getElementById("ytls-styles")){let p=document.createElement("style");p.id="ytls-styles",p.textContent=pl,document.head.appendChild(p)}r=document.createElement("div"),c=document.createElement("div"),s=document.createElement("ul"),h=document.createElement("div"),m=document.createElement("span"),P=document.createElement("span"),G=document.createElement("span"),G.classList.add("ytls-backup-indicator"),G.style.cursor="pointer",G.style.backgroundColor="#666",G.onclick=p=>{p.stopPropagation(),Ne(oi()?"sync":"drive")},s.addEventListener("mouseenter",()=>{Mn=!0,mo=!1}),s.addEventListener("mouseleave",()=>{Mn=!1;try{Ri()}catch{}if(mo)return;xt(!1);let p=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(p=document.activeElement.closest("li")?.dataset.guid??null),ts(),p){let w=Re().find(T=>T.dataset.guid===p)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}}),r.id="ytls-pane",c.id="ytls-pane-header",c.addEventListener("dblclick",p=>{let g=p.target instanceof Element?p.target:null;if(g){let w=g;for(;w&&w!==r;){if(window.getComputedStyle(w).cursor==="pointer")return;w=w.parentElement}}p.preventDefault(),xi(!1)});let i=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{r.addEventListener(p,i)}),r.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),r.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0),P.textContent=`v${Br}`,P.classList.add("ytls-version-display"),Ci&&De(P,`Built ${Ci.toLocaleString()}`);let u=document.createElement("span");u.style.display="inline-flex",u.style.alignItems="center",u.style.gap="6px",u.appendChild(P),u.appendChild(G),v=document.createElement("span"),v.id="ytls-members-badge",v.appendChild(Rn("star",14)),De(v,"Members-only stream"),ps(),m.id="ytls-current-time",m.textContent="\u2014",m.style.cursor="default",De(m,()=>{let p=Y(),{isLive:g}=p?p.getVideoData()||{isLive:!1}:{isLive:!1};return g?"Skip to live":""}),y=document.createElement("span"),y.id="ytls-playback-speed",y.textContent="1x",y.style.cursor="pointer",y.style.userSelect="none",De(y,()=>`Current playback speed. Click to toggle between 1x and ${Gt(E)}x.`),y.onclick=()=>{Ha()},y.addEventListener("mousedown",p=>{p.stopPropagation()}),y.addEventListener("click",p=>{p.stopPropagation()}),m.onclick=()=>{let p=Y();if(!p)return;let{isLive:g}=p.getVideoData()||{isLive:!1};g&&(Rt=!0,p.seekToLiveHead(),setTimeout(()=>{Rt=!1},500))};let b=p=>{m.style.cursor=p?"pointer":"default"};A(),Ee&&clearInterval(Ee),Ee=setInterval(A,1e3),h.id="ytls-buttons";let k=(p,g)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),g&&g()},300)},S=p=>g=>{g.key==="Escape"&&(g.preventDefault(),g.stopPropagation(),p())},L=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},C=(p,g)=>w=>{p.contains(w.target)||g()},D=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(kt())return;let p=typeof zn<"u"?zn:0,g=Y(),w=g?Math.floor(g.getCurrentTime()+p):0;if(!Number.isFinite(w))return;let T=vo(w,"");T&&T.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>Ne()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(p){if(kt()){Ge(this,"circle-x",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3);return}let g=gi();if(g.length===0){Ge(this,"circle-x",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3);return}let w=p.ctrlKey,T=Bi(g,w);navigator.clipboard.writeText(T).then(()=>{Ge(this,"circle-check",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3)}).catch(M=>{l("Failed to copy timestamps: ",M,"error"),Ge(this,"circle-x",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(kt())return;if(Re().length===0){alert("No timestamps available to offset.");return}let g=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(g===null)return;let w=g.trim();if(w.length===0)return;let T=Number.parseInt(w,10);if(!Number.isFinite(T)){alert("Please enter a valid integer number of seconds.");return}T!==0&&Za(T,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let p=bo();if(!p){alert("Unable to determine current video ID.");return}let g=document.createElement("div");g.id="ytls-delete-all-modal",g.classList.remove("ytls-fade-out"),g.classList.add("ytls-fade-in");let w=document.createElement("p");w.textContent="Hold the button to delete all timestamps for:",w.style.marginBottom="10px";let T=document.createElement("p");T.textContent=p,T.style.fontFamily="monospace",T.style.fontSize="12px",T.style.marginBottom="15px",T.style.color="#aaa";let M=document.createElement("button");M.classList.add("ytls-save-modal-button"),M.style.background="#d32f2f",M.style.position="relative",M.style.overflow="hidden";let $=null,_=0,z=null,B=document.createElement("div");B.style.position="absolute",B.style.left="0",B.style.top="0",B.style.height="100%",B.style.width="0%",B.style.background="#ff6b6b",B.style.transition="none",B.style.pointerEvents="none",M.appendChild(B);let Q=document.createElement("span");Q.textContent="Hold to Delete All",Q.style.position="relative",Q.style.zIndex="1",M.appendChild(Q);let pe=()=>{if(!_)return;let jt=Date.now()-_,ko=Math.min(jt/5e3*100,100);B.style.width=`${ko}%`,ko<100&&(z=requestAnimationFrame(pe))},Le=()=>{$&&(clearTimeout($),$=null),z&&(cancelAnimationFrame(z),z=null),_=0,B.style.width="0%",Q.textContent="Hold to Delete All"};M.onmousedown=()=>{_=Date.now(),Q.textContent="Deleting...",z=requestAnimationFrame(pe),$=setTimeout(async()=>{Le(),g.classList.remove("ytls-fade-in"),g.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(g)&&document.body.removeChild(g);try{await as(p),ki()}catch(jt){l("Failed to delete all timestamps:",jt,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},M.onmouseup=Le,M.onmouseleave=Le;let Xe=null,dn=null,At=k(g,()=>{Le(),Xe&&document.removeEventListener("keydown",Xe),dn&&document.removeEventListener("click",dn,!0)});Xe=S(At),dn=C(g,At);let pn=document.createElement("button");pn.textContent="Cancel",pn.classList.add("ytls-save-modal-cancel-button"),pn.onclick=At,g.appendChild(w),g.appendChild(T),g.appendChild(M),g.appendChild(pn),document.body.appendChild(g),L(Xe),D(dn)}}].forEach(p=>{let g=document.createElement("button");Ge(g,p.icon,20),De(g,p.title),g.classList.add("ytls-main-button"),p.id==="copy"?g.onclick=function(w){p.action.call(this,w)}:g.onclick=p.action,p.id==="settings"&&(Yo=g),h.appendChild(g)});let Dt=document.createElement("button");K(Dt,"device-floppy","Save"),Dt.classList.add("ytls-file-operation-button"),Dt.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Save as:";let w=null,T=null,M=k(p,()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0)});w=S(M),T=C(p,M);let $=document.createElement("button");$.textContent="JSON",$.classList.add("ytls-save-modal-button"),$.onclick=()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),k(p,()=>rs("json"))()};let _=document.createElement("button");_.textContent="Plain Text",_.classList.add("ytls-save-modal-button"),_.onclick=()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),k(p,()=>rs("text"))()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=M,p.appendChild(g),p.appendChild($),p.appendChild(_),p.appendChild(z),document.body.appendChild(p),L(w),D(T)};let Un=document.createElement("button");K(Un,"folder-open","Load"),Un.classList.add("ytls-file-operation-button"),Un.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Load from:";let w=null,T=null,M=k(p,()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0)});w=S(M),T=C(p,M);let $=document.createElement("button");$.textContent="File",$.classList.add("ytls-save-modal-button"),$.onclick=()=>{let B=document.createElement("input");B.type="file",B.accept=".json,.txt",B.classList.add("ytls-hidden-file-input"),B.onchange=Q=>{let pe=Q.target.files?.[0];if(!pe)return;w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),M();let Le=new FileReader;Le.onload=()=>{let Xe=String(Le.result).trim();ls(Xe)},Le.readAsText(pe)},B.click()};let _=document.createElement("button");_.textContent="Clipboard",_.classList.add("ytls-save-modal-button"),_.onclick=async()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),k(p,async()=>{try{let B=await navigator.clipboard.readText();B?ls(B.trim()):alert("Clipboard is empty.")}catch(B){l("Failed to read from clipboard: ",B,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=M,p.appendChild(g),p.appendChild($),p.appendChild(_),p.appendChild(z),document.body.appendChild(p),L(w),D(T)};let cn=document.createElement("button");K(cn,"file-export","Export"),cn.classList.add("ytls-file-operation-button"),cn.onclick=async()=>{try{await hd()}catch{alert("Failed to export data: Could not read from database.")}};let Vn=document.createElement("button");K(Vn,"file-import","Import"),Vn.classList.add("ytls-file-operation-button"),Vn.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=g=>{let w=g.target.files?.[0];if(!w)return;let T=new FileReader;T.onload=()=>{try{let M=JSON.parse(String(T.result)),$=[];for(let _ in M)if(Object.prototype.hasOwnProperty.call(M,_)&&_.startsWith("ytls-")){let z=_.substring(5),B=M[_];if(B&&typeof B.video_id=="string"&&Array.isArray(B.timestamps)){let Q=B.timestamps.map(Le=>({...Le,guid:Le.guid||crypto.randomUUID()})),pe=ld(z,Q).then(()=>l(`Imported ${z} to IndexedDB`)).catch(Le=>l(`Failed to import ${z} to IndexedDB:`,Le,"error"));$.push(pe)}else l(`Skipping key ${_} during import due to unexpected data format.`,"warn")}Promise.all($).then(()=>{ki()}).catch(_=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",_,"error")})}catch(M){alert(`Failed to import data. Please ensure the file is in the correct format.
`+M.message),l("Import error:",M,"error")}},T.readAsText(w)},p.click()},s.onclick=p=>{es(p)},s.ontouchstart=p=>{es(p)},r.style.position="fixed",r.style.bottom="0",r.style.right="0",r.style.transition="none",So(),setTimeout(()=>Fn(),10);let qt=!1,hr=0,gr=0,yr=0,Bn=0,vr=0,V=0,N=null,ue=!1;r.addEventListener("mousedown",p=>{let g=p.target;if(!(g instanceof Element)||g instanceof HTMLInputElement||g instanceof HTMLTextAreaElement||g instanceof Element&&(g.closest("#ytls-playback-speed-group")||g.closest("#ytls-playback-speed"))||g!==c&&!c.contains(g)&&window.getComputedStyle(g).cursor==="pointer")return;qt=!0,ue=!1;let w=r.getBoundingClientRect();hr=p.clientX-w.left,gr=p.clientY-w.top,yr=w.width,Bn=w.height,vr=document.documentElement.clientWidth,V=document.documentElement.clientHeight,r.style.transition="none"}),document.addEventListener("mousemove",Xo=p=>{if(!qt)return;ue=!0;let g=p.clientX,w=p.clientY;N===null&&(N=requestAnimationFrame(()=>{if(N=null,!qt)return;let T=Math.max(0,Math.min(g-hr,vr-yr)),M=Math.max(0,Math.min(w-gr,V-Bn));r.style.left=`${T}px`,r.style.top=`${M}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",Jo=()=>{if(!qt)return;qt=!1,N!==null&&(cancelAnimationFrame(N),N=null);let p=ue;setTimeout(()=>{ue=!1},50),Fn(),setTimeout(()=>{p&&xo()},200)}),r.addEventListener("dragstart",p=>p.preventDefault());let Z=document.createElement("div"),fe=document.createElement("div"),je=document.createElement("div"),pt=document.createElement("div");Z.id="ytls-resize-tl",fe.id="ytls-resize-tr",je.id="ytls-resize-bl",pt.id="ytls-resize-br";let Pt=!1,ms=0,fs=0,qn=0,jn=0,wr=0,br=0,hs=0,gs=0,$n=null,un=null;Sr(Z,"top-left"),Sr(fe,"top-right"),Sr(je,"bottom-left"),Sr(pt,"bottom-right"),document.addEventListener("mousemove",p=>{if(!Pt||!r||!un)return;let g=p.clientX,w=p.clientY;$n===null&&($n=requestAnimationFrame(()=>{if($n=null,!Pt||!r||!un)return;let T=g-ms,M=w-fs,$=hs,_=gs,z=qn,B=jn,Q=wr,pe=br;un==="bottom-right"?(z=Math.max(200,Math.min(800,qn+T)),B=Math.max(250,Math.min(_,jn+M))):un==="top-left"?(z=Math.max(200,Math.min(800,qn-T)),Q=wr+T,B=Math.max(250,Math.min(_,jn-M)),pe=br+M):un==="top-right"?(z=Math.max(200,Math.min(800,qn+T)),B=Math.max(250,Math.min(_,jn-M)),pe=br+M):un==="bottom-left"&&(z=Math.max(200,Math.min(800,qn-T)),Q=wr+T,B=Math.max(250,Math.min(_,jn+M))),Q=Math.max(0,Math.min(Q,$-z)),pe=Math.max(0,Math.min(pe,_-B)),r.style.width=`${z}px`,r.style.height=`${B}px`,r.style.left=`${Q}px`,r.style.top=`${pe}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Pt&&(Pt=!1,$n!==null&&(cancelAnimationFrame($n),$n=null),un=null,document.body.style.cursor="",Ye(!0))});let xr=null;window.addEventListener("resize",Qo=()=>{xr&&clearTimeout(xr),xr=setTimeout(()=>{Ye(!0),He?.(),xr=null},200)}),c.appendChild(v),c.appendChild(m);let Wn=document.createElement("span");Wn.id="ytls-playback-speed-group",Wn.style.display="inline-flex",Wn.style.alignItems="center",Wn.style.marginLeft="4px",y&&Wn.appendChild(y),c.appendChild(Wn),c.appendChild(u);let Ti=document.createElement("div");Ti.id="ytls-list-wrapper",Ke=document.createElement("div"),Ke.className="ytls-scrollbar-track",on=document.createElement("div"),on.className="ytls-scrollbar-thumb",Ke.append(on),Ti.append(s,Ke);let kr=document.createElement("div");kr.id="ytls-content",kr.append(Ti),kr.append(h),r.append(c,kr,Z,fe,je,pt);let ys="";r.addEventListener("mousemove",p=>{if(qt||Pt)return;let g=r.getBoundingClientRect(),w=20,T=p.clientX,M=p.clientY,$=T-g.left<=w,_=g.right-T<=w,z=M-g.top<=w,B=g.bottom-M<=w,Q="";z&&$||B&&_?Q="nwse-resize":(z&&_||B&&$)&&(Q="nesw-resize"),Q!==ys&&(ys=Q,document.body.style.cursor=Q)});let Ai=null;if(Ke.addEventListener("mouseenter",()=>{wt&&(clearTimeout(wt),wt=null),Ke.classList.add("ytls-scrollbar-visible")}),Ke.addEventListener("mouseleave",()=>{fi||(wt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),wt=null},500))}),on.addEventListener("mousedown",p=>{if(!s)return;p.preventDefault(),p.stopPropagation(),fi=!0;let g=p.clientY,w=s.scrollTop,{scrollHeight:T,clientHeight:M}=s,$=Math.max(30,M/T*M),_=T-M,z=M-$;function B(pe){if(!s)return;let Le=pe.clientY-g;s.scrollTop=Math.max(0,Math.min(_,w+Le*(_/z))),vs()}function Q(){fi=!1,document.removeEventListener("mousemove",B),document.removeEventListener("mouseup",Q),Ke?.matches(":hover")||(wt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),wt=null},500))}document.addEventListener("mousemove",B),document.addEventListener("mouseup",Q)}),r.addEventListener("mouseenter",()=>{Mn=!0,ws()}),s.addEventListener("scroll",ws),r.addEventListener("mouseleave",()=>{!Pt&&!qt&&(document.body.style.cursor=""),Mn=!1;try{Ri()}catch{}try{xt(!1)}catch{}}),He=Tr,setTimeout(()=>{if(Tr(),r&&c&&h&&s){let p=40,g=Re();if(g.length>0)p=g[0].offsetHeight;else{let w=document.createElement("li");w.style.visibility="hidden",w.style.position="absolute",w.textContent="00:00 Example",s.appendChild(w),p=w.offsetHeight,s.removeChild(w)}j(c.offsetHeight+h.offsetHeight+p),r.style.minHeight=O()+"px"}},0),St){try{St.disconnect()}catch{}St=null}St=new ResizeObserver(Tr),St.observe(r),uo||document.addEventListener("pointerdown",uo=()=>{Va=Date.now()},!0),po||document.addEventListener("pointerup",po=()=>{},!0)}finally{hi=!1}}}async function wd(){if(!r)return;if(document.querySelectorAll("#ytls-pane").forEach(d=>{d!==r&&(l("Removing duplicate pane element from DOM"),d.remove())}),document.body.contains(r)){l("Pane already in DOM, skipping append");return}await yd(),Au(md),Eu(fd),Ia(fr),La(Si),Mu(mr),xu(G),Jc(()=>ci()),await Ca(),await Nu(),await Tn(),ci();let u=document.querySelectorAll("#ytls-pane");if(u.length>0&&(l(`WARNING: Found ${u.length} existing pane(s) in DOM, removing all`),u.forEach(d=>d.remove())),document.body.contains(r)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(r),l("Pane successfully appended to DOM"),Oe(),Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{Lt(),He?.(),Pe(),Ye(!0),Ie=null},450),bt){try{bt.disconnect()}catch{}bt=null}bt=new MutationObserver(()=>{let d=document.querySelectorAll("#ytls-pane");d.length>1&&(l(`CRITICAL: Multiple panes detected (${d.length}), removing duplicates`),d.forEach((b,x)=>{(x>0||r&&b!==r)&&b.remove()}))}),bt.observe(document.body,{childList:!0})}function cs(i=0){if(document.getElementById("ytls-header-button")){Vt();return}let u=document.querySelector("#logo");if(!u||!u.parentElement){i<10&&setTimeout(()=>cs(i+1),300);return}let d=document.createElement("button");d.id="ytls-header-button",d.type="button",d.className="ytls-header-button",De(d,"Toggle Timekeeper UI"),d.setAttribute("aria-label","Toggle Timekeeper UI");let b=document.createElement("img");b.src=Pr,b.alt="",b.decoding="async",d.appendChild(b),rn=b,d.addEventListener("mouseenter",()=>{rn&&(Ko=!0,rn.src=ml)}),d.addEventListener("mouseleave",()=>{rn&&(Ko=!1,Vt())}),d.addEventListener("click",()=>{r&&!document.body.contains(r)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(r)),xi()}),u.insertAdjacentElement("afterend",d),Vt(),l("Timekeeper header button added next to YouTube logo")}function us(){if(ge())return;de(!0);let i=history.pushState,u=history.replaceState;function d(){try{let b=new Event("locationchange");window.dispatchEvent(b)}catch{}}history.pushState=function(){let b=i.apply(this,arguments);return d(),b},history.replaceState=function(){let b=u.apply(this,arguments);return d(),b},window.addEventListener("popstate",d),window.addEventListener("locationchange",()=>{window.location.href!==ee&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function ki(){if(!a()){rd();return}ae(window.location.href),document.querySelectorAll("#ytls-pane").forEach((u,d)=>{(d>0||r&&u!==r)&&u.remove()}),await ce(),await vd(),Me=bo(),f?.videoId!==Me&&ds(null);let i=document.title;l("Page Title:",i),l("Video ID:",Me),l("Current URL:",window.location.href),vi(!0),go(),qe(),await mr(),qe(),vi(!1),l("Timestamps loaded and UI unlocked for video:",Me),await wd();try{xt(!0)}catch{}cs(),sd()}us(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),dr(),a()&&r&&s&&(l("Locking UI and showing loading state for navigation"),vi(!0))}),co=i=>{if(!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&!i.shiftKey&&(i.key==="z"||i.key==="Z")){if(Vu(i.target))return;Ha()&&(i.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}i.ctrlKey&&i.altKey&&i.shiftKey&&(i.key==="T"||i.key==="t")&&(i.preventDefault(),xi(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",co),window.addEventListener("pagehide",dr),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&dr()});function ds(i){let u=typeof unsafeWindow<"u"?unsafeWindow:window,d=uc(i?.response??u.ytInitialData,i?.playerResponse??u.ytInitialPlayerResponse);f=d,ps(),d&&au(d)}function ps(){if(!v)return;let i=null;try{i=bo()}catch{}let u=!!f?.membersOnly&&f.videoId===i;v.style.display=u?"inline-flex":"none"}window.addEventListener("yt-navigate-finish",i=>{l("Navigation finished (yt-navigate-finish event fired)"),ds(i.detail?.response),window.location.href!==ee?ki():l("Navigation finished but URL already handled, skipping.")});function bd(i){let u=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(i);if(u&&(u[1]||u[2]||u[3]))return Number(u[1]||0)*3600+Number(u[2]||0)*60+Number(u[3]||0);let d=Number(i);return Number.isFinite(d)?d:null}document.addEventListener("click",i=>{if(i.button!==0||i.ctrlKey||i.metaKey||i.shiftKey||i.altKey)return;let u=i.target?.closest?.("ytd-comments a[href]");if(!u)return;let d=new URL(u.href,location.href),b=d.searchParams.get("t");if(d.pathname!=="/watch"||!b||d.searchParams.get("v")!==bo())return;let x=bd(b),A=Y();x===null||!A||(i.preventDefault(),i.stopImmediatePropagation(),A.seekTo(x))},!0),Vc(i=>{for(let u of i)En({type:"timestamps_updated",videoId:u,action:"synced"});Me&&i.includes(Me)&&mr()}),fu(),us(),l("Timekeeper initialized and waiting for navigation events")})();})();

