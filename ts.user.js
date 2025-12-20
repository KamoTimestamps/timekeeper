// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.2.0
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

(()=>{function u(e,...n){let i="debug",a=[...n];n.length>0&&typeof n[n.length-1]=="string"&&["debug","info","warn","error"].includes(n[n.length-1])&&(i=a.pop());let r=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[i](`${r} ${e}`,...a)}function pt(e,n=e){let i=Math.floor(e/3600),a=Math.floor(e%3600/60),m=String(e%60).padStart(2,"0");return n<3600?`${a<10?a:String(a).padStart(2,"0")}:${m}`:`${n>=36e3?String(i).padStart(2,"0"):i}:${String(a).padStart(2,"0")}:${m}`}function ho(e,n=window.location.href){try{let i=new URL(n);return i.searchParams.set("t",`${e}s`),i.toString()}catch{return`https://www.youtube.com/watch?v=${n.search(/[?&]v=/)>=0?n.split(/[?&]v=/)[1].split(/&/)[0]:n.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function An(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var vr=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function go(){let e=new Date,n=e.getFullYear(),i=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let a of vr){let y=(new Date(n,a.month-1,a.day).getTime()-e.getTime())/(1e3*60*60*24);if(y<=7&&y>=-3)return u(`Current date: ${i}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(y)}`),a.emoji}return u(`Current date: ${i}, No holiday emoji (not within range)`),null}var ht=null,Pt=null,yr=500;function br(){return(!ht||!document.body.contains(ht))&&(ht=document.createElement("div"),ht.className="ytls-tooltip",document.body.appendChild(ht)),ht}function xr(e,n,i){let m=window.innerWidth,r=window.innerHeight,y=e.getBoundingClientRect(),c=y.width,S=y.height,x=n+10,w=i+10;x+c>m-10&&(x=n-c-10),w+S>r-10&&(w=i-S-10),x=Math.max(10,Math.min(x,m-c-10)),w=Math.max(10,Math.min(w,r-S-10)),e.style.left=`${x}px`,e.style.top=`${w}px`}function wr(e,n,i){Pt&&clearTimeout(Pt),Pt=setTimeout(()=>{let a=br();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),xr(a,n,i),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})},yr)}function Tr(){Pt&&(clearTimeout(Pt),Pt=null),ht&&ht.classList.remove("ytls-tooltip-visible")}function Me(e,n){let i=0,a=0,m=c=>{i=c.clientX,a=c.clientY;let S=typeof n=="function"?n():n;S&&wr(S,i,a)},r=c=>{i=c.clientX,a=c.clientY},y=()=>{Tr()};e.addEventListener("mouseenter",m),e.addEventListener("mousemove",r),e.addEventListener("mouseleave",y),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",m),e.removeEventListener("mousemove",r),e.removeEventListener("mouseleave",y)}}var vo=`
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

`;var ye=Uint8Array,Ne=Uint16Array,$n=Int32Array,Hn=new ye([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Nn=new ye([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),yo=new ye([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Eo=function(e,n){for(var i=new Ne(31),a=0;a<31;++a)i[a]=n+=1<<e[a-1];for(var m=new $n(i[30]),a=1;a<30;++a)for(var r=i[a];r<i[a+1];++r)m[r]=r-i[a]<<5|a;return{b:i,r:m}},So=Eo(Hn,2),kr=So.b,Fn=So.r;kr[28]=258,Fn[258]=28;var Lo=Eo(Nn,0),ii=Lo.b,bo=Lo.r,Pn=new Ne(32768);for(_=0;_<32768;++_)it=(_&43690)>>1|(_&21845)<<1,it=(it&52428)>>2|(it&13107)<<2,it=(it&61680)>>4|(it&3855)<<4,Pn[_]=((it&65280)>>8|(it&255)<<8)>>1;var it,_,Wt=(function(e,n,i){for(var a=e.length,m=0,r=new Ne(n);m<a;++m)e[m]&&++r[e[m]-1];var y=new Ne(n);for(m=1;m<n;++m)y[m]=y[m-1]+r[m-1]<<1;var c;if(i){c=new Ne(1<<n);var S=15-n;for(m=0;m<a;++m)if(e[m])for(var x=m<<4|e[m],w=n-e[m],M=y[e[m]-1]++<<w,I=M|(1<<w)-1;M<=I;++M)c[Pn[M]>>S]=x}else for(c=new Ne(a),m=0;m<a;++m)e[m]&&(c[m]=Pn[y[e[m]-1]++]>>15-e[m]);return c}),Et=new ye(288);for(_=0;_<144;++_)Et[_]=8;var _;for(_=144;_<256;++_)Et[_]=9;var _;for(_=256;_<280;++_)Et[_]=7;var _;for(_=280;_<288;++_)Et[_]=8;var _,pn=new ye(32);for(_=0;_<32;++_)pn[_]=5;var _,Er=Wt(Et,9,0);var Sr=Wt(pn,5,0);var Io=function(e){return(e+7)/8|0},Mo=function(e,n,i){return(n==null||n<0)&&(n=0),(i==null||i>e.length)&&(i=e.length),new ye(e.subarray(n,i))};var Lr=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],gn=function(e,n,i){var a=new Error(n||Lr[e]);if(a.code=e,Error.captureStackTrace&&Error.captureStackTrace(a,gn),!i)throw a;return a};var at=function(e,n,i){i<<=n&7;var a=n/8|0;e[a]|=i,e[a+1]|=i>>8},Vt=function(e,n,i){i<<=n&7;var a=n/8|0;e[a]|=i,e[a+1]|=i>>8,e[a+2]|=i>>16},Bn=function(e,n){for(var i=[],a=0;a<e.length;++a)e[a]&&i.push({s:a,f:e[a]});var m=i.length,r=i.slice();if(!m)return{t:Do,l:0};if(m==1){var y=new ye(i[0].s+1);return y[i[0].s]=1,{t:y,l:1}}i.sort(function(le,we){return le.f-we.f}),i.push({s:-1,f:25001});var c=i[0],S=i[1],x=0,w=1,M=2;for(i[0]={s:-1,f:c.f+S.f,l:c,r:S};w!=m-1;)c=i[i[x].f<i[M].f?x++:M++],S=i[x!=w&&i[x].f<i[M].f?x++:M++],i[w++]={s:-1,f:c.f+S.f,l:c,r:S};for(var I=r[0].s,a=1;a<m;++a)r[a].s>I&&(I=r[a].s);var P=new Ne(I+1),N=zn(i[w-1],P,0);if(N>n){var a=0,U=0,Z=N-n,ee=1<<Z;for(r.sort(function(we,re){return P[re.s]-P[we.s]||we.f-re.f});a<m;++a){var j=r[a].s;if(P[j]>n)U+=ee-(1<<N-P[j]),P[j]=n;else break}for(U>>=Z;U>0;){var he=r[a].s;P[he]<n?U-=1<<n-P[he]++-1:++a}for(;a>=0&&U;--a){var J=r[a].s;P[J]==n&&(--P[J],++U)}N=n}return{t:new ye(P),l:N}},zn=function(e,n,i){return e.s==-1?Math.max(zn(e.l,n,i+1),zn(e.r,n,i+1)):n[e.s]=i},xo=function(e){for(var n=e.length;n&&!e[--n];);for(var i=new Ne(++n),a=0,m=e[0],r=1,y=function(S){i[a++]=S},c=1;c<=n;++c)if(e[c]==m&&c!=n)++r;else{if(!m&&r>2){for(;r>138;r-=138)y(32754);r>2&&(y(r>10?r-11<<5|28690:r-3<<5|12305),r=0)}else if(r>3){for(y(m),--r;r>6;r-=6)y(8304);r>2&&(y(r-3<<5|8208),r=0)}for(;r--;)y(m);r=1,m=e[c]}return{c:i.subarray(0,a),n}},Kt=function(e,n){for(var i=0,a=0;a<n.length;++a)i+=e[a]*n[a];return i},Co=function(e,n,i){var a=i.length,m=Io(n+2);e[m]=a&255,e[m+1]=a>>8,e[m+2]=e[m]^255,e[m+3]=e[m+1]^255;for(var r=0;r<a;++r)e[m+r+4]=i[r];return(m+4+a)*8},wo=function(e,n,i,a,m,r,y,c,S,x,w){at(n,w++,i),++m[256];for(var M=Bn(m,15),I=M.t,P=M.l,N=Bn(r,15),U=N.t,Z=N.l,ee=xo(I),j=ee.c,he=ee.n,J=xo(U),le=J.c,we=J.n,re=new Ne(19),R=0;R<j.length;++R)++re[j[R]&31];for(var R=0;R<le.length;++R)++re[le[R]&31];for(var F=Bn(re,7),oe=F.t,Q=F.l,ge=19;ge>4&&!oe[yo[ge-1]];--ge);var ut=x+5<<3,ze=Kt(m,Et)+Kt(r,pn)+y,De=Kt(m,I)+Kt(r,U)+y+14+3*ge+Kt(re,oe)+2*re[16]+3*re[17]+7*re[18];if(S>=0&&ut<=ze&&ut<=De)return Co(n,w,e.subarray(S,S+x));var Re,ie,Oe,Te;if(at(n,w,1+(De<ze)),w+=2,De<ze){Re=Wt(I,P,0),ie=I,Oe=Wt(U,Z,0),Te=U;var tt=Wt(oe,Q,0);at(n,w,he-257),at(n,w+5,we-1),at(n,w+10,ge-4),w+=14;for(var R=0;R<ge;++R)at(n,w+3*R,oe[yo[R]]);w+=3*ge;for(var $e=[j,le],Ge=0;Ge<2;++Ge)for(var Ue=$e[Ge],R=0;R<Ue.length;++R){var be=Ue[R]&31;at(n,w,tt[be]),w+=oe[be],be>15&&(at(n,w,Ue[R]>>5&127),w+=Ue[R]>>12)}}else Re=Er,ie=Et,Oe=Sr,Te=pn;for(var R=0;R<c;++R){var ne=a[R];if(ne>255){var be=ne>>18&31;Vt(n,w,Re[be+257]),w+=ie[be+257],be>7&&(at(n,w,ne>>23&31),w+=Hn[be]);var Ke=ne&31;Vt(n,w,Oe[Ke]),w+=Te[Ke],Ke>3&&(Vt(n,w,ne>>5&8191),w+=Nn[Ke])}else Vt(n,w,Re[ne]),w+=ie[ne]}return Vt(n,w,Re[256]),w+ie[256]},Ir=new $n([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Do=new ye(0),Mr=function(e,n,i,a,m,r){var y=r.z||e.length,c=new ye(a+y+5*(1+Math.ceil(y/7e3))+m),S=c.subarray(a,c.length-m),x=r.l,w=(r.r||0)&7;if(n){w&&(S[0]=r.r>>3);for(var M=Ir[n-1],I=M>>13,P=M&8191,N=(1<<i)-1,U=r.p||new Ne(32768),Z=r.h||new Ne(N+1),ee=Math.ceil(i/3),j=2*ee,he=function(dt){return(e[dt]^e[dt+1]<<ee^e[dt+2]<<j)&N},J=new $n(25e3),le=new Ne(288),we=new Ne(32),re=0,R=0,F=r.i||0,oe=0,Q=r.w||0,ge=0;F+2<y;++F){var ut=he(F),ze=F&32767,De=Z[ut];if(U[ze]=De,Z[ut]=ze,Q<=F){var Re=y-F;if((re>7e3||oe>24576)&&(Re>423||!x)){w=wo(e,S,0,J,le,we,R,oe,ge,F-ge,w),oe=re=R=0,ge=F;for(var ie=0;ie<286;++ie)le[ie]=0;for(var ie=0;ie<30;++ie)we[ie]=0}var Oe=2,Te=0,tt=P,$e=ze-De&32767;if(Re>2&&ut==he(F-$e))for(var Ge=Math.min(I,Re)-1,Ue=Math.min(32767,F),be=Math.min(258,Re);$e<=Ue&&--tt&&ze!=De;){if(e[F+Oe]==e[F+Oe-$e]){for(var ne=0;ne<be&&e[F+ne]==e[F+ne-$e];++ne);if(ne>Oe){if(Oe=ne,Te=$e,ne>Ge)break;for(var Ke=Math.min($e,ne-2),D=0,ie=0;ie<Ke;++ie){var ct=F-$e+ie&32767,ae=U[ct],Ae=ct-ae&32767;Ae>D&&(D=Ae,De=ct)}}}ze=De,De=U[ze],$e+=ze-De&32767}if(Te){J[oe++]=268435456|Fn[Oe]<<18|bo[Te];var Xe=Fn[Oe]&31,We=bo[Te]&31;R+=Hn[Xe]+Nn[We],++le[257+Xe],++we[We],Q=F+Oe,++re}else J[oe++]=e[F],++le[e[F]]}}for(F=Math.max(F,Q);F<y;++F)J[oe++]=e[F],++le[e[F]];w=wo(e,S,x,J,le,we,R,oe,ge,F-ge,w),x||(r.r=w&7|S[w/8|0]<<3,w-=7,r.h=Z,r.p=U,r.i=F,r.w=Q)}else{for(var F=r.w||0;F<y+x;F+=65535){var qe=F+65535;qe>=y&&(S[w/8|0]=x,qe=y),w=Co(S,w+1,e.subarray(F,qe))}r.i=y}return Mo(c,0,a+Io(w)+m)},Cr=(function(){for(var e=new Int32Array(256),n=0;n<256;++n){for(var i=n,a=9;--a;)i=(i&1&&-306674912)^i>>>1;e[n]=i}return e})(),Dr=function(){var e=-1;return{p:function(n){for(var i=e,a=0;a<n.length;++a)i=Cr[i&255^n[a]]^i>>>8;e=i},d:function(){return~e}}};var Ar=function(e,n,i,a,m){if(!m&&(m={l:1},n.dictionary)){var r=n.dictionary.subarray(-32768),y=new ye(r.length+e.length);y.set(r),y.set(e,r.length),e=y,m.w=r.length}return Mr(e,n.level==null?6:n.level,n.mem==null?m.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+n.mem,i,a,m)},Ao=function(e,n){var i={};for(var a in e)i[a]=e[a];for(var a in n)i[a]=n[a];return i};var ve=function(e,n,i){for(;i;++n)e[n]=i,i>>>=8};function Br(e,n){return Ar(e,n||{},0,0)}var Bo=function(e,n,i,a){for(var m in e){var r=e[m],y=n+m,c=a;Array.isArray(r)&&(c=Ao(a,r[1]),r=r[0]),r instanceof ye?i[y]=[r,c]:(i[y+="/"]=[new ye(0),c],Bo(r,y,i,a))}},To=typeof TextEncoder<"u"&&new TextEncoder,Fr=typeof TextDecoder<"u"&&new TextDecoder,Pr=0;try{Fr.decode(Do,{stream:!0}),Pr=1}catch{}function hn(e,n){if(n){for(var i=new ye(e.length),a=0;a<e.length;++a)i[a]=e.charCodeAt(a);return i}if(To)return To.encode(e);for(var m=e.length,r=new ye(e.length+(e.length>>1)),y=0,c=function(w){r[y++]=w},a=0;a<m;++a){if(y+5>r.length){var S=new ye(y+8+(m-a<<1));S.set(r),r=S}var x=e.charCodeAt(a);x<128||n?c(x):x<2048?(c(192|x>>6),c(128|x&63)):x>55295&&x<57344?(x=65536+(x&1047552)|e.charCodeAt(++a)&1023,c(240|x>>18),c(128|x>>12&63),c(128|x>>6&63),c(128|x&63)):(c(224|x>>12),c(128|x>>6&63),c(128|x&63))}return Mo(r,0,y)}var On=function(e){var n=0;if(e)for(var i in e){var a=e[i].length;a>65535&&gn(9),n+=a+4}return n},ko=function(e,n,i,a,m,r,y,c){var S=a.length,x=i.extra,w=c&&c.length,M=On(x);ve(e,n,y!=null?33639248:67324752),n+=4,y!=null&&(e[n++]=20,e[n++]=i.os),e[n]=20,n+=2,e[n++]=i.flag<<1|(r<0&&8),e[n++]=m&&8,e[n++]=i.compression&255,e[n++]=i.compression>>8;var I=new Date(i.mtime==null?Date.now():i.mtime),P=I.getFullYear()-1980;if((P<0||P>119)&&gn(10),ve(e,n,P<<25|I.getMonth()+1<<21|I.getDate()<<16|I.getHours()<<11|I.getMinutes()<<5|I.getSeconds()>>1),n+=4,r!=-1&&(ve(e,n,i.crc),ve(e,n+4,r<0?-r-2:r),ve(e,n+8,i.size)),ve(e,n+12,S),ve(e,n+14,M),n+=16,y!=null&&(ve(e,n,w),ve(e,n+6,i.attrs),ve(e,n+10,y),n+=14),e.set(a,n),n+=S,M)for(var N in x){var U=x[N],Z=U.length;ve(e,n,+N),ve(e,n+2,Z),e.set(U,n+4),n+=4+Z}return w&&(e.set(c,n),n+=w),n},zr=function(e,n,i,a,m){ve(e,n,101010256),ve(e,n+8,i),ve(e,n+10,i),ve(e,n+12,a),ve(e,n+16,m)};function Fo(e,n){n||(n={});var i={},a=[];Bo(e,"",i,n);var m=0,r=0;for(var y in i){var c=i[y],S=c[0],x=c[1],w=x.level==0?0:8,M=hn(y),I=M.length,P=x.comment,N=P&&hn(P),U=N&&N.length,Z=On(x.extra);I>65535&&gn(11);var ee=w?Br(S,x):S,j=ee.length,he=Dr();he.p(S),a.push(Ao(x,{size:S.length,crc:he.d(),c:ee,f:M,m:N,u:I!=y.length||N&&P.length!=U,o:m,compression:w})),m+=30+I+Z+j,r+=76+2*(I+Z)+(U||0)+j}for(var J=new ye(r+22),le=m,we=r-m,re=0;re<a.length;++re){var M=a[re];ko(J,M.o,M,M.f,M.u,M.c.length);var R=30+M.f.length+On(M.extra);J.set(M.c,M.o+R),ko(J,m,M,M.f,M.u,M.c.length,M.o,M.m),m+=16+R+(M.m?M.m.length:0)}return zr(J,m,a.length,we,le),J}var H={isSignedIn:!1,accessToken:null,userName:null,email:null},Je=!0,Ce=30,Pe=null,zt=!1,vn=0,Ve=null,Rn=null,pe=null,K=null,yn=null;function Oo(e){Rn=e}function $o(e){pe=e}function Ho(e){K=e}function Gn(e){yn=e}var Po=!1;function No(){if(!Po)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),Po=!0}catch{}}var Ro=null,Yt=null,Zt=null;function Un(e){Ro=e}function xn(e){Yt=e}function wn(e){Zt=e}var zo="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Or="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",$r="https://www.youtube.com/",Hr=30*1e3,Nr=1800*1e3,Rr=5,bn=null,st=null;async function qn(){try{let e=await Zt("googleAuthState");e&&typeof e=="object"&&(H={...H,...e},Xt())}catch(e){u("Failed to load Google auth state:",e,"error")}}async function _n(){try{await Yt("googleAuthState",H)}catch(e){u("Failed to save Google auth state:",e,"error")}}function Xt(){Rn&&(Rn.style.display="none")}function xe(e,n){if(K){if(K.style.fontWeight="bold",e==="authenticating"){for(No(),K.style.color="#ffa500";K.firstChild;)K.removeChild(K.firstChild);let i=document.createElement("span");i.className="tk-auth-spinner";let a=document.createTextNode(` ${n||"Authorizing with Google\u2026"}`);K.appendChild(i),K.appendChild(a);return}if(e==="error"){K.textContent=`\u274C ${n||"Authorization failed"}`,K.style.color="#ff4d4f",Ot();return}H.isSignedIn?(K.textContent="\u2705 Signed in",K.style.color="#52c41a",K.removeAttribute("title"),H.userName?(K.onmouseenter=()=>{K.textContent=`\u2705 Signed in as ${H.userName}`},K.onmouseleave=()=>{K.textContent="\u2705 Signed in"}):(K.onmouseenter=null,K.onmouseleave=null)):(K.textContent="\u274C Not signed in",K.style.color="#ff4d4f",K.removeAttribute("title"),K.onmouseenter=null,K.onmouseleave=null),Ot()}}function Gr(){K&&(No(),K.classList.remove("tk-auth-blink"),K.offsetWidth,K.classList.add("tk-auth-blink"),setTimeout(()=>{K.classList.remove("tk-auth-blink")},1200))}function Ur(e){return new Promise((n,i)=>{if(!e){u&&u("OAuth monitor: popup is null",null,"error"),i(new Error("Failed to open popup"));return}u&&u("OAuth monitor: starting to monitor popup for token");let a=Date.now(),m=300*1e3,r="timekeeper_oauth",y=null,c=null,S=null,x=()=>{if(y){try{y.close()}catch{}y=null}c&&(clearInterval(c),c=null),S&&(clearInterval(S),S=null)};try{y=new BroadcastChannel(r),u&&u("OAuth monitor: BroadcastChannel created successfully"),y.onmessage=I=>{if(u&&u("OAuth monitor: received BroadcastChannel message",I.data),I.data?.type==="timekeeper_oauth_token"&&I.data?.token){u&&u("OAuth monitor: token received via BroadcastChannel"),x();try{e.close()}catch{}n(I.data.token)}else if(I.data?.type==="timekeeper_oauth_error"){u&&u("OAuth monitor: error received via BroadcastChannel",I.data.error,"error"),x();try{e.close()}catch{}i(new Error(I.data.error||"OAuth failed"))}}}catch(I){u&&u("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",I)}u&&u("OAuth monitor: setting up IndexedDB polling");let w=Date.now();c=setInterval(async()=>{try{let I=indexedDB.open("ytls-timestamps-db",3);I.onsuccess=()=>{let P=I.result,Z=P.transaction("settings","readonly").objectStore("settings").get("oauth_message");Z.onsuccess=()=>{let ee=Z.result;if(ee&&ee.value){let j=ee.value;if(j.timestamp&&j.timestamp>w){if(u&&u("OAuth monitor: received IndexedDB message",j),j.type==="timekeeper_oauth_token"&&j.token){u&&u("OAuth monitor: token received via IndexedDB"),x();try{e.close()}catch{}P.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(j.token)}else if(j.type==="timekeeper_oauth_error"){u&&u("OAuth monitor: error received via IndexedDB",j.error,"error"),x();try{e.close()}catch{}P.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(new Error(j.error||"OAuth failed"))}w=j.timestamp}}P.close()}}}catch(I){u&&u("OAuth monitor: IndexedDB polling error",I,"error")}},500),S=setInterval(()=>{if(Date.now()-a>m){u&&u("OAuth monitor: popup timed out after 5 minutes",null,"error"),x();try{e.close()}catch{}i(new Error("OAuth popup timed out"));return}},1e3)})}async function jn(){if(!zo){xe("error","Google Client ID not configured");return}try{u&&u("OAuth signin: starting OAuth flow"),xe("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",zo),e.searchParams.set("redirect_uri",$r),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Or),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),u&&u("OAuth signin: opening popup");let n=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!n){u&&u("OAuth signin: popup blocked by browser",null,"error"),xe("error","Popup blocked. Please enable popups for YouTube.");return}u&&u("OAuth signin: popup opened successfully"),xe("authenticating","Waiting for authentication...");try{let i=await Ur(n),a=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${i}`}});if(a.ok){let m=await a.json();H.accessToken=i,H.isSignedIn=!0,H.userName=m.name,H.email=m.email,await _n(),Xt(),xe(),u?u(`Successfully authenticated as ${m.name}`):console.log(`[Timekeeper] Successfully authenticated as ${m.name}`)}else throw new Error("Failed to fetch user info")}catch(i){let a=i instanceof Error?i.message:"Authentication failed";u?u("OAuth failed:",i,"error"):console.error("[Timekeeper] OAuth failed:",i),xe("error",a);return}}catch(e){let n=e instanceof Error?e.message:"Sign in failed";u?u("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),xe("error",`Failed to sign in: ${n}`)}}async function Go(){if(!window.opener||window.opener===window)return!1;u&&u("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return u&&u("OAuth popup: no hash params found"),!1;let n=e.startsWith("#")?e.substring(1):e,i=new URLSearchParams(n),a=i.get("state");if(u&&u("OAuth popup: hash params found, state="+a),a!=="timekeeper_auth")return u&&u("OAuth popup: not our OAuth flow (wrong state)"),!1;let m=i.get("error"),r=i.get("access_token"),y="timekeeper_oauth";if(m){try{let c=new BroadcastChannel(y);c.postMessage({type:"timekeeper_oauth_error",error:i.get("error_description")||m}),c.close()}catch{let S={type:"timekeeper_oauth_error",error:i.get("error_description")||m,timestamp:Date.now()},x=indexedDB.open("ytls-timestamps-db",3);x.onsuccess=()=>{let w=x.result;w.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),w.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(r){u&&u("OAuth popup: access token found, broadcasting to opener");try{let c=new BroadcastChannel(y);c.postMessage({type:"timekeeper_oauth_token",token:r}),c.close(),u&&u("OAuth popup: token broadcast via BroadcastChannel")}catch(c){u&&u("OAuth popup: BroadcastChannel failed, using IndexedDB",c);let S={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},x=indexedDB.open("ytls-timestamps-db",3);x.onsuccess=()=>{let w=x.result;w.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),w.close()},u&&u("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Uo(){H={isSignedIn:!1,accessToken:null,userName:null,email:null},await _n(),Xt(),xe()}async function qo(){if(!H.isSignedIn||!H.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${H.accessToken}`}});return e.status===401?(await _o({silent:!0,retry:!1}),!1):e.ok}catch(e){return u("Failed to verify auth state:",e,"error"),!1}}async function qr(e){let n={Authorization:`Bearer ${e}`},a=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,m=await fetch(a,{headers:n});if(m.status===401)throw new Error("unauthorized");if(!m.ok)throw new Error("drive search failed");let r=await m.json();if(Array.isArray(r.files)&&r.files.length>0)return r.files[0].id;let y=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...n,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(y.status===401)throw new Error("unauthorized");if(!y.ok)throw new Error("drive folder create failed");return(await y.json()).id}async function _r(e,n,i){let a=`name='${e}' and '${n}' in parents and trashed=false`,m=encodeURIComponent(a),r=await fetch(`https://www.googleapis.com/drive/v3/files?q=${m}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${i}`}});if(r.status===401)throw new Error("unauthorized");if(!r.ok)return null;let y=await r.json();return y.files&&y.files.length>0?y.files[0].id:null}function jr(e,n){let i=hn(e),a=n.replace(/\\/g,"/").replace(/^\/+/,"");return a.endsWith(".json")||(a+=".json"),Fo({[a]:[i,{level:6,mtime:new Date,os:0}]})}async function Vr(e,n,i,a){let m=e.replace(/\.json$/,".zip"),r=await _r(m,i,a),y=new TextEncoder().encode(n).length,c=jr(n,e),S=c.length;u(`Compressing data: ${y} bytes -> ${S} bytes (${Math.round(100-S/y*100)}% reduction)`);let x="-------314159265358979",w=`\r
--${x}\r
`,M=`\r
--${x}--`,I=r?{name:m,mimeType:"application/zip"}:{name:m,mimeType:"application/zip",parents:[i]},P=8192,N="";for(let J=0;J<c.length;J+=P){let le=c.subarray(J,Math.min(J+P,c.length));N+=String.fromCharCode.apply(null,Array.from(le))}let U=btoa(N),Z=w+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(I)+w+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+U+M,ee,j;r?(ee=`https://www.googleapis.com/upload/drive/v3/files/${r}?uploadType=multipart&fields=id,name`,j="PATCH"):(ee="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",j="POST");let he=await fetch(ee,{method:j,headers:{Authorization:`Bearer ${a}`,"Content-Type":`multipart/related; boundary=${x}`},body:Z});if(he.status===401)throw new Error("unauthorized");if(!he.ok)throw new Error("drive upload failed")}async function _o(e){if(u("Auth expired, attempting to renew...",null,"warn"),H.isSignedIn=!1,H.accessToken=null,await _n(),xe(),gt(),e?.retry)try{return e?.silent||xe("authenticating","Renewing authentication..."),await jn(),H.isSignedIn}catch(n){return u("Auto-renewal failed:",n,"error"),e?.silent||xe("error","Authentication renewal failed. Please sign in again."),!1}else return e?.silent||xe("error","Authorization expired. Please sign in again."),!1}async function Kr(e){if(!H.isSignedIn||!H.accessToken){e?.silent||xe("error","Please sign in to Google Drive first");return}try{let{json:n,filename:i,totalVideos:a,totalTimestamps:m}=await Ro();if(m===0){e?.silent||u("Skipping export: no timestamps to back up");return}let r=await qr(H.accessToken);await Vr(i,n,r,H.accessToken),u(`Exported to Google Drive (${i}) with ${a} videos / ${m} timestamps.`)}catch(n){throw n.message==="unauthorized"?(await _o({silent:e?.silent,retry:!1}),n):(u("Drive export failed:",n,"error"),e?.silent||xe("error","Failed to export to Google Drive."),n)}}async function jo(){try{let e=await Zt("autoBackupEnabled"),n=await Zt("autoBackupIntervalMinutes"),i=await Zt("lastAutoBackupAt");typeof e=="boolean"&&(Je=e),typeof n=="number"&&n>0&&(Ce=n),typeof i=="number"&&i>0&&(Pe=i)}catch(e){u("Failed to load auto backup settings:",e,"error")}}async function Vn(){try{await Yt("autoBackupEnabled",Je),await Yt("autoBackupIntervalMinutes",Ce),await Yt("lastAutoBackupAt",Pe??0)}catch(e){u("Failed to save auto backup settings:",e,"error")}}function Wr(){bn&&(clearInterval(bn),bn=null),st&&(clearTimeout(st),st=null)}function lt(e){try{let n=new Date(e),i=new Date,a=n.toDateString()===i.toDateString(),m=n.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return a?m:`${n.toLocaleDateString()} ${m}`}catch{return""}}function gt(){if(!pe)return;let e="",n="";if(!Je)e="\u{1F501} Backup: Off",pe.onmouseenter=null,pe.onmouseleave=null;else if(zt)e="\u{1F501} Backing up\u2026",pe.onmouseenter=null,pe.onmouseleave=null;else if(Ve&&Ve>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(Ve/6e4)}m`,pe.onmouseenter=null,pe.onmouseleave=null;else if(Pe){e=`\u{1F5C4}\uFE0F Last backup: ${lt(Pe)}`;let i=Pe+Math.max(1,Ce)*60*1e3;n=`\u{1F5C4}\uFE0F Next backup: ${lt(i)}`,pe.onmouseenter=()=>{pe.textContent=n},pe.onmouseleave=()=>{pe.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let i=Date.now()+Math.max(1,Ce)*60*1e3;n=`\u{1F5C4}\uFE0F Next backup: ${lt(i)}`,pe.onmouseenter=()=>{pe.textContent=n},pe.onmouseleave=()=>{pe.textContent=e}}pe.textContent=e,pe.style.display=e?"inline":"none",Ot()}function Ot(){if(!yn)return;let e="",n="";if(!Je)e="#ff4d4f",n="Auto backup is disabled";else if(zt)e="#4285f4",n="Backup in progress";else if(Ve&&Ve>0)e="#ffa500",n=`Retrying backup in ${Math.ceil(Ve/6e4)}m`;else if(H.isSignedIn&&Pe){e="#52c41a";let i=Pe+Math.max(1,Ce)*60*1e3,a=lt(i);n=`Last backup: ${lt(Pe)}
Next backup: ${a}`}else if(H.isSignedIn){e="#ffa500";let i=Date.now()+Math.max(1,Ce)*60*1e3;n=`No backup yet
Next backup: ${lt(i)}`}else e="#ff4d4f",n="Not signed in to Google Drive";yn.style.backgroundColor=e,Me(yn,()=>{let i="";if(!Je)i="Auto backup is disabled";else if(zt)i="Backup in progress";else if(Ve&&Ve>0)i=`Retrying backup in ${Math.ceil(Ve/6e4)}m`;else if(H.isSignedIn&&Pe){let a=Pe+Math.max(1,Ce)*60*1e3,m=lt(a);i=`Last backup: ${lt(Pe)}
Next backup: ${m}`}else if(H.isSignedIn){let a=Date.now()+Math.max(1,Ce)*60*1e3;i=`No backup yet
Next backup: ${lt(a)}`}else i="Not signed in to Google Drive";return i})}async function Jt(e=!0){if(!H.isSignedIn||!H.accessToken){e||Gr();return}if(!zt){zt=!0,gt();try{await Kr({silent:e}),Pe=Date.now(),vn=0,Ve=null,st&&(clearTimeout(st),st=null),await Vn()}catch(n){if(u("Auto backup failed:",n,"error"),vn<Rr){vn+=1;let a=Math.min(Hr*Math.pow(2,vn-1),Nr);Ve=a,st&&clearTimeout(st),st=setTimeout(()=>{Jt(!0)},a)}else Ve=null}finally{zt=!1,gt()}}}async function Tn(){if(Wr(),!Je||!H.isSignedIn||!H.accessToken)return;bn=setInterval(()=>{Jt(!0)},Math.max(1,Ce)*60*1e3);let e=Date.now(),n=Math.max(1,Ce)*60*1e3;(!Pe||e-Pe>=n)&&Jt(!0),gt()}async function Vo(){Je=!Je,await Vn(),await Tn(),gt()}async function Ko(){let e=prompt("Set Auto Backup interval (minutes):",String(Ce));if(e===null)return;let n=Math.floor(Number(e));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Ce=n,await Vn(),await Tn(),gt()}var Kn=window.location.hash;if(Kn&&Kn.length>1){let e=new URLSearchParams(Kn.substring(1));if(e.get("state")==="timekeeper_auth"){let i=e.get("access_token");if(i){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",i.length,"characters");try{let a=new BroadcastChannel("timekeeper_oauth"),m={type:"timekeeper_oauth_token",token:i};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:m.type,tokenLength:i.length}),a.postMessage(m),a.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(a){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",a);let m={type:"timekeeper_oauth_token",token:i,timestamp:Date.now()},r=indexedDB.open("ytls-timestamps-db",3);r.onsuccess=()=>{let y=r.result,c=y.transaction("settings","readwrite");c.objectStore("settings").put({key:"oauth_message",value:m}),c.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",m.timestamp),y.close()}}}if(history.replaceState){let a=window.location.pathname+window.location.search;history.replaceState(null,"",a)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(t){return GM.getValue(`timekeeper_${t}`,void 0)}function n(t,o){return GM.setValue(`timekeeper_${t}`,JSON.stringify(o))}if(wn(e),xn(n),await Go()){u("OAuth popup detected, broadcasting token and closing");return}await qn();let a=["/watch","/live"];function m(t=window.location.href){try{let o=new URL(t);return o.origin!=="https://www.youtube.com"?!1:a.some(s=>o.pathname===s||o.pathname.startsWith(`${s}/`))}catch(o){return u("Timekeeper failed to parse URL for support check:",o,"error"),!1}}let r=null,y=null,c=null,S=null,x=null,w=null,M=null,I=null,P=null,N=!1,U="ytls-timestamp-pending-delete",Z="ytls-timestamp-highlight",ee="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",j="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function he(){let t=o=>{let s=new Image;s.src=o};t(ee),t(j)}he();async function J(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(t=>setTimeout(t,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(t=>setTimeout(t,100));await new Promise(t=>setTimeout(t,200))}let le=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],we=5e3,re=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function R(t){return re.has(t)}function F(){return document.querySelector("video")}let oe=null;function Q(){if(oe&&document.contains(oe))return oe;let t=document.getElementById("movie_player");return t&&document.contains(t)?t:null}function ge(t){return le.every(o=>typeof t?.[o]=="function"?!0:R(o)?!!F():!1)}function ut(t){return le.filter(o=>typeof t?.[o]=="function"?!1:R(o)?!F():!0)}async function ze(t=we){let o=Date.now();for(;Date.now()-o<t;){let d=Q();if(ge(d))return d;await new Promise(g=>setTimeout(g,100))}let s=Q();return ge(s),s}let De="timestampOffsetSeconds",Re=-5,ie="shiftClickTimeSkipSeconds",Oe=10,Te=new BroadcastChannel("ytls_timestamp_channel");function tt(t){try{Te.postMessage(t)}catch(o){u("BroadcastChannel error, reopening:",o,"warn");try{Te=new BroadcastChannel("ytls_timestamp_channel"),Te.onmessage=$e,Te.postMessage(t)}catch(s){u("Failed to reopen BroadcastChannel:",s,"error")}}}function $e(t){if(u("Received message from another tab:",t.data),!(!m()||!c||!r)&&t.data){if(t.data.type==="timestamps_updated"&&t.data.videoId===ae)u("Debouncing timestamp load due to external update for video:",t.data.videoId),clearTimeout(be),be=setTimeout(()=>{u("Reloading timestamps due to external update for video:",t.data.videoId),io()},500);else if(t.data.type==="window_position_updated"&&r){let o=t.data.position;o&&typeof o.x=="number"&&typeof o.y=="number"&&(r.style.left=`${Math.max(0,o.x)}px`,r.style.top=`${Math.max(0,o.y)}px`,r.style.right="auto",r.style.bottom="auto",Qe={x:Math.max(0,Math.round(o.x)),y:Math.max(0,Math.round(o.y))},It())}}}Te.onmessage=$e;let Ge=await GM.getValue(De);(typeof Ge!="number"||Number.isNaN(Ge))&&(Ge=Re,await GM.setValue(De,Ge));let Ue=await GM.getValue(ie);(typeof Ue!="number"||Number.isNaN(Ue))&&(Ue=Oe,await GM.setValue(ie,Ue));let be=null,ne=new Map,Ke=!1,D=null,ct=null,ae=null,Ae=null,Xe=null,We=null,qe=null,dt=!1,Qe=null,Qt=null,en=null,tn=null,nn=null,on=null,rn=null,an=null,$t=null,Ht=null,Nt=null,Wn=0,Rt=!1,vt=null,Gt=null;function ue(){return c?Array.from(c.querySelectorAll("li")):[]}function kn(){return ue().map(t=>{let o=t.querySelector("a[data-time]"),s=o?.dataset.time;if(!o||!s)return null;let d=Number.parseInt(s,10);if(!Number.isFinite(d))return null;let f=t.querySelector("input")?.value??"",l=t.dataset.guid??crypto.randomUUID();return t.dataset.guid||(t.dataset.guid=l),{start:d,comment:f,guid:l}}).filter(Jn)}function St(){if(Gt!==null)return Gt;let t=ue();return Gt=t.length>0?Math.max(...t.map(o=>{let s=o.querySelector("a[data-time]")?.getAttribute("data-time");return s?Number.parseInt(s,10):0})):0,Gt}function sn(){Gt=null}function Wo(t){let o=t.querySelector(".time-diff");return o?(o.textContent?.trim()||"").startsWith("-"):!1}function Yo(t,o){return t?o?"\u2514\u2500 ":"\u251C\u2500 ":""}function Ut(t){return t.startsWith("\u251C\u2500 ")||t.startsWith("\u2514\u2500 ")?1:0}function Yn(t){return t.replace(/^[├└]─\s/,"")}function Zo(t){let o=ue();if(t>=o.length-1)return"\u2514\u2500 ";let s=o[t+1].querySelector("input");return s&&Ut(s.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function et(){if(!c)return;let t=ue(),o=!0,s=0,d=t.length;for(;o&&s<d;)o=!1,s++,t.forEach((g,f)=>{let l=g.querySelector("input");if(!l||!(Ut(l.value)===1))return;let b=!1;if(f<t.length-1){let A=t[f+1].querySelector("input");A&&(b=!(Ut(A.value)===1))}else b=!0;let E=Yn(l.value),C=`${Yo(!0,b)}${E}`;l.value!==C&&(l.value=C,o=!0)})}function yt(){if(c)for(;c.firstChild;)c.removeChild(c.firstChild)}function Zn(t){if(!(!r||!c)){if(N=t,t)r.classList.add("ytls-fade-out"),r.classList.remove("ytls-fade-in"),setTimeout(()=>{r.style.display="none"},300);else if(r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),x){let o=Q();if(o){let s=o.getCurrentTime(),d=Number.isFinite(s)?Math.max(0,Math.floor(s)):Math.max(0,St()),g=Math.floor(d/3600),f=Math.floor(d/60)%60,l=d%60,{isLive:v}=o.getVideoData()||{isLive:!1},b=c?Array.from(c.children).map(L=>{let C=L.querySelector("a[data-time]");return C?parseFloat(C.getAttribute("data-time")):0}):[],E="";if(b.length>0)if(v){let L=Math.max(1,d/60),C=b.filter(A=>A<=d);if(C.length>0){let A=(C.length/L).toFixed(2);parseFloat(A)>0&&(E=` (${A}/min)`)}}else{let L=o.getDuration(),C=Number.isFinite(L)&&L>0?L:0,A=Math.max(1,C/60),z=(b.length/A).toFixed(1);parseFloat(z)>0&&(E=` (${z}/min)`)}x.textContent=`\u23F3${g?g+":"+String(f).padStart(2,"0"):f}:${String(l).padStart(2,"0")}${E}`}}nt()}}function Jn(t){return!!t&&Number.isFinite(t.start)&&typeof t.comment=="string"&&typeof t.guid=="string"}function ln(t,o){t.textContent=pt(o),t.dataset.time=String(o),t.href=ho(o,window.location.href)}let un=null,cn=null,Xn=null,bt=!1;function Jo(t){if(!t||typeof t.getVideoData!="function"||!t.getVideoData()?.isLive)return!1;if(typeof t.getProgressState=="function"){let s=t.getProgressState(),d=Number(s?.seekableEnd??s?.liveHead??s?.head??s?.duration),g=Number(s?.current??t.getCurrentTime?.());if(Number.isFinite(d)&&Number.isFinite(g))return d-g>2}return!1}function En(t,o){if(!Number.isFinite(t))return;let s=dn(t),d=s?.dataset.guid??null;d&&(Xn=d),qt(s,o)}function dn(t){if(!Number.isFinite(t))return null;let o=ue();if(o.length===0)return null;let s=null,d=-1/0;for(let g of o){let l=g.querySelector("a[data-time]")?.dataset.time;if(!l)continue;let v=Number.parseInt(l,10);Number.isFinite(v)&&v<=t&&v>d&&(d=v,s=g)}return s}function qt(t,o=!1){if(!t)return;ue().forEach(d=>{d.classList.contains(U)||d.classList.remove(Z)}),t.classList.contains(U)||(t.classList.add(Z),o&&!Ke&&t.scrollIntoView({behavior:"smooth",block:"center"}))}function Xo(t){if(!c||c.querySelector(".ytls-error-message")||!Number.isFinite(t)||t===0)return!1;let o=ue();if(o.length===0)return!1;let s=!1;return o.forEach(d=>{let g=d.querySelector("a[data-time]"),f=g?.dataset.time;if(!g||!f)return;let l=Number.parseInt(f,10);if(!Number.isFinite(l))return;let v=Math.max(0,l+t);v!==l&&(ln(g,v),s=!0)}),s?(jt(),et(),Be(),fn(ae),vt=null,!0):!1}function Qn(t,o={}){if(!Number.isFinite(t)||t===0)return!1;if(!Xo(t)){if(o.alertOnNoChange){let l=o.failureMessage??"Offset did not change any timestamps.";alert(l)}return!1}let d=o.logLabel??"bulk offset";u(`Timestamps changed: Offset all timestamps by ${t>0?"+":""}${t} seconds (${d})`);let g=Q(),f=g?Math.floor(g.getCurrentTime()):0;if(Number.isFinite(f)){let l=dn(f);qt(l,!1)}return!0}function eo(t){if(!c||N)return;let o=t.target instanceof HTMLElement?t.target:null;if(o)if(o.dataset.time){t.preventDefault();let s=Number(o.dataset.time);if(Number.isFinite(s)){bt=!0;let g=Q();g&&g.seekTo(s),setTimeout(()=>{bt=!1},500)}let d=o.closest("li");d&&(ue().forEach(g=>{g.classList.contains(U)||g.classList.remove(Z)}),d.classList.contains(U)||(d.classList.add(Z),d.scrollIntoView({behavior:"smooth",block:"center"})))}else if(o.dataset.increment){t.preventDefault();let d=o.parentElement?.querySelector("a[data-time]");if(!d||!d.dataset.time)return;let g=parseInt(d.dataset.time,10),f=parseInt(o.dataset.increment,10);if("shiftKey"in t&&t.shiftKey&&(f*=Ue),"altKey"in t?t.altKey:!1){Qn(f,{logLabel:"Alt adjust"});return}let b=Math.max(0,g+f);u(`Timestamps changed: Timestamp time incremented from ${g} to ${b}`),ln(d,b),sn();let E=o.closest("li");if(cn=b,un&&clearTimeout(un),bt=!0,un=setTimeout(()=>{if(cn!==null){let L=Q();L&&L.seekTo(cn)}un=null,cn=null,setTimeout(()=>{bt=!1},500)},500),jt(),et(),Be(),E){let L=E.querySelector("input"),C=E.dataset.guid;L&&C&&(Lt(ae,C,b,L.value),vt=C)}}else o.dataset.action==="clear"&&(t.preventDefault(),u("Timestamps changed: All timestamps cleared from UI"),c.textContent="",sn(),Be(),mn(),fn(ae),vt=null)}function _t(t,o="",s=!1,d=null){if(!c)return null;let g=Math.max(0,t),f=d??crypto.randomUUID(),l=document.createElement("li"),v=document.createElement("div"),b=document.createElement("span"),E=document.createElement("span"),L=document.createElement("span"),C=document.createElement("a"),A=document.createElement("span"),z=document.createElement("input"),Y=document.createElement("button");l.dataset.guid=f,v.className="time-row";let se=document.createElement("div");se.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",Me(se,"Click to toggle indent");let me=document.createElement("span");me.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let Fe=()=>{let X=Ut(z.value);me.textContent=X===1?"\u25C0":"\u25B6"},ke=X=>{X.stopPropagation();let V=Ut(z.value),ce=Yn(z.value),de=V===0?1:0,Ee="";if(de===1){let Ft=ue().indexOf(l);Ee=Zo(Ft)}z.value=`${Ee}${ce}`,Fe(),et();let je=Number.parseInt(C.dataset.time??"0",10);Lt(ae,f,je,z.value)};se.onclick=ke,se.append(me),l.style.cssText="position:relative;padding-left:20px;",l.addEventListener("mouseenter",()=>{Fe(),me.style.display="inline"}),l.addEventListener("mouseleave",()=>{me.style.display="none"}),l.addEventListener("mouseleave",()=>{l.dataset.guid===vt&&Wo(l)&&to()}),z.value=o||"",z.style.cssText="width:100%;margin-top:5px;display:block;",z.type="text",z.setAttribute("inputmode","text"),z.autocapitalize="off",z.autocomplete="off",z.spellcheck=!1,z.addEventListener("focusin",()=>{Rt=!1}),z.addEventListener("focusout",X=>{let V=X.relatedTarget,ce=Date.now()-Wn<250,de=!!V&&!!r&&r.contains(V);!ce&&!de&&(Rt=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(z.focus({preventScroll:!0}),Rt=!1)},0))}),z.addEventListener("input",X=>{let V=X;if(V&&(V.isComposing||V.inputType==="insertCompositionText"))return;let ce=ne.get(f);ce&&clearTimeout(ce);let de=setTimeout(()=>{let Ee=Number.parseInt(C.dataset.time??"0",10);Lt(ae,f,Ee,z.value),ne.delete(f)},500);ne.set(f,de)}),z.addEventListener("compositionend",()=>{let X=Number.parseInt(C.dataset.time??"0",10);setTimeout(()=>{Lt(ae,f,X,z.value)},50)}),b.textContent="\u2796",b.dataset.increment="-1",b.style.cursor="pointer",b.style.margin="0px",b.addEventListener("mouseenter",()=>{b.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),b.addEventListener("mouseleave",()=>{b.style.textShadow="none"}),L.textContent="\u2795",L.dataset.increment="1",L.style.cursor="pointer",L.style.margin="0px",L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),E.textContent="\u23FA\uFE0F",E.style.cursor="pointer",E.style.margin="0px",Me(E,"Set to current playback time"),E.addEventListener("mouseenter",()=>{E.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),E.addEventListener("mouseleave",()=>{E.style.textShadow="none"}),E.onclick=()=>{let X=Q(),V=X?Math.floor(X.getCurrentTime()):0;Number.isFinite(V)&&(u(`Timestamps changedset to current playback time ${V}`),ln(C,V),jt(),et(),Lt(ae,f,V,z.value),vt=f)},ln(C,g),sn(),Y.textContent="\u{1F5D1}\uFE0F",Y.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",Y.addEventListener("mouseenter",()=>{Y.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),Y.addEventListener("mouseleave",()=>{Y.style.textShadow="none"}),Y.onclick=()=>{if(l.dataset.deleteConfirmed==="true"){u("Timestamps changed: Timestamp deleted");let X=l.dataset.guid??"";l.remove(),sn(),jt(),et(),Be(),mn(),er(ae,X),vt=null}else{l.dataset.deleteConfirmed="true",l.classList.add(U),l.classList.remove(Z);let X=()=>{l.dataset.deleteConfirmed="false",l.classList.remove(U);let de=Q(),Ee=de?de.getCurrentTime():0,je=Number.parseInt(l.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(Ee)&&Number.isFinite(je)&&Ee>=je&&l.classList.add(Z)},V=de=>{de.target!==Y&&(X(),l.removeEventListener("click",V,!0),document.removeEventListener("click",V,!0))},ce=()=>{l.dataset.deleteConfirmed==="true"&&(X(),c&&c.removeEventListener("mouseleave",ce),l.removeEventListener("click",V,!0),document.removeEventListener("click",V,!0))};l.addEventListener("click",V,!0),document.addEventListener("click",V,!0),c&&c.addEventListener("mouseleave",ce),setTimeout(()=>{l.dataset.deleteConfirmed==="true"&&X(),l.removeEventListener("click",V,!0),document.removeEventListener("click",V,!0),c&&c.removeEventListener("mouseleave",ce)},5e3)}},A.className="time-diff",A.style.color="#888",A.style.marginLeft="5px",v.append(b,E,L,C,A,Y),l.append(se,v,z);let Ye=Number.parseInt(C.dataset.time??"0",10),wt=!1,Ze=ue();for(let X=0;X<Ze.length;X++){let V=Ze[X],de=V.querySelector("a[data-time]")?.dataset.time;if(!de)continue;let Ee=Number.parseInt(de,10);if(Number.isFinite(Ee)&&Ye<Ee){c.insertBefore(l,V),wt=!0;let je=Ze[X-1];if(je){let p=je.querySelector("a[data-time]")?.dataset.time;if(p){let h=Number.parseInt(p,10);Number.isFinite(h)&&(A.textContent=pt(Ye-h))}}else A.textContent="";let mt=V.querySelector(".time-diff");mt&&(mt.textContent=pt(Ee-Ye));break}}if(!wt&&(c.appendChild(l),Ze.length>0)){let ce=Ze[Ze.length-1].querySelector("a[data-time]")?.dataset.time;if(ce){let de=Number.parseInt(ce,10);Number.isFinite(de)&&(A.textContent=pt(Ye-de))}}return l.scrollIntoView({behavior:"smooth",block:"center"}),mn(),et(),Be(),s||(Lt(ae,f,g,o),vt=f,qt(l,!1)),z}function jt(){if(!c||c.querySelector(".ytls-error-message"))return;let t=ue();t.forEach((o,s)=>{let d=o.querySelector(".time-diff");if(!d)return;let f=o.querySelector("a[data-time]")?.dataset.time;if(!f){d.textContent="";return}let l=Number.parseInt(f,10);if(!Number.isFinite(l)){d.textContent="";return}if(s===0){d.textContent="";return}let E=t[s-1].querySelector("a[data-time]")?.dataset.time;if(!E){d.textContent="";return}let L=Number.parseInt(E,10);if(!Number.isFinite(L)){d.textContent="";return}let C=l-L,A=C<0?"-":"";d.textContent=` ${A}${pt(Math.abs(C))}`})}function to(){if(!c||c.querySelector(".ytls-error-message")||N)return;let t=null;if(document.activeElement instanceof HTMLInputElement&&c.contains(document.activeElement)){let l=document.activeElement,b=l.closest("li")?.dataset.guid;if(b){let E=l.selectionStart??l.value.length,L=l.selectionEnd??E,C=l.scrollLeft;t={guid:b,start:E,end:L,scroll:C}}}let o=ue(),s=o.map(l=>l.dataset.guid),d=o.map(l=>{let v=l.querySelector("a[data-time]"),b=v?.dataset.time;if(!v||!b)return null;let E=Number.parseInt(b,10);if(!Number.isFinite(E))return null;let L=l.dataset.guid??"";return{time:E,guid:L,element:l}}).filter(l=>l!==null).sort((l,v)=>{let b=l.time-v.time;return b!==0?b:l.guid.localeCompare(v.guid)}),g=d.map(l=>l.guid),f=s.length!==g.length||s.some((l,v)=>l!==g[v]);for(;c.firstChild;)c.removeChild(c.firstChild);if(d.forEach(l=>{c.appendChild(l.element)}),jt(),et(),Be(),t){let v=ue().find(b=>b.dataset.guid===t.guid)?.querySelector("input");if(v)try{v.focus({preventScroll:!0})}catch{}}f&&(u("Timestamps changed: Timestamps sorted"),fn(ae))}function mn(){if(!c)return;c.children.length>2?(c.style.maxHeight="200px",c.style.overflowY="auto"):(c.style.maxHeight="none",c.style.overflowY="hidden")}function Be(){if(!c)return;let t=F(),o=document.querySelector(".ytp-progress-bar"),s=Q(),d=s?s.getVideoData():null,g=!!d&&!!d.isLive;if(!t||!o||!isFinite(t.duration)||g)return;ro(),ue().map(l=>{let v=l.querySelector("a[data-time]"),b=v?.dataset.time;if(!v||!b)return null;let E=Number.parseInt(b,10);if(!Number.isFinite(E))return null;let C=l.querySelector("input")?.value??"",A=l.dataset.guid??crypto.randomUUID();return l.dataset.guid||(l.dataset.guid=A),{start:E,comment:C,guid:A}}).filter(Jn).forEach(l=>{if(!Number.isFinite(l.start))return;let v=document.createElement("div");v.className="ytls-marker",v.style.position="absolute",v.style.height="100%",v.style.width="2px",v.style.backgroundColor="#ff0000",v.style.cursor="pointer",v.style.left=l.start/t.duration*100+"%",v.dataset.time=String(l.start),v.addEventListener("click",()=>{let b=Q();b&&b.seekTo(l.start)}),o.appendChild(v)})}function fn(t){if(!c||c.querySelector(".ytls-error-message")||!t)return;if(N){u("Save blocked: timestamps are currently loading");return}et();let o=kn().sort((s,d)=>s.start-d.start);lo(t,o).then(()=>u(`Successfully saved ${o.length} timestamps for ${t} to IndexedDB`)).catch(s=>u(`Failed to save timestamps for ${t} to IndexedDB:`,s,"error")),tt({type:"timestamps_updated",videoId:t,action:"saved"})}function Qo(t){let o=t.querySelector("a[data-time]"),s=t.querySelector("input"),d=t.dataset.guid;return!o||!s||!d?null:{start:Number.parseInt(o.dataset.time??"0",10),comment:s.value,guid:d}}function Zr(t,o){if(!t||N)return;let s=Qo(o);s&&(uo(t,s).catch(d=>u(`Failed to save timestamp ${s.guid}:`,d,"error")),tt({type:"timestamps_updated",videoId:t,action:"saved"}))}function Lt(t,o,s,d){if(!t||N)return;let g={guid:o,start:s,comment:d};u(`Saving timestamp: guid=${o}, start=${s}, comment="${d}"`),uo(t,g).catch(f=>u(`Failed to save timestamp ${o}:`,f,"error")),tt({type:"timestamps_updated",videoId:t,action:"saved"})}function er(t,o){!t||N||(u(`Deleting timestamp: guid=${o}`),ur(t,o).catch(s=>u(`Failed to delete timestamp ${o}:`,s,"error")),tt({type:"timestamps_updated",videoId:t,action:"saved"}))}async function no(t){if(!c||c.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let o=ae;if(!o)return;u(`Exporting timestamps for video ID: ${o}`);let s=kn(),d=Math.max(St(),0),g=An();if(t==="json"){let f=new Blob([JSON.stringify(s,null,2)],{type:"application/json"}),l=URL.createObjectURL(f),v=document.createElement("a");v.href=l,v.download=`timestamps-${o}-${g}.json`,v.click(),URL.revokeObjectURL(l)}else if(t==="text"){let f=s.map(E=>{let L=pt(E.start,d),C=`${E.comment} <!-- guid:${E.guid} -->`.trimStart();return`${L} ${C}`}).join(`
`),l=new Blob([f],{type:"text/plain"}),v=URL.createObjectURL(l),b=document.createElement("a");b.href=v,b.download=`timestamps-${o}-${g}.txt`,b.click(),URL.revokeObjectURL(v)}}function oo(t){if(!r||!c){u("Timekeeper error:",t,"error");return}yt();let o=document.createElement("li");o.textContent=t,o.classList.add("ytls-error-message"),o.style.color="#ff6b6b",o.style.fontWeight="bold",o.style.padding="8px",o.style.background="rgba(255, 0, 0, 0.1)",c.appendChild(o),Be()}function ro(){document.querySelectorAll(".ytls-marker").forEach(t=>t.remove())}function It(){if(!r||!document.body.contains(r))return;let t=r.getBoundingClientRect(),o=document.documentElement.clientWidth,s=document.documentElement.clientHeight,d=t.width,g=t.height;if(t.left<0&&(r.style.left="0",r.style.right="auto"),t.right>o){let f=Math.max(0,o-d);r.style.left=`${f}px`,r.style.right="auto"}if(t.top<0&&(r.style.top="0",r.style.bottom="auto"),t.bottom>s){let f=Math.max(0,s-g);r.style.top=`${f}px`,r.style.bottom="auto"}}function tr(){Qt&&(document.removeEventListener("mousemove",Qt),Qt=null),en&&(document.removeEventListener("mouseup",en),en=null),$t&&(document.removeEventListener("keydown",$t),$t=null),tn&&(window.removeEventListener("resize",tn),tn=null),Ht&&(document.removeEventListener("pointerdown",Ht,!0),Ht=null),Nt&&(document.removeEventListener("pointerup",Nt,!0),Nt=null);let t=F();t&&(nn&&(t.removeEventListener("timeupdate",nn),nn=null),on&&(t.removeEventListener("pause",on),on=null),rn&&(t.removeEventListener("play",rn),rn=null),an&&(t.removeEventListener("seeking",an),an=null))}function nr(){ro(),ne.forEach(o=>clearTimeout(o)),ne.clear(),be&&(clearTimeout(be),be=null),P&&(clearInterval(P),P=null),We&&(clearTimeout(We),We=null),Xn=null,tr();try{Te.close()}catch{}D&&D.parentNode===document.body&&document.body.removeChild(D),D=null,ct=null,Ke=!1,ae=null,Ae=null,Xe&&(Xe.disconnect(),Xe=null),r&&r.parentNode&&r.remove();let t=document.getElementById("ytls-header-button");t&&t.parentNode&&t.remove(),qe=null,dt=!1,Qe=null,yt(),r=null,y=null,c=null,S=null,x=null,w=null,M=null,oe=null}async function or(){let t=Sn();if(!t)return oe=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let o=await ze();if(!ge(o)){let s=ut(o),d=s.length?` Missing methods: ${s.join(", ")}.`:"",g=o?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return oe=null,{ok:!1,message:`${g}${d} Try refreshing once playback is ready.`}}return oe=o,{ok:!0,player:o,videoId:t}}async function io(){if(!r||!c)return;let t=c.scrollTop,o=!0,s=()=>{if(!c||!o)return;let d=Math.max(0,c.scrollHeight-c.clientHeight);c.scrollTop=Math.min(t,d)};try{let d=await or();if(!d.ok){oo(d.message),yt(),Be();return}let{videoId:g}=d;x&&Ae&&Me(x,()=>Ae||"");let f=[];try{let l=await cr(g);l?(f=l.map(v=>({...v,guid:v.guid||crypto.randomUUID()})),u(`Loaded ${f.length} timestamps from IndexedDB for ${g}`)):u(`No timestamps found in IndexedDB for ${g}`)}catch(l){u(`Failed to load timestamps from IndexedDB for ${g}:`,l,"error"),yt(),Be();return}if(f.length>0){f.sort((b,E)=>b.start-E.start),yt(),f.forEach(b=>{_t(b.start,b.comment,!0,b.guid)}),et(),Be();let l=Q(),v=l?Math.floor(l.getCurrentTime()):St();Number.isFinite(v)&&(En(v,!0),o=!1)}else yt(),Be()}catch(d){u("Unexpected error while loading timestamps:",d,"error"),oo("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{requestAnimationFrame(s)}}function Sn(){let o=new URLSearchParams(location.search).get("v");if(o)return o;let s=document.querySelector('meta[itemprop="identifier"]');return s?.content?s.content:null}function ao(){let t=document.querySelector('meta[name="title"]');return t?.content?t.content:document.title.replace(" - YouTube","")}function rr(){let t=F();if(!t)return;let o=()=>{if(!c)return;let l=Q(),v=l?Math.floor(l.getCurrentTime()):0;if(!Number.isFinite(v))return;let b=dn(v);qt(b,!1)},s=l=>{try{let v=new URL(window.location.href);l!==null&&Number.isFinite(l)?v.searchParams.set("t",`${Math.floor(l)}s`):v.searchParams.delete("t"),window.history.replaceState({},"",v.toString())}catch{}},d=()=>{let l=Q(),v=l?Math.floor(l.getCurrentTime()):0;Number.isFinite(v)&&s(v)},g=()=>{s(null)},f=()=>{let l=F();if(!l)return;let v=Q(),b=v?Math.floor(v.getCurrentTime()):0;if(!Number.isFinite(b))return;l.paused&&s(b);let E=dn(b);qt(E,!0)};nn=o,on=d,rn=g,an=f,t.addEventListener("timeupdate",o),t.addEventListener("pause",d),t.addEventListener("play",g),t.addEventListener("seeking",f)}let ir="ytls-timestamps-db",ar=3,Mt="timestamps",_e="timestamps_v2",xt="settings",Ct=null,Dt=null;function At(){if(Ct)try{if(Ct.objectStoreNames.length>=0)return Promise.resolve(Ct)}catch(t){u("IndexedDB connection is no longer usable:",t,"warn"),Ct=null}return Dt||(Dt=lr().then(t=>(Ct=t,Dt=null,t.onclose=()=>{u("IndexedDB connection closed unexpectedly","warn"),Ct=null},t.onerror=o=>{u("IndexedDB connection error:",o,"error")},t)).catch(t=>{throw Dt=null,t}),Dt)}async function so(){let t={},o=await mr(_e),s=new Map;for(let f of o){let l=f;s.has(l.video_id)||s.set(l.video_id,[]),s.get(l.video_id).push({guid:l.guid,start:l.start,comment:l.comment})}for(let[f,l]of s)t[`ytls-${f}`]={video_id:f,timestamps:l.sort((v,b)=>v.start-b.start)};return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:o.length}}async function sr(){try{let{json:t,filename:o,totalVideos:s,totalTimestamps:d}=await so(),g=new Blob([t],{type:"application/json"}),f=URL.createObjectURL(g),l=document.createElement("a");l.href=f,l.download=o,l.click(),URL.revokeObjectURL(f),u(`Exported ${s} videos with ${d} timestamps`)}catch(t){throw u("Failed to export data:",t,"error"),t}}function lr(){return new Promise((t,o)=>{let s=indexedDB.open(ir,ar);s.onupgradeneeded=d=>{let g=d.target.result,f=d.oldVersion,l=d.target.transaction;if(f<1&&g.createObjectStore(Mt,{keyPath:"video_id"}),f<2&&!g.objectStoreNames.contains(xt)&&g.createObjectStore(xt,{keyPath:"key"}),f<3){if(g.objectStoreNames.contains(Mt)){u("Exporting backup before v2 migration...");let E=l.objectStore(Mt).getAll();E.onsuccess=()=>{let L=E.result;if(L.length>0)try{let C={},A=0;L.forEach(me=>{if(Array.isArray(me.timestamps)&&me.timestamps.length>0){let Fe=me.timestamps.map(ke=>({guid:ke.guid||crypto.randomUUID(),start:ke.start,comment:ke.comment}));C[`ytls-${me.video_id}`]={video_id:me.video_id,timestamps:Fe.sort((ke,Ye)=>ke.start-Ye.start)},A+=Fe.length}});let z=new Blob([JSON.stringify(C,null,2)],{type:"application/json"}),Y=URL.createObjectURL(z),se=document.createElement("a");se.href=Y,se.download=`timekeeper-data-${An()}.json`,se.click(),URL.revokeObjectURL(Y),u(`Pre-migration backup exported: ${L.length} videos, ${A} timestamps`)}catch(C){u("Failed to export pre-migration backup:",C,"error")}}}let v=g.createObjectStore(_e,{keyPath:"guid"});if(v.createIndex("video_id","video_id",{unique:!1}),v.createIndex("video_start",["video_id","start"],{unique:!1}),g.objectStoreNames.contains(Mt)){let E=l.objectStore(Mt).getAll();E.onsuccess=()=>{let L=E.result;if(L.length>0){let C=0;L.forEach(A=>{Array.isArray(A.timestamps)&&A.timestamps.length>0&&A.timestamps.forEach(z=>{v.put({guid:z.guid||crypto.randomUUID(),video_id:A.video_id,start:z.start,comment:z.comment}),C++})}),u(`Migrated ${C} timestamps from ${L.length} videos to v2 store`)}},g.deleteObjectStore(Mt),u("Deleted old timestamps store after migration to v2")}}},s.onsuccess=d=>{t(d.target.result)},s.onerror=d=>{let g=d.target.error;o(g??new Error("Failed to open IndexedDB"))}})}function Bt(t,o,s){return At().then(d=>new Promise((g,f)=>{let l;try{l=d.transaction(t,o)}catch(E){f(new Error(`Failed to create transaction for ${t}: ${E}`));return}let v=l.objectStore(t),b;try{b=s(v)}catch(E){f(new Error(`Failed to execute operation on ${t}: ${E}`));return}b&&(b.onsuccess=()=>g(b.result),b.onerror=()=>f(b.error??new Error(`IndexedDB ${o} operation failed`))),l.oncomplete=()=>{b||g(void 0)},l.onerror=()=>f(l.error??new Error("IndexedDB transaction failed")),l.onabort=()=>f(l.error??new Error("IndexedDB transaction aborted"))}))}function lo(t,o){return At().then(s=>new Promise((d,g)=>{let f;try{f=s.transaction([_e],"readwrite")}catch(E){g(new Error(`Failed to create transaction: ${E}`));return}let l=f.objectStore(_e),b=l.index("video_id").getAll(IDBKeyRange.only(t));b.onsuccess=()=>{try{let E=b.result,L=new Set(E.map(A=>A.guid)),C=new Set(o.map(A=>A.guid));E.forEach(A=>{C.has(A.guid)||l.delete(A.guid)}),o.forEach(A=>{l.put({guid:A.guid,video_id:t,start:A.start,comment:A.comment})})}catch(E){u("Error during save operation:",E,"error")}},b.onerror=()=>{g(b.error??new Error("Failed to get existing records"))},f.oncomplete=()=>d(),f.onerror=()=>g(f.error??new Error("Failed to save to IndexedDB")),f.onabort=()=>g(f.error??new Error("Transaction aborted during save"))}))}function uo(t,o){return At().then(s=>new Promise((d,g)=>{let f;try{f=s.transaction([_e],"readwrite")}catch(b){g(new Error(`Failed to create transaction: ${b}`));return}let v=f.objectStore(_e).put({guid:o.guid,video_id:t,start:o.start,comment:o.comment});v.onerror=()=>{g(v.error??new Error("Failed to put timestamp"))},f.oncomplete=()=>d(),f.onerror=()=>g(f.error??new Error("Failed to save single timestamp to IndexedDB")),f.onabort=()=>g(f.error??new Error("Transaction aborted during single timestamp save"))}))}function ur(t,o){return At().then(s=>new Promise((d,g)=>{let f;try{f=s.transaction([_e],"readwrite")}catch(b){g(new Error(`Failed to create transaction: ${b}`));return}let v=f.objectStore(_e).delete(o);v.onerror=()=>{g(v.error??new Error("Failed to delete timestamp"))},f.oncomplete=()=>d(),f.onerror=()=>g(f.error??new Error("Failed to delete single timestamp from IndexedDB")),f.onabort=()=>g(f.error??new Error("Transaction aborted during timestamp deletion"))}))}function cr(t){return At().then(o=>new Promise((s,d)=>{let g;try{g=o.transaction([_e],"readonly")}catch(b){u("Failed to create read transaction:",b,"warn"),s(null);return}let v=g.objectStore(_e).index("video_id").getAll(IDBKeyRange.only(t));v.onsuccess=()=>{let b=v.result;if(b.length>0){let E=b.map(L=>({guid:L.guid,start:L.start,comment:L.comment})).sort((L,C)=>L.start-C.start);s(E)}else s(null)},v.onerror=()=>{u("Failed to load timestamps:",v.error,"warn"),s(null)},g.onabort=()=>{u("Transaction aborted during load:",g.error,"warn"),s(null)}}))}function dr(t){return At().then(o=>new Promise((s,d)=>{let g;try{g=o.transaction([_e],"readwrite")}catch(b){d(new Error(`Failed to create transaction: ${b}`));return}let f=g.objectStore(_e),v=f.index("video_id").getAll(IDBKeyRange.only(t));v.onsuccess=()=>{try{v.result.forEach(E=>{f.delete(E.guid)})}catch(b){u("Error during remove operation:",b,"error")}},v.onerror=()=>{d(v.error??new Error("Failed to get records for removal"))},g.oncomplete=()=>s(),g.onerror=()=>d(g.error??new Error("Failed to remove timestamps")),g.onabort=()=>d(g.error??new Error("Transaction aborted during timestamp removal"))}))}function mr(t){return Bt(t,"readonly",o=>o.getAll()).then(o=>Array.isArray(o)?o:[])}function Ln(t,o){Bt(xt,"readwrite",s=>{s.put({key:t,value:o})}).catch(s=>{u(`Failed to save setting '${t}' to IndexedDB:`,s,"error")})}function In(t){return Bt(xt,"readonly",o=>o.get(t)).then(o=>o?.value).catch(o=>{u(`Failed to load setting '${t}' from IndexedDB:`,o,"error")})}async function Jr(t){try{await Bt(xt,"readwrite",o=>{o.put({key:"oauth_message",value:t})})}catch(o){u("Failed to save OAuth message to IndexedDB:",o,"error")}}async function Xr(){try{return(await Bt(xt,"readonly",o=>o.get("oauth_message")))?.value??null}catch(t){return u("Failed to load OAuth message from IndexedDB:",t,"error"),null}}async function Qr(){try{await Bt(xt,"readwrite",t=>{t.delete("oauth_message")})}catch(t){u("Failed to delete OAuth message from IndexedDB:",t,"error")}}function co(){if(!r)return;let t=r.style.display!=="none";Ln("uiVisible",t)}function nt(t){let o=typeof t=="boolean"?t:!!r&&r.style.display!=="none",s=document.getElementById("ytls-header-button");s instanceof HTMLButtonElement&&s.setAttribute("aria-pressed",String(o)),qe&&!dt&&qe.src!==ee&&(qe.src=ee)}function fr(){r&&In("uiVisible").then(t=>{let o=t;typeof o=="boolean"?(o?(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in")):r.style.display="none",nt(o)):(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),nt(!0))}).catch(t=>{u("Failed to load UI visibility state:",t,"error"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),nt(!0)})}function Mn(t){if(!r)return;We&&(clearTimeout(We),We=null);let o=r.style.display==="none";(typeof t=="boolean"?t:o)?(r.style.display="flex",r.classList.remove("ytls-fade-out"),r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),nt(!0),co()):(r.classList.remove("ytls-fade-in"),r.classList.remove("ytls-zoom-in"),r.classList.add("ytls-zoom-out"),nt(!1),We=setTimeout(()=>{r&&(r.style.display="none",co(),We=null)},400))}function mo(t){if(!c){u("UI is not initialized; cannot import timestamps.","warn");return}let o=!1;try{let s=JSON.parse(t),d=null;if(Array.isArray(s))d=s;else if(typeof s=="object"&&s!==null){let g=ae;if(g){let f=`timekeeper-${g}`;s[f]&&Array.isArray(s[f].timestamps)&&(d=s[f].timestamps,u(`Found timestamps for current video (${g}) in export format`,"info"))}if(!d){let f=Object.keys(s).filter(l=>l.startsWith("ytls-"));if(f.length===1&&Array.isArray(s[f[0]].timestamps)){d=s[f[0]].timestamps;let l=s[f[0]].video_id;u(`Found timestamps for video ${l} in export format`,"info")}}}d&&Array.isArray(d)?d.every(f=>typeof f.start=="number"&&typeof f.comment=="string")?(d.forEach(f=>{if(f.guid){let l=ue().find(v=>v.dataset.guid===f.guid);if(l){let v=l.querySelector("input");v&&(v.value=f.comment)}else _t(f.start,f.comment,!1,f.guid)}else _t(f.start,f.comment,!1,crypto.randomUUID())}),o=!0):u("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):u("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!o){let s=t.split(`
`).map(d=>d.trim()).filter(d=>d);if(s.length>0){let d=!1;s.forEach(g=>{let f=g.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(f){d=!0;let l=parseInt(f[1])||0,v=parseInt(f[2]),b=parseInt(f[3]),E=l*3600+v*60+b,L=f[4]?f[4].trim():"",C=null,A=L,z=L.match(/<!--\s*guid:([^>]+?)\s*-->/);z&&(C=z[1].trim(),A=L.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let Y;if(C&&(Y=ue().find(se=>se.dataset.guid===C)),!Y&&!C&&(Y=ue().find(se=>{if(se.dataset.guid)return!1;let Fe=se.querySelector("a[data-time]")?.dataset.time;if(!Fe)return!1;let ke=Number.parseInt(Fe,10);return Number.isFinite(ke)&&ke===E})),Y){let se=Y.querySelector("input");se&&(se.value=A)}else _t(E,A,!1,C||crypto.randomUUID())}}),d&&(o=!0)}}o?(u("Timestamps changed: Imported timestamps from file/clipboard"),et(),fn(ae),Be(),mn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function pr(){if(r&&document.body.contains(r))return;document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),r=document.createElement("div"),y=document.createElement("div"),c=document.createElement("ul"),S=document.createElement("div"),x=document.createElement("span"),w=document.createElement("style"),M=document.createElement("span"),I=document.createElement("span"),I.classList.add("ytls-backup-indicator"),I.style.cursor="pointer",I.style.backgroundColor="#666",I.onclick=p=>{p.stopPropagation(),se("drive")},c.addEventListener("mouseenter",()=>{Ke=!0,Rt=!1}),c.addEventListener("mouseleave",()=>{if(Ke=!1,Rt)return;let p=Q(),h=p?Math.floor(p.getCurrentTime()):St();En(h,!0);let T=null;if(document.activeElement instanceof HTMLInputElement&&c.contains(document.activeElement)&&(T=document.activeElement.closest("li")?.dataset.guid??null),to(),T){let B=ue().find(O=>O.dataset.guid===T)?.querySelector("input");if(B)try{B.focus({preventScroll:!0})}catch{}}}),r.id="ytls-pane",y.id="ytls-pane-header",y.addEventListener("dblclick",p=>{let h=p.target instanceof HTMLElement?p.target:null;h&&(h.closest("a")||h.closest("button")||h.closest("#ytls-current-time")||h.closest(".ytls-version-display")||h.closest(".ytls-backup-indicator"))||(p.preventDefault(),Mn(!1))});let t=GM_info.script.version;M.textContent=`v${t}`,M.classList.add("ytls-version-display");let o=document.createElement("span");o.style.display="inline-flex",o.style.alignItems="center",o.style.gap="6px",o.appendChild(M),o.appendChild(I),x.id="ytls-current-time",x.textContent="\u23F3",x.onclick=()=>{bt=!0;let p=Q();p&&p.seekToLiveHead(),setTimeout(()=>{bt=!1},500)};function s(){if(N||bt)return;let p=F(),h=Q();if(!p&&!h)return;let T=h?h.getCurrentTime():0,k=Number.isFinite(T)?Math.max(0,Math.floor(T)):Math.max(0,St()),B=Math.floor(k/3600),O=Math.floor(k/60)%60,$=k%60,{isLive:q}=h?h.getVideoData()||{isLive:!1}:{isLive:!1},G=h?Jo(h):!1,te=c?Array.from(c.children).map(W=>{let fe=W.querySelector("a[data-time]");return fe?parseFloat(fe.getAttribute("data-time")):0}):[],Se="";if(te.length>0)if(q){let W=Math.max(1,k/60),fe=te.filter(Le=>Le<=k);if(fe.length>0){let Le=(fe.length/W).toFixed(2);parseFloat(Le)>0&&(Se=` (${Le}/min)`)}}else{let W=h?h.getDuration():0,fe=Number.isFinite(W)&&W>0?W:p&&Number.isFinite(p.duration)&&p.duration>0?p.duration:0,Le=Math.max(1,fe/60),ot=(te.length/Le).toFixed(1);parseFloat(ot)>0&&(Se=` (${ot}/min)`)}x.textContent=`\u23F3${B?B+":"+String(O).padStart(2,"0"):O}:${String($).padStart(2,"0")}${Se}`,x.style.color=G?"#ff4d4f":"",te.length>0&&En(k,!1)}s(),P&&clearInterval(P),P=setInterval(s,1e3),S.id="ytls-buttons";let d=(p,h)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),h&&h()},300)},g=p=>h=>{h.key==="Escape"&&(h.preventDefault(),h.stopPropagation(),p())},f=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},l=(p,h)=>T=>{p.contains(T.target)||h()},v=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)},A=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!c||c.querySelector(".ytls-error-message")||N)return;let p=typeof Ge<"u"?Ge:0,h=Q(),T=h?Math.floor(h.getCurrentTime()+p):0;if(!Number.isFinite(T))return;let k=_t(T,"");k&&k.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>se()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(p){if(!c||c.querySelector(".ytls-error-message")||N){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let h=kn(),T=Math.max(St(),0);if(h.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let k=p.ctrlKey,B=h.map(O=>{let $=pt(O.start,T);return k?`${$} ${O.comment} <!-- guid:${O.guid} -->`.trimStart():`${$} ${O.comment}`}).join(`
`);navigator.clipboard.writeText(B).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(O=>{u("Failed to copy timestamps: ",O,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!c||c.querySelector(".ytls-error-message")||N)return;if(ue().length===0){alert("No timestamps available to offset.");return}let h=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(h===null)return;let T=h.trim();if(T.length===0)return;let k=Number.parseInt(T,10);if(!Number.isFinite(k)){alert("Please enter a valid integer number of seconds.");return}k!==0&&Qn(k,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let p=Sn();if(!p){alert("Unable to determine current video ID.");return}let h=document.createElement("div");h.id="ytls-delete-all-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let T=document.createElement("p");T.textContent="Hold the button to delete all timestamps for:",T.style.marginBottom="10px";let k=document.createElement("p");k.textContent=p,k.style.fontFamily="monospace",k.style.fontSize="12px",k.style.marginBottom="15px",k.style.color="#aaa";let B=document.createElement("button");B.classList.add("ytls-save-modal-button"),B.style.background="#d32f2f",B.style.position="relative",B.style.overflow="hidden";let O=null,$=0,q=null,G=document.createElement("div");G.style.position="absolute",G.style.left="0",G.style.top="0",G.style.height="100%",G.style.width="0%",G.style.background="#ff6b6b",G.style.transition="none",G.style.pointerEvents="none",B.appendChild(G);let te=document.createElement("span");te.textContent="Hold to Delete All",te.style.position="relative",te.style.zIndex="1",B.appendChild(te);let Se=()=>{if(!$)return;let He=Date.now()-$,kt=Math.min(He/5e3*100,100);G.style.width=`${kt}%`,kt<100&&(q=requestAnimationFrame(Se))},W=()=>{O&&(clearTimeout(O),O=null),q&&(cancelAnimationFrame(q),q=null),$=0,G.style.width="0%",te.textContent="Hold to Delete All"};B.onmousedown=()=>{$=Date.now(),te.textContent="Deleting...",q=requestAnimationFrame(Se),O=setTimeout(async()=>{W(),h.classList.remove("ytls-fade-in"),h.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(h)&&document.body.removeChild(h);try{await dr(p),Cn()}catch(He){u("Failed to delete all timestamps:",He,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},B.onmouseup=W,B.onmouseleave=W;let fe=null,Le=null,ot=d(h,()=>{W(),fe&&document.removeEventListener("keydown",fe),Le&&document.removeEventListener("click",Le,!0)});fe=g(ot),Le=l(h,ot);let Tt=document.createElement("button");Tt.textContent="Cancel",Tt.classList.add("ytls-save-modal-cancel-button"),Tt.onclick=ot,h.appendChild(T),h.appendChild(k),h.appendChild(B),h.appendChild(Tt),document.body.appendChild(h),f(fe),v(Le)}}],z=go();A.forEach(p=>{let h=document.createElement("button");if(h.textContent=p.label,Me(h,p.title),h.classList.add("ytls-main-button"),p.label==="\u{1F423}"&&z){let T=document.createElement("span");T.textContent=z,T.classList.add("ytls-holiday-emoji"),h.appendChild(T)}p.label==="\u{1F4CB}"?h.onclick=function(T){p.action.call(this,T)}:h.onclick=p.action,p.label==="\u2699\uFE0F"&&(ct=h),S.appendChild(h)});function Y(p,h,T){let k=document.createElement("button");return k.textContent=p,Me(k,h),k.classList.add("ytls-settings-modal-button"),k.onclick=T,k}function se(p="general"){if(D&&D.parentNode===document.body){let Ie=document.getElementById("ytls-save-modal"),ft=document.getElementById("ytls-load-modal"),rt=document.getElementById("ytls-delete-all-modal");Ie&&document.body.contains(Ie)&&document.body.removeChild(Ie),ft&&document.body.contains(ft)&&document.body.removeChild(ft),rt&&document.body.contains(rt)&&document.body.removeChild(rt),D.classList.remove("ytls-fade-in"),D.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(D)&&document.body.removeChild(D),D=null,document.removeEventListener("click",Fe,!0),document.removeEventListener("keydown",me)},300);return}D=document.createElement("div"),D.id="ytls-settings-modal",D.classList.remove("ytls-fade-out"),D.classList.add("ytls-fade-in");let h=document.createElement("div");h.className="ytls-modal-header";let T=document.createElement("div");T.id="ytls-settings-nav";let k=document.createElement("button");k.className="ytls-modal-close-button",k.textContent="\u2715",Me(k,"Close"),k.onclick=()=>{if(D&&D.parentNode===document.body){let Ie=document.getElementById("ytls-save-modal"),ft=document.getElementById("ytls-load-modal"),rt=document.getElementById("ytls-delete-all-modal");Ie&&document.body.contains(Ie)&&document.body.removeChild(Ie),ft&&document.body.contains(ft)&&document.body.removeChild(ft),rt&&document.body.contains(rt)&&document.body.removeChild(rt),D.classList.remove("ytls-fade-in"),D.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(D)&&document.body.removeChild(D),D=null,document.removeEventListener("click",Fe,!0),document.removeEventListener("keydown",me)},300)}};let B=document.createElement("div");B.id="ytls-settings-content";let O=document.createElement("h3");O.className="ytls-section-heading",O.textContent="General",O.style.display="none";let $=document.createElement("div"),q=document.createElement("div");q.className="ytls-button-grid";function G(Ie){$.style.display=Ie==="general"?"block":"none",q.style.display=Ie==="drive"?"block":"none",te.classList.toggle("active",Ie==="general"),W.classList.toggle("active",Ie==="drive"),O.textContent=Ie==="general"?"General":"Google Drive"}let te=document.createElement("button");te.textContent="\u{1F6E0}\uFE0F";let Se=document.createElement("span");Se.className="ytls-tab-text",Se.textContent=" General",te.appendChild(Se),Me(te,"General settings"),te.classList.add("ytls-settings-modal-button"),te.onclick=()=>G("general");let W=document.createElement("button");W.textContent="\u2601\uFE0F";let fe=document.createElement("span");fe.className="ytls-tab-text",fe.textContent=" Backup",W.appendChild(fe),Me(W,"Google Drive sign-in and backup"),W.classList.add("ytls-settings-modal-button"),W.onclick=async()=>{H.isSignedIn&&await qo(),G("drive")},T.appendChild(te),T.appendChild(W),h.appendChild(T),h.appendChild(k),D.appendChild(h),$.className="ytls-button-grid",$.appendChild(Y("\u{1F4BE} Save","Save As...",ke.onclick)),$.appendChild(Y("\u{1F4C2} Load","Load",Ye.onclick)),$.appendChild(Y("\u{1F4E4} Export All","Export All Data",wt.onclick)),$.appendChild(Y("\u{1F4E5} Import All","Import All Data",Ze.onclick));let Le=Y(H.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",H.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{H.isSignedIn?await Uo():await jn(),Le.textContent=H.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",Me(Le,H.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive")});q.appendChild(Le);let ot=Y(Je?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await Vo(),ot.textContent=Je?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off"});q.appendChild(ot);let Tt=Y(`\u23F1\uFE0F Backup Interval: ${Ce}min`,"Set periodic backup interval (minutes)",async()=>{await Ko(),Tt.textContent=`\u23F1\uFE0F Backup Interval: ${Ce}min`});q.appendChild(Tt),q.appendChild(Y("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await Jt(!1)}));let He=document.createElement("div");He.style.marginTop="15px",He.style.paddingTop="10px",He.style.borderTop="1px solid #555",He.style.fontSize="12px",He.style.color="#aaa";let kt=document.createElement("div");kt.style.marginBottom="8px",kt.style.fontWeight="bold",He.appendChild(kt),Ho(kt);let Dn=document.createElement("div");Dn.style.marginBottom="8px",Oo(Dn),He.appendChild(Dn);let po=document.createElement("div");$o(po),He.appendChild(po),q.appendChild(He),xe(),Xt(),gt(),B.appendChild(O),B.appendChild($),B.appendChild(q),G(p),D.appendChild(B),document.body.appendChild(D),requestAnimationFrame(()=>{let Ie=D.getBoundingClientRect(),rt=(window.innerHeight-Ie.height)/2;D.style.top=`${Math.max(20,rt)}px`,D.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Fe,!0),document.addEventListener("keydown",me)},0)}function me(p){if(p.key==="Escape"&&D&&D.parentNode===document.body){let h=document.getElementById("ytls-save-modal"),T=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");if(h||T||k)return;p.preventDefault(),h&&document.body.contains(h)&&document.body.removeChild(h),T&&document.body.contains(T)&&document.body.removeChild(T),k&&document.body.contains(k)&&document.body.removeChild(k),D.classList.remove("ytls-fade-in"),D.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(D)&&document.body.removeChild(D),D=null,document.removeEventListener("click",Fe,!0),document.removeEventListener("keydown",me)},300)}}function Fe(p){if(ct&&ct.contains(p.target))return;let h=document.getElementById("ytls-save-modal"),T=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");h&&h.contains(p.target)||T&&T.contains(p.target)||k&&k.contains(p.target)||D&&D.contains(p.target)||(h&&document.body.contains(h)&&document.body.removeChild(h),T&&document.body.contains(T)&&document.body.removeChild(T),k&&document.body.contains(k)&&document.body.removeChild(k),D&&D.parentNode===document.body&&(D.classList.remove("ytls-fade-in"),D.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(D)&&document.body.removeChild(D),D=null,document.removeEventListener("click",Fe,!0),document.removeEventListener("keydown",me)},300)))}let ke=document.createElement("button");ke.textContent="\u{1F4BE} Save",ke.classList.add("ytls-file-operation-button"),ke.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let h=document.createElement("p");h.textContent="Save as:";let T=null,k=null,B=d(p,()=>{T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0)});T=g(B),k=l(p,B);let O=document.createElement("button");O.textContent="JSON",O.classList.add("ytls-save-modal-button"),O.onclick=()=>{T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0),d(p,()=>no("json"))()};let $=document.createElement("button");$.textContent="Plain Text",$.classList.add("ytls-save-modal-button"),$.onclick=()=>{T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0),d(p,()=>no("text"))()};let q=document.createElement("button");q.textContent="Cancel",q.classList.add("ytls-save-modal-cancel-button"),q.onclick=B,p.appendChild(h),p.appendChild(O),p.appendChild($),p.appendChild(q),document.body.appendChild(p),f(T),v(k)};let Ye=document.createElement("button");Ye.textContent="\u{1F4C2} Load",Ye.classList.add("ytls-file-operation-button"),Ye.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let h=document.createElement("p");h.textContent="Load from:";let T=null,k=null,B=d(p,()=>{T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0)});T=g(B),k=l(p,B);let O=document.createElement("button");O.textContent="File",O.classList.add("ytls-save-modal-button"),O.onclick=()=>{let G=document.createElement("input");G.type="file",G.accept=".json,.txt",G.classList.add("ytls-hidden-file-input"),G.onchange=te=>{let Se=te.target.files?.[0];if(!Se)return;T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0),B();let W=new FileReader;W.onload=()=>{let fe=String(W.result).trim();mo(fe)},W.readAsText(Se)},G.click()};let $=document.createElement("button");$.textContent="Clipboard",$.classList.add("ytls-save-modal-button"),$.onclick=async()=>{T&&document.removeEventListener("keydown",T),k&&document.removeEventListener("click",k,!0),d(p,async()=>{try{let G=await navigator.clipboard.readText();G?mo(G.trim()):alert("Clipboard is empty.")}catch(G){u("Failed to read from clipboard: ",G,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let q=document.createElement("button");q.textContent="Cancel",q.classList.add("ytls-save-modal-cancel-button"),q.onclick=B,p.appendChild(h),p.appendChild(O),p.appendChild($),p.appendChild(q),document.body.appendChild(p),f(T),v(k)};let wt=document.createElement("button");wt.textContent="\u{1F4E4} Export",wt.classList.add("ytls-file-operation-button"),wt.onclick=async()=>{try{await sr()}catch{alert("Failed to export data: Could not read from database.")}};let Ze=document.createElement("button");Ze.textContent="\u{1F4E5} Import",Ze.classList.add("ytls-file-operation-button"),Ze.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=h=>{let T=h.target.files?.[0];if(!T)return;let k=new FileReader;k.onload=()=>{try{let B=JSON.parse(String(k.result)),O=[];for(let $ in B)if(Object.prototype.hasOwnProperty.call(B,$)&&$.startsWith("ytls-")){let q=$.substring(5),G=B[$];if(G&&typeof G.video_id=="string"&&Array.isArray(G.timestamps)){let te=G.timestamps.map(W=>({...W,guid:W.guid||crypto.randomUUID()})),Se=lo(q,te).then(()=>u(`Imported ${q} to IndexedDB`)).catch(W=>u(`Failed to import ${q} to IndexedDB:`,W,"error"));O.push(Se)}else u(`Skipping key ${$} during import due to unexpected data format.`,"warn")}Promise.all(O).then(()=>{Cn()}).catch($=>{alert("An error occurred during import to IndexedDB. Check console for details."),u("Overall import error:",$,"error")})}catch(B){alert(`Failed to import data. Please ensure the file is in the correct format.
`+B.message),u("Import error:",B,"error")}},k.readAsText(T)},p.click()},w.textContent=vo,c.onclick=p=>{eo(p)},c.ontouchstart=p=>{eo(p)};function X(){r&&(u("Loading window position from IndexedDB"),In("windowPosition").then(p=>{if(p&&typeof p.x=="number"&&typeof p.y=="number"){let T=p;r.style.left=`${T.x}px`,r.style.top=`${T.y}px`,r.style.right="auto",r.style.bottom="auto",Qe={x:Math.max(0,Math.round(T.x)),y:Math.max(0,Math.round(T.y))}}else u("No window position found in IndexedDB, leaving default position"),Qe=null;It();let h=r.getBoundingClientRect();(h.width||h.height)&&(Qe={x:Math.max(0,Math.round(h.left)),y:Math.max(0,Math.round(h.top))})}).catch(p=>{u("failed to load pane position from IndexedDB:",p,"warn"),It();let h=r.getBoundingClientRect();(h.width||h.height)&&(Qe={x:Math.max(0,Math.round(h.left)),y:Math.max(0,Math.round(h.top))})}))}function V(){if(!r)return;let p=r.getBoundingClientRect(),h={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top))};if(Qe&&Qe.x===h.x&&Qe.y===h.y){u("Skipping window position save; position unchanged");return}Qe={...h},u(`Saving window position to IndexedDB: x=${h.x}, y=${h.y}`),Ln("windowPosition",h),tt({type:"window_position_updated",position:h,timestamp:Date.now()})}r.style.position="fixed",r.style.bottom="0",r.style.right="0",r.style.transition="none",X(),setTimeout(()=>It(),10);let ce=!1,de,Ee,je=!1;r.addEventListener("mousedown",p=>{let h=p.target;h instanceof Element&&(h instanceof HTMLInputElement||h instanceof HTMLTextAreaElement||h!==y&&!y.contains(h)&&window.getComputedStyle(h).cursor==="pointer"||(ce=!0,je=!1,de=p.clientX-r.getBoundingClientRect().left,Ee=p.clientY-r.getBoundingClientRect().top,r.style.transition="none"))}),document.addEventListener("mousemove",Qt=p=>{if(!ce)return;je=!0;let h=p.clientX-de,T=p.clientY-Ee,k=r.getBoundingClientRect(),B=k.width,O=k.height,$=document.documentElement.clientWidth,q=document.documentElement.clientHeight;h=Math.max(0,Math.min(h,$-B)),T=Math.max(0,Math.min(T,q-O)),r.style.left=`${h}px`,r.style.top=`${T}px`,r.style.right="auto",r.style.bottom="auto"}),document.addEventListener("mouseup",en=()=>{if(!ce)return;ce=!1;let p=je;setTimeout(()=>{je=!1},50),It(),setTimeout(()=>{p&&V()},200)}),r.addEventListener("dragstart",p=>p.preventDefault());let mt=null;window.addEventListener("resize",tn=()=>{mt&&clearTimeout(mt),mt=setTimeout(()=>{It(),V(),mt=null},200)}),y.appendChild(x),y.appendChild(o);let Ft=document.createElement("div");Ft.id="ytls-content",Ft.append(c,S),r.append(y,Ft,w),Ht||document.addEventListener("pointerdown",Ht=()=>{Wn=Date.now()},!0),Nt||document.addEventListener("pointerup",Nt=()=>{},!0)}async function hr(){r&&(await fr(),typeof Un=="function"&&Un(so),typeof xn=="function"&&xn(Ln),typeof wn=="function"&&wn(In),typeof Gn=="function"&&Gn(I),await qn(),await jo(),await Tn(),typeof Ot=="function"&&Ot(),document.body.appendChild(r))}function fo(t=0){if(document.getElementById("ytls-header-button")){nt();return}let o=document.querySelector("#logo");if(!o||!o.parentElement){t<10&&setTimeout(()=>fo(t+1),300);return}let s=document.createElement("button");s.id="ytls-header-button",s.type="button",s.className="ytls-header-button",Me(s,"Toggle Timekeeper UI"),s.setAttribute("aria-label","Toggle Timekeeper UI");let d=document.createElement("img");d.src=ee,d.alt="",d.decoding="async",s.appendChild(d),qe=d,s.addEventListener("mouseenter",()=>{qe&&(dt=!0,qe.src=j)}),s.addEventListener("mouseleave",()=>{qe&&(dt=!1,nt())}),s.addEventListener("click",()=>{Mn()}),o.insertAdjacentElement("afterend",s),nt(),u("Timekeeper header button added next to YouTube logo")}function gr(){if(Xe)return;Xe=new MutationObserver(()=>{let s=ao();s!==Ae&&(Ae=s,x&&(Me(x,()=>Ae||""),u("Video title changed, updated tooltip:",Ae)))});let t=document.querySelector('meta[name="title"]');t&&Xe.observe(t,{attributes:!0,attributeFilter:["content"]});let o=document.querySelector("title");o&&Xe.observe(o,{childList:!0,characterData:!0,subtree:!0}),u("Title observer initialized")}async function Cn(){if(!m()){nr();return}await J(),await pr(),document.querySelectorAll("#ytls-pane").forEach((o,s)=>{s>0&&o.remove()}),ae=Sn(),Ae=ao();let t=document.title;u("Page Title:",t),u("Video ID:",ae),u("Video Title:",Ae),u("Current URL:",window.location.href),x&&Ae&&Me(x,()=>Ae||""),gr(),yt(),Be(),await io(),Be(),Zn(!1),u("Timestamps loaded and UI unlocked for video:",ae),await hr(),fo(),rr()}window.addEventListener("yt-navigate-start",()=>{u("Navigation started (yt-navigate-start event fired)"),m()&&r&&c&&(u("Locking UI and showing loading state for navigation"),Zn(!0))}),$t=t=>{t.ctrlKey&&t.altKey&&t.shiftKey&&(t.key==="T"||t.key==="t")&&(t.preventDefault(),Mn(),u("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",$t),window.addEventListener("yt-navigate-finish",()=>{u("Navigation finished (yt-navigate-finish event fired)"),Cn()}),u("Timekeeper initialized and waiting for navigation events")})();})();

