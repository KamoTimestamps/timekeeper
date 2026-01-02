// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.4.8
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

(()=>{function u(e,...t){let r="debug",a=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(r=a.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[r](`${n} ${e}`,...a)}function bt(e,t=e){let r=Math.floor(e/3600),a=Math.floor(e%3600/60),l=String(e%60).padStart(2,"0");return t<3600?`${a<10?a:String(a).padStart(2,"0")}:${l}`:`${t>=36e3?String(r).padStart(2,"0"):r}:${String(a).padStart(2,"0")}:${l}`}function yo(e,t=window.location.href){try{let r=new URL(t);return r.searchParams.set("t",`${e}s`),r.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Wn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var Mr=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function ri(){let e=new Date,t=e.getFullYear(),r=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let a of Mr){let l=new Date(t,a.month-1,a.day),n=l.getTime()-e.getTime(),f=n/(1e3*60*60*24);if(f<=5&&f>=-2)return u(`Current date: ${r}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(f)}`),a.emoji;if(f<-2&&(l=new Date(t+1,a.month-1,a.day),n=l.getTime()-e.getTime(),f=n/(1e3*60*60*24),f<=5&&f>=-2))return u(`Current date: ${r}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(f)}`),a.emoji;if(f>5&&(l=new Date(t-1,a.month-1,a.day),n=l.getTime()-e.getTime(),f=n/(1e3*60*60*24),f<=5&&f>=-2))return u(`Current date: ${r}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(f)}`),a.emoji}return u(`Current date: ${r}, No holiday emoji (not within range)`),null}var wt=null,Gt=null,Dr=500;function Cr(){return(!wt||!document.body.contains(wt))&&(wt=document.createElement("div"),wt.className="ytls-tooltip",document.body.appendChild(wt)),wt}function Ar(e,t,r){let l=window.innerWidth,n=window.innerHeight,f=e.getBoundingClientRect(),s=f.width,w=f.height,T=t+10,E=r+10;T+s>l-10&&(T=t-s-10),E+w>n-10&&(E=r-w-10),T=Math.max(10,Math.min(T,l-s-10)),E=Math.max(10,Math.min(E,n-w-10)),e.style.left=`${T}px`,e.style.top=`${E}px`}function Br(e,t,r){Gt&&clearTimeout(Gt),Gt=setTimeout(()=>{let a=Cr();typeof e=="string"?a.innerHTML=e:(a.innerHTML="",a.appendChild(e.cloneNode(!0))),a.classList.remove("ytls-tooltip-visible"),Ar(a,t,r),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})},Dr)}function Pr(){Gt&&(clearTimeout(Gt),Gt=null),wt&&wt.classList.remove("ytls-tooltip-visible")}function _e(e,t){let r=0,a=0,l=s=>{r=s.clientX,a=s.clientY;let w=typeof t=="function"?t():t;w&&Br(w,r,a)},n=s=>{r=s.clientX,a=s.clientY},f=()=>{Pr()};e.addEventListener("mouseenter",l),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",f),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",l),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",f)}}var zr=(e,t)=>t.some(r=>e instanceof r),ai,si;function Fr(){return ai||(ai=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Or(){return si||(si=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var li=new WeakMap,bo=new WeakMap,ci=new WeakMap,vo=new WeakMap,xo=new WeakMap;function Rr(e){let t=new Promise((r,a)=>{let l=()=>{e.removeEventListener("success",n),e.removeEventListener("error",f)},n=()=>{r(at(e.result)),l()},f=()=>{a(e.error),l()};e.addEventListener("success",n),e.addEventListener("error",f)});return t.then(r=>{r instanceof IDBCursor&&li.set(r,e)}).catch(()=>{}),xo.set(t,e),t}function Hr(e){if(bo.has(e))return;let t=new Promise((r,a)=>{let l=()=>{e.removeEventListener("complete",n),e.removeEventListener("error",f),e.removeEventListener("abort",f)},n=()=>{r(),l()},f=()=>{a(e.error||new DOMException("AbortError","AbortError")),l()};e.addEventListener("complete",n),e.addEventListener("error",f),e.addEventListener("abort",f)});bo.set(e,t)}var wo={get(e,t,r){if(e instanceof IDBTransaction){if(t==="done")return bo.get(e);if(t==="objectStoreNames")return e.objectStoreNames||ci.get(e);if(t==="store")return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return at(e[t])},set(e,t,r){return e[t]=r,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function ui(e){wo=e(wo)}function $r(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...r){let a=e.call(Kn(this),t,...r);return ci.set(a,t.sort?t.sort():[t]),at(a)}:Or().includes(e)?function(...t){return e.apply(Kn(this),t),at(li.get(this))}:function(...t){return at(e.apply(Kn(this),t))}}function _r(e){return typeof e=="function"?$r(e):(e instanceof IDBTransaction&&Hr(e),zr(e,Fr())?new Proxy(e,wo):e)}function at(e){if(e instanceof IDBRequest)return Rr(e);if(vo.has(e))return vo.get(e);let t=_r(e);return t!==e&&(vo.set(e,t),xo.set(t,e)),t}var Kn=e=>xo.get(e);function mi(e,t,{blocked:r,upgrade:a,blocking:l,terminated:n}={}){let f=indexedDB.open(e,t),s=at(f);return a&&f.addEventListener("upgradeneeded",w=>{a(at(f.result),w.oldVersion,w.newVersion,at(f.transaction),w)}),r&&f.addEventListener("blocked",w=>r(w.oldVersion,w.newVersion,w)),s.then(w=>{n&&w.addEventListener("close",()=>n()),l&&w.addEventListener("versionchange",T=>l(T.oldVersion,T.newVersion,T))}).catch(()=>{}),s}var Nr=["get","getKey","getAll","getAllKeys","count"],Gr=["put","add","delete","clear"],To=new Map;function di(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(To.get(t))return To.get(t);let r=t.replace(/FromIndex$/,""),a=t!==r,l=Gr.includes(r);if(!(r in(a?IDBIndex:IDBObjectStore).prototype)||!(l||Nr.includes(r)))return;let n=async function(f,...s){let w=this.transaction(f,l?"readwrite":"readonly"),T=w.store;return a&&(T=T.index(s.shift())),(await Promise.all([T[r](...s),l&&w.done]))[0]};return To.set(t,n),n}ui(e=>({...e,get:(t,r,a)=>di(t,r)||e.get(t,r,a),has:(t,r)=>!!di(t,r)||e.has(t,r)}));var fi="ytls-timestamps-db",Ur=7,Yn=null;function Ne(){return Yn||(Yn=mi(fi,Ur,{upgrade(e,t,r,a){if(t<1&&e.createObjectStore("timestamps",{keyPath:"video_id"}),t<2&&!e.objectStoreNames.contains("settings")&&e.createObjectStore("settings",{keyPath:"key"}),t<3){if(!e.objectStoreNames.contains("timestamps_v2")){let l=e.createObjectStore("timestamps_v2",{keyPath:"guid"});l.createIndex("video_id","video_id",{unique:!1}),l.createIndex("video_start",["video_id","start"],{unique:!1})}if(e.objectStoreNames.contains("timestamps")){try{let n=a.objectStore("timestamps").getAll();n.onsuccess=()=>{let f=n.result;if(f.length>0){let s=a.objectStore("timestamps_v2");f.forEach(w=>{Array.isArray(w.timestamps)&&w.timestamps.length>0&&w.timestamps.forEach(T=>{try{s.put({guid:T.guid||crypto.randomUUID(),video_id:w.video_id,start:T.start,comment:T.comment})}catch{}})})}}}catch{}try{e.deleteObjectStore("timestamps")}catch{}}}if(t<4&&!e.objectStoreNames.contains("video_metadata")){let l=e.createObjectStore("video_metadata",{keyPath:"video_id"});try{l.createIndex("published_at","published_at",{unique:!1})}catch{}try{l.createIndex("members","members",{unique:!1})}catch{}}}})),Yn}async function pi(e){return(await Ne()).getAll(e)}async function Zn(e,t){return(await Ne()).get(e,t)}async function hi(e,t){await(await Ne()).put(e,t)}async function gi(e){await(await Ne()).clear(e)}async function yi(e,t,r){let l=(await Ne()).transaction(e,t),n={};Array.isArray(e)?e.forEach(s=>{n[s]=l.objectStore(s)}):n[e]=l.objectStore(e);let f=await Promise.resolve(r(l,n));return await l.done,f}async function vi(e){let t=await Ne();if(t.objectStoreNames.contains(e))return;let r=t.version;t.close(),await new Promise((a,l)=>{let n=indexedDB.open(fi,r+1);n.onupgradeneeded=()=>{let f=n.result;if(!f.objectStoreNames.contains(e)){let s=f.createObjectStore(e,{keyPath:"video_id"});if(e==="video_metadata"){try{s.createIndex("published_at","published_at",{unique:!1})}catch{}try{s.createIndex("members","members",{unique:!1})}catch{}}}},n.onsuccess=()=>{try{n.result.close()}catch{}a()},n.onerror=()=>l(n.error??new Error("Failed to ensure object store"))}),Yn=null}function wi(e){let t=[],r=/("(?:[^"]|"")*"|[^,]*)(,|$)/g,a;for(;(a=r.exec(e))!==null;){let l=a[1]??"";if(l.startsWith('"')&&l.endsWith('"')&&(l=l.slice(1,-1).replace(/""/g,'"')),t.push(l),a[0].length===0)break}return t}function jr(e){let t=e.split(/\r?\n/).filter(l=>l.trim().length>0);if(t.length===0)return[];let r=wi(t[0]).map(l=>l.trim()),a=[];for(let l=1;l<t.length;l++){let n=t[l],f=wi(n),s={};for(let w=0;w<r.length;w++)s[r[w]]=f[w]??"";a.push(s)}return a}async function Vr(e,t){let r=e.map(a=>({video_id:(a.video_id??a.videoId??"").trim(),title:(a.title??"").trim(),published_at:(a.published_at??a.publishedAt??"").trim(),thumbnail_url:(a.thumbnail_url??a.thumbnailUrl??"").trim(),members:String((a.members??"").trim()).toLowerCase()==="true"}));await gi(t.VIDEO_METADATA_STORE),r.length>0&&await yi(t.VIDEO_METADATA_STORE,"readwrite",async(a,l)=>{let n=l[t.VIDEO_METADATA_STORE];for(let f of r)f.video_id&&await n.put(f)}),t.log(`IndexedDB: updated ${r.length} video metadata records`);try{window.dispatchEvent(new CustomEvent("video_metadata_updated",{detail:{count:r.length}}))}catch{}}var Jn=new Map;async function xi(e){if(!e)return null;if(Jn.has(e))return Jn.get(e);try{let t=await Zn("video_metadata",e);return t&&Jn.set(e,t),t??null}catch{return null}}function Ti(){Jn.clear()}async function qr(e){let t="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/metadata/videos.csv",r;try{let n=await e.loadGlobalSettings(e.VIDEOS_CSV_ETAG_KEY);typeof n=="string"&&(r=n)}catch(n){e.log("Failed to load stored videos CSV etag:",n,"warn")}let a=n=>{let f={};return n&&(f["If-None-Match"]=n),f.Accept="text/plain",f},l;try{l=await fetch(t,{headers:a(r),cache:"no-store"})}catch(n){e.log("Failed to fetch videos.csv:",n,"warn");return}if(l.status===304){e.log("videos.csv not modified (304)");return}if(l.status===200){let n=l.headers.get("etag"),f=await l.text(),s=async()=>{try{let w=jr(f);if(await Vr(w,e),n)try{await e.saveGlobalSettings(e.VIDEOS_CSV_ETAG_KEY,n),e.log("Saved videos.csv ETag to IndexedDB")}catch(T){e.log("Failed to save videos CSV etag:",T,"warn")}}catch(w){e.log("Failed to parse or store videos.csv contents:",w,"error")}};if(typeof window.requestIdleCallback=="function")try{window.requestIdleCallback(()=>{s()},{timeout:2e3})}catch{setTimeout(()=>{s()},0)}else setTimeout(()=>{s()},0)}else l.status===404?e.log("videos.csv not found at remote URL (404)","warn"):e.log(`Unexpected response fetching videos.csv: ${l.status} ${l.statusText}`,"warn")}async function Ei(e){try{await qr(e)}catch(t){e.log("Failed to initialize video metadata:",t,"warn")}}var Si=`
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
    width: 20px;
    height: 20px;
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

  /* Video tooltip content (thumbnail + title) */
  .ytls-video-tooltip {
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 320px;
  }
  .ytls-video-thumb {
    width: 120px;
    height: 68px;
    object-fit: cover;
    border-radius: 3px;
    flex-shrink: 0;
    display: block;
  }

`;var xe=Uint8Array,Ge=Uint16Array,Mo=Int32Array,Do=new xe([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Co=new xe([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ki=new xe([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ai=function(e,t){for(var r=new Ge(31),a=0;a<31;++a)r[a]=t+=1<<e[a-1];for(var l=new Mo(r[30]),a=1;a<30;++a)for(var n=r[a];n<r[a+1];++n)l[n]=n-r[a]<<5|a;return{b:r,r:l}},Bi=Ai(Do,2),Wr=Bi.b,So=Bi.r;Wr[28]=258,So[258]=28;var Pi=Ai(Co,0),za=Pi.b,Li=Pi.r,ko=new Ge(32768);for(U=0;U<32768;++U)ft=(U&43690)>>1|(U&21845)<<1,ft=(ft&52428)>>2|(ft&13107)<<2,ft=(ft&61680)>>4|(ft&3855)<<4,ko[U]=((ft&65280)>>8|(ft&255)<<8)>>1;var ft,U,pn=(function(e,t,r){for(var a=e.length,l=0,n=new Ge(t);l<a;++l)e[l]&&++n[e[l]-1];var f=new Ge(t);for(l=1;l<t;++l)f[l]=f[l-1]+n[l-1]<<1;var s;if(r){s=new Ge(1<<t);var w=15-t;for(l=0;l<a;++l)if(e[l])for(var T=l<<4|e[l],E=t-e[l],C=f[e[l]-1]++<<E,M=C|(1<<E)-1;C<=M;++C)s[ko[C]>>w]=T}else for(s=new Ge(a),l=0;l<a;++l)e[l]&&(s[l]=ko[f[e[l]-1]++]>>15-e[l]);return s}),At=new xe(288);for(U=0;U<144;++U)At[U]=8;var U;for(U=144;U<256;++U)At[U]=9;var U;for(U=256;U<280;++U)At[U]=7;var U;for(U=280;U<288;++U)At[U]=8;var U,Xn=new xe(32);for(U=0;U<32;++U)Xn[U]=5;var U,Kr=pn(At,9,0);var Yr=pn(Xn,5,0);var zi=function(e){return(e+7)/8|0},Fi=function(e,t,r){return(t==null||t<0)&&(t=0),(r==null||r>e.length)&&(r=e.length),new xe(e.subarray(t,r))};var Zr=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],eo=function(e,t,r){var a=new Error(t||Zr[e]);if(a.code=e,Error.captureStackTrace&&Error.captureStackTrace(a,eo),!r)throw a;return a};var pt=function(e,t,r){r<<=t&7;var a=t/8|0;e[a]|=r,e[a+1]|=r>>8},mn=function(e,t,r){r<<=t&7;var a=t/8|0;e[a]|=r,e[a+1]|=r>>8,e[a+2]|=r>>16},Eo=function(e,t){for(var r=[],a=0;a<e.length;++a)e[a]&&r.push({s:a,f:e[a]});var l=r.length,n=r.slice();if(!l)return{t:Ri,l:0};if(l==1){var f=new xe(r[0].s+1);return f[r[0].s]=1,{t:f,l:1}}r.sort(function(he,Se){return he.f-Se.f}),r.push({s:-1,f:25001});var s=r[0],w=r[1],T=0,E=1,C=2;for(r[0]={s:-1,f:s.f+w.f,l:s,r:w};E!=l-1;)s=r[r[T].f<r[C].f?T++:C++],w=r[T!=E&&r[T].f<r[C].f?T++:C++],r[E++]={s:-1,f:s.f+w.f,l:s,r:w};for(var M=n[0].s,a=1;a<l;++a)n[a].s>M&&(M=n[a].s);var O=new Ge(M+1),Z=Lo(r[E-1],O,0);if(Z>t){var a=0,W=0,X=Z-t,te=1<<X;for(n.sort(function(Se,oe){return O[oe.s]-O[Se.s]||Se.f-oe.f});a<l;++a){var N=n[a].s;if(O[N]>t)W+=te-(1<<Z-O[N]),O[N]=t;else break}for(W>>=X;W>0;){var ce=n[a].s;O[ce]<t?W-=1<<t-O[ce]++-1:++a}for(;a>=0&&W;--a){var J=n[a].s;O[J]==t&&(--O[J],++W)}Z=t}return{t:new xe(O),l:Z}},Lo=function(e,t,r){return e.s==-1?Math.max(Lo(e.l,t,r+1),Lo(e.r,t,r+1)):t[e.s]=r},Ii=function(e){for(var t=e.length;t&&!e[--t];);for(var r=new Ge(++t),a=0,l=e[0],n=1,f=function(w){r[a++]=w},s=1;s<=t;++s)if(e[s]==l&&s!=t)++n;else{if(!l&&n>2){for(;n>138;n-=138)f(32754);n>2&&(f(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(f(l),--n;n>6;n-=6)f(8304);n>2&&(f(n-3<<5|8208),n=0)}for(;n--;)f(l);n=1,l=e[s]}return{c:r.subarray(0,a),n:t}},fn=function(e,t){for(var r=0,a=0;a<t.length;++a)r+=e[a]*t[a];return r},Oi=function(e,t,r){var a=r.length,l=zi(t+2);e[l]=a&255,e[l+1]=a>>8,e[l+2]=e[l]^255,e[l+3]=e[l+1]^255;for(var n=0;n<a;++n)e[l+n+4]=r[n];return(l+4+a)*8},Mi=function(e,t,r,a,l,n,f,s,w,T,E){pt(t,E++,r),++l[256];for(var C=Eo(l,15),M=C.t,O=C.l,Z=Eo(n,15),W=Z.t,X=Z.l,te=Ii(M),N=te.c,ce=te.n,J=Ii(W),he=J.c,Se=J.n,oe=new Ge(19),G=0;G<N.length;++G)++oe[N[G]&31];for(var G=0;G<he.length;++G)++oe[he[G]&31];for(var R=Eo(oe,7),re=R.t,ue=R.l,ae=19;ae>4&&!re[ki[ae-1]];--ae);var ze=T+5<<3,Te=fn(l,At)+fn(n,Xn)+f,Me=fn(l,M)+fn(n,W)+f+14+3*ae+fn(oe,re)+2*oe[16]+3*oe[17]+7*oe[18];if(w>=0&&ze<=Te&&ze<=Me)return Oi(t,E,e.subarray(w,w+T));var Ve,de,De,ot;if(pt(t,E,1+(Me<Te)),E+=2,Me<Te){Ve=pn(M,O,0),de=M,De=pn(W,X,0),ot=W;var Kt=pn(re,ue,0);pt(t,E,ce-257),pt(t,E+5,Se-1),pt(t,E+10,ae-4),E+=14;for(var G=0;G<ae;++G)pt(t,E+3*G,re[ki[G]]);E+=3*ae;for(var Fe=[N,he],Oe=0;Oe<2;++Oe)for(var Ce=Fe[Oe],G=0;G<Ce.length;++G){var j=Ce[G]&31;pt(t,E,Kt[j]),E+=re[j],j>15&&(pt(t,E,Ce[G]>>5&127),E+=Ce[G]>>12)}}else Ve=Kr,de=At,De=Yr,ot=Xn;for(var G=0;G<s;++G){var se=a[G];if(se>255){var j=se>>18&31;mn(t,E,Ve[j+257]),E+=de[j+257],j>7&&(pt(t,E,se>>23&31),E+=Do[j]);var ht=se&31;mn(t,E,De[ht]),E+=ot[ht],ht>3&&(mn(t,E,se>>5&8191),E+=Co[ht])}else mn(t,E,Ve[se]),E+=de[se]}return mn(t,E,Ve[256]),E+de[256]},Jr=new Mo([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Ri=new xe(0),Xr=function(e,t,r,a,l,n){var f=n.z||e.length,s=new xe(a+f+5*(1+Math.ceil(f/7e3))+l),w=s.subarray(a,s.length-l),T=n.l,E=(n.r||0)&7;if(t){E&&(w[0]=n.r>>3);for(var C=Jr[t-1],M=C>>13,O=C&8191,Z=(1<<r)-1,W=n.p||new Ge(32768),X=n.h||new Ge(Z+1),te=Math.ceil(r/3),N=2*te,ce=function(it){return(e[it]^e[it+1]<<te^e[it+2]<<N)&Z},J=new Mo(25e3),he=new Ge(288),Se=new Ge(32),oe=0,G=0,R=n.i||0,re=0,ue=n.w||0,ae=0;R+2<f;++R){var ze=ce(R),Te=R&32767,Me=X[ze];if(W[Te]=Me,X[ze]=Te,ue<=R){var Ve=f-R;if((oe>7e3||re>24576)&&(Ve>423||!T)){E=Mi(e,w,0,J,he,Se,G,re,ae,R-ae,E),re=oe=G=0,ae=R;for(var de=0;de<286;++de)he[de]=0;for(var de=0;de<30;++de)Se[de]=0}var De=2,ot=0,Kt=O,Fe=Te-Me&32767;if(Ve>2&&ze==ce(R-Fe))for(var Oe=Math.min(M,Ve)-1,Ce=Math.min(32767,R),j=Math.min(258,Ve);Fe<=Ce&&--Kt&&Te!=Me;){if(e[R+De]==e[R+De-Fe]){for(var se=0;se<j&&e[R+se]==e[R+se-Fe];++se);if(se>De){if(De=se,ot=Fe,se>Oe)break;for(var ht=Math.min(Fe,se-2),bn=0,de=0;de<ht;++de){var Bt=R-Fe+de&32767,ao=W[Bt],Yt=Bt-ao&32767;Yt>bn&&(bn=Yt,Me=Bt)}}}Te=Me,Me=W[Te],Fe+=Te-Me&32767}if(ot){J[re++]=268435456|So[De]<<18|Li[ot];var wn=So[De]&31,Pt=Li[ot]&31;G+=Do[wn]+Co[Pt],++he[257+wn],++Se[Pt],ue=R+De,++oe}else J[re++]=e[R],++he[e[R]]}}for(R=Math.max(R,ue);R<f;++R)J[re++]=e[R],++he[e[R]];E=Mi(e,w,T,J,he,Se,G,re,ae,R-ae,E),T||(n.r=E&7|w[E/8|0]<<3,E-=7,n.h=X,n.p=W,n.i=R,n.w=ue)}else{for(var R=n.w||0;R<f+T;R+=65535){var xt=R+65535;xt>=f&&(w[E/8|0]=T,xt=f),E=Oi(w,E+1,e.subarray(R,xt))}n.i=f}return Fi(s,0,a+zi(E)+l)},Qr=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var r=t,a=9;--a;)r=(r&1&&-306674912)^r>>>1;e[t]=r}return e})(),ea=function(){var e=-1;return{p:function(t){for(var r=e,a=0;a<t.length;++a)r=Qr[r&255^t[a]]^r>>>8;e=r},d:function(){return~e}}};var ta=function(e,t,r,a,l){if(!l&&(l={l:1},t.dictionary)){var n=t.dictionary.subarray(-32768),f=new xe(n.length+e.length);f.set(n),f.set(e,n.length),e=f,l.w=n.length}return Xr(e,t.level==null?6:t.level,t.mem==null?l.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,r,a,l)},Hi=function(e,t){var r={};for(var a in e)r[a]=e[a];for(var a in t)r[a]=t[a];return r};var we=function(e,t,r){for(;r;++t)e[t]=r,r>>>=8};function na(e,t){return ta(e,t||{},0,0)}var $i=function(e,t,r,a){for(var l in e){var n=e[l],f=t+l,s=a;Array.isArray(n)&&(s=Hi(a,n[1]),n=n[0]),n instanceof xe?r[f]=[n,s]:(r[f+="/"]=[new xe(0),s],$i(n,f,r,a))}},Di=typeof TextEncoder<"u"&&new TextEncoder,oa=typeof TextDecoder<"u"&&new TextDecoder,ia=0;try{oa.decode(Ri,{stream:!0}),ia=1}catch{}function Qn(e,t){if(t){for(var r=new xe(e.length),a=0;a<e.length;++a)r[a]=e.charCodeAt(a);return r}if(Di)return Di.encode(e);for(var l=e.length,n=new xe(e.length+(e.length>>1)),f=0,s=function(E){n[f++]=E},a=0;a<l;++a){if(f+5>n.length){var w=new xe(f+8+(l-a<<1));w.set(n),n=w}var T=e.charCodeAt(a);T<128||t?s(T):T<2048?(s(192|T>>6),s(128|T&63)):T>55295&&T<57344?(T=65536+(T&1047552)|e.charCodeAt(++a)&1023,s(240|T>>18),s(128|T>>12&63),s(128|T>>6&63),s(128|T&63)):(s(224|T>>12),s(128|T>>6&63),s(128|T&63))}return Fi(n,0,f)}var Io=function(e){var t=0;if(e)for(var r in e){var a=e[r].length;a>65535&&eo(9),t+=a+4}return t},Ci=function(e,t,r,a,l,n,f,s){var w=a.length,T=r.extra,E=s&&s.length,C=Io(T);we(e,t,f!=null?33639248:67324752),t+=4,f!=null&&(e[t++]=20,e[t++]=r.os),e[t]=20,t+=2,e[t++]=r.flag<<1|(n<0&&8),e[t++]=l&&8,e[t++]=r.compression&255,e[t++]=r.compression>>8;var M=new Date(r.mtime==null?Date.now():r.mtime),O=M.getFullYear()-1980;if((O<0||O>119)&&eo(10),we(e,t,O<<25|M.getMonth()+1<<21|M.getDate()<<16|M.getHours()<<11|M.getMinutes()<<5|M.getSeconds()>>1),t+=4,n!=-1&&(we(e,t,r.crc),we(e,t+4,n<0?-n-2:n),we(e,t+8,r.size)),we(e,t+12,w),we(e,t+14,C),t+=16,f!=null&&(we(e,t,E),we(e,t+6,r.attrs),we(e,t+10,f),t+=14),e.set(a,t),t+=w,C)for(var Z in T){var W=T[Z],X=W.length;we(e,t,+Z),we(e,t+2,X),e.set(W,t+4),t+=4+X}return E&&(e.set(s,t),t+=E),t},ra=function(e,t,r,a,l){we(e,t,101010256),we(e,t+8,r),we(e,t+10,r),we(e,t+12,a),we(e,t+16,l)};function _i(e,t){t||(t={});var r={},a=[];$i(e,"",r,t);var l=0,n=0;for(var f in r){var s=r[f],w=s[0],T=s[1],E=T.level==0?0:8,C=Qn(f),M=C.length,O=T.comment,Z=O&&Qn(O),W=Z&&Z.length,X=Io(T.extra);M>65535&&eo(11);var te=E?na(w,T):w,N=te.length,ce=ea();ce.p(w),a.push(Hi(T,{size:w.length,crc:ce.d(),c:te,f:C,m:Z,u:M!=f.length||Z&&O.length!=W,o:l,compression:E})),l+=30+M+X+N,n+=76+2*(M+X)+(W||0)+N}for(var J=new xe(n+22),he=l,Se=n-l,oe=0;oe<a.length;++oe){var C=a[oe];Ci(J,C.o,C,C.f,C.u,C.c.length);var G=30+C.f.length+Io(C.extra);J.set(C.c,C.o+G),Ci(J,l,C,C.f,C.u,C.c.length,C.o,C.m),l+=16+G+(C.m?C.m.length:0)}return ra(J,l,a.length,Se,he),J}var H={isSignedIn:!1,accessToken:null,userName:null,email:null},nt=!0,je=30,Ye=null,jt=!1,Ut=0,Ke=null,Ao=null,be=null,V=null,to=null;function ji(e){Ao=e}function Vi(e){be=e}function qi(e){V=e}function Bo(e){to=e}var Ni=!1;function Wi(){if(!Ni)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),Ni=!0}catch{}}var Ki=null,hn=null,gn=null;function Po(e){Ki=e}function oo(e){hn=e}function io(e){gn=e}var Gi="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",aa="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",sa="https://www.youtube.com/",la=30*1e3,ca=1800*1e3,Ui=5,no=null,Ue=null;async function zo(){try{let e=await gn("googleAuthState");e&&typeof e=="object"&&(H={...H,...e},vn(),H.isSignedIn&&H.accessToken&&await Wt(!0))}catch(e){u("Failed to load Google auth state:",e,"error")}}async function ro(){try{await hn("googleAuthState",H)}catch(e){u("Failed to save Google auth state:",e,"error")}}function vn(){Ao&&(Ao.style.display="none")}function Pe(e,t){if(V){if(V.style.fontWeight="bold",e==="authenticating"){for(Wi(),V.style.color="#ffa500";V.firstChild;)V.removeChild(V.firstChild);let r=document.createElement("span");r.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);V.appendChild(r),V.appendChild(a);return}if(e==="error"){V.textContent=`\u274C ${t||"Authorization failed"}`,V.style.color="#ff4d4f",qt();return}H.isSignedIn?(V.textContent="\u2705 Signed in",V.style.color="#52c41a",V.removeAttribute("title"),H.userName?(V.onmouseenter=()=>{V.textContent=`\u2705 Signed in as ${H.userName}`},V.onmouseleave=()=>{V.textContent="\u2705 Signed in"}):(V.onmouseenter=null,V.onmouseleave=null)):(V.textContent="\u274C Not signed in",V.style.color="#ff4d4f",V.removeAttribute("title"),V.onmouseenter=null,V.onmouseleave=null),qt()}}function ua(){V&&(Wi(),V.classList.remove("tk-auth-blink"),V.offsetWidth,V.classList.add("tk-auth-blink"),setTimeout(()=>{V.classList.remove("tk-auth-blink")},1200))}function da(e){return new Promise((t,r)=>{if(!e){u&&u("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}u&&u("OAuth monitor: starting to monitor popup for token");let a=Date.now(),l=300*1e3,n="timekeeper_oauth",f=null,s=null,w=null,T=()=>{if(f){try{f.close()}catch{}f=null}s&&(clearInterval(s),s=null),w&&(clearInterval(w),w=null)};try{f=new BroadcastChannel(n),u&&u("OAuth monitor: BroadcastChannel created successfully"),f.onmessage=M=>{if(u&&u("OAuth monitor: received BroadcastChannel message",M.data),M.data?.type==="timekeeper_oauth_token"&&M.data?.token){u&&u("OAuth monitor: token received via BroadcastChannel"),T();try{e.close()}catch{}t(M.data.token)}else if(M.data?.type==="timekeeper_oauth_error"){u&&u("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),T();try{e.close()}catch{}r(new Error(M.data.error||"OAuth failed"))}}}catch(M){u&&u("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",M)}u&&u("OAuth monitor: setting up IndexedDB polling");let E=Date.now();s=setInterval(async()=>{try{let M=indexedDB.open("ytls-timestamps-db",3);M.onsuccess=()=>{let O=M.result,X=O.transaction("settings","readonly").objectStore("settings").get("oauth_message");X.onsuccess=()=>{let te=X.result;if(te&&te.value){let N=te.value;if(N.timestamp&&N.timestamp>E){if(u&&u("OAuth monitor: received IndexedDB message",N),N.type==="timekeeper_oauth_token"&&N.token){u&&u("OAuth monitor: token received via IndexedDB"),T();try{e.close()}catch{}O.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),t(N.token)}else if(N.type==="timekeeper_oauth_error"){u&&u("OAuth monitor: error received via IndexedDB",N.error,"error"),T();try{e.close()}catch{}O.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(N.error||"OAuth failed"))}E=N.timestamp}}O.close()}}}catch(M){u&&u("OAuth monitor: IndexedDB polling error",M,"error")}},500),w=setInterval(()=>{if(Date.now()-a>l){u&&u("OAuth monitor: popup timed out after 5 minutes",null,"error"),T();try{e.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function Yi(){if(!Gi){Pe("error","Google Client ID not configured");return}try{u&&u("OAuth signin: starting OAuth flow"),Pe("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",Gi),e.searchParams.set("redirect_uri",sa),e.searchParams.set("response_type","token"),e.searchParams.set("scope",aa),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),u&&u("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){u&&u("OAuth signin: popup blocked by browser",null,"error"),Pe("error","Popup blocked. Please enable popups for YouTube.");return}u&&u("OAuth signin: popup opened successfully"),Pe("authenticating","Waiting for authentication...");try{let r=await da(t),a=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${r}`}});if(a.ok){let l=await a.json();H.accessToken=r,H.isSignedIn=!0,H.userName=l.name,H.email=l.email,await ro(),vn(),Pe(),Ze(),await Wt(),u?u(`Successfully authenticated as ${l.name}`):console.log(`[Timekeeper] Successfully authenticated as ${l.name}`)}else throw new Error("Failed to fetch user info")}catch(r){let a=r instanceof Error?r.message:"Authentication failed";u?u("OAuth failed:",r,"error"):console.error("[Timekeeper] OAuth failed:",r),Pe("error",a);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";u?u("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Pe("error",`Failed to sign in: ${t}`)}}async function Zi(){if(!window.opener||window.opener===window)return!1;u&&u("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return u&&u("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,r=new URLSearchParams(t),a=r.get("state");if(u&&u("OAuth popup: hash params found, state="+a),a!=="timekeeper_auth")return u&&u("OAuth popup: not our OAuth flow (wrong state)"),!1;let l=r.get("error"),n=r.get("access_token"),f="timekeeper_oauth";if(l){try{let s=new BroadcastChannel(f);s.postMessage({type:"timekeeper_oauth_error",error:r.get("error_description")||l}),s.close()}catch{let w={type:"timekeeper_oauth_error",error:r.get("error_description")||l,timestamp:Date.now()},T=indexedDB.open("ytls-timestamps-db",3);T.onsuccess=()=>{let E=T.result;E.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:w}),E.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){u&&u("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(f);s.postMessage({type:"timekeeper_oauth_token",token:n}),s.close(),u&&u("OAuth popup: token broadcast via BroadcastChannel")}catch(s){u&&u("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let w={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},T=indexedDB.open("ytls-timestamps-db",3);T.onsuccess=()=>{let E=T.result;E.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:w}),E.close()},u&&u("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Ji(){H={isSignedIn:!1,accessToken:null,userName:null,email:null},await ro(),vn(),Pe(),Ze()}async function Xi(){if(!H.isSignedIn||!H.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${H.accessToken}`}});return e.status===401?(await Qi({silent:!0}),!1):e.ok}catch(e){return u("Failed to verify auth state:",e,"error"),!1}}async function ma(e){let t={Authorization:`Bearer ${e}`},a=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,l=await fetch(a,{headers:t});if(l.status===401)throw new Error("unauthorized");if(!l.ok)throw new Error("drive search failed");let n=await l.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let f=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(f.status===401)throw new Error("unauthorized");if(!f.ok)throw new Error("drive folder create failed");return(await f.json()).id}async function fa(e,t,r){let a=`name='${e}' and '${t}' in parents and trashed=false`,l=encodeURIComponent(a),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${l}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${r}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let f=await n.json();return f.files&&f.files.length>0?f.files[0].id:null}function pa(e,t){let r=Qn(e),a=t.replace(/\\/g,"/").replace(/^\/+/,"");return a.endsWith(".json")||(a+=".json"),_i({[a]:[r,{level:6,mtime:new Date,os:0}]})}async function ha(e,t,r,a){let l=e.replace(/\.json$/,".zip"),n=await fa(l,r,a),f=new TextEncoder().encode(t).length,s=pa(t,e),w=s.length;u(`Compressing data: ${f} bytes -> ${w} bytes (${Math.round(100-w/f*100)}% reduction)`);let T="-------314159265358979",E=`\r
--${T}\r
`,C=`\r
--${T}--`,M=n?{name:l,mimeType:"application/zip"}:{name:l,mimeType:"application/zip",parents:[r]},O=8192,Z="";for(let J=0;J<s.length;J+=O){let he=s.subarray(J,Math.min(J+O,s.length));Z+=String.fromCharCode.apply(null,Array.from(he))}let W=btoa(Z),X=E+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(M)+E+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+W+C,te,N;n?(te=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,N="PATCH"):(te="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",N="POST");let ce=await fetch(te,{method:N,headers:{Authorization:`Bearer ${a}`,"Content-Type":`multipart/related; boundary=${T}`},body:X});if(ce.status===401)throw new Error("unauthorized");if(!ce.ok)throw new Error("drive upload failed")}async function Qi(e){u("Auth expired, clearing token",null,"warn"),H.isSignedIn=!1,H.accessToken=null,await ro(),Pe("error","Authorization expired. Please sign in again."),Ze()}async function ga(e){if(!H.isSignedIn||!H.accessToken){e?.silent||Pe("error","Please sign in to Google Drive first");return}try{let{json:t,filename:r,totalVideos:a,totalTimestamps:l}=await Ki();if(l===0){e?.silent||u("Skipping export: no timestamps to back up");return}let n=await ma(H.accessToken);await ha(r,t,n,H.accessToken),u(`Exported to Google Drive (${r}) with ${a} videos / ${l} timestamps.`)}catch(t){throw t.message==="unauthorized"?(await Qi({silent:e?.silent}),t):(u("Drive export failed:",t,"error"),e?.silent||Pe("error","Failed to export to Google Drive."),t)}}async function er(){try{let e=await gn("autoBackupEnabled"),t=await gn("autoBackupIntervalMinutes"),r=await gn("lastAutoBackupAt");typeof e=="boolean"&&(nt=e),typeof t=="number"&&t>0&&(je=t),typeof r=="number"&&r>0&&(Ye=r)}catch(e){u("Failed to load auto backup settings:",e,"error")}}async function Fo(){try{await hn("autoBackupEnabled",nt),await hn("autoBackupIntervalMinutes",je),await hn("lastAutoBackupAt",Ye??0)}catch(e){u("Failed to save auto backup settings:",e,"error")}}function ya(){no&&(clearInterval(no),no=null),Ue&&(clearTimeout(Ue),Ue=null)}function Vt(e){try{let t=new Date(e),r=new Date,a=t.toDateString()===r.toDateString(),l=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return a?l:`${t.toLocaleDateString()} ${l}`}catch{return""}}function Ze(){if(!be)return;let e="",t="";if(!nt)e="\u{1F501} Backup: Off",be.onmouseenter=null,be.onmouseleave=null;else if(jt)e="\u{1F501} Backing up\u2026",be.onmouseenter=null,be.onmouseleave=null;else if(Ke&&Ke>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(Ke/6e4)}m`,be.onmouseenter=null,be.onmouseleave=null;else if(Ye){e=`\u{1F5C4}\uFE0F Last backup: ${Vt(Ye)}`;let r=Ye+Math.max(1,je)*60*1e3;t=`\u{1F5C4}\uFE0F Next backup: ${Vt(r)}`,be.onmouseenter=()=>{be.textContent=t},be.onmouseleave=()=>{be.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let r=Date.now()+Math.max(1,je)*60*1e3;t=`\u{1F5C4}\uFE0F Next backup: ${Vt(r)}`,be.onmouseenter=()=>{be.textContent=t},be.onmouseleave=()=>{be.textContent=e}}be.textContent=e,be.style.display=e?"inline":"none",qt()}function qt(){if(!to)return;let e="";nt?jt?e="#4285f4":Ke&&Ke>0?e="#ffa500":H.isSignedIn&&Ye?e="#52c41a":H.isSignedIn?e="#ffa500":e="#ff4d4f":e="#ff4d4f",to.style.backgroundColor=e,_e(to,()=>{let t="";if(!nt)t="Auto backup is disabled";else if(jt)t="Backup in progress";else if(Ke&&Ke>0)t=`Retrying backup in ${Math.ceil(Ke/6e4)}m`;else if(H.isSignedIn&&Ye){let r=Ye+Math.max(1,je)*60*1e3,a=Vt(r);t=`Last backup: ${Vt(Ye)}
Next backup: ${a}`}else if(H.isSignedIn){let r=Date.now()+Math.max(1,je)*60*1e3;t=`No backup yet
Next backup: ${Vt(r)}`}else t="Not signed in to Google Drive";return t})}async function yn(e=!0){if(!H.isSignedIn||!H.accessToken){e||ua();return}if(Ue){u("Auto backup: backoff in progress, skipping scheduled run");return}if(!jt){jt=!0,Ze();try{await ga({silent:e}),Ye=Date.now(),Ut=0,Ke=null,Ue&&(clearTimeout(Ue),Ue=null),await Fo()}catch(t){if(u("Auto backup failed:",t,"error"),t.message==="unauthorized")u("Auth error detected, clearing token and stopping retries",null,"warn"),H.isSignedIn=!1,H.accessToken=null,await ro(),Pe("error","Authorization expired. Please sign in again."),Ze(),Ut=0,Ke=null,Ue&&(clearTimeout(Ue),Ue=null);else if(Ut<Ui){Ut+=1;let l=Math.min(la*Math.pow(2,Ut-1),ca);Ke=l,Ue&&clearTimeout(Ue),Ue=setTimeout(()=>{yn(!0)},l),u(`Scheduling backup retry ${Ut}/${Ui} in ${Math.round(l/1e3)}s`),Ze()}else Ke=null}finally{jt=!1,Ze()}}}async function Wt(e=!1){if(ya(),!!nt&&!(!H.isSignedIn||!H.accessToken)){if(no=setInterval(()=>{yn(!0)},Math.max(1,je)*60*1e3),!e){let t=Date.now(),r=Math.max(1,je)*60*1e3;(!Ye||t-Ye>=r)&&yn(!0)}Ze()}}async function tr(){nt=!nt,await Fo(),await Wt(),Ze()}async function nr(){let e=prompt("Set Auto Backup interval (minutes):",String(je));if(e===null)return;let t=Math.floor(Number(e));if(!Number.isFinite(t)||t<5||t>1440){alert("Please enter a number between 5 and 1440 minutes.");return}je=t,await Fo(),await Wt(),Ze()}var Oo=window.location.hash;if(Oo&&Oo.length>1){let e=new URLSearchParams(Oo.substring(1));if(e.get("state")==="timekeeper_auth"){let r=e.get("access_token");if(r){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",r.length,"characters");try{let a=new BroadcastChannel("timekeeper_oauth"),l={type:"timekeeper_oauth_token",token:r};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:l.type,tokenLength:r.length}),a.postMessage(l),a.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(a){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",a);let l={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},n=indexedDB.open("ytls-timestamps-db",3);n.onsuccess=()=>{let f=n.result,s=f.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:l}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",l.timestamp),f.close()}}}if(history.replaceState){let a=window.location.pathname+window.location.search;history.replaceState(null,"",a)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(o){return GM.getValue(`timekeeper_${o}`,void 0)}function t(o,i){return GM.setValue(`timekeeper_${o}`,JSON.stringify(i))}if(io(e),oo(t),await Zi()){u("OAuth popup detected, broadcasting token and closing");return}await zo();let a=["/watch","/live"];function l(o=window.location.href){try{let i=new URL(o);return i.origin!=="https://www.youtube.com"?!1:a.some(c=>i.pathname===c||i.pathname.startsWith(`${c}/`))}catch(i){return u("Timekeeper failed to parse URL for support check:",i,"error"),!1}}let n=null,f=null,s=null,w=null,T=null,E=null,C=null,M=null,O=250,Z=null,W=!1;function X(){return n?n.getBoundingClientRect():null}function te(o,i,c){o&&(Ae={x:Math.round(typeof i=="number"?i:o.left),y:Math.round(typeof c=="number"?c:o.top),width:Math.round(o.width),height:Math.round(o.height)})}function N(o=!0){if(!n)return;Ot();let i=X();i&&(i.width||i.height)&&(te(i),o&&(un("windowPosition",Ae),Zt({type:"window_position_updated",position:Ae,timestamp:Date.now()})))}function ce(){if(!n||!f||!w||!s)return;let o=40,i=ee();if(i.length>0)o=i[0].offsetHeight;else{let c=document.createElement("li");c.style.visibility="hidden",c.style.position="absolute",c.textContent="00:00 Example",s.appendChild(c),o=c.offsetHeight,s.removeChild(c)}O=f.offsetHeight+w.offsetHeight+o,n.style.minHeight=O+"px"}function J(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),N(!0)})}function he(o=450){me&&(clearTimeout(me),me=null),me=setTimeout(()=>{R(),J(),me=null},o)}function Se(){me&&(clearTimeout(me),me=null)}function oe(){s&&(s.style.visibility="hidden",u("Hiding timestamps during show animation")),J(),he()}function G(){R(),Se(),Je&&(clearTimeout(Je),Je=null),Je=setTimeout(()=>{n&&(n.style.display="none",Xo(),Je=null)},400)}function R(){if(!s){Re&&(Re(),Re=null,st=null,gt=null);return}if(!gt){s.style.visibility==="hidden"&&(s.style.visibility="",u("Restoring timestamp visibility (no deferred fragment)")),Re&&(Re(),Re=null,st=null);return}u("Appending deferred timestamps after animation"),s.appendChild(gt),gt=null,s.style.visibility==="hidden"&&(s.style.visibility="",u("Restoring timestamp visibility after append")),Re&&(Re(),Re=null,st=null),et(),ke(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let o=j(),i=o?Math.floor(o.getCurrentTime()):kt();Number.isFinite(i)&&Fn(i,!1)}let re=null,ue=!1,ae="ytls-timestamp-pending-delete",ze="ytls-timestamp-highlight",Te="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",Me="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function Ve(){let o=i=>{let c=new Image;c.src=i};o(Te),o(Me)}Ve();async function de(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(o=>setTimeout(o,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(o=>setTimeout(o,100));await new Promise(o=>setTimeout(o,200))}let De=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],ot=5e3,Kt=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Fe(o){return Kt.has(o)}function Oe(){return document.querySelector("video")}let Ce=null;function j(){if(Ce&&document.contains(Ce))return Ce;let o=document.getElementById("movie_player");return o&&document.contains(o)?o:null}function se(o){return De.every(i=>typeof o?.[i]=="function"?!0:Fe(i)?!!Oe():!1)}function ht(o){return De.filter(i=>typeof o?.[i]=="function"?!1:Fe(i)?!Oe():!0)}async function bn(o=ot){let i=Date.now();for(;Date.now()-i<o;){let p=j();if(se(p))return p;await new Promise(b=>setTimeout(b,100))}let c=j();return se(c),c}let Bt="timestampOffsetSeconds",ao=-5,Yt="shiftClickTimeSkipSeconds",wn=10,Pt=300,xt=300,it=new BroadcastChannel("ytls_timestamp_channel");function Zt(o){try{it.postMessage(o)}catch(i){u("BroadcastChannel error, reopening:",i,"warn");try{it=new BroadcastChannel("ytls_timestamp_channel"),it.onmessage=Ro,it.postMessage(o)}catch(c){u("Failed to reopen BroadcastChannel:",c,"error")}}}function Ro(o){if(u("Received message from another tab:",o.data),!(!l()||!s||!n)&&o.data){if(o.data.type==="timestamps_updated"&&o.data.videoId===ge)u("Debouncing timestamp load due to external update for video:",o.data.videoId),clearTimeout(Xt),Xt=setTimeout(()=>{u("Reloading timestamps due to external update for video:",o.data.videoId),Wo()},500);else if(o.data.type==="window_position_updated"&&n){let i=o.data.position;if(i&&typeof i.x=="number"&&typeof i.y=="number"){n.style.left=`${i.x}px`,n.style.top=`${i.y}px`,n.style.right="auto",n.style.bottom="auto",typeof i.width=="number"&&i.width>0&&(n.style.width=`${i.width}px`),typeof i.height=="number"&&i.height>0&&(n.style.height=`${i.height}px`);let c=n.getBoundingClientRect();Ae={x:Math.round(i.x),y:Math.round(i.y),width:Math.round(c.width),height:Math.round(c.height)};let p=document.documentElement.clientWidth,b=document.documentElement.clientHeight;(c.left<0||c.top<0||c.right>p||c.bottom>b)&&Ot()}}}}it.onmessage=Ro;let zt=await GM.getValue(Bt);(typeof zt!="number"||Number.isNaN(zt))&&(zt=ao,await GM.setValue(Bt,zt));let Jt=await GM.getValue(Yt);(typeof Jt!="number"||Number.isNaN(Jt))&&(Jt=wn,await GM.setValue(Yt,Jt));let Xt=null,Tt=new Map,xn=!1,P=null,Tn=null,ge=null,Et=null;async function Ho(){try{let o=$n();if(!o){Et=null;return}let i=await xi(o);if(Et=i,i&&i.thumbnail_url){let c=new Image;c.src=i.thumbnail_url}}catch{Et=null}}window.addEventListener("video_metadata_updated",()=>{Ti(),Ho()});let Je=null,me=null,gt=null,st=null,Re=null,yt=null,En=!1,Ae=null,so=!1,Sn=null,kn=null,Ln=null,In=null,Mn=null,Dn=null,Cn=null,Qt=null,en=null,tn=null,Xe=null,Qe=null,$o=0,nn=!1,St=null,on=null;function ee(){return s?Array.from(s.querySelectorAll("li")).filter(o=>!!o.querySelector("a[data-time]")):[]}function lo(){return ee().map(o=>{let i=o.querySelector("a[data-time]"),c=i?.dataset.time;if(!i||!c)return null;let p=Number.parseInt(c,10);if(!Number.isFinite(p))return null;let v=o.querySelector("input")?.value??"",m=o.dataset.guid??crypto.randomUUID();return o.dataset.guid||(o.dataset.guid=m),{start:p,comment:v,guid:m}}).filter(No)}function kt(){if(on!==null)return on;let o=ee();return on=o.length>0?Math.max(...o.map(i=>{let c=i.querySelector("a[data-time]")?.getAttribute("data-time");return c?Number.parseInt(c,10):0})):0,on}function An(){on=null}function or(o){let i=o.querySelector(".time-diff");return i?(i.textContent?.trim()||"").startsWith("-"):!1}function ir(o,i){return o?i?"\u2514\u2500 ":"\u251C\u2500 ":""}function rn(o){return o.startsWith("\u251C\u2500 ")||o.startsWith("\u2514\u2500 ")?1:0}function _o(o){return o.replace(/^[├└]─\s/,"")}function rr(o){let i=ee();if(o>=i.length-1)return"\u2514\u2500 ";let c=i[o+1].querySelector("input");return c&&rn(c.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function et(){if(!s)return;let o=ee(),i=!0,c=0,p=o.length;for(;i&&c<p;)i=!1,c++,o.forEach((b,v)=>{let m=b.querySelector("input");if(!m||!(rn(m.value)===1))return;let L=!1;if(v<o.length-1){let $=o[v+1].querySelector("input");$&&(L=!(rn($.value)===1))}else L=!0;let S=_o(m.value),D=`${ir(!0,L)}${S}`;m.value!==D&&(m.value=D,i=!0)})}function Lt(){if(s){for(;s.firstChild;)s.removeChild(s.firstChild);gt&&(gt=null),Re&&(Re(),Re=null,st=null)}}function an(){if(!s||ue||gt)return;Array.from(s.children).some(i=>!i.classList.contains("ytls-placeholder")&&!i.classList.contains("ytls-error-message"))||co("No timestamps for this video")}function co(o){if(!s)return;Lt();let i=document.createElement("li");i.className="ytls-placeholder",i.textContent=o,s.appendChild(i),s.style.overflowY="hidden"}function uo(){if(!s)return;let o=s.querySelector(".ytls-placeholder");o&&o.remove(),s.style.overflowY=""}function mo(o){if(!(!n||!s)){if(ue=o,o)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),co("Loading timestamps...");else if(uo(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),T){let i=j();if(i){let c=i.getCurrentTime(),p=Number.isFinite(c)?Math.max(0,Math.floor(c)):Math.max(0,kt()),b=Math.floor(p/3600),v=Math.floor(p/60)%60,m=p%60,{isLive:g}=i.getVideoData()||{isLive:!1},L=s?ee().map(k=>{let D=k.querySelector("a[data-time]");return D?parseFloat(D.getAttribute("data-time")??"0"):0}):[],S="";if(L.length>0)if(g){let k=Math.max(1,p/60),D=L.filter($=>$<=p);if(D.length>0){let $=(D.length/k).toFixed(2);parseFloat($)>0&&(S=` (${$}/min)`)}}else{let k=i.getDuration(),D=Number.isFinite(k)&&k>0?k:0,$=Math.max(1,D/60),fe=(L.length/$).toFixed(1);parseFloat(fe)>0&&(S=` (${fe}/min)`)}T.textContent=`\u23F3${b?b+":"+String(v).padStart(2,"0"):v}:${String(m).padStart(2,"0")}${S}`}}!ue&&s&&!s.querySelector(".ytls-error-message")&&an(),lt()}}function No(o){return!!o&&Number.isFinite(o.start)&&typeof o.comment=="string"&&typeof o.guid=="string"}function Bn(o,i){o.textContent=bt(i),o.dataset.time=String(i),o.href=yo(i,window.location.href)}let Pn=null,zn=null,It=!1;function ar(o){if(!o||typeof o.getVideoData!="function"||!o.getVideoData()?.isLive)return!1;if(typeof o.getProgressState=="function"){let c=o.getProgressState(),p=Number(c?.seekableEnd??c?.liveHead??c?.head??c?.duration),b=Number(c?.current??o.getCurrentTime?.());if(Number.isFinite(p)&&Number.isFinite(b))return p-b>2}return!1}function Fn(o,i){if(!Number.isFinite(o))return;let c=On(o);sn(c,i)}function On(o){if(!Number.isFinite(o))return null;let i=ee();if(i.length===0)return null;let c=null,p=-1/0;for(let b of i){let m=b.querySelector("a[data-time]")?.dataset.time;if(!m)continue;let g=Number.parseInt(m,10);Number.isFinite(g)&&g<=o&&g>p&&(p=g,c=b)}return c}function sn(o,i=!1){if(!o)return;ee().forEach(p=>{p.classList.contains(ae)||p.classList.remove(ze)}),o.classList.contains(ae)||(o.classList.add(ze),i&&!xn&&o.scrollIntoView({behavior:"smooth",block:"center"}))}function sr(o){if(!s||s.querySelector(".ytls-error-message")||!Number.isFinite(o)||o===0)return!1;let i=ee();if(i.length===0)return!1;let c=!1;return i.forEach(p=>{let b=p.querySelector("a[data-time]"),v=b?.dataset.time;if(!b||!v)return;let m=Number.parseInt(v,10);if(!Number.isFinite(m))return;let g=Math.max(0,m+o);g!==m&&(Bn(b,g),c=!0)}),c?(cn(),et(),ke(),Hn(ge),St=null,!0):!1}function Go(o,i={}){if(!Number.isFinite(o)||o===0)return!1;if(!sr(o)){if(i.alertOnNoChange){let m=i.failureMessage??"Offset did not change any timestamps.";alert(m)}return!1}let p=i.logLabel??"bulk offset";u(`Timestamps changed: Offset all timestamps by ${o>0?"+":""}${o} seconds (${p})`);let b=j(),v=b?Math.floor(b.getCurrentTime()):0;if(Number.isFinite(v)){let m=On(v);sn(m,!1)}return!0}function Uo(o){if(!s||ue)return;let i=o.target instanceof HTMLElement?o.target:null;if(i)if(i.dataset.time){o.preventDefault();let c=Number(i.dataset.time);if(Number.isFinite(c)){It=!0;let b=j();b&&b.seekTo(c),setTimeout(()=>{It=!1},500)}let p=i.closest("li");p&&(ee().forEach(b=>{b.classList.contains(ae)||b.classList.remove(ze)}),p.classList.contains(ae)||(p.classList.add(ze),p.scrollIntoView({behavior:"smooth",block:"center"})))}else if(i.dataset.increment){o.preventDefault();let p=i.parentElement?.querySelector("a[data-time]");if(!p||!p.dataset.time)return;let b=parseInt(p.dataset.time,10),v=parseInt(i.dataset.increment,10);if("shiftKey"in o&&o.shiftKey&&(v*=Jt),"altKey"in o?o.altKey:!1){Go(v,{logLabel:"Alt adjust"});return}let L=Math.max(0,b+v);u(`Timestamps changed: Timestamp time incremented from ${b} to ${L}`),Bn(p,L),An();let S=i.closest("li");if(zn=L,Pn&&clearTimeout(Pn),It=!0,Pn=setTimeout(()=>{if(zn!==null){let k=j();k&&k.seekTo(zn)}Pn=null,zn=null,setTimeout(()=>{It=!1},500)},500),cn(),et(),ke(),S){let k=S.querySelector("input"),D=S.dataset.guid;k&&D&&(Ft(ge,D,L,k.value),St=D)}}else i.dataset.action==="clear"&&(o.preventDefault(),u("Timestamps changed: All timestamps cleared from UI"),s.textContent="",An(),ke(),Rn(),Hn(ge,{allowEmpty:!0}),St=null,an())}function ln(o,i="",c=!1,p=null,b=!0){if(!s)return null;let v=Math.max(0,o),m=p??crypto.randomUUID(),g=document.createElement("li"),L=document.createElement("div"),S=document.createElement("span"),k=document.createElement("span"),D=document.createElement("span"),$=document.createElement("a"),fe=document.createElement("span"),F=document.createElement("input"),le=document.createElement("button");g.dataset.guid=m,L.className="time-row";let We=document.createElement("div");We.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",_e(We,"Click to toggle indent");let Be=document.createElement("span");Be.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let rt=()=>{let Q=rn(F.value);Be.textContent=Q===1?"\u25C0":"\u25B6"},Rt=Q=>{Q.stopPropagation();let K=rn(F.value),pe=_o(F.value),ie=K===0?1:0,ne="";if(ie===1){let tt=ee().indexOf(g);ne=rr(tt)}F.value=`${ne}${pe}`,rt(),et();let ye=Number.parseInt($.dataset.time??"0",10);Ft(ge,m,ye,F.value)};We.onclick=Rt,We.append(Be),g.style.cssText="position:relative;padding-left:20px;",g.addEventListener("mouseenter",()=>{rt(),Be.style.display="inline"}),g.addEventListener("mouseleave",()=>{Be.style.display="none"}),g.addEventListener("mouseleave",()=>{g.dataset.guid===St&&or(g)&&jo()}),F.value=i||"",F.style.cssText="width:100%;margin-top:5px;display:block;",F.type="text",F.setAttribute("inputmode","text"),F.autocapitalize="off",F.autocomplete="off",F.spellcheck=!1,F.addEventListener("focusin",()=>{nn=!1}),F.addEventListener("focusout",Q=>{let K=Q.relatedTarget,pe=Date.now()-$o<250,ie=!!K&&!!n&&n.contains(K);!pe&&!ie&&(nn=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(F.focus({preventScroll:!0}),nn=!1)},0))}),F.addEventListener("input",Q=>{let K=Q;if(K&&(K.isComposing||K.inputType==="insertCompositionText"))return;let pe=Tt.get(m);pe&&clearTimeout(pe);let ie=setTimeout(()=>{let ne=Number.parseInt($.dataset.time??"0",10);Ft(ge,m,ne,F.value),Tt.delete(m)},500);Tt.set(m,ie)}),F.addEventListener("compositionend",()=>{let Q=Number.parseInt($.dataset.time??"0",10);setTimeout(()=>{Ft(ge,m,Q,F.value)},50)}),S.textContent="\u2796",S.dataset.increment="-1",S.style.cursor="pointer",S.style.margin="0px",S.addEventListener("mouseenter",()=>{S.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),S.addEventListener("mouseleave",()=>{S.style.textShadow="none"}),D.textContent="\u2795",D.dataset.increment="1",D.style.cursor="pointer",D.style.margin="0px",D.addEventListener("mouseenter",()=>{D.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),D.addEventListener("mouseleave",()=>{D.style.textShadow="none"}),k.textContent="\u23FA\uFE0F",k.style.cursor="pointer",k.style.margin="0px",_e(k,"Set to current playback time"),k.addEventListener("mouseenter",()=>{k.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),k.addEventListener("mouseleave",()=>{k.style.textShadow="none"}),k.onclick=()=>{let Q=j(),K=Q?Math.floor(Q.getCurrentTime()):0;Number.isFinite(K)&&(u(`Timestamps changedset to current playback time ${K}`),Bn($,K),cn(),et(),Ft(ge,m,K,F.value),St=m)},Bn($,v),An(),le.textContent="\u{1F5D1}\uFE0F",le.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",le.addEventListener("mouseenter",()=>{le.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),le.addEventListener("mouseleave",()=>{le.style.textShadow="none"}),le.onclick=()=>{let Q=null,K=null,pe=null,ie=()=>{try{g.removeEventListener("click",K,!0)}catch{}try{document.removeEventListener("click",K,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",pe)}catch{}Q&&(clearTimeout(Q),Q=null)};if(g.dataset.deleteConfirmed==="true"){u("Timestamps changed: Timestamp deleted");let ne=g.dataset.guid??"",ye=Tt.get(ne);ye&&(clearTimeout(ye),Tt.delete(ne)),ie(),g.remove(),An(),cn(),et(),ke(),Rn(),lr(ge,ne),St=null,an()}else{g.dataset.deleteConfirmed="true",g.classList.add(ae),g.classList.remove(ze);let ne=()=>{g.dataset.deleteConfirmed="false",g.classList.remove(ae);let ye=j(),He=ye?ye.getCurrentTime():0,tt=Number.parseInt(g.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(He)&&Number.isFinite(tt)&&He>=tt&&g.classList.add(ze),ie()};K=ye=>{ye.target!==le&&ne()},pe=()=>{g.dataset.deleteConfirmed==="true"&&ne()},g.addEventListener("click",K,!0),document.addEventListener("click",K,!0),s&&s.addEventListener("mouseleave",pe),Q=setTimeout(()=>{g.dataset.deleteConfirmed==="true"&&ne(),ie()},5e3)}},fe.className="time-diff",fe.style.color="#888",fe.style.marginLeft="5px",L.append(S,k,D,$,fe,le),g.append(We,L,F);let ct=Number.parseInt($.dataset.time??"0",10);if(b){uo();let Q=!1,K=ee();for(let pe=0;pe<K.length;pe++){let ie=K[pe],ye=ie.querySelector("a[data-time]")?.dataset.time;if(!ye)continue;let He=Number.parseInt(ye,10);if(Number.isFinite(He)&&ct<He){s.insertBefore(g,ie),Q=!0;let tt=K[pe-1];if(tt){let $t=tt.querySelector("a[data-time]")?.dataset.time;if($t){let ut=Number.parseInt($t,10);Number.isFinite(ut)&&(fe.textContent=bt(ct-ut))}}else fe.textContent="";let Ht=ie.querySelector(".time-diff");Ht&&(Ht.textContent=bt(He-ct));break}}if(!Q&&(s.appendChild(g),K.length>0)){let ne=K[K.length-1].querySelector("a[data-time]")?.dataset.time;if(ne){let ye=Number.parseInt(ne,10);Number.isFinite(ye)&&(fe.textContent=bt(ct-ye))}}g.scrollIntoView({behavior:"smooth",block:"center"}),Rn(),et(),ke(),c||(Ft(ge,m,v,i),St=m,sn(g,!1))}else F.__ytls_li=g;return F}function cn(){if(!s||s.querySelector(".ytls-error-message"))return;let o=ee();o.forEach((i,c)=>{let p=i.querySelector(".time-diff");if(!p)return;let v=i.querySelector("a[data-time]")?.dataset.time;if(!v){p.textContent="";return}let m=Number.parseInt(v,10);if(!Number.isFinite(m)){p.textContent="";return}if(c===0){p.textContent="";return}let S=o[c-1].querySelector("a[data-time]")?.dataset.time;if(!S){p.textContent="";return}let k=Number.parseInt(S,10);if(!Number.isFinite(k)){p.textContent="";return}let D=m-k,$=D<0?"-":"";p.textContent=` ${$}${bt(Math.abs(D))}`})}function jo(){if(!s||s.querySelector(".ytls-error-message")||ue)return;let o=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let m=document.activeElement,L=m.closest("li")?.dataset.guid;if(L){let S=m.selectionStart??m.value.length,k=m.selectionEnd??S,D=m.scrollLeft;o={guid:L,start:S,end:k,scroll:D}}}let i=ee();if(i.length===0)return;let c=i.map(m=>m.dataset.guid),p=i.map(m=>{let g=m.querySelector("a[data-time]"),L=g?.dataset.time;if(!g||!L)return null;let S=Number.parseInt(L,10);if(!Number.isFinite(S))return null;let k=m.dataset.guid??"";return{time:S,guid:k,element:m}}).filter(m=>m!==null).sort((m,g)=>{let L=m.time-g.time;return L!==0?L:m.guid.localeCompare(g.guid)}),b=p.map(m=>m.guid),v=c.length!==b.length||c.some((m,g)=>m!==b[g]);for(;s.firstChild;)s.removeChild(s.firstChild);if(p.forEach(m=>{s.appendChild(m.element)}),cn(),et(),ke(),o){let g=ee().find(L=>L.dataset.guid===o.guid)?.querySelector("input");if(g)try{g.focus({preventScroll:!0})}catch{}}v&&(u("Timestamps changed: Timestamps sorted"),Hn(ge))}function Rn(){if(!s||!n||!f||!w)return;let o=ee().length;typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea();let i=n.getBoundingClientRect(),c=f.getBoundingClientRect(),p=w.getBoundingClientRect(),b=Math.max(0,i.height-(c.height+p.height));o===0?(an(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>b?"auto":"hidden"}function ke(){if(!s)return;let o=Oe(),i=document.querySelector(".ytp-progress-bar"),c=j(),p=c?c.getVideoData():null,b=!!p&&!!p.isLive;if(!o||!i||!isFinite(o.duration)||b)return;qo(),ee().map(m=>{let g=m.querySelector("a[data-time]"),L=g?.dataset.time;if(!g||!L)return null;let S=Number.parseInt(L,10);if(!Number.isFinite(S))return null;let D=m.querySelector("input")?.value??"",$=m.dataset.guid??crypto.randomUUID();return m.dataset.guid||(m.dataset.guid=$),{start:S,comment:D,guid:$}}).filter(No).forEach(m=>{if(!Number.isFinite(m.start))return;let g=document.createElement("div");g.className="ytls-marker",g.style.position="absolute",g.style.height="100%",g.style.width="2px",g.style.backgroundColor="#ff0000",g.style.cursor="pointer",g.style.left=m.start/o.duration*100+"%",g.dataset.time=String(m.start),g.addEventListener("click",()=>{let L=j();L&&L.seekTo(m.start)}),i.appendChild(g)})}function Hn(o,i={}){if(!s||s.querySelector(".ytls-error-message")||!o)return;if(ue){u("Save blocked: timestamps are currently loading");return}et();let c=lo().sort((p,b)=>p.start-b.start);if(c.length===0&&!i.allowEmpty){u("Save skipped: no timestamps to save");return}Zo(o,c).then(()=>u(`Successfully saved ${c.length} timestamps for ${o} to IndexedDB`)).catch(p=>u(`Failed to save timestamps for ${o} to IndexedDB:`,p,"error")),Zt({type:"timestamps_updated",videoId:o,action:"saved"})}function Ft(o,i,c,p){if(!o||ue)return;let b={guid:i,start:c,comment:p};u(`Saving timestamp: guid=${i}, start=${c}, comment="${p}"`),wr(o,b).catch(v=>u(`Failed to save timestamp ${i}:`,v,"error")),Zt({type:"timestamps_updated",videoId:o,action:"saved"})}function lr(o,i){!o||ue||(u(`Deleting timestamp: guid=${i}`),xr(o,i).catch(c=>u(`Failed to delete timestamp ${i}:`,c,"error")),Zt({type:"timestamps_updated",videoId:o,action:"saved"}))}async function Vo(o){if(!s||s.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let i=ge;if(!i)return;u(`Exporting timestamps for video ID: ${i}`);let c=lo(),p=Math.max(kt(),0),b=Wn();if(o==="json"){let v=new Blob([JSON.stringify(c,null,2)],{type:"application/json"}),m=URL.createObjectURL(v),g=document.createElement("a");g.href=m,g.download=`timestamps-${i}-${b}.json`,g.click(),URL.revokeObjectURL(m)}else if(o==="text"){let v=c.map(S=>{let k=bt(S.start,p),D=`${S.comment} <!-- guid:${S.guid} -->`.trimStart();return`${k} ${D}`}).join(`
`),m=new Blob([v],{type:"text/plain"}),g=URL.createObjectURL(m),L=document.createElement("a");L.href=g,L.download=`timestamps-${i}-${b}.txt`,L.click(),URL.revokeObjectURL(g)}}function fo(o){if(!n||!s){u("Timekeeper error:",o,"error");return}Lt();let i=document.createElement("li");i.textContent=o,i.classList.add("ytls-error-message"),i.style.color="#ff6b6b",i.style.fontWeight="bold",i.style.padding="8px",i.style.background="rgba(255, 0, 0, 0.1)",s.appendChild(i),ke()}function qo(){document.querySelectorAll(".ytls-marker").forEach(o=>o.remove())}function Ot(){if(!n||!document.body.contains(n))return;let o=n.getBoundingClientRect(),i=document.documentElement.clientWidth,c=document.documentElement.clientHeight,p=o.width,b=o.height;if(o.left<0&&(n.style.left="0",n.style.right="auto"),o.right>i){let v=Math.max(0,i-p);n.style.left=`${v}px`,n.style.right="auto"}if(o.top<0&&(n.style.top="0",n.style.bottom="auto"),o.bottom>c){let v=Math.max(0,c-b);n.style.top=`${v}px`,n.style.bottom="auto"}}function cr(){if(Sn&&(document.removeEventListener("mousemove",Sn),Sn=null),kn&&(document.removeEventListener("mouseup",kn),kn=null),Qt&&(document.removeEventListener("keydown",Qt),Qt=null),Ln&&(window.removeEventListener("resize",Ln),Ln=null),en&&(document.removeEventListener("pointerdown",en,!0),en=null),tn&&(document.removeEventListener("pointerup",tn,!0),tn=null),Xe){try{Xe.disconnect()}catch{}Xe=null}if(Qe){try{Qe.disconnect()}catch{}Qe=null}let o=Oe();o&&(In&&(o.removeEventListener("timeupdate",In),In=null),Mn&&(o.removeEventListener("pause",Mn),Mn=null),Dn&&(o.removeEventListener("play",Dn),Dn=null),Cn&&(o.removeEventListener("seeking",Cn),Cn=null))}function ur(){qo(),Tt.forEach(i=>clearTimeout(i)),Tt.clear(),Xt&&(clearTimeout(Xt),Xt=null),re&&(clearInterval(re),re=null),Je&&(clearTimeout(Je),Je=null),cr();try{it.close()}catch{}if(P&&P.parentNode===document.body&&document.body.removeChild(P),P=null,Tn=null,xn=!1,ge=null,Xe){try{Xe.disconnect()}catch{}Xe=null}if(Qe){try{Qe.disconnect()}catch{}Qe=null}n&&n.parentNode&&n.remove();let o=document.getElementById("ytls-header-button");o&&o.parentNode&&o.remove(),yt=null,En=!1,Ae=null,Lt(),n=null,f=null,s=null,w=null,T=null,E=null,C=null,Ce=null}async function dr(){let o=$n();if(!o)return Ce=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let i=await bn();if(!se(i)){let c=ht(i),p=c.length?` Missing methods: ${c.join(", ")}.`:"",b=i?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return Ce=null,{ok:!1,message:`${b}${p} Try refreshing once playback is ready.`}}return Ce=i,{ok:!0,player:i,videoId:o}}async function Wo(){if(!n||!s)return;let o=s.scrollTop,i=!0,c=()=>{if(!s||!i)return;let p=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(o,p)};try{let p=await dr();if(!p.ok){fo(p.message),Lt(),ke();return}let{videoId:b}=p,v=[];try{let m=await Tr(b);m?(v=m.map(g=>({...g,guid:g.guid||crypto.randomUUID()})),u(`Loaded ${v.length} timestamps from IndexedDB for ${b}`)):u(`No timestamps found in IndexedDB for ${b}`)}catch(m){u(`Failed to load timestamps from IndexedDB for ${b}:`,m,"error"),fo("Failed to load timestamps from IndexedDB. Try refreshing the page."),ke();return}if(v.length>0){v.sort((k,D)=>k.start-D.start),Lt(),uo();let m=document.createDocumentFragment();v.forEach(k=>{let $=ln(k.start,k.comment,!0,k.guid,!1).__ytls_li;$&&m.appendChild($)}),n&&n.classList.contains("ytls-zoom-in")&&me!=null?(u("Deferring timestamp DOM append until show animation completes"),gt=m,st||(st=new Promise(k=>{Re=k})),await st):s&&(s.appendChild(m),et(),ke(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let L=j(),S=L?Math.floor(L.getCurrentTime()):kt();Number.isFinite(S)&&(Fn(S,!1),i=!1)}else Lt(),co("No timestamps for this video"),ke(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(p){u("Unexpected error while loading timestamps:",p,"error"),fo("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{st&&await st,requestAnimationFrame(c),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),s&&!s.querySelector(".ytls-error-message")&&an()}}function $n(){let i=new URLSearchParams(location.search).get("v");if(i)return i;let c=document.querySelector('meta[itemprop="identifier"]');return c?.content?c.content:null}function mr(){let o=Oe();if(!o)return;let i=()=>{if(!s)return;let m=j(),g=m?Math.floor(m.getCurrentTime()):0;if(!Number.isFinite(g))return;let L=On(g);sn(L,!1)},c=m=>{try{let g=new URL(window.location.href);m!==null&&Number.isFinite(m)?g.searchParams.set("t",`${Math.floor(m)}s`):g.searchParams.delete("t"),window.history.replaceState({},"",g.toString())}catch{}},p=()=>{let m=j(),g=m?Math.floor(m.getCurrentTime()):0;Number.isFinite(g)&&c(g)},b=()=>{c(null)},v=()=>{let m=Oe();if(!m)return;let g=j(),L=g?Math.floor(g.getCurrentTime()):0;if(!Number.isFinite(L))return;m.paused&&c(L);let S=On(L);sn(S,!0)};In=i,Mn=p,Dn=b,Cn=v,o.addEventListener("timeupdate",i),o.addEventListener("pause",p),o.addEventListener("play",b),o.addEventListener("seeking",v)}let ba="ytls-timestamps-db",wa=7,xa="timestamps",qe="timestamps_v2",Ko="settings",fr="video_metadata",pr="videos_csv_etag";function hr(){return Ne()}async function Yo(){let o={},i=await Jo(qe),c=new Map;for(let v of i){let m=v;c.has(m.video_id)||c.set(m.video_id,[]),c.get(m.video_id).push({guid:m.guid,start:m.start,comment:m.comment})}for(let[v,m]of c)o[`ytls-${v}`]={video_id:v,timestamps:m.sort((g,L)=>g.start-L.start)};return{json:JSON.stringify(o,null,2),filename:"timekeeper-data.json",totalVideos:c.size,totalTimestamps:i.length}}async function gr(){try{let{json:o,filename:i,totalVideos:c,totalTimestamps:p}=await Yo(),b=new Blob([o],{type:"application/json"}),v=URL.createObjectURL(b),m=document.createElement("a");m.href=v,m.download=i,m.click(),URL.revokeObjectURL(v),u(`Exported ${c} videos with ${p} timestamps`)}catch(o){throw u("Failed to export data:",o,"error"),o}}async function yr(){let o=await Jo(qe);if(!Array.isArray(o)||o.length===0){let S=`Tag,Timestamp,URL
`,k=`timestamps-${Wn()}.csv`;return{csv:S,filename:k,totalVideos:0,totalTimestamps:0}}let i=new Map;for(let S of o)i.has(S.video_id)||i.set(S.video_id,[]),i.get(S.video_id).push({start:S.start,comment:S.comment});let c=[];c.push("Tag,Timestamp,URL");let p=0,b=S=>`"${String(S).replace(/"/g,'""')}"`,v=S=>{let k=Math.floor(S/3600),D=Math.floor(S%3600/60),$=String(S%60).padStart(2,"0");return`${String(k).padStart(2,"0")}:${String(D).padStart(2,"0")}:${$}`},m=Array.from(i.keys()).sort();for(let S of m){let k=i.get(S).sort((D,$)=>D.start-$.start);for(let D of k){let $=D.comment,fe=v(D.start),F=yo(D.start,`https://www.youtube.com/watch?v=${S}`);c.push([b($),b(fe),b(F)].join(",")),p++}}let g=c.join(`
`),L=`timestamps-${Wn()}.csv`;return{csv:g,filename:L,totalVideos:i.size,totalTimestamps:p}}async function vr(){try{let{csv:o,filename:i,totalVideos:c,totalTimestamps:p}=await yr(),b=new Blob([o],{type:"text/csv;charset=utf-8;"}),v=URL.createObjectURL(b),m=document.createElement("a");m.href=v,m.download=i,m.click(),URL.revokeObjectURL(v),u(`Exported ${c} videos with ${p} timestamps (CSV)`)}catch(o){throw u("Failed to export CSV data:",o,"error"),o}}async function br(o,i,c){let p=!1;for(;;){let b=await hr();try{return await new Promise((v,m)=>{let g;try{g=b.transaction(o,i)}catch(k){m(new Error(`Failed to create transaction for ${o}: ${k}`));return}let L=g.objectStore(o),S;try{S=c(L)}catch(k){m(new Error(`Failed to execute operation on ${o}: ${k}`));return}S&&(S.onsuccess=()=>v(S.result),S.onerror=()=>m(S.error??new Error(`IndexedDB ${i} operation failed`))),g.oncomplete=()=>{S||v(void 0)},g.onerror=()=>m(g.error??new Error("IndexedDB transaction failed")),g.onabort=()=>m(g.error??new Error("IndexedDB transaction aborted"))})}catch(v){let m=v?.name||"",g=String(v||"");if((m==="NotFoundError"||/object stores? was not found/i.test(g)||/NotFoundError/.test(g))&&!p){p=!0,u(`IndexedDB store ${o} not found; attempting to create the store and retrying transaction`);try{if(b)try{b.close()}catch{}await vi(o)}catch(S){u("Failed to create missing object store during ensure step:",S,"warn")}continue}throw v}}}async function Zo(o,i){let p=(await Ne()).transaction(qe,"readwrite"),b=p.objectStore(qe);try{let v=await b.index("video_id").getAll(IDBKeyRange.only(o)),m=new Set(i.map(g=>g.guid));for(let g of v)m.has(g.guid)||b.delete(g.guid);for(let g of i)b.put({guid:g.guid,video_id:o,start:g.start,comment:g.comment});await p.done}catch(v){throw u("Error during save operation:",v,"error"),v}}async function wr(o,i){let p=(await Ne()).transaction(qe,"readwrite"),b=p.objectStore(qe);try{await b.put({guid:i.guid,video_id:o,start:i.start,comment:i.comment}),await p.done}catch(v){throw v??new Error("Failed to save single timestamp to IndexedDB")}}async function xr(o,i){u(`Deleting timestamp ${i} for video ${o}`);let p=(await Ne()).transaction(qe,"readwrite"),b=p.objectStore(qe);try{await b.delete(i),await p.done}catch(v){throw v??new Error("Failed to delete single timestamp from IndexedDB")}}async function Tr(o){try{let b=await(await Ne()).transaction(qe,"readonly").objectStore(qe).index("video_id").getAll(IDBKeyRange.only(o));return b.length>0?b.map(m=>({guid:m.guid,start:m.start,comment:m.comment})).sort((m,g)=>m.start-g.start):null}catch(i){return u("Failed to load timestamps from IndexedDB:",i,"warn"),null}}async function Er(o){try{let c=(await Ne()).transaction(qe,"readwrite"),p=c.objectStore(qe),b=await p.index("video_id").getAll(IDBKeyRange.only(o));for(let v of b)await p.delete(v.guid);await c.done}catch(i){throw u("Error during remove operation:",i,"error"),i}}function Jo(o){return pi(o)}function un(o,i){return hi(Ko,{key:o,value:i}).catch(c=>{throw u(`Failed to save setting '${o}' to IndexedDB:`,c,"error"),c})}function _n(o){return Zn(Ko,o).then(i=>i?.value).catch(i=>{u(`Failed to load setting '${o}' from IndexedDB:`,i,"error")})}async function Sr(){try{await Ei({loadGlobalSettings:_n,saveGlobalSettings:un,executeTransaction:br,VIDEO_METADATA_STORE:fr,VIDEOS_CSV_ETAG_KEY:pr,log:u})}catch(o){u("Failed to initialize video metadata:",o,"warn")}}Sr().catch(o=>u("initVideoMetadata failed:",o,"warn"));function Xo(){if(!n)return;let o=n.style.display!=="none";un("uiVisible",o)}function lt(o){let i=typeof o=="boolean"?o:!!n&&n.style.display!=="none",c=document.getElementById("ytls-header-button");c instanceof HTMLButtonElement&&c.setAttribute("aria-pressed",String(i)),yt&&!En&&yt.src!==Te&&(yt.src=Te)}function kr(){n&&_n("uiVisible").then(o=>{let i=o;typeof i=="boolean"?(i?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",lt(i)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),lt(!0))}).catch(o=>{u("Failed to load UI visibility state:",o,"error"),n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),lt(!0)})}function po(o){if(!n){u("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(u("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(b=>{b!==n&&b.remove()}),document.body.appendChild(n));let i=document.querySelectorAll("#ytls-pane");i.length>1&&(u(`ERROR: Multiple panes detected in togglePaneVisibility (${i.length}), cleaning up`),i.forEach(b=>{b!==n&&b.remove()})),Je&&(clearTimeout(Je),Je=null);let c=n.style.display==="none";(typeof o=="boolean"?o:c)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),lt(!0),Xo(),oe(),me&&(clearTimeout(me),me=null),me=setTimeout(()=>{R(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),N(!0),me=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),lt(!1),G())}function Qo(o){if(!s){u("UI is not initialized; cannot import timestamps.","warn");return}let i=!1;try{let c=JSON.parse(o),p=null;if(Array.isArray(c))p=c;else if(typeof c=="object"&&c!==null){let b=ge;if(b){let v=`timekeeper-${b}`;c[v]&&Array.isArray(c[v].timestamps)&&(p=c[v].timestamps,u(`Found timestamps for current video (${b}) in export format`,"info"))}if(!p){let v=Object.keys(c).filter(m=>m.startsWith("ytls-"));if(v.length===1&&Array.isArray(c[v[0]].timestamps)){p=c[v[0]].timestamps;let m=c[v[0]].video_id;u(`Found timestamps for video ${m} in export format`,"info")}}}p&&Array.isArray(p)?p.every(v=>typeof v.start=="number"&&typeof v.comment=="string")?(p.forEach(v=>{if(v.guid){let m=ee().find(g=>g.dataset.guid===v.guid);if(m){let g=m.querySelector("input");g&&(g.value=v.comment)}else ln(v.start,v.comment,!1,v.guid)}else ln(v.start,v.comment,!1,crypto.randomUUID())}),i=!0):u("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):u("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!i){let c=o.split(`
`).map(p=>p.trim()).filter(p=>p);if(c.length>0){let p=!1;c.forEach(b=>{let v=b.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(v){p=!0;let m=parseInt(v[1])||0,g=parseInt(v[2]),L=parseInt(v[3]),S=m*3600+g*60+L,k=v[4]?v[4].trim():"",D=null,$=k,fe=k.match(/<!--\s*guid:([^>]+?)\s*-->/);fe&&(D=fe[1].trim(),$=k.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let F;if(D&&(F=ee().find(le=>le.dataset.guid===D)),!F&&!D&&(F=ee().find(le=>{if(le.dataset.guid)return!1;let Be=le.querySelector("a[data-time]")?.dataset.time;if(!Be)return!1;let rt=Number.parseInt(Be,10);return Number.isFinite(rt)&&rt===S})),F){let le=F.querySelector("input");le&&(le.value=$)}else ln(S,$,!1,D||crypto.randomUUID())}}),p&&(i=!0)}}i?(u("Timestamps changed: Imported timestamps from file/clipboard"),et(),Hn(ge),ke(),Rn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Lr(){if(so){u("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){so=!0;try{let c=function(){if(ue||It)return;let h=Oe(),d=j();if(!h&&!d)return;let y=d?d.getCurrentTime():0,x=Number.isFinite(y)?Math.max(0,Math.floor(y)):Math.max(0,kt()),I=Math.floor(x/3600),B=Math.floor(x/60)%60,A=x%60,{isLive:_}=d?d.getVideoData()||{isLive:!1}:{isLive:!1},z=d?ar(d):!1,Y=s?ee().map(q=>{let ve=q.querySelector("a[data-time]");return ve?parseFloat(ve.getAttribute("data-time")??"0"):0}):[],Le="";if(Y.length>0)if(_){let q=Math.max(1,x/60),ve=Y.filter(Ie=>Ie<=x);if(ve.length>0){let Ie=(ve.length/q).toFixed(2);parseFloat(Ie)>0&&(Le=` (${Ie}/min)`)}}else{let q=d?d.getDuration():0,ve=Number.isFinite(q)&&q>0?q:h&&Number.isFinite(h.duration)&&h.duration>0?h.duration:0,Ie=Math.max(1,ve/60),dt=(Y.length/Ie).toFixed(1);parseFloat(dt)>0&&(Le=` (${dt}/min)`)}T.textContent=`\u23F3${I?I+":"+String(B).padStart(2,"0"):B}:${String(A).padStart(2,"0")}${Le}`,T.style.color=z?"#ff4d4f":"",Y.length>0&&Fn(x,!1)},F=function(h,d,y){let x=document.createElement("button");return x.textContent=h,_e(x,d),x.classList.add("ytls-settings-modal-button"),x.onclick=y,x},le=function(h="general"){if(P&&P.parentNode===document.body){let Ee=document.getElementById("ytls-save-modal"),vt=document.getElementById("ytls-load-modal"),mt=document.getElementById("ytls-delete-all-modal");Ee&&document.body.contains(Ee)&&document.body.removeChild(Ee),vt&&document.body.contains(vt)&&document.body.removeChild(vt),mt&&document.body.contains(mt)&&document.body.removeChild(mt),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",We)},300);return}P=document.createElement("div"),P.id="ytls-settings-modal",P.classList.remove("ytls-fade-out"),P.classList.add("ytls-fade-in");let d=document.createElement("div");d.className="ytls-modal-header";let y=document.createElement("div");y.id="ytls-settings-nav";let x=document.createElement("button");x.className="ytls-modal-close-button",x.textContent="\u2715",_e(x,"Close"),x.onclick=()=>{if(P&&P.parentNode===document.body){let Ee=document.getElementById("ytls-save-modal"),vt=document.getElementById("ytls-load-modal"),mt=document.getElementById("ytls-delete-all-modal");Ee&&document.body.contains(Ee)&&document.body.removeChild(Ee),vt&&document.body.contains(vt)&&document.body.removeChild(vt),mt&&document.body.contains(mt)&&document.body.removeChild(mt),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",We)},300)}};let I=document.createElement("div");I.id="ytls-settings-content";let B=document.createElement("h3");B.className="ytls-section-heading",B.textContent="General",B.style.display="none";let A=document.createElement("div"),_=document.createElement("div");_.className="ytls-button-grid";function z(Ee){A.style.display=Ee==="general"?"block":"none",_.style.display=Ee==="drive"?"block":"none",Y.classList.toggle("active",Ee==="general"),q.classList.toggle("active",Ee==="drive"),B.textContent=Ee==="general"?"General":"Google Drive"}let Y=document.createElement("button");Y.textContent="\u{1F6E0}\uFE0F";let Le=document.createElement("span");Le.className="ytls-tab-text",Le.textContent=" General",Y.appendChild(Le),_e(Y,"General settings"),Y.classList.add("ytls-settings-modal-button"),Y.onclick=()=>z("general");let q=document.createElement("button");q.textContent="\u2601\uFE0F";let ve=document.createElement("span");ve.className="ytls-tab-text",ve.textContent=" Backup",q.appendChild(ve),_e(q,"Google Drive sign-in and backup"),q.classList.add("ytls-settings-modal-button"),q.onclick=async()=>{H.isSignedIn&&await Xi(),z("drive")},y.appendChild(Y),y.appendChild(q),d.appendChild(y),d.appendChild(x),P.appendChild(d),A.className="ytls-button-grid",A.appendChild(F("\u{1F4BE} Save","Save As...",rt.onclick)),A.appendChild(F("\u{1F4C2} Load","Load",Rt.onclick)),A.appendChild(F("\u{1F4E4} Export All","Export All Data",ct.onclick)),A.appendChild(F("\u{1F4E5} Import All","Import All Data",Q.onclick)),A.appendChild(F("\u{1F4C4} Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await vr()}catch{alert("Failed to export CSV: Could not read from database.")}}));let Ie=F(H.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",H.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{H.isSignedIn?await Ji():await Yi(),Ie.textContent=H.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",_e(Ie,H.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive")});_.appendChild(Ie);let dt=F(nt?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await tr(),dt.textContent=nt?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off"});_.appendChild(dt);let Dt=F(`\u23F1\uFE0F Backup Interval: ${je}min`,"Set periodic backup interval (minutes)",async()=>{await nr(),Dt.textContent=`\u23F1\uFE0F Backup Interval: ${je}min`});_.appendChild(Dt),_.appendChild(F("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await yn(!1)}));let $e=document.createElement("div");$e.style.marginTop="15px",$e.style.paddingTop="10px",$e.style.borderTop="1px solid #555",$e.style.fontSize="12px",$e.style.color="#aaa";let Ct=document.createElement("div");Ct.style.marginBottom="8px",Ct.style.fontWeight="bold",$e.appendChild(Ct),qi(Ct);let go=document.createElement("div");go.style.marginBottom="8px",ji(go),$e.appendChild(go);let ii=document.createElement("div");Vi(ii),$e.appendChild(ii),_.appendChild($e),Pe(),vn(),Ze(),I.appendChild(B),I.appendChild(A),I.appendChild(_),z(h),P.appendChild(I),document.body.appendChild(P),requestAnimationFrame(()=>{let Ee=P.getBoundingClientRect(),mt=(window.innerHeight-Ee.height)/2;P.style.top=`${Math.max(20,mt)}px`,P.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Be,!0),document.addEventListener("keydown",We)},0)},We=function(h){if(h.key==="Escape"&&P&&P.parentNode===document.body){let d=document.getElementById("ytls-save-modal"),y=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");if(d||y||x)return;h.preventDefault(),d&&document.body.contains(d)&&document.body.removeChild(d),y&&document.body.contains(y)&&document.body.removeChild(y),x&&document.body.contains(x)&&document.body.removeChild(x),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",We)},300)}},Be=function(h){if(Tn&&Tn.contains(h.target))return;let d=document.getElementById("ytls-save-modal"),y=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");d&&d.contains(h.target)||y&&y.contains(h.target)||x&&x.contains(h.target)||P&&P.contains(h.target)||(d&&document.body.contains(d)&&document.body.removeChild(d),y&&document.body.contains(y)&&document.body.removeChild(y),x&&document.body.contains(x)&&document.body.removeChild(x),P&&P.parentNode===document.body&&(P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",We)},300)))},K=function(){n&&(u("Loading window position from IndexedDB"),_n("windowPosition").then(h=>{if(h&&typeof h.x=="number"&&typeof h.y=="number"){let y=h;n.style.left=`${y.x}px`,n.style.top=`${y.y}px`,n.style.right="auto",n.style.bottom="auto",typeof y.width=="number"&&y.width>0?n.style.width=`${y.width}px`:(n.style.width=`${Pt}px`,u(`No stored window width found, using default width ${Pt}px`)),typeof y.height=="number"&&y.height>0?n.style.height=`${y.height}px`:(n.style.height=`${xt}px`,u(`No stored window height found, using default height ${xt}px`));let x=X();te(x,y.x,y.y),u("Restored window position from IndexedDB:",Ae)}else u("No window position found in IndexedDB, applying default size and leaving default position"),n.style.width=`${Pt}px`,n.style.height=`${xt}px`,Ae=null;Ot();let d=X();d&&(d.width||d.height)&&te(d),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(h=>{u("failed to load pane position from IndexedDB:",h,"warn"),Ot();let d=X();d&&(d.width||d.height)&&(Ae={x:Math.max(0,Math.round(d.left)),y:0,width:Math.round(d.width),height:Math.round(d.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},pe=function(){if(!n)return;let h=X();if(!h)return;let d={x:Math.max(0,Math.round(h.left)),y:Math.max(0,Math.round(h.top)),width:Math.round(h.width),height:Math.round(h.height)};if(Ae&&Ae.x===d.x&&Ae.y===d.y&&Ae.width===d.width&&Ae.height===d.height){u("Skipping window position save; position and size unchanged");return}Ae={...d},u(`Saving window position and size to IndexedDB: x=${d.x}, y=${d.y}, width=${d.width}, height=${d.height}`),un("windowPosition",d),Zt({type:"window_position_updated",position:d,timestamp:Date.now()})},jn=function(h,d){h.addEventListener("dblclick",y=>{y.preventDefault(),y.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",pe(),dn())}),h.addEventListener("mousedown",y=>{y.preventDefault(),y.stopPropagation(),ut=!0,Mt=d,ni=y.clientX,oi=y.clientY;let x=n.getBoundingClientRect();_t=x.width,Nt=x.height,Gn=x.left,Un=x.top,d==="top-left"||d==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},dn=function(){if(n&&f&&w&&s){let h=n.getBoundingClientRect(),d=f.getBoundingClientRect(),y=w.getBoundingClientRect(),x=h.height-(d.height+y.height);s.style.maxHeight=x>0?x+"px":"0px",s.style.overflowY=x>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(h=>h.remove()),n=document.createElement("div"),f=document.createElement("div"),s=document.createElement("ul"),w=document.createElement("div"),T=document.createElement("span"),E=document.createElement("style"),C=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=h=>{h.stopPropagation(),le("drive")},s.addEventListener("mouseenter",()=>{xn=!0,nn=!1}),s.addEventListener("mouseleave",()=>{if(xn=!1,nn)return;let h=j(),d=h?Math.floor(h.getCurrentTime()):kt();Fn(d,!1);let y=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(y=document.activeElement.closest("li")?.dataset.guid??null),jo(),y){let I=ee().find(B=>B.dataset.guid===y)?.querySelector("input");if(I)try{I.focus({preventScroll:!0})}catch{}}}),n.id="ytls-pane",f.id="ytls-pane-header",f.addEventListener("dblclick",h=>{let d=h.target instanceof HTMLElement?h.target:null;d&&(d.closest("a")||d.closest("button")||d.closest("#ytls-current-time")||d.closest(".ytls-version-display")||d.closest(".ytls-backup-indicator"))||(h.preventDefault(),po(!1))});let o=GM_info.script.version;C.textContent=`v${o}`,C.classList.add("ytls-version-display");let i=document.createElement("span");i.style.display="inline-flex",i.style.alignItems="center",i.style.gap="6px",i.appendChild(C),i.appendChild(M),T.id="ytls-current-time",T.textContent="\u23F3",T.onclick=()=>{It=!0;let h=j();h&&h.seekToLiveHead(),setTimeout(()=>{It=!1},500)},_e(T,()=>{if(!Et)return"Current time";let h=document.createElement("div");h.className="ytls-video-tooltip";let d=document.createElement("img");d.className="ytls-video-thumb",d.src=Et.thumbnail_url||"",d.alt=Et.title||"",d.style.width="120px",d.style.height="68px",d.style.objectFit="cover",d.style.marginRight="8px",d.style.float="left";let y=document.createElement("div");return y.textContent=Et.title||"Unknown video",y.style.maxWidth="260px",y.style.fontWeight="500",h.appendChild(d),h.appendChild(y),h}),c(),re&&clearInterval(re),re=setInterval(c,1e3),w.id="ytls-buttons";let p=(h,d)=>()=>{h.classList.remove("ytls-fade-in"),h.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(h)&&document.body.removeChild(h),d&&d()},300)},b=h=>d=>{d.key==="Escape"&&(d.preventDefault(),d.stopPropagation(),h())},v=h=>{setTimeout(()=>{document.addEventListener("keydown",h)},0)},m=(h,d)=>y=>{h.contains(y.target)||d()},g=h=>{setTimeout(()=>{document.addEventListener("click",h,!0)},0)},$=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!s||s.querySelector(".ytls-error-message")||ue)return;let h=typeof zt<"u"?zt:0,d=j(),y=d?Math.floor(d.getCurrentTime()+h):0;if(!Number.isFinite(y))return;let x=ln(y,"");x&&x.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>le()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(h){if(!s||s.querySelector(".ytls-error-message")||ue){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let d=lo(),y=Math.max(kt(),0);if(d.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let x=h.ctrlKey,I=d.map(B=>{let A=bt(B.start,y);return x?`${A} ${B.comment} <!-- guid:${B.guid} -->`.trimStart():`${A} ${B.comment}`}).join(`
`);navigator.clipboard.writeText(I).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(B=>{u("Failed to copy timestamps: ",B,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!s||s.querySelector(".ytls-error-message")||ue)return;if(ee().length===0){alert("No timestamps available to offset.");return}let d=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(d===null)return;let y=d.trim();if(y.length===0)return;let x=Number.parseInt(y,10);if(!Number.isFinite(x)){alert("Please enter a valid integer number of seconds.");return}x!==0&&Go(x,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let h=$n();if(!h){alert("Unable to determine current video ID.");return}let d=document.createElement("div");d.id="ytls-delete-all-modal",d.classList.remove("ytls-fade-out"),d.classList.add("ytls-fade-in");let y=document.createElement("p");y.textContent="Hold the button to delete all timestamps for:",y.style.marginBottom="10px";let x=document.createElement("p");x.textContent=h,x.style.fontFamily="monospace",x.style.fontSize="12px",x.style.marginBottom="15px",x.style.color="#aaa";let I=document.createElement("button");I.classList.add("ytls-save-modal-button"),I.style.background="#d32f2f",I.style.position="relative",I.style.overflow="hidden";let B=null,A=0,_=null,z=document.createElement("div");z.style.position="absolute",z.style.left="0",z.style.top="0",z.style.height="100%",z.style.width="0%",z.style.background="#ff6b6b",z.style.transition="none",z.style.pointerEvents="none",I.appendChild(z);let Y=document.createElement("span");Y.textContent="Hold to Delete All",Y.style.position="relative",Y.style.zIndex="1",I.appendChild(Y);let Le=()=>{if(!A)return;let $e=Date.now()-A,Ct=Math.min($e/5e3*100,100);z.style.width=`${Ct}%`,Ct<100&&(_=requestAnimationFrame(Le))},q=()=>{B&&(clearTimeout(B),B=null),_&&(cancelAnimationFrame(_),_=null),A=0,z.style.width="0%",Y.textContent="Hold to Delete All"};I.onmousedown=()=>{A=Date.now(),Y.textContent="Deleting...",_=requestAnimationFrame(Le),B=setTimeout(async()=>{q(),d.classList.remove("ytls-fade-in"),d.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(d)&&document.body.removeChild(d);try{await Er(h),ho()}catch($e){u("Failed to delete all timestamps:",$e,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},I.onmouseup=q,I.onmouseleave=q;let ve=null,Ie=null,dt=p(d,()=>{q(),ve&&document.removeEventListener("keydown",ve),Ie&&document.removeEventListener("click",Ie,!0)});ve=b(dt),Ie=m(d,dt);let Dt=document.createElement("button");Dt.textContent="Cancel",Dt.classList.add("ytls-save-modal-cancel-button"),Dt.onclick=dt,d.appendChild(y),d.appendChild(x),d.appendChild(I),d.appendChild(Dt),document.body.appendChild(d),v(ve),g(Ie)}}],fe=ri();$.forEach(h=>{let d=document.createElement("button");if(d.textContent=h.label,_e(d,h.title),d.classList.add("ytls-main-button"),h.label==="\u{1F423}"&&fe){let y=document.createElement("span");y.textContent=fe,y.classList.add("ytls-holiday-emoji"),d.appendChild(y)}h.label==="\u{1F4CB}"?d.onclick=function(y){h.action.call(this,y)}:d.onclick=h.action,h.label==="\u2699\uFE0F"&&(Tn=d),w.appendChild(d)});let rt=document.createElement("button");rt.textContent="\u{1F4BE} Save",rt.classList.add("ytls-file-operation-button"),rt.onclick=()=>{let h=document.createElement("div");h.id="ytls-save-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let d=document.createElement("p");d.textContent="Save as:";let y=null,x=null,I=p(h,()=>{y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0)});y=b(I),x=m(h,I);let B=document.createElement("button");B.textContent="JSON",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0),p(h,()=>Vo("json"))()};let A=document.createElement("button");A.textContent="Plain Text",A.classList.add("ytls-save-modal-button"),A.onclick=()=>{y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0),p(h,()=>Vo("text"))()};let _=document.createElement("button");_.textContent="Cancel",_.classList.add("ytls-save-modal-cancel-button"),_.onclick=I,h.appendChild(d),h.appendChild(B),h.appendChild(A),h.appendChild(_),document.body.appendChild(h),v(y),g(x)};let Rt=document.createElement("button");Rt.textContent="\u{1F4C2} Load",Rt.classList.add("ytls-file-operation-button"),Rt.onclick=()=>{let h=document.createElement("div");h.id="ytls-load-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let d=document.createElement("p");d.textContent="Load from:";let y=null,x=null,I=p(h,()=>{y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0)});y=b(I),x=m(h,I);let B=document.createElement("button");B.textContent="File",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{let z=document.createElement("input");z.type="file",z.accept=".json,.txt",z.classList.add("ytls-hidden-file-input"),z.onchange=Y=>{let Le=Y.target.files?.[0];if(!Le)return;y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0),I();let q=new FileReader;q.onload=()=>{let ve=String(q.result).trim();Qo(ve)},q.readAsText(Le)},z.click()};let A=document.createElement("button");A.textContent="Clipboard",A.classList.add("ytls-save-modal-button"),A.onclick=async()=>{y&&document.removeEventListener("keydown",y),x&&document.removeEventListener("click",x,!0),p(h,async()=>{try{let z=await navigator.clipboard.readText();z?Qo(z.trim()):alert("Clipboard is empty.")}catch(z){u("Failed to read from clipboard: ",z,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let _=document.createElement("button");_.textContent="Cancel",_.classList.add("ytls-save-modal-cancel-button"),_.onclick=I,h.appendChild(d),h.appendChild(B),h.appendChild(A),h.appendChild(_),document.body.appendChild(h),v(y),g(x)};let ct=document.createElement("button");ct.textContent="\u{1F4E4} Export",ct.classList.add("ytls-file-operation-button"),ct.onclick=async()=>{try{await gr()}catch{alert("Failed to export data: Could not read from database.")}};let Q=document.createElement("button");Q.textContent="\u{1F4E5} Import",Q.classList.add("ytls-file-operation-button"),Q.onclick=()=>{let h=document.createElement("input");h.type="file",h.accept=".json",h.classList.add("ytls-hidden-file-input"),h.onchange=d=>{let y=d.target.files?.[0];if(!y)return;let x=new FileReader;x.onload=()=>{try{let I=JSON.parse(String(x.result)),B=[];for(let A in I)if(Object.prototype.hasOwnProperty.call(I,A)&&A.startsWith("ytls-")){let _=A.substring(5),z=I[A];if(z&&typeof z.video_id=="string"&&Array.isArray(z.timestamps)){let Y=z.timestamps.map(q=>({...q,guid:q.guid||crypto.randomUUID()})),Le=Zo(_,Y).then(()=>u(`Imported ${_} to IndexedDB`)).catch(q=>u(`Failed to import ${_} to IndexedDB:`,q,"error"));B.push(Le)}else u(`Skipping key ${A} during import due to unexpected data format.`,"warn")}Promise.all(B).then(()=>{ho()}).catch(A=>{alert("An error occurred during import to IndexedDB. Check console for details."),u("Overall import error:",A,"error")})}catch(I){alert(`Failed to import data. Please ensure the file is in the correct format.
`+I.message),u("Import error:",I,"error")}},x.readAsText(y)},h.click()},E.textContent=Si,s.onclick=h=>{Uo(h)},s.ontouchstart=h=>{Uo(h)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",K(),setTimeout(()=>Ot(),10);let ie=!1,ne,ye,He=!1;n.addEventListener("mousedown",h=>{let d=h.target;d instanceof Element&&(d instanceof HTMLInputElement||d instanceof HTMLTextAreaElement||d!==f&&!f.contains(d)&&window.getComputedStyle(d).cursor==="pointer"||(ie=!0,He=!1,ne=h.clientX-n.getBoundingClientRect().left,ye=h.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",Sn=h=>{if(!ie)return;He=!0;let d=h.clientX-ne,y=h.clientY-ye,x=n.getBoundingClientRect(),I=x.width,B=x.height,A=document.documentElement.clientWidth,_=document.documentElement.clientHeight;d=Math.max(0,Math.min(d,A-I)),y=Math.max(0,Math.min(y,_-B)),n.style.left=`${d}px`,n.style.top=`${y}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",kn=()=>{if(!ie)return;ie=!1;let h=He;setTimeout(()=>{He=!1},50),Ot(),setTimeout(()=>{h&&pe()},200)}),n.addEventListener("dragstart",h=>h.preventDefault());let tt=document.createElement("div"),Ht=document.createElement("div"),Nn=document.createElement("div"),$t=document.createElement("div");tt.id="ytls-resize-tl",Ht.id="ytls-resize-tr",Nn.id="ytls-resize-bl",$t.id="ytls-resize-br";let ut=!1,ni=0,oi=0,_t=0,Nt=0,Gn=0,Un=0,Mt=null;jn(tt,"top-left"),jn(Ht,"top-right"),jn(Nn,"bottom-left"),jn($t,"bottom-right"),document.addEventListener("mousemove",h=>{if(!ut||!n||!Mt)return;let d=h.clientX-ni,y=h.clientY-oi,x=_t,I=Nt,B=Gn,A=Un,_=document.documentElement.clientWidth,z=document.documentElement.clientHeight;Mt==="bottom-right"?(x=Math.max(200,Math.min(800,_t+d)),I=Math.max(250,Math.min(z,Nt+y))):Mt==="top-left"?(x=Math.max(200,Math.min(800,_t-d)),B=Gn+d,I=Math.max(250,Math.min(z,Nt-y)),A=Un+y):Mt==="top-right"?(x=Math.max(200,Math.min(800,_t+d)),I=Math.max(250,Math.min(z,Nt-y)),A=Un+y):Mt==="bottom-left"&&(x=Math.max(200,Math.min(800,_t-d)),B=Gn+d,I=Math.max(250,Math.min(z,Nt+y))),B=Math.max(0,Math.min(B,_-x)),A=Math.max(0,Math.min(A,z-I)),n.style.width=`${x}px`,n.style.height=`${I}px`,n.style.left=`${B}px`,n.style.top=`${A}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{ut&&(ut=!1,Mt=null,document.body.style.cursor="",N(!0))});let Vn=null;window.addEventListener("resize",Ln=()=>{Vn&&clearTimeout(Vn),Vn=setTimeout(()=>{N(!0),Vn=null},200)}),f.appendChild(T),f.appendChild(i);let qn=document.createElement("div");if(qn.id="ytls-content",qn.append(s),qn.append(w),n.append(f,qn,E,tt,Ht,Nn,$t),n.addEventListener("mousemove",h=>{try{if(ie||ut)return;let d=n.getBoundingClientRect(),y=20,x=h.clientX,I=h.clientY,B=x-d.left<=y,A=d.right-x<=y,_=I-d.top<=y,z=d.bottom-I<=y,Y="";_&&B||z&&A?Y="nwse-resize":_&&A||z&&B?Y="nesw-resize":Y="",document.body.style.cursor=Y}catch{}}),n.addEventListener("mouseleave",()=>{!ut&&!ie&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=dn,setTimeout(()=>{if(dn(),n&&f&&w&&s){let h=40,d=ee();if(d.length>0)h=d[0].offsetHeight;else{let y=document.createElement("li");y.style.visibility="hidden",y.style.position="absolute",y.textContent="00:00 Example",s.appendChild(y),h=y.offsetHeight,s.removeChild(y)}O=f.offsetHeight+w.offsetHeight+h,n.style.minHeight=O+"px"}},0),window.addEventListener("resize",dn),Qe){try{Qe.disconnect()}catch{}Qe=null}Qe=new ResizeObserver(dn),Qe.observe(n),en||document.addEventListener("pointerdown",en=()=>{$o=Date.now()},!0),tn||document.addEventListener("pointerup",tn=()=>{},!0)}finally{so=!1}}}async function Ir(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(c=>{c!==n&&(u("Removing duplicate pane element from DOM"),c.remove())}),document.body.contains(n)){u("Pane already in DOM, skipping append");return}await kr(),typeof Po=="function"&&Po(Yo),typeof oo=="function"&&oo(un),typeof io=="function"&&io(_n),typeof Bo=="function"&&Bo(M),await zo(),await er(),await Wt(),typeof qt=="function"&&qt();let i=document.querySelectorAll("#ytls-pane");if(i.length>0&&(u(`WARNING: Found ${i.length} existing pane(s) in DOM, removing all`),i.forEach(c=>c.remove())),document.body.contains(n)){u("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(n),u("Pane successfully appended to DOM"),oe(),me&&(clearTimeout(me),me=null),me=setTimeout(()=>{R(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),N(!0),me=null},450),Xe){try{Xe.disconnect()}catch{}Xe=null}Xe=new MutationObserver(()=>{let c=document.querySelectorAll("#ytls-pane");c.length>1&&(u(`CRITICAL: Multiple panes detected (${c.length}), removing duplicates`),c.forEach((p,b)=>{(b>0||n&&p!==n)&&p.remove()}))}),Xe.observe(document.body,{childList:!0,subtree:!0})}function ei(o=0){if(document.getElementById("ytls-header-button")){lt();return}let i=document.querySelector("#logo");if(!i||!i.parentElement){o<10&&setTimeout(()=>ei(o+1),300);return}let c=document.createElement("button");c.id="ytls-header-button",c.type="button",c.className="ytls-header-button",_e(c,"Toggle Timekeeper UI"),c.setAttribute("aria-label","Toggle Timekeeper UI");let p=document.createElement("img");p.src=Te,p.alt="",p.decoding="async",c.appendChild(p),yt=p,c.addEventListener("mouseenter",()=>{yt&&(En=!0,yt.src=Me)}),c.addEventListener("mouseleave",()=>{yt&&(En=!1,lt())}),c.addEventListener("click",()=>{n&&!document.body.contains(n)&&(u("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),po()}),i.insertAdjacentElement("afterend",c),lt(),u("Timekeeper header button added next to YouTube logo")}function ti(){if(W)return;W=!0;let o=history.pushState,i=history.replaceState;function c(){try{let p=new Event("locationchange");window.dispatchEvent(p)}catch{}}history.pushState=function(){let p=o.apply(this,arguments);return c(),p},history.replaceState=function(){let p=i.apply(this,arguments);return c(),p},window.addEventListener("popstate",c),window.addEventListener("locationchange",()=>{window.location.href!==Z&&u("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function ho(){if(!l()){ur();return}Z=window.location.href,document.querySelectorAll("#ytls-pane").forEach((i,c)=>{(c>0||n&&i!==n)&&i.remove()}),await de(),await Lr(),ge=$n();let o=document.title;u("Page Title:",o),u("Video ID:",ge),u("Current URL:",window.location.href),mo(!0),Lt(),ke(),await Wo(),ke(),mo(!1),u("Timestamps loaded and UI unlocked for video:",ge),await Ho(),await Ir(),ei(),mr()}ti(),window.addEventListener("yt-navigate-start",()=>{u("Navigation started (yt-navigate-start event fired)"),l()&&n&&s&&(u("Locking UI and showing loading state for navigation"),mo(!0))}),Qt=o=>{o.ctrlKey&&o.altKey&&o.shiftKey&&(o.key==="T"||o.key==="t")&&(o.preventDefault(),po(),u("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",Qt),window.addEventListener("yt-navigate-finish",()=>{u("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==Z?ho():u("Navigation finished but URL already handled, skipping.")}),ti(),u("Timekeeper initialized and waiting for navigation events")})();})();

