// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.2.4
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

(()=>{function u(e,...n){let i="debug",a=[...n];n.length>0&&typeof n[n.length-1]=="string"&&["debug","info","warn","error"].includes(n[n.length-1])&&(i=a.pop());let r=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[i](`${r} ${e}`,...a)}function ht(e,n=e){let i=Math.floor(e/3600),a=Math.floor(e%3600/60),d=String(e%60).padStart(2,"0");return n<3600?`${a<10?a:String(a).padStart(2,"0")}:${d}`:`${n>=36e3?String(i).padStart(2,"0"):i}:${String(a).padStart(2,"0")}:${d}`}function po(e,n=window.location.href){try{let i=new URL(n);return i.searchParams.set("t",`${e}s`),i.toString()}catch{return`https://www.youtube.com/watch?v=${n.search(/[?&]v=/)>=0?n.split(/[?&]v=/)[1].split(/&/)[0]:n.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Bn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var yr=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function ho(){let e=new Date,n=e.getFullYear(),i=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let a of yr){let y=(new Date(n,a.month-1,a.day).getTime()-e.getTime())/(1e3*60*60*24);if(y<=7&&y>=-3)return u(`Current date: ${i}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(y)}`),a.emoji}return u(`Current date: ${i}, No holiday emoji (not within range)`),null}var gt=null,Pt=null,br=500;function xr(){return(!gt||!document.body.contains(gt))&&(gt=document.createElement("div"),gt.className="ytls-tooltip",document.body.appendChild(gt)),gt}function wr(e,n,i){let d=window.innerWidth,r=window.innerHeight,y=e.getBoundingClientRect(),c=y.width,S=y.height,x=n+10,w=i+10;x+c>d-10&&(x=n-c-10),w+S>r-10&&(w=i-S-10),x=Math.max(10,Math.min(x,d-c-10)),w=Math.max(10,Math.min(w,r-S-10)),e.style.left=`${x}px`,e.style.top=`${w}px`}function Tr(e,n,i){Pt&&clearTimeout(Pt),Pt=setTimeout(()=>{let a=xr();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),wr(a,n,i),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})},br)}function kr(){Pt&&(clearTimeout(Pt),Pt=null),gt&&gt.classList.remove("ytls-tooltip-visible")}function Ie(e,n){let i=0,a=0,d=c=>{i=c.clientX,a=c.clientY;let S=typeof n=="function"?n():n;S&&Tr(S,i,a)},r=c=>{i=c.clientX,a=c.clientY},y=()=>{kr()};e.addEventListener("mouseenter",d),e.addEventListener("mousemove",r),e.addEventListener("mouseleave",y),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",d),e.removeEventListener("mousemove",r),e.removeEventListener("mouseleave",y)}}var go=`
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
    user-select: none; /* Prevent text selection in pane */
    display: flex;
    flex-direction: column;
  }
  #ytls-pane:hover {
    opacity: 1;
  }
  #ytls-pane ul {
    list-style: none;
    padding: 0;
    margin: 0;
    user-select: none; /* Prevent text selection in timestamp list */
    position: relative; /* Enable absolute positioning for loading message */
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }
  #ytls-pane li {
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    margin: 0;
    border: none;
    border-top: 1px solid rgba(85, 85, 85, 0.8);
    user-select: none; /* Prevent text selection in timestamp items */
    box-sizing: border-box;
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
    display: flex;
    gap: 5px;
    justify-content: space-between;
    padding: 10px;
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
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding: 10px 16px;
    white-space:nowrap;
    cursor:default;
    border-radius: 12px 12px 0px 0px;
    border: none;
    background:rgb(33, 33, 33);
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

`;var ye=Uint8Array,Ne=Uint16Array,Hn=Int32Array,Nn=new ye([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Rn=new ye([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),vo=new ye([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),ko=function(e,n){for(var i=new Ne(31),a=0;a<31;++a)i[a]=n+=1<<e[a-1];for(var d=new Hn(i[30]),a=1;a<30;++a)for(var r=i[a];r<i[a+1];++r)d[r]=r-i[a]<<5|a;return{b:i,r:d}},Eo=ko(Nn,2),Er=Eo.b,Pn=Eo.r;Er[28]=258,Pn[258]=28;var So=ko(Rn,0),ii=So.b,yo=So.r,zn=new Ne(32768);for(_=0;_<32768;++_)st=(_&43690)>>1|(_&21845)<<1,st=(st&52428)>>2|(st&13107)<<2,st=(st&61680)>>4|(st&3855)<<4,zn[_]=((st&65280)>>8|(st&255)<<8)>>1;var st,_,Zt=(function(e,n,i){for(var a=e.length,d=0,r=new Ne(n);d<a;++d)e[d]&&++r[e[d]-1];var y=new Ne(n);for(d=1;d<n;++d)y[d]=y[d-1]+r[d-1]<<1;var c;if(i){c=new Ne(1<<n);var S=15-n;for(d=0;d<a;++d)if(e[d])for(var x=d<<4|e[d],w=n-e[d],M=y[e[d]-1]++<<w,I=M|(1<<w)-1;M<=I;++M)c[zn[M]>>S]=x}else for(c=new Ne(a),d=0;d<a;++d)e[d]&&(c[d]=zn[y[e[d]-1]++]>>15-e[d]);return c}),Et=new ye(288);for(_=0;_<144;++_)Et[_]=8;var _;for(_=144;_<256;++_)Et[_]=9;var _;for(_=256;_<280;++_)Et[_]=7;var _;for(_=280;_<288;++_)Et[_]=8;var _,gn=new ye(32);for(_=0;_<32;++_)gn[_]=5;var _,Sr=Zt(Et,9,0);var Lr=Zt(gn,5,0);var Lo=function(e){return(e+7)/8|0},Io=function(e,n,i){return(n==null||n<0)&&(n=0),(i==null||i>e.length)&&(i=e.length),new ye(e.subarray(n,i))};var Ir=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],yn=function(e,n,i){var a=new Error(n||Ir[e]);if(a.code=e,Error.captureStackTrace&&Error.captureStackTrace(a,yn),!i)throw a;return a};var lt=function(e,n,i){i<<=n&7;var a=n/8|0;e[a]|=i,e[a+1]|=i>>8},Wt=function(e,n,i){i<<=n&7;var a=n/8|0;e[a]|=i,e[a+1]|=i>>8,e[a+2]|=i>>16},Fn=function(e,n){for(var i=[],a=0;a<e.length;++a)e[a]&&i.push({s:a,f:e[a]});var d=i.length,r=i.slice();if(!d)return{t:Co,l:0};if(d==1){var y=new ye(i[0].s+1);return y[i[0].s]=1,{t:y,l:1}}i.sort(function(le,xe){return le.f-xe.f}),i.push({s:-1,f:25001});var c=i[0],S=i[1],x=0,w=1,M=2;for(i[0]={s:-1,f:c.f+S.f,l:c,r:S};w!=d-1;)c=i[i[x].f<i[M].f?x++:M++],S=i[x!=w&&i[x].f<i[M].f?x++:M++],i[w++]={s:-1,f:c.f+S.f,l:c,r:S};for(var I=r[0].s,a=1;a<d;++a)r[a].s>I&&(I=r[a].s);var P=new Ne(I+1),N=On(i[w-1],P,0);if(N>n){var a=0,U=0,Z=N-n,ee=1<<Z;for(r.sort(function(xe,re){return P[re.s]-P[xe.s]||xe.f-re.f});a<d;++a){var j=r[a].s;if(P[j]>n)U+=ee-(1<<N-P[j]),P[j]=n;else break}for(U>>=Z;U>0;){var he=r[a].s;P[he]<n?U-=1<<n-P[he]++-1:++a}for(;a>=0&&U;--a){var J=r[a].s;P[J]==n&&(--P[J],++U)}N=n}return{t:new ye(P),l:N}},On=function(e,n,i){return e.s==-1?Math.max(On(e.l,n,i+1),On(e.r,n,i+1)):n[e.s]=i},bo=function(e){for(var n=e.length;n&&!e[--n];);for(var i=new Ne(++n),a=0,d=e[0],r=1,y=function(S){i[a++]=S},c=1;c<=n;++c)if(e[c]==d&&c!=n)++r;else{if(!d&&r>2){for(;r>138;r-=138)y(32754);r>2&&(y(r>10?r-11<<5|28690:r-3<<5|12305),r=0)}else if(r>3){for(y(d),--r;r>6;r-=6)y(8304);r>2&&(y(r-3<<5|8208),r=0)}for(;r--;)y(d);r=1,d=e[c]}return{c:i.subarray(0,a),n}},Yt=function(e,n){for(var i=0,a=0;a<n.length;++a)i+=e[a]*n[a];return i},Mo=function(e,n,i){var a=i.length,d=Lo(n+2);e[d]=a&255,e[d+1]=a>>8,e[d+2]=e[d]^255,e[d+3]=e[d+1]^255;for(var r=0;r<a;++r)e[d+r+4]=i[r];return(d+4+a)*8},xo=function(e,n,i,a,d,r,y,c,S,x,w){lt(n,w++,i),++d[256];for(var M=Fn(d,15),I=M.t,P=M.l,N=Fn(r,15),U=N.t,Z=N.l,ee=bo(I),j=ee.c,he=ee.n,J=bo(U),le=J.c,xe=J.n,re=new Ne(19),R=0;R<j.length;++R)++re[j[R]&31];for(var R=0;R<le.length;++R)++re[le[R]&31];for(var F=Fn(re,7),oe=F.t,Q=F.l,ge=19;ge>4&&!oe[vo[ge-1]];--ge);var ct=x+5<<3,ze=Yt(d,Et)+Yt(r,gn)+y,Ce=Yt(d,I)+Yt(r,U)+y+14+3*ge+Yt(re,oe)+2*re[16]+3*re[17]+7*re[18];if(S>=0&&ct<=ze&&ct<=Ce)return Mo(n,w,e.subarray(S,S+x));var Ge,ie,Oe,we;if(lt(n,w,1+(Ce<ze)),w+=2,Ce<ze){Ge=Zt(I,P,0),ie=I,Oe=Zt(U,Z,0),we=U;var ot=Zt(oe,Q,0);lt(n,w,he-257),lt(n,w+5,xe-1),lt(n,w+10,ge-4),w+=14;for(var R=0;R<ge;++R)lt(n,w+3*R,oe[vo[R]]);w+=3*ge;for(var $e=[j,le],Ue=0;Ue<2;++Ue)for(var qe=$e[Ue],R=0;R<qe.length;++R){var be=qe[R]&31;lt(n,w,ot[be]),w+=oe[be],be>15&&(lt(n,w,qe[R]>>5&127),w+=qe[R]>>12)}}else Ge=Sr,ie=Et,Oe=Lr,we=gn;for(var R=0;R<c;++R){var ne=a[R];if(ne>255){var be=ne>>18&31;Wt(n,w,Ge[be+257]),w+=ie[be+257],be>7&&(lt(n,w,ne>>23&31),w+=Nn[be]);var Ye=ne&31;Wt(n,w,Oe[Ye]),w+=we[Ye],Ye>3&&(Wt(n,w,ne>>5&8191),w+=Rn[Ye])}else Wt(n,w,Ge[ne]),w+=ie[ne]}return Wt(n,w,Ge[256]),w+ie[256]},Mr=new Hn([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Co=new ye(0),Cr=function(e,n,i,a,d,r){var y=r.z||e.length,c=new ye(a+y+5*(1+Math.ceil(y/7e3))+d),S=c.subarray(a,c.length-d),x=r.l,w=(r.r||0)&7;if(n){w&&(S[0]=r.r>>3);for(var M=Mr[n-1],I=M>>13,P=M&8191,N=(1<<i)-1,U=r.p||new Ne(32768),Z=r.h||new Ne(N+1),ee=Math.ceil(i/3),j=2*ee,he=function(mt){return(e[mt]^e[mt+1]<<ee^e[mt+2]<<j)&N},J=new Hn(25e3),le=new Ne(288),xe=new Ne(32),re=0,R=0,F=r.i||0,oe=0,Q=r.w||0,ge=0;F+2<y;++F){var ct=he(F),ze=F&32767,Ce=Z[ct];if(U[ze]=Ce,Z[ct]=ze,Q<=F){var Ge=y-F;if((re>7e3||oe>24576)&&(Ge>423||!x)){w=xo(e,S,0,J,le,xe,R,oe,ge,F-ge,w),oe=re=R=0,ge=F;for(var ie=0;ie<286;++ie)le[ie]=0;for(var ie=0;ie<30;++ie)xe[ie]=0}var Oe=2,we=0,ot=P,$e=ze-Ce&32767;if(Ge>2&&ct==he(F-$e))for(var Ue=Math.min(I,Ge)-1,qe=Math.min(32767,F),be=Math.min(258,Ge);$e<=qe&&--ot&&ze!=Ce;){if(e[F+Oe]==e[F+Oe-$e]){for(var ne=0;ne<be&&e[F+ne]==e[F+ne-$e];++ne);if(ne>Oe){if(Oe=ne,we=$e,ne>Ue)break;for(var Ye=Math.min($e,ne-2),D=0,ie=0;ie<Ye;++ie){var dt=F-$e+ie&32767,ae=U[dt],De=dt-ae&32767;De>D&&(D=De,Ce=dt)}}}ze=Ce,Ce=U[ze],$e+=ze-Ce&32767}if(we){J[oe++]=268435456|Pn[Oe]<<18|yo[we];var et=Pn[Oe]&31,Ze=yo[we]&31;R+=Nn[et]+Rn[Ze],++le[257+et],++xe[Ze],Q=F+Oe,++re}else J[oe++]=e[F],++le[e[F]]}}for(F=Math.max(F,Q);F<y;++F)J[oe++]=e[F],++le[e[F]];w=xo(e,S,x,J,le,xe,R,oe,ge,F-ge,w),x||(r.r=w&7|S[w/8|0]<<3,w-=7,r.h=Z,r.p=U,r.i=F,r.w=Q)}else{for(var F=r.w||0;F<y+x;F+=65535){var _e=F+65535;_e>=y&&(S[w/8|0]=x,_e=y),w=Mo(S,w+1,e.subarray(F,_e))}r.i=y}return Io(c,0,a+Lo(w)+d)},Dr=(function(){for(var e=new Int32Array(256),n=0;n<256;++n){for(var i=n,a=9;--a;)i=(i&1&&-306674912)^i>>>1;e[n]=i}return e})(),Ar=function(){var e=-1;return{p:function(n){for(var i=e,a=0;a<n.length;++a)i=Dr[i&255^n[a]]^i>>>8;e=i},d:function(){return~e}}};var Br=function(e,n,i,a,d){if(!d&&(d={l:1},n.dictionary)){var r=n.dictionary.subarray(-32768),y=new ye(r.length+e.length);y.set(r),y.set(e,r.length),e=y,d.w=r.length}return Cr(e,n.level==null?6:n.level,n.mem==null?d.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+n.mem,i,a,d)},Do=function(e,n){var i={};for(var a in e)i[a]=e[a];for(var a in n)i[a]=n[a];return i};var ve=function(e,n,i){for(;i;++n)e[n]=i,i>>>=8};function Fr(e,n){return Br(e,n||{},0,0)}var Ao=function(e,n,i,a){for(var d in e){var r=e[d],y=n+d,c=a;Array.isArray(r)&&(c=Do(a,r[1]),r=r[0]),r instanceof ye?i[y]=[r,c]:(i[y+="/"]=[new ye(0),c],Ao(r,y,i,a))}},wo=typeof TextEncoder<"u"&&new TextEncoder,Pr=typeof TextDecoder<"u"&&new TextDecoder,zr=0;try{Pr.decode(Co,{stream:!0}),zr=1}catch{}function vn(e,n){if(n){for(var i=new ye(e.length),a=0;a<e.length;++a)i[a]=e.charCodeAt(a);return i}if(wo)return wo.encode(e);for(var d=e.length,r=new ye(e.length+(e.length>>1)),y=0,c=function(w){r[y++]=w},a=0;a<d;++a){if(y+5>r.length){var S=new ye(y+8+(d-a<<1));S.set(r),r=S}var x=e.charCodeAt(a);x<128||n?c(x):x<2048?(c(192|x>>6),c(128|x&63)):x>55295&&x<57344?(x=65536+(x&1047552)|e.charCodeAt(++a)&1023,c(240|x>>18),c(128|x>>12&63),c(128|x>>6&63),c(128|x&63)):(c(224|x>>12),c(128|x>>6&63),c(128|x&63))}return Io(r,0,y)}var $n=function(e){var n=0;if(e)for(var i in e){var a=e[i].length;a>65535&&yn(9),n+=a+4}return n},To=function(e,n,i,a,d,r,y,c){var S=a.length,x=i.extra,w=c&&c.length,M=$n(x);ve(e,n,y!=null?33639248:67324752),n+=4,y!=null&&(e[n++]=20,e[n++]=i.os),e[n]=20,n+=2,e[n++]=i.flag<<1|(r<0&&8),e[n++]=d&&8,e[n++]=i.compression&255,e[n++]=i.compression>>8;var I=new Date(i.mtime==null?Date.now():i.mtime),P=I.getFullYear()-1980;if((P<0||P>119)&&yn(10),ve(e,n,P<<25|I.getMonth()+1<<21|I.getDate()<<16|I.getHours()<<11|I.getMinutes()<<5|I.getSeconds()>>1),n+=4,r!=-1&&(ve(e,n,i.crc),ve(e,n+4,r<0?-r-2:r),ve(e,n+8,i.size)),ve(e,n+12,S),ve(e,n+14,M),n+=16,y!=null&&(ve(e,n,w),ve(e,n+6,i.attrs),ve(e,n+10,y),n+=14),e.set(a,n),n+=S,M)for(var N in x){var U=x[N],Z=U.length;ve(e,n,+N),ve(e,n+2,Z),e.set(U,n+4),n+=4+Z}return w&&(e.set(c,n),n+=w),n},Or=function(e,n,i,a,d){ve(e,n,101010256),ve(e,n+8,i),ve(e,n+10,i),ve(e,n+12,a),ve(e,n+16,d)};function Bo(e,n){n||(n={});var i={},a=[];Ao(e,"",i,n);var d=0,r=0;for(var y in i){var c=i[y],S=c[0],x=c[1],w=x.level==0?0:8,M=vn(y),I=M.length,P=x.comment,N=P&&vn(P),U=N&&N.length,Z=$n(x.extra);I>65535&&yn(11);var ee=w?Fr(S,x):S,j=ee.length,he=Ar();he.p(S),a.push(Do(x,{size:S.length,crc:he.d(),c:ee,f:M,m:N,u:I!=y.length||N&&P.length!=U,o:d,compression:w})),d+=30+I+Z+j,r+=76+2*(I+Z)+(U||0)+j}for(var J=new ye(r+22),le=d,xe=r-d,re=0;re<a.length;++re){var M=a[re];To(J,M.o,M,M.f,M.u,M.c.length);var R=30+M.f.length+$n(M.extra);J.set(M.c,M.o+R),To(J,d,M,M.f,M.u,M.c.length,M.o,M.m),d+=16+R+(M.m?M.m.length:0)}return Or(J,d,a.length,xe,le),J}var z={isSignedIn:!1,accessToken:null,userName:null,email:null},Qe=!0,Me=30,Pe=null,Ot=!1,zt=0,Re=null,Gn=null,pe=null,K=null,bn=null;function Oo(e){Gn=e}function $o(e){pe=e}function Ho(e){K=e}function Un(e){bn=e}var Fo=!1;function No(){if(!Fo)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),Fo=!0}catch{}}var Ro=null,Jt=null,Xt=null;function qn(e){Ro=e}function wn(e){Jt=e}function Tn(e){Xt=e}var Po="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",$r="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Hr="https://www.youtube.com/",Nr=30*1e3,Rr=1800*1e3,zo=5,xn=null,Ke=null;async function _n(){try{let e=await Xt("googleAuthState");e&&typeof e=="object"&&(z={...z,...e},en(),z.isSignedIn&&z.accessToken&&await Ht(!0))}catch(e){u("Failed to load Google auth state:",e,"error")}}async function kn(){try{await Jt("googleAuthState",z)}catch(e){u("Failed to save Google auth state:",e,"error")}}function en(){Gn&&(Gn.style.display="none")}function Fe(e,n){if(K){if(K.style.fontWeight="bold",e==="authenticating"){for(No(),K.style.color="#ffa500";K.firstChild;)K.removeChild(K.firstChild);let i=document.createElement("span");i.className="tk-auth-spinner";let a=document.createTextNode(` ${n||"Authorizing with Google\u2026"}`);K.appendChild(i),K.appendChild(a);return}if(e==="error"){K.textContent=`\u274C ${n||"Authorization failed"}`,K.style.color="#ff4d4f",$t();return}z.isSignedIn?(K.textContent="\u2705 Signed in",K.style.color="#52c41a",K.removeAttribute("title"),z.userName?(K.onmouseenter=()=>{K.textContent=`\u2705 Signed in as ${z.userName}`},K.onmouseleave=()=>{K.textContent="\u2705 Signed in"}):(K.onmouseenter=null,K.onmouseleave=null)):(K.textContent="\u274C Not signed in",K.style.color="#ff4d4f",K.removeAttribute("title"),K.onmouseenter=null,K.onmouseleave=null),$t()}}function Gr(){K&&(No(),K.classList.remove("tk-auth-blink"),K.offsetWidth,K.classList.add("tk-auth-blink"),setTimeout(()=>{K.classList.remove("tk-auth-blink")},1200))}function Ur(e){return new Promise((n,i)=>{if(!e){u&&u("OAuth monitor: popup is null",null,"error"),i(new Error("Failed to open popup"));return}u&&u("OAuth monitor: starting to monitor popup for token");let a=Date.now(),d=300*1e3,r="timekeeper_oauth",y=null,c=null,S=null,x=()=>{if(y){try{y.close()}catch{}y=null}c&&(clearInterval(c),c=null),S&&(clearInterval(S),S=null)};try{y=new BroadcastChannel(r),u&&u("OAuth monitor: BroadcastChannel created successfully"),y.onmessage=I=>{if(u&&u("OAuth monitor: received BroadcastChannel message",I.data),I.data?.type==="timekeeper_oauth_token"&&I.data?.token){u&&u("OAuth monitor: token received via BroadcastChannel"),x();try{e.close()}catch{}n(I.data.token)}else if(I.data?.type==="timekeeper_oauth_error"){u&&u("OAuth monitor: error received via BroadcastChannel",I.data.error,"error"),x();try{e.close()}catch{}i(new Error(I.data.error||"OAuth failed"))}}}catch(I){u&&u("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",I)}u&&u("OAuth monitor: setting up IndexedDB polling");let w=Date.now();c=setInterval(async()=>{try{let I=indexedDB.open("ytls-timestamps-db",3);I.onsuccess=()=>{let P=I.result,Z=P.transaction("settings","readonly").objectStore("settings").get("oauth_message");Z.onsuccess=()=>{let ee=Z.result;if(ee&&ee.value){let j=ee.value;if(j.timestamp&&j.timestamp>w){if(u&&u("OAuth monitor: received IndexedDB message",j),j.type==="timekeeper_oauth_token"&&j.token){u&&u("OAuth monitor: token received via IndexedDB"),x();try{e.close()}catch{}P.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(j.token)}else if(j.type==="timekeeper_oauth_error"){u&&u("OAuth monitor: error received via IndexedDB",j.error,"error"),x();try{e.close()}catch{}P.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(new Error(j.error||"OAuth failed"))}w=j.timestamp}}P.close()}}}catch(I){u&&u("OAuth monitor: IndexedDB polling error",I,"error")}},500),S=setInterval(()=>{if(Date.now()-a>d){u&&u("OAuth monitor: popup timed out after 5 minutes",null,"error"),x();try{e.close()}catch{}i(new Error("OAuth popup timed out"));return}},1e3)})}async function Go(){if(!Po){Fe("error","Google Client ID not configured");return}try{u&&u("OAuth signin: starting OAuth flow"),Fe("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",Po),e.searchParams.set("redirect_uri",Hr),e.searchParams.set("response_type","token"),e.searchParams.set("scope",$r),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),u&&u("OAuth signin: opening popup");let n=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!n){u&&u("OAuth signin: popup blocked by browser",null,"error"),Fe("error","Popup blocked. Please enable popups for YouTube.");return}u&&u("OAuth signin: popup opened successfully"),Fe("authenticating","Waiting for authentication...");try{let i=await Ur(n),a=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${i}`}});if(a.ok){let d=await a.json();z.accessToken=i,z.isSignedIn=!0,z.userName=d.name,z.email=d.email,await kn(),en(),Fe(),We(),await Ht(),u?u(`Successfully authenticated as ${d.name}`):console.log(`[Timekeeper] Successfully authenticated as ${d.name}`)}else throw new Error("Failed to fetch user info")}catch(i){let a=i instanceof Error?i.message:"Authentication failed";u?u("OAuth failed:",i,"error"):console.error("[Timekeeper] OAuth failed:",i),Fe("error",a);return}}catch(e){let n=e instanceof Error?e.message:"Sign in failed";u?u("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Fe("error",`Failed to sign in: ${n}`)}}async function Uo(){if(!window.opener||window.opener===window)return!1;u&&u("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return u&&u("OAuth popup: no hash params found"),!1;let n=e.startsWith("#")?e.substring(1):e,i=new URLSearchParams(n),a=i.get("state");if(u&&u("OAuth popup: hash params found, state="+a),a!=="timekeeper_auth")return u&&u("OAuth popup: not our OAuth flow (wrong state)"),!1;let d=i.get("error"),r=i.get("access_token"),y="timekeeper_oauth";if(d){try{let c=new BroadcastChannel(y);c.postMessage({type:"timekeeper_oauth_error",error:i.get("error_description")||d}),c.close()}catch{let S={type:"timekeeper_oauth_error",error:i.get("error_description")||d,timestamp:Date.now()},x=indexedDB.open("ytls-timestamps-db",3);x.onsuccess=()=>{let w=x.result;w.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),w.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(r){u&&u("OAuth popup: access token found, broadcasting to opener");try{let c=new BroadcastChannel(y);c.postMessage({type:"timekeeper_oauth_token",token:r}),c.close(),u&&u("OAuth popup: token broadcast via BroadcastChannel")}catch(c){u&&u("OAuth popup: BroadcastChannel failed, using IndexedDB",c);let S={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},x=indexedDB.open("ytls-timestamps-db",3);x.onsuccess=()=>{let w=x.result;w.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),w.close()},u&&u("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function qo(){z={isSignedIn:!1,accessToken:null,userName:null,email:null},await kn(),en(),Fe(),We()}async function _o(){if(!z.isSignedIn||!z.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${z.accessToken}`}});return e.status===401?(await jo({silent:!0}),!1):e.ok}catch(e){return u("Failed to verify auth state:",e,"error"),!1}}async function qr(e){let n={Authorization:`Bearer ${e}`},a=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,d=await fetch(a,{headers:n});if(d.status===401)throw new Error("unauthorized");if(!d.ok)throw new Error("drive search failed");let r=await d.json();if(Array.isArray(r.files)&&r.files.length>0)return r.files[0].id;let y=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...n,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(y.status===401)throw new Error("unauthorized");if(!y.ok)throw new Error("drive folder create failed");return(await y.json()).id}async function _r(e,n,i){let a=`name='${e}' and '${n}' in parents and trashed=false`,d=encodeURIComponent(a),r=await fetch(`https://www.googleapis.com/drive/v3/files?q=${d}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${i}`}});if(r.status===401)throw new Error("unauthorized");if(!r.ok)return null;let y=await r.json();return y.files&&y.files.length>0?y.files[0].id:null}function jr(e,n){let i=vn(e),a=n.replace(/\\/g,"/").replace(/^\/+/,"");return a.endsWith(".json")||(a+=".json"),Bo({[a]:[i,{level:6,mtime:new Date,os:0}]})}async function Vr(e,n,i,a){let d=e.replace(/\.json$/,".zip"),r=await _r(d,i,a),y=new TextEncoder().encode(n).length,c=jr(n,e),S=c.length;u(`Compressing data: ${y} bytes -> ${S} bytes (${Math.round(100-S/y*100)}% reduction)`);let x="-------314159265358979",w=`\r
--${x}\r
`,M=`\r
--${x}--`,I=r?{name:d,mimeType:"application/zip"}:{name:d,mimeType:"application/zip",parents:[i]},P=8192,N="";for(let J=0;J<c.length;J+=P){let le=c.subarray(J,Math.min(J+P,c.length));N+=String.fromCharCode.apply(null,Array.from(le))}let U=btoa(N),Z=w+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(I)+w+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+U+M,ee,j;r?(ee=`https://www.googleapis.com/upload/drive/v3/files/${r}?uploadType=multipart&fields=id,name`,j="PATCH"):(ee="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",j="POST");let he=await fetch(ee,{method:j,headers:{Authorization:`Bearer ${a}`,"Content-Type":`multipart/related; boundary=${x}`},body:Z});if(he.status===401)throw new Error("unauthorized");if(!he.ok)throw new Error("drive upload failed")}async function jo(e){u("Auth expired, clearing token",null,"warn"),z.isSignedIn=!1,z.accessToken=null,await kn(),Fe("error","Authorization expired. Please sign in again."),We()}async function Kr(e){if(!z.isSignedIn||!z.accessToken){e?.silent||Fe("error","Please sign in to Google Drive first");return}try{let{json:n,filename:i,totalVideos:a,totalTimestamps:d}=await Ro();if(d===0){e?.silent||u("Skipping export: no timestamps to back up");return}let r=await qr(z.accessToken);await Vr(i,n,r,z.accessToken),u(`Exported to Google Drive (${i}) with ${a} videos / ${d} timestamps.`)}catch(n){throw n.message==="unauthorized"?(await jo({silent:e?.silent}),n):(u("Drive export failed:",n,"error"),e?.silent||Fe("error","Failed to export to Google Drive."),n)}}async function Vo(){try{let e=await Xt("autoBackupEnabled"),n=await Xt("autoBackupIntervalMinutes"),i=await Xt("lastAutoBackupAt");typeof e=="boolean"&&(Qe=e),typeof n=="number"&&n>0&&(Me=n),typeof i=="number"&&i>0&&(Pe=i)}catch(e){u("Failed to load auto backup settings:",e,"error")}}async function jn(){try{await Jt("autoBackupEnabled",Qe),await Jt("autoBackupIntervalMinutes",Me),await Jt("lastAutoBackupAt",Pe??0)}catch(e){u("Failed to save auto backup settings:",e,"error")}}function Wr(){xn&&(clearInterval(xn),xn=null),Ke&&(clearTimeout(Ke),Ke=null)}function ut(e){try{let n=new Date(e),i=new Date,a=n.toDateString()===i.toDateString(),d=n.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return a?d:`${n.toLocaleDateString()} ${d}`}catch{return""}}function We(){if(!pe)return;let e="",n="";if(!Qe)e="\u{1F501} Backup: Off",pe.onmouseenter=null,pe.onmouseleave=null;else if(Ot)e="\u{1F501} Backing up\u2026",pe.onmouseenter=null,pe.onmouseleave=null;else if(Re&&Re>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(Re/6e4)}m`,pe.onmouseenter=null,pe.onmouseleave=null;else if(Pe){e=`\u{1F5C4}\uFE0F Last backup: ${ut(Pe)}`;let i=Pe+Math.max(1,Me)*60*1e3;n=`\u{1F5C4}\uFE0F Next backup: ${ut(i)}`,pe.onmouseenter=()=>{pe.textContent=n},pe.onmouseleave=()=>{pe.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let i=Date.now()+Math.max(1,Me)*60*1e3;n=`\u{1F5C4}\uFE0F Next backup: ${ut(i)}`,pe.onmouseenter=()=>{pe.textContent=n},pe.onmouseleave=()=>{pe.textContent=e}}pe.textContent=e,pe.style.display=e?"inline":"none",$t()}function $t(){if(!bn)return;let e="",n="";if(!Qe)e="#ff4d4f",n="Auto backup is disabled";else if(Ot)e="#4285f4",n="Backup in progress";else if(Re&&Re>0)e="#ffa500",n=`Retrying backup in ${Math.ceil(Re/6e4)}m`;else if(z.isSignedIn&&Pe){e="#52c41a";let i=Pe+Math.max(1,Me)*60*1e3,a=ut(i);n=`Last backup: ${ut(Pe)}
Next backup: ${a}`}else if(z.isSignedIn){e="#ffa500";let i=Date.now()+Math.max(1,Me)*60*1e3;n=`No backup yet
Next backup: ${ut(i)}`}else e="#ff4d4f",n="Not signed in to Google Drive";bn.style.backgroundColor=e,Ie(bn,()=>{let i="";if(!Qe)i="Auto backup is disabled";else if(Ot)i="Backup in progress";else if(Re&&Re>0)i=`Retrying backup in ${Math.ceil(Re/6e4)}m`;else if(z.isSignedIn&&Pe){let a=Pe+Math.max(1,Me)*60*1e3,d=ut(a);i=`Last backup: ${ut(Pe)}
Next backup: ${d}`}else if(z.isSignedIn){let a=Date.now()+Math.max(1,Me)*60*1e3;i=`No backup yet
Next backup: ${ut(a)}`}else i="Not signed in to Google Drive";return i})}async function Qt(e=!0){if(!z.isSignedIn||!z.accessToken){e||Gr();return}if(!Ot){Ot=!0,We();try{await Kr({silent:e}),Pe=Date.now(),zt=0,Re=null,Ke&&(clearTimeout(Ke),Ke=null),await jn()}catch(n){if(u("Auto backup failed:",n,"error"),n.message==="unauthorized")u("Auth error detected, clearing token and stopping retries",null,"warn"),z.isSignedIn=!1,z.accessToken=null,await kn(),Fe("error","Authorization expired. Please sign in again."),We(),zt=0,Re=null,Ke&&(clearTimeout(Ke),Ke=null);else if(zt<zo){zt+=1;let d=Math.min(Nr*Math.pow(2,zt-1),Rr);Re=d,Ke&&clearTimeout(Ke),Ke=setTimeout(()=>{Qt(!0)},d),u(`Scheduling backup retry ${zt}/${zo} in ${Math.round(d/1e3)}s`),We()}else Re=null}finally{Ot=!1,We()}}}async function Ht(e=!1){if(Wr(),!!Qe&&!(!z.isSignedIn||!z.accessToken)){if(xn=setInterval(()=>{Qt(!0)},Math.max(1,Me)*60*1e3),!e){let n=Date.now(),i=Math.max(1,Me)*60*1e3;(!Pe||n-Pe>=i)&&Qt(!0)}We()}}async function Ko(){Qe=!Qe,await jn(),await Ht(),We()}async function Wo(){let e=prompt("Set Auto Backup interval (minutes):",String(Me));if(e===null)return;let n=Math.floor(Number(e));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Me=n,await jn(),await Ht(),We()}var Vn=window.location.hash;if(Vn&&Vn.length>1){let e=new URLSearchParams(Vn.substring(1));if(e.get("state")==="timekeeper_auth"){let i=e.get("access_token");if(i){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",i.length,"characters");try{let a=new BroadcastChannel("timekeeper_oauth"),d={type:"timekeeper_oauth_token",token:i};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:d.type,tokenLength:i.length}),a.postMessage(d),a.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(a){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",a);let d={type:"timekeeper_oauth_token",token:i,timestamp:Date.now()},r=indexedDB.open("ytls-timestamps-db",3);r.onsuccess=()=>{let y=r.result,c=y.transaction("settings","readwrite");c.objectStore("settings").put({key:"oauth_message",value:d}),c.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",d.timestamp),y.close()}}}if(history.replaceState){let a=window.location.pathname+window.location.search;history.replaceState(null,"",a)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(t){return GM.getValue(`timekeeper_${t}`,void 0)}function n(t,o){return GM.setValue(`timekeeper_${t}`,JSON.stringify(o))}if(Tn(e),wn(n),await Uo()){u("OAuth popup detected, broadcasting token and closing");return}await _n();let a=["/watch","/live"];function d(t=window.location.href){try{let o=new URL(t);return o.origin!=="https://www.youtube.com"?!1:a.some(s=>o.pathname===s||o.pathname.startsWith(`${s}/`))}catch(o){return u("Timekeeper failed to parse URL for support check:",o,"error"),!1}}let r=null,y=null,c=null,S=null,x=null,w=null,M=null,I=null,P=null,N=!1,U="ytls-timestamp-pending-delete",Z="ytls-timestamp-highlight",ee="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",j="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function he(){let t=o=>{let s=new Image;s.src=o};t(ee),t(j)}he();async function J(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(t=>setTimeout(t,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(t=>setTimeout(t,100));await new Promise(t=>setTimeout(t,200))}let le=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],xe=5e3,re=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function R(t){return re.has(t)}function F(){return document.querySelector("video")}let oe=null;function Q(){if(oe&&document.contains(oe))return oe;let t=document.getElementById("movie_player");return t&&document.contains(t)?t:null}function ge(t){return le.every(o=>typeof t?.[o]=="function"?!0:R(o)?!!F():!1)}function ct(t){return le.filter(o=>typeof t?.[o]=="function"?!1:R(o)?!F():!0)}async function ze(t=xe){let o=Date.now();for(;Date.now()-o<t;){let m=Q();if(ge(m))return m;await new Promise(g=>setTimeout(g,100))}let s=Q();return ge(s),s}let Ce="timestampOffsetSeconds",Ge=-5,ie="shiftClickTimeSkipSeconds",Oe=10,we=new BroadcastChannel("ytls_timestamp_channel");function ot(t){try{we.postMessage(t)}catch(o){u("BroadcastChannel error, reopening:",o,"warn");try{we=new BroadcastChannel("ytls_timestamp_channel"),we.onmessage=$e,we.postMessage(t)}catch(s){u("Failed to reopen BroadcastChannel:",s,"error")}}}function $e(t){if(u("Received message from another tab:",t.data),!(!d()||!c||!r)&&t.data){if(t.data.type==="timestamps_updated"&&t.data.videoId===ae)u("Debouncing timestamp load due to external update for video:",t.data.videoId),clearTimeout(be),be=setTimeout(()=>{u("Reloading timestamps due to external update for video:",t.data.videoId),ro()},500);else if(t.data.type==="window_position_updated"&&r){let o=t.data.position;o&&typeof o.x=="number"&&typeof o.y=="number"&&(r.style.left=`${Math.max(0,o.x)}px`,r.style.top=`${Math.max(0,o.y)}px`,r.style.right="auto",r.style.bottom="auto",tt={x:Math.max(0,Math.round(o.x)),y:Math.max(0,Math.round(o.y))},It())}}}we.onmessage=$e;let Ue=await GM.getValue(Ce);(typeof Ue!="number"||Number.isNaN(Ue))&&(Ue=Ge,await GM.setValue(Ce,Ue));let qe=await GM.getValue(ie);(typeof qe!="number"||Number.isNaN(qe))&&(qe=Oe,await GM.setValue(ie,qe));let be=null,ne=new Map,Ye=!1,D=null,dt=null,ae=null,De=null,et=null,Ze=null,_e=null,mt=!1,tt=null,tn=null,nn=null,on=null,rn=null,an=null,sn=null,ln=null,Nt=null,Rt=null,Gt=null,Kn=0,Ut=!1,vt=null,qt=null;function ue(){return c?Array.from(c.querySelectorAll("li")):[]}function En(){return ue().map(t=>{let o=t.querySelector("a[data-time]"),s=o?.dataset.time;if(!o||!s)return null;let m=Number.parseInt(s,10);if(!Number.isFinite(m))return null;let f=t.querySelector("input")?.value??"",l=t.dataset.guid??crypto.randomUUID();return t.dataset.guid||(t.dataset.guid=l),{start:m,comment:f,guid:l}}).filter(Zn)}function St(){if(qt!==null)return qt;let t=ue();return qt=t.length>0?Math.max(...t.map(o=>{let s=o.querySelector("a[data-time]")?.getAttribute("data-time");return s?Number.parseInt(s,10):0})):0,qt}function un(){qt=null}function Yo(t){let o=t.querySelector(".time-diff");return o?(o.textContent?.trim()||"").startsWith("-"):!1}function Zo(t,o){return t?o?"\u2514\u2500 ":"\u251C\u2500 ":""}function _t(t){return t.startsWith("\u251C\u2500 ")||t.startsWith("\u2514\u2500 ")?1:0}function Wn(t){return t.replace(/^[├└]─\s/,"")}function Jo(t){let o=ue();if(t>=o.length-1)return"\u2514\u2500 ";let s=o[t+1].querySelector("input");return s&&_t(s.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function nt(){if(!c)return;let t=ue(),o=!0,s=0,m=t.length;for(;o&&s<m;)o=!1,s++,t.forEach((g,f)=>{let l=g.querySelector("input");if(!l||!(_t(l.value)===1))return;let b=!1;if(f<t.length-1){let A=t[f+1].querySelector("input");A&&(b=!(_t(A.value)===1))}else b=!0;let E=Wn(l.value),C=`${Zo(!0,b)}${E}`;l.value!==C&&(l.value=C,o=!0)})}function yt(){if(c)for(;c.firstChild;)c.removeChild(c.firstChild)}function Yn(t){if(!(!r||!c)){if(N=t,t)r.classList.add("ytls-fade-out"),r.classList.remove("ytls-fade-in"),setTimeout(()=>{r.style.display="none"},300);else if(r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),x){let o=Q();if(o){let s=o.getCurrentTime(),m=Number.isFinite(s)?Math.max(0,Math.floor(s)):Math.max(0,St()),g=Math.floor(m/3600),f=Math.floor(m/60)%60,l=m%60,{isLive:v}=o.getVideoData()||{isLive:!1},b=c?Array.from(c.children).map(L=>{let C=L.querySelector("a[data-time]");return C?parseFloat(C.getAttribute("data-time")):0}):[],E="";if(b.length>0)if(v){let L=Math.max(1,m/60),C=b.filter(A=>A<=m);if(C.length>0){let A=(C.length/L).toFixed(2);parseFloat(A)>0&&(E=` (${A}/min)`)}}else{let L=o.getDuration(),C=Number.isFinite(L)&&L>0?L:0,A=Math.max(1,C/60),O=(b.length/A).toFixed(1);parseFloat(O)>0&&(E=` (${O}/min)`)}x.textContent=`\u23F3${g?g+":"+String(f).padStart(2,"0"):f}:${String(l).padStart(2,"0")}${E}`}}rt()}}function Zn(t){return!!t&&Number.isFinite(t.start)&&typeof t.comment=="string"&&typeof t.guid=="string"}function cn(t,o){t.textContent=ht(o),t.dataset.time=String(o),t.href=po(o,window.location.href)}let dn=null,mn=null,Jn=null,bt=!1;function Xo(t){if(!t||typeof t.getVideoData!="function"||!t.getVideoData()?.isLive)return!1;if(typeof t.getProgressState=="function"){let s=t.getProgressState(),m=Number(s?.seekableEnd??s?.liveHead??s?.head??s?.duration),g=Number(s?.current??t.getCurrentTime?.());if(Number.isFinite(m)&&Number.isFinite(g))return m-g>2}return!1}function Sn(t,o){if(!Number.isFinite(t))return;let s=fn(t),m=s?.dataset.guid??null;m&&(Jn=m),jt(s,o)}function fn(t){if(!Number.isFinite(t))return null;let o=ue();if(o.length===0)return null;let s=null,m=-1/0;for(let g of o){let l=g.querySelector("a[data-time]")?.dataset.time;if(!l)continue;let v=Number.parseInt(l,10);Number.isFinite(v)&&v<=t&&v>m&&(m=v,s=g)}return s}function jt(t,o=!1){if(!t)return;ue().forEach(m=>{m.classList.contains(U)||m.classList.remove(Z)}),t.classList.contains(U)||(t.classList.add(Z),o&&!Ye&&t.scrollIntoView({behavior:"smooth",block:"center"}))}function Qo(t){if(!c||c.querySelector(".ytls-error-message")||!Number.isFinite(t)||t===0)return!1;let o=ue();if(o.length===0)return!1;let s=!1;return o.forEach(m=>{let g=m.querySelector("a[data-time]"),f=g?.dataset.time;if(!g||!f)return;let l=Number.parseInt(f,10);if(!Number.isFinite(l))return;let v=Math.max(0,l+t);v!==l&&(cn(g,v),s=!0)}),s?(Kt(),nt(),Ae(),hn(ae),vt=null,!0):!1}function Xn(t,o={}){if(!Number.isFinite(t)||t===0)return!1;if(!Qo(t)){if(o.alertOnNoChange){let l=o.failureMessage??"Offset did not change any timestamps.";alert(l)}return!1}let m=o.logLabel??"bulk offset";u(`Timestamps changed: Offset all timestamps by ${t>0?"+":""}${t} seconds (${m})`);let g=Q(),f=g?Math.floor(g.getCurrentTime()):0;if(Number.isFinite(f)){let l=fn(f);jt(l,!1)}return!0}function Qn(t){if(!c||N)return;let o=t.target instanceof HTMLElement?t.target:null;if(o)if(o.dataset.time){t.preventDefault();let s=Number(o.dataset.time);if(Number.isFinite(s)){bt=!0;let g=Q();g&&g.seekTo(s),setTimeout(()=>{bt=!1},500)}let m=o.closest("li");m&&(ue().forEach(g=>{g.classList.contains(U)||g.classList.remove(Z)}),m.classList.contains(U)||(m.classList.add(Z),m.scrollIntoView({behavior:"smooth",block:"center"})))}else if(o.dataset.increment){t.preventDefault();let m=o.parentElement?.querySelector("a[data-time]");if(!m||!m.dataset.time)return;let g=parseInt(m.dataset.time,10),f=parseInt(o.dataset.increment,10);if("shiftKey"in t&&t.shiftKey&&(f*=qe),"altKey"in t?t.altKey:!1){Xn(f,{logLabel:"Alt adjust"});return}let b=Math.max(0,g+f);u(`Timestamps changed: Timestamp time incremented from ${g} to ${b}`),cn(m,b),un();let E=o.closest("li");if(mn=b,dn&&clearTimeout(dn),bt=!0,dn=setTimeout(()=>{if(mn!==null){let L=Q();L&&L.seekTo(mn)}dn=null,mn=null,setTimeout(()=>{bt=!1},500)},500),Kt(),nt(),Ae(),E){let L=E.querySelector("input"),C=E.dataset.guid;L&&C&&(Lt(ae,C,b,L.value),vt=C)}}else o.dataset.action==="clear"&&(t.preventDefault(),u("Timestamps changed: All timestamps cleared from UI"),c.textContent="",un(),Ae(),pn(),hn(ae),vt=null)}function Vt(t,o="",s=!1,m=null){if(!c)return null;let g=Math.max(0,t),f=m??crypto.randomUUID(),l=document.createElement("li"),v=document.createElement("div"),b=document.createElement("span"),E=document.createElement("span"),L=document.createElement("span"),C=document.createElement("a"),A=document.createElement("span"),O=document.createElement("input"),Y=document.createElement("button");l.dataset.guid=f,v.className="time-row";let se=document.createElement("div");se.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",Ie(se,"Click to toggle indent");let me=document.createElement("span");me.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let Be=()=>{let X=_t(O.value);me.textContent=X===1?"\u25C0":"\u25B6"},Te=X=>{X.stopPropagation();let V=_t(O.value),ce=Wn(O.value),de=V===0?1:0,ke="";if(de===1){let Ft=ue().indexOf(l);ke=Jo(Ft)}O.value=`${ke}${ce}`,Be(),nt();let Ve=Number.parseInt(C.dataset.time??"0",10);Lt(ae,f,Ve,O.value)};se.onclick=Te,se.append(me),l.style.cssText="position:relative;padding-left:20px;",l.addEventListener("mouseenter",()=>{Be(),me.style.display="inline"}),l.addEventListener("mouseleave",()=>{me.style.display="none"}),l.addEventListener("mouseleave",()=>{l.dataset.guid===vt&&Yo(l)&&eo()}),O.value=o||"",O.style.cssText="width:100%;margin-top:5px;display:block;",O.type="text",O.setAttribute("inputmode","text"),O.autocapitalize="off",O.autocomplete="off",O.spellcheck=!1,O.addEventListener("focusin",()=>{Ut=!1}),O.addEventListener("focusout",X=>{let V=X.relatedTarget,ce=Date.now()-Kn<250,de=!!V&&!!r&&r.contains(V);!ce&&!de&&(Ut=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(O.focus({preventScroll:!0}),Ut=!1)},0))}),O.addEventListener("input",X=>{let V=X;if(V&&(V.isComposing||V.inputType==="insertCompositionText"))return;let ce=ne.get(f);ce&&clearTimeout(ce);let de=setTimeout(()=>{let ke=Number.parseInt(C.dataset.time??"0",10);Lt(ae,f,ke,O.value),ne.delete(f)},500);ne.set(f,de)}),O.addEventListener("compositionend",()=>{let X=Number.parseInt(C.dataset.time??"0",10);setTimeout(()=>{Lt(ae,f,X,O.value)},50)}),b.textContent="\u2796",b.dataset.increment="-1",b.style.cursor="pointer",b.style.margin="0px",b.addEventListener("mouseenter",()=>{b.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),b.addEventListener("mouseleave",()=>{b.style.textShadow="none"}),L.textContent="\u2795",L.dataset.increment="1",L.style.cursor="pointer",L.style.margin="0px",L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),E.textContent="\u23FA\uFE0F",E.style.cursor="pointer",E.style.margin="0px",Ie(E,"Set to current playback time"),E.addEventListener("mouseenter",()=>{E.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),E.addEventListener("mouseleave",()=>{E.style.textShadow="none"}),E.onclick=()=>{let X=Q(),V=X?Math.floor(X.getCurrentTime()):0;Number.isFinite(V)&&(u(`Timestamps changedset to current playback time ${V}`),cn(C,V),Kt(),nt(),Lt(ae,f,V,O.value),vt=f)},cn(C,g),un(),Y.textContent="\u{1F5D1}\uFE0F",Y.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",Y.addEventListener("mouseenter",()=>{Y.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),Y.addEventListener("mouseleave",()=>{Y.style.textShadow="none"}),Y.onclick=()=>{if(l.dataset.deleteConfirmed==="true"){u("Timestamps changed: Timestamp deleted");let X=l.dataset.guid??"";l.remove(),un(),Kt(),nt(),Ae(),pn(),tr(ae,X),vt=null}else{l.dataset.deleteConfirmed="true",l.classList.add(U),l.classList.remove(Z);let X=()=>{l.dataset.deleteConfirmed="false",l.classList.remove(U);let de=Q(),ke=de?de.getCurrentTime():0,Ve=Number.parseInt(l.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(ke)&&Number.isFinite(Ve)&&ke>=Ve&&l.classList.add(Z)},V=de=>{de.target!==Y&&(X(),l.removeEventListener("click",V,!0),document.removeEventListener("click",V,!0))},ce=()=>{l.dataset.deleteConfirmed==="true"&&(X(),c&&c.removeEventListener("mouseleave",ce),l.removeEventListener("click",V,!0),document.removeEventListener("click",V,!0))};l.addEventListener("click",V,!0),document.addEventListener("click",V,!0),c&&c.addEventListener("mouseleave",ce),setTimeout(()=>{l.dataset.deleteConfirmed==="true"&&X(),l.removeEventListener("click",V,!0),document.removeEventListener("click",V,!0),c&&c.removeEventListener("mouseleave",ce)},5e3)}},A.className="time-diff",A.style.color="#888",A.style.marginLeft="5px",v.append(b,E,L,C,A,Y),l.append(se,v,O);let Je=Number.parseInt(C.dataset.time??"0",10),wt=!1,Xe=ue();for(let X=0;X<Xe.length;X++){let V=Xe[X],de=V.querySelector("a[data-time]")?.dataset.time;if(!de)continue;let ke=Number.parseInt(de,10);if(Number.isFinite(ke)&&Je<ke){c.insertBefore(l,V),wt=!0;let Ve=Xe[X-1];if(Ve){let p=Ve.querySelector("a[data-time]")?.dataset.time;if(p){let h=Number.parseInt(p,10);Number.isFinite(h)&&(A.textContent=ht(Je-h))}}else A.textContent="";let ft=V.querySelector(".time-diff");ft&&(ft.textContent=ht(ke-Je));break}}if(!wt&&(c.appendChild(l),Xe.length>0)){let ce=Xe[Xe.length-1].querySelector("a[data-time]")?.dataset.time;if(ce){let de=Number.parseInt(ce,10);Number.isFinite(de)&&(A.textContent=ht(Je-de))}}return l.scrollIntoView({behavior:"smooth",block:"center"}),pn(),nt(),Ae(),s||(Lt(ae,f,g,o),vt=f,jt(l,!1)),O}function Kt(){if(!c||c.querySelector(".ytls-error-message"))return;let t=ue();t.forEach((o,s)=>{let m=o.querySelector(".time-diff");if(!m)return;let f=o.querySelector("a[data-time]")?.dataset.time;if(!f){m.textContent="";return}let l=Number.parseInt(f,10);if(!Number.isFinite(l)){m.textContent="";return}if(s===0){m.textContent="";return}let E=t[s-1].querySelector("a[data-time]")?.dataset.time;if(!E){m.textContent="";return}let L=Number.parseInt(E,10);if(!Number.isFinite(L)){m.textContent="";return}let C=l-L,A=C<0?"-":"";m.textContent=` ${A}${ht(Math.abs(C))}`})}function eo(){if(!c||c.querySelector(".ytls-error-message")||N)return;let t=null;if(document.activeElement instanceof HTMLInputElement&&c.contains(document.activeElement)){let l=document.activeElement,b=l.closest("li")?.dataset.guid;if(b){let E=l.selectionStart??l.value.length,L=l.selectionEnd??E,C=l.scrollLeft;t={guid:b,start:E,end:L,scroll:C}}}let o=ue(),s=o.map(l=>l.dataset.guid),m=o.map(l=>{let v=l.querySelector("a[data-time]"),b=v?.dataset.time;if(!v||!b)return null;let E=Number.parseInt(b,10);if(!Number.isFinite(E))return null;let L=l.dataset.guid??"";return{time:E,guid:L,element:l}}).filter(l=>l!==null).sort((l,v)=>{let b=l.time-v.time;return b!==0?b:l.guid.localeCompare(v.guid)}),g=m.map(l=>l.guid),f=s.length!==g.length||s.some((l,v)=>l!==g[v]);for(;c.firstChild;)c.removeChild(c.firstChild);if(m.forEach(l=>{c.appendChild(l.element)}),Kt(),nt(),Ae(),t){let v=ue().find(b=>b.dataset.guid===t.guid)?.querySelector("input");if(v)try{v.focus({preventScroll:!0})}catch{}}f&&(u("Timestamps changed: Timestamps sorted"),hn(ae))}function pn(){if(!c)return;c.children.length>2?(c.style.maxHeight="200px",c.style.overflowY="auto"):(c.style.maxHeight="none",c.style.overflowY="hidden")}function Ae(){if(!c)return;let t=F(),o=document.querySelector(".ytp-progress-bar"),s=Q(),m=s?s.getVideoData():null,g=!!m&&!!m.isLive;if(!t||!o||!isFinite(t.duration)||g)return;oo(),ue().map(l=>{let v=l.querySelector("a[data-time]"),b=v?.dataset.time;if(!v||!b)return null;let E=Number.parseInt(b,10);if(!Number.isFinite(E))return null;let C=l.querySelector("input")?.value??"",A=l.dataset.guid??crypto.randomUUID();return l.dataset.guid||(l.dataset.guid=A),{start:E,comment:C,guid:A}}).filter(Zn).forEach(l=>{if(!Number.isFinite(l.start))return;let v=document.createElement("div");v.className="ytls-marker",v.style.position="absolute",v.style.height="100%",v.style.width="2px",v.style.backgroundColor="#ff0000",v.style.cursor="pointer",v.style.left=l.start/t.duration*100+"%",v.dataset.time=String(l.start),v.addEventListener("click",()=>{let b=Q();b&&b.seekTo(l.start)}),o.appendChild(v)})}function hn(t){if(!c||c.querySelector(".ytls-error-message")||!t)return;if(N){u("Save blocked: timestamps are currently loading");return}nt();let o=En().sort((s,m)=>s.start-m.start);so(t,o).then(()=>u(`Successfully saved ${o.length} timestamps for ${t} to IndexedDB`)).catch(s=>u(`Failed to save timestamps for ${t} to IndexedDB:`,s,"error")),ot({type:"timestamps_updated",videoId:t,action:"saved"})}function er(t){let o=t.querySelector("a[data-time]"),s=t.querySelector("input"),m=t.dataset.guid;return!o||!s||!m?null:{start:Number.parseInt(o.dataset.time??"0",10),comment:s.value,guid:m}}function Zr(t,o){if(!t||N)return;let s=er(o);s&&(lo(t,s).catch(m=>u(`Failed to save timestamp ${s.guid}:`,m,"error")),ot({type:"timestamps_updated",videoId:t,action:"saved"}))}function Lt(t,o,s,m){if(!t||N)return;let g={guid:o,start:s,comment:m};u(`Saving timestamp: guid=${o}, start=${s}, comment="${m}"`),lo(t,g).catch(f=>u(`Failed to save timestamp ${o}:`,f,"error")),ot({type:"timestamps_updated",videoId:t,action:"saved"})}function tr(t,o){!t||N||(u(`Deleting timestamp: guid=${o}`),cr(t,o).catch(s=>u(`Failed to delete timestamp ${o}:`,s,"error")),ot({type:"timestamps_updated",videoId:t,action:"saved"}))}async function to(t){if(!c||c.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let o=ae;if(!o)return;u(`Exporting timestamps for video ID: ${o}`);let s=En(),m=Math.max(St(),0),g=Bn();if(t==="json"){let f=new Blob([JSON.stringify(s,null,2)],{type:"application/json"}),l=URL.createObjectURL(f),v=document.createElement("a");v.href=l,v.download=`timestamps-${o}-${g}.json`,v.click(),URL.revokeObjectURL(l)}else if(t==="text"){let f=s.map(E=>{let L=ht(E.start,m),C=`${E.comment} <!-- guid:${E.guid} -->`.trimStart();return`${L} ${C}`}).join(`
`),l=new Blob([f],{type:"text/plain"}),v=URL.createObjectURL(l),b=document.createElement("a");b.href=v,b.download=`timestamps-${o}-${g}.txt`,b.click(),URL.revokeObjectURL(v)}}function no(t){if(!r||!c){u("Timekeeper error:",t,"error");return}yt();let o=document.createElement("li");o.textContent=t,o.classList.add("ytls-error-message"),o.style.color="#ff6b6b",o.style.fontWeight="bold",o.style.padding="8px",o.style.background="rgba(255, 0, 0, 0.1)",c.appendChild(o),Ae()}function oo(){document.querySelectorAll(".ytls-marker").forEach(t=>t.remove())}function It(){if(!r||!document.body.contains(r))return;let t=r.getBoundingClientRect(),o=document.documentElement.clientWidth,s=document.documentElement.clientHeight,m=t.width,g=t.height;if(t.left<0&&(r.style.left="0",r.style.right="auto"),t.right>o){let f=Math.max(0,o-m);r.style.left=`${f}px`,r.style.right="auto"}if(t.top<0&&(r.style.top="0",r.style.bottom="auto"),t.bottom>s){let f=Math.max(0,s-g);r.style.top=`${f}px`,r.style.bottom="auto"}}function nr(){tn&&(document.removeEventListener("mousemove",tn),tn=null),nn&&(document.removeEventListener("mouseup",nn),nn=null),Nt&&(document.removeEventListener("keydown",Nt),Nt=null),on&&(window.removeEventListener("resize",on),on=null),Rt&&(document.removeEventListener("pointerdown",Rt,!0),Rt=null),Gt&&(document.removeEventListener("pointerup",Gt,!0),Gt=null);let t=F();t&&(rn&&(t.removeEventListener("timeupdate",rn),rn=null),an&&(t.removeEventListener("pause",an),an=null),sn&&(t.removeEventListener("play",sn),sn=null),ln&&(t.removeEventListener("seeking",ln),ln=null))}function or(){oo(),ne.forEach(o=>clearTimeout(o)),ne.clear(),be&&(clearTimeout(be),be=null),P&&(clearInterval(P),P=null),Ze&&(clearTimeout(Ze),Ze=null),Jn=null,nr();try{we.close()}catch{}D&&D.parentNode===document.body&&document.body.removeChild(D),D=null,dt=null,Ye=!1,ae=null,De=null,et&&(et.disconnect(),et=null),r&&r.parentNode&&r.remove();let t=document.getElementById("ytls-header-button");t&&t.parentNode&&t.remove(),_e=null,mt=!1,tt=null,yt(),r=null,y=null,c=null,S=null,x=null,w=null,M=null,oe=null}async function rr(){let t=Ln();if(!t)return oe=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let o=await ze();if(!ge(o)){let s=ct(o),m=s.length?` Missing methods: ${s.join(", ")}.`:"",g=o?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return oe=null,{ok:!1,message:`${g}${m} Try refreshing once playback is ready.`}}return oe=o,{ok:!0,player:o,videoId:t}}async function ro(){if(!r||!c)return;let t=c.scrollTop,o=!0,s=()=>{if(!c||!o)return;let m=Math.max(0,c.scrollHeight-c.clientHeight);c.scrollTop=Math.min(t,m)};try{let m=await rr();if(!m.ok){no(m.message),yt(),Ae();return}let{videoId:g}=m;x&&De&&Ie(x,()=>De||"");let f=[];try{let l=await dr(g);l?(f=l.map(v=>({...v,guid:v.guid||crypto.randomUUID()})),u(`Loaded ${f.length} timestamps from IndexedDB for ${g}`)):u(`No timestamps found in IndexedDB for ${g}`)}catch(l){u(`Failed to load timestamps from IndexedDB for ${g}:`,l,"error"),yt(),Ae();return}if(f.length>0){f.sort((b,E)=>b.start-E.start),yt(),f.forEach(b=>{Vt(b.start,b.comment,!0,b.guid)}),nt(),Ae();let l=Q(),v=l?Math.floor(l.getCurrentTime()):St();Number.isFinite(v)&&(Sn(v,!0),o=!1)}else yt(),Ae()}catch(m){u("Unexpected error while loading timestamps:",m,"error"),no("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{requestAnimationFrame(s)}}function Ln(){let o=new URLSearchParams(location.search).get("v");if(o)return o;let s=document.querySelector('meta[itemprop="identifier"]');return s?.content?s.content:null}function io(){let t=document.querySelector('meta[name="title"]');return t?.content?t.content:document.title.replace(" - YouTube","")}function ir(){let t=F();if(!t)return;let o=()=>{if(!c)return;let l=Q(),v=l?Math.floor(l.getCurrentTime()):0;if(!Number.isFinite(v))return;let b=fn(v);jt(b,!1)},s=l=>{try{let v=new URL(window.location.href);l!==null&&Number.isFinite(l)?v.searchParams.set("t",`${Math.floor(l)}s`):v.searchParams.delete("t"),window.history.replaceState({},"",v.toString())}catch{}},m=()=>{let l=Q(),v=l?Math.floor(l.getCurrentTime()):0;Number.isFinite(v)&&s(v)},g=()=>{s(null)},f=()=>{let l=F();if(!l)return;let v=Q(),b=v?Math.floor(v.getCurrentTime()):0;if(!Number.isFinite(b))return;l.paused&&s(b);let E=fn(b);jt(E,!0)};rn=o,an=m,sn=g,ln=f,t.addEventListener("timeupdate",o),t.addEventListener("pause",m),t.addEventListener("play",g),t.addEventListener("seeking",f)}let ar="ytls-timestamps-db",sr=3,Mt="timestamps",je="timestamps_v2",xt="settings",Ct=null,Dt=null;function At(){if(Ct)try{if(Ct.objectStoreNames.length>=0)return Promise.resolve(Ct)}catch(t){u("IndexedDB connection is no longer usable:",t,"warn"),Ct=null}return Dt||(Dt=ur().then(t=>(Ct=t,Dt=null,t.onclose=()=>{u("IndexedDB connection closed unexpectedly","warn"),Ct=null},t.onerror=o=>{u("IndexedDB connection error:",o,"error")},t)).catch(t=>{throw Dt=null,t}),Dt)}async function ao(){let t={},o=await fr(je),s=new Map;for(let f of o){let l=f;s.has(l.video_id)||s.set(l.video_id,[]),s.get(l.video_id).push({guid:l.guid,start:l.start,comment:l.comment})}for(let[f,l]of s)t[`ytls-${f}`]={video_id:f,timestamps:l.sort((v,b)=>v.start-b.start)};return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:o.length}}async function lr(){try{let{json:t,filename:o,totalVideos:s,totalTimestamps:m}=await ao(),g=new Blob([t],{type:"application/json"}),f=URL.createObjectURL(g),l=document.createElement("a");l.href=f,l.download=o,l.click(),URL.revokeObjectURL(f),u(`Exported ${s} videos with ${m} timestamps`)}catch(t){throw u("Failed to export data:",t,"error"),t}}function ur(){return new Promise((t,o)=>{let s=indexedDB.open(ar,sr);s.onupgradeneeded=m=>{let g=m.target.result,f=m.oldVersion,l=m.target.transaction;if(f<1&&g.createObjectStore(Mt,{keyPath:"video_id"}),f<2&&!g.objectStoreNames.contains(xt)&&g.createObjectStore(xt,{keyPath:"key"}),f<3){if(g.objectStoreNames.contains(Mt)){u("Exporting backup before v2 migration...");let E=l.objectStore(Mt).getAll();E.onsuccess=()=>{let L=E.result;if(L.length>0)try{let C={},A=0;L.forEach(me=>{if(Array.isArray(me.timestamps)&&me.timestamps.length>0){let Be=me.timestamps.map(Te=>({guid:Te.guid||crypto.randomUUID(),start:Te.start,comment:Te.comment}));C[`ytls-${me.video_id}`]={video_id:me.video_id,timestamps:Be.sort((Te,Je)=>Te.start-Je.start)},A+=Be.length}});let O=new Blob([JSON.stringify(C,null,2)],{type:"application/json"}),Y=URL.createObjectURL(O),se=document.createElement("a");se.href=Y,se.download=`timekeeper-data-${Bn()}.json`,se.click(),URL.revokeObjectURL(Y),u(`Pre-migration backup exported: ${L.length} videos, ${A} timestamps`)}catch(C){u("Failed to export pre-migration backup:",C,"error")}}}let v=g.createObjectStore(je,{keyPath:"guid"});if(v.createIndex("video_id","video_id",{unique:!1}),v.createIndex("video_start",["video_id","start"],{unique:!1}),g.objectStoreNames.contains(Mt)){let E=l.objectStore(Mt).getAll();E.onsuccess=()=>{let L=E.result;if(L.length>0){let C=0;L.forEach(A=>{Array.isArray(A.timestamps)&&A.timestamps.length>0&&A.timestamps.forEach(O=>{v.put({guid:O.guid||crypto.randomUUID(),video_id:A.video_id,start:O.start,comment:O.comment}),C++})}),u(`Migrated ${C} timestamps from ${L.length} videos to v2 store`)}},g.deleteObjectStore(Mt),u("Deleted old timestamps store after migration to v2")}}},s.onsuccess=m=>{t(m.target.result)},s.onerror=m=>{let g=m.target.error;o(g??new Error("Failed to open IndexedDB"))}})}function Bt(t,o,s){return At().then(m=>new Promise((g,f)=>{let l;try{l=m.transaction(t,o)}catch(E){f(new Error(`Failed to create transaction for ${t}: ${E}`));return}let v=l.objectStore(t),b;try{b=s(v)}catch(E){f(new Error(`Failed to execute operation on ${t}: ${E}`));return}b&&(b.onsuccess=()=>g(b.result),b.onerror=()=>f(b.error??new Error(`IndexedDB ${o} operation failed`))),l.oncomplete=()=>{b||g(void 0)},l.onerror=()=>f(l.error??new Error("IndexedDB transaction failed")),l.onabort=()=>f(l.error??new Error("IndexedDB transaction aborted"))}))}function so(t,o){return At().then(s=>new Promise((m,g)=>{let f;try{f=s.transaction([je],"readwrite")}catch(E){g(new Error(`Failed to create transaction: ${E}`));return}let l=f.objectStore(je),b=l.index("video_id").getAll(IDBKeyRange.only(t));b.onsuccess=()=>{try{let E=b.result,L=new Set(E.map(A=>A.guid)),C=new Set(o.map(A=>A.guid));E.forEach(A=>{C.has(A.guid)||l.delete(A.guid)}),o.forEach(A=>{l.put({guid:A.guid,video_id:t,start:A.start,comment:A.comment})})}catch(E){u("Error during save operation:",E,"error")}},b.onerror=()=>{g(b.error??new Error("Failed to get existing records"))},f.oncomplete=()=>m(),f.onerror=()=>g(f.error??new Error("Failed to save to IndexedDB")),f.onabort=()=>g(f.error??new Error("Transaction aborted during save"))}))}function lo(t,o){return At().then(s=>new Promise((m,g)=>{let f;try{f=s.transaction([je],"readwrite")}catch(b){g(new Error(`Failed to create transaction: ${b}`));return}let v=f.objectStore(je).put({guid:o.guid,video_id:t,start:o.start,comment:o.comment});v.onerror=()=>{g(v.error??new Error("Failed to put timestamp"))},f.oncomplete=()=>m(),f.onerror=()=>g(f.error??new Error("Failed to save single timestamp to IndexedDB")),f.onabort=()=>g(f.error??new Error("Transaction aborted during single timestamp save"))}))}function cr(t,o){return At().then(s=>new Promise((m,g)=>{let f;try{f=s.transaction([je],"readwrite")}catch(b){g(new Error(`Failed to create transaction: ${b}`));return}let v=f.objectStore(je).delete(o);v.onerror=()=>{g(v.error??new Error("Failed to delete timestamp"))},f.oncomplete=()=>m(),f.onerror=()=>g(f.error??new Error("Failed to delete single timestamp from IndexedDB")),f.onabort=()=>g(f.error??new Error("Transaction aborted during timestamp deletion"))}))}function dr(t){return At().then(o=>new Promise((s,m)=>{let g;try{g=o.transaction([je],"readonly")}catch(b){u("Failed to create read transaction:",b,"warn"),s(null);return}let v=g.objectStore(je).index("video_id").getAll(IDBKeyRange.only(t));v.onsuccess=()=>{let b=v.result;if(b.length>0){let E=b.map(L=>({guid:L.guid,start:L.start,comment:L.comment})).sort((L,C)=>L.start-C.start);s(E)}else s(null)},v.onerror=()=>{u("Failed to load timestamps:",v.error,"warn"),s(null)},g.onabort=()=>{u("Transaction aborted during load:",g.error,"warn"),s(null)}}))}function mr(t){return At().then(o=>new Promise((s,m)=>{let g;try{g=o.transaction([je],"readwrite")}catch(b){m(new Error(`Failed to create transaction: ${b}`));return}let f=g.objectStore(je),v=f.index("video_id").getAll(IDBKeyRange.only(t));v.onsuccess=()=>{try{v.result.forEach(E=>{f.delete(E.guid)})}catch(b){u("Error during remove operation:",b,"error")}},v.onerror=()=>{m(v.error??new Error("Failed to get records for removal"))},g.oncomplete=()=>s(),g.onerror=()=>m(g.error??new Error("Failed to remove timestamps")),g.onabort=()=>m(g.error??new Error("Transaction aborted during timestamp removal"))}))}function fr(t){return Bt(t,"readonly",o=>o.getAll()).then(o=>Array.isArray(o)?o:[])}function In(t,o){Bt(xt,"readwrite",s=>{s.put({key:t,value:o})}).catch(s=>{u(`Failed to save setting '${t}' to IndexedDB:`,s,"error")})}function Mn(t){return Bt(xt,"readonly",o=>o.get(t)).then(o=>o?.value).catch(o=>{u(`Failed to load setting '${t}' from IndexedDB:`,o,"error")})}async function Jr(t){try{await Bt(xt,"readwrite",o=>{o.put({key:"oauth_message",value:t})})}catch(o){u("Failed to save OAuth message to IndexedDB:",o,"error")}}async function Xr(){try{return(await Bt(xt,"readonly",o=>o.get("oauth_message")))?.value??null}catch(t){return u("Failed to load OAuth message from IndexedDB:",t,"error"),null}}async function Qr(){try{await Bt(xt,"readwrite",t=>{t.delete("oauth_message")})}catch(t){u("Failed to delete OAuth message from IndexedDB:",t,"error")}}function uo(){if(!r)return;let t=r.style.display!=="none";In("uiVisible",t)}function rt(t){let o=typeof t=="boolean"?t:!!r&&r.style.display!=="none",s=document.getElementById("ytls-header-button");s instanceof HTMLButtonElement&&s.setAttribute("aria-pressed",String(o)),_e&&!mt&&_e.src!==ee&&(_e.src=ee)}function pr(){r&&Mn("uiVisible").then(t=>{let o=t;typeof o=="boolean"?(o?(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in")):r.style.display="none",rt(o)):(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),rt(!0))}).catch(t=>{u("Failed to load UI visibility state:",t,"error"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),rt(!0)})}function Cn(t){if(!r)return;Ze&&(clearTimeout(Ze),Ze=null);let o=r.style.display==="none";(typeof t=="boolean"?t:o)?(r.style.display="flex",r.classList.remove("ytls-fade-out"),r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),rt(!0),uo()):(r.classList.remove("ytls-fade-in"),r.classList.remove("ytls-zoom-in"),r.classList.add("ytls-zoom-out"),rt(!1),Ze=setTimeout(()=>{r&&(r.style.display="none",uo(),Ze=null)},400))}function co(t){if(!c){u("UI is not initialized; cannot import timestamps.","warn");return}let o=!1;try{let s=JSON.parse(t),m=null;if(Array.isArray(s))m=s;else if(typeof s=="object"&&s!==null){let g=ae;if(g){let f=`timekeeper-${g}`;s[f]&&Array.isArray(s[f].timestamps)&&(m=s[f].timestamps,u(`Found timestamps for current video (${g}) in export format`,"info"))}if(!m){let f=Object.keys(s).filter(l=>l.startsWith("ytls-"));if(f.length===1&&Array.isArray(s[f[0]].timestamps)){m=s[f[0]].timestamps;let l=s[f[0]].video_id;u(`Found timestamps for video ${l} in export format`,"info")}}}m&&Array.isArray(m)?m.every(f=>typeof f.start=="number"&&typeof f.comment=="string")?(m.forEach(f=>{if(f.guid){let l=ue().find(v=>v.dataset.guid===f.guid);if(l){let v=l.querySelector("input");v&&(v.value=f.comment)}else Vt(f.start,f.comment,!1,f.guid)}else Vt(f.start,f.comment,!1,crypto.randomUUID())}),o=!0):u("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):u("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!o){let s=t.split(`
`).map(m=>m.trim()).filter(m=>m);if(s.length>0){let m=!1;s.forEach(g=>{let f=g.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(f){m=!0;let l=parseInt(f[1])||0,v=parseInt(f[2]),b=parseInt(f[3]),E=l*3600+v*60+b,L=f[4]?f[4].trim():"",C=null,A=L,O=L.match(/<!--\s*guid:([^>]+?)\s*-->/);O&&(C=O[1].trim(),A=L.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let Y;if(C&&(Y=ue().find(se=>se.dataset.guid===C)),!Y&&!C&&(Y=ue().find(se=>{if(se.dataset.guid)return!1;let Be=se.querySelector("a[data-time]")?.dataset.time;if(!Be)return!1;let Te=Number.parseInt(Be,10);return Number.isFinite(Te)&&Te===E})),Y){let se=Y.querySelector("input");se&&(se.value=A)}else Vt(E,A,!1,C||crypto.randomUUID())}}),m&&(o=!0)}}o?(u("Timestamps changed: Imported timestamps from file/clipboard"),nt(),hn(ae),Ae(),pn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function hr(){if(r&&document.body.contains(r))return;document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),r=document.createElement("div"),y=document.createElement("div"),c=document.createElement("ul"),S=document.createElement("div"),x=document.createElement("span"),w=document.createElement("style"),M=document.createElement("span"),I=document.createElement("span"),I.classList.add("ytls-backup-indicator"),I.style.cursor="pointer",I.style.backgroundColor="#666",I.onclick=p=>{p.stopPropagation(),se("drive")},c.addEventListener("mouseenter",()=>{Ye=!0,Ut=!1}),c.addEventListener("mouseleave",()=>{if(Ye=!1,Ut)return;let p=Q(),h=p?Math.floor(p.getCurrentTime()):St();Sn(h,!0);let T=null;if(document.activeElement instanceof HTMLInputElement&&c.contains(document.activeElement)&&(T=document.activeElement.closest("li")?.dataset.guid??null),eo(),T){let B=ue().find($=>$.dataset.guid===T)?.querySelector("input");if(B)try{B.focus({preventScroll:!0})}catch{}}}),r.id="ytls-pane",y.id="ytls-pane-header",y.addEventListener("dblclick",p=>{let h=p.target instanceof HTMLElement?p.target:null;h&&(h.closest("a")||h.closest("button")||h.closest("#ytls-current-time")||h.closest(".ytls-version-display")||h.closest(".ytls-backup-indicator"))||(p.preventDefault(),Cn(!1))});let t=GM_info.script.version;M.textContent=`v${t}`,M.classList.add("ytls-version-display");let o=document.createElement("span");o.style.display="inline-flex",o.style.alignItems="center",o.style.gap="6px",o.appendChild(M),o.appendChild(I),x.id="ytls-current-time",x.textContent="\u23F3",x.onclick=()=>{bt=!0;let p=Q();p&&p.seekToLiveHead(),setTimeout(()=>{bt=!1},500)};function s(){if(N||bt)return;let p=F(),h=Q();if(!p&&!h)return;let T=h?h.getCurrentTime():0,k=Number.isFinite(T)?Math.max(0,Math.floor(T)):Math.max(0,St()),B=Math.floor(k/3600),$=Math.floor(k/60)%60,H=k%60,{isLive:q}=h?h.getVideoData()||{isLive:!1}:{isLive:!1},G=h?Xo(h):!1,te=c?Array.from(c.children).map(W=>{let fe=W.querySelector("a[data-time]");return fe?parseFloat(fe.getAttribute("data-time")):0}):[],Ee="";if(te.length>0)if(q){let W=Math.max(1,k/60),fe=te.filter(Se=>Se<=k);if(fe.length>0){let Se=(fe.length/W).toFixed(2);parseFloat(Se)>0&&(Ee=` (${Se}/min)`)}}else{let W=h?h.getDuration():0,fe=Number.isFinite(W)&&W>0?W:p&&Number.isFinite(p.duration)&&p.duration>0?p.duration:0,Se=Math.max(1,fe/60),it=(te.length/Se).toFixed(1);parseFloat(it)>0&&(Ee=` (${it}/min)`)}x.textContent=`\u23F3${B?B+":"+String($).padStart(2,"0"):$}:${String(H).padStart(2,"0")}${Ee}`,x.style.color=G?"#ff4d4f":"",te.length>0&&Sn(k,!1)}s(),P&&clearInterval(P),P=setInterval(s,1e3),S.id="ytls-buttons";let m=(p,h)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),h&&h()},300)},g=p=>h=>{h.key==="Escape"&&(h.preventDefault(),h.stopPropagation(),p())},f=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},l=(p,h)=>T=>{p.contains(T.target)||h()},v=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)},A=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!c||c.querySelector(".ytls-error-message")||N)return;let p=typeof Ue<"u"?Ue:0,h=Q(),T=h?Math.floor(h.getCurrentTime()+p):0;if(!Number.isFinite(T))return;let k=Vt(T,"");k&&k.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>se()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(p){if(!c||c.querySelector(".ytls-error-message")||N){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let h=En(),T=Math.max(St(),0);if(h.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let k=p.ctrlKey,B=h.map($=>{let H=ht($.start,T);return k?`${H} ${$.comment} <!-- guid:${$.guid} -->`.trimStart():`${H} ${$.comment}`}).join(`
`);navigator.clipboard.writeText(B).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch($=>{u("Failed to copy timestamps: ",$,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!c||c.querySelector(".ytls-error-message")||N)return;if(ue().length===0){alert("No timestamps available to offset.");return}let h=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(h===null)return;let T=h.trim();if(T.length===0)return;let k=Number.parseInt(T,10);if(!Number.isFinite(k)){alert("Please enter a valid integer number of seconds.");return}k!==0&&Xn(k,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let p=Ln();if(!p){alert("Unable to determine current video ID.");return}let h=document.createElement("div");h.id="ytls-delete-all-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let T=document.createElement("p");T.textContent="Hold the button to delete all timestamps for:",T.style.marginBottom="10px";let k=document.createElement("p");k.textContent=p,k.style.fontFamily="monospace",k.style.fontSize="12px",k.style.marginBottom="15px",k.style.color="#aaa";let B=document.createElement("button");B.classList.add("ytls-save-modal-button"),B.style.background="#d32f2f",B.style.position="relative",B.style.overflow="hidden";let $=null,H=0,q=null,G=document.createElement("div");G.style.position="absolute",G.style.left="0",G.style.top="0",G.style.height="100%",G.style.width="0%",G.style.background="#ff6b6b",G.style.transition="none",G.style.pointerEvents="none",B.appendChild(G);let te=document.createElement("span");te.textContent="Hold to Delete All",te.style.position="relative",te.style.zIndex="1",B.appendChild(te);let Ee=()=>{if(!H)return;let He=Date.now()-H,kt=Math.min(He/5e3*100,100);G.style.width=`${kt}%`,kt<100&&(q=requestAnimationFrame(Ee))},W=()=>{$&&(clearTimeout($),$=null),q&&(cancelAnimationFrame(q),q=null),H=0,G.style.width="0%",te.textContent="Hold to Delete All"};B.onmousedown=()=>{H=Date.now(),te.textContent="Deleting...",q=requestAnimationFrame(Ee),$=setTimeout(async()=>{W(),h.classList.remove("ytls-fade-in"),h.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(h)&&document.body.removeChild(h);try{await mr(p),Dn()}catch(He){u("Failed to delete all timestamps:",He,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},B.onmouseup=W,B.onmouseleave=W;let fe=null,Se=null,it=m(h,()=>{W(),fe&&document.removeEventListener("keydown",fe),Se&&document.removeEventListener("click",Se,!0)});fe=g(it),Se=l(h,it);let Tt=document.createElement("button");Tt.textContent="Cancel",Tt.classList.add("ytls-save-modal-cancel-button"),Tt.onclick=it,h.appendChild(T),h.appendChild(k),h.appendChild(B),h.appendChild(Tt),document.body.appendChild(h),f(fe),v(Se)}}],O=ho();A.forEach(p=>{let h=document.createElement("button");if(h.textContent=p.label,Ie(h,p.title),h.classList.add("ytls-main-button"),p.label==="\u{1F423}"&&O){let T=document.createElement("span");T.textContent=O,T.classList.add("ytls-holiday-emoji"),h.appendChild(T)}p.label==="\u{1F4CB}"?h.onclick=function(T){p.action.call(this,T)}:h.onclick=p.action,p.label==="\u2699\uFE0F"&&(dt=h),S.appendChild(h)});function Y(p,h,T){let k=document.createElement("button");return k.textContent=p,Ie(k,h),k.classList.add("ytls-settings-modal-button"),k.onclick=T,k}function se(p="general"){if(D&&D.parentNode===document.body){let Le=document.getElementById("ytls-save-modal"),pt=document.getElementById("ytls-load-modal"),at=document.getElementById("ytls-delete-all-modal");Le&&document.body.contains(Le)&&document.body.removeChild(Le),pt&&document.body.contains(pt)&&document.body.removeChild(pt),at&&document.body.contains(at)&&document.body.removeChild(at),D.classList.remove("ytls-fade-in"),D.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(D)&&document.body.removeChild(D),D=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",me)},300);return}D=document.createElement("div"),D.id="ytls-settings-modal",D.classList.remove("ytls-fade-out"),D.classList.add("ytls-fade-in");let h=document.createElement("div");h.className="ytls-modal-header";let T=document.createElement("div");T.id="ytls-settings-nav";let k=document.createElement("button");k.className="ytls-modal-close-button",k.textContent="\u2715",Ie(k,"Close"),k.onclick=()=>{if(D&&D.parentNode===document.body){let Le=document.getElementById("ytls-save-modal"),pt=document.getElementById("ytls-load-modal"),at=document.getElementById("ytls-delete-all-modal");Le&&document.body.contains(Le)&&document.body.removeChild(Le),pt&&document.body.contains(pt)&&document.body.removeChild(pt),at&&document.body.contains(at)&&document.body.removeChild(at),D.classList.remove("ytls-fade-in"),D.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(D)&&document.body.removeChild(D),D=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",me)},300)}};let B=document.createElement("div");B.id="ytls-settings-content";let $=document.createElement("h3");$.className="ytls-section-heading",$.textContent="General",$.style.display="none";let H=document.createElement("div"),q=document.createElement("div");q.className="ytls-button-grid";function G(Le){H.style.display=Le==="general"?"block":"none",q.style.display=Le==="drive"?"block":"none",te.classList.toggle("active",Le==="general"),W.classList.toggle("active",Le==="drive"),$.textContent=Le==="general"?"General":"Google Drive"}let te=document.createElement("button");te.textContent="\u{1F6E0}\uFE0F";let Ee=document.createElement("span");Ee.className="ytls-tab-text",Ee.textContent=" General",te.appendChild(Ee),Ie(te,"General settings"),te.classList.add("ytls-settings-modal-button"),te.onclick=()=>G("general");let W=document.createElement("button");W.textContent="\u2601\uFE0F";let fe=document.createElement("span");fe.className="ytls-tab-text",fe.textContent=" Backup",W.appendChild(fe),Ie(W,"Google Drive sign-in and backup"),W.classList.add("ytls-settings-modal-button"),W.onclick=async()=>{z.isSignedIn&&await _o(),G("drive")},T.appendChild(te),T.appendChild(W),h.appendChild(T),h.appendChild(k),D.appendChild(h),H.className="ytls-button-grid",H.appendChild(Y("\u{1F4BE} Save","Save As...",Te.onclick)),H.appendChild(Y("\u{1F4C2} Load","Load",Je.onclick)),H.appendChild(Y("\u{1F4E4} Export All","Export All Data",wt.onclick)),H.appendChild(Y("\u{1F4E5} Import All","Import All Data",Xe.onclick));let Se=Y(z.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",z.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{z.isSignedIn?await qo():await Go(),Se.textContent=z.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",Ie(Se,z.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive")});q.appendChild(Se);let it=Y(Qe?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await Ko(),it.textContent=Qe?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off"});q.appendChild(it);let Tt=Y(`\u23F1\uFE0F Backup Interval: ${Me}min`,"Set periodic backup interval (minutes)",async()=>{await Wo(),Tt.textContent=`\u23F1\uFE0F Backup Interval: ${Me}min`});q.appendChild(Tt),q.appendChild(Y("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await Qt(!1)}));let He=document.createElement("div");He.style.marginTop="15px",He.style.paddingTop="10px",He.style.borderTop="1px solid #555",He.style.fontSize="12px",He.style.color="#aaa";let kt=document.createElement("div");kt.style.marginBottom="8px",kt.style.fontWeight="bold",He.appendChild(kt),Ho(kt);let An=document.createElement("div");An.style.marginBottom="8px",Oo(An),He.appendChild(An);let fo=document.createElement("div");$o(fo),He.appendChild(fo),q.appendChild(He),Fe(),en(),We(),B.appendChild($),B.appendChild(H),B.appendChild(q),G(p),D.appendChild(B),document.body.appendChild(D),requestAnimationFrame(()=>{let Le=D.getBoundingClientRect(),at=(window.innerHeight-Le.height)/2;D.style.top=`${Math.max(20,at)}px`,D.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Be,!0),document.addEventListener("keydown",me)},0)}function me(p){if(p.key==="Escape"&&D&&D.parentNode===document.body){let h=document.getElementById("ytls-save-modal"),T=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");if(h||T||k)return;p.preventDefault(),h&&document.body.contains(h)&&document.body.removeChild(h),T&&document.body.contains(T)&&document.body.removeChild(T),k&&document.body.contains(k)&&document.body.removeChild(k),D.classList.remove("ytls-fade-in"),D.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(D)&&document.body.removeChild(D),D=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",me)},300)}}function Be(p){if(dt&&dt.contains(p.target))return;let h=document.getElementById("ytls-save-modal"),T=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");h&&h.contains(p.target)||T&&T.contains(p.target)||k&&k.contains(p.target)||D&&D.contains(p.target)||(h&&document.body.contains(h)&&document.body.removeChild(h),T&&document.body.contains(T)&&document.body.removeChild(T),k&&document.body.contains(k)&&document.body.removeChild(k),D&&D.parentNode===document.body&&(D.classList.remove("ytls-fade-in"),D.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(D)&&document.body.removeChild(D),D=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",me)},300)))}let Te=document.createElement("button");Te.textContent="\u{1F4BE} Save",Te.classList.add("ytls-file-operation-button"),Te.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let h=document.createElement("p");h.textContent="Save as:";let T=null,k=null,B=m(p,()=>{T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0)});T=g(B),k=l(p,B);let $=document.createElement("button");$.textContent="JSON",$.classList.add("ytls-save-modal-button"),$.onclick=()=>{T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0),m(p,()=>to("json"))()};let H=document.createElement("button");H.textContent="Plain Text",H.classList.add("ytls-save-modal-button"),H.onclick=()=>{T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0),m(p,()=>to("text"))()};let q=document.createElement("button");q.textContent="Cancel",q.classList.add("ytls-save-modal-cancel-button"),q.onclick=B,p.appendChild(h),p.appendChild($),p.appendChild(H),p.appendChild(q),document.body.appendChild(p),f(T),v(k)};let Je=document.createElement("button");Je.textContent="\u{1F4C2} Load",Je.classList.add("ytls-file-operation-button"),Je.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let h=document.createElement("p");h.textContent="Load from:";let T=null,k=null,B=m(p,()=>{T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0)});T=g(B),k=l(p,B);let $=document.createElement("button");$.textContent="File",$.classList.add("ytls-save-modal-button"),$.onclick=()=>{let G=document.createElement("input");G.type="file",G.accept=".json,.txt",G.classList.add("ytls-hidden-file-input"),G.onchange=te=>{let Ee=te.target.files?.[0];if(!Ee)return;T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0),B();let W=new FileReader;W.onload=()=>{let fe=String(W.result).trim();co(fe)},W.readAsText(Ee)},G.click()};let H=document.createElement("button");H.textContent="Clipboard",H.classList.add("ytls-save-modal-button"),H.onclick=async()=>{T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0),m(p,async()=>{try{let G=await navigator.clipboard.readText();G?co(G.trim()):alert("Clipboard is empty.")}catch(G){u("Failed to read from clipboard: ",G,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let q=document.createElement("button");q.textContent="Cancel",q.classList.add("ytls-save-modal-cancel-button"),q.onclick=B,p.appendChild(h),p.appendChild($),p.appendChild(H),p.appendChild(q),document.body.appendChild(p),f(T),v(k)};let wt=document.createElement("button");wt.textContent="\u{1F4E4} Export",wt.classList.add("ytls-file-operation-button"),wt.onclick=async()=>{try{await lr()}catch{alert("Failed to export data: Could not read from database.")}};let Xe=document.createElement("button");Xe.textContent="\u{1F4E5} Import",Xe.classList.add("ytls-file-operation-button"),Xe.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=h=>{let T=h.target.files?.[0];if(!T)return;let k=new FileReader;k.onload=()=>{try{let B=JSON.parse(String(k.result)),$=[];for(let H in B)if(Object.prototype.hasOwnProperty.call(B,H)&&H.startsWith("ytls-")){let q=H.substring(5),G=B[H];if(G&&typeof G.video_id=="string"&&Array.isArray(G.timestamps)){let te=G.timestamps.map(W=>({...W,guid:W.guid||crypto.randomUUID()})),Ee=so(q,te).then(()=>u(`Imported ${q} to IndexedDB`)).catch(W=>u(`Failed to import ${q} to IndexedDB:`,W,"error"));$.push(Ee)}else u(`Skipping key ${H} during import due to unexpected data format.`,"warn")}Promise.all($).then(()=>{Dn()}).catch(H=>{alert("An error occurred during import to IndexedDB. Check console for details."),u("Overall import error:",H,"error")})}catch(B){alert(`Failed to import data. Please ensure the file is in the correct format.
`+B.message),u("Import error:",B,"error")}},k.readAsText(T)},p.click()},w.textContent=go,c.onclick=p=>{Qn(p)},c.ontouchstart=p=>{Qn(p)};function X(){r&&(u("Loading window position from IndexedDB"),Mn("windowPosition").then(p=>{if(p&&typeof p.x=="number"&&typeof p.y=="number"){let T=p;r.style.left=`${T.x}px`,r.style.top=`${T.y}px`,r.style.right="auto",r.style.bottom="auto",tt={x:Math.max(0,Math.round(T.x)),y:Math.max(0,Math.round(T.y))}}else u("No window position found in IndexedDB, leaving default position"),tt=null;It();let h=r.getBoundingClientRect();(h.width||h.height)&&(tt={x:Math.max(0,Math.round(h.left)),y:Math.max(0,Math.round(h.top))})}).catch(p=>{u("failed to load pane position from IndexedDB:",p,"warn"),It();let h=r.getBoundingClientRect();(h.width||h.height)&&(tt={x:Math.max(0,Math.round(h.left)),y:Math.max(0,Math.round(h.top))})}))}function V(){if(!r)return;let p=r.getBoundingClientRect(),h={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top))};if(tt&&tt.x===h.x&&tt.y===h.y){u("Skipping window position save; position unchanged");return}tt={...h},u(`Saving window position to IndexedDB: x=${h.x}, y=${h.y}`),In("windowPosition",h),ot({type:"window_position_updated",position:h,timestamp:Date.now()})}r.style.position="fixed",r.style.bottom="0",r.style.right="0",r.style.transition="none",X(),setTimeout(()=>It(),10);let ce=!1,de,ke,Ve=!1;r.addEventListener("mousedown",p=>{let h=p.target;h instanceof Element&&(h instanceof HTMLInputElement||h instanceof HTMLTextAreaElement||h!==y&&!y.contains(h)&&window.getComputedStyle(h).cursor==="pointer"||(ce=!0,Ve=!1,de=p.clientX-r.getBoundingClientRect().left,ke=p.clientY-r.getBoundingClientRect().top,r.style.transition="none"))}),document.addEventListener("mousemove",tn=p=>{if(!ce)return;Ve=!0;let h=p.clientX-de,T=p.clientY-ke,k=r.getBoundingClientRect(),B=k.width,$=k.height,H=document.documentElement.clientWidth,q=document.documentElement.clientHeight;h=Math.max(0,Math.min(h,H-B)),T=Math.max(0,Math.min(T,q-$)),r.style.left=`${h}px`,r.style.top=`${T}px`,r.style.right="auto",r.style.bottom="auto"}),document.addEventListener("mouseup",nn=()=>{if(!ce)return;ce=!1;let p=Ve;setTimeout(()=>{Ve=!1},50),It(),setTimeout(()=>{p&&V()},200)}),r.addEventListener("dragstart",p=>p.preventDefault());let ft=null;window.addEventListener("resize",on=()=>{ft&&clearTimeout(ft),ft=setTimeout(()=>{It(),V(),ft=null},200)}),y.appendChild(x),y.appendChild(o);let Ft=document.createElement("div");Ft.id="ytls-content",Ft.append(c,S),r.append(y,Ft,w),Rt||document.addEventListener("pointerdown",Rt=()=>{Kn=Date.now()},!0),Gt||document.addEventListener("pointerup",Gt=()=>{},!0)}async function gr(){r&&(await pr(),typeof qn=="function"&&qn(ao),typeof wn=="function"&&wn(In),typeof Tn=="function"&&Tn(Mn),typeof Un=="function"&&Un(I),await _n(),await Vo(),await Ht(),typeof $t=="function"&&$t(),document.body.appendChild(r))}function mo(t=0){if(document.getElementById("ytls-header-button")){rt();return}let o=document.querySelector("#logo");if(!o||!o.parentElement){t<10&&setTimeout(()=>mo(t+1),300);return}let s=document.createElement("button");s.id="ytls-header-button",s.type="button",s.className="ytls-header-button",Ie(s,"Toggle Timekeeper UI"),s.setAttribute("aria-label","Toggle Timekeeper UI");let m=document.createElement("img");m.src=ee,m.alt="",m.decoding="async",s.appendChild(m),_e=m,s.addEventListener("mouseenter",()=>{_e&&(mt=!0,_e.src=j)}),s.addEventListener("mouseleave",()=>{_e&&(mt=!1,rt())}),s.addEventListener("click",()=>{Cn()}),o.insertAdjacentElement("afterend",s),rt(),u("Timekeeper header button added next to YouTube logo")}function vr(){if(et)return;et=new MutationObserver(()=>{let s=io();s!==De&&(De=s,x&&(Ie(x,()=>De||""),u("Video title changed, updated tooltip:",De)))});let t=document.querySelector('meta[name="title"]');t&&et.observe(t,{attributes:!0,attributeFilter:["content"]});let o=document.querySelector("title");o&&et.observe(o,{childList:!0,characterData:!0,subtree:!0}),u("Title observer initialized")}async function Dn(){if(!d()){or();return}await J(),await hr(),document.querySelectorAll("#ytls-pane").forEach((o,s)=>{s>0&&o.remove()}),ae=Ln(),De=io();let t=document.title;u("Page Title:",t),u("Video ID:",ae),u("Video Title:",De),u("Current URL:",window.location.href),x&&De&&Ie(x,()=>De||""),vr(),yt(),Ae(),await ro(),Ae(),Yn(!1),u("Timestamps loaded and UI unlocked for video:",ae),await gr(),mo(),ir()}window.addEventListener("yt-navigate-start",()=>{u("Navigation started (yt-navigate-start event fired)"),d()&&r&&c&&(u("Locking UI and showing loading state for navigation"),Yn(!0))}),Nt=t=>{t.ctrlKey&&t.altKey&&t.shiftKey&&(t.key==="T"||t.key==="t")&&(t.preventDefault(),Cn(),u("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",Nt),window.addEventListener("yt-navigate-finish",()=>{u("Navigation finished (yt-navigate-finish event fired)"),Dn()}),u("Timekeeper initialized and waiting for navigation events")})();})();

