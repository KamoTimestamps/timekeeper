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

(()=>{function c(e,...i){let r="debug",s=[...i];i.length>0&&typeof i[i.length-1]=="string"&&["debug","info","warn","error"].includes(i[i.length-1])&&(r=s.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[r](`${n} ${e}`,...s)}function wt(e,i=e){let r=Math.floor(e/3600),s=Math.floor(e%3600/60),m=String(e%60).padStart(2,"0");return i<3600?`${s<10?s:String(s).padStart(2,"0")}:${m}`:`${i>=36e3?String(r).padStart(2,"0"):r}:${String(s).padStart(2,"0")}:${m}`}function wo(e,i=window.location.href){try{let r=new URL(i);return r.searchParams.set("t",`${e}s`),r.toString()}catch{return`https://www.youtube.com/watch?v=${i.search(/[?&]v=/)>=0?i.split(/[?&]v=/)[1].split(/&/)[0]:i.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function mn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var cr=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function ri(){let e=new Date,i=e.getFullYear(),r=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let s of cr){let m=new Date(i,s.month-1,s.day),n=m.getTime()-e.getTime(),v=n/(1e3*60*60*24);if(v<=5&&v>=-2)return c(`Current date: ${r}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v<-2&&(m=new Date(i+1,s.month-1,s.day),n=m.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return c(`Current date: ${r}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v>5&&(m=new Date(i-1,s.month-1,s.day),n=m.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return c(`Current date: ${r}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji}return c(`Current date: ${r}, No holiday emoji (not within range)`),null}var He=null,pn=null;var Dt=null,fn=!1,it=null;function ur(){return(!He||!document.body.contains(He))&&(He=document.createElement("div"),He.className="ytls-tooltip",He.style.pointerEvents="none",document.body.appendChild(He),window.addEventListener("scroll",xo,!0),window.addEventListener("resize",xo,!0)),He}function dr(e,i,r){let m=window.innerWidth,n=window.innerHeight,v=e.getBoundingClientRect(),l=v.width,S=v.height,w=i+10,T=r+10;w+l>m-10&&(w=i-l-10),T+S>n-10&&(T=r-S-10),w=Math.max(10,Math.min(w,m-l-10)),T=Math.max(10,Math.min(T,n-S-10)),e.style.left=`${w}px`,e.style.top=`${T}px`}function ai(e,i){let s=window.innerWidth,m=window.innerHeight,n=i.getBoundingClientRect(),v=e.getBoundingClientRect(),l=v.width,S=v.height,w=Math.round(n.right+8),T=Math.round(n.top);w+l>s-8&&(w=Math.round(n.left-l-8)),w=Math.max(8,Math.min(w,s-l-8)),T+S>m-8&&(T=Math.round(n.bottom-S)),T=Math.max(8,Math.min(T,m-S-8)),e.style.left=`${w}px`,e.style.top=`${T}px`}function xo(){if(!(!He||!Dt)&&He.classList.contains("ytls-tooltip-visible"))try{ai(He,Dt)}catch{}}function mr(e=50){it&&(clearTimeout(it),it=null),!fn&&(it=setTimeout(()=>{Zn(),it=null},e))}function pr(e,i,r,s){pn&&clearTimeout(pn),s&&(Dt=s,fn=!0);let m=ur();m.textContent=e,m.classList.remove("ytls-tooltip-visible"),s?requestAnimationFrame(()=>{ai(m,s),requestAnimationFrame(()=>{m.classList.add("ytls-tooltip-visible")})}):(dr(m,i,r),requestAnimationFrame(()=>{m.classList.add("ytls-tooltip-visible")}))}function Zn(){pn&&(clearTimeout(pn),pn=null),it&&(clearTimeout(it),it=null),He&&He.classList.remove("ytls-tooltip-visible"),Dt=null,fn=!1}function Ze(e,i){let r=0,s=0,m=S=>{r=S.clientX,s=S.clientY,fn=!0,Dt=e;let w=typeof i=="function"?i():i;w&&pr(w,r,s,e)},n=S=>{if(r=S.clientX,s=S.clientY,it&&(clearTimeout(it),it=null),He&&He.classList.contains("ytls-tooltip-visible"))try{xo()}catch{}},v=()=>{fn=!1,mr()};e.addEventListener("mouseenter",m),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",v);let l=new MutationObserver(()=>{try{if(!document.body.contains(e))Dt===e&&Zn();else{let S=window.getComputedStyle(e);(S.display==="none"||S.visibility==="hidden"||S.opacity==="0")&&Dt===e&&Zn()}}catch{}});try{l.observe(e,{attributes:!0,attributeFilter:["class","style"]}),l.observe(document.body,{childList:!0,subtree:!0})}catch{}e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",m),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",v);try{l.disconnect()}catch{}delete e.__tooltipObserver},e.__tooltipObserver=l}function To(e){e.__tooltipCleanup&&(e.__tooltipCleanup(),delete e.__tooltipCleanup),Zn()}var si=`
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
  #ytls-resize-tl { top: -6px; left: -6px; width: 16px; height: 16px; cursor: nwse-resize; }
  #ytls-resize-tr { top: -6px; right: -6px; width: 16px; height: 16px; cursor: nesw-resize; }
  #ytls-resize-bl { bottom: -6px; left: -6px; width: 16px; height: 16px; cursor: nesw-resize; }
  #ytls-resize-br { bottom: -6px; right: -6px; width: 16px; height: 16px; cursor: nwse-resize; }
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

`;var ke=Uint8Array,Ve=Uint16Array,Co=Int32Array,Mo=new ke([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Do=new ke([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),li=new ke([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),fi=function(e,i){for(var r=new Ve(31),s=0;s<31;++s)r[s]=i+=1<<e[s-1];for(var m=new Co(r[30]),s=1;s<30;++s)for(var n=r[s];n<r[s+1];++n)m[n]=n-r[s]<<5|s;return{b:r,r:m}},hi=fi(Mo,2),fr=hi.b,ko=hi.r;fr[28]=258,ko[258]=28;var gi=fi(Do,0),jr=gi.b,ci=gi.r,So=new Ve(32768);for(q=0;q<32768;++q)pt=(q&43690)>>1|(q&21845)<<1,pt=(pt&52428)>>2|(pt&13107)<<2,pt=(pt&61680)>>4|(pt&3855)<<4,So[q]=((pt&65280)>>8|(pt&255)<<8)>>1;var pt,q,yn=(function(e,i,r){for(var s=e.length,m=0,n=new Ve(i);m<s;++m)e[m]&&++n[e[m]-1];var v=new Ve(i);for(m=1;m<i;++m)v[m]=v[m-1]+n[m-1]<<1;var l;if(r){l=new Ve(1<<i);var S=15-i;for(m=0;m<s;++m)if(e[m])for(var w=m<<4|e[m],T=i-e[m],D=v[e[m]-1]++<<T,M=D|(1<<T)-1;D<=M;++D)l[So[D]>>S]=w}else for(l=new Ve(s),m=0;m<s;++m)e[m]&&(l[m]=So[v[e[m]-1]++]>>15-e[m]);return l}),At=new ke(288);for(q=0;q<144;++q)At[q]=8;var q;for(q=144;q<256;++q)At[q]=9;var q;for(q=256;q<280;++q)At[q]=7;var q;for(q=280;q<288;++q)At[q]=8;var q,Jn=new ke(32);for(q=0;q<32;++q)Jn[q]=5;var q,hr=yn(At,9,0);var gr=yn(Jn,5,0);var yi=function(e){return(e+7)/8|0},vi=function(e,i,r){return(i==null||i<0)&&(i=0),(r==null||r>e.length)&&(r=e.length),new ke(e.subarray(i,r))};var yr=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Qn=function(e,i,r){var s=new Error(i||yr[e]);if(s.code=e,Error.captureStackTrace&&Error.captureStackTrace(s,Qn),!r)throw s;return s};var ft=function(e,i,r){r<<=i&7;var s=i/8|0;e[s]|=r,e[s+1]|=r>>8},hn=function(e,i,r){r<<=i&7;var s=i/8|0;e[s]|=r,e[s+1]|=r>>8,e[s+2]|=r>>16},Eo=function(e,i){for(var r=[],s=0;s<e.length;++s)e[s]&&r.push({s,f:e[s]});var m=r.length,n=r.slice();if(!m)return{t:wi,l:0};if(m==1){var v=new ke(r[0].s+1);return v[r[0].s]=1,{t:v,l:1}}r.sort(function(ge,Ce){return ge.f-Ce.f}),r.push({s:-1,f:25001});var l=r[0],S=r[1],w=0,T=1,D=2;for(r[0]={s:-1,f:l.f+S.f,l,r:S};T!=m-1;)l=r[r[w].f<r[D].f?w++:D++],S=r[w!=T&&r[w].f<r[D].f?w++:D++],r[T++]={s:-1,f:l.f+S.f,l,r:S};for(var M=n[0].s,s=1;s<m;++s)n[s].s>M&&(M=n[s].s);var H=new Ve(M+1),Z=Lo(r[T-1],H,0);if(Z>i){var s=0,W=0,X=Z-i,oe=1<<X;for(n.sort(function(Ce,ae){return H[ae.s]-H[Ce.s]||Ce.f-ae.f});s<m;++s){var U=n[s].s;if(H[U]>i)W+=oe-(1<<Z-H[U]),H[U]=i;else break}for(W>>=X;W>0;){var de=n[s].s;H[de]<i?W-=1<<i-H[de]++-1:++s}for(;s>=0&&W;--s){var J=n[s].s;H[J]==i&&(--H[J],++W)}Z=i}return{t:new ke(H),l:Z}},Lo=function(e,i,r){return e.s==-1?Math.max(Lo(e.l,i,r+1),Lo(e.r,i,r+1)):i[e.s]=r},ui=function(e){for(var i=e.length;i&&!e[--i];);for(var r=new Ve(++i),s=0,m=e[0],n=1,v=function(S){r[s++]=S},l=1;l<=i;++l)if(e[l]==m&&l!=i)++n;else{if(!m&&n>2){for(;n>138;n-=138)v(32754);n>2&&(v(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(v(m),--n;n>6;n-=6)v(8304);n>2&&(v(n-3<<5|8208),n=0)}for(;n--;)v(m);n=1,m=e[l]}return{c:r.subarray(0,s),n:i}},gn=function(e,i){for(var r=0,s=0;s<i.length;++s)r+=e[s]*i[s];return r},bi=function(e,i,r){var s=r.length,m=yi(i+2);e[m]=s&255,e[m+1]=s>>8,e[m+2]=e[m]^255,e[m+3]=e[m+1]^255;for(var n=0;n<s;++n)e[m+n+4]=r[n];return(m+4+s)*8},di=function(e,i,r,s,m,n,v,l,S,w,T){ft(i,T++,r),++m[256];for(var D=Eo(m,15),M=D.t,H=D.l,Z=Eo(n,15),W=Z.t,X=Z.l,oe=ui(M),U=oe.c,de=oe.n,J=ui(W),ge=J.c,Ce=J.n,ae=new Ve(19),_=0;_<U.length;++_)++ae[U[_]&31];for(var _=0;_<ge.length;++_)++ae[ge[_]&31];for(var R=Eo(ae,7),le=R.t,me=R.l,ce=19;ce>4&&!le[li[ce-1]];--ce);var Oe=w+5<<3,Se=gn(m,At)+gn(n,Jn)+v,Be=gn(m,M)+gn(n,W)+v+14+3*ce+gn(ae,le)+2*ae[16]+3*ae[17]+7*ae[18];if(S>=0&&Oe<=Se&&Oe<=Be)return bi(i,T,e.subarray(S,S+w));var Ke,pe,ze,at;if(ft(i,T,1+(Be<Se)),T+=2,Be<Se){Ke=yn(M,H,0),pe=M,ze=yn(W,X,0),at=W;var Kt=yn(le,me,0);ft(i,T,de-257),ft(i,T+5,Ce-1),ft(i,T+10,ce-4),T+=14;for(var _=0;_<ce;++_)ft(i,T+3*_,le[li[_]]);T+=3*ce;for(var Ne=[U,ge],Ge=0;Ge<2;++Ge)for(var Pe=Ne[Ge],_=0;_<Pe.length;++_){var j=Pe[_]&31;ft(i,T,Kt[j]),T+=le[j],j>15&&(ft(i,T,Pe[_]>>5&127),T+=Pe[_]>>12)}}else Ke=hr,pe=At,ze=gr,at=Jn;for(var _=0;_<l;++_){var ue=s[_];if(ue>255){var j=ue>>18&31;hn(i,T,Ke[j+257]),T+=pe[j+257],j>7&&(ft(i,T,ue>>23&31),T+=Mo[j]);var ht=ue&31;hn(i,T,ze[ht]),T+=at[ht],ht>3&&(hn(i,T,ue>>5&8191),T+=Do[ht])}else hn(i,T,Ke[ue]),T+=pe[ue]}return hn(i,T,Ke[256]),T+pe[256]},vr=new Co([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),wi=new ke(0),br=function(e,i,r,s,m,n){var v=n.z||e.length,l=new ke(s+v+5*(1+Math.ceil(v/7e3))+m),S=l.subarray(s,l.length-m),w=n.l,T=(n.r||0)&7;if(i){T&&(S[0]=n.r>>3);for(var D=vr[i-1],M=D>>13,H=D&8191,Z=(1<<r)-1,W=n.p||new Ve(32768),X=n.h||new Ve(Z+1),oe=Math.ceil(r/3),U=2*oe,de=function(Fe){return(e[Fe]^e[Fe+1]<<oe^e[Fe+2]<<U)&Z},J=new Co(25e3),ge=new Ve(288),Ce=new Ve(32),ae=0,_=0,R=n.i||0,le=0,me=n.w||0,ce=0;R+2<v;++R){var Oe=de(R),Se=R&32767,Be=X[Oe];if(W[Se]=Be,X[Oe]=Se,me<=R){var Ke=v-R;if((ae>7e3||le>24576)&&(Ke>423||!w)){T=di(e,S,0,J,ge,Ce,_,le,ce,R-ce,T),le=ae=_=0,ce=R;for(var pe=0;pe<286;++pe)ge[pe]=0;for(var pe=0;pe<30;++pe)Ce[pe]=0}var ze=2,at=0,Kt=H,Ne=Se-Be&32767;if(Ke>2&&Oe==de(R-Ne))for(var Ge=Math.min(M,Ke)-1,Pe=Math.min(32767,R),j=Math.min(258,Ke);Ne<=Pe&&--Kt&&Se!=Be;){if(e[R+ze]==e[R+ze-Ne]){for(var ue=0;ue<j&&e[R+ue]==e[R+ue-Ne];++ue);if(ue>ze){if(ze=ue,at=Ne,ue>Ge)break;for(var ht=Math.min(Ne,ue-2),Tn=0,pe=0;pe<ht;++pe){var Bt=R-Ne+pe&32767,ao=W[Bt],Zt=Bt-ao&32767;Zt>Tn&&(Tn=Zt,Be=Bt)}}}Se=Be,Be=W[Se],Ne+=Se-Be&32767}if(at){J[le++]=268435456|ko[ze]<<18|ci[at];var En=ko[ze]&31,zt=ci[at]&31;_+=Mo[En]+Do[zt],++ge[257+En],++Ce[zt],me=R+ze,++ae}else J[le++]=e[R],++ge[e[R]]}}for(R=Math.max(R,me);R<v;++R)J[le++]=e[R],++ge[e[R]];T=di(e,S,w,J,ge,Ce,_,le,ce,R-ce,T),w||(n.r=T&7|S[T/8|0]<<3,T-=7,n.h=X,n.p=W,n.i=R,n.w=me)}else{for(var R=n.w||0;R<v+w;R+=65535){var xt=R+65535;xt>=v&&(S[T/8|0]=w,xt=v),T=bi(S,T+1,e.subarray(R,xt))}n.i=v}return vi(l,0,s+yi(T)+m)},wr=(function(){for(var e=new Int32Array(256),i=0;i<256;++i){for(var r=i,s=9;--s;)r=(r&1&&-306674912)^r>>>1;e[i]=r}return e})(),xr=function(){var e=-1;return{p:function(i){for(var r=e,s=0;s<i.length;++s)r=wr[r&255^i[s]]^r>>>8;e=r},d:function(){return~e}}};var Tr=function(e,i,r,s,m){if(!m&&(m={l:1},i.dictionary)){var n=i.dictionary.subarray(-32768),v=new ke(n.length+e.length);v.set(n),v.set(e,n.length),e=v,m.w=n.length}return br(e,i.level==null?6:i.level,i.mem==null?m.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+i.mem,r,s,m)},xi=function(e,i){var r={};for(var s in e)r[s]=e[s];for(var s in i)r[s]=i[s];return r};var Ee=function(e,i,r){for(;r;++i)e[i]=r,r>>>=8};function Er(e,i){return Tr(e,i||{},0,0)}var Ti=function(e,i,r,s){for(var m in e){var n=e[m],v=i+m,l=s;Array.isArray(n)&&(l=xi(s,n[1]),n=n[0]),n instanceof ke?r[v]=[n,l]:(r[v+="/"]=[new ke(0),l],Ti(n,v,r,s))}},mi=typeof TextEncoder<"u"&&new TextEncoder,kr=typeof TextDecoder<"u"&&new TextDecoder,Sr=0;try{kr.decode(wi,{stream:!0}),Sr=1}catch{}function Xn(e,i){if(i){for(var r=new ke(e.length),s=0;s<e.length;++s)r[s]=e.charCodeAt(s);return r}if(mi)return mi.encode(e);for(var m=e.length,n=new ke(e.length+(e.length>>1)),v=0,l=function(T){n[v++]=T},s=0;s<m;++s){if(v+5>n.length){var S=new ke(v+8+(m-s<<1));S.set(n),n=S}var w=e.charCodeAt(s);w<128||i?l(w):w<2048?(l(192|w>>6),l(128|w&63)):w>55295&&w<57344?(w=65536+(w&1047552)|e.charCodeAt(++s)&1023,l(240|w>>18),l(128|w>>12&63),l(128|w>>6&63),l(128|w&63)):(l(224|w>>12),l(128|w>>6&63),l(128|w&63))}return vi(n,0,v)}var Io=function(e){var i=0;if(e)for(var r in e){var s=e[r].length;s>65535&&Qn(9),i+=s+4}return i},pi=function(e,i,r,s,m,n,v,l){var S=s.length,w=r.extra,T=l&&l.length,D=Io(w);Ee(e,i,v!=null?33639248:67324752),i+=4,v!=null&&(e[i++]=20,e[i++]=r.os),e[i]=20,i+=2,e[i++]=r.flag<<1|(n<0&&8),e[i++]=m&&8,e[i++]=r.compression&255,e[i++]=r.compression>>8;var M=new Date(r.mtime==null?Date.now():r.mtime),H=M.getFullYear()-1980;if((H<0||H>119)&&Qn(10),Ee(e,i,H<<25|M.getMonth()+1<<21|M.getDate()<<16|M.getHours()<<11|M.getMinutes()<<5|M.getSeconds()>>1),i+=4,n!=-1&&(Ee(e,i,r.crc),Ee(e,i+4,n<0?-n-2:n),Ee(e,i+8,r.size)),Ee(e,i+12,S),Ee(e,i+14,D),i+=16,v!=null&&(Ee(e,i,T),Ee(e,i+6,r.attrs),Ee(e,i+10,v),i+=14),e.set(s,i),i+=S,D)for(var Z in w){var W=w[Z],X=W.length;Ee(e,i,+Z),Ee(e,i+2,X),e.set(W,i+4),i+=4+X}return T&&(e.set(l,i),i+=T),i},Lr=function(e,i,r,s,m){Ee(e,i,101010256),Ee(e,i+8,r),Ee(e,i+10,r),Ee(e,i+12,s),Ee(e,i+16,m)};function Ei(e,i){i||(i={});var r={},s=[];Ti(e,"",r,i);var m=0,n=0;for(var v in r){var l=r[v],S=l[0],w=l[1],T=w.level==0?0:8,D=Xn(v),M=D.length,H=w.comment,Z=H&&Xn(H),W=Z&&Z.length,X=Io(w.extra);M>65535&&Qn(11);var oe=T?Er(S,w):S,U=oe.length,de=xr();de.p(S),s.push(xi(w,{size:S.length,crc:de.d(),c:oe,f:D,m:Z,u:M!=v.length||Z&&H.length!=W,o:m,compression:T})),m+=30+M+X+U,n+=76+2*(M+X)+(W||0)+U}for(var J=new ke(n+22),ge=m,Ce=n-m,ae=0;ae<s.length;++ae){var D=s[ae];pi(J,D.o,D,D.f,D.u,D.c.length);var _=30+D.f.length+Io(D.extra);J.set(D.c,D.o+_),pi(J,m,D,D.f,D.u,D.c.length,D.o,D.m),m+=16+_+(D.m?D.m.length:0)}return Lr(J,m,s.length,Ce,ge),J}var O={isSignedIn:!1,accessToken:null,userName:null,email:null},rt=!0,Ye=30,Xe=null,Vt=!1,jt=0,Je=null,Ao=null,xe=null,V=null,eo=null;function Ii(e){Ao=e}function Ci(e){xe=e}function Mi(e){V=e}function Bo(e){eo=e}var ki=!1;function Di(){if(!ki)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),ki=!0}catch{}}var Ai=null,vn=null,bn=null;function zo(e){Ai=e}function no(e){vn=e}function oo(e){bn=e}var Si="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Ir="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Cr="https://www.youtube.com/",Mr=30*1e3,Dr=1800*1e3,Li=5,to=null,We=null;async function Po(){try{let e=await bn("googleAuthState");e&&typeof e=="object"&&(O={...O,...e},xn(),O.isSignedIn&&O.accessToken&&await Yt(!0))}catch(e){c("Failed to load Google auth state:",e,"error")}}async function io(){try{await vn("googleAuthState",O)}catch(e){c("Failed to save Google auth state:",e,"error")}}function xn(){Ao&&(Ao.style.display="none")}function Re(e,i){if(V){if(V.style.fontWeight="bold",e==="authenticating"){for(Di(),V.style.color="#ffa500";V.firstChild;)V.removeChild(V.firstChild);let r=document.createElement("span");r.className="tk-auth-spinner";let s=document.createTextNode(` ${i||"Authorizing with Google\u2026"}`);V.appendChild(r),V.appendChild(s);return}if(e==="error"){V.textContent=`\u274C ${i||"Authorization failed"}`,V.style.color="#ff4d4f",re();return}O.isSignedIn?(V.textContent="\u2705 Signed in",V.style.color="#52c41a",V.removeAttribute("title"),O.userName?(V.onmouseenter=()=>{V.textContent=`\u2705 Signed in as ${O.userName}`},V.onmouseleave=()=>{V.textContent="\u2705 Signed in"}):(V.onmouseenter=null,V.onmouseleave=null)):(V.textContent="\u274C Not signed in",V.style.color="#ff4d4f",V.removeAttribute("title"),V.onmouseenter=null,V.onmouseleave=null),re()}}function Ar(){V&&(Di(),V.classList.remove("tk-auth-blink"),V.offsetWidth,V.classList.add("tk-auth-blink"),setTimeout(()=>{V.classList.remove("tk-auth-blink")},1200))}function Br(e){return new Promise((i,r)=>{if(!e){c&&c("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}c&&c("OAuth monitor: starting to monitor popup for token");let s=Date.now(),m=300*1e3,n="timekeeper_oauth",v=null,l=null,S=null,w=()=>{if(v){try{v.close()}catch{}v=null}l&&(clearInterval(l),l=null),S&&(clearInterval(S),S=null)};try{v=new BroadcastChannel(n),c&&c("OAuth monitor: BroadcastChannel created successfully"),v.onmessage=M=>{if(c&&c("OAuth monitor: received BroadcastChannel message",M.data),M.data?.type==="timekeeper_oauth_token"&&M.data?.token){c&&c("OAuth monitor: token received via BroadcastChannel"),w();try{e.close()}catch{}i(M.data.token)}else if(M.data?.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),w();try{e.close()}catch{}r(new Error(M.data.error||"OAuth failed"))}}}catch(M){c&&c("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",M)}c&&c("OAuth monitor: setting up IndexedDB polling");let T=Date.now();l=setInterval(async()=>{try{let M=indexedDB.open("ytls-timestamps-db",3);M.onsuccess=()=>{let H=M.result,X=H.transaction("settings","readonly").objectStore("settings").get("oauth_message");X.onsuccess=()=>{let oe=X.result;if(oe&&oe.value){let U=oe.value;if(U.timestamp&&U.timestamp>T){if(c&&c("OAuth monitor: received IndexedDB message",U),U.type==="timekeeper_oauth_token"&&U.token){c&&c("OAuth monitor: token received via IndexedDB"),w();try{e.close()}catch{}H.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(U.token)}else if(U.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via IndexedDB",U.error,"error"),w();try{e.close()}catch{}H.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(U.error||"OAuth failed"))}T=U.timestamp}}H.close()}}}catch(M){c&&c("OAuth monitor: IndexedDB polling error",M,"error")}},500),S=setInterval(()=>{if(Date.now()-s>m){c&&c("OAuth monitor: popup timed out after 5 minutes",null,"error"),w();try{e.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function Bi(){if(!Si){Re("error","Google Client ID not configured");return}try{c&&c("OAuth signin: starting OAuth flow"),Re("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",Si),e.searchParams.set("redirect_uri",Cr),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Ir),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),c&&c("OAuth signin: opening popup");let i=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!i){c&&c("OAuth signin: popup blocked by browser",null,"error"),Re("error","Popup blocked. Please enable popups for YouTube.");return}c&&c("OAuth signin: popup opened successfully"),Re("authenticating","Waiting for authentication...");try{let r=await Br(i),s=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${r}`}});if(s.ok){let m=await s.json();O.accessToken=r,O.isSignedIn=!0,O.userName=m.name,O.email=m.email,await io(),xn(),Re(),re(),await Yt(),c?c(`Successfully authenticated as ${m.name}`):console.log(`[Timekeeper] Successfully authenticated as ${m.name}`)}else throw new Error("Failed to fetch user info")}catch(r){let s=r instanceof Error?r.message:"Authentication failed";c?c("OAuth failed:",r,"error"):console.error("[Timekeeper] OAuth failed:",r),Re("error",s);return}}catch(e){let i=e instanceof Error?e.message:"Sign in failed";c?c("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Re("error",`Failed to sign in: ${i}`)}}async function zi(){if(!window.opener||window.opener===window)return!1;c&&c("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return c&&c("OAuth popup: no hash params found"),!1;let i=e.startsWith("#")?e.substring(1):e,r=new URLSearchParams(i),s=r.get("state");if(c&&c("OAuth popup: hash params found, state="+s),s!=="timekeeper_auth")return c&&c("OAuth popup: not our OAuth flow (wrong state)"),!1;let m=r.get("error"),n=r.get("access_token"),v="timekeeper_oauth";if(m){try{let l=new BroadcastChannel(v);l.postMessage({type:"timekeeper_oauth_error",error:r.get("error_description")||m}),l.close()}catch{let S={type:"timekeeper_oauth_error",error:r.get("error_description")||m,timestamp:Date.now()},w=indexedDB.open("ytls-timestamps-db",3);w.onsuccess=()=>{let T=w.result;T.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),T.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){c&&c("OAuth popup: access token found, broadcasting to opener");try{let l=new BroadcastChannel(v);l.postMessage({type:"timekeeper_oauth_token",token:n}),l.close(),c&&c("OAuth popup: token broadcast via BroadcastChannel")}catch(l){c&&c("OAuth popup: BroadcastChannel failed, using IndexedDB",l);let S={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},w=indexedDB.open("ytls-timestamps-db",3);w.onsuccess=()=>{let T=w.result;T.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),T.close()},c&&c("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Pi(){O={isSignedIn:!1,accessToken:null,userName:null,email:null},await io(),xn(),Re(),re()}async function Fi(){if(!O.isSignedIn||!O.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${O.accessToken}`}});return e.status===401?(await $i({silent:!0}),!1):e.ok}catch(e){return c("Failed to verify auth state:",e,"error"),!1}}async function zr(e){let i={Authorization:`Bearer ${e}`},s=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,m=await fetch(s,{headers:i});if(m.status===401)throw new Error("unauthorized");if(!m.ok)throw new Error("drive search failed");let n=await m.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let v=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...i,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(v.status===401)throw new Error("unauthorized");if(!v.ok)throw new Error("drive folder create failed");return(await v.json()).id}async function Pr(e,i,r){let s=`name='${e}' and '${i}' in parents and trashed=false`,m=encodeURIComponent(s),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${m}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${r}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let v=await n.json();return v.files&&v.files.length>0?v.files[0].id:null}function Fr(e,i){let r=Xn(e),s=i.replace(/\\/g,"/").replace(/^\/+/,"");return s.endsWith(".json")||(s+=".json"),Ei({[s]:[r,{level:6,mtime:new Date,os:0}]})}async function $r(e,i,r,s){let m=e.replace(/\.json$/,".zip"),n=await Pr(m,r,s),v=new TextEncoder().encode(i).length,l=Fr(i,e),S=l.length;c(`Compressing data: ${v} bytes -> ${S} bytes (${Math.round(100-S/v*100)}% reduction)`);let w="-------314159265358979",T=`\r
--${w}\r
`,D=`\r
--${w}--`,M=n?{name:m,mimeType:"application/zip"}:{name:m,mimeType:"application/zip",parents:[r]},H=8192,Z="";for(let J=0;J<l.length;J+=H){let ge=l.subarray(J,Math.min(J+H,l.length));Z+=String.fromCharCode.apply(null,Array.from(ge))}let W=btoa(Z),X=T+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(M)+T+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+W+D,oe,U;n?(oe=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,U="PATCH"):(oe="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",U="POST");let de=await fetch(oe,{method:U,headers:{Authorization:`Bearer ${s}`,"Content-Type":`multipart/related; boundary=${w}`},body:X});if(de.status===401)throw new Error("unauthorized");if(!de.ok)throw new Error("drive upload failed")}async function $i(e){c("Auth expired, clearing token",null,"warn"),O.isSignedIn=!1,O.accessToken=null,await io(),Re("error","Authorization expired. Please sign in again."),re()}async function Hr(e){if(!O.isSignedIn||!O.accessToken){e?.silent||Re("error","Please sign in to Google Drive first");return}try{let{json:i,filename:r,totalVideos:s,totalTimestamps:m}=await Ai();if(m===0){e?.silent||c("Skipping export: no timestamps to back up");return}let n=await zr(O.accessToken);await $r(r,i,n,O.accessToken),c(`Exported to Google Drive (${r}) with ${s} videos / ${m} timestamps.`)}catch(i){throw i.message==="unauthorized"?(await $i({silent:e?.silent}),i):(c("Drive export failed:",i,"error"),e?.silent||Re("error","Failed to export to Google Drive."),i)}}async function Hi(){try{let e=await bn("autoBackupEnabled"),i=await bn("autoBackupIntervalMinutes"),r=await bn("lastAutoBackupAt");typeof e=="boolean"&&(rt=e),typeof i=="number"&&i>0&&(Ye=i),typeof r=="number"&&r>0&&(Xe=r)}catch(e){c("Failed to load auto backup settings:",e,"error")}}async function Fo(){try{await vn("autoBackupEnabled",rt),await vn("autoBackupIntervalMinutes",Ye),await vn("lastAutoBackupAt",Xe??0)}catch(e){c("Failed to save auto backup settings:",e,"error")}}function Rr(){to&&(clearInterval(to),to=null),We&&(clearTimeout(We),We=null)}function Wt(e){try{let i=new Date(e),r=new Date,s=i.toDateString()===r.toDateString(),m=i.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return s?m:`${i.toLocaleDateString()} ${m}`}catch{return""}}function re(){if(!xe)return;let e="",i="";if(!rt)e="\u{1F501} Backup: Off",xe.onmouseenter=null,xe.onmouseleave=null;else if(Vt)e="\u{1F501} Backing up\u2026",xe.onmouseenter=null,xe.onmouseleave=null;else if(Je&&Je>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(Je/6e4)}m`,xe.onmouseenter=null,xe.onmouseleave=null;else if(Xe){e=`\u{1F5C4}\uFE0F Last backup: ${Wt(Xe)}`;let r=Xe+Math.max(1,Ye)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Wt(r)}`,xe.onmouseenter=()=>{xe.textContent=i},xe.onmouseleave=()=>{xe.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let r=Date.now()+Math.max(1,Ye)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Wt(r)}`,xe.onmouseenter=()=>{xe.textContent=i},xe.onmouseleave=()=>{xe.textContent=e}}xe.textContent=e,xe.style.display=e?"inline":"none",ro()}function ro(){if(!eo)return;let e="";rt?Vt?e="#4285f4":Je&&Je>0?e="#ffa500":O.isSignedIn&&Xe?e="#52c41a":O.isSignedIn?e="#ffa500":e="#ff4d4f":e="#ff4d4f",eo.style.backgroundColor=e,Ze(eo,()=>{let i="";if(!rt)i="Auto backup is disabled";else if(Vt)i="Backup in progress";else if(Je&&Je>0)i=`Retrying backup in ${Math.ceil(Je/6e4)}m`;else if(O.isSignedIn&&Xe){let r=Xe+Math.max(1,Ye)*60*1e3,s=Wt(r);i=`Last backup: ${Wt(Xe)}
Next backup: ${s}`}else if(O.isSignedIn){let r=Date.now()+Math.max(1,Ye)*60*1e3;i=`No backup yet
Next backup: ${Wt(r)}`}else i="Not signed in to Google Drive";return i})}async function wn(e=!0){if(!O.isSignedIn||!O.accessToken){e||Ar();return}if(We){c("Auto backup: backoff in progress, skipping scheduled run");return}if(!Vt){Vt=!0,re();try{await Hr({silent:e}),Xe=Date.now(),jt=0,Je=null,We&&(clearTimeout(We),We=null),await Fo()}catch(i){if(c("Auto backup failed:",i,"error"),i.message==="unauthorized")c("Auth error detected, clearing token and stopping retries",null,"warn"),O.isSignedIn=!1,O.accessToken=null,await io(),Re("error","Authorization expired. Please sign in again."),re(),jt=0,Je=null,We&&(clearTimeout(We),We=null);else if(jt<Li){jt+=1;let m=Math.min(Mr*Math.pow(2,jt-1),Dr);Je=m,We&&clearTimeout(We),We=setTimeout(()=>{wn(!0)},m),c(`Scheduling backup retry ${jt}/${Li} in ${Math.round(m/1e3)}s`),re()}else Je=null}finally{Vt=!1,re()}}}async function Yt(e=!1){if(Rr(),!!rt&&!(!O.isSignedIn||!O.accessToken)){if(to=setInterval(()=>{wn(!0)},Math.max(1,Ye)*60*1e3),!e){let i=Date.now(),r=Math.max(1,Ye)*60*1e3;(!Xe||i-Xe>=r)&&wn(!0)}re()}}async function Ri(){rt=!rt,await Fo(),await Yt(),re()}async function Oi(){let e=prompt("Set Auto Backup interval (minutes):",String(Ye));if(e===null)return;let i=Math.floor(Number(e));if(!Number.isFinite(i)||i<5||i>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Ye=i,await Fo(),await Yt(),re()}var $o=window.location.hash;if($o&&$o.length>1){let e=new URLSearchParams($o.substring(1));if(e.get("state")==="timekeeper_auth"){let r=e.get("access_token");if(r){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",r.length,"characters");try{let s=new BroadcastChannel("timekeeper_oauth"),m={type:"timekeeper_oauth_token",token:r};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:m.type,tokenLength:r.length}),s.postMessage(m),s.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(s){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",s);let m={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},n=indexedDB.open("ytls-timestamps-db",3);n.onsuccess=()=>{let v=n.result,l=v.transaction("settings","readwrite");l.objectStore("settings").put({key:"oauth_message",value:m}),l.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",m.timestamp),v.close()}}}if(history.replaceState){let s=window.location.pathname+window.location.search;history.replaceState(null,"",s)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(t){return GM.getValue(`timekeeper_${t}`,void 0)}function i(t,o){return GM.setValue(`timekeeper_${t}`,JSON.stringify(o))}if(oo(e),no(i),await zi()){c("OAuth popup detected, broadcasting token and closing");return}await Po();let s=["/watch","/live"];function m(t=window.location.href){try{let o=new URL(t);return o.origin!=="https://www.youtube.com"?!1:s.some(a=>o.pathname===a||o.pathname.startsWith(`${a}/`))}catch(o){return c("Timekeeper failed to parse URL for support check:",o,"error"),!1}}let n=null,v=null,l=null,S=null,w=null,T=null,D=null,M=null,H=250,Z=null,W=!1;function X(){return n?n.getBoundingClientRect():null}function oe(t,o,a){t&&($e={x:Math.round(typeof o=="number"?o:t.left),y:Math.round(typeof a=="number"?a:t.top),width:Math.round(t.width),height:Math.round(t.height)})}function U(t=!0){if(!n)return;$t();let o=X();o&&(o.width||o.height)&&(oe(o),t&&(_n("windowPosition",$e),Jt({type:"window_position_updated",position:$e,timestamp:Date.now()})))}function de(){if(!n||!v||!S||!l)return;let t=40,o=te();if(o.length>0)t=o[0].offsetHeight;else{let a=document.createElement("li");a.style.visibility="hidden",a.style.position="absolute",a.textContent="00:00 Example",l.appendChild(a),t=a.offsetHeight,l.removeChild(a)}H=v.offsetHeight+S.offsetHeight+t,n.style.minHeight=H+"px"}function J(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),de(),U(!0)})}function ge(t=450){fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{R(),J(),fe=null},t)}function Ce(){fe&&(clearTimeout(fe),fe=null)}function ae(){l&&(l.style.visibility="hidden",c("Hiding timestamps during show animation")),J(),ge()}function _(){R(),Ce(),Qe&&(clearTimeout(Qe),Qe=null),Qe=setTimeout(()=>{n&&(n.style.display="none",Xo(),Qe=null)},400)}function R(){if(!l){Ue&&(Ue(),Ue=null,st=null,gt=null);return}if(!gt){l.style.visibility==="hidden"&&(l.style.visibility="",c("Restoring timestamp visibility (no deferred fragment)")),Ue&&(Ue(),Ue=null,st=null);return}c("Appending deferred timestamps after animation"),l.appendChild(gt),gt=null,l.style.visibility==="hidden"&&(l.style.visibility="",c("Restoring timestamp visibility after append")),Ue&&(Ue(),Ue=null,st=null),nt(),Me(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let t=j(),o=t?Math.floor(t.getCurrentTime()):kt();Number.isFinite(o)&&Rn(o,!1)}let le=null,me=!1,ce="ytls-timestamp-pending-delete",Oe="ytls-timestamp-highlight",Se="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",Be="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function Ke(){let t=o=>{let a=new Image;a.src=o};t(Se),t(Be)}Ke();async function pe(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(t=>setTimeout(t,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(t=>setTimeout(t,100));await new Promise(t=>setTimeout(t,200))}let ze=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],at=5e3,Kt=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Ne(t){return Kt.has(t)}function Ge(){return document.querySelector("video")}let Pe=null;function j(){if(Pe&&document.contains(Pe))return Pe;let t=document.getElementById("movie_player");return t&&document.contains(t)?t:null}function ue(t){return ze.every(o=>typeof t?.[o]=="function"?!0:Ne(o)?!!Ge():!1)}function ht(t){return ze.filter(o=>typeof t?.[o]=="function"?!1:Ne(o)?!Ge():!0)}async function Tn(t=at){let o=Date.now();for(;Date.now()-o<t;){let u=j();if(ue(u))return u;await new Promise(y=>setTimeout(y,100))}let a=j();return ue(a),a}let Bt="timestampOffsetSeconds",ao=-5,Zt="shiftClickTimeSkipSeconds",En=10,zt=300,xt=300,Fe=null;function Ho(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Ro(){if(Ho()&&!Fe)try{Fe=new BroadcastChannel("ytls_timestamp_channel"),Fe.onmessage=Oo}catch(t){c("Failed to create BroadcastChannel:",t,"warn"),Fe=null}}function Jt(t){if(!Ho()){c("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Ro(),!Fe){c("No BroadcastChannel available to post message","warn");return}try{Fe.postMessage(t)}catch(o){c("BroadcastChannel error, reopening:",o,"warn");try{Fe=new BroadcastChannel("ytls_timestamp_channel"),Fe.onmessage=Oo,Fe.postMessage(t)}catch(a){c("Failed to reopen BroadcastChannel:",a,"error")}}}function Oo(t){if(c("Received message from another tab:",t.data),!(!m()||!l||!n)&&t.data){if(t.data.type==="timestamps_updated"&&t.data.videoId===ye)c("Debouncing timestamp load due to external update for video:",t.data.videoId),clearTimeout(Qt),Qt=setTimeout(()=>{c("Reloading timestamps due to external update for video:",t.data.videoId),Yo()},500);else if(t.data.type==="window_position_updated"&&n){let o=t.data.position;if(o&&typeof o.x=="number"&&typeof o.y=="number"){n.style.left=`${o.x}px`,n.style.top=`${o.y}px`,n.style.right="auto",n.style.bottom="auto",typeof o.width=="number"&&o.width>0&&(n.style.width=`${o.width}px`),typeof o.height=="number"&&o.height>0&&(n.style.height=`${o.height}px`);let a=n.getBoundingClientRect();$e={x:Math.round(o.x),y:Math.round(o.y),width:Math.round(a.width),height:Math.round(a.height)};let u=document.documentElement.clientWidth,y=document.documentElement.clientHeight;(a.left<0||a.top<0||a.right>u||a.bottom>y)&&$t()}}}}Ro();let Pt=await GM.getValue(Bt);(typeof Pt!="number"||Number.isNaN(Pt))&&(Pt=ao,await GM.setValue(Bt,Pt));let Xt=await GM.getValue(Zt);(typeof Xt!="number"||Number.isNaN(Xt))&&(Xt=En,await GM.setValue(Zt,Xt));let Qt=null,Tt=new Map,kn=!1,P=null,Sn=null,ye=null,Qe=null,fe=null,gt=null,st=null,Ue=null,yt=null,Ln=!1,$e=null,so=!1,In=null,Cn=null,Mn=null,Dn=null,An=null,Bn=null,zn=null,en=null,tn=null,nn=null,et=null,tt=null,No=0,on=!1,Et=null,rn=null;function te(){return l?Array.from(l.querySelectorAll("li")).filter(t=>!!t.querySelector("a[data-time]")):[]}function lo(){return te().map(t=>{let o=t.querySelector("a[data-time]"),a=o?.dataset.time;if(!o||!a)return null;let u=Number.parseInt(a,10);if(!Number.isFinite(u))return null;let g=t.querySelector("input")?.value??"",d=t.dataset.guid??crypto.randomUUID();return t.dataset.guid||(t.dataset.guid=d),{start:u,comment:g,guid:d}}).filter(Uo)}function kt(){if(rn!==null)return rn;let t=te();return rn=t.length>0?Math.max(...t.map(o=>{let a=o.querySelector("a[data-time]")?.getAttribute("data-time");return a?Number.parseInt(a,10):0})):0,rn}function Pn(){rn=null}function Ni(t){let o=t.querySelector(".time-diff");return o?(o.textContent?.trim()||"").startsWith("-"):!1}function Gi(t,o){return t?o?"\u2514\u2500 ":"\u251C\u2500 ":""}function an(t){return t.startsWith("\u251C\u2500 ")||t.startsWith("\u2514\u2500 ")?1:0}function Go(t){return t.replace(/^[├└]─\s/,"")}function Ui(t){let o=te();if(t>=o.length-1)return"\u2514\u2500 ";let a=o[t+1].querySelector("input");return a&&an(a.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function nt(){if(!l)return;let t=te(),o=!0,a=0,u=t.length;for(;o&&a<u;)o=!1,a++,t.forEach((y,g)=>{let d=y.querySelector("input");if(!d||!(an(d.value)===1))return;let k=!1;if(g<t.length-1){let z=t[g+1].querySelector("input");z&&(k=!(an(z.value)===1))}else k=!0;let E=Go(d.value),L=`${Gi(!0,k)}${E}`;d.value!==L&&(d.value=L,o=!0)})}function St(){if(l){for(;l.firstChild;)l.removeChild(l.firstChild);gt&&(gt=null),Ue&&(Ue(),Ue=null,st=null)}}function sn(){if(!l||me||gt)return;Array.from(l.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||co("No timestamps for this video")}function co(t){if(!l)return;St();let o=document.createElement("li");o.className="ytls-placeholder",o.textContent=t,l.appendChild(o),l.style.overflowY="hidden"}function uo(){if(!l)return;let t=l.querySelector(".ytls-placeholder");t&&t.remove(),l.style.overflowY=""}function mo(t){if(!(!n||!l)){if(me=t,t)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),co("Loading timestamps...");else if(uo(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),w){let o=j();if(o){let a=o.getCurrentTime(),u=Number.isFinite(a)?Math.max(0,Math.floor(a)):Math.max(0,kt()),y=Math.floor(u/3600),g=Math.floor(u/60)%60,d=u%60,{isLive:h}=o.getVideoData()||{isLive:!1},k=l?te().map(I=>{let L=I.querySelector("a[data-time]");return L?parseFloat(L.getAttribute("data-time")??"0"):0}):[],E="";if(k.length>0)if(h){let I=Math.max(1,u/60),L=k.filter(z=>z<=u);if(L.length>0){let z=(L.length/I).toFixed(2);parseFloat(z)>0&&(E=` (${z}/min)`)}}else{let I=o.getDuration(),L=Number.isFinite(I)&&I>0?I:0,z=Math.max(1,L/60),Q=(k.length/z).toFixed(1);parseFloat(Q)>0&&(E=` (${Q}/min)`)}w.textContent=`\u23F3${y?y+":"+String(g).padStart(2,"0"):g}:${String(d).padStart(2,"0")}${E}`}}!me&&l&&!l.querySelector(".ytls-error-message")&&sn(),lt()}}function Uo(t){return!!t&&Number.isFinite(t.start)&&typeof t.comment=="string"&&typeof t.guid=="string"}function Fn(t,o){t.textContent=wt(o),t.dataset.time=String(o),t.href=wo(o,window.location.href)}let $n=null,Hn=null,Lt=!1;function _i(t){if(!t||typeof t.getVideoData!="function"||!t.getVideoData()?.isLive)return!1;if(typeof t.getProgressState=="function"){let a=t.getProgressState(),u=Number(a?.seekableEnd??a?.liveHead??a?.head??a?.duration),y=Number(a?.current??t.getCurrentTime?.());if(Number.isFinite(u)&&Number.isFinite(y))return u-y>2}return!1}function Rn(t,o){if(!Number.isFinite(t))return;let a=On(t);ln(a,o)}function On(t){if(!Number.isFinite(t))return null;let o=te();if(o.length===0)return null;let a=null,u=-1/0;for(let y of o){let d=y.querySelector("a[data-time]")?.dataset.time;if(!d)continue;let h=Number.parseInt(d,10);Number.isFinite(h)&&h<=t&&h>u&&(u=h,a=y)}return a}function ln(t,o=!1){if(!t)return;te().forEach(u=>{u.classList.contains(ce)||u.classList.remove(Oe)}),t.classList.contains(ce)||(t.classList.add(Oe),o&&!kn&&t.scrollIntoView({behavior:"smooth",block:"center"}))}function qi(t){if(!l||l.querySelector(".ytls-error-message")||!Number.isFinite(t)||t===0)return!1;let o=te();if(o.length===0)return!1;let a=!1;return o.forEach(u=>{let y=u.querySelector("a[data-time]"),g=y?.dataset.time;if(!y||!g)return;let d=Number.parseInt(g,10);if(!Number.isFinite(d))return;let h=Math.max(0,d+t);h!==d&&(Fn(y,h),a=!0)}),a?(un(),nt(),Me(),Gn(ye),Et=null,!0):!1}function _o(t,o={}){if(!Number.isFinite(t)||t===0)return!1;if(!qi(t)){if(o.alertOnNoChange){let d=o.failureMessage??"Offset did not change any timestamps.";alert(d)}return!1}let u=o.logLabel??"bulk offset";c(`Timestamps changed: Offset all timestamps by ${t>0?"+":""}${t} seconds (${u})`);let y=j(),g=y?Math.floor(y.getCurrentTime()):0;if(Number.isFinite(g)){let d=On(g);ln(d,!1)}return!0}function qo(t){if(!l||me)return;let o=t.target instanceof HTMLElement?t.target:null;if(o)if(o.dataset.time){t.preventDefault();let a=Number(o.dataset.time);if(Number.isFinite(a)){Lt=!0;let y=j();y&&y.seekTo(a),setTimeout(()=>{Lt=!1},500)}let u=o.closest("li");u&&(te().forEach(y=>{y.classList.contains(ce)||y.classList.remove(Oe)}),u.classList.contains(ce)||(u.classList.add(Oe),u.scrollIntoView({behavior:"smooth",block:"center"})))}else if(o.dataset.increment){t.preventDefault();let u=o.parentElement?.querySelector("a[data-time]");if(!u||!u.dataset.time)return;let y=parseInt(u.dataset.time,10),g=parseInt(o.dataset.increment,10);if("shiftKey"in t&&t.shiftKey&&(g*=Xt),"altKey"in t?t.altKey:!1){_o(g,{logLabel:"Alt adjust"});return}let k=Math.max(0,y+g);c(`Timestamps changed: Timestamp time incremented from ${y} to ${k}`),Fn(u,k),Pn();let E=o.closest("li");if(Hn=k,$n&&clearTimeout($n),Lt=!0,$n=setTimeout(()=>{if(Hn!==null){let I=j();I&&I.seekTo(Hn)}$n=null,Hn=null,setTimeout(()=>{Lt=!1},500)},500),un(),nt(),Me(),E){let I=E.querySelector("input"),L=E.dataset.guid;I&&L&&(Ft(ye,L,k,I.value),Et=L)}}else o.dataset.action==="clear"&&(t.preventDefault(),c("Timestamps changed: All timestamps cleared from UI"),l.textContent="",Pn(),Me(),Nn(),Gn(ye,{allowEmpty:!0}),Et=null,sn())}function cn(t,o="",a=!1,u=null,y=!0){if(!l)return null;let g=Math.max(0,t),d=u??crypto.randomUUID(),h=document.createElement("li"),k=document.createElement("div"),E=document.createElement("span"),I=document.createElement("span"),L=document.createElement("span"),z=document.createElement("a"),Q=document.createElement("span"),F=document.createElement("input"),ne=document.createElement("button");h.dataset.guid=d,k.className="time-row";let ve=document.createElement("div");ve.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",Ze(ve,"Click to toggle indent");let Te=document.createElement("span");Te.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let Le=()=>{let ee=an(F.value);Te.textContent=ee===1?"\u25C0":"\u25B6"},vt=ee=>{ee.stopPropagation();let Y=an(F.value),he=Go(F.value),se=Y===0?1:0,ie="";if(se===1){let ot=te().indexOf(h);ie=Ui(ot)}F.value=`${ie}${he}`,Le(),nt();let be=Number.parseInt(z.dataset.time??"0",10);Ft(ye,d,be,F.value)};ve.onclick=vt,ve.append(Te),h.style.cssText="position:relative;padding-left:20px;",h.addEventListener("mouseenter",()=>{Le(),Te.style.display="inline"}),h.addEventListener("mouseleave",()=>{Te.style.display="none"}),h.addEventListener("mouseleave",()=>{h.dataset.guid===Et&&Ni(h)&&jo()}),F.value=o||"",F.style.cssText="width:100%;margin-top:5px;display:block;",F.type="text",F.setAttribute("inputmode","text"),F.autocapitalize="off",F.autocomplete="off",F.spellcheck=!1,F.addEventListener("focusin",()=>{on=!1}),F.addEventListener("focusout",ee=>{let Y=ee.relatedTarget,he=Date.now()-No<250,se=!!Y&&!!n&&n.contains(Y);!he&&!se&&(on=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(F.focus({preventScroll:!0}),on=!1)},0))}),F.addEventListener("input",ee=>{let Y=ee;if(Y&&(Y.isComposing||Y.inputType==="insertCompositionText"))return;let he=Tt.get(d);he&&clearTimeout(he);let se=setTimeout(()=>{let ie=Number.parseInt(z.dataset.time??"0",10);Ft(ye,d,ie,F.value),Tt.delete(d)},500);Tt.set(d,se)}),F.addEventListener("compositionend",()=>{let ee=Number.parseInt(z.dataset.time??"0",10);setTimeout(()=>{Ft(ye,d,ee,F.value)},50)}),E.textContent="\u2796",E.dataset.increment="-1",E.style.cursor="pointer",E.style.margin="0px",E.addEventListener("mouseenter",()=>{E.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),E.addEventListener("mouseleave",()=>{E.style.textShadow="none"}),L.textContent="\u2795",L.dataset.increment="1",L.style.cursor="pointer",L.style.margin="0px",L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),I.textContent="\u23FA\uFE0F",I.style.cursor="pointer",I.style.margin="0px",Ze(I,"Set to current playback time"),I.addEventListener("mouseenter",()=>{I.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),I.addEventListener("mouseleave",()=>{I.style.textShadow="none"}),I.onclick=()=>{let ee=j(),Y=ee?Math.floor(ee.getCurrentTime()):0;Number.isFinite(Y)&&(c(`Timestamps changedset to current playback time ${Y}`),Fn(z,Y),un(),nt(),Ft(ye,d,Y,F.value),Et=d)},Fn(z,g),Pn(),ne.textContent="\u{1F5D1}\uFE0F",ne.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",ne.addEventListener("mouseenter",()=>{ne.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),ne.addEventListener("mouseleave",()=>{ne.style.textShadow="none"}),ne.onclick=()=>{let ee=null,Y=null,he=null,se=()=>{try{h.removeEventListener("click",Y,!0)}catch{}try{document.removeEventListener("click",Y,!0)}catch{}if(l)try{l.removeEventListener("mouseleave",he)}catch{}ee&&(clearTimeout(ee),ee=null)};if(h.dataset.deleteConfirmed==="true"){c("Timestamps changed: Timestamp deleted");let ie=h.dataset.guid??"",be=Tt.get(ie);be&&(clearTimeout(be),Tt.delete(ie)),se(),h.remove(),Pn(),un(),nt(),Me(),Nn(),ji(ye,ie),Et=null,sn()}else{h.dataset.deleteConfirmed="true",h.classList.add(ce),h.classList.remove(Oe);let ie=()=>{h.dataset.deleteConfirmed="false",h.classList.remove(ce);let be=j(),qe=be?be.getCurrentTime():0,ot=Number.parseInt(h.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(qe)&&Number.isFinite(ot)&&qe>=ot&&h.classList.add(Oe),se()};Y=be=>{be.target!==ne&&ie()},he=()=>{h.dataset.deleteConfirmed==="true"&&ie()},h.addEventListener("click",Y,!0),document.addEventListener("click",Y,!0),l&&l.addEventListener("mouseleave",he),ee=setTimeout(()=>{h.dataset.deleteConfirmed==="true"&&ie(),se()},5e3)}},Q.className="time-diff",Q.style.color="#888",Q.style.marginLeft="5px",k.append(E,I,L,z,Q,ne),h.append(ve,k,F);let ct=Number.parseInt(z.dataset.time??"0",10);if(y){uo();let ee=!1,Y=te();for(let he=0;he<Y.length;he++){let se=Y[he],be=se.querySelector("a[data-time]")?.dataset.time;if(!be)continue;let qe=Number.parseInt(be,10);if(Number.isFinite(qe)&&ct<qe){l.insertBefore(h,se),ee=!0;let ot=Y[he-1];if(ot){let Ut=ot.querySelector("a[data-time]")?.dataset.time;if(Ut){let ut=Number.parseInt(Ut,10);Number.isFinite(ut)&&(Q.textContent=wt(ct-ut))}}else Q.textContent="";let Gt=se.querySelector(".time-diff");Gt&&(Gt.textContent=wt(qe-ct));break}}if(!ee&&(l.appendChild(h),Y.length>0)){let ie=Y[Y.length-1].querySelector("a[data-time]")?.dataset.time;if(ie){let be=Number.parseInt(ie,10);Number.isFinite(be)&&(Q.textContent=wt(ct-be))}}h.scrollIntoView({behavior:"smooth",block:"center"}),Nn(),nt(),Me(),a||(Ft(ye,d,g,o),Et=d,ln(h,!1))}else F.__ytls_li=h;return F}function un(){if(!l||l.querySelector(".ytls-error-message"))return;let t=te();t.forEach((o,a)=>{let u=o.querySelector(".time-diff");if(!u)return;let g=o.querySelector("a[data-time]")?.dataset.time;if(!g){u.textContent="";return}let d=Number.parseInt(g,10);if(!Number.isFinite(d)){u.textContent="";return}if(a===0){u.textContent="";return}let E=t[a-1].querySelector("a[data-time]")?.dataset.time;if(!E){u.textContent="";return}let I=Number.parseInt(E,10);if(!Number.isFinite(I)){u.textContent="";return}let L=d-I,z=L<0?"-":"";u.textContent=` ${z}${wt(Math.abs(L))}`})}function jo(){if(!l||l.querySelector(".ytls-error-message")||me)return;let t=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)){let d=document.activeElement,k=d.closest("li")?.dataset.guid;if(k){let E=d.selectionStart??d.value.length,I=d.selectionEnd??E,L=d.scrollLeft;t={guid:k,start:E,end:I,scroll:L}}}let o=te();if(o.length===0)return;let a=o.map(d=>d.dataset.guid),u=o.map(d=>{let h=d.querySelector("a[data-time]"),k=h?.dataset.time;if(!h||!k)return null;let E=Number.parseInt(k,10);if(!Number.isFinite(E))return null;let I=d.dataset.guid??"";return{time:E,guid:I,element:d}}).filter(d=>d!==null).sort((d,h)=>{let k=d.time-h.time;return k!==0?k:d.guid.localeCompare(h.guid)}),y=u.map(d=>d.guid),g=a.length!==y.length||a.some((d,h)=>d!==y[h]);for(;l.firstChild;)l.removeChild(l.firstChild);if(u.forEach(d=>{l.appendChild(d.element)}),un(),nt(),Me(),t){let h=te().find(k=>k.dataset.guid===t.guid)?.querySelector("input");if(h)try{h.focus({preventScroll:!0})}catch{}}g&&(c("Timestamps changed: Timestamps sorted"),Gn(ye))}function Nn(){if(!l||!n||!v||!S)return;let t=te().length;typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea();let o=n.getBoundingClientRect(),a=v.getBoundingClientRect(),u=S.getBoundingClientRect(),y=Math.max(0,o.height-(a.height+u.height));t===0?(sn(),l.style.overflowY="hidden"):l.style.overflowY=l.scrollHeight>y?"auto":"hidden"}function Me(){if(!l)return;let t=Ge(),o=document.querySelector(".ytp-progress-bar"),a=j(),u=a?a.getVideoData():null,y=!!u&&!!u.isLive;if(!t||!o||!isFinite(t.duration)||y)return;Wo(),te().map(d=>{let h=d.querySelector("a[data-time]"),k=h?.dataset.time;if(!h||!k)return null;let E=Number.parseInt(k,10);if(!Number.isFinite(E))return null;let L=d.querySelector("input")?.value??"",z=d.dataset.guid??crypto.randomUUID();return d.dataset.guid||(d.dataset.guid=z),{start:E,comment:L,guid:z}}).filter(Uo).forEach(d=>{if(!Number.isFinite(d.start))return;let h=document.createElement("div");h.className="ytls-marker",h.style.position="absolute",h.style.height="100%",h.style.width="2px",h.style.backgroundColor="#ff0000",h.style.cursor="pointer",h.style.left=d.start/t.duration*100+"%",h.dataset.time=String(d.start),h.addEventListener("click",()=>{let k=j();k&&k.seekTo(d.start)}),o.appendChild(h)})}function Gn(t,o={}){if(!l||l.querySelector(".ytls-error-message")||!t)return;if(me){c("Save blocked: timestamps are currently loading");return}nt();let a=lo().sort((u,y)=>u.start-y.start);if(a.length===0&&!o.allowEmpty){c("Save skipped: no timestamps to save");return}Zo(t,a).then(()=>c(`Successfully saved ${a.length} timestamps for ${t} to IndexedDB`)).catch(u=>c(`Failed to save timestamps for ${t} to IndexedDB:`,u,"error")),Jt({type:"timestamps_updated",videoId:t,action:"saved"})}function Ft(t,o,a,u){if(!t||me)return;let y={guid:o,start:a,comment:u};c(`Saving timestamp: guid=${o}, start=${a}, comment="${u}"`),nr(t,y).catch(g=>c(`Failed to save timestamp ${o}:`,g,"error")),Jt({type:"timestamps_updated",videoId:t,action:"saved"})}function ji(t,o){!t||me||(c(`Deleting timestamp: guid=${o}`),or(t,o).catch(a=>c(`Failed to delete timestamp ${o}:`,a,"error")),Jt({type:"timestamps_updated",videoId:t,action:"saved"}))}async function Vo(t){if(!l||l.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let o=ye;if(!o)return;c(`Exporting timestamps for video ID: ${o}`);let a=lo(),u=Math.max(kt(),0),y=mn();if(t==="json"){let g=new Blob([JSON.stringify(a,null,2)],{type:"application/json"}),d=URL.createObjectURL(g),h=document.createElement("a");h.href=d,h.download=`timestamps-${o}-${y}.json`,h.click(),URL.revokeObjectURL(d)}else if(t==="text"){let g=a.map(E=>{let I=wt(E.start,u),L=`${E.comment} <!-- guid:${E.guid} -->`.trimStart();return`${I} ${L}`}).join(`
`),d=new Blob([g],{type:"text/plain"}),h=URL.createObjectURL(d),k=document.createElement("a");k.href=h,k.download=`timestamps-${o}-${y}.txt`,k.click(),URL.revokeObjectURL(h)}}function po(t){if(!n||!l){c("Timekeeper error:",t,"error");return}St();let o=document.createElement("li");o.textContent=t,o.classList.add("ytls-error-message"),o.style.color="#ff6b6b",o.style.fontWeight="bold",o.style.padding="8px",o.style.background="rgba(255, 0, 0, 0.1)",l.appendChild(o),Me()}function Wo(){document.querySelectorAll(".ytls-marker").forEach(t=>t.remove())}function $t(){if(!n||!document.body.contains(n))return;let t=n.getBoundingClientRect(),o=document.documentElement.clientWidth,a=document.documentElement.clientHeight,u=t.width,y=t.height;if(t.left<0&&(n.style.left="0",n.style.right="auto"),t.right>o){let g=Math.max(0,o-u);n.style.left=`${g}px`,n.style.right="auto"}if(t.top<0&&(n.style.top="0",n.style.bottom="auto"),t.bottom>a){let g=Math.max(0,a-y);n.style.top=`${g}px`,n.style.bottom="auto"}}function Vi(){if(In&&(document.removeEventListener("mousemove",In),In=null),Cn&&(document.removeEventListener("mouseup",Cn),Cn=null),en&&(document.removeEventListener("keydown",en),en=null),Mn&&(window.removeEventListener("resize",Mn),Mn=null),tn&&(document.removeEventListener("pointerdown",tn,!0),tn=null),nn&&(document.removeEventListener("pointerup",nn,!0),nn=null),et){try{et.disconnect()}catch{}et=null}if(tt){try{tt.disconnect()}catch{}tt=null}let t=Ge();t&&(Dn&&(t.removeEventListener("timeupdate",Dn),Dn=null),An&&(t.removeEventListener("pause",An),An=null),Bn&&(t.removeEventListener("play",Bn),Bn=null),zn&&(t.removeEventListener("seeking",zn),zn=null))}function Wi(){Wo(),Tt.forEach(o=>clearTimeout(o)),Tt.clear(),Qt&&(clearTimeout(Qt),Qt=null),le&&(clearInterval(le),le=null),Qe&&(clearTimeout(Qe),Qe=null),Vi();try{Fe.close()}catch{}if(P&&P.parentNode===document.body&&document.body.removeChild(P),P=null,Sn=null,kn=!1,ye=null,et){try{et.disconnect()}catch{}et=null}if(tt){try{tt.disconnect()}catch{}tt=null}n&&n.parentNode&&n.remove();let t=document.getElementById("ytls-header-button");t&&t.parentNode&&t.remove(),yt=null,Ln=!1,$e=null,St(),n=null,v=null,l=null,S=null,w=null,T=null,D=null,Pe=null}async function Yi(){let t=fo();if(!t)return Pe=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let o=await Tn();if(!ue(o)){let a=ht(o),u=a.length?` Missing methods: ${a.join(", ")}.`:"",y=o?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return Pe=null,{ok:!1,message:`${y}${u} Try refreshing once playback is ready.`}}return Pe=o,{ok:!0,player:o,videoId:t}}async function Yo(){if(!n||!l)return;let t=l.scrollTop,o=!0,a=()=>{if(!l||!o)return;let u=Math.max(0,l.scrollHeight-l.clientHeight);l.scrollTop=Math.min(t,u)};try{let u=await Yi();if(!u.ok){po(u.message),St(),Me();return}let{videoId:y}=u,g=[];try{let d=await ir(y);d?(g=d.map(h=>({...h,guid:h.guid||crypto.randomUUID()})),c(`Loaded ${g.length} timestamps from IndexedDB for ${y}`)):c(`No timestamps found in IndexedDB for ${y}`)}catch(d){c(`Failed to load timestamps from IndexedDB for ${y}:`,d,"error"),po("Failed to load timestamps from IndexedDB. Try refreshing the page."),Me();return}if(g.length>0){g.sort((I,L)=>I.start-L.start),St(),uo();let d=document.createDocumentFragment();g.forEach(I=>{let z=cn(I.start,I.comment,!0,I.guid,!1).__ytls_li;z&&d.appendChild(z)}),n&&n.classList.contains("ytls-zoom-in")&&fe!=null?(c("Deferring timestamp DOM append until show animation completes"),gt=d,st||(st=new Promise(I=>{Ue=I})),await st):l&&(l.appendChild(d),nt(),Me(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let k=j(),E=k?Math.floor(k.getCurrentTime()):kt();Number.isFinite(E)&&(Rn(E,!1),o=!1)}else St(),co("No timestamps for this video"),Me(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(u){c("Unexpected error while loading timestamps:",u,"error"),po("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{st&&await st,requestAnimationFrame(a),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),l&&!l.querySelector(".ytls-error-message")&&sn()}}function fo(){let o=new URLSearchParams(location.search).get("v");if(o)return o;let a=document.querySelector('meta[itemprop="identifier"]');return a?.content?a.content:null}function Ki(){let t=Ge();if(!t)return;let o=()=>{if(!l)return;let d=j(),h=d?Math.floor(d.getCurrentTime()):0;if(!Number.isFinite(h))return;let k=On(h);ln(k,!1)},a=d=>{try{let h=new URL(window.location.href);d!==null&&Number.isFinite(d)?h.searchParams.set("t",`${Math.floor(d)}s`):h.searchParams.delete("t"),window.history.replaceState({},"",h.toString())}catch{}},u=()=>{let d=j(),h=d?Math.floor(d.getCurrentTime()):0;Number.isFinite(h)&&a(h)},y=()=>{a(null)},g=()=>{let d=Ge();if(!d)return;let h=j(),k=h?Math.floor(h.getCurrentTime()):0;if(!Number.isFinite(k))return;d.paused&&a(k);let E=On(k);ln(E,!0)};Dn=o,An=u,Bn=y,zn=g,t.addEventListener("timeupdate",o),t.addEventListener("pause",u),t.addEventListener("play",y),t.addEventListener("seeking",g)}let Zi="ytls-timestamps-db",Ji=3,Ht="timestamps",_e="timestamps_v2",Un="settings",Rt=null,Ot=null;function Nt(){if(Rt)try{if(Rt.objectStoreNames.length>=0)return Promise.resolve(Rt)}catch(t){c("IndexedDB connection is no longer usable:",t,"warn"),Rt=null}return Ot||(Ot=tr().then(t=>(Rt=t,Ot=null,t.onclose=()=>{c("IndexedDB connection closed unexpectedly","warn"),Rt=null},t.onerror=o=>{c("IndexedDB connection error:",o,"error")},t)).catch(t=>{throw Ot=null,t}),Ot)}async function Ko(){let t={},o=await Jo(_e),a=new Map;for(let g of o){let d=g;a.has(d.video_id)||a.set(d.video_id,[]),a.get(d.video_id).push({guid:d.guid,start:d.start,comment:d.comment})}for(let[g,d]of a)t[`ytls-${g}`]={video_id:g,timestamps:d.sort((h,k)=>h.start-k.start)};return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:a.size,totalTimestamps:o.length}}async function Xi(){try{let{json:t,filename:o,totalVideos:a,totalTimestamps:u}=await Ko(),y=new Blob([t],{type:"application/json"}),g=URL.createObjectURL(y),d=document.createElement("a");d.href=g,d.download=o,d.click(),URL.revokeObjectURL(g),c(`Exported ${a} videos with ${u} timestamps`)}catch(t){throw c("Failed to export data:",t,"error"),t}}async function Qi(){let t=await Jo(_e);if(!Array.isArray(t)||t.length===0){let E=`Tag,Timestamp,URL
`,I=`timestamps-${mn()}.csv`;return{csv:E,filename:I,totalVideos:0,totalTimestamps:0}}let o=new Map;for(let E of t)o.has(E.video_id)||o.set(E.video_id,[]),o.get(E.video_id).push({start:E.start,comment:E.comment});let a=[];a.push("Tag,Timestamp,URL");let u=0,y=E=>`"${String(E).replace(/"/g,'""')}"`,g=E=>{let I=Math.floor(E/3600),L=Math.floor(E%3600/60),z=String(E%60).padStart(2,"0");return`${String(I).padStart(2,"0")}:${String(L).padStart(2,"0")}:${z}`},d=Array.from(o.keys()).sort();for(let E of d){let I=o.get(E).sort((L,z)=>L.start-z.start);for(let L of I){let z=L.comment,Q=g(L.start),F=wo(L.start,`https://www.youtube.com/watch?v=${E}`);a.push([y(z),y(Q),y(F)].join(",")),u++}}let h=a.join(`
`),k=`timestamps-${mn()}.csv`;return{csv:h,filename:k,totalVideos:o.size,totalTimestamps:u}}async function er(){try{let{csv:t,filename:o,totalVideos:a,totalTimestamps:u}=await Qi(),y=new Blob([t],{type:"text/csv;charset=utf-8;"}),g=URL.createObjectURL(y),d=document.createElement("a");d.href=g,d.download=o,d.click(),URL.revokeObjectURL(g),c(`Exported ${a} videos with ${u} timestamps (CSV)`)}catch(t){throw c("Failed to export CSV data:",t,"error"),t}}function tr(){return new Promise((t,o)=>{let a=indexedDB.open(Zi,Ji);a.onupgradeneeded=u=>{let y=u.target.result,g=u.oldVersion,d=u.target.transaction;if(g<1&&y.createObjectStore(Ht,{keyPath:"video_id"}),g<2&&!y.objectStoreNames.contains(Un)&&y.createObjectStore(Un,{keyPath:"key"}),g<3){if(y.objectStoreNames.contains(Ht)){c("Exporting backup before v2 migration...");let E=d.objectStore(Ht).getAll();E.onsuccess=()=>{let I=E.result;if(I.length>0)try{let L={},z=0;I.forEach(ve=>{if(Array.isArray(ve.timestamps)&&ve.timestamps.length>0){let Te=ve.timestamps.map(Le=>({guid:Le.guid||crypto.randomUUID(),start:Le.start,comment:Le.comment}));L[`ytls-${ve.video_id}`]={video_id:ve.video_id,timestamps:Te.sort((Le,vt)=>Le.start-vt.start)},z+=Te.length}});let Q=new Blob([JSON.stringify(L,null,2)],{type:"application/json"}),F=URL.createObjectURL(Q),ne=document.createElement("a");ne.href=F,ne.download=`timekeeper-data-${mn()}.json`,ne.click(),URL.revokeObjectURL(F),c(`Pre-migration backup exported: ${I.length} videos, ${z} timestamps`)}catch(L){c("Failed to export pre-migration backup:",L,"error")}}}let h=y.createObjectStore(_e,{keyPath:"guid"});if(h.createIndex("video_id","video_id",{unique:!1}),h.createIndex("video_start",["video_id","start"],{unique:!1}),y.objectStoreNames.contains(Ht)){let E=d.objectStore(Ht).getAll();E.onsuccess=()=>{let I=E.result;if(I.length>0){let L=0;I.forEach(z=>{Array.isArray(z.timestamps)&&z.timestamps.length>0&&z.timestamps.forEach(Q=>{h.put({guid:Q.guid||crypto.randomUUID(),video_id:z.video_id,start:Q.start,comment:Q.comment}),L++})}),c(`Migrated ${L} timestamps from ${I.length} videos to v2 store`)}},y.deleteObjectStore(Ht),c("Deleted old timestamps store after migration to v2")}}},a.onsuccess=u=>{t(u.target.result)},a.onerror=u=>{let y=u.target.error;o(y??new Error("Failed to open IndexedDB"))}})}function ho(t,o,a){return Nt().then(u=>new Promise((y,g)=>{let d;try{d=u.transaction(t,o)}catch(E){g(new Error(`Failed to create transaction for ${t}: ${E}`));return}let h=d.objectStore(t),k;try{k=a(h)}catch(E){g(new Error(`Failed to execute operation on ${t}: ${E}`));return}k&&(k.onsuccess=()=>y(k.result),k.onerror=()=>g(k.error??new Error(`IndexedDB ${o} operation failed`))),d.oncomplete=()=>{k||y(void 0)},d.onerror=()=>g(d.error??new Error("IndexedDB transaction failed")),d.onabort=()=>g(d.error??new Error("IndexedDB transaction aborted"))}))}function Zo(t,o){return Nt().then(a=>new Promise((u,y)=>{let g;try{g=a.transaction([_e],"readwrite")}catch(E){y(new Error(`Failed to create transaction: ${E}`));return}let d=g.objectStore(_e),k=d.index("video_id").getAll(IDBKeyRange.only(t));k.onsuccess=()=>{try{let E=k.result,I=new Set(o.map(L=>L.guid));E.forEach(L=>{I.has(L.guid)||d.delete(L.guid)}),o.forEach(L=>{d.put({guid:L.guid,video_id:t,start:L.start,comment:L.comment})})}catch(E){c("Error during save operation:",E,"error")}},k.onerror=()=>{y(k.error??new Error("Failed to get existing records"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to save to IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during save"))}))}function nr(t,o){return Nt().then(a=>new Promise((u,y)=>{let g;try{g=a.transaction([_e],"readwrite")}catch(k){y(new Error(`Failed to create transaction: ${k}`));return}let h=g.objectStore(_e).put({guid:o.guid,video_id:t,start:o.start,comment:o.comment});h.onerror=()=>{y(h.error??new Error("Failed to put timestamp"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to save single timestamp to IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during single timestamp save"))}))}function or(t,o){return c(`Deleting timestamp ${o} for video ${t}`),Nt().then(a=>new Promise((u,y)=>{let g;try{g=a.transaction([_e],"readwrite")}catch(k){y(new Error(`Failed to create transaction: ${k}`));return}let h=g.objectStore(_e).delete(o);h.onerror=()=>{y(h.error??new Error("Failed to delete timestamp"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to delete single timestamp from IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during timestamp deletion"))}))}function ir(t){return Nt().then(o=>new Promise(a=>{let u;try{u=o.transaction([_e],"readonly")}catch(h){c("Failed to create read transaction:",h,"warn"),a(null);return}let d=u.objectStore(_e).index("video_id").getAll(IDBKeyRange.only(t));d.onsuccess=()=>{let h=d.result;if(h.length>0){let k=h.map(E=>({guid:E.guid,start:E.start,comment:E.comment})).sort((E,I)=>E.start-I.start);a(k)}else a(null)},d.onerror=()=>{c("Failed to load timestamps:",d.error,"warn"),a(null)},u.onabort=()=>{c("Transaction aborted during load:",u.error,"warn"),a(null)}}))}function rr(t){return Nt().then(o=>new Promise((a,u)=>{let y;try{y=o.transaction([_e],"readwrite")}catch(k){u(new Error(`Failed to create transaction: ${k}`));return}let g=y.objectStore(_e),h=g.index("video_id").getAll(IDBKeyRange.only(t));h.onsuccess=()=>{try{h.result.forEach(E=>{g.delete(E.guid)})}catch(k){c("Error during remove operation:",k,"error")}},h.onerror=()=>{u(h.error??new Error("Failed to get records for removal"))},y.oncomplete=()=>a(),y.onerror=()=>u(y.error??new Error("Failed to remove timestamps")),y.onabort=()=>u(y.error??new Error("Transaction aborted during timestamp removal"))}))}function Jo(t){return ho(t,"readonly",o=>o.getAll()).then(o=>Array.isArray(o)?o:[])}function _n(t,o){ho(Un,"readwrite",a=>{a.put({key:t,value:o})}).catch(a=>{c(`Failed to save setting '${t}' to IndexedDB:`,a,"error")})}function go(t){return ho(Un,"readonly",o=>o.get(t)).then(o=>o?.value).catch(o=>{c(`Failed to load setting '${t}' from IndexedDB:`,o,"error")})}function Xo(){if(!n)return;let t=n.style.display!=="none";_n("uiVisible",t)}function lt(t){let o=typeof t=="boolean"?t:!!n&&n.style.display!=="none",a=document.getElementById("ytls-header-button");a instanceof HTMLButtonElement&&a.setAttribute("aria-pressed",String(o)),yt&&!Ln&&yt.src!==Se&&(yt.src=Se)}function ar(){n&&go("uiVisible").then(t=>{let o=t;typeof o=="boolean"?(o?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",lt(o)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),lt(!0))}).catch(t=>{c("Failed to load UI visibility state:",t,"error"),n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),lt(!0)})}function yo(t){if(!n){c("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(c("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(y=>{y!==n&&y.remove()}),document.body.appendChild(n));let o=document.querySelectorAll("#ytls-pane");o.length>1&&(c(`ERROR: Multiple panes detected in togglePaneVisibility (${o.length}), cleaning up`),o.forEach(y=>{y!==n&&y.remove()})),Qe&&(clearTimeout(Qe),Qe=null);let a=n.style.display==="none";(typeof t=="boolean"?t:a)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),lt(!0),Xo(),ae(),fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{R(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),de(),U(!0),fe=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),lt(!1),_())}function Qo(t){if(!l){c("UI is not initialized; cannot import timestamps.","warn");return}let o=!1;try{let a=JSON.parse(t),u=null;if(Array.isArray(a))u=a;else if(typeof a=="object"&&a!==null){let y=ye;if(y){let g=`timekeeper-${y}`;a[g]&&Array.isArray(a[g].timestamps)&&(u=a[g].timestamps,c(`Found timestamps for current video (${y}) in export format`,"info"))}if(!u){let g=Object.keys(a).filter(d=>d.startsWith("ytls-"));if(g.length===1&&Array.isArray(a[g[0]].timestamps)){u=a[g[0]].timestamps;let d=a[g[0]].video_id;c(`Found timestamps for video ${d} in export format`,"info")}}}u&&Array.isArray(u)?u.every(g=>typeof g.start=="number"&&typeof g.comment=="string")?(u.forEach(g=>{if(g.guid){let d=te().find(h=>h.dataset.guid===g.guid);if(d){let h=d.querySelector("input");h&&(h.value=g.comment)}else cn(g.start,g.comment,!1,g.guid)}else cn(g.start,g.comment,!1,crypto.randomUUID())}),o=!0):c("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):c("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!o){let a=t.split(`
`).map(u=>u.trim()).filter(u=>u);if(a.length>0){let u=!1;a.forEach(y=>{let g=y.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(g){u=!0;let d=parseInt(g[1])||0,h=parseInt(g[2]),k=parseInt(g[3]),E=d*3600+h*60+k,I=g[4]?g[4].trim():"",L=null,z=I,Q=I.match(/<!--\s*guid:([^>]+?)\s*-->/);Q&&(L=Q[1].trim(),z=I.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let F;if(L&&(F=te().find(ne=>ne.dataset.guid===L)),!F&&!L&&(F=te().find(ne=>{if(ne.dataset.guid)return!1;let Te=ne.querySelector("a[data-time]")?.dataset.time;if(!Te)return!1;let Le=Number.parseInt(Te,10);return Number.isFinite(Le)&&Le===E})),F){let ne=F.querySelector("input");ne&&(ne.value=z)}else cn(E,z,!1,L||crypto.randomUUID())}}),u&&(o=!0)}}o?(c("Timestamps changed: Imported timestamps from file/clipboard"),nt(),Gn(ye),Me(),Nn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function sr(){if(so){c("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){so=!0;try{let a=function(){if(me||Lt)return;let f=Ge(),p=j();if(!f&&!p)return;let b=p?p.getCurrentTime():0,x=Number.isFinite(b)?Math.max(0,Math.floor(b)):Math.max(0,kt()),C=Math.floor(x/3600),B=Math.floor(x/60)%60,A=x%60,{isLive:N}=p?p.getVideoData()||{isLive:!1}:{isLive:!1},$=p?_i(p):!1,K=l?te().map(G=>{let we=G.querySelector("a[data-time]");return we?parseFloat(we.getAttribute("data-time")??"0"):0}):[],De="";if(K.length>0)if(N){let G=Math.max(1,x/60),we=K.filter(Ae=>Ae<=x);if(we.length>0){let Ae=(we.length/G).toFixed(2);parseFloat(Ae)>0&&(De=` (${Ae}/min)`)}}else{let G=p?p.getDuration():0,we=Number.isFinite(G)&&G>0?G:f&&Number.isFinite(f.duration)&&f.duration>0?f.duration:0,Ae=Math.max(1,we/60),dt=(K.length/Ae).toFixed(1);parseFloat(dt)>0&&(De=` (${dt}/min)`)}if(w.textContent=`\u23F3${C?C+":"+String(B).padStart(2,"0"):B}:${String(A).padStart(2,"0")}${De}`,w.style.color=$?"#ff4d4f":"",N){w.style.cursor="pointer",w.onclick=()=>{Lt=!0;let G=j();G&&G.seekToLiveHead(),setTimeout(()=>{Lt=!1},500)};try{To(w)}catch{}Ze(w,"Skip to live")}else{w.style.cursor="default",w.onclick=null;try{To(w)}catch{}}K.length>0&&Rn(x,!1)},F=function(f,p,b){let x=document.createElement("button");return x.textContent=f,Ze(x,p),x.classList.add("ytls-settings-modal-button"),x.onclick=b,x},ne=function(f="general"){if(P&&P.parentNode===document.body){let Ie=document.getElementById("ytls-save-modal"),bt=document.getElementById("ytls-load-modal"),mt=document.getElementById("ytls-delete-all-modal");Ie&&document.body.contains(Ie)&&document.body.removeChild(Ie),bt&&document.body.contains(bt)&&document.body.removeChild(bt),mt&&document.body.contains(mt)&&document.body.removeChild(mt),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Te,!0),document.removeEventListener("keydown",ve)},300);return}P=document.createElement("div"),P.id="ytls-settings-modal",P.classList.remove("ytls-fade-out"),P.classList.add("ytls-fade-in");let p=document.createElement("div");p.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let x=document.createElement("button");x.className="ytls-modal-close-button",x.textContent="\u2715",x.onclick=()=>{if(P&&P.parentNode===document.body){let Ie=document.getElementById("ytls-save-modal"),bt=document.getElementById("ytls-load-modal"),mt=document.getElementById("ytls-delete-all-modal");Ie&&document.body.contains(Ie)&&document.body.removeChild(Ie),bt&&document.body.contains(bt)&&document.body.removeChild(bt),mt&&document.body.contains(mt)&&document.body.removeChild(mt),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Te,!0),document.removeEventListener("keydown",ve)},300)}};let C=document.createElement("div");C.id="ytls-settings-content";let B=document.createElement("h3");B.className="ytls-section-heading",B.textContent="General",B.style.display="none";let A=document.createElement("div"),N=document.createElement("div");N.className="ytls-button-grid";function $(Ie){A.style.display=Ie==="general"?"block":"none",N.style.display=Ie==="drive"?"block":"none",K.classList.toggle("active",Ie==="general"),G.classList.toggle("active",Ie==="drive"),B.textContent=Ie==="general"?"General":"Google Drive"}let K=document.createElement("button");K.textContent="\u{1F6E0}\uFE0F";let De=document.createElement("span");De.className="ytls-tab-text",De.textContent=" General",K.appendChild(De),Ze(K,"General settings"),K.classList.add("ytls-settings-modal-button"),K.onclick=()=>$("general");let G=document.createElement("button");G.textContent="\u2601\uFE0F";let we=document.createElement("span");we.className="ytls-tab-text",we.textContent=" Backup",G.appendChild(we),Ze(G,"Google Drive sign-in and backup"),G.classList.add("ytls-settings-modal-button"),G.onclick=async()=>{O.isSignedIn&&await Fi(),$("drive")},b.appendChild(K),b.appendChild(G),p.appendChild(b),p.appendChild(x),P.appendChild(p),A.className="ytls-button-grid",A.appendChild(F("\u{1F4BE} Save","Save As...",Le.onclick)),A.appendChild(F("\u{1F4C2} Load","Load",vt.onclick)),A.appendChild(F("\u{1F4E4} Export All","Export All Data",ct.onclick)),A.appendChild(F("\u{1F4E5} Import All","Import All Data",ee.onclick)),A.appendChild(F("\u{1F4C4} Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await er()}catch{alert("Failed to export CSV: Could not read from database.")}}));let Ae=F(O.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",O.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{O.isSignedIn?await Pi():await Bi(),Ae.textContent=O.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",Ze(Ae,O.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),typeof re=="function"&&re()});N.appendChild(Ae);let dt=F(rt?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await Ri(),dt.textContent=rt?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off",typeof re=="function"&&re()});N.appendChild(dt);let Ct=F(`\u23F1\uFE0F Backup Interval: ${Ye}min`,"Set periodic backup interval (minutes)",async()=>{await Oi(),Ct.textContent=`\u23F1\uFE0F Backup Interval: ${Ye}min`,typeof re=="function"&&re()});N.appendChild(Ct),N.appendChild(F("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await wn(!1),typeof re=="function"&&re()}));let je=document.createElement("div");je.style.marginTop="15px",je.style.paddingTop="10px",je.style.borderTop="1px solid #555",je.style.fontSize="12px",je.style.color="#aaa";let Mt=document.createElement("div");Mt.style.marginBottom="8px",Mt.style.fontWeight="bold",je.appendChild(Mt),Mi(Mt);let bo=document.createElement("div");bo.style.marginBottom="8px",Ii(bo),je.appendChild(bo);let ii=document.createElement("div");Ci(ii),je.appendChild(ii),N.appendChild(je),Re(),xn(),re(),C.appendChild(B),C.appendChild(A),C.appendChild(N),$(f),P.appendChild(C),document.body.appendChild(P),requestAnimationFrame(()=>{let Ie=P.getBoundingClientRect(),mt=(window.innerHeight-Ie.height)/2;P.style.top=`${Math.max(20,mt)}px`,P.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Te,!0),document.addEventListener("keydown",ve)},0)},ve=function(f){if(f.key==="Escape"&&P&&P.parentNode===document.body){let p=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");if(p||b||x)return;f.preventDefault(),p&&document.body.contains(p)&&document.body.removeChild(p),b&&document.body.contains(b)&&document.body.removeChild(b),x&&document.body.contains(x)&&document.body.removeChild(x),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Te,!0),document.removeEventListener("keydown",ve)},300)}},Te=function(f){if(Sn&&Sn.contains(f.target))return;let p=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");p&&p.contains(f.target)||b&&b.contains(f.target)||x&&x.contains(f.target)||P&&P.contains(f.target)||(p&&document.body.contains(p)&&document.body.removeChild(p),b&&document.body.contains(b)&&document.body.removeChild(b),x&&document.body.contains(x)&&document.body.removeChild(x),P&&P.parentNode===document.body&&(P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Te,!0),document.removeEventListener("keydown",ve)},300)))},Y=function(){n&&(c("Loading window position from IndexedDB"),go("windowPosition").then(f=>{if(f&&typeof f.x=="number"&&typeof f.y=="number"){let b=f;n.style.left=`${b.x}px`,n.style.top=`${b.y}px`,n.style.right="auto",n.style.bottom="auto",typeof b.width=="number"&&b.width>0?n.style.width=`${b.width}px`:(n.style.width=`${zt}px`,c(`No stored window width found, using default width ${zt}px`)),typeof b.height=="number"&&b.height>0?n.style.height=`${b.height}px`:(n.style.height=`${xt}px`,c(`No stored window height found, using default height ${xt}px`));let x=X();oe(x,b.x,b.y),c("Restored window position from IndexedDB:",$e)}else c("No window position found in IndexedDB, applying default size and leaving default position"),n.style.width=`${zt}px`,n.style.height=`${xt}px`,$e=null;$t();let p=X();p&&(p.width||p.height)&&oe(p),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(f=>{c("failed to load pane position from IndexedDB:",f,"warn"),$t();let p=X();p&&(p.width||p.height)&&($e={x:Math.max(0,Math.round(p.left)),y:0,width:Math.round(p.width),height:Math.round(p.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},he=function(){if(!n)return;let f=X();if(!f)return;let p={x:Math.max(0,Math.round(f.left)),y:Math.max(0,Math.round(f.top)),width:Math.round(f.width),height:Math.round(f.height)};if($e&&$e.x===p.x&&$e.y===p.y&&$e.width===p.width&&$e.height===p.height){c("Skipping window position save; position and size unchanged");return}$e={...p},c(`Saving window position and size to IndexedDB: x=${p.x}, y=${p.y}, width=${p.width}, height=${p.height}`),_n("windowPosition",p),Jt({type:"window_position_updated",position:p,timestamp:Date.now()})},Wn=function(f,p){f.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",he(),dn())}),f.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),ut=!0,It=p,ni=b.clientX,oi=b.clientY;let x=n.getBoundingClientRect();_t=x.width,qt=x.height,jn=x.left,Vn=x.top,p==="top-left"||p==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},dn=function(){if(n&&v&&S&&l){let f=n.getBoundingClientRect(),p=v.getBoundingClientRect(),b=S.getBoundingClientRect(),x=f.height-(p.height+b.height);l.style.maxHeight=x>0?x+"px":"0px",l.style.overflowY=x>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(f=>f.remove()),n=document.createElement("div"),v=document.createElement("div"),l=document.createElement("ul"),S=document.createElement("div"),w=document.createElement("span"),T=document.createElement("style"),D=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=f=>{f.stopPropagation(),ne("drive")},l.addEventListener("mouseenter",()=>{kn=!0,on=!1}),l.addEventListener("mouseleave",()=>{if(kn=!1,on)return;let f=j(),p=f?Math.floor(f.getCurrentTime()):kt();Rn(p,!1);let b=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)&&(b=document.activeElement.closest("li")?.dataset.guid??null),jo(),b){let C=te().find(B=>B.dataset.guid===b)?.querySelector("input");if(C)try{C.focus({preventScroll:!0})}catch{}}}),n.id="ytls-pane",v.id="ytls-pane-header",v.addEventListener("dblclick",f=>{let p=f.target instanceof HTMLElement?f.target:null;p&&(p.closest("a")||p.closest("button")||p.closest("#ytls-current-time")||p.closest(".ytls-version-display")||p.closest(".ytls-backup-indicator"))||(f.preventDefault(),yo(!1))});let t=GM_info.script.version;D.textContent=`v${t}`,D.classList.add("ytls-version-display");let o=document.createElement("span");o.style.display="inline-flex",o.style.alignItems="center",o.style.gap="6px",o.appendChild(D),o.appendChild(M),w.id="ytls-current-time",w.textContent="\u23F3",w.onclick=null,w.style.cursor="default",a(),le&&clearInterval(le),le=setInterval(a,1e3),S.id="ytls-buttons";let u=(f,p)=>()=>{f.classList.remove("ytls-fade-in"),f.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(f)&&document.body.removeChild(f),p&&p()},300)},y=f=>p=>{p.key==="Escape"&&(p.preventDefault(),p.stopPropagation(),f())},g=f=>{setTimeout(()=>{document.addEventListener("keydown",f)},0)},d=(f,p)=>b=>{f.contains(b.target)||p()},h=f=>{setTimeout(()=>{document.addEventListener("click",f,!0)},0)},z=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!l||l.querySelector(".ytls-error-message")||me)return;let f=typeof Pt<"u"?Pt:0,p=j(),b=p?Math.floor(p.getCurrentTime()+f):0;if(!Number.isFinite(b))return;let x=cn(b,"");x&&x.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>ne()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(f){if(!l||l.querySelector(".ytls-error-message")||me){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let p=lo(),b=Math.max(kt(),0);if(p.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let x=f.ctrlKey,C=p.map(B=>{let A=wt(B.start,b);return x?`${A} ${B.comment} <!-- guid:${B.guid} -->`.trimStart():`${A} ${B.comment}`}).join(`
`);navigator.clipboard.writeText(C).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(B=>{c("Failed to copy timestamps: ",B,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!l||l.querySelector(".ytls-error-message")||me)return;if(te().length===0){alert("No timestamps available to offset.");return}let p=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(p===null)return;let b=p.trim();if(b.length===0)return;let x=Number.parseInt(b,10);if(!Number.isFinite(x)){alert("Please enter a valid integer number of seconds.");return}x!==0&&_o(x,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let f=fo();if(!f){alert("Unable to determine current video ID.");return}let p=document.createElement("div");p.id="ytls-delete-all-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let x=document.createElement("p");x.textContent=f,x.style.fontFamily="monospace",x.style.fontSize="12px",x.style.marginBottom="15px",x.style.color="#aaa";let C=document.createElement("button");C.classList.add("ytls-save-modal-button"),C.style.background="#d32f2f",C.style.position="relative",C.style.overflow="hidden";let B=null,A=0,N=null,$=document.createElement("div");$.style.position="absolute",$.style.left="0",$.style.top="0",$.style.height="100%",$.style.width="0%",$.style.background="#ff6b6b",$.style.transition="none",$.style.pointerEvents="none",C.appendChild($);let K=document.createElement("span");K.textContent="Hold to Delete All",K.style.position="relative",K.style.zIndex="1",C.appendChild(K);let De=()=>{if(!A)return;let je=Date.now()-A,Mt=Math.min(je/5e3*100,100);$.style.width=`${Mt}%`,Mt<100&&(N=requestAnimationFrame(De))},G=()=>{B&&(clearTimeout(B),B=null),N&&(cancelAnimationFrame(N),N=null),A=0,$.style.width="0%",K.textContent="Hold to Delete All"};C.onmousedown=()=>{A=Date.now(),K.textContent="Deleting...",N=requestAnimationFrame(De),B=setTimeout(async()=>{G(),p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(p)&&document.body.removeChild(p);try{await rr(f),vo()}catch(je){c("Failed to delete all timestamps:",je,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},C.onmouseup=G,C.onmouseleave=G;let we=null,Ae=null,dt=u(p,()=>{G(),we&&document.removeEventListener("keydown",we),Ae&&document.removeEventListener("click",Ae,!0)});we=y(dt),Ae=d(p,dt);let Ct=document.createElement("button");Ct.textContent="Cancel",Ct.classList.add("ytls-save-modal-cancel-button"),Ct.onclick=dt,p.appendChild(b),p.appendChild(x),p.appendChild(C),p.appendChild(Ct),document.body.appendChild(p),g(we),h(Ae)}}],Q=ri();z.forEach(f=>{let p=document.createElement("button");if(p.textContent=f.label,Ze(p,f.title),p.classList.add("ytls-main-button"),f.label==="\u{1F423}"&&Q){let b=document.createElement("span");b.textContent=Q,b.classList.add("ytls-holiday-emoji"),p.appendChild(b)}f.label==="\u{1F4CB}"?p.onclick=function(b){f.action.call(this,b)}:p.onclick=f.action,f.label==="\u2699\uFE0F"&&(Sn=p),S.appendChild(p)});let Le=document.createElement("button");Le.textContent="\u{1F4BE} Save",Le.classList.add("ytls-file-operation-button"),Le.onclick=()=>{let f=document.createElement("div");f.id="ytls-save-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let p=document.createElement("p");p.textContent="Save as:";let b=null,x=null,C=u(f,()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0)});b=y(C),x=d(f,C);let B=document.createElement("button");B.textContent="JSON",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),u(f,()=>Vo("json"))()};let A=document.createElement("button");A.textContent="Plain Text",A.classList.add("ytls-save-modal-button"),A.onclick=()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),u(f,()=>Vo("text"))()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,f.appendChild(p),f.appendChild(B),f.appendChild(A),f.appendChild(N),document.body.appendChild(f),g(b),h(x)};let vt=document.createElement("button");vt.textContent="\u{1F4C2} Load",vt.classList.add("ytls-file-operation-button"),vt.onclick=()=>{let f=document.createElement("div");f.id="ytls-load-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let p=document.createElement("p");p.textContent="Load from:";let b=null,x=null,C=u(f,()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0)});b=y(C),x=d(f,C);let B=document.createElement("button");B.textContent="File",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{let $=document.createElement("input");$.type="file",$.accept=".json,.txt",$.classList.add("ytls-hidden-file-input"),$.onchange=K=>{let De=K.target.files?.[0];if(!De)return;b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),C();let G=new FileReader;G.onload=()=>{let we=String(G.result).trim();Qo(we)},G.readAsText(De)},$.click()};let A=document.createElement("button");A.textContent="Clipboard",A.classList.add("ytls-save-modal-button"),A.onclick=async()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),u(f,async()=>{try{let $=await navigator.clipboard.readText();$?Qo($.trim()):alert("Clipboard is empty.")}catch($){c("Failed to read from clipboard: ",$,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,f.appendChild(p),f.appendChild(B),f.appendChild(A),f.appendChild(N),document.body.appendChild(f),g(b),h(x)};let ct=document.createElement("button");ct.textContent="\u{1F4E4} Export",ct.classList.add("ytls-file-operation-button"),ct.onclick=async()=>{try{await Xi()}catch{alert("Failed to export data: Could not read from database.")}};let ee=document.createElement("button");ee.textContent="\u{1F4E5} Import",ee.classList.add("ytls-file-operation-button"),ee.onclick=()=>{let f=document.createElement("input");f.type="file",f.accept=".json",f.classList.add("ytls-hidden-file-input"),f.onchange=p=>{let b=p.target.files?.[0];if(!b)return;let x=new FileReader;x.onload=()=>{try{let C=JSON.parse(String(x.result)),B=[];for(let A in C)if(Object.prototype.hasOwnProperty.call(C,A)&&A.startsWith("ytls-")){let N=A.substring(5),$=C[A];if($&&typeof $.video_id=="string"&&Array.isArray($.timestamps)){let K=$.timestamps.map(G=>({...G,guid:G.guid||crypto.randomUUID()})),De=Zo(N,K).then(()=>c(`Imported ${N} to IndexedDB`)).catch(G=>c(`Failed to import ${N} to IndexedDB:`,G,"error"));B.push(De)}else c(`Skipping key ${A} during import due to unexpected data format.`,"warn")}Promise.all(B).then(()=>{vo()}).catch(A=>{alert("An error occurred during import to IndexedDB. Check console for details."),c("Overall import error:",A,"error")})}catch(C){alert(`Failed to import data. Please ensure the file is in the correct format.
`+C.message),c("Import error:",C,"error")}},x.readAsText(b)},f.click()},T.textContent=si,l.onclick=f=>{qo(f)},l.ontouchstart=f=>{qo(f)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",Y(),setTimeout(()=>$t(),10);let se=!1,ie,be,qe=!1;n.addEventListener("mousedown",f=>{let p=f.target;p instanceof Element&&(p instanceof HTMLInputElement||p instanceof HTMLTextAreaElement||p!==v&&!v.contains(p)&&window.getComputedStyle(p).cursor==="pointer"||(se=!0,qe=!1,ie=f.clientX-n.getBoundingClientRect().left,be=f.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",In=f=>{if(!se)return;qe=!0;let p=f.clientX-ie,b=f.clientY-be,x=n.getBoundingClientRect(),C=x.width,B=x.height,A=document.documentElement.clientWidth,N=document.documentElement.clientHeight;p=Math.max(0,Math.min(p,A-C)),b=Math.max(0,Math.min(b,N-B)),n.style.left=`${p}px`,n.style.top=`${b}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",Cn=()=>{if(!se)return;se=!1;let f=qe;setTimeout(()=>{qe=!1},50),$t(),setTimeout(()=>{f&&he()},200)}),n.addEventListener("dragstart",f=>f.preventDefault());let ot=document.createElement("div"),Gt=document.createElement("div"),qn=document.createElement("div"),Ut=document.createElement("div");ot.id="ytls-resize-tl",Gt.id="ytls-resize-tr",qn.id="ytls-resize-bl",Ut.id="ytls-resize-br";let ut=!1,ni=0,oi=0,_t=0,qt=0,jn=0,Vn=0,It=null;Wn(ot,"top-left"),Wn(Gt,"top-right"),Wn(qn,"bottom-left"),Wn(Ut,"bottom-right"),document.addEventListener("mousemove",f=>{if(!ut||!n||!It)return;let p=f.clientX-ni,b=f.clientY-oi,x=_t,C=qt,B=jn,A=Vn,N=document.documentElement.clientWidth,$=document.documentElement.clientHeight;It==="bottom-right"?(x=Math.max(200,Math.min(800,_t+p)),C=Math.max(250,Math.min($,qt+b))):It==="top-left"?(x=Math.max(200,Math.min(800,_t-p)),B=jn+p,C=Math.max(250,Math.min($,qt-b)),A=Vn+b):It==="top-right"?(x=Math.max(200,Math.min(800,_t+p)),C=Math.max(250,Math.min($,qt-b)),A=Vn+b):It==="bottom-left"&&(x=Math.max(200,Math.min(800,_t-p)),B=jn+p,C=Math.max(250,Math.min($,qt+b))),B=Math.max(0,Math.min(B,N-x)),A=Math.max(0,Math.min(A,$-C)),n.style.width=`${x}px`,n.style.height=`${C}px`,n.style.left=`${B}px`,n.style.top=`${A}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{ut&&(ut=!1,It=null,document.body.style.cursor="",U(!0))});let Yn=null;window.addEventListener("resize",Mn=()=>{Yn&&clearTimeout(Yn),Yn=setTimeout(()=>{U(!0),Yn=null},200)}),v.appendChild(w),v.appendChild(o);let Kn=document.createElement("div");if(Kn.id="ytls-content",Kn.append(l),Kn.append(S),n.append(v,Kn,T,ot,Gt,qn,Ut),n.addEventListener("mousemove",f=>{try{if(se||ut)return;let p=n.getBoundingClientRect(),b=20,x=f.clientX,C=f.clientY,B=x-p.left<=b,A=p.right-x<=b,N=C-p.top<=b,$=p.bottom-C<=b,K="";N&&B||$&&A?K="nwse-resize":N&&A||$&&B?K="nesw-resize":K="",document.body.style.cursor=K}catch{}}),n.addEventListener("mouseleave",()=>{!ut&&!se&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=dn,setTimeout(()=>{if(dn(),n&&v&&S&&l){let f=40,p=te();if(p.length>0)f=p[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",l.appendChild(b),f=b.offsetHeight,l.removeChild(b)}H=v.offsetHeight+S.offsetHeight+f,n.style.minHeight=H+"px"}},0),window.addEventListener("resize",dn),tt){try{tt.disconnect()}catch{}tt=null}tt=new ResizeObserver(dn),tt.observe(n),tn||document.addEventListener("pointerdown",tn=()=>{No=Date.now()},!0),nn||document.addEventListener("pointerup",nn=()=>{},!0)}finally{so=!1}}}async function lr(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(a=>{a!==n&&(c("Removing duplicate pane element from DOM"),a.remove())}),document.body.contains(n)){c("Pane already in DOM, skipping append");return}await ar(),typeof zo=="function"&&zo(Ko),typeof no=="function"&&no(_n),typeof oo=="function"&&oo(go),typeof Bo=="function"&&Bo(M),await Po(),await Hi(),await Yt(),typeof ro=="function"&&ro();let o=document.querySelectorAll("#ytls-pane");if(o.length>0&&(c(`WARNING: Found ${o.length} existing pane(s) in DOM, removing all`),o.forEach(a=>a.remove())),document.body.contains(n)){c("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(n),c("Pane successfully appended to DOM"),ae(),fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{R(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),de(),U(!0),fe=null},450),et){try{et.disconnect()}catch{}et=null}et=new MutationObserver(()=>{let a=document.querySelectorAll("#ytls-pane");a.length>1&&(c(`CRITICAL: Multiple panes detected (${a.length}), removing duplicates`),a.forEach((u,y)=>{(y>0||n&&u!==n)&&u.remove()}))}),et.observe(document.body,{childList:!0,subtree:!0})}function ei(t=0){if(document.getElementById("ytls-header-button")){lt();return}let o=document.querySelector("#logo");if(!o||!o.parentElement){t<10&&setTimeout(()=>ei(t+1),300);return}let a=document.createElement("button");a.id="ytls-header-button",a.type="button",a.className="ytls-header-button",Ze(a,"Toggle Timekeeper UI"),a.setAttribute("aria-label","Toggle Timekeeper UI");let u=document.createElement("img");u.src=Se,u.alt="",u.decoding="async",a.appendChild(u),yt=u,a.addEventListener("mouseenter",()=>{yt&&(Ln=!0,yt.src=Be)}),a.addEventListener("mouseleave",()=>{yt&&(Ln=!1,lt())}),a.addEventListener("click",()=>{n&&!document.body.contains(n)&&(c("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),yo()}),o.insertAdjacentElement("afterend",a),lt(),c("Timekeeper header button added next to YouTube logo")}function ti(){if(W)return;W=!0;let t=history.pushState,o=history.replaceState;function a(){try{let u=new Event("locationchange");window.dispatchEvent(u)}catch{}}history.pushState=function(){let u=t.apply(this,arguments);return a(),u},history.replaceState=function(){let u=o.apply(this,arguments);return a(),u},window.addEventListener("popstate",a),window.addEventListener("locationchange",()=>{window.location.href!==Z&&c("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function vo(){if(!m()){Wi();return}Z=window.location.href,document.querySelectorAll("#ytls-pane").forEach((o,a)=>{(a>0||n&&o!==n)&&o.remove()}),await pe(),await sr(),ye=fo();let t=document.title;c("Page Title:",t),c("Video ID:",ye),c("Current URL:",window.location.href),mo(!0),St(),Me(),await Yo(),Me(),mo(!1),c("Timestamps loaded and UI unlocked for video:",ye),await lr(),ei(),Ki()}ti(),window.addEventListener("yt-navigate-start",()=>{c("Navigation started (yt-navigate-start event fired)"),m()&&n&&l&&(c("Locking UI and showing loading state for navigation"),mo(!0))}),en=t=>{t.ctrlKey&&t.altKey&&t.shiftKey&&(t.key==="T"||t.key==="t")&&(t.preventDefault(),yo(),c("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",en),window.addEventListener("yt-navigate-finish",()=>{c("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==Z?vo():c("Navigation finished but URL already handled, skipping.")}),ti(),c("Timekeeper initialized and waiting for navigation events")})();})();

