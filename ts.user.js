// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.3.1
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
// @downloadURL  https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @updateURL    https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @license MIT
// ==/UserScript==

(()=>{var sc=Object.defineProperty;var lc=(e,t)=>{for(var n in t)sc(e,n,{get:t[n],enumerable:!0})};var to=class extends Error{},$e=(e,t)=>{throw new to(`${e||"value"}: expected ${t}`)};function bt(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(i){if(i instanceof to)return{success:!1,error:i};throw i}},array:()=>cc(t)};return t}var ua=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function ze(){return bt((e,t)=>typeof e=="string"?e:$e(t,"string"))}function Qo(){return bt((e,t)=>typeof e=="boolean"?e:$e(t,"boolean"))}function vt(e={}){return bt((t,n)=>typeof t!="number"||Number.isNaN(t)?$e(n,"number"):(e.finite&&!Number.isFinite(t)&&$e(n,"finite number"),e.int&&!Number.isInteger(t)&&$e(n,"integer"),e.nonnegative&&t<0&&$e(n,"number >= 0"),e.positive&&t<=0&&$e(n,"number > 0"),e.min!==void 0&&t<e.min&&$e(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&$e(n,`number <= ${e.max}`),t))}function Ve(e){return bt((t,n)=>t===void 0?void 0:e.run(t,n))}function Xo(e){return bt((t,n)=>t===null?null:e.run(t,n))}function Cn(e,t){return bt((n,i)=>{try{return e.run(n,i)}catch(a){if(a instanceof to)return t;throw a}})}function cc(e){return bt((t,n)=>Array.isArray(t)?t.map((i,a)=>e.run(i,`${n}[${a}]`)):$e(n,"array"))}function uc(e){return bt((t,n)=>{if(!ua(t))return $e(n,"object");let i={};for(let a of Object.keys(t))i[a]=e.run(t[a],n?`${n}.${a}`:a);return i})}function yt(e){let t=bt((n,i)=>{if(!ua(n))return $e(i,"object");let a={};for(let o of Object.keys(e)){let u=e[o].run(n[o],i?`${i}.${o}`:o);u!==void 0&&(a[o]=u)}return a});return Object.assign(t,{extend:n=>yt({...e,...n}),partial:()=>{let n={};for(let i of Object.keys(e))n[i]=Ve(e[i]);return yt(n)}})}var dc=bt((e,t)=>typeof e=="string"&&e.length>0?e:$e(t,"non-empty string")),Jo=yt({guid:dc,start:vt({finite:!0,nonnegative:!0}),comment:ze(),write_counter:Ve(vt({int:!0,positive:!0})),deleted_at:Cn(Ve(vt()),void 0)}),no=Jo.array(),Pi=Jo.extend({video_id:ze(),device_id:Ve(ze())}),da=yt({x:vt({finite:!0}),y:vt({finite:!0}),width:Ve(vt({finite:!0,positive:!0})),height:Ve(vt({finite:!0,positive:!0}))}),Zo=yt({video_id:ze(),timestamps:no}),pa=uc(Zo),ca=yt({isSignedIn:Cn(Qo(),!1),accessToken:Cn(Xo(ze()),null),userName:Cn(Xo(ze()),null),email:Cn(Xo(ze()),null)}),zi=Cn(bt((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return $e(t,"valid JSON string for auth state")}return ca.run(n,t)}return ca.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),pc=yt({autoBackupEnabled:Qo(),autoBackupIntervalMinutes:vt({int:!0,min:5,max:1440}),lastAutoBackupAt:Ve(Xo(vt({int:!0,positive:!0})))}),Hi=pc;var ma=`<svg
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
</svg>`;var fa=`<svg
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
</svg>`;var ha=`<svg
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
</svg>`;var ga=`<svg
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
</svg>`;var va=`<svg
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
</svg>`;var ya=`<svg
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
</svg>`;var ba=`<svg
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
</svg>`;var wa=`<svg
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
</svg>`;var xa=`<svg
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
</svg>`;var ka=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
</svg>`;var Ta=`<svg
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
</svg>`;var Sa=`<svg
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
</svg>`;var Aa=`<svg
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
</svg>`;var Ea=`<svg
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
</svg>`;var Ma=`<svg
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
</svg>`;var La=`<svg
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
</svg>`;var Ia=`<svg
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
</svg>`;var Ba=`<svg
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
</svg>`;var Ca=`<svg
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
</svg>`;var Da=`<svg
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
</svg>`;var Ra=`<svg
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
</svg>`;var Pa=`<svg
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
</svg>`;var za=`<svg
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
</svg>`;var Ha=`<svg
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
</svg>`;var Oa=`<svg
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
</svg>`;var Na=`<svg
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
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
</svg>`;var Fa=`<svg
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
</svg>`;var Ga=`<svg
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
</svg>`;var Ua=`<svg
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
</svg>`;var Va=`<svg
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
</svg>`;var _a=`<svg
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
</svg>`;var ja=`<svg
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
</svg>`;var qc={plus:ma,"alarm-plus":fa,minus:ha,"circle-plus":ga,"circle-minus":va,trash:ya,clipboard:ba,settings:wa,"clock-plus":xa,"current-location":ka,"player-record":Ta,"circle-x":Sa,"circle-check":Aa,"adjustments-horizontal":Ea,cloud:Ma,"device-floppy":La,"folder-open":Ia,"file-export":Ba,"file-import":Ca,"file-spreadsheet":Da,login:Ra,logout:Pa,refresh:za,"alert-triangle":Ha,database:Oa,server:Na,world:Fa,"plug-connected":Ga,key:Ua,x:Va,"indent-increase":_a,"indent-decrease":ja},qa="http://www.w3.org/2000/svg",$c=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,Wc=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,Kc=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,$a=new Map;function Wa(e){let t={};for(let n of e.matchAll(Kc))t[n[1]]=n[2];return t}function Yc(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function Xc(e){let t=Yc(e).match($c);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,i]=t,a=document.createElementNS(qa,"svg"),o=Wa(n);for(let[u,s]of Object.entries(o))u!=="class"&&a.setAttribute(u,s);for(let u of i.matchAll(Wc)){let[,s,v]=u,m=document.createElementNS(qa,s),f=Wa(v);for(let[g,y]of Object.entries(f))m.setAttribute(g,y);a.appendChild(m)}return a}function Qc(e){let t=$a.get(e);if(t)return t;let n=Xc(qc[e]);return $a.set(e,n),n}function oo(e,t=20){let n=Qc(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function He(e,t,n){e.replaceChildren(oo(t,n))}function ne(e,t,n,i){e.replaceChildren(oo(t,i),document.createTextNode("\xA0"+n))}var ei="5.3.1";function l(e,...t){let n="debug",i=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=i.pop());let a=`[Timekeeper v${ei}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...i)}var ti=e=>String(e).padStart(2,"0");function en(e,t=e){let n=Math.floor(e/3600),i=Math.floor(e%3600/60),a=ti(e%60);return t<3600?`${t>=600?ti(i):i}:${a}`:`${t>=36e3?ti(n):n}:${ti(i)}:${a}`}function ni(e,t,n){let i=en(e,Math.max(e,n));if(t.length===0)return i;let a=(Math.max(...t)-Math.min(...t))/60,o=(t.length/Math.max(1,a)).toFixed(2);return parseFloat(o)>0?`${i} (${o}/min)`:i}function Oi(e,t){let n=Math.max(0,...e.map(i=>i.start));return e.map(i=>{let a=en(i.start,n),o=t?`${i.comment} <!-- guid:${i.guid} -->`.trimStart():i.comment;return`${a} ${o}`}).join(`
`)}function Ka(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function hn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var Ya=`#ytls-pane {
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
`;var oi="data:image/png;base64,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",Xa="data:image/png;base64,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";var We=null,Dn=null,Jc=250,Bt=null,Rn=!1,Ke=null,io=[];function Zc(){return(!We||!document.body.contains(We))&&(We=document.createElement("div"),We.className="ytls-tooltip",We.style.pointerEvents="none",document.body.appendChild(We),window.addEventListener("scroll",Qa,!0),window.addEventListener("resize",Qa,!0)),We}function eu(e,t,n){let a=window.innerWidth,o=window.innerHeight,u=e.getBoundingClientRect(),s=u.width,v=u.height,m=t+10,f=n+10;m+s>a-10&&(m=t-s-10),f+v>o-10&&(f=n-v-10),m=Math.max(10,Math.min(m,a-s-10)),f=Math.max(10,Math.min(f,o-v-10)),e.style.left=`${m}px`,e.style.top=`${f}px`}function Ja(e,t){let i=window.innerWidth,a=window.innerHeight,o=t.getBoundingClientRect(),u=e.getBoundingClientRect(),s=u.width,v=u.height,m=Math.round(o.left+o.width/2-s/2),f=Math.round(o.top-v-8);f<8&&(f=Math.round(o.bottom+8)),m<8&&(m=Math.round(o.left)),m+s>i-8&&(m=Math.round(o.right-s)),m=Math.max(8,Math.min(m,i-s-8)),f=Math.max(8,Math.min(f,a-v-8)),e.style.left=`${m}px`,e.style.top=`${f}px`}function Qa(){if(!(!We||!Bt)&&We.classList.contains("ytls-tooltip-visible"))try{Ja(We,Bt)}catch{}}function tu(e=50){Ke&&(clearTimeout(Ke),Ke=null),!Rn&&(Ke=setTimeout(()=>{ro(),Ke=null},e))}function nu(e,t,n,i){Ke&&(clearTimeout(Ke),Ke=null),Bt&&i&&Bt!==i&&We?.classList.contains("ytls-tooltip-visible")&&We.classList.remove("ytls-tooltip-visible"),Dn&&clearTimeout(Dn),i&&(Bt=i,Rn=!0),Dn=setTimeout(()=>{let a=Zc();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),i?requestAnimationFrame(()=>{Ja(a,i),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(eu(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},Jc)}function ro(){Dn&&(clearTimeout(Dn),Dn=null),Ke&&(clearTimeout(Ke),Ke=null),We&&We.classList.remove("ytls-tooltip-visible"),Bt=null,Rn=!1}function Ni(){ro()}function Ye(e,t){let n=0,i=0,a=m=>{n=m.clientX,i=m.clientY,Ke&&(clearTimeout(Ke),Ke=null),Rn=!0,Bt=e;let f=typeof t=="function"?t():t;f&&nu(f,n,i,e)},o=m=>{n=m.clientX,i=m.clientY},u=()=>{Bt===e&&(Rn=!1,tu())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",o),e.addEventListener("mouseleave",u);let s=m=>{Rn=!1,Bt===e&&ro()};e.addEventListener("click",s,!0);let v=new MutationObserver(()=>{if(Bt===e)try{let m=window.getComputedStyle(e);(m.display==="none"||m.visibility==="hidden"||m.opacity==="0")&&ro()}catch{}});try{v.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}io.push(v),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",o),e.removeEventListener("mouseleave",u),e.removeEventListener("click",s,!0);try{v.disconnect()}catch{}let m=io.indexOf(v);m!==-1&&io.splice(m,1),delete e.__tooltipObserver},e.__tooltipObserver=v}function Za(){for(let e of io)try{e.disconnect()}catch{}io.length=0,ro()}var qi={};lc(qi,{addTimestamp:()=>lu,buildExportCsvPayload:()=>vu,buildExportPayload:()=>hu,deleteSingleTimestampFromIndexedDB:()=>mu,exportAllTimestamps:()=>gu,exportAllTimestampsCsv:()=>yu,loadFromIndexedDB:()=>pu,loadGlobalSettings:()=>ai,mergeBackupData:()=>bu,removeFromIndexedDB:()=>fu,saveGlobalSettings:()=>ri,saveRowsToIndexedDB:()=>cu,saveSingleTimestampToIndexedDB:()=>du,saveToIndexedDB:()=>uu});var ou="ytls-timestamps-db",iu=4,Pn="timestamps",on="timestamps_v2",nn="settings",tn=null,zn=null;function Fi(){if(tn)try{return tn.objectStoreNames,Promise.resolve(tn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),tn=null}return zn||(zn=ru().then(e=>(tn=e,zn=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),tn=null},e.onversionchange=()=>{l("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),tn===e&&(tn=null)},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw zn=null,e}),zn)}function es(e,t){let n=crypto.randomUUID(),i=0,a=e.openCursor();a.onsuccess=o=>{let u=o.target.result;u?(i++,u.update({...u.value,write_counter:i,device_id:n}),u.continue()):(t.put({key:"write_counter",value:i}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${i} records, device_id=${n}`))},a.onerror=()=>{l("Lamport migration: cursor error during backfill",a.error,"error")}}function ru(){return new Promise((e,t)=>{let n=indexedDB.open(ou,iu);n.onupgradeneeded=i=>{let a=i.target.result,o=i.oldVersion,u=i.target.transaction;if(o<1&&a.createObjectStore(Pn,{keyPath:"video_id"}),o<2&&!a.objectStoreNames.contains(nn)&&a.createObjectStore(nn,{keyPath:"key"}),o<3){if(a.objectStoreNames.contains(Pn)){l("Exporting backup before v2 migration...");let m=u.objectStore(Pn).getAll();m.onsuccess=()=>{let f=Zo.array().safeParse(m.result);if(f.success&&f.data.length>0)try{let g={},y=0;f.data.forEach(_=>{if(_.timestamps.length>0){let q=no.parse(_.timestamps);g[`ytls-${_.video_id}`]={video_id:_.video_id,timestamps:[...q].sort((ee,N)=>ee.start-N.start)},y+=q.length}});let E=new Blob([JSON.stringify(g,null,2)],{type:"application/json"}),M=URL.createObjectURL(E),O=document.createElement("a");O.href=M,O.download=`timekeeper-data-${hn()}.json`,O.click(),URL.revokeObjectURL(M),l(`Pre-migration backup exported: ${f.data.length} videos, ${y} timestamps`)}catch(g){l("Failed to export pre-migration backup:",g,"error")}else f.success||l("Skipping pre-migration backup: legacy data failed validation",f.error.message,"warn")}}let s=a.createObjectStore(on,{keyPath:"guid"});if(s.createIndex("video_id","video_id",{unique:!1}),s.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(Pn)){let m=u.objectStore(Pn).getAll();m.onsuccess=()=>{let f=Zo.array().safeParse(m.result);if(f.success&&f.data.length>0){let g=0;f.data.forEach(y=>{y.timestamps.length>0&&y.timestamps.forEach(E=>{s.put({guid:E.guid,video_id:y.video_id,start:E.start,comment:E.comment}),g++})}),l(`Migrated ${g} timestamps from ${f.data.length} videos to v2 store`)}else f.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",f.error.message,"warn");o<4&&es(u.objectStore(on),u.objectStore(nn))},a.deleteObjectStore(Pn),l("Deleted old timestamps store after migration to v2")}}o===3&&es(u.objectStore(on),u.objectStore(nn))},n.onsuccess=i=>{e(i.target.result)},n.onerror=i=>{let a=i.target.error;t(a??new Error("Failed to open IndexedDB"))},n.onblocked=()=>{l("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function Gi(e,t,n){return Fi().then(i=>new Promise((a,o)=>{let u;try{u=i.transaction(e,t)}catch(m){o(new Error(`Failed to create transaction for ${e}: ${m}`));return}let s=u.objectStore(e),v;try{v=n(s)}catch(m){o(new Error(`Failed to execute operation on ${e}: ${m}`));return}v&&(v.onsuccess=()=>a(v.result),v.onerror=()=>o(v.error??new Error(`IndexedDB ${t} operation failed`))),u.oncomplete=()=>{v||a(void 0)},u.onerror=()=>o(u.error??new Error("IndexedDB transaction failed")),u.onabort=()=>o(u.error??new Error("IndexedDB transaction aborted"))}))}function ao(e){return Fi().then(t=>new Promise((n,i)=>{let a;try{a=t.transaction([on,nn],"readwrite")}catch(o){i(new Error(`Failed to create transaction: ${o}`));return}a.oncomplete=()=>n(),a.onerror=()=>i(new Error(`IndexedDB write failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>i(new Error(`IndexedDB transaction aborted: ${a.error?.message??"unknown"}`));try{e(a.objectStore(on),a.objectStore(nn))}catch(o){try{a.abort()}catch{}i(o instanceof Error?o:new Error(String(o)))}}))}function so(e,t){let n=e.get("write_counter");n.onsuccess=()=>{let i=typeof n.result?.value=="number"?n.result.value:0;e.put({key:"write_counter",value:t(i)})}}function ts(e,t){let n=no.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let i=n.data;return ao((a,o)=>{let u=a.index("video_id").getAll(IDBKeyRange.only(e));u.onsuccess=()=>{let s=u.result??[],v=new Map(s.map(g=>[g.guid,g])),m=new Set(i.map(g=>g.guid)),f=Date.now();so(o,g=>{let y=g;return s.forEach(E=>{!m.has(E.guid)&&!E.deleted_at&&(y++,a.put({...E,deleted_at:f,write_counter:y}))}),i.forEach(E=>{let M=v.get(E.guid);M&&!M.deleted_at&&!E.deleted_at&&M.start===E.start&&M.comment===E.comment||(y++,a.put({guid:E.guid,video_id:e,start:E.start,comment:E.comment,write_counter:y,deleted_at:E.deleted_at??M?.deleted_at??void 0}))}),y})}})}function Ui(e,t){let n=no.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let i=n.data;return i.length===0?Promise.resolve():ao((a,o)=>{so(o,u=>{let s=u;return i.forEach(v=>{s++,a.put({guid:v.guid,video_id:e,start:v.start,comment:v.comment,write_counter:s,deleted_at:v.deleted_at})}),s})})}function ns(e,t){return Ui(e,[t])}function os(e){return e.length===0?Promise.resolve():ao((t,n)=>{so(n,i=>{let a=i;return e.forEach(o=>{o.write_counter!==void 0&&o.write_counter>a&&(a=o.write_counter)}),e.forEach(o=>{let u={guid:o.guid,video_id:o.video_id,start:o.start,comment:o.comment,deleted_at:o.deleted_at,write_counter:o.write_counter??++a};t.put(u)}),a+1})})}function is(e){return l(`Soft-deleting timestamp ${e}`),ao((t,n)=>{let i=t.get(e);i.onsuccess=()=>{let a=i.result;a&&so(n,o=>(t.put({...a,deleted_at:Date.now(),write_counter:o+1}),o+1))}})}function rs(e){return Fi().then(t=>new Promise((n,i)=>{let a;try{a=t.transaction([on],"readonly")}catch(u){let s=`Failed to create read transaction: ${u}`;l(s,u,"error"),i(new Error(s));return}a.onabort=()=>{let u=`Transaction aborted during load: ${a.error?.message??"unknown"}`;l(u,a.error,"error"),i(new Error(u))};let o=a.objectStore(on).index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{try{let u=o.result.filter(m=>!m.deleted_at),s=[],v=0;for(let m of u){let f=Jo.safeParse({guid:m.guid,start:m.start,comment:m.comment});f.success?s.push(f.data):v++}if(v>0&&l(`Skipped ${v} stored timestamps for ${e} that failed validation`,null,"warn"),s.length===0){v>0?i(new Error(`Stored timestamps for this video failed validation (${v} rows)`)):n(null);return}n(s.sort((m,f)=>m.start-f.start))}catch(u){i(u)}},o.onerror=()=>{let u=`Failed to load timestamps from IndexedDB: ${o.error?.message??"unknown error"}`;l(u,o.error,"error"),i(new Error(u))}}))}function as(e){return ao((t,n)=>{let i=t.index("video_id").getAll(IDBKeyRange.only(e));i.onsuccess=()=>{let a=i.result??[],o=Date.now();so(n,u=>{let s=u;return a.forEach(v=>{v.deleted_at||(s++,t.put({...v,deleted_at:o,write_counter:s}))}),s})}})}function ii(){return Gi(on,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function ss(e,t){return Gi(nn,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function ls(e){return Gi(nn,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function Vi({includeDeleted:e=!1}={}){let t={},n=await ii(),i=[],a=0;for(let g of n){let y=Pi.safeParse(g);y.success?i.push(y.data):a++}a>0&&l(`Skipped ${a} timestamp rows that failed validation during export`,null,"warn");let u=[...e?i:i.filter(g=>!g.deleted_at)].sort((g,y)=>{let E=g.video_id.localeCompare(y.video_id);if(E!==0)return E;let M=g.start-y.start;return M!==0?M:g.guid.localeCompare(y.guid)}),s=new Map;for(let g of u)s.has(g.video_id)||s.set(g.video_id,[]),s.get(g.video_id).push({guid:g.guid,start:g.start,comment:g.comment,write_counter:g.write_counter,deleted_at:g.deleted_at});let v=Array.from(s.keys()).sort((g,y)=>g.localeCompare(y));for(let g of v){let y=s.get(g);t[`ytls-${g}`]={video_id:g,timestamps:y}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:u.length,invalidRows:a}}async function cs(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:i}=await Vi(),a=new Blob([e],{type:"application/json"}),o=URL.createObjectURL(a),u=document.createElement("a");u.href=o,u.download=t,u.click(),URL.revokeObjectURL(o),l(`Exported ${n} videos with ${i} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function _i(){let e=Pi.array().safeParse((await ii()).filter(m=>!m.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let m=`Tag,Timestamp,URL
`,f=`timestamps-${hn()}.csv`;return{csv:m,filename:f,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let m of t)n.has(m.video_id)||n.set(m.video_id,[]),n.get(m.video_id).push({start:m.start,comment:m.comment});let i=[];i.push("Tag,Timestamp,URL");let a=0,o=m=>`"${String(m).replace(/"/g,'""')}"`,u=Array.from(n.keys()).sort();for(let m of u){let f=n.get(m).sort((g,y)=>g.start-y.start);for(let g of f){let y=g.comment,E=en(g.start,36e3),M=Ka(g.start,`https://www.youtube.com/watch?v=${m}`);i.push([o(y),o(E),o(M)].join(",")),a++}}let s=i.join(`
`),v=`timestamps-${hn()}.csv`;return{csv:s,filename:v,totalVideos:n.size,totalTimestamps:a}}async function us(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:i}=await _i(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),o=URL.createObjectURL(a),u=document.createElement("a");u.href=o,u.download=t,u.click(),URL.revokeObjectURL(o),l(`Exported ${n} videos with ${i} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function ji(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return ns(e,t)}async function ds(e,t){if(!e)throw new Error("Video ID is required");return Ui(e,t)}async function ps(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return ts(e,t)}async function ms(e){if(!e)throw new Error("GUID is required");return is(e)}async function fs(e){if(!e)throw new Error("Video ID is required");return as(e)}async function hs(e){if(!e)throw new Error("Video ID is required");return rs(e)}async function gs(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=pa.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let i=await ii(),a=new Map;for(let v of i)a.set(v.guid,v);let o=0,u=0,s=[];for(let[,v]of Object.entries(n.data)){let{video_id:m,timestamps:f}=v,g=0;for(let y of f){let E=a.get(y.guid),M=!1;E?E.write_counter!==void 0&&y.write_counter!==void 0&&y.write_counter>E.write_counter&&(M=!0):M=!0,M&&(s.push({guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),a.set(y.guid,{...E??{},guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),g++,u++)}g>0&&o++}return await os(s),{mergedVideos:o,mergedTimestamps:u}}function vs(e,t){if(!e)throw new Error("Setting key is required");return ss(e,t)}async function ys(e){if(!e)throw new Error("Setting key is required");return ls(e)}function lu(e,t){return ji(e,t)}function cu(e,t){return ds(e,t)}function uu(e,t){return ps(e,t)}function du(e,t){return ji(e,t)}function pu(e){return hs(e)}function mu(e,t){return ms(t)}function fu(e){return fs(e)}function ri(e,t){vs(e,t)}function ai(e){return ys(e)}function hu(e){return Vi(e)}function gu(){return cs()}function vu(){return _i()}function yu(){return us()}function bu(e){return gs(e)}function si(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function li(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function $i(e,t){if(!e)return;li(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function bs(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function lo(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function ws(e,t){if(!e)return;li(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${wu(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function xs(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function wu(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function ks(e,t){if(!e||t||lo(e))return;Array.from(e.children).some(i=>!i.classList.contains("ytls-placeholder")&&!i.classList.contains("ytls-error-message"))||$i(e,"No timestamps for this video")}function Ts(e){if(!e)return[];let t=si(e),n=[];return t.forEach(i=>{let a=i.querySelector("[data-time]"),o=i.querySelector("input"),u=i.dataset.guid;if(!a||!o||!u)return;let s=a.dataset.time;if(!s)return;let v=Number.parseInt(s,10);Number.isFinite(v)&&n.push({guid:u,start:v,comment:o.value})}),n.sort((i,a)=>i.start-a.start)}function Ss(e){if(!e)return 0;let t=si(e),n=0;return t.forEach(i=>{let o=i.querySelector("[data-time]")?.dataset.time;if(o){let u=Number.parseInt(o,10);Number.isFinite(u)&&(n=Math.max(n,u))}}),n}var ku={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},rt=JSON.parse(JSON.stringify(ku));function _e(){return rt}function ci(e){rt={...rt,...e,auth:{...rt.auth,...e.auth||{}},ui:{...rt.ui,...e.ui||{}},timestamps:{...rt.timestamps,...e.timestamps||{}}}}function gn(e,t){ci({auth:{...rt.auth,[e]:t}})}function ui(e,t){ci({ui:{...rt.ui,[e]:t}})}function Ct(){return rt.auth.googleAuthState}function wt(e){gn("googleAuthState",e)}function Wi(e){gn("autoBackupEnabled",e)}function Ki(e){gn("autoBackupIntervalMinutes",e)}function Yi(e){gn("isAutoBackupRunning",e)}function di(e){gn("autoBackupRetryAttempts",e)}function Hn(e){gn("autoBackupBackoffMs",e)}function Xi(e){gn("lastAutoBackupAt",e)}function As(e){ui("minPaneHeight",e)}function Es(e){ui("panePosition",e)}function Ms(e){ui("lastHandledUrl",e)}function Ls(e){ui("urlChangeHandlersSetup",e)}function Is(e){ci({timestamps:{...rt.timestamps,items:e}})}function Qi(e){ci({timestamps:{...rt.timestamps,dbError:e}})}function Bs(){return rt.timestamps.dbError}var vn=typeof unsafeWindow<"u"?unsafeWindow:window,Os=43200*14,Ds="html5_max_live_dvr_window_plus_margin_secs";function Ut(e){return e!=null&&typeof e=="object"}function Rs(e){let{streamingData:t,videoDetails:n,playerConfig:i,microformat:a}=e;if(!Ut(n)||!n.isLive)return;let o=n.isLiveDvrEnabled===!0;if(n.isLiveDvrEnabled=!0,!o&&Ut(i)){let u=i.mediaCommonConfig;if(Ut(u)){u.useServerDrivenAbr=!1;let s=u.serverPlaybackStartConfig;Ut(s)&&(s.enable=!1)}}if(Ut(t)){let u=t;if(Array.isArray(u.adaptiveFormats)&&Tu(a))for(let s of u.adaptiveFormats)s.maxDvrDurationSec=Os}}function Tu(e){if(!Ut(e))return!1;let t=e.playerMicroformatRenderer;if(!Ut(t))return!1;let n=t.liveBroadcastDetails;if(!Ut(n))return!1;let i=n.startTimestamp;return!i||typeof i!="string"?!1:(Date.now()-new Date(i).getTime())/1e3>43200}function Ji(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(Rs(t),!0):t.playerResponse&&Ut(t.playerResponse)&&t.playerResponse.videoDetails?(Rs(t.playerResponse),!0):!1}function Su(){let e=Object.getOwnPropertyDescriptor(vn,"ytInitialPlayerResponse"),t=e&&e.set,n=vn.ytInitialPlayerResponse;if(!Ji(n))try{Object.defineProperty(vn,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(i){t&&t.call(this,i),n=i,Ji(i)&&Object.defineProperty(vn,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:i})}})}catch{}}var Ps=!1;function Au(){if(Ps)return;Ps=!0;let e=JSON.parse;JSON.parse=function(t,n){let i=e.call(this,t,n);try{Ji(i)}catch{}return i}}function zs(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let i=n;for(let a in i){let o=i[a];if(o&&typeof o.serializedExperimentFlags=="string"){let u=o.serializedExperimentFlags,s=u.replace(new RegExp(`${Ds}=[\\d.]+`),`${Ds}=${Os}`);s!==u&&(o.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function Hs(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let i=t.apply(this,n);try{zs(e)}catch{}return i});try{zs(e)}catch{}return e}function Eu(){let e={};vn.ytcfg&&(e=Hs(vn.ytcfg));try{Object.defineProperty(vn,"ytcfg",{configurable:!0,get(){return e},set(t){e=Hs(t)}})}catch{}}function Ns(){Su(),Au(),Eu(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var Zi="#author-name, #author-text";function Fs(){return window.top!==window.self&&window.location.pathname.startsWith("/live_chat")}function er(e){let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=t.nextNode();n;n=t.nextNode()){let i=n.nodeValue??"";if(i.trim()){/^\s*@/.test(i)&&(n.nodeValue=i.replace(/^(\s*)@/,"$1"));return}}}function tr(e){if(e.nodeType===Node.TEXT_NODE){let t=e.parentElement?.closest(Zi);t&&er(t);return}e instanceof Element&&(e.matches(Zi)&&er(e),e.querySelectorAll(Zi).forEach(er))}function Gs(){let e=new MutationObserver(t=>{for(let n of t)n.type==="characterData"?tr(n.target):n.addedNodes.forEach(tr)});document.documentElement&&tr(document.documentElement),e.observe(document,{childList:!0,subtree:!0,characterData:!0})}var fe=Uint8Array,Ze=Uint16Array,pr=Int32Array,pi=new fe([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),mi=new fe([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ar=new fe([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ws=function(e,t){for(var n=new Ze(31),i=0;i<31;++i)n[i]=t+=1<<e[i-1];for(var a=new pr(n[30]),i=1;i<30;++i)for(var o=n[i];o<n[i+1];++o)a[o]=o-n[i]<<5|i;return{b:n,r:a}},Ks=Ws(pi,2),Ys=Ks.b,sr=Ks.r;Ys[28]=258,sr[258]=28;var Xs=Ws(mi,0),Mu=Xs.b,Us=Xs.r,lr=new Ze(32768);for(W=0;W<32768;++W)Vt=(W&43690)>>1|(W&21845)<<1,Vt=(Vt&52428)>>2|(Vt&13107)<<2,Vt=(Vt&61680)>>4|(Vt&3855)<<4,lr[W]=((Vt&65280)>>8|(Vt&255)<<8)>>1;var Vt,W,Rt=(function(e,t,n){for(var i=e.length,a=0,o=new Ze(t);a<i;++a)e[a]&&++o[e[a]-1];var u=new Ze(t);for(a=1;a<t;++a)u[a]=u[a-1]+o[a-1]<<1;var s;if(n){s=new Ze(1<<t);var v=15-t;for(a=0;a<i;++a)if(e[a])for(var m=a<<4|e[a],f=t-e[a],g=u[e[a]-1]++<<f,y=g|(1<<f)-1;g<=y;++g)s[lr[g]>>v]=m}else for(s=new Ze(i),a=0;a<i;++a)e[a]&&(s[a]=lr[u[e[a]-1]++]>>15-e[a]);return s}),rn=new fe(288);for(W=0;W<144;++W)rn[W]=8;var W;for(W=144;W<256;++W)rn[W]=9;var W;for(W=256;W<280;++W)rn[W]=7;var W;for(W=280;W<288;++W)rn[W]=8;var W,po=new fe(32);for(W=0;W<32;++W)po[W]=5;var W,Lu=Rt(rn,9,0),Iu=Rt(rn,9,1),Bu=Rt(po,5,0),Cu=Rt(po,5,1),nr=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},xt=function(e,t,n){var i=t/8|0;return(e[i]|e[i+1]<<8)>>(t&7)&n},or=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},mr=function(e){return(e+7)/8|0},mo=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new fe(e.subarray(t,n))};var Du=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Oe=function(e,t,n){var i=new Error(t||Du[e]);if(i.code=e,Error.captureStackTrace&&Error.captureStackTrace(i,Oe),!n)throw i;return i},Ru=function(e,t,n,i){var a=e.length,o=i?i.length:0;if(!a||t.f&&!t.l)return n||new fe(0);var u=!n,s=u||t.i!=2,v=t.i;u&&(n=new fe(a*3));var m=function(jt){var sn=n.length;if(jt>sn){var kt=new fe(Math.max(sn*2,jt));kt.set(n),n=kt}},f=t.f||0,g=t.p||0,y=t.b||0,E=t.l,M=t.d,O=t.m,_=t.n,q=a*8;do{if(!E){f=xt(e,g,1);var ee=xt(e,g+1,3);if(g+=3,ee)if(ee==1)E=Iu,M=Cu,O=9,_=5;else if(ee==2){var ue=xt(e,g,31)+257,J=xt(e,g+10,15)+4,G=ue+xt(e,g+5,31)+1;g+=14;for(var D=new fe(G),he=new fe(19),ie=0;ie<J;++ie)he[ar[ie]]=xt(e,g+ie*3,7);g+=J*3;for(var ve=nr(he),ct=(1<<ve)-1,Ne=Rt(he,ve,1),ie=0;ie<G;){var Ce=Ne[xt(e,g,ct)];g+=Ce&15;var N=Ce>>4;if(N<16)D[ie++]=N;else{var ye=0,ae=0;for(N==16?(ae=3+xt(e,g,3),g+=2,ye=D[ie-1]):N==17?(ae=3+xt(e,g,7),g+=3):N==18&&(ae=11+xt(e,g,127),g+=7);ae--;)D[ie++]=ye}}var Te=D.subarray(0,ue),se=D.subarray(ue);O=nr(Te),_=nr(se),E=Rt(Te,O,1),M=Rt(se,_,1)}else Oe(1);else{var N=mr(g)+4,K=e[N-4]|e[N-3]<<8,re=N+K;if(re>a){v&&Oe(0);break}s&&m(y+K),n.set(e.subarray(N,re),y),t.b=y+=K,t.p=g=re*8,t.f=f;continue}if(g>q){v&&Oe(0);break}}s&&m(y+131072);for(var Me=(1<<O)-1,be=(1<<_)-1,we=g;;we=g){var ye=E[or(e,g)&Me],Fe=ye>>4;if(g+=ye&15,g>q){v&&Oe(0);break}if(ye||Oe(2),Fe<256)n[y++]=Fe;else if(Fe==256){we=g,E=null;break}else{var De=Fe-254;if(Fe>264){var ie=Fe-257,le=pi[ie];De=xt(e,g,(1<<le)-1)+Ys[ie],g+=le}var et=M[or(e,g)&be],zt=et>>4;et||Oe(3),g+=et&15;var se=Mu[zt];if(zt>3){var le=mi[zt];se+=or(e,g)&(1<<le)-1,g+=le}if(g>q){v&&Oe(0);break}s&&m(y+131072);var xe=y+De;if(y<se){var tt=o-se,Y=Math.min(se,xe);for(tt+y<0&&Oe(3);y<Y;++y)n[y]=i[tt+y]}for(;y<xe;++y)n[y]=n[y-se]}}t.l=E,t.p=we,t.b=y,t.f=f,E&&(f=1,t.m=O,t.d=M,t.n=_)}while(!f);return y!=n.length&&u?mo(n,0,y):n.subarray(0,y)},_t=function(e,t,n){n<<=t&7;var i=t/8|0;e[i]|=n,e[i+1]|=n>>8},co=function(e,t,n){n<<=t&7;var i=t/8|0;e[i]|=n,e[i+1]|=n>>8,e[i+2]|=n>>16},ir=function(e,t){for(var n=[],i=0;i<e.length;++i)e[i]&&n.push({s:i,f:e[i]});var a=n.length,o=n.slice();if(!a)return{t:Js,l:0};if(a==1){var u=new fe(n[0].s+1);return u[n[0].s]=1,{t:u,l:1}}n.sort(function(re,ue){return re.f-ue.f}),n.push({s:-1,f:25001});var s=n[0],v=n[1],m=0,f=1,g=2;for(n[0]={s:-1,f:s.f+v.f,l:s,r:v};f!=a-1;)s=n[n[m].f<n[g].f?m++:g++],v=n[m!=f&&n[m].f<n[g].f?m++:g++],n[f++]={s:-1,f:s.f+v.f,l:s,r:v};for(var y=o[0].s,i=1;i<a;++i)o[i].s>y&&(y=o[i].s);var E=new Ze(y+1),M=cr(n[f-1],E,0);if(M>t){var i=0,O=0,_=M-t,q=1<<_;for(o.sort(function(ue,J){return E[J.s]-E[ue.s]||ue.f-J.f});i<a;++i){var ee=o[i].s;if(E[ee]>t)O+=q-(1<<M-E[ee]),E[ee]=t;else break}for(O>>=_;O>0;){var N=o[i].s;E[N]<t?O-=1<<t-E[N]++-1:++i}for(;i>=0&&O;--i){var K=o[i].s;E[K]==t&&(--E[K],++O)}M=t}return{t:new fe(E),l:M}},cr=function(e,t,n){return e.s==-1?Math.max(cr(e.l,t,n+1),cr(e.r,t,n+1)):t[e.s]=n},Vs=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new Ze(++t),i=0,a=e[0],o=1,u=function(v){n[i++]=v},s=1;s<=t;++s)if(e[s]==a&&s!=t)++o;else{if(!a&&o>2){for(;o>138;o-=138)u(32754);o>2&&(u(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(u(a),--o;o>6;o-=6)u(8304);o>2&&(u(o-3<<5|8208),o=0)}for(;o--;)u(a);o=1,a=e[s]}return{c:n.subarray(0,i),n:t}},uo=function(e,t){for(var n=0,i=0;i<t.length;++i)n+=e[i]*t[i];return n},Qs=function(e,t,n){var i=n.length,a=mr(t+2);e[a]=i&255,e[a+1]=i>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var o=0;o<i;++o)e[a+o+4]=n[o];return(a+4+i)*8},_s=function(e,t,n,i,a,o,u,s,v,m,f){_t(t,f++,n),++a[256];for(var g=ir(a,15),y=g.t,E=g.l,M=ir(o,15),O=M.t,_=M.l,q=Vs(y),ee=q.c,N=q.n,K=Vs(O),re=K.c,ue=K.n,J=new Ze(19),G=0;G<ee.length;++G)++J[ee[G]&31];for(var G=0;G<re.length;++G)++J[re[G]&31];for(var D=ir(J,7),he=D.t,ie=D.l,ve=19;ve>4&&!he[ar[ve-1]];--ve);var ct=m+5<<3,Ne=uo(a,rn)+uo(o,po)+u,Ce=uo(a,y)+uo(o,O)+u+14+3*ve+uo(J,he)+2*J[16]+3*J[17]+7*J[18];if(v>=0&&ct<=Ne&&ct<=Ce)return Qs(t,f,e.subarray(v,v+m));var ye,ae,Te,se;if(_t(t,f,1+(Ce<Ne)),f+=2,Ce<Ne){ye=Rt(y,E,0),ae=y,Te=Rt(O,_,0),se=O;var Me=Rt(he,ie,0);_t(t,f,N-257),_t(t,f+5,ue-1),_t(t,f+10,ve-4),f+=14;for(var G=0;G<ve;++G)_t(t,f+3*G,he[ar[G]]);f+=3*ve;for(var be=[ee,re],we=0;we<2;++we)for(var Fe=be[we],G=0;G<Fe.length;++G){var De=Fe[G]&31;_t(t,f,Me[De]),f+=he[De],De>15&&(_t(t,f,Fe[G]>>5&127),f+=Fe[G]>>12)}}else ye=Lu,ae=rn,Te=Bu,se=po;for(var G=0;G<s;++G){var le=i[G];if(le>255){var De=le>>18&31;co(t,f,ye[De+257]),f+=ae[De+257],De>7&&(_t(t,f,le>>23&31),f+=pi[De]);var et=le&31;co(t,f,Te[et]),f+=se[et],et>3&&(co(t,f,le>>5&8191),f+=mi[et])}else co(t,f,ye[le]),f+=ae[le]}return co(t,f,ye[256]),f+ae[256]},Pu=new pr([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Js=new fe(0),zu=function(e,t,n,i,a,o){var u=o.z||e.length,s=new fe(i+u+5*(1+Math.ceil(u/7e3))+a),v=s.subarray(i,s.length-a),m=o.l,f=(o.r||0)&7;if(t){f&&(v[0]=o.r>>3);for(var g=Pu[t-1],y=g>>13,E=g&8191,M=(1<<n)-1,O=o.p||new Ze(32768),_=o.h||new Ze(M+1),q=Math.ceil(n/3),ee=2*q,N=function(Gn){return(e[Gn]^e[Gn+1]<<q^e[Gn+2]<<ee)&M},K=new pr(25e3),re=new Ze(288),ue=new Ze(32),J=0,G=0,D=o.i||0,he=0,ie=o.w||0,ve=0;D+2<u;++D){var ct=N(D),Ne=D&32767,Ce=_[ct];if(O[Ne]=Ce,_[ct]=Ne,ie<=D){var ye=u-D;if((J>7e3||he>24576)&&(ye>423||!m)){f=_s(e,v,0,K,re,ue,G,he,ve,D-ve,f),he=J=G=0,ve=D;for(var ae=0;ae<286;++ae)re[ae]=0;for(var ae=0;ae<30;++ae)ue[ae]=0}var Te=2,se=0,Me=E,be=Ne-Ce&32767;if(ye>2&&ct==N(D-be))for(var we=Math.min(y,ye)-1,Fe=Math.min(32767,D),De=Math.min(258,ye);be<=Fe&&--Me&&Ne!=Ce;){if(e[D+Te]==e[D+Te-be]){for(var le=0;le<De&&e[D+le]==e[D+le-be];++le);if(le>Te){if(Te=le,se=be,le>we)break;for(var et=Math.min(be,le-2),zt=0,ae=0;ae<et;++ae){var xe=D-be+ae&32767,tt=O[xe],Y=xe-tt&32767;Y>zt&&(zt=Y,Ce=xe)}}}Ne=Ce,Ce=O[Ne],be+=Ne-Ce&32767}if(se){K[he++]=268435456|sr[Te]<<18|Us[se];var jt=sr[Te]&31,sn=Us[se]&31;G+=pi[jt]+mi[sn],++re[257+jt],++ue[sn],ie=D+Te,++J}else K[he++]=e[D],++re[e[D]]}}for(D=Math.max(D,ie);D<u;++D)K[he++]=e[D],++re[e[D]];f=_s(e,v,m,K,re,ue,G,he,ve,D-ve,f),m||(o.r=f&7|v[f/8|0]<<3,f-=7,o.h=_,o.p=O,o.i=D,o.w=ie)}else{for(var D=o.w||0;D<u+m;D+=65535){var kt=D+65535;kt>=u&&(v[f/8|0]=m,kt=u),f=Qs(v,f+1,e.subarray(D,kt))}o.i=u}return mo(s,0,i+mr(f)+a)},Hu=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,i=9;--i;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),Ou=function(){var e=-1;return{p:function(t){for(var n=e,i=0;i<t.length;++i)n=Hu[n&255^t[i]]^n>>>8;e=n},d:function(){return~e}}};var Nu=function(e,t,n,i,a){if(!a&&(a={l:1},t.dictionary)){var o=t.dictionary.subarray(-32768),u=new fe(o.length+e.length);u.set(o),u.set(e,o.length),e=u,a.w=o.length}return zu(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,i,a)},Zs=function(e,t){var n={};for(var i in e)n[i]=e[i];for(var i in t)n[i]=t[i];return n};var Dt=function(e,t){return e[t]|e[t+1]<<8},at=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},rr=function(e,t){return at(e,t)+at(e,t+4)*4294967296},Be=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function Fu(e,t){return Nu(e,t||{},0,0)}function Gu(e,t){return Ru(e,{i:2},t&&t.out,t&&t.dictionary)}var el=function(e,t,n,i){for(var a in e){var o=e[a],u=t+a,s=i;Array.isArray(o)&&(s=Zs(i,o[1]),o=o[0]),ArrayBuffer.isView(o)?n[u]=[o,s]:(n[u+="/"]=[new fe(0),s],el(o,u,n,i))}},js=typeof TextEncoder<"u"&&new TextEncoder,ur=typeof TextDecoder<"u"&&new TextDecoder,Uu=0;try{ur.decode(Js,{stream:!0}),Uu=1}catch{}var Vu=function(e){for(var t="",n=0;;){var i=e[n++],a=(i>127)+(i>223)+(i>239);if(n+a>e.length)return{s:t,r:mo(e,n-1)};a?a==3?(i=((i&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|i>>10,56320|i&1023)):a&1?t+=String.fromCharCode((i&31)<<6|e[n++]&63):t+=String.fromCharCode((i&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(i)}};function qs(e,t){if(t){for(var n=new fe(e.length),i=0;i<e.length;++i)n[i]=e.charCodeAt(i);return n}if(js)return js.encode(e);for(var a=e.length,o=new fe(e.length+(e.length>>1)),u=0,s=function(f){o[u++]=f},i=0;i<a;++i){if(u+5>o.length){var v=new fe(u+8+(a-i<<1));v.set(o),o=v}var m=e.charCodeAt(i);m<128||t?s(m):m<2048?(s(192|m>>6),s(128|m&63)):m>55295&&m<57344?(m=65536+(m&1047552)|e.charCodeAt(++i)&1023,s(240|m>>18),s(128|m>>12&63),s(128|m>>6&63),s(128|m&63)):(s(224|m>>12),s(128|m>>6&63),s(128|m&63))}return mo(o,0,u)}function _u(e,t){if(t){for(var n="",i=0;i<e.length;i+=16384)n+=String.fromCharCode.apply(null,e.subarray(i,i+16384));return n}else{if(ur)return ur.decode(e);var a=Vu(e),o=a.s,n=a.r;return n.length&&Oe(8),o}}var ju=function(e,t){return t+30+Dt(e,t+26)+Dt(e,t+28)},qu=function(e,t,n){var i=Dt(e,t+28),a=Dt(e,t+30),o=_u(e.subarray(t+46,t+46+i),!(Dt(e,t+8)&2048)),u=t+46+i,s=$u(e,u,a,n,at(e,t+20),at(e,t+24),at(e,t+42)),v=s[0],m=s[1],f=s[2];return[Dt(e,t+10),v,m,o,u+a+Dt(e,t+32),f]},$u=function(e,t,n,i,a,o,u){var s=a==4294967295,v=o==4294967295,m=u==4294967295,f=t+n,g=s+v+m;if(i&&g){for(;t+4<f;t+=4+Dt(e,t+2))if(Dt(e,t)==1)return[s?rr(e,t+4+8*v):a,v?rr(e,t+4):o,m?rr(e,t+4+8*(v+s)):u,1];i<2&&Oe(13)}return[a,o,u,0]},dr=function(e){var t=0;if(e)for(var n in e){var i=e[n].length;i>65535&&Oe(9),t+=i+4}return t},$s=function(e,t,n,i,a,o,u,s){var v=i.length,m=n.extra,f=s&&s.length,g=dr(m);Be(e,t,u!=null?33639248:67324752),t+=4,u!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(o<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),E=y.getFullYear()-1980;if((E<0||E>119)&&Oe(10),Be(e,t,E<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),t+=4,o!=-1&&(Be(e,t,n.crc),Be(e,t+4,o<0?-o-2:o),Be(e,t+8,n.size)),Be(e,t+12,v),Be(e,t+14,g),t+=16,u!=null&&(Be(e,t,f),Be(e,t+6,n.attrs),Be(e,t+10,u),t+=14),e.set(i,t),t+=v,g)for(var M in m){var O=m[M],_=O.length;Be(e,t,+M),Be(e,t+2,_),e.set(O,t+4),t+=4+_}return f&&(e.set(s,t),t+=f),t},Wu=function(e,t,n,i,a){Be(e,t,101010256),Be(e,t+8,n),Be(e,t+10,n),Be(e,t+12,i),Be(e,t+16,a)};function tl(e,t){t||(t={});var n={},i=[];el(e,"",n,t);var a=0,o=0;for(var u in n){var s=n[u],v=s[0],m=s[1],f=m.level==0?0:8,g=qs(u),y=g.length,E=m.comment,M=E&&qs(E),O=M&&M.length,_=dr(m.extra);y>65535&&Oe(11);var q=f?Fu(v,m):v,ee=q.length,N=Ou();N.p(v),i.push(Zs(m,{size:v.length,crc:N.d(),c:q,f:g,m:M,u:y!=u.length||M&&E.length!=O,o:a,compression:f})),a+=30+y+_+ee,o+=76+2*(y+_)+(O||0)+ee}for(var K=new fe(o+22),re=a,ue=o-a,J=0;J<i.length;++J){var g=i[J];$s(K,g.o,g,g.f,g.u,g.c.length);var G=30+g.f.length+dr(g.extra);K.set(g.c,g.o+G),$s(K,a,g,g.f,g.u,g.c.length,g.o,g.m),a+=16+G+(g.m?g.m.length:0)}return Wu(K,a,i.length,ue,re),K}function nl(e,t){for(var n={},i=e.length-22;at(e,i)!=101010256;--i)(!i||e.length-i>65558)&&Oe(13);var a=Dt(e,i+8);if(!a)return{};var o=at(e,i+16),u=at(e,i-20)==117853008;if(u){var s=at(e,i-12);u=at(e,s)==101075792,u&&(a=at(e,s+32),o=at(e,s+48))}for(var v=t&&t.filter,m=0;m<a;++m){var f=qu(e,o,u),g=f[0],y=f[1],E=f[2],M=f[3],O=f[4],_=f[5],q=ju(e,_);o=O,(!v||v({name:M,size:y,originalSize:E,compression:g}))&&(g?g==8?n[M]=Gu(e.subarray(q,q+y),{out:new fe(E)}):Oe(14,"unknown compression type "+g):n[M]=mo(e,q,q+y))}return n}function st(){return Ct()}var lt={get isSignedIn(){return Ct().isSignedIn},get accessToken(){return Ct().accessToken},get userName(){return Ct().userName},get email(){return Ct().email},set isSignedIn(e){let t=Ct();wt({...t,isSignedIn:e})},set accessToken(e){let t=Ct();wt({...t,accessToken:e})},set userName(e){let t=Ct();wt({...t,userName:e})},set email(e){let t=Ct();wt({...t,email:e})}};function vo(){return _e().auth.autoBackupEnabled}function Pt(){return _e().auth.autoBackupIntervalMinutes}var gr=null,oe=null,Z=null,bn=null;function al(e){gr=e}function sl(e){oe=e}function ll(e){Z=e}function cl(e){bn=e}var ol=!1;function ul(){if(!ol)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),ol=!0}catch{}}var dl=null,vr=null,fo=null,ho=null,yr=null;function pl(e){dl=e}function ml(e){vr=e}function br(e){fo=e}function wr(e){ho=e}function fl(e){yr=e}var hi="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",hl="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",gl="https://www.youtube.com/",Ku=new Date(Date.UTC(2e3,0,1,0,0,0)),Yu=30*1e3,Xu=1800*1e3,il=5,fi=null,je=null;async function xr(){try{let e=await ho("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=zi.safeParse(e);if(n.success){let i=st();wt({...i,...n.data});let a=st();a.isSignedIn&&a.accessToken&&l(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),Fn();let o=st();o.isSignedIn&&o.accessToken&&await an(!0)}else if(e!==void 0){let i=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:i,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function yo(){try{let e=st(),t=zi.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await fo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function Fn(){gr&&(gr.style.display="none")}function Xe(e,t){if(!Z)return;if(Z.style.fontWeight="bold",e==="authenticating"){ul(),Z.style.color="#ffa500",Z.replaceChildren();let i=document.createElement("span");i.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);Z.appendChild(i),Z.appendChild(a);return}if(e==="error"){ne(Z,"circle-x",t||"Authorization failed"),Z.style.color="#ff4d4f",ke();return}let n=st();n.isSignedIn?(ne(Z,"circle-check","Signed in"),Z.style.color="#52c41a",Z.removeAttribute("title"),n.userName?(Z.onmouseenter=()=>{ne(Z,"circle-check",`Signed in as ${n.userName}`)},Z.onmouseleave=()=>{ne(Z,"circle-check","Signed in")}):(Z.onmouseenter=null,Z.onmouseleave=null)):(ne(Z,"circle-x","Not signed in"),Z.style.color="#ff4d4f",Z.removeAttribute("title"),Z.onmouseenter=null,Z.onmouseleave=null),ke()}function Qu(){Z&&(ul(),Z.classList.remove("tk-auth-blink"),Z.offsetWidth,Z.classList.add("tk-auth-blink"),setTimeout(()=>{Z.classList.remove("tk-auth-blink")},1200))}function vl(e,t=300*1e3){return new Promise((n,i)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),i(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let a=Date.now(),o="timekeeper_oauth",u=null,s=null,v=null,m=()=>{if(u){try{u.close()}catch{}u=null}s&&(clearInterval(s),s=null),v&&(clearInterval(v),v=null)};try{u=new BroadcastChannel(o),l&&l("OAuth monitor: BroadcastChannel created successfully"),u.onmessage=y=>{let E=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;l&&l("OAuth monitor: received BroadcastChannel message",E);let M=yt({type:ze(),token:Ve(ze()),error:Ve(ze())}).safeParse(y.data);if(!M.success){l&&l("OAuth monitor: invalid message format",M.error,"warn");return}if(M.data.type==="timekeeper_oauth_token"&&M.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),m();try{e.close()}catch{}n(M.data.token)}else if(M.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),m();try{e.close()}catch{}i(new Error(M.data.error||"OAuth failed"))}}}catch(y){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}l&&l("OAuth monitor: setting up IndexedDB polling");let f=Date.now();s=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let E=y.result,_=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");_.onsuccess=()=>{let q=_.result;if(q&&q.value){let ee=q.value,N=yt({type:ze(),token:Ve(ze()),error:Ve(ze()),timestamp:Ve(vt())}).safeParse(ee);if(!N.success){l&&l("OAuth monitor: invalid IndexedDB message format",N.error,"warn");return}if(N.data.timestamp&&N.data.timestamp>f){let K=N.data.token?{...N.data,token:"[REDACTED]"}:N.data;if(l&&l("OAuth monitor: received IndexedDB message",K),N.data.type==="timekeeper_oauth_token"&&N.data.token){l&&l("OAuth monitor: token received via IndexedDB"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(N.data.token)}else if(N.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",N.data.error,"error"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(new Error(N.data.error||"OAuth failed"))}f=N.data.timestamp||Date.now()}}E.close()}}}catch(y){l&&l("OAuth monitor: IndexedDB polling error",y,"error")}},500),v=setInterval(()=>{if(Date.now()-a>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),m();try{e.close()}catch{}i(new Error("OAuth popup timed out"));return}},1e3)})}async function yl(){if(!hi){Xe("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),Xe("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",hi),e.searchParams.set("redirect_uri",gl),e.searchParams.set("response_type","token"),e.searchParams.set("scope",hl),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),Xe("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),Xe("authenticating","Waiting for authentication...");try{let n=await vl(t),i=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(i.ok){let a=await i.json(),o=yt({name:Ve(ze()),email:Ve(ze())}).safeParse(a);if(!o.success)throw l&&l("Failed to validate user info response",o.error,"error"),new Error("Invalid user info response");let u=o.data;wt({isSignedIn:!0,accessToken:n,userName:u.name||null,email:u.email||null}),await yo(),Fn(),Xe(),ke(),await an(),l?l(`Successfully authenticated as ${u.name}`):console.log(`[Timekeeper] Successfully authenticated as ${u.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let i=n instanceof Error?n.message:"Authentication failed";l?l("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),Xe("error",i);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Xe("error",`Failed to sign in: ${t}`)}}async function Ju(){let e=st(),t=e.email;if(!hi||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",hi),n.searchParams.set("redirect_uri",gl),n.searchParams.set("response_type","token"),n.searchParams.set("scope",hl),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let i=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!i)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await vl(i,15e3);return wt({...e,isSignedIn:!0,accessToken:a}),await yo(),Fn(),Xe(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){l("Silent OAuth: silent refresh failed",a,"warn");try{i.close()}catch{}return!1}}async function bl(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),i=n.get("state");if(l&&l("OAuth popup: hash params found, state="+i),i!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),o=n.get("access_token"),u="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(u);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let v={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",v);let m=indexedDB.open("ytls-timestamps-db",4);m.onsuccess=()=>{let f=m.result,y=f.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:v});y.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",y.error,"error")},f.close()},m.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",m.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(o){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(u);s.postMessage({type:"timekeeper_oauth_token",token:o}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let v={type:"timekeeper_oauth_token",token:o,timestamp:Date.now()},m={...v,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",m);let f=indexedDB.open("ytls-timestamps-db",4);f.onsuccess=()=>{let g=f.result,E=g.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:v});E.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",E.error,"error")},g.close()},f.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",f.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function wl(){wt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await yo(),await an(),Fn(),Xe(),ke()}async function xl(){let e=st();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await Sl({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function gi(){let e=st();return e.isSignedIn&&!!e.accessToken}function Nn(){return gi()}function Zu(){let e=[];return gi()&&e.push("Google Drive"),e}function ed(e){let t=nl(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function kl(e){let t={Authorization:`Bearer ${e}`},i=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(i,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let o=await a.json();if(Array.isArray(o.files)&&o.files.length>0)return o.files[0].id;let u=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(u.status===401)throw new Error("unauthorized");if(!u.ok)throw new Error("drive folder create failed");return(await u.json()).id}async function Tl(e,t,n){let i=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(i),o=encodeURIComponent("modifiedTime desc"),u=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&orderBy=${o}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(u.status===401)throw new Error("unauthorized");if(!u.ok)throw new Error(`drive search failed (${u.status})`);let s=await u.json();return s.files&&s.files.length>0?s.files[0].id:null}async function rl(e){let t=await kl(e),n=await Tl("timekeeper-data.zip",t,e);if(!n)return null;let i=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(i.status===401)throw new Error("unauthorized");if(!i.ok)throw new Error(`drive download failed (${i.status})`);let a=await i.arrayBuffer();try{return ed(a)}catch(o){return l("Remote backup could not be decoded; the next upload will replace it:",o,"warn"),null}}async function td(){if(!vr)return;let e=st();if(!e.isSignedIn||!e.accessToken)return;let t;try{t=await rl(e.accessToken)}catch(a){if(a.message!=="unauthorized")throw a;await Sl({silent:!0});let o=st();if(!o.isSignedIn||!o.accessToken)throw a;t=await rl(o.accessToken)}if(!t)return;let{mergedVideos:n,mergedTimestamps:i}=await vr(t);i>0&&(l(`Pre-backup merge: added ${i} timestamps from ${n} videos from remote`),yr&&yr())}function nd(e,t){let n=new TextEncoder().encode(e),i=t.replace(/\\/g,"/").replace(/^\/+/,"");return i.endsWith(".json")||(i+=".json"),tl({[i]:[n,{level:6,mtime:Ku,os:0}]})}async function od(e,t,n,i){let a=e.replace(/\.json$/,".zip"),o=await Tl(a,n,i),u=new TextEncoder().encode(t).length,s=nd(t,e),v=s.length;l(`Compressing data: ${u} bytes -> ${v} bytes (${Math.round(100-v/u*100)}% reduction)`);let m="-------314159265358979",f=`\r
--${m}\r
`,g=`\r
--${m}--`,y=o?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},E=8192,M="";for(let K=0;K<s.length;K+=E){let re=s.subarray(K,Math.min(K+E,s.length));M+=String.fromCharCode.apply(null,Array.from(re))}let O=btoa(M),_=f+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+f+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+O+g,q,ee;o?(q=`https://www.googleapis.com/upload/drive/v3/files/${o}?uploadType=multipart&fields=id,name`,ee="PATCH"):(q="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",ee="POST");let N=await fetch(q,{method:ee,headers:{Authorization:`Bearer ${i}`,"Content-Type":`multipart/related; boundary=${m}`},body:_});if(N.status===401)throw new Error("unauthorized");if(!N.ok)throw new Error("drive upload failed")}async function Sl(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await Ju()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),wt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await yo(),await an(),Xe("error","Authorization expired. Please sign in again."),ke())}async function id(e){if(!gi())throw e?.silent||Xe("error","Configure a backup destination first"),new Error("no-backup-destination");await td();let t=await dl({includeDeleted:!0});if(t.totalTimestamps===0){if(t.invalidRows>0)throw new Error(`export-invalid-data: ${t.invalidRows} stored rows failed validation`);return e?.silent||l("Skipping export: no timestamps to back up"),"skipped"}let n=st();if(!n.accessToken)throw new Error("unauthorized");let i=await kl(n.accessToken);return await od(t.filename,t.json,i,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`),"uploaded"}async function Al(){try{let[e,t,n]=await Promise.all([ho("lastAutoBackupAt"),ho("autoBackupEnabled"),ho("autoBackupIntervalMinutes")]),i=Hi.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});i.success?(typeof i.data.autoBackupEnabled=="boolean"&&Wi(i.data.autoBackupEnabled),typeof i.data.autoBackupIntervalMinutes=="number"&&Ki(i.data.autoBackupIntervalMinutes),typeof i.data.lastAutoBackupAt=="number"&&Xi(i.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",i.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function kr(){try{let e=_e().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=Hi.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([fo("autoBackupEnabled",e.autoBackupEnabled),fo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),fo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function rd(){fi&&(clearInterval(fi),fi=null),je&&(clearTimeout(je),je=null)}function yn(e){try{let t=new Date(e),n=new Date,i=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return i?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function fr(){let e=Zu();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function El(){let e=_e().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?"#4285f4":e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?"#ffa500":Nn()&&e.lastAutoBackupAt?"#52c41a":Nn()?"#ffa500":"#ff4d4f":"#ff4d4f"}function ke(){if(Tr(),!oe)return;let e=_e().auth;if(!e.autoBackupEnabled)ne(oe,"refresh","Backup: Off"),oe.onmouseenter=null,oe.onmouseleave=null;else if(e.isAutoBackupRunning)ne(oe,"refresh","Backing up\u2026"),oe.onmouseenter=null,oe.onmouseleave=null;else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0){let n=Math.ceil(e.autoBackupBackoffMs/6e4);ne(oe,"alert-triangle",`Retry in ${n}m`),oe.onmouseenter=null,oe.onmouseleave=null}else if(!Nn())ne(oe,"alert-triangle","Backup target missing"),oe.onmouseenter=null,oe.onmouseleave=null;else if(e.lastAutoBackupAt){let n=e.lastAutoBackupAt,i=n+Math.max(1,Pt())*60*1e3,a=yn(i);oe.onmouseenter=()=>{ne(oe,"database",`Next backup: ${a}`)},oe.onmouseleave=()=>{ne(oe,"database",`Last backup: ${yn(n)}`)},ne(oe,"database",`Last backup: ${yn(n)}`)}else{let n=Date.now()+Math.max(1,Pt())*60*1e3,i=yn(n);oe.onmouseenter=()=>{ne(oe,"database",`Next backup: ${i}`)},oe.onmouseleave=()=>{ne(oe,"database","Last backup: never")},ne(oe,"database","Last backup: never")}oe.style.display="inline";let t=El();oe.style.color=t}var hr="ytls-backup-indicator--pulsing",ad="#4285f4",On=null;function sd(e,t){On&&(e.removeEventListener("animationiteration",On),On=null),t===ad?(e.style.backgroundColor=t,e.classList.add(hr)):e.classList.contains(hr)?(On=()=>{bn&&(bn.classList.remove(hr),bn.style.backgroundColor=t,On=null)},e.addEventListener("animationiteration",On,{once:!0})):e.style.backgroundColor=t}function Tr(){if(!bn)return;let e=El();sd(bn,e),Ye(bn,()=>{let t=_e().auth,n="";if(!t.autoBackupEnabled)n="Auto backup is disabled";else if(t.isAutoBackupRunning)n="Backup in progress";else if(t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0)n=`Retrying backup in ${Math.ceil(t.autoBackupBackoffMs/6e4)}m`;else if(!Nn())n=fr();else if(t.lastAutoBackupAt){let i=t.lastAutoBackupAt+Math.max(1,Pt())*60*1e3,a=yn(i);n=`Last backup: ${yn(t.lastAutoBackupAt)}
Next backup: ${a}
${fr()}`}else{let i=Date.now()+Math.max(1,Pt())*60*1e3;n=`No backup yet
Next backup: ${yn(i)}
${fr()}`}return n})}async function go(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!Nn()){t||(ke(),gi()||Qu());return}if(je){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(je),je=null,Hn(null),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!_e().auth.isAutoBackupRunning){Yi(!0),ke();try{await id({silent:t})==="uploaded"&&Xi(Date.now()),di(0),Hn(null),je&&(clearTimeout(je),je=null),await kr()}catch(i){if(l("Auto backup failed:",i,"error"),i.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let o=st();wt({...o,accessToken:null,isSignedIn:!1}),await yo(),Xe("error","Authorization expired. Please sign in again."),ke(),di(0),Hn(null),je&&(clearTimeout(je),je=null)}else if(_e().auth.autoBackupRetryAttempts<il){let o=_e().auth.autoBackupRetryAttempts+1;di(o);let s=Math.min(Yu*Math.pow(2,o-1),Xu);Hn(s),je&&clearTimeout(je),je=setTimeout(()=>{go({silent:!0})},s),l(`Scheduling backup retry ${o}/${il} in ${Math.round(s/1e3)}s`),ke()}else Hn(null)}finally{Yi(!1),ke()}}}async function an(e=!1){if(rd(),!!vo()&&Nn()){if(fi=setInterval(()=>{go({silent:!0})},Math.max(1,Pt())*60*1e3),!e){let t=Date.now(),n=Math.max(1,Pt())*60*1e3,i=_e().auth.lastAutoBackupAt;(!i||t-i>=n)&&go({silent:!0})}ke()}}async function Ml(){let e=vo();Wi(!e),await kr(),await an(),ke()}async function Ll(){let e=Pt(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Ki(n),await kr(),await an(),ke()}function Sr(e,t){return ai(e).then(n=>n!==void 0?n:t)}function Ar(e,t){return ri(e,t),Promise.resolve()}var Er=window.location.hash;if(Er&&Er.length>1){let e=new URLSearchParams(Er.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let i=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),i.postMessage(a),i.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(i){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",i);let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},o=indexedDB.open("ytls-timestamps-db",4);o.onsuccess=()=>{let u=o.result,s=u.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",a.timestamp),u.close()}}}if(history.replaceState){let i=window.location.pathname+window.location.search;history.replaceState(null,"",i)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}Gs();Fs()||Ns();(async function(){"use strict";if(window.top!==window.self)return;function e(r){return Sr(r,void 0)}function t(r,c){return Ar(r,c)}wr(e),br(t);try{let r=await ai("device_id"),c=typeof r=="string"&&r.length>0?r:crypto.randomUUID();await ri("device_id",c),l(`Lamport: device_id = ${c}`)}catch(r){l("Lamport: failed to initialize device_id:",r,"warn")}if(await bl()){l("OAuth popup detected, broadcasting token and closing");return}await xr();let i=["/watch","/live"];function a(r=window.location.href){try{let c=new URL(r);return c.origin!=="https://www.youtube.com"?!1:i.some(d=>c.pathname===d||c.pathname.startsWith(`${d}/`))}catch(c){return l("Timekeeper failed to parse URL for support check:",c,"error"),!1}}let o=null,u=null,s=null,v=null,m=null,f=null,g=(()=>{try{let r=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(r)&&r>0&&r!==1?Math.min(r,4):2}catch{return 2}})(),y=!1,E=null,M=null,O=250,_=null;function q(){return _e().ui.minPaneHeight}function ee(r){As(r)}function N(r){Ms(r)}function K(){return _e().ui.urlChangeHandlersSetup}function re(r){Ls(r)}function ue(){return _e().ui.panePosition}function J(r){Es(r)}function G(r){Is(r)}function D(){return o?o.getBoundingClientRect():null}function he(r,c,d){r&&J({x:Math.round(typeof c=="number"?c:r.left),y:Math.round(typeof d=="number"?d:r.top),width:Math.round(r.width),height:Math.round(r.height)})}function ie(r=!0){if(!o)return;Tn();let c=D();if(c&&(c.width||c.height)&&(he(c),r)){let d=ue();No("windowPosition",d),wn({type:"window_position_updated",position:d,timestamp:Date.now()})}}function ve(){if(!o||!u||!v||!s)return;let r=40,c=Ee();if(c.length>0)r=c[0].offsetHeight;else{let d=document.createElement("li");d.style.visibility="hidden",d.style.position="absolute",d.textContent="00:00 Example",s.appendChild(d),r=d.offsetHeight,s.removeChild(d)}O=u.offsetHeight+v.offsetHeight+r,ee(O),o.style.minHeight=q()+"px"}function ct(){requestAnimationFrame(()=>{Le?.(),ve(),ie(!0)})}function Ne(r=450){Se&&(clearTimeout(Se),Se=null),Se=setTimeout(()=>{Te(),ct(),Se=null},r)}function Ce(){Se&&(clearTimeout(Se),Se=null)}function ye(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),ct(),Ne()}function ae(){Te(),Ce(),ut&&(clearTimeout(ut),ut=null),ut=setTimeout(()=>{o&&(o.style.display="none",Qr(),ut=null)},400)}function Te(){if(!s){Qe&&(Qe(),Qe=null,Ot=null,cn=null);return}if(!cn){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),Qe&&(Qe(),Qe=null,Ot=null);return}l("Appending deferred timestamps after animation"),s.appendChild(cn),cn=null,Kt(),Yt(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),Qe&&(Qe(),Qe=null,Ot=null),St(),Ge(),Le&&requestAnimationFrame(Le),ft(!0)}let se=null,Me=!1,be="ytls-timestamp-pending-delete",we="ytls-timestamp-highlight";async function Fe(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(r=>setTimeout(r,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(r=>setTimeout(r,100));await new Promise(r=>setTimeout(r,200))}let De=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],le=5e3,et=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function zt(r){return et.has(r)}function xe(){return document.querySelector("video")}let tt=null;function Y(){if(tt&&document.contains(tt))return tt;let r=document.getElementById("movie_player");return r&&document.contains(r)?r:null}function jt(r){return(Math.round(r*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function sn(r){let c=r===1?2:r;g=c;try{localStorage.setItem("ytls-last-speed",String(c))}catch{}}function kt(r){if(!f)return;let c=typeof r=="number"?r:xe()?.playbackRate??1,d=jt(c);f.dataset.speed!==d&&(f.dataset.speed=d,f.textContent=`${d}x`,f.setAttribute("aria-label",`Playback speed ${d}x`)),Math.abs(c-1)>.01?f.classList.add("ytls-playback-speed-active"):f.classList.remove("ytls-playback-speed-active")}function Gn(r){let c=Y(),d=xe();if(y=!0,c&&typeof c.setPlaybackRate=="function")c.setPlaybackRate(r);else if(d)d.playbackRate=r;else return y=!1,!1;return kt(r),!0}function Mr(){let r=xe()?.playbackRate;return Number.isFinite(r)?Gn(Math.abs(r-1)<=.001?g:1):!1}function Il(r){return r instanceof Element?!!r.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function vi(r){return De.every(c=>typeof r?.[c]=="function"?!0:zt(c)?!!xe():!1)}function Bl(r){return De.filter(c=>typeof r?.[c]=="function"?!1:zt(c)?!xe():!0)}async function Cl(r=le){let c=Date.now();for(;Date.now()-c<r;){let b=Y();if(vi(b))return b;await new Promise(x=>setTimeout(x,100))}let d=Y();return vi(d),d}let Lr="timestampOffsetSeconds",Dl=-5,Ir="shiftClickTimeSkipSeconds",Rl=10,yi=300,bi=300,Tt=null;function Br(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Cr(){if(Br()&&!Tt)try{Tt=new BroadcastChannel("ytls_timestamp_channel"),Tt.onmessage=Dr}catch(r){l("Failed to create BroadcastChannel:",r,"warn"),Tt=null}}function wn(r){if(!Br()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Cr(),!Tt){l("No BroadcastChannel available to post message","warn");return}try{Tt.postMessage(r)}catch(c){l("BroadcastChannel error, reopening:",c,"warn");try{Tt=new BroadcastChannel("ytls_timestamp_channel"),Tt.onmessage=Dr,Tt.postMessage(r)}catch(d){l("Failed to reopen BroadcastChannel:",d,"error")}}}function Dr(r){if(l("Received message from another tab:",r.data),!(!a()||!s||!o)&&r.data){if(r.data.type==="timestamps_updated"&&r.data.videoId===Re)l("Debouncing timestamp load due to external update for video:",r.data.videoId),clearTimeout(Vn),Vn=setTimeout(()=>{l("Reloading timestamps due to external update for video:",r.data.videoId),Mi()},500);else if(r.data.type==="window_position_updated"&&o){let c=r.data.position;if(c&&typeof c.x=="number"&&typeof c.y=="number"){o.style.left=`${c.x}px`,o.style.top=`${c.y}px`,o.style.right="auto",o.style.bottom="auto",typeof c.width=="number"&&c.width>0&&(o.style.width=`${c.width}px`),typeof c.height=="number"&&c.height>0&&(o.style.height=`${c.height}px`);let d=o.getBoundingClientRect();J({x:Math.round(c.x),y:Math.round(c.y),width:Math.round(d.width),height:Math.round(d.height)});let b=document.documentElement.clientWidth,x=document.documentElement.clientHeight;(d.left<0||d.top<0||d.right>b||d.bottom>x)&&Tn()}}}}Cr();let xn=await Sr(Lr);(typeof xn!="number"||Number.isNaN(xn))&&(xn=Dl,await Ar(Lr,xn));let Un=await Sr(Ir);(typeof Un!="number"||Number.isNaN(Un))&&(Un=Rl,await Ar(Ir,Un));let Vn=null,Ht=new Map,ln=!1,z=null,bo=null,Re=null,ut=null,Se=null,dt=null,qe=null,qt=null,wi=!1,Le=null,cn=null,Ot=null,Qe=null,$t=null,wo=!1,xi=!1,xo=null,ko=null,To=null,So=null,Ao=null,Eo=null,Mo=null,Lo=null,_n=null,jn=null,qn=null,pt=null,mt=null,Rr=0,$n=!1,un=null,Wn=null,kn=null,Pr=null,Kn=null;function dn(){if(!s)return{items:[],starts:[],rawTimes:[]};if(Pr!==s||!Kn?(Kn?.disconnect(),Kn=new MutationObserver(()=>{kn=null}),Kn.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),Pr=s,kn=null):Kn.takeRecords().length>0&&(kn=null),!kn){let r=si(s),c=new Array(r.length),d=new Array(r.length);for(let b=0;b<r.length;b++){let x=r[b].querySelector("[data-time]")?.dataset.time;c[b]=x?Number.parseInt(x,10):NaN,d[b]=x?parseFloat(x):0}kn={items:r,starts:c,rawTimes:d}}return kn}function Ee(){return dn().items}function ki(){return Ts(s)}function Wt(){return Wn!==null||(Wn=Ss(s)),Wn}function Kt(){Wn=null}function Io(r=Y(),c=xe()){let d=r?.getDuration?.();return Number.isFinite(d)&&d>0?d:Number.isFinite(c?.duration)&&c.duration>0?c.duration:0}function zr(){return Io()||Wt()}function Pl(r){let c=r.querySelector(".time-diff");return c?(c.textContent?.trim()||"").startsWith("-"):!1}let zl="\u251C\u2500 ",Hr="\u2514\u2500 ",Or=/^[├└]─\s/;function Bo(r){return Or.test(r)}function Nr(r){return r.replace(Or,"")}function Fr(r){let c=Ee();if(r>=c.length-1)return Hr;let x=c[r+1].querySelector("input");return x&&Bo(x.value)?zl:Hr}function Hl(r,c){return`${Fr(c)}${r}`}function St(){if(!s)return;Ee().forEach((c,d)=>{let b=c.querySelector("input");if(!b||!Bo(b.value))return;let x=Nr(b.value),A=Hl(x,d);b.value!==A&&(b.value=A)})}function Yn(){li(s),cn&&(cn=null),Qe&&(Qe(),Qe=null,Ot=null)}function Xn(){ks(s,Me)}function Gr(r){$i(s,r)}function Ti(){bs(s)}function Si(r){if(!(!o||!s)){if(Me=r,r)o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),Gr("Loading timestamps...");else if(Ti(),o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),m){let c=Y();if(c){let d=c.getCurrentTime(),b=Number.isFinite(d)?Math.max(0,Math.floor(d)):Math.max(0,Wt()),x=s?dn().rawTimes:[];m.textContent=ni(b,x,Io(c))}}!Me&&s&&!lo(s)&&Xn(),Nt()}}function Co(r,c){r.dataset.time=String(c),r.textContent=en(c,zr())}let Do=null,Ro=null,At=!1;function Ur(r,c){if(!r||typeof r.getVideoData!="function"||!(c!==void 0?c:!!r.getVideoData()?.isLive))return!1;if(typeof r.getProgressState=="function"){let b=r.getProgressState(),x=Number(b?.seekableEnd??b?.liveHead??b?.head??b?.duration),A=Number(b?.current??r.getCurrentTime?.());if(Number.isFinite(x)&&Number.isFinite(A))return x-A>2}return!1}function Ol(r,c){if(!Number.isFinite(r))return;let d=Vr(r);Ai(d,c)}function ft(r=!1,c){if(ln&&!r)return;let d;if(typeof c=="number"&&Number.isFinite(c))d=Math.max(0,Math.floor(c));else{let b=Y(),x=b?b.getCurrentTime():NaN;d=Number.isFinite(x)?Math.max(0,Math.floor(x)):Math.max(0,Wt())}Number.isFinite(d)&&Ol(d,r)}function Vr(r){if(!Number.isFinite(r))return null;let{items:c,starts:d}=dn(),b=-1,x=-1/0;for(let A=0;A<d.length;A++){let T=d[A];T<=r&&T>x&&(x=T,b=A)}return b>=0?c[b]:null}function Ai(r,c=!1){let d=s?s.getElementsByClassName(we):null;if(!(!!d&&(r?d.length===1&&d[0]===r:d.length===0))&&d)for(let x of Array.from(d))x.classList.contains(be)||x.classList.remove(we);if(r&&!r.classList.contains(be)&&(r.classList.add(we),c))try{if(s instanceof HTMLElement){let x=r.getBoundingClientRect(),A=s.getBoundingClientRect();!(x.bottom<A.top||x.top>A.bottom)||r.scrollIntoView({behavior:"smooth",block:"center"})}else r.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{r.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Nl(r){if(ht()||!Number.isFinite(r)||r===0)return!1;let c=Ee();if(c.length===0)return!1;let d=[];return c.forEach(b=>{let x=b.querySelector("[data-time]"),A=x?.dataset.time;if(!x||!A)return;let T=Number.parseInt(A,10);if(!Number.isFinite(T))return;let k=Math.max(0,T+r);if(k!==T){Co(x,k);let I=b.dataset.guid;I&&d.push({guid:I,start:k,comment:b.querySelector("input")?.value??""})}}),d.length===0?!1:(Yt(),St(),Ge(),Ei(),$r(Re,d),un=null,!0)}function _r(r,c={}){if(!Number.isFinite(r)||r===0)return!1;if(!Nl(r)){if(c.alertOnNoChange){let T=c.failureMessage??"Offset did not change any timestamps.";alert(T)}return!1}let b=c.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${r>0?"+":""}${r} seconds (${b})`);let x=Y(),A=x?Math.floor(x.getCurrentTime()):0;if(Number.isFinite(A)){let T=Vr(A);Ai(T,!1)}return!0}function jr(r){if(!s||Me)return;let c=r.target instanceof Element?r.target:null;if(!c)return;let d=c.closest("[data-time]"),b=c.closest("[data-increment]"),x=c.closest("[data-action]");if(d?.dataset.time){r.preventDefault();let A=Number(d.dataset.time);if(Number.isFinite(A)){l(`Seeking to timestamp ${A}`),At=!0;let k=Y();k&&k.seekTo(A),setTimeout(()=>{At=!1},500)}let T=d.closest("li");T&&(Ee().forEach(k=>{k.classList.contains(be)||k.classList.remove(we)}),T.classList.contains(be)||(T.classList.add(we),T.scrollIntoView({behavior:"smooth",block:"center"})))}else if(b?.dataset.increment){r.preventDefault();let A=b.closest("li"),T=A?.querySelector("[data-time]");if(!T||!T.dataset.time)return;let k=parseInt(T.dataset.time,10),I=parseInt(b.dataset.increment,10);if("shiftKey"in r&&r.shiftKey&&(I*=Un),"altKey"in r?r.altKey:!1){_r(I,{logLabel:"Alt adjust"});return}let U=Math.max(0,k+I);if(l(`Timestamps changed: Timestamp time incremented from ${k} to ${U}`),Kt(),Co(T,U),Ro=U,Do&&clearTimeout(Do),At=!0,Do=setTimeout(()=>{if(Ro!==null){let te=Y();te&&te.seekTo(Ro)}Do=null,Ro=null,setTimeout(()=>{At=!1},500)},500),Yt(),St(),Ge(),A){let te=A.querySelector("input"),ge=A.dataset.guid;te&&ge&&(Ho(Re,ge,U,te.value),un=ge)}}else x?.dataset.action==="clear"&&(r.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",Kt(),Ge(),Po(),Ul(),G([]),Gl(Re),un=null,Xn())}function Qn(r,c="",d=!1,b=null,x=!0){if(!s)return null;let A=Math.max(0,r),T=b??crypto.randomUUID(),k=document.createElement("li"),I=document.createElement("div"),B=document.createElement("span"),C=document.createElement("span"),U=document.createElement("span"),te=document.createElement("div"),ge=document.createElement("span"),nt=document.createElement("span"),X=document.createElement("input"),de=document.createElement("button");k.dataset.guid=T,I.className="time-row",te.className="ytls-row-controls";let Ie=document.createElement("div");Ie.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",Ye(Ie,"Click to toggle indent");let Je=document.createElement("span");Je.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let gt=()=>{let V=X.offsetTop,H=X.offsetHeight||20;Ie.style.top=`${V}px`,Ie.style.height=`${H}px`},Et=()=>{He(Je,Bo(X.value)?"indent-decrease":"indent-increase",18)},Sn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",Xt=V=>{let H=Je.querySelector("svg");H&&(H.style.transition="filter 0.15s ease",H.style.filter=V?Sn:"none")},An=V=>{V.stopPropagation();let H=Bo(X.value),ce=Nr(X.value),Q="";if(!H){let ot=Ee().indexOf(k);Q=Fr(ot)}X.value=Q?`${Q}${ce}`:ce,Et(),St();let me=Number.parseInt(ge.dataset.time??"0",10);Ho(Re,T,me,X.value)};Ie.onclick=An,Ie.append(Je),Ie.addEventListener("mouseenter",()=>{Xt(!0)}),Ie.addEventListener("mouseleave",()=>{Xt(!1)}),k.style.cssText="position:relative;padding-left:20px;",k.addEventListener("mouseenter",()=>{gt(),Et(),Je.style.display="inline"}),k.addEventListener("mouseleave",()=>{Xt(!1),Je.style.display="none"}),k.addEventListener("mouseleave",()=>{k.dataset.guid===un&&Pl(k)&&qr()}),X.value=c||"",X.style.cssText="width:100%;margin-top:5px;display:block;",X.type="text",X.setAttribute("inputmode","text"),X.autocapitalize="off",X.autocomplete="off",X.spellcheck=!1,requestAnimationFrame(gt);let Zn=!1;X.addEventListener("focusin",()=>{$n=!1,Zn=!1}),X.addEventListener("focusout",V=>{let H=V.relatedTarget,ce=Date.now()-Rr<250,Q=!!H&&!!o&&o.contains(H);!ce&&!Q&&!Zn&&($n=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(X.focus({preventScroll:!0}),$n=!1)},0))}),X.addEventListener("keydown",V=>{(V.key==="Escape"||V.key==="Esc")&&(V.preventDefault(),Zn=!0,X.blur())});let eo=V=>{let H=Ht.get(T);H&&clearTimeout(H.timeoutId);let ce=Re,Q=()=>{let me=Ht.get(T);me&&(clearTimeout(me.timeoutId),Ht.delete(T)),Wr(ce,T,Number.parseInt(ge.dataset.time??"0",10),X.value)};Ht.set(T,{timeoutId:setTimeout(Q,V),flush:Q})};X.addEventListener("input",V=>{let H=V;H&&(H.isComposing||H.inputType==="insertCompositionText")||eo(500)}),X.addEventListener("compositionend",()=>{eo(50)});let Ft="#f4ba78",Fo="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",Go="#c8452d",Uo="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",mn=(V,H=Ft,ce=Fo)=>{V.style.color=H;let Q=V.querySelector("svg");Q&&(Q.style.transition="filter 0.15s ease"),V.addEventListener("mouseenter",()=>{Q&&(Q.style.filter=ce)}),V.addEventListener("mouseleave",()=>{Q&&(Q.style.filter="none")})};He(B,"circle-minus",18),B.classList.add("ytls-row-control"),B.dataset.increment="-1",B.style.cursor="pointer",B.style.margin="0px",mn(B),He(U,"circle-plus",18),U.classList.add("ytls-row-control"),U.dataset.increment="1",U.style.cursor="pointer",U.style.margin="0px",mn(U),He(C,"current-location",18),C.classList.add("ytls-row-control"),C.style.cursor="pointer",C.style.margin="0px",Ye(C,"Set to current playback time"),mn(C),C.onclick=()=>{let V=Y(),H=V?Math.floor(V.getCurrentTime()):0;Number.isFinite(H)&&(l(`Timestamps changed: set to current playback time ${H}`),Kt(),Co(ge,H),Yt(),St(),Ho(Re,T,H,X.value),un=T)},Kt(),Co(ge,A),ge.addEventListener("click",V=>{V.preventDefault(),V.stopPropagation();let H=Number(ge.dataset.time);if(!Number.isFinite(H))return;l(`Seeking to timestamp ${H}`),At=!0;let ce=Y();ce&&ce.seekTo(H);let Q=xe();Q?.paused&&Q.play(),setTimeout(()=>{At=!1},500),s?.querySelectorAll(`.${we}`).forEach(me=>me.classList.remove(we)),k.classList.contains(be)||(k.classList.add(we),k.scrollIntoView({behavior:"smooth",block:"center"}))}),He(de,"trash",16),de.classList.add("ytls-row-control"),de.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",mn(de,Go,Uo),de.onclick=()=>{let V=null,H=null,ce=null,Q=()=>{try{k.removeEventListener("click",H,!0)}catch{}try{document.removeEventListener("click",H,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",ce)}catch{}V&&(clearTimeout(V),V=null)};if(k.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let me=k.dataset.guid??"",Ue=Ht.get(me);Ue&&(clearTimeout(Ue.timeoutId),Ht.delete(me)),Q(),k.remove(),Kt(),Yt(),St(),Ge(),Po(),Vl(Re,me),un=null,Xn()}else{k.dataset.deleteConfirmed="true",k.classList.add(be),k.classList.remove(we);let me=()=>{k.dataset.deleteConfirmed="false",k.classList.remove(be);let Ue=Y(),ot=Ue?Ue.getCurrentTime():0,Mt=Number.parseInt(k.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(ot)&&Number.isFinite(Mt)&&ot>=Mt&&k.classList.add(we),Q()};H=Ue=>{Ue.target!==de&&me()},ce=()=>{k.dataset.deleteConfirmed==="true"&&me()},k.addEventListener("click",H,!0),document.addEventListener("click",H,!0),s&&s.addEventListener("mouseleave",ce),V=setTimeout(()=>{k.dataset.deleteConfirmed==="true"&&me(),Q()},5e3)}},nt.className="time-diff",nt.style.color="#888",nt.style.marginLeft="5px",te.append(B,C,U,de),I.append(ge,te,nt),k.append(Ie,I,X);let Vo=Number.parseInt(ge.dataset.time??"0",10);if(x){Ti();let V=!1,H=Ee();for(let ce=0;ce<H.length;ce++){let Q=H[ce],Ue=Q.querySelector("[data-time]")?.dataset.time;if(!Ue)continue;let ot=Number.parseInt(Ue,10);if(Number.isFinite(ot)&&Vo<ot){s.insertBefore(k,Q),V=!0;break}}V||s.appendChild(k),k.scrollIntoView({behavior:"smooth",block:"center"}),Kt(),Yt(),Po(),St(),Ge(),d||(Ho(Re,T,A,c),un=T,Ai(k,!1))}else X.__ytls_li=k;return X}function Yt(){if(ht())return;let r=zr(),c=Ee();c.forEach((d,b)=>{let x=d.querySelector(".time-diff"),A=d.querySelector("[data-time]"),T=A?.dataset.time;if(A&&T){let nt=Number.parseInt(T,10);Number.isFinite(nt)&&(A.textContent=en(nt,r))}if(!x)return;if(!T){x.textContent="";return}let k=Number.parseInt(T,10);if(!Number.isFinite(k)){x.textContent="";return}if(b===0){x.textContent="";return}let C=c[b-1].querySelector("[data-time]")?.dataset.time;if(!C){x.textContent="";return}let U=Number.parseInt(C,10);if(!Number.isFinite(U)){x.textContent="";return}let te=k-U,ge=te<0?"-":"";x.textContent=` ${ge}${en(Math.abs(te))}`})}function qr(){if(ht())return;let r=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let T=document.activeElement,I=T.closest("li")?.dataset.guid;if(I){let B=T.selectionStart??T.value.length,C=T.selectionEnd??B,U=T.scrollLeft;r={guid:I,start:B,end:C,scroll:U}}}let c=Ee();if(c.length===0)return;let d=c.map(T=>T.dataset.guid),b=c.map(T=>{let k=T.querySelector("[data-time]"),I=k?.dataset.time;if(!k||!I)return null;let B=Number.parseInt(I,10);if(!Number.isFinite(B))return null;let C=T.dataset.guid??"";return{time:B,guid:C,element:T}}).filter(T=>T!==null).sort((T,k)=>{let I=T.time-k.time;return I!==0?I:T.guid.localeCompare(k.guid)}),x=b.map(T=>T.guid),A=d.length!==x.length||d.some((T,k)=>T!==x[k]);if(s.replaceChildren(),b.forEach(T=>{s.appendChild(T.element)}),Yt(),St(),Ge(),r){let k=Ee().find(I=>I.dataset.guid===r.guid)?.querySelector("input");if(k)try{k.focus({preventScroll:!0})}catch{}}A&&(l("Timestamps changed: Timestamps sorted"),Ei())}function Po(){if(!s||!o||!u||!v)return;let r=Ee().length;Le?.();let c=o.getBoundingClientRect(),d=u.getBoundingClientRect(),b=v.getBoundingClientRect(),x=Math.max(0,c.height-(d.height+b.height));r===0?(Xn(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>x?"auto":"hidden"}function Ge(){if(!s)return;let r=xe(),c=document.querySelector(".ytp-progress-bar"),d=Y(),b=d?d.getVideoData():null,x=!!b&&!!b.isLive;if(!r||!c||!isFinite(r.duration)||x)return;Yr();let{items:A,starts:T}=dn(),k=r.duration,I=document.createDocumentFragment();A.forEach((B,C)=>{let U=T[C];if(!Number.isFinite(U))return;B.dataset.guid||(B.dataset.guid=crypto.randomUUID());let te=document.createElement("div");te.className="ytls-marker",te.style.left=U/k*100+"%",te.dataset.time=String(U),I.appendChild(te)}),c.appendChild(I),Fl(c)}function Fl(r){r.dataset.ytlsMarkerClicks||(r.dataset.ytlsMarkerClicks="1",r.addEventListener("click",c=>{let d=c.target?.closest?.(".ytls-marker");if(!d)return;let b=Number(d.dataset.time),x=Y();x&&Number.isFinite(b)&&x.seekTo(b)}))}function Ei(){G(ki().sort((r,c)=>r.start-c.start))}function $r(r,c){!r||c.length===0||Me||ht()||(Yl(r,c).then(()=>{l(`Saved ${c.length} timestamps for ${r} to IndexedDB`),s&&Jn()}).catch(d=>{let b=`Failed to save timestamps: ${d.message}`;l(`Failed to save timestamps for ${r} to IndexedDB:`,d,"error"),pn(b)}),wn({type:"timestamps_updated",videoId:r,action:"saved"}))}function Gl(r){!r||Me||ht()||(Xr(r).then(()=>{s&&Jn()}).catch(c=>{let d=`Failed to clear timestamps: ${c.message}`;l(`Failed to clear timestamps for ${r}:`,c,"error"),pn(d)}),wn({type:"timestamps_updated",videoId:r,action:"saved"}))}function zo(){for(let{flush:r}of[...Ht.values()])r()}function Ul(){Ht.forEach(({timeoutId:r})=>clearTimeout(r)),Ht.clear()}function Ho(r,c,d,b){!r||Me||ht()||Wr(r,c,d,b)}function Wr(r,c,d,b){if(!r)return;let x={guid:c,start:d,comment:b};l(`Saving timestamp: guid=${c}, start=${d}, comment="${b}"`),Xl(r,x).then(()=>{s&&Jn()}).catch(A=>{let T=`Failed to save timestamp: ${A.message}`;l(`Failed to save timestamp ${c}:`,A,"error"),pn(T)}),wn({type:"timestamps_updated",videoId:r,action:"saved"})}function Vl(r,c){!r||Me||ht()||(Ql(r,c).then(()=>{s&&Jn()}).catch(d=>{let b=`Failed to delete timestamp: ${d.message}`;l(`Failed to delete timestamp ${c}:`,d,"error"),pn(b)}),wn({type:"timestamps_updated",videoId:r,action:"saved"}))}async function Kr(r){if(ht()){alert("Cannot export timestamps while an error is being displayed.");return}let c=Re;if(!c)return;l(`Exporting timestamps for video ID: ${c}`);let d=ki(),b=hn();if(r==="json"){let x=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),A=URL.createObjectURL(x),T=document.createElement("a");T.href=A,T.download=`timestamps-${c}-${b}.json`,T.click(),URL.revokeObjectURL(A)}else if(r==="text"){let x=Oi(d,!0),A=new Blob([x],{type:"text/plain"}),T=URL.createObjectURL(A),k=document.createElement("a");k.href=T,k.download=`timestamps-${c}-${b}.txt`,k.click(),URL.revokeObjectURL(T)}}function pn(r){if(!o||!s){l("Timekeeper error:",r,"error");return}ws(s,r),Qi(r),Ge()}function Jn(){s&&(xs(s),Qi(null))}function ht(){return!!(!s||lo(s)||Me||Bs()!==null)}function Yr(){document.querySelectorAll(".ytls-marker").forEach(r=>r.remove())}function Tn(){if(!o||!document.body.contains(o))return;let r=o.getBoundingClientRect(),c=document.documentElement.clientWidth,d=document.documentElement.clientHeight,b=r.width,x=r.height;if(r.left<0&&(o.style.left="0",o.style.right="auto"),r.right>c){let A=Math.max(0,c-b);o.style.left=`${A}px`,o.style.right="auto"}if(r.top<0&&(o.style.top="0",o.style.bottom="auto"),r.bottom>d){let A=Math.max(0,d-x);o.style.top=`${A}px`,o.style.bottom="auto"}}function _l(){if(xo&&(document.removeEventListener("mousemove",xo),xo=null),ko&&(document.removeEventListener("mouseup",ko),ko=null),_n&&(document.removeEventListener("keydown",_n),_n=null),To&&(window.removeEventListener("resize",To),To=null),jn&&(document.removeEventListener("pointerdown",jn,!0),jn=null),qn&&(document.removeEventListener("pointerup",qn,!0),qn=null),pt){try{pt.disconnect()}catch{}pt=null}if(mt){try{mt.disconnect()}catch{}mt=null}let r=xe();r&&(So&&(r.removeEventListener("timeupdate",So),So=null),Ao&&(r.removeEventListener("pause",Ao),Ao=null),Eo&&(r.removeEventListener("play",Eo),Eo=null),Mo&&(r.removeEventListener("seeking",Mo),Mo=null),Lo&&(r.removeEventListener("ratechange",Lo),Lo=null))}function jl(){Yr(),zo(),Vn&&(clearTimeout(Vn),Vn=null),se&&(clearInterval(se),se=null),ut&&(clearTimeout(ut),ut=null),_l(),Za();try{Tt.close()}catch{}if(z&&z.parentNode===document.body&&document.body.removeChild(z),z=null,bo=null,ln=!1,Re=null,pt){try{pt.disconnect()}catch{}pt=null}if(mt){try{mt.disconnect()}catch{}mt=null}o&&o.parentNode&&o.remove();let r=document.getElementById("ytls-header-button");r&&r.parentNode&&r.remove(),$t=null,wo=!1,J(null),Yn(),o=null,u=null,s=null,v=null,qe=null,qt=null,Le=null,m=null,f=null,E=null,tt=null}async function ql(){let r=Oo();if(!r)return tt=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let c=await Cl();if(!vi(c)){let d=Bl(c),b=d.length?` Missing methods: ${d.join(", ")}.`:"",x=c?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return tt=null,{ok:!1,message:`${x}${b} Try refreshing once playback is ready.`}}return tt=c,{ok:!0,player:c,videoId:r}}async function Mi(){if(!o||!s)return;let r=s.scrollTop,c=!0,d=()=>{if(!s||!c)return;let b=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(r,b)};try{let b=await ql();if(!b.ok){pn(b.message),Yn(),Ge();return}let{videoId:x}=b,A=[];try{let T=await Jl(x);T?(A=T.map(k=>({...k,guid:k.guid||crypto.randomUUID()})),l(`Loaded ${A.length} timestamps from IndexedDB for ${x}`),Jn()):l(`No timestamps found in IndexedDB for ${x}`)}catch(T){let k=`Failed to load timestamps: ${T.message}`;l(`Failed to load timestamps from IndexedDB for ${x}:`,T,"error"),pn(k),Ge();return}if(A.length>0){A.sort((I,B)=>I.start-B.start),Yn(),Ti();let T=document.createDocumentFragment();A.forEach(I=>{let C=Qn(I.start,I.comment,!0,I.guid,!1).__ytls_li;C&&T.appendChild(C)}),o&&o.classList.contains("ytls-zoom-in")&&Se!=null?(l("Deferring timestamp DOM append until show animation completes"),cn=T,Ot||(Ot=new Promise(I=>{Qe=I})),await Ot):s&&(s.appendChild(T),Kt(),Yt(),St(),Ge(),Le&&requestAnimationFrame(Le)),G(A),ft(!0),c=!1}else Yn(),Gr("No timestamps for this video"),Ge(),G([]),Le&&requestAnimationFrame(Le)}catch(b){l("Unexpected error while loading timestamps:",b,"error"),pn("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Ot&&await Ot,requestAnimationFrame(d),Le&&requestAnimationFrame(Le),s&&!lo(s)&&Xn()}}function Oo(){let c=new URLSearchParams(location.search).get("v");if(c)return c;let d=document.querySelector('meta[itemprop="identifier"]');return d?.content?d.content:null}function $l(r=null,c=null){if(!m)return;let d=xe(),b=c||Y();if(!d&&!b)return;let x=r!==null?r:b?b.getCurrentTime():0,A=Number.isFinite(x)?Math.max(0,Math.floor(x)):Math.max(0,Wt()),{isLive:T}=b?b.getVideoData()||{isLive:!1}:{isLive:!1},k=b?Ur(b,!!T):!1,I=s?dn().rawTimes:[];m.textContent=ni(A,I,Io(b,d)),m.style.color=k?"#ff4d4f":""}function Wl(){let r=xe();if(!r)return;let c=NaN,d=null,b=()=>{if(!s)return;let B=Y(),C=B?Math.floor(B.getCurrentTime()):0;if(!Number.isFinite(C))return;let U=dn();if(C===c&&U===d)return;let te=!!m&&!Me&&!At;te&&$l(C,B),ft(!1,C),te&&!ln&&(c=C,d=U)},x=B=>{try{let C=new URL(window.location.href);B!==null&&Number.isFinite(B)?C.searchParams.set("t",`${Math.floor(B)}s`):C.searchParams.delete("t"),window.history.replaceState(window.history.state,"",C.toString())}catch{}},A=()=>{let B=Y(),C=B?B.getCurrentTime():NaN,U=Number.isFinite(C)?Math.max(0,Math.floor(C)):Math.max(0,Wt());if(Number.isFinite(U)){x(U);try{ft(!0)}catch(te){l("Failed to highlight nearest timestamp on pause:",te,"warn")}}},T=()=>{x(null);try{let B=Y(),C=B?B.getCurrentTime():NaN,U=Number.isFinite(C)?Math.max(0,Math.floor(C)):Math.max(0,Wt());Number.isFinite(U)&&ft(!0)}catch(B){l("Failed to highlight nearest timestamp on play:",B,"warn")}},k=()=>{let B=xe();if(!B)return;let C=Y(),U=C?Math.floor(C.getCurrentTime()):0;Number.isFinite(U)&&(B.paused&&x(U),ft(!0,U))},I=()=>{let B=r.playbackRate;y?y=!1:sn(B),kt(B)};So=b,Ao=A,Eo=T,Mo=k,Lo=I,r.addEventListener("timeupdate",b),r.addEventListener("pause",A),r.addEventListener("play",T),r.addEventListener("seeking",k),r.addEventListener("ratechange",I)}let{saveToIndexedDB:Kl,saveRowsToIndexedDB:Yl,saveSingleTimestampToIndexedDB:Xl,deleteSingleTimestampFromIndexedDB:Ql,loadFromIndexedDB:Jl,removeFromIndexedDB:Xr,saveGlobalSettings:No,loadGlobalSettings:Li,buildExportPayload:Zl,mergeBackupData:ec,exportAllTimestamps:tc,exportAllTimestampsCsv:nc}=qi;function Qr(){if(!o)return;let r=o.style.display!=="none";No("uiVisible",r)}function Nt(r){let c=typeof r=="boolean"?r:!!o&&o.style.display!=="none",d=document.getElementById("ytls-header-button");d instanceof HTMLButtonElement&&d.setAttribute("aria-pressed",String(c)),$t&&!wo&&$t.src!==oi&&($t.src=oi)}function oc(){o&&Li("uiVisible").then(r=>{let c=Qo().safeParse(r),d=c.success?c.data:void 0;typeof d=="boolean"?(d?(o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in")):o.style.display="none",Nt(d)):(!c.success&&r!==void 0&&l("UI visibility state failed validation, defaulting to visible",c.error.message,"warn"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Nt(!0))}).catch(r=>{l("Failed to load UI visibility state:",r,"error"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Nt(!0)})}function Ii(r){if(!o){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(o)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(x=>{x!==o&&x.remove()}),document.body.appendChild(o));let c=document.querySelectorAll("#ytls-pane");c.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${c.length}), cleaning up`),c.forEach(x=>{x!==o&&x.remove()})),ut&&(clearTimeout(ut),ut=null);let d=o.style.display==="none";(typeof r=="boolean"?r:d)?(o.style.display="flex",o.classList.remove("ytls-fade-out"),o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Nt(!0),Qr(),ye(),Se&&(clearTimeout(Se),Se=null),Se=setTimeout(()=>{Te(),Le?.(),ve(),ie(!0);try{ft(!0)}catch(x){l("Failed to scroll to nearest timestamp after toggle:",x,"warn")}Se=null},450)):(o.classList.remove("ytls-fade-in"),o.classList.remove("ytls-zoom-in"),o.classList.add("ytls-zoom-out"),Nt(!1),ae())}function Jr(r){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let c=!1,d=[],b=(x,A)=>{let T=x.querySelector("input");if(!T)return;T.value=A;let k=x.dataset.guid,I=Number.parseInt(x.querySelector("[data-time]")?.dataset.time??"",10);k&&Number.isFinite(I)&&d.push({guid:k,start:I,comment:A})};try{let x=JSON.parse(r),A=null;if(Array.isArray(x))A=x;else if(typeof x=="object"&&x!==null){let T=Re;if(T){let k=`timekeeper-${T}`;x[k]&&Array.isArray(x[k].timestamps)&&(A=x[k].timestamps,l(`Found timestamps for current video (${T}) in export format`,"info"))}if(!A){let k=Object.keys(x).filter(I=>I.startsWith("ytls-"));if(k.length===1&&Array.isArray(x[k[0]].timestamps)){A=x[k[0]].timestamps;let I=x[k[0]].video_id;l(`Found timestamps for video ${I} in export format`,"info")}}}A&&Array.isArray(A)?A.every(k=>typeof k.start=="number"&&typeof k.comment=="string")?(A.forEach(k=>{if(k.guid){let I=Ee().find(B=>B.dataset.guid===k.guid);I?b(I,k.comment):Qn(k.start,k.comment,!1,k.guid)}else Qn(k.start,k.comment,!1,crypto.randomUUID())}),c=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!c){let x=r.split(`
`).map(A=>A.trim()).filter(A=>A);if(x.length>0){let A=!1;x.forEach(T=>{let k=T.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(k){A=!0;let I=parseInt(k[1])||0,B=parseInt(k[2]),C=parseInt(k[3]),U=I*3600+B*60+C,te=k[4]?k[4].trim():"",ge=null,nt=te,X=te.match(/<!--\s*guid:([^>]+?)\s*-->/);X&&(ge=X[1].trim(),nt=te.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let de;ge&&(de=Ee().find(Ie=>Ie.dataset.guid===ge)),!de&&!ge&&(de=Ee().find(Ie=>{if(Ie.dataset.guid)return!1;let gt=Ie.querySelector("[data-time]")?.dataset.time;if(!gt)return!1;let Et=Number.parseInt(gt,10);return Number.isFinite(Et)&&Et===U})),de?b(de,nt):Qn(U,nt,!1,ge||crypto.randomUUID())}}),A&&(c=!0)}}c?(l("Timestamps changed: Imported timestamps from file/clipboard"),St(),Ei(),$r(Re,d),Ge(),Po()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function ic(){if(xi){l("Pane initialization already in progress, skipping duplicate call");return}if(!(o&&document.body.contains(o))){xi=!0;try{let x=function(p=null,h=null){if(!m)return;let w=xe(),S=h||Y();if(!w&&!S)return;let L=p!==null?p:S?S.getCurrentTime():0,$=Number.isFinite(L)?Math.max(0,Math.floor(L)):Math.max(0,Wt()),{isLive:R}=S?S.getVideoData()||{isLive:!1}:{isLive:!1},F=S?Ur(S,!!R):!1,P=s?dn().rawTimes:[];m.textContent=ni($,P,Io(S,w)),m.style.color=F?"#ff4d4f":"",b(!!R);try{kt()}catch{}},A=function(){if(Me||At)return;let p=Y();if(!p)return;let h=p.getCurrentTime(),w=Number.isFinite(h)?Math.max(0,Math.floor(h)):Math.max(0,Wt());x(w,p),(s?Ee():[]).length>0&&ft(!1,w)},de=function(p,h,w,S){let L=document.createElement("button");return S?ne(L,S,p):L.textContent=p,Ye(L,h),L.classList.add("ytls-settings-modal-button"),L.onclick=w,L},Ie=function(p="general"){if(z&&z.parentNode===document.body){let Pe=document.getElementById("ytls-save-modal"),Zt=document.getElementById("ytls-load-modal"),Gt=document.getElementById("ytls-delete-all-modal");Pe&&document.body.contains(Pe)&&document.body.removeChild(Pe),Zt&&document.body.contains(Zt)&&document.body.removeChild(Zt),Gt&&document.body.contains(Gt)&&document.body.removeChild(Gt),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",gt,!0),document.removeEventListener("keydown",Je)},300);return}z=document.createElement("div"),z.id="ytls-settings-modal",z.classList.remove("ytls-fade-out"),z.classList.add("ytls-fade-in");let h=document.createElement("div");h.className="ytls-modal-header";let w=document.createElement("div");w.id="ytls-settings-nav";let S=document.createElement("button");S.className="ytls-modal-close-button",He(S,"x",14),S.onclick=()=>{if(z&&z.parentNode===document.body){let Pe=document.getElementById("ytls-save-modal"),Zt=document.getElementById("ytls-load-modal"),Gt=document.getElementById("ytls-delete-all-modal");Pe&&document.body.contains(Pe)&&document.body.removeChild(Pe),Zt&&document.body.contains(Zt)&&document.body.removeChild(Zt),Gt&&document.body.contains(Gt)&&document.body.removeChild(Gt),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",gt,!0),document.removeEventListener("keydown",Je)},300)}};let L=document.createElement("div");L.id="ytls-settings-content";let $=document.createElement("h3");$.className="ytls-section-heading",$.textContent="General",$.style.display="none";let R=document.createElement("div"),F=document.createElement("div");F.className="ytls-button-grid";function P(Pe){R.style.display=Pe==="general"?"block":"none",F.style.display=Pe==="google"?"block":"none",j.classList.toggle("active",Pe==="general"),pe.classList.toggle("active",Pe==="google"),$.textContent=Pe==="general"?"General":"Google"}let j=document.createElement("button");j.appendChild(oo("adjustments-horizontal",16));let Ae=document.createElement("span");Ae.className="ytls-tab-text",Ae.textContent=" General",j.appendChild(Ae),Ye(j,"General settings"),j.classList.add("ytls-settings-modal-button"),j.onclick=()=>P("general");let pe=document.createElement("button");pe.appendChild(oo("cloud",16));let Lt=document.createElement("span");Lt.className="ytls-tab-text",Lt.textContent=" Google",pe.appendChild(Lt),Ye(pe,"Google Drive backup settings"),pe.classList.add("ytls-settings-modal-button"),pe.onclick=async()=>{lt.isSignedIn&&await xl(),P("google")},w.appendChild(j),w.appendChild(pe),h.appendChild(w),h.appendChild(S),z.appendChild(h),R.className="ytls-button-grid",R.appendChild(de("Save","Save As...",Et.onclick,"device-floppy")),R.appendChild(de("Load","Load",Sn.onclick,"folder-open")),R.appendChild(de("Export All","Export All Data",Xt.onclick,"file-export")),R.appendChild(de("Import All","Import All Data",An.onclick,"file-import")),R.appendChild(de("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await nc()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let It=de(lt.isSignedIn?"Sign Out":"Sign In",lt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{lt.isSignedIn?await wl():await yl(),ne(It,lt.isSignedIn?"logout":"login",lt.isSignedIn?"Sign Out":"Sign In"),Ye(It,lt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ke()},lt.isSignedIn?"logout":"login"),Bn=de(vo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await Ml(),Jt(),ke()},"refresh"),fn=de(`Backup Interval: ${Pt()}min`,"Set periodic backup interval (minutes)",async()=>{await Ll(),Jt(),ke()},"clock-plus"),Jt=()=>{ne(It,lt.isSignedIn?"logout":"login",lt.isSignedIn?"Sign Out":"Sign In"),Ye(It,lt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ne(Bn,"refresh",vo()?"Auto Backup: On":"Auto Backup: Off"),ne(fn,"clock-plus",`Backup Interval: ${Pt()}min`),typeof ke=="function"&&ke()};F.appendChild(It),F.appendChild(Bn),F.appendChild(fn),F.appendChild(de("Backup Now","Run a backup immediately",async()=>{await go({silent:!1,skipBackoff:!0}),Jt()},"database"));let it=document.createElement("div");it.style.marginTop="15px",it.style.paddingTop="10px",it.style.borderTop="1px solid #555",it.style.fontSize="12px",it.style.color="#aaa";let Yo=document.createElement("div");Yo.style.marginBottom="8px",Yo.style.fontWeight="bold",it.appendChild(Yo),ll(Yo);let Ri=document.createElement("div");Ri.style.marginBottom="8px",al(Ri),it.appendChild(Ri);let la=document.createElement("div");sl(la),it.appendChild(la),F.appendChild(it),Xe(),Fn(),ke(),Jt(),L.appendChild($),L.appendChild(R),L.appendChild(F),P(p==="drive"?"google":p),z.appendChild(L),document.body.appendChild(z),requestAnimationFrame(()=>{let Pe=z.getBoundingClientRect(),Gt=(window.innerHeight-Pe.height)/2;z.style.top=`${Math.max(20,Gt)}px`,z.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",gt,!0),document.addEventListener("keydown",Je)},0)},Je=function(p){if(p.key==="Escape"&&z&&z.parentNode===document.body){let h=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),S=document.getElementById("ytls-delete-all-modal");if(h||w||S)return;p.preventDefault(),h&&document.body.contains(h)&&document.body.removeChild(h),w&&document.body.contains(w)&&document.body.removeChild(w),S&&document.body.contains(S)&&document.body.removeChild(S),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",gt,!0),document.removeEventListener("keydown",Je)},300)}},gt=function(p){if(bo&&bo.contains(p.target))return;let h=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),S=document.getElementById("ytls-delete-all-modal");h&&h.contains(p.target)||w&&w.contains(p.target)||S&&S.contains(p.target)||z&&z.contains(p.target)||(h&&document.body.contains(h)&&document.body.removeChild(h),w&&document.body.contains(w)&&document.body.removeChild(w),S&&document.body.contains(S)&&document.body.removeChild(S),z&&z.parentNode===document.body&&(z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",gt,!0),document.removeEventListener("keydown",Je)},300)))},Zn=function(){o&&(l("Loading window position from IndexedDB"),Li("windowPosition").then(p=>{let h=da.safeParse(p);if(h.success){let S=h.data;o.style.left=`${S.x}px`,o.style.top=`${S.y}px`,o.style.right="auto",o.style.bottom="auto",typeof S.width=="number"&&S.width>0?o.style.width=`${S.width}px`:(o.style.width=`${yi}px`,l(`No stored window width found, using default width ${yi}px`)),typeof S.height=="number"&&S.height>0?o.style.height=`${S.height}px`:(o.style.height=`${bi}px`,l(`No stored window height found, using default height ${bi}px`));let L=D();he(L,S.x,S.y),l("Restored window position from IndexedDB:",ue())}else h.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",h.error.message,"warn"),o.style.width=`${yi}px`,o.style.height=`${bi}px`,J(null);Tn();let w=D();w&&(w.width||w.height)&&he(w),Le?.()}).catch(p=>{l("failed to load pane position from IndexedDB:",p,"warn"),Tn();let h=D();h&&(h.width||h.height)&&J({x:Math.max(0,Math.round(h.left)),y:0,width:Math.round(h.width),height:Math.round(h.height)}),Le?.()}))},eo=function(){if(!o)return;let p=D();if(!p)return;let h={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)},w=ue();if(w&&w.x===h.x&&w.y===h.y&&w.width===h.width&&w.height===h.height){l("Skipping window position save; position and size unchanged");return}J({...h}),l(`Saving window position and size to IndexedDB: x=${h.x}, y=${h.y}, width=${h.width}, height=${h.height}`),No("windowPosition",h),wn({type:"window_position_updated",position:h,timestamp:Date.now()})},qo=function(p,h){p.addEventListener("dblclick",w=>{w.preventDefault(),w.stopPropagation(),o&&(o.style.width="300px",o.style.height="300px",eo(),Ko())}),p.addEventListener("mousedown",w=>{w.preventDefault(),w.stopPropagation(),Mt=!0,Qt=h,ta=w.clientX,na=w.clientY;let S=o.getBoundingClientRect();En=S.width,Mn=S.height,_o=S.left,jo=S.top,oa=document.documentElement.clientWidth,ia=document.documentElement.clientHeight,h==="top-left"||h==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},aa=function(){if(!s||!qt)return;let{scrollTop:p,scrollHeight:h,clientHeight:w}=s;if(h<=w)return;let S=Math.max(30,w/h*w),L=p/(h-w)*(w-S);qt.style.height=`${S}px`,qt.style.top=`${L}px`},sa=function(){qe&&(Di===null&&(Di=requestAnimationFrame(()=>{Di=null,aa()})),qe.classList.add("ytls-scrollbar-visible"),dt&&clearTimeout(dt),dt=setTimeout(()=>{qe?.classList.remove("ytls-scrollbar-visible"),dt=null},500))},Ko=function(){if(o&&u&&v&&s){let p=o.getBoundingClientRect(),h=u.getBoundingClientRect(),w=v.getBoundingClientRect(),S=p.height-(h.height+w.height);s.style.maxHeight=S>0?S+"px":"0px",s.style.overflowY=S>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),!document.getElementById("ytls-styles")){let p=document.createElement("style");p.id="ytls-styles",p.textContent=Ya,document.head.appendChild(p)}o=document.createElement("div"),u=document.createElement("div"),s=document.createElement("ul"),v=document.createElement("div"),m=document.createElement("span"),E=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=p=>{p.stopPropagation(),Ie("drive")},s.addEventListener("mouseenter",()=>{ln=!0,$n=!1}),s.addEventListener("mouseleave",()=>{ln=!1;try{Ni()}catch{}if($n)return;ft(!1);let p=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(p=document.activeElement.closest("li")?.dataset.guid??null),qr(),p){let w=Ee().find(S=>S.dataset.guid===p)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}}),o.id="ytls-pane",u.id="ytls-pane-header",u.addEventListener("dblclick",p=>{let h=p.target instanceof Element?p.target:null;if(h){let w=h;for(;w&&w!==o;){if(window.getComputedStyle(w).cursor==="pointer")return;w=w.parentElement}}p.preventDefault(),Ii(!1)});let r=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{o.addEventListener(p,r)}),o.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),o.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),o.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),o.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0),E.textContent=`v${ei}`,E.classList.add("ytls-version-display");let c=document.createElement("span");c.style.display="inline-flex",c.style.alignItems="center",c.style.gap="6px",c.appendChild(E),c.appendChild(M),m.id="ytls-current-time",m.textContent="\u2014",m.style.cursor="default",Ye(m,()=>{let p=Y(),{isLive:h}=p?p.getVideoData()||{isLive:!1}:{isLive:!1};return h?"Skip to live":""}),f=document.createElement("span"),f.id="ytls-playback-speed",f.textContent="1x",f.style.cursor="pointer",f.style.userSelect="none",Ye(f,()=>`Current playback speed. Click to toggle between 1x and ${jt(g)}x.`),f.onclick=()=>{Mr()},f.addEventListener("mousedown",p=>{p.stopPropagation()}),f.addEventListener("click",p=>{p.stopPropagation()}),m.onclick=()=>{let p=Y();if(!p)return;let{isLive:h}=p.getVideoData()||{isLive:!1};h&&(At=!0,p.seekToLiveHead(),setTimeout(()=>{At=!1},500))};let b=p=>{m.style.cursor=p?"pointer":"default"};A(),se&&clearInterval(se),se=setInterval(A,1e3),v.id="ytls-buttons";let T=(p,h)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),h&&h()},300)},k=p=>h=>{h.key==="Escape"&&(h.preventDefault(),h.stopPropagation(),p())},I=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},B=(p,h)=>w=>{p.contains(w.target)||h()},C=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(ht())return;let p=typeof xn<"u"?xn:0,h=Y(),w=h?Math.floor(h.getCurrentTime()+p):0;if(!Number.isFinite(w))return;let S=Qn(w,"");S&&S.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>Ie()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(p){if(ht()){He(this,"circle-x",20),setTimeout(()=>{He(this,"clipboard",20)},2e3);return}let h=ki();if(h.length===0){He(this,"circle-x",20),setTimeout(()=>{He(this,"clipboard",20)},2e3);return}let w=p.ctrlKey,S=Oi(h,w);navigator.clipboard.writeText(S).then(()=>{He(this,"circle-check",20),setTimeout(()=>{He(this,"clipboard",20)},2e3)}).catch(L=>{l("Failed to copy timestamps: ",L,"error"),He(this,"circle-x",20),setTimeout(()=>{He(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(ht())return;if(Ee().length===0){alert("No timestamps available to offset.");return}let h=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(h===null)return;let w=h.trim();if(w.length===0)return;let S=Number.parseInt(w,10);if(!Number.isFinite(S)){alert("Please enter a valid integer number of seconds.");return}S!==0&&_r(S,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let p=Oo();if(!p){alert("Unable to determine current video ID.");return}let h=document.createElement("div");h.id="ytls-delete-all-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let w=document.createElement("p");w.textContent="Hold the button to delete all timestamps for:",w.style.marginBottom="10px";let S=document.createElement("p");S.textContent=p,S.style.fontFamily="monospace",S.style.fontSize="12px",S.style.marginBottom="15px",S.style.color="#aaa";let L=document.createElement("button");L.classList.add("ytls-save-modal-button"),L.style.background="#d32f2f",L.style.position="relative",L.style.overflow="hidden";let $=null,R=0,F=null,P=document.createElement("div");P.style.position="absolute",P.style.left="0",P.style.top="0",P.style.height="100%",P.style.width="0%",P.style.background="#ff6b6b",P.style.transition="none",P.style.pointerEvents="none",L.appendChild(P);let j=document.createElement("span");j.textContent="Hold to Delete All",j.style.position="relative",j.style.zIndex="1",L.appendChild(j);let Ae=()=>{if(!R)return;let Jt=Date.now()-R,it=Math.min(Jt/5e3*100,100);P.style.width=`${it}%`,it<100&&(F=requestAnimationFrame(Ae))},pe=()=>{$&&(clearTimeout($),$=null),F&&(cancelAnimationFrame(F),F=null),R=0,P.style.width="0%",j.textContent="Hold to Delete All"};L.onmousedown=()=>{R=Date.now(),j.textContent="Deleting...",F=requestAnimationFrame(Ae),$=setTimeout(async()=>{pe(),h.classList.remove("ytls-fade-in"),h.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(h)&&document.body.removeChild(h);try{await Xr(p),Bi()}catch(Jt){l("Failed to delete all timestamps:",Jt,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},L.onmouseup=pe,L.onmouseleave=pe;let Lt=null,It=null,Bn=T(h,()=>{pe(),Lt&&document.removeEventListener("keydown",Lt),It&&document.removeEventListener("click",It,!0)});Lt=k(Bn),It=B(h,Bn);let fn=document.createElement("button");fn.textContent="Cancel",fn.classList.add("ytls-save-modal-cancel-button"),fn.onclick=Bn,h.appendChild(w),h.appendChild(S),h.appendChild(L),h.appendChild(fn),document.body.appendChild(h),I(Lt),C(It)}}].forEach(p=>{let h=document.createElement("button");He(h,p.icon,20),Ye(h,p.title),h.classList.add("ytls-main-button"),p.id==="copy"?h.onclick=function(w){p.action.call(this,w)}:h.onclick=p.action,p.id==="settings"&&(bo=h),v.appendChild(h)});let Et=document.createElement("button");ne(Et,"device-floppy","Save"),Et.classList.add("ytls-file-operation-button"),Et.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let h=document.createElement("p");h.textContent="Save as:";let w=null,S=null,L=T(p,()=>{w&&document.removeEventListener("keydown",w),S&&document.removeEventListener("click",S,!0)});w=k(L),S=B(p,L);let $=document.createElement("button");$.textContent="JSON",$.classList.add("ytls-save-modal-button"),$.onclick=()=>{w&&document.removeEventListener("keydown",w),S&&document.removeEventListener("click",S,!0),T(p,()=>Kr("json"))()};let R=document.createElement("button");R.textContent="Plain Text",R.classList.add("ytls-save-modal-button"),R.onclick=()=>{w&&document.removeEventListener("keydown",w),S&&document.removeEventListener("click",S,!0),T(p,()=>Kr("text"))()};let F=document.createElement("button");F.textContent="Cancel",F.classList.add("ytls-save-modal-cancel-button"),F.onclick=L,p.appendChild(h),p.appendChild($),p.appendChild(R),p.appendChild(F),document.body.appendChild(p),I(w),C(S)};let Sn=document.createElement("button");ne(Sn,"folder-open","Load"),Sn.classList.add("ytls-file-operation-button"),Sn.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let h=document.createElement("p");h.textContent="Load from:";let w=null,S=null,L=T(p,()=>{w&&document.removeEventListener("keydown",w),S&&document.removeEventListener("click",S,!0)});w=k(L),S=B(p,L);let $=document.createElement("button");$.textContent="File",$.classList.add("ytls-save-modal-button"),$.onclick=()=>{let P=document.createElement("input");P.type="file",P.accept=".json,.txt",P.classList.add("ytls-hidden-file-input"),P.onchange=j=>{let Ae=j.target.files?.[0];if(!Ae)return;w&&document.removeEventListener("keydown",w),S&&document.removeEventListener("click",S,!0),L();let pe=new FileReader;pe.onload=()=>{let Lt=String(pe.result).trim();Jr(Lt)},pe.readAsText(Ae)},P.click()};let R=document.createElement("button");R.textContent="Clipboard",R.classList.add("ytls-save-modal-button"),R.onclick=async()=>{w&&document.removeEventListener("keydown",w),S&&document.removeEventListener("click",S,!0),T(p,async()=>{try{let P=await navigator.clipboard.readText();P?Jr(P.trim()):alert("Clipboard is empty.")}catch(P){l("Failed to read from clipboard: ",P,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let F=document.createElement("button");F.textContent="Cancel",F.classList.add("ytls-save-modal-cancel-button"),F.onclick=L,p.appendChild(h),p.appendChild($),p.appendChild(R),p.appendChild(F),document.body.appendChild(p),I(w),C(S)};let Xt=document.createElement("button");ne(Xt,"file-export","Export"),Xt.classList.add("ytls-file-operation-button"),Xt.onclick=async()=>{try{await tc()}catch{alert("Failed to export data: Could not read from database.")}};let An=document.createElement("button");ne(An,"file-import","Import"),An.classList.add("ytls-file-operation-button"),An.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=h=>{let w=h.target.files?.[0];if(!w)return;let S=new FileReader;S.onload=()=>{try{let L=JSON.parse(String(S.result)),$=[];for(let R in L)if(Object.prototype.hasOwnProperty.call(L,R)&&R.startsWith("ytls-")){let F=R.substring(5),P=L[R];if(P&&typeof P.video_id=="string"&&Array.isArray(P.timestamps)){let j=P.timestamps.map(pe=>({...pe,guid:pe.guid||crypto.randomUUID()})),Ae=Kl(F,j).then(()=>l(`Imported ${F} to IndexedDB`)).catch(pe=>l(`Failed to import ${F} to IndexedDB:`,pe,"error"));$.push(Ae)}else l(`Skipping key ${R} during import due to unexpected data format.`,"warn")}Promise.all($).then(()=>{Bi()}).catch(R=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",R,"error")})}catch(L){alert(`Failed to import data. Please ensure the file is in the correct format.
`+L.message),l("Import error:",L,"error")}},S.readAsText(w)},p.click()},s.onclick=p=>{jr(p)},s.ontouchstart=p=>{jr(p)},o.style.position="fixed",o.style.bottom="0",o.style.right="0",o.style.transition="none",Zn(),setTimeout(()=>Tn(),10);let Ft=!1,Fo=0,Go=0,Uo=0,mn=0,Vo=0,V=0,H=null,ce=!1;o.addEventListener("mousedown",p=>{let h=p.target;if(!(h instanceof Element)||h instanceof HTMLInputElement||h instanceof HTMLTextAreaElement||h instanceof Element&&(h.closest("#ytls-playback-speed-group")||h.closest("#ytls-playback-speed"))||h!==u&&!u.contains(h)&&window.getComputedStyle(h).cursor==="pointer")return;Ft=!0,ce=!1;let w=o.getBoundingClientRect();Fo=p.clientX-w.left,Go=p.clientY-w.top,Uo=w.width,mn=w.height,Vo=document.documentElement.clientWidth,V=document.documentElement.clientHeight,o.style.transition="none"}),document.addEventListener("mousemove",xo=p=>{if(!Ft)return;ce=!0;let h=p.clientX,w=p.clientY;H===null&&(H=requestAnimationFrame(()=>{if(H=null,!Ft)return;let S=Math.max(0,Math.min(h-Fo,Vo-Uo)),L=Math.max(0,Math.min(w-Go,V-mn));o.style.left=`${S}px`,o.style.top=`${L}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",ko=()=>{if(!Ft)return;Ft=!1,H!==null&&(cancelAnimationFrame(H),H=null);let p=ce;setTimeout(()=>{ce=!1},50),Tn(),setTimeout(()=>{p&&eo()},200)}),o.addEventListener("dragstart",p=>p.preventDefault());let Q=document.createElement("div"),me=document.createElement("div"),Ue=document.createElement("div"),ot=document.createElement("div");Q.id="ytls-resize-tl",me.id="ytls-resize-tr",Ue.id="ytls-resize-bl",ot.id="ytls-resize-br";let Mt=!1,ta=0,na=0,En=0,Mn=0,_o=0,jo=0,oa=0,ia=0,Ln=null,Qt=null;qo(Q,"top-left"),qo(me,"top-right"),qo(Ue,"bottom-left"),qo(ot,"bottom-right"),document.addEventListener("mousemove",p=>{if(!Mt||!o||!Qt)return;let h=p.clientX,w=p.clientY;Ln===null&&(Ln=requestAnimationFrame(()=>{if(Ln=null,!Mt||!o||!Qt)return;let S=h-ta,L=w-na,$=oa,R=ia,F=En,P=Mn,j=_o,Ae=jo;Qt==="bottom-right"?(F=Math.max(200,Math.min(800,En+S)),P=Math.max(250,Math.min(R,Mn+L))):Qt==="top-left"?(F=Math.max(200,Math.min(800,En-S)),j=_o+S,P=Math.max(250,Math.min(R,Mn-L)),Ae=jo+L):Qt==="top-right"?(F=Math.max(200,Math.min(800,En+S)),P=Math.max(250,Math.min(R,Mn-L)),Ae=jo+L):Qt==="bottom-left"&&(F=Math.max(200,Math.min(800,En-S)),j=_o+S,P=Math.max(250,Math.min(R,Mn+L))),j=Math.max(0,Math.min(j,$-F)),Ae=Math.max(0,Math.min(Ae,R-P)),o.style.width=`${F}px`,o.style.height=`${P}px`,o.style.left=`${j}px`,o.style.top=`${Ae}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Mt&&(Mt=!1,Ln!==null&&(cancelAnimationFrame(Ln),Ln=null),Qt=null,document.body.style.cursor="",ie(!0))});let $o=null;window.addEventListener("resize",To=()=>{$o&&clearTimeout($o),$o=setTimeout(()=>{ie(!0),Le?.(),$o=null},200)}),u.appendChild(m);let In=document.createElement("span");In.id="ytls-playback-speed-group",In.style.display="inline-flex",In.style.alignItems="center",In.style.marginLeft="4px",f&&In.appendChild(f),u.appendChild(In),u.appendChild(c);let Ci=document.createElement("div");Ci.id="ytls-list-wrapper",qe=document.createElement("div"),qe.className="ytls-scrollbar-track",qt=document.createElement("div"),qt.className="ytls-scrollbar-thumb",qe.append(qt),Ci.append(s,qe);let Wo=document.createElement("div");Wo.id="ytls-content",Wo.append(Ci),Wo.append(v),o.append(u,Wo,Q,me,Ue,ot);let ra="";o.addEventListener("mousemove",p=>{if(Ft||Mt)return;let h=o.getBoundingClientRect(),w=20,S=p.clientX,L=p.clientY,$=S-h.left<=w,R=h.right-S<=w,F=L-h.top<=w,P=h.bottom-L<=w,j="";F&&$||P&&R?j="nwse-resize":(F&&R||P&&$)&&(j="nesw-resize"),j!==ra&&(ra=j,document.body.style.cursor=j)});let Di=null;if(qe.addEventListener("mouseenter",()=>{dt&&(clearTimeout(dt),dt=null),qe.classList.add("ytls-scrollbar-visible")}),qe.addEventListener("mouseleave",()=>{wi||(dt=setTimeout(()=>{qe?.classList.remove("ytls-scrollbar-visible"),dt=null},500))}),qt.addEventListener("mousedown",p=>{if(!s)return;p.preventDefault(),p.stopPropagation(),wi=!0;let h=p.clientY,w=s.scrollTop,{scrollHeight:S,clientHeight:L}=s,$=Math.max(30,L/S*L),R=S-L,F=L-$;function P(Ae){if(!s)return;let pe=Ae.clientY-h;s.scrollTop=Math.max(0,Math.min(R,w+pe*(R/F))),aa()}function j(){wi=!1,document.removeEventListener("mousemove",P),document.removeEventListener("mouseup",j),qe?.matches(":hover")||(dt=setTimeout(()=>{qe?.classList.remove("ytls-scrollbar-visible"),dt=null},500))}document.addEventListener("mousemove",P),document.addEventListener("mouseup",j)}),o.addEventListener("mouseenter",()=>{ln=!0,sa()}),s.addEventListener("scroll",sa),o.addEventListener("mouseleave",()=>{!Mt&&!Ft&&(document.body.style.cursor=""),ln=!1;try{Ni()}catch{}try{ft(!1)}catch{}}),Le=Ko,setTimeout(()=>{if(Ko(),o&&u&&v&&s){let p=40,h=Ee();if(h.length>0)p=h[0].offsetHeight;else{let w=document.createElement("li");w.style.visibility="hidden",w.style.position="absolute",w.textContent="00:00 Example",s.appendChild(w),p=w.offsetHeight,s.removeChild(w)}ee(u.offsetHeight+v.offsetHeight+p),o.style.minHeight=q()+"px"}},0),mt){try{mt.disconnect()}catch{}mt=null}mt=new ResizeObserver(Ko),mt.observe(o),jn||document.addEventListener("pointerdown",jn=()=>{Rr=Date.now()},!0),qn||document.addEventListener("pointerup",qn=()=>{},!0)}finally{xi=!1}}}async function rc(){if(!o)return;if(document.querySelectorAll("#ytls-pane").forEach(d=>{d!==o&&(l("Removing duplicate pane element from DOM"),d.remove())}),document.body.contains(o)){l("Pane already in DOM, skipping append");return}await oc(),pl(Zl),ml(ec),br(No),wr(Li),fl(Mi),cl(M),await xr(),await Al(),await an(),Tr();let c=document.querySelectorAll("#ytls-pane");if(c.length>0&&(l(`WARNING: Found ${c.length} existing pane(s) in DOM, removing all`),c.forEach(d=>d.remove())),document.body.contains(o)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(o),l("Pane successfully appended to DOM"),ye(),Se&&(clearTimeout(Se),Se=null),Se=setTimeout(()=>{Te(),Le?.(),ve(),ie(!0),Se=null},450),pt){try{pt.disconnect()}catch{}pt=null}pt=new MutationObserver(()=>{let d=document.querySelectorAll("#ytls-pane");d.length>1&&(l(`CRITICAL: Multiple panes detected (${d.length}), removing duplicates`),d.forEach((b,x)=>{(x>0||o&&b!==o)&&b.remove()}))}),pt.observe(document.body,{childList:!0})}function Zr(r=0){if(document.getElementById("ytls-header-button")){Nt();return}let c=document.querySelector("#logo");if(!c||!c.parentElement){r<10&&setTimeout(()=>Zr(r+1),300);return}let d=document.createElement("button");d.id="ytls-header-button",d.type="button",d.className="ytls-header-button",Ye(d,"Toggle Timekeeper UI"),d.setAttribute("aria-label","Toggle Timekeeper UI");let b=document.createElement("img");b.src=oi,b.alt="",b.decoding="async",d.appendChild(b),$t=b,d.addEventListener("mouseenter",()=>{$t&&(wo=!0,$t.src=Xa)}),d.addEventListener("mouseleave",()=>{$t&&(wo=!1,Nt())}),d.addEventListener("click",()=>{o&&!document.body.contains(o)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(o)),Ii()}),c.insertAdjacentElement("afterend",d),Nt(),l("Timekeeper header button added next to YouTube logo")}function ea(){if(K())return;re(!0);let r=history.pushState,c=history.replaceState;function d(){try{let b=new Event("locationchange");window.dispatchEvent(b)}catch{}}history.pushState=function(){let b=r.apply(this,arguments);return d(),b},history.replaceState=function(){let b=c.apply(this,arguments);return d(),b},window.addEventListener("popstate",d),window.addEventListener("locationchange",()=>{window.location.href!==_&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function Bi(){if(!a()){jl();return}N(window.location.href),document.querySelectorAll("#ytls-pane").forEach((c,d)=>{(d>0||o&&c!==o)&&c.remove()}),await Fe(),await ic(),Re=Oo();let r=document.title;l("Page Title:",r),l("Video ID:",Re),l("Current URL:",window.location.href),Si(!0),Yn(),Ge(),await Mi(),Ge(),Si(!1),l("Timestamps loaded and UI unlocked for video:",Re),await rc();try{ft(!0)}catch{}Zr(),Wl()}ea(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),zo(),a()&&o&&s&&(l("Locking UI and showing loading state for navigation"),Si(!0))}),_n=r=>{if(!r.repeat&&!r.ctrlKey&&!r.altKey&&!r.metaKey&&!r.shiftKey&&(r.key==="z"||r.key==="Z")){if(Il(r.target))return;Mr()&&(r.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}r.ctrlKey&&r.altKey&&r.shiftKey&&(r.key==="T"||r.key==="t")&&(r.preventDefault(),Ii(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",_n),window.addEventListener("pagehide",zo),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&zo()}),window.addEventListener("yt-navigate-finish",()=>{l("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==_?Bi():l("Navigation finished but URL already handled, skipping.")});function ac(r){let c=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(r);if(c&&(c[1]||c[2]||c[3]))return Number(c[1]||0)*3600+Number(c[2]||0)*60+Number(c[3]||0);let d=Number(r);return Number.isFinite(d)?d:null}document.addEventListener("click",r=>{if(r.button!==0||r.ctrlKey||r.metaKey||r.shiftKey||r.altKey)return;let c=r.target?.closest?.("ytd-comments a[href]");if(!c)return;let d=new URL(c.href,location.href),b=d.searchParams.get("t");if(d.pathname!=="/watch"||!b||d.searchParams.get("v")!==Oo())return;let x=ac(b),A=Y();x===null||!A||(r.preventDefault(),r.stopImmediatePropagation(),A.seekTo(x))},!0),ea(),l("Timekeeper initialized and waiting for navigation events")})();})();

