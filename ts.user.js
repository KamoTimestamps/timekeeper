// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.4.2
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

(()=>{function l(e,...i){let a="debug",s=[...i];i.length>0&&typeof i[i.length-1]=="string"&&["debug","info","warn","error"].includes(i[i.length-1])&&(a=s.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[a](`${n} ${e}`,...s)}function vt(e,i=e){let a=Math.floor(e/3600),s=Math.floor(e%3600/60),f=String(e%60).padStart(2,"0");return i<3600?`${s<10?s:String(s).padStart(2,"0")}:${f}`:`${i>=36e3?String(a).padStart(2,"0"):a}:${String(s).padStart(2,"0")}:${f}`}function go(e,i=window.location.href){try{let a=new URL(i);return a.searchParams.set("t",`${e}s`),a.toString()}catch{return`https://www.youtube.com/watch?v=${i.search(/[?&]v=/)>=0?i.split(/[?&]v=/)[1].split(/&/)[0]:i.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function mn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var or=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function ei(){let e=new Date,i=e.getFullYear(),a=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let s of or){let f=new Date(i,s.month-1,s.day),n=f.getTime()-e.getTime(),v=n/(1e3*60*60*24);if(v<=5&&v>=-2)return l(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v<-2&&(f=new Date(i+1,s.month-1,s.day),n=f.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return l(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v>5&&(f=new Date(i-1,s.month-1,s.day),n=f.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return l(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji}return l(`Current date: ${a}, No holiday emoji (not within range)`),null}var bt=null,_t=null,ir=500;function rr(){return(!bt||!document.body.contains(bt))&&(bt=document.createElement("div"),bt.className="ytls-tooltip",document.body.appendChild(bt)),bt}function ar(e,i,a){let f=window.innerWidth,n=window.innerHeight,v=e.getBoundingClientRect(),c=v.width,S=v.height,E=i+10,k=a+10;E+c>f-10&&(E=i-c-10),k+S>n-10&&(k=a-S-10),E=Math.max(10,Math.min(E,f-c-10)),k=Math.max(10,Math.min(k,n-S-10)),e.style.left=`${E}px`,e.style.top=`${k}px`}function sr(e,i,a){_t&&clearTimeout(_t),_t=setTimeout(()=>{let s=rr();s.textContent=e,s.classList.remove("ytls-tooltip-visible"),ar(s,i,a),requestAnimationFrame(()=>{s.classList.add("ytls-tooltip-visible")})},ir)}function yo(){_t&&(clearTimeout(_t),_t=null),bt&&bt.classList.remove("ytls-tooltip-visible")}function nt(e,i){let a=0,s=0,f=S=>{a=S.clientX,s=S.clientY;let E=typeof i=="function"?i():i;E&&sr(E,a,s)},n=S=>{a=S.clientX,s=S.clientY},v=()=>{yo()};e.addEventListener("mouseenter",f),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",v);let c=new MutationObserver(()=>{try{if(!document.body.contains(e))yo();else{let S=window.getComputedStyle(e);(S.display==="none"||S.visibility==="hidden"||S.opacity==="0")&&yo()}}catch{}});try{c.observe(e,{attributes:!0,attributeFilter:["class","style"]}),c.observe(document.body,{childList:!0,subtree:!0})}catch{}e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",f),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",v);try{c.disconnect()}catch{}delete e.__tooltipObserver},e.__tooltipObserver=c}var ti=`
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

`;var Ee=Uint8Array,qe=Uint16Array,Eo=Int32Array,ko=new Ee([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),So=new Ee([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ni=new Ee([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),li=function(e,i){for(var a=new qe(31),s=0;s<31;++s)a[s]=i+=1<<e[s-1];for(var f=new Eo(a[30]),s=1;s<30;++s)for(var n=a[s];n<a[s+1];++n)f[n]=n-a[s]<<5|s;return{b:a,r:f}},ci=li(ko,2),lr=ci.b,bo=ci.r;lr[28]=258,bo[258]=28;var ui=li(So,0),Or=ui.b,oi=ui.r,wo=new qe(32768);for(_=0;_<32768;++_)dt=(_&43690)>>1|(_&21845)<<1,dt=(dt&52428)>>2|(dt&13107)<<2,dt=(dt&61680)>>4|(dt&3855)<<4,wo[_]=((dt&65280)>>8|(dt&255)<<8)>>1;var dt,_,hn=(function(e,i,a){for(var s=e.length,f=0,n=new qe(i);f<s;++f)e[f]&&++n[e[f]-1];var v=new qe(i);for(f=1;f<i;++f)v[f]=v[f-1]+n[f-1]<<1;var c;if(a){c=new qe(1<<i);var S=15-i;for(f=0;f<s;++f)if(e[f])for(var E=f<<4|e[f],k=i-e[f],A=v[e[f]-1]++<<k,M=A|(1<<k)-1;A<=M;++A)c[wo[A]>>S]=E}else for(c=new qe(s),f=0;f<s;++f)e[f]&&(c[f]=wo[v[e[f]-1]++]>>15-e[f]);return c}),Mt=new Ee(288);for(_=0;_<144;++_)Mt[_]=8;var _;for(_=144;_<256;++_)Mt[_]=9;var _;for(_=256;_<280;++_)Mt[_]=7;var _;for(_=280;_<288;++_)Mt[_]=8;var _,Yn=new Ee(32);for(_=0;_<32;++_)Yn[_]=5;var _,cr=hn(Mt,9,0);var ur=hn(Yn,5,0);var di=function(e){return(e+7)/8|0},mi=function(e,i,a){return(i==null||i<0)&&(i=0),(a==null||a>e.length)&&(a=e.length),new Ee(e.subarray(i,a))};var dr=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Zn=function(e,i,a){var s=new Error(i||dr[e]);if(s.code=e,Error.captureStackTrace&&Error.captureStackTrace(s,Zn),!a)throw s;return s};var mt=function(e,i,a){a<<=i&7;var s=i/8|0;e[s]|=a,e[s+1]|=a>>8},fn=function(e,i,a){a<<=i&7;var s=i/8|0;e[s]|=a,e[s+1]|=a>>8,e[s+2]|=a>>16},vo=function(e,i){for(var a=[],s=0;s<e.length;++s)e[s]&&a.push({s,f:e[s]});var f=a.length,n=a.slice();if(!f)return{t:pi,l:0};if(f==1){var v=new Ee(a[0].s+1);return v[a[0].s]=1,{t:v,l:1}}a.sort(function(he,Ie){return he.f-Ie.f}),a.push({s:-1,f:25001});var c=a[0],S=a[1],E=0,k=1,A=2;for(a[0]={s:-1,f:c.f+S.f,l:c,r:S};k!=f-1;)c=a[a[E].f<a[A].f?E++:A++],S=a[E!=k&&a[E].f<a[A].f?E++:A++],a[k++]={s:-1,f:c.f+S.f,l:c,r:S};for(var M=n[0].s,s=1;s<f;++s)n[s].s>M&&(M=n[s].s);var R=new qe(M+1),Z=xo(a[k-1],R,0);if(Z>i){var s=0,W=0,X=Z-i,oe=1<<X;for(n.sort(function(Ie,re){return R[re.s]-R[Ie.s]||Ie.f-re.f});s<f;++s){var U=n[s].s;if(R[U]>i)W+=oe-(1<<Z-R[U]),R[U]=i;else break}for(W>>=X;W>0;){var ue=n[s].s;R[ue]<i?W-=1<<i-R[ue]++-1:++s}for(;s>=0&&W;--s){var J=n[s].s;R[J]==i&&(--R[J],++W)}Z=i}return{t:new Ee(R),l:Z}},xo=function(e,i,a){return e.s==-1?Math.max(xo(e.l,i,a+1),xo(e.r,i,a+1)):i[e.s]=a},ii=function(e){for(var i=e.length;i&&!e[--i];);for(var a=new qe(++i),s=0,f=e[0],n=1,v=function(S){a[s++]=S},c=1;c<=i;++c)if(e[c]==f&&c!=i)++n;else{if(!f&&n>2){for(;n>138;n-=138)v(32754);n>2&&(v(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(v(f),--n;n>6;n-=6)v(8304);n>2&&(v(n-3<<5|8208),n=0)}for(;n--;)v(f);n=1,f=e[c]}return{c:a.subarray(0,s),n:i}},pn=function(e,i){for(var a=0,s=0;s<i.length;++s)a+=e[s]*i[s];return a},fi=function(e,i,a){var s=a.length,f=di(i+2);e[f]=s&255,e[f+1]=s>>8,e[f+2]=e[f]^255,e[f+3]=e[f+1]^255;for(var n=0;n<s;++n)e[f+n+4]=a[n];return(f+4+s)*8},ri=function(e,i,a,s,f,n,v,c,S,E,k){mt(i,k++,a),++f[256];for(var A=vo(f,15),M=A.t,R=A.l,Z=vo(n,15),W=Z.t,X=Z.l,oe=ii(M),U=oe.c,ue=oe.n,J=ii(W),he=J.c,Ie=J.n,re=new qe(19),G=0;G<U.length;++G)++re[U[G]&31];for(var G=0;G<he.length;++G)++re[he[G]&31];for(var H=vo(re,7),se=H.t,de=H.l,le=19;le>4&&!se[ni[le-1]];--le);var Re=E+5<<3,ke=pn(f,Mt)+pn(n,Yn)+v,De=pn(f,M)+pn(n,W)+v+14+3*le+pn(re,se)+2*re[16]+3*re[17]+7*re[18];if(S>=0&&Re<=ke&&Re<=De)return fi(i,k,e.subarray(S,S+E));var We,me,Be,it;if(mt(i,k,1+(De<ke)),k+=2,De<ke){We=hn(M,R,0),me=M,Be=hn(W,X,0),it=W;var Kt=hn(se,de,0);mt(i,k,ue-257),mt(i,k+5,Ie-1),mt(i,k+10,le-4),k+=14;for(var G=0;G<le;++G)mt(i,k+3*G,se[ni[G]]);k+=3*le;for(var He=[U,he],Oe=0;Oe<2;++Oe)for(var ze=He[Oe],G=0;G<ze.length;++G){var q=ze[G]&31;mt(i,k,Kt[q]),k+=se[q],q>15&&(mt(i,k,ze[G]>>5&127),k+=ze[G]>>12)}}else We=cr,me=Mt,Be=ur,it=Yn;for(var G=0;G<c;++G){var ce=s[G];if(ce>255){var q=ce>>18&31;fn(i,k,We[q+257]),k+=me[q+257],q>7&&(mt(i,k,ce>>23&31),k+=ko[q]);var ft=ce&31;fn(i,k,Be[ft]),k+=it[ft],ft>3&&(fn(i,k,ce>>5&8191),k+=So[ft])}else fn(i,k,We[ce]),k+=me[ce]}return fn(i,k,We[256]),k+me[256]},mr=new Eo([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),pi=new Ee(0),fr=function(e,i,a,s,f,n){var v=n.z||e.length,c=new Ee(s+v+5*(1+Math.ceil(v/7e3))+f),S=c.subarray(s,c.length-f),E=n.l,k=(n.r||0)&7;if(i){k&&(S[0]=n.r>>3);for(var A=mr[i-1],M=A>>13,R=A&8191,Z=(1<<a)-1,W=n.p||new qe(32768),X=n.h||new qe(Z+1),oe=Math.ceil(a/3),U=2*oe,ue=function(Pe){return(e[Pe]^e[Pe+1]<<oe^e[Pe+2]<<U)&Z},J=new Eo(25e3),he=new qe(288),Ie=new qe(32),re=0,G=0,H=n.i||0,se=0,de=n.w||0,le=0;H+2<v;++H){var Re=ue(H),ke=H&32767,De=X[Re];if(W[ke]=De,X[Re]=ke,de<=H){var We=v-H;if((re>7e3||se>24576)&&(We>423||!E)){k=ri(e,S,0,J,he,Ie,G,se,le,H-le,k),se=re=G=0,le=H;for(var me=0;me<286;++me)he[me]=0;for(var me=0;me<30;++me)Ie[me]=0}var Be=2,it=0,Kt=R,He=ke-De&32767;if(We>2&&Re==ue(H-He))for(var Oe=Math.min(M,We)-1,ze=Math.min(32767,H),q=Math.min(258,We);He<=ze&&--Kt&&ke!=De;){if(e[H+Be]==e[H+Be-He]){for(var ce=0;ce<q&&e[H+ce]==e[H+ce-He];++ce);if(ce>Be){if(Be=ce,it=He,ce>Oe)break;for(var ft=Math.min(He,ce-2),wn=0,me=0;me<ft;++me){var At=H-He+me&32767,no=W[At],Zt=At-no&32767;Zt>wn&&(wn=Zt,De=At)}}}ke=De,De=W[ke],He+=ke-De&32767}if(it){J[se++]=268435456|bo[Be]<<18|oi[it];var xn=bo[Be]&31,Dt=oi[it]&31;G+=ko[xn]+So[Dt],++he[257+xn],++Ie[Dt],de=H+Be,++re}else J[se++]=e[H],++he[e[H]]}}for(H=Math.max(H,de);H<v;++H)J[se++]=e[H],++he[e[H]];k=ri(e,S,E,J,he,Ie,G,se,le,H-le,k),E||(n.r=k&7|S[k/8|0]<<3,k-=7,n.h=X,n.p=W,n.i=H,n.w=de)}else{for(var H=n.w||0;H<v+E;H+=65535){var wt=H+65535;wt>=v&&(S[k/8|0]=E,wt=v),k=fi(S,k+1,e.subarray(H,wt))}n.i=v}return mi(c,0,s+di(k)+f)},pr=(function(){for(var e=new Int32Array(256),i=0;i<256;++i){for(var a=i,s=9;--s;)a=(a&1&&-306674912)^a>>>1;e[i]=a}return e})(),hr=function(){var e=-1;return{p:function(i){for(var a=e,s=0;s<i.length;++s)a=pr[a&255^i[s]]^a>>>8;e=a},d:function(){return~e}}};var gr=function(e,i,a,s,f){if(!f&&(f={l:1},i.dictionary)){var n=i.dictionary.subarray(-32768),v=new Ee(n.length+e.length);v.set(n),v.set(e,n.length),e=v,f.w=n.length}return fr(e,i.level==null?6:i.level,i.mem==null?f.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+i.mem,a,s,f)},hi=function(e,i){var a={};for(var s in e)a[s]=e[s];for(var s in i)a[s]=i[s];return a};var Te=function(e,i,a){for(;a;++i)e[i]=a,a>>>=8};function yr(e,i){return gr(e,i||{},0,0)}var gi=function(e,i,a,s){for(var f in e){var n=e[f],v=i+f,c=s;Array.isArray(n)&&(c=hi(s,n[1]),n=n[0]),n instanceof Ee?a[v]=[n,c]:(a[v+="/"]=[new Ee(0),c],gi(n,v,a,s))}},ai=typeof TextEncoder<"u"&&new TextEncoder,vr=typeof TextDecoder<"u"&&new TextDecoder,br=0;try{vr.decode(pi,{stream:!0}),br=1}catch{}function Kn(e,i){if(i){for(var a=new Ee(e.length),s=0;s<e.length;++s)a[s]=e.charCodeAt(s);return a}if(ai)return ai.encode(e);for(var f=e.length,n=new Ee(e.length+(e.length>>1)),v=0,c=function(k){n[v++]=k},s=0;s<f;++s){if(v+5>n.length){var S=new Ee(v+8+(f-s<<1));S.set(n),n=S}var E=e.charCodeAt(s);E<128||i?c(E):E<2048?(c(192|E>>6),c(128|E&63)):E>55295&&E<57344?(E=65536+(E&1047552)|e.charCodeAt(++s)&1023,c(240|E>>18),c(128|E>>12&63),c(128|E>>6&63),c(128|E&63)):(c(224|E>>12),c(128|E>>6&63),c(128|E&63))}return mi(n,0,v)}var To=function(e){var i=0;if(e)for(var a in e){var s=e[a].length;s>65535&&Zn(9),i+=s+4}return i},si=function(e,i,a,s,f,n,v,c){var S=s.length,E=a.extra,k=c&&c.length,A=To(E);Te(e,i,v!=null?33639248:67324752),i+=4,v!=null&&(e[i++]=20,e[i++]=a.os),e[i]=20,i+=2,e[i++]=a.flag<<1|(n<0&&8),e[i++]=f&&8,e[i++]=a.compression&255,e[i++]=a.compression>>8;var M=new Date(a.mtime==null?Date.now():a.mtime),R=M.getFullYear()-1980;if((R<0||R>119)&&Zn(10),Te(e,i,R<<25|M.getMonth()+1<<21|M.getDate()<<16|M.getHours()<<11|M.getMinutes()<<5|M.getSeconds()>>1),i+=4,n!=-1&&(Te(e,i,a.crc),Te(e,i+4,n<0?-n-2:n),Te(e,i+8,a.size)),Te(e,i+12,S),Te(e,i+14,A),i+=16,v!=null&&(Te(e,i,k),Te(e,i+6,a.attrs),Te(e,i+10,v),i+=14),e.set(s,i),i+=S,A)for(var Z in E){var W=E[Z],X=W.length;Te(e,i,+Z),Te(e,i+2,X),e.set(W,i+4),i+=4+X}return k&&(e.set(c,i),i+=k),i},wr=function(e,i,a,s,f){Te(e,i,101010256),Te(e,i+8,a),Te(e,i+10,a),Te(e,i+12,s),Te(e,i+16,f)};function yi(e,i){i||(i={});var a={},s=[];gi(e,"",a,i);var f=0,n=0;for(var v in a){var c=a[v],S=c[0],E=c[1],k=E.level==0?0:8,A=Kn(v),M=A.length,R=E.comment,Z=R&&Kn(R),W=Z&&Z.length,X=To(E.extra);M>65535&&Zn(11);var oe=k?yr(S,E):S,U=oe.length,ue=hr();ue.p(S),s.push(hi(E,{size:S.length,crc:ue.d(),c:oe,f:A,m:Z,u:M!=v.length||Z&&R.length!=W,o:f,compression:k})),f+=30+M+X+U,n+=76+2*(M+X)+(W||0)+U}for(var J=new Ee(n+22),he=f,Ie=n-f,re=0;re<s.length;++re){var A=s[re];si(J,A.o,A,A.f,A.u,A.c.length);var G=30+A.f.length+To(A.extra);J.set(A.c,A.o+G),si(J,f,A,A.f,A.u,A.c.length,A.o,A.m),f+=16+G+(A.m?A.m.length:0)}return wr(J,f,s.length,Ie,he),J}var O={isSignedIn:!1,accessToken:null,userName:null,email:null},ot=!0,Ve=30,Ke=null,jt=!1,qt=0,Ye=null,Lo=null,we=null,j=null,Jn=null;function xi(e){Lo=e}function Ti(e){we=e}function Ei(e){j=e}function Io(e){Jn=e}var vi=!1;function ki(){if(!vi)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),vi=!0}catch{}}var Si=null,gn=null,yn=null;function Co(e){Si=e}function Qn(e){gn=e}function eo(e){yn=e}var bi="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",xr="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Tr="https://www.youtube.com/",Er=30*1e3,kr=1800*1e3,wi=5,Xn=null,je=null;async function Mo(){try{let e=await yn("googleAuthState");e&&typeof e=="object"&&(O={...O,...e},bn(),O.isSignedIn&&O.accessToken&&await Yt(!0))}catch(e){l("Failed to load Google auth state:",e,"error")}}async function to(){try{await gn("googleAuthState",O)}catch(e){l("Failed to save Google auth state:",e,"error")}}function bn(){Lo&&(Lo.style.display="none")}function $e(e,i){if(j){if(j.style.fontWeight="bold",e==="authenticating"){for(ki(),j.style.color="#ffa500";j.firstChild;)j.removeChild(j.firstChild);let a=document.createElement("span");a.className="tk-auth-spinner";let s=document.createTextNode(` ${i||"Authorizing with Google\u2026"}`);j.appendChild(a),j.appendChild(s);return}if(e==="error"){j.textContent=`\u274C ${i||"Authorization failed"}`,j.style.color="#ff4d4f",Wt();return}O.isSignedIn?(j.textContent="\u2705 Signed in",j.style.color="#52c41a",j.removeAttribute("title"),O.userName?(j.onmouseenter=()=>{j.textContent=`\u2705 Signed in as ${O.userName}`},j.onmouseleave=()=>{j.textContent="\u2705 Signed in"}):(j.onmouseenter=null,j.onmouseleave=null)):(j.textContent="\u274C Not signed in",j.style.color="#ff4d4f",j.removeAttribute("title"),j.onmouseenter=null,j.onmouseleave=null),Wt()}}function Sr(){j&&(ki(),j.classList.remove("tk-auth-blink"),j.offsetWidth,j.classList.add("tk-auth-blink"),setTimeout(()=>{j.classList.remove("tk-auth-blink")},1200))}function Lr(e){return new Promise((i,a)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),a(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let s=Date.now(),f=300*1e3,n="timekeeper_oauth",v=null,c=null,S=null,E=()=>{if(v){try{v.close()}catch{}v=null}c&&(clearInterval(c),c=null),S&&(clearInterval(S),S=null)};try{v=new BroadcastChannel(n),l&&l("OAuth monitor: BroadcastChannel created successfully"),v.onmessage=M=>{if(l&&l("OAuth monitor: received BroadcastChannel message",M.data),M.data?.type==="timekeeper_oauth_token"&&M.data?.token){l&&l("OAuth monitor: token received via BroadcastChannel"),E();try{e.close()}catch{}i(M.data.token)}else if(M.data?.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),E();try{e.close()}catch{}a(new Error(M.data.error||"OAuth failed"))}}}catch(M){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",M)}l&&l("OAuth monitor: setting up IndexedDB polling");let k=Date.now();c=setInterval(async()=>{try{let M=indexedDB.open("ytls-timestamps-db",3);M.onsuccess=()=>{let R=M.result,X=R.transaction("settings","readonly").objectStore("settings").get("oauth_message");X.onsuccess=()=>{let oe=X.result;if(oe&&oe.value){let U=oe.value;if(U.timestamp&&U.timestamp>k){if(l&&l("OAuth monitor: received IndexedDB message",U),U.type==="timekeeper_oauth_token"&&U.token){l&&l("OAuth monitor: token received via IndexedDB"),E();try{e.close()}catch{}R.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(U.token)}else if(U.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",U.error,"error"),E();try{e.close()}catch{}R.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),a(new Error(U.error||"OAuth failed"))}k=U.timestamp}}R.close()}}}catch(M){l&&l("OAuth monitor: IndexedDB polling error",M,"error")}},500),S=setInterval(()=>{if(Date.now()-s>f){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),E();try{e.close()}catch{}a(new Error("OAuth popup timed out"));return}},1e3)})}async function Li(){if(!bi){$e("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),$e("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",bi),e.searchParams.set("redirect_uri",Tr),e.searchParams.set("response_type","token"),e.searchParams.set("scope",xr),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let i=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!i){l&&l("OAuth signin: popup blocked by browser",null,"error"),$e("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),$e("authenticating","Waiting for authentication...");try{let a=await Lr(i),s=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${a}`}});if(s.ok){let f=await s.json();O.accessToken=a,O.isSignedIn=!0,O.userName=f.name,O.email=f.email,await to(),bn(),$e(),Ze(),await Yt(),l?l(`Successfully authenticated as ${f.name}`):console.log(`[Timekeeper] Successfully authenticated as ${f.name}`)}else throw new Error("Failed to fetch user info")}catch(a){let s=a instanceof Error?a.message:"Authentication failed";l?l("OAuth failed:",a,"error"):console.error("[Timekeeper] OAuth failed:",a),$e("error",s);return}}catch(e){let i=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),$e("error",`Failed to sign in: ${i}`)}}async function Ii(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let i=e.startsWith("#")?e.substring(1):e,a=new URLSearchParams(i),s=a.get("state");if(l&&l("OAuth popup: hash params found, state="+s),s!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let f=a.get("error"),n=a.get("access_token"),v="timekeeper_oauth";if(f){try{let c=new BroadcastChannel(v);c.postMessage({type:"timekeeper_oauth_error",error:a.get("error_description")||f}),c.close()}catch{let S={type:"timekeeper_oauth_error",error:a.get("error_description")||f,timestamp:Date.now()},E=indexedDB.open("ytls-timestamps-db",3);E.onsuccess=()=>{let k=E.result;k.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),k.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){l&&l("OAuth popup: access token found, broadcasting to opener");try{let c=new BroadcastChannel(v);c.postMessage({type:"timekeeper_oauth_token",token:n}),c.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(c){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",c);let S={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},E=indexedDB.open("ytls-timestamps-db",3);E.onsuccess=()=>{let k=E.result;k.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),k.close()},l&&l("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Ci(){O={isSignedIn:!1,accessToken:null,userName:null,email:null},await to(),bn(),$e(),Ze()}async function Mi(){if(!O.isSignedIn||!O.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${O.accessToken}`}});return e.status===401?(await Ai({silent:!0}),!1):e.ok}catch(e){return l("Failed to verify auth state:",e,"error"),!1}}async function Ir(e){let i={Authorization:`Bearer ${e}`},s=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,f=await fetch(s,{headers:i});if(f.status===401)throw new Error("unauthorized");if(!f.ok)throw new Error("drive search failed");let n=await f.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let v=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...i,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(v.status===401)throw new Error("unauthorized");if(!v.ok)throw new Error("drive folder create failed");return(await v.json()).id}async function Cr(e,i,a){let s=`name='${e}' and '${i}' in parents and trashed=false`,f=encodeURIComponent(s),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${f}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${a}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let v=await n.json();return v.files&&v.files.length>0?v.files[0].id:null}function Mr(e,i){let a=Kn(e),s=i.replace(/\\/g,"/").replace(/^\/+/,"");return s.endsWith(".json")||(s+=".json"),yi({[s]:[a,{level:6,mtime:new Date,os:0}]})}async function Ar(e,i,a,s){let f=e.replace(/\.json$/,".zip"),n=await Cr(f,a,s),v=new TextEncoder().encode(i).length,c=Mr(i,e),S=c.length;l(`Compressing data: ${v} bytes -> ${S} bytes (${Math.round(100-S/v*100)}% reduction)`);let E="-------314159265358979",k=`\r
--${E}\r
`,A=`\r
--${E}--`,M=n?{name:f,mimeType:"application/zip"}:{name:f,mimeType:"application/zip",parents:[a]},R=8192,Z="";for(let J=0;J<c.length;J+=R){let he=c.subarray(J,Math.min(J+R,c.length));Z+=String.fromCharCode.apply(null,Array.from(he))}let W=btoa(Z),X=k+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(M)+k+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+W+A,oe,U;n?(oe=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,U="PATCH"):(oe="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",U="POST");let ue=await fetch(oe,{method:U,headers:{Authorization:`Bearer ${s}`,"Content-Type":`multipart/related; boundary=${E}`},body:X});if(ue.status===401)throw new Error("unauthorized");if(!ue.ok)throw new Error("drive upload failed")}async function Ai(e){l("Auth expired, clearing token",null,"warn"),O.isSignedIn=!1,O.accessToken=null,await to(),$e("error","Authorization expired. Please sign in again."),Ze()}async function Dr(e){if(!O.isSignedIn||!O.accessToken){e?.silent||$e("error","Please sign in to Google Drive first");return}try{let{json:i,filename:a,totalVideos:s,totalTimestamps:f}=await Si();if(f===0){e?.silent||l("Skipping export: no timestamps to back up");return}let n=await Ir(O.accessToken);await Ar(a,i,n,O.accessToken),l(`Exported to Google Drive (${a}) with ${s} videos / ${f} timestamps.`)}catch(i){throw i.message==="unauthorized"?(await Ai({silent:e?.silent}),i):(l("Drive export failed:",i,"error"),e?.silent||$e("error","Failed to export to Google Drive."),i)}}async function Di(){try{let e=await yn("autoBackupEnabled"),i=await yn("autoBackupIntervalMinutes"),a=await yn("lastAutoBackupAt");typeof e=="boolean"&&(ot=e),typeof i=="number"&&i>0&&(Ve=i),typeof a=="number"&&a>0&&(Ke=a)}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function Ao(){try{await gn("autoBackupEnabled",ot),await gn("autoBackupIntervalMinutes",Ve),await gn("lastAutoBackupAt",Ke??0)}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Br(){Xn&&(clearInterval(Xn),Xn=null),je&&(clearTimeout(je),je=null)}function Vt(e){try{let i=new Date(e),a=new Date,s=i.toDateString()===a.toDateString(),f=i.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return s?f:`${i.toLocaleDateString()} ${f}`}catch{return""}}function Ze(){if(!we)return;let e="",i="";if(!ot)e="\u{1F501} Backup: Off",we.onmouseenter=null,we.onmouseleave=null;else if(jt)e="\u{1F501} Backing up\u2026",we.onmouseenter=null,we.onmouseleave=null;else if(Ye&&Ye>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(Ye/6e4)}m`,we.onmouseenter=null,we.onmouseleave=null;else if(Ke){e=`\u{1F5C4}\uFE0F Last backup: ${Vt(Ke)}`;let a=Ke+Math.max(1,Ve)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Vt(a)}`,we.onmouseenter=()=>{we.textContent=i},we.onmouseleave=()=>{we.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let a=Date.now()+Math.max(1,Ve)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Vt(a)}`,we.onmouseenter=()=>{we.textContent=i},we.onmouseleave=()=>{we.textContent=e}}we.textContent=e,we.style.display=e?"inline":"none",Wt()}function Wt(){if(!Jn)return;let e="";ot?jt?e="#4285f4":Ye&&Ye>0?e="#ffa500":O.isSignedIn&&Ke?e="#52c41a":O.isSignedIn?e="#ffa500":e="#ff4d4f":e="#ff4d4f",Jn.style.backgroundColor=e,nt(Jn,()=>{let i="";if(!ot)i="Auto backup is disabled";else if(jt)i="Backup in progress";else if(Ye&&Ye>0)i=`Retrying backup in ${Math.ceil(Ye/6e4)}m`;else if(O.isSignedIn&&Ke){let a=Ke+Math.max(1,Ve)*60*1e3,s=Vt(a);i=`Last backup: ${Vt(Ke)}
Next backup: ${s}`}else if(O.isSignedIn){let a=Date.now()+Math.max(1,Ve)*60*1e3;i=`No backup yet
Next backup: ${Vt(a)}`}else i="Not signed in to Google Drive";return i})}async function vn(e=!0){if(!O.isSignedIn||!O.accessToken){e||Sr();return}if(je){l("Auto backup: backoff in progress, skipping scheduled run");return}if(!jt){jt=!0,Ze();try{await Dr({silent:e}),Ke=Date.now(),qt=0,Ye=null,je&&(clearTimeout(je),je=null),await Ao()}catch(i){if(l("Auto backup failed:",i,"error"),i.message==="unauthorized")l("Auth error detected, clearing token and stopping retries",null,"warn"),O.isSignedIn=!1,O.accessToken=null,await to(),$e("error","Authorization expired. Please sign in again."),Ze(),qt=0,Ye=null,je&&(clearTimeout(je),je=null);else if(qt<wi){qt+=1;let f=Math.min(Er*Math.pow(2,qt-1),kr);Ye=f,je&&clearTimeout(je),je=setTimeout(()=>{vn(!0)},f),l(`Scheduling backup retry ${qt}/${wi} in ${Math.round(f/1e3)}s`),Ze()}else Ye=null}finally{jt=!1,Ze()}}}async function Yt(e=!1){if(Br(),!!ot&&!(!O.isSignedIn||!O.accessToken)){if(Xn=setInterval(()=>{vn(!0)},Math.max(1,Ve)*60*1e3),!e){let i=Date.now(),a=Math.max(1,Ve)*60*1e3;(!Ke||i-Ke>=a)&&vn(!0)}Ze()}}async function Bi(){ot=!ot,await Ao(),await Yt(),Ze()}async function zi(){let e=prompt("Set Auto Backup interval (minutes):",String(Ve));if(e===null)return;let i=Math.floor(Number(e));if(!Number.isFinite(i)||i<5||i>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Ve=i,await Ao(),await Yt(),Ze()}var Do=window.location.hash;if(Do&&Do.length>1){let e=new URLSearchParams(Do.substring(1));if(e.get("state")==="timekeeper_auth"){let a=e.get("access_token");if(a){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",a.length,"characters");try{let s=new BroadcastChannel("timekeeper_oauth"),f={type:"timekeeper_oauth_token",token:a};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:f.type,tokenLength:a.length}),s.postMessage(f),s.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(s){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",s);let f={type:"timekeeper_oauth_token",token:a,timestamp:Date.now()},n=indexedDB.open("ytls-timestamps-db",3);n.onsuccess=()=>{let v=n.result,c=v.transaction("settings","readwrite");c.objectStore("settings").put({key:"oauth_message",value:f}),c.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",f.timestamp),v.close()}}}if(history.replaceState){let s=window.location.pathname+window.location.search;history.replaceState(null,"",s)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(t){return GM.getValue(`timekeeper_${t}`,void 0)}function i(t,o){return GM.setValue(`timekeeper_${t}`,JSON.stringify(o))}if(eo(e),Qn(i),await Ii()){l("OAuth popup detected, broadcasting token and closing");return}await Mo();let s=["/watch","/live"];function f(t=window.location.href){try{let o=new URL(t);return o.origin!=="https://www.youtube.com"?!1:s.some(r=>o.pathname===r||o.pathname.startsWith(`${r}/`))}catch(o){return l("Timekeeper failed to parse URL for support check:",o,"error"),!1}}let n=null,v=null,c=null,S=null,E=null,k=null,A=null,M=null,R=250,Z=null,W=!1;function X(){return n?n.getBoundingClientRect():null}function oe(t,o,r){t&&(Fe={x:Math.round(typeof o=="number"?o:t.left),y:Math.round(typeof r=="number"?r:t.top),width:Math.round(t.width),height:Math.round(t.height)})}function U(t=!0){if(!n)return;Pt();let o=X();o&&(o.width||o.height)&&(oe(o),t&&(Un("windowPosition",Fe),Jt({type:"window_position_updated",position:Fe,timestamp:Date.now()})))}function ue(){if(!n||!v||!S||!c)return;let t=40,o=te();if(o.length>0)t=o[0].offsetHeight;else{let r=document.createElement("li");r.style.visibility="hidden",r.style.position="absolute",r.textContent="00:00 Example",c.appendChild(r),t=r.offsetHeight,c.removeChild(r)}R=v.offsetHeight+S.offsetHeight+t,n.style.minHeight=R+"px"}function J(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),U(!0)})}function he(t=450){fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),J(),fe=null},t)}function Ie(){fe&&(clearTimeout(fe),fe=null)}function re(){c&&(c.style.visibility="hidden",l("Hiding timestamps during show animation")),J(),he()}function G(){H(),Ie(),Je&&(clearTimeout(Je),Je=null),Je=setTimeout(()=>{n&&(n.style.display="none",Wo(),Je=null)},400)}function H(){if(!c){Ne&&(Ne(),Ne=null,rt=null,pt=null);return}if(!pt){c.style.visibility==="hidden"&&(c.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),Ne&&(Ne(),Ne=null,rt=null);return}l("Appending deferred timestamps after animation"),c.appendChild(pt),pt=null,c.style.visibility==="hidden"&&(c.style.visibility="",l("Restoring timestamp visibility after append")),Ne&&(Ne(),Ne=null,rt=null),et(),Ce(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let t=q(),o=t?Math.floor(t.getCurrentTime()):Et();Number.isFinite(o)&&$n(o,!1)}let se=null,de=!1,le="ytls-timestamp-pending-delete",Re="ytls-timestamp-highlight",ke="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",De="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function We(){let t=o=>{let r=new Image;r.src=o};t(ke),t(De)}We();async function me(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(t=>setTimeout(t,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(t=>setTimeout(t,100));await new Promise(t=>setTimeout(t,200))}let Be=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],it=5e3,Kt=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function He(t){return Kt.has(t)}function Oe(){return document.querySelector("video")}let ze=null;function q(){if(ze&&document.contains(ze))return ze;let t=document.getElementById("movie_player");return t&&document.contains(t)?t:null}function ce(t){return Be.every(o=>typeof t?.[o]=="function"?!0:He(o)?!!Oe():!1)}function ft(t){return Be.filter(o=>typeof t?.[o]=="function"?!1:He(o)?!Oe():!0)}async function wn(t=it){let o=Date.now();for(;Date.now()-o<t;){let u=q();if(ce(u))return u;await new Promise(y=>setTimeout(y,100))}let r=q();return ce(r),r}let At="timestampOffsetSeconds",no=-5,Zt="shiftClickTimeSkipSeconds",xn=10,Dt=300,wt=300,Pe=null;function Bo(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function zo(){if(Bo()&&!Pe)try{Pe=new BroadcastChannel("ytls_timestamp_channel"),Pe.onmessage=Po}catch(t){l("Failed to create BroadcastChannel:",t,"warn"),Pe=null}}function Jt(t){if(!Bo()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(zo(),!Pe){l("No BroadcastChannel available to post message","warn");return}try{Pe.postMessage(t)}catch(o){l("BroadcastChannel error, reopening:",o,"warn");try{Pe=new BroadcastChannel("ytls_timestamp_channel"),Pe.onmessage=Po,Pe.postMessage(t)}catch(r){l("Failed to reopen BroadcastChannel:",r,"error")}}}function Po(t){if(l("Received message from another tab:",t.data),!(!f()||!c||!n)&&t.data){if(t.data.type==="timestamps_updated"&&t.data.videoId===ge)l("Debouncing timestamp load due to external update for video:",t.data.videoId),clearTimeout(Qt),Qt=setTimeout(()=>{l("Reloading timestamps due to external update for video:",t.data.videoId),_o()},500);else if(t.data.type==="window_position_updated"&&n){let o=t.data.position;if(o&&typeof o.x=="number"&&typeof o.y=="number"){n.style.left=`${o.x}px`,n.style.top=`${o.y}px`,n.style.right="auto",n.style.bottom="auto",typeof o.width=="number"&&o.width>0&&(n.style.width=`${o.width}px`),typeof o.height=="number"&&o.height>0&&(n.style.height=`${o.height}px`);let r=n.getBoundingClientRect();Fe={x:Math.round(o.x),y:Math.round(o.y),width:Math.round(r.width),height:Math.round(r.height)};let u=document.documentElement.clientWidth,y=document.documentElement.clientHeight;(r.left<0||r.top<0||r.right>u||r.bottom>y)&&Pt()}}}}zo();let Bt=await GM.getValue(At);(typeof Bt!="number"||Number.isNaN(Bt))&&(Bt=no,await GM.setValue(At,Bt));let Xt=await GM.getValue(Zt);(typeof Xt!="number"||Number.isNaN(Xt))&&(Xt=xn,await GM.setValue(Zt,Xt));let Qt=null,xt=new Map,Tn=!1,P=null,En=null,ge=null,Je=null,fe=null,pt=null,rt=null,Ne=null,ht=null,kn=!1,Fe=null,oo=!1,Sn=null,Ln=null,In=null,Cn=null,Mn=null,An=null,Dn=null,en=null,tn=null,nn=null,Xe=null,Qe=null,Fo=0,on=!1,Tt=null,rn=null;function te(){return c?Array.from(c.querySelectorAll("li")).filter(t=>!!t.querySelector("a[data-time]")):[]}function io(){return te().map(t=>{let o=t.querySelector("a[data-time]"),r=o?.dataset.time;if(!o||!r)return null;let u=Number.parseInt(r,10);if(!Number.isFinite(u))return null;let g=t.querySelector("input")?.value??"",d=t.dataset.guid??crypto.randomUUID();return t.dataset.guid||(t.dataset.guid=d),{start:u,comment:g,guid:d}}).filter(Ro)}function Et(){if(rn!==null)return rn;let t=te();return rn=t.length>0?Math.max(...t.map(o=>{let r=o.querySelector("a[data-time]")?.getAttribute("data-time");return r?Number.parseInt(r,10):0})):0,rn}function Bn(){rn=null}function Pi(t){let o=t.querySelector(".time-diff");return o?(o.textContent?.trim()||"").startsWith("-"):!1}function Fi(t,o){return t?o?"\u2514\u2500 ":"\u251C\u2500 ":""}function an(t){return t.startsWith("\u251C\u2500 ")||t.startsWith("\u2514\u2500 ")?1:0}function $o(t){return t.replace(/^[├└]─\s/,"")}function $i(t){let o=te();if(t>=o.length-1)return"\u2514\u2500 ";let r=o[t+1].querySelector("input");return r&&an(r.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function et(){if(!c)return;let t=te(),o=!0,r=0,u=t.length;for(;o&&r<u;)o=!1,r++,t.forEach((y,g)=>{let d=y.querySelector("input");if(!d||!(an(d.value)===1))return;let T=!1;if(g<t.length-1){let z=t[g+1].querySelector("input");z&&(T=!(an(z.value)===1))}else T=!0;let x=$o(d.value),L=`${Fi(!0,T)}${x}`;d.value!==L&&(d.value=L,o=!0)})}function kt(){if(c){for(;c.firstChild;)c.removeChild(c.firstChild);pt&&(pt=null),Ne&&(Ne(),Ne=null,rt=null)}}function sn(){if(!c||de||pt)return;Array.from(c.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||ro("No timestamps for this video")}function ro(t){if(!c)return;kt();let o=document.createElement("li");o.className="ytls-placeholder",o.textContent=t,c.appendChild(o),c.style.overflowY="hidden"}function ao(){if(!c)return;let t=c.querySelector(".ytls-placeholder");t&&t.remove(),c.style.overflowY=""}function so(t){if(!(!n||!c)){if(de=t,t)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),ro("Loading timestamps...");else if(ao(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),E){let o=q();if(o){let r=o.getCurrentTime(),u=Number.isFinite(r)?Math.max(0,Math.floor(r)):Math.max(0,Et()),y=Math.floor(u/3600),g=Math.floor(u/60)%60,d=u%60,{isLive:h}=o.getVideoData()||{isLive:!1},T=c?te().map(I=>{let L=I.querySelector("a[data-time]");return L?parseFloat(L.getAttribute("data-time")??"0"):0}):[],x="";if(T.length>0)if(h){let I=Math.max(1,u/60),L=T.filter(z=>z<=u);if(L.length>0){let z=(L.length/I).toFixed(2);parseFloat(z)>0&&(x=` (${z}/min)`)}}else{let I=o.getDuration(),L=Number.isFinite(I)&&I>0?I:0,z=Math.max(1,L/60),Q=(T.length/z).toFixed(1);parseFloat(Q)>0&&(x=` (${Q}/min)`)}E.textContent=`\u23F3${y?y+":"+String(g).padStart(2,"0"):g}:${String(d).padStart(2,"0")}${x}`}}!de&&c&&!c.querySelector(".ytls-error-message")&&sn(),at()}}function Ro(t){return!!t&&Number.isFinite(t.start)&&typeof t.comment=="string"&&typeof t.guid=="string"}function zn(t,o){t.textContent=vt(o),t.dataset.time=String(o),t.href=go(o,window.location.href)}let Pn=null,Fn=null,St=!1;function Ri(t){if(!t||typeof t.getVideoData!="function"||!t.getVideoData()?.isLive)return!1;if(typeof t.getProgressState=="function"){let r=t.getProgressState(),u=Number(r?.seekableEnd??r?.liveHead??r?.head??r?.duration),y=Number(r?.current??t.getCurrentTime?.());if(Number.isFinite(u)&&Number.isFinite(y))return u-y>2}return!1}function $n(t,o){if(!Number.isFinite(t))return;let r=Rn(t);ln(r,o)}function Rn(t){if(!Number.isFinite(t))return null;let o=te();if(o.length===0)return null;let r=null,u=-1/0;for(let y of o){let d=y.querySelector("a[data-time]")?.dataset.time;if(!d)continue;let h=Number.parseInt(d,10);Number.isFinite(h)&&h<=t&&h>u&&(u=h,r=y)}return r}function ln(t,o=!1){if(!t)return;te().forEach(u=>{u.classList.contains(le)||u.classList.remove(Re)}),t.classList.contains(le)||(t.classList.add(Re),o&&!Tn&&t.scrollIntoView({behavior:"smooth",block:"center"}))}function Hi(t){if(!c||c.querySelector(".ytls-error-message")||!Number.isFinite(t)||t===0)return!1;let o=te();if(o.length===0)return!1;let r=!1;return o.forEach(u=>{let y=u.querySelector("a[data-time]"),g=y?.dataset.time;if(!y||!g)return;let d=Number.parseInt(g,10);if(!Number.isFinite(d))return;let h=Math.max(0,d+t);h!==d&&(zn(y,h),r=!0)}),r?(un(),et(),Ce(),On(ge),Tt=null,!0):!1}function Ho(t,o={}){if(!Number.isFinite(t)||t===0)return!1;if(!Hi(t)){if(o.alertOnNoChange){let d=o.failureMessage??"Offset did not change any timestamps.";alert(d)}return!1}let u=o.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${t>0?"+":""}${t} seconds (${u})`);let y=q(),g=y?Math.floor(y.getCurrentTime()):0;if(Number.isFinite(g)){let d=Rn(g);ln(d,!1)}return!0}function Oo(t){if(!c||de)return;let o=t.target instanceof HTMLElement?t.target:null;if(o)if(o.dataset.time){t.preventDefault();let r=Number(o.dataset.time);if(Number.isFinite(r)){St=!0;let y=q();y&&y.seekTo(r),setTimeout(()=>{St=!1},500)}let u=o.closest("li");u&&(te().forEach(y=>{y.classList.contains(le)||y.classList.remove(Re)}),u.classList.contains(le)||(u.classList.add(Re),u.scrollIntoView({behavior:"smooth",block:"center"})))}else if(o.dataset.increment){t.preventDefault();let u=o.parentElement?.querySelector("a[data-time]");if(!u||!u.dataset.time)return;let y=parseInt(u.dataset.time,10),g=parseInt(o.dataset.increment,10);if("shiftKey"in t&&t.shiftKey&&(g*=Xt),"altKey"in t?t.altKey:!1){Ho(g,{logLabel:"Alt adjust"});return}let T=Math.max(0,y+g);l(`Timestamps changed: Timestamp time incremented from ${y} to ${T}`),zn(u,T),Bn();let x=o.closest("li");if(Fn=T,Pn&&clearTimeout(Pn),St=!0,Pn=setTimeout(()=>{if(Fn!==null){let I=q();I&&I.seekTo(Fn)}Pn=null,Fn=null,setTimeout(()=>{St=!1},500)},500),un(),et(),Ce(),x){let I=x.querySelector("input"),L=x.dataset.guid;I&&L&&(zt(ge,L,T,I.value),Tt=L)}}else o.dataset.action==="clear"&&(t.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),c.textContent="",Bn(),Ce(),Hn(),On(ge,{allowEmpty:!0}),Tt=null,sn())}function cn(t,o="",r=!1,u=null,y=!0){if(!c)return null;let g=Math.max(0,t),d=u??crypto.randomUUID(),h=document.createElement("li"),T=document.createElement("div"),x=document.createElement("span"),I=document.createElement("span"),L=document.createElement("span"),z=document.createElement("a"),Q=document.createElement("span"),F=document.createElement("input"),ne=document.createElement("button");h.dataset.guid=d,T.className="time-row";let ye=document.createElement("div");ye.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",nt(ye,"Click to toggle indent");let xe=document.createElement("span");xe.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let Se=()=>{let ee=an(F.value);xe.textContent=ee===1?"\u25C0":"\u25B6"},gt=ee=>{ee.stopPropagation();let Y=an(F.value),pe=$o(F.value),ae=Y===0?1:0,ie="";if(ae===1){let tt=te().indexOf(h);ie=$i(tt)}F.value=`${ie}${pe}`,Se(),et();let ve=Number.parseInt(z.dataset.time??"0",10);zt(ge,d,ve,F.value)};ye.onclick=gt,ye.append(xe),h.style.cssText="position:relative;padding-left:20px;",h.addEventListener("mouseenter",()=>{Se(),xe.style.display="inline"}),h.addEventListener("mouseleave",()=>{xe.style.display="none"}),h.addEventListener("mouseleave",()=>{h.dataset.guid===Tt&&Pi(h)&&No()}),F.value=o||"",F.style.cssText="width:100%;margin-top:5px;display:block;",F.type="text",F.setAttribute("inputmode","text"),F.autocapitalize="off",F.autocomplete="off",F.spellcheck=!1,F.addEventListener("focusin",()=>{on=!1}),F.addEventListener("focusout",ee=>{let Y=ee.relatedTarget,pe=Date.now()-Fo<250,ae=!!Y&&!!n&&n.contains(Y);!pe&&!ae&&(on=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(F.focus({preventScroll:!0}),on=!1)},0))}),F.addEventListener("input",ee=>{let Y=ee;if(Y&&(Y.isComposing||Y.inputType==="insertCompositionText"))return;let pe=xt.get(d);pe&&clearTimeout(pe);let ae=setTimeout(()=>{let ie=Number.parseInt(z.dataset.time??"0",10);zt(ge,d,ie,F.value),xt.delete(d)},500);xt.set(d,ae)}),F.addEventListener("compositionend",()=>{let ee=Number.parseInt(z.dataset.time??"0",10);setTimeout(()=>{zt(ge,d,ee,F.value)},50)}),x.textContent="\u2796",x.dataset.increment="-1",x.style.cursor="pointer",x.style.margin="0px",x.addEventListener("mouseenter",()=>{x.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),x.addEventListener("mouseleave",()=>{x.style.textShadow="none"}),L.textContent="\u2795",L.dataset.increment="1",L.style.cursor="pointer",L.style.margin="0px",L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),I.textContent="\u23FA\uFE0F",I.style.cursor="pointer",I.style.margin="0px",nt(I,"Set to current playback time"),I.addEventListener("mouseenter",()=>{I.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),I.addEventListener("mouseleave",()=>{I.style.textShadow="none"}),I.onclick=()=>{let ee=q(),Y=ee?Math.floor(ee.getCurrentTime()):0;Number.isFinite(Y)&&(l(`Timestamps changedset to current playback time ${Y}`),zn(z,Y),un(),et(),zt(ge,d,Y,F.value),Tt=d)},zn(z,g),Bn(),ne.textContent="\u{1F5D1}\uFE0F",ne.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",ne.addEventListener("mouseenter",()=>{ne.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),ne.addEventListener("mouseleave",()=>{ne.style.textShadow="none"}),ne.onclick=()=>{let ee=null,Y=null,pe=null,ae=()=>{try{h.removeEventListener("click",Y,!0)}catch{}try{document.removeEventListener("click",Y,!0)}catch{}if(c)try{c.removeEventListener("mouseleave",pe)}catch{}ee&&(clearTimeout(ee),ee=null)};if(h.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let ie=h.dataset.guid??"",ve=xt.get(ie);ve&&(clearTimeout(ve),xt.delete(ie)),ae(),h.remove(),Bn(),un(),et(),Ce(),Hn(),Oi(ge,ie),Tt=null,sn()}else{h.dataset.deleteConfirmed="true",h.classList.add(le),h.classList.remove(Re);let ie=()=>{h.dataset.deleteConfirmed="false",h.classList.remove(le);let ve=q(),Ge=ve?ve.getCurrentTime():0,tt=Number.parseInt(h.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(Ge)&&Number.isFinite(tt)&&Ge>=tt&&h.classList.add(Re),ae()};Y=ve=>{ve.target!==ne&&ie()},pe=()=>{h.dataset.deleteConfirmed==="true"&&ie()},h.addEventListener("click",Y,!0),document.addEventListener("click",Y,!0),c&&c.addEventListener("mouseleave",pe),ee=setTimeout(()=>{h.dataset.deleteConfirmed==="true"&&ie(),ae()},5e3)}},Q.className="time-diff",Q.style.color="#888",Q.style.marginLeft="5px",T.append(x,I,L,z,Q,ne),h.append(ye,T,F);let st=Number.parseInt(z.dataset.time??"0",10);if(y){ao();let ee=!1,Y=te();for(let pe=0;pe<Y.length;pe++){let ae=Y[pe],ve=ae.querySelector("a[data-time]")?.dataset.time;if(!ve)continue;let Ge=Number.parseInt(ve,10);if(Number.isFinite(Ge)&&st<Ge){c.insertBefore(h,ae),ee=!0;let tt=Y[pe-1];if(tt){let Nt=tt.querySelector("a[data-time]")?.dataset.time;if(Nt){let lt=Number.parseInt(Nt,10);Number.isFinite(lt)&&(Q.textContent=vt(st-lt))}}else Q.textContent="";let Ot=ae.querySelector(".time-diff");Ot&&(Ot.textContent=vt(Ge-st));break}}if(!ee&&(c.appendChild(h),Y.length>0)){let ie=Y[Y.length-1].querySelector("a[data-time]")?.dataset.time;if(ie){let ve=Number.parseInt(ie,10);Number.isFinite(ve)&&(Q.textContent=vt(st-ve))}}h.scrollIntoView({behavior:"smooth",block:"center"}),Hn(),et(),Ce(),r||(zt(ge,d,g,o),Tt=d,ln(h,!1))}else F.__ytls_li=h;return F}function un(){if(!c||c.querySelector(".ytls-error-message"))return;let t=te();t.forEach((o,r)=>{let u=o.querySelector(".time-diff");if(!u)return;let g=o.querySelector("a[data-time]")?.dataset.time;if(!g){u.textContent="";return}let d=Number.parseInt(g,10);if(!Number.isFinite(d)){u.textContent="";return}if(r===0){u.textContent="";return}let x=t[r-1].querySelector("a[data-time]")?.dataset.time;if(!x){u.textContent="";return}let I=Number.parseInt(x,10);if(!Number.isFinite(I)){u.textContent="";return}let L=d-I,z=L<0?"-":"";u.textContent=` ${z}${vt(Math.abs(L))}`})}function No(){if(!c||c.querySelector(".ytls-error-message")||de)return;let t=null;if(document.activeElement instanceof HTMLInputElement&&c.contains(document.activeElement)){let d=document.activeElement,T=d.closest("li")?.dataset.guid;if(T){let x=d.selectionStart??d.value.length,I=d.selectionEnd??x,L=d.scrollLeft;t={guid:T,start:x,end:I,scroll:L}}}let o=te();if(o.length===0)return;let r=o.map(d=>d.dataset.guid),u=o.map(d=>{let h=d.querySelector("a[data-time]"),T=h?.dataset.time;if(!h||!T)return null;let x=Number.parseInt(T,10);if(!Number.isFinite(x))return null;let I=d.dataset.guid??"";return{time:x,guid:I,element:d}}).filter(d=>d!==null).sort((d,h)=>{let T=d.time-h.time;return T!==0?T:d.guid.localeCompare(h.guid)}),y=u.map(d=>d.guid),g=r.length!==y.length||r.some((d,h)=>d!==y[h]);for(;c.firstChild;)c.removeChild(c.firstChild);if(u.forEach(d=>{c.appendChild(d.element)}),un(),et(),Ce(),t){let h=te().find(T=>T.dataset.guid===t.guid)?.querySelector("input");if(h)try{h.focus({preventScroll:!0})}catch{}}g&&(l("Timestamps changed: Timestamps sorted"),On(ge))}function Hn(){if(!c||!n||!v||!S)return;let t=te().length;typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea();let o=n.getBoundingClientRect(),r=v.getBoundingClientRect(),u=S.getBoundingClientRect(),y=Math.max(0,o.height-(r.height+u.height));t===0?(sn(),c.style.overflowY="hidden"):c.style.overflowY=c.scrollHeight>y?"auto":"hidden"}function Ce(){if(!c)return;let t=Oe(),o=document.querySelector(".ytp-progress-bar"),r=q(),u=r?r.getVideoData():null,y=!!u&&!!u.isLive;if(!t||!o||!isFinite(t.duration)||y)return;Go(),te().map(d=>{let h=d.querySelector("a[data-time]"),T=h?.dataset.time;if(!h||!T)return null;let x=Number.parseInt(T,10);if(!Number.isFinite(x))return null;let L=d.querySelector("input")?.value??"",z=d.dataset.guid??crypto.randomUUID();return d.dataset.guid||(d.dataset.guid=z),{start:x,comment:L,guid:z}}).filter(Ro).forEach(d=>{if(!Number.isFinite(d.start))return;let h=document.createElement("div");h.className="ytls-marker",h.style.position="absolute",h.style.height="100%",h.style.width="2px",h.style.backgroundColor="#ff0000",h.style.cursor="pointer",h.style.left=d.start/t.duration*100+"%",h.dataset.time=String(d.start),h.addEventListener("click",()=>{let T=q();T&&T.seekTo(d.start)}),o.appendChild(h)})}function On(t,o={}){if(!c||c.querySelector(".ytls-error-message")||!t)return;if(de){l("Save blocked: timestamps are currently loading");return}et();let r=io().sort((u,y)=>u.start-y.start);if(r.length===0&&!o.allowEmpty){l("Save skipped: no timestamps to save");return}jo(t,r).then(()=>l(`Successfully saved ${r.length} timestamps for ${t} to IndexedDB`)).catch(u=>l(`Failed to save timestamps for ${t} to IndexedDB:`,u,"error")),Jt({type:"timestamps_updated",videoId:t,action:"saved"})}function zt(t,o,r,u){if(!t||de)return;let y={guid:o,start:r,comment:u};l(`Saving timestamp: guid=${o}, start=${r}, comment="${u}"`),Zi(t,y).catch(g=>l(`Failed to save timestamp ${o}:`,g,"error")),Jt({type:"timestamps_updated",videoId:t,action:"saved"})}function Oi(t,o){!t||de||(l(`Deleting timestamp: guid=${o}`),Ji(t,o).catch(r=>l(`Failed to delete timestamp ${o}:`,r,"error")),Jt({type:"timestamps_updated",videoId:t,action:"saved"}))}async function Uo(t){if(!c||c.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let o=ge;if(!o)return;l(`Exporting timestamps for video ID: ${o}`);let r=io(),u=Math.max(Et(),0),y=mn();if(t==="json"){let g=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),d=URL.createObjectURL(g),h=document.createElement("a");h.href=d,h.download=`timestamps-${o}-${y}.json`,h.click(),URL.revokeObjectURL(d)}else if(t==="text"){let g=r.map(x=>{let I=vt(x.start,u),L=`${x.comment} <!-- guid:${x.guid} -->`.trimStart();return`${I} ${L}`}).join(`
`),d=new Blob([g],{type:"text/plain"}),h=URL.createObjectURL(d),T=document.createElement("a");T.href=h,T.download=`timestamps-${o}-${y}.txt`,T.click(),URL.revokeObjectURL(h)}}function lo(t){if(!n||!c){l("Timekeeper error:",t,"error");return}kt();let o=document.createElement("li");o.textContent=t,o.classList.add("ytls-error-message"),o.style.color="#ff6b6b",o.style.fontWeight="bold",o.style.padding="8px",o.style.background="rgba(255, 0, 0, 0.1)",c.appendChild(o),Ce()}function Go(){document.querySelectorAll(".ytls-marker").forEach(t=>t.remove())}function Pt(){if(!n||!document.body.contains(n))return;let t=n.getBoundingClientRect(),o=document.documentElement.clientWidth,r=document.documentElement.clientHeight,u=t.width,y=t.height;if(t.left<0&&(n.style.left="0",n.style.right="auto"),t.right>o){let g=Math.max(0,o-u);n.style.left=`${g}px`,n.style.right="auto"}if(t.top<0&&(n.style.top="0",n.style.bottom="auto"),t.bottom>r){let g=Math.max(0,r-y);n.style.top=`${g}px`,n.style.bottom="auto"}}function Ni(){if(Sn&&(document.removeEventListener("mousemove",Sn),Sn=null),Ln&&(document.removeEventListener("mouseup",Ln),Ln=null),en&&(document.removeEventListener("keydown",en),en=null),In&&(window.removeEventListener("resize",In),In=null),tn&&(document.removeEventListener("pointerdown",tn,!0),tn=null),nn&&(document.removeEventListener("pointerup",nn,!0),nn=null),Xe){try{Xe.disconnect()}catch{}Xe=null}if(Qe){try{Qe.disconnect()}catch{}Qe=null}let t=Oe();t&&(Cn&&(t.removeEventListener("timeupdate",Cn),Cn=null),Mn&&(t.removeEventListener("pause",Mn),Mn=null),An&&(t.removeEventListener("play",An),An=null),Dn&&(t.removeEventListener("seeking",Dn),Dn=null))}function Ui(){Go(),xt.forEach(o=>clearTimeout(o)),xt.clear(),Qt&&(clearTimeout(Qt),Qt=null),se&&(clearInterval(se),se=null),Je&&(clearTimeout(Je),Je=null),Ni();try{Pe.close()}catch{}if(P&&P.parentNode===document.body&&document.body.removeChild(P),P=null,En=null,Tn=!1,ge=null,Xe){try{Xe.disconnect()}catch{}Xe=null}if(Qe){try{Qe.disconnect()}catch{}Qe=null}n&&n.parentNode&&n.remove();let t=document.getElementById("ytls-header-button");t&&t.parentNode&&t.remove(),ht=null,kn=!1,Fe=null,kt(),n=null,v=null,c=null,S=null,E=null,k=null,A=null,ze=null}async function Gi(){let t=co();if(!t)return ze=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let o=await wn();if(!ce(o)){let r=ft(o),u=r.length?` Missing methods: ${r.join(", ")}.`:"",y=o?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return ze=null,{ok:!1,message:`${y}${u} Try refreshing once playback is ready.`}}return ze=o,{ok:!0,player:o,videoId:t}}async function _o(){if(!n||!c)return;let t=c.scrollTop,o=!0,r=()=>{if(!c||!o)return;let u=Math.max(0,c.scrollHeight-c.clientHeight);c.scrollTop=Math.min(t,u)};try{let u=await Gi();if(!u.ok){lo(u.message),kt(),Ce();return}let{videoId:y}=u,g=[];try{let d=await Xi(y);d?(g=d.map(h=>({...h,guid:h.guid||crypto.randomUUID()})),l(`Loaded ${g.length} timestamps from IndexedDB for ${y}`)):l(`No timestamps found in IndexedDB for ${y}`)}catch(d){l(`Failed to load timestamps from IndexedDB for ${y}:`,d,"error"),lo("Failed to load timestamps from IndexedDB. Try refreshing the page."),Ce();return}if(g.length>0){g.sort((I,L)=>I.start-L.start),kt(),ao();let d=document.createDocumentFragment();g.forEach(I=>{let z=cn(I.start,I.comment,!0,I.guid,!1).__ytls_li;z&&d.appendChild(z)}),n&&n.classList.contains("ytls-zoom-in")&&fe!=null?(l("Deferring timestamp DOM append until show animation completes"),pt=d,rt||(rt=new Promise(I=>{Ne=I})),await rt):c&&(c.appendChild(d),et(),Ce(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let T=q(),x=T?Math.floor(T.getCurrentTime()):Et();Number.isFinite(x)&&($n(x,!1),o=!1)}else kt(),ro("No timestamps for this video"),Ce(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(u){l("Unexpected error while loading timestamps:",u,"error"),lo("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{rt&&await rt,requestAnimationFrame(r),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),c&&!c.querySelector(".ytls-error-message")&&sn()}}function co(){let o=new URLSearchParams(location.search).get("v");if(o)return o;let r=document.querySelector('meta[itemprop="identifier"]');return r?.content?r.content:null}function _i(){let t=Oe();if(!t)return;let o=()=>{if(!c)return;let d=q(),h=d?Math.floor(d.getCurrentTime()):0;if(!Number.isFinite(h))return;let T=Rn(h);ln(T,!1)},r=d=>{try{let h=new URL(window.location.href);d!==null&&Number.isFinite(d)?h.searchParams.set("t",`${Math.floor(d)}s`):h.searchParams.delete("t"),window.history.replaceState({},"",h.toString())}catch{}},u=()=>{let d=q(),h=d?Math.floor(d.getCurrentTime()):0;Number.isFinite(h)&&r(h)},y=()=>{r(null)},g=()=>{let d=Oe();if(!d)return;let h=q(),T=h?Math.floor(h.getCurrentTime()):0;if(!Number.isFinite(T))return;d.paused&&r(T);let x=Rn(T);ln(x,!0)};Cn=o,Mn=u,An=y,Dn=g,t.addEventListener("timeupdate",o),t.addEventListener("pause",u),t.addEventListener("play",y),t.addEventListener("seeking",g)}let qi="ytls-timestamps-db",ji=3,Ft="timestamps",Ue="timestamps_v2",Nn="settings",$t=null,Rt=null;function Ht(){if($t)try{if($t.objectStoreNames.length>=0)return Promise.resolve($t)}catch(t){l("IndexedDB connection is no longer usable:",t,"warn"),$t=null}return Rt||(Rt=Ki().then(t=>($t=t,Rt=null,t.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),$t=null},t.onerror=o=>{l("IndexedDB connection error:",o,"error")},t)).catch(t=>{throw Rt=null,t}),Rt)}async function qo(){let t={},o=await Vo(Ue),r=new Map;for(let g of o){let d=g;r.has(d.video_id)||r.set(d.video_id,[]),r.get(d.video_id).push({guid:d.guid,start:d.start,comment:d.comment})}for(let[g,d]of r)t[`ytls-${g}`]={video_id:g,timestamps:d.sort((h,T)=>h.start-T.start)};return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:r.size,totalTimestamps:o.length}}async function Vi(){try{let{json:t,filename:o,totalVideos:r,totalTimestamps:u}=await qo(),y=new Blob([t],{type:"application/json"}),g=URL.createObjectURL(y),d=document.createElement("a");d.href=g,d.download=o,d.click(),URL.revokeObjectURL(g),l(`Exported ${r} videos with ${u} timestamps`)}catch(t){throw l("Failed to export data:",t,"error"),t}}async function Wi(){let t=await Vo(Ue);if(!Array.isArray(t)||t.length===0){let x=`Tag,Timestamp,URL
`,I=`timestamps-${mn()}.csv`;return{csv:x,filename:I,totalVideos:0,totalTimestamps:0}}let o=new Map;for(let x of t)o.has(x.video_id)||o.set(x.video_id,[]),o.get(x.video_id).push({start:x.start,comment:x.comment});let r=[];r.push("Tag,Timestamp,URL");let u=0,y=x=>`"${String(x).replace(/"/g,'""')}"`,g=x=>{let I=Math.floor(x/3600),L=Math.floor(x%3600/60),z=String(x%60).padStart(2,"0");return`${String(I).padStart(2,"0")}:${String(L).padStart(2,"0")}:${z}`},d=Array.from(o.keys()).sort();for(let x of d){let I=o.get(x).sort((L,z)=>L.start-z.start);for(let L of I){let z=L.comment,Q=g(L.start),F=go(L.start,`https://www.youtube.com/watch?v=${x}`);r.push([y(z),y(Q),y(F)].join(",")),u++}}let h=r.join(`
`),T=`timestamps-${mn()}.csv`;return{csv:h,filename:T,totalVideos:o.size,totalTimestamps:u}}async function Yi(){try{let{csv:t,filename:o,totalVideos:r,totalTimestamps:u}=await Wi(),y=new Blob([t],{type:"text/csv;charset=utf-8;"}),g=URL.createObjectURL(y),d=document.createElement("a");d.href=g,d.download=o,d.click(),URL.revokeObjectURL(g),l(`Exported ${r} videos with ${u} timestamps (CSV)`)}catch(t){throw l("Failed to export CSV data:",t,"error"),t}}function Ki(){return new Promise((t,o)=>{let r=indexedDB.open(qi,ji);r.onupgradeneeded=u=>{let y=u.target.result,g=u.oldVersion,d=u.target.transaction;if(g<1&&y.createObjectStore(Ft,{keyPath:"video_id"}),g<2&&!y.objectStoreNames.contains(Nn)&&y.createObjectStore(Nn,{keyPath:"key"}),g<3){if(y.objectStoreNames.contains(Ft)){l("Exporting backup before v2 migration...");let x=d.objectStore(Ft).getAll();x.onsuccess=()=>{let I=x.result;if(I.length>0)try{let L={},z=0;I.forEach(ye=>{if(Array.isArray(ye.timestamps)&&ye.timestamps.length>0){let xe=ye.timestamps.map(Se=>({guid:Se.guid||crypto.randomUUID(),start:Se.start,comment:Se.comment}));L[`ytls-${ye.video_id}`]={video_id:ye.video_id,timestamps:xe.sort((Se,gt)=>Se.start-gt.start)},z+=xe.length}});let Q=new Blob([JSON.stringify(L,null,2)],{type:"application/json"}),F=URL.createObjectURL(Q),ne=document.createElement("a");ne.href=F,ne.download=`timekeeper-data-${mn()}.json`,ne.click(),URL.revokeObjectURL(F),l(`Pre-migration backup exported: ${I.length} videos, ${z} timestamps`)}catch(L){l("Failed to export pre-migration backup:",L,"error")}}}let h=y.createObjectStore(Ue,{keyPath:"guid"});if(h.createIndex("video_id","video_id",{unique:!1}),h.createIndex("video_start",["video_id","start"],{unique:!1}),y.objectStoreNames.contains(Ft)){let x=d.objectStore(Ft).getAll();x.onsuccess=()=>{let I=x.result;if(I.length>0){let L=0;I.forEach(z=>{Array.isArray(z.timestamps)&&z.timestamps.length>0&&z.timestamps.forEach(Q=>{h.put({guid:Q.guid||crypto.randomUUID(),video_id:z.video_id,start:Q.start,comment:Q.comment}),L++})}),l(`Migrated ${L} timestamps from ${I.length} videos to v2 store`)}},y.deleteObjectStore(Ft),l("Deleted old timestamps store after migration to v2")}}},r.onsuccess=u=>{t(u.target.result)},r.onerror=u=>{let y=u.target.error;o(y??new Error("Failed to open IndexedDB"))}})}function uo(t,o,r){return Ht().then(u=>new Promise((y,g)=>{let d;try{d=u.transaction(t,o)}catch(x){g(new Error(`Failed to create transaction for ${t}: ${x}`));return}let h=d.objectStore(t),T;try{T=r(h)}catch(x){g(new Error(`Failed to execute operation on ${t}: ${x}`));return}T&&(T.onsuccess=()=>y(T.result),T.onerror=()=>g(T.error??new Error(`IndexedDB ${o} operation failed`))),d.oncomplete=()=>{T||y(void 0)},d.onerror=()=>g(d.error??new Error("IndexedDB transaction failed")),d.onabort=()=>g(d.error??new Error("IndexedDB transaction aborted"))}))}function jo(t,o){return Ht().then(r=>new Promise((u,y)=>{let g;try{g=r.transaction([Ue],"readwrite")}catch(x){y(new Error(`Failed to create transaction: ${x}`));return}let d=g.objectStore(Ue),T=d.index("video_id").getAll(IDBKeyRange.only(t));T.onsuccess=()=>{try{let x=T.result,I=new Set(o.map(L=>L.guid));x.forEach(L=>{I.has(L.guid)||d.delete(L.guid)}),o.forEach(L=>{d.put({guid:L.guid,video_id:t,start:L.start,comment:L.comment})})}catch(x){l("Error during save operation:",x,"error")}},T.onerror=()=>{y(T.error??new Error("Failed to get existing records"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to save to IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during save"))}))}function Zi(t,o){return Ht().then(r=>new Promise((u,y)=>{let g;try{g=r.transaction([Ue],"readwrite")}catch(T){y(new Error(`Failed to create transaction: ${T}`));return}let h=g.objectStore(Ue).put({guid:o.guid,video_id:t,start:o.start,comment:o.comment});h.onerror=()=>{y(h.error??new Error("Failed to put timestamp"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to save single timestamp to IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during single timestamp save"))}))}function Ji(t,o){return l(`Deleting timestamp ${o} for video ${t}`),Ht().then(r=>new Promise((u,y)=>{let g;try{g=r.transaction([Ue],"readwrite")}catch(T){y(new Error(`Failed to create transaction: ${T}`));return}let h=g.objectStore(Ue).delete(o);h.onerror=()=>{y(h.error??new Error("Failed to delete timestamp"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to delete single timestamp from IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during timestamp deletion"))}))}function Xi(t){return Ht().then(o=>new Promise(r=>{let u;try{u=o.transaction([Ue],"readonly")}catch(h){l("Failed to create read transaction:",h,"warn"),r(null);return}let d=u.objectStore(Ue).index("video_id").getAll(IDBKeyRange.only(t));d.onsuccess=()=>{let h=d.result;if(h.length>0){let T=h.map(x=>({guid:x.guid,start:x.start,comment:x.comment})).sort((x,I)=>x.start-I.start);r(T)}else r(null)},d.onerror=()=>{l("Failed to load timestamps:",d.error,"warn"),r(null)},u.onabort=()=>{l("Transaction aborted during load:",u.error,"warn"),r(null)}}))}function Qi(t){return Ht().then(o=>new Promise((r,u)=>{let y;try{y=o.transaction([Ue],"readwrite")}catch(T){u(new Error(`Failed to create transaction: ${T}`));return}let g=y.objectStore(Ue),h=g.index("video_id").getAll(IDBKeyRange.only(t));h.onsuccess=()=>{try{h.result.forEach(x=>{g.delete(x.guid)})}catch(T){l("Error during remove operation:",T,"error")}},h.onerror=()=>{u(h.error??new Error("Failed to get records for removal"))},y.oncomplete=()=>r(),y.onerror=()=>u(y.error??new Error("Failed to remove timestamps")),y.onabort=()=>u(y.error??new Error("Transaction aborted during timestamp removal"))}))}function Vo(t){return uo(t,"readonly",o=>o.getAll()).then(o=>Array.isArray(o)?o:[])}function Un(t,o){uo(Nn,"readwrite",r=>{r.put({key:t,value:o})}).catch(r=>{l(`Failed to save setting '${t}' to IndexedDB:`,r,"error")})}function mo(t){return uo(Nn,"readonly",o=>o.get(t)).then(o=>o?.value).catch(o=>{l(`Failed to load setting '${t}' from IndexedDB:`,o,"error")})}function Wo(){if(!n)return;let t=n.style.display!=="none";Un("uiVisible",t)}function at(t){let o=typeof t=="boolean"?t:!!n&&n.style.display!=="none",r=document.getElementById("ytls-header-button");r instanceof HTMLButtonElement&&r.setAttribute("aria-pressed",String(o)),ht&&!kn&&ht.src!==ke&&(ht.src=ke)}function er(){n&&mo("uiVisible").then(t=>{let o=t;typeof o=="boolean"?(o?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",at(o)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),at(!0))}).catch(t=>{l("Failed to load UI visibility state:",t,"error"),n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),at(!0)})}function fo(t){if(!n){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(y=>{y!==n&&y.remove()}),document.body.appendChild(n));let o=document.querySelectorAll("#ytls-pane");o.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${o.length}), cleaning up`),o.forEach(y=>{y!==n&&y.remove()})),Je&&(clearTimeout(Je),Je=null);let r=n.style.display==="none";(typeof t=="boolean"?t:r)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),at(!0),Wo(),re(),fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),U(!0),fe=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),at(!1),G())}function Yo(t){if(!c){l("UI is not initialized; cannot import timestamps.","warn");return}let o=!1;try{let r=JSON.parse(t),u=null;if(Array.isArray(r))u=r;else if(typeof r=="object"&&r!==null){let y=ge;if(y){let g=`timekeeper-${y}`;r[g]&&Array.isArray(r[g].timestamps)&&(u=r[g].timestamps,l(`Found timestamps for current video (${y}) in export format`,"info"))}if(!u){let g=Object.keys(r).filter(d=>d.startsWith("ytls-"));if(g.length===1&&Array.isArray(r[g[0]].timestamps)){u=r[g[0]].timestamps;let d=r[g[0]].video_id;l(`Found timestamps for video ${d} in export format`,"info")}}}u&&Array.isArray(u)?u.every(g=>typeof g.start=="number"&&typeof g.comment=="string")?(u.forEach(g=>{if(g.guid){let d=te().find(h=>h.dataset.guid===g.guid);if(d){let h=d.querySelector("input");h&&(h.value=g.comment)}else cn(g.start,g.comment,!1,g.guid)}else cn(g.start,g.comment,!1,crypto.randomUUID())}),o=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!o){let r=t.split(`
`).map(u=>u.trim()).filter(u=>u);if(r.length>0){let u=!1;r.forEach(y=>{let g=y.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(g){u=!0;let d=parseInt(g[1])||0,h=parseInt(g[2]),T=parseInt(g[3]),x=d*3600+h*60+T,I=g[4]?g[4].trim():"",L=null,z=I,Q=I.match(/<!--\s*guid:([^>]+?)\s*-->/);Q&&(L=Q[1].trim(),z=I.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let F;if(L&&(F=te().find(ne=>ne.dataset.guid===L)),!F&&!L&&(F=te().find(ne=>{if(ne.dataset.guid)return!1;let xe=ne.querySelector("a[data-time]")?.dataset.time;if(!xe)return!1;let Se=Number.parseInt(xe,10);return Number.isFinite(Se)&&Se===x})),F){let ne=F.querySelector("input");ne&&(ne.value=z)}else cn(x,z,!1,L||crypto.randomUUID())}}),u&&(o=!0)}}o?(l("Timestamps changed: Imported timestamps from file/clipboard"),et(),On(ge),Ce(),Hn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function tr(){if(oo){l("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){oo=!0;try{let r=function(){if(de||St)return;let p=Oe(),m=q();if(!p&&!m)return;let b=m?m.getCurrentTime():0,w=Number.isFinite(b)?Math.max(0,Math.floor(b)):Math.max(0,Et()),C=Math.floor(w/3600),B=Math.floor(w/60)%60,D=w%60,{isLive:N}=m?m.getVideoData()||{isLive:!1}:{isLive:!1},$=m?Ri(m):!1,K=c?te().map(V=>{let be=V.querySelector("a[data-time]");return be?parseFloat(be.getAttribute("data-time")??"0"):0}):[],Me="";if(K.length>0)if(N){let V=Math.max(1,w/60),be=K.filter(Ae=>Ae<=w);if(be.length>0){let Ae=(be.length/V).toFixed(2);parseFloat(Ae)>0&&(Me=` (${Ae}/min)`)}}else{let V=m?m.getDuration():0,be=Number.isFinite(V)&&V>0?V:p&&Number.isFinite(p.duration)&&p.duration>0?p.duration:0,Ae=Math.max(1,be/60),ct=(K.length/Ae).toFixed(1);parseFloat(ct)>0&&(Me=` (${ct}/min)`)}E.textContent=`\u23F3${C?C+":"+String(B).padStart(2,"0"):B}:${String(D).padStart(2,"0")}${Me}`,E.style.color=$?"#ff4d4f":"",K.length>0&&$n(w,!1)},F=function(p,m,b){let w=document.createElement("button");return w.textContent=p,nt(w,m),w.classList.add("ytls-settings-modal-button"),w.onclick=b,w},ne=function(p="general"){if(P&&P.parentNode===document.body){let Le=document.getElementById("ytls-save-modal"),yt=document.getElementById("ytls-load-modal"),ut=document.getElementById("ytls-delete-all-modal");Le&&document.body.contains(Le)&&document.body.removeChild(Le),yt&&document.body.contains(yt)&&document.body.removeChild(yt),ut&&document.body.contains(ut)&&document.body.removeChild(ut),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",ye)},300);return}P=document.createElement("div"),P.id="ytls-settings-modal",P.classList.remove("ytls-fade-out"),P.classList.add("ytls-fade-in");let m=document.createElement("div");m.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let w=document.createElement("button");w.className="ytls-modal-close-button",w.textContent="\u2715",w.onclick=()=>{if(P&&P.parentNode===document.body){let Le=document.getElementById("ytls-save-modal"),yt=document.getElementById("ytls-load-modal"),ut=document.getElementById("ytls-delete-all-modal");Le&&document.body.contains(Le)&&document.body.removeChild(Le),yt&&document.body.contains(yt)&&document.body.removeChild(yt),ut&&document.body.contains(ut)&&document.body.removeChild(ut),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",ye)},300)}};let C=document.createElement("div");C.id="ytls-settings-content";let B=document.createElement("h3");B.className="ytls-section-heading",B.textContent="General",B.style.display="none";let D=document.createElement("div"),N=document.createElement("div");N.className="ytls-button-grid";function $(Le){D.style.display=Le==="general"?"block":"none",N.style.display=Le==="drive"?"block":"none",K.classList.toggle("active",Le==="general"),V.classList.toggle("active",Le==="drive"),B.textContent=Le==="general"?"General":"Google Drive"}let K=document.createElement("button");K.textContent="\u{1F6E0}\uFE0F";let Me=document.createElement("span");Me.className="ytls-tab-text",Me.textContent=" General",K.appendChild(Me),nt(K,"General settings"),K.classList.add("ytls-settings-modal-button"),K.onclick=()=>$("general");let V=document.createElement("button");V.textContent="\u2601\uFE0F";let be=document.createElement("span");be.className="ytls-tab-text",be.textContent=" Backup",V.appendChild(be),nt(V,"Google Drive sign-in and backup"),V.classList.add("ytls-settings-modal-button"),V.onclick=async()=>{O.isSignedIn&&await Mi(),$("drive")},b.appendChild(K),b.appendChild(V),m.appendChild(b),m.appendChild(w),P.appendChild(m),D.className="ytls-button-grid",D.appendChild(F("\u{1F4BE} Save","Save As...",Se.onclick)),D.appendChild(F("\u{1F4C2} Load","Load",gt.onclick)),D.appendChild(F("\u{1F4E4} Export All","Export All Data",st.onclick)),D.appendChild(F("\u{1F4E5} Import All","Import All Data",ee.onclick)),D.appendChild(F("\u{1F4C4} Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await Yi()}catch{alert("Failed to export CSV: Could not read from database.")}}));let Ae=F(O.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",O.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{O.isSignedIn?await Ci():await Li(),Ae.textContent=O.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",nt(Ae,O.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive")});N.appendChild(Ae);let ct=F(ot?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await Bi(),ct.textContent=ot?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off"});N.appendChild(ct);let It=F(`\u23F1\uFE0F Backup Interval: ${Ve}min`,"Set periodic backup interval (minutes)",async()=>{await zi(),It.textContent=`\u23F1\uFE0F Backup Interval: ${Ve}min`});N.appendChild(It),N.appendChild(F("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await vn(!1)}));let _e=document.createElement("div");_e.style.marginTop="15px",_e.style.paddingTop="10px",_e.style.borderTop="1px solid #555",_e.style.fontSize="12px",_e.style.color="#aaa";let Ct=document.createElement("div");Ct.style.marginBottom="8px",Ct.style.fontWeight="bold",_e.appendChild(Ct),Ei(Ct);let ho=document.createElement("div");ho.style.marginBottom="8px",xi(ho),_e.appendChild(ho);let Qo=document.createElement("div");Ti(Qo),_e.appendChild(Qo),N.appendChild(_e),$e(),bn(),Ze(),C.appendChild(B),C.appendChild(D),C.appendChild(N),$(p),P.appendChild(C),document.body.appendChild(P),requestAnimationFrame(()=>{let Le=P.getBoundingClientRect(),ut=(window.innerHeight-Le.height)/2;P.style.top=`${Math.max(20,ut)}px`,P.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",xe,!0),document.addEventListener("keydown",ye)},0)},ye=function(p){if(p.key==="Escape"&&P&&P.parentNode===document.body){let m=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),w=document.getElementById("ytls-delete-all-modal");if(m||b||w)return;p.preventDefault(),m&&document.body.contains(m)&&document.body.removeChild(m),b&&document.body.contains(b)&&document.body.removeChild(b),w&&document.body.contains(w)&&document.body.removeChild(w),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",ye)},300)}},xe=function(p){if(En&&En.contains(p.target))return;let m=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),w=document.getElementById("ytls-delete-all-modal");m&&m.contains(p.target)||b&&b.contains(p.target)||w&&w.contains(p.target)||P&&P.contains(p.target)||(m&&document.body.contains(m)&&document.body.removeChild(m),b&&document.body.contains(b)&&document.body.removeChild(b),w&&document.body.contains(w)&&document.body.removeChild(w),P&&P.parentNode===document.body&&(P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",ye)},300)))},Y=function(){n&&(l("Loading window position from IndexedDB"),mo("windowPosition").then(p=>{if(p&&typeof p.x=="number"&&typeof p.y=="number"){let b=p;n.style.left=`${b.x}px`,n.style.top=`${b.y}px`,n.style.right="auto",n.style.bottom="auto",typeof b.width=="number"&&b.width>0?n.style.width=`${b.width}px`:(n.style.width=`${Dt}px`,l(`No stored window width found, using default width ${Dt}px`)),typeof b.height=="number"&&b.height>0?n.style.height=`${b.height}px`:(n.style.height=`${wt}px`,l(`No stored window height found, using default height ${wt}px`));let w=X();oe(w,b.x,b.y),l("Restored window position from IndexedDB:",Fe)}else l("No window position found in IndexedDB, applying default size and leaving default position"),n.style.width=`${Dt}px`,n.style.height=`${wt}px`,Fe=null;Pt();let m=X();m&&(m.width||m.height)&&oe(m),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(p=>{l("failed to load pane position from IndexedDB:",p,"warn"),Pt();let m=X();m&&(m.width||m.height)&&(Fe={x:Math.max(0,Math.round(m.left)),y:0,width:Math.round(m.width),height:Math.round(m.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},pe=function(){if(!n)return;let p=X();if(!p)return;let m={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)};if(Fe&&Fe.x===m.x&&Fe.y===m.y&&Fe.width===m.width&&Fe.height===m.height){l("Skipping window position save; position and size unchanged");return}Fe={...m},l(`Saving window position and size to IndexedDB: x=${m.x}, y=${m.y}, width=${m.width}, height=${m.height}`),Un("windowPosition",m),Jt({type:"window_position_updated",position:m,timestamp:Date.now()})},jn=function(p,m){p.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",pe(),dn())}),p.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),lt=!0,Lt=m,Jo=b.clientX,Xo=b.clientY;let w=n.getBoundingClientRect();Ut=w.width,Gt=w.height,_n=w.left,qn=w.top,m==="top-left"||m==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},dn=function(){if(n&&v&&S&&c){let p=n.getBoundingClientRect(),m=v.getBoundingClientRect(),b=S.getBoundingClientRect(),w=p.height-(m.height+b.height);c.style.maxHeight=w>0?w+"px":"0px",c.style.overflowY=w>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),n=document.createElement("div"),v=document.createElement("div"),c=document.createElement("ul"),S=document.createElement("div"),E=document.createElement("span"),k=document.createElement("style"),A=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=p=>{p.stopPropagation(),ne("drive")},c.addEventListener("mouseenter",()=>{Tn=!0,on=!1}),c.addEventListener("mouseleave",()=>{if(Tn=!1,on)return;let p=q(),m=p?Math.floor(p.getCurrentTime()):Et();$n(m,!1);let b=null;if(document.activeElement instanceof HTMLInputElement&&c.contains(document.activeElement)&&(b=document.activeElement.closest("li")?.dataset.guid??null),No(),b){let C=te().find(B=>B.dataset.guid===b)?.querySelector("input");if(C)try{C.focus({preventScroll:!0})}catch{}}}),n.id="ytls-pane",v.id="ytls-pane-header",v.addEventListener("dblclick",p=>{let m=p.target instanceof HTMLElement?p.target:null;m&&(m.closest("a")||m.closest("button")||m.closest("#ytls-current-time")||m.closest(".ytls-version-display")||m.closest(".ytls-backup-indicator"))||(p.preventDefault(),fo(!1))});let t=GM_info.script.version;A.textContent=`v${t}`,A.classList.add("ytls-version-display");let o=document.createElement("span");o.style.display="inline-flex",o.style.alignItems="center",o.style.gap="6px",o.appendChild(A),o.appendChild(M),E.id="ytls-current-time",E.textContent="\u23F3",E.onclick=()=>{St=!0;let p=q();p&&p.seekToLiveHead(),setTimeout(()=>{St=!1},500)},r(),se&&clearInterval(se),se=setInterval(r,1e3),S.id="ytls-buttons";let u=(p,m)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),m&&m()},300)},y=p=>m=>{m.key==="Escape"&&(m.preventDefault(),m.stopPropagation(),p())},g=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},d=(p,m)=>b=>{p.contains(b.target)||m()},h=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)},z=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!c||c.querySelector(".ytls-error-message")||de)return;let p=typeof Bt<"u"?Bt:0,m=q(),b=m?Math.floor(m.getCurrentTime()+p):0;if(!Number.isFinite(b))return;let w=cn(b,"");w&&w.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>ne()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(p){if(!c||c.querySelector(".ytls-error-message")||de){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let m=io(),b=Math.max(Et(),0);if(m.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let w=p.ctrlKey,C=m.map(B=>{let D=vt(B.start,b);return w?`${D} ${B.comment} <!-- guid:${B.guid} -->`.trimStart():`${D} ${B.comment}`}).join(`
`);navigator.clipboard.writeText(C).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(B=>{l("Failed to copy timestamps: ",B,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!c||c.querySelector(".ytls-error-message")||de)return;if(te().length===0){alert("No timestamps available to offset.");return}let m=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(m===null)return;let b=m.trim();if(b.length===0)return;let w=Number.parseInt(b,10);if(!Number.isFinite(w)){alert("Please enter a valid integer number of seconds.");return}w!==0&&Ho(w,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let p=co();if(!p){alert("Unable to determine current video ID.");return}let m=document.createElement("div");m.id="ytls-delete-all-modal",m.classList.remove("ytls-fade-out"),m.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let w=document.createElement("p");w.textContent=p,w.style.fontFamily="monospace",w.style.fontSize="12px",w.style.marginBottom="15px",w.style.color="#aaa";let C=document.createElement("button");C.classList.add("ytls-save-modal-button"),C.style.background="#d32f2f",C.style.position="relative",C.style.overflow="hidden";let B=null,D=0,N=null,$=document.createElement("div");$.style.position="absolute",$.style.left="0",$.style.top="0",$.style.height="100%",$.style.width="0%",$.style.background="#ff6b6b",$.style.transition="none",$.style.pointerEvents="none",C.appendChild($);let K=document.createElement("span");K.textContent="Hold to Delete All",K.style.position="relative",K.style.zIndex="1",C.appendChild(K);let Me=()=>{if(!D)return;let _e=Date.now()-D,Ct=Math.min(_e/5e3*100,100);$.style.width=`${Ct}%`,Ct<100&&(N=requestAnimationFrame(Me))},V=()=>{B&&(clearTimeout(B),B=null),N&&(cancelAnimationFrame(N),N=null),D=0,$.style.width="0%",K.textContent="Hold to Delete All"};C.onmousedown=()=>{D=Date.now(),K.textContent="Deleting...",N=requestAnimationFrame(Me),B=setTimeout(async()=>{V(),m.classList.remove("ytls-fade-in"),m.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(m)&&document.body.removeChild(m);try{await Qi(p),po()}catch(_e){l("Failed to delete all timestamps:",_e,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},C.onmouseup=V,C.onmouseleave=V;let be=null,Ae=null,ct=u(m,()=>{V(),be&&document.removeEventListener("keydown",be),Ae&&document.removeEventListener("click",Ae,!0)});be=y(ct),Ae=d(m,ct);let It=document.createElement("button");It.textContent="Cancel",It.classList.add("ytls-save-modal-cancel-button"),It.onclick=ct,m.appendChild(b),m.appendChild(w),m.appendChild(C),m.appendChild(It),document.body.appendChild(m),g(be),h(Ae)}}],Q=ei();z.forEach(p=>{let m=document.createElement("button");if(m.textContent=p.label,nt(m,p.title),m.classList.add("ytls-main-button"),p.label==="\u{1F423}"&&Q){let b=document.createElement("span");b.textContent=Q,b.classList.add("ytls-holiday-emoji"),m.appendChild(b)}p.label==="\u{1F4CB}"?m.onclick=function(b){p.action.call(this,b)}:m.onclick=p.action,p.label==="\u2699\uFE0F"&&(En=m),S.appendChild(m)});let Se=document.createElement("button");Se.textContent="\u{1F4BE} Save",Se.classList.add("ytls-file-operation-button"),Se.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let m=document.createElement("p");m.textContent="Save as:";let b=null,w=null,C=u(p,()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0)});b=y(C),w=d(p,C);let B=document.createElement("button");B.textContent="JSON",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),u(p,()=>Uo("json"))()};let D=document.createElement("button");D.textContent="Plain Text",D.classList.add("ytls-save-modal-button"),D.onclick=()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),u(p,()=>Uo("text"))()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,p.appendChild(m),p.appendChild(B),p.appendChild(D),p.appendChild(N),document.body.appendChild(p),g(b),h(w)};let gt=document.createElement("button");gt.textContent="\u{1F4C2} Load",gt.classList.add("ytls-file-operation-button"),gt.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let m=document.createElement("p");m.textContent="Load from:";let b=null,w=null,C=u(p,()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0)});b=y(C),w=d(p,C);let B=document.createElement("button");B.textContent="File",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{let $=document.createElement("input");$.type="file",$.accept=".json,.txt",$.classList.add("ytls-hidden-file-input"),$.onchange=K=>{let Me=K.target.files?.[0];if(!Me)return;b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),C();let V=new FileReader;V.onload=()=>{let be=String(V.result).trim();Yo(be)},V.readAsText(Me)},$.click()};let D=document.createElement("button");D.textContent="Clipboard",D.classList.add("ytls-save-modal-button"),D.onclick=async()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),u(p,async()=>{try{let $=await navigator.clipboard.readText();$?Yo($.trim()):alert("Clipboard is empty.")}catch($){l("Failed to read from clipboard: ",$,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,p.appendChild(m),p.appendChild(B),p.appendChild(D),p.appendChild(N),document.body.appendChild(p),g(b),h(w)};let st=document.createElement("button");st.textContent="\u{1F4E4} Export",st.classList.add("ytls-file-operation-button"),st.onclick=async()=>{try{await Vi()}catch{alert("Failed to export data: Could not read from database.")}};let ee=document.createElement("button");ee.textContent="\u{1F4E5} Import",ee.classList.add("ytls-file-operation-button"),ee.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=m=>{let b=m.target.files?.[0];if(!b)return;let w=new FileReader;w.onload=()=>{try{let C=JSON.parse(String(w.result)),B=[];for(let D in C)if(Object.prototype.hasOwnProperty.call(C,D)&&D.startsWith("ytls-")){let N=D.substring(5),$=C[D];if($&&typeof $.video_id=="string"&&Array.isArray($.timestamps)){let K=$.timestamps.map(V=>({...V,guid:V.guid||crypto.randomUUID()})),Me=jo(N,K).then(()=>l(`Imported ${N} to IndexedDB`)).catch(V=>l(`Failed to import ${N} to IndexedDB:`,V,"error"));B.push(Me)}else l(`Skipping key ${D} during import due to unexpected data format.`,"warn")}Promise.all(B).then(()=>{po()}).catch(D=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",D,"error")})}catch(C){alert(`Failed to import data. Please ensure the file is in the correct format.
`+C.message),l("Import error:",C,"error")}},w.readAsText(b)},p.click()},k.textContent=ti,c.onclick=p=>{Oo(p)},c.ontouchstart=p=>{Oo(p)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",Y(),setTimeout(()=>Pt(),10);let ae=!1,ie,ve,Ge=!1;n.addEventListener("mousedown",p=>{let m=p.target;m instanceof Element&&(m instanceof HTMLInputElement||m instanceof HTMLTextAreaElement||m!==v&&!v.contains(m)&&window.getComputedStyle(m).cursor==="pointer"||(ae=!0,Ge=!1,ie=p.clientX-n.getBoundingClientRect().left,ve=p.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",Sn=p=>{if(!ae)return;Ge=!0;let m=p.clientX-ie,b=p.clientY-ve,w=n.getBoundingClientRect(),C=w.width,B=w.height,D=document.documentElement.clientWidth,N=document.documentElement.clientHeight;m=Math.max(0,Math.min(m,D-C)),b=Math.max(0,Math.min(b,N-B)),n.style.left=`${m}px`,n.style.top=`${b}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",Ln=()=>{if(!ae)return;ae=!1;let p=Ge;setTimeout(()=>{Ge=!1},50),Pt(),setTimeout(()=>{p&&pe()},200)}),n.addEventListener("dragstart",p=>p.preventDefault());let tt=document.createElement("div"),Ot=document.createElement("div"),Gn=document.createElement("div"),Nt=document.createElement("div");tt.id="ytls-resize-tl",Ot.id="ytls-resize-tr",Gn.id="ytls-resize-bl",Nt.id="ytls-resize-br";let lt=!1,Jo=0,Xo=0,Ut=0,Gt=0,_n=0,qn=0,Lt=null;jn(tt,"top-left"),jn(Ot,"top-right"),jn(Gn,"bottom-left"),jn(Nt,"bottom-right"),document.addEventListener("mousemove",p=>{if(!lt||!n||!Lt)return;let m=p.clientX-Jo,b=p.clientY-Xo,w=Ut,C=Gt,B=_n,D=qn,N=document.documentElement.clientWidth,$=document.documentElement.clientHeight;Lt==="bottom-right"?(w=Math.max(200,Math.min(800,Ut+m)),C=Math.max(250,Math.min($,Gt+b))):Lt==="top-left"?(w=Math.max(200,Math.min(800,Ut-m)),B=_n+m,C=Math.max(250,Math.min($,Gt-b)),D=qn+b):Lt==="top-right"?(w=Math.max(200,Math.min(800,Ut+m)),C=Math.max(250,Math.min($,Gt-b)),D=qn+b):Lt==="bottom-left"&&(w=Math.max(200,Math.min(800,Ut-m)),B=_n+m,C=Math.max(250,Math.min($,Gt+b))),B=Math.max(0,Math.min(B,N-w)),D=Math.max(0,Math.min(D,$-C)),n.style.width=`${w}px`,n.style.height=`${C}px`,n.style.left=`${B}px`,n.style.top=`${D}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{lt&&(lt=!1,Lt=null,document.body.style.cursor="",U(!0))});let Vn=null;window.addEventListener("resize",In=()=>{Vn&&clearTimeout(Vn),Vn=setTimeout(()=>{U(!0),Vn=null},200)}),v.appendChild(E),v.appendChild(o);let Wn=document.createElement("div");if(Wn.id="ytls-content",Wn.append(c),Wn.append(S),n.append(v,Wn,k,tt,Ot,Gn,Nt),n.addEventListener("mousemove",p=>{try{if(ae||lt)return;let m=n.getBoundingClientRect(),b=20,w=p.clientX,C=p.clientY,B=w-m.left<=b,D=m.right-w<=b,N=C-m.top<=b,$=m.bottom-C<=b,K="";N&&B||$&&D?K="nwse-resize":N&&D||$&&B?K="nesw-resize":K="",document.body.style.cursor=K}catch{}}),n.addEventListener("mouseleave",()=>{!lt&&!ae&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=dn,setTimeout(()=>{if(dn(),n&&v&&S&&c){let p=40,m=te();if(m.length>0)p=m[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",c.appendChild(b),p=b.offsetHeight,c.removeChild(b)}R=v.offsetHeight+S.offsetHeight+p,n.style.minHeight=R+"px"}},0),window.addEventListener("resize",dn),Qe){try{Qe.disconnect()}catch{}Qe=null}Qe=new ResizeObserver(dn),Qe.observe(n),tn||document.addEventListener("pointerdown",tn=()=>{Fo=Date.now()},!0),nn||document.addEventListener("pointerup",nn=()=>{},!0)}finally{oo=!1}}}async function nr(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(r=>{r!==n&&(l("Removing duplicate pane element from DOM"),r.remove())}),document.body.contains(n)){l("Pane already in DOM, skipping append");return}await er(),typeof Co=="function"&&Co(qo),typeof Qn=="function"&&Qn(Un),typeof eo=="function"&&eo(mo),typeof Io=="function"&&Io(M),await Mo(),await Di(),await Yt(),typeof Wt=="function"&&Wt();let o=document.querySelectorAll("#ytls-pane");if(o.length>0&&(l(`WARNING: Found ${o.length} existing pane(s) in DOM, removing all`),o.forEach(r=>r.remove())),document.body.contains(n)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(n),l("Pane successfully appended to DOM"),re(),fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),U(!0),fe=null},450),Xe){try{Xe.disconnect()}catch{}Xe=null}Xe=new MutationObserver(()=>{let r=document.querySelectorAll("#ytls-pane");r.length>1&&(l(`CRITICAL: Multiple panes detected (${r.length}), removing duplicates`),r.forEach((u,y)=>{(y>0||n&&u!==n)&&u.remove()}))}),Xe.observe(document.body,{childList:!0,subtree:!0})}function Ko(t=0){if(document.getElementById("ytls-header-button")){at();return}let o=document.querySelector("#logo");if(!o||!o.parentElement){t<10&&setTimeout(()=>Ko(t+1),300);return}let r=document.createElement("button");r.id="ytls-header-button",r.type="button",r.className="ytls-header-button",nt(r,"Toggle Timekeeper UI"),r.setAttribute("aria-label","Toggle Timekeeper UI");let u=document.createElement("img");u.src=ke,u.alt="",u.decoding="async",r.appendChild(u),ht=u,r.addEventListener("mouseenter",()=>{ht&&(kn=!0,ht.src=De)}),r.addEventListener("mouseleave",()=>{ht&&(kn=!1,at())}),r.addEventListener("click",()=>{n&&!document.body.contains(n)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),fo()}),o.insertAdjacentElement("afterend",r),at(),l("Timekeeper header button added next to YouTube logo")}function Zo(){if(W)return;W=!0;let t=history.pushState,o=history.replaceState;function r(){try{let u=new Event("locationchange");window.dispatchEvent(u)}catch{}}history.pushState=function(){let u=t.apply(this,arguments);return r(),u},history.replaceState=function(){let u=o.apply(this,arguments);return r(),u},window.addEventListener("popstate",r),window.addEventListener("locationchange",()=>{window.location.href!==Z&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function po(){if(!f()){Ui();return}Z=window.location.href,document.querySelectorAll("#ytls-pane").forEach((o,r)=>{(r>0||n&&o!==n)&&o.remove()}),await me(),await tr(),ge=co();let t=document.title;l("Page Title:",t),l("Video ID:",ge),l("Current URL:",window.location.href),so(!0),kt(),Ce(),await _o(),Ce(),so(!1),l("Timestamps loaded and UI unlocked for video:",ge),await nr(),Ko(),_i()}Zo(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),f()&&n&&c&&(l("Locking UI and showing loading state for navigation"),so(!0))}),en=t=>{t.ctrlKey&&t.altKey&&t.shiftKey&&(t.key==="T"||t.key==="t")&&(t.preventDefault(),fo(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",en),window.addEventListener("yt-navigate-finish",()=>{l("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==Z?po():l("Navigation finished but URL already handled, skipping.")}),Zo(),l("Timekeeper initialized and waiting for navigation events")})();})();

