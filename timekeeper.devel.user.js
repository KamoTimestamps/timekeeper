// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.3.8.728
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

(()=>{var xd=Object.defineProperty;var Td=(e,t)=>{for(var n in t)xd(e,n,{get:t[n],enumerable:!0})};var To=class extends Error{},Qe=(e,t)=>{throw new To(`${e||"value"}: expected ${t}`)};function Tt(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(o){if(o instanceof To)return{success:!1,error:o};throw o}},array:()=>Ad(t)};return t}var Es=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function Y(){return Tt((e,t)=>typeof e=="string"?e:Qe(t,"string"))}function Dt(){return Tt((e,t)=>typeof e=="boolean"?e:Qe(t,"boolean"))}function Le(e={}){return Tt((t,n)=>typeof t!="number"||Number.isNaN(t)?Qe(n,"number"):(e.finite&&!Number.isFinite(t)&&Qe(n,"finite number"),e.int&&!Number.isInteger(t)&&Qe(n,"integer"),e.nonnegative&&t<0&&Qe(n,"number >= 0"),e.positive&&t<=0&&Qe(n,"number > 0"),e.min!==void 0&&t<e.min&&Qe(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&Qe(n,`number <= ${e.max}`),t))}function we(e){return Tt((t,n)=>t===void 0?void 0:e.run(t,n))}function Ze(e){return Tt((t,n)=>t===null?null:e.run(t,n))}function Je(e,t){return Tt((n,o)=>{try{return e.run(n,o)}catch(a){if(a instanceof To)return t;throw a}})}function Ad(e){return Tt((t,n)=>Array.isArray(t)?t.map((o,a)=>e.run(o,`${n}[${a}]`)):Qe(n,"array"))}function Ed(e){return Tt((t,n)=>{if(!Es(t))return Qe(n,"object");let o={};for(let a of Object.keys(t))o[a]=e.run(t[a],n?`${n}.${a}`:a);return o})}function be(e){let t=Tt((n,o)=>{if(!Es(n))return Qe(o,"object");let a={};for(let r of Object.keys(e)){let c=e[r].run(n[r],o?`${o}.${r}`:r);c!==void 0&&(a[r]=c)}return a});return Object.assign(t,{extend:n=>be({...e,...n}),partial:()=>{let n={};for(let o of Object.keys(e))n[o]=we(e[o]);return be(n)}})}var Id=Tt((e,t)=>typeof e=="string"&&e.length>0?e:Qe(t,"non-empty string")),Mr=be({guid:Id,start:Le({finite:!0,nonnegative:!0}),comment:Y(),write_counter:we(Le({int:!0,positive:!0})),deleted_at:Je(we(Le()),void 0)}),Ao=Mr.array(),mn=Mr.extend({video_id:Y(),device_id:we(Y())}),Is=be({x:Le({finite:!0}),y:Le({finite:!0}),width:we(Le({finite:!0,positive:!0})),height:we(Le({finite:!0,positive:!0}))}),Lr=be({video_id:Y(),timestamps:Ao}),Ms=Ed(Lr),As=be({isSignedIn:Je(Dt(),!1),accessToken:Je(Ze(Y()),null),userName:Je(Ze(Y()),null),email:Je(Ze(Y()),null)}),Ei=Je(Tt((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return Qe(t,"valid JSON string for auth state")}return As.run(n,t)}return As.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),Kn={isSignedIn:!1,accessToken:null,accessTokenExpiresAt:null,refreshToken:null,userId:null,userName:null,email:null},Ii=Je(be({isSignedIn:Je(Dt(),!1),accessToken:Je(Ze(Y()),null),accessTokenExpiresAt:Je(Ze(Le({finite:!0})),null),refreshToken:Je(Ze(Y()),null),userId:Je(Ze(Y()),null),userName:Je(Ze(Y()),null),email:Je(Ze(Y()),null)}),Kn),Md=be({autoBackupEnabled:Dt(),autoBackupIntervalMinutes:Le({int:!0,min:5,max:1440}),lastAutoBackupAt:we(Ze(Le({int:!0,positive:!0})))}),Mi=Md;var Ls=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-alarm-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 13a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
  <path d="M7 4l-2.75 2" />
  <path d="M17 4l2.75 2" />
  <path d="M10 13h4" />
  <path d="M12 11v4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12l14 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M9 12h6" />
  <path d="M12 9v6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 7l16 0" />
  <path d="M10 11l0 6" />
  <path d="M14 11l0 6" />
  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
  <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
</svg>`;var Hs=`<svg
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
</svg>`;var Ns=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l2 2l4 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
  <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M14 4l0 4l-6 0l0 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-export"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-star"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
</svg>`;var sl=`<svg
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
</svg>`;var lp={plus:Ls,"alarm-plus":Cs,minus:Bs,"circle-plus":Rs,"circle-minus":Ds,trash:Ps,clipboard:_s,settings:Os,"clock-plus":Hs,"current-location":Ns,"player-record":zs,"circle-x":Gs,"circle-check":Fs,"adjustments-horizontal":Us,cloud:Vs,"device-floppy":qs,"folder-open":js,"file-export":$s,"file-import":Ws,"file-spreadsheet":Ys,login:Ks,logout:Xs,refresh:Js,star:Qs,"alert-triangle":Zs,database:el,server:tl,world:nl,"plug-connected":ol,key:rl,x:il,"indent-increase":al,"indent-decrease":sl},ll="http://www.w3.org/2000/svg",cp=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,up=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,dp=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,cl=new Map;function ul(e){let t={};for(let n of e.matchAll(dp))t[n[1]]=n[2];return t}function pp(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function mp(e){let t=pp(e).match(cp);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,o]=t,a=document.createElementNS(ll,"svg"),r=ul(n);for(let[c,s]of Object.entries(r))c!=="class"&&a.setAttribute(c,s);for(let c of o.matchAll(up)){let[,s,h]=c,m=document.createElementNS(ll,s),v=ul(h);for(let[f,y]of Object.entries(v))m.setAttribute(f,y);a.appendChild(m)}return a}function fp(e){let t=cl.get(e);if(t)return t;let n=mp(lp[e]);return cl.set(e,n),n}function Dn(e,t=20){let n=fp(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function Fe(e,t,n){e.replaceChildren(Dn(t,n))}function K(e,t,n,o){e.replaceChildren(Dn(t,o),document.createTextNode("\xA0"+n))}var dl="5.3.8";var Cr=dl+"+879fd07",Li=null;function l(e,...t){let n="debug",o=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=o.pop());let a=`[Timekeeper v${Cr}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...o)}var Br=e=>String(e).padStart(2,"0");function fn(e,t=e){let n=Math.floor(e/3600),o=Math.floor(e%3600/60),a=Br(e%60);return t<3600?`${t>=600?Br(o):o}:${a}`:`${t>=36e3?Br(n):n}:${Br(o)}:${a}`}function Rr(e,t){return fn(e,Math.max(e,t))}function Ci(e,t){let n=Math.max(0,...e.map(o=>o.start));return e.map(o=>{let a=fn(o.start,n),r=t?`${o.comment} <!-- guid:${o.guid} -->`.trimStart():o.comment;return`${a} ${r}`}).join(`
`)}function pl(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Pn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var ml=`#ytls-pane {
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
`;var Dr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISKNpo4IcAAAL9UExURQAAAP/abf7Zaf/Yaf7Ya//XaP/WZv/VZf/VY//UYf/SYv/SYPvTZf/QZ//ObP7QYPzRYP7QXfjRZv7Kdv7PW/3OX//FgPnOXv7MVv/ChP3LWPzLWv7Bhf3EeP++jfXJZPXKW/rIWPvIVffIWv+4lvvGVfPIXvHJXvrFV/vFU/61nPvFUP6zn/i5ivrCU/2yl/6vovvBTP+tp/6upPjBUPbBVPPCVfG8ee3EWOnEXvm+UPu0fvq+SO/AV/m9TPq1cvm9Svq9Req/YPm1Zva7Tvi6Tfi6S/m3V/G8T+e/Vvi5R+20ePi3Sui3bvi3RPe2S/Snn/a1R/e0R/G3ReW6Uve0QOm5Seu3Tei4T/eyRvaySOC6VvaxPuyzSuO1V+W1T922Udi0UuCvS+WtRuqrPNSwU+SbldiqZ+epP9mpSNamT86qT96kP82pSuKhOsemStifPdedN8OiTMufQtGOidaaOMKhSNmYNMyVRb2cR9OUM+yFLuuEL+iDLcWSOM+NLbaVQ8iMMrqQPON+K72Be99/KMaGNK2QQcGFOsmEI9h7JdV7IaiLP9l2KMd+HLCFNKyAVdVyJc14Gr97LqKHPLx6Ms1zJ8Z4GMJ4Hrx6Icd2Fqpyb89tI5yAOJ17SaV7MsNtJrhwKqB5NJd8Npd6O7xsHsRlHpt1MaVyJbZnJJB1MbljII11NZtwI5ZmX7BhIYZvL41rKohpLoJqLZBkIKJaHp9eEKpVGXhjLXthL5hUHHxdIo9RFnRaJnBcJnFYKXNVJ3RSG2lWI4JIF25PJWlON2ZPJmpOGmFRIWVNHGhKImNKHXNCC1hIHVxAHlRDIWg5EVc9HU5AGGM1D0w8HlA8E1I5HEc6Fkw3EFcxEEo0GkQ2G0UxGT8tGDswEUwoCzsuFj8oJj0tDDsrGDksFzgpFkMkCjQnFjMpDTAjFS0lDC0iFDEiCDcdCSoiCikgFCYeByQcEzAYBSoaBSQcByIbBykUBBwVBRcSBBoLAhQNAw8JBAsKAwcGAgAAAN3XOCgAAAABdFJOUwBA5thmAAAGaElEQVR42u2WW2wUVRjH/2dmdy7doduy7S6XQltaIaCiYlJEhYpRo1aMJEbxQgQvRI0YNPESjVGjiS/qiz5ojEEfBKOEgNJQQKRcWy6FSmtoramlpVCWUsre5rI75ziXLXTd1t2++eAvk8zszPl+5/+d3cke/E9eUG3g1KnuYTqxIoygtWx5b+3qVatf/7pZQ54YHU17mzpUW5Jq/uiJCtlnE3ri81PZKQiy6T16IAqPVH7dnLLwroZ6nUOa0keenJ+HYOjbAyd0MxCUA5U1xzb2ArhiUN553pNTQPd8+asKQA755ye3XQYg6SDpcc++Ozm3oH7teQ4UIN6SQT09Kp3C88qbUk4BTm5sPa4RQCVgsCjSNYDYBu/y1bdzuQV08LdDejIZ3X2OgALFD+CPvmEYrHDBkqU1HPIgun7da+tWVImCIHi9XqFq5RtvrXvpmZfe+j5KkYUHWcQ3f9kBDRQu7MzuRcUFPh9ie3335yMY+v6rVgCUEZaWDP4SmFkIPh7TTU1CrjUI//DZ6XQ9dR8zcIQUlCjVYnhq3TI5h2Bow2e9DIwBjIJQBhAOjCMAJ1dVqoG6B6V/FWg/fmjVAxSM2uU8YFoK20AImXK9NnX5gxxGk/mJ7tpw/oaVL668SWB2FzxM0wTPKCxY+ZPLr5nd/1MjxbjQ5tUVrzZ09bQ3vDqZ9xAPcbGueK/y3KYTPV1H1z+6toWOm6Bn855VTy8qEv3VD6+SKUy4mDwFfezxGwu9hRV314V/Do8nMA7+sHTZDAMwUHTH9YyHRXGxbWCkujZEYSEuKGvelxpbQA9sIPNnUlDrSE5eAAt+5esfvGArcGtZEoxSIFTZ1dBCxxR0bj1ZNUWABQMEkQf4NXUlqaVrLAMt8Jj2vBSeKeaeHUNjCeL128qJRmEnSJmGblr1dw/0hDtuXsGDGHa5AYsBdfjQQZotoLt2+xTS3g+XoePEXLLw4gUGrbf2cR7tEYCCAv2dMeNwwymaJWja3l5skiOHNWeiRGMb56vx9jAAl6ILp6OtMQELqh/ewUvKtl19/3yZPvz2SDBmsvB36m0loOf3fqOzaTNQCiAFzKrdaNSLd8zg6aXWLVqZADSe+eq5jJ/yAriQC+TOciV2+kcDTHykelIhgAii2w+Dk+pC05LdJ+MCHGZuGVMA2qd5oRJQgEzni+DAulSOEUiMmCFLmWFwW1hzDCMUaLptJQyQjSgceEFnBETnrCuMEBy9iPfORBp2GZwjIIDqh4MCw663x5IYuZLgtCuHzdNNdh0IjYaTsCDOkZRkCbxpSoNR+wYHgBqU4+yRBr2n9v0raxD7uH5yKpVCt2FQWDAGZp+kgH/SsIFoXHPnt/EwLy/AMLkVr8y6Imj+OOIDPK1nMQJ1DBAFwdInqVufyfRP6ri0gK7/oowwmC3DGGVwFJl/TJm8/LaS/hbCrToBYcN6xltKyVUBwRi0tlPONfecs1WImhiNtVjEqXbP2RzvgpuA1p9wliOGNDlmHiHWFoGbIKy5XRuYGOFeV8DCEGEhC5gYHYPUEZg6bLgiHhNjwG3BPnQJgFKKCSGo0bSgxCAMgFhZNKF6GYYrQJkvBhEE4jUC8kcMQUgLpsyNwaF02gQMAUMuSrdQUa1qOkCQmpe/QQ7SuaWuAMEa6kQgMG+qkJEXQkjWZldwrgA3LPndgLMMiWtr/HmFKC4fDt0VHHmd6aZPL84RbIOGAv3Pc1HkoqhK6nrqxSDSCbi7Hk5aGYiuiWLCc+3i2TlSCP5ysfeBZSVu3w7dmzf1zSuFBkAEePRcvGAaGBMZQkkonlr0WA03SoDhxq37uIpSDbaCMGjxATUO0BRggocJWwt4Aij2KHpf5ZKH5nAYLQA9Ub+tv6BCIbZBBwOFCg9sItbJElk+HzwFnH5+XmXtYplDpgCJxo5zvX9FBMVXwIEwgJqwMWCjSdAcTUycNfXOW0q47F3a/iYieiODQ7HuqMmbsmLPByLoloyAOQFi0/xKYaFfmbVYRJYgsaMFRBJEyYwkEqoaMxXE7KbBCJO0y6UQZNnr9yrQotrU+yqzt7opA4wlVAJJUAKAMDeYTCZHOoj0x2Xwmg71EhgbZ6PZ2nla19P3hMDshZNwFb2tsz+pwSklk4JVNSLG4GLb/p31Djv3tyWQgdF59VnrWXPcrS5lFBYc4ZBFisHdOfP4b/E301Ck7f/BFa8AAAAASUVORK5CYII=",fl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISFPUHnAAAAAMAUExURQAAAAAAAAcGARIMAhkNAR0OABgRAx4SAyMRASEVAyMVAigXAiEZBicYAiMbBiwZASsaAzAZACkbBC0cAi0dBjAdAjMeAykhCTIfAzQfAzAhBzUgAjghAy0kCzkiAzQkBzwkAz0kAzklBz8lA0AmBEEmAz4nBUEnBEQoBEUpAz0rCzgtD0ErCUcqA0EsB0crBEkrA0YsB0osAksuBU0uA08vBEQyD0E0E0kyDlExBVIxBFQzB1U0BUg3Ek83D0o6Flc5DFQ6DlQ8E1Y9E08/GFo/EF4+Dlw/EVVBF2U+CFtBFWg/CFxFGGVEEllHHGRGFmJHF2BKGpg7BGBOHmlMGWxNGG1NGZ1BCGhQHWZRIaJGDZ9ID3NWHnNYIXpXHW9aJJ5NE4VWGadOEntbIIBbH6RRFXlhKKhWFn9iJbBWGIJlKItjI39nKoZmJq9cGohsK5RqJqxjI7lgHYhuL41tK7ZjH5xxKpF0L7dqIJV0LsFqI5R4M7FxHbRwKpd7NJx7MqZ5LclvJcN1D5t/N8F1Jql9MKOBNK9+LsJ6G6GCOM54KreAKsl8GL9+Mr+AM7OEM8CBJ7iEMqqKPMyCH9h+Lq+KO82DLa+MO7GMO86GJMGLM8iJN7GQP9yFMeGFMMeOObeTPuWIMsOSOsiRN+SLNLqXQteRMb2YQdmTLtCWOsGaQ76bRe2ONeqRN9aYOcidRO+SONqZM8WeRdWbO9ScP/CUOcahRuGbNu+XOtuePMikSOGeNtSiQ92gOtiiRdqiQM6oSuGlPuelP9KrS9iqSemmPOepQe6oPdavTe6rQeqsROGvS+iuRvGtQfKtQNy0UOWyTfevQ/awQfOxRfexRPezQ/O0R/ezReq3UPe0RvG2SeO6Uvm1R/i2R++5TPi4SOe9VO28Uvm6TPO+Ufq9TezBV/q+T+/BVvHBVfrAUPDFWPvDUvzEU/fGV/PHWvXHWfzGVvXKW/3IWPrLWfrLXPjMXP3LWf7NWvzOXf/PXP/PXv3QXv7QXP7RXf/RXf/SYIi9XXwAAAABdFJOUwBA5thmAAAHkUlEQVR42sXWa3BU5R3H8e//eZ6zt+wlIQRqsBIC4w2QqKhAA52K1tYqqKjIiDpUHd60HaszHX3hdCo6tbXSVvFSBtsyjFqsoJVRvLWK4WLjpWhBAcWgYGgIm012N7vZ3XPpZmOCyW6ovupnzvNiz5z/7/znOf/ds/zfyXFOeowk5SelYrkeF+g74oA34kIRtyy6jEj99b9ct37d729ZOFZk8JyEv33Dbb9as+aBFbctmioio3cgfGfhOTUUZXr3bH31MB4I82bOmjIu7NeQtxMHWt7ahDdqwGm3zBatMNguibe2/S0P8y648LSwYkhm39PPfoBXMUD40XURpUMhH3Yu7WS7tr+x9+LFZ0QZLvnyui+aMIxgNdbahMZaQDDc6wvnZcn8ekaKXlpnbazcgbprQVDXxCjxcuntdadHhXK5N+5s9SruwcIl04OhGmvwus5qn49KkvevwKsUwNxZcyfXhz3D//DKjYc8UIzg0XLfxpYXt73Xdqgr7XIcwShFinJzJnTs2/LCxhe2HnYYlOvKeQz32cGKT0E4b3nz0XgPsWjduGM1hV00jrf4kvYtqUoBwvxl33MlBj5/OHCsIvTN1j2nnlLtH5qlznVPUOEpCNcvm57tczDBUvkx2QOff8KUSbEqjE12b+uODQWPkQGCumXppEQe7YuGLIbJd2eOtHXmIpGqMOm25173KoyycOKy66qTNiYcsQwjpLod92gy3pkD7JYX8BgZIJy+/CqVtrUOR32U8ZIJF+jJUbR11WdlAcX6n17iZj10JOKjgkImWYBMBhNy0xse7BtIkGH1dg5UTVSoyOs7tHdXR5rw+Gnjcusfdb3hgzRu+SV2QWGNWk+qdfXKlY+uXbtqxX1P9iy4FvlygFjLF/bf34qGhMo616547PPmm2699Yez339wzac/uBI5NkjCvMaPsoQj442mMndva/D65qZYFb2fbt3xamLRhfHXhvZAaI5lMviC0bqJjVMmRP1UkPyECTWGonz8o+2vsjh+f9xDvpjfn0QOHT2cTXa0dwVObpg+qzHK8WS7Ejufjl3294fxFP1OvPzUk5ovunrxtTfe+uPv8tLKX6zc2n38b3J4zpUdR+cvGNhEUUvP07ndzzyy6pHn/hW9+o475vesv/t3H7uMLhyh6Romnn+CKBBuvqKm46nf3veXzdv+8czqNYcW3PnzxXVv/uEgo5NIMDTn7NDMy9EI1yyt73jqz/vdgPGJLrS3cfYp585qijVEGJ02GTTBQIcgly5rSm9YnTBaa6u4jJy05KoQ2Ibj8eJJGzu9Wcm5S8/OH2iJC57SopSI6Xj+30DlejvZncy4gJRedNHzlXXFzGz+nR0K19BfrtGqbXM3FSV3Pr7ynhWrXmq3IRDWWlGnllzkudlP8qItRBRaDMIHB6jk44fueXD9sxseuffX2zIQtChSi8bkVbZHA0qDFrQS2vfYlHF3PrDxY1sE9j/5m2cz+MKiQJ2ZBTel0BqlBHyA5NvylDn4xx0oAYXQsm6bTdDv9te4aJD+BWhxUUCqvIPM5nfppwW0r+XxA/gCFqg+lNSMpxSslItWfEmudyip8+28IPgosV7ZksMn2MoB9Y1atBlsBAR8hqLet59c3TL4QPYNTKaLiFLQ1RrHqCJwdfjkEB4lPgQs6wQN9n/++tCmrY/9qWOgl4/SFpS2jSLP+vAgwsAnE5o7B0pDhFs6W9vkx9798CY1Y0b0n4+XEpwjMvxneP9BlKa4lKWl8VsxpQWUKIUYpjVi71y7u6F56tRZE97Z1EvZO8iQ6rW1AoNGE1185Glb9WeIgN1wca27+4lPG2bEIDaDHZPnGjz/8ATXb5mCAiWIgYlLL6tVRotPizDpqrPUkQ0D9RCb5t+0H8wYxBIYeqNFajAaDCgFNP3s1C17+3wCVdMXnRPqfXFfw1k1lIyZ+u7zdWP8U2sSlLilg9NOAAfMYGP1181678N2zz/ujNkTDB9uH3PWWAboE+PvnjnXTDnlTfAGW/C8qRNBg2JQVdO1t9979123XznRkNuVnBRkUGBy9LU4Y+fViBFXycDQTZsfG+jAKuAywFRXD960zuzpDAdr8QehirGTdr59kWne9XIO7fQfYC6cqXBdlDF5ypnZ+dZEuw064A8GIN132DE1N/B6wiOQsRy37vKb68Bxwdi4BcqEzmzIdSe6u0g7pHO4tVGg/qYpr+8/6lKITrvg+/WA64C0ORKuE0ZwjhTvBXm84lK2E5g8hqJc/L2dPU7VyefWhyhKddrIfk/839CMlO3opUQUSkt46K9rxsb4DP28zpSDySvtFsoDAhE37zD4oKzIYD0hhhQKDpjicgqBCm8OUnlc5SrQvuoAFWRz4Mr7+E2FTQAvney/A6JCUWMol+/sc3ANFCjkAlTowZ/LFdC6SltUbqBY7xQ7wG9iMUMlno0RKuvrzAIFo1wKZKoqB4jFaPKJPOCiguC6haTD15PvzjhQcETfmQbE1X7ha+jrSTngQpWqCpVmMpH0+Mq8VLzbwXUhUGMCkT4HBxJ21OIrse10Mo8LikAsZCSaS1LkpJxogK/A6Un1gSPGpao6LP8Fy8nbmCTqYikAAAAASUVORK5CYII=";var et=null,Xn=null,hp=250,Pt=null,Jn=!1,tt=null,Eo=[];function gp(){return(!et||!document.body.contains(et))&&(et=document.createElement("div"),et.className="ytls-tooltip",et.style.pointerEvents="none",document.body.appendChild(et),window.addEventListener("scroll",hl,!0),window.addEventListener("resize",hl,!0)),et}function yp(e,t,n){let a=window.innerWidth,r=window.innerHeight,c=e.getBoundingClientRect(),s=c.width,h=c.height,m=t+10,v=n+10;m+s>a-10&&(m=t-s-10),v+h>r-10&&(v=n-h-10),m=Math.max(10,Math.min(m,a-s-10)),v=Math.max(10,Math.min(v,r-h-10)),e.style.left=`${m}px`,e.style.top=`${v}px`}function gl(e,t){let o=window.innerWidth,a=window.innerHeight,r=t.getBoundingClientRect(),c=e.getBoundingClientRect(),s=c.width,h=c.height,m=Math.round(r.left+r.width/2-s/2),v=Math.round(r.top-h-8);v<8&&(v=Math.round(r.bottom+8)),m<8&&(m=Math.round(r.left)),m+s>o-8&&(m=Math.round(r.right-s)),m=Math.max(8,Math.min(m,o-s-8)),v=Math.max(8,Math.min(v,a-h-8)),e.style.left=`${m}px`,e.style.top=`${v}px`}function hl(){if(!(!et||!Pt)&&et.classList.contains("ytls-tooltip-visible"))try{gl(et,Pt)}catch{}}function vp(e=50){tt&&(clearTimeout(tt),tt=null),!Jn&&(tt=setTimeout(()=>{Io(),tt=null},e))}function wp(e,t,n,o){tt&&(clearTimeout(tt),tt=null),Pt&&o&&Pt!==o&&et?.classList.contains("ytls-tooltip-visible")&&et.classList.remove("ytls-tooltip-visible"),Xn&&clearTimeout(Xn),o&&(Pt=o,Jn=!0),Xn=setTimeout(()=>{let a=gp();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),o?requestAnimationFrame(()=>{gl(a,o),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(yp(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},hp)}function Io(){Xn&&(clearTimeout(Xn),Xn=null),tt&&(clearTimeout(tt),tt=null),et&&et.classList.remove("ytls-tooltip-visible"),Pt=null,Jn=!1}function Bi(){Io()}function Re(e,t){let n=0,o=0,a=m=>{n=m.clientX,o=m.clientY,tt&&(clearTimeout(tt),tt=null),Jn=!0,Pt=e;let v=typeof t=="function"?t():t;v&&wp(v,n,o,e)},r=m=>{n=m.clientX,o=m.clientY},c=()=>{Pt===e&&(Jn=!1,vp())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",r),e.addEventListener("mouseleave",c);let s=m=>{Jn=!1,Pt===e&&Io()};e.addEventListener("click",s,!0);let h=new MutationObserver(()=>{if(Pt===e)try{let m=window.getComputedStyle(e);(m.display==="none"||m.visibility==="hidden"||m.opacity==="0")&&Io()}catch{}});try{h.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}Eo.push(h),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",r),e.removeEventListener("mouseleave",c),e.removeEventListener("click",s,!0);try{h.disconnect()}catch{}let m=Eo.indexOf(h);m!==-1&&Eo.splice(m,1),delete e.__tooltipObserver},e.__tooltipObserver=h}function yl(){for(let e of Eo)try{e.disconnect()}catch{}Eo.length=0,Io()}var Hr={};Td(Hr,{addTimestamp:()=>Ap,buildExportCsvPayload:()=>Dp,buildExportPayload:()=>Bp,deleteSingleTimestampFromIndexedDB:()=>Lp,exportAllTimestamps:()=>Rp,exportAllTimestampsCsv:()=>Pp,getRecordsChangedSince:()=>zi,loadFromIndexedDB:()=>Ni,loadGlobalSettings:()=>jt,mergeBackupData:()=>_p,mergeRemoteRecords:()=>Gi,onTimestampsWritten:()=>Fi,removeFromIndexedDB:()=>Cp,saveGlobalSettings:()=>yn,saveRowsToIndexedDB:()=>Ep,saveSingleTimestampToIndexedDB:()=>Mp,saveToIndexedDB:()=>Ip});var bp="ytls-timestamps-db",Sp=5,Qn="timestamps",ut="timestamps_v2",gn="settings",hn=null,Zn=null;function Pr(){if(hn)try{return hn.objectStoreNames,Promise.resolve(hn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),hn=null}return Zn||(Zn=kp().then(e=>(hn=e,Zn=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),hn=null},e.onversionchange=()=>{l("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),hn===e&&(hn=null)},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw Zn=null,e}),Zn)}function vl(e,t){let n=crypto.randomUUID(),o=0,a=e.openCursor();a.onsuccess=r=>{let c=r.target.result;c?(o++,c.update({...c.value,write_counter:o,device_id:n}),c.continue()):(t.put({key:"write_counter",value:o}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${o} records, device_id=${n}`))},a.onerror=()=>{l("Lamport migration: cursor error during backfill",a.error,"error")}}function kp(){return new Promise((e,t)=>{let n=indexedDB.open(bp,Sp);n.onupgradeneeded=o=>{let a=o.target.result,r=o.oldVersion,c=o.target.transaction;if(r<1&&a.createObjectStore(Qn,{keyPath:"video_id"}),r<2&&!a.objectStoreNames.contains(gn)&&a.createObjectStore(gn,{keyPath:"key"}),r<3){if(a.objectStoreNames.contains(Qn)){l("Exporting backup before v2 migration...");let v=c.objectStore(Qn).getAll();v.onsuccess=()=>{let f=Lr.array().safeParse(v.result);if(f.success&&f.data.length>0)try{let y={},E=0;f.data.forEach(j=>{if(j.timestamps.length>0){let ee=Ao.parse(j.timestamps);y[`ytls-${j.video_id}`]={video_id:j.video_id,timestamps:[...ee].sort((O,$)=>O.start-$.start)},E+=ee.length}});let M=new Blob([JSON.stringify(y,null,2)],{type:"application/json"}),P=URL.createObjectURL(M),U=document.createElement("a");U.href=P,U.download=`timekeeper-data-${Pn()}.json`,U.click(),URL.revokeObjectURL(P),l(`Pre-migration backup exported: ${f.data.length} videos, ${E} timestamps`)}catch(y){l("Failed to export pre-migration backup:",y,"error")}else f.success||l("Skipping pre-migration backup: legacy data failed validation",f.error.message,"warn")}}let h=a.createObjectStore(ut,{keyPath:"guid"});if(h.createIndex("video_id","video_id",{unique:!1}),h.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(Qn)){let v=c.objectStore(Qn).getAll();v.onsuccess=()=>{let f=Lr.array().safeParse(v.result);if(f.success&&f.data.length>0){let y=0;f.data.forEach(E=>{E.timestamps.length>0&&E.timestamps.forEach(M=>{h.put({guid:M.guid,video_id:E.video_id,start:M.start,comment:M.comment}),y++})}),l(`Migrated ${y} timestamps from ${f.data.length} videos to v2 store`)}else f.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",f.error.message,"warn");r<4&&vl(c.objectStore(ut),c.objectStore(gn))},a.deleteObjectStore(Qn),l("Deleted old timestamps store after migration to v2")}}r===3&&vl(c.objectStore(ut),c.objectStore(gn));let s=c.objectStore(ut);s.indexNames.contains("write_counter")||s.createIndex("write_counter","write_counter",{unique:!1})},n.onsuccess=o=>{e(o.target.result)},n.onerror=o=>{let a=o.target.error;t(a??new Error("Failed to open IndexedDB"))},n.onblocked=()=>{l("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function _r(e,t,n){return Pr().then(o=>new Promise((a,r)=>{let c;try{c=o.transaction(e,t)}catch(m){r(new Error(`Failed to create transaction for ${e}: ${m}`));return}let s=c.objectStore(e),h;try{h=n(s)}catch(m){r(new Error(`Failed to execute operation on ${e}: ${m}`));return}h&&(h.onsuccess=()=>a(h.result),h.onerror=()=>r(h.error??new Error(`IndexedDB ${t} operation failed`))),c.oncomplete=()=>{h||a(void 0)},c.onerror=()=>r(c.error??new Error("IndexedDB transaction failed")),c.onabort=()=>r(c.error??new Error("IndexedDB transaction aborted"))}))}var Ri=new Set;function wl(e){return Ri.add(e),()=>Ri.delete(e)}function xp(){for(let e of Ri)try{e()}catch(t){l("Timestamp write listener failed:",t,"error")}}function Mo(e,{silent:t=!1}={}){return Pr().then(n=>new Promise((o,a)=>{let r;try{r=n.transaction([ut,gn],"readwrite")}catch(c){a(new Error(`Failed to create transaction: ${c}`));return}r.oncomplete=()=>{o(),t||xp()},r.onerror=()=>a(new Error(`IndexedDB write failed: ${r.error?.message??"unknown"}`)),r.onabort=()=>a(new Error(`IndexedDB transaction aborted: ${r.error?.message??"unknown"}`));try{e(r.objectStore(ut),r.objectStore(gn))}catch(c){try{r.abort()}catch{}a(c instanceof Error?c:new Error(String(c)))}}))}function Lo(e,t){let n=e.get("write_counter");n.onsuccess=()=>{let o=typeof n.result?.value=="number"?n.result.value:0;e.put({key:"write_counter",value:t(o)})}}function bl(e,t){let n=Ao.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return Mo((a,r)=>{let c=a.index("video_id").getAll(IDBKeyRange.only(e));c.onsuccess=()=>{let s=c.result??[],h=new Map(s.map(f=>[f.guid,f])),m=new Set(o.map(f=>f.guid)),v=Date.now();Lo(r,f=>{let y=f;return s.forEach(E=>{!m.has(E.guid)&&!E.deleted_at&&(y++,a.put({...E,deleted_at:v,write_counter:y}))}),o.forEach(E=>{let M=h.get(E.guid);M&&!M.deleted_at&&!E.deleted_at&&M.start===E.start&&M.comment===E.comment||(y++,a.put({guid:E.guid,video_id:e,start:E.start,comment:E.comment,write_counter:y,deleted_at:E.deleted_at??M?.deleted_at??void 0}))}),y})}})}function Di(e,t){let n=Ao.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return o.length===0?Promise.resolve():Mo((a,r)=>{Lo(r,c=>{let s=c;return o.forEach(h=>{s++,a.put({guid:h.guid,video_id:e,start:h.start,comment:h.comment,write_counter:s,deleted_at:h.deleted_at})}),s})})}function Sl(e,t){return Di(e,[t])}function Pi(e,t={}){return e.length===0?Promise.resolve():Mo((n,o)=>{Lo(o,a=>{let r=a;return e.forEach(c=>{c.write_counter!==void 0&&c.write_counter>r&&(r=c.write_counter)}),e.forEach(c=>{let s={guid:c.guid,video_id:c.video_id,start:c.start,comment:c.comment,deleted_at:c.deleted_at,write_counter:c.write_counter??++r};n.put(s)}),r+1})},t)}function kl(e){return l(`Soft-deleting timestamp ${e}`),Mo((t,n)=>{let o=t.get(e);o.onsuccess=()=>{let a=o.result;a&&Lo(n,r=>(t.put({...a,deleted_at:Date.now(),write_counter:r+1}),r+1))}})}function xl(e){return Pr().then(t=>new Promise((n,o)=>{let a;try{a=t.transaction([ut],"readonly")}catch(c){let s=`Failed to create read transaction: ${c}`;l(s,c,"error"),o(new Error(s));return}a.onabort=()=>{let c=`Transaction aborted during load: ${a.error?.message??"unknown"}`;l(c,a.error,"error"),o(new Error(c))};let r=a.objectStore(ut).index("video_id").getAll(IDBKeyRange.only(e));r.onsuccess=()=>{try{let c=r.result.filter(m=>!m.deleted_at),s=[],h=0;for(let m of c){let v=Mr.safeParse({guid:m.guid,start:m.start,comment:m.comment});v.success?s.push(v.data):h++}if(h>0&&l(`Skipped ${h} stored timestamps for ${e} that failed validation`,null,"warn"),s.length===0){h>0?o(new Error(`Stored timestamps for this video failed validation (${h} rows)`)):n(null);return}n(s.sort((m,v)=>m.start-v.start))}catch(c){o(c)}},r.onerror=()=>{let c=`Failed to load timestamps from IndexedDB: ${r.error?.message??"unknown error"}`;l(c,r.error,"error"),o(new Error(c))}}))}function Tl(e){return Mo((t,n)=>{let o=t.index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{let a=o.result??[],r=Date.now();Lo(n,c=>{let s=c;return a.forEach(h=>{h.deleted_at||(s++,t.put({...h,deleted_at:r,write_counter:s}))}),s})}})}function Or(){return _r(ut,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function Al(e){return _r(ut,"readonly",t=>t.index("write_counter").getAll(IDBKeyRange.lowerBound(e,!0))).then(t=>Array.isArray(t)?t:[])}function El(e){return e.length===0?Promise.resolve([]):Pr().then(t=>new Promise((n,o)=>{let a=[],r=t.transaction(ut,"readonly"),c=r.objectStore(ut);for(let s of e)c.get(s).onsuccess=h=>{let m=h.target.result;m&&a.push(m)};r.oncomplete=()=>n(a),r.onerror=()=>o(r.error??new Error("IndexedDB read failed")),r.onabort=()=>o(r.error??new Error("IndexedDB read aborted"))}))}function Il(e,t){return _r(gn,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function Ml(e){return _r(gn,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function _i({includeDeleted:e=!1}={}){let t={},n=await Or(),o=[],a=0;for(let f of n){let y=mn.safeParse(f);y.success?o.push(y.data):a++}a>0&&l(`Skipped ${a} timestamp rows that failed validation during export`,null,"warn");let c=[...e?o:o.filter(f=>!f.deleted_at)].sort((f,y)=>{let E=f.video_id.localeCompare(y.video_id);if(E!==0)return E;let M=f.start-y.start;return M!==0?M:f.guid.localeCompare(y.guid)}),s=new Map;for(let f of c)s.has(f.video_id)||s.set(f.video_id,[]),s.get(f.video_id).push({guid:f.guid,start:f.start,comment:f.comment,write_counter:f.write_counter,deleted_at:f.deleted_at});let h=Array.from(s.keys()).sort((f,y)=>f.localeCompare(y));for(let f of h){let y=s.get(f);t[`ytls-${f}`]={video_id:f,timestamps:y}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:c.length,invalidRows:a}}async function Bl(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:o}=await _i(),a=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(a),c=document.createElement("a");c.href=r,c.download=t,c.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function Oi(){let e=mn.array().safeParse((await Or()).filter(m=>!m.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let m=`Tag,Timestamp,URL
`,v=`timestamps-${Pn()}.csv`;return{csv:m,filename:v,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let m of t)n.has(m.video_id)||n.set(m.video_id,[]),n.get(m.video_id).push({start:m.start,comment:m.comment});let o=[];o.push("Tag,Timestamp,URL");let a=0,r=m=>`"${String(m).replace(/"/g,'""')}"`,c=Array.from(n.keys()).sort();for(let m of c){let v=n.get(m).sort((f,y)=>f.start-y.start);for(let f of v){let y=f.comment,E=fn(f.start,36e3),M=pl(f.start,`https://www.youtube.com/watch?v=${m}`);o.push([r(y),r(E),r(M)].join(",")),a++}}let s=o.join(`
`),h=`timestamps-${Pn()}.csv`;return{csv:s,filename:h,totalVideos:n.size,totalTimestamps:a}}async function Rl(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:o}=await Oi(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(a),c=document.createElement("a");c.href=r,c.download=t,c.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function Hi(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return Sl(e,t)}async function Dl(e,t){if(!e)throw new Error("Video ID is required");return Di(e,t)}async function Pl(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return bl(e,t)}async function _l(e){if(!e)throw new Error("GUID is required");return kl(e)}async function Ol(e){if(!e)throw new Error("Video ID is required");return Tl(e)}async function Hl(e){if(!e)throw new Error("Video ID is required");return xl(e)}async function Nl(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=Ms.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let o=await Or(),a=new Map;for(let h of o)a.set(h.guid,h);let r=0,c=0,s=[];for(let[,h]of Object.entries(n.data)){let{video_id:m,timestamps:v}=h,f=0;for(let y of v){let E=a.get(y.guid);zl(E,m,y)&&(s.push({guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),a.set(y.guid,{...E??{},guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),f++,c++)}f>0&&r++}return await Pi(s),{mergedVideos:r,mergedTimestamps:c}}function Cl(e,t){return JSON.stringify([e,t.start,t.comment,t.deleted_at??null])}function zl(e,t,n){return e?e.write_counter===void 0||n.write_counter===void 0?!1:n.write_counter!==e.write_counter?n.write_counter>e.write_counter:Cl(t,n)>Cl(e.video_id,e):!0}async function Gl(e){let t=[];for(let n of await Al(e)){let o=mn.safeParse(n);if(!o.success||o.data.write_counter===void 0)continue;let{guid:a,video_id:r,start:c,comment:s,write_counter:h,deleted_at:m}=o.data;t.push({guid:a,video_id:r,start:c,comment:s,write_counter:h,...m!==void 0?{deleted_at:m}:{}})}return t}async function Fl(e){let t=new Map;for(let a of await El(e.map(r=>r.guid)))t.set(a.guid,a);let n=[],o=new Set;for(let a of e)zl(t.get(a.guid),a.video_id,a)&&(n.push(a),o.add(a.video_id));return await Pi(n,{silent:!0}),{mergedVideos:o.size,mergedTimestamps:n.length}}function Ul(e,t){if(!e)throw new Error("Setting key is required");return Il(e,t)}async function Vl(e){if(!e)throw new Error("Setting key is required");return Ml(e)}function Ap(e,t){return Hi(e,t)}function Ep(e,t){return Dl(e,t)}function Ip(e,t){return Pl(e,t)}function Mp(e,t){return Hi(e,t)}function Ni(e){return Hl(e)}function Lp(e,t){return _l(t)}function Cp(e){return Ol(e)}function yn(e,t){return Ul(e,t)}function jt(e){return Vl(e)}function Bp(e){return _i(e)}function Rp(){return Bl()}function Dp(){return Oi()}function Pp(){return Rl()}function _p(e){return Nl(e)}function zi(e){return Gl(e)}function Gi(e){return Fl(e)}function Fi(e){return wl(e)}function Nr(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function zr(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Ui(e,t){if(!e)return;zr(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function ql(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function Co(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function jl(e,t){if(!e)return;zr(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${Op(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function $l(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Op(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function Wl(e,t){if(!e||t||Co(e))return;Array.from(e.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||Ui(e,"No timestamps for this video")}function Yl(e){if(!e)return[];let t=Nr(e),n=[];return t.forEach(o=>{let a=o.querySelector("[data-time]"),r=o.querySelector("input"),c=o.dataset.guid;if(!a||!r||!c)return;let s=a.dataset.time;if(!s)return;let h=Number.parseInt(s,10);Number.isFinite(h)&&n.push({guid:c,start:h,comment:r.value})}),n.sort((o,a)=>o.start-a.start)}function Kl(e){if(!e)return 0;let t=Nr(e),n=0;return t.forEach(o=>{let r=o.querySelector("[data-time]")?.dataset.time;if(r){let c=Number.parseInt(r,10);Number.isFinite(c)&&(n=Math.max(n,c))}}),n}var Np={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},syncAuthState:Kn,autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1,autoBackupFailed:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},it=JSON.parse(JSON.stringify(Np));function at(){return it}function Gr(e){it={...it,...e,auth:{...it.auth,...e.auth||{}},ui:{...it.ui,...e.ui||{}},timestamps:{...it.timestamps,...e.timestamps||{}}}}function $t(e,t){Gr({auth:{...it.auth,[e]:t}})}function Fr(e,t){Gr({ui:{...it.ui,[e]:t}})}function _t(){return it.auth.googleAuthState}function At(e){$t("googleAuthState",e)}function Xl(){return it.auth.syncAuthState}function eo(e){$t("syncAuthState",e)}function Vi(e){$t("autoBackupEnabled",e)}function qi(e){$t("autoBackupIntervalMinutes",e)}function ji(e){$t("isAutoBackupRunning",e)}function Ur(e){$t("autoBackupFailed",e)}function $i(e){$t("autoBackupRetryAttempts",e)}function Wi(e){$t("autoBackupBackoffMs",e)}function Yi(e){$t("lastAutoBackupAt",e)}function Jl(e){Fr("minPaneHeight",e)}function Ql(e){Fr("panePosition",e)}function Zl(e){Fr("lastHandledUrl",e)}function ec(e){Fr("urlChangeHandlersSetup",e)}function tc(e){Gr({timestamps:{...it.timestamps,items:e}})}function Ki(e){Gr({timestamps:{...it.timestamps,dbError:e}})}function nc(){return it.timestamps.dbError}var _n=typeof unsafeWindow<"u"?unsafeWindow:window,lc=43200*14,oc="html5_max_live_dvr_window_plus_margin_secs";function Wt(e){return e!=null&&typeof e=="object"}function rc(e){let{streamingData:t,videoDetails:n,playerConfig:o,microformat:a}=e;if(!Wt(n)||!n.isLive)return;let r=n.isLiveDvrEnabled===!0;if(n.isLiveDvrEnabled=!0,!r&&Wt(o)){let c=o.mediaCommonConfig;if(Wt(c)){c.useServerDrivenAbr=!1;let s=c.serverPlaybackStartConfig;Wt(s)&&(s.enable=!1)}}if(Wt(t)){let c=t;if(Array.isArray(c.adaptiveFormats)&&zp(a))for(let s of c.adaptiveFormats)s.maxDvrDurationSec=lc}}function zp(e){if(!Wt(e))return!1;let t=e.playerMicroformatRenderer;if(!Wt(t))return!1;let n=t.liveBroadcastDetails;if(!Wt(n))return!1;let o=n.startTimestamp;return!o||typeof o!="string"?!1:(Date.now()-new Date(o).getTime())/1e3>43200}function Ji(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(rc(t),!0):t.playerResponse&&Wt(t.playerResponse)&&t.playerResponse.videoDetails?(rc(t.playerResponse),!0):!1}function Gp(){let e=Object.getOwnPropertyDescriptor(_n,"ytInitialPlayerResponse"),t=e&&e.set,n=_n.ytInitialPlayerResponse;if(!Ji(n))try{Object.defineProperty(_n,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(o){t&&t.call(this,o),n=o,Ji(o)&&Object.defineProperty(_n,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:o})}})}catch{}}var ic=!1;function Fp(){if(ic)return;ic=!0;let e=JSON.parse;JSON.parse=function(t,n){let o=e.call(this,t,n);try{Ji(o)}catch{}return o}}function ac(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let o=n;for(let a in o){let r=o[a];if(r&&typeof r.serializedExperimentFlags=="string"){let c=r.serializedExperimentFlags,s=c.replace(new RegExp(`${oc}=[\\d.]+`),`${oc}=${lc}`);s!==c&&(r.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function sc(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let o=t.apply(this,n);try{ac(e)}catch{}return o});try{ac(e)}catch{}return e}function Up(){let e={};_n.ytcfg&&(e=sc(_n.ytcfg));try{Object.defineProperty(_n,"ytcfg",{configurable:!0,get(){return e},set(t){e=sc(t)}})}catch{}}function cc(){Gp(),Fp(),Up(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var Vp="BADGE_STYLE_TYPE_MEMBERS_ONLY";function Bo(e){return typeof e=="object"&&e!==null}function uc(e,t=0){return!Bo(e)||t>8?!1:e.style===Vp?!0:Object.values(e).some(n=>uc(n,t+1))}function dc(e,t){let n=Bo(t)?t.videoDetails:void 0;if(!Bo(n)||typeof n.videoId!="string"||typeof n.channelId!="string")return null;let o=e?.contents?.twoColumnWatchNextResults?.results?.results?.contents;if(!Array.isArray(o))return null;let a=o.find(r=>Bo(r)&&Bo(r.videoPrimaryInfoRenderer));return a?{videoId:n.videoId,channelId:n.channelId,membersOnly:uc(a.videoPrimaryInfoRenderer)}:null}var Qi="#author-name, #author-text";function pc(){return window.top!==window.self&&window.location.pathname.startsWith("/live_chat")}function Zi(e){let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=t.nextNode();n;n=t.nextNode()){let o=n.nodeValue??"";if(o.trim()){/^\s*@/.test(o)&&(n.nodeValue=o.replace(/^(\s*)@/,"$1"));return}}}function ea(e){if(e.nodeType===Node.TEXT_NODE){let t=e.parentElement?.closest(Qi);t&&Zi(t);return}e instanceof Element&&(e.matches(Qi)&&Zi(e),e.querySelectorAll(Qi).forEach(Zi))}function mc(){let e=new MutationObserver(t=>{for(let n of t)n.type==="characterData"?ea(n.target):n.addedNodes.forEach(ea)});document.documentElement&&ea(document.documentElement),e.observe(document,{childList:!0,subtree:!0,characterData:!0})}var ge=Uint8Array,st=Uint16Array,da=Int32Array,Vr=new ge([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),qr=new ge([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ia=new ge([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),bc=function(e,t){for(var n=new st(31),o=0;o<31;++o)n[o]=t+=1<<e[o-1];for(var a=new da(n[30]),o=1;o<30;++o)for(var r=n[o];r<n[o+1];++r)a[r]=r-n[o]<<5|o;return{b:n,r:a}},Sc=bc(Vr,2),kc=Sc.b,aa=Sc.r;kc[28]=258,aa[258]=28;var xc=bc(qr,0),qp=xc.b,fc=xc.r,sa=new st(32768);for(X=0;X<32768;++X)Yt=(X&43690)>>1|(X&21845)<<1,Yt=(Yt&52428)>>2|(Yt&13107)<<2,Yt=(Yt&61680)>>4|(Yt&3855)<<4,sa[X]=((Yt&65280)>>8|(Yt&255)<<8)>>1;var Yt,X,Ht=(function(e,t,n){for(var o=e.length,a=0,r=new st(t);a<o;++a)e[a]&&++r[e[a]-1];var c=new st(t);for(a=1;a<t;++a)c[a]=c[a-1]+r[a-1]<<1;var s;if(n){s=new st(1<<t);var h=15-t;for(a=0;a<o;++a)if(e[a])for(var m=a<<4|e[a],v=t-e[a],f=c[e[a]-1]++<<v,y=f|(1<<v)-1;f<=y;++f)s[sa[f]>>h]=m}else for(s=new st(o),a=0;a<o;++a)e[a]&&(s[a]=sa[c[e[a]-1]++]>>15-e[a]);return s}),vn=new ge(288);for(X=0;X<144;++X)vn[X]=8;var X;for(X=144;X<256;++X)vn[X]=9;var X;for(X=256;X<280;++X)vn[X]=7;var X;for(X=280;X<288;++X)vn[X]=8;var X,Po=new ge(32);for(X=0;X<32;++X)Po[X]=5;var X,jp=Ht(vn,9,0),$p=Ht(vn,9,1),Wp=Ht(Po,5,0),Yp=Ht(Po,5,1),ta=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},Et=function(e,t,n){var o=t/8|0;return(e[o]|e[o+1]<<8)>>(t&7)&n},na=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},pa=function(e){return(e+7)/8|0},_o=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new ge(e.subarray(t,n))};var Kp=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Ue=function(e,t,n){var o=new Error(t||Kp[e]);if(o.code=e,Error.captureStackTrace&&Error.captureStackTrace(o,Ue),!n)throw o;return o},Xp=function(e,t,n,o){var a=e.length,r=o?o.length:0;if(!a||t.f&&!t.l)return n||new ge(0);var c=!n,s=c||t.i!=2,h=t.i;c&&(n=new ge(a*3));var m=function(En){var en=n.length;if(En>en){var ke=new ge(Math.max(en*2,En));ke.set(n),n=ke}},v=t.f||0,f=t.p||0,y=t.b||0,E=t.l,M=t.d,P=t.m,U=t.n,j=a*8;do{if(!E){v=Et(e,f,1);var ee=Et(e,f+1,3);if(f+=3,ee)if(ee==1)E=$p,M=Yp,P=9,U=5;else if(ee==2){var ye=Et(e,f,31)+257,de=Et(e,f+10,15)+4,V=ye+Et(e,f+5,31)+1;f+=14;for(var R=new ge(V),me=new ge(19),oe=0;oe<de;++oe)me[ia[oe]]=Et(e,f+oe*3,7);f+=de*3;for(var Se=ta(me),Ye=(1<<Se)-1,De=Ht(me,Se,1),oe=0;oe<V;){var Pe=De[Et(e,f,Ye)];f+=Pe&15;var O=Pe>>4;if(O<16)R[oe++]=O;else{var Te=0,le=0;for(O==16?(le=3+Et(e,f,3),f+=2,Te=R[oe-1]):O==17?(le=3+Et(e,f,7),f+=3):O==18&&(le=11+Et(e,f,127),f+=7);le--;)R[oe++]=Te}}var _e=R.subarray(0,ye),Ae=R.subarray(ye);P=ta(_e),U=ta(Ae),E=Ht(_e,P,1),M=Ht(Ae,U,1)}else Ue(1);else{var O=pa(f)+4,$=e[O-4]|e[O-3]<<8,se=O+$;if(se>a){h&&Ue(0);break}s&&m(y+$),n.set(e.subarray(O,se),y),t.b=y+=$,t.p=f=se*8,t.f=v;continue}if(f>j){h&&Ue(0);break}}s&&m(y+131072);for(var It=(1<<P)-1,Ee=(1<<U)-1,Ge=f;;Ge=f){var Te=E[na(e,f)&It],fe=Te>>4;if(f+=Te&15,f>j){h&&Ue(0);break}if(Te||Ue(2),fe<256)n[y++]=fe;else if(fe==256){Ge=f,E=null;break}else{var ce=fe-254;if(fe>264){var oe=fe-257,G=Vr[oe];ce=Et(e,f,(1<<G)-1)+kc[oe],f+=G}var Ce=M[na(e,f)&Ee],Oe=Ce>>4;Ce||Ue(3),f+=Ce&15;var Ae=qp[Oe];if(Oe>3){var G=qr[Oe];Ae+=na(e,f)&(1<<G)-1,f+=G}if(f>j){h&&Ue(0);break}s&&m(y+131072);var Zt=y+ce;if(y<Ae){var An=r-Ae,zn=Math.min(Ae,Zt);for(An+y<0&&Ue(3);y<zn;++y)n[y]=o[An+y]}for(;y<Zt;++y)n[y]=n[y-Ae]}}t.l=E,t.p=Ge,t.b=y,t.f=v,E&&(v=1,t.m=P,t.d=M,t.n=U)}while(!v);return y!=n.length&&c?_o(n,0,y):n.subarray(0,y)},Kt=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8},Ro=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8,e[o+2]|=n>>16},oa=function(e,t){for(var n=[],o=0;o<e.length;++o)e[o]&&n.push({s:o,f:e[o]});var a=n.length,r=n.slice();if(!a)return{t:Ac,l:0};if(a==1){var c=new ge(n[0].s+1);return c[n[0].s]=1,{t:c,l:1}}n.sort(function(se,ye){return se.f-ye.f}),n.push({s:-1,f:25001});var s=n[0],h=n[1],m=0,v=1,f=2;for(n[0]={s:-1,f:s.f+h.f,l:s,r:h};v!=a-1;)s=n[n[m].f<n[f].f?m++:f++],h=n[m!=v&&n[m].f<n[f].f?m++:f++],n[v++]={s:-1,f:s.f+h.f,l:s,r:h};for(var y=r[0].s,o=1;o<a;++o)r[o].s>y&&(y=r[o].s);var E=new st(y+1),M=la(n[v-1],E,0);if(M>t){var o=0,P=0,U=M-t,j=1<<U;for(r.sort(function(ye,de){return E[de.s]-E[ye.s]||ye.f-de.f});o<a;++o){var ee=r[o].s;if(E[ee]>t)P+=j-(1<<M-E[ee]),E[ee]=t;else break}for(P>>=U;P>0;){var O=r[o].s;E[O]<t?P-=1<<t-E[O]++-1:++o}for(;o>=0&&P;--o){var $=r[o].s;E[$]==t&&(--E[$],++P)}M=t}return{t:new ge(E),l:M}},la=function(e,t,n){return e.s==-1?Math.max(la(e.l,t,n+1),la(e.r,t,n+1)):t[e.s]=n},hc=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new st(++t),o=0,a=e[0],r=1,c=function(h){n[o++]=h},s=1;s<=t;++s)if(e[s]==a&&s!=t)++r;else{if(!a&&r>2){for(;r>138;r-=138)c(32754);r>2&&(c(r>10?r-11<<5|28690:r-3<<5|12305),r=0)}else if(r>3){for(c(a),--r;r>6;r-=6)c(8304);r>2&&(c(r-3<<5|8208),r=0)}for(;r--;)c(a);r=1,a=e[s]}return{c:n.subarray(0,o),n:t}},Do=function(e,t){for(var n=0,o=0;o<t.length;++o)n+=e[o]*t[o];return n},Tc=function(e,t,n){var o=n.length,a=pa(t+2);e[a]=o&255,e[a+1]=o>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var r=0;r<o;++r)e[a+r+4]=n[r];return(a+4+o)*8},gc=function(e,t,n,o,a,r,c,s,h,m,v){Kt(t,v++,n),++a[256];for(var f=oa(a,15),y=f.t,E=f.l,M=oa(r,15),P=M.t,U=M.l,j=hc(y),ee=j.c,O=j.n,$=hc(P),se=$.c,ye=$.n,de=new st(19),V=0;V<ee.length;++V)++de[ee[V]&31];for(var V=0;V<se.length;++V)++de[se[V]&31];for(var R=oa(de,7),me=R.t,oe=R.l,Se=19;Se>4&&!me[ia[Se-1]];--Se);var Ye=m+5<<3,De=Do(a,vn)+Do(r,Po)+c,Pe=Do(a,y)+Do(r,P)+c+14+3*Se+Do(de,me)+2*de[16]+3*de[17]+7*de[18];if(h>=0&&Ye<=De&&Ye<=Pe)return Tc(t,v,e.subarray(h,h+m));var Te,le,_e,Ae;if(Kt(t,v,1+(Pe<De)),v+=2,Pe<De){Te=Ht(y,E,0),le=y,_e=Ht(P,U,0),Ae=P;var It=Ht(me,oe,0);Kt(t,v,O-257),Kt(t,v+5,ye-1),Kt(t,v+10,Se-4),v+=14;for(var V=0;V<Se;++V)Kt(t,v+3*V,me[ia[V]]);v+=3*Se;for(var Ee=[ee,se],Ge=0;Ge<2;++Ge)for(var fe=Ee[Ge],V=0;V<fe.length;++V){var ce=fe[V]&31;Kt(t,v,It[ce]),v+=me[ce],ce>15&&(Kt(t,v,fe[V]>>5&127),v+=fe[V]>>12)}}else Te=jp,le=vn,_e=Wp,Ae=Po;for(var V=0;V<s;++V){var G=o[V];if(G>255){var ce=G>>18&31;Ro(t,v,Te[ce+257]),v+=le[ce+257],ce>7&&(Kt(t,v,G>>23&31),v+=Vr[ce]);var Ce=G&31;Ro(t,v,_e[Ce]),v+=Ae[Ce],Ce>3&&(Ro(t,v,G>>5&8191),v+=qr[Ce])}else Ro(t,v,Te[G]),v+=le[G]}return Ro(t,v,Te[256]),v+le[256]},Jp=new da([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Ac=new ge(0),Qp=function(e,t,n,o,a,r){var c=r.z||e.length,s=new ge(o+c+5*(1+Math.ceil(c/7e3))+a),h=s.subarray(o,s.length-a),m=r.l,v=(r.r||0)&7;if(t){v&&(h[0]=r.r>>3);for(var f=Jp[t-1],y=f>>13,E=f&8191,M=(1<<n)-1,P=r.p||new st(32768),U=r.h||new st(M+1),j=Math.ceil(n/3),ee=2*j,O=function(ht){return(e[ht]^e[ht+1]<<j^e[ht+2]<<ee)&M},$=new da(25e3),se=new st(288),ye=new st(32),de=0,V=0,R=r.i||0,me=0,oe=r.w||0,Se=0;R+2<c;++R){var Ye=O(R),De=R&32767,Pe=U[Ye];if(P[De]=Pe,U[Ye]=De,oe<=R){var Te=c-R;if((de>7e3||me>24576)&&(Te>423||!m)){v=gc(e,h,0,$,se,ye,V,me,Se,R-Se,v),me=de=V=0,Se=R;for(var le=0;le<286;++le)se[le]=0;for(var le=0;le<30;++le)ye[le]=0}var _e=2,Ae=0,It=E,Ee=De-Pe&32767;if(Te>2&&Ye==O(R-Ee))for(var Ge=Math.min(y,Te)-1,fe=Math.min(32767,R),ce=Math.min(258,Te);Ee<=fe&&--It&&De!=Pe;){if(e[R+_e]==e[R+_e-Ee]){for(var G=0;G<ce&&e[R+G]==e[R+G-Ee];++G);if(G>_e){if(_e=G,Ae=Ee,G>Ge)break;for(var Ce=Math.min(Ee,G-2),Oe=0,le=0;le<Ce;++le){var Zt=R-Ee+le&32767,An=P[Zt],zn=Zt-An&32767;zn>Oe&&(Oe=zn,Pe=Zt)}}}De=Pe,Pe=P[De],Ee+=De-Pe&32767}if(Ae){$[me++]=268435456|aa[_e]<<18|fc[Ae];var En=aa[_e]&31,en=fc[Ae]&31;V+=Vr[En]+qr[en],++se[257+En],++ye[en],oe=R+_e,++de}else $[me++]=e[R],++se[e[R]]}}for(R=Math.max(R,oe);R<c;++R)$[me++]=e[R],++se[e[R]];v=gc(e,h,m,$,se,ye,V,me,Se,R-Se,v),m||(r.r=v&7|h[v/8|0]<<3,v-=7,r.h=U,r.p=P,r.i=R,r.w=oe)}else{for(var R=r.w||0;R<c+m;R+=65535){var ke=R+65535;ke>=c&&(h[v/8|0]=m,ke=c),v=Tc(h,v+1,e.subarray(R,ke))}r.i=c}return _o(s,0,o+pa(v)+a)},Zp=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,o=9;--o;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),em=function(){var e=-1;return{p:function(t){for(var n=e,o=0;o<t.length;++o)n=Zp[n&255^t[o]]^n>>>8;e=n},d:function(){return~e}}};var tm=function(e,t,n,o,a){if(!a&&(a={l:1},t.dictionary)){var r=t.dictionary.subarray(-32768),c=new ge(r.length+e.length);c.set(r),c.set(e,r.length),e=c,a.w=r.length}return Qp(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,o,a)},Ec=function(e,t){var n={};for(var o in e)n[o]=e[o];for(var o in t)n[o]=t[o];return n};var Ot=function(e,t){return e[t]|e[t+1]<<8},dt=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},ra=function(e,t){return dt(e,t)+dt(e,t+4)*4294967296},ze=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function nm(e,t){return tm(e,t||{},0,0)}function om(e,t){return Xp(e,{i:2},t&&t.out,t&&t.dictionary)}var Ic=function(e,t,n,o){for(var a in e){var r=e[a],c=t+a,s=o;Array.isArray(r)&&(s=Ec(o,r[1]),r=r[0]),ArrayBuffer.isView(r)?n[c]=[r,s]:(n[c+="/"]=[new ge(0),s],Ic(r,c,n,o))}},yc=typeof TextEncoder<"u"&&new TextEncoder,ca=typeof TextDecoder<"u"&&new TextDecoder,rm=0;try{ca.decode(Ac,{stream:!0}),rm=1}catch{}var im=function(e){for(var t="",n=0;;){var o=e[n++],a=(o>127)+(o>223)+(o>239);if(n+a>e.length)return{s:t,r:_o(e,n-1)};a?a==3?(o=((o&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|o>>10,56320|o&1023)):a&1?t+=String.fromCharCode((o&31)<<6|e[n++]&63):t+=String.fromCharCode((o&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(o)}};function vc(e,t){if(t){for(var n=new ge(e.length),o=0;o<e.length;++o)n[o]=e.charCodeAt(o);return n}if(yc)return yc.encode(e);for(var a=e.length,r=new ge(e.length+(e.length>>1)),c=0,s=function(v){r[c++]=v},o=0;o<a;++o){if(c+5>r.length){var h=new ge(c+8+(a-o<<1));h.set(r),r=h}var m=e.charCodeAt(o);m<128||t?s(m):m<2048?(s(192|m>>6),s(128|m&63)):m>55295&&m<57344?(m=65536+(m&1047552)|e.charCodeAt(++o)&1023,s(240|m>>18),s(128|m>>12&63),s(128|m>>6&63),s(128|m&63)):(s(224|m>>12),s(128|m>>6&63),s(128|m&63))}return _o(r,0,c)}function am(e,t){if(t){for(var n="",o=0;o<e.length;o+=16384)n+=String.fromCharCode.apply(null,e.subarray(o,o+16384));return n}else{if(ca)return ca.decode(e);var a=im(e),r=a.s,n=a.r;return n.length&&Ue(8),r}}var sm=function(e,t){return t+30+Ot(e,t+26)+Ot(e,t+28)},lm=function(e,t,n){var o=Ot(e,t+28),a=Ot(e,t+30),r=am(e.subarray(t+46,t+46+o),!(Ot(e,t+8)&2048)),c=t+46+o,s=cm(e,c,a,n,dt(e,t+20),dt(e,t+24),dt(e,t+42)),h=s[0],m=s[1],v=s[2];return[Ot(e,t+10),h,m,r,c+a+Ot(e,t+32),v]},cm=function(e,t,n,o,a,r,c){var s=a==4294967295,h=r==4294967295,m=c==4294967295,v=t+n,f=s+h+m;if(o&&f){for(;t+4<v;t+=4+Ot(e,t+2))if(Ot(e,t)==1)return[s?ra(e,t+4+8*h):a,h?ra(e,t+4):r,m?ra(e,t+4+8*(h+s)):c,1];o<2&&Ue(13)}return[a,r,c,0]},ua=function(e){var t=0;if(e)for(var n in e){var o=e[n].length;o>65535&&Ue(9),t+=o+4}return t},wc=function(e,t,n,o,a,r,c,s){var h=o.length,m=n.extra,v=s&&s.length,f=ua(m);ze(e,t,c!=null?33639248:67324752),t+=4,c!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(r<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),E=y.getFullYear()-1980;if((E<0||E>119)&&Ue(10),ze(e,t,E<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),t+=4,r!=-1&&(ze(e,t,n.crc),ze(e,t+4,r<0?-r-2:r),ze(e,t+8,n.size)),ze(e,t+12,h),ze(e,t+14,f),t+=16,c!=null&&(ze(e,t,v),ze(e,t+6,n.attrs),ze(e,t+10,c),t+=14),e.set(o,t),t+=h,f)for(var M in m){var P=m[M],U=P.length;ze(e,t,+M),ze(e,t+2,U),e.set(P,t+4),t+=4+U}return v&&(e.set(s,t),t+=v),t},um=function(e,t,n,o,a){ze(e,t,101010256),ze(e,t+8,n),ze(e,t+10,n),ze(e,t+12,o),ze(e,t+16,a)};function Mc(e,t){t||(t={});var n={},o=[];Ic(e,"",n,t);var a=0,r=0;for(var c in n){var s=n[c],h=s[0],m=s[1],v=m.level==0?0:8,f=vc(c),y=f.length,E=m.comment,M=E&&vc(E),P=M&&M.length,U=ua(m.extra);y>65535&&Ue(11);var j=v?nm(h,m):h,ee=j.length,O=em();O.p(h),o.push(Ec(m,{size:h.length,crc:O.d(),c:j,f,m:M,u:y!=c.length||M&&E.length!=P,o:a,compression:v})),a+=30+y+U+ee,r+=76+2*(y+U)+(P||0)+ee}for(var $=new ge(r+22),se=a,ye=r-a,de=0;de<o.length;++de){var f=o[de];wc($,f.o,f,f.f,f.u,f.c.length);var V=30+f.f.length+ua(f.extra);$.set(f.c,f.o+V),wc($,a,f,f.f,f.u,f.c.length,f.o,f.m),a+=16+V+(f.m?f.m.length:0)}return um($,a,o.length,ye,se),$}function Lc(e,t){for(var n={},o=e.length-22;dt(e,o)!=101010256;--o)(!o||e.length-o>65558)&&Ue(13);var a=Ot(e,o+8);if(!a)return{};var r=dt(e,o+16),c=dt(e,o-20)==117853008;if(c){var s=dt(e,o-12);c=dt(e,s)==101075792,c&&(a=dt(e,s+32),r=dt(e,s+48))}for(var h=t&&t.filter,m=0;m<a;++m){var v=lm(e,r,c),f=v[0],y=v[1],E=v[2],M=v[3],P=v[4],U=v[5],j=sm(e,U);r=P,(!h||h({name:M,size:y,originalSize:E,compression:f}))&&(f?f==8?n[M]=om(e.subarray(j,j+y),{out:new ge(E)}):Ue(14,"unknown compression type "+f):n[M]=_o(e,j,j+y))}return n}var Zr="https://devel.kamotimestamps.com",Oc="308989572223-cdnvpn65mc51oqneu7po3og51uf5ahsb.apps.googleusercontent.com",dm="https://www.youtube.com/",Hc="timekeeper_sync_auth",Nc="timekeeper_sync_oauth",On="syncAuthState",zc="syncCursors",pm=500,mm=5e3,Cc=200,fm=500,hm=60*1e3,gm=60*1e3,ym=300*1e3;function Hn(){return!!(Zr&&Oc)}var Gc=be({accessToken:Y(),accessTokenExpiresAt:Le({finite:!0}),refreshToken:Y(),user:be({id:Y(),email:Y(),displayName:Ze(Y())})}),vm=be({records:mn.array(),seq:Le({int:!0,nonnegative:!0}),hasMore:Dt()}),wm=be({known:Dt(),membersOnly:Ze(Dt()),channelId:Ze(Y())}),bm=be({rejected:mn.array(),fromSeq:Le({int:!0,nonnegative:!0}),seq:Le({int:!0,nonnegative:!0})}),Sm=be({type:Y(),seq:we(Le({int:!0,nonnegative:!0})),fromSeq:we(Le({int:!0,nonnegative:!0})),records:we(mn.array())}),km=be({type:Y(),idToken:we(Y()),error:we(Y())}),Sn=class extends Error{},Kr=class extends Error{constructor(n,o){super(o);this.httpStatus=n}},xm=e=>e instanceof Kr&&e.httpStatus>=400&&e.httpStatus<500&&e.httpStatus!==408&&e.httpStatus!==429,no={kind:"signed-out"},Xr="idle",ma=null,oo=new Set,Fc=new Map,Ho=new Map,Xt=null,bn=null,ei=0,to=null,Bc=0,Qt=!0,Oo=null,va=0,fa=null,Rc=!1,$e={pushCounter:0,pullSeq:0},wa=new Map,Dc=Promise.resolve(),Wr=!1,jr=null,Jr="",ti=null,Uc=null,ha=null,Yr=null,Vc=null;function We(){return Xl()}function qc(e){Uc=e}function jc(e){ha=e}function $c(e){Yr=e}function Wc(e){Vc=e}var Yc="#52c41a",Kc="#ff4d4f",wn="#ffa500";function No(){let e=We();if(ha){let t=ha;if(t.style.fontWeight="bold",t.onmouseenter=null,t.onmouseleave=null,!Hn())K(t,"alert-triangle","Sync backend is not configured in this build"),t.style.color=wn;else if(!e.isSignedIn)K(t,"circle-x","Not signed in"),t.style.color=Kc;else{K(t,"circle-check","Signed in"),t.style.color=Yc;let n=e.userName;n&&(t.onmouseenter=()=>K(t,"circle-check",`Signed in as ${n}`),t.onmouseleave=()=>K(t,"circle-check","Signed in"))}}if(Yr){let{text:t,color:n}=Xc(e);Yr.textContent=t,Yr.style.color=n}Vc?.(),Jc?.()}function Xc(e=We()){let t=no;if(t.kind==="error")return{text:t.message||"Sync error",color:Kc,busy:!1};if(t.kind==="signing-in")return{text:t.step,color:wn,busy:!0};if(t.kind==="connecting")return{text:"Connecting\u2026",color:wn,busy:!0};if(e.isSignedIn&&t.kind==="offline")return{text:"Offline. Retrying\u2026",color:wn,busy:!1};if(e.isSignedIn&&t.kind==="online"){if(Xr==="failed")return{text:"Sync failed. Retrying\u2026",color:wn,busy:!1};let n=Xr==="running",o=n?"Syncing\u2026":"Live sync on";return!n&&ma&&(o+=` \xB7 last synced ${new Date(ma).toLocaleTimeString()}`),!n&&oo.size>0?(o+=` \xB7 ${oo.size} timestamp${oo.size===1?"":"s"} could not be synced`,{text:o,color:wn,busy:!1}):{text:o,color:n?wn:Yc,busy:n}}return{text:"",color:"#aaa",busy:!1}}var Tm="#4285f4";function ni(){if(!Hn()||!We().isSignedIn)return null;let{text:e,color:t,busy:n}=Xc();return e?{color:n?Tm:t,tooltip:`Sync: ${e}`}:{color:wn,tooltip:"Sync: starting\u2026"}}var Jc=null;function Qc(e){Jc=e}function Jt(e){no=e,No()}function pt(){return no.kind==="connecting"||no.kind==="online"||no.kind==="offline"}function $r(e){pt()&&Jt({kind:e})}function Pc(e){Xr=e,No()}function Zc(){return typeof GM<"u"&&GM&&typeof GM.getValue=="function"&&typeof GM.setValue=="function"?GM:null}async function eu(){let e=Zc();if(!e)return jt(On);let t=await e.getValue(On);if(t!=null)return t;let n=await jt(On);return n&&(await e.setValue(On,n),await yn(On,null)),n??void 0}async function oi(){try{let e=Zc();e?await e.setValue(On,We()):await yn(On,We())}catch(e){l("Failed to save sync auth state:",e,"error")}}function zo(){yn(zc,{userId:We().userId,...$e})}async function Am(){let e=await jt(zc);e&&e.userId===We().userId&&typeof e.pushCounter=="number"&&typeof e.pullSeq=="number"?$e={pushCounter:e.pushCounter,pullSeq:e.pullSeq}:$e={pushCounter:0,pullSeq:0}}function ba(e,t){return fetch(`${Zr}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function tu(e){ti=null,eo({isSignedIn:!0,accessToken:e.accessToken,accessTokenExpiresAt:e.accessTokenExpiresAt,refreshToken:e.refreshToken,userId:e.user.id,userName:e.user.displayName,email:e.user.email})}var nu=e=>!!e.accessToken&&e.accessToken!==ti&&!!e.accessTokenExpiresAt&&e.accessTokenExpiresAt-Date.now()>hm;async function Em(e){return typeof navigator<"u"&&navigator.locks?await navigator.locks.request("timekeeper-sync-refresh",e):e()}async function Im(){let e=await eu();if(e==null)return;let t=Ii.safeParse(e);t.success&&eo(t.data)}function Mm(){return jr??(jr=Em(async()=>{await Im();let e=We();if(!e.isSignedIn||!e.refreshToken)throw new Sn("Not signed in");if(nu(e))return e.accessToken;let t=await ba("/auth/refresh",{refreshToken:e.refreshToken});if(t.status===401)throw new Sn("Session expired");if(!t.ok)throw new Error(`Token refresh failed (HTTP ${t.status})`);let n=Gc.safeParse(await t.json());if(!n.success)throw new Error("Unexpected token refresh response");return tu(n.data),await oi(),n.data.accessToken}).finally(()=>{jr=null})),jr}async function ou(){let e=We();if(!e.isSignedIn||!e.refreshToken)throw new Sn("Not signed in");return nu(e)?e.accessToken:Mm()}async function ru(e,t,n=!0){let o=await ou(),a=await fetch(`${Zr}${e}`,{method:t.method,headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:t.body===void 0?void 0:JSON.stringify(t.body)});if(a.status===401){if(!n)throw new Sn("Session expired");return ti=o,ru(e,t,!1)}return a}async function Qr(e,t,n){let o=await ru(e,t);if(!o.ok)throw new Kr(o.status,`${t.method} ${e} failed (HTTP ${o.status})`);let a=n.safeParse(await o.json());if(!a.success)throw new Error(`Unexpected response from ${e}`);return a.data}function Lm(e){try{let t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(t.padEnd(Math.ceil(t.length/4)*4,"=")))}catch{return null}}function Cm(e,t,n){return new Promise((o,a)=>{let r=()=>{clearTimeout(c),e.close();try{t.close()}catch{}},c=setTimeout(()=>{r(),a(new Error("Sign-in timed out"))},ym);e.onmessage=s=>{let h=km.safeParse(s.data);if(h.success){if(h.data.type==="timekeeper_sync_oauth_error")r(),a(new Error(h.data.error||"Google sign-in failed"));else if(h.data.type==="timekeeper_sync_oauth_token"&&h.data.idToken){if(Lm(h.data.idToken)?.nonce!==n)return;r(),o(h.data.idToken)}}}})}function iu(){let e=window.location.hash;if(!e||e.length<=1)return!1;let t=new URLSearchParams(e.substring(1));if(t.get("state")!==Hc)return!1;let n=t.get("id_token"),o=t.get("error_description")||t.get("error");if(!n&&!o)return!1;try{let a=new BroadcastChannel(Nc);a.postMessage(o?{type:"timekeeper_sync_oauth_error",error:o}:{type:"timekeeper_sync_oauth_token",idToken:n}),a.close()}catch(a){console.error("[Timekeeper] Failed to hand sync sign-in result to the opener:",a)}return history.replaceState&&history.replaceState(null,"",window.location.pathname+window.location.search),window.close(),!0}async function au(){if(!Hn()){Jt({kind:"error",message:"Sync backend is not configured in this build"});return}if(We().isSignedIn||no.kind==="signing-in")return;Jt({kind:"signing-in",step:"Opening Google sign-in\u2026"});let e=crypto.randomUUID(),t=new BroadcastChannel(Nc);try{let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",Oc),n.searchParams.set("redirect_uri",dm),n.searchParams.set("response_type","id_token"),n.searchParams.set("scope","openid email profile"),n.searchParams.set("nonce",e),n.searchParams.set("state",Hc),n.searchParams.set("prompt","select_account");let o=window.open(n.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!o)throw new Error("Popup blocked. Please enable popups for YouTube.");Jt({kind:"signing-in",step:"Waiting for Google sign-in\u2026"});let a=await Cm(t,o,e);Jt({kind:"signing-in",step:"Signing in to Timekeeper Sync\u2026"});let r=await ba("/auth/google",{idToken:a});if(!r.ok)throw new Error(r.status===401?"Google sign-in was rejected by the server":`Sign-in failed (HTTP ${r.status})`);let c=Gc.safeParse(await r.json());if(!c.success)throw new Error("Unexpected response from the sync server");tu(c.data),await oi(),$e={pushCounter:0,pullSeq:0},zo(),l(`Signed in to Timekeeper Sync as ${c.data.user.displayName??"an account with no display name"}`),await mu()}catch(n){t.close(),l("Sync sign-in failed:",n,"error"),Jt({kind:"error",message:n instanceof Error?n.message:"Sign-in failed"})}}var ga=e=>`${e.channelId}:${e.membersOnly}`;function su(e){Fc.set(e.videoId,e),pt()&&Bm(e)}async function Bm(e){let t=ga(e);if(Ho.get(e.videoId)!==t)try{if(!(await Ni(e.videoId))?.some(a=>!a.deleted_at))return;let o=await Qr(`/videos/${encodeURIComponent(e.videoId)}/access`,{method:"GET"},wm);(!o.known||o.membersOnly!==e.membersOnly||o.channelId!==e.channelId)&&await Qr("/videos/access",{method:"POST",body:{videos:[e]}},be({ok:Dt()})),Ho.set(e.videoId,t)}catch(n){l("Reporting the members-only status failed:",n,"warn")}}async function lu(){let{refreshToken:e}=We();if(fu({kind:"signed-out"}),eo(Kn),$e={pushCounter:0,pullSeq:0},wa.clear(),oo.clear(),Ho.clear(),await oi(),zo(),e&&Hn())try{await ba("/auth/logout",{refreshToken:e})}catch(t){l("Sync logout request failed:",t,"warn")}}function cu(){fu({kind:"error",message:"Session expired. Please sign in again."}),eo(Kn),oi()}function uu(e){let t=Dc.then(e);return Dc=t.catch(()=>{}),t}function ro(){!pt()||Wr||(Wr=!0,uu(async()=>{Wr=!1,await Pm()}).catch(e=>l("Sync: cycle crashed:",e,"error")))}async function Sa(e){if(e.length!==0){for(let t of e)wa.set(t.guid,t.write_counter??0);await Gi(e),Uc?.([...new Set(e.map(t=>t.video_id))])}}function du(e,t){return e>$e.pullSeq?(Qt=!0,!1):(t>$e.pullSeq&&($e.pullSeq=t,zo()),!0)}async function Rm(){for(;;){let e=await Qr(`/sync/pull?since=${$e.pullSeq}&limit=${fm}`,{method:"GET"},vm);await Sa(e.records);let t=e.seq!==$e.pullSeq;if($e.pullSeq=e.seq,zo(),!e.hasMore||!t)return}}async function ya(e){try{let t=[...new Set(e.map(o=>o.video_id))].map(o=>Fc.get(o)).filter(o=>!!o&&Ho.get(o.videoId)!==ga(o)),n=await Qr("/sync/push",{method:"POST",body:{deviceId:Jr,records:e,videos:t}},bm);for(let o of t)Ho.set(o.videoId,ga(o));await Sa(n.rejected);for(let o of e)oo.delete(o.guid);du(n.fromSeq,n.seq)||ro()}catch(t){if(!xm(t))throw t;if(e.length>1){let n=e.length>>1;await ya(e.slice(0,n)),await ya(e.slice(n));return}oo.add(e[0].guid),l(`Sync: server refused timestamp ${e[0].guid}; leaving it local-only:`,t,"warn")}}async function Dm(){let e=await zi($e.pushCounter);if(e.length===0)return;let t=e.filter(n=>(wa.get(n.guid)??0)<n.write_counter);for(let n=0;n<t.length;n+=Cc)await ya(t.slice(n,n+Cc));$e.pushCounter=Math.max($e.pushCounter,e[e.length-1].write_counter),zo()}async function Pm(){if(!pt())return;Pc("running");let e="idle";try{(Qt||!Xt)&&(await Rm(),Qt=!1),await Dm(),ma=Date.now(),va=0}catch(t){if(t instanceof Sn){cu();return}l("Sync cycle failed:",t,"warn"),Qt=!0,e="failed",_m()}finally{Pc(e)}}function pu(e){return Math.min(gm,1e3*2**e)*(.5+Math.random()/2)}function _m(){!pt()||Oo||(Oo=setTimeout(()=>{Oo=null,ro()},pu(va++)))}function Om(){if(!pt())return;let e=Date.now();to?clearTimeout(to):Bc=e;let t=Math.max(0,Math.min(pm,Bc+mm-e));to=setTimeout(()=>{to=null,ro()},t)}function ka(){pt()&&(Qt=!0,Xt||(ei=0,bn&&clearTimeout(bn),bn=null,xa()),ro())}function _c(){!pt()||bn||(bn=setTimeout(()=>{bn=null,xa()},pu(ei++)))}async function xa(){if(!pt()||Xt)return;$r("connecting");let e;try{e=await ou()}catch(n){return n instanceof Sn?cu():(l("Sync: could not get an access token:",n,"warn"),$r("offline"),_c())}if(!pt()||Xt)return;let t=new WebSocket(`${Zr.replace(/^http/,"ws")}/sync/ws`);Xt=t,t.onopen=()=>t.send(JSON.stringify({type:"auth",token:e,deviceId:Jr})),t.onmessage=n=>{let o;try{o=JSON.parse(String(n.data))}catch{return}let a=Sm.safeParse(o);if(a.success){if(a.data.type==="ready")ei=0,$r("online"),(a.data.seq===void 0||a.data.seq!==$e.pullSeq)&&(Qt=!0),ro();else if(a.data.type==="changes"&&a.data.records){let{fromSeq:r,seq:c,records:s}=a.data;uu(async()=>{await Sa(s),(r===void 0||c===void 0)&&(Qt=!0),(Qt||!du(r,c))&&ro()}).catch(h=>l("Sync: failed to apply live changes:",h,"error"))}}},t.onclose=n=>{Xt===t&&(Xt=null),Qt=!0,pt()&&(n.code===4401&&(ti=e),$r("offline"),_c())},t.onerror=()=>{}}async function mu(){if(!pt()){if(!Jr){let e=await jt("device_id");Jr=typeof e=="string"&&e?e:crypto.randomUUID()}Xr="idle",Jt({kind:"connecting"}),va=0,ei=0,fa=Fi(Om),Rc||(Rc=!0,window.addEventListener("online",()=>ka())),await xa()}}function fu(e){Jt(e),fa?.(),fa=null;for(let n of[to,Oo,bn])n&&clearTimeout(n);to=Oo=bn=null,Wr=!1;let t=Xt;Xt=null;try{t?.close()}catch{}}async function hu(){if(!Hn()){No();return}try{let e=Ii.safeParse(await eu());e.success&&eo(e.data);let t=We();t.isSignedIn&&t.refreshToken?(await Am(),await mu()):Jt({kind:"signed-out"})}catch(e){l("Failed to load sync auth state:",e,"error")}}function mt(){return _t()}var ft={get isSignedIn(){return _t().isSignedIn},get accessToken(){return _t().accessToken},get userName(){return _t().userName},get email(){return _t().email},set isSignedIn(e){let t=_t();At({...t,isSignedIn:e})},set accessToken(e){let t=_t();At({...t,accessToken:e})},set userName(e){let t=_t();At({...t,userName:e})},set email(e){let t=_t();At({...t,email:e})}};function jo(){return at().auth.autoBackupEnabled}function xn(){return at().auth.autoBackupIntervalMinutes}var Aa=null,Ve=null,te=null,Nn=null;function bu(e){Aa=e}function Su(e){Ve=e}function ku(e){te=e}function xu(e){Nn=e}var gu=!1;function Tu(){if(!gu)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),gu=!0}catch{}}var Au=null,Ea=null,Fo=null,Uo=null,Ia=null;function Eu(e){Au=e}function Iu(e){Ea=e}function Ma(e){Fo=e}function La(e){Uo=e}function Mu(e){Ia=e}var ai="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Lu="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Cu="https://www.youtube.com/",Nm=new Date(Date.UTC(2e3,0,1,0,0,0)),zm=30*1e3,Gm=1800*1e3,yu=5,ii=null,kn=null;async function Ca(){try{let e=await Uo("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=Ei.safeParse(e);if(n.success){let o=mt();At({...o,...n.data});let a=mt();a.isSignedIn&&a.accessToken&&l(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),ao();let r=mt();r.isSignedIn&&r.accessToken&&await Tn(!0)}else if(e!==void 0){let o=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:o,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function $o(){try{let e=mt(),t=Ei.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await Fo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function ao(){Aa&&(Aa.style.display="none")}function nt(e,t){if(!te)return;if(te.style.fontWeight="bold",e==="authenticating"){Tu(),te.style.color="#ffa500",te.replaceChildren();let o=document.createElement("span");o.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);te.appendChild(o),te.appendChild(a);return}if(e==="error"){K(te,"circle-x",t||"Authorization failed"),te.style.color="#ff4d4f",xe();return}let n=mt();n.isSignedIn?(K(te,"circle-check","Signed in"),te.style.color="#52c41a",te.removeAttribute("title"),n.userName?(te.onmouseenter=()=>{K(te,"circle-check",`Signed in as ${n.userName}`)},te.onmouseleave=()=>{K(te,"circle-check","Signed in")}):(te.onmouseenter=null,te.onmouseleave=null)):(K(te,"circle-x","Not signed in"),te.style.color="#ff4d4f",te.removeAttribute("title"),te.onmouseenter=null,te.onmouseleave=null),xe()}function Fm(){te&&(Tu(),te.classList.remove("tk-auth-blink"),te.offsetWidth,te.classList.add("tk-auth-blink"),setTimeout(()=>{te.classList.remove("tk-auth-blink")},1200))}function Bu(e,t=300*1e3){return new Promise((n,o)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),o(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let a=Date.now(),r="timekeeper_oauth",c=null,s=null,h=null,m=()=>{if(c){try{c.close()}catch{}c=null}s&&(clearInterval(s),s=null),h&&(clearInterval(h),h=null)};try{c=new BroadcastChannel(r),l&&l("OAuth monitor: BroadcastChannel created successfully"),c.onmessage=y=>{let E=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;l&&l("OAuth monitor: received BroadcastChannel message",E);let M=be({type:Y(),token:we(Y()),error:we(Y())}).safeParse(y.data);if(!M.success){l&&l("OAuth monitor: invalid message format",M.error,"warn");return}if(M.data.type==="timekeeper_oauth_token"&&M.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),m();try{e.close()}catch{}n(M.data.token)}else if(M.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),m();try{e.close()}catch{}o(new Error(M.data.error||"OAuth failed"))}}}catch(y){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}l&&l("OAuth monitor: setting up IndexedDB polling");let v=Date.now();s=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let E=y.result,U=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");U.onsuccess=()=>{let j=U.result;if(j&&j.value){let ee=j.value,O=be({type:Y(),token:we(Y()),error:we(Y()),timestamp:we(Le())}).safeParse(ee);if(!O.success){l&&l("OAuth monitor: invalid IndexedDB message format",O.error,"warn");return}if(O.data.timestamp&&O.data.timestamp>v){let $=O.data.token?{...O.data,token:"[REDACTED]"}:O.data;if(l&&l("OAuth monitor: received IndexedDB message",$),O.data.type==="timekeeper_oauth_token"&&O.data.token){l&&l("OAuth monitor: token received via IndexedDB"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(O.data.token)}else if(O.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",O.data.error,"error"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),o(new Error(O.data.error||"OAuth failed"))}v=O.data.timestamp||Date.now()}}E.close()}}}catch(y){l&&l("OAuth monitor: IndexedDB polling error",y,"error")}},500),h=setInterval(()=>{if(Date.now()-a>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),m();try{e.close()}catch{}o(new Error("OAuth popup timed out"));return}},1e3)})}async function Ru(){if(!ai){nt("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),nt("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",ai),e.searchParams.set("redirect_uri",Cu),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Lu),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),nt("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),nt("authenticating","Waiting for authentication...");try{let n=await Bu(t),o=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(o.ok){let a=await o.json(),r=be({name:we(Y()),email:we(Y())}).safeParse(a);if(!r.success)throw l&&l("Failed to validate user info response",r.error,"error"),new Error("Invalid user info response");let c=r.data;At({isSignedIn:!0,accessToken:n,userName:c.name||null,email:c.email||null}),await $o(),ao(),nt(),xe(),await Tn(),l?l(`Successfully authenticated as ${c.name}`):console.log(`[Timekeeper] Successfully authenticated as ${c.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let o=n instanceof Error?n.message:"Authentication failed";l?l("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),nt("error",o);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),nt("error",`Failed to sign in: ${t}`)}}async function Um(){let e=mt(),t=e.email;if(!ai||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",ai),n.searchParams.set("redirect_uri",Cu),n.searchParams.set("response_type","token"),n.searchParams.set("scope",Lu),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let o=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!o)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await Bu(o,15e3);return At({...e,isSignedIn:!0,accessToken:a}),await $o(),ao(),nt(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){l("Silent OAuth: silent refresh failed",a,"warn");try{o.close()}catch{}return!1}}async function Du(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),o=n.get("state");if(l&&l("OAuth popup: hash params found, state="+o),o!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),r=n.get("access_token"),c="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let h={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",h);let m=indexedDB.open("ytls-timestamps-db",4);m.onsuccess=()=>{let v=m.result,y=v.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});y.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",y.error,"error")},v.close()},m.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",m.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(r){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_token",token:r}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let h={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},m={...h,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",m);let v=indexedDB.open("ytls-timestamps-db",4);v.onsuccess=()=>{let f=v.result,E=f.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});E.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",E.error,"error")},f.close()},v.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",v.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Pu(){At({isSignedIn:!1,accessToken:null,userName:null,email:null}),await $o(),await Tn(),ao(),nt(),xe()}async function _u(){let e=mt();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await Nu({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function si(){let e=mt();return e.isSignedIn&&!!e.accessToken}function Ba(){return si()}function Vm(){let e=[];return si()&&e.push("Google Drive"),e}function qm(e){let t=Lc(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function Ou(e){let t={Authorization:`Bearer ${e}`},o=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(o,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let r=await a.json();if(Array.isArray(r.files)&&r.files.length>0)return r.files[0].id;let c=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error("drive folder create failed");return(await c.json()).id}async function Hu(e,t,n){let o=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(o),r=encodeURIComponent("modifiedTime desc"),c=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&orderBy=${r}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error(`drive search failed (${c.status})`);let s=await c.json();return s.files&&s.files.length>0?s.files[0].id:null}async function vu(e){let t=await Ou(e),n=await Hu("timekeeper-data.zip",t,e);if(!n)return null;let o=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)throw new Error(`drive download failed (${o.status})`);let a=await o.arrayBuffer();try{return qm(a)}catch(r){return l("Remote backup could not be decoded; the next upload will replace it:",r,"warn"),null}}async function jm(){if(!Ea)return;let e=mt();if(!e.isSignedIn||!e.accessToken)return;let t;try{t=await vu(e.accessToken)}catch(a){if(a.message!=="unauthorized")throw a;await Nu({silent:!0});let r=mt();if(!r.isSignedIn||!r.accessToken)throw a;t=await vu(r.accessToken)}if(!t)return;let{mergedVideos:n,mergedTimestamps:o}=await Ea(t);o>0&&(l(`Pre-backup merge: added ${o} timestamps from ${n} videos from remote`),Ia&&Ia())}function $m(e,t){let n=new TextEncoder().encode(e),o=t.replace(/\\/g,"/").replace(/^\/+/,"");return o.endsWith(".json")||(o+=".json"),Mc({[o]:[n,{level:6,mtime:Nm,os:0}]})}async function Wm(e,t,n,o){let a=e.replace(/\.json$/,".zip"),r=await Hu(a,n,o),c=new TextEncoder().encode(t).length,s=$m(t,e),h=s.length;l(`Compressing data: ${c} bytes -> ${h} bytes (${Math.round(100-h/c*100)}% reduction)`);let m="-------314159265358979",v=`\r
--${m}\r
`,f=`\r
--${m}--`,y=r?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},E=8192,M="";for(let $=0;$<s.length;$+=E){let se=s.subarray($,Math.min($+E,s.length));M+=String.fromCharCode.apply(null,Array.from(se))}let P=btoa(M),U=v+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+v+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+P+f,j,ee;r?(j=`https://www.googleapis.com/upload/drive/v3/files/${r}?uploadType=multipart&fields=id,name`,ee="PATCH"):(j="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",ee="POST");let O=await fetch(j,{method:ee,headers:{Authorization:`Bearer ${o}`,"Content-Type":`multipart/related; boundary=${m}`},body:U});if(O.status===401)throw new Error("unauthorized");if(!O.ok)throw new Error("drive upload failed")}async function Nu(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await Um()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),At({isSignedIn:!1,accessToken:null,userName:null,email:null}),await $o(),await Tn(),nt("error","Authorization expired. Please sign in again."),xe())}async function Ym(e){if(!si())throw e?.silent||nt("error","Configure a backup destination first"),new Error("no-backup-destination");await jm();let t=await Au({includeDeleted:!0});if(t.totalTimestamps===0){if(t.invalidRows>0)throw new Error(`export-invalid-data: ${t.invalidRows} stored rows failed validation`);return e?.silent||l("Skipping export: no timestamps to back up"),"skipped"}let n=mt();if(!n.accessToken)throw new Error("unauthorized");let o=await Ou(n.accessToken);return await Wm(t.filename,t.json,o,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`),"uploaded"}async function zu(){try{let[e,t,n]=await Promise.all([Uo("lastAutoBackupAt"),Uo("autoBackupEnabled"),Uo("autoBackupIntervalMinutes")]),o=Mi.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});o.success?(typeof o.data.autoBackupEnabled=="boolean"&&Vi(o.data.autoBackupEnabled),typeof o.data.autoBackupIntervalMinutes=="number"&&qi(o.data.autoBackupIntervalMinutes),typeof o.data.lastAutoBackupAt=="number"&&Yi(o.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",o.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function Ra(){try{let e=at().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=Mi.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([Fo("autoBackupEnabled",e.autoBackupEnabled),Fo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),Fo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Go(){kn&&(clearTimeout(kn),kn=null),$i(0),Wi(null)}function Km(){ii&&(clearInterval(ii),ii=null),Go()}function Vo(e){try{let t=new Date(e),n=new Date,o=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return o?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function ri(){let e=Vm();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function Da(){let e=at().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?{kind:"running"}:e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?{kind:"retrying",backoffMs:e.autoBackupBackoffMs}:Ba()?e.autoBackupFailed?{kind:"failed"}:e.lastAutoBackupAt?{kind:"healthy",lastAt:e.lastAutoBackupAt}:{kind:"never"}:{kind:"no-destination"}:{kind:"off"}}function Gu(){switch(Da().kind){case"running":return"#4285f4";case"retrying":case"never":return"#ffa500";case"healthy":return"#52c41a";case"off":case"no-destination":case"failed":return"#ff4d4f"}}function xe(){if(li(),!Ve)return;let e=Da();switch(Ve.onmouseenter=null,Ve.onmouseleave=null,e.kind){case"off":K(Ve,"refresh","Backup: Off");break;case"running":K(Ve,"refresh","Backing up\u2026");break;case"retrying":K(Ve,"alert-triangle",`Retry in ${Math.ceil(e.backoffMs/6e4)}m`);break;case"no-destination":K(Ve,"alert-triangle","Backup target missing");break;case"failed":K(Ve,"alert-triangle","Backup failed");break;case"healthy":case"never":{let n=e.kind==="healthy"?`Last backup: ${Vo(e.lastAt)}`:"Last backup: never",o=(e.kind==="healthy"?e.lastAt:Date.now())+Math.max(1,xn())*60*1e3,a=`Next backup: ${Vo(o)}`;Ve.onmouseenter=()=>{K(Ve,"database",a)},Ve.onmouseleave=()=>{K(Ve,"database",n)},K(Ve,"database",n);break}}Ve.style.display="inline";let t=Gu();Ve.style.color=t}var Ta="ytls-backup-indicator--pulsing",Xm="#4285f4",io=null;function Jm(e,t){io&&(e.removeEventListener("animationiteration",io),io=null),t===Xm?(e.style.backgroundColor=t,e.classList.add(Ta)):e.classList.contains(Ta)?(io=()=>{Nn&&(Nn.classList.remove(Ta),Nn.style.backgroundColor=t,io=null)},e.addEventListener("animationiteration",io,{once:!0})):e.style.backgroundColor=t}function Qm(){let e=Da(),t=Math.max(1,xn())*60*1e3;switch(e.kind){case"off":return"Auto backup is disabled";case"running":return"Backup in progress";case"retrying":return`Retrying backup in ${Math.ceil(e.backoffMs/6e4)}m`;case"no-destination":return ri();case"failed":return`Backup failed. Will try again at the next scheduled backup
${ri()}`;case"healthy":return`Last backup: ${Vo(e.lastAt)}
Next backup: ${Vo(e.lastAt+t)}
${ri()}`;case"never":return`No backup yet
Next backup: ${Vo(Date.now()+t)}
${ri()}`}}function wu(){return ni()??{color:Gu(),tooltip:Qm()}}function li(){Nn&&(Jm(Nn,wu().color),Re(Nn,()=>wu().tooltip))}async function qo(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!Ba()){t||(xe(),si()||Fm());return}if(kn){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}Go(),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!at().auth.isAutoBackupRunning){ji(!0),xe();try{await Ym({silent:t})==="uploaded"&&Yi(Date.now()),Go(),Ur(!1),await Ra()}catch(o){if(l("Auto backup failed:",o,"error"),o.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let r=mt();At({...r,accessToken:null,isSignedIn:!1}),await $o(),nt("error","Authorization expired. Please sign in again."),xe(),Go(),Ur(!1)}else if(at().auth.autoBackupRetryAttempts<yu){let r=at().auth.autoBackupRetryAttempts+1;$i(r);let s=Math.min(zm*Math.pow(2,r-1),Gm);Wi(s),kn&&clearTimeout(kn),kn=setTimeout(()=>{kn=null,qo({silent:!0})},s),l(`Scheduling backup retry ${r}/${yu} in ${Math.round(s/1e3)}s`),xe()}else Go(),Ur(!0)}finally{ji(!1),xe()}}}async function Tn(e=!1){if(Km(),!!jo()&&Ba()){if(ii=setInterval(()=>{qo({silent:!0})},Math.max(1,xn())*60*1e3),!e){let t=Date.now(),n=Math.max(1,xn())*60*1e3,o=at().auth.lastAutoBackupAt;(!o||t-o>=n)&&qo({silent:!0})}xe()}}async function Fu(){let e=jo();Vi(!e),await Ra(),await Tn(),xe()}async function Uu(){let e=xn(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}qi(n),await Ra(),await Tn(),xe()}function Pa(e,t){return jt(e).then(n=>n!==void 0?n:t)}function _a(e,t){return yn(e,t),Promise.resolve()}var Oa=window.location.hash;if(Oa&&Oa.length>1){let e=new URLSearchParams(Oa.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let o=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),o.postMessage(a),o.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(o){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",o);let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},r=indexedDB.open("ytls-timestamps-db",4);r.onsuccess=()=>{let c=r.result,s=c.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",a.timestamp),c.close()}}}if(history.replaceState){let o=window.location.pathname+window.location.search;history.replaceState(null,"",o)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}if(iu())throw new Error("OAuth window closed");mc();pc()||cc();(async function(){"use strict";if(window.top!==window.self)return;function e(i){return Pa(i,void 0)}function t(i,u){return _a(i,u)}La(e),Ma(t);try{let i=await jt("device_id"),u=typeof i=="string"&&i.length>0?i:crypto.randomUUID();await yn("device_id",u),l(`Lamport: device_id = ${u}`)}catch(i){l("Lamport: failed to initialize device_id:",i,"warn")}if(await Du()){l("OAuth popup detected, broadcasting token and closing");return}await Ca();let o=["/watch","/live"];function a(i=window.location.href){try{let u=new URL(i);return u.origin!=="https://www.youtube.com"?!1:o.some(d=>u.pathname===d||u.pathname.startsWith(`${d}/`))}catch(u){return l("Timekeeper failed to parse URL for support check:",u,"error"),!1}}let r=null,c=null,s=null,h=null,m=null,v=null,f=null,y=null,E=(()=>{try{let i=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(i)&&i>0&&i!==1?Math.min(i,4):2}catch{return 2}})(),M=!1,P=null,U=null,j=250,ee=null;function O(){return at().ui.minPaneHeight}function $(i){Jl(i)}function se(i){Zl(i)}function ye(){return at().ui.urlChangeHandlersSetup}function de(i){ec(i)}function V(){return at().ui.panePosition}function R(i){Ql(i)}function me(i){tc(i)}function oe(){return r?r.getBoundingClientRect():null}function Se(i,u,d){i&&R({x:Math.round(typeof u=="number"?u:i.left),y:Math.round(typeof d=="number"?d:i.top),width:Math.round(i.width),height:Math.round(i.height)})}function Ye(i=!0){if(!r)return;Un();let u=oe();if(u&&(u.width||u.height)&&(Se(u),i)){let d=V();mr("windowPosition",d),In({type:"window_position_updated",position:d,timestamp:Date.now()})}}function De(){if(!r||!c||!h||!s)return;let i=40,u=Be();if(u.length>0)i=u[0].offsetHeight;else{let d=document.createElement("li");d.style.visibility="hidden",d.style.position="absolute",d.textContent="00:00 Example",s.appendChild(d),i=d.offsetHeight,s.removeChild(d)}j=c.offsetHeight+h.offsetHeight+i,$(j),r.style.minHeight=O()+"px"}function Pe(){requestAnimationFrame(()=>{He?.(),De(),Ye(!0)})}function Te(i=450){Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{It(),Pe(),Ie=null},i)}function le(){Ie&&(clearTimeout(Ie),Ie=null)}function _e(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),Pe(),Te()}function Ae(){It(),le(),gt&&(clearTimeout(gt),gt=null),gt=setTimeout(()=>{r&&(r.style.display="none",ls(),gt=null)},400)}function It(){if(!s){ot&&(ot(),ot=null,zt=null,Ln=null);return}if(!Ln){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),ot&&(ot(),ot=null,zt=null);return}l("Appending deferred timestamps after animation"),s.appendChild(Ln),Ln=null,rn(),an(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),ot&&(ot(),ot=null,zt=null),Lt(),qe(),He&&requestAnimationFrame(He),bt(!0)}let Ee=null,Ge={phase:"unloaded"},fe=0;function ce(){return Ge.phase==="loading"}function G(){return Ge.phase==="unloaded"?null:Ge.videoId}let Ce="ytls-timestamp-pending-delete",Oe="ytls-timestamp-highlight";async function Zt(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(i=>setTimeout(i,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(i=>setTimeout(i,100));await new Promise(i=>setTimeout(i,200))}let An=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],zn=5e3,En=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function en(i){return En.has(i)}function ke(){return document.querySelector("video")}let ht=null;function re(){if(ht&&document.contains(ht))return ht;let i=document.getElementById("movie_player");return i&&document.contains(i)?i:null}function Ha(i){return(Math.round(i*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function Vu(i){let u=i===1?2:i;E=u;try{localStorage.setItem("ytls-last-speed",String(u))}catch{}}function ci(i){if(!y)return;let u=typeof i=="number"?i:ke()?.playbackRate??1,d=Ha(u);y.dataset.speed!==d&&(y.dataset.speed=d,y.textContent=`${d}x`,y.setAttribute("aria-label",`Playback speed ${d}x`)),Math.abs(u-1)>.01?y.classList.add("ytls-playback-speed-active"):y.classList.remove("ytls-playback-speed-active")}function qu(i){let u=re(),d=ke();if(M=!0,u&&typeof u.setPlaybackRate=="function")u.setPlaybackRate(i);else if(d)d.playbackRate=i;else return M=!1,!1;return ci(i),!0}function Na(){let i=ke()?.playbackRate;return Number.isFinite(i)?qu(Math.abs(i-1)<=.001?E:1):!1}function ju(i){return i instanceof Element?!!i.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function ui(i){return An.every(u=>typeof i?.[u]=="function"?!0:en(u)?!!ke():!1)}function $u(i){return An.filter(u=>typeof i?.[u]=="function"?!1:en(u)?!ke():!0)}async function Wu(i=zn){let u=Date.now();for(;Date.now()-u<i;){let S=re();if(ui(S))return S;await new Promise(k=>setTimeout(k,100))}let d=re();return ui(d),d}let za="timestampOffsetSeconds",Yu=-5,Ga="shiftClickTimeSkipSeconds",Ku=10,di=300,pi=300,Mt=null;function Fa(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Ua(){if(Fa()&&!Mt)try{Mt=new BroadcastChannel("ytls_timestamp_channel"),Mt.onmessage=Va}catch(i){l("Failed to create BroadcastChannel:",i,"warn"),Mt=null}}function In(i){if(!Fa()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Ua(),!Mt){l("No BroadcastChannel available to post message","warn");return}try{Mt.postMessage(i)}catch(u){l("BroadcastChannel error, reopening:",u,"warn");try{Mt=new BroadcastChannel("ytls_timestamp_channel"),Mt.onmessage=Va,Mt.postMessage(i)}catch(d){l("Failed to reopen BroadcastChannel:",d,"error")}}}function Va(i){if(l("Received message from another tab:",i.data),!(!a()||!s||!r)&&i.data){if(i.data.type==="timestamps_updated"&&i.data.videoId===G())l("Debouncing timestamp load due to external update for video:",i.data.videoId),clearTimeout(lo),lo=setTimeout(()=>{l("Reloading timestamps due to external update for video:",i.data.videoId),pr()},500);else if(i.data.type==="window_position_updated"&&r){let u=i.data.position;if(u&&typeof u.x=="number"&&typeof u.y=="number"){r.style.left=`${u.x}px`,r.style.top=`${u.y}px`,r.style.right="auto",r.style.bottom="auto",typeof u.width=="number"&&u.width>0&&(r.style.width=`${u.width}px`),typeof u.height=="number"&&u.height>0&&(r.style.height=`${u.height}px`);let d=r.getBoundingClientRect();R({x:Math.round(u.x),y:Math.round(u.y),width:Math.round(d.width),height:Math.round(d.height)});let S=document.documentElement.clientWidth,k=document.documentElement.clientHeight;(d.left<0||d.top<0||d.right>S||d.bottom>k)&&Un()}}}}Ua();let Gn=await Pa(za);(typeof Gn!="number"||Number.isNaN(Gn))&&(Gn=Yu,await _a(za,Gn));let so=await Pa(Ga);(typeof so!="number"||Number.isNaN(so))&&(so=Ku,await _a(Ga,so));let lo=null,Nt=new Map,Mn=!1,H=null,Wo=null,gt=null,Ie=null,yt=null,Ke=null,tn=null,mi=!1,He=null,Ln=null,zt=null,ot=null,nn=null,Yo=!1,fi=!1,Ko=null,Xo=null,Jo=null,Qo=null,Zo=null,er=null,tr=null,nr=null,co=null,uo=null,po=null,vt=null,wt=null,qa=0,mo=!1,Cn=null,fo=null,Fn=null,ja=null,ho=null;function or(){if(!s)return{items:[],starts:[]};if(ja!==s||!ho?(ho?.disconnect(),ho=new MutationObserver(()=>{Fn=null}),ho.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),ja=s,Fn=null):ho.takeRecords().length>0&&(Fn=null),!Fn){let i=Nr(s),u=new Array(i.length);for(let d=0;d<i.length;d++){let S=i[d].querySelector("[data-time]")?.dataset.time;u[d]=S?Number.parseInt(S,10):NaN}Fn={items:i,starts:u}}return Fn}function Be(){return or().items}function hi(){return Yl(s)}function on(){return fo!==null||(fo=Kl(s)),fo}function rn(){fo=null}function rr(i=re(),u=ke()){let d=i?.getDuration?.();return Number.isFinite(d)&&d>0?d:Number.isFinite(u?.duration)&&u.duration>0?u.duration:0}function $a(){return rr()||on()}function Xu(i){let u=i.querySelector(".time-diff");return u?(u.textContent?.trim()||"").startsWith("-"):!1}let Ju="\u251C\u2500 ",Wa="\u2514\u2500 ",Ya=/^[├└]─\s/;function ir(i){return Ya.test(i)}function Ka(i){return i.replace(Ya,"")}function Xa(i){let u=Be();if(i>=u.length-1)return Wa;let k=u[i+1].querySelector("input");return k&&ir(k.value)?Ju:Wa}function Qu(i,u){return`${Xa(u)}${i}`}function Lt(){if(!s)return;Be().forEach((u,d)=>{let S=u.querySelector("input");if(!S||!ir(S.value))return;let k=Ka(S.value),A=Qu(k,d);S.value!==A&&(S.value=A)})}function go(){zr(s),Ln&&(Ln=null),ot&&(ot(),ot=null,zt=null)}function yo(){Wl(s,ce())}function Ja(i){Ui(s,i)}function gi(){ql(s)}function yi(i){if(Ge={phase:i?"loading":"ready",videoId:G()},!(!r||!s)){if(i)r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),Ja("Loading timestamps...");else if(gi(),r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),m){let u=re();if(u){let d=u.getCurrentTime(),S=Number.isFinite(d)?Math.max(0,Math.floor(d)):Math.max(0,on());m.textContent=Rr(S,rr(u))}}!ce()&&s&&!Co(s)&&yo(),Gt()}}function ar(i,u){i.dataset.time=String(u),i.textContent=fn(u,$a())}let sr=null,lr=null,Ct=!1;function Qa(i,u){if(!i||typeof i.getVideoData!="function"||!(u!==void 0?u:!!i.getVideoData()?.isLive))return!1;if(typeof i.getProgressState=="function"){let S=i.getProgressState(),k=Number(S?.seekableEnd??S?.liveHead??S?.head??S?.duration),A=Number(S?.current??i.getCurrentTime?.());if(Number.isFinite(k)&&Number.isFinite(A))return k-A>2}return!1}function Zu(i,u){if(!Number.isFinite(i))return;let d=Za(i);vi(d,u)}function bt(i=!1,u){if(Mn&&!i)return;let d;if(typeof u=="number"&&Number.isFinite(u))d=Math.max(0,Math.floor(u));else{let S=re(),k=S?S.getCurrentTime():NaN;d=Number.isFinite(k)?Math.max(0,Math.floor(k)):Math.max(0,on())}Number.isFinite(d)&&Zu(d,i)}function Za(i){if(!Number.isFinite(i))return null;let{items:u,starts:d}=or(),S=-1,k=-1/0;for(let A=0;A<d.length;A++){let T=d[A];T<=i&&T>k&&(k=T,S=A)}return S>=0?u[S]:null}function vi(i,u=!1){let d=s?s.getElementsByClassName(Oe):null;if(!(!!d&&(i?d.length===1&&d[0]===i:d.length===0))&&d)for(let k of Array.from(d))k.classList.contains(Ce)||k.classList.remove(Oe);if(i&&!i.classList.contains(Ce)&&(i.classList.add(Oe),u))try{if(s instanceof HTMLElement){let k=i.getBoundingClientRect(),A=s.getBoundingClientRect();!(k.bottom<A.top||k.top>A.bottom)||i.scrollIntoView({behavior:"smooth",block:"center"})}else i.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{i.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function ed(i){if(St()||!Number.isFinite(i)||i===0)return!1;let u=Be();if(u.length===0)return!1;let d=[];return u.forEach(S=>{let k=S.querySelector("[data-time]"),A=k?.dataset.time;if(!k||!A)return;let T=Number.parseInt(A,10);if(!Number.isFinite(T))return;let b=Math.max(0,T+i);if(b!==T){ar(k,b);let C=S.dataset.guid;C&&d.push({guid:C,start:b,comment:S.querySelector("input")?.value??""})}}),d.length===0?!1:(an(),Lt(),qe(),wi(),os(G(),d),Cn=null,!0)}function es(i,u={}){if(!Number.isFinite(i)||i===0)return!1;if(!ed(i)){if(u.alertOnNoChange){let T=u.failureMessage??"Offset did not change any timestamps.";alert(T)}return!1}let S=u.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${i>0?"+":""}${i} seconds (${S})`);let k=re(),A=k?Math.floor(k.getCurrentTime()):0;if(Number.isFinite(A)){let T=Za(A);vi(T,!1)}return!0}function ts(i){if(!s||ce())return;let u=i.target instanceof Element?i.target:null;if(!u)return;let d=u.closest("[data-time]"),S=u.closest("[data-increment]"),k=u.closest("[data-action]");if(d?.dataset.time){i.preventDefault();let A=Number(d.dataset.time);if(Number.isFinite(A)){l(`Seeking to timestamp ${A}`),Ct=!0;let b=re();b&&b.seekTo(A),setTimeout(()=>{Ct=!1},500)}let T=d.closest("li");T&&(Be().forEach(b=>{b.classList.contains(Ce)||b.classList.remove(Oe)}),T.classList.contains(Ce)||(T.classList.add(Oe),T.scrollIntoView({behavior:"smooth",block:"center"})))}else if(S?.dataset.increment){i.preventDefault();let A=S.closest("li"),T=A?.querySelector("[data-time]");if(!T||!T.dataset.time)return;let b=parseInt(T.dataset.time,10),C=parseInt(S.dataset.increment,10);if("shiftKey"in i&&i.shiftKey&&(C*=so),"altKey"in i?i.altKey:!1){es(C,{logLabel:"Alt adjust"});return}let F=Math.max(0,b+C);if(l(`Timestamps changed: Timestamp time incremented from ${b} to ${F}`),rn(),ar(T,F),lr=F,sr&&clearTimeout(sr),Ct=!0,sr=setTimeout(()=>{if(lr!==null){let ne=re();ne&&ne.seekTo(lr)}sr=null,lr=null,setTimeout(()=>{Ct=!1},500)},500),an(),Lt(),qe(),A){let ne=A.querySelector("input"),ve=A.dataset.guid;ne&&ve&&(dr(G(),ve,F,ne.value),Cn=ve)}}else k?.dataset.action==="clear"&&(i.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",rn(),qe(),cr(),od(),me([]),nd(G()),Cn=null,yo())}function vo(i,u="",d=!1,S=null,k=!0){if(!s)return null;let A=Math.max(0,i),T=S??crypto.randomUUID(),b=document.createElement("li"),C=document.createElement("div"),L=document.createElement("span"),D=document.createElement("span"),F=document.createElement("span"),ne=document.createElement("div"),ve=document.createElement("span"),lt=document.createElement("span"),J=document.createElement("input"),ie=document.createElement("button");b.dataset.guid=T,C.className="time-row",ne.className="ytls-row-controls";let Ne=document.createElement("div");Ne.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",Re(Ne,"Click to toggle indent");let rt=document.createElement("span");rt.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let kt=()=>{let q=J.offsetTop,N=J.offsetHeight||20;Ne.style.top=`${q}px`,Ne.style.height=`${N}px`},Bt=()=>{Fe(rt,ir(J.value)?"indent-decrease":"indent-increase",18)},Vn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",sn=q=>{let N=rt.querySelector("svg");N&&(N.style.transition="filter 0.15s ease",N.style.filter=q?Vn:"none")},qn=q=>{q.stopPropagation();let N=ir(J.value),ue=Ka(J.value),Z="";if(!N){let ct=Be().indexOf(b);Z=Xa(ct)}J.value=Z?`${Z}${ue}`:ue,Bt(),Lt();let he=Number.parseInt(ve.dataset.time??"0",10);dr(G(),T,he,J.value)};Ne.onclick=qn,Ne.append(rt),Ne.addEventListener("mouseenter",()=>{sn(!0)}),Ne.addEventListener("mouseleave",()=>{sn(!1)}),b.style.cssText="position:relative;padding-left:20px;",b.addEventListener("mouseenter",()=>{kt(),Bt(),rt.style.display="inline"}),b.addEventListener("mouseleave",()=>{sn(!1),rt.style.display="none"}),b.addEventListener("mouseleave",()=>{b.dataset.guid===Cn&&Xu(b)&&ns()}),J.value=u||"",J.style.cssText="width:100%;margin-top:5px;display:block;",J.type="text",J.setAttribute("inputmode","text"),J.autocapitalize="off",J.autocomplete="off",J.spellcheck=!1,requestAnimationFrame(kt);let So=!1;J.addEventListener("focusin",()=>{mo=!1,So=!1}),J.addEventListener("focusout",q=>{let N=q.relatedTarget,ue=Date.now()-qa<250,Z=!!N&&!!r&&r.contains(N);!ue&&!Z&&!So&&(mo=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(J.focus({preventScroll:!0}),mo=!1)},0))}),J.addEventListener("keydown",q=>{(q.key==="Escape"||q.key==="Esc")&&(q.preventDefault(),So=!0,J.blur())});let ko=q=>{let N=Nt.get(T);N&&clearTimeout(N.timeoutId);let ue=G(),Z=()=>{let he=Nt.get(T);he&&(clearTimeout(he.timeoutId),Nt.delete(T)),rs(ue,T,Number.parseInt(ve.dataset.time??"0",10),J.value)};Nt.set(T,{timeoutId:setTimeout(Z,q),flush:Z})};J.addEventListener("input",q=>{let N=q;N&&(N.isComposing||N.inputType==="insertCompositionText")||ko(500)}),J.addEventListener("compositionend",()=>{ko(50)});let Ft="#f4ba78",fr="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",hr="#c8452d",gr="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",Rn=(q,N=Ft,ue=fr)=>{q.style.color=N;let Z=q.querySelector("svg");Z&&(Z.style.transition="filter 0.15s ease"),q.addEventListener("mouseenter",()=>{Z&&(Z.style.filter=ue)}),q.addEventListener("mouseleave",()=>{Z&&(Z.style.filter="none")})};Fe(L,"circle-minus",18),L.classList.add("ytls-row-control"),L.dataset.increment="-1",L.style.cursor="pointer",L.style.margin="0px",Rn(L),Fe(F,"circle-plus",18),F.classList.add("ytls-row-control"),F.dataset.increment="1",F.style.cursor="pointer",F.style.margin="0px",Rn(F),Fe(D,"current-location",18),D.classList.add("ytls-row-control"),D.style.cursor="pointer",D.style.margin="0px",Re(D,"Set to current playback time"),Rn(D),D.onclick=()=>{let q=re(),N=q?Math.floor(q.getCurrentTime()):0;Number.isFinite(N)&&(l(`Timestamps changed: set to current playback time ${N}`),rn(),ar(ve,N),an(),Lt(),dr(G(),T,N,J.value),Cn=T)},rn(),ar(ve,A),ve.addEventListener("click",q=>{q.preventDefault(),q.stopPropagation();let N=Number(ve.dataset.time);if(!Number.isFinite(N))return;l(`Seeking to timestamp ${N}`),Ct=!0;let ue=re();ue&&ue.seekTo(N);let Z=ke();Z?.paused&&Z.play(),setTimeout(()=>{Ct=!1},500),s?.querySelectorAll(`.${Oe}`).forEach(he=>he.classList.remove(Oe)),b.classList.contains(Ce)||(b.classList.add(Oe),b.scrollIntoView({behavior:"smooth",block:"center"}))}),Fe(ie,"trash",16),ie.classList.add("ytls-row-control"),ie.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",Rn(ie,hr,gr),ie.onclick=()=>{let q=null,N=null,ue=null,Z=()=>{try{b.removeEventListener("click",N,!0)}catch{}try{document.removeEventListener("click",N,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",ue)}catch{}q&&(clearTimeout(q),q=null)};if(b.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let he=b.dataset.guid??"",je=Nt.get(he);je&&(clearTimeout(je.timeoutId),Nt.delete(he)),Z(),b.remove(),rn(),an(),Lt(),qe(),cr(),rd(G(),he),Cn=null,yo()}else{b.dataset.deleteConfirmed="true",b.classList.add(Ce),b.classList.remove(Oe);let he=()=>{b.dataset.deleteConfirmed="false",b.classList.remove(Ce);let je=re(),ct=je?je.getCurrentTime():0,Rt=Number.parseInt(b.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(ct)&&Number.isFinite(Rt)&&ct>=Rt&&b.classList.add(Oe),Z()};N=je=>{je.target!==ie&&he()},ue=()=>{b.dataset.deleteConfirmed==="true"&&he()},b.addEventListener("click",N,!0),document.addEventListener("click",N,!0),s&&s.addEventListener("mouseleave",ue),q=setTimeout(()=>{b.dataset.deleteConfirmed==="true"&&he(),Z()},5e3)}},lt.className="time-diff",lt.style.color="#888",lt.style.marginLeft="5px",ne.append(L,D,F,ie),C.append(ve,ne,lt),b.append(Ne,C,J);let yr=Number.parseInt(ve.dataset.time??"0",10);if(k){gi();let q=!1,N=Be();for(let ue=0;ue<N.length;ue++){let Z=N[ue],je=Z.querySelector("[data-time]")?.dataset.time;if(!je)continue;let ct=Number.parseInt(je,10);if(Number.isFinite(ct)&&yr<ct){s.insertBefore(b,Z),q=!0;break}}q||s.appendChild(b),b.scrollIntoView({behavior:"smooth",block:"center"}),rn(),an(),cr(),Lt(),qe(),d||(dr(G(),T,A,u),Cn=T,vi(b,!1))}else J.__ytls_li=b;return J}function an(){if(St())return;let i=$a(),u=Be();u.forEach((d,S)=>{let k=d.querySelector(".time-diff"),A=d.querySelector("[data-time]"),T=A?.dataset.time;if(A&&T){let lt=Number.parseInt(T,10);Number.isFinite(lt)&&(A.textContent=fn(lt,i))}if(!k)return;if(!T){k.textContent="";return}let b=Number.parseInt(T,10);if(!Number.isFinite(b)){k.textContent="";return}if(S===0){k.textContent="";return}let D=u[S-1].querySelector("[data-time]")?.dataset.time;if(!D){k.textContent="";return}let F=Number.parseInt(D,10);if(!Number.isFinite(F)){k.textContent="";return}let ne=b-F,ve=ne<0?"-":"";k.textContent=` ${ve}${fn(Math.abs(ne))}`})}function ns(){if(St())return;let i=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let T=document.activeElement,C=T.closest("li")?.dataset.guid;if(C){let L=T.selectionStart??T.value.length,D=T.selectionEnd??L,F=T.scrollLeft;i={guid:C,start:L,end:D,scroll:F}}}let u=Be();if(u.length===0)return;let d=u.map(T=>T.dataset.guid),S=u.map(T=>{let b=T.querySelector("[data-time]"),C=b?.dataset.time;if(!b||!C)return null;let L=Number.parseInt(C,10);if(!Number.isFinite(L))return null;let D=T.dataset.guid??"";return{time:L,guid:D,element:T}}).filter(T=>T!==null).sort((T,b)=>{let C=T.time-b.time;return C!==0?C:T.guid.localeCompare(b.guid)}),k=S.map(T=>T.guid),A=d.length!==k.length||d.some((T,b)=>T!==k[b]);if(s.replaceChildren(),S.forEach(T=>{s.appendChild(T.element)}),an(),Lt(),qe(),i){let b=Be().find(C=>C.dataset.guid===i.guid)?.querySelector("input");if(b)try{b.focus({preventScroll:!0})}catch{}}A&&(l("Timestamps changed: Timestamps sorted"),wi())}function cr(){if(!s||!r||!c||!h)return;let i=Be().length;He?.();let u=r.getBoundingClientRect(),d=c.getBoundingClientRect(),S=h.getBoundingClientRect(),k=Math.max(0,u.height-(d.height+S.height));i===0?(yo(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>k?"auto":"hidden"}function qe(){if(!s)return;let i=ke(),u=document.querySelector(".ytp-progress-bar"),d=re(),S=d?d.getVideoData():null,k=!!S&&!!S.isLive;if(!i||!u||!isFinite(i.duration)||k)return;as();let{items:A,starts:T}=or(),b=i.duration,C=document.createDocumentFragment();A.forEach((L,D)=>{let F=T[D];if(!Number.isFinite(F))return;L.dataset.guid||(L.dataset.guid=crypto.randomUUID());let ne=document.createElement("div");ne.className="ytls-marker",ne.style.left=F/b*100+"%",ne.dataset.time=String(F),C.appendChild(ne)}),u.appendChild(C),td(u)}function td(i){i.dataset.ytlsMarkerClicks||(i.dataset.ytlsMarkerClicks="1",i.addEventListener("click",u=>{let d=u.target?.closest?.(".ytls-marker");if(!d)return;let S=Number(d.dataset.time),k=re();k&&Number.isFinite(S)&&k.seekTo(S)}))}function wi(){me(hi().sort((i,u)=>i.start-u.start))}function os(i,u){!i||u.length===0||ce()||St()||(dd(i,u).then(()=>{l(`Saved ${u.length} timestamps for ${i} to IndexedDB`),s&&wo()}).catch(d=>{let S=`Failed to save timestamps: ${d.message}`;l(`Failed to save timestamps for ${i} to IndexedDB:`,d,"error"),Bn(S)}),In({type:"timestamps_updated",videoId:i,action:"saved"}))}function nd(i){!i||ce()||St()||(ss(i).then(()=>{s&&wo()}).catch(u=>{let d=`Failed to clear timestamps: ${u.message}`;l(`Failed to clear timestamps for ${i}:`,u,"error"),Bn(d)}),In({type:"timestamps_updated",videoId:i,action:"saved"}))}function ur(){for(let{flush:i}of[...Nt.values()])i()}function od(){Nt.forEach(({timeoutId:i})=>clearTimeout(i)),Nt.clear()}function dr(i,u,d,S){!i||ce()||St()||rs(i,u,d,S)}function rs(i,u,d,S){if(!i)return;let k={guid:u,start:d,comment:S};l(`Saving timestamp: guid=${u}, start=${d}, comment="${S}"`),pd(i,k).then(()=>{s&&wo()}).catch(A=>{let T=`Failed to save timestamp: ${A.message}`;l(`Failed to save timestamp ${u}:`,A,"error"),Bn(T)}),In({type:"timestamps_updated",videoId:i,action:"saved"})}function rd(i,u){!i||ce()||St()||(md(i,u).then(()=>{s&&wo()}).catch(d=>{let S=`Failed to delete timestamp: ${d.message}`;l(`Failed to delete timestamp ${u}:`,d,"error"),Bn(S)}),In({type:"timestamps_updated",videoId:i,action:"saved"}))}async function is(i){if(St()){alert("Cannot export timestamps while an error is being displayed.");return}let u=G();if(!u)return;l(`Exporting timestamps for video ID: ${u}`);let d=hi(),S=Pn();if(i==="json"){let k=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),A=URL.createObjectURL(k),T=document.createElement("a");T.href=A,T.download=`timestamps-${u}-${S}.json`,T.click(),URL.revokeObjectURL(A)}else if(i==="text"){let k=Ci(d,!0),A=new Blob([k],{type:"text/plain"}),T=URL.createObjectURL(A),b=document.createElement("a");b.href=T,b.download=`timestamps-${u}-${S}.txt`,b.click(),URL.revokeObjectURL(T)}}function Bn(i){if(!r||!s){l("Timekeeper error:",i,"error");return}jl(s,i),Ki(i),qe()}function wo(){s&&($l(s),Ki(null))}function St(){return!!(!s||Co(s)||ce()||nc()!==null)}function as(){document.querySelectorAll(".ytls-marker").forEach(i=>i.remove())}function Un(){if(!r||!document.body.contains(r))return;let i=r.getBoundingClientRect(),u=document.documentElement.clientWidth,d=document.documentElement.clientHeight,S=i.width,k=i.height;if(i.left<0&&(r.style.left="0",r.style.right="auto"),i.right>u){let A=Math.max(0,u-S);r.style.left=`${A}px`,r.style.right="auto"}if(i.top<0&&(r.style.top="0",r.style.bottom="auto"),i.bottom>d){let A=Math.max(0,d-k);r.style.top=`${A}px`,r.style.bottom="auto"}}function id(){if(Ko&&(document.removeEventListener("mousemove",Ko),Ko=null),Xo&&(document.removeEventListener("mouseup",Xo),Xo=null),co&&(document.removeEventListener("keydown",co),co=null),Jo&&(window.removeEventListener("resize",Jo),Jo=null),uo&&(document.removeEventListener("pointerdown",uo,!0),uo=null),po&&(document.removeEventListener("pointerup",po,!0),po=null),vt){try{vt.disconnect()}catch{}vt=null}if(wt){try{wt.disconnect()}catch{}wt=null}let i=ke();i&&(Qo&&(i.removeEventListener("timeupdate",Qo),Qo=null),Zo&&(i.removeEventListener("pause",Zo),Zo=null),er&&(i.removeEventListener("play",er),er=null),tr&&(i.removeEventListener("seeking",tr),tr=null),nr&&(i.removeEventListener("ratechange",nr),nr=null))}function ad(){as(),ur(),lo&&(clearTimeout(lo),lo=null),Ee&&(clearInterval(Ee),Ee=null),gt&&(clearTimeout(gt),gt=null),id(),yl();try{Mt.close()}catch{}if(H&&H.parentNode===document.body&&document.body.removeChild(H),H=null,Wo=null,Mn=!1,fe++,Ge={phase:"unloaded"},vt){try{vt.disconnect()}catch{}vt=null}if(wt){try{wt.disconnect()}catch{}wt=null}r&&r.parentNode&&r.remove();let i=document.getElementById("ytls-header-button");i&&i.parentNode&&i.remove(),nn=null,Yo=!1,R(null),go(),r=null,c=null,s=null,h=null,Ke=null,tn=null,He=null,m=null,v=null,y=null,P=null,ht=null}async function sd(){let i=bo();if(!i)return ht=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let u=await Wu();if(!ui(u)){let d=$u(u),S=d.length?` Missing methods: ${d.join(", ")}.`:"",k=u?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return ht=null,{ok:!1,message:`${k}${S} Try refreshing once playback is ready.`}}return ht=u,{ok:!0,player:u,videoId:i}}async function pr(){if(!r||!s)return;let i=fe,u=s.scrollTop,d=!0,S=()=>{if(!s||!d)return;let k=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(u,k)};try{let k=await sd();if(i!==fe)return;if(!k.ok){Bn(k.message),go(),qe();return}let{videoId:A}=k,T=[];try{let b=await fd(A);if(i!==fe)return;b?(T=b.map(C=>({...C,guid:C.guid||crypto.randomUUID()})),l(`Loaded ${T.length} timestamps from IndexedDB for ${A}`),wo()):l(`No timestamps found in IndexedDB for ${A}`)}catch(b){let C=`Failed to load timestamps: ${b.message}`;l(`Failed to load timestamps from IndexedDB for ${A}:`,b,"error"),Bn(C),qe();return}if(T.length>0){T.sort((L,D)=>L.start-D.start),go(),gi();let b=document.createDocumentFragment();T.forEach(L=>{let F=vo(L.start,L.comment,!0,L.guid,!1).__ytls_li;F&&b.appendChild(F)}),r&&r.classList.contains("ytls-zoom-in")&&Ie!=null?(l("Deferring timestamp DOM append until show animation completes"),Ln=b,zt||(zt=new Promise(L=>{ot=L})),await zt):s&&(s.appendChild(b),rn(),an(),Lt(),qe(),He&&requestAnimationFrame(He)),me(T),bt(!0),d=!1}else go(),Ja("No timestamps for this video"),qe(),me([]),He&&requestAnimationFrame(He)}catch(k){l("Unexpected error while loading timestamps:",k,"error"),Bn("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{zt&&await zt,requestAnimationFrame(S),He&&requestAnimationFrame(He),s&&!Co(s)&&yo()}}function bo(){let u=new URLSearchParams(location.search).get("v");if(u)return u;let d=document.querySelector('meta[itemprop="identifier"]');return d?.content?d.content:null}function ld(i=null,u=null){if(!m)return;let d=ke(),S=u||re();if(!d&&!S)return;let k=i!==null?i:S?S.getCurrentTime():0,A=Number.isFinite(k)?Math.max(0,Math.floor(k)):Math.max(0,on()),{isLive:T}=S?S.getVideoData()||{isLive:!1}:{isLive:!1},b=S?Qa(S,!!T):!1;m.textContent=Rr(A,rr(S,d)),m.style.color=b?"#ff4d4f":""}function cd(){let i=ke();if(!i)return;let u=NaN,d=null,S=()=>{if(!s)return;let L=re(),D=L?Math.floor(L.getCurrentTime()):0;if(!Number.isFinite(D))return;let F=or();if(D===u&&F===d)return;let ne=!!m&&!ce()&&!Ct;ne&&ld(D,L),bt(!1,D),ne&&!Mn&&(u=D,d=F)},k=L=>{try{let D=new URL(window.location.href);L!==null&&Number.isFinite(L)?D.searchParams.set("t",`${Math.floor(L)}s`):D.searchParams.delete("t"),window.history.replaceState(window.history.state,"",D.toString())}catch{}},A=()=>{let L=re(),D=L?L.getCurrentTime():NaN,F=Number.isFinite(D)?Math.max(0,Math.floor(D)):Math.max(0,on());if(Number.isFinite(F)){k(F);try{bt(!0)}catch(ne){l("Failed to highlight nearest timestamp on pause:",ne,"warn")}}},T=()=>{k(null);try{let L=re(),D=L?L.getCurrentTime():NaN,F=Number.isFinite(D)?Math.max(0,Math.floor(D)):Math.max(0,on());Number.isFinite(F)&&bt(!0)}catch(L){l("Failed to highlight nearest timestamp on play:",L,"warn")}},b=()=>{let L=ke();if(!L)return;let D=re(),F=D?Math.floor(D.getCurrentTime()):0;Number.isFinite(F)&&(L.paused&&k(F),bt(!0,F))},C=()=>{let L=i.playbackRate;M?M=!1:Vu(L),ci(L)};Qo=S,Zo=A,er=T,tr=b,nr=C,i.addEventListener("timeupdate",S),i.addEventListener("pause",A),i.addEventListener("play",T),i.addEventListener("seeking",b),i.addEventListener("ratechange",C)}let{saveToIndexedDB:ud,saveRowsToIndexedDB:dd,saveSingleTimestampToIndexedDB:pd,deleteSingleTimestampFromIndexedDB:md,loadFromIndexedDB:fd,removeFromIndexedDB:ss,saveGlobalSettings:mr,loadGlobalSettings:bi,buildExportPayload:hd,mergeBackupData:gd,exportAllTimestamps:yd,exportAllTimestampsCsv:vd}=Hr;function ls(){if(!r)return;let i=r.style.display!=="none";mr("uiVisible",i)}function Gt(i){let u=typeof i=="boolean"?i:!!r&&r.style.display!=="none",d=document.getElementById("ytls-header-button");d instanceof HTMLButtonElement&&d.setAttribute("aria-pressed",String(u)),nn&&!Yo&&nn.src!==Dr&&(nn.src=Dr)}function wd(){r&&bi("uiVisible").then(i=>{let u=Dt().safeParse(i),d=u.success?u.data:void 0;typeof d=="boolean"?(d?(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in")):r.style.display="none",Gt(d)):(!u.success&&i!==void 0&&l("UI visibility state failed validation, defaulting to visible",u.error.message,"warn"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),Gt(!0))}).catch(i=>{l("Failed to load UI visibility state:",i,"error"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),Gt(!0)})}function Si(i){if(!r){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(r)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(k=>{k!==r&&k.remove()}),document.body.appendChild(r));let u=document.querySelectorAll("#ytls-pane");u.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${u.length}), cleaning up`),u.forEach(k=>{k!==r&&k.remove()})),gt&&(clearTimeout(gt),gt=null);let d=r.style.display==="none";(typeof i=="boolean"?i:d)?(r.style.display="flex",r.classList.remove("ytls-fade-out"),r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),Gt(!0),ls(),_e(),Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{It(),He?.(),De(),Ye(!0);try{bt(!0)}catch(k){l("Failed to scroll to nearest timestamp after toggle:",k,"warn")}Ie=null},450)):(r.classList.remove("ytls-fade-in"),r.classList.remove("ytls-zoom-in"),r.classList.add("ytls-zoom-out"),Gt(!1),Ae())}function cs(i){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let u=!1,d=[],S=(k,A)=>{let T=k.querySelector("input");if(!T)return;T.value=A;let b=k.dataset.guid,C=Number.parseInt(k.querySelector("[data-time]")?.dataset.time??"",10);b&&Number.isFinite(C)&&d.push({guid:b,start:C,comment:A})};try{let k=JSON.parse(i),A=null;if(Array.isArray(k))A=k;else if(typeof k=="object"&&k!==null){let T=G();if(T){let b=`timekeeper-${T}`;k[b]&&Array.isArray(k[b].timestamps)&&(A=k[b].timestamps,l(`Found timestamps for current video (${T}) in export format`,"info"))}if(!A){let b=Object.keys(k).filter(C=>C.startsWith("ytls-"));if(b.length===1&&Array.isArray(k[b[0]].timestamps)){A=k[b[0]].timestamps;let C=k[b[0]].video_id;l(`Found timestamps for video ${C} in export format`,"info")}}}A&&Array.isArray(A)?A.every(b=>typeof b.start=="number"&&typeof b.comment=="string")?(A.forEach(b=>{if(b.guid){let C=Be().find(L=>L.dataset.guid===b.guid);C?S(C,b.comment):vo(b.start,b.comment,!1,b.guid)}else vo(b.start,b.comment,!1,crypto.randomUUID())}),u=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!u){let k=i.split(`
`).map(A=>A.trim()).filter(A=>A);if(k.length>0){let A=!1;k.forEach(T=>{let b=T.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(b){A=!0;let C=parseInt(b[1])||0,L=parseInt(b[2]),D=parseInt(b[3]),F=C*3600+L*60+D,ne=b[4]?b[4].trim():"",ve=null,lt=ne,J=ne.match(/<!--\s*guid:([^>]+?)\s*-->/);J&&(ve=J[1].trim(),lt=ne.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let ie;ve&&(ie=Be().find(Ne=>Ne.dataset.guid===ve)),!ie&&!ve&&(ie=Be().find(Ne=>{if(Ne.dataset.guid)return!1;let kt=Ne.querySelector("[data-time]")?.dataset.time;if(!kt)return!1;let Bt=Number.parseInt(kt,10);return Number.isFinite(Bt)&&Bt===F})),ie?S(ie,lt):vo(F,lt,!1,ve||crypto.randomUUID())}}),A&&(u=!0)}}u?(l("Timestamps changed: Imported timestamps from file/clipboard"),Lt(),wi(),os(G(),d),qe(),cr()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function bd(){if(fi){l("Pane initialization already in progress, skipping duplicate call");return}if(!(r&&document.body.contains(r))){fi=!0;try{let k=function(p=null,g=null){if(!m)return;let w=ke(),x=g||re();if(!w&&!x)return;let I=p!==null?p:x?x.getCurrentTime():0,W=Number.isFinite(I)?Math.max(0,Math.floor(I)):Math.max(0,on()),{isLive:_}=x?x.getVideoData()||{isLive:!1}:{isLive:!1},z=x?Qa(x,!!_):!1;m.textContent=Rr(W,rr(x,w)),m.style.color=z?"#ff4d4f":"",S(!!_);try{ci()}catch{}},A=function(){if(ce()||Ct)return;let p=re();if(!p)return;let g=p.getCurrentTime(),w=Number.isFinite(g)?Math.max(0,Math.floor(g)):Math.max(0,on());k(w,p),(s?Be():[]).length>0&&bt(!1,w)},ie=function(p,g,w,x){let I=document.createElement("button");return x?K(I,x,p):I.textContent=p,Re(I,g),I.classList.add("ytls-settings-modal-button"),I.onclick=w,I},Ne=function(p="general"){if(H&&H.parentNode===document.body){let ae=document.getElementById("ytls-save-modal"),pn=document.getElementById("ytls-load-modal"),qt=document.getElementById("ytls-delete-all-modal");ae&&document.body.contains(ae)&&document.body.removeChild(ae),pn&&document.body.contains(pn)&&document.body.removeChild(pn),qt&&document.body.contains(qt)&&document.body.removeChild(qt),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",rt)},300);return}H=document.createElement("div"),H.id="ytls-settings-modal",H.classList.remove("ytls-fade-out"),H.classList.add("ytls-fade-in");let g=document.createElement("div");g.className="ytls-modal-header";let w=document.createElement("div");w.id="ytls-settings-nav";let x=document.createElement("button");x.className="ytls-modal-close-button",Fe(x,"x",14),x.onclick=()=>{if(H&&H.parentNode===document.body){let ae=document.getElementById("ytls-save-modal"),pn=document.getElementById("ytls-load-modal"),qt=document.getElementById("ytls-delete-all-modal");ae&&document.body.contains(ae)&&document.body.removeChild(ae),pn&&document.body.contains(pn)&&document.body.removeChild(pn),qt&&document.body.contains(qt)&&document.body.removeChild(qt),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",rt)},300)}};let I=document.createElement("div");I.id="ytls-settings-content";let W=document.createElement("h3");W.className="ytls-section-heading",W.textContent="General",W.style.display="none";let _=document.createElement("div"),z=document.createElement("div");z.className="ytls-button-grid";let B=document.createElement("div");B.className="ytls-button-grid";function Q(ae){_.style.display=ae==="general"?"block":"none",z.style.display=ae==="google"?"block":"none",B.style.display=ae==="sync"?"block":"none",pe.classList.toggle("active",ae==="general"),Xe.classList.toggle("active",ae==="google"),xt.classList.toggle("active",ae==="sync"),W.textContent=ae==="general"?"General":ae==="google"?"Google":"Sync"}let pe=document.createElement("button");pe.appendChild(Dn("adjustments-horizontal",16));let Me=document.createElement("span");Me.className="ytls-tab-text",Me.textContent=" General",pe.appendChild(Me),Re(pe,"General settings"),pe.classList.add("ytls-settings-modal-button"),pe.onclick=()=>Q("general");let Xe=document.createElement("button");Xe.appendChild(Dn("cloud",16));let cn=document.createElement("span");cn.className="ytls-tab-text",cn.textContent=" Google",Xe.appendChild(cn),Re(Xe,"Google Drive backup settings"),Xe.classList.add("ytls-settings-modal-button"),Xe.onclick=async()=>{ft.isSignedIn&&await _u(),Q("google")};let xt=document.createElement("button");xt.appendChild(Dn("server",16));let un=document.createElement("span");un.className="ytls-tab-text",un.textContent=" Sync",xt.appendChild(un),Re(xt,"Live sync across devices"),xt.classList.add("ytls-settings-modal-button"),xt.onclick=()=>Q("sync"),w.appendChild(pe),w.appendChild(Xe),w.appendChild(xt),g.appendChild(w),g.appendChild(x),H.appendChild(g),_.className="ytls-button-grid",_.appendChild(ie("Save","Save As...",Bt.onclick,"device-floppy")),_.appendChild(ie("Load","Load",Vn.onclick,"folder-open")),_.appendChild(ie("Export All","Export All Data",sn.onclick,"file-export")),_.appendChild(ie("Import All","Import All Data",qn.onclick,"file-import")),_.appendChild(ie("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await vd()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let Ut=ie(ft.isSignedIn?"Sign Out":"Sign In",ft.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{ft.isSignedIn?await Pu():await Ru(),K(Ut,ft.isSignedIn?"logout":"login",ft.isSignedIn?"Sign Out":"Sign In"),Re(Ut,ft.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),xe()},ft.isSignedIn?"logout":"login"),xo=ie(jo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await Fu(),Tr(),xe()},"refresh"),Ss=ie(`Backup Interval: ${xn()}min`,"Set periodic backup interval (minutes)",async()=>{await Uu(),Tr(),xe()},"clock-plus"),Tr=()=>{K(Ut,ft.isSignedIn?"logout":"login",ft.isSignedIn?"Sign Out":"Sign In"),Re(Ut,ft.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),K(xo,"refresh",jo()?"Auto Backup: On":"Auto Backup: Off"),K(Ss,"clock-plus",`Backup Interval: ${xn()}min`),typeof xe=="function"&&xe()};z.appendChild(Ut),z.appendChild(xo),z.appendChild(Ss),z.appendChild(ie("Backup Now","Run a backup immediately",async()=>{await qo({silent:!1,skipBackoff:!0}),Tr()},"database"));let Vt=document.createElement("div");Vt.style.marginTop="15px",Vt.style.paddingTop="10px",Vt.style.borderTop="1px solid #555",Vt.style.fontSize="12px",Vt.style.color="#aaa";let Ar=document.createElement("div");Ar.style.marginBottom="8px",Ar.style.fontWeight="bold",Vt.appendChild(Ar),ku(Ar);let Ai=document.createElement("div");Ai.style.marginBottom="8px",bu(Ai),Vt.appendChild(Ai);let ks=document.createElement("div");Su(ks),Vt.appendChild(ks),z.appendChild(Vt),nt(),ao(),xe(),Tr();let Er=ie("Sign In","Sign in to Timekeeper Sync with Google",async()=>{We().isSignedIn?await lu():await au()},"login"),xs=ie("Sync Now","Sync with the server immediately",()=>ka(),"refresh");Wc(()=>{let ae=We().isSignedIn;K(Er,ae?"logout":"login",ae?"Sign Out":"Sign In"),Re(Er,ae?"Sign out of Timekeeper Sync":"Sign in to Timekeeper Sync with Google"),Er.disabled=!ae&&!Hn(),xs.disabled=!ae}),B.appendChild(Er),B.appendChild(xs);let dn=document.createElement("div");dn.style.marginTop="15px",dn.style.paddingTop="10px",dn.style.borderTop="1px solid #555",dn.style.fontSize="12px",dn.style.color="#aaa";let Ir=document.createElement("div");Ir.style.marginBottom="8px",Ir.style.fontWeight="bold",dn.appendChild(Ir),jc(Ir);let Ts=document.createElement("div");dn.appendChild(Ts),$c(Ts),B.appendChild(dn),No(),I.appendChild(W),I.appendChild(_),I.appendChild(z),I.appendChild(B),Q(p==="drive"?"google":p),H.appendChild(I),document.body.appendChild(H),requestAnimationFrame(()=>{let ae=H.getBoundingClientRect(),qt=(window.innerHeight-ae.height)/2;H.style.top=`${Math.max(20,qt)}px`,H.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",kt,!0),document.addEventListener("keydown",rt)},0)},rt=function(p){if(p.key==="Escape"&&H&&H.parentNode===document.body){let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");if(g||w||x)return;p.preventDefault(),g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),x&&document.body.contains(x)&&document.body.removeChild(x),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",rt)},300)}},kt=function(p){if(Wo&&Wo.contains(p.target))return;let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");g&&g.contains(p.target)||w&&w.contains(p.target)||x&&x.contains(p.target)||H&&H.contains(p.target)||(g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),x&&document.body.contains(x)&&document.body.removeChild(x),H&&H.parentNode===document.body&&(H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",rt)},300)))},So=function(){r&&(l("Loading window position from IndexedDB"),bi("windowPosition").then(p=>{let g=Is.safeParse(p);if(g.success){let x=g.data;r.style.left=`${x.x}px`,r.style.top=`${x.y}px`,r.style.right="auto",r.style.bottom="auto",typeof x.width=="number"&&x.width>0?r.style.width=`${x.width}px`:(r.style.width=`${di}px`,l(`No stored window width found, using default width ${di}px`)),typeof x.height=="number"&&x.height>0?r.style.height=`${x.height}px`:(r.style.height=`${pi}px`,l(`No stored window height found, using default height ${pi}px`));let I=oe();Se(I,x.x,x.y),l("Restored window position from IndexedDB:",V())}else g.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",g.error.message,"warn"),r.style.width=`${di}px`,r.style.height=`${pi}px`,R(null);Un();let w=oe();w&&(w.width||w.height)&&Se(w),He?.()}).catch(p=>{l("failed to load pane position from IndexedDB:",p,"warn"),Un();let g=oe();g&&(g.width||g.height)&&R({x:Math.max(0,Math.round(g.left)),y:0,width:Math.round(g.width),height:Math.round(g.height)}),He?.()}))},ko=function(){if(!r)return;let p=oe();if(!p)return;let g={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)},w=V();if(w&&w.x===g.x&&w.y===g.y&&w.width===g.width&&w.height===g.height){l("Skipping window position save; position and size unchanged");return}R({...g}),l(`Saving window position and size to IndexedDB: x=${g.x}, y=${g.y}, width=${g.width}, height=${g.height}`),mr("windowPosition",g),In({type:"window_position_updated",position:g,timestamp:Date.now()})},br=function(p,g){p.addEventListener("dblclick",w=>{w.preventDefault(),w.stopPropagation(),r&&(r.style.width="300px",r.style.height="300px",ko(),xr())}),p.addEventListener("mousedown",w=>{w.preventDefault(),w.stopPropagation(),Rt=!0,ln=g,fs=w.clientX,hs=w.clientY;let x=r.getBoundingClientRect();jn=x.width,$n=x.height,vr=x.left,wr=x.top,gs=document.documentElement.clientWidth,ys=document.documentElement.clientHeight,g==="top-left"||g==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},ws=function(){if(!s||!tn)return;let{scrollTop:p,scrollHeight:g,clientHeight:w}=s;if(g<=w)return;let x=Math.max(30,w/g*w),I=p/(g-w)*(w-x);tn.style.height=`${x}px`,tn.style.top=`${I}px`},bs=function(){Ke&&(Ti===null&&(Ti=requestAnimationFrame(()=>{Ti=null,ws()})),Ke.classList.add("ytls-scrollbar-visible"),yt&&clearTimeout(yt),yt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),yt=null},500))},xr=function(){if(r&&c&&h&&s){let p=r.getBoundingClientRect(),g=c.getBoundingClientRect(),w=h.getBoundingClientRect(),x=p.height-(g.height+w.height);s.style.maxHeight=x>0?x+"px":"0px",s.style.overflowY=x>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),!document.getElementById("ytls-styles")){let p=document.createElement("style");p.id="ytls-styles",p.textContent=ml,document.head.appendChild(p)}r=document.createElement("div"),c=document.createElement("div"),s=document.createElement("ul"),h=document.createElement("div"),m=document.createElement("span"),P=document.createElement("span"),U=document.createElement("span"),U.classList.add("ytls-backup-indicator"),U.style.cursor="pointer",U.style.backgroundColor="#666",U.onclick=p=>{p.stopPropagation(),Ne(ni()?"sync":"drive")},s.addEventListener("mouseenter",()=>{Mn=!0,mo=!1}),s.addEventListener("mouseleave",()=>{Mn=!1;try{Bi()}catch{}if(mo)return;bt(!1);let p=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(p=document.activeElement.closest("li")?.dataset.guid??null),ns(),p){let w=Be().find(x=>x.dataset.guid===p)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}}),r.id="ytls-pane",c.id="ytls-pane-header",c.addEventListener("dblclick",p=>{let g=p.target instanceof Element?p.target:null;if(g){let w=g;for(;w&&w!==r;){if(window.getComputedStyle(w).cursor==="pointer")return;w=w.parentElement}}p.preventDefault(),Si(!1)});let i=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{r.addEventListener(p,i)}),r.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),r.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0),P.textContent=`v${Cr}`,P.classList.add("ytls-version-display"),Li&&Re(P,`Built ${Li.toLocaleString()}`);let u=document.createElement("span");u.style.display="inline-flex",u.style.alignItems="center",u.style.gap="6px",u.appendChild(P),u.appendChild(U),v=document.createElement("span"),v.id="ytls-members-badge",v.appendChild(Dn("star",14)),Re(v,"Members-only stream"),ms(),m.id="ytls-current-time",m.textContent="\u2014",m.style.cursor="default",Re(m,()=>{let p=re(),{isLive:g}=p?p.getVideoData()||{isLive:!1}:{isLive:!1};return g?"Skip to live":""}),y=document.createElement("span"),y.id="ytls-playback-speed",y.textContent="1x",y.style.cursor="pointer",y.style.userSelect="none",Re(y,()=>`Current playback speed. Click to toggle between 1x and ${Ha(E)}x.`),y.onclick=()=>{Na()},y.addEventListener("mousedown",p=>{p.stopPropagation()}),y.addEventListener("click",p=>{p.stopPropagation()}),m.onclick=()=>{let p=re();if(!p)return;let{isLive:g}=p.getVideoData()||{isLive:!1};g&&(Ct=!0,p.seekToLiveHead(),setTimeout(()=>{Ct=!1},500))};let S=p=>{m.style.cursor=p?"pointer":"default"};A(),Ee&&clearInterval(Ee),Ee=setInterval(A,1e3),h.id="ytls-buttons";let T=(p,g)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),g&&g()},300)},b=p=>g=>{g.key==="Escape"&&(g.preventDefault(),g.stopPropagation(),p())},C=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},L=(p,g)=>w=>{p.contains(w.target)||g()},D=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(St())return;let p=typeof Gn<"u"?Gn:0,g=re(),w=g?Math.floor(g.getCurrentTime()+p):0;if(!Number.isFinite(w))return;let x=vo(w,"");x&&x.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>Ne()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(p){if(St()){Fe(this,"circle-x",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3);return}let g=hi();if(g.length===0){Fe(this,"circle-x",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3);return}let w=p.ctrlKey,x=Ci(g,w);navigator.clipboard.writeText(x).then(()=>{Fe(this,"circle-check",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3)}).catch(I=>{l("Failed to copy timestamps: ",I,"error"),Fe(this,"circle-x",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(St())return;if(Be().length===0){alert("No timestamps available to offset.");return}let g=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(g===null)return;let w=g.trim();if(w.length===0)return;let x=Number.parseInt(w,10);if(!Number.isFinite(x)){alert("Please enter a valid integer number of seconds.");return}x!==0&&es(x,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let p=bo();if(!p){alert("Unable to determine current video ID.");return}let g=document.createElement("div");g.id="ytls-delete-all-modal",g.classList.remove("ytls-fade-out"),g.classList.add("ytls-fade-in");let w=document.createElement("p");w.textContent="Hold the button to delete all timestamps for:",w.style.marginBottom="10px";let x=document.createElement("p");x.textContent=p,x.style.fontFamily="monospace",x.style.fontSize="12px",x.style.marginBottom="15px",x.style.color="#aaa";let I=document.createElement("button");I.classList.add("ytls-save-modal-button"),I.style.background="#d32f2f",I.style.position="relative",I.style.overflow="hidden";let W=null,_=0,z=null,B=document.createElement("div");B.style.position="absolute",B.style.left="0",B.style.top="0",B.style.height="100%",B.style.width="0%",B.style.background="#ff6b6b",B.style.transition="none",B.style.pointerEvents="none",I.appendChild(B);let Q=document.createElement("span");Q.textContent="Hold to Delete All",Q.style.position="relative",Q.style.zIndex="1",I.appendChild(Q);let pe=()=>{if(!_)return;let Ut=Date.now()-_,xo=Math.min(Ut/5e3*100,100);B.style.width=`${xo}%`,xo<100&&(z=requestAnimationFrame(pe))},Me=()=>{W&&(clearTimeout(W),W=null),z&&(cancelAnimationFrame(z),z=null),_=0,B.style.width="0%",Q.textContent="Hold to Delete All"};I.onmousedown=()=>{_=Date.now(),Q.textContent="Deleting...",z=requestAnimationFrame(pe),W=setTimeout(async()=>{Me(),g.classList.remove("ytls-fade-in"),g.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(g)&&document.body.removeChild(g);try{await ss(p),ki()}catch(Ut){l("Failed to delete all timestamps:",Ut,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},I.onmouseup=Me,I.onmouseleave=Me;let Xe=null,cn=null,xt=T(g,()=>{Me(),Xe&&document.removeEventListener("keydown",Xe),cn&&document.removeEventListener("click",cn,!0)});Xe=b(xt),cn=L(g,xt);let un=document.createElement("button");un.textContent="Cancel",un.classList.add("ytls-save-modal-cancel-button"),un.onclick=xt,g.appendChild(w),g.appendChild(x),g.appendChild(I),g.appendChild(un),document.body.appendChild(g),C(Xe),D(cn)}}].forEach(p=>{let g=document.createElement("button");Fe(g,p.icon,20),Re(g,p.title),g.classList.add("ytls-main-button"),p.id==="copy"?g.onclick=function(w){p.action.call(this,w)}:g.onclick=p.action,p.id==="settings"&&(Wo=g),h.appendChild(g)});let Bt=document.createElement("button");K(Bt,"device-floppy","Save"),Bt.classList.add("ytls-file-operation-button"),Bt.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Save as:";let w=null,x=null,I=T(p,()=>{w&&document.removeEventListener("keydown",w),x&&document.removeEventListener("click",x,!0)});w=b(I),x=L(p,I);let W=document.createElement("button");W.textContent="JSON",W.classList.add("ytls-save-modal-button"),W.onclick=()=>{w&&document.removeEventListener("keydown",w),x&&document.removeEventListener("click",x,!0),T(p,()=>is("json"))()};let _=document.createElement("button");_.textContent="Plain Text",_.classList.add("ytls-save-modal-button"),_.onclick=()=>{w&&document.removeEventListener("keydown",w),x&&document.removeEventListener("click",x,!0),T(p,()=>is("text"))()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=I,p.appendChild(g),p.appendChild(W),p.appendChild(_),p.appendChild(z),document.body.appendChild(p),C(w),D(x)};let Vn=document.createElement("button");K(Vn,"folder-open","Load"),Vn.classList.add("ytls-file-operation-button"),Vn.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Load from:";let w=null,x=null,I=T(p,()=>{w&&document.removeEventListener("keydown",w),x&&document.removeEventListener("click",x,!0)});w=b(I),x=L(p,I);let W=document.createElement("button");W.textContent="File",W.classList.add("ytls-save-modal-button"),W.onclick=()=>{let B=document.createElement("input");B.type="file",B.accept=".json,.txt",B.classList.add("ytls-hidden-file-input"),B.onchange=Q=>{let pe=Q.target.files?.[0];if(!pe)return;w&&document.removeEventListener("keydown",w),x&&document.removeEventListener("click",x,!0),I();let Me=new FileReader;Me.onload=()=>{let Xe=String(Me.result).trim();cs(Xe)},Me.readAsText(pe)},B.click()};let _=document.createElement("button");_.textContent="Clipboard",_.classList.add("ytls-save-modal-button"),_.onclick=async()=>{w&&document.removeEventListener("keydown",w),x&&document.removeEventListener("click",x,!0),T(p,async()=>{try{let B=await navigator.clipboard.readText();B?cs(B.trim()):alert("Clipboard is empty.")}catch(B){l("Failed to read from clipboard: ",B,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=I,p.appendChild(g),p.appendChild(W),p.appendChild(_),p.appendChild(z),document.body.appendChild(p),C(w),D(x)};let sn=document.createElement("button");K(sn,"file-export","Export"),sn.classList.add("ytls-file-operation-button"),sn.onclick=async()=>{try{await yd()}catch{alert("Failed to export data: Could not read from database.")}};let qn=document.createElement("button");K(qn,"file-import","Import"),qn.classList.add("ytls-file-operation-button"),qn.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=g=>{let w=g.target.files?.[0];if(!w)return;let x=new FileReader;x.onload=()=>{try{let I=JSON.parse(String(x.result)),W=[];for(let _ in I)if(Object.prototype.hasOwnProperty.call(I,_)&&_.startsWith("ytls-")){let z=_.substring(5),B=I[_];if(B&&typeof B.video_id=="string"&&Array.isArray(B.timestamps)){let Q=B.timestamps.map(Me=>({...Me,guid:Me.guid||crypto.randomUUID()})),pe=ud(z,Q).then(()=>l(`Imported ${z} to IndexedDB`)).catch(Me=>l(`Failed to import ${z} to IndexedDB:`,Me,"error"));W.push(pe)}else l(`Skipping key ${_} during import due to unexpected data format.`,"warn")}Promise.all(W).then(()=>{ki()}).catch(_=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",_,"error")})}catch(I){alert(`Failed to import data. Please ensure the file is in the correct format.
`+I.message),l("Import error:",I,"error")}},x.readAsText(w)},p.click()},s.onclick=p=>{ts(p)},s.ontouchstart=p=>{ts(p)},r.style.position="fixed",r.style.bottom="0",r.style.right="0",r.style.transition="none",So(),setTimeout(()=>Un(),10);let Ft=!1,fr=0,hr=0,gr=0,Rn=0,yr=0,q=0,N=null,ue=!1;r.addEventListener("mousedown",p=>{let g=p.target;if(!(g instanceof Element)||g instanceof HTMLInputElement||g instanceof HTMLTextAreaElement||g instanceof Element&&(g.closest("#ytls-playback-speed-group")||g.closest("#ytls-playback-speed"))||g!==c&&!c.contains(g)&&window.getComputedStyle(g).cursor==="pointer")return;Ft=!0,ue=!1;let w=r.getBoundingClientRect();fr=p.clientX-w.left,hr=p.clientY-w.top,gr=w.width,Rn=w.height,yr=document.documentElement.clientWidth,q=document.documentElement.clientHeight,r.style.transition="none"}),document.addEventListener("mousemove",Ko=p=>{if(!Ft)return;ue=!0;let g=p.clientX,w=p.clientY;N===null&&(N=requestAnimationFrame(()=>{if(N=null,!Ft)return;let x=Math.max(0,Math.min(g-fr,yr-gr)),I=Math.max(0,Math.min(w-hr,q-Rn));r.style.left=`${x}px`,r.style.top=`${I}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",Xo=()=>{if(!Ft)return;Ft=!1,N!==null&&(cancelAnimationFrame(N),N=null);let p=ue;setTimeout(()=>{ue=!1},50),Un(),setTimeout(()=>{p&&ko()},200)}),r.addEventListener("dragstart",p=>p.preventDefault());let Z=document.createElement("div"),he=document.createElement("div"),je=document.createElement("div"),ct=document.createElement("div");Z.id="ytls-resize-tl",he.id="ytls-resize-tr",je.id="ytls-resize-bl",ct.id="ytls-resize-br";let Rt=!1,fs=0,hs=0,jn=0,$n=0,vr=0,wr=0,gs=0,ys=0,Wn=null,ln=null;br(Z,"top-left"),br(he,"top-right"),br(je,"bottom-left"),br(ct,"bottom-right"),document.addEventListener("mousemove",p=>{if(!Rt||!r||!ln)return;let g=p.clientX,w=p.clientY;Wn===null&&(Wn=requestAnimationFrame(()=>{if(Wn=null,!Rt||!r||!ln)return;let x=g-fs,I=w-hs,W=gs,_=ys,z=jn,B=$n,Q=vr,pe=wr;ln==="bottom-right"?(z=Math.max(200,Math.min(800,jn+x)),B=Math.max(250,Math.min(_,$n+I))):ln==="top-left"?(z=Math.max(200,Math.min(800,jn-x)),Q=vr+x,B=Math.max(250,Math.min(_,$n-I)),pe=wr+I):ln==="top-right"?(z=Math.max(200,Math.min(800,jn+x)),B=Math.max(250,Math.min(_,$n-I)),pe=wr+I):ln==="bottom-left"&&(z=Math.max(200,Math.min(800,jn-x)),Q=vr+x,B=Math.max(250,Math.min(_,$n+I))),Q=Math.max(0,Math.min(Q,W-z)),pe=Math.max(0,Math.min(pe,_-B)),r.style.width=`${z}px`,r.style.height=`${B}px`,r.style.left=`${Q}px`,r.style.top=`${pe}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Rt&&(Rt=!1,Wn!==null&&(cancelAnimationFrame(Wn),Wn=null),ln=null,document.body.style.cursor="",Ye(!0))});let Sr=null;window.addEventListener("resize",Jo=()=>{Sr&&clearTimeout(Sr),Sr=setTimeout(()=>{Ye(!0),He?.(),Sr=null},200)}),c.appendChild(v),c.appendChild(m);let Yn=document.createElement("span");Yn.id="ytls-playback-speed-group",Yn.style.display="inline-flex",Yn.style.alignItems="center",Yn.style.marginLeft="4px",y&&Yn.appendChild(y),c.appendChild(Yn),c.appendChild(u);let xi=document.createElement("div");xi.id="ytls-list-wrapper",Ke=document.createElement("div"),Ke.className="ytls-scrollbar-track",tn=document.createElement("div"),tn.className="ytls-scrollbar-thumb",Ke.append(tn),xi.append(s,Ke);let kr=document.createElement("div");kr.id="ytls-content",kr.append(xi),kr.append(h),r.append(c,kr,Z,he,je,ct);let vs="";r.addEventListener("mousemove",p=>{if(Ft||Rt)return;let g=r.getBoundingClientRect(),w=20,x=p.clientX,I=p.clientY,W=x-g.left<=w,_=g.right-x<=w,z=I-g.top<=w,B=g.bottom-I<=w,Q="";z&&W||B&&_?Q="nwse-resize":(z&&_||B&&W)&&(Q="nesw-resize"),Q!==vs&&(vs=Q,document.body.style.cursor=Q)});let Ti=null;if(Ke.addEventListener("mouseenter",()=>{yt&&(clearTimeout(yt),yt=null),Ke.classList.add("ytls-scrollbar-visible")}),Ke.addEventListener("mouseleave",()=>{mi||(yt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),yt=null},500))}),tn.addEventListener("mousedown",p=>{if(!s)return;p.preventDefault(),p.stopPropagation(),mi=!0;let g=p.clientY,w=s.scrollTop,{scrollHeight:x,clientHeight:I}=s,W=Math.max(30,I/x*I),_=x-I,z=I-W;function B(pe){if(!s)return;let Me=pe.clientY-g;s.scrollTop=Math.max(0,Math.min(_,w+Me*(_/z))),ws()}function Q(){mi=!1,document.removeEventListener("mousemove",B),document.removeEventListener("mouseup",Q),Ke?.matches(":hover")||(yt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),yt=null},500))}document.addEventListener("mousemove",B),document.addEventListener("mouseup",Q)}),r.addEventListener("mouseenter",()=>{Mn=!0,bs()}),s.addEventListener("scroll",bs),r.addEventListener("mouseleave",()=>{!Rt&&!Ft&&(document.body.style.cursor=""),Mn=!1;try{Bi()}catch{}try{bt(!1)}catch{}}),He=xr,setTimeout(()=>{if(xr(),r&&c&&h&&s){let p=40,g=Be();if(g.length>0)p=g[0].offsetHeight;else{let w=document.createElement("li");w.style.visibility="hidden",w.style.position="absolute",w.textContent="00:00 Example",s.appendChild(w),p=w.offsetHeight,s.removeChild(w)}$(c.offsetHeight+h.offsetHeight+p),r.style.minHeight=O()+"px"}},0),wt){try{wt.disconnect()}catch{}wt=null}wt=new ResizeObserver(xr),wt.observe(r),uo||document.addEventListener("pointerdown",uo=()=>{qa=Date.now()},!0),po||document.addEventListener("pointerup",po=()=>{},!0)}finally{fi=!1}}}async function Sd(){if(!r)return;if(document.querySelectorAll("#ytls-pane").forEach(d=>{d!==r&&(l("Removing duplicate pane element from DOM"),d.remove())}),document.body.contains(r)){l("Pane already in DOM, skipping append");return}await wd(),Eu(hd),Iu(gd),Ma(mr),La(bi),Mu(pr),xu(U),Qc(()=>li()),await Ca(),await zu(),await Tn(),li();let u=document.querySelectorAll("#ytls-pane");if(u.length>0&&(l(`WARNING: Found ${u.length} existing pane(s) in DOM, removing all`),u.forEach(d=>d.remove())),document.body.contains(r)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(r),l("Pane successfully appended to DOM"),_e(),Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{It(),He?.(),De(),Ye(!0),Ie=null},450),vt){try{vt.disconnect()}catch{}vt=null}vt=new MutationObserver(()=>{let d=document.querySelectorAll("#ytls-pane");d.length>1&&(l(`CRITICAL: Multiple panes detected (${d.length}), removing duplicates`),d.forEach((S,k)=>{(k>0||r&&S!==r)&&S.remove()}))}),vt.observe(document.body,{childList:!0})}function us(i=0){if(document.getElementById("ytls-header-button")){Gt();return}let u=document.querySelector("#logo");if(!u||!u.parentElement){i<10&&setTimeout(()=>us(i+1),300);return}let d=document.createElement("button");d.id="ytls-header-button",d.type="button",d.className="ytls-header-button",Re(d,"Toggle Timekeeper UI"),d.setAttribute("aria-label","Toggle Timekeeper UI");let S=document.createElement("img");S.src=Dr,S.alt="",S.decoding="async",d.appendChild(S),nn=S,d.addEventListener("mouseenter",()=>{nn&&(Yo=!0,nn.src=fl)}),d.addEventListener("mouseleave",()=>{nn&&(Yo=!1,Gt())}),d.addEventListener("click",()=>{r&&!document.body.contains(r)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(r)),Si()}),u.insertAdjacentElement("afterend",d),Gt(),l("Timekeeper header button added next to YouTube logo")}function ds(){if(ye())return;de(!0);let i=history.pushState,u=history.replaceState;function d(){try{let S=new Event("locationchange");window.dispatchEvent(S)}catch{}}history.pushState=function(){let S=i.apply(this,arguments);return d(),S},history.replaceState=function(){let S=u.apply(this,arguments);return d(),S},window.addEventListener("popstate",d),window.addEventListener("locationchange",()=>{window.location.href!==ee&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function ki(){if(!a()){ad();return}se(window.location.href);let i=++fe;if(document.querySelectorAll("#ytls-pane").forEach((d,S)=>{(S>0||r&&d!==r)&&d.remove()}),await Zt(),await bd(),i!==fe)return;Ge={phase:"loading",videoId:bo()},f?.videoId!==G()&&ps(null);let u=document.title;if(l("Page Title:",u),l("Video ID:",G()),l("Current URL:",window.location.href),yi(!0),go(),qe(),await pr(),i===fe&&(qe(),yi(!1),l("Timestamps loaded and UI unlocked for video:",G()),await Sd(),i===fe)){try{bt(!0)}catch{}us(),cd()}}ds(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),ur(),a()&&r&&s&&(l("Locking UI and showing loading state for navigation"),yi(!0))}),co=i=>{if(!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&!i.shiftKey&&(i.key==="z"||i.key==="Z")){if(ju(i.target))return;Na()&&(i.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}i.ctrlKey&&i.altKey&&i.shiftKey&&(i.key==="T"||i.key==="t")&&(i.preventDefault(),Si(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",co),window.addEventListener("pagehide",ur),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&ur()});function ps(i){let u=typeof unsafeWindow<"u"?unsafeWindow:window,d=dc(i?.response??u.ytInitialData,i?.playerResponse??u.ytInitialPlayerResponse);f=d,ms(),d&&su(d)}function ms(){if(!v)return;let i=null;try{i=bo()}catch{}let u=!!f?.membersOnly&&f.videoId===i;v.style.display=u?"inline-flex":"none"}window.addEventListener("yt-navigate-finish",i=>{l("Navigation finished (yt-navigate-finish event fired)"),ps(i.detail?.response),window.location.href!==ee?ki():l("Navigation finished but URL already handled, skipping.")});function kd(i){let u=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(i);if(u&&(u[1]||u[2]||u[3]))return Number(u[1]||0)*3600+Number(u[2]||0)*60+Number(u[3]||0);let d=Number(i);return Number.isFinite(d)?d:null}document.addEventListener("click",i=>{if(i.button!==0||i.ctrlKey||i.metaKey||i.shiftKey||i.altKey)return;let u=i.target?.closest?.("ytd-comments a[href]");if(!u)return;let d=new URL(u.href,location.href),S=d.searchParams.get("t");if(d.pathname!=="/watch"||!S||d.searchParams.get("v")!==bo())return;let k=kd(S),A=re();k===null||!A||(i.preventDefault(),i.stopImmediatePropagation(),A.seekTo(k))},!0),qc(i=>{for(let u of i)In({type:"timestamps_updated",videoId:u,action:"synced"});G()&&i.includes(G())&&pr()}),hu(),ds(),l("Timekeeper initialized and waiting for navigation events")})();})();

