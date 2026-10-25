// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.3.4.690
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

(()=>{var vd=Object.defineProperty;var yd=(e,t)=>{for(var n in t)vd(e,n,{get:t[n],enumerable:!0})};var Io=class extends Error{},Ze=(e,t)=>{throw new Io(`${e||"value"}: expected ${t}`)};function Mt(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(o){if(o instanceof Io)return{success:!1,error:o};throw o}},array:()=>wd(t)};return t}var bs=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function j(){return Mt((e,t)=>typeof e=="string"?e:Ze(t,"string"))}function Rn(){return Mt((e,t)=>typeof e=="boolean"?e:Ze(t,"boolean"))}function Le(e={}){return Mt((t,n)=>typeof t!="number"||Number.isNaN(t)?Ze(n,"number"):(e.finite&&!Number.isFinite(t)&&Ze(n,"finite number"),e.int&&!Number.isInteger(t)&&Ze(n,"integer"),e.nonnegative&&t<0&&Ze(n,"number >= 0"),e.positive&&t<=0&&Ze(n,"number > 0"),e.min!==void 0&&t<e.min&&Ze(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&Ze(n,`number <= ${e.max}`),t))}function he(e){return Mt((t,n)=>t===void 0?void 0:e.run(t,n))}function dt(e){return Mt((t,n)=>t===null?null:e.run(t,n))}function Qe(e,t){return Mt((n,o)=>{try{return e.run(n,o)}catch(i){if(i instanceof Io)return t;throw i}})}function wd(e){return Mt((t,n)=>Array.isArray(t)?t.map((o,i)=>e.run(o,`${n}[${i}]`)):Ze(n,"array"))}function bd(e){return Mt((t,n)=>{if(!bs(t))return Ze(n,"object");let o={};for(let i of Object.keys(t))o[i]=e.run(t[i],n?`${n}.${i}`:i);return o})}function Ce(e){let t=Mt((n,o)=>{if(!bs(n))return Ze(o,"object");let i={};for(let r of Object.keys(e)){let c=e[r].run(n[r],o?`${o}.${r}`:r);c!==void 0&&(i[r]=c)}return i});return Object.assign(t,{extend:n=>Ce({...e,...n}),partial:()=>{let n={};for(let o of Object.keys(e))n[o]=he(e[o]);return Ce(n)}})}var Sd=Mt((e,t)=>typeof e=="string"&&e.length>0?e:Ze(t,"non-empty string")),Br=Ce({guid:Sd,start:Le({finite:!0,nonnegative:!0}),comment:j(),write_counter:he(Le({int:!0,positive:!0})),deleted_at:Qe(he(Le()),void 0)}),Lo=Br.array(),fn=Br.extend({video_id:j(),device_id:he(j())}),Ss=Ce({x:Le({finite:!0}),y:Le({finite:!0}),width:he(Le({finite:!0,positive:!0})),height:he(Le({finite:!0,positive:!0}))}),Rr=Ce({video_id:j(),timestamps:Lo}),xs=bd(Rr),ws=Ce({isSignedIn:Qe(Rn(),!1),accessToken:Qe(dt(j()),null),userName:Qe(dt(j()),null),email:Qe(dt(j()),null)}),ki=Qe(Mt((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return Ze(t,"valid JSON string for auth state")}return ws.run(n,t)}return ws.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),Kn={isSignedIn:!1,accessToken:null,accessTokenExpiresAt:null,refreshToken:null,userId:null,userName:null,email:null},Ai=Qe(Ce({isSignedIn:Qe(Rn(),!1),accessToken:Qe(dt(j()),null),accessTokenExpiresAt:Qe(dt(Le({finite:!0})),null),refreshToken:Qe(dt(j()),null),userId:Qe(dt(j()),null),userName:Qe(dt(j()),null),email:Qe(dt(j()),null)}),Kn),xd=Ce({autoBackupEnabled:Rn(),autoBackupIntervalMinutes:Le({int:!0,min:5,max:1440}),lastAutoBackupAt:he(dt(Le({int:!0,positive:!0})))}),Ei=xd;var Ts=`<svg
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
</svg>`;var ks=`<svg
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
</svg>`;var As=`<svg
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
</svg>`;var Es=`<svg
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
</svg>`;var Ms=`<svg
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
</svg>`;var Is=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
  <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-clock-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" />
  <path d="M16 19h6" />
  <path d="M19 16v6" />
  <path d="M12 7v5l3 3" />
</svg>`;var Rs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l2 2l4 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
  <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M14 4l0 4l-6 0l0 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-export"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-users"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var np={plus:Ts,"alarm-plus":ks,minus:As,"circle-plus":Es,"circle-minus":Ms,trash:Is,clipboard:Ls,settings:Cs,"clock-plus":Bs,"current-location":Rs,"player-record":Ps,"circle-x":Ds,"circle-check":Os,"adjustments-horizontal":_s,cloud:Hs,"device-floppy":Ns,"folder-open":zs,"file-export":Gs,"file-import":Fs,"file-spreadsheet":Us,login:Vs,logout:qs,refresh:js,users:$s,"alert-triangle":Ws,database:Ys,server:Ks,world:Xs,"plug-connected":Js,key:Qs,x:Zs,"indent-increase":el,"indent-decrease":tl},nl="http://www.w3.org/2000/svg",op=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,rp=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,ip=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,ol=new Map;function rl(e){let t={};for(let n of e.matchAll(ip))t[n[1]]=n[2];return t}function ap(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function sp(e){let t=ap(e).match(op);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,o]=t,i=document.createElementNS(nl,"svg"),r=rl(n);for(let[c,s]of Object.entries(r))c!=="class"&&i.setAttribute(c,s);for(let c of o.matchAll(rp)){let[,s,f]=c,m=document.createElementNS(nl,s),g=rl(f);for(let[h,w]of Object.entries(g))m.setAttribute(h,w);i.appendChild(m)}return i}function lp(e){let t=ol.get(e);if(t)return t;let n=sp(np[e]);return ol.set(e,n),n}function Xn(e,t=20){let n=lp(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function Ge(e,t,n){e.replaceChildren(Xn(t,n))}function $(e,t,n,o){e.replaceChildren(Xn(t,o),document.createTextNode("\xA0"+n))}var il="5.3.4";var Pr=il+"+3687c20";function l(e,...t){let n="debug",o=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=o.pop());let i=`[Timekeeper v${Pr}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${i} ${e}`,...o)}var Dr=e=>String(e).padStart(2,"0");function hn(e,t=e){let n=Math.floor(e/3600),o=Math.floor(e%3600/60),i=Dr(e%60);return t<3600?`${t>=600?Dr(o):o}:${i}`:`${t>=36e3?Dr(n):n}:${Dr(o)}:${i}`}function Or(e,t,n){let o=hn(e,Math.max(e,n));if(t.length===0)return o;let i=(Math.max(...t)-Math.min(...t))/60,r=(t.length/Math.max(1,i)).toFixed(2);return parseFloat(r)>0?`${o} (${r}/min)`:o}function Mi(e,t){let n=Math.max(0,...e.map(o=>o.start));return e.map(o=>{let i=hn(o.start,n),r=t?`${o.comment} <!-- guid:${o.guid} -->`.trimStart():o.comment;return`${i} ${r}`}).join(`
`)}function al(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Pn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var sl=`#ytls-pane {
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
`;var _r="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISKNpo4IcAAAL9UExURQAAAP/abf7Zaf/Yaf7Ya//XaP/WZv/VZf/VY//UYf/SYv/SYPvTZf/QZ//ObP7QYPzRYP7QXfjRZv7Kdv7PW/3OX//FgPnOXv7MVv/ChP3LWPzLWv7Bhf3EeP++jfXJZPXKW/rIWPvIVffIWv+4lvvGVfPIXvHJXvrFV/vFU/61nPvFUP6zn/i5ivrCU/2yl/6vovvBTP+tp/6upPjBUPbBVPPCVfG8ee3EWOnEXvm+UPu0fvq+SO/AV/m9TPq1cvm9Svq9Req/YPm1Zva7Tvi6Tfi6S/m3V/G8T+e/Vvi5R+20ePi3Sui3bvi3RPe2S/Snn/a1R/e0R/G3ReW6Uve0QOm5Seu3Tei4T/eyRvaySOC6VvaxPuyzSuO1V+W1T922Udi0UuCvS+WtRuqrPNSwU+SbldiqZ+epP9mpSNamT86qT96kP82pSuKhOsemStifPdedN8OiTMufQtGOidaaOMKhSNmYNMyVRb2cR9OUM+yFLuuEL+iDLcWSOM+NLbaVQ8iMMrqQPON+K72Be99/KMaGNK2QQcGFOsmEI9h7JdV7IaiLP9l2KMd+HLCFNKyAVdVyJc14Gr97LqKHPLx6Ms1zJ8Z4GMJ4Hrx6Icd2Fqpyb89tI5yAOJ17SaV7MsNtJrhwKqB5NJd8Npd6O7xsHsRlHpt1MaVyJbZnJJB1MbljII11NZtwI5ZmX7BhIYZvL41rKohpLoJqLZBkIKJaHp9eEKpVGXhjLXthL5hUHHxdIo9RFnRaJnBcJnFYKXNVJ3RSG2lWI4JIF25PJWlON2ZPJmpOGmFRIWVNHGhKImNKHXNCC1hIHVxAHlRDIWg5EVc9HU5AGGM1D0w8HlA8E1I5HEc6Fkw3EFcxEEo0GkQ2G0UxGT8tGDswEUwoCzsuFj8oJj0tDDsrGDksFzgpFkMkCjQnFjMpDTAjFS0lDC0iFDEiCDcdCSoiCikgFCYeByQcEzAYBSoaBSQcByIbBykUBBwVBRcSBBoLAhQNAw8JBAsKAwcGAgAAAN3XOCgAAAABdFJOUwBA5thmAAAGaElEQVR42u2WW2wUVRjH/2dmdy7doduy7S6XQltaIaCiYlJEhYpRo1aMJEbxQgQvRI0YNPESjVGjiS/qiz5ojEEfBKOEgNJQQKRcWy6FSmtoramlpVCWUsre5rI75ziXLXTd1t2++eAvk8zszPl+5/+d3cke/E9eUG3g1KnuYTqxIoygtWx5b+3qVatf/7pZQ54YHU17mzpUW5Jq/uiJCtlnE3ri81PZKQiy6T16IAqPVH7dnLLwroZ6nUOa0keenJ+HYOjbAyd0MxCUA5U1xzb2ArhiUN553pNTQPd8+asKQA755ye3XQYg6SDpcc++Ozm3oH7teQ4UIN6SQT09Kp3C88qbUk4BTm5sPa4RQCVgsCjSNYDYBu/y1bdzuQV08LdDejIZ3X2OgALFD+CPvmEYrHDBkqU1HPIgun7da+tWVImCIHi9XqFq5RtvrXvpmZfe+j5KkYUHWcQ3f9kBDRQu7MzuRcUFPh9ie3335yMY+v6rVgCUEZaWDP4SmFkIPh7TTU1CrjUI//DZ6XQ9dR8zcIQUlCjVYnhq3TI5h2Bow2e9DIwBjIJQBhAOjCMAJ1dVqoG6B6V/FWg/fmjVAxSM2uU8YFoK20AImXK9NnX5gxxGk/mJ7tpw/oaVL668SWB2FzxM0wTPKCxY+ZPLr5nd/1MjxbjQ5tUVrzZ09bQ3vDqZ9xAPcbGueK/y3KYTPV1H1z+6toWOm6Bn855VTy8qEv3VD6+SKUy4mDwFfezxGwu9hRV314V/Do8nMA7+sHTZDAMwUHTH9YyHRXGxbWCkujZEYSEuKGvelxpbQA9sIPNnUlDrSE5eAAt+5esfvGArcGtZEoxSIFTZ1dBCxxR0bj1ZNUWABQMEkQf4NXUlqaVrLAMt8Jj2vBSeKeaeHUNjCeL128qJRmEnSJmGblr1dw/0hDtuXsGDGHa5AYsBdfjQQZotoLt2+xTS3g+XoePEXLLw4gUGrbf2cR7tEYCCAv2dMeNwwymaJWja3l5skiOHNWeiRGMb56vx9jAAl6ILp6OtMQELqh/ewUvKtl19/3yZPvz2SDBmsvB36m0loOf3fqOzaTNQCiAFzKrdaNSLd8zg6aXWLVqZADSe+eq5jJ/yAriQC+TOciV2+kcDTHykelIhgAii2w+Dk+pC05LdJ+MCHGZuGVMA2qd5oRJQgEzni+DAulSOEUiMmCFLmWFwW1hzDCMUaLptJQyQjSgceEFnBETnrCuMEBy9iPfORBp2GZwjIIDqh4MCw663x5IYuZLgtCuHzdNNdh0IjYaTsCDOkZRkCbxpSoNR+wYHgBqU4+yRBr2n9v0raxD7uH5yKpVCt2FQWDAGZp+kgH/SsIFoXHPnt/EwLy/AMLkVr8y6Imj+OOIDPK1nMQJ1DBAFwdInqVufyfRP6ri0gK7/oowwmC3DGGVwFJl/TJm8/LaS/hbCrToBYcN6xltKyVUBwRi0tlPONfecs1WImhiNtVjEqXbP2RzvgpuA1p9wliOGNDlmHiHWFoGbIKy5XRuYGOFeV8DCEGEhC5gYHYPUEZg6bLgiHhNjwG3BPnQJgFKKCSGo0bSgxCAMgFhZNKF6GYYrQJkvBhEE4jUC8kcMQUgLpsyNwaF02gQMAUMuSrdQUa1qOkCQmpe/QQ7SuaWuAMEa6kQgMG+qkJEXQkjWZldwrgA3LPndgLMMiWtr/HmFKC4fDt0VHHmd6aZPL84RbIOGAv3Pc1HkoqhK6nrqxSDSCbi7Hk5aGYiuiWLCc+3i2TlSCP5ysfeBZSVu3w7dmzf1zSuFBkAEePRcvGAaGBMZQkkonlr0WA03SoDhxq37uIpSDbaCMGjxATUO0BRggocJWwt4Aij2KHpf5ZKH5nAYLQA9Ub+tv6BCIbZBBwOFCg9sItbJElk+HzwFnH5+XmXtYplDpgCJxo5zvX9FBMVXwIEwgJqwMWCjSdAcTUycNfXOW0q47F3a/iYieiODQ7HuqMmbsmLPByLoloyAOQFi0/xKYaFfmbVYRJYgsaMFRBJEyYwkEqoaMxXE7KbBCJO0y6UQZNnr9yrQotrU+yqzt7opA4wlVAJJUAKAMDeYTCZHOoj0x2Xwmg71EhgbZ6PZ2nla19P3hMDshZNwFb2tsz+pwSklk4JVNSLG4GLb/p31Djv3tyWQgdF59VnrWXPcrS5lFBYc4ZBFisHdOfP4b/E301Ck7f/BFa8AAAAASUVORK5CYII=",ll="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISFPUHnAAAAAMAUExURQAAAAAAAAcGARIMAhkNAR0OABgRAx4SAyMRASEVAyMVAigXAiEZBicYAiMbBiwZASsaAzAZACkbBC0cAi0dBjAdAjMeAykhCTIfAzQfAzAhBzUgAjghAy0kCzkiAzQkBzwkAz0kAzklBz8lA0AmBEEmAz4nBUEnBEQoBEUpAz0rCzgtD0ErCUcqA0EsB0crBEkrA0YsB0osAksuBU0uA08vBEQyD0E0E0kyDlExBVIxBFQzB1U0BUg3Ek83D0o6Flc5DFQ6DlQ8E1Y9E08/GFo/EF4+Dlw/EVVBF2U+CFtBFWg/CFxFGGVEEllHHGRGFmJHF2BKGpg7BGBOHmlMGWxNGG1NGZ1BCGhQHWZRIaJGDZ9ID3NWHnNYIXpXHW9aJJ5NE4VWGadOEntbIIBbH6RRFXlhKKhWFn9iJbBWGIJlKItjI39nKoZmJq9cGohsK5RqJqxjI7lgHYhuL41tK7ZjH5xxKpF0L7dqIJV0LsFqI5R4M7FxHbRwKpd7NJx7MqZ5LclvJcN1D5t/N8F1Jql9MKOBNK9+LsJ6G6GCOM54KreAKsl8GL9+Mr+AM7OEM8CBJ7iEMqqKPMyCH9h+Lq+KO82DLa+MO7GMO86GJMGLM8iJN7GQP9yFMeGFMMeOObeTPuWIMsOSOsiRN+SLNLqXQteRMb2YQdmTLtCWOsGaQ76bRe2ONeqRN9aYOcidRO+SONqZM8WeRdWbO9ScP/CUOcahRuGbNu+XOtuePMikSOGeNtSiQ92gOtiiRdqiQM6oSuGlPuelP9KrS9iqSemmPOepQe6oPdavTe6rQeqsROGvS+iuRvGtQfKtQNy0UOWyTfevQ/awQfOxRfexRPezQ/O0R/ezReq3UPe0RvG2SeO6Uvm1R/i2R++5TPi4SOe9VO28Uvm6TPO+Ufq9TezBV/q+T+/BVvHBVfrAUPDFWPvDUvzEU/fGV/PHWvXHWfzGVvXKW/3IWPrLWfrLXPjMXP3LWf7NWvzOXf/PXP/PXv3QXv7QXP7RXf/RXf/SYIi9XXwAAAABdFJOUwBA5thmAAAHkUlEQVR42sXWa3BU5R3H8e//eZ6zt+wlIQRqsBIC4w2QqKhAA52K1tYqqKjIiDpUHd60HaszHX3hdCo6tbXSVvFSBtsyjFqsoJVRvLWK4WLjpWhBAcWgYGgIm012N7vZ3XPpZmOCyW6ovupnzvNiz5z/7/znOf/ds/zfyXFOeowk5SelYrkeF+g74oA34kIRtyy6jEj99b9ct37d729ZOFZk8JyEv33Dbb9as+aBFbctmioio3cgfGfhOTUUZXr3bH31MB4I82bOmjIu7NeQtxMHWt7ahDdqwGm3zBatMNguibe2/S0P8y648LSwYkhm39PPfoBXMUD40XURpUMhH3Yu7WS7tr+x9+LFZ0QZLvnyui+aMIxgNdbahMZaQDDc6wvnZcn8ekaKXlpnbazcgbprQVDXxCjxcuntdadHhXK5N+5s9SruwcIl04OhGmvwus5qn49KkvevwKsUwNxZcyfXhz3D//DKjYc8UIzg0XLfxpYXt73Xdqgr7XIcwShFinJzJnTs2/LCxhe2HnYYlOvKeQz32cGKT0E4b3nz0XgPsWjduGM1hV00jrf4kvYtqUoBwvxl33MlBj5/OHCsIvTN1j2nnlLtH5qlznVPUOEpCNcvm57tczDBUvkx2QOff8KUSbEqjE12b+uODQWPkQGCumXppEQe7YuGLIbJd2eOtHXmIpGqMOm25173KoyycOKy66qTNiYcsQwjpLod92gy3pkD7JYX8BgZIJy+/CqVtrUOR32U8ZIJF+jJUbR11WdlAcX6n17iZj10JOKjgkImWYBMBhNy0xse7BtIkGH1dg5UTVSoyOs7tHdXR5rw+Gnjcusfdb3hgzRu+SV2QWGNWk+qdfXKlY+uXbtqxX1P9iy4FvlygFjLF/bf34qGhMo616547PPmm2699Yez339wzac/uBI5NkjCvMaPsoQj442mMndva/D65qZYFb2fbt3xamLRhfHXhvZAaI5lMviC0bqJjVMmRP1UkPyECTWGonz8o+2vsjh+f9xDvpjfn0QOHT2cTXa0dwVObpg+qzHK8WS7Ejufjl3294fxFP1OvPzUk5ovunrxtTfe+uPv8tLKX6zc2n38b3J4zpUdR+cvGNhEUUvP07ndzzyy6pHn/hW9+o475vesv/t3H7uMLhyh6Romnn+CKBBuvqKm46nf3veXzdv+8czqNYcW3PnzxXVv/uEgo5NIMDTn7NDMy9EI1yyt73jqz/vdgPGJLrS3cfYp585qijVEGJ02GTTBQIcgly5rSm9YnTBaa6u4jJy05KoQ2Ibj8eJJGzu9Wcm5S8/OH2iJC57SopSI6Xj+30DlejvZncy4gJRedNHzlXXFzGz+nR0K19BfrtGqbXM3FSV3Pr7ynhWrXmq3IRDWWlGnllzkudlP8qItRBRaDMIHB6jk44fueXD9sxseuffX2zIQtChSi8bkVbZHA0qDFrQS2vfYlHF3PrDxY1sE9j/5m2cz+MKiQJ2ZBTel0BqlBHyA5NvylDn4xx0oAYXQsm6bTdDv9te4aJD+BWhxUUCqvIPM5nfppwW0r+XxA/gCFqg+lNSMpxSslItWfEmudyip8+28IPgosV7ZksMn2MoB9Y1atBlsBAR8hqLet59c3TL4QPYNTKaLiFLQ1RrHqCJwdfjkEB4lPgQs6wQN9n/++tCmrY/9qWOgl4/SFpS2jSLP+vAgwsAnE5o7B0pDhFs6W9vkx9798CY1Y0b0n4+XEpwjMvxneP9BlKa4lKWl8VsxpQWUKIUYpjVi71y7u6F56tRZE97Z1EvZO8iQ6rW1AoNGE1185Glb9WeIgN1wca27+4lPG2bEIDaDHZPnGjz/8ATXb5mCAiWIgYlLL6tVRotPizDpqrPUkQ0D9RCb5t+0H8wYxBIYeqNFajAaDCgFNP3s1C17+3wCVdMXnRPqfXFfw1k1lIyZ+u7zdWP8U2sSlLilg9NOAAfMYGP1181678N2zz/ujNkTDB9uH3PWWAboE+PvnjnXTDnlTfAGW/C8qRNBg2JQVdO1t9979123XznRkNuVnBRkUGBy9LU4Y+fViBFXycDQTZsfG+jAKuAywFRXD960zuzpDAdr8QehirGTdr59kWne9XIO7fQfYC6cqXBdlDF5ypnZ+dZEuw064A8GIN132DE1N/B6wiOQsRy37vKb68Bxwdi4BcqEzmzIdSe6u0g7pHO4tVGg/qYpr+8/6lKITrvg+/WA64C0ORKuE0ZwjhTvBXm84lK2E5g8hqJc/L2dPU7VyefWhyhKddrIfk/839CMlO3opUQUSkt46K9rxsb4DP28zpSDySvtFsoDAhE37zD4oKzIYD0hhhQKDpjicgqBCm8OUnlc5SrQvuoAFWRz4Mr7+E2FTQAvney/A6JCUWMol+/sc3ANFCjkAlTowZ/LFdC6SltUbqBY7xQ7wG9iMUMlno0RKuvrzAIFo1wKZKoqB4jFaPKJPOCiguC6haTD15PvzjhQcETfmQbE1X7ha+jrSTngQpWqCpVmMpH0+Mq8VLzbwXUhUGMCkT4HBxJ21OIrse10Mo8LikAsZCSaS1LkpJxogK/A6Un1gSPGpao6LP8Fy8nbmCTqYikAAAAASUVORK5CYII=";var et=null,Jn=null,cp=250,_t=null,Qn=!1,tt=null,Co=[];function up(){return(!et||!document.body.contains(et))&&(et=document.createElement("div"),et.className="ytls-tooltip",et.style.pointerEvents="none",document.body.appendChild(et),window.addEventListener("scroll",cl,!0),window.addEventListener("resize",cl,!0)),et}function dp(e,t,n){let i=window.innerWidth,r=window.innerHeight,c=e.getBoundingClientRect(),s=c.width,f=c.height,m=t+10,g=n+10;m+s>i-10&&(m=t-s-10),g+f>r-10&&(g=n-f-10),m=Math.max(10,Math.min(m,i-s-10)),g=Math.max(10,Math.min(g,r-f-10)),e.style.left=`${m}px`,e.style.top=`${g}px`}function ul(e,t){let o=window.innerWidth,i=window.innerHeight,r=t.getBoundingClientRect(),c=e.getBoundingClientRect(),s=c.width,f=c.height,m=Math.round(r.left+r.width/2-s/2),g=Math.round(r.top-f-8);g<8&&(g=Math.round(r.bottom+8)),m<8&&(m=Math.round(r.left)),m+s>o-8&&(m=Math.round(r.right-s)),m=Math.max(8,Math.min(m,o-s-8)),g=Math.max(8,Math.min(g,i-f-8)),e.style.left=`${m}px`,e.style.top=`${g}px`}function cl(){if(!(!et||!_t)&&et.classList.contains("ytls-tooltip-visible"))try{ul(et,_t)}catch{}}function pp(e=50){tt&&(clearTimeout(tt),tt=null),!Qn&&(tt=setTimeout(()=>{Bo(),tt=null},e))}function mp(e,t,n,o){tt&&(clearTimeout(tt),tt=null),_t&&o&&_t!==o&&et?.classList.contains("ytls-tooltip-visible")&&et.classList.remove("ytls-tooltip-visible"),Jn&&clearTimeout(Jn),o&&(_t=o,Qn=!0),Jn=setTimeout(()=>{let i=up();i.textContent=e,i.classList.remove("ytls-tooltip-visible"),o?requestAnimationFrame(()=>{ul(i,o),requestAnimationFrame(()=>{i.classList.add("ytls-tooltip-visible")})}):(dp(i,t,n),requestAnimationFrame(()=>{i.classList.add("ytls-tooltip-visible")}))},cp)}function Bo(){Jn&&(clearTimeout(Jn),Jn=null),tt&&(clearTimeout(tt),tt=null),et&&et.classList.remove("ytls-tooltip-visible"),_t=null,Qn=!1}function Ii(){Bo()}function Fe(e,t){let n=0,o=0,i=m=>{n=m.clientX,o=m.clientY,tt&&(clearTimeout(tt),tt=null),Qn=!0,_t=e;let g=typeof t=="function"?t():t;g&&mp(g,n,o,e)},r=m=>{n=m.clientX,o=m.clientY},c=()=>{_t===e&&(Qn=!1,pp())};e.addEventListener("mouseenter",i),e.addEventListener("mousemove",r),e.addEventListener("mouseleave",c);let s=m=>{Qn=!1,_t===e&&Bo()};e.addEventListener("click",s,!0);let f=new MutationObserver(()=>{if(_t===e)try{let m=window.getComputedStyle(e);(m.display==="none"||m.visibility==="hidden"||m.opacity==="0")&&Bo()}catch{}});try{f.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}Co.push(f),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",i),e.removeEventListener("mousemove",r),e.removeEventListener("mouseleave",c),e.removeEventListener("click",s,!0);try{f.disconnect()}catch{}let m=Co.indexOf(f);m!==-1&&Co.splice(m,1),delete e.__tooltipObserver},e.__tooltipObserver=f}function dl(){for(let e of Co)try{e.disconnect()}catch{}Co.length=0,Bo()}var Gr={};yd(Gr,{addTimestamp:()=>wp,buildExportCsvPayload:()=>Ip,buildExportPayload:()=>Ep,deleteSingleTimestampFromIndexedDB:()=>kp,exportAllTimestamps:()=>Mp,exportAllTimestampsCsv:()=>Lp,getRecordsChangedSince:()=>Oi,loadFromIndexedDB:()=>Tp,loadGlobalSettings:()=>Kt,mergeBackupData:()=>Cp,mergeRemoteRecords:()=>_i,onTimestampsWritten:()=>Hi,removeFromIndexedDB:()=>Ap,saveGlobalSettings:()=>yn,saveRowsToIndexedDB:()=>bp,saveSingleTimestampToIndexedDB:()=>xp,saveToIndexedDB:()=>Sp});var fp="ytls-timestamps-db",hp=5,Zn="timestamps",pt="timestamps_v2",vn="settings",gn=null,eo=null;function Hr(){if(gn)try{return gn.objectStoreNames,Promise.resolve(gn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),gn=null}return eo||(eo=gp().then(e=>(gn=e,eo=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),gn=null},e.onversionchange=()=>{l("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),gn===e&&(gn=null)},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw eo=null,e}),eo)}function pl(e,t){let n=crypto.randomUUID(),o=0,i=e.openCursor();i.onsuccess=r=>{let c=r.target.result;c?(o++,c.update({...c.value,write_counter:o,device_id:n}),c.continue()):(t.put({key:"write_counter",value:o}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${o} records, device_id=${n}`))},i.onerror=()=>{l("Lamport migration: cursor error during backfill",i.error,"error")}}function gp(){return new Promise((e,t)=>{let n=indexedDB.open(fp,hp);n.onupgradeneeded=o=>{let i=o.target.result,r=o.oldVersion,c=o.target.transaction;if(r<1&&i.createObjectStore(Zn,{keyPath:"video_id"}),r<2&&!i.objectStoreNames.contains(vn)&&i.createObjectStore(vn,{keyPath:"key"}),r<3){if(i.objectStoreNames.contains(Zn)){l("Exporting backup before v2 migration...");let g=c.objectStore(Zn).getAll();g.onsuccess=()=>{let h=Rr.array().safeParse(g.result);if(h.success&&h.data.length>0)try{let w={},E=0;h.data.forEach(V=>{if(V.timestamps.length>0){let ee=Lo.parse(V.timestamps);w[`ytls-${V.video_id}`]={video_id:V.video_id,timestamps:[...ee].sort((H,W)=>H.start-W.start)},E+=ee.length}});let M=new Blob([JSON.stringify(w,null,2)],{type:"application/json"}),N=URL.createObjectURL(M),q=document.createElement("a");q.href=N,q.download=`timekeeper-data-${Pn()}.json`,q.click(),URL.revokeObjectURL(N),l(`Pre-migration backup exported: ${h.data.length} videos, ${E} timestamps`)}catch(w){l("Failed to export pre-migration backup:",w,"error")}else h.success||l("Skipping pre-migration backup: legacy data failed validation",h.error.message,"warn")}}let f=i.createObjectStore(pt,{keyPath:"guid"});if(f.createIndex("video_id","video_id",{unique:!1}),f.createIndex("video_start",["video_id","start"],{unique:!1}),i.objectStoreNames.contains(Zn)){let g=c.objectStore(Zn).getAll();g.onsuccess=()=>{let h=Rr.array().safeParse(g.result);if(h.success&&h.data.length>0){let w=0;h.data.forEach(E=>{E.timestamps.length>0&&E.timestamps.forEach(M=>{f.put({guid:M.guid,video_id:E.video_id,start:M.start,comment:M.comment}),w++})}),l(`Migrated ${w} timestamps from ${h.data.length} videos to v2 store`)}else h.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",h.error.message,"warn");r<4&&pl(c.objectStore(pt),c.objectStore(vn))},i.deleteObjectStore(Zn),l("Deleted old timestamps store after migration to v2")}}r===3&&pl(c.objectStore(pt),c.objectStore(vn));let s=c.objectStore(pt);s.indexNames.contains("write_counter")||s.createIndex("write_counter","write_counter",{unique:!1})},n.onsuccess=o=>{e(o.target.result)},n.onerror=o=>{let i=o.target.error;t(i??new Error("Failed to open IndexedDB"))},n.onblocked=()=>{l("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function Nr(e,t,n){return Hr().then(o=>new Promise((i,r)=>{let c;try{c=o.transaction(e,t)}catch(m){r(new Error(`Failed to create transaction for ${e}: ${m}`));return}let s=c.objectStore(e),f;try{f=n(s)}catch(m){r(new Error(`Failed to execute operation on ${e}: ${m}`));return}f&&(f.onsuccess=()=>i(f.result),f.onerror=()=>r(f.error??new Error(`IndexedDB ${t} operation failed`))),c.oncomplete=()=>{f||i(void 0)},c.onerror=()=>r(c.error??new Error("IndexedDB transaction failed")),c.onabort=()=>r(c.error??new Error("IndexedDB transaction aborted"))}))}var Li=new Set;function ml(e){return Li.add(e),()=>Li.delete(e)}function vp(){for(let e of Li)try{e()}catch(t){l("Timestamp write listener failed:",t,"error")}}function Ro(e,{silent:t=!1}={}){return Hr().then(n=>new Promise((o,i)=>{let r;try{r=n.transaction([pt,vn],"readwrite")}catch(c){i(new Error(`Failed to create transaction: ${c}`));return}r.oncomplete=()=>{o(),t||vp()},r.onerror=()=>i(new Error(`IndexedDB write failed: ${r.error?.message??"unknown"}`)),r.onabort=()=>i(new Error(`IndexedDB transaction aborted: ${r.error?.message??"unknown"}`));try{e(r.objectStore(pt),r.objectStore(vn))}catch(c){try{r.abort()}catch{}i(c instanceof Error?c:new Error(String(c)))}}))}function Po(e,t){let n=e.get("write_counter");n.onsuccess=()=>{let o=typeof n.result?.value=="number"?n.result.value:0;e.put({key:"write_counter",value:t(o)})}}function fl(e,t){let n=Lo.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return Ro((i,r)=>{let c=i.index("video_id").getAll(IDBKeyRange.only(e));c.onsuccess=()=>{let s=c.result??[],f=new Map(s.map(h=>[h.guid,h])),m=new Set(o.map(h=>h.guid)),g=Date.now();Po(r,h=>{let w=h;return s.forEach(E=>{!m.has(E.guid)&&!E.deleted_at&&(w++,i.put({...E,deleted_at:g,write_counter:w}))}),o.forEach(E=>{let M=f.get(E.guid);M&&!M.deleted_at&&!E.deleted_at&&M.start===E.start&&M.comment===E.comment||(w++,i.put({guid:E.guid,video_id:e,start:E.start,comment:E.comment,write_counter:w,deleted_at:E.deleted_at??M?.deleted_at??void 0}))}),w})}})}function Ci(e,t){let n=Lo.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return o.length===0?Promise.resolve():Ro((i,r)=>{Po(r,c=>{let s=c;return o.forEach(f=>{s++,i.put({guid:f.guid,video_id:e,start:f.start,comment:f.comment,write_counter:s,deleted_at:f.deleted_at})}),s})})}function hl(e,t){return Ci(e,[t])}function Bi(e,t={}){return e.length===0?Promise.resolve():Ro((n,o)=>{Po(o,i=>{let r=i;return e.forEach(c=>{c.write_counter!==void 0&&c.write_counter>r&&(r=c.write_counter)}),e.forEach(c=>{let s={guid:c.guid,video_id:c.video_id,start:c.start,comment:c.comment,deleted_at:c.deleted_at,write_counter:c.write_counter??++r};n.put(s)}),r+1})},t)}function gl(e){return l(`Soft-deleting timestamp ${e}`),Ro((t,n)=>{let o=t.get(e);o.onsuccess=()=>{let i=o.result;i&&Po(n,r=>(t.put({...i,deleted_at:Date.now(),write_counter:r+1}),r+1))}})}function vl(e){return Hr().then(t=>new Promise((n,o)=>{let i;try{i=t.transaction([pt],"readonly")}catch(c){let s=`Failed to create read transaction: ${c}`;l(s,c,"error"),o(new Error(s));return}i.onabort=()=>{let c=`Transaction aborted during load: ${i.error?.message??"unknown"}`;l(c,i.error,"error"),o(new Error(c))};let r=i.objectStore(pt).index("video_id").getAll(IDBKeyRange.only(e));r.onsuccess=()=>{try{let c=r.result.filter(m=>!m.deleted_at),s=[],f=0;for(let m of c){let g=Br.safeParse({guid:m.guid,start:m.start,comment:m.comment});g.success?s.push(g.data):f++}if(f>0&&l(`Skipped ${f} stored timestamps for ${e} that failed validation`,null,"warn"),s.length===0){f>0?o(new Error(`Stored timestamps for this video failed validation (${f} rows)`)):n(null);return}n(s.sort((m,g)=>m.start-g.start))}catch(c){o(c)}},r.onerror=()=>{let c=`Failed to load timestamps from IndexedDB: ${r.error?.message??"unknown error"}`;l(c,r.error,"error"),o(new Error(c))}}))}function yl(e){return Ro((t,n)=>{let o=t.index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{let i=o.result??[],r=Date.now();Po(n,c=>{let s=c;return i.forEach(f=>{f.deleted_at||(s++,t.put({...f,deleted_at:r,write_counter:s}))}),s})}})}function zr(){return Nr(pt,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function wl(e){return Nr(pt,"readonly",t=>t.index("write_counter").getAll(IDBKeyRange.lowerBound(e,!0))).then(t=>Array.isArray(t)?t:[])}function bl(e){return e.length===0?Promise.resolve([]):Hr().then(t=>new Promise((n,o)=>{let i=[],r=t.transaction(pt,"readonly"),c=r.objectStore(pt);for(let s of e)c.get(s).onsuccess=f=>{let m=f.target.result;m&&i.push(m)};r.oncomplete=()=>n(i),r.onerror=()=>o(r.error??new Error("IndexedDB read failed")),r.onabort=()=>o(r.error??new Error("IndexedDB read aborted"))}))}function Sl(e,t){return Nr(vn,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function xl(e){return Nr(vn,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function Ri({includeDeleted:e=!1}={}){let t={},n=await zr(),o=[],i=0;for(let h of n){let w=fn.safeParse(h);w.success?o.push(w.data):i++}i>0&&l(`Skipped ${i} timestamp rows that failed validation during export`,null,"warn");let c=[...e?o:o.filter(h=>!h.deleted_at)].sort((h,w)=>{let E=h.video_id.localeCompare(w.video_id);if(E!==0)return E;let M=h.start-w.start;return M!==0?M:h.guid.localeCompare(w.guid)}),s=new Map;for(let h of c)s.has(h.video_id)||s.set(h.video_id,[]),s.get(h.video_id).push({guid:h.guid,start:h.start,comment:h.comment,write_counter:h.write_counter,deleted_at:h.deleted_at});let f=Array.from(s.keys()).sort((h,w)=>h.localeCompare(w));for(let h of f){let w=s.get(h);t[`ytls-${h}`]={video_id:h,timestamps:w}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:c.length,invalidRows:i}}async function Al(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:o}=await Ri(),i=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(i),c=document.createElement("a");c.href=r,c.download=t,c.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function Pi(){let e=fn.array().safeParse((await zr()).filter(m=>!m.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let m=`Tag,Timestamp,URL
`,g=`timestamps-${Pn()}.csv`;return{csv:m,filename:g,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let m of t)n.has(m.video_id)||n.set(m.video_id,[]),n.get(m.video_id).push({start:m.start,comment:m.comment});let o=[];o.push("Tag,Timestamp,URL");let i=0,r=m=>`"${String(m).replace(/"/g,'""')}"`,c=Array.from(n.keys()).sort();for(let m of c){let g=n.get(m).sort((h,w)=>h.start-w.start);for(let h of g){let w=h.comment,E=hn(h.start,36e3),M=al(h.start,`https://www.youtube.com/watch?v=${m}`);o.push([r(w),r(E),r(M)].join(",")),i++}}let s=o.join(`
`),f=`timestamps-${Pn()}.csv`;return{csv:s,filename:f,totalVideos:n.size,totalTimestamps:i}}async function El(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:o}=await Pi(),i=new Blob([e],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(i),c=document.createElement("a");c.href=r,c.download=t,c.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function Di(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return hl(e,t)}async function Ml(e,t){if(!e)throw new Error("Video ID is required");return Ci(e,t)}async function Il(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return fl(e,t)}async function Ll(e){if(!e)throw new Error("GUID is required");return gl(e)}async function Cl(e){if(!e)throw new Error("Video ID is required");return yl(e)}async function Bl(e){if(!e)throw new Error("Video ID is required");return vl(e)}async function Rl(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=xs.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let o=await zr(),i=new Map;for(let f of o)i.set(f.guid,f);let r=0,c=0,s=[];for(let[,f]of Object.entries(n.data)){let{video_id:m,timestamps:g}=f,h=0;for(let w of g){let E=i.get(w.guid);Pl(E,m,w)&&(s.push({guid:w.guid,video_id:m,start:w.start,comment:w.comment,write_counter:w.write_counter,deleted_at:w.deleted_at}),i.set(w.guid,{...E??{},guid:w.guid,video_id:m,start:w.start,comment:w.comment,write_counter:w.write_counter,deleted_at:w.deleted_at}),h++,c++)}h>0&&r++}return await Bi(s),{mergedVideos:r,mergedTimestamps:c}}function kl(e,t){return JSON.stringify([e,t.start,t.comment,t.deleted_at??null])}function Pl(e,t,n){return e?e.write_counter===void 0||n.write_counter===void 0?!1:n.write_counter!==e.write_counter?n.write_counter>e.write_counter:kl(t,n)>kl(e.video_id,e):!0}async function Dl(e){let t=[];for(let n of await wl(e)){let o=fn.safeParse(n);if(!o.success||o.data.write_counter===void 0)continue;let{guid:i,video_id:r,start:c,comment:s,write_counter:f,deleted_at:m}=o.data;t.push({guid:i,video_id:r,start:c,comment:s,write_counter:f,...m!==void 0?{deleted_at:m}:{}})}return t}async function Ol(e){let t=new Map;for(let i of await bl(e.map(r=>r.guid)))t.set(i.guid,i);let n=[],o=new Set;for(let i of e)Pl(t.get(i.guid),i.video_id,i)&&(n.push(i),o.add(i.video_id));return await Bi(n,{silent:!0}),{mergedVideos:o.size,mergedTimestamps:n.length}}function _l(e,t){if(!e)throw new Error("Setting key is required");return Sl(e,t)}async function Hl(e){if(!e)throw new Error("Setting key is required");return xl(e)}function wp(e,t){return Di(e,t)}function bp(e,t){return Ml(e,t)}function Sp(e,t){return Il(e,t)}function xp(e,t){return Di(e,t)}function Tp(e){return Bl(e)}function kp(e,t){return Ll(t)}function Ap(e){return Cl(e)}function yn(e,t){return _l(e,t)}function Kt(e){return Hl(e)}function Ep(e){return Ri(e)}function Mp(){return Al()}function Ip(){return Pi()}function Lp(){return El()}function Cp(e){return Rl(e)}function Oi(e){return Dl(e)}function _i(e){return Ol(e)}function Hi(e){return ml(e)}function Fr(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function Ur(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Ni(e,t){if(!e)return;Ur(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function Nl(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function Do(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function zl(e,t){if(!e)return;Ur(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${Bp(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function Gl(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Bp(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function Fl(e,t){if(!e||t||Do(e))return;Array.from(e.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||Ni(e,"No timestamps for this video")}function Ul(e){if(!e)return[];let t=Fr(e),n=[];return t.forEach(o=>{let i=o.querySelector("[data-time]"),r=o.querySelector("input"),c=o.dataset.guid;if(!i||!r||!c)return;let s=i.dataset.time;if(!s)return;let f=Number.parseInt(s,10);Number.isFinite(f)&&n.push({guid:c,start:f,comment:r.value})}),n.sort((o,i)=>o.start-i.start)}function Vl(e){if(!e)return 0;let t=Fr(e),n=0;return t.forEach(o=>{let r=o.querySelector("[data-time]")?.dataset.time;if(r){let c=Number.parseInt(r,10);Number.isFinite(c)&&(n=Math.max(n,c))}}),n}var Pp={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},syncAuthState:Kn,autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},it=JSON.parse(JSON.stringify(Pp));function We(){return it}function Vr(e){it={...it,...e,auth:{...it.auth,...e.auth||{}},ui:{...it.ui,...e.ui||{}},timestamps:{...it.timestamps,...e.timestamps||{}}}}function wn(e,t){Vr({auth:{...it.auth,[e]:t}})}function qr(e,t){Vr({ui:{...it.ui,[e]:t}})}function Ht(){return it.auth.googleAuthState}function It(e){wn("googleAuthState",e)}function ql(){return it.auth.syncAuthState}function to(e){wn("syncAuthState",e)}function zi(e){wn("autoBackupEnabled",e)}function Gi(e){wn("autoBackupIntervalMinutes",e)}function Fi(e){wn("isAutoBackupRunning",e)}function jr(e){wn("autoBackupRetryAttempts",e)}function no(e){wn("autoBackupBackoffMs",e)}function Ui(e){wn("lastAutoBackupAt",e)}function jl(e){qr("minPaneHeight",e)}function $l(e){qr("panePosition",e)}function Wl(e){qr("lastHandledUrl",e)}function Yl(e){qr("urlChangeHandlersSetup",e)}function Kl(e){Vr({timestamps:{...it.timestamps,items:e}})}function Vi(e){Vr({timestamps:{...it.timestamps,dbError:e}})}function Xl(){return it.timestamps.dbError}var Dn=typeof unsafeWindow<"u"?unsafeWindow:window,nc=43200*14,Jl="html5_max_live_dvr_window_plus_margin_secs";function Xt(e){return e!=null&&typeof e=="object"}function Ql(e){let{streamingData:t,videoDetails:n,playerConfig:o,microformat:i}=e;if(!Xt(n)||!n.isLive)return;let r=n.isLiveDvrEnabled===!0;if(n.isLiveDvrEnabled=!0,!r&&Xt(o)){let c=o.mediaCommonConfig;if(Xt(c)){c.useServerDrivenAbr=!1;let s=c.serverPlaybackStartConfig;Xt(s)&&(s.enable=!1)}}if(Xt(t)){let c=t;if(Array.isArray(c.adaptiveFormats)&&Dp(i))for(let s of c.adaptiveFormats)s.maxDvrDurationSec=nc}}function Dp(e){if(!Xt(e))return!1;let t=e.playerMicroformatRenderer;if(!Xt(t))return!1;let n=t.liveBroadcastDetails;if(!Xt(n))return!1;let o=n.startTimestamp;return!o||typeof o!="string"?!1:(Date.now()-new Date(o).getTime())/1e3>43200}function ji(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(Ql(t),!0):t.playerResponse&&Xt(t.playerResponse)&&t.playerResponse.videoDetails?(Ql(t.playerResponse),!0):!1}function Op(){let e=Object.getOwnPropertyDescriptor(Dn,"ytInitialPlayerResponse"),t=e&&e.set,n=Dn.ytInitialPlayerResponse;if(!ji(n))try{Object.defineProperty(Dn,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(o){t&&t.call(this,o),n=o,ji(o)&&Object.defineProperty(Dn,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:o})}})}catch{}}var Zl=!1;function _p(){if(Zl)return;Zl=!0;let e=JSON.parse;JSON.parse=function(t,n){let o=e.call(this,t,n);try{ji(o)}catch{}return o}}function ec(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let o=n;for(let i in o){let r=o[i];if(r&&typeof r.serializedExperimentFlags=="string"){let c=r.serializedExperimentFlags,s=c.replace(new RegExp(`${Jl}=[\\d.]+`),`${Jl}=${nc}`);s!==c&&(r.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function tc(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let o=t.apply(this,n);try{ec(e)}catch{}return o});try{ec(e)}catch{}return e}function Hp(){let e={};Dn.ytcfg&&(e=tc(Dn.ytcfg));try{Object.defineProperty(Dn,"ytcfg",{configurable:!0,get(){return e},set(t){e=tc(t)}})}catch{}}function oc(){Op(),_p(),Hp(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var Np="BADGE_STYLE_TYPE_MEMBERS_ONLY";function Oo(e){return typeof e=="object"&&e!==null}function rc(e,t=0){return!Oo(e)||t>8?!1:e.style===Np?!0:Object.values(e).some(n=>rc(n,t+1))}function ic(e,t){let n=Oo(t)?t.videoDetails:void 0;if(!Oo(n)||typeof n.videoId!="string"||typeof n.channelId!="string")return null;let o=e?.contents?.twoColumnWatchNextResults?.results?.results?.contents;if(!Array.isArray(o))return null;let i=o.find(r=>Oo(r)&&Oo(r.videoPrimaryInfoRenderer));return i?{videoId:n.videoId,channelId:n.channelId,membersOnly:rc(i.videoPrimaryInfoRenderer)}:null}var $i="#author-name, #author-text";function ac(){return window.top!==window.self&&window.location.pathname.startsWith("/live_chat")}function Wi(e){let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=t.nextNode();n;n=t.nextNode()){let o=n.nodeValue??"";if(o.trim()){/^\s*@/.test(o)&&(n.nodeValue=o.replace(/^(\s*)@/,"$1"));return}}}function Yi(e){if(e.nodeType===Node.TEXT_NODE){let t=e.parentElement?.closest($i);t&&Wi(t);return}e instanceof Element&&(e.matches($i)&&Wi(e),e.querySelectorAll($i).forEach(Wi))}function sc(){let e=new MutationObserver(t=>{for(let n of t)n.type==="characterData"?Yi(n.target):n.addedNodes.forEach(Yi)});document.documentElement&&Yi(document.documentElement),e.observe(document,{childList:!0,subtree:!0,characterData:!0})}var ve=Uint8Array,at=Uint16Array,ia=Int32Array,$r=new ve([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Wr=new ve([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Zi=new ve([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),fc=function(e,t){for(var n=new at(31),o=0;o<31;++o)n[o]=t+=1<<e[o-1];for(var i=new ia(n[30]),o=1;o<30;++o)for(var r=n[o];r<n[o+1];++r)i[r]=r-n[o]<<5|o;return{b:n,r:i}},hc=fc($r,2),gc=hc.b,ea=hc.r;gc[28]=258,ea[258]=28;var vc=fc(Wr,0),zp=vc.b,lc=vc.r,ta=new at(32768);for(X=0;X<32768;++X)Jt=(X&43690)>>1|(X&21845)<<1,Jt=(Jt&52428)>>2|(Jt&13107)<<2,Jt=(Jt&61680)>>4|(Jt&3855)<<4,ta[X]=((Jt&65280)>>8|(Jt&255)<<8)>>1;var Jt,X,zt=(function(e,t,n){for(var o=e.length,i=0,r=new at(t);i<o;++i)e[i]&&++r[e[i]-1];var c=new at(t);for(i=1;i<t;++i)c[i]=c[i-1]+r[i-1]<<1;var s;if(n){s=new at(1<<t);var f=15-t;for(i=0;i<o;++i)if(e[i])for(var m=i<<4|e[i],g=t-e[i],h=c[e[i]-1]++<<g,w=h|(1<<g)-1;h<=w;++h)s[ta[h]>>f]=m}else for(s=new at(o),i=0;i<o;++i)e[i]&&(s[i]=ta[c[e[i]-1]++]>>15-e[i]);return s}),bn=new ve(288);for(X=0;X<144;++X)bn[X]=8;var X;for(X=144;X<256;++X)bn[X]=9;var X;for(X=256;X<280;++X)bn[X]=7;var X;for(X=280;X<288;++X)bn[X]=8;var X,No=new ve(32);for(X=0;X<32;++X)No[X]=5;var X,Gp=zt(bn,9,0),Fp=zt(bn,9,1),Up=zt(No,5,0),Vp=zt(No,5,1),Ki=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},Lt=function(e,t,n){var o=t/8|0;return(e[o]|e[o+1]<<8)>>(t&7)&n},Xi=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},aa=function(e){return(e+7)/8|0},zo=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new ve(e.subarray(t,n))};var qp=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Ue=function(e,t,n){var o=new Error(t||qp[e]);if(o.code=e,Error.captureStackTrace&&Error.captureStackTrace(o,Ue),!n)throw o;return o},jp=function(e,t,n,o){var i=e.length,r=o?o.length:0;if(!i||t.f&&!t.l)return n||new ve(0);var c=!n,s=c||t.i!=2,f=t.i;c&&(n=new ve(i*3));var m=function(tn){var kn=n.length;if(tn>kn){var Ct=new ve(Math.max(kn*2,tn));Ct.set(n),n=Ct}},g=t.f||0,h=t.p||0,w=t.b||0,E=t.l,M=t.d,N=t.m,q=t.n,V=i*8;do{if(!E){g=Lt(e,h,1);var ee=Lt(e,h+1,3);if(h+=3,ee)if(ee==1)E=Fp,M=Vp,N=9,q=5;else if(ee==2){var me=Lt(e,h,31)+257,te=Lt(e,h+10,15)+4,G=me+Lt(e,h+5,31)+1;h+=14;for(var P=new ve(G),ye=new ve(19),se=0;se<te;++se)ye[Zi[se]]=Lt(e,h+se*3,7);h+=te*3;for(var be=Ki(ye),yt=(1<<be)-1,Ve=zt(ye,be,1),se=0;se<G;){var Ne=Ve[Lt(e,h,yt)];h+=Ne&15;var H=Ne>>4;if(H<16)P[se++]=H;else{var Se=0,ce=0;for(H==16?(ce=3+Lt(e,h,3),h+=2,Se=P[se-1]):H==17?(ce=3+Lt(e,h,7),h+=3):H==18&&(ce=11+Lt(e,h,127),h+=7);ce--;)P[se++]=Se}}var Ee=P.subarray(0,me),ue=P.subarray(me);N=Ki(Ee),q=Ki(ue),E=zt(Ee,N,1),M=zt(ue,q,1)}else Ue(1);else{var H=aa(h)+4,W=e[H-4]|e[H-3]<<8,le=H+W;if(le>i){f&&Ue(0);break}s&&m(w+W),n.set(e.subarray(H,le),w),t.b=w+=W,t.p=h=le*8,t.f=g;continue}if(h>V){f&&Ue(0);break}}s&&m(w+131072);for(var Pe=(1<<N)-1,xe=(1<<q)-1,Te=h;;Te=h){var Se=E[Xi(e,h)&Pe],qe=Se>>4;if(h+=Se&15,h>V){f&&Ue(0);break}if(Se||Ue(2),qe<256)n[w++]=qe;else if(qe==256){Te=h,E=null;break}else{var ze=qe-254;if(qe>264){var se=qe-257,de=$r[se];ze=Lt(e,h,(1<<de)-1)+gc[se],h+=de}var st=M[Xi(e,h)&xe],Ft=st>>4;st||Ue(3),h+=st&15;var ue=zp[Ft];if(Ft>3){var de=Wr[Ft];ue+=Xi(e,h)&(1<<de)-1,h+=de}if(h>V){f&&Ue(0);break}s&&m(w+131072);var ke=w+ze;if(w<ue){var lt=r-ue,J=Math.min(ue,ke);for(lt+w<0&&Ue(3);w<J;++w)n[w]=o[lt+w]}for(;w<ke;++w)n[w]=n[w-ue]}}t.l=E,t.p=Te,t.b=w,t.f=g,E&&(g=1,t.m=N,t.d=M,t.n=q)}while(!g);return w!=n.length&&c?zo(n,0,w):n.subarray(0,w)},Qt=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8},_o=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8,e[o+2]|=n>>16},Ji=function(e,t){for(var n=[],o=0;o<e.length;++o)e[o]&&n.push({s:o,f:e[o]});var i=n.length,r=n.slice();if(!i)return{t:wc,l:0};if(i==1){var c=new ve(n[0].s+1);return c[n[0].s]=1,{t:c,l:1}}n.sort(function(le,me){return le.f-me.f}),n.push({s:-1,f:25001});var s=n[0],f=n[1],m=0,g=1,h=2;for(n[0]={s:-1,f:s.f+f.f,l:s,r:f};g!=i-1;)s=n[n[m].f<n[h].f?m++:h++],f=n[m!=g&&n[m].f<n[h].f?m++:h++],n[g++]={s:-1,f:s.f+f.f,l:s,r:f};for(var w=r[0].s,o=1;o<i;++o)r[o].s>w&&(w=r[o].s);var E=new at(w+1),M=na(n[g-1],E,0);if(M>t){var o=0,N=0,q=M-t,V=1<<q;for(r.sort(function(me,te){return E[te.s]-E[me.s]||me.f-te.f});o<i;++o){var ee=r[o].s;if(E[ee]>t)N+=V-(1<<M-E[ee]),E[ee]=t;else break}for(N>>=q;N>0;){var H=r[o].s;E[H]<t?N-=1<<t-E[H]++-1:++o}for(;o>=0&&N;--o){var W=r[o].s;E[W]==t&&(--E[W],++N)}M=t}return{t:new ve(E),l:M}},na=function(e,t,n){return e.s==-1?Math.max(na(e.l,t,n+1),na(e.r,t,n+1)):t[e.s]=n},cc=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new at(++t),o=0,i=e[0],r=1,c=function(f){n[o++]=f},s=1;s<=t;++s)if(e[s]==i&&s!=t)++r;else{if(!i&&r>2){for(;r>138;r-=138)c(32754);r>2&&(c(r>10?r-11<<5|28690:r-3<<5|12305),r=0)}else if(r>3){for(c(i),--r;r>6;r-=6)c(8304);r>2&&(c(r-3<<5|8208),r=0)}for(;r--;)c(i);r=1,i=e[s]}return{c:n.subarray(0,o),n:t}},Ho=function(e,t){for(var n=0,o=0;o<t.length;++o)n+=e[o]*t[o];return n},yc=function(e,t,n){var o=n.length,i=aa(t+2);e[i]=o&255,e[i+1]=o>>8,e[i+2]=e[i]^255,e[i+3]=e[i+1]^255;for(var r=0;r<o;++r)e[i+r+4]=n[r];return(i+4+o)*8},uc=function(e,t,n,o,i,r,c,s,f,m,g){Qt(t,g++,n),++i[256];for(var h=Ji(i,15),w=h.t,E=h.l,M=Ji(r,15),N=M.t,q=M.l,V=cc(w),ee=V.c,H=V.n,W=cc(N),le=W.c,me=W.n,te=new at(19),G=0;G<ee.length;++G)++te[ee[G]&31];for(var G=0;G<le.length;++G)++te[le[G]&31];for(var P=Ji(te,7),ye=P.t,se=P.l,be=19;be>4&&!ye[Zi[be-1]];--be);var yt=m+5<<3,Ve=Ho(i,bn)+Ho(r,No)+c,Ne=Ho(i,w)+Ho(r,N)+c+14+3*be+Ho(te,ye)+2*te[16]+3*te[17]+7*te[18];if(f>=0&&yt<=Ve&&yt<=Ne)return yc(t,g,e.subarray(f,f+m));var Se,ce,Ee,ue;if(Qt(t,g,1+(Ne<Ve)),g+=2,Ne<Ve){Se=zt(w,E,0),ce=w,Ee=zt(N,q,0),ue=N;var Pe=zt(ye,se,0);Qt(t,g,H-257),Qt(t,g+5,me-1),Qt(t,g+10,be-4),g+=14;for(var G=0;G<be;++G)Qt(t,g+3*G,ye[Zi[G]]);g+=3*be;for(var xe=[ee,le],Te=0;Te<2;++Te)for(var qe=xe[Te],G=0;G<qe.length;++G){var ze=qe[G]&31;Qt(t,g,Pe[ze]),g+=ye[ze],ze>15&&(Qt(t,g,qe[G]>>5&127),g+=qe[G]>>12)}}else Se=Gp,ce=bn,Ee=Up,ue=No;for(var G=0;G<s;++G){var de=o[G];if(de>255){var ze=de>>18&31;_o(t,g,Se[ze+257]),g+=ce[ze+257],ze>7&&(Qt(t,g,de>>23&31),g+=$r[ze]);var st=de&31;_o(t,g,Ee[st]),g+=ue[st],st>3&&(_o(t,g,de>>5&8191),g+=Wr[st])}else _o(t,g,Se[de]),g+=ce[de]}return _o(t,g,Se[256]),g+ce[256]},$p=new ia([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),wc=new ve(0),Wp=function(e,t,n,o,i,r){var c=r.z||e.length,s=new ve(o+c+5*(1+Math.ceil(c/7e3))+i),f=s.subarray(o,s.length-i),m=r.l,g=(r.r||0)&7;if(t){g&&(f[0]=r.r>>3);for(var h=$p[t-1],w=h>>13,E=h&8191,M=(1<<n)-1,N=r.p||new at(32768),q=r.h||new at(M+1),V=Math.ceil(n/3),ee=2*V,H=function(po){return(e[po]^e[po+1]<<V^e[po+2]<<ee)&M},W=new ia(25e3),le=new at(288),me=new at(32),te=0,G=0,P=r.i||0,ye=0,se=r.w||0,be=0;P+2<c;++P){var yt=H(P),Ve=P&32767,Ne=q[yt];if(N[Ve]=Ne,q[yt]=Ve,se<=P){var Se=c-P;if((te>7e3||ye>24576)&&(Se>423||!m)){g=uc(e,f,0,W,le,me,G,ye,be,P-be,g),ye=te=G=0,be=P;for(var ce=0;ce<286;++ce)le[ce]=0;for(var ce=0;ce<30;++ce)me[ce]=0}var Ee=2,ue=0,Pe=E,xe=Ve-Ne&32767;if(Se>2&&yt==H(P-xe))for(var Te=Math.min(w,Se)-1,qe=Math.min(32767,P),ze=Math.min(258,Se);xe<=qe&&--Pe&&Ve!=Ne;){if(e[P+Ee]==e[P+Ee-xe]){for(var de=0;de<ze&&e[P+de]==e[P+de-xe];++de);if(de>Ee){if(Ee=de,ue=xe,de>Te)break;for(var st=Math.min(xe,de-2),Ft=0,ce=0;ce<st;++ce){var ke=P-xe+ce&32767,lt=N[ke],J=ke-lt&32767;J>Ft&&(Ft=J,Ne=ke)}}}Ve=Ne,Ne=N[Ve],xe+=Ve-Ne&32767}if(ue){W[ye++]=268435456|ea[Ee]<<18|lc[ue];var tn=ea[Ee]&31,kn=lc[ue]&31;G+=$r[tn]+Wr[kn],++le[257+tn],++me[kn],se=P+Ee,++te}else W[ye++]=e[P],++le[e[P]]}}for(P=Math.max(P,se);P<c;++P)W[ye++]=e[P],++le[e[P]];g=uc(e,f,m,W,le,me,G,ye,be,P-be,g),m||(r.r=g&7|f[g/8|0]<<3,g-=7,r.h=q,r.p=N,r.i=P,r.w=se)}else{for(var P=r.w||0;P<c+m;P+=65535){var Ct=P+65535;Ct>=c&&(f[g/8|0]=m,Ct=c),g=yc(f,g+1,e.subarray(P,Ct))}r.i=c}return zo(s,0,o+aa(g)+i)},Yp=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,o=9;--o;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),Kp=function(){var e=-1;return{p:function(t){for(var n=e,o=0;o<t.length;++o)n=Yp[n&255^t[o]]^n>>>8;e=n},d:function(){return~e}}};var Xp=function(e,t,n,o,i){if(!i&&(i={l:1},t.dictionary)){var r=t.dictionary.subarray(-32768),c=new ve(r.length+e.length);c.set(r),c.set(e,r.length),e=c,i.w=r.length}return Wp(e,t.level==null?6:t.level,t.mem==null?i.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,o,i)},bc=function(e,t){var n={};for(var o in e)n[o]=e[o];for(var o in t)n[o]=t[o];return n};var Nt=function(e,t){return e[t]|e[t+1]<<8},mt=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},Qi=function(e,t){return mt(e,t)+mt(e,t+4)*4294967296},_e=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function Jp(e,t){return Xp(e,t||{},0,0)}function Qp(e,t){return jp(e,{i:2},t&&t.out,t&&t.dictionary)}var Sc=function(e,t,n,o){for(var i in e){var r=e[i],c=t+i,s=o;Array.isArray(r)&&(s=bc(o,r[1]),r=r[0]),ArrayBuffer.isView(r)?n[c]=[r,s]:(n[c+="/"]=[new ve(0),s],Sc(r,c,n,o))}},dc=typeof TextEncoder<"u"&&new TextEncoder,oa=typeof TextDecoder<"u"&&new TextDecoder,Zp=0;try{oa.decode(wc,{stream:!0}),Zp=1}catch{}var em=function(e){for(var t="",n=0;;){var o=e[n++],i=(o>127)+(o>223)+(o>239);if(n+i>e.length)return{s:t,r:zo(e,n-1)};i?i==3?(o=((o&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|o>>10,56320|o&1023)):i&1?t+=String.fromCharCode((o&31)<<6|e[n++]&63):t+=String.fromCharCode((o&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(o)}};function pc(e,t){if(t){for(var n=new ve(e.length),o=0;o<e.length;++o)n[o]=e.charCodeAt(o);return n}if(dc)return dc.encode(e);for(var i=e.length,r=new ve(e.length+(e.length>>1)),c=0,s=function(g){r[c++]=g},o=0;o<i;++o){if(c+5>r.length){var f=new ve(c+8+(i-o<<1));f.set(r),r=f}var m=e.charCodeAt(o);m<128||t?s(m):m<2048?(s(192|m>>6),s(128|m&63)):m>55295&&m<57344?(m=65536+(m&1047552)|e.charCodeAt(++o)&1023,s(240|m>>18),s(128|m>>12&63),s(128|m>>6&63),s(128|m&63)):(s(224|m>>12),s(128|m>>6&63),s(128|m&63))}return zo(r,0,c)}function tm(e,t){if(t){for(var n="",o=0;o<e.length;o+=16384)n+=String.fromCharCode.apply(null,e.subarray(o,o+16384));return n}else{if(oa)return oa.decode(e);var i=em(e),r=i.s,n=i.r;return n.length&&Ue(8),r}}var nm=function(e,t){return t+30+Nt(e,t+26)+Nt(e,t+28)},om=function(e,t,n){var o=Nt(e,t+28),i=Nt(e,t+30),r=tm(e.subarray(t+46,t+46+o),!(Nt(e,t+8)&2048)),c=t+46+o,s=rm(e,c,i,n,mt(e,t+20),mt(e,t+24),mt(e,t+42)),f=s[0],m=s[1],g=s[2];return[Nt(e,t+10),f,m,r,c+i+Nt(e,t+32),g]},rm=function(e,t,n,o,i,r,c){var s=i==4294967295,f=r==4294967295,m=c==4294967295,g=t+n,h=s+f+m;if(o&&h){for(;t+4<g;t+=4+Nt(e,t+2))if(Nt(e,t)==1)return[s?Qi(e,t+4+8*f):i,f?Qi(e,t+4):r,m?Qi(e,t+4+8*(f+s)):c,1];o<2&&Ue(13)}return[i,r,c,0]},ra=function(e){var t=0;if(e)for(var n in e){var o=e[n].length;o>65535&&Ue(9),t+=o+4}return t},mc=function(e,t,n,o,i,r,c,s){var f=o.length,m=n.extra,g=s&&s.length,h=ra(m);_e(e,t,c!=null?33639248:67324752),t+=4,c!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(r<0&&8),e[t++]=i&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var w=new Date(n.mtime==null?Date.now():n.mtime),E=w.getFullYear()-1980;if((E<0||E>119)&&Ue(10),_e(e,t,E<<25|w.getMonth()+1<<21|w.getDate()<<16|w.getHours()<<11|w.getMinutes()<<5|w.getSeconds()>>1),t+=4,r!=-1&&(_e(e,t,n.crc),_e(e,t+4,r<0?-r-2:r),_e(e,t+8,n.size)),_e(e,t+12,f),_e(e,t+14,h),t+=16,c!=null&&(_e(e,t,g),_e(e,t+6,n.attrs),_e(e,t+10,c),t+=14),e.set(o,t),t+=f,h)for(var M in m){var N=m[M],q=N.length;_e(e,t,+M),_e(e,t+2,q),e.set(N,t+4),t+=4+q}return g&&(e.set(s,t),t+=g),t},im=function(e,t,n,o,i){_e(e,t,101010256),_e(e,t+8,n),_e(e,t+10,n),_e(e,t+12,o),_e(e,t+16,i)};function xc(e,t){t||(t={});var n={},o=[];Sc(e,"",n,t);var i=0,r=0;for(var c in n){var s=n[c],f=s[0],m=s[1],g=m.level==0?0:8,h=pc(c),w=h.length,E=m.comment,M=E&&pc(E),N=M&&M.length,q=ra(m.extra);w>65535&&Ue(11);var V=g?Jp(f,m):f,ee=V.length,H=Kp();H.p(f),o.push(bc(m,{size:f.length,crc:H.d(),c:V,f:h,m:M,u:w!=c.length||M&&E.length!=N,o:i,compression:g})),i+=30+w+q+ee,r+=76+2*(w+q)+(N||0)+ee}for(var W=new ve(r+22),le=i,me=r-i,te=0;te<o.length;++te){var h=o[te];mc(W,h.o,h,h.f,h.u,h.c.length);var G=30+h.f.length+ra(h.extra);W.set(h.c,h.o+G),mc(W,i,h,h.f,h.u,h.c.length,h.o,h.m),i+=16+G+(h.m?h.m.length:0)}return im(W,i,o.length,me,le),W}function Tc(e,t){for(var n={},o=e.length-22;mt(e,o)!=101010256;--o)(!o||e.length-o>65558)&&Ue(13);var i=Nt(e,o+8);if(!i)return{};var r=mt(e,o+16),c=mt(e,o-20)==117853008;if(c){var s=mt(e,o-12);c=mt(e,s)==101075792,c&&(i=mt(e,s+32),r=mt(e,s+48))}for(var f=t&&t.filter,m=0;m<i;++m){var g=om(e,r,c),h=g[0],w=g[1],E=g[2],M=g[3],N=g[4],q=g[5],V=nm(e,q);r=N,(!f||f({name:M,size:w,originalSize:E,compression:h}))&&(h?h==8?n[M]=Qp(e.subarray(V,V+w),{out:new ve(E)}):Ue(14,"unknown compression type "+h):n[M]=zo(e,V,V+w))}return n}var Zr="https://devel.kamotimestamps.com",ma="308989572223-cdnvpn65mc51oqneu7po3og51uf5ahsb.apps.googleusercontent.com",Lc="https://www.youtube.com/",Cc="timekeeper_sync_auth",fa="timekeeper_sync_oauth",Bc="timekeeper_sync_subs:",am="https://www.googleapis.com/auth/youtube.readonly",On="syncAuthState",Rc="syncCursors",sm=500,lm=5e3,kc=200,cm=500,um=60*1e3,dm=60*1e3,Pc=300*1e3;function Hn(){return!!(Zr&&ma)}var Dc=Ce({accessToken:j(),accessTokenExpiresAt:Le({finite:!0}),refreshToken:j(),user:Ce({id:j(),email:j(),name:dt(j())})}),pm=Ce({records:fn.array(),seq:Le({int:!0,nonnegative:!0}),hasMore:Rn()}),mm=Ce({rejected:fn.array(),fromSeq:Le({int:!0,nonnegative:!0}),seq:Le({int:!0,nonnegative:!0})}),fm=Ce({type:j(),seq:he(Le({int:!0,nonnegative:!0})),fromSeq:he(Le({int:!0,nonnegative:!0})),records:he(fn.array())}),Oc=Ce({type:j(),idToken:he(j()),accessToken:he(j()),state:he(j()),error:he(j())}),xn=class extends Error{},Uo=class extends Error{constructor(n,o){super(o);this.httpStatus=n}},hm=e=>e instanceof Uo&&e.httpStatus>=400&&e.httpStatus<500&&e.httpStatus!==408&&e.httpStatus!==429,Go="signed-out",Kr="",_n=!1,ca=null,io=new Set,sa=!1,_c=null,ht=!0,Zt=null,Sn=null,ei=0,oo=null,Ac=0,en=!0,Fo=null,ha=0,ua=null,Ec=!1,Ye={pushCounter:0,pullSeq:0},ga=new Map,Mc=Promise.resolve(),Xr=!1,Yr=null,Qr="",la=!1,ti=null,Hc=null,da=null,Jr=null,Nc=null;function He(){return ql()}function zc(e){Hc=e}function Gc(e){da=e}function Fc(e){Jr=e}function Uc(e){Nc=e}var Vc="#52c41a",qc="#ff4d4f",ro="#ffa500";function ao(){let e=He();if(da){let t=da;if(t.style.fontWeight="bold",t.onmouseenter=null,t.onmouseleave=null,!Hn())$(t,"alert-triangle","Sync backend is not configured in this build"),t.style.color=ro;else if(!e.isSignedIn)$(t,"circle-x","Not signed in"),t.style.color=qc;else{$(t,"circle-check","Signed in"),t.style.color=Vc;let n=e.userName||e.email;n&&(t.onmouseenter=()=>$(t,"circle-check",`Signed in as ${n}`),t.onmouseleave=()=>$(t,"circle-check","Signed in"))}}if(Jr){let{text:t,color:n}=jc(e);Jr.textContent=t,Jr.style.color=n}Nc?.(),$c?.()}function jc(e=He()){if(Go==="error")return{text:Kr||"Sync error",color:qc,busy:!1};if(Go==="connecting")return{text:Kr||"Connecting\u2026",color:ro,busy:!0};if(e.isSignedIn&&Go==="offline")return{text:Kr||"Offline. Retrying\u2026",color:ro,busy:!1};if(e.isSignedIn&&Go==="online"){let t=_n?"Syncing\u2026":"Live sync on";return!_n&&ca&&(t+=` \xB7 last synced ${new Date(ca).toLocaleTimeString()}`),!_n&&io.size>0?(t+=` \xB7 ${io.size} timestamp${io.size===1?"":"s"} could not be synced`,{text:t,color:ro,busy:!1}):{text:t,color:_n?ro:Vc,busy:_n}}return{text:"",color:"#aaa",busy:!1}}var gm="#4285f4";function Vo(){if(!Hn()||!He().isSignedIn)return null;let{text:e,color:t,busy:n}=jc();return e?{color:n?gm:t,tooltip:`Sync: ${e}`}:{color:ro,tooltip:"Sync: starting\u2026"}}var $c=null;function Wc(e){$c=e}function ft(e,t=""){Go=e,Kr=t,ao()}function Yc(){return typeof GM<"u"&&GM&&typeof GM.getValue=="function"&&typeof GM.setValue=="function"?GM:null}async function Kc(){let e=Yc();if(!e)return Kt(On);let t=await e.getValue(On);if(t!=null)return t;let n=await Kt(On);return n&&(await e.setValue(On,n),await yn(On,null)),n??void 0}async function ni(){try{let e=Yc();e?await e.setValue(On,He()):await yn(On,He())}catch(e){l("Failed to save sync auth state:",e,"error")}}function qo(){yn(Rc,{userId:He().userId,...Ye})}async function vm(){let e=await Kt(Rc);e&&e.userId===He().userId&&typeof e.pushCounter=="number"&&typeof e.pullSeq=="number"?Ye={pushCounter:e.pushCounter,pullSeq:e.pullSeq}:Ye={pushCounter:0,pullSeq:0}}function va(e,t){return fetch(`${Zr}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function Xc(e){ti=null,to({isSignedIn:!0,accessToken:e.accessToken,accessTokenExpiresAt:e.accessTokenExpiresAt,refreshToken:e.refreshToken,userId:e.user.id,userName:e.user.name,email:e.user.email})}var Jc=e=>!!e.accessToken&&e.accessToken!==ti&&!!e.accessTokenExpiresAt&&e.accessTokenExpiresAt-Date.now()>um;async function ym(e){return typeof navigator<"u"&&navigator.locks?await navigator.locks.request("timekeeper-sync-refresh",e):e()}async function wm(){let e=await Kc();if(e==null)return;let t=Ai.safeParse(e);t.success&&to(t.data)}function bm(){return Yr??(Yr=ym(async()=>{await wm();let e=He();if(!e.isSignedIn||!e.refreshToken)throw new xn("Not signed in");if(Jc(e))return e.accessToken;let t=await va("/auth/refresh",{refreshToken:e.refreshToken});if(t.status===401)throw new xn("Session expired");if(!t.ok)throw new Error(`Token refresh failed (HTTP ${t.status})`);let n=Dc.safeParse(await t.json());if(!n.success)throw new Error("Unexpected token refresh response");return Xc(n.data),await ni(),n.data.accessToken}).finally(()=>{Yr=null})),Yr}async function Qc(){let e=He();if(!e.isSignedIn||!e.refreshToken)throw new xn("Not signed in");return Jc(e)?e.accessToken:bm()}async function oi(e,t,n=!0){let o=await Qc(),i=await fetch(`${Zr}${e}`,{method:t.method,headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:t.body===void 0?void 0:JSON.stringify(t.body)});if(i.status===401){if(!n)throw new xn("Session expired");return ti=o,oi(e,t,!1)}return i}async function Zc(e,t,n){let o=await oi(e,t);if(!o.ok)throw new Uo(o.status,`${t.method} ${e} failed (HTTP ${o.status})`);let i=n.safeParse(await o.json());if(!i.success)throw new Error(`Unexpected response from ${e}`);return i.data}function Sm(e){try{let t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(t.padEnd(Math.ceil(t.length/4)*4,"=")))}catch{return null}}function xm(e,t,n){return new Promise((o,i)=>{let r=()=>{clearTimeout(c),e.close();try{t.close()}catch{}},c=setTimeout(()=>{r(),i(new Error("Sign-in timed out"))},Pc);e.onmessage=s=>{let f=Oc.safeParse(s.data);if(f.success){if(f.data.type==="timekeeper_sync_oauth_error")r(),i(new Error(f.data.error||"Google sign-in failed"));else if(f.data.type==="timekeeper_sync_oauth_token"&&f.data.idToken){if(Sm(f.data.idToken)?.nonce!==n)return;r(),o(f.data.idToken)}}}})}function Tm(e,t,n){return new Promise((o,i)=>{let r=()=>{clearTimeout(c),e.close();try{t.close()}catch{}},c=setTimeout(()=>{r(),i(new Error("Google sign-in timed out"))},Pc);e.onmessage=s=>{let f=Oc.safeParse(s.data);!f.success||f.data.state!==n||(f.data.type==="timekeeper_sync_oauth_error"?(r(),i(new Error(f.data.error||"Google authorization failed"))):f.data.type==="timekeeper_sync_oauth_access"&&f.data.accessToken&&(r(),o(f.data.accessToken)))}})}function eu(){let e=window.location.hash;if(!e||e.length<=1)return!1;let t=new URLSearchParams(e.substring(1)),n=t.get("state")??"",o=n.startsWith(Bc);if(n!==Cc&&!o)return!1;let i=t.get("id_token"),r=t.get("access_token"),c=t.get("error_description")||t.get("error");if(!i&&!r&&!c)return!1;try{let s=new BroadcastChannel(fa);s.postMessage(c?{type:"timekeeper_sync_oauth_error",error:c,state:n}:o?{type:"timekeeper_sync_oauth_access",accessToken:r,state:n}:{type:"timekeeper_sync_oauth_token",idToken:i}),s.close()}catch(s){console.error("[Timekeeper] Failed to hand sync sign-in result to the opener:",s)}return history.replaceState&&history.replaceState(null,"",window.location.pathname+window.location.search),window.close(),!0}async function tu(){if(!Hn()){ft("error","Sync backend is not configured in this build");return}if(He().isSignedIn||la)return;la=!0,ft("connecting","Opening Google sign-in\u2026");let e=crypto.randomUUID(),t=new BroadcastChannel(fa);try{let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",ma),n.searchParams.set("redirect_uri",Lc),n.searchParams.set("response_type","id_token"),n.searchParams.set("scope","openid email profile"),n.searchParams.set("nonce",e),n.searchParams.set("state",Cc),n.searchParams.set("prompt","select_account");let o=window.open(n.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!o)throw new Error("Popup blocked. Please enable popups for YouTube.");ft("connecting","Waiting for Google sign-in\u2026");let i=await xm(t,o,e);ft("connecting","Signing in to Timekeeper Sync\u2026");let r=await va("/auth/google",{idToken:i});if(!r.ok)throw new Error(r.status===401?"Google sign-in was rejected by the server":`Sign-in failed (HTTP ${r.status})`);let c=Dc.safeParse(await r.json());if(!c.success)throw new Error("Unexpected response from the sync server");Xc(c.data),await ni(),Ye={pushCounter:0,pullSeq:0},qo(),l(`Signed in to Timekeeper Sync as ${c.data.user.email}`),await cu()}catch(n){t.close(),l("Sync sign-in failed:",n,"error"),ft("error",n instanceof Error?n.message:"Sign-in failed")}finally{la=!1}}async function nu(){let e=He();if(!e.isSignedIn||sa)return;sa=!0;let t=Bc+crypto.randomUUID(),n=new BroadcastChannel(fa);try{let o=new URL("https://accounts.google.com/o/oauth2/v2/auth");o.searchParams.set("client_id",ma),o.searchParams.set("redirect_uri",Lc),o.searchParams.set("response_type","token"),o.searchParams.set("scope",am),o.searchParams.set("state",t),e.email&&o.searchParams.set("login_hint",e.email);let i=window.open(o.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!i)throw new Error("Popup blocked. Please enable popups for YouTube.");let r=await Tm(n,i,t),c=await oi("/subscriptions/sync",{method:"POST",body:{accessToken:r}});if(!c.ok)throw new Uo(c.status,`Sharing subscriptions failed (HTTP ${c.status})`);let{count:s}=await c.json();l(`Shared ${s} YouTube subscriptions with Timekeeper Sync`),_c=null}catch(o){throw n.close(),l("Sharing YouTube subscriptions failed:",o,"error"),o}finally{sa=!1}}async function ou(e){if(!He().isSignedIn)return null;try{let t=await oi("/videos/access",{method:"POST",body:e});if(!t.ok)return null;let n=await t.json();return _c={videoId:e.videoId,access:n},n}catch(t){return l("Reporting video access failed:",t,"warn"),null}}async function ru(){let{refreshToken:e}=He();if(uu(),to(Kn),Ye={pushCounter:0,pullSeq:0},ga.clear(),io.clear(),await ni(),qo(),ft("signed-out"),e&&Hn())try{await va("/auth/logout",{refreshToken:e})}catch(t){l("Sync logout request failed:",t,"warn")}}function iu(){uu(),to(Kn),ni(),ft("error","Session expired. Please sign in again.")}function au(e){let t=Mc.then(e);return Mc=t.catch(()=>{}),t}function so(){ht||Xr||(Xr=!0,au(async()=>{Xr=!1,await Em()}).catch(e=>l("Sync: cycle crashed:",e,"error")))}async function ya(e){if(e.length!==0){for(let t of e)ga.set(t.guid,t.write_counter??0);await _i(e),Hc?.([...new Set(e.map(t=>t.video_id))])}}function su(e,t){return e>Ye.pullSeq?(en=!0,!1):(t>Ye.pullSeq&&(Ye.pullSeq=t,qo()),!0)}async function km(){for(;;){let e=await Zc(`/sync/pull?since=${Ye.pullSeq}&limit=${cm}`,{method:"GET"},pm);await ya(e.records);let t=e.seq!==Ye.pullSeq;if(Ye.pullSeq=e.seq,qo(),!e.hasMore||!t)return}}async function pa(e){try{let t=await Zc("/sync/push",{method:"POST",body:{deviceId:Qr,records:e}},mm);await ya(t.rejected);for(let n of e)io.delete(n.guid);su(t.fromSeq,t.seq)||so()}catch(t){if(!hm(t))throw t;if(e.length>1){let n=e.length>>1;await pa(e.slice(0,n)),await pa(e.slice(n));return}io.add(e[0].guid),l(`Sync: server refused timestamp ${e[0].guid}; leaving it local-only:`,t,"warn")}}async function Am(){let e=await Oi(Ye.pushCounter);if(e.length===0)return;let t=e.filter(n=>(ga.get(n.guid)??0)<n.write_counter);for(let n=0;n<t.length;n+=kc)await pa(t.slice(n,n+kc));Ye.pushCounter=Math.max(Ye.pushCounter,e[e.length-1].write_counter),qo()}async function Em(){if(!ht){_n=!0,ao();try{(en||!Zt)&&(await km(),en=!1),await Am(),ca=Date.now(),ha=0}catch(e){if(e instanceof xn){iu();return}l("Sync cycle failed:",e,"warn"),en=!0,Mm()}finally{_n=!1,ao()}}}function lu(e){return Math.min(dm,1e3*2**e)*(.5+Math.random()/2)}function Mm(){ht||Fo||(Fo=setTimeout(()=>{Fo=null,so()},lu(ha++)))}function Im(){if(ht)return;let e=Date.now();oo?clearTimeout(oo):Ac=e;let t=Math.max(0,Math.min(sm,Ac+lm-e));oo=setTimeout(()=>{oo=null,so()},t)}function wa(){ht||(en=!0,Zt||(ei=0,Sn&&clearTimeout(Sn),Sn=null,ba()),so())}function Ic(){ht||Sn||(Sn=setTimeout(()=>{Sn=null,ba()},lu(ei++)))}async function ba(){if(ht||Zt)return;ft("connecting");let e;try{e=await Qc()}catch(n){return n instanceof xn?iu():(l("Sync: could not get an access token:",n,"warn"),ft("offline"),Ic())}if(ht||Zt)return;let t=new WebSocket(`${Zr.replace(/^http/,"ws")}/sync/ws`);Zt=t,t.onopen=()=>t.send(JSON.stringify({type:"auth",token:e,deviceId:Qr})),t.onmessage=n=>{let o;try{o=JSON.parse(String(n.data))}catch{return}let i=fm.safeParse(o);if(i.success){if(i.data.type==="ready")ei=0,ft("online"),(i.data.seq===void 0||i.data.seq!==Ye.pullSeq)&&(en=!0),so();else if(i.data.type==="changes"&&i.data.records){let{fromSeq:r,seq:c,records:s}=i.data;au(async()=>{await ya(s),(r===void 0||c===void 0)&&(en=!0),(en||!su(r,c))&&so()}).catch(f=>l("Sync: failed to apply live changes:",f,"error"))}}},t.onclose=n=>{Zt===t&&(Zt=null),en=!0,!ht&&(n.code===4401&&(ti=e),ft("offline"),Ic())},t.onerror=()=>{}}async function cu(){if(ht){if(!Qr){let e=await Kt("device_id");Qr=typeof e=="string"&&e?e:crypto.randomUUID()}ht=!1,ha=0,ei=0,ua=Hi(Im),Ec||(Ec=!0,window.addEventListener("online",()=>wa())),await ba()}}function uu(){ht=!0,ua?.(),ua=null;for(let t of[oo,Fo,Sn])t&&clearTimeout(t);oo=Fo=Sn=null,Xr=!1;let e=Zt;Zt=null;try{e?.close()}catch{}}async function du(){if(!Hn()){ao();return}try{let e=Ai.safeParse(await Kc());e.success&&to(e.data);let t=He();t.isSignedIn&&t.refreshToken?(await vm(),await cu()):ft("signed-out")}catch(e){l("Failed to load sync auth state:",e,"error")}}function gt(){return Ht()}var vt={get isSignedIn(){return Ht().isSignedIn},get accessToken(){return Ht().accessToken},get userName(){return Ht().userName},get email(){return Ht().email},set isSignedIn(e){let t=Ht();It({...t,isSignedIn:e})},set accessToken(e){let t=Ht();It({...t,accessToken:e})},set userName(e){let t=Ht();It({...t,userName:e})},set email(e){let t=Ht();It({...t,email:e})}};function Yo(){return We().auth.autoBackupEnabled}function Gt(){return We().auth.autoBackupIntervalMinutes}var Ta=null,ae=null,ne=null,zn=null;function hu(e){Ta=e}function gu(e){ae=e}function vu(e){ne=e}function yu(e){zn=e}var pu=!1;function wu(){if(!pu)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),pu=!0}catch{}}var bu=null,ka=null,jo=null,$o=null,Aa=null;function Su(e){bu=e}function xu(e){ka=e}function Ea(e){jo=e}function Ma(e){$o=e}function Tu(e){Aa=e}var ii="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",ku="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Au="https://www.youtube.com/",Cm=new Date(Date.UTC(2e3,0,1,0,0,0)),Bm=30*1e3,Rm=1800*1e3,mu=5,ri=null,Ke=null;async function Ia(){try{let e=await $o("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=ki.safeParse(e);if(n.success){let o=gt();It({...o,...n.data});let i=gt();i.isSignedIn&&i.accessToken&&l(`Reusing stored Google auth token for ${i.userName||i.email||"user"}`),uo();let r=gt();r.isSignedIn&&r.accessToken&&await Tn(!0)}else if(e!==void 0){let o=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:o,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function Ko(){try{let e=gt(),t=ki.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await jo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function uo(){Ta&&(Ta.style.display="none")}function nt(e,t){if(!ne)return;if(ne.style.fontWeight="bold",e==="authenticating"){wu(),ne.style.color="#ffa500",ne.replaceChildren();let o=document.createElement("span");o.className="tk-auth-spinner";let i=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);ne.appendChild(o),ne.appendChild(i);return}if(e==="error"){$(ne,"circle-x",t||"Authorization failed"),ne.style.color="#ff4d4f",Ae();return}let n=gt();n.isSignedIn?($(ne,"circle-check","Signed in"),ne.style.color="#52c41a",ne.removeAttribute("title"),n.userName?(ne.onmouseenter=()=>{$(ne,"circle-check",`Signed in as ${n.userName}`)},ne.onmouseleave=()=>{$(ne,"circle-check","Signed in")}):(ne.onmouseenter=null,ne.onmouseleave=null)):($(ne,"circle-x","Not signed in"),ne.style.color="#ff4d4f",ne.removeAttribute("title"),ne.onmouseenter=null,ne.onmouseleave=null),Ae()}function Pm(){ne&&(wu(),ne.classList.remove("tk-auth-blink"),ne.offsetWidth,ne.classList.add("tk-auth-blink"),setTimeout(()=>{ne.classList.remove("tk-auth-blink")},1200))}function Eu(e,t=300*1e3){return new Promise((n,o)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),o(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let i=Date.now(),r="timekeeper_oauth",c=null,s=null,f=null,m=()=>{if(c){try{c.close()}catch{}c=null}s&&(clearInterval(s),s=null),f&&(clearInterval(f),f=null)};try{c=new BroadcastChannel(r),l&&l("OAuth monitor: BroadcastChannel created successfully"),c.onmessage=w=>{let E=w.data?.token?{...w.data,token:"[REDACTED]"}:w.data;l&&l("OAuth monitor: received BroadcastChannel message",E);let M=Ce({type:j(),token:he(j()),error:he(j())}).safeParse(w.data);if(!M.success){l&&l("OAuth monitor: invalid message format",M.error,"warn");return}if(M.data.type==="timekeeper_oauth_token"&&M.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),m();try{e.close()}catch{}n(M.data.token)}else if(M.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),m();try{e.close()}catch{}o(new Error(M.data.error||"OAuth failed"))}}}catch(w){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",w)}l&&l("OAuth monitor: setting up IndexedDB polling");let g=Date.now();s=setInterval(async()=>{try{let w=indexedDB.open("ytls-timestamps-db",4);w.onsuccess=()=>{let E=w.result,q=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");q.onsuccess=()=>{let V=q.result;if(V&&V.value){let ee=V.value,H=Ce({type:j(),token:he(j()),error:he(j()),timestamp:he(Le())}).safeParse(ee);if(!H.success){l&&l("OAuth monitor: invalid IndexedDB message format",H.error,"warn");return}if(H.data.timestamp&&H.data.timestamp>g){let W=H.data.token?{...H.data,token:"[REDACTED]"}:H.data;if(l&&l("OAuth monitor: received IndexedDB message",W),H.data.type==="timekeeper_oauth_token"&&H.data.token){l&&l("OAuth monitor: token received via IndexedDB"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(H.data.token)}else if(H.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",H.data.error,"error"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),o(new Error(H.data.error||"OAuth failed"))}g=H.data.timestamp||Date.now()}}E.close()}}}catch(w){l&&l("OAuth monitor: IndexedDB polling error",w,"error")}},500),f=setInterval(()=>{if(Date.now()-i>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),m();try{e.close()}catch{}o(new Error("OAuth popup timed out"));return}},1e3)})}async function Mu(){if(!ii){nt("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),nt("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",ii),e.searchParams.set("redirect_uri",Au),e.searchParams.set("response_type","token"),e.searchParams.set("scope",ku),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),nt("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),nt("authenticating","Waiting for authentication...");try{let n=await Eu(t),o=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(o.ok){let i=await o.json(),r=Ce({name:he(j()),email:he(j())}).safeParse(i);if(!r.success)throw l&&l("Failed to validate user info response",r.error,"error"),new Error("Invalid user info response");let c=r.data;It({isSignedIn:!0,accessToken:n,userName:c.name||null,email:c.email||null}),await Ko(),uo(),nt(),Ae(),await Tn(),l?l(`Successfully authenticated as ${c.name}`):console.log(`[Timekeeper] Successfully authenticated as ${c.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let o=n instanceof Error?n.message:"Authentication failed";l?l("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),nt("error",o);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),nt("error",`Failed to sign in: ${t}`)}}async function Dm(){let e=gt(),t=e.email;if(!ii||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",ii),n.searchParams.set("redirect_uri",Au),n.searchParams.set("response_type","token"),n.searchParams.set("scope",ku),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let o=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!o)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let i=await Eu(o,15e3);return It({...e,isSignedIn:!0,accessToken:i}),await Ko(),uo(),nt(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(i){l("Silent OAuth: silent refresh failed",i,"warn");try{o.close()}catch{}return!1}}async function Iu(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),o=n.get("state");if(l&&l("OAuth popup: hash params found, state="+o),o!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let i=n.get("error"),r=n.get("access_token"),c="timekeeper_oauth";if(i){try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||i}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let f={type:"timekeeper_oauth_error",error:n.get("error_description")||i,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",f);let m=indexedDB.open("ytls-timestamps-db",4);m.onsuccess=()=>{let g=m.result,w=g.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:f});w.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},w.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",w.error,"error")},g.close()},m.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",m.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(r){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_token",token:r}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let f={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},m={...f,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",m);let g=indexedDB.open("ytls-timestamps-db",4);g.onsuccess=()=>{let h=g.result,E=h.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:f});E.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",E.error,"error")},h.close()},g.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",g.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Lu(){It({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Ko(),await Tn(),uo(),nt(),Ae()}async function Cu(){let e=gt();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await Pu({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function ai(){let e=gt();return e.isSignedIn&&!!e.accessToken}function co(){return ai()}function Om(){let e=[];return ai()&&e.push("Google Drive"),e}function _m(e){let t=Tc(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function Bu(e){let t={Authorization:`Bearer ${e}`},o=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,i=await fetch(o,{headers:t});if(i.status===401)throw new Error("unauthorized");if(!i.ok)throw new Error("drive search failed");let r=await i.json();if(Array.isArray(r.files)&&r.files.length>0)return r.files[0].id;let c=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error("drive folder create failed");return(await c.json()).id}async function Ru(e,t,n){let o=`name='${e}' and '${t}' in parents and trashed=false`,i=encodeURIComponent(o),r=encodeURIComponent("modifiedTime desc"),c=await fetch(`https://www.googleapis.com/drive/v3/files?q=${i}&orderBy=${r}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error(`drive search failed (${c.status})`);let s=await c.json();return s.files&&s.files.length>0?s.files[0].id:null}async function fu(e){let t=await Bu(e),n=await Ru("timekeeper-data.zip",t,e);if(!n)return null;let o=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)throw new Error(`drive download failed (${o.status})`);let i=await o.arrayBuffer();try{return _m(i)}catch(r){return l("Remote backup could not be decoded; the next upload will replace it:",r,"warn"),null}}async function Hm(){if(!ka)return;let e=gt();if(!e.isSignedIn||!e.accessToken)return;let t;try{t=await fu(e.accessToken)}catch(i){if(i.message!=="unauthorized")throw i;await Pu({silent:!0});let r=gt();if(!r.isSignedIn||!r.accessToken)throw i;t=await fu(r.accessToken)}if(!t)return;let{mergedVideos:n,mergedTimestamps:o}=await ka(t);o>0&&(l(`Pre-backup merge: added ${o} timestamps from ${n} videos from remote`),Aa&&Aa())}function Nm(e,t){let n=new TextEncoder().encode(e),o=t.replace(/\\/g,"/").replace(/^\/+/,"");return o.endsWith(".json")||(o+=".json"),xc({[o]:[n,{level:6,mtime:Cm,os:0}]})}async function zm(e,t,n,o){let i=e.replace(/\.json$/,".zip"),r=await Ru(i,n,o),c=new TextEncoder().encode(t).length,s=Nm(t,e),f=s.length;l(`Compressing data: ${c} bytes -> ${f} bytes (${Math.round(100-f/c*100)}% reduction)`);let m="-------314159265358979",g=`\r
--${m}\r
`,h=`\r
--${m}--`,w=r?{name:i,mimeType:"application/zip"}:{name:i,mimeType:"application/zip",parents:[n]},E=8192,M="";for(let W=0;W<s.length;W+=E){let le=s.subarray(W,Math.min(W+E,s.length));M+=String.fromCharCode.apply(null,Array.from(le))}let N=btoa(M),q=g+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(w)+g+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+N+h,V,ee;r?(V=`https://www.googleapis.com/upload/drive/v3/files/${r}?uploadType=multipart&fields=id,name`,ee="PATCH"):(V="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",ee="POST");let H=await fetch(V,{method:ee,headers:{Authorization:`Bearer ${o}`,"Content-Type":`multipart/related; boundary=${m}`},body:q});if(H.status===401)throw new Error("unauthorized");if(!H.ok)throw new Error("drive upload failed")}async function Pu(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await Dm()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),It({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Ko(),await Tn(),nt("error","Authorization expired. Please sign in again."),Ae())}async function Gm(e){if(!ai())throw e?.silent||nt("error","Configure a backup destination first"),new Error("no-backup-destination");await Hm();let t=await bu({includeDeleted:!0});if(t.totalTimestamps===0){if(t.invalidRows>0)throw new Error(`export-invalid-data: ${t.invalidRows} stored rows failed validation`);return e?.silent||l("Skipping export: no timestamps to back up"),"skipped"}let n=gt();if(!n.accessToken)throw new Error("unauthorized");let o=await Bu(n.accessToken);return await zm(t.filename,t.json,o,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`),"uploaded"}async function Du(){try{let[e,t,n]=await Promise.all([$o("lastAutoBackupAt"),$o("autoBackupEnabled"),$o("autoBackupIntervalMinutes")]),o=Ei.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});o.success?(typeof o.data.autoBackupEnabled=="boolean"&&zi(o.data.autoBackupEnabled),typeof o.data.autoBackupIntervalMinutes=="number"&&Gi(o.data.autoBackupIntervalMinutes),typeof o.data.lastAutoBackupAt=="number"&&Ui(o.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",o.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function La(){try{let e=We().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=Ei.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([jo("autoBackupEnabled",e.autoBackupEnabled),jo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),jo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Fm(){ri&&(clearInterval(ri),ri=null),Ke&&(clearTimeout(Ke),Ke=null)}function Nn(e){try{let t=new Date(e),n=new Date,o=t.toDateString()===n.toDateString(),i=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return o?i:`${t.toLocaleDateString()} ${i}`}catch{return""}}function Sa(){let e=Om();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function Ou(){let e=We().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?"#4285f4":e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?"#ffa500":co()&&e.lastAutoBackupAt?"#52c41a":co()?"#ffa500":"#ff4d4f":"#ff4d4f"}function Ae(){if(si(),!ae)return;let e=We().auth;if(!e.autoBackupEnabled)$(ae,"refresh","Backup: Off"),ae.onmouseenter=null,ae.onmouseleave=null;else if(e.isAutoBackupRunning)$(ae,"refresh","Backing up\u2026"),ae.onmouseenter=null,ae.onmouseleave=null;else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0){let n=Math.ceil(e.autoBackupBackoffMs/6e4);$(ae,"alert-triangle",`Retry in ${n}m`),ae.onmouseenter=null,ae.onmouseleave=null}else if(!co())$(ae,"alert-triangle","Backup target missing"),ae.onmouseenter=null,ae.onmouseleave=null;else if(e.lastAutoBackupAt){let n=e.lastAutoBackupAt,o=n+Math.max(1,Gt())*60*1e3,i=Nn(o);ae.onmouseenter=()=>{$(ae,"database",`Next backup: ${i}`)},ae.onmouseleave=()=>{$(ae,"database",`Last backup: ${Nn(n)}`)},$(ae,"database",`Last backup: ${Nn(n)}`)}else{let n=Date.now()+Math.max(1,Gt())*60*1e3,o=Nn(n);ae.onmouseenter=()=>{$(ae,"database",`Next backup: ${o}`)},ae.onmouseleave=()=>{$(ae,"database","Last backup: never")},$(ae,"database","Last backup: never")}ae.style.display="inline";let t=Ou();ae.style.color=t}var xa="ytls-backup-indicator--pulsing",Um="#4285f4",lo=null;function Vm(e,t){lo&&(e.removeEventListener("animationiteration",lo),lo=null),t===Um?(e.style.backgroundColor=t,e.classList.add(xa)):e.classList.contains(xa)?(lo=()=>{zn&&(zn.classList.remove(xa),zn.style.backgroundColor=t,lo=null)},e.addEventListener("animationiteration",lo,{once:!0})):e.style.backgroundColor=t}function si(){if(!zn)return;let e=Vo()?.color??Ou();Vm(zn,e),Fe(zn,()=>{let t=Vo();if(t)return t.tooltip;let n=We().auth,o="";if(!n.autoBackupEnabled)o="Auto backup is disabled";else if(n.isAutoBackupRunning)o="Backup in progress";else if(n.autoBackupBackoffMs&&n.autoBackupBackoffMs>0)o=`Retrying backup in ${Math.ceil(n.autoBackupBackoffMs/6e4)}m`;else if(!co())o=Sa();else if(n.lastAutoBackupAt){let i=n.lastAutoBackupAt+Math.max(1,Gt())*60*1e3,r=Nn(i);o=`Last backup: ${Nn(n.lastAutoBackupAt)}
Next backup: ${r}
${Sa()}`}else{let i=Date.now()+Math.max(1,Gt())*60*1e3;o=`No backup yet
Next backup: ${Nn(i)}
${Sa()}`}return o})}async function Wo(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!co()){t||(Ae(),ai()||Pm());return}if(Ke){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(Ke),Ke=null,no(null),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!We().auth.isAutoBackupRunning){Fi(!0),Ae();try{await Gm({silent:t})==="uploaded"&&Ui(Date.now()),jr(0),no(null),Ke&&(clearTimeout(Ke),Ke=null),await La()}catch(o){if(l("Auto backup failed:",o,"error"),o.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let r=gt();It({...r,accessToken:null,isSignedIn:!1}),await Ko(),nt("error","Authorization expired. Please sign in again."),Ae(),jr(0),no(null),Ke&&(clearTimeout(Ke),Ke=null)}else if(We().auth.autoBackupRetryAttempts<mu){let r=We().auth.autoBackupRetryAttempts+1;jr(r);let s=Math.min(Bm*Math.pow(2,r-1),Rm);no(s),Ke&&clearTimeout(Ke),Ke=setTimeout(()=>{Wo({silent:!0})},s),l(`Scheduling backup retry ${r}/${mu} in ${Math.round(s/1e3)}s`),Ae()}else no(null)}finally{Fi(!1),Ae()}}}async function Tn(e=!1){if(Fm(),!!Yo()&&co()){if(ri=setInterval(()=>{Wo({silent:!0})},Math.max(1,Gt())*60*1e3),!e){let t=Date.now(),n=Math.max(1,Gt())*60*1e3,o=We().auth.lastAutoBackupAt;(!o||t-o>=n)&&Wo({silent:!0})}Ae()}}async function _u(){let e=Yo();zi(!e),await La(),await Tn(),Ae()}async function Hu(){let e=Gt(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Gi(n),await La(),await Tn(),Ae()}function Ca(e,t){return Kt(e).then(n=>n!==void 0?n:t)}function Ba(e,t){return yn(e,t),Promise.resolve()}var Ra=window.location.hash;if(Ra&&Ra.length>1){let e=new URLSearchParams(Ra.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let o=new BroadcastChannel("timekeeper_oauth"),i={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:i.type,tokenLength:n.length}),o.postMessage(i),o.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(o){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",o);let i={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},r=indexedDB.open("ytls-timestamps-db",4);r.onsuccess=()=>{let c=r.result,s=c.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:i}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",i.timestamp),c.close()}}}if(history.replaceState){let o=window.location.pathname+window.location.search;history.replaceState(null,"",o)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}if(eu())throw new Error("OAuth window closed");sc();ac()||oc();(async function(){"use strict";if(window.top!==window.self)return;function e(a){return Ca(a,void 0)}function t(a,u){return Ba(a,u)}Ma(e),Ea(t);try{let a=await Kt("device_id"),u=typeof a=="string"&&a.length>0?a:crypto.randomUUID();await yn("device_id",u),l(`Lamport: device_id = ${u}`)}catch(a){l("Lamport: failed to initialize device_id:",a,"warn")}if(await Iu()){l("OAuth popup detected, broadcasting token and closing");return}await Ia();let o=["/watch","/live"];function i(a=window.location.href){try{let u=new URL(a);return u.origin!=="https://www.youtube.com"?!1:o.some(d=>u.pathname===d||u.pathname.startsWith(`${d}/`))}catch(u){return l("Timekeeper failed to parse URL for support check:",u,"error"),!1}}let r=null,c=null,s=null,f=null,m=null,g=null,h=(()=>{try{let a=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(a)&&a>0&&a!==1?Math.min(a,4):2}catch{return 2}})(),w=!1,E=null,M=null,N=250,q=null;function V(){return We().ui.minPaneHeight}function ee(a){jl(a)}function H(a){Wl(a)}function W(){return We().ui.urlChangeHandlersSetup}function le(a){Yl(a)}function me(){return We().ui.panePosition}function te(a){$l(a)}function G(a){Kl(a)}function P(){return r?r.getBoundingClientRect():null}function ye(a,u,d){a&&te({x:Math.round(typeof u=="number"?u:a.left),y:Math.round(typeof d=="number"?d:a.top),width:Math.round(a.width),height:Math.round(a.height)})}function se(a=!0){if(!r)return;Un();let u=P();if(u&&(u.width||u.height)&&(ye(u),a)){let d=me();gr("windowPosition",d),An({type:"window_position_updated",position:d,timestamp:Date.now()})}}function be(){if(!r||!c||!f||!s)return;let a=40,u=Re();if(u.length>0)a=u[0].offsetHeight;else{let d=document.createElement("li");d.style.visibility="hidden",d.style.position="absolute",d.textContent="00:00 Example",s.appendChild(d),a=d.offsetHeight,s.removeChild(d)}N=c.offsetHeight+f.offsetHeight+a,ee(N),r.style.minHeight=V()+"px"}function yt(){requestAnimationFrame(()=>{De?.(),be(),se(!0)})}function Ve(a=450){Me&&(clearTimeout(Me),Me=null),Me=setTimeout(()=>{Ee(),yt(),Me=null},a)}function Ne(){Me&&(clearTimeout(Me),Me=null)}function Se(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),yt(),Ve()}function ce(){Ee(),Ne(),wt&&(clearTimeout(wt),wt=null),wt=setTimeout(()=>{r&&(r.style.display="none",os(),wt=null)},400)}function Ee(){if(!s){ot&&(ot(),ot=null,Vt=null,Mn=null);return}if(!Mn){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),ot&&(ot(),ot=null,Vt=null);return}l("Appending deferred timestamps after animation"),s.appendChild(Mn),Mn=null,an(),sn(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),ot&&(ot(),ot=null,Vt=null),Rt(),je(),De&&requestAnimationFrame(De),Tt(!0)}let ue=null,Pe=!1,xe="ytls-timestamp-pending-delete",Te="ytls-timestamp-highlight";async function qe(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(a=>setTimeout(a,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(a=>setTimeout(a,100));await new Promise(a=>setTimeout(a,200))}let ze=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],de=5e3,st=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Ft(a){return st.has(a)}function ke(){return document.querySelector("video")}let lt=null;function J(){if(lt&&document.contains(lt))return lt;let a=document.getElementById("movie_player");return a&&document.contains(a)?a:null}function tn(a){return(Math.round(a*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function kn(a){let u=a===1?2:a;h=u;try{localStorage.setItem("ytls-last-speed",String(u))}catch{}}function Ct(a){if(!g)return;let u=typeof a=="number"?a:ke()?.playbackRate??1,d=tn(u);g.dataset.speed!==d&&(g.dataset.speed=d,g.textContent=`${d}x`,g.setAttribute("aria-label",`Playback speed ${d}x`)),Math.abs(u-1)>.01?g.classList.add("ytls-playback-speed-active"):g.classList.remove("ytls-playback-speed-active")}function po(a){let u=J(),d=ke();if(w=!0,u&&typeof u.setPlaybackRate=="function")u.setPlaybackRate(a);else if(d)d.playbackRate=a;else return w=!1,!1;return Ct(a),!0}function Pa(){let a=ke()?.playbackRate;return Number.isFinite(a)?po(Math.abs(a-1)<=.001?h:1):!1}function Nu(a){return a instanceof Element?!!a.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function li(a){return ze.every(u=>typeof a?.[u]=="function"?!0:Ft(u)?!!ke():!1)}function zu(a){return ze.filter(u=>typeof a?.[u]=="function"?!1:Ft(u)?!ke():!0)}async function Gu(a=de){let u=Date.now();for(;Date.now()-u<a;){let y=J();if(li(y))return y;await new Promise(S=>setTimeout(S,100))}let d=J();return li(d),d}let Da="timestampOffsetSeconds",Fu=-5,Oa="shiftClickTimeSkipSeconds",Uu=10,ci=300,ui=300,Bt=null;function _a(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Ha(){if(_a()&&!Bt)try{Bt=new BroadcastChannel("ytls_timestamp_channel"),Bt.onmessage=Na}catch(a){l("Failed to create BroadcastChannel:",a,"warn"),Bt=null}}function An(a){if(!_a()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Ha(),!Bt){l("No BroadcastChannel available to post message","warn");return}try{Bt.postMessage(a)}catch(u){l("BroadcastChannel error, reopening:",u,"warn");try{Bt=new BroadcastChannel("ytls_timestamp_channel"),Bt.onmessage=Na,Bt.postMessage(a)}catch(d){l("Failed to reopen BroadcastChannel:",d,"error")}}}function Na(a){if(l("Received message from another tab:",a.data),!(!i()||!s||!r)&&a.data){if(a.data.type==="timestamps_updated"&&a.data.videoId===Be)l("Debouncing timestamp load due to external update for video:",a.data.videoId),clearTimeout(fo),fo=setTimeout(()=>{l("Reloading timestamps due to external update for video:",a.data.videoId),fr()},500);else if(a.data.type==="window_position_updated"&&r){let u=a.data.position;if(u&&typeof u.x=="number"&&typeof u.y=="number"){r.style.left=`${u.x}px`,r.style.top=`${u.y}px`,r.style.right="auto",r.style.bottom="auto",typeof u.width=="number"&&u.width>0&&(r.style.width=`${u.width}px`),typeof u.height=="number"&&u.height>0&&(r.style.height=`${u.height}px`);let d=r.getBoundingClientRect();te({x:Math.round(u.x),y:Math.round(u.y),width:Math.round(d.width),height:Math.round(d.height)});let y=document.documentElement.clientWidth,S=document.documentElement.clientHeight;(d.left<0||d.top<0||d.right>y||d.bottom>S)&&Un()}}}}Ha();let Gn=await Ca(Da);(typeof Gn!="number"||Number.isNaN(Gn))&&(Gn=Fu,await Ba(Da,Gn));let mo=await Ca(Oa);(typeof mo!="number"||Number.isNaN(mo))&&(mo=Uu,await Ba(Oa,mo));let fo=null,Ut=new Map,En=!1,O=null,Xo=null,Be=null,wt=null,Me=null,bt=null,Xe=null,nn=null,di=!1,De=null,Mn=null,Vt=null,ot=null,on=null,Jo=!1,pi=!1,Qo=null,Zo=null,er=null,tr=null,nr=null,or=null,rr=null,ir=null,ho=null,go=null,vo=null,St=null,xt=null,za=0,yo=!1,In=null,wo=null,Fn=null,Ga=null,bo=null;function Ln(){if(!s)return{items:[],starts:[],rawTimes:[]};if(Ga!==s||!bo?(bo?.disconnect(),bo=new MutationObserver(()=>{Fn=null}),bo.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),Ga=s,Fn=null):bo.takeRecords().length>0&&(Fn=null),!Fn){let a=Fr(s),u=new Array(a.length),d=new Array(a.length);for(let y=0;y<a.length;y++){let S=a[y].querySelector("[data-time]")?.dataset.time;u[y]=S?Number.parseInt(S,10):NaN,d[y]=S?parseFloat(S):0}Fn={items:a,starts:u,rawTimes:d}}return Fn}function Re(){return Ln().items}function mi(){return Ul(s)}function rn(){return wo!==null||(wo=Vl(s)),wo}function an(){wo=null}function ar(a=J(),u=ke()){let d=a?.getDuration?.();return Number.isFinite(d)&&d>0?d:Number.isFinite(u?.duration)&&u.duration>0?u.duration:0}function Fa(){return ar()||rn()}function Vu(a){let u=a.querySelector(".time-diff");return u?(u.textContent?.trim()||"").startsWith("-"):!1}let qu="\u251C\u2500 ",Ua="\u2514\u2500 ",Va=/^[├└]─\s/;function sr(a){return Va.test(a)}function qa(a){return a.replace(Va,"")}function ja(a){let u=Re();if(a>=u.length-1)return Ua;let S=u[a+1].querySelector("input");return S&&sr(S.value)?qu:Ua}function ju(a,u){return`${ja(u)}${a}`}function Rt(){if(!s)return;Re().forEach((u,d)=>{let y=u.querySelector("input");if(!y||!sr(y.value))return;let S=qa(y.value),A=ju(S,d);y.value!==A&&(y.value=A)})}function So(){Ur(s),Mn&&(Mn=null),ot&&(ot(),ot=null,Vt=null)}function xo(){Fl(s,Pe)}function $a(a){Ni(s,a)}function fi(){Nl(s)}function hi(a){if(!(!r||!s)){if(Pe=a,a)r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),$a("Loading timestamps...");else if(fi(),r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),m){let u=J();if(u){let d=u.getCurrentTime(),y=Number.isFinite(d)?Math.max(0,Math.floor(d)):Math.max(0,rn()),S=s?Ln().rawTimes:[];m.textContent=Or(y,S,ar(u))}}!Pe&&s&&!Do(s)&&xo(),qt()}}function lr(a,u){a.dataset.time=String(u),a.textContent=hn(u,Fa())}let cr=null,ur=null,Pt=!1;function Wa(a,u){if(!a||typeof a.getVideoData!="function"||!(u!==void 0?u:!!a.getVideoData()?.isLive))return!1;if(typeof a.getProgressState=="function"){let y=a.getProgressState(),S=Number(y?.seekableEnd??y?.liveHead??y?.head??y?.duration),A=Number(y?.current??a.getCurrentTime?.());if(Number.isFinite(S)&&Number.isFinite(A))return S-A>2}return!1}function $u(a,u){if(!Number.isFinite(a))return;let d=Ya(a);gi(d,u)}function Tt(a=!1,u){if(En&&!a)return;let d;if(typeof u=="number"&&Number.isFinite(u))d=Math.max(0,Math.floor(u));else{let y=J(),S=y?y.getCurrentTime():NaN;d=Number.isFinite(S)?Math.max(0,Math.floor(S)):Math.max(0,rn())}Number.isFinite(d)&&$u(d,a)}function Ya(a){if(!Number.isFinite(a))return null;let{items:u,starts:d}=Ln(),y=-1,S=-1/0;for(let A=0;A<d.length;A++){let T=d[A];T<=a&&T>S&&(S=T,y=A)}return y>=0?u[y]:null}function gi(a,u=!1){let d=s?s.getElementsByClassName(Te):null;if(!(!!d&&(a?d.length===1&&d[0]===a:d.length===0))&&d)for(let S of Array.from(d))S.classList.contains(xe)||S.classList.remove(Te);if(a&&!a.classList.contains(xe)&&(a.classList.add(Te),u))try{if(s instanceof HTMLElement){let S=a.getBoundingClientRect(),A=s.getBoundingClientRect();!(S.bottom<A.top||S.top>A.bottom)||a.scrollIntoView({behavior:"smooth",block:"center"})}else a.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{a.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Wu(a){if(kt()||!Number.isFinite(a)||a===0)return!1;let u=Re();if(u.length===0)return!1;let d=[];return u.forEach(y=>{let S=y.querySelector("[data-time]"),A=S?.dataset.time;if(!S||!A)return;let T=Number.parseInt(A,10);if(!Number.isFinite(T))return;let x=Math.max(0,T+a);if(x!==T){lr(S,x);let L=y.dataset.guid;L&&d.push({guid:L,start:x,comment:y.querySelector("input")?.value??""})}}),d.length===0?!1:(sn(),Rt(),je(),vi(),Qa(Be,d),In=null,!0)}function Ka(a,u={}){if(!Number.isFinite(a)||a===0)return!1;if(!Wu(a)){if(u.alertOnNoChange){let T=u.failureMessage??"Offset did not change any timestamps.";alert(T)}return!1}let y=u.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${a>0?"+":""}${a} seconds (${y})`);let S=J(),A=S?Math.floor(S.getCurrentTime()):0;if(Number.isFinite(A)){let T=Ya(A);gi(T,!1)}return!0}function Xa(a){if(!s||Pe)return;let u=a.target instanceof Element?a.target:null;if(!u)return;let d=u.closest("[data-time]"),y=u.closest("[data-increment]"),S=u.closest("[data-action]");if(d?.dataset.time){a.preventDefault();let A=Number(d.dataset.time);if(Number.isFinite(A)){l(`Seeking to timestamp ${A}`),Pt=!0;let x=J();x&&x.seekTo(A),setTimeout(()=>{Pt=!1},500)}let T=d.closest("li");T&&(Re().forEach(x=>{x.classList.contains(xe)||x.classList.remove(Te)}),T.classList.contains(xe)||(T.classList.add(Te),T.scrollIntoView({behavior:"smooth",block:"center"})))}else if(y?.dataset.increment){a.preventDefault();let A=y.closest("li"),T=A?.querySelector("[data-time]");if(!T||!T.dataset.time)return;let x=parseInt(T.dataset.time,10),L=parseInt(y.dataset.increment,10);if("shiftKey"in a&&a.shiftKey&&(L*=mo),"altKey"in a?a.altKey:!1){Ka(L,{logLabel:"Alt adjust"});return}let F=Math.max(0,x+L);if(l(`Timestamps changed: Timestamp time incremented from ${x} to ${F}`),an(),lr(T,F),ur=F,cr&&clearTimeout(cr),Pt=!0,cr=setTimeout(()=>{if(ur!==null){let oe=J();oe&&oe.seekTo(ur)}cr=null,ur=null,setTimeout(()=>{Pt=!1},500)},500),sn(),Rt(),je(),A){let oe=A.querySelector("input"),we=A.dataset.guid;oe&&we&&(mr(Be,we,F,oe.value),In=we)}}else S?.dataset.action==="clear"&&(a.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",an(),je(),dr(),Xu(),G([]),Ku(Be),In=null,xo())}function To(a,u="",d=!1,y=null,S=!0){if(!s)return null;let A=Math.max(0,a),T=y??crypto.randomUUID(),x=document.createElement("li"),L=document.createElement("div"),C=document.createElement("span"),R=document.createElement("span"),F=document.createElement("span"),oe=document.createElement("div"),we=document.createElement("span"),ct=document.createElement("span"),Q=document.createElement("input"),re=document.createElement("button");x.dataset.guid=T,L.className="time-row",oe.className="ytls-row-controls";let Oe=document.createElement("div");Oe.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",Fe(Oe,"Click to toggle indent");let rt=document.createElement("span");rt.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let At=()=>{let U=Q.offsetTop,_=Q.offsetHeight||20;Oe.style.top=`${U}px`,Oe.style.height=`${_}px`},Dt=()=>{Ge(rt,sr(Q.value)?"indent-decrease":"indent-increase",18)},Vn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",ln=U=>{let _=rt.querySelector("svg");_&&(_.style.transition="filter 0.15s ease",_.style.filter=U?Vn:"none")},qn=U=>{U.stopPropagation();let _=sr(Q.value),pe=qa(Q.value),Z="";if(!_){let ut=Re().indexOf(x);Z=ja(ut)}Q.value=Z?`${Z}${pe}`:pe,Dt(),Rt();let ge=Number.parseInt(we.dataset.time??"0",10);mr(Be,T,ge,Q.value)};Oe.onclick=qn,Oe.append(rt),Oe.addEventListener("mouseenter",()=>{ln(!0)}),Oe.addEventListener("mouseleave",()=>{ln(!1)}),x.style.cssText="position:relative;padding-left:20px;",x.addEventListener("mouseenter",()=>{At(),Dt(),rt.style.display="inline"}),x.addEventListener("mouseleave",()=>{ln(!1),rt.style.display="none"}),x.addEventListener("mouseleave",()=>{x.dataset.guid===In&&Vu(x)&&Ja()}),Q.value=u||"",Q.style.cssText="width:100%;margin-top:5px;display:block;",Q.type="text",Q.setAttribute("inputmode","text"),Q.autocapitalize="off",Q.autocomplete="off",Q.spellcheck=!1,requestAnimationFrame(At);let Ao=!1;Q.addEventListener("focusin",()=>{yo=!1,Ao=!1}),Q.addEventListener("focusout",U=>{let _=U.relatedTarget,pe=Date.now()-za<250,Z=!!_&&!!r&&r.contains(_);!pe&&!Z&&!Ao&&(yo=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(Q.focus({preventScroll:!0}),yo=!1)},0))}),Q.addEventListener("keydown",U=>{(U.key==="Escape"||U.key==="Esc")&&(U.preventDefault(),Ao=!0,Q.blur())});let Eo=U=>{let _=Ut.get(T);_&&clearTimeout(_.timeoutId);let pe=Be,Z=()=>{let ge=Ut.get(T);ge&&(clearTimeout(ge.timeoutId),Ut.delete(T)),Za(pe,T,Number.parseInt(we.dataset.time??"0",10),Q.value)};Ut.set(T,{timeoutId:setTimeout(Z,U),flush:Z})};Q.addEventListener("input",U=>{let _=U;_&&(_.isComposing||_.inputType==="insertCompositionText")||Eo(500)}),Q.addEventListener("compositionend",()=>{Eo(50)});let jt="#f4ba78",vr="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",yr="#c8452d",wr="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",Bn=(U,_=jt,pe=vr)=>{U.style.color=_;let Z=U.querySelector("svg");Z&&(Z.style.transition="filter 0.15s ease"),U.addEventListener("mouseenter",()=>{Z&&(Z.style.filter=pe)}),U.addEventListener("mouseleave",()=>{Z&&(Z.style.filter="none")})};Ge(C,"circle-minus",18),C.classList.add("ytls-row-control"),C.dataset.increment="-1",C.style.cursor="pointer",C.style.margin="0px",Bn(C),Ge(F,"circle-plus",18),F.classList.add("ytls-row-control"),F.dataset.increment="1",F.style.cursor="pointer",F.style.margin="0px",Bn(F),Ge(R,"current-location",18),R.classList.add("ytls-row-control"),R.style.cursor="pointer",R.style.margin="0px",Fe(R,"Set to current playback time"),Bn(R),R.onclick=()=>{let U=J(),_=U?Math.floor(U.getCurrentTime()):0;Number.isFinite(_)&&(l(`Timestamps changed: set to current playback time ${_}`),an(),lr(we,_),sn(),Rt(),mr(Be,T,_,Q.value),In=T)},an(),lr(we,A),we.addEventListener("click",U=>{U.preventDefault(),U.stopPropagation();let _=Number(we.dataset.time);if(!Number.isFinite(_))return;l(`Seeking to timestamp ${_}`),Pt=!0;let pe=J();pe&&pe.seekTo(_);let Z=ke();Z?.paused&&Z.play(),setTimeout(()=>{Pt=!1},500),s?.querySelectorAll(`.${Te}`).forEach(ge=>ge.classList.remove(Te)),x.classList.contains(xe)||(x.classList.add(Te),x.scrollIntoView({behavior:"smooth",block:"center"}))}),Ge(re,"trash",16),re.classList.add("ytls-row-control"),re.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",Bn(re,yr,wr),re.onclick=()=>{let U=null,_=null,pe=null,Z=()=>{try{x.removeEventListener("click",_,!0)}catch{}try{document.removeEventListener("click",_,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",pe)}catch{}U&&(clearTimeout(U),U=null)};if(x.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let ge=x.dataset.guid??"",$e=Ut.get(ge);$e&&(clearTimeout($e.timeoutId),Ut.delete(ge)),Z(),x.remove(),an(),sn(),Rt(),je(),dr(),Ju(Be,ge),In=null,xo()}else{x.dataset.deleteConfirmed="true",x.classList.add(xe),x.classList.remove(Te);let ge=()=>{x.dataset.deleteConfirmed="false",x.classList.remove(xe);let $e=J(),ut=$e?$e.getCurrentTime():0,Ot=Number.parseInt(x.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(ut)&&Number.isFinite(Ot)&&ut>=Ot&&x.classList.add(Te),Z()};_=$e=>{$e.target!==re&&ge()},pe=()=>{x.dataset.deleteConfirmed==="true"&&ge()},x.addEventListener("click",_,!0),document.addEventListener("click",_,!0),s&&s.addEventListener("mouseleave",pe),U=setTimeout(()=>{x.dataset.deleteConfirmed==="true"&&ge(),Z()},5e3)}},ct.className="time-diff",ct.style.color="#888",ct.style.marginLeft="5px",oe.append(C,R,F,re),L.append(we,oe,ct),x.append(Oe,L,Q);let br=Number.parseInt(we.dataset.time??"0",10);if(S){fi();let U=!1,_=Re();for(let pe=0;pe<_.length;pe++){let Z=_[pe],$e=Z.querySelector("[data-time]")?.dataset.time;if(!$e)continue;let ut=Number.parseInt($e,10);if(Number.isFinite(ut)&&br<ut){s.insertBefore(x,Z),U=!0;break}}U||s.appendChild(x),x.scrollIntoView({behavior:"smooth",block:"center"}),an(),sn(),dr(),Rt(),je(),d||(mr(Be,T,A,u),In=T,gi(x,!1))}else Q.__ytls_li=x;return Q}function sn(){if(kt())return;let a=Fa(),u=Re();u.forEach((d,y)=>{let S=d.querySelector(".time-diff"),A=d.querySelector("[data-time]"),T=A?.dataset.time;if(A&&T){let ct=Number.parseInt(T,10);Number.isFinite(ct)&&(A.textContent=hn(ct,a))}if(!S)return;if(!T){S.textContent="";return}let x=Number.parseInt(T,10);if(!Number.isFinite(x)){S.textContent="";return}if(y===0){S.textContent="";return}let R=u[y-1].querySelector("[data-time]")?.dataset.time;if(!R){S.textContent="";return}let F=Number.parseInt(R,10);if(!Number.isFinite(F)){S.textContent="";return}let oe=x-F,we=oe<0?"-":"";S.textContent=` ${we}${hn(Math.abs(oe))}`})}function Ja(){if(kt())return;let a=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let T=document.activeElement,L=T.closest("li")?.dataset.guid;if(L){let C=T.selectionStart??T.value.length,R=T.selectionEnd??C,F=T.scrollLeft;a={guid:L,start:C,end:R,scroll:F}}}let u=Re();if(u.length===0)return;let d=u.map(T=>T.dataset.guid),y=u.map(T=>{let x=T.querySelector("[data-time]"),L=x?.dataset.time;if(!x||!L)return null;let C=Number.parseInt(L,10);if(!Number.isFinite(C))return null;let R=T.dataset.guid??"";return{time:C,guid:R,element:T}}).filter(T=>T!==null).sort((T,x)=>{let L=T.time-x.time;return L!==0?L:T.guid.localeCompare(x.guid)}),S=y.map(T=>T.guid),A=d.length!==S.length||d.some((T,x)=>T!==S[x]);if(s.replaceChildren(),y.forEach(T=>{s.appendChild(T.element)}),sn(),Rt(),je(),a){let x=Re().find(L=>L.dataset.guid===a.guid)?.querySelector("input");if(x)try{x.focus({preventScroll:!0})}catch{}}A&&(l("Timestamps changed: Timestamps sorted"),vi())}function dr(){if(!s||!r||!c||!f)return;let a=Re().length;De?.();let u=r.getBoundingClientRect(),d=c.getBoundingClientRect(),y=f.getBoundingClientRect(),S=Math.max(0,u.height-(d.height+y.height));a===0?(xo(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>S?"auto":"hidden"}function je(){if(!s)return;let a=ke(),u=document.querySelector(".ytp-progress-bar"),d=J(),y=d?d.getVideoData():null,S=!!y&&!!y.isLive;if(!a||!u||!isFinite(a.duration)||S)return;ts();let{items:A,starts:T}=Ln(),x=a.duration,L=document.createDocumentFragment();A.forEach((C,R)=>{let F=T[R];if(!Number.isFinite(F))return;C.dataset.guid||(C.dataset.guid=crypto.randomUUID());let oe=document.createElement("div");oe.className="ytls-marker",oe.style.left=F/x*100+"%",oe.dataset.time=String(F),L.appendChild(oe)}),u.appendChild(L),Yu(u)}function Yu(a){a.dataset.ytlsMarkerClicks||(a.dataset.ytlsMarkerClicks="1",a.addEventListener("click",u=>{let d=u.target?.closest?.(".ytls-marker");if(!d)return;let y=Number(d.dataset.time),S=J();S&&Number.isFinite(y)&&S.seekTo(y)}))}function vi(){G(mi().sort((a,u)=>a.start-u.start))}function Qa(a,u){!a||u.length===0||Pe||kt()||(rd(a,u).then(()=>{l(`Saved ${u.length} timestamps for ${a} to IndexedDB`),s&&ko()}).catch(d=>{let y=`Failed to save timestamps: ${d.message}`;l(`Failed to save timestamps for ${a} to IndexedDB:`,d,"error"),Cn(y)}),An({type:"timestamps_updated",videoId:a,action:"saved"}))}function Ku(a){!a||Pe||kt()||(ns(a).then(()=>{s&&ko()}).catch(u=>{let d=`Failed to clear timestamps: ${u.message}`;l(`Failed to clear timestamps for ${a}:`,u,"error"),Cn(d)}),An({type:"timestamps_updated",videoId:a,action:"saved"}))}function pr(){for(let{flush:a}of[...Ut.values()])a()}function Xu(){Ut.forEach(({timeoutId:a})=>clearTimeout(a)),Ut.clear()}function mr(a,u,d,y){!a||Pe||kt()||Za(a,u,d,y)}function Za(a,u,d,y){if(!a)return;let S={guid:u,start:d,comment:y};l(`Saving timestamp: guid=${u}, start=${d}, comment="${y}"`),id(a,S).then(()=>{s&&ko()}).catch(A=>{let T=`Failed to save timestamp: ${A.message}`;l(`Failed to save timestamp ${u}:`,A,"error"),Cn(T)}),An({type:"timestamps_updated",videoId:a,action:"saved"})}function Ju(a,u){!a||Pe||kt()||(ad(a,u).then(()=>{s&&ko()}).catch(d=>{let y=`Failed to delete timestamp: ${d.message}`;l(`Failed to delete timestamp ${u}:`,d,"error"),Cn(y)}),An({type:"timestamps_updated",videoId:a,action:"saved"}))}async function es(a){if(kt()){alert("Cannot export timestamps while an error is being displayed.");return}let u=Be;if(!u)return;l(`Exporting timestamps for video ID: ${u}`);let d=mi(),y=Pn();if(a==="json"){let S=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),A=URL.createObjectURL(S),T=document.createElement("a");T.href=A,T.download=`timestamps-${u}-${y}.json`,T.click(),URL.revokeObjectURL(A)}else if(a==="text"){let S=Mi(d,!0),A=new Blob([S],{type:"text/plain"}),T=URL.createObjectURL(A),x=document.createElement("a");x.href=T,x.download=`timestamps-${u}-${y}.txt`,x.click(),URL.revokeObjectURL(T)}}function Cn(a){if(!r||!s){l("Timekeeper error:",a,"error");return}zl(s,a),Vi(a),je()}function ko(){s&&(Gl(s),Vi(null))}function kt(){return!!(!s||Do(s)||Pe||Xl()!==null)}function ts(){document.querySelectorAll(".ytls-marker").forEach(a=>a.remove())}function Un(){if(!r||!document.body.contains(r))return;let a=r.getBoundingClientRect(),u=document.documentElement.clientWidth,d=document.documentElement.clientHeight,y=a.width,S=a.height;if(a.left<0&&(r.style.left="0",r.style.right="auto"),a.right>u){let A=Math.max(0,u-y);r.style.left=`${A}px`,r.style.right="auto"}if(a.top<0&&(r.style.top="0",r.style.bottom="auto"),a.bottom>d){let A=Math.max(0,d-S);r.style.top=`${A}px`,r.style.bottom="auto"}}function Qu(){if(Qo&&(document.removeEventListener("mousemove",Qo),Qo=null),Zo&&(document.removeEventListener("mouseup",Zo),Zo=null),ho&&(document.removeEventListener("keydown",ho),ho=null),er&&(window.removeEventListener("resize",er),er=null),go&&(document.removeEventListener("pointerdown",go,!0),go=null),vo&&(document.removeEventListener("pointerup",vo,!0),vo=null),St){try{St.disconnect()}catch{}St=null}if(xt){try{xt.disconnect()}catch{}xt=null}let a=ke();a&&(tr&&(a.removeEventListener("timeupdate",tr),tr=null),nr&&(a.removeEventListener("pause",nr),nr=null),or&&(a.removeEventListener("play",or),or=null),rr&&(a.removeEventListener("seeking",rr),rr=null),ir&&(a.removeEventListener("ratechange",ir),ir=null))}function Zu(){ts(),pr(),fo&&(clearTimeout(fo),fo=null),ue&&(clearInterval(ue),ue=null),wt&&(clearTimeout(wt),wt=null),Qu(),dl();try{Bt.close()}catch{}if(O&&O.parentNode===document.body&&document.body.removeChild(O),O=null,Xo=null,En=!1,Be=null,St){try{St.disconnect()}catch{}St=null}if(xt){try{xt.disconnect()}catch{}xt=null}r&&r.parentNode&&r.remove();let a=document.getElementById("ytls-header-button");a&&a.parentNode&&a.remove(),on=null,Jo=!1,te(null),So(),r=null,c=null,s=null,f=null,Xe=null,nn=null,De=null,m=null,g=null,E=null,lt=null}async function ed(){let a=hr();if(!a)return lt=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let u=await Gu();if(!li(u)){let d=zu(u),y=d.length?` Missing methods: ${d.join(", ")}.`:"",S=u?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return lt=null,{ok:!1,message:`${S}${y} Try refreshing once playback is ready.`}}return lt=u,{ok:!0,player:u,videoId:a}}async function fr(){if(!r||!s)return;let a=s.scrollTop,u=!0,d=()=>{if(!s||!u)return;let y=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(a,y)};try{let y=await ed();if(!y.ok){Cn(y.message),So(),je();return}let{videoId:S}=y,A=[];try{let T=await sd(S);T?(A=T.map(x=>({...x,guid:x.guid||crypto.randomUUID()})),l(`Loaded ${A.length} timestamps from IndexedDB for ${S}`),ko()):l(`No timestamps found in IndexedDB for ${S}`)}catch(T){let x=`Failed to load timestamps: ${T.message}`;l(`Failed to load timestamps from IndexedDB for ${S}:`,T,"error"),Cn(x),je();return}if(A.length>0){A.sort((L,C)=>L.start-C.start),So(),fi();let T=document.createDocumentFragment();A.forEach(L=>{let R=To(L.start,L.comment,!0,L.guid,!1).__ytls_li;R&&T.appendChild(R)}),r&&r.classList.contains("ytls-zoom-in")&&Me!=null?(l("Deferring timestamp DOM append until show animation completes"),Mn=T,Vt||(Vt=new Promise(L=>{ot=L})),await Vt):s&&(s.appendChild(T),an(),sn(),Rt(),je(),De&&requestAnimationFrame(De)),G(A),Tt(!0),u=!1}else So(),$a("No timestamps for this video"),je(),G([]),De&&requestAnimationFrame(De)}catch(y){l("Unexpected error while loading timestamps:",y,"error"),Cn("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Vt&&await Vt,requestAnimationFrame(d),De&&requestAnimationFrame(De),s&&!Do(s)&&xo()}}function hr(){let u=new URLSearchParams(location.search).get("v");if(u)return u;let d=document.querySelector('meta[itemprop="identifier"]');return d?.content?d.content:null}function td(a=null,u=null){if(!m)return;let d=ke(),y=u||J();if(!d&&!y)return;let S=a!==null?a:y?y.getCurrentTime():0,A=Number.isFinite(S)?Math.max(0,Math.floor(S)):Math.max(0,rn()),{isLive:T}=y?y.getVideoData()||{isLive:!1}:{isLive:!1},x=y?Wa(y,!!T):!1,L=s?Ln().rawTimes:[];m.textContent=Or(A,L,ar(y,d)),m.style.color=x?"#ff4d4f":""}function nd(){let a=ke();if(!a)return;let u=NaN,d=null,y=()=>{if(!s)return;let C=J(),R=C?Math.floor(C.getCurrentTime()):0;if(!Number.isFinite(R))return;let F=Ln();if(R===u&&F===d)return;let oe=!!m&&!Pe&&!Pt;oe&&td(R,C),Tt(!1,R),oe&&!En&&(u=R,d=F)},S=C=>{try{let R=new URL(window.location.href);C!==null&&Number.isFinite(C)?R.searchParams.set("t",`${Math.floor(C)}s`):R.searchParams.delete("t"),window.history.replaceState(window.history.state,"",R.toString())}catch{}},A=()=>{let C=J(),R=C?C.getCurrentTime():NaN,F=Number.isFinite(R)?Math.max(0,Math.floor(R)):Math.max(0,rn());if(Number.isFinite(F)){S(F);try{Tt(!0)}catch(oe){l("Failed to highlight nearest timestamp on pause:",oe,"warn")}}},T=()=>{S(null);try{let C=J(),R=C?C.getCurrentTime():NaN,F=Number.isFinite(R)?Math.max(0,Math.floor(R)):Math.max(0,rn());Number.isFinite(F)&&Tt(!0)}catch(C){l("Failed to highlight nearest timestamp on play:",C,"warn")}},x=()=>{let C=ke();if(!C)return;let R=J(),F=R?Math.floor(R.getCurrentTime()):0;Number.isFinite(F)&&(C.paused&&S(F),Tt(!0,F))},L=()=>{let C=a.playbackRate;w?w=!1:kn(C),Ct(C)};tr=y,nr=A,or=T,rr=x,ir=L,a.addEventListener("timeupdate",y),a.addEventListener("pause",A),a.addEventListener("play",T),a.addEventListener("seeking",x),a.addEventListener("ratechange",L)}let{saveToIndexedDB:od,saveRowsToIndexedDB:rd,saveSingleTimestampToIndexedDB:id,deleteSingleTimestampFromIndexedDB:ad,loadFromIndexedDB:sd,removeFromIndexedDB:ns,saveGlobalSettings:gr,loadGlobalSettings:yi,buildExportPayload:ld,mergeBackupData:cd,exportAllTimestamps:ud,exportAllTimestampsCsv:dd}=Gr;function os(){if(!r)return;let a=r.style.display!=="none";gr("uiVisible",a)}function qt(a){let u=typeof a=="boolean"?a:!!r&&r.style.display!=="none",d=document.getElementById("ytls-header-button");d instanceof HTMLButtonElement&&d.setAttribute("aria-pressed",String(u)),on&&!Jo&&on.src!==_r&&(on.src=_r)}function pd(){r&&yi("uiVisible").then(a=>{let u=Rn().safeParse(a),d=u.success?u.data:void 0;typeof d=="boolean"?(d?(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in")):r.style.display="none",qt(d)):(!u.success&&a!==void 0&&l("UI visibility state failed validation, defaulting to visible",u.error.message,"warn"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0))}).catch(a=>{l("Failed to load UI visibility state:",a,"error"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0)})}function wi(a){if(!r){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(r)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(S=>{S!==r&&S.remove()}),document.body.appendChild(r));let u=document.querySelectorAll("#ytls-pane");u.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${u.length}), cleaning up`),u.forEach(S=>{S!==r&&S.remove()})),wt&&(clearTimeout(wt),wt=null);let d=r.style.display==="none";(typeof a=="boolean"?a:d)?(r.style.display="flex",r.classList.remove("ytls-fade-out"),r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0),os(),Se(),Me&&(clearTimeout(Me),Me=null),Me=setTimeout(()=>{Ee(),De?.(),be(),se(!0);try{Tt(!0)}catch(S){l("Failed to scroll to nearest timestamp after toggle:",S,"warn")}Me=null},450)):(r.classList.remove("ytls-fade-in"),r.classList.remove("ytls-zoom-in"),r.classList.add("ytls-zoom-out"),qt(!1),ce())}function rs(a){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let u=!1,d=[],y=(S,A)=>{let T=S.querySelector("input");if(!T)return;T.value=A;let x=S.dataset.guid,L=Number.parseInt(S.querySelector("[data-time]")?.dataset.time??"",10);x&&Number.isFinite(L)&&d.push({guid:x,start:L,comment:A})};try{let S=JSON.parse(a),A=null;if(Array.isArray(S))A=S;else if(typeof S=="object"&&S!==null){let T=Be;if(T){let x=`timekeeper-${T}`;S[x]&&Array.isArray(S[x].timestamps)&&(A=S[x].timestamps,l(`Found timestamps for current video (${T}) in export format`,"info"))}if(!A){let x=Object.keys(S).filter(L=>L.startsWith("ytls-"));if(x.length===1&&Array.isArray(S[x[0]].timestamps)){A=S[x[0]].timestamps;let L=S[x[0]].video_id;l(`Found timestamps for video ${L} in export format`,"info")}}}A&&Array.isArray(A)?A.every(x=>typeof x.start=="number"&&typeof x.comment=="string")?(A.forEach(x=>{if(x.guid){let L=Re().find(C=>C.dataset.guid===x.guid);L?y(L,x.comment):To(x.start,x.comment,!1,x.guid)}else To(x.start,x.comment,!1,crypto.randomUUID())}),u=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!u){let S=a.split(`
`).map(A=>A.trim()).filter(A=>A);if(S.length>0){let A=!1;S.forEach(T=>{let x=T.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(x){A=!0;let L=parseInt(x[1])||0,C=parseInt(x[2]),R=parseInt(x[3]),F=L*3600+C*60+R,oe=x[4]?x[4].trim():"",we=null,ct=oe,Q=oe.match(/<!--\s*guid:([^>]+?)\s*-->/);Q&&(we=Q[1].trim(),ct=oe.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let re;we&&(re=Re().find(Oe=>Oe.dataset.guid===we)),!re&&!we&&(re=Re().find(Oe=>{if(Oe.dataset.guid)return!1;let At=Oe.querySelector("[data-time]")?.dataset.time;if(!At)return!1;let Dt=Number.parseInt(At,10);return Number.isFinite(Dt)&&Dt===F})),re?y(re,ct):To(F,ct,!1,we||crypto.randomUUID())}}),A&&(u=!0)}}u?(l("Timestamps changed: Imported timestamps from file/clipboard"),Rt(),vi(),Qa(Be,d),je(),dr()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function md(){if(pi){l("Pane initialization already in progress, skipping duplicate call");return}if(!(r&&document.body.contains(r))){pi=!0;try{let S=function(p=null,v=null){if(!m)return;let b=ke(),k=v||J();if(!b&&!k)return;let I=p!==null?p:k?k.getCurrentTime():0,Y=Number.isFinite(I)?Math.max(0,Math.floor(I)):Math.max(0,rn()),{isLive:D}=k?k.getVideoData()||{isLive:!1}:{isLive:!1},z=k?Wa(k,!!D):!1,B=s?Ln().rawTimes:[];m.textContent=Or(Y,B,ar(k,b)),m.style.color=z?"#ff4d4f":"",y(!!D);try{Ct()}catch{}},A=function(){if(Pe||Pt)return;let p=J();if(!p)return;let v=p.getCurrentTime(),b=Number.isFinite(v)?Math.max(0,Math.floor(v)):Math.max(0,rn());S(b,p),(s?Re():[]).length>0&&Tt(!1,b)},re=function(p,v,b,k){let I=document.createElement("button");return k?$(I,k,p):I.textContent=p,Fe(I,v),I.classList.add("ytls-settings-modal-button"),I.onclick=b,I},Oe=function(p="general"){if(O&&O.parentNode===document.body){let ie=document.getElementById("ytls-save-modal"),mn=document.getElementById("ytls-load-modal"),Yt=document.getElementById("ytls-delete-all-modal");ie&&document.body.contains(ie)&&document.body.removeChild(ie),mn&&document.body.contains(mn)&&document.body.removeChild(mn),Yt&&document.body.contains(Yt)&&document.body.removeChild(Yt),O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",At,!0),document.removeEventListener("keydown",rt)},300);return}O=document.createElement("div"),O.id="ytls-settings-modal",O.classList.remove("ytls-fade-out"),O.classList.add("ytls-fade-in");let v=document.createElement("div");v.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let k=document.createElement("button");k.className="ytls-modal-close-button",Ge(k,"x",14),k.onclick=()=>{if(O&&O.parentNode===document.body){let ie=document.getElementById("ytls-save-modal"),mn=document.getElementById("ytls-load-modal"),Yt=document.getElementById("ytls-delete-all-modal");ie&&document.body.contains(ie)&&document.body.removeChild(ie),mn&&document.body.contains(mn)&&document.body.removeChild(mn),Yt&&document.body.contains(Yt)&&document.body.removeChild(Yt),O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",At,!0),document.removeEventListener("keydown",rt)},300)}};let I=document.createElement("div");I.id="ytls-settings-content";let Y=document.createElement("h3");Y.className="ytls-section-heading",Y.textContent="General",Y.style.display="none";let D=document.createElement("div"),z=document.createElement("div");z.className="ytls-button-grid";let B=document.createElement("div");B.className="ytls-button-grid";function K(ie){D.style.display=ie==="general"?"block":"none",z.style.display=ie==="google"?"block":"none",B.style.display=ie==="sync"?"block":"none",fe.classList.toggle("active",ie==="general"),Je.classList.toggle("active",ie==="google"),Et.classList.toggle("active",ie==="sync"),Y.textContent=ie==="general"?"General":ie==="google"?"Google":"Sync"}let fe=document.createElement("button");fe.appendChild(Xn("adjustments-horizontal",16));let Ie=document.createElement("span");Ie.className="ytls-tab-text",Ie.textContent=" General",fe.appendChild(Ie),Fe(fe,"General settings"),fe.classList.add("ytls-settings-modal-button"),fe.onclick=()=>K("general");let Je=document.createElement("button");Je.appendChild(Xn("cloud",16));let un=document.createElement("span");un.className="ytls-tab-text",un.textContent=" Google",Je.appendChild(un),Fe(Je,"Google Drive backup settings"),Je.classList.add("ytls-settings-modal-button"),Je.onclick=async()=>{vt.isSignedIn&&await Cu(),K("google")};let Et=document.createElement("button");Et.appendChild(Xn("server",16));let dn=document.createElement("span");dn.className="ytls-tab-text",dn.textContent=" Sync",Et.appendChild(dn),Fe(Et,"Live sync across devices"),Et.classList.add("ytls-settings-modal-button"),Et.onclick=()=>K("sync"),b.appendChild(fe),b.appendChild(Je),b.appendChild(Et),v.appendChild(b),v.appendChild(k),O.appendChild(v),D.className="ytls-button-grid",D.appendChild(re("Save","Save As...",Dt.onclick,"device-floppy")),D.appendChild(re("Load","Load",Vn.onclick,"folder-open")),D.appendChild(re("Export All","Export All Data",ln.onclick,"file-export")),D.appendChild(re("Import All","Import All Data",qn.onclick,"file-import")),D.appendChild(re("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await dd()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let $t=re(vt.isSignedIn?"Sign Out":"Sign In",vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{vt.isSignedIn?await Lu():await Mu(),$($t,vt.isSignedIn?"logout":"login",vt.isSignedIn?"Sign Out":"Sign In"),Fe($t,vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),Ae()},vt.isSignedIn?"logout":"login"),Mo=re(Yo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await _u(),Mr(),Ae()},"refresh"),fs=re(`Backup Interval: ${Gt()}min`,"Set periodic backup interval (minutes)",async()=>{await Hu(),Mr(),Ae()},"clock-plus"),Mr=()=>{$($t,vt.isSignedIn?"logout":"login",vt.isSignedIn?"Sign Out":"Sign In"),Fe($t,vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),$(Mo,"refresh",Yo()?"Auto Backup: On":"Auto Backup: Off"),$(fs,"clock-plus",`Backup Interval: ${Gt()}min`),typeof Ae=="function"&&Ae()};z.appendChild($t),z.appendChild(Mo),z.appendChild(fs),z.appendChild(re("Backup Now","Run a backup immediately",async()=>{await Wo({silent:!1,skipBackoff:!0}),Mr()},"database"));let Wt=document.createElement("div");Wt.style.marginTop="15px",Wt.style.paddingTop="10px",Wt.style.borderTop="1px solid #555",Wt.style.fontSize="12px",Wt.style.color="#aaa";let Ir=document.createElement("div");Ir.style.marginBottom="8px",Ir.style.fontWeight="bold",Wt.appendChild(Ir),vu(Ir);let Ti=document.createElement("div");Ti.style.marginBottom="8px",hu(Ti),Wt.appendChild(Ti);let hs=document.createElement("div");gu(hs),Wt.appendChild(hs),z.appendChild(Wt),nt(),uo(),Ae(),Mr();let Lr=re("Sign In","Sign in to Timekeeper Sync with Google",async()=>{He().isSignedIn?await ru():await tu()},"login"),gs=re("Sync Now","Sync with the server immediately",()=>wa(),"refresh"),vs=re("Share Subscriptions","Let Timekeeper Sync read which channels you subscribe to (read-only), to work out which members-only videos you can access",async()=>{try{await nu()}catch{}},"users");Uc(()=>{let ie=He().isSignedIn;$(Lr,ie?"logout":"login",ie?"Sign Out":"Sign In"),Fe(Lr,ie?"Sign out of Timekeeper Sync":"Sign in to Timekeeper Sync with Google"),Lr.disabled=!ie&&!Hn(),gs.disabled=!ie,vs.disabled=!ie}),B.appendChild(Lr),B.appendChild(gs),B.appendChild(vs);let pn=document.createElement("div");pn.style.marginTop="15px",pn.style.paddingTop="10px",pn.style.borderTop="1px solid #555",pn.style.fontSize="12px",pn.style.color="#aaa";let Cr=document.createElement("div");Cr.style.marginBottom="8px",Cr.style.fontWeight="bold",pn.appendChild(Cr),Gc(Cr);let ys=document.createElement("div");pn.appendChild(ys),Fc(ys),B.appendChild(pn),ao(),I.appendChild(Y),I.appendChild(D),I.appendChild(z),I.appendChild(B),K(p==="drive"?"google":p),O.appendChild(I),document.body.appendChild(O),requestAnimationFrame(()=>{let ie=O.getBoundingClientRect(),Yt=(window.innerHeight-ie.height)/2;O.style.top=`${Math.max(20,Yt)}px`,O.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",At,!0),document.addEventListener("keydown",rt)},0)},rt=function(p){if(p.key==="Escape"&&O&&O.parentNode===document.body){let v=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");if(v||b||k)return;p.preventDefault(),v&&document.body.contains(v)&&document.body.removeChild(v),b&&document.body.contains(b)&&document.body.removeChild(b),k&&document.body.contains(k)&&document.body.removeChild(k),O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",At,!0),document.removeEventListener("keydown",rt)},300)}},At=function(p){if(Xo&&Xo.contains(p.target))return;let v=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");v&&v.contains(p.target)||b&&b.contains(p.target)||k&&k.contains(p.target)||O&&O.contains(p.target)||(v&&document.body.contains(v)&&document.body.removeChild(v),b&&document.body.contains(b)&&document.body.removeChild(b),k&&document.body.contains(k)&&document.body.removeChild(k),O&&O.parentNode===document.body&&(O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",At,!0),document.removeEventListener("keydown",rt)},300)))},Ao=function(){r&&(l("Loading window position from IndexedDB"),yi("windowPosition").then(p=>{let v=Ss.safeParse(p);if(v.success){let k=v.data;r.style.left=`${k.x}px`,r.style.top=`${k.y}px`,r.style.right="auto",r.style.bottom="auto",typeof k.width=="number"&&k.width>0?r.style.width=`${k.width}px`:(r.style.width=`${ci}px`,l(`No stored window width found, using default width ${ci}px`)),typeof k.height=="number"&&k.height>0?r.style.height=`${k.height}px`:(r.style.height=`${ui}px`,l(`No stored window height found, using default height ${ui}px`));let I=P();ye(I,k.x,k.y),l("Restored window position from IndexedDB:",me())}else v.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",v.error.message,"warn"),r.style.width=`${ci}px`,r.style.height=`${ui}px`,te(null);Un();let b=P();b&&(b.width||b.height)&&ye(b),De?.()}).catch(p=>{l("failed to load pane position from IndexedDB:",p,"warn"),Un();let v=P();v&&(v.width||v.height)&&te({x:Math.max(0,Math.round(v.left)),y:0,width:Math.round(v.width),height:Math.round(v.height)}),De?.()}))},Eo=function(){if(!r)return;let p=P();if(!p)return;let v={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)},b=me();if(b&&b.x===v.x&&b.y===v.y&&b.width===v.width&&b.height===v.height){l("Skipping window position save; position and size unchanged");return}te({...v}),l(`Saving window position and size to IndexedDB: x=${v.x}, y=${v.y}, width=${v.width}, height=${v.height}`),gr("windowPosition",v),An({type:"window_position_updated",position:v,timestamp:Date.now()})},Tr=function(p,v){p.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),r&&(r.style.width="300px",r.style.height="300px",Eo(),Er())}),p.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),Ot=!0,cn=v,ss=b.clientX,ls=b.clientY;let k=r.getBoundingClientRect();jn=k.width,$n=k.height,Sr=k.left,xr=k.top,cs=document.documentElement.clientWidth,us=document.documentElement.clientHeight,v==="top-left"||v==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},ps=function(){if(!s||!nn)return;let{scrollTop:p,scrollHeight:v,clientHeight:b}=s;if(v<=b)return;let k=Math.max(30,b/v*b),I=p/(v-b)*(b-k);nn.style.height=`${k}px`,nn.style.top=`${I}px`},ms=function(){Xe&&(xi===null&&(xi=requestAnimationFrame(()=>{xi=null,ps()})),Xe.classList.add("ytls-scrollbar-visible"),bt&&clearTimeout(bt),bt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),bt=null},500))},Er=function(){if(r&&c&&f&&s){let p=r.getBoundingClientRect(),v=c.getBoundingClientRect(),b=f.getBoundingClientRect(),k=p.height-(v.height+b.height);s.style.maxHeight=k>0?k+"px":"0px",s.style.overflowY=k>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),!document.getElementById("ytls-styles")){let p=document.createElement("style");p.id="ytls-styles",p.textContent=sl,document.head.appendChild(p)}r=document.createElement("div"),c=document.createElement("div"),s=document.createElement("ul"),f=document.createElement("div"),m=document.createElement("span"),E=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=p=>{p.stopPropagation(),Oe(Vo()?"sync":"drive")},s.addEventListener("mouseenter",()=>{En=!0,yo=!1}),s.addEventListener("mouseleave",()=>{En=!1;try{Ii()}catch{}if(yo)return;Tt(!1);let p=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(p=document.activeElement.closest("li")?.dataset.guid??null),Ja(),p){let b=Re().find(k=>k.dataset.guid===p)?.querySelector("input");if(b)try{b.focus({preventScroll:!0})}catch{}}}),r.id="ytls-pane",c.id="ytls-pane-header",c.addEventListener("dblclick",p=>{let v=p.target instanceof Element?p.target:null;if(v){let b=v;for(;b&&b!==r;){if(window.getComputedStyle(b).cursor==="pointer")return;b=b.parentElement}}p.preventDefault(),wi(!1)});let a=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{r.addEventListener(p,a)}),r.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),r.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0),E.textContent=`v${Pr}`,E.classList.add("ytls-version-display");let u=document.createElement("span");u.style.display="inline-flex",u.style.alignItems="center",u.style.gap="6px",u.appendChild(E),u.appendChild(M),m.id="ytls-current-time",m.textContent="\u2014",m.style.cursor="default",Fe(m,()=>{let p=J(),{isLive:v}=p?p.getVideoData()||{isLive:!1}:{isLive:!1};return v?"Skip to live":""}),g=document.createElement("span"),g.id="ytls-playback-speed",g.textContent="1x",g.style.cursor="pointer",g.style.userSelect="none",Fe(g,()=>`Current playback speed. Click to toggle between 1x and ${tn(h)}x.`),g.onclick=()=>{Pa()},g.addEventListener("mousedown",p=>{p.stopPropagation()}),g.addEventListener("click",p=>{p.stopPropagation()}),m.onclick=()=>{let p=J();if(!p)return;let{isLive:v}=p.getVideoData()||{isLive:!1};v&&(Pt=!0,p.seekToLiveHead(),setTimeout(()=>{Pt=!1},500))};let y=p=>{m.style.cursor=p?"pointer":"default"};A(),ue&&clearInterval(ue),ue=setInterval(A,1e3),f.id="ytls-buttons";let T=(p,v)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),v&&v()},300)},x=p=>v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),p())},L=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},C=(p,v)=>b=>{p.contains(b.target)||v()},R=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(kt())return;let p=typeof Gn<"u"?Gn:0,v=J(),b=v?Math.floor(v.getCurrentTime()+p):0;if(!Number.isFinite(b))return;let k=To(b,"");k&&k.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>Oe()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(p){if(kt()){Ge(this,"circle-x",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3);return}let v=mi();if(v.length===0){Ge(this,"circle-x",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3);return}let b=p.ctrlKey,k=Mi(v,b);navigator.clipboard.writeText(k).then(()=>{Ge(this,"circle-check",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3)}).catch(I=>{l("Failed to copy timestamps: ",I,"error"),Ge(this,"circle-x",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(kt())return;if(Re().length===0){alert("No timestamps available to offset.");return}let v=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(v===null)return;let b=v.trim();if(b.length===0)return;let k=Number.parseInt(b,10);if(!Number.isFinite(k)){alert("Please enter a valid integer number of seconds.");return}k!==0&&Ka(k,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let p=hr();if(!p){alert("Unable to determine current video ID.");return}let v=document.createElement("div");v.id="ytls-delete-all-modal",v.classList.remove("ytls-fade-out"),v.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let k=document.createElement("p");k.textContent=p,k.style.fontFamily="monospace",k.style.fontSize="12px",k.style.marginBottom="15px",k.style.color="#aaa";let I=document.createElement("button");I.classList.add("ytls-save-modal-button"),I.style.background="#d32f2f",I.style.position="relative",I.style.overflow="hidden";let Y=null,D=0,z=null,B=document.createElement("div");B.style.position="absolute",B.style.left="0",B.style.top="0",B.style.height="100%",B.style.width="0%",B.style.background="#ff6b6b",B.style.transition="none",B.style.pointerEvents="none",I.appendChild(B);let K=document.createElement("span");K.textContent="Hold to Delete All",K.style.position="relative",K.style.zIndex="1",I.appendChild(K);let fe=()=>{if(!D)return;let $t=Date.now()-D,Mo=Math.min($t/5e3*100,100);B.style.width=`${Mo}%`,Mo<100&&(z=requestAnimationFrame(fe))},Ie=()=>{Y&&(clearTimeout(Y),Y=null),z&&(cancelAnimationFrame(z),z=null),D=0,B.style.width="0%",K.textContent="Hold to Delete All"};I.onmousedown=()=>{D=Date.now(),K.textContent="Deleting...",z=requestAnimationFrame(fe),Y=setTimeout(async()=>{Ie(),v.classList.remove("ytls-fade-in"),v.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(v)&&document.body.removeChild(v);try{await ns(p),bi()}catch($t){l("Failed to delete all timestamps:",$t,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},I.onmouseup=Ie,I.onmouseleave=Ie;let Je=null,un=null,Et=T(v,()=>{Ie(),Je&&document.removeEventListener("keydown",Je),un&&document.removeEventListener("click",un,!0)});Je=x(Et),un=C(v,Et);let dn=document.createElement("button");dn.textContent="Cancel",dn.classList.add("ytls-save-modal-cancel-button"),dn.onclick=Et,v.appendChild(b),v.appendChild(k),v.appendChild(I),v.appendChild(dn),document.body.appendChild(v),L(Je),R(un)}}].forEach(p=>{let v=document.createElement("button");Ge(v,p.icon,20),Fe(v,p.title),v.classList.add("ytls-main-button"),p.id==="copy"?v.onclick=function(b){p.action.call(this,b)}:v.onclick=p.action,p.id==="settings"&&(Xo=v),f.appendChild(v)});let Dt=document.createElement("button");$(Dt,"device-floppy","Save"),Dt.classList.add("ytls-file-operation-button"),Dt.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let v=document.createElement("p");v.textContent="Save as:";let b=null,k=null,I=T(p,()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0)});b=x(I),k=C(p,I);let Y=document.createElement("button");Y.textContent="JSON",Y.classList.add("ytls-save-modal-button"),Y.onclick=()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),T(p,()=>es("json"))()};let D=document.createElement("button");D.textContent="Plain Text",D.classList.add("ytls-save-modal-button"),D.onclick=()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),T(p,()=>es("text"))()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=I,p.appendChild(v),p.appendChild(Y),p.appendChild(D),p.appendChild(z),document.body.appendChild(p),L(b),R(k)};let Vn=document.createElement("button");$(Vn,"folder-open","Load"),Vn.classList.add("ytls-file-operation-button"),Vn.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let v=document.createElement("p");v.textContent="Load from:";let b=null,k=null,I=T(p,()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0)});b=x(I),k=C(p,I);let Y=document.createElement("button");Y.textContent="File",Y.classList.add("ytls-save-modal-button"),Y.onclick=()=>{let B=document.createElement("input");B.type="file",B.accept=".json,.txt",B.classList.add("ytls-hidden-file-input"),B.onchange=K=>{let fe=K.target.files?.[0];if(!fe)return;b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),I();let Ie=new FileReader;Ie.onload=()=>{let Je=String(Ie.result).trim();rs(Je)},Ie.readAsText(fe)},B.click()};let D=document.createElement("button");D.textContent="Clipboard",D.classList.add("ytls-save-modal-button"),D.onclick=async()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),T(p,async()=>{try{let B=await navigator.clipboard.readText();B?rs(B.trim()):alert("Clipboard is empty.")}catch(B){l("Failed to read from clipboard: ",B,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=I,p.appendChild(v),p.appendChild(Y),p.appendChild(D),p.appendChild(z),document.body.appendChild(p),L(b),R(k)};let ln=document.createElement("button");$(ln,"file-export","Export"),ln.classList.add("ytls-file-operation-button"),ln.onclick=async()=>{try{await ud()}catch{alert("Failed to export data: Could not read from database.")}};let qn=document.createElement("button");$(qn,"file-import","Import"),qn.classList.add("ytls-file-operation-button"),qn.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=v=>{let b=v.target.files?.[0];if(!b)return;let k=new FileReader;k.onload=()=>{try{let I=JSON.parse(String(k.result)),Y=[];for(let D in I)if(Object.prototype.hasOwnProperty.call(I,D)&&D.startsWith("ytls-")){let z=D.substring(5),B=I[D];if(B&&typeof B.video_id=="string"&&Array.isArray(B.timestamps)){let K=B.timestamps.map(Ie=>({...Ie,guid:Ie.guid||crypto.randomUUID()})),fe=od(z,K).then(()=>l(`Imported ${z} to IndexedDB`)).catch(Ie=>l(`Failed to import ${z} to IndexedDB:`,Ie,"error"));Y.push(fe)}else l(`Skipping key ${D} during import due to unexpected data format.`,"warn")}Promise.all(Y).then(()=>{bi()}).catch(D=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",D,"error")})}catch(I){alert(`Failed to import data. Please ensure the file is in the correct format.
`+I.message),l("Import error:",I,"error")}},k.readAsText(b)},p.click()},s.onclick=p=>{Xa(p)},s.ontouchstart=p=>{Xa(p)},r.style.position="fixed",r.style.bottom="0",r.style.right="0",r.style.transition="none",Ao(),setTimeout(()=>Un(),10);let jt=!1,vr=0,yr=0,wr=0,Bn=0,br=0,U=0,_=null,pe=!1;r.addEventListener("mousedown",p=>{let v=p.target;if(!(v instanceof Element)||v instanceof HTMLInputElement||v instanceof HTMLTextAreaElement||v instanceof Element&&(v.closest("#ytls-playback-speed-group")||v.closest("#ytls-playback-speed"))||v!==c&&!c.contains(v)&&window.getComputedStyle(v).cursor==="pointer")return;jt=!0,pe=!1;let b=r.getBoundingClientRect();vr=p.clientX-b.left,yr=p.clientY-b.top,wr=b.width,Bn=b.height,br=document.documentElement.clientWidth,U=document.documentElement.clientHeight,r.style.transition="none"}),document.addEventListener("mousemove",Qo=p=>{if(!jt)return;pe=!0;let v=p.clientX,b=p.clientY;_===null&&(_=requestAnimationFrame(()=>{if(_=null,!jt)return;let k=Math.max(0,Math.min(v-vr,br-wr)),I=Math.max(0,Math.min(b-yr,U-Bn));r.style.left=`${k}px`,r.style.top=`${I}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",Zo=()=>{if(!jt)return;jt=!1,_!==null&&(cancelAnimationFrame(_),_=null);let p=pe;setTimeout(()=>{pe=!1},50),Un(),setTimeout(()=>{p&&Eo()},200)}),r.addEventListener("dragstart",p=>p.preventDefault());let Z=document.createElement("div"),ge=document.createElement("div"),$e=document.createElement("div"),ut=document.createElement("div");Z.id="ytls-resize-tl",ge.id="ytls-resize-tr",$e.id="ytls-resize-bl",ut.id="ytls-resize-br";let Ot=!1,ss=0,ls=0,jn=0,$n=0,Sr=0,xr=0,cs=0,us=0,Wn=null,cn=null;Tr(Z,"top-left"),Tr(ge,"top-right"),Tr($e,"bottom-left"),Tr(ut,"bottom-right"),document.addEventListener("mousemove",p=>{if(!Ot||!r||!cn)return;let v=p.clientX,b=p.clientY;Wn===null&&(Wn=requestAnimationFrame(()=>{if(Wn=null,!Ot||!r||!cn)return;let k=v-ss,I=b-ls,Y=cs,D=us,z=jn,B=$n,K=Sr,fe=xr;cn==="bottom-right"?(z=Math.max(200,Math.min(800,jn+k)),B=Math.max(250,Math.min(D,$n+I))):cn==="top-left"?(z=Math.max(200,Math.min(800,jn-k)),K=Sr+k,B=Math.max(250,Math.min(D,$n-I)),fe=xr+I):cn==="top-right"?(z=Math.max(200,Math.min(800,jn+k)),B=Math.max(250,Math.min(D,$n-I)),fe=xr+I):cn==="bottom-left"&&(z=Math.max(200,Math.min(800,jn-k)),K=Sr+k,B=Math.max(250,Math.min(D,$n+I))),K=Math.max(0,Math.min(K,Y-z)),fe=Math.max(0,Math.min(fe,D-B)),r.style.width=`${z}px`,r.style.height=`${B}px`,r.style.left=`${K}px`,r.style.top=`${fe}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Ot&&(Ot=!1,Wn!==null&&(cancelAnimationFrame(Wn),Wn=null),cn=null,document.body.style.cursor="",se(!0))});let kr=null;window.addEventListener("resize",er=()=>{kr&&clearTimeout(kr),kr=setTimeout(()=>{se(!0),De?.(),kr=null},200)}),c.appendChild(m);let Yn=document.createElement("span");Yn.id="ytls-playback-speed-group",Yn.style.display="inline-flex",Yn.style.alignItems="center",Yn.style.marginLeft="4px",g&&Yn.appendChild(g),c.appendChild(Yn),c.appendChild(u);let Si=document.createElement("div");Si.id="ytls-list-wrapper",Xe=document.createElement("div"),Xe.className="ytls-scrollbar-track",nn=document.createElement("div"),nn.className="ytls-scrollbar-thumb",Xe.append(nn),Si.append(s,Xe);let Ar=document.createElement("div");Ar.id="ytls-content",Ar.append(Si),Ar.append(f),r.append(c,Ar,Z,ge,$e,ut);let ds="";r.addEventListener("mousemove",p=>{if(jt||Ot)return;let v=r.getBoundingClientRect(),b=20,k=p.clientX,I=p.clientY,Y=k-v.left<=b,D=v.right-k<=b,z=I-v.top<=b,B=v.bottom-I<=b,K="";z&&Y||B&&D?K="nwse-resize":(z&&D||B&&Y)&&(K="nesw-resize"),K!==ds&&(ds=K,document.body.style.cursor=K)});let xi=null;if(Xe.addEventListener("mouseenter",()=>{bt&&(clearTimeout(bt),bt=null),Xe.classList.add("ytls-scrollbar-visible")}),Xe.addEventListener("mouseleave",()=>{di||(bt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),bt=null},500))}),nn.addEventListener("mousedown",p=>{if(!s)return;p.preventDefault(),p.stopPropagation(),di=!0;let v=p.clientY,b=s.scrollTop,{scrollHeight:k,clientHeight:I}=s,Y=Math.max(30,I/k*I),D=k-I,z=I-Y;function B(fe){if(!s)return;let Ie=fe.clientY-v;s.scrollTop=Math.max(0,Math.min(D,b+Ie*(D/z))),ps()}function K(){di=!1,document.removeEventListener("mousemove",B),document.removeEventListener("mouseup",K),Xe?.matches(":hover")||(bt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),bt=null},500))}document.addEventListener("mousemove",B),document.addEventListener("mouseup",K)}),r.addEventListener("mouseenter",()=>{En=!0,ms()}),s.addEventListener("scroll",ms),r.addEventListener("mouseleave",()=>{!Ot&&!jt&&(document.body.style.cursor=""),En=!1;try{Ii()}catch{}try{Tt(!1)}catch{}}),De=Er,setTimeout(()=>{if(Er(),r&&c&&f&&s){let p=40,v=Re();if(v.length>0)p=v[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",s.appendChild(b),p=b.offsetHeight,s.removeChild(b)}ee(c.offsetHeight+f.offsetHeight+p),r.style.minHeight=V()+"px"}},0),xt){try{xt.disconnect()}catch{}xt=null}xt=new ResizeObserver(Er),xt.observe(r),go||document.addEventListener("pointerdown",go=()=>{za=Date.now()},!0),vo||document.addEventListener("pointerup",vo=()=>{},!0)}finally{pi=!1}}}async function fd(){if(!r)return;if(document.querySelectorAll("#ytls-pane").forEach(d=>{d!==r&&(l("Removing duplicate pane element from DOM"),d.remove())}),document.body.contains(r)){l("Pane already in DOM, skipping append");return}await pd(),Su(ld),xu(cd),Ea(gr),Ma(yi),Tu(fr),yu(M),Wc(()=>si()),await Ia(),await Du(),await Tn(),si();let u=document.querySelectorAll("#ytls-pane");if(u.length>0&&(l(`WARNING: Found ${u.length} existing pane(s) in DOM, removing all`),u.forEach(d=>d.remove())),document.body.contains(r)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(r),l("Pane successfully appended to DOM"),Se(),Me&&(clearTimeout(Me),Me=null),Me=setTimeout(()=>{Ee(),De?.(),be(),se(!0),Me=null},450),St){try{St.disconnect()}catch{}St=null}St=new MutationObserver(()=>{let d=document.querySelectorAll("#ytls-pane");d.length>1&&(l(`CRITICAL: Multiple panes detected (${d.length}), removing duplicates`),d.forEach((y,S)=>{(S>0||r&&y!==r)&&y.remove()}))}),St.observe(document.body,{childList:!0})}function is(a=0){if(document.getElementById("ytls-header-button")){qt();return}let u=document.querySelector("#logo");if(!u||!u.parentElement){a<10&&setTimeout(()=>is(a+1),300);return}let d=document.createElement("button");d.id="ytls-header-button",d.type="button",d.className="ytls-header-button",Fe(d,"Toggle Timekeeper UI"),d.setAttribute("aria-label","Toggle Timekeeper UI");let y=document.createElement("img");y.src=_r,y.alt="",y.decoding="async",d.appendChild(y),on=y,d.addEventListener("mouseenter",()=>{on&&(Jo=!0,on.src=ll)}),d.addEventListener("mouseleave",()=>{on&&(Jo=!1,qt())}),d.addEventListener("click",()=>{r&&!document.body.contains(r)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(r)),wi()}),u.insertAdjacentElement("afterend",d),qt(),l("Timekeeper header button added next to YouTube logo")}function as(){if(W())return;le(!0);let a=history.pushState,u=history.replaceState;function d(){try{let y=new Event("locationchange");window.dispatchEvent(y)}catch{}}history.pushState=function(){let y=a.apply(this,arguments);return d(),y},history.replaceState=function(){let y=u.apply(this,arguments);return d(),y},window.addEventListener("popstate",d),window.addEventListener("locationchange",()=>{window.location.href!==q&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function bi(){if(!i()){Zu();return}H(window.location.href),document.querySelectorAll("#ytls-pane").forEach((u,d)=>{(d>0||r&&u!==r)&&u.remove()}),await qe(),await md(),Be=hr();let a=document.title;l("Page Title:",a),l("Video ID:",Be),l("Current URL:",window.location.href),hi(!0),So(),je(),await fr(),je(),hi(!1),l("Timestamps loaded and UI unlocked for video:",Be),await fd();try{Tt(!0)}catch{}is(),nd()}as(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),pr(),i()&&r&&s&&(l("Locking UI and showing loading state for navigation"),hi(!0))}),ho=a=>{if(!a.repeat&&!a.ctrlKey&&!a.altKey&&!a.metaKey&&!a.shiftKey&&(a.key==="z"||a.key==="Z")){if(Nu(a.target))return;Pa()&&(a.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}a.ctrlKey&&a.altKey&&a.shiftKey&&(a.key==="T"||a.key==="t")&&(a.preventDefault(),wi(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",ho),window.addEventListener("pagehide",pr),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&pr()});function hd(a){let u=typeof unsafeWindow<"u"?unsafeWindow:window,d=ic(a?.response??u.ytInitialData,a?.playerResponse??u.ytInitialPlayerResponse);d&&ou(d).then(y=>{y&&l(`Video ${d.videoId}: members-only=${y.membersOnly}, can access=${y.canAccess}`)})}window.addEventListener("yt-navigate-finish",a=>{l("Navigation finished (yt-navigate-finish event fired)"),hd(a.detail?.response),window.location.href!==q?bi():l("Navigation finished but URL already handled, skipping.")});function gd(a){let u=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(a);if(u&&(u[1]||u[2]||u[3]))return Number(u[1]||0)*3600+Number(u[2]||0)*60+Number(u[3]||0);let d=Number(a);return Number.isFinite(d)?d:null}document.addEventListener("click",a=>{if(a.button!==0||a.ctrlKey||a.metaKey||a.shiftKey||a.altKey)return;let u=a.target?.closest?.("ytd-comments a[href]");if(!u)return;let d=new URL(u.href,location.href),y=d.searchParams.get("t");if(d.pathname!=="/watch"||!y||d.searchParams.get("v")!==hr())return;let S=gd(y),A=J();S===null||!A||(a.preventDefault(),a.stopImmediatePropagation(),A.seekTo(S))},!0),zc(a=>{for(let u of a)An({type:"timestamps_updated",videoId:u,action:"synced"});Be&&a.includes(Be)&&fr()}),du(),as(),l("Timekeeper initialized and waiting for navigation events")})();})();

