// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.3.8.754
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

(()=>{var rc=Object.defineProperty;var sc=(e,n)=>{for(var t in n)rc(e,t,{get:n[t],enumerable:!0})};var Mn=class extends Error{},ve=(e,n)=>{throw new Mn(`${e||"value"}: expected ${n}`)};function Ge(e){let n={run:e,parse:t=>e(t,""),safeParse:t=>{try{return{success:!0,data:e(t,"")}}catch(r){if(r instanceof Mn)return{success:!1,error:r};throw r}},array:()=>ac(n)};return n}var Hr=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function X(){return Ge((e,n)=>typeof e=="string"?e:ve(n,"string"))}function mt(){return Ge((e,n)=>typeof e=="boolean"?e:ve(n,"boolean"))}function ae(e={}){return Ge((n,t)=>typeof n!="number"||Number.isNaN(n)?ve(t,"number"):(e.finite&&!Number.isFinite(n)&&ve(t,"finite number"),e.int&&!Number.isInteger(n)&&ve(t,"integer"),e.nonnegative&&n<0&&ve(t,"number >= 0"),e.positive&&n<=0&&ve(t,"number > 0"),e.min!==void 0&&n<e.min&&ve(t,`number >= ${e.min}`),e.max!==void 0&&n>e.max&&ve(t,`number <= ${e.max}`),n))}function Se(e){return Ge((n,t)=>n===void 0?void 0:e.run(n,t))}function Ve(e){return Ge((n,t)=>n===null?null:e.run(n,t))}function Qe(e,n){return Ge((t,r)=>{try{return e.run(t,r)}catch(i){if(i instanceof Mn)return n;throw i}})}function ac(e){return Ge((n,t)=>Array.isArray(n)?n.map((r,i)=>e.run(r,`${t}[${i}]`)):ve(t,"array"))}function lc(e){return Ge((n,t)=>{if(!Hr(n))return ve(t,"object");let r={};for(let i of Object.keys(n))r[i]=e.run(n[i],t?`${t}.${i}`:i);return r})}function le(e){let n=Ge((t,r)=>{if(!Hr(t))return ve(r,"object");let i={};for(let u of Object.keys(e)){let d=e[u].run(t[u],r?`${r}.${u}`:u);d!==void 0&&(i[u]=d)}return i});return Object.assign(n,{extend:t=>le({...e,...t}),partial:()=>{let t={};for(let r of Object.keys(e))t[r]=Se(e[r]);return le(t)}})}var cc=Ge((e,n)=>typeof e=="string"&&e.length>0?e:ve(n,"non-empty string")),vo=le({guid:cc,start:ae({finite:!0,nonnegative:!0}),comment:X(),write_counter:Se(ae({int:!0,positive:!0})),deleted_at:Qe(Se(ae()),void 0)}),An=vo.array(),pt=vo.extend({video_id:X(),device_id:Se(X())}),Br=le({x:ae({finite:!0}),y:ae({finite:!0}),width:Se(ae({finite:!0,positive:!0})),height:Se(ae({finite:!0,positive:!0}))}),bo=le({video_id:X(),timestamps:An}),nu=lc(bo),Xt={isSignedIn:!1,accessToken:null,accessTokenExpiresAt:null,refreshToken:null,userId:null,userName:null,email:null},ui=Qe(le({isSignedIn:Qe(mt(),!1),accessToken:Qe(Ve(X()),null),accessTokenExpiresAt:Qe(Ve(ae({finite:!0})),null),refreshToken:Qe(Ve(X()),null),userId:Qe(Ve(X()),null),userName:Qe(Ve(X()),null),email:Qe(Ve(X()),null)}),Xt);var Nr=`<svg
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
</svg>`;var Or=`<svg
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
</svg>`;var Ur=`<svg
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
</svg>`;var Fr=`<svg
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
</svg>`;var zr=`<svg
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
</svg>`;var Vr=`<svg
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
</svg>`;var Gr=`<svg
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
</svg>`;var qr=`<svg
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
</svg>`;var jr=`<svg
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
</svg>`;var Wr=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
</svg>`;var $r=`<svg
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
</svg>`;var Yr=`<svg
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
</svg>`;var Kr=`<svg
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
</svg>`;var Xr=`<svg
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
</svg>`;var Qr=`<svg
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
</svg>`;var Jr=`<svg
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
</svg>`;var Zr=`<svg
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
</svg>`;var es=`<svg
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
</svg>`;var ts=`<svg
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
</svg>`;var ns=`<svg
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
</svg>`;var os=`<svg
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
</svg>`;var is=`<svg
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
</svg>`;var rs=`<svg
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
</svg>`;var ss=`<svg
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
</svg>`;var as=`<svg
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
</svg>`;var ls=`<svg
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
</svg>`;var cs=`<svg
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
</svg>`;var ds=`<svg
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
</svg>`;var us=`<svg
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
</svg>`;var ms=`<svg
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
</svg>`;var ps=`<svg
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
</svg>`;var fs=`<svg
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
</svg>`;var hs=`<svg
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
</svg>`;var Gc={plus:Nr,"alarm-plus":Or,minus:Ur,"circle-plus":Fr,"circle-minus":zr,trash:Vr,clipboard:Gr,settings:qr,"clock-plus":jr,"current-location":Wr,"player-record":$r,"circle-x":Yr,"circle-check":Kr,"adjustments-horizontal":Xr,cloud:Qr,"device-floppy":Jr,"folder-open":Zr,"file-export":es,"file-import":ts,"file-spreadsheet":ns,login:os,logout:is,refresh:rs,star:ss,"alert-triangle":as,database:ls,server:cs,world:ds,"plug-connected":us,key:ms,x:ps,"indent-increase":fs,"indent-decrease":hs},gs="http://www.w3.org/2000/svg",qc=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,jc=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,Wc=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,ys=new Map;function vs(e){let n={};for(let t of e.matchAll(Wc))n[t[1]]=t[2];return n}function $c(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function Yc(e){let n=$c(e).match(qc);if(!n)throw new Error("Invalid Tabler SVG source");let[,t,r]=n,i=document.createElementNS(gs,"svg"),u=vs(t);for(let[d,T]of Object.entries(u))d!=="class"&&i.setAttribute(d,T);for(let d of r.matchAll(jc)){let[,T,x]=d,b=document.createElementNS(gs,T),_=vs(x);for(let[E,H]of Object.entries(_))b.setAttribute(E,H);i.appendChild(b)}return i}function Kc(e){let n=ys.get(e);if(n)return n;let t=Yc(Gc[e]);return ys.set(e,t),t}function Qt(e,n=20){let t=Kc(e).cloneNode(!0);return t.setAttribute("width",String(n)),t.setAttribute("height",String(n)),t.setAttribute("aria-hidden","true"),t.style.pointerEvents="none",t.style.flexShrink="0",t.style.verticalAlign="middle",t}function ie(e,n,t){e.replaceChildren(Qt(n,t))}function be(e,n,t,r){e.replaceChildren(Qt(n,r),document.createTextNode("\xA0"+t))}var bs="5.3.8";var wo=bs+"+e55b9ab",mi=null;function m(e,...n){let t="debug",r=[...n];n.length>0&&typeof n[n.length-1]=="string"&&["debug","info","warn","error"].includes(n[n.length-1])&&(t=r.pop());let i=`[Timekeeper v${wo}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[t](`${i} ${e}`,...r)}var To=e=>String(e).padStart(2,"0");function ft(e,n=e){let t=Math.floor(e/3600),r=Math.floor(e%3600/60),i=To(e%60);return n<3600?`${n>=600?To(r):r}:${i}`:`${n>=36e3?To(t):t}:${To(r)}:${i}`}function xo(e,n){return ft(e,Math.max(e,n))}function pi(e,n){let t=Math.max(0,...e.map(r=>r.start));return e.map(r=>{let i=ft(r.start,t),u=n?`${r.comment} <!-- guid:${r.guid} -->`.trimStart():r.comment;return`${i} ${u}`}).join(`
`)}function ws(e,n=window.location.href){try{let t=new URL(n);return t.searchParams.set("t",`${e}s`),t.toString()}catch{return`https://www.youtube.com/watch?v=${n.search(/[?&]v=/)>=0?n.split(/[?&]v=/)[1].split(/&/)[0]:n.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Rt(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}async function Ts(e,n){let t=new Map,r=new TextEncoder;return Promise.all(n.map(async i=>{if(i.guid)return i;let u=`${e}\0${i.start}\0${i.comment}`,d=t.get(u)??0;t.set(u,d+1);let T=await crypto.subtle.digest("SHA-256",r.encode(`${u}\0${d}`)),x=Array.from(new Uint8Array(T),b=>b.toString(16).padStart(2,"0")).join("");return{...i,guid:x}}))}var xs=`#ytls-pane {
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

/* Sync status indicator (colored dot) */
.ytls-sync-indicator {
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

.ytls-sync-indicator--pulsing {
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
`;var Ss="data:image/png;base64,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",Es="assets/Kamo_64px_Indexed.png",ks="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISFPUHnAAAAAMAUExURQAAAAAAAAcGARIMAhkNAR0OABgRAx4SAyMRASEVAyMVAigXAiEZBicYAiMbBiwZASsaAzAZACkbBC0cAi0dBjAdAjMeAykhCTIfAzQfAzAhBzUgAjghAy0kCzkiAzQkBzwkAz0kAzklBz8lA0AmBEEmAz4nBUEnBEQoBEUpAz0rCzgtD0ErCUcqA0EsB0crBEkrA0YsB0osAksuBU0uA08vBEQyD0E0E0kyDlExBVIxBFQzB1U0BUg3Ek83D0o6Flc5DFQ6DlQ8E1Y9E08/GFo/EF4+Dlw/EVVBF2U+CFtBFWg/CFxFGGVEEllHHGRGFmJHF2BKGpg7BGBOHmlMGWxNGG1NGZ1BCGhQHWZRIaJGDZ9ID3NWHnNYIXpXHW9aJJ5NE4VWGadOEntbIIBbH6RRFXlhKKhWFn9iJbBWGIJlKItjI39nKoZmJq9cGohsK5RqJqxjI7lgHYhuL41tK7ZjH5xxKpF0L7dqIJV0LsFqI5R4M7FxHbRwKpd7NJx7MqZ5LclvJcN1D5t/N8F1Jql9MKOBNK9+LsJ6G6GCOM54KreAKsl8GL9+Mr+AM7OEM8CBJ7iEMqqKPMyCH9h+Lq+KO82DLa+MO7GMO86GJMGLM8iJN7GQP9yFMeGFMMeOObeTPuWIMsOSOsiRN+SLNLqXQteRMb2YQdmTLtCWOsGaQ76bRe2ONeqRN9aYOcidRO+SONqZM8WeRdWbO9ScP/CUOcahRuGbNu+XOtuePMikSOGeNtSiQ92gOtiiRdqiQM6oSuGlPuelP9KrS9iqSemmPOepQe6oPdavTe6rQeqsROGvS+iuRvGtQfKtQNy0UOWyTfevQ/awQfOxRfexRPezQ/O0R/ezReq3UPe0RvG2SeO6Uvm1R/i2R++5TPi4SOe9VO28Uvm6TPO+Ufq9TezBV/q+T+/BVvHBVfrAUPDFWPvDUvzEU/fGV/PHWvXHWfzGVvXKW/3IWPrLWfrLXPjMXP3LWf7NWvzOXf/PXP/PXv3QXv7QXP7RXf/RXf/SYIi9XXwAAAABdFJOUwBA5thmAAAHkUlEQVR42sXWa3BU5R3H8e//eZ6zt+wlIQRqsBIC4w2QqKhAA52K1tYqqKjIiDpUHd60HaszHX3hdCo6tbXSVvFSBtsyjFqsoJVRvLWK4WLjpWhBAcWgYGgIm012N7vZ3XPpZmOCyW6ovupnzvNiz5z/7/znOf/ds/zfyXFOeowk5SelYrkeF+g74oA34kIRtyy6jEj99b9ct37d729ZOFZk8JyEv33Dbb9as+aBFbctmioio3cgfGfhOTUUZXr3bH31MB4I82bOmjIu7NeQtxMHWt7ahDdqwGm3zBatMNguibe2/S0P8y648LSwYkhm39PPfoBXMUD40XURpUMhH3Yu7WS7tr+x9+LFZ0QZLvnyui+aMIxgNdbahMZaQDDc6wvnZcn8ekaKXlpnbazcgbprQVDXxCjxcuntdadHhXK5N+5s9SruwcIl04OhGmvwus5qn49KkvevwKsUwNxZcyfXhz3D//DKjYc8UIzg0XLfxpYXt73Xdqgr7XIcwShFinJzJnTs2/LCxhe2HnYYlOvKeQz32cGKT0E4b3nz0XgPsWjduGM1hV00jrf4kvYtqUoBwvxl33MlBj5/OHCsIvTN1j2nnlLtH5qlznVPUOEpCNcvm57tczDBUvkx2QOff8KUSbEqjE12b+uODQWPkQGCumXppEQe7YuGLIbJd2eOtHXmIpGqMOm25173KoyycOKy66qTNiYcsQwjpLod92gy3pkD7JYX8BgZIJy+/CqVtrUOR32U8ZIJF+jJUbR11WdlAcX6n17iZj10JOKjgkImWYBMBhNy0xse7BtIkGH1dg5UTVSoyOs7tHdXR5rw+Gnjcusfdb3hgzRu+SV2QWGNWk+qdfXKlY+uXbtqxX1P9iy4FvlygFjLF/bf34qGhMo616547PPmm2699Yez339wzac/uBI5NkjCvMaPsoQj442mMndva/D65qZYFb2fbt3xamLRhfHXhvZAaI5lMviC0bqJjVMmRP1UkPyECTWGonz8o+2vsjh+f9xDvpjfn0QOHT2cTXa0dwVObpg+qzHK8WS7Ejufjl3294fxFP1OvPzUk5ovunrxtTfe+uPv8tLKX6zc2n38b3J4zpUdR+cvGNhEUUvP07ndzzyy6pHn/hW9+o475vesv/t3H7uMLhyh6Romnn+CKBBuvqKm46nf3veXzdv+8czqNYcW3PnzxXVv/uEgo5NIMDTn7NDMy9EI1yyt73jqz/vdgPGJLrS3cfYp585qijVEGJ02GTTBQIcgly5rSm9YnTBaa6u4jJy05KoQ2Ibj8eJJGzu9Wcm5S8/OH2iJC57SopSI6Xj+30DlejvZncy4gJRedNHzlXXFzGz+nR0K19BfrtGqbXM3FSV3Pr7ynhWrXmq3IRDWWlGnllzkudlP8qItRBRaDMIHB6jk44fueXD9sxseuffX2zIQtChSi8bkVbZHA0qDFrQS2vfYlHF3PrDxY1sE9j/5m2cz+MKiQJ2ZBTel0BqlBHyA5NvylDn4xx0oAYXQsm6bTdDv9te4aJD+BWhxUUCqvIPM5nfppwW0r+XxA/gCFqg+lNSMpxSslItWfEmudyip8+28IPgosV7ZksMn2MoB9Y1atBlsBAR8hqLet59c3TL4QPYNTKaLiFLQ1RrHqCJwdfjkEB4lPgQs6wQN9n/++tCmrY/9qWOgl4/SFpS2jSLP+vAgwsAnE5o7B0pDhFs6W9vkx9798CY1Y0b0n4+XEpwjMvxneP9BlKa4lKWl8VsxpQWUKIUYpjVi71y7u6F56tRZE97Z1EvZO8iQ6rW1AoNGE1185Glb9WeIgN1wca27+4lPG2bEIDaDHZPnGjz/8ATXb5mCAiWIgYlLL6tVRotPizDpqrPUkQ0D9RCb5t+0H8wYxBIYeqNFajAaDCgFNP3s1C17+3wCVdMXnRPqfXFfw1k1lIyZ+u7zdWP8U2sSlLilg9NOAAfMYGP1181678N2zz/ujNkTDB9uH3PWWAboE+PvnjnXTDnlTfAGW/C8qRNBg2JQVdO1t9979123XznRkNuVnBRkUGBy9LU4Y+fViBFXycDQTZsfG+jAKuAywFRXD960zuzpDAdr8QehirGTdr59kWne9XIO7fQfYC6cqXBdlDF5ypnZ+dZEuw064A8GIN132DE1N/B6wiOQsRy37vKb68Bxwdi4BcqEzmzIdSe6u0g7pHO4tVGg/qYpr+8/6lKITrvg+/WA64C0ORKuE0ZwjhTvBXm84lK2E5g8hqJc/L2dPU7VyefWhyhKddrIfk/839CMlO3opUQUSkt46K9rxsb4DP28zpSDySvtFsoDAhE37zD4oKzIYD0hhhQKDpjicgqBCm8OUnlc5SrQvuoAFWRz4Mr7+E2FTQAvney/A6JCUWMol+/sc3ANFCjkAlTowZ/LFdC6SltUbqBY7xQ7wG9iMUMlno0RKuvrzAIFo1wKZKoqB4jFaPKJPOCiguC6haTD15PvzjhQcETfmQbE1X7ha+jrSTngQpWqCpVmMpH0+Mq8VLzbwXUhUGMCkT4HBxJ21OIrse10Mo8LikAsZCSaS1LkpJxogK/A6Un1gSPGpao6LP8Fy8nbmCTqYikAAAAASUVORK5CYII=",Ls="assets/Kamo_Eyebrow_64px_Indexed.png";var Xc="data-tk-extension-base";function fi(e){let n=document.documentElement?.getAttribute(Xc);return n?n+e:null}var pe=null,Jt=null,Qc=250,qe=null,Zt=!1,fe=null,In=[];function Jc(){return(!pe||!document.body.contains(pe))&&(pe=document.createElement("div"),pe.className="ytls-tooltip",pe.style.pointerEvents="none",document.body.appendChild(pe),window.addEventListener("scroll",Ms,!0),window.addEventListener("resize",Ms,!0)),pe}function Zc(e,n,t){let i=window.innerWidth,u=window.innerHeight,d=e.getBoundingClientRect(),T=d.width,x=d.height,b=n+10,_=t+10;b+T>i-10&&(b=n-T-10),_+x>u-10&&(_=t-x-10),b=Math.max(10,Math.min(b,i-T-10)),_=Math.max(10,Math.min(_,u-x-10)),e.style.left=`${b}px`,e.style.top=`${_}px`}function As(e,n){let r=window.innerWidth,i=window.innerHeight,u=n.getBoundingClientRect(),d=e.getBoundingClientRect(),T=d.width,x=d.height,b=Math.round(u.left+u.width/2-T/2),_=Math.round(u.top-x-8);_<8&&(_=Math.round(u.bottom+8)),b<8&&(b=Math.round(u.left)),b+T>r-8&&(b=Math.round(u.right-T)),b=Math.max(8,Math.min(b,r-T-8)),_=Math.max(8,Math.min(_,i-x-8)),e.style.left=`${b}px`,e.style.top=`${_}px`}function Ms(){if(!(!pe||!qe)&&pe.classList.contains("ytls-tooltip-visible"))try{As(pe,qe)}catch{}}function ed(e=50){fe&&(clearTimeout(fe),fe=null),!Zt&&(fe=setTimeout(()=>{Cn(),fe=null},e))}function td(e,n,t,r){fe&&(clearTimeout(fe),fe=null),qe&&r&&qe!==r&&pe?.classList.contains("ytls-tooltip-visible")&&pe.classList.remove("ytls-tooltip-visible"),Jt&&clearTimeout(Jt),r&&(qe=r,Zt=!0),Jt=setTimeout(()=>{let i=Jc();i.textContent=e,i.classList.remove("ytls-tooltip-visible"),r?requestAnimationFrame(()=>{As(i,r),requestAnimationFrame(()=>{i.classList.add("ytls-tooltip-visible")})}):(Zc(i,n,t),requestAnimationFrame(()=>{i.classList.add("ytls-tooltip-visible")}))},Qc)}function Cn(){Jt&&(clearTimeout(Jt),Jt=null),fe&&(clearTimeout(fe),fe=null),pe&&pe.classList.remove("ytls-tooltip-visible"),qe=null,Zt=!1}function hi(){Cn()}function ce(e,n){let t=0,r=0,i=b=>{t=b.clientX,r=b.clientY,fe&&(clearTimeout(fe),fe=null),Zt=!0,qe=e;let _=typeof n=="function"?n():n;_&&td(_,t,r,e)},u=b=>{t=b.clientX,r=b.clientY},d=()=>{qe===e&&(Zt=!1,ed())};e.addEventListener("mouseenter",i),e.addEventListener("mousemove",u),e.addEventListener("mouseleave",d);let T=b=>{Zt=!1,qe===e&&Cn()};e.addEventListener("click",T,!0);let x=new MutationObserver(()=>{if(qe===e)try{let b=window.getComputedStyle(e);(b.display==="none"||b.visibility==="hidden"||b.opacity==="0")&&Cn()}catch{}});try{x.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}In.push(x),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",i),e.removeEventListener("mousemove",u),e.removeEventListener("mouseleave",d),e.removeEventListener("click",T,!0);try{x.disconnect()}catch{}let b=In.indexOf(x);b!==-1&&In.splice(b,1),delete e.__tooltipObserver},e.__tooltipObserver=x}function Is(){for(let e of In)try{e.disconnect()}catch{}In.length=0,Cn()}var ko={};sc(ko,{addTimestamp:()=>ld,buildExportCsvPayload:()=>gd,buildExportPayload:()=>fd,deleteSingleTimestampFromIndexedDB:()=>md,exportAllTimestamps:()=>hd,exportAllTimestampsCsv:()=>yd,getRecordsChangedSince:()=>Si,loadFromIndexedDB:()=>xi,loadGlobalSettings:()=>Je,mergeRemoteRecords:()=>Ei,onTimestampsWritten:()=>ki,removeFromIndexedDB:()=>pd,saveGlobalSettings:()=>yt,saveRowsToIndexedDB:()=>cd,saveSingleTimestampToIndexedDB:()=>ud,saveToIndexedDB:()=>dd});var nd="ytls-timestamps-db",od=5,en="timestamps",Ee="timestamps_v2",gt="settings",ht=null,tn=null;function So(){if(ht)try{return ht.objectStoreNames,Promise.resolve(ht)}catch(e){m("IndexedDB connection is no longer usable:",e,"warn"),ht=null}return tn||(tn=id().then(e=>(ht=e,tn=null,e.onclose=()=>{m("IndexedDB connection closed unexpectedly","warn"),ht=null},e.onversionchange=()=>{m("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),ht===e&&(ht=null)},e.onerror=n=>{m("IndexedDB connection error:",n,"error")},e)).catch(e=>{throw tn=null,e}),tn)}function Cs(e,n){let t=crypto.randomUUID(),r=0,i=e.openCursor();i.onsuccess=u=>{let d=u.target.result;d?(r++,d.update({...d.value,write_counter:r,device_id:t}),d.continue()):(n.put({key:"write_counter",value:r}),n.put({key:"device_id",value:t}),m(`Lamport migration: backfilled ${r} records, device_id=${t}`))},i.onerror=()=>{m("Lamport migration: cursor error during backfill",i.error,"error")}}function id(){return new Promise((e,n)=>{let t=indexedDB.open(nd,od);t.onupgradeneeded=r=>{let i=r.target.result,u=r.oldVersion,d=r.target.transaction;if(u<1&&i.createObjectStore(en,{keyPath:"video_id"}),u<2&&!i.objectStoreNames.contains(gt)&&i.createObjectStore(gt,{keyPath:"key"}),u<3){if(i.objectStoreNames.contains(en)){m("Exporting backup before v2 migration...");let _=d.objectStore(en).getAll();_.onsuccess=()=>{let E=bo.array().safeParse(_.result);if(E.success&&E.data.length>0)try{let H={},O=0;E.data.forEach(Tt=>{if(Tt.timestamps.length>0){let Un=An.parse(Tt.timestamps);H[`ytls-${Tt.video_id}`]={video_id:Tt.video_id,timestamps:[...Un].sort((Go,qo)=>Go.start-qo.start)},O+=Un.length}});let Q=new Blob([JSON.stringify(H,null,2)],{type:"application/json"}),Ht=URL.createObjectURL(Q),Bt=document.createElement("a");Bt.href=Ht,Bt.download=`timekeeper-data-${Rt()}.json`,Bt.click(),URL.revokeObjectURL(Ht),m(`Pre-migration backup exported: ${E.data.length} videos, ${O} timestamps`)}catch(H){m("Failed to export pre-migration backup:",H,"error")}else E.success||m("Skipping pre-migration backup: legacy data failed validation",E.error.message,"warn")}}let x=i.createObjectStore(Ee,{keyPath:"guid"});if(x.createIndex("video_id","video_id",{unique:!1}),x.createIndex("video_start",["video_id","start"],{unique:!1}),i.objectStoreNames.contains(en)){let _=d.objectStore(en).getAll();_.onsuccess=()=>{let E=bo.array().safeParse(_.result);if(E.success&&E.data.length>0){let H=0;E.data.forEach(O=>{O.timestamps.length>0&&O.timestamps.forEach(Q=>{x.put({guid:Q.guid,video_id:O.video_id,start:Q.start,comment:Q.comment}),H++})}),m(`Migrated ${H} timestamps from ${E.data.length} videos to v2 store`)}else E.success||m("Skipping v1 \u2192 v2 migration: legacy data failed validation",E.error.message,"warn");u<4&&Cs(d.objectStore(Ee),d.objectStore(gt))},i.deleteObjectStore(en),m("Deleted old timestamps store after migration to v2")}}u===3&&Cs(d.objectStore(Ee),d.objectStore(gt));let T=d.objectStore(Ee);T.indexNames.contains("write_counter")||T.createIndex("write_counter","write_counter",{unique:!1})},t.onsuccess=r=>{e(r.target.result)},t.onerror=r=>{let i=r.target.error;n(i??new Error("Failed to open IndexedDB"))},t.onblocked=()=>{m("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function Eo(e,n,t){return So().then(r=>new Promise((i,u)=>{let d;try{d=r.transaction(e,n)}catch(b){u(new Error(`Failed to create transaction for ${e}: ${b}`));return}let T=d.objectStore(e),x;try{x=t(T)}catch(b){u(new Error(`Failed to execute operation on ${e}: ${b}`));return}x&&(x.onsuccess=()=>i(x.result),x.onerror=()=>u(x.error??new Error(`IndexedDB ${n} operation failed`))),d.oncomplete=()=>{x||i(void 0)},d.onerror=()=>u(d.error??new Error("IndexedDB transaction failed")),d.onabort=()=>u(d.error??new Error("IndexedDB transaction aborted"))}))}var gi=new Set;function Rs(e){return gi.add(e),()=>gi.delete(e)}function rd(){for(let e of gi)try{e()}catch(n){m("Timestamp write listener failed:",n,"error")}}function Rn(e,{silent:n=!1}={}){return So().then(t=>new Promise((r,i)=>{let u;try{u=t.transaction([Ee,gt],"readwrite")}catch(d){i(new Error(`Failed to create transaction: ${d}`));return}u.oncomplete=()=>{r(),n||rd()},u.onerror=()=>i(new Error(`IndexedDB write failed: ${u.error?.message??"unknown"}`)),u.onabort=()=>i(new Error(`IndexedDB transaction aborted: ${u.error?.message??"unknown"}`));try{e(u.objectStore(Ee),u.objectStore(gt))}catch(d){try{u.abort()}catch{}i(d instanceof Error?d:new Error(String(d)))}}))}function Pn(e,n){let t=e.get("write_counter");t.onsuccess=()=>{let r=typeof t.result?.value=="number"?t.result.value:0;e.put({key:"write_counter",value:n(r)})}}function Ps(e,n){let t=An.safeParse(n);if(!t.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let r=t.data;return Rn((i,u)=>{let d=i.index("video_id").getAll(IDBKeyRange.only(e));d.onsuccess=()=>{let T=d.result??[],x=new Map(T.map(E=>[E.guid,E])),b=new Set(r.map(E=>E.guid)),_=Date.now();Pn(u,E=>{let H=E;return T.forEach(O=>{!b.has(O.guid)&&!O.deleted_at&&(H++,i.put({...O,deleted_at:_,write_counter:H}))}),r.forEach(O=>{let Q=x.get(O.guid);Q&&!Q.deleted_at&&!O.deleted_at&&Q.start===O.start&&Q.comment===O.comment||(H++,i.put({guid:O.guid,video_id:e,start:O.start,comment:O.comment,write_counter:H,deleted_at:O.deleted_at??Q?.deleted_at??void 0}))}),H})}})}function yi(e,n){let t=An.safeParse(n);if(!t.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let r=t.data;return r.length===0?Promise.resolve():Rn((i,u)=>{Pn(u,d=>{let T=d;return r.forEach(x=>{T++,i.put({guid:x.guid,video_id:e,start:x.start,comment:x.comment,write_counter:T,deleted_at:x.deleted_at})}),T})})}function Ds(e,n){return yi(e,[n])}function _s(e,n={}){return e.length===0?Promise.resolve():Rn((t,r)=>{Pn(r,i=>{let u=i;return e.forEach(d=>{d.write_counter!==void 0&&d.write_counter>u&&(u=d.write_counter)}),e.forEach(d=>{let T={guid:d.guid,video_id:d.video_id,start:d.start,comment:d.comment,deleted_at:d.deleted_at,write_counter:d.write_counter??++u};t.put(T)}),u+1})},n)}function Hs(e){return m(`Soft-deleting timestamp ${e}`),Rn((n,t)=>{let r=n.get(e);r.onsuccess=()=>{let i=r.result;i&&Pn(t,u=>(n.put({...i,deleted_at:Date.now(),write_counter:u+1}),u+1))}})}function Bs(e){return So().then(n=>new Promise((t,r)=>{let i;try{i=n.transaction([Ee],"readonly")}catch(d){let T=`Failed to create read transaction: ${d}`;m(T,d,"error"),r(new Error(T));return}i.onabort=()=>{let d=`Transaction aborted during load: ${i.error?.message??"unknown"}`;m(d,i.error,"error"),r(new Error(d))};let u=i.objectStore(Ee).index("video_id").getAll(IDBKeyRange.only(e));u.onsuccess=()=>{try{let d=u.result.filter(b=>!b.deleted_at),T=[],x=0;for(let b of d){let _=vo.safeParse({guid:b.guid,start:b.start,comment:b.comment});_.success?T.push(_.data):x++}if(x>0&&m(`Skipped ${x} stored timestamps for ${e} that failed validation`,null,"warn"),T.length===0){x>0?r(new Error(`Stored timestamps for this video failed validation (${x} rows)`)):t(null);return}t(T.sort((b,_)=>b.start-_.start))}catch(d){r(d)}},u.onerror=()=>{let d=`Failed to load timestamps from IndexedDB: ${u.error?.message??"unknown error"}`;m(d,u.error,"error"),r(new Error(d))}}))}function Ns(e){return Rn((n,t)=>{let r=n.index("video_id").getAll(IDBKeyRange.only(e));r.onsuccess=()=>{let i=r.result??[],u=Date.now();Pn(t,d=>{let T=d;return i.forEach(x=>{x.deleted_at||(T++,n.put({...x,deleted_at:u,write_counter:T}))}),T})}})}function vi(){return Eo(Ee,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function Os(e){return Eo(Ee,"readonly",n=>n.index("write_counter").getAll(IDBKeyRange.lowerBound(e,!0))).then(n=>Array.isArray(n)?n:[])}function Us(e){return e.length===0?Promise.resolve([]):So().then(n=>new Promise((t,r)=>{let i=[],u=n.transaction(Ee,"readonly"),d=u.objectStore(Ee);for(let T of e)d.get(T).onsuccess=x=>{let b=x.target.result;b&&i.push(b)};u.oncomplete=()=>t(i),u.onerror=()=>r(u.error??new Error("IndexedDB read failed")),u.onabort=()=>r(u.error??new Error("IndexedDB read aborted"))}))}function Fs(e,n){return Eo(gt,"readwrite",t=>{t.put({key:e,value:n})}).then(()=>{}).catch(t=>{m(`Failed to save setting '${e}' to IndexedDB:`,t,"error")})}function zs(e){return Eo(gt,"readonly",n=>n.get(e)).then(n=>n?.value).catch(n=>{m(`Failed to load setting '${e}' from IndexedDB:`,n,"error")})}async function bi({includeDeleted:e=!1}={}){let n={},t=await vi(),r=[],i=0;for(let E of t){let H=pt.safeParse(E);H.success?r.push(H.data):i++}i>0&&m(`Skipped ${i} timestamp rows that failed validation during export`,null,"warn");let d=[...e?r:r.filter(E=>!E.deleted_at)].sort((E,H)=>{let O=E.video_id.localeCompare(H.video_id);if(O!==0)return O;let Q=E.start-H.start;return Q!==0?Q:E.guid.localeCompare(H.guid)}),T=new Map;for(let E of d)T.has(E.video_id)||T.set(E.video_id,[]),T.get(E.video_id).push({guid:E.guid,start:E.start,comment:E.comment,write_counter:E.write_counter,deleted_at:E.deleted_at});let x=Array.from(T.keys()).sort((E,H)=>E.localeCompare(H));for(let E of x){let H=T.get(E);n[`ytls-${E}`]={video_id:E,timestamps:H}}return{json:JSON.stringify(n,null,2),filename:"timekeeper-data.json",totalVideos:T.size,totalTimestamps:d.length,invalidRows:i}}async function qs(){try{let{json:e,filename:n,totalVideos:t,totalTimestamps:r}=await bi(),i=new Blob([e],{type:"application/json"}),u=URL.createObjectURL(i),d=document.createElement("a");d.href=u,d.download=n,d.click(),URL.revokeObjectURL(u),m(`Exported ${t} videos with ${r} timestamps`)}catch(e){throw m("Failed to export data:",e,"error"),e}}async function wi(){let e=pt.array().safeParse((await vi()).filter(b=>!b.deleted_at));if(!e.success||e.data.length===0){e.success||m("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let b=`Tag,Timestamp,URL
`,_=`timestamps-${Rt()}.csv`;return{csv:b,filename:_,totalVideos:0,totalTimestamps:0}}let n=e.data,t=new Map;for(let b of n)t.has(b.video_id)||t.set(b.video_id,[]),t.get(b.video_id).push({start:b.start,comment:b.comment});let r=[];r.push("Tag,Timestamp,URL");let i=0,u=b=>`"${String(b).replace(/"/g,'""')}"`,d=Array.from(t.keys()).sort();for(let b of d){let _=t.get(b).sort((E,H)=>E.start-H.start);for(let E of _){let H=E.comment,O=ft(E.start,36e3),Q=ws(E.start,`https://www.youtube.com/watch?v=${b}`);r.push([u(H),u(O),u(Q)].join(",")),i++}}let T=r.join(`
`),x=`timestamps-${Rt()}.csv`;return{csv:T,filename:x,totalVideos:t.size,totalTimestamps:i}}async function js(){try{let{csv:e,filename:n,totalVideos:t,totalTimestamps:r}=await wi(),i=new Blob([e],{type:"text/csv;charset=utf-8;"}),u=URL.createObjectURL(i),d=document.createElement("a");d.href=u,d.download=n,d.click(),URL.revokeObjectURL(u),m(`Exported ${t} videos with ${r} timestamps (CSV)`)}catch(e){throw m("Failed to export CSV data:",e,"error"),e}}async function Ti(e,n){if(!e)throw new Error("Video ID is required");if(!n.guid||n.start==null)throw new Error("Timestamp must have GUID and start time");return Ds(e,n)}async function Ws(e,n){if(!e)throw new Error("Video ID is required");return yi(e,n)}async function $s(e,n){if(!e)throw new Error("Video ID is required");if(!Array.isArray(n))throw new Error("Timestamps must be an array");return Ps(e,n)}async function Ys(e){if(!e)throw new Error("GUID is required");return Hs(e)}async function Ks(e){if(!e)throw new Error("Video ID is required");return Ns(e)}async function Xs(e){if(!e)throw new Error("Video ID is required");return Bs(e)}function Gs(e,n){return JSON.stringify([e,n.start,n.comment,n.deleted_at??null])}function sd(e,n,t){return e?e.write_counter===void 0||t.write_counter===void 0?!1:t.write_counter!==e.write_counter?t.write_counter>e.write_counter:Gs(n,t)>Gs(e.video_id,e):!0}async function Qs(e){let n=[];for(let t of await Os(e)){let r=pt.safeParse(t);if(!r.success||r.data.write_counter===void 0)continue;let{guid:i,video_id:u,start:d,comment:T,write_counter:x,deleted_at:b}=r.data;n.push({guid:i,video_id:u,start:d,comment:T,write_counter:x,...b!==void 0?{deleted_at:b}:{}})}return n}async function Js(e){let n=new Map;for(let i of await Us(e.map(u=>u.guid)))n.set(i.guid,i);let t=[],r=new Set;for(let i of e)sd(n.get(i.guid),i.video_id,i)&&(t.push(i),r.add(i.video_id));return await _s(t,{silent:!0}),{mergedVideos:r.size,mergedTimestamps:t.length}}function Zs(e,n){if(!e)throw new Error("Setting key is required");return Fs(e,n)}async function ea(e){if(!e)throw new Error("Setting key is required");return zs(e)}function ld(e,n){return Ti(e,n)}function cd(e,n){return Ws(e,n)}function dd(e,n){return $s(e,n)}function ud(e,n){return Ti(e,n)}function xi(e){return Xs(e)}function md(e,n){return Ys(n)}function pd(e){return Ks(e)}function yt(e,n){return Zs(e,n)}function Je(e){return ea(e)}function fd(e){return bi(e)}function hd(){return qs()}function gd(){return wi()}function yd(){return js()}function Si(e){return Qs(e)}function Ei(e){return Js(e)}function ki(e){return Rs(e)}function Lo(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function Mo(e){if(!e)return;e.replaceChildren();let n=e.querySelector(".ytls-error-message");n&&n.remove()}function Li(e,n){if(!e)return;Mo(e);let t=document.createElement("li");t.className="ytls-placeholder",t.textContent=n,e.appendChild(t),e.style.overflowY="hidden"}function ta(e){if(!e)return;let n=e.querySelector(".ytls-placeholder");n&&n.remove(),e.style.overflowY=""}function Dn(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function na(e,n){if(!e)return;Mo(e);let t=document.createElement("li");t.className="ytls-error-message",t.style.cssText=`
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
  `;let r=document.createElement("div");r.style.marginBottom="8px",r.textContent=`\u26A0\uFE0F ${n}`;let i=document.createElement("div");i.style.cssText="font-size:12px;font-weight:normal;color:#aaa",i.textContent="Check the console for details or refresh the page.",t.append(r,i),e.appendChild(t),e.style.overflowY="hidden"}function oa(e){if(!e)return;let n=e.querySelector(".ytls-error-message");n&&n.remove()}function ia(e,n){if(!e||n||Dn(e))return;Array.from(e.children).some(r=>!r.classList.contains("ytls-placeholder")&&!r.classList.contains("ytls-error-message"))||Li(e,"No timestamps for this video")}function ra(e){if(!e)return[];let n=Lo(e),t=[];return n.forEach(r=>{let i=r.querySelector("[data-time]"),u=r.querySelector("input"),d=r.dataset.guid;if(!i||!u||!d)return;let T=i.dataset.time;if(!T)return;let x=Number.parseInt(T,10);Number.isFinite(x)&&t.push({guid:d,start:x,comment:u.value})}),t.sort((r,i)=>r.start-i.start)}function sa(e){if(!e)return 0;let n=Lo(e),t=0;return n.forEach(r=>{let u=r.querySelector("[data-time]")?.dataset.time;if(u){let d=Number.parseInt(u,10);Number.isFinite(d)&&(t=Math.max(t,d))}}),t}var bd={auth:{syncAuthState:Xt},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},ke=JSON.parse(JSON.stringify(bd));function Ao(){return ke}function Io(e){ke={...ke,...e,auth:{...ke.auth,...e.auth||{}},ui:{...ke.ui,...e.ui||{}},timestamps:{...ke.timestamps,...e.timestamps||{}}}}function wd(e,n){Io({auth:{...ke.auth,[e]:n}})}function Co(e,n){Io({ui:{...ke.ui,[e]:n}})}function aa(){return ke.auth.syncAuthState}function nn(e){wd("syncAuthState",e)}function la(e){Co("minPaneHeight",e)}function ca(e){Co("panePosition",e)}function da(e){Co("lastHandledUrl",e)}function ua(e){Co("urlChangeHandlersSetup",e)}function ma(e){Io({timestamps:{...ke.timestamps,items:e}})}function Mi(e){Io({timestamps:{...ke.timestamps,dbError:e}})}function pa(){return ke.timestamps.dbError}var Pt=typeof unsafeWindow<"u"?unsafeWindow:window,wa=43200*14,ha="html5_max_live_dvr_window_plus_margin_secs";function Ze(e){return e!=null&&typeof e=="object"}function ga(e){let{streamingData:n,videoDetails:t,playerConfig:r,microformat:i}=e;if(!Ze(t)||!t.isLive)return;let u=t.isLiveDvrEnabled===!0;if(t.isLiveDvrEnabled=!0,!u&&Ze(r)){let d=r.mediaCommonConfig;if(Ze(d)){d.useServerDrivenAbr=!1;let T=d.serverPlaybackStartConfig;Ze(T)&&(T.enable=!1)}}if(Ze(n)){let d=n;if(Array.isArray(d.adaptiveFormats)&&Td(i))for(let T of d.adaptiveFormats)T.maxDvrDurationSec=wa}}function Td(e){if(!Ze(e))return!1;let n=e.playerMicroformatRenderer;if(!Ze(n))return!1;let t=n.liveBroadcastDetails;if(!Ze(t))return!1;let r=t.startTimestamp;return!r||typeof r!="string"?!1:(Date.now()-new Date(r).getTime())/1e3>43200}function Ai(e){if(!e||typeof e!="object")return!1;let n=e;return n.videoDetails?(ga(n),!0):n.playerResponse&&Ze(n.playerResponse)&&n.playerResponse.videoDetails?(ga(n.playerResponse),!0):!1}function xd(){let e=Object.getOwnPropertyDescriptor(Pt,"ytInitialPlayerResponse"),n=e&&e.set,t=Pt.ytInitialPlayerResponse;if(!Ai(t))try{Object.defineProperty(Pt,"ytInitialPlayerResponse",{configurable:!0,get(){return t},set(r){n&&n.call(this,r),t=r,Ai(r)&&Object.defineProperty(Pt,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:r})}})}catch{}}var ya=!1;function Sd(){if(ya)return;ya=!0;let e=JSON.parse;JSON.parse=function(n,t){let r=e.call(this,n,t);try{Ai(r)}catch{}return r}}function va(e){if(e.__dvrCapLifted)return;let t=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!t)return;let r=t;for(let i in r){let u=r[i];if(u&&typeof u.serializedExperimentFlags=="string"){let d=u.serializedExperimentFlags,T=d.replace(new RegExp(`${ha}=[\\d.]+`),`${ha}=${wa}`);T!==d&&(u.serializedExperimentFlags=T)}}e.__dvrCapLifted=!0}function ba(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let n=e.set;typeof n=="function"&&(e.set=function(...t){let r=n.apply(this,t);try{va(e)}catch{}return r});try{va(e)}catch{}return e}function Ed(){let e={};Pt.ytcfg&&(e=ba(Pt.ytcfg));try{Object.defineProperty(Pt,"ytcfg",{configurable:!0,get(){return e},set(n){e=ba(n)}})}catch{}}function Ta(){xd(),Sd(),Ed(),m("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var kd="BADGE_STYLE_TYPE_MEMBERS_ONLY";function _n(e){return typeof e=="object"&&e!==null}function xa(e,n=0){return!_n(e)||n>8?!1:e.style===kd?!0:Object.values(e).some(t=>xa(t,n+1))}function Sa(e,n){let t=_n(n)?n.videoDetails:void 0;if(!_n(t)||typeof t.videoId!="string"||typeof t.channelId!="string")return null;let r=e?.contents?.twoColumnWatchNextResults?.results?.results?.contents;if(!Array.isArray(r))return null;let i=r.find(u=>_n(u)&&_n(u.videoPrimaryInfoRenderer));return i?{videoId:t.videoId,channelId:t.channelId,membersOnly:xa(i.videoPrimaryInfoRenderer)}:null}var Ii="#author-name, #author-text";function Ea(){return window.top!==window.self&&window.location.pathname.startsWith("/live_chat")}function Ci(e){let n=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let t=n.nextNode();t;t=n.nextNode()){let r=t.nodeValue??"";if(r.trim()){/^\s*@/.test(r)&&(t.nodeValue=r.replace(/^(\s*)@/,"$1"));return}}}function Ri(e){if(e.nodeType===Node.TEXT_NODE){let n=e.parentElement?.closest(Ii);n&&Ci(n);return}e instanceof Element&&(e.matches(Ii)&&Ci(e),e.querySelectorAll(Ii).forEach(Ci))}function ka(){let e=new MutationObserver(n=>{for(let t of n)t.type==="characterData"?Ri(t.target):t.addedNodes.forEach(Ri)});document.documentElement&&Ri(document.documentElement),e.observe(document,{childList:!0,subtree:!0,characterData:!0})}var Uo="https://ash.kamotimestamps.com",Ha="308989572223-cdnvpn65mc51oqneu7po3og51uf5ahsb.apps.googleusercontent.com",Ld="https://www.youtube.com/",Ba="timekeeper_sync_auth",Na="timekeeper_sync_oauth",Dt="syncAuthState",Oa="syncCursors",Md=500,Ad=5e3,La=200,Id=500,Cd=60*1e3,Rd=60*1e3,Pd=300*1e3;function _t(){return!!(Uo&&Ha)}var Ua=le({accessToken:X(),accessTokenExpiresAt:ae({finite:!0}),refreshToken:X(),user:le({id:X(),email:X(),displayName:Ve(X())})}),Dd=le({records:pt.array(),seq:ae({int:!0,nonnegative:!0}),hasMore:mt()}),_d=le({known:mt(),membersOnly:Ve(mt()),channelId:Ve(X())}),Hd=le({rejected:pt.array(),fromSeq:ae({int:!0,nonnegative:!0}),seq:ae({int:!0,nonnegative:!0})}),Bd=le({type:X(),seq:Se(ae({int:!0,nonnegative:!0})),fromSeq:Se(ae({int:!0,nonnegative:!0})),records:Se(pt.array())}),Nd=le({type:X(),idToken:Se(X()),error:Se(X())}),wt=class extends Error{},Ho=class extends Error{constructor(t,r){super(r);this.httpStatus=t}},Od=e=>e instanceof Ho&&e.httpStatus>=400&&e.httpStatus<500&&e.httpStatus!==408&&e.httpStatus!==429,sn={kind:"signed-out"},Bo="idle",Di=null,an=new Set,Fa=new Map,Bn=new Map,et=null,bt=null,Fo=0,rn=null,Ma=0,nt=!0,Hn=null,Oi=0,_i=null,Aa=!1,de={pushCounter:0,pullSeq:0},Ui=new Map,Ia=Promise.resolve(),Do=!1,Ro=null,No="",zo=null,za=null,Hi=null,_o=null,Va=null;function ue(){return aa()}function Ga(e){za=e}function qa(e){Hi=e}function ja(e){_o=e}function Wa(e){Va=e}var $a="#52c41a",Ya="#ff4d4f",vt="#ffa500";function Nn(){let e=ue();if(Hi){let n=Hi;if(n.style.fontWeight="bold",n.onmouseenter=null,n.onmouseleave=null,!_t())be(n,"alert-triangle","Sync backend is not configured in this build"),n.style.color=vt;else if(!e.isSignedIn)be(n,"circle-x","Not signed in"),n.style.color=Ya;else{be(n,"circle-check","Signed in"),n.style.color=$a;let t=e.userName;t&&(n.onmouseenter=()=>be(n,"circle-check",`Signed in as ${t}`),n.onmouseleave=()=>be(n,"circle-check","Signed in"))}}if(_o){let{text:n,color:t}=Ka(e);_o.textContent=n,_o.style.color=t}Va?.(),Za()}function Ka(e=ue()){let n=sn;if(n.kind==="error")return{text:n.message||"Sync error",color:Ya,busy:!1};if(n.kind==="signing-in")return{text:n.step,color:vt,busy:!0};if(n.kind==="connecting")return{text:"Connecting\u2026",color:vt,busy:!0};if(e.isSignedIn&&n.kind==="offline")return{text:"Offline. Retrying\u2026",color:vt,busy:!1};if(e.isSignedIn&&n.kind==="online"){if(Bo==="failed")return{text:"Sync failed. Retrying\u2026",color:vt,busy:!1};let t=Bo==="running",r=t?"Syncing\u2026":"Live sync on";return!t&&Di&&(r+=` \xB7 last synced ${new Date(Di).toLocaleTimeString()}`),!t&&an.size>0?(r+=` \xB7 ${an.size} timestamp${an.size===1?"":"s"} could not be synced`,{text:r,color:vt,busy:!1}):{text:r,color:t?vt:$a,busy:t}}return{text:"",color:"#aaa",busy:!1}}var Xa="#4285f4",Ca="#666",Pi="ytls-sync-indicator--pulsing";function Ra(){if(!_t())return{color:Ca,tooltip:"Sync is not available in this build"};if(!ue().isSignedIn)return{color:Ca,tooltip:"Sync: signed out"};let{text:e,color:n,busy:t}=Ka();return e?{color:t?Xa:n,tooltip:`Sync: ${e}`}:{color:vt,tooltip:"Sync: starting\u2026"}}var Qa=null,on=null;function Ja(e){Qa=e,Za()}function Za(){let e=Qa;if(!e)return;let{color:n,tooltip:t}=Ra();on&&(e.removeEventListener("animationiteration",on),on=null),n===Xa?(e.style.backgroundColor=n,e.classList.add(Pi)):e.classList.contains(Pi)?(on=()=>{e.classList.remove(Pi),e.style.backgroundColor=n,on=null},e.addEventListener("animationiteration",on,{once:!0})):e.style.backgroundColor=n,ce(e,()=>Ra().tooltip)}function tt(e){sn=e,Nn()}function Le(){return sn.kind==="connecting"||sn.kind==="online"||sn.kind==="offline"}function Po(e){Le()&&tt({kind:e})}function Pa(e){Bo=e,Nn()}function el(){return typeof GM<"u"&&GM&&typeof GM.getValue=="function"&&typeof GM.setValue=="function"?GM:null}var Da="ytls-install-id";function Ud(){try{let e=localStorage.getItem(Da);return e||localStorage.setItem(Da,e=crypto.randomUUID()),e}catch{return"default"}}var tl=()=>`${Dt}:${Ud()}`;async function nl(){let e=el();if(!e)return Je(Dt);let n=tl(),t=await e.getValue(n);if(t!=null)return t;let r=await e.getValue(Dt);return r!=null?(await e.setValue(n,r),await e.setValue(Dt,null),r):(r=await Je(Dt),r&&(await e.setValue(n,r),await yt(Dt,null)),r??void 0)}async function Vo(){try{let e=el();e?await e.setValue(tl(),ue()):await yt(Dt,ue())}catch(e){m("Failed to save sync auth state:",e,"error")}}function On(){yt(Oa,{userId:ue().userId,...de})}async function Fd(){let e=await Je(Oa);e&&e.userId===ue().userId&&typeof e.pushCounter=="number"&&typeof e.pullSeq=="number"?de={pushCounter:e.pushCounter,pullSeq:e.pullSeq}:de={pushCounter:0,pullSeq:0}}function Fi(e,n){return fetch(`${Uo}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})}function ol(e){zo=null,nn({isSignedIn:!0,accessToken:e.accessToken,accessTokenExpiresAt:e.accessTokenExpiresAt,refreshToken:e.refreshToken,userId:e.user.id,userName:e.user.displayName,email:e.user.email})}var il=e=>!!e.accessToken&&e.accessToken!==zo&&!!e.accessTokenExpiresAt&&e.accessTokenExpiresAt-Date.now()>Cd;async function zd(e){return typeof navigator<"u"&&navigator.locks?await navigator.locks.request("timekeeper-sync-refresh",e):e()}async function Vd(){let e=await nl();if(e==null)return;let n=ui.safeParse(e);n.success&&nn(n.data)}function Gd(){return Ro??(Ro=zd(async()=>{await Vd();let e=ue();if(!e.isSignedIn||!e.refreshToken)throw new wt("Not signed in");if(il(e))return e.accessToken;let n=await Fi("/auth/refresh",{refreshToken:e.refreshToken});if(n.status===401)throw new wt("Session expired");if(!n.ok)throw new Error(`Token refresh failed (HTTP ${n.status})`);let t=Ua.safeParse(await n.json());if(!t.success)throw new Error("Unexpected token refresh response");return ol(t.data),await Vo(),t.data.accessToken}).finally(()=>{Ro=null})),Ro}async function rl(){let e=ue();if(!e.isSignedIn||!e.refreshToken)throw new wt("Not signed in");return il(e)?e.accessToken:Gd()}async function sl(e,n,t=!0){let r=await rl(),i=await fetch(`${Uo}${e}`,{method:n.method,headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"},body:n.body===void 0?void 0:JSON.stringify(n.body)});if(i.status===401){if(!t)throw new wt("Session expired");return zo=r,sl(e,n,!1)}return i}async function Oo(e,n,t){let r=await sl(e,n);if(!r.ok)throw new Ho(r.status,`${n.method} ${e} failed (HTTP ${r.status})`);let i=t.safeParse(await r.json());if(!i.success)throw new Error(`Unexpected response from ${e}`);return i.data}function qd(e){try{let n=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(n.padEnd(Math.ceil(n.length/4)*4,"=")))}catch{return null}}function jd(e,n,t){return new Promise((r,i)=>{let u=()=>{clearTimeout(d),e.close();try{n.close()}catch{}},d=setTimeout(()=>{u(),i(new Error("Sign-in timed out"))},Pd);e.onmessage=T=>{let x=Nd.safeParse(T.data);if(x.success){if(x.data.type==="timekeeper_sync_oauth_error")u(),i(new Error(x.data.error||"Google sign-in failed"));else if(x.data.type==="timekeeper_sync_oauth_token"&&x.data.idToken){if(qd(x.data.idToken)?.nonce!==t)return;u(),r(x.data.idToken)}}}})}function al(){let e=window.location.hash;if(!e||e.length<=1)return!1;let n=new URLSearchParams(e.substring(1));if(n.get("state")!==Ba)return!1;let t=n.get("id_token"),r=n.get("error_description")||n.get("error");if(!t&&!r)return!1;try{let i=new BroadcastChannel(Na);i.postMessage(r?{type:"timekeeper_sync_oauth_error",error:r}:{type:"timekeeper_sync_oauth_token",idToken:t}),i.close()}catch(i){m("Failed to hand sync sign-in result to the opener:",i,"error")}return history.replaceState&&history.replaceState(null,"",window.location.pathname+window.location.search),window.close(),!0}async function ll(){if(!_t()){tt({kind:"error",message:"Sync backend is not configured in this build"});return}if(ue().isSignedIn||sn.kind==="signing-in")return;tt({kind:"signing-in",step:"Opening Google sign-in\u2026"});let e=crypto.randomUUID(),n=new BroadcastChannel(Na);try{let t=new URL("https://accounts.google.com/o/oauth2/v2/auth");t.searchParams.set("client_id",Ha),t.searchParams.set("redirect_uri",Ld),t.searchParams.set("response_type","id_token"),t.searchParams.set("scope","openid email profile"),t.searchParams.set("nonce",e),t.searchParams.set("state",Ba),t.searchParams.set("prompt","select_account");let r=window.open(t.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!r)throw new Error("Popup blocked. Please enable popups for YouTube.");tt({kind:"signing-in",step:"Waiting for Google sign-in\u2026"});let i=await jd(n,r,e);tt({kind:"signing-in",step:"Signing in to Timekeeper Sync\u2026"});let u=await Fi("/auth/google",{idToken:i});if(!u.ok)throw new Error(u.status===401?"Google sign-in was rejected by the server":`Sign-in failed (HTTP ${u.status})`);let d=Ua.safeParse(await u.json());if(!d.success)throw new Error("Unexpected response from the sync server");ol(d.data),await Vo(),de={pushCounter:0,pullSeq:0},On(),m(`Signed in to Timekeeper Sync as ${d.data.user.displayName??"an account with no display name"}`),await hl()}catch(t){n.close(),m("Sync sign-in failed:",t,"error"),tt({kind:"error",message:t instanceof Error?t.message:"Sign-in failed"})}}var Bi=e=>`${e.channelId}:${e.membersOnly}`;function cl(e){Fa.set(e.videoId,e),Le()&&Wd(e)}async function Wd(e){let n=Bi(e);if(Bn.get(e.videoId)!==n)try{if(!(await xi(e.videoId))?.some(i=>!i.deleted_at))return;let r=await Oo(`/videos/${encodeURIComponent(e.videoId)}/access`,{method:"GET"},_d);(!r.known||r.membersOnly!==e.membersOnly||r.channelId!==e.channelId)&&await Oo("/videos/access",{method:"POST",body:{videos:[e]}},le({ok:mt()})),Bn.set(e.videoId,n)}catch(t){m("Reporting the members-only status failed:",t,"warn")}}async function dl(){let{refreshToken:e}=ue();if(gl({kind:"signed-out"}),nn(Xt),de={pushCounter:0,pullSeq:0},Ui.clear(),an.clear(),Bn.clear(),await Vo(),On(),e&&_t())try{await Fi("/auth/logout",{refreshToken:e})}catch(n){m("Sync logout request failed:",n,"warn")}}function ul(){gl({kind:"error",message:"Session expired. Please sign in again."}),nn(Xt),Vo()}function ml(e){let n=Ia.then(e);return Ia=n.catch(()=>{}),n}function ln(){!Le()||Do||(Do=!0,ml(async()=>{Do=!1,await Kd()}).catch(e=>m("Sync: cycle crashed:",e,"error")))}async function zi(e){if(e.length!==0){for(let n of e)Ui.set(n.guid,n.write_counter??0);await Ei(e),za?.([...new Set(e.map(n=>n.video_id))])}}function pl(e,n){return e>de.pullSeq?(nt=!0,!1):(n>de.pullSeq&&(de.pullSeq=n,On()),!0)}async function $d(){for(;;){let e=await Oo(`/sync/pull?since=${de.pullSeq}&limit=${Id}`,{method:"GET"},Dd);await zi(e.records);let n=e.seq!==de.pullSeq;if(de.pullSeq=e.seq,On(),!e.hasMore||!n)return}}async function Ni(e){try{let n=[...new Set(e.map(r=>r.video_id))].map(r=>Fa.get(r)).filter(r=>!!r&&Bn.get(r.videoId)!==Bi(r)),t=await Oo("/sync/push",{method:"POST",body:{deviceId:No,records:e,videos:n}},Hd);for(let r of n)Bn.set(r.videoId,Bi(r));await zi(t.rejected);for(let r of e)an.delete(r.guid);pl(t.fromSeq,t.seq)||ln()}catch(n){if(!Od(n))throw n;if(e.length>1){let t=e.length>>1;await Ni(e.slice(0,t)),await Ni(e.slice(t));return}an.add(e[0].guid),m(`Sync: server refused timestamp ${e[0].guid}; leaving it local-only:`,n,"warn")}}async function Yd(){let e=await Si(de.pushCounter);if(e.length===0)return;let n=e.filter(t=>(Ui.get(t.guid)??0)<t.write_counter);for(let t=0;t<n.length;t+=La)await Ni(n.slice(t,t+La));de.pushCounter=Math.max(de.pushCounter,e[e.length-1].write_counter),On()}async function Kd(){if(!Le())return;Pa("running");let e="idle";try{(nt||!et)&&(await $d(),nt=!1),await Yd(),Di=Date.now(),Oi=0}catch(n){if(n instanceof wt){ul();return}m("Sync cycle failed:",n,"warn"),nt=!0,e="failed",Xd()}finally{Pa(e)}}function fl(e){return Math.min(Rd,1e3*2**e)*(.5+Math.random()/2)}function Xd(){!Le()||Hn||(Hn=setTimeout(()=>{Hn=null,ln()},fl(Oi++)))}function Qd(){if(!Le())return;let e=Date.now();rn?clearTimeout(rn):Ma=e;let n=Math.max(0,Math.min(Md,Ma+Ad-e));rn=setTimeout(()=>{rn=null,ln()},n)}function Vi(){Le()&&(nt=!0,et||(Fo=0,bt&&clearTimeout(bt),bt=null,Gi()),ln())}function _a(){!Le()||bt||(bt=setTimeout(()=>{bt=null,Gi()},fl(Fo++)))}async function Gi(){if(!Le()||et)return;Po("connecting");let e;try{e=await rl()}catch(t){return t instanceof wt?ul():(m("Sync: could not get an access token:",t,"warn"),Po("offline"),_a())}if(!Le()||et)return;let n=new WebSocket(`${Uo.replace(/^http/,"ws")}/sync/ws`);et=n,n.onopen=()=>n.send(JSON.stringify({type:"auth",token:e,deviceId:No})),n.onmessage=t=>{let r;try{r=JSON.parse(String(t.data))}catch{return}let i=Bd.safeParse(r);if(i.success){if(i.data.type==="ready")Fo=0,Po("online"),(i.data.seq===void 0||i.data.seq!==de.pullSeq)&&(nt=!0),ln();else if(i.data.type==="changes"&&i.data.records){let{fromSeq:u,seq:d,records:T}=i.data;ml(async()=>{await zi(T),(u===void 0||d===void 0)&&(nt=!0),(nt||!pl(u,d))&&ln()}).catch(x=>m("Sync: failed to apply live changes:",x,"error"))}}},n.onclose=t=>{et===n&&(et=null),nt=!0,Le()&&(t.code===4401&&(zo=e),Po("offline"),_a())},n.onerror=()=>{}}async function hl(){if(!Le()){if(!No){let e=await Je("device_id");No=typeof e=="string"&&e?e:crypto.randomUUID()}Bo="idle",tt({kind:"connecting"}),Oi=0,Fo=0,_i=ki(Qd),Aa||(Aa=!0,window.addEventListener("online",()=>Vi())),await Gi()}}function gl(e){tt(e),_i?.(),_i=null;for(let t of[rn,Hn,bt])t&&clearTimeout(t);rn=Hn=bt=null,Do=!1;let n=et;et=null;try{n?.close()}catch{}}async function yl(){if(!_t()){Nn();return}try{let e=ui.safeParse(await nl());e.success&&nn(e.data);let n=ue();n.isSignedIn&&n.refreshToken?(await Fd(),await hl()):tt({kind:"signed-out"})}catch(e){m("Failed to load sync auth state:",e,"error")}}var vl=()=>fi(Es)??Ss,Zd=()=>fi(Ls)??ks;function bl(e,n){return Je(e).then(t=>t!==void 0?t:n)}function wl(e,n){return yt(e,n),Promise.resolve()}if(al())throw new Error("OAuth window closed");ka();Ea()||Ta();(async function(){"use strict";if(window.top!==window.self)return;try{let o=await Je("device_id"),s=typeof o=="string"&&o.length>0?o:crypto.randomUUID();await yt("device_id",s),m(`Lamport: device_id = ${s}`)}catch(o){m("Lamport: failed to initialize device_id:",o,"warn")}let e=["/watch","/live"];function n(o=window.location.href){try{let s=new URL(o);return s.origin!=="https://www.youtube.com"?!1:e.some(a=>s.pathname===a||s.pathname.startsWith(`${a}/`))}catch(s){return m("Timekeeper failed to parse URL for support check:",s,"error"),!1}}let t=null,r=null,i=null,u=null,d=null,T=null,x=null,b=null,_=(()=>{try{let o=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(o)&&o>0&&o!==1?Math.min(o,4):2}catch{return 2}})(),E=!1,H=null,O=null,Q=250,Ht=null;function Bt(){return Ao().ui.minPaneHeight}function Tt(o){la(o)}function Un(o){da(o)}function Go(){return Ao().ui.urlChangeHandlersSetup}function qo(o){ua(o)}function jo(){return Ao().ui.panePosition}function Nt(o){ca(o)}function Fn(o){ma(o)}function qi(o,s,a){return Math.max(0,o.offsetHeight-(s.offsetHeight+a.offsetHeight))}function cn(){return t?t.getBoundingClientRect():null}function Wo(o,s,a){o&&Nt({x:Math.round(typeof s=="number"?s:o.left),y:Math.round(typeof a=="number"?a:o.top),width:Math.round(o.width),height:Math.round(o.height)})}function dn(o=!0){if(!t)return;Vt();let s=cn();if(s&&(s.width||s.height)&&(Wo(s),o)){let a=jo();si("windowPosition",a),Et({type:"window_position_updated",position:a,timestamp:Date.now()})}}function $o(){if(!t||!r||!u||!i)return;let o=40,s=ee();if(s.length>0)o=s[0].offsetHeight;else{let a=document.createElement("li");a.style.visibility="hidden",a.style.position="absolute",a.textContent="00:00 Example",i.appendChild(a),o=a.offsetHeight,i.removeChild(a)}Q=r.offsetHeight+u.offsetHeight+o,Tt(Q),t.style.minHeight=Bt()+"px"}function ji(){requestAnimationFrame(()=>{ne?.(),$o(),dn(!0)})}function Tl(o=450){J&&(clearTimeout(J),J=null),J=setTimeout(()=>{zn(),ji(),J=null},o)}function xl(){J&&(clearTimeout(J),J=null)}function Wi(){i&&(i.style.visibility="hidden",m("Hiding timestamps during show animation")),ji(),Tl()}function Sl(){zn(),xl(),Me&&(clearTimeout(Me),Me=null),Me=setTimeout(()=>{t&&(t.style.display="none",Tr(),Me=null)},400)}function zn(){if(!i){ge&&(ge(),ge=null,We=null,Lt=null);return}if(!Lt){i.style.visibility==="hidden"&&(i.style.visibility="",m("Restoring timestamp visibility (no deferred fragment)")),ge&&(ge(),ge=null,We=null);return}m("Appending deferred timestamps after animation"),i.appendChild(Lt),Lt=null,at(),lt(),i.style.visibility==="hidden"&&(i.style.visibility="",m("Restoring timestamp visibility after append")),ge&&(ge(),ge=null,We=null),Ne(),re(),ne&&requestAnimationFrame(ne),Re(!0)}let Ot=null,Ut={phase:"unloaded"},ot=0;function _e(){return Ut.phase==="loading"}function Z(){return Ut.phase==="unloaded"?null:Ut.videoId}let xt="ytls-timestamp-pending-delete",He="ytls-timestamp-highlight";async function El(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(o=>setTimeout(o,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(o=>setTimeout(o,100));await new Promise(o=>setTimeout(o,200))}let $i=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],kl=5e3,Ll=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Yi(o){return Ll.has(o)}function he(){return document.querySelector("video")}let St=null;function G(){if(St&&document.contains(St))return St;let o=document.getElementById("movie_player");return o&&document.contains(o)?o:null}function Ki(o){return(Math.round(o*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function Ml(o){let s=o===1?2:o;_=s;try{localStorage.setItem("ytls-last-speed",String(s))}catch{}}function Yo(o){if(!b)return;let s=typeof o=="number"?o:he()?.playbackRate??1,a=Ki(s);b.dataset.speed!==a&&(b.dataset.speed=a,b.textContent=`${a}x`,b.setAttribute("aria-label",`Playback speed ${a}x`)),Math.abs(s-1)>.01?b.classList.add("ytls-playback-speed-active"):b.classList.remove("ytls-playback-speed-active")}function Al(o){let s=G(),a=he();if(E=!0,s&&typeof s.setPlaybackRate=="function")s.setPlaybackRate(o);else if(a)a.playbackRate=o;else return E=!1,!1;return Yo(o),!0}function Xi(){let o=he()?.playbackRate;return Number.isFinite(o)?Al(Math.abs(o-1)<=.001?_:1):!1}function Il(o){return o instanceof Element?!!o.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function Ko(o){return $i.every(s=>typeof o?.[s]=="function"?!0:Yi(s)?!!he():!1)}function Cl(o){return $i.filter(s=>typeof o?.[s]=="function"?!1:Yi(s)?!he():!0)}async function Rl(o=kl){let s=Date.now();for(;Date.now()-s<o;){let h=G();if(Ko(h))return h;await new Promise(g=>setTimeout(g,100))}let a=G();return Ko(a),a}let Qi="timestampOffsetSeconds",Pl=-5,Ji="shiftClickTimeSkipSeconds",Dl=10,Xo=300,Qo=300,Be=null;function Zi(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function er(){if(Zi()&&!Be)try{Be=new BroadcastChannel("ytls_timestamp_channel"),Be.onmessage=tr}catch(o){m("Failed to create BroadcastChannel:",o,"warn"),Be=null}}function Et(o){if(!Zi()){m("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(er(),!Be){m("No BroadcastChannel available to post message","warn");return}try{Be.postMessage(o)}catch(s){m("BroadcastChannel error, reopening:",s,"warn");try{Be=new BroadcastChannel("ytls_timestamp_channel"),Be.onmessage=tr,Be.postMessage(o)}catch(a){m("Failed to reopen BroadcastChannel:",a,"error")}}}function tr(o){if(m("Received message from another tab:",o.data),!(!n()||!i||!t)&&o.data){if(o.data.type==="timestamps_updated"&&o.data.videoId===Z())m("Debouncing timestamp load due to external update for video:",o.data.videoId),clearTimeout(mn),mn=setTimeout(()=>{m("Reloading timestamps due to external update for video:",o.data.videoId),ri()},500);else if(o.data.type==="window_position_updated"&&t){let s=o.data.position;if(s&&typeof s.x=="number"&&typeof s.y=="number"){t.style.left=`${s.x}px`,t.style.top=`${s.y}px`,t.style.right="auto",t.style.bottom="auto",typeof s.width=="number"&&s.width>0&&(t.style.width=`${s.width}px`),typeof s.height=="number"&&s.height>0&&(t.style.height=`${s.height}px`);let a=t.getBoundingClientRect();Nt({x:Math.round(s.x),y:Math.round(s.y),width:Math.round(a.width),height:Math.round(a.height)});let h=document.documentElement.clientWidth,g=document.documentElement.clientHeight;(a.left<0||a.top<0||a.right>h||a.bottom>g)&&Vt()}}}}er();let Ft=await bl(Qi);(typeof Ft!="number"||Number.isNaN(Ft))&&(Ft=Pl,await wl(Qi,Ft));let un=await bl(Ji);(typeof un!="number"||Number.isNaN(un))&&(un=Dl,await wl(Ji,un));let mn=null,je=new Map,kt=!1,C=null,Vn=null,Me=null,J=null,Ae=null,me=null,it=null,Jo=!1,ne=null,Lt=null,We=null,ge=null,rt=null,Gn=!1,Zo=!1,qn=null,jn=null,Wn=null,$n=null,Yn=null,Kn=null,Xn=null,Qn=null,pn=null,fn=null,hn=null,Ie=null,Ce=null,nr=0,gn=!1,Mt=null,yn=null,zt=null,or=null,vn=null;function Jn(){if(!i)return{items:[],starts:[]};if(or!==i||!vn?(vn?.disconnect(),vn=new MutationObserver(()=>{zt=null}),vn.observe(i,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),or=i,zt=null):vn.takeRecords().length>0&&(zt=null),!zt){let o=Lo(i),s=new Array(o.length);for(let a=0;a<o.length;a++){let h=o[a].querySelector("[data-time]")?.dataset.time;s[a]=h?Number.parseInt(h,10):NaN}zt={items:o,starts:s}}return zt}function ee(){return Jn().items}function ei(){return ra(i)}function st(){return yn!==null||(yn=sa(i)),yn}function at(){yn=null}function Zn(o=G(),s=he()){let a=o?.getDuration?.();return Number.isFinite(a)&&a>0?a:Number.isFinite(s?.duration)&&s.duration>0?s.duration:0}function ir(){return Zn()||st()}function _l(o){let s=o.querySelector(".time-diff");return s?(s.textContent?.trim()||"").startsWith("-"):!1}let Hl="\u251C\u2500 ",rr="\u2514\u2500 ",sr=/^[├└]─\s/;function eo(o){return sr.test(o)}function ar(o){return o.replace(sr,"")}function lr(o){let s=ee();if(o>=s.length-1)return rr;let g=s[o+1].querySelector("input");return g&&eo(g.value)?Hl:rr}function Bl(o,s){return`${lr(s)}${o}`}function Ne(){if(!i)return;ee().forEach((s,a)=>{let h=s.querySelector("input");if(!h||!eo(h.value))return;let g=ar(h.value),w=Bl(g,a);h.value!==w&&(h.value=w)})}function bn(){Mo(i),Lt&&(Lt=null),ge&&(ge(),ge=null,We=null)}function wn(){ia(i,_e())}function cr(o){Li(i,o)}function ti(){ta(i)}function ni(o){if(Ut={phase:o?"loading":"ready",videoId:Z()},!(!t||!i)){if(o)t.style.display="",t.classList.remove("ytls-fade-out"),t.classList.add("ytls-fade-in"),cr("Loading timestamps...");else if(ti(),t.style.display="",t.classList.remove("ytls-fade-out"),t.classList.add("ytls-fade-in"),d){let s=G();if(s){let a=s.getCurrentTime(),h=Number.isFinite(a)?Math.max(0,Math.floor(a)):Math.max(0,st());d.textContent=xo(h,Zn(s))}}!_e()&&i&&!Dn(i)&&wn(),$e()}}function to(o,s){o.dataset.time=String(s),o.textContent=ft(s,ir())}let no=null,oo=null,Oe=!1;function dr(o,s){if(!o||typeof o.getVideoData!="function"||!(s!==void 0?s:!!o.getVideoData()?.isLive))return!1;if(typeof o.getProgressState=="function"){let h=o.getProgressState(),g=Number(h?.seekableEnd??h?.liveHead??h?.head??h?.duration),w=Number(h?.current??o.getCurrentTime?.());if(Number.isFinite(g)&&Number.isFinite(w))return g-w>2}return!1}function Nl(o,s){if(!Number.isFinite(o))return;let a=ur(o);oi(a,s)}function Re(o=!1,s){if(kt&&!o)return;let a;if(typeof s=="number"&&Number.isFinite(s))a=Math.max(0,Math.floor(s));else{let h=G(),g=h?h.getCurrentTime():NaN;a=Number.isFinite(g)?Math.max(0,Math.floor(g)):Math.max(0,st())}Number.isFinite(a)&&Nl(a,o)}function ur(o){if(!Number.isFinite(o))return null;let{items:s,starts:a}=Jn(),h=-1,g=-1/0;for(let w=0;w<a.length;w++){let y=a[w];y<=o&&y>g&&(g=y,h=w)}return h>=0?s[h]:null}function oi(o,s=!1){let a=i?i.getElementsByClassName(He):null;if(!(!!a&&(o?a.length===1&&a[0]===o:a.length===0))&&a)for(let g of Array.from(a))g.classList.contains(xt)||g.classList.remove(He);if(o&&!o.classList.contains(xt)&&(o.classList.add(He),s))try{if(i instanceof HTMLElement){let g=o.getBoundingClientRect(),w=i.getBoundingClientRect();!(g.bottom<w.top||g.top>w.bottom)||o.scrollIntoView({behavior:"smooth",block:"center"})}else o.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{o.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Ol(o){if(Pe()||!Number.isFinite(o)||o===0)return!1;let s=ee();if(s.length===0)return!1;let a=[];return s.forEach(h=>{let g=h.querySelector("[data-time]"),w=g?.dataset.time;if(!g||!w)return;let y=Number.parseInt(w,10);if(!Number.isFinite(y))return;let f=Math.max(0,y+o);if(f!==y){to(g,f);let L=h.dataset.guid;L&&a.push({guid:L,start:f,comment:h.querySelector("input")?.value??""})}}),a.length===0?!1:(lt(),Ne(),re(),ii(),hr(Z(),a),Mt=null,!0)}function mr(o,s={}){if(!Number.isFinite(o)||o===0)return!1;if(!Ol(o)){if(s.alertOnNoChange){let y=s.failureMessage??"Offset did not change any timestamps.";alert(y)}return!1}let h=s.logLabel??"bulk offset";m(`Timestamps changed: Offset all timestamps by ${o>0?"+":""}${o} seconds (${h})`);let g=G(),w=g?Math.floor(g.getCurrentTime()):0;if(Number.isFinite(w)){let y=ur(w);oi(y,!1)}return!0}function pr(o){if(!i||_e())return;let s=o.target instanceof Element?o.target:null;if(!s)return;let a=s.closest("[data-time]"),h=s.closest("[data-increment]"),g=s.closest("[data-action]");if(a?.dataset.time){o.preventDefault();let w=Number(a.dataset.time);if(Number.isFinite(w)){m(`Seeking to timestamp ${w}`),Oe=!0;let f=G();f&&f.seekTo(w),setTimeout(()=>{Oe=!1},500)}let y=a.closest("li");y&&(ee().forEach(f=>{f.classList.contains(xt)||f.classList.remove(He)}),y.classList.contains(xt)||(y.classList.add(He),y.scrollIntoView({behavior:"smooth",block:"center"})))}else if(h?.dataset.increment){o.preventDefault();let w=h.closest("li"),y=w?.querySelector("[data-time]");if(!y||!y.dataset.time)return;let f=parseInt(y.dataset.time,10),L=parseInt(h.dataset.increment,10);if("shiftKey"in o&&o.shiftKey&&(L*=un),"altKey"in o?o.altKey:!1){mr(L,{logLabel:"Alt adjust"});return}let D=Math.max(0,f+L);if(m(`Timestamps changed: Timestamp time incremented from ${f} to ${D}`),at(),to(y,D),oo=D,no&&clearTimeout(no),Oe=!0,no=setTimeout(()=>{if(oo!==null){let V=G();V&&V.seekTo(oo)}no=null,oo=null,setTimeout(()=>{Oe=!1},500)},500),lt(),Ne(),re(),w){let V=w.querySelector("input"),$=w.dataset.guid;V&&$&&(so(Z(),$,D,V.value),Mt=$)}}else g?.dataset.action==="clear"&&(o.preventDefault(),m("Timestamps changed: All timestamps cleared from UI"),i.textContent="",at(),re(),io(),zl(),Fn([]),Fl(Z()),Mt=null,wn())}function Tn(o,s="",a=!1,h=null,g=!0){if(!i)return null;let w=Math.max(0,o),y=h??crypto.randomUUID(),f=document.createElement("li"),L=document.createElement("div"),k=document.createElement("span"),M=document.createElement("span"),D=document.createElement("span"),V=document.createElement("div"),$=document.createElement("span"),we=document.createElement("span"),F=document.createElement("input"),Y=document.createElement("button");f.dataset.guid=y,L.className="time-row",V.className="ytls-row-controls";let oe=document.createElement("div");oe.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",ce(oe,"Click to toggle indent");let ye=document.createElement("span");ye.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let De=()=>{let B=F.offsetTop,R=F.offsetHeight||20;oe.style.top=`${B}px`,oe.style.height=`${R}px`},Ue=()=>{ie(ye,eo(F.value)?"indent-decrease":"indent-increase",18)},Gt="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",ct=B=>{let R=ye.querySelector("svg");R&&(R.style.transition="filter 0.15s ease",R.style.filter=B?Gt:"none")},qt=B=>{B.stopPropagation();let R=eo(F.value),q=ar(F.value),z="";if(!R){let Te=ee().indexOf(f);z=lr(Te)}F.value=z?`${z}${q}`:q,Ue(),Ne();let j=Number.parseInt($.dataset.time??"0",10);so(Z(),y,j,F.value)};oe.onclick=qt,oe.append(ye),oe.addEventListener("mouseenter",()=>{ct(!0)}),oe.addEventListener("mouseleave",()=>{ct(!1)}),f.style.cssText="position:relative;padding-left:20px;",f.addEventListener("mouseenter",()=>{De(),Ue(),ye.style.display="inline"}),f.addEventListener("mouseleave",()=>{ct(!1),ye.style.display="none"}),f.addEventListener("mouseleave",()=>{f.dataset.guid===Mt&&_l(f)&&fr()}),F.value=s||"",F.style.cssText="width:100%;margin-top:5px;display:block;",F.type="text",F.setAttribute("inputmode","text"),F.autocapitalize="off",F.autocomplete="off",F.spellcheck=!1,requestAnimationFrame(De);let En=!1;F.addEventListener("focusin",()=>{gn=!1,En=!1}),F.addEventListener("focusout",B=>{let R=B.relatedTarget,q=Date.now()-nr<250,z=!!R&&!!t&&t.contains(R);!q&&!z&&!En&&(gn=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(F.focus({preventScroll:!0}),gn=!1)},0))}),F.addEventListener("keydown",B=>{(B.key==="Escape"||B.key==="Esc")&&(B.preventDefault(),En=!0,F.blur())});let kn=B=>{let R=je.get(y);R&&clearTimeout(R.timeoutId);let q=Z(),z=()=>{let j=je.get(y);j&&(clearTimeout(j.timeoutId),je.delete(y)),gr(q,y,Number.parseInt($.dataset.time??"0",10),F.value)};je.set(y,{timeoutId:setTimeout(z,B),flush:z})};F.addEventListener("input",B=>{let R=B;R&&(R.isComposing||R.inputType==="insertCompositionText")||kn(500)}),F.addEventListener("compositionend",()=>{kn(50)});let Ye="#f4ba78",ao="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",lo="#c8452d",co="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",It=(B,R=Ye,q=ao)=>{B.style.color=R;let z=B.querySelector("svg");z&&(z.style.transition="filter 0.15s ease"),B.addEventListener("mouseenter",()=>{z&&(z.style.filter=q)}),B.addEventListener("mouseleave",()=>{z&&(z.style.filter="none")})};ie(k,"circle-minus",18),k.classList.add("ytls-row-control"),k.dataset.increment="-1",k.style.cursor="pointer",k.style.margin="0px",It(k),ie(D,"circle-plus",18),D.classList.add("ytls-row-control"),D.dataset.increment="1",D.style.cursor="pointer",D.style.margin="0px",It(D),ie(M,"current-location",18),M.classList.add("ytls-row-control"),M.style.cursor="pointer",M.style.margin="0px",ce(M,"Set to current playback time"),It(M),M.onclick=()=>{let B=G(),R=B?Math.floor(B.getCurrentTime()):0;Number.isFinite(R)&&(m(`Timestamps changed: set to current playback time ${R}`),at(),to($,R),lt(),Ne(),so(Z(),y,R,F.value),Mt=y)},at(),to($,w),$.addEventListener("click",B=>{B.preventDefault(),B.stopPropagation();let R=Number($.dataset.time);if(!Number.isFinite(R))return;m(`Seeking to timestamp ${R}`),Oe=!0;let q=G();q&&q.seekTo(R);let z=he();z?.paused&&z.play(),setTimeout(()=>{Oe=!1},500),i?.querySelectorAll(`.${He}`).forEach(j=>j.classList.remove(He)),f.classList.contains(xt)||(f.classList.add(He),f.scrollIntoView({behavior:"smooth",block:"center"}))}),ie(Y,"trash",16),Y.classList.add("ytls-row-control"),Y.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",It(Y,lo,co),Y.onclick=()=>{let B=null,R=null,q=null,z=()=>{try{f.removeEventListener("click",R,!0)}catch{}try{document.removeEventListener("click",R,!0)}catch{}if(i)try{i.removeEventListener("mouseleave",q)}catch{}B&&(clearTimeout(B),B=null)};if(f.dataset.deleteConfirmed==="true"){m("Timestamps changed: Timestamp deleted");let j=f.dataset.guid??"",se=je.get(j);se&&(clearTimeout(se.timeoutId),je.delete(j)),z(),f.remove(),at(),lt(),Ne(),re(),io(),Vl(Z(),j),Mt=null,wn()}else{f.dataset.deleteConfirmed="true",f.classList.add(xt),f.classList.remove(He);let j=()=>{f.dataset.deleteConfirmed="false",f.classList.remove(xt);let se=G(),Te=se?se.getCurrentTime():0,Fe=Number.parseInt(f.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(Te)&&Number.isFinite(Fe)&&Te>=Fe&&f.classList.add(He),z()};R=se=>{se.target!==Y&&j()},q=()=>{f.dataset.deleteConfirmed==="true"&&j()},f.addEventListener("click",R,!0),document.addEventListener("click",R,!0),i&&i.addEventListener("mouseleave",q),B=setTimeout(()=>{f.dataset.deleteConfirmed==="true"&&j(),z()},5e3)}},we.className="time-diff",we.style.color="#888",we.style.marginLeft="5px",V.append(k,M,D,Y),L.append($,V,we),f.append(oe,L,F);let uo=Number.parseInt($.dataset.time??"0",10);if(g){ti();let B=!1,R=ee();for(let q=0;q<R.length;q++){let z=R[q],se=z.querySelector("[data-time]")?.dataset.time;if(!se)continue;let Te=Number.parseInt(se,10);if(Number.isFinite(Te)&&uo<Te){i.insertBefore(f,z),B=!0;break}}B||i.appendChild(f),f.scrollIntoView({behavior:"smooth",block:"center"}),at(),lt(),io(),Ne(),re(),a||(so(Z(),y,w,s),Mt=y,oi(f,!1))}else F.__ytls_li=f;return F}function lt(){if(Pe())return;let o=ir(),s=ee();s.forEach((a,h)=>{let g=a.querySelector(".time-diff"),w=a.querySelector("[data-time]"),y=w?.dataset.time;if(w&&y){let we=Number.parseInt(y,10);Number.isFinite(we)&&(w.textContent=ft(we,o))}if(!g)return;if(!y){g.textContent="";return}let f=Number.parseInt(y,10);if(!Number.isFinite(f)){g.textContent="";return}if(h===0){g.textContent="";return}let M=s[h-1].querySelector("[data-time]")?.dataset.time;if(!M){g.textContent="";return}let D=Number.parseInt(M,10);if(!Number.isFinite(D)){g.textContent="";return}let V=f-D,$=V<0?"-":"";g.textContent=` ${$}${ft(Math.abs(V))}`})}function fr(){if(Pe())return;let o=null;if(document.activeElement instanceof HTMLInputElement&&i.contains(document.activeElement)){let y=document.activeElement,L=y.closest("li")?.dataset.guid;if(L){let k=y.selectionStart??y.value.length,M=y.selectionEnd??k,D=y.scrollLeft;o={guid:L,start:k,end:M,scroll:D}}}let s=ee();if(s.length===0)return;let a=s.map(y=>y.dataset.guid),h=s.map(y=>{let f=y.querySelector("[data-time]"),L=f?.dataset.time;if(!f||!L)return null;let k=Number.parseInt(L,10);if(!Number.isFinite(k))return null;let M=y.dataset.guid??"";return{time:k,guid:M,element:y}}).filter(y=>y!==null).sort((y,f)=>{let L=y.time-f.time;return L!==0?L:y.guid.localeCompare(f.guid)}),g=h.map(y=>y.guid),w=a.length!==g.length||a.some((y,f)=>y!==g[f]);if(i.replaceChildren(),h.forEach(y=>{i.appendChild(y.element)}),lt(),Ne(),re(),o){let f=ee().find(L=>L.dataset.guid===o.guid)?.querySelector("input");if(f)try{f.focus({preventScroll:!0})}catch{}}w&&(m("Timestamps changed: Timestamps sorted"),ii())}function io(){if(!i||!t||!r||!u)return;let o=ee().length;ne?.();let s=qi(t,r,u);o===0?(wn(),i.style.overflowY="hidden"):i.style.overflowY=i.scrollHeight>s?"auto":"hidden"}function re(){if(!i)return;let o=he(),s=document.querySelector(".ytp-progress-bar"),a=G(),h=a?a.getVideoData():null,g=!!h&&!!h.isLive;if(!o||!s||!isFinite(o.duration)||g)return;vr();let{items:w,starts:y}=Jn(),f=o.duration,L=document.createDocumentFragment();w.forEach((k,M)=>{let D=y[M];if(!Number.isFinite(D))return;k.dataset.guid||(k.dataset.guid=crypto.randomUUID());let V=document.createElement("div");V.className="ytls-marker",V.style.left=D/f*100+"%",V.dataset.time=String(D),L.appendChild(V)}),s.appendChild(L),Ul(s)}function Ul(o){o.dataset.ytlsMarkerClicks||(o.dataset.ytlsMarkerClicks="1",o.addEventListener("click",s=>{let a=s.target?.closest?.(".ytls-marker");if(!a)return;let h=Number(a.dataset.time),g=G();g&&Number.isFinite(h)&&g.seekTo(h)}))}function ii(){Fn(ei().sort((o,s)=>o.start-s.start))}function hr(o,s){!o||s.length===0||_e()||Pe()||(Kl(o,s).then(()=>{m(`Saved ${s.length} timestamps for ${o} to IndexedDB`),i&&xn()}).catch(a=>{let h=`Failed to save timestamps: ${a.message}`;m(`Failed to save timestamps for ${o} to IndexedDB:`,a,"error"),At(h)}),Et({type:"timestamps_updated",videoId:o,action:"saved"}))}function Fl(o){!o||_e()||Pe()||(br(o).then(()=>{i&&xn()}).catch(s=>{let a=`Failed to clear timestamps: ${s.message}`;m(`Failed to clear timestamps for ${o}:`,s,"error"),At(a)}),Et({type:"timestamps_updated",videoId:o,action:"saved"}))}function ro(){for(let{flush:o}of[...je.values()])o()}function zl(){je.forEach(({timeoutId:o})=>clearTimeout(o)),je.clear()}function so(o,s,a,h){!o||_e()||Pe()||gr(o,s,a,h)}function gr(o,s,a,h){if(!o)return;let g={guid:s,start:a,comment:h};m(`Saving timestamp: guid=${s}, start=${a}, comment="${h}"`),Xl(o,g).then(()=>{i&&xn()}).catch(w=>{let y=`Failed to save timestamp: ${w.message}`;m(`Failed to save timestamp ${s}:`,w,"error"),At(y)}),Et({type:"timestamps_updated",videoId:o,action:"saved"})}function Vl(o,s){!o||_e()||Pe()||(Ql(o,s).then(()=>{i&&xn()}).catch(a=>{let h=`Failed to delete timestamp: ${a.message}`;m(`Failed to delete timestamp ${s}:`,a,"error"),At(h)}),Et({type:"timestamps_updated",videoId:o,action:"saved"}))}async function yr(o){if(Pe()){alert("Cannot export timestamps while an error is being displayed.");return}let s=Z();if(!s)return;m(`Exporting timestamps for video ID: ${s}`);let a=ei(),h=Rt();if(o==="json"){let g=new Blob([JSON.stringify(a,null,2)],{type:"application/json"}),w=URL.createObjectURL(g),y=document.createElement("a");y.href=w,y.download=`timestamps-${s}-${h}.json`,y.click(),URL.revokeObjectURL(w)}else if(o==="text"){let g=pi(a,!0),w=new Blob([g],{type:"text/plain"}),y=URL.createObjectURL(w),f=document.createElement("a");f.href=y,f.download=`timestamps-${s}-${h}.txt`,f.click(),URL.revokeObjectURL(y)}}function At(o){if(!t||!i){m("Timekeeper error:",o,"error");return}na(i,o),Mi(o),re()}function xn(){i&&(oa(i),Mi(null))}function Pe(){return!!(!i||Dn(i)||_e()||pa()!==null)}function vr(){document.querySelectorAll(".ytls-marker").forEach(o=>o.remove())}function Vt(){if(!t||!document.body.contains(t))return;let o=t.getBoundingClientRect(),s=document.documentElement.clientWidth,a=document.documentElement.clientHeight,h=o.width,g=o.height;if(o.left<0&&(t.style.left="0",t.style.right="auto"),o.right>s){let w=Math.max(0,s-h);t.style.left=`${w}px`,t.style.right="auto"}if(o.top<0&&(t.style.top="0",t.style.bottom="auto"),o.bottom>a){let w=Math.max(0,a-g);t.style.top=`${w}px`,t.style.bottom="auto"}}function Gl(){if(qn&&(document.removeEventListener("mousemove",qn),qn=null),jn&&(document.removeEventListener("mouseup",jn),jn=null),pn&&(document.removeEventListener("keydown",pn),pn=null),Wn&&(window.removeEventListener("resize",Wn),Wn=null),fn&&(document.removeEventListener("pointerdown",fn,!0),fn=null),hn&&(document.removeEventListener("pointerup",hn,!0),hn=null),Ie){try{Ie.disconnect()}catch{}Ie=null}if(Ce){try{Ce.disconnect()}catch{}Ce=null}let o=he();o&&($n&&(o.removeEventListener("timeupdate",$n),$n=null),Yn&&(o.removeEventListener("pause",Yn),Yn=null),Kn&&(o.removeEventListener("play",Kn),Kn=null),Xn&&(o.removeEventListener("seeking",Xn),Xn=null),Qn&&(o.removeEventListener("ratechange",Qn),Qn=null))}function ql(){vr(),ro(),mn&&(clearTimeout(mn),mn=null),Ot&&(clearInterval(Ot),Ot=null),Me&&(clearTimeout(Me),Me=null),Gl(),Is();try{Be.close()}catch{}if(C&&C.parentNode===document.body&&document.body.removeChild(C),C=null,Vn=null,kt=!1,ot++,Ut={phase:"unloaded"},Ie){try{Ie.disconnect()}catch{}Ie=null}if(Ce){try{Ce.disconnect()}catch{}Ce=null}t&&t.parentNode&&t.remove();let o=document.getElementById("ytls-header-button");o&&o.parentNode&&o.remove(),rt=null,Gn=!1,Nt(null),bn(),t=null,r=null,i=null,u=null,me=null,it=null,ne=null,d=null,T=null,b=null,H=null,St=null}async function jl(){let o=Sn();if(!o)return St=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let s=await Rl();if(!Ko(s)){let a=Cl(s),h=a.length?` Missing methods: ${a.join(", ")}.`:"",g=s?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return St=null,{ok:!1,message:`${g}${h} Try refreshing once playback is ready.`}}return St=s,{ok:!0,player:s,videoId:o}}async function ri(){if(!t||!i)return;let o=ot,s=i.scrollTop,a=!0,h=()=>{if(!i||!a)return;let g=Math.max(0,i.scrollHeight-i.clientHeight);i.scrollTop=Math.min(s,g)};try{let g=await jl();if(o!==ot)return;if(!g.ok){At(g.message),bn(),re();return}let{videoId:w}=g,y=[];try{let f=await Jl(w);if(o!==ot)return;f?(y=f.map(L=>({...L,guid:L.guid||crypto.randomUUID()})),m(`Loaded ${y.length} timestamps from IndexedDB for ${w}`),xn()):m(`No timestamps found in IndexedDB for ${w}`)}catch(f){let L=`Failed to load timestamps: ${f.message}`;m(`Failed to load timestamps from IndexedDB for ${w}:`,f,"error"),At(L),re();return}if(y.length>0){y.sort((k,M)=>k.start-M.start),bn(),ti();let f=document.createDocumentFragment();y.forEach(k=>{let D=Tn(k.start,k.comment,!0,k.guid,!1).__ytls_li;D&&f.appendChild(D)}),t&&t.classList.contains("ytls-zoom-in")&&J!=null?(m("Deferring timestamp DOM append until show animation completes"),Lt=f,We||(We=new Promise(k=>{ge=k})),await We):i&&(i.appendChild(f),at(),lt(),Ne(),re(),ne&&requestAnimationFrame(ne)),Fn(y),Re(!0),a=!1}else bn(),cr("No timestamps for this video"),re(),Fn([]),ne&&requestAnimationFrame(ne)}catch(g){m("Unexpected error while loading timestamps:",g,"error"),At("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{We&&await We,requestAnimationFrame(h),ne&&requestAnimationFrame(ne),i&&!Dn(i)&&wn()}}function Sn(){let s=new URLSearchParams(location.search).get("v");if(s)return s;let a=document.querySelector('meta[itemprop="identifier"]');return a?.content?a.content:null}function Wl(o=null,s=null){if(!d)return;let a=he(),h=s||G();if(!a&&!h)return;let g=o!==null?o:h?h.getCurrentTime():0,w=Number.isFinite(g)?Math.max(0,Math.floor(g)):Math.max(0,st()),{isLive:y}=h?h.getVideoData()||{isLive:!1}:{isLive:!1},f=h?dr(h,!!y):!1;d.textContent=xo(w,Zn(h,a)),d.style.color=f?"#ff4d4f":""}function $l(){let o=he();if(!o)return;let s=NaN,a=null,h=()=>{if(!i)return;let k=G(),M=k?Math.floor(k.getCurrentTime()):0;if(!Number.isFinite(M))return;let D=Jn();if(M===s&&D===a)return;let V=!!d&&!_e()&&!Oe;V&&Wl(M,k),Re(!1,M),V&&!kt&&(s=M,a=D)},g=k=>{try{let M=new URL(window.location.href);k!==null&&Number.isFinite(k)?M.searchParams.set("t",`${Math.floor(k)}s`):M.searchParams.delete("t"),window.history.replaceState(window.history.state,"",M.toString())}catch{}},w=()=>{let k=G(),M=k?k.getCurrentTime():NaN,D=Number.isFinite(M)?Math.max(0,Math.floor(M)):Math.max(0,st());if(Number.isFinite(D)){g(D);try{Re(!0)}catch(V){m("Failed to highlight nearest timestamp on pause:",V,"warn")}}},y=()=>{g(null);try{let k=G(),M=k?k.getCurrentTime():NaN,D=Number.isFinite(M)?Math.max(0,Math.floor(M)):Math.max(0,st());Number.isFinite(D)&&Re(!0)}catch(k){m("Failed to highlight nearest timestamp on play:",k,"warn")}},f=()=>{let k=he();if(!k)return;let M=G(),D=M?Math.floor(M.getCurrentTime()):0;Number.isFinite(D)&&(k.paused&&g(D),Re(!0,D))},L=()=>{let k=o.playbackRate;E?E=!1:Ml(k),Yo(k)};$n=h,Yn=w,Kn=y,Xn=f,Qn=L,o.addEventListener("timeupdate",h),o.addEventListener("pause",w),o.addEventListener("play",y),o.addEventListener("seeking",f),o.addEventListener("ratechange",L)}let{saveToIndexedDB:Yl,saveRowsToIndexedDB:Kl,saveSingleTimestampToIndexedDB:Xl,deleteSingleTimestampFromIndexedDB:Ql,loadFromIndexedDB:Jl,removeFromIndexedDB:br,saveGlobalSettings:si,loadGlobalSettings:wr,buildExportPayload:eu,exportAllTimestamps:Zl,exportAllTimestampsCsv:ec}=ko;function Tr(){if(!t)return;let o=t.style.display!=="none";si("uiVisible",o)}function $e(o){let s=typeof o=="boolean"?o:!!t&&t.style.display!=="none",a=document.getElementById("ytls-header-button");if(a instanceof HTMLButtonElement&&a.setAttribute("aria-pressed",String(s)),rt&&!Gn){let h=vl();rt.src!==h&&(rt.src=h)}}function tc(){t&&wr("uiVisible").then(o=>{let s=mt().safeParse(o),a=s.success?s.data:void 0;typeof a=="boolean"?(a?(t.style.display="flex",t.classList.remove("ytls-zoom-out"),t.classList.add("ytls-zoom-in")):t.style.display="none",$e(a)):(!s.success&&o!==void 0&&m("UI visibility state failed validation, defaulting to visible",s.error.message,"warn"),t.style.display="flex",t.classList.remove("ytls-zoom-out"),t.classList.add("ytls-zoom-in"),$e(!0))}).catch(o=>{m("Failed to load UI visibility state:",o,"error"),t.style.display="flex",t.classList.remove("ytls-zoom-out"),t.classList.add("ytls-zoom-in"),$e(!0)})}function ai(o){if(!t){m("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(t)||(m("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(g=>{g!==t&&g.remove()}),document.body.appendChild(t));let s=document.querySelectorAll("#ytls-pane");s.length>1&&(m(`ERROR: Multiple panes detected in togglePaneVisibility (${s.length}), cleaning up`),s.forEach(g=>{g!==t&&g.remove()})),Me&&(clearTimeout(Me),Me=null);let a=t.style.display==="none";(typeof o=="boolean"?o:a)?(t.style.display="flex",t.classList.remove("ytls-fade-out"),t.classList.remove("ytls-zoom-out"),t.classList.add("ytls-zoom-in"),$e(!0),Tr(),Wi(),J&&(clearTimeout(J),J=null),J=setTimeout(()=>{zn(),ne?.(),$o(),dn(!0);try{Re(!0)}catch(g){m("Failed to scroll to nearest timestamp after toggle:",g,"warn")}J=null},450)):(t.classList.remove("ytls-fade-in"),t.classList.remove("ytls-zoom-in"),t.classList.add("ytls-zoom-out"),$e(!1),Sl())}function xr(o){if(!i){m("UI is not initialized; cannot import timestamps.","warn");return}let s=!1,a=[],h=(g,w)=>{let y=g.querySelector("input");if(!y)return;y.value=w;let f=g.dataset.guid,L=Number.parseInt(g.querySelector("[data-time]")?.dataset.time??"",10);f&&Number.isFinite(L)&&a.push({guid:f,start:L,comment:w})};try{let g=JSON.parse(o),w=null;if(Array.isArray(g))w=g;else if(typeof g=="object"&&g!==null){let y=Z();if(y){let f=`timekeeper-${y}`;g[f]&&Array.isArray(g[f].timestamps)&&(w=g[f].timestamps,m(`Found timestamps for current video (${y}) in export format`,"info"))}if(!w){let f=Object.keys(g).filter(L=>L.startsWith("ytls-"));if(f.length===1&&Array.isArray(g[f[0]].timestamps)){w=g[f[0]].timestamps;let L=g[f[0]].video_id;m(`Found timestamps for video ${L} in export format`,"info")}}}w&&Array.isArray(w)?w.every(f=>typeof f.start=="number"&&typeof f.comment=="string")?(w.forEach(f=>{if(f.guid){let L=ee().find(k=>k.dataset.guid===f.guid);L?h(L,f.comment):Tn(f.start,f.comment,!1,f.guid)}else Tn(f.start,f.comment,!1,crypto.randomUUID())}),s=!0):m("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):m("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!s){let g=o.split(`
`).map(w=>w.trim()).filter(w=>w);if(g.length>0){let w=!1;g.forEach(y=>{let f=y.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(f){w=!0;let L=parseInt(f[1])||0,k=parseInt(f[2]),M=parseInt(f[3]),D=L*3600+k*60+M,V=f[4]?f[4].trim():"",$=null,we=V,F=V.match(/<!--\s*guid:([^>]+?)\s*-->/);F&&($=F[1].trim(),we=V.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let Y;$&&(Y=ee().find(oe=>oe.dataset.guid===$)),!Y&&!$&&(Y=ee().find(oe=>{if(oe.dataset.guid)return!1;let De=oe.querySelector("[data-time]")?.dataset.time;if(!De)return!1;let Ue=Number.parseInt(De,10);return Number.isFinite(Ue)&&Ue===D})),Y?h(Y,we):Tn(D,we,!1,$||crypto.randomUUID())}}),w&&(s=!0)}}s?(m("Timestamps changed: Imported timestamps from file/clipboard"),Ne(),ii(),hr(Z(),a),re(),io()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function nc(){if(Zo){m("Pane initialization already in progress, skipping duplicate call");return}if(!(t&&document.body.contains(t))){Zo=!0;try{let g=function(l=null,c=null){if(!d)return;let p=he(),v=c||G();if(!p&&!v)return;let S=l!==null?l:v?v.getCurrentTime():0,U=Number.isFinite(S)?Math.max(0,Math.floor(S)):Math.max(0,st()),{isLive:A}=v?v.getVideoData()||{isLive:!1}:{isLive:!1},P=v?dr(v,!!A):!1;d.textContent=xo(U,Zn(v,p)),d.style.color=P?"#ff4d4f":"",h(!!A);try{Yo()}catch{}},w=function(){if(_e()||Oe)return;let l=G();if(!l)return;let c=l.getCurrentTime(),p=Number.isFinite(c)?Math.max(0,Math.floor(c)):Math.max(0,st());g(p,l),(i?ee():[]).length>0&&Re(!1,p)},Y=function(l,c,p,v){let S=document.createElement("button");return v?be(S,v,l):S.textContent=l,ce(S,c),S.classList.add("ytls-settings-modal-button"),S.onclick=p,S},oe=function(l="general"){if(C&&C.parentNode===document.body){let W=document.getElementById("ytls-save-modal"),ut=document.getElementById("ytls-load-modal"),Xe=document.getElementById("ytls-delete-all-modal");W&&document.body.contains(W)&&document.body.removeChild(W),ut&&document.body.contains(ut)&&document.body.removeChild(ut),Xe&&document.body.contains(Xe)&&document.body.removeChild(Xe),C.classList.remove("ytls-fade-in"),C.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(C)&&document.body.removeChild(C),C=null,document.removeEventListener("click",De,!0),document.removeEventListener("keydown",ye)},300);return}C=document.createElement("div"),C.id="ytls-settings-modal",C.classList.remove("ytls-fade-out"),C.classList.add("ytls-fade-in");let c=document.createElement("div");c.className="ytls-modal-header";let p=document.createElement("div");p.id="ytls-settings-nav";let v=document.createElement("button");v.className="ytls-modal-close-button",ie(v,"x",14),v.onclick=()=>{if(C&&C.parentNode===document.body){let W=document.getElementById("ytls-save-modal"),ut=document.getElementById("ytls-load-modal"),Xe=document.getElementById("ytls-delete-all-modal");W&&document.body.contains(W)&&document.body.removeChild(W),ut&&document.body.contains(ut)&&document.body.removeChild(ut),Xe&&document.body.contains(Xe)&&document.body.removeChild(Xe),C.classList.remove("ytls-fade-in"),C.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(C)&&document.body.removeChild(C),C=null,document.removeEventListener("click",De,!0),document.removeEventListener("keydown",ye)},300)}};let S=document.createElement("div");S.id="ytls-settings-content";let U=document.createElement("h3");U.className="ytls-section-heading",U.textContent="General",U.style.display="none";let A=document.createElement("div"),P=document.createElement("div");P.className="ytls-button-grid";function I(W){A.style.display=W==="general"?"block":"none",P.style.display=W==="sync"?"block":"none",N.classList.toggle("active",W==="general"),te.classList.toggle("active",W==="sync"),U.textContent=W==="general"?"General":"Sync"}let N=document.createElement("button");N.appendChild(Qt("adjustments-horizontal",16));let K=document.createElement("span");K.className="ytls-tab-text",K.textContent=" General",N.appendChild(K),ce(N,"General settings"),N.classList.add("ytls-settings-modal-button"),N.onclick=()=>I("general");let te=document.createElement("button");te.appendChild(Qt("server",16));let ze=document.createElement("span");ze.className="ytls-tab-text",ze.textContent=" Sync",te.appendChild(ze),ce(te,"Live sync across devices"),te.classList.add("ytls-settings-modal-button"),te.onclick=()=>I("sync"),p.appendChild(N),p.appendChild(te),c.appendChild(p),c.appendChild(v),C.appendChild(c),A.className="ytls-button-grid",A.appendChild(Y("Save","Save As...",Ue.onclick,"device-floppy")),A.appendChild(Y("Load","Load",Gt.onclick,"folder-open")),A.appendChild(Y("Export All","Export All Data",ct.onclick,"file-export")),A.appendChild(Y("Import All","Import All Data",qt.onclick,"file-import")),A.appendChild(Y("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await ec()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let Ke=Y("Sign In","Sign in to Timekeeper Sync with Google",async()=>{ue().isSignedIn?await dl():await ll()},"login"),Kt=Y("Sync Now","Sync with the server immediately",()=>Vi(),"refresh");Wa(()=>{let W=ue().isSignedIn;be(Ke,W?"logout":"login",W?"Sign Out":"Sign In"),ce(Ke,W?"Sign out of Timekeeper Sync":"Sign in to Timekeeper Sync with Google"),Ke.disabled=!W&&!_t(),Kt.disabled=!W}),P.appendChild(Ke),P.appendChild(Kt);let xe=document.createElement("div");xe.style.marginTop="15px",xe.style.paddingTop="10px",xe.style.borderTop="1px solid #555",xe.style.fontSize="12px",xe.style.color="#aaa";let Ct=document.createElement("div");Ct.style.marginBottom="8px",Ct.style.fontWeight="bold",xe.appendChild(Ct),qa(Ct);let _r=document.createElement("div");xe.appendChild(_r),ja(_r),P.appendChild(xe),Nn(),S.appendChild(U),S.appendChild(A),S.appendChild(P),I(l),C.appendChild(S),document.body.appendChild(C),requestAnimationFrame(()=>{let W=C.getBoundingClientRect(),Xe=(window.innerHeight-W.height)/2;C.style.top=`${Math.max(20,Xe)}px`,C.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",De,!0),document.addEventListener("keydown",ye)},0)},ye=function(l){if(l.key==="Escape"&&C&&C.parentNode===document.body){let c=document.getElementById("ytls-save-modal"),p=document.getElementById("ytls-load-modal"),v=document.getElementById("ytls-delete-all-modal");if(c||p||v)return;l.preventDefault(),c&&document.body.contains(c)&&document.body.removeChild(c),p&&document.body.contains(p)&&document.body.removeChild(p),v&&document.body.contains(v)&&document.body.removeChild(v),C.classList.remove("ytls-fade-in"),C.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(C)&&document.body.removeChild(C),C=null,document.removeEventListener("click",De,!0),document.removeEventListener("keydown",ye)},300)}},De=function(l){if(Vn&&Vn.contains(l.target))return;let c=document.getElementById("ytls-save-modal"),p=document.getElementById("ytls-load-modal"),v=document.getElementById("ytls-delete-all-modal");c&&c.contains(l.target)||p&&p.contains(l.target)||v&&v.contains(l.target)||C&&C.contains(l.target)||(c&&document.body.contains(c)&&document.body.removeChild(c),p&&document.body.contains(p)&&document.body.removeChild(p),v&&document.body.contains(v)&&document.body.removeChild(v),C&&C.parentNode===document.body&&(C.classList.remove("ytls-fade-in"),C.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(C)&&document.body.removeChild(C),C=null,document.removeEventListener("click",De,!0),document.removeEventListener("keydown",ye)},300)))},En=function(){t&&(m("Loading window position from IndexedDB"),wr("windowPosition").then(l=>{let c=Br.safeParse(l);if(c.success){let v=c.data;t.style.left=`${v.x}px`,t.style.top=`${v.y}px`,t.style.right="auto",t.style.bottom="auto",typeof v.width=="number"&&v.width>0?t.style.width=`${v.width}px`:(t.style.width=`${Xo}px`,m(`No stored window width found, using default width ${Xo}px`)),typeof v.height=="number"&&v.height>0?t.style.height=`${v.height}px`:(t.style.height=`${Qo}px`,m(`No stored window height found, using default height ${Qo}px`));let S=cn();Wo(S,v.x,v.y),m("Restored window position from IndexedDB:",jo())}else c.success?m("No window position found in IndexedDB, applying default size and leaving default position"):m("Window position in IndexedDB failed validation:",c.error.message,"warn"),t.style.width=`${Xo}px`,t.style.height=`${Qo}px`,Nt(null);Vt();let p=cn();p&&(p.width||p.height)&&Wo(p),ne?.()}).catch(l=>{m("failed to load pane position from IndexedDB:",l,"warn"),Vt();let c=cn();c&&(c.width||c.height)&&Nt({x:Math.max(0,Math.round(c.left)),y:0,width:Math.round(c.width),height:Math.round(c.height)}),ne?.()}))},kn=function(){if(!t)return;let l=cn();if(!l)return;let c={x:Math.max(0,Math.round(l.left)),y:Math.max(0,Math.round(l.top)),width:Math.round(l.width),height:Math.round(l.height)},p=jo();if(p&&p.x===c.x&&p.y===c.y&&p.width===c.width&&p.height===c.height){m("Skipping window position save; position and size unchanged");return}Nt({...c}),m(`Saving window position and size to IndexedDB: x=${c.x}, y=${c.y}, width=${c.width}, height=${c.height}`),si("windowPosition",c),Et({type:"window_position_updated",position:c,timestamp:Date.now()})},fo=function(l,c){l.addEventListener("dblclick",p=>{p.preventDefault(),p.stopPropagation(),t&&(t.style.width="300px",t.style.height="300px",kn(),yo())}),l.addEventListener("mousedown",p=>{p.preventDefault(),p.stopPropagation(),Fe=!0,dt=c,Mr=p.clientX,Ar=p.clientY;let v=t.getBoundingClientRect();jt=v.width,Wt=v.height,mo=v.left,po=v.top,Ir=document.documentElement.clientWidth,Cr=document.documentElement.clientHeight,c==="top-left"||c==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},Pr=function(){if(!i||!it)return;let{scrollTop:l,scrollHeight:c,clientHeight:p}=i;if(c<=p)return;let v=Math.max(30,p/c*p),S=l/(c-p)*(p-v);it.style.height=`${v}px`,it.style.top=`${S}px`},Dr=function(){me&&(di===null&&(di=requestAnimationFrame(()=>{di=null,Pr()})),me.classList.add("ytls-scrollbar-visible"),Ae&&clearTimeout(Ae),Ae=setTimeout(()=>{me?.classList.remove("ytls-scrollbar-visible"),Ae=null},500))},yo=function(){if(t&&r&&u&&i){let l=qi(t,r,u);i.style.maxHeight=l>0?l+"px":"0px",i.style.overflowY=l>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(l=>l.remove()),!document.getElementById("ytls-styles")){let l=document.createElement("style");l.id="ytls-styles",l.textContent=xs,document.head.appendChild(l)}t=document.createElement("div"),r=document.createElement("div"),i=document.createElement("ul"),u=document.createElement("div"),d=document.createElement("span"),H=document.createElement("span"),O=document.createElement("span"),O.classList.add("ytls-sync-indicator"),O.style.cursor="pointer",O.style.backgroundColor="#666",O.onclick=l=>{l.stopPropagation(),oe("sync")},i.addEventListener("mouseenter",()=>{kt=!0,gn=!1}),i.addEventListener("mouseleave",()=>{kt=!1;try{hi()}catch{}if(gn)return;Re(!1);let l=null;if(document.activeElement instanceof HTMLInputElement&&i.contains(document.activeElement)&&(l=document.activeElement.closest("li")?.dataset.guid??null),fr(),l){let p=ee().find(v=>v.dataset.guid===l)?.querySelector("input");if(p)try{p.focus({preventScroll:!0})}catch{}}}),t.id="ytls-pane",r.id="ytls-pane-header",r.addEventListener("dblclick",l=>{let c=l.target instanceof Element?l.target:null;if(c){let p=c;for(;p&&p!==t;){if(window.getComputedStyle(p).cursor==="pointer")return;p=p.parentElement}}l.preventDefault(),ai(!1)});let o=l=>{try{l.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(l=>{t.addEventListener(l,o)}),t.addEventListener("keydown",l=>{try{l.stopPropagation()}catch{}}),t.addEventListener("keyup",l=>{try{l.stopPropagation()}catch{}}),t.addEventListener("focus",l=>{try{l.stopPropagation()}catch{}},!0),t.addEventListener("blur",l=>{try{l.stopPropagation()}catch{}},!0),H.textContent=`v${wo}`,H.classList.add("ytls-version-display"),mi&&ce(H,`Built ${mi.toLocaleString()}`);let s=document.createElement("span");s.style.display="inline-flex",s.style.alignItems="center",s.style.gap="6px",s.appendChild(H),s.appendChild(O),T=document.createElement("span"),T.id="ytls-members-badge",T.appendChild(Qt("star",14)),ce(T,"Members-only stream"),Lr(),d.id="ytls-current-time",d.textContent="\u2014",d.style.cursor="default",ce(d,()=>{let l=G(),{isLive:c}=l?l.getVideoData()||{isLive:!1}:{isLive:!1};return c?"Skip to live":""}),b=document.createElement("span"),b.id="ytls-playback-speed",b.textContent="1x",b.style.cursor="pointer",b.style.userSelect="none",ce(b,()=>`Current playback speed. Click to toggle between 1x and ${Ki(_)}x.`),b.onclick=()=>{Xi()},b.addEventListener("mousedown",l=>{l.stopPropagation()}),b.addEventListener("click",l=>{l.stopPropagation()}),d.onclick=()=>{let l=G();if(!l)return;let{isLive:c}=l.getVideoData()||{isLive:!1};c&&(Oe=!0,l.seekToLiveHead(),setTimeout(()=>{Oe=!1},500))};let h=l=>{d.style.cursor=l?"pointer":"default"};w(),Ot&&clearInterval(Ot),Ot=setInterval(w,1e3),u.id="ytls-buttons";let y=(l,c)=>()=>{l.classList.remove("ytls-fade-in"),l.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(l)&&document.body.removeChild(l),c&&c()},300)},f=l=>c=>{c.key==="Escape"&&(c.preventDefault(),c.stopPropagation(),l())},L=l=>{setTimeout(()=>{document.addEventListener("keydown",l)},0)},k=(l,c)=>p=>{l.contains(p.target)||c()},M=l=>{setTimeout(()=>{document.addEventListener("click",l,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(Pe())return;let l=typeof Ft<"u"?Ft:0,c=G(),p=c?Math.floor(c.getCurrentTime()+l):0;if(!Number.isFinite(p))return;let v=Tn(p,"");v&&v.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>oe()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(l){if(Pe()){ie(this,"circle-x",20),setTimeout(()=>{ie(this,"clipboard",20)},2e3);return}let c=ei();if(c.length===0){ie(this,"circle-x",20),setTimeout(()=>{ie(this,"clipboard",20)},2e3);return}let p=l.ctrlKey,v=pi(c,p);navigator.clipboard.writeText(v).then(()=>{ie(this,"circle-check",20),setTimeout(()=>{ie(this,"clipboard",20)},2e3)}).catch(S=>{m("Failed to copy timestamps: ",S,"error"),ie(this,"circle-x",20),setTimeout(()=>{ie(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(Pe())return;if(ee().length===0){alert("No timestamps available to offset.");return}let c=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(c===null)return;let p=c.trim();if(p.length===0)return;let v=Number.parseInt(p,10);if(!Number.isFinite(v)){alert("Please enter a valid integer number of seconds.");return}v!==0&&mr(v,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let l=Sn();if(!l){alert("Unable to determine current video ID.");return}let c=document.createElement("div");c.id="ytls-delete-all-modal",c.classList.remove("ytls-fade-out"),c.classList.add("ytls-fade-in");let p=document.createElement("p");p.textContent="Hold the button to delete all timestamps for:",p.style.marginBottom="10px";let v=document.createElement("p");v.textContent=l,v.style.fontFamily="monospace",v.style.fontSize="12px",v.style.marginBottom="15px",v.style.color="#aaa";let S=document.createElement("button");S.classList.add("ytls-save-modal-button"),S.style.background="#d32f2f",S.style.position="relative",S.style.overflow="hidden";let U=null,A=0,P=null,I=document.createElement("div");I.style.position="absolute",I.style.left="0",I.style.top="0",I.style.height="100%",I.style.width="0%",I.style.background="#ff6b6b",I.style.transition="none",I.style.pointerEvents="none",S.appendChild(I);let N=document.createElement("span");N.textContent="Hold to Delete All",N.style.position="relative",N.style.zIndex="1",S.appendChild(N);let K=()=>{if(!A)return;let xe=Date.now()-A,Ct=Math.min(xe/5e3*100,100);I.style.width=`${Ct}%`,Ct<100&&(P=requestAnimationFrame(K))},te=()=>{U&&(clearTimeout(U),U=null),P&&(cancelAnimationFrame(P),P=null),A=0,I.style.width="0%",N.textContent="Hold to Delete All"};S.onmousedown=()=>{A=Date.now(),N.textContent="Deleting...",P=requestAnimationFrame(K),U=setTimeout(async()=>{te(),c.classList.remove("ytls-fade-in"),c.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(c)&&document.body.removeChild(c);try{await br(l),li()}catch(xe){m("Failed to delete all timestamps:",xe,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},S.onmouseup=te,S.onmouseleave=te;let ze=null,Ke=null,Kt=y(c,()=>{te(),ze&&document.removeEventListener("keydown",ze),Ke&&document.removeEventListener("click",Ke,!0)});ze=f(Kt),Ke=k(c,Kt);let Ln=document.createElement("button");Ln.textContent="Cancel",Ln.classList.add("ytls-save-modal-cancel-button"),Ln.onclick=Kt,c.appendChild(p),c.appendChild(v),c.appendChild(S),c.appendChild(Ln),document.body.appendChild(c),L(ze),M(Ke)}}].forEach(l=>{let c=document.createElement("button");ie(c,l.icon,20),ce(c,l.title),c.classList.add("ytls-main-button"),l.id==="copy"?c.onclick=function(p){l.action.call(this,p)}:c.onclick=l.action,l.id==="settings"&&(Vn=c),u.appendChild(c)});let Ue=document.createElement("button");be(Ue,"device-floppy","Save"),Ue.classList.add("ytls-file-operation-button"),Ue.onclick=()=>{let l=document.createElement("div");l.id="ytls-save-modal",l.classList.remove("ytls-fade-out"),l.classList.add("ytls-fade-in");let c=document.createElement("p");c.textContent="Save as:";let p=null,v=null,S=y(l,()=>{p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0)});p=f(S),v=k(l,S);let U=document.createElement("button");U.textContent="JSON",U.classList.add("ytls-save-modal-button"),U.onclick=()=>{p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0),y(l,()=>yr("json"))()};let A=document.createElement("button");A.textContent="Plain Text",A.classList.add("ytls-save-modal-button"),A.onclick=()=>{p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0),y(l,()=>yr("text"))()};let P=document.createElement("button");P.textContent="Cancel",P.classList.add("ytls-save-modal-cancel-button"),P.onclick=S,l.appendChild(c),l.appendChild(U),l.appendChild(A),l.appendChild(P),document.body.appendChild(l),L(p),M(v)};let Gt=document.createElement("button");be(Gt,"folder-open","Load"),Gt.classList.add("ytls-file-operation-button"),Gt.onclick=()=>{let l=document.createElement("div");l.id="ytls-load-modal",l.classList.remove("ytls-fade-out"),l.classList.add("ytls-fade-in");let c=document.createElement("p");c.textContent="Load from:";let p=null,v=null,S=y(l,()=>{p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0)});p=f(S),v=k(l,S);let U=document.createElement("button");U.textContent="File",U.classList.add("ytls-save-modal-button"),U.onclick=()=>{let I=document.createElement("input");I.type="file",I.accept=".json,.txt",I.classList.add("ytls-hidden-file-input"),I.onchange=N=>{let K=N.target.files?.[0];if(!K)return;p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0),S();let te=new FileReader;te.onload=()=>{let ze=String(te.result).trim();xr(ze)},te.readAsText(K)},I.click()};let A=document.createElement("button");A.textContent="Clipboard",A.classList.add("ytls-save-modal-button"),A.onclick=async()=>{p&&document.removeEventListener("keydown",p),v&&document.removeEventListener("click",v,!0),y(l,async()=>{try{let I=await navigator.clipboard.readText();I?xr(I.trim()):alert("Clipboard is empty.")}catch(I){m("Failed to read from clipboard: ",I,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let P=document.createElement("button");P.textContent="Cancel",P.classList.add("ytls-save-modal-cancel-button"),P.onclick=S,l.appendChild(c),l.appendChild(U),l.appendChild(A),l.appendChild(P),document.body.appendChild(l),L(p),M(v)};let ct=document.createElement("button");be(ct,"file-export","Export"),ct.classList.add("ytls-file-operation-button"),ct.onclick=async()=>{try{await Zl()}catch{alert("Failed to export data: Could not read from database.")}};let qt=document.createElement("button");be(qt,"file-import","Import"),qt.classList.add("ytls-file-operation-button"),qt.onclick=()=>{let l=document.createElement("input");l.type="file",l.accept=".json",l.classList.add("ytls-hidden-file-input"),l.onchange=c=>{let p=c.target.files?.[0];if(!p)return;let v=new FileReader;v.onload=()=>{try{let S=JSON.parse(String(v.result)),U=[];for(let A in S)if(Object.prototype.hasOwnProperty.call(S,A)&&A.startsWith("ytls-")){let P=A.substring(5),I=S[A];if(I&&typeof I.video_id=="string"&&Array.isArray(I.timestamps)){let N=Ts(P,I.timestamps).then(K=>Yl(P,K)).then(()=>m(`Imported ${P} to IndexedDB`)).catch(K=>m(`Failed to import ${P} to IndexedDB:`,K,"error"));U.push(N)}else m(`Skipping key ${A} during import due to unexpected data format.`,"warn")}Promise.all(U).then(()=>{li()}).catch(A=>{alert("An error occurred during import to IndexedDB. Check console for details."),m("Overall import error:",A,"error")})}catch(S){alert(`Failed to import data. Please ensure the file is in the correct format.
`+S.message),m("Import error:",S,"error")}},v.readAsText(p)},l.click()},i.onclick=l=>{pr(l)},i.ontouchstart=l=>{pr(l)},t.style.position="fixed",t.style.bottom="0",t.style.right="0",t.style.transition="none",En(),setTimeout(()=>Vt(),10);let Ye=!1,ao=0,lo=0,co=0,It=0,uo=0,B=0,R=null,q=!1;t.addEventListener("mousedown",l=>{let c=l.target;if(!(c instanceof Element)||c instanceof HTMLInputElement||c instanceof HTMLTextAreaElement||c instanceof Element&&(c.closest("#ytls-playback-speed-group")||c.closest("#ytls-playback-speed"))||c!==r&&!r.contains(c)&&window.getComputedStyle(c).cursor==="pointer")return;Ye=!0,q=!1;let p=t.getBoundingClientRect();ao=l.clientX-p.left,lo=l.clientY-p.top,co=p.width,It=p.height,uo=document.documentElement.clientWidth,B=document.documentElement.clientHeight,t.style.transition="none"}),document.addEventListener("mousemove",qn=l=>{if(!Ye)return;q=!0;let c=l.clientX,p=l.clientY;R===null&&(R=requestAnimationFrame(()=>{if(R=null,!Ye)return;let v=Math.max(0,Math.min(c-ao,uo-co)),S=Math.max(0,Math.min(p-lo,B-It));t.style.left=`${v}px`,t.style.top=`${S}px`,t.style.right="auto",t.style.bottom="auto"}))}),document.addEventListener("mouseup",jn=()=>{if(!Ye)return;Ye=!1,R!==null&&(cancelAnimationFrame(R),R=null);let l=q;setTimeout(()=>{q=!1},50),Vt(),setTimeout(()=>{l&&kn()},200)}),t.addEventListener("dragstart",l=>l.preventDefault());let z=document.createElement("div"),j=document.createElement("div"),se=document.createElement("div"),Te=document.createElement("div");z.id="ytls-resize-tl",j.id="ytls-resize-tr",se.id="ytls-resize-bl",Te.id="ytls-resize-br";let Fe=!1,Mr=0,Ar=0,jt=0,Wt=0,mo=0,po=0,Ir=0,Cr=0,$t=null,dt=null;fo(z,"top-left"),fo(j,"top-right"),fo(se,"bottom-left"),fo(Te,"bottom-right"),document.addEventListener("mousemove",l=>{if(!Fe||!t||!dt)return;let c=l.clientX,p=l.clientY;$t===null&&($t=requestAnimationFrame(()=>{if($t=null,!Fe||!t||!dt)return;let v=c-Mr,S=p-Ar,U=Ir,A=Cr,P=jt,I=Wt,N=mo,K=po;dt==="bottom-right"?(P=Math.max(200,Math.min(800,jt+v)),I=Math.max(250,Math.min(A,Wt+S))):dt==="top-left"?(P=Math.max(200,Math.min(800,jt-v)),N=mo+v,I=Math.max(250,Math.min(A,Wt-S)),K=po+S):dt==="top-right"?(P=Math.max(200,Math.min(800,jt+v)),I=Math.max(250,Math.min(A,Wt-S)),K=po+S):dt==="bottom-left"&&(P=Math.max(200,Math.min(800,jt-v)),N=mo+v,I=Math.max(250,Math.min(A,Wt+S))),N=Math.max(0,Math.min(N,U-P)),K=Math.max(0,Math.min(K,A-I)),t.style.width=`${P}px`,t.style.height=`${I}px`,t.style.left=`${N}px`,t.style.top=`${K}px`,t.style.right="auto",t.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Fe&&(Fe=!1,$t!==null&&(cancelAnimationFrame($t),$t=null),dt=null,document.body.style.cursor="",dn(!0))});let ho=null;window.addEventListener("resize",Wn=()=>{ho&&clearTimeout(ho),ho=setTimeout(()=>{dn(!0),ne?.(),ho=null},200)}),r.appendChild(T),r.appendChild(d);let Yt=document.createElement("span");Yt.id="ytls-playback-speed-group",Yt.style.display="inline-flex",Yt.style.alignItems="center",Yt.style.marginLeft="4px",b&&Yt.appendChild(b),r.appendChild(Yt),r.appendChild(s);let ci=document.createElement("div");ci.id="ytls-list-wrapper",me=document.createElement("div"),me.className="ytls-scrollbar-track",it=document.createElement("div"),it.className="ytls-scrollbar-thumb",me.append(it),ci.append(i,me);let go=document.createElement("div");go.id="ytls-content",go.append(ci),go.append(u),t.append(r,go,z,j,se,Te);let Rr="";t.addEventListener("mousemove",l=>{if(Ye||Fe)return;let c=t.getBoundingClientRect(),p=20,v=l.clientX,S=l.clientY,U=v-c.left<=p,A=c.right-v<=p,P=S-c.top<=p,I=c.bottom-S<=p,N="";P&&U||I&&A?N="nwse-resize":(P&&A||I&&U)&&(N="nesw-resize"),N!==Rr&&(Rr=N,document.body.style.cursor=N)});let di=null;if(me.addEventListener("mouseenter",()=>{Ae&&(clearTimeout(Ae),Ae=null),me.classList.add("ytls-scrollbar-visible")}),me.addEventListener("mouseleave",()=>{Jo||(Ae=setTimeout(()=>{me?.classList.remove("ytls-scrollbar-visible"),Ae=null},500))}),it.addEventListener("mousedown",l=>{if(!i)return;l.preventDefault(),l.stopPropagation(),Jo=!0;let c=l.clientY,p=i.scrollTop,{scrollHeight:v,clientHeight:S}=i,U=Math.max(30,S/v*S),A=v-S,P=S-U;function I(K){if(!i)return;let te=K.clientY-c;i.scrollTop=Math.max(0,Math.min(A,p+te*(A/P))),Pr()}function N(){Jo=!1,document.removeEventListener("mousemove",I),document.removeEventListener("mouseup",N),me?.matches(":hover")||(Ae=setTimeout(()=>{me?.classList.remove("ytls-scrollbar-visible"),Ae=null},500))}document.addEventListener("mousemove",I),document.addEventListener("mouseup",N)}),t.addEventListener("mouseenter",()=>{kt=!0,Dr()}),i.addEventListener("scroll",Dr),t.addEventListener("mouseleave",()=>{!Fe&&!Ye&&(document.body.style.cursor=""),kt=!1;try{hi()}catch{}try{Re(!1)}catch{}}),ne=yo,setTimeout(()=>{if(yo(),t&&r&&u&&i){let l=40,c=ee();if(c.length>0)l=c[0].offsetHeight;else{let p=document.createElement("li");p.style.visibility="hidden",p.style.position="absolute",p.textContent="00:00 Example",i.appendChild(p),l=p.offsetHeight,i.removeChild(p)}Tt(r.offsetHeight+u.offsetHeight+l),t.style.minHeight=Bt()+"px"}},0),Ce){try{Ce.disconnect()}catch{}Ce=null}Ce=new ResizeObserver(yo),Ce.observe(t),fn||document.addEventListener("pointerdown",fn=()=>{nr=Date.now()},!0),hn||document.addEventListener("pointerup",hn=()=>{},!0)}finally{Zo=!1}}}async function oc(){if(!t)return;if(document.querySelectorAll("#ytls-pane").forEach(a=>{a!==t&&(m("Removing duplicate pane element from DOM"),a.remove())}),document.body.contains(t)){m("Pane already in DOM, skipping append");return}await tc(),Ja(O);let s=document.querySelectorAll("#ytls-pane");if(s.length>0&&(m(`WARNING: Found ${s.length} existing pane(s) in DOM, removing all`),s.forEach(a=>a.remove())),document.body.contains(t)){m("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(t),m("Pane successfully appended to DOM"),Wi(),J&&(clearTimeout(J),J=null),J=setTimeout(()=>{zn(),ne?.(),$o(),dn(!0),J=null},450),Ie){try{Ie.disconnect()}catch{}Ie=null}Ie=new MutationObserver(()=>{let a=document.querySelectorAll("#ytls-pane");a.length>1&&(m(`CRITICAL: Multiple panes detected (${a.length}), removing duplicates`),a.forEach((h,g)=>{(g>0||t&&h!==t)&&h.remove()}))}),Ie.observe(document.body,{childList:!0})}function Sr(o=0){if(document.getElementById("ytls-header-button")){$e();return}let s=document.querySelector("#logo");if(!s||!s.parentElement){o<10&&setTimeout(()=>Sr(o+1),300);return}let a=document.createElement("button");a.id="ytls-header-button",a.type="button",a.className="ytls-header-button",ce(a,"Toggle Timekeeper UI"),a.setAttribute("aria-label","Toggle Timekeeper UI");let h=document.createElement("img");h.src=vl(),h.alt="",h.decoding="async",a.appendChild(h),rt=h,a.addEventListener("mouseenter",()=>{rt&&(Gn=!0,rt.src=Zd())}),a.addEventListener("mouseleave",()=>{rt&&(Gn=!1,$e())}),a.addEventListener("click",()=>{t&&!document.body.contains(t)&&(m("Pane not in DOM, re-appending before toggle"),document.body.appendChild(t)),ai()}),s.insertAdjacentElement("afterend",a),$e(),m("Timekeeper header button added next to YouTube logo")}function Er(){if(Go())return;qo(!0);let o=history.pushState,s=history.replaceState;function a(){try{let h=new Event("locationchange");window.dispatchEvent(h)}catch{}}history.pushState=function(){let h=o.apply(this,arguments);return a(),h},history.replaceState=function(){let h=s.apply(this,arguments);return a(),h},window.addEventListener("popstate",a),window.addEventListener("locationchange",()=>{window.location.href!==Ht&&m("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function li(){if(!n()){ql();return}Un(window.location.href);let o=++ot;if(document.querySelectorAll("#ytls-pane").forEach((a,h)=>{(h>0||t&&a!==t)&&a.remove()}),await El(),await nc(),o!==ot)return;Ut={phase:"loading",videoId:Sn()},x?.videoId!==Z()&&kr(null);let s=document.title;if(m("Page Title:",s),m("Video ID:",Z()),m("Current URL:",window.location.href),ni(!0),bn(),re(),await ri(),o===ot&&(re(),ni(!1),m("Timestamps loaded and UI unlocked for video:",Z()),await oc(),o===ot)){try{Re(!0)}catch{}Sr(),$l()}}Er(),window.addEventListener("yt-navigate-start",()=>{m("Navigation started (yt-navigate-start event fired)"),ro(),n()&&t&&i&&(m("Locking UI and showing loading state for navigation"),ni(!0))}),pn=o=>{if(!o.repeat&&!o.ctrlKey&&!o.altKey&&!o.metaKey&&!o.shiftKey&&(o.key==="z"||o.key==="Z")){if(Il(o.target))return;Xi()&&(o.preventDefault(),m("Playback speed toggled via keyboard shortcut (Z)"));return}o.ctrlKey&&o.altKey&&o.shiftKey&&(o.key==="T"||o.key==="t")&&(o.preventDefault(),ai(),m("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",pn),window.addEventListener("pagehide",ro),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&ro()});function kr(o){let s=typeof unsafeWindow<"u"?unsafeWindow:window,a=Sa(o?.response??s.ytInitialData,o?.playerResponse??s.ytInitialPlayerResponse);x=a,Lr(),a&&cl(a)}function Lr(){if(!T)return;let o=null;try{o=Sn()}catch{}let s=!!x?.membersOnly&&x.videoId===o;T.style.display=s?"inline-flex":"none"}window.addEventListener("yt-navigate-finish",o=>{m("Navigation finished (yt-navigate-finish event fired)"),kr(o.detail?.response),window.location.href!==Ht?li():m("Navigation finished but URL already handled, skipping.")});function ic(o){let s=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(o);if(s&&(s[1]||s[2]||s[3]))return Number(s[1]||0)*3600+Number(s[2]||0)*60+Number(s[3]||0);let a=Number(o);return Number.isFinite(a)?a:null}document.addEventListener("click",o=>{if(o.button!==0||o.ctrlKey||o.metaKey||o.shiftKey||o.altKey)return;let s=o.target?.closest?.("ytd-comments a[href]");if(!s)return;let a=new URL(s.href,location.href),h=a.searchParams.get("t");if(a.pathname!=="/watch"||!h||a.searchParams.get("v")!==Sn())return;let g=ic(h),w=G();g===null||!w||(o.preventDefault(),o.stopImmediatePropagation(),w.seekTo(g))},!0),Ga(o=>{for(let s of o)Et({type:"timestamps_updated",videoId:s,action:"synced"});Z()&&o.includes(Z())&&ri()}),yl(),Er(),m("Timekeeper initialized and waiting for navigation events")})();})();

