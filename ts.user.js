// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.3.5
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

(()=>{function c(e,...i){let r="debug",a=[...i];i.length>0&&typeof i[i.length-1]=="string"&&["debug","info","warn","error"].includes(i[i.length-1])&&(r=a.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[r](`${n} ${e}`,...a)}function yt(e,i=e){let r=Math.floor(e/3600),a=Math.floor(e%3600/60),f=String(e%60).padStart(2,"0");return i<3600?`${a<10?a:String(a).padStart(2,"0")}:${f}`:`${i>=36e3?String(r).padStart(2,"0"):r}:${String(a).padStart(2,"0")}:${f}`}function jo(e,i=window.location.href){try{let r=new URL(i);return r.searchParams.set("t",`${e}s`),r.toString()}catch{return`https://www.youtube.com/watch?v=${i.search(/[?&]v=/)>=0?i.split(/[?&]v=/)[1].split(/&/)[0]:i.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function mo(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var Ki=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function Vo(){let e=new Date,i=e.getFullYear(),r=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let a of Ki){let f=new Date(i,a.month-1,a.day),n=f.getTime()-e.getTime(),v=n/(1e3*60*60*24);if(v<=5&&v>=-2)return c(`Current date: ${r}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(v)}`),a.emoji;if(v<-2&&(f=new Date(i+1,a.month-1,a.day),n=f.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return c(`Current date: ${r}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(v)}`),a.emoji;if(v>5&&(f=new Date(i-1,a.month-1,a.day),n=f.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return c(`Current date: ${r}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(v)}`),a.emoji}return c(`Current date: ${r}, No holiday emoji (not within range)`),null}var vt=null,Nt=null,Yi=500;function Zi(){return(!vt||!document.body.contains(vt))&&(vt=document.createElement("div"),vt.className="ytls-tooltip",document.body.appendChild(vt)),vt}function Ji(e,i,r){let f=window.innerWidth,n=window.innerHeight,v=e.getBoundingClientRect(),s=v.width,S=v.height,E=i+10,w=r+10;E+s>f-10&&(E=i-s-10),w+S>n-10&&(w=r-S-10),E=Math.max(10,Math.min(E,f-s-10)),w=Math.max(10,Math.min(w,n-S-10)),e.style.left=`${E}px`,e.style.top=`${w}px`}function Xi(e,i,r){Nt&&clearTimeout(Nt),Nt=setTimeout(()=>{let a=Zi();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),Ji(a,i,r),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})},Yi)}function Qi(){Nt&&(clearTimeout(Nt),Nt=null),vt&&vt.classList.remove("ytls-tooltip-visible")}function je(e,i){let r=0,a=0,f=s=>{r=s.clientX,a=s.clientY;let S=typeof i=="function"?i():i;S&&Xi(S,r,a)},n=s=>{r=s.clientX,a=s.clientY},v=()=>{Qi()};e.addEventListener("mouseenter",f),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",v),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",f),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",v)}}var Wo=`
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

`;var we=Uint8Array,Ge=Uint16Array,vo=Int32Array,bo=new we([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),xo=new we([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Ko=new we([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),ei=function(e,i){for(var r=new Ge(31),a=0;a<31;++a)r[a]=i+=1<<e[a-1];for(var f=new vo(r[30]),a=1;a<30;++a)for(var n=r[a];n<r[a+1];++n)f[n]=n-r[a]<<5|a;return{b:r,r:f}},ti=ei(bo,2),er=ti.b,po=ti.r;er[28]=258,po[258]=28;var ni=ei(xo,0),Ar=ni.b,Yo=ni.r,ho=new Ge(32768);for(_=0;_<32768;++_)ct=(_&43690)>>1|(_&21845)<<1,ct=(ct&52428)>>2|(ct&13107)<<2,ct=(ct&61680)>>4|(ct&3855)<<4,ho[_]=((ct&65280)>>8|(ct&255)<<8)>>1;var ct,_,dn=(function(e,i,r){for(var a=e.length,f=0,n=new Ge(i);f<a;++f)e[f]&&++n[e[f]-1];var v=new Ge(i);for(f=1;f<i;++f)v[f]=v[f-1]+n[f-1]<<1;var s;if(r){s=new Ge(1<<i);var S=15-i;for(f=0;f<a;++f)if(e[f])for(var E=f<<4|e[f],w=i-e[f],D=v[e[f]-1]++<<w,M=D|(1<<w)-1;D<=M;++D)s[ho[D]>>S]=E}else for(s=new Ge(a),f=0;f<a;++f)e[f]&&(s[f]=ho[v[e[f]-1]++]>>15-e[f]);return s}),Lt=new we(288);for(_=0;_<144;++_)Lt[_]=8;var _;for(_=144;_<256;++_)Lt[_]=9;var _;for(_=256;_<280;++_)Lt[_]=7;var _;for(_=280;_<288;++_)Lt[_]=8;var _,_n=new we(32);for(_=0;_<32;++_)_n[_]=5;var _,tr=dn(Lt,9,0);var nr=dn(_n,5,0);var oi=function(e){return(e+7)/8|0},ii=function(e,i,r){return(i==null||i<0)&&(i=0),(r==null||r>e.length)&&(r=e.length),new we(e.subarray(i,r))};var or=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Vn=function(e,i,r){var a=new Error(i||or[e]);if(a.code=e,Error.captureStackTrace&&Error.captureStackTrace(a,Vn),!r)throw a;return a};var ut=function(e,i,r){r<<=i&7;var a=i/8|0;e[a]|=r,e[a+1]|=r>>8},cn=function(e,i,r){r<<=i&7;var a=i/8|0;e[a]|=r,e[a+1]|=r>>8,e[a+2]|=r>>16},fo=function(e,i){for(var r=[],a=0;a<e.length;++a)e[a]&&r.push({s:a,f:e[a]});var f=r.length,n=r.slice();if(!f)return{t:ai,l:0};if(f==1){var v=new we(r[0].s+1);return v[r[0].s]=1,{t:v,l:1}}r.sort(function(pe,ke){return pe.f-ke.f}),r.push({s:-1,f:25001});var s=r[0],S=r[1],E=0,w=1,D=2;for(r[0]={s:-1,f:s.f+S.f,l:s,r:S};w!=f-1;)s=r[r[E].f<r[D].f?E++:D++],S=r[E!=w&&r[E].f<r[D].f?E++:D++],r[w++]={s:-1,f:s.f+S.f,l:s,r:S};for(var M=n[0].s,a=1;a<f;++a)n[a].s>M&&(M=n[a].s);var H=new Ge(M+1),Z=go(r[w-1],H,0);if(Z>i){var a=0,K=0,Q=Z-i,oe=1<<Q;for(n.sort(function(ke,re){return H[re.s]-H[ke.s]||ke.f-re.f});a<f;++a){var G=n[a].s;if(H[G]>i)K+=oe-(1<<Z-H[G]),H[G]=i;else break}for(K>>=Q;K>0;){var ce=n[a].s;H[ce]<i?K-=1<<i-H[ce]++-1:++a}for(;a>=0&&K;--a){var J=n[a].s;H[J]==i&&(--H[J],++K)}Z=i}return{t:new we(H),l:Z}},go=function(e,i,r){return e.s==-1?Math.max(go(e.l,i,r+1),go(e.r,i,r+1)):i[e.s]=r},Zo=function(e){for(var i=e.length;i&&!e[--i];);for(var r=new Ge(++i),a=0,f=e[0],n=1,v=function(S){r[a++]=S},s=1;s<=i;++s)if(e[s]==f&&s!=i)++n;else{if(!f&&n>2){for(;n>138;n-=138)v(32754);n>2&&(v(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(v(f),--n;n>6;n-=6)v(8304);n>2&&(v(n-3<<5|8208),n=0)}for(;n--;)v(f);n=1,f=e[s]}return{c:r.subarray(0,a),n:i}},un=function(e,i){for(var r=0,a=0;a<i.length;++a)r+=e[a]*i[a];return r},ri=function(e,i,r){var a=r.length,f=oi(i+2);e[f]=a&255,e[f+1]=a>>8,e[f+2]=e[f]^255,e[f+3]=e[f+1]^255;for(var n=0;n<a;++n)e[f+n+4]=r[n];return(f+4+a)*8},Jo=function(e,i,r,a,f,n,v,s,S,E,w){ut(i,w++,r),++f[256];for(var D=fo(f,15),M=D.t,H=D.l,Z=fo(n,15),K=Z.t,Q=Z.l,oe=Zo(M),G=oe.c,ce=oe.n,J=Zo(K),pe=J.c,ke=J.n,re=new Ge(19),U=0;U<G.length;++U)++re[G[U]&31];for(var U=0;U<pe.length;++U)++re[pe[U]&31];for(var $=fo(re,7),ae=$.t,ue=$.l,se=19;se>4&&!ae[Ko[se-1]];--se);var Fe=E+5<<3,Te=un(f,Lt)+un(n,_n)+v,De=un(f,M)+un(n,K)+v+14+3*se+un(re,ae)+2*re[16]+3*re[17]+7*re[18];if(S>=0&&Fe<=Te&&Fe<=De)return ri(i,w,e.subarray(S,S+E));var qe,de,Ae,Qe;if(ut(i,w,1+(De<Te)),w+=2,De<Te){qe=dn(M,H,0),de=M,Ae=dn(K,Q,0),Qe=K;var Vt=dn(ae,ue,0);ut(i,w,ce-257),ut(i,w+5,ke-1),ut(i,w+10,se-4),w+=14;for(var U=0;U<se;++U)ut(i,w+3*U,ae[Ko[U]]);w+=3*se;for(var He=[G,pe],$e=0;$e<2;++$e)for(var Be=He[$e],U=0;U<Be.length;++U){var j=Be[U]&31;ut(i,w,Vt[j]),w+=ae[j],j>15&&(ut(i,w,Be[U]>>5&127),w+=Be[U]>>12)}}else qe=tr,de=Lt,Ae=nr,Qe=_n;for(var U=0;U<s;++U){var le=a[U];if(le>255){var j=le>>18&31;cn(i,w,qe[j+257]),w+=de[j+257],j>7&&(ut(i,w,le>>23&31),w+=bo[j]);var dt=le&31;cn(i,w,Ae[dt]),w+=Qe[dt],dt>3&&(cn(i,w,le>>5&8191),w+=xo[dt])}else cn(i,w,qe[le]),w+=de[le]}return cn(i,w,qe[256]),w+de[256]},ir=new vo([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),ai=new we(0),rr=function(e,i,r,a,f,n){var v=n.z||e.length,s=new we(a+v+5*(1+Math.ceil(v/7e3))+f),S=s.subarray(a,s.length-f),E=n.l,w=(n.r||0)&7;if(i){w&&(S[0]=n.r>>3);for(var D=ir[i-1],M=D>>13,H=D&8191,Z=(1<<r)-1,K=n.p||new Ge(32768),Q=n.h||new Ge(Z+1),oe=Math.ceil(r/3),G=2*oe,ce=function(Ct){return(e[Ct]^e[Ct+1]<<oe^e[Ct+2]<<G)&Z},J=new vo(25e3),pe=new Ge(288),ke=new Ge(32),re=0,U=0,$=n.i||0,ae=0,ue=n.w||0,se=0;$+2<v;++$){var Fe=ce($),Te=$&32767,De=Q[Fe];if(K[Te]=De,Q[Fe]=Te,ue<=$){var qe=v-$;if((re>7e3||ae>24576)&&(qe>423||!E)){w=Jo(e,S,0,J,pe,ke,U,ae,se,$-se,w),ae=re=U=0,se=$;for(var de=0;de<286;++de)pe[de]=0;for(var de=0;de<30;++de)ke[de]=0}var Ae=2,Qe=0,Vt=H,He=Te-De&32767;if(qe>2&&Fe==ce($-He))for(var $e=Math.min(M,qe)-1,Be=Math.min(32767,$),j=Math.min(258,qe);He<=Be&&--Vt&&Te!=De;){if(e[$+Ae]==e[$+Ae-He]){for(var le=0;le<j&&e[$+le]==e[$+le-He];++le);if(le>Ae){if(Ae=le,Qe=He,le>$e)break;for(var dt=Math.min(He,le-2),gn=0,de=0;de<dt;++de){var It=$-He+de&32767,Xn=K[It],Wt=It-Xn&32767;Wt>gn&&(gn=Wt,De=It)}}}Te=De,De=K[Te],He+=Te-De&32767}if(Qe){J[ae++]=268435456|po[Ae]<<18|Yo[Qe];var yn=po[Ae]&31,et=Yo[Qe]&31;U+=bo[yn]+xo[et],++pe[257+yn],++ke[et],ue=$+Ae,++re}else J[ae++]=e[$],++pe[e[$]]}}for($=Math.max($,ue);$<v;++$)J[ae++]=e[$],++pe[e[$]];w=Jo(e,S,E,J,pe,ke,U,ae,se,$-se,w),E||(n.r=w&7|S[w/8|0]<<3,w-=7,n.h=Q,n.p=K,n.i=$,n.w=ue)}else{for(var $=n.w||0;$<v+E;$+=65535){var tt=$+65535;tt>=v&&(S[w/8|0]=E,tt=v),w=ri(S,w+1,e.subarray($,tt))}n.i=v}return ii(s,0,a+oi(w)+f)},ar=(function(){for(var e=new Int32Array(256),i=0;i<256;++i){for(var r=i,a=9;--a;)r=(r&1&&-306674912)^r>>>1;e[i]=r}return e})(),sr=function(){var e=-1;return{p:function(i){for(var r=e,a=0;a<i.length;++a)r=ar[r&255^i[a]]^r>>>8;e=r},d:function(){return~e}}};var lr=function(e,i,r,a,f){if(!f&&(f={l:1},i.dictionary)){var n=i.dictionary.subarray(-32768),v=new we(n.length+e.length);v.set(n),v.set(e,n.length),e=v,f.w=n.length}return rr(e,i.level==null?6:i.level,i.mem==null?f.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+i.mem,r,a,f)},si=function(e,i){var r={};for(var a in e)r[a]=e[a];for(var a in i)r[a]=i[a];return r};var xe=function(e,i,r){for(;r;++i)e[i]=r,r>>>=8};function cr(e,i){return lr(e,i||{},0,0)}var li=function(e,i,r,a){for(var f in e){var n=e[f],v=i+f,s=a;Array.isArray(n)&&(s=si(a,n[1]),n=n[0]),n instanceof we?r[v]=[n,s]:(r[v+="/"]=[new we(0),s],li(n,v,r,a))}},Xo=typeof TextEncoder<"u"&&new TextEncoder,ur=typeof TextDecoder<"u"&&new TextDecoder,dr=0;try{ur.decode(ai,{stream:!0}),dr=1}catch{}function jn(e,i){if(i){for(var r=new we(e.length),a=0;a<e.length;++a)r[a]=e.charCodeAt(a);return r}if(Xo)return Xo.encode(e);for(var f=e.length,n=new we(e.length+(e.length>>1)),v=0,s=function(w){n[v++]=w},a=0;a<f;++a){if(v+5>n.length){var S=new we(v+8+(f-a<<1));S.set(n),n=S}var E=e.charCodeAt(a);E<128||i?s(E):E<2048?(s(192|E>>6),s(128|E&63)):E>55295&&E<57344?(E=65536+(E&1047552)|e.charCodeAt(++a)&1023,s(240|E>>18),s(128|E>>12&63),s(128|E>>6&63),s(128|E&63)):(s(224|E>>12),s(128|E>>6&63),s(128|E&63))}return ii(n,0,v)}var yo=function(e){var i=0;if(e)for(var r in e){var a=e[r].length;a>65535&&Vn(9),i+=a+4}return i},Qo=function(e,i,r,a,f,n,v,s){var S=a.length,E=r.extra,w=s&&s.length,D=yo(E);xe(e,i,v!=null?33639248:67324752),i+=4,v!=null&&(e[i++]=20,e[i++]=r.os),e[i]=20,i+=2,e[i++]=r.flag<<1|(n<0&&8),e[i++]=f&&8,e[i++]=r.compression&255,e[i++]=r.compression>>8;var M=new Date(r.mtime==null?Date.now():r.mtime),H=M.getFullYear()-1980;if((H<0||H>119)&&Vn(10),xe(e,i,H<<25|M.getMonth()+1<<21|M.getDate()<<16|M.getHours()<<11|M.getMinutes()<<5|M.getSeconds()>>1),i+=4,n!=-1&&(xe(e,i,r.crc),xe(e,i+4,n<0?-n-2:n),xe(e,i+8,r.size)),xe(e,i+12,S),xe(e,i+14,D),i+=16,v!=null&&(xe(e,i,w),xe(e,i+6,r.attrs),xe(e,i+10,v),i+=14),e.set(a,i),i+=S,D)for(var Z in E){var K=E[Z],Q=K.length;xe(e,i,+Z),xe(e,i+2,Q),e.set(K,i+4),i+=4+Q}return w&&(e.set(s,i),i+=w),i},mr=function(e,i,r,a,f){xe(e,i,101010256),xe(e,i+8,r),xe(e,i+10,r),xe(e,i+12,a),xe(e,i+16,f)};function ci(e,i){i||(i={});var r={},a=[];li(e,"",r,i);var f=0,n=0;for(var v in r){var s=r[v],S=s[0],E=s[1],w=E.level==0?0:8,D=jn(v),M=D.length,H=E.comment,Z=H&&jn(H),K=Z&&Z.length,Q=yo(E.extra);M>65535&&Vn(11);var oe=w?cr(S,E):S,G=oe.length,ce=sr();ce.p(S),a.push(si(E,{size:S.length,crc:ce.d(),c:oe,f:D,m:Z,u:M!=v.length||Z&&H.length!=K,o:f,compression:w})),f+=30+M+Q+G,n+=76+2*(M+Q)+(K||0)+G}for(var J=new we(n+22),pe=f,ke=n-f,re=0;re<a.length;++re){var D=a[re];Qo(J,D.o,D,D.f,D.u,D.c.length);var U=30+D.f.length+yo(D.extra);J.set(D.c,D.o+U),Qo(J,f,D,D.f,D.u,D.c.length,D.o,D.m),f+=16+U+(D.m?D.m.length:0)}return mr(J,f,a.length,ke,pe),J}var O={isSignedIn:!1,accessToken:null,userName:null,email:null},Xe=!0,Ue=30,Ke=null,Ut=!1,Gt=0,We=null,wo=null,ve=null,V=null,Wn=null;function fi(e){wo=e}function pi(e){ve=e}function hi(e){V=e}function To(e){Wn=e}var ui=!1;function gi(){if(!ui)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),ui=!0}catch{}}var yi=null,mn=null,fn=null;function Eo(e){yi=e}function Yn(e){mn=e}function Zn(e){fn=e}var di="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",fr="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",pr="https://www.youtube.com/",hr=30*1e3,gr=1800*1e3,mi=5,Kn=null,Ve=null;async function ko(){try{let e=await fn("googleAuthState");e&&typeof e=="object"&&(O={...O,...e},hn(),O.isSignedIn&&O.accessToken&&await jt(!0))}catch(e){c("Failed to load Google auth state:",e,"error")}}async function Jn(){try{await mn("googleAuthState",O)}catch(e){c("Failed to save Google auth state:",e,"error")}}function hn(){wo&&(wo.style.display="none")}function Pe(e,i){if(V){if(V.style.fontWeight="bold",e==="authenticating"){for(gi(),V.style.color="#ffa500";V.firstChild;)V.removeChild(V.firstChild);let r=document.createElement("span");r.className="tk-auth-spinner";let a=document.createTextNode(` ${i||"Authorizing with Google\u2026"}`);V.appendChild(r),V.appendChild(a);return}if(e==="error"){V.textContent=`\u274C ${i||"Authorization failed"}`,V.style.color="#ff4d4f",_t();return}O.isSignedIn?(V.textContent="\u2705 Signed in",V.style.color="#52c41a",V.removeAttribute("title"),O.userName?(V.onmouseenter=()=>{V.textContent=`\u2705 Signed in as ${O.userName}`},V.onmouseleave=()=>{V.textContent="\u2705 Signed in"}):(V.onmouseenter=null,V.onmouseleave=null)):(V.textContent="\u274C Not signed in",V.style.color="#ff4d4f",V.removeAttribute("title"),V.onmouseenter=null,V.onmouseleave=null),_t()}}function yr(){V&&(gi(),V.classList.remove("tk-auth-blink"),V.offsetWidth,V.classList.add("tk-auth-blink"),setTimeout(()=>{V.classList.remove("tk-auth-blink")},1200))}function vr(e){return new Promise((i,r)=>{if(!e){c&&c("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}c&&c("OAuth monitor: starting to monitor popup for token");let a=Date.now(),f=300*1e3,n="timekeeper_oauth",v=null,s=null,S=null,E=()=>{if(v){try{v.close()}catch{}v=null}s&&(clearInterval(s),s=null),S&&(clearInterval(S),S=null)};try{v=new BroadcastChannel(n),c&&c("OAuth monitor: BroadcastChannel created successfully"),v.onmessage=M=>{if(c&&c("OAuth monitor: received BroadcastChannel message",M.data),M.data?.type==="timekeeper_oauth_token"&&M.data?.token){c&&c("OAuth monitor: token received via BroadcastChannel"),E();try{e.close()}catch{}i(M.data.token)}else if(M.data?.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),E();try{e.close()}catch{}r(new Error(M.data.error||"OAuth failed"))}}}catch(M){c&&c("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",M)}c&&c("OAuth monitor: setting up IndexedDB polling");let w=Date.now();s=setInterval(async()=>{try{let M=indexedDB.open("ytls-timestamps-db",3);M.onsuccess=()=>{let H=M.result,Q=H.transaction("settings","readonly").objectStore("settings").get("oauth_message");Q.onsuccess=()=>{let oe=Q.result;if(oe&&oe.value){let G=oe.value;if(G.timestamp&&G.timestamp>w){if(c&&c("OAuth monitor: received IndexedDB message",G),G.type==="timekeeper_oauth_token"&&G.token){c&&c("OAuth monitor: token received via IndexedDB"),E();try{e.close()}catch{}H.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(G.token)}else if(G.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via IndexedDB",G.error,"error"),E();try{e.close()}catch{}H.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(G.error||"OAuth failed"))}w=G.timestamp}}H.close()}}}catch(M){c&&c("OAuth monitor: IndexedDB polling error",M,"error")}},500),S=setInterval(()=>{if(Date.now()-a>f){c&&c("OAuth monitor: popup timed out after 5 minutes",null,"error"),E();try{e.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function vi(){if(!di){Pe("error","Google Client ID not configured");return}try{c&&c("OAuth signin: starting OAuth flow"),Pe("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",di),e.searchParams.set("redirect_uri",pr),e.searchParams.set("response_type","token"),e.searchParams.set("scope",fr),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),c&&c("OAuth signin: opening popup");let i=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!i){c&&c("OAuth signin: popup blocked by browser",null,"error"),Pe("error","Popup blocked. Please enable popups for YouTube.");return}c&&c("OAuth signin: popup opened successfully"),Pe("authenticating","Waiting for authentication...");try{let r=await vr(i),a=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${r}`}});if(a.ok){let f=await a.json();O.accessToken=r,O.isSignedIn=!0,O.userName=f.name,O.email=f.email,await Jn(),hn(),Pe(),Ye(),await jt(),c?c(`Successfully authenticated as ${f.name}`):console.log(`[Timekeeper] Successfully authenticated as ${f.name}`)}else throw new Error("Failed to fetch user info")}catch(r){let a=r instanceof Error?r.message:"Authentication failed";c?c("OAuth failed:",r,"error"):console.error("[Timekeeper] OAuth failed:",r),Pe("error",a);return}}catch(e){let i=e instanceof Error?e.message:"Sign in failed";c?c("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Pe("error",`Failed to sign in: ${i}`)}}async function bi(){if(!window.opener||window.opener===window)return!1;c&&c("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return c&&c("OAuth popup: no hash params found"),!1;let i=e.startsWith("#")?e.substring(1):e,r=new URLSearchParams(i),a=r.get("state");if(c&&c("OAuth popup: hash params found, state="+a),a!=="timekeeper_auth")return c&&c("OAuth popup: not our OAuth flow (wrong state)"),!1;let f=r.get("error"),n=r.get("access_token"),v="timekeeper_oauth";if(f){try{let s=new BroadcastChannel(v);s.postMessage({type:"timekeeper_oauth_error",error:r.get("error_description")||f}),s.close()}catch{let S={type:"timekeeper_oauth_error",error:r.get("error_description")||f,timestamp:Date.now()},E=indexedDB.open("ytls-timestamps-db",3);E.onsuccess=()=>{let w=E.result;w.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),w.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){c&&c("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(v);s.postMessage({type:"timekeeper_oauth_token",token:n}),s.close(),c&&c("OAuth popup: token broadcast via BroadcastChannel")}catch(s){c&&c("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let S={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},E=indexedDB.open("ytls-timestamps-db",3);E.onsuccess=()=>{let w=E.result;w.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),w.close()},c&&c("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function xi(){O={isSignedIn:!1,accessToken:null,userName:null,email:null},await Jn(),hn(),Pe(),Ye()}async function wi(){if(!O.isSignedIn||!O.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${O.accessToken}`}});return e.status===401?(await Ti({silent:!0}),!1):e.ok}catch(e){return c("Failed to verify auth state:",e,"error"),!1}}async function br(e){let i={Authorization:`Bearer ${e}`},a=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,f=await fetch(a,{headers:i});if(f.status===401)throw new Error("unauthorized");if(!f.ok)throw new Error("drive search failed");let n=await f.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let v=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...i,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(v.status===401)throw new Error("unauthorized");if(!v.ok)throw new Error("drive folder create failed");return(await v.json()).id}async function xr(e,i,r){let a=`name='${e}' and '${i}' in parents and trashed=false`,f=encodeURIComponent(a),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${f}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${r}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let v=await n.json();return v.files&&v.files.length>0?v.files[0].id:null}function wr(e,i){let r=jn(e),a=i.replace(/\\/g,"/").replace(/^\/+/,"");return a.endsWith(".json")||(a+=".json"),ci({[a]:[r,{level:6,mtime:new Date,os:0}]})}async function Tr(e,i,r,a){let f=e.replace(/\.json$/,".zip"),n=await xr(f,r,a),v=new TextEncoder().encode(i).length,s=wr(i,e),S=s.length;c(`Compressing data: ${v} bytes -> ${S} bytes (${Math.round(100-S/v*100)}% reduction)`);let E="-------314159265358979",w=`\r
--${E}\r
`,D=`\r
--${E}--`,M=n?{name:f,mimeType:"application/zip"}:{name:f,mimeType:"application/zip",parents:[r]},H=8192,Z="";for(let J=0;J<s.length;J+=H){let pe=s.subarray(J,Math.min(J+H,s.length));Z+=String.fromCharCode.apply(null,Array.from(pe))}let K=btoa(Z),Q=w+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(M)+w+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+K+D,oe,G;n?(oe=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,G="PATCH"):(oe="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",G="POST");let ce=await fetch(oe,{method:G,headers:{Authorization:`Bearer ${a}`,"Content-Type":`multipart/related; boundary=${E}`},body:Q});if(ce.status===401)throw new Error("unauthorized");if(!ce.ok)throw new Error("drive upload failed")}async function Ti(e){c("Auth expired, clearing token",null,"warn"),O.isSignedIn=!1,O.accessToken=null,await Jn(),Pe("error","Authorization expired. Please sign in again."),Ye()}async function Er(e){if(!O.isSignedIn||!O.accessToken){e?.silent||Pe("error","Please sign in to Google Drive first");return}try{let{json:i,filename:r,totalVideos:a,totalTimestamps:f}=await yi();if(f===0){e?.silent||c("Skipping export: no timestamps to back up");return}let n=await br(O.accessToken);await Tr(r,i,n,O.accessToken),c(`Exported to Google Drive (${r}) with ${a} videos / ${f} timestamps.`)}catch(i){throw i.message==="unauthorized"?(await Ti({silent:e?.silent}),i):(c("Drive export failed:",i,"error"),e?.silent||Pe("error","Failed to export to Google Drive."),i)}}async function Ei(){try{let e=await fn("autoBackupEnabled"),i=await fn("autoBackupIntervalMinutes"),r=await fn("lastAutoBackupAt");typeof e=="boolean"&&(Xe=e),typeof i=="number"&&i>0&&(Ue=i),typeof r=="number"&&r>0&&(Ke=r)}catch(e){c("Failed to load auto backup settings:",e,"error")}}async function So(){try{await mn("autoBackupEnabled",Xe),await mn("autoBackupIntervalMinutes",Ue),await mn("lastAutoBackupAt",Ke??0)}catch(e){c("Failed to save auto backup settings:",e,"error")}}function kr(){Kn&&(clearInterval(Kn),Kn=null),Ve&&(clearTimeout(Ve),Ve=null)}function qt(e){try{let i=new Date(e),r=new Date,a=i.toDateString()===r.toDateString(),f=i.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return a?f:`${i.toLocaleDateString()} ${f}`}catch{return""}}function Ye(){if(!ve)return;let e="",i="";if(!Xe)e="\u{1F501} Backup: Off",ve.onmouseenter=null,ve.onmouseleave=null;else if(Ut)e="\u{1F501} Backing up\u2026",ve.onmouseenter=null,ve.onmouseleave=null;else if(We&&We>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(We/6e4)}m`,ve.onmouseenter=null,ve.onmouseleave=null;else if(Ke){e=`\u{1F5C4}\uFE0F Last backup: ${qt(Ke)}`;let r=Ke+Math.max(1,Ue)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${qt(r)}`,ve.onmouseenter=()=>{ve.textContent=i},ve.onmouseleave=()=>{ve.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let r=Date.now()+Math.max(1,Ue)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${qt(r)}`,ve.onmouseenter=()=>{ve.textContent=i},ve.onmouseleave=()=>{ve.textContent=e}}ve.textContent=e,ve.style.display=e?"inline":"none",_t()}function _t(){if(!Wn)return;let e="";Xe?Ut?e="#4285f4":We&&We>0?e="#ffa500":O.isSignedIn&&Ke?e="#52c41a":O.isSignedIn?e="#ffa500":e="#ff4d4f":e="#ff4d4f",Wn.style.backgroundColor=e,je(Wn,()=>{let i="";if(!Xe)i="Auto backup is disabled";else if(Ut)i="Backup in progress";else if(We&&We>0)i=`Retrying backup in ${Math.ceil(We/6e4)}m`;else if(O.isSignedIn&&Ke){let r=Ke+Math.max(1,Ue)*60*1e3,a=qt(r);i=`Last backup: ${qt(Ke)}
Next backup: ${a}`}else if(O.isSignedIn){let r=Date.now()+Math.max(1,Ue)*60*1e3;i=`No backup yet
Next backup: ${qt(r)}`}else i="Not signed in to Google Drive";return i})}async function pn(e=!0){if(!O.isSignedIn||!O.accessToken){e||yr();return}if(!Ut){Ut=!0,Ye();try{await Er({silent:e}),Ke=Date.now(),Gt=0,We=null,Ve&&(clearTimeout(Ve),Ve=null),await So()}catch(i){if(c("Auto backup failed:",i,"error"),i.message==="unauthorized")c("Auth error detected, clearing token and stopping retries",null,"warn"),O.isSignedIn=!1,O.accessToken=null,await Jn(),Pe("error","Authorization expired. Please sign in again."),Ye(),Gt=0,We=null,Ve&&(clearTimeout(Ve),Ve=null);else if(Gt<mi){Gt+=1;let f=Math.min(hr*Math.pow(2,Gt-1),gr);We=f,Ve&&clearTimeout(Ve),Ve=setTimeout(()=>{pn(!0)},f),c(`Scheduling backup retry ${Gt}/${mi} in ${Math.round(f/1e3)}s`),Ye()}else We=null}finally{Ut=!1,Ye()}}}async function jt(e=!1){if(kr(),!!Xe&&!(!O.isSignedIn||!O.accessToken)){if(Kn=setInterval(()=>{pn(!0)},Math.max(1,Ue)*60*1e3),!e){let i=Date.now(),r=Math.max(1,Ue)*60*1e3;(!Ke||i-Ke>=r)&&pn(!0)}Ye()}}async function ki(){Xe=!Xe,await So(),await jt(),Ye()}async function Si(){let e=prompt("Set Auto Backup interval (minutes):",String(Ue));if(e===null)return;let i=Math.floor(Number(e));if(!Number.isFinite(i)||i<5||i>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Ue=i,await So(),await jt(),Ye()}var Lo=window.location.hash;if(Lo&&Lo.length>1){let e=new URLSearchParams(Lo.substring(1));if(e.get("state")==="timekeeper_auth"){let r=e.get("access_token");if(r){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",r.length,"characters");try{let a=new BroadcastChannel("timekeeper_oauth"),f={type:"timekeeper_oauth_token",token:r};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:f.type,tokenLength:r.length}),a.postMessage(f),a.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(a){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",a);let f={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},n=indexedDB.open("ytls-timestamps-db",3);n.onsuccess=()=>{let v=n.result,s=v.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:f}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",f.timestamp),v.close()}}}if(history.replaceState){let a=window.location.pathname+window.location.search;history.replaceState(null,"",a)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(t){return GM.getValue(`timekeeper_${t}`,void 0)}function i(t,o){return GM.setValue(`timekeeper_${t}`,JSON.stringify(o))}if(Zn(e),Yn(i),await bi()){c("OAuth popup detected, broadcasting token and closing");return}await ko();let a=["/watch","/live"];function f(t=window.location.href){try{let o=new URL(t);return o.origin!=="https://www.youtube.com"?!1:a.some(l=>o.pathname===l||o.pathname.startsWith(`${l}/`))}catch(o){return c("Timekeeper failed to parse URL for support check:",o,"error"),!1}}let n=null,v=null,s=null,S=null,E=null,w=null,D=null,M=null,H=250,Z=null,K=!1;function Q(){return n?n.getBoundingClientRect():null}function oe(t,o,l){t&&(ze={x:Math.round(typeof o=="number"?o:t.left),y:Math.round(typeof l=="number"?l:t.top),width:Math.round(t.width),height:Math.round(t.height)})}function G(t=!0){if(!n)return;At();let o=Q();o&&(o.width||o.height)&&(oe(o),t&&($n("windowPosition",ze),tt({type:"window_position_updated",position:ze,timestamp:Date.now()})))}function ce(){if(!n||!v||!S||!s)return;let t=40,o=ee();if(o.length>0)t=o[0].offsetHeight;else{let l=document.createElement("li");l.style.visibility="hidden",l.style.position="absolute",l.textContent="00:00 Example",s.appendChild(l),t=l.offsetHeight,s.removeChild(l)}H=v.offsetHeight+S.offsetHeight+t,n.style.minHeight=H+"px"}function J(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),G(!0)})}function pe(t=450){me&&(clearTimeout(me),me=null),me=setTimeout(()=>{$(),J(),me=null},t)}function ke(){me&&(clearTimeout(me),me=null)}function re(){s&&(s.style.visibility="hidden",c("Hiding timestamps during show animation")),J(),pe()}function U(){$(),ke(),Ze&&(clearTimeout(Ze),Ze=null),Ze=setTimeout(()=>{n&&(n.style.display="none",Ro(),Ze=null)},400)}function $(){if(!s){Re&&(Re(),Re=null,nt=null,mt=null);return}if(!mt){s.style.visibility==="hidden"&&(s.style.visibility="",c("Restoring timestamp visibility (no deferred fragment)")),Re&&(Re(),Re=null,nt=null);return}c("Appending deferred timestamps after animation"),s.appendChild(mt),mt=null,s.style.visibility==="hidden"&&(s.style.visibility="",c("Restoring timestamp visibility after append")),Re&&(Re(),Re=null,nt=null),Je(),Se(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let t=j(),o=t?Math.floor(t.getCurrentTime()):xt();Number.isFinite(o)&&Bn(o,!1)}let ae=null,ue=!1,se="ytls-timestamp-pending-delete",Fe="ytls-timestamp-highlight",Te="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",De="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function qe(){let t=o=>{let l=new Image;l.src=o};t(Te),t(De)}qe();async function de(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(t=>setTimeout(t,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(t=>setTimeout(t,100));await new Promise(t=>setTimeout(t,200))}let Ae=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],Qe=5e3,Vt=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function He(t){return Vt.has(t)}function $e(){return document.querySelector("video")}let Be=null;function j(){if(Be&&document.contains(Be))return Be;let t=document.getElementById("movie_player");return t&&document.contains(t)?t:null}function le(t){return Ae.every(o=>typeof t?.[o]=="function"?!0:He(o)?!!$e():!1)}function dt(t){return Ae.filter(o=>typeof t?.[o]=="function"?!1:He(o)?!$e():!0)}async function gn(t=Qe){let o=Date.now();for(;Date.now()-o<t;){let u=j();if(le(u))return u;await new Promise(y=>setTimeout(y,100))}let l=j();return le(l),l}let It="timestampOffsetSeconds",Xn=-5,Wt="shiftClickTimeSkipSeconds",yn=10,et=new BroadcastChannel("ytls_timestamp_channel");function tt(t){try{et.postMessage(t)}catch(o){c("BroadcastChannel error, reopening:",o,"warn");try{et=new BroadcastChannel("ytls_timestamp_channel"),et.onmessage=Ct,et.postMessage(t)}catch(l){c("Failed to reopen BroadcastChannel:",l,"error")}}}function Ct(t){if(c("Received message from another tab:",t.data),!(!f()||!s||!n)&&t.data){if(t.data.type==="timestamps_updated"&&t.data.videoId===he)c("Debouncing timestamp load due to external update for video:",t.data.videoId),clearTimeout(Yt),Yt=setTimeout(()=>{c("Reloading timestamps due to external update for video:",t.data.videoId),Fo()},500);else if(t.data.type==="window_position_updated"&&n){let o=t.data.position;if(o&&typeof o.x=="number"&&typeof o.y=="number"){n.style.left=`${o.x}px`,n.style.top=`${o.y}px`,n.style.right="auto",n.style.bottom="auto",typeof o.width=="number"&&o.width>0&&(n.style.width=`${o.width}px`),typeof o.height=="number"&&o.height>0&&(n.style.height=`${o.height}px`);let l=n.getBoundingClientRect();ze={x:Math.round(o.x),y:Math.round(o.y),width:Math.round(l.width),height:Math.round(l.height)};let u=document.documentElement.clientWidth,y=document.documentElement.clientHeight;(l.left<0||l.top<0||l.right>u||l.bottom>y)&&At()}}}}et.onmessage=Ct;let Mt=await GM.getValue(It);(typeof Mt!="number"||Number.isNaN(Mt))&&(Mt=Xn,await GM.setValue(It,Mt));let Kt=await GM.getValue(Wt);(typeof Kt!="number"||Number.isNaN(Kt))&&(Kt=yn,await GM.setValue(Wt,Kt));let Yt=null,Zt=new Map,vn=!1,z=null,bn=null,he=null,Ze=null,me=null,mt=null,nt=null,Re=null,ft=null,xn=!1,ze=null,Qn=!1,wn=null,Tn=null,En=null,kn=null,Sn=null,Ln=null,In=null,Jt=null,Xt=null,Qt=null,Io=0,en=!1,bt=null,tn=null;function ee(){return s?Array.from(s.querySelectorAll("li")).filter(t=>!!t.querySelector("a[data-time]")):[]}function eo(){return ee().map(t=>{let o=t.querySelector("a[data-time]"),l=o?.dataset.time;if(!o||!l)return null;let u=Number.parseInt(l,10);if(!Number.isFinite(u))return null;let g=t.querySelector("input")?.value??"",d=t.dataset.guid??crypto.randomUUID();return t.dataset.guid||(t.dataset.guid=d),{start:u,comment:g,guid:d}}).filter(Mo)}function xt(){if(tn!==null)return tn;let t=ee();return tn=t.length>0?Math.max(...t.map(o=>{let l=o.querySelector("a[data-time]")?.getAttribute("data-time");return l?Number.parseInt(l,10):0})):0,tn}function Cn(){tn=null}function Li(t){let o=t.querySelector(".time-diff");return o?(o.textContent?.trim()||"").startsWith("-"):!1}function Ii(t,o){return t?o?"\u2514\u2500 ":"\u251C\u2500 ":""}function nn(t){return t.startsWith("\u251C\u2500 ")||t.startsWith("\u2514\u2500 ")?1:0}function Co(t){return t.replace(/^[├└]─\s/,"")}function Ci(t){let o=ee();if(t>=o.length-1)return"\u2514\u2500 ";let l=o[t+1].querySelector("input");return l&&nn(l.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function Je(){if(!s)return;let t=ee(),o=!0,l=0,u=t.length;for(;o&&l<u;)o=!1,l++,t.forEach((y,g)=>{let d=y.querySelector("input");if(!d||!(nn(d.value)===1))return;let T=!1;if(g<t.length-1){let R=t[g+1].querySelector("input");R&&(T=!(nn(R.value)===1))}else T=!0;let k=Co(d.value),I=`${Ii(!0,T)}${k}`;d.value!==I&&(d.value=I,o=!0)})}function wt(){if(s){for(;s.firstChild;)s.removeChild(s.firstChild);mt&&(mt=null),Re&&(Re(),Re=null,nt=null)}}function on(){if(!s||ue||mt)return;Array.from(s.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||to("No timestamps for this video")}function to(t){if(!s)return;wt();let o=document.createElement("li");o.className="ytls-placeholder",o.textContent=t,s.appendChild(o),s.style.overflowY="hidden"}function no(){if(!s)return;let t=s.querySelector(".ytls-placeholder");t&&t.remove(),s.style.overflowY=""}function oo(t){if(!(!n||!s)){if(ue=t,t)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),to("Loading timestamps...");else if(no(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),E){let o=j();if(o){let l=o.getCurrentTime(),u=Number.isFinite(l)?Math.max(0,Math.floor(l)):Math.max(0,xt()),y=Math.floor(u/3600),g=Math.floor(u/60)%60,d=u%60,{isLive:h}=o.getVideoData()||{isLive:!1},T=s?ee().map(L=>{let I=L.querySelector("a[data-time]");return I?parseFloat(I.getAttribute("data-time")??"0"):0}):[],k="";if(T.length>0)if(h){let L=Math.max(1,u/60),I=T.filter(R=>R<=u);if(I.length>0){let R=(I.length/L).toFixed(2);parseFloat(R)>0&&(k=` (${R}/min)`)}}else{let L=o.getDuration(),I=Number.isFinite(L)&&L>0?L:0,R=Math.max(1,I/60),ne=(T.length/R).toFixed(1);parseFloat(ne)>0&&(k=` (${ne}/min)`)}E.textContent=`\u23F3${y?y+":"+String(g).padStart(2,"0"):g}:${String(d).padStart(2,"0")}${k}`}}!ue&&s&&!s.querySelector(".ytls-error-message")&&on(),ot()}}function Mo(t){return!!t&&Number.isFinite(t.start)&&typeof t.comment=="string"&&typeof t.guid=="string"}function Mn(t,o){t.textContent=yt(o),t.dataset.time=String(o),t.href=jo(o,window.location.href)}let Dn=null,An=null,Tt=!1;function Mi(t){if(!t||typeof t.getVideoData!="function"||!t.getVideoData()?.isLive)return!1;if(typeof t.getProgressState=="function"){let l=t.getProgressState(),u=Number(l?.seekableEnd??l?.liveHead??l?.head??l?.duration),y=Number(l?.current??t.getCurrentTime?.());if(Number.isFinite(u)&&Number.isFinite(y))return u-y>2}return!1}function Bn(t,o){if(!Number.isFinite(t))return;let l=zn(t);rn(l,o)}function zn(t){if(!Number.isFinite(t))return null;let o=ee();if(o.length===0)return null;let l=null,u=-1/0;for(let y of o){let d=y.querySelector("a[data-time]")?.dataset.time;if(!d)continue;let h=Number.parseInt(d,10);Number.isFinite(h)&&h<=t&&h>u&&(u=h,l=y)}return l}function rn(t,o=!1){if(!t)return;ee().forEach(u=>{u.classList.contains(se)||u.classList.remove(Fe)}),t.classList.contains(se)||(t.classList.add(Fe),o&&!vn&&t.scrollIntoView({behavior:"smooth",block:"center"}))}function Di(t){if(!s||s.querySelector(".ytls-error-message")||!Number.isFinite(t)||t===0)return!1;let o=ee();if(o.length===0)return!1;let l=!1;return o.forEach(u=>{let y=u.querySelector("a[data-time]"),g=y?.dataset.time;if(!y||!g)return;let d=Number.parseInt(g,10);if(!Number.isFinite(d))return;let h=Math.max(0,d+t);h!==d&&(Mn(y,h),l=!0)}),l?(sn(),Je(),Se(),Fn(he),bt=null,!0):!1}function Do(t,o={}){if(!Number.isFinite(t)||t===0)return!1;if(!Di(t)){if(o.alertOnNoChange){let d=o.failureMessage??"Offset did not change any timestamps.";alert(d)}return!1}let u=o.logLabel??"bulk offset";c(`Timestamps changed: Offset all timestamps by ${t>0?"+":""}${t} seconds (${u})`);let y=j(),g=y?Math.floor(y.getCurrentTime()):0;if(Number.isFinite(g)){let d=zn(g);rn(d,!1)}return!0}function Ao(t){if(!s||ue)return;let o=t.target instanceof HTMLElement?t.target:null;if(o)if(o.dataset.time){t.preventDefault();let l=Number(o.dataset.time);if(Number.isFinite(l)){Tt=!0;let y=j();y&&y.seekTo(l),setTimeout(()=>{Tt=!1},500)}let u=o.closest("li");u&&(ee().forEach(y=>{y.classList.contains(se)||y.classList.remove(Fe)}),u.classList.contains(se)||(u.classList.add(Fe),u.scrollIntoView({behavior:"smooth",block:"center"})))}else if(o.dataset.increment){t.preventDefault();let u=o.parentElement?.querySelector("a[data-time]");if(!u||!u.dataset.time)return;let y=parseInt(u.dataset.time,10),g=parseInt(o.dataset.increment,10);if("shiftKey"in t&&t.shiftKey&&(g*=Kt),"altKey"in t?t.altKey:!1){Do(g,{logLabel:"Alt adjust"});return}let T=Math.max(0,y+g);c(`Timestamps changed: Timestamp time incremented from ${y} to ${T}`),Mn(u,T),Cn();let k=o.closest("li");if(An=T,Dn&&clearTimeout(Dn),Tt=!0,Dn=setTimeout(()=>{if(An!==null){let L=j();L&&L.seekTo(An)}Dn=null,An=null,setTimeout(()=>{Tt=!1},500)},500),sn(),Je(),Se(),k){let L=k.querySelector("input"),I=k.dataset.guid;L&&I&&(Dt(he,I,T,L.value),bt=I)}}else o.dataset.action==="clear"&&(t.preventDefault(),c("Timestamps changed: All timestamps cleared from UI"),s.textContent="",Cn(),Se(),Pn(),Fn(he,{allowEmpty:!0}),bt=null,on())}function an(t,o="",l=!1,u=null,y=!0){if(!s)return null;let g=Math.max(0,t),d=u??crypto.randomUUID(),h=document.createElement("li"),T=document.createElement("div"),k=document.createElement("span"),L=document.createElement("span"),I=document.createElement("span"),R=document.createElement("a"),ne=document.createElement("span"),F=document.createElement("input"),te=document.createElement("button");h.dataset.guid=d,T.className="time-row";let ge=document.createElement("div");ge.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",je(ge,"Click to toggle indent");let be=document.createElement("span");be.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let Ee=()=>{let X=nn(F.value);be.textContent=X===1?"\u25C0":"\u25B6"},pt=X=>{X.stopPropagation();let q=nn(F.value),fe=Co(F.value),ie=q===0?1:0,Le="";if(ie===1){let ht=ee().indexOf(h);Le=Ci(ht)}F.value=`${Le}${fe}`,Ee(),Je();let Oe=Number.parseInt(R.dataset.time??"0",10);Dt(he,d,Oe,F.value)};ge.onclick=pt,ge.append(be),h.style.cssText="position:relative;padding-left:20px;",h.addEventListener("mouseenter",()=>{Ee(),be.style.display="inline"}),h.addEventListener("mouseleave",()=>{be.style.display="none"}),h.addEventListener("mouseleave",()=>{h.dataset.guid===bt&&Li(h)&&Bo()}),F.value=o||"",F.style.cssText="width:100%;margin-top:5px;display:block;",F.type="text",F.setAttribute("inputmode","text"),F.autocapitalize="off",F.autocomplete="off",F.spellcheck=!1,F.addEventListener("focusin",()=>{en=!1}),F.addEventListener("focusout",X=>{let q=X.relatedTarget,fe=Date.now()-Io<250,ie=!!q&&!!n&&n.contains(q);!fe&&!ie&&(en=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(F.focus({preventScroll:!0}),en=!1)},0))}),F.addEventListener("input",X=>{let q=X;if(q&&(q.isComposing||q.inputType==="insertCompositionText"))return;let fe=Zt.get(d);fe&&clearTimeout(fe);let ie=setTimeout(()=>{let Le=Number.parseInt(R.dataset.time??"0",10);Dt(he,d,Le,F.value),Zt.delete(d)},500);Zt.set(d,ie)}),F.addEventListener("compositionend",()=>{let X=Number.parseInt(R.dataset.time??"0",10);setTimeout(()=>{Dt(he,d,X,F.value)},50)}),k.textContent="\u2796",k.dataset.increment="-1",k.style.cursor="pointer",k.style.margin="0px",k.addEventListener("mouseenter",()=>{k.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),k.addEventListener("mouseleave",()=>{k.style.textShadow="none"}),I.textContent="\u2795",I.dataset.increment="1",I.style.cursor="pointer",I.style.margin="0px",I.addEventListener("mouseenter",()=>{I.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),I.addEventListener("mouseleave",()=>{I.style.textShadow="none"}),L.textContent="\u23FA\uFE0F",L.style.cursor="pointer",L.style.margin="0px",je(L,"Set to current playback time"),L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),L.onclick=()=>{let X=j(),q=X?Math.floor(X.getCurrentTime()):0;Number.isFinite(q)&&(c(`Timestamps changedset to current playback time ${q}`),Mn(R,q),sn(),Je(),Dt(he,d,q,F.value),bt=d)},Mn(R,g),Cn(),te.textContent="\u{1F5D1}\uFE0F",te.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",te.addEventListener("mouseenter",()=>{te.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),te.addEventListener("mouseleave",()=>{te.style.textShadow="none"}),te.onclick=()=>{if(h.dataset.deleteConfirmed==="true"){c("Timestamps changed: Timestamp deleted");let X=h.dataset.guid??"";h.remove(),Cn(),sn(),Je(),Se(),Pn(),Ai(he,X),bt=null,on()}else{h.dataset.deleteConfirmed="true",h.classList.add(se),h.classList.remove(Fe);let X=()=>{h.dataset.deleteConfirmed="false",h.classList.remove(se);let ie=j(),Le=ie?ie.getCurrentTime():0,Oe=Number.parseInt(h.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(Le)&&Number.isFinite(Oe)&&Le>=Oe&&h.classList.add(Fe)},q=ie=>{ie.target!==te&&(X(),h.removeEventListener("click",q,!0),document.removeEventListener("click",q,!0))},fe=()=>{h.dataset.deleteConfirmed==="true"&&(X(),s&&s.removeEventListener("mouseleave",fe),h.removeEventListener("click",q,!0),document.removeEventListener("click",q,!0))};h.addEventListener("click",q,!0),document.addEventListener("click",q,!0),s&&s.addEventListener("mouseleave",fe),setTimeout(()=>{h.dataset.deleteConfirmed==="true"&&X(),h.removeEventListener("click",q,!0),document.removeEventListener("click",q,!0),s&&s.removeEventListener("mouseleave",fe)},5e3)}},ne.className="time-diff",ne.style.color="#888",ne.style.marginLeft="5px",T.append(k,L,I,R,ne,te),h.append(ge,T,F);let it=Number.parseInt(R.dataset.time??"0",10);if(y){no();let X=!1,q=ee();for(let fe=0;fe<q.length;fe++){let ie=q[fe],Oe=ie.querySelector("a[data-time]")?.dataset.time;if(!Oe)continue;let rt=Number.parseInt(Oe,10);if(Number.isFinite(rt)&&it<rt){s.insertBefore(h,ie),X=!0;let ht=q[fe-1];if(ht){let $t=ht.querySelector("a[data-time]")?.dataset.time;if($t){let at=Number.parseInt($t,10);Number.isFinite(at)&&(ne.textContent=yt(it-at))}}else ne.textContent="";let Ht=ie.querySelector(".time-diff");Ht&&(Ht.textContent=yt(rt-it));break}}if(!X&&(s.appendChild(h),q.length>0)){let Le=q[q.length-1].querySelector("a[data-time]")?.dataset.time;if(Le){let Oe=Number.parseInt(Le,10);Number.isFinite(Oe)&&(ne.textContent=yt(it-Oe))}}h.scrollIntoView({behavior:"smooth",block:"center"}),Pn(),Je(),Se(),l||(Dt(he,d,g,o),bt=d,rn(h,!1))}else F.__ytls_li=h;return F}function sn(){if(!s||s.querySelector(".ytls-error-message"))return;let t=ee();t.forEach((o,l)=>{let u=o.querySelector(".time-diff");if(!u)return;let g=o.querySelector("a[data-time]")?.dataset.time;if(!g){u.textContent="";return}let d=Number.parseInt(g,10);if(!Number.isFinite(d)){u.textContent="";return}if(l===0){u.textContent="";return}let k=t[l-1].querySelector("a[data-time]")?.dataset.time;if(!k){u.textContent="";return}let L=Number.parseInt(k,10);if(!Number.isFinite(L)){u.textContent="";return}let I=d-L,R=I<0?"-":"";u.textContent=` ${R}${yt(Math.abs(I))}`})}function Bo(){if(!s||s.querySelector(".ytls-error-message")||ue)return;let t=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let d=document.activeElement,T=d.closest("li")?.dataset.guid;if(T){let k=d.selectionStart??d.value.length,L=d.selectionEnd??k,I=d.scrollLeft;t={guid:T,start:k,end:L,scroll:I}}}let o=ee();if(o.length===0)return;let l=o.map(d=>d.dataset.guid),u=o.map(d=>{let h=d.querySelector("a[data-time]"),T=h?.dataset.time;if(!h||!T)return null;let k=Number.parseInt(T,10);if(!Number.isFinite(k))return null;let L=d.dataset.guid??"";return{time:k,guid:L,element:d}}).filter(d=>d!==null).sort((d,h)=>{let T=d.time-h.time;return T!==0?T:d.guid.localeCompare(h.guid)}),y=u.map(d=>d.guid),g=l.length!==y.length||l.some((d,h)=>d!==y[h]);for(;s.firstChild;)s.removeChild(s.firstChild);if(u.forEach(d=>{s.appendChild(d.element)}),sn(),Je(),Se(),t){let h=ee().find(T=>T.dataset.guid===t.guid)?.querySelector("input");if(h)try{h.focus({preventScroll:!0})}catch{}}g&&(c("Timestamps changed: Timestamps sorted"),Fn(he))}function Pn(){if(!s)return;let t=ee().length;t>2?(s.style.maxHeight="200px",s.style.overflowY="auto"):(s.style.maxHeight="none",s.style.overflowY="hidden"),t===0&&on()}function Se(){if(!s)return;let t=$e(),o=document.querySelector(".ytp-progress-bar"),l=j(),u=l?l.getVideoData():null,y=!!u&&!!u.isLive;if(!t||!o||!isFinite(t.duration)||y)return;Po(),ee().map(d=>{let h=d.querySelector("a[data-time]"),T=h?.dataset.time;if(!h||!T)return null;let k=Number.parseInt(T,10);if(!Number.isFinite(k))return null;let I=d.querySelector("input")?.value??"",R=d.dataset.guid??crypto.randomUUID();return d.dataset.guid||(d.dataset.guid=R),{start:k,comment:I,guid:R}}).filter(Mo).forEach(d=>{if(!Number.isFinite(d.start))return;let h=document.createElement("div");h.className="ytls-marker",h.style.position="absolute",h.style.height="100%",h.style.width="2px",h.style.backgroundColor="#ff0000",h.style.cursor="pointer",h.style.left=d.start/t.duration*100+"%",h.dataset.time=String(d.start),h.addEventListener("click",()=>{let T=j();T&&T.seekTo(d.start)}),o.appendChild(h)})}function Fn(t,o={}){if(!s||s.querySelector(".ytls-error-message")||!t)return;if(ue){c("Save blocked: timestamps are currently loading");return}Je();let l=eo().sort((u,y)=>u.start-y.start);if(l.length===0&&!o.allowEmpty){c("Save skipped: no timestamps to save");return}$o(t,l).then(()=>c(`Successfully saved ${l.length} timestamps for ${t} to IndexedDB`)).catch(u=>c(`Failed to save timestamps for ${t} to IndexedDB:`,u,"error")),tt({type:"timestamps_updated",videoId:t,action:"saved"})}function Dt(t,o,l,u){if(!t||ue)return;let y={guid:o,start:l,comment:u};c(`Saving timestamp: guid=${o}, start=${l}, comment="${u}"`),Ni(t,y).catch(g=>c(`Failed to save timestamp ${o}:`,g,"error")),tt({type:"timestamps_updated",videoId:t,action:"saved"})}function Ai(t,o){!t||ue||(c(`Deleting timestamp: guid=${o}`),Gi(t,o).catch(l=>c(`Failed to delete timestamp ${o}:`,l,"error")),tt({type:"timestamps_updated",videoId:t,action:"saved"}))}async function zo(t){if(!s||s.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let o=he;if(!o)return;c(`Exporting timestamps for video ID: ${o}`);let l=eo(),u=Math.max(xt(),0),y=mo();if(t==="json"){let g=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),d=URL.createObjectURL(g),h=document.createElement("a");h.href=d,h.download=`timestamps-${o}-${y}.json`,h.click(),URL.revokeObjectURL(d)}else if(t==="text"){let g=l.map(k=>{let L=yt(k.start,u),I=`${k.comment} <!-- guid:${k.guid} -->`.trimStart();return`${L} ${I}`}).join(`
`),d=new Blob([g],{type:"text/plain"}),h=URL.createObjectURL(d),T=document.createElement("a");T.href=h,T.download=`timestamps-${o}-${y}.txt`,T.click(),URL.revokeObjectURL(h)}}function io(t){if(!n||!s){c("Timekeeper error:",t,"error");return}wt();let o=document.createElement("li");o.textContent=t,o.classList.add("ytls-error-message"),o.style.color="#ff6b6b",o.style.fontWeight="bold",o.style.padding="8px",o.style.background="rgba(255, 0, 0, 0.1)",s.appendChild(o),Se()}function Po(){document.querySelectorAll(".ytls-marker").forEach(t=>t.remove())}function At(){if(!n||!document.body.contains(n))return;let t=n.getBoundingClientRect(),o=document.documentElement.clientWidth,l=document.documentElement.clientHeight,u=t.width,y=t.height;if(t.left<0&&(n.style.left="0",n.style.right="auto"),t.right>o){let g=Math.max(0,o-u);n.style.left=`${g}px`,n.style.right="auto"}if(t.top<0&&(n.style.top="0",n.style.bottom="auto"),t.bottom>l){let g=Math.max(0,l-y);n.style.top=`${g}px`,n.style.bottom="auto"}}function Bi(){wn&&(document.removeEventListener("mousemove",wn),wn=null),Tn&&(document.removeEventListener("mouseup",Tn),Tn=null),Jt&&(document.removeEventListener("keydown",Jt),Jt=null),En&&(window.removeEventListener("resize",En),En=null),Xt&&(document.removeEventListener("pointerdown",Xt,!0),Xt=null),Qt&&(document.removeEventListener("pointerup",Qt,!0),Qt=null);let t=$e();t&&(kn&&(t.removeEventListener("timeupdate",kn),kn=null),Sn&&(t.removeEventListener("pause",Sn),Sn=null),Ln&&(t.removeEventListener("play",Ln),Ln=null),In&&(t.removeEventListener("seeking",In),In=null))}function zi(){Po(),Zt.forEach(o=>clearTimeout(o)),Zt.clear(),Yt&&(clearTimeout(Yt),Yt=null),ae&&(clearInterval(ae),ae=null),Ze&&(clearTimeout(Ze),Ze=null),Bi();try{et.close()}catch{}z&&z.parentNode===document.body&&document.body.removeChild(z),z=null,bn=null,vn=!1,he=null,n&&n.parentNode&&n.remove();let t=document.getElementById("ytls-header-button");t&&t.parentNode&&t.remove(),ft=null,xn=!1,ze=null,wt(),n=null,v=null,s=null,S=null,E=null,w=null,D=null,Be=null}async function Pi(){let t=ro();if(!t)return Be=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let o=await gn();if(!le(o)){let l=dt(o),u=l.length?` Missing methods: ${l.join(", ")}.`:"",y=o?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return Be=null,{ok:!1,message:`${y}${u} Try refreshing once playback is ready.`}}return Be=o,{ok:!0,player:o,videoId:t}}async function Fo(){if(!n||!s)return;let t=s.scrollTop,o=!0,l=()=>{if(!s||!o)return;let u=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(t,u)};try{let u=await Pi();if(!u.ok){io(u.message),wt(),Se();return}let{videoId:y}=u,g=[];try{let d=await Ui(y);d?(g=d.map(h=>({...h,guid:h.guid||crypto.randomUUID()})),c(`Loaded ${g.length} timestamps from IndexedDB for ${y}`)):c(`No timestamps found in IndexedDB for ${y}`)}catch(d){c(`Failed to load timestamps from IndexedDB for ${y}:`,d,"error"),io("Failed to load timestamps from IndexedDB. Try refreshing the page."),Se();return}if(g.length>0){g.sort((L,I)=>L.start-I.start),wt(),no();let d=document.createDocumentFragment();g.forEach(L=>{let R=an(L.start,L.comment,!0,L.guid,!1).__ytls_li;R&&d.appendChild(R)}),n&&n.classList.contains("ytls-zoom-in")&&me!=null?(c("Deferring timestamp DOM append until show animation completes"),mt=d,nt||(nt=new Promise(L=>{Re=L})),await nt):s&&(s.appendChild(d),Je(),Se(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let T=j(),k=T?Math.floor(T.getCurrentTime()):xt();Number.isFinite(k)&&(Bn(k,!1),o=!1)}else wt(),to("No timestamps for this video"),Se(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(u){c("Unexpected error while loading timestamps:",u,"error"),io("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{nt&&await nt,requestAnimationFrame(l),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),s&&!s.querySelector(".ytls-error-message")&&on()}}function ro(){let o=new URLSearchParams(location.search).get("v");if(o)return o;let l=document.querySelector('meta[itemprop="identifier"]');return l?.content?l.content:null}function Fi(){let t=$e();if(!t)return;let o=()=>{if(!s)return;let d=j(),h=d?Math.floor(d.getCurrentTime()):0;if(!Number.isFinite(h))return;let T=zn(h);rn(T,!1)},l=d=>{try{let h=new URL(window.location.href);d!==null&&Number.isFinite(d)?h.searchParams.set("t",`${Math.floor(d)}s`):h.searchParams.delete("t"),window.history.replaceState({},"",h.toString())}catch{}},u=()=>{let d=j(),h=d?Math.floor(d.getCurrentTime()):0;Number.isFinite(h)&&l(h)},y=()=>{l(null)},g=()=>{let d=$e();if(!d)return;let h=j(),T=h?Math.floor(h.getCurrentTime()):0;if(!Number.isFinite(T))return;d.paused&&l(T);let k=zn(T);rn(k,!0)};kn=o,Sn=u,Ln=y,In=g,t.addEventListener("timeupdate",o),t.addEventListener("pause",u),t.addEventListener("play",y),t.addEventListener("seeking",g)}let Hi="ytls-timestamps-db",$i=3,Bt="timestamps",_e="timestamps_v2",Hn="settings",zt=null,Pt=null;function Ft(){if(zt)try{if(zt.objectStoreNames.length>=0)return Promise.resolve(zt)}catch(t){c("IndexedDB connection is no longer usable:",t,"warn"),zt=null}return Pt||(Pt=Oi().then(t=>(zt=t,Pt=null,t.onclose=()=>{c("IndexedDB connection closed unexpectedly","warn"),zt=null},t.onerror=o=>{c("IndexedDB connection error:",o,"error")},t)).catch(t=>{throw Pt=null,t}),Pt)}async function Ho(){let t={},o=await _i(_e),l=new Map;for(let g of o){let d=g;l.has(d.video_id)||l.set(d.video_id,[]),l.get(d.video_id).push({guid:d.guid,start:d.start,comment:d.comment})}for(let[g,d]of l)t[`ytls-${g}`]={video_id:g,timestamps:d.sort((h,T)=>h.start-T.start)};return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:l.size,totalTimestamps:o.length}}async function Ri(){try{let{json:t,filename:o,totalVideos:l,totalTimestamps:u}=await Ho(),y=new Blob([t],{type:"application/json"}),g=URL.createObjectURL(y),d=document.createElement("a");d.href=g,d.download=o,d.click(),URL.revokeObjectURL(g),c(`Exported ${l} videos with ${u} timestamps`)}catch(t){throw c("Failed to export data:",t,"error"),t}}function Oi(){return new Promise((t,o)=>{let l=indexedDB.open(Hi,$i);l.onupgradeneeded=u=>{let y=u.target.result,g=u.oldVersion,d=u.target.transaction;if(g<1&&y.createObjectStore(Bt,{keyPath:"video_id"}),g<2&&!y.objectStoreNames.contains(Hn)&&y.createObjectStore(Hn,{keyPath:"key"}),g<3){if(y.objectStoreNames.contains(Bt)){c("Exporting backup before v2 migration...");let k=d.objectStore(Bt).getAll();k.onsuccess=()=>{let L=k.result;if(L.length>0)try{let I={},R=0;L.forEach(ge=>{if(Array.isArray(ge.timestamps)&&ge.timestamps.length>0){let be=ge.timestamps.map(Ee=>({guid:Ee.guid||crypto.randomUUID(),start:Ee.start,comment:Ee.comment}));I[`ytls-${ge.video_id}`]={video_id:ge.video_id,timestamps:be.sort((Ee,pt)=>Ee.start-pt.start)},R+=be.length}});let ne=new Blob([JSON.stringify(I,null,2)],{type:"application/json"}),F=URL.createObjectURL(ne),te=document.createElement("a");te.href=F,te.download=`timekeeper-data-${mo()}.json`,te.click(),URL.revokeObjectURL(F),c(`Pre-migration backup exported: ${L.length} videos, ${R} timestamps`)}catch(I){c("Failed to export pre-migration backup:",I,"error")}}}let h=y.createObjectStore(_e,{keyPath:"guid"});if(h.createIndex("video_id","video_id",{unique:!1}),h.createIndex("video_start",["video_id","start"],{unique:!1}),y.objectStoreNames.contains(Bt)){let k=d.objectStore(Bt).getAll();k.onsuccess=()=>{let L=k.result;if(L.length>0){let I=0;L.forEach(R=>{Array.isArray(R.timestamps)&&R.timestamps.length>0&&R.timestamps.forEach(ne=>{h.put({guid:ne.guid||crypto.randomUUID(),video_id:R.video_id,start:ne.start,comment:ne.comment}),I++})}),c(`Migrated ${I} timestamps from ${L.length} videos to v2 store`)}},y.deleteObjectStore(Bt),c("Deleted old timestamps store after migration to v2")}}},l.onsuccess=u=>{t(u.target.result)},l.onerror=u=>{let y=u.target.error;o(y??new Error("Failed to open IndexedDB"))}})}function ao(t,o,l){return Ft().then(u=>new Promise((y,g)=>{let d;try{d=u.transaction(t,o)}catch(k){g(new Error(`Failed to create transaction for ${t}: ${k}`));return}let h=d.objectStore(t),T;try{T=l(h)}catch(k){g(new Error(`Failed to execute operation on ${t}: ${k}`));return}T&&(T.onsuccess=()=>y(T.result),T.onerror=()=>g(T.error??new Error(`IndexedDB ${o} operation failed`))),d.oncomplete=()=>{T||y(void 0)},d.onerror=()=>g(d.error??new Error("IndexedDB transaction failed")),d.onabort=()=>g(d.error??new Error("IndexedDB transaction aborted"))}))}function $o(t,o){return Ft().then(l=>new Promise((u,y)=>{let g;try{g=l.transaction([_e],"readwrite")}catch(k){y(new Error(`Failed to create transaction: ${k}`));return}let d=g.objectStore(_e),T=d.index("video_id").getAll(IDBKeyRange.only(t));T.onsuccess=()=>{try{let k=T.result,L=new Set(o.map(I=>I.guid));k.forEach(I=>{L.has(I.guid)||d.delete(I.guid)}),o.forEach(I=>{d.put({guid:I.guid,video_id:t,start:I.start,comment:I.comment})})}catch(k){c("Error during save operation:",k,"error")}},T.onerror=()=>{y(T.error??new Error("Failed to get existing records"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to save to IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during save"))}))}function Ni(t,o){return Ft().then(l=>new Promise((u,y)=>{let g;try{g=l.transaction([_e],"readwrite")}catch(T){y(new Error(`Failed to create transaction: ${T}`));return}let h=g.objectStore(_e).put({guid:o.guid,video_id:t,start:o.start,comment:o.comment});h.onerror=()=>{y(h.error??new Error("Failed to put timestamp"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to save single timestamp to IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during single timestamp save"))}))}function Gi(t,o){return c(`Deleting timestamp ${o} for video ${t}`),Ft().then(l=>new Promise((u,y)=>{let g;try{g=l.transaction([_e],"readwrite")}catch(T){y(new Error(`Failed to create transaction: ${T}`));return}let h=g.objectStore(_e).delete(o);h.onerror=()=>{y(h.error??new Error("Failed to delete timestamp"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to delete single timestamp from IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during timestamp deletion"))}))}function Ui(t){return Ft().then(o=>new Promise(l=>{let u;try{u=o.transaction([_e],"readonly")}catch(h){c("Failed to create read transaction:",h,"warn"),l(null);return}let d=u.objectStore(_e).index("video_id").getAll(IDBKeyRange.only(t));d.onsuccess=()=>{let h=d.result;if(h.length>0){let T=h.map(k=>({guid:k.guid,start:k.start,comment:k.comment})).sort((k,L)=>k.start-L.start);l(T)}else l(null)},d.onerror=()=>{c("Failed to load timestamps:",d.error,"warn"),l(null)},u.onabort=()=>{c("Transaction aborted during load:",u.error,"warn"),l(null)}}))}function qi(t){return Ft().then(o=>new Promise((l,u)=>{let y;try{y=o.transaction([_e],"readwrite")}catch(T){u(new Error(`Failed to create transaction: ${T}`));return}let g=y.objectStore(_e),h=g.index("video_id").getAll(IDBKeyRange.only(t));h.onsuccess=()=>{try{h.result.forEach(k=>{g.delete(k.guid)})}catch(T){c("Error during remove operation:",T,"error")}},h.onerror=()=>{u(h.error??new Error("Failed to get records for removal"))},y.oncomplete=()=>l(),y.onerror=()=>u(y.error??new Error("Failed to remove timestamps")),y.onabort=()=>u(y.error??new Error("Transaction aborted during timestamp removal"))}))}function _i(t){return ao(t,"readonly",o=>o.getAll()).then(o=>Array.isArray(o)?o:[])}function $n(t,o){ao(Hn,"readwrite",l=>{l.put({key:t,value:o})}).catch(l=>{c(`Failed to save setting '${t}' to IndexedDB:`,l,"error")})}function so(t){return ao(Hn,"readonly",o=>o.get(t)).then(o=>o?.value).catch(o=>{c(`Failed to load setting '${t}' from IndexedDB:`,o,"error")})}function Ro(){if(!n)return;let t=n.style.display!=="none";$n("uiVisible",t)}function ot(t){let o=typeof t=="boolean"?t:!!n&&n.style.display!=="none",l=document.getElementById("ytls-header-button");l instanceof HTMLButtonElement&&l.setAttribute("aria-pressed",String(o)),ft&&!xn&&ft.src!==Te&&(ft.src=Te)}function ji(){n&&so("uiVisible").then(t=>{let o=t;typeof o=="boolean"?(o?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",ot(o)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),ot(!0))}).catch(t=>{c("Failed to load UI visibility state:",t,"error"),n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),ot(!0)})}function lo(t){if(!n){c("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(c("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(y=>{y!==n&&y.remove()}),document.body.appendChild(n));let o=document.querySelectorAll("#ytls-pane");o.length>1&&(c(`ERROR: Multiple panes detected in togglePaneVisibility (${o.length}), cleaning up`),o.forEach(y=>{y!==n&&y.remove()})),Ze&&(clearTimeout(Ze),Ze=null);let l=n.style.display==="none";(typeof t=="boolean"?t:l)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),ot(!0),Ro(),re(),me&&(clearTimeout(me),me=null),me=setTimeout(()=>{$(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),G(!0),me=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),ot(!1),U())}function Oo(t){if(!s){c("UI is not initialized; cannot import timestamps.","warn");return}let o=!1;try{let l=JSON.parse(t),u=null;if(Array.isArray(l))u=l;else if(typeof l=="object"&&l!==null){let y=he;if(y){let g=`timekeeper-${y}`;l[g]&&Array.isArray(l[g].timestamps)&&(u=l[g].timestamps,c(`Found timestamps for current video (${y}) in export format`,"info"))}if(!u){let g=Object.keys(l).filter(d=>d.startsWith("ytls-"));if(g.length===1&&Array.isArray(l[g[0]].timestamps)){u=l[g[0]].timestamps;let d=l[g[0]].video_id;c(`Found timestamps for video ${d} in export format`,"info")}}}u&&Array.isArray(u)?u.every(g=>typeof g.start=="number"&&typeof g.comment=="string")?(u.forEach(g=>{if(g.guid){let d=ee().find(h=>h.dataset.guid===g.guid);if(d){let h=d.querySelector("input");h&&(h.value=g.comment)}else an(g.start,g.comment,!1,g.guid)}else an(g.start,g.comment,!1,crypto.randomUUID())}),o=!0):c("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):c("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!o){let l=t.split(`
`).map(u=>u.trim()).filter(u=>u);if(l.length>0){let u=!1;l.forEach(y=>{let g=y.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(g){u=!0;let d=parseInt(g[1])||0,h=parseInt(g[2]),T=parseInt(g[3]),k=d*3600+h*60+T,L=g[4]?g[4].trim():"",I=null,R=L,ne=L.match(/<!--\s*guid:([^>]+?)\s*-->/);ne&&(I=ne[1].trim(),R=L.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let F;if(I&&(F=ee().find(te=>te.dataset.guid===I)),!F&&!I&&(F=ee().find(te=>{if(te.dataset.guid)return!1;let be=te.querySelector("a[data-time]")?.dataset.time;if(!be)return!1;let Ee=Number.parseInt(be,10);return Number.isFinite(Ee)&&Ee===k})),F){let te=F.querySelector("input");te&&(te.value=R)}else an(k,R,!1,I||crypto.randomUUID())}}),u&&(o=!0)}}o?(c("Timestamps changed: Imported timestamps from file/clipboard"),Je(),Fn(he),Se(),Pn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Vi(){if(Qn){c("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){Qn=!0;try{let l=function(){if(ue||Tt)return;let p=$e(),m=j();if(!p&&!m)return;let b=m?m.getCurrentTime():0,x=Number.isFinite(b)?Math.max(0,Math.floor(b)):Math.max(0,xt()),C=Math.floor(x/3600),A=Math.floor(x/60)%60,B=x%60,{isLive:N}=m?m.getVideoData()||{isLive:!1}:{isLive:!1},P=m?Mi(m):!1,Y=s?ee().map(W=>{let ye=W.querySelector("a[data-time]");return ye?parseFloat(ye.getAttribute("data-time")??"0"):0}):[],Ie="";if(Y.length>0)if(N){let W=Math.max(1,x/60),ye=Y.filter(Ce=>Ce<=x);if(ye.length>0){let Ce=(ye.length/W).toFixed(2);parseFloat(Ce)>0&&(Ie=` (${Ce}/min)`)}}else{let W=m?m.getDuration():0,ye=Number.isFinite(W)&&W>0?W:p&&Number.isFinite(p.duration)&&p.duration>0?p.duration:0,Ce=Math.max(1,ye/60),st=(Y.length/Ce).toFixed(1);parseFloat(st)>0&&(Ie=` (${st}/min)`)}E.textContent=`\u23F3${C?C+":"+String(A).padStart(2,"0"):A}:${String(B).padStart(2,"0")}${Ie}`,E.style.color=P?"#ff4d4f":"",Y.length>0&&Bn(x,!1)},F=function(p,m,b){let x=document.createElement("button");return x.textContent=p,je(x,m),x.classList.add("ytls-settings-modal-button"),x.onclick=b,x},te=function(p="general"){if(z&&z.parentNode===document.body){let Me=document.getElementById("ytls-save-modal"),gt=document.getElementById("ytls-load-modal"),lt=document.getElementById("ytls-delete-all-modal");Me&&document.body.contains(Me)&&document.body.removeChild(Me),gt&&document.body.contains(gt)&&document.body.removeChild(gt),lt&&document.body.contains(lt)&&document.body.removeChild(lt),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",be,!0),document.removeEventListener("keydown",ge)},300);return}z=document.createElement("div"),z.id="ytls-settings-modal",z.classList.remove("ytls-fade-out"),z.classList.add("ytls-fade-in");let m=document.createElement("div");m.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let x=document.createElement("button");x.className="ytls-modal-close-button",x.textContent="\u2715",je(x,"Close"),x.onclick=()=>{if(z&&z.parentNode===document.body){let Me=document.getElementById("ytls-save-modal"),gt=document.getElementById("ytls-load-modal"),lt=document.getElementById("ytls-delete-all-modal");Me&&document.body.contains(Me)&&document.body.removeChild(Me),gt&&document.body.contains(gt)&&document.body.removeChild(gt),lt&&document.body.contains(lt)&&document.body.removeChild(lt),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",be,!0),document.removeEventListener("keydown",ge)},300)}};let C=document.createElement("div");C.id="ytls-settings-content";let A=document.createElement("h3");A.className="ytls-section-heading",A.textContent="General",A.style.display="none";let B=document.createElement("div"),N=document.createElement("div");N.className="ytls-button-grid";function P(Me){B.style.display=Me==="general"?"block":"none",N.style.display=Me==="drive"?"block":"none",Y.classList.toggle("active",Me==="general"),W.classList.toggle("active",Me==="drive"),A.textContent=Me==="general"?"General":"Google Drive"}let Y=document.createElement("button");Y.textContent="\u{1F6E0}\uFE0F";let Ie=document.createElement("span");Ie.className="ytls-tab-text",Ie.textContent=" General",Y.appendChild(Ie),je(Y,"General settings"),Y.classList.add("ytls-settings-modal-button"),Y.onclick=()=>P("general");let W=document.createElement("button");W.textContent="\u2601\uFE0F";let ye=document.createElement("span");ye.className="ytls-tab-text",ye.textContent=" Backup",W.appendChild(ye),je(W,"Google Drive sign-in and backup"),W.classList.add("ytls-settings-modal-button"),W.onclick=async()=>{O.isSignedIn&&await wi(),P("drive")},b.appendChild(Y),b.appendChild(W),m.appendChild(b),m.appendChild(x),z.appendChild(m),B.className="ytls-button-grid",B.appendChild(F("\u{1F4BE} Save","Save As...",Ee.onclick)),B.appendChild(F("\u{1F4C2} Load","Load",pt.onclick)),B.appendChild(F("\u{1F4E4} Export All","Export All Data",it.onclick)),B.appendChild(F("\u{1F4E5} Import All","Import All Data",X.onclick));let Ce=F(O.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",O.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{O.isSignedIn?await xi():await vi(),Ce.textContent=O.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",je(Ce,O.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive")});N.appendChild(Ce);let st=F(Xe?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await ki(),st.textContent=Xe?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off"});N.appendChild(st);let kt=F(`\u23F1\uFE0F Backup Interval: ${Ue}min`,"Set periodic backup interval (minutes)",async()=>{await Si(),kt.textContent=`\u23F1\uFE0F Backup Interval: ${Ue}min`});N.appendChild(kt),N.appendChild(F("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await pn(!1)}));let Ne=document.createElement("div");Ne.style.marginTop="15px",Ne.style.paddingTop="10px",Ne.style.borderTop="1px solid #555",Ne.style.fontSize="12px",Ne.style.color="#aaa";let St=document.createElement("div");St.style.marginBottom="8px",St.style.fontWeight="bold",Ne.appendChild(St),hi(St);let uo=document.createElement("div");uo.style.marginBottom="8px",fi(uo),Ne.appendChild(uo);let _o=document.createElement("div");pi(_o),Ne.appendChild(_o),N.appendChild(Ne),Pe(),hn(),Ye(),C.appendChild(A),C.appendChild(B),C.appendChild(N),P(p),z.appendChild(C),document.body.appendChild(z),requestAnimationFrame(()=>{let Me=z.getBoundingClientRect(),lt=(window.innerHeight-Me.height)/2;z.style.top=`${Math.max(20,lt)}px`,z.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",be,!0),document.addEventListener("keydown",ge)},0)},ge=function(p){if(p.key==="Escape"&&z&&z.parentNode===document.body){let m=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");if(m||b||x)return;p.preventDefault(),m&&document.body.contains(m)&&document.body.removeChild(m),b&&document.body.contains(b)&&document.body.removeChild(b),x&&document.body.contains(x)&&document.body.removeChild(x),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",be,!0),document.removeEventListener("keydown",ge)},300)}},be=function(p){if(bn&&bn.contains(p.target))return;let m=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");m&&m.contains(p.target)||b&&b.contains(p.target)||x&&x.contains(p.target)||z&&z.contains(p.target)||(m&&document.body.contains(m)&&document.body.removeChild(m),b&&document.body.contains(b)&&document.body.removeChild(b),x&&document.body.contains(x)&&document.body.removeChild(x),z&&z.parentNode===document.body&&(z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",be,!0),document.removeEventListener("keydown",ge)},300)))},q=function(){n&&(c("Loading window position from IndexedDB"),so("windowPosition").then(p=>{if(p&&typeof p.x=="number"&&typeof p.y=="number"){let b=p;n.style.left=`${b.x}px`,n.style.top=`${b.y}px`,n.style.right="auto",n.style.bottom="auto",typeof b.width=="number"&&b.width>0&&(n.style.width=`${b.width}px`),typeof b.height=="number"&&b.height>0&&(n.style.height=`${b.height}px`);let x=Q();oe(x,b.x,b.y),c("Restored window position from IndexedDB:",ze)}else c("No window position found in IndexedDB, leaving default position"),ze=null;At();let m=Q();m&&(m.width||m.height)&&oe(m),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(p=>{c("failed to load pane position from IndexedDB:",p,"warn"),At();let m=Q();m&&(m.width||m.height)&&(ze={x:Math.max(0,Math.round(m.left)),y:0,width:Math.round(m.width),height:Math.round(m.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},fe=function(){if(!n)return;let p=Q();if(!p)return;let m={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)};if(ze&&ze.x===m.x&&ze.y===m.y&&ze.width===m.width&&ze.height===m.height){c("Skipping window position save; position and size unchanged");return}ze={...m},c(`Saving window position and size to IndexedDB: x=${m.x}, y=${m.y}, width=${m.width}, height=${m.height}`),$n("windowPosition",m),tt({type:"window_position_updated",position:m,timestamp:Date.now()})},Gn=function(p,m){p.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",fe(),ln())}),p.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),at=!0,Et=m,Uo=b.clientX,qo=b.clientY;let x=n.getBoundingClientRect();Rt=x.width,Ot=x.height,On=x.left,Nn=x.top,m==="top-left"||m==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},ln=function(){if(n&&v&&S&&s){let p=n.getBoundingClientRect(),m=v.getBoundingClientRect(),b=S.getBoundingClientRect(),x=p.height-(m.height+b.height);s.style.maxHeight=x>0?x+"px":"0px",s.style.overflowY=x>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),n=document.createElement("div"),v=document.createElement("div"),s=document.createElement("ul"),S=document.createElement("div"),E=document.createElement("span"),w=document.createElement("style"),D=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=p=>{p.stopPropagation(),te("drive")},s.addEventListener("mouseenter",()=>{vn=!0,en=!1}),s.addEventListener("mouseleave",()=>{if(vn=!1,en)return;let p=j(),m=p?Math.floor(p.getCurrentTime()):xt();Bn(m,!1);let b=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(b=document.activeElement.closest("li")?.dataset.guid??null),Bo(),b){let C=ee().find(A=>A.dataset.guid===b)?.querySelector("input");if(C)try{C.focus({preventScroll:!0})}catch{}}}),n.id="ytls-pane",v.id="ytls-pane-header",v.addEventListener("dblclick",p=>{let m=p.target instanceof HTMLElement?p.target:null;m&&(m.closest("a")||m.closest("button")||m.closest("#ytls-current-time")||m.closest(".ytls-version-display")||m.closest(".ytls-backup-indicator"))||(p.preventDefault(),lo(!1))});let t=GM_info.script.version;D.textContent=`v${t}`,D.classList.add("ytls-version-display");let o=document.createElement("span");o.style.display="inline-flex",o.style.alignItems="center",o.style.gap="6px",o.appendChild(D),o.appendChild(M),E.id="ytls-current-time",E.textContent="\u23F3",E.onclick=()=>{Tt=!0;let p=j();p&&p.seekToLiveHead(),setTimeout(()=>{Tt=!1},500)},l(),ae&&clearInterval(ae),ae=setInterval(l,1e3),S.id="ytls-buttons";let u=(p,m)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),m&&m()},300)},y=p=>m=>{m.key==="Escape"&&(m.preventDefault(),m.stopPropagation(),p())},g=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},d=(p,m)=>b=>{p.contains(b.target)||m()},h=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)},R=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!s||s.querySelector(".ytls-error-message")||ue)return;let p=typeof Mt<"u"?Mt:0,m=j(),b=m?Math.floor(m.getCurrentTime()+p):0;if(!Number.isFinite(b))return;let x=an(b,"");x&&x.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>te()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(p){if(!s||s.querySelector(".ytls-error-message")||ue){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let m=eo(),b=Math.max(xt(),0);if(m.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let x=p.ctrlKey,C=m.map(A=>{let B=yt(A.start,b);return x?`${B} ${A.comment} <!-- guid:${A.guid} -->`.trimStart():`${B} ${A.comment}`}).join(`
`);navigator.clipboard.writeText(C).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(A=>{c("Failed to copy timestamps: ",A,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!s||s.querySelector(".ytls-error-message")||ue)return;if(ee().length===0){alert("No timestamps available to offset.");return}let m=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(m===null)return;let b=m.trim();if(b.length===0)return;let x=Number.parseInt(b,10);if(!Number.isFinite(x)){alert("Please enter a valid integer number of seconds.");return}x!==0&&Do(x,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let p=ro();if(!p){alert("Unable to determine current video ID.");return}let m=document.createElement("div");m.id="ytls-delete-all-modal",m.classList.remove("ytls-fade-out"),m.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let x=document.createElement("p");x.textContent=p,x.style.fontFamily="monospace",x.style.fontSize="12px",x.style.marginBottom="15px",x.style.color="#aaa";let C=document.createElement("button");C.classList.add("ytls-save-modal-button"),C.style.background="#d32f2f",C.style.position="relative",C.style.overflow="hidden";let A=null,B=0,N=null,P=document.createElement("div");P.style.position="absolute",P.style.left="0",P.style.top="0",P.style.height="100%",P.style.width="0%",P.style.background="#ff6b6b",P.style.transition="none",P.style.pointerEvents="none",C.appendChild(P);let Y=document.createElement("span");Y.textContent="Hold to Delete All",Y.style.position="relative",Y.style.zIndex="1",C.appendChild(Y);let Ie=()=>{if(!B)return;let Ne=Date.now()-B,St=Math.min(Ne/5e3*100,100);P.style.width=`${St}%`,St<100&&(N=requestAnimationFrame(Ie))},W=()=>{A&&(clearTimeout(A),A=null),N&&(cancelAnimationFrame(N),N=null),B=0,P.style.width="0%",Y.textContent="Hold to Delete All"};C.onmousedown=()=>{B=Date.now(),Y.textContent="Deleting...",N=requestAnimationFrame(Ie),A=setTimeout(async()=>{W(),m.classList.remove("ytls-fade-in"),m.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(m)&&document.body.removeChild(m);try{await qi(p),co()}catch(Ne){c("Failed to delete all timestamps:",Ne,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},C.onmouseup=W,C.onmouseleave=W;let ye=null,Ce=null,st=u(m,()=>{W(),ye&&document.removeEventListener("keydown",ye),Ce&&document.removeEventListener("click",Ce,!0)});ye=y(st),Ce=d(m,st);let kt=document.createElement("button");kt.textContent="Cancel",kt.classList.add("ytls-save-modal-cancel-button"),kt.onclick=st,m.appendChild(b),m.appendChild(x),m.appendChild(C),m.appendChild(kt),document.body.appendChild(m),g(ye),h(Ce)}}],ne=Vo();R.forEach(p=>{let m=document.createElement("button");if(m.textContent=p.label,je(m,p.title),m.classList.add("ytls-main-button"),p.label==="\u{1F423}"&&ne){let b=document.createElement("span");b.textContent=ne,b.classList.add("ytls-holiday-emoji"),m.appendChild(b)}p.label==="\u{1F4CB}"?m.onclick=function(b){p.action.call(this,b)}:m.onclick=p.action,p.label==="\u2699\uFE0F"&&(bn=m),S.appendChild(m)});let Ee=document.createElement("button");Ee.textContent="\u{1F4BE} Save",Ee.classList.add("ytls-file-operation-button"),Ee.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let m=document.createElement("p");m.textContent="Save as:";let b=null,x=null,C=u(p,()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0)});b=y(C),x=d(p,C);let A=document.createElement("button");A.textContent="JSON",A.classList.add("ytls-save-modal-button"),A.onclick=()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),u(p,()=>zo("json"))()};let B=document.createElement("button");B.textContent="Plain Text",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),u(p,()=>zo("text"))()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,p.appendChild(m),p.appendChild(A),p.appendChild(B),p.appendChild(N),document.body.appendChild(p),g(b),h(x)};let pt=document.createElement("button");pt.textContent="\u{1F4C2} Load",pt.classList.add("ytls-file-operation-button"),pt.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let m=document.createElement("p");m.textContent="Load from:";let b=null,x=null,C=u(p,()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0)});b=y(C),x=d(p,C);let A=document.createElement("button");A.textContent="File",A.classList.add("ytls-save-modal-button"),A.onclick=()=>{let P=document.createElement("input");P.type="file",P.accept=".json,.txt",P.classList.add("ytls-hidden-file-input"),P.onchange=Y=>{let Ie=Y.target.files?.[0];if(!Ie)return;b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),C();let W=new FileReader;W.onload=()=>{let ye=String(W.result).trim();Oo(ye)},W.readAsText(Ie)},P.click()};let B=document.createElement("button");B.textContent="Clipboard",B.classList.add("ytls-save-modal-button"),B.onclick=async()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),u(p,async()=>{try{let P=await navigator.clipboard.readText();P?Oo(P.trim()):alert("Clipboard is empty.")}catch(P){c("Failed to read from clipboard: ",P,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,p.appendChild(m),p.appendChild(A),p.appendChild(B),p.appendChild(N),document.body.appendChild(p),g(b),h(x)};let it=document.createElement("button");it.textContent="\u{1F4E4} Export",it.classList.add("ytls-file-operation-button"),it.onclick=async()=>{try{await Ri()}catch{alert("Failed to export data: Could not read from database.")}};let X=document.createElement("button");X.textContent="\u{1F4E5} Import",X.classList.add("ytls-file-operation-button"),X.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=m=>{let b=m.target.files?.[0];if(!b)return;let x=new FileReader;x.onload=()=>{try{let C=JSON.parse(String(x.result)),A=[];for(let B in C)if(Object.prototype.hasOwnProperty.call(C,B)&&B.startsWith("ytls-")){let N=B.substring(5),P=C[B];if(P&&typeof P.video_id=="string"&&Array.isArray(P.timestamps)){let Y=P.timestamps.map(W=>({...W,guid:W.guid||crypto.randomUUID()})),Ie=$o(N,Y).then(()=>c(`Imported ${N} to IndexedDB`)).catch(W=>c(`Failed to import ${N} to IndexedDB:`,W,"error"));A.push(Ie)}else c(`Skipping key ${B} during import due to unexpected data format.`,"warn")}Promise.all(A).then(()=>{co()}).catch(B=>{alert("An error occurred during import to IndexedDB. Check console for details."),c("Overall import error:",B,"error")})}catch(C){alert(`Failed to import data. Please ensure the file is in the correct format.
`+C.message),c("Import error:",C,"error")}},x.readAsText(b)},p.click()},w.textContent=Wo,s.onclick=p=>{Ao(p)},s.ontouchstart=p=>{Ao(p)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",q(),setTimeout(()=>At(),10);let ie=!1,Le,Oe,rt=!1;n.addEventListener("mousedown",p=>{let m=p.target;m instanceof Element&&(m instanceof HTMLInputElement||m instanceof HTMLTextAreaElement||m!==v&&!v.contains(m)&&window.getComputedStyle(m).cursor==="pointer"||(ie=!0,rt=!1,Le=p.clientX-n.getBoundingClientRect().left,Oe=p.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",wn=p=>{if(!ie)return;rt=!0;let m=p.clientX-Le,b=p.clientY-Oe,x=n.getBoundingClientRect(),C=x.width,A=x.height,B=document.documentElement.clientWidth,N=document.documentElement.clientHeight;m=Math.max(0,Math.min(m,B-C)),b=Math.max(0,Math.min(b,N-A)),n.style.left=`${m}px`,n.style.top=`${b}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",Tn=()=>{if(!ie)return;ie=!1;let p=rt;setTimeout(()=>{rt=!1},50),At(),setTimeout(()=>{p&&fe()},200)}),n.addEventListener("dragstart",p=>p.preventDefault());let ht=document.createElement("div"),Ht=document.createElement("div"),Rn=document.createElement("div"),$t=document.createElement("div");ht.id="ytls-resize-tl",Ht.id="ytls-resize-tr",Rn.id="ytls-resize-bl",$t.id="ytls-resize-br";let at=!1,Uo=0,qo=0,Rt=0,Ot=0,On=0,Nn=0,Et=null;Gn(ht,"top-left"),Gn(Ht,"top-right"),Gn(Rn,"bottom-left"),Gn($t,"bottom-right"),document.addEventListener("mousemove",p=>{if(!at||!n||!Et)return;let m=p.clientX-Uo,b=p.clientY-qo,x=Rt,C=Ot,A=On,B=Nn,N=document.documentElement.clientWidth,P=document.documentElement.clientHeight;Et==="bottom-right"?(x=Math.max(200,Math.min(800,Rt+m)),C=Math.max(250,Math.min(P,Ot+b))):Et==="top-left"?(x=Math.max(200,Math.min(800,Rt-m)),A=On+m,C=Math.max(250,Math.min(P,Ot-b)),B=Nn+b):Et==="top-right"?(x=Math.max(200,Math.min(800,Rt+m)),C=Math.max(250,Math.min(P,Ot-b)),B=Nn+b):Et==="bottom-left"&&(x=Math.max(200,Math.min(800,Rt-m)),A=On+m,C=Math.max(250,Math.min(P,Ot+b))),A=Math.max(0,Math.min(A,N-x)),B=Math.max(0,Math.min(B,P-C)),n.style.width=`${x}px`,n.style.height=`${C}px`,n.style.left=`${A}px`,n.style.top=`${B}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{at&&(at=!1,Et=null,document.body.style.cursor="",G(!0))});let Un=null;window.addEventListener("resize",En=()=>{Un&&clearTimeout(Un),Un=setTimeout(()=>{G(!0),Un=null},200)}),v.appendChild(E),v.appendChild(o);let qn=document.createElement("div");qn.id="ytls-content",qn.append(s),qn.append(S),n.append(v,qn,w,ht,Ht,Rn,$t),n.addEventListener("mousemove",p=>{try{if(ie||at)return;let m=n.getBoundingClientRect(),b=20,x=p.clientX,C=p.clientY,A=x-m.left<=b,B=m.right-x<=b,N=C-m.top<=b,P=m.bottom-C<=b,Y="";N&&A||P&&B?Y="nwse-resize":N&&B||P&&A?Y="nesw-resize":Y="",document.body.style.cursor=Y}catch{}}),n.addEventListener("mouseleave",()=>{!at&&!ie&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=ln,setTimeout(()=>{if(ln(),n&&v&&S&&s){let p=40,m=ee();if(m.length>0)p=m[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",s.appendChild(b),p=b.offsetHeight,s.removeChild(b)}H=v.offsetHeight+S.offsetHeight+p,n.style.minHeight=H+"px"}},0),window.addEventListener("resize",ln),new ResizeObserver(ln).observe(n),Xt||document.addEventListener("pointerdown",Xt=()=>{Io=Date.now()},!0),Qt||document.addEventListener("pointerup",Qt=()=>{},!0)}finally{Qn=!1}}}async function Wi(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(u=>{u!==n&&(c("Removing duplicate pane element from DOM"),u.remove())}),document.body.contains(n)){c("Pane already in DOM, skipping append");return}await ji(),typeof Eo=="function"&&Eo(Ho),typeof Yn=="function"&&Yn($n),typeof Zn=="function"&&Zn(so),typeof To=="function"&&To(M),await ko(),await Ei(),await jt(),typeof _t=="function"&&_t();let o=document.querySelectorAll("#ytls-pane");if(o.length>0&&(c(`WARNING: Found ${o.length} existing pane(s) in DOM, removing all`),o.forEach(u=>u.remove())),document.body.contains(n)){c("ERROR: Pane already in body, aborting append");return}document.body.appendChild(n),c("Pane successfully appended to DOM"),re(),me&&(clearTimeout(me),me=null),me=setTimeout(()=>{$(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ce(),G(!0),me=null},450),new MutationObserver(()=>{let u=document.querySelectorAll("#ytls-pane");u.length>1&&(c(`CRITICAL: Multiple panes detected (${u.length}), removing duplicates`),u.forEach((y,g)=>{(g>0||n&&y!==n)&&y.remove()}))}).observe(document.body,{childList:!0,subtree:!0})}function No(t=0){if(document.getElementById("ytls-header-button")){ot();return}let o=document.querySelector("#logo");if(!o||!o.parentElement){t<10&&setTimeout(()=>No(t+1),300);return}let l=document.createElement("button");l.id="ytls-header-button",l.type="button",l.className="ytls-header-button",je(l,"Toggle Timekeeper UI"),l.setAttribute("aria-label","Toggle Timekeeper UI");let u=document.createElement("img");u.src=Te,u.alt="",u.decoding="async",l.appendChild(u),ft=u,l.addEventListener("mouseenter",()=>{ft&&(xn=!0,ft.src=De)}),l.addEventListener("mouseleave",()=>{ft&&(xn=!1,ot())}),l.addEventListener("click",()=>{n&&!document.body.contains(n)&&(c("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),lo()}),o.insertAdjacentElement("afterend",l),ot(),c("Timekeeper header button added next to YouTube logo")}function Go(){if(K)return;K=!0;let t=history.pushState,o=history.replaceState;function l(){try{let u=new Event("locationchange");window.dispatchEvent(u)}catch{}}history.pushState=function(){let u=t.apply(this,arguments);return l(),u},history.replaceState=function(){let u=o.apply(this,arguments);return l(),u},window.addEventListener("popstate",l),window.addEventListener("locationchange",()=>{window.location.href!==Z&&c("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function co(){if(!f()){zi();return}Z=window.location.href,document.querySelectorAll("#ytls-pane").forEach((o,l)=>{(l>0||n&&o!==n)&&o.remove()}),await de(),await Vi(),he=ro();let t=document.title;c("Page Title:",t),c("Video ID:",he),c("Current URL:",window.location.href),oo(!0),wt(),Se(),await Fo(),Se(),oo(!1),c("Timestamps loaded and UI unlocked for video:",he),await Wi(),No(),Fi()}Go(),window.addEventListener("yt-navigate-start",()=>{c("Navigation started (yt-navigate-start event fired)"),f()&&n&&s&&(c("Locking UI and showing loading state for navigation"),oo(!0))}),Jt=t=>{t.ctrlKey&&t.altKey&&t.shiftKey&&(t.key==="T"||t.key==="t")&&(t.preventDefault(),lo(),c("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",Jt),window.addEventListener("yt-navigate-finish",()=>{c("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==Z?co():c("Navigation finished but URL already handled, skipping.")}),Go(),c("Timekeeper initialized and waiting for navigation events")})();})();

