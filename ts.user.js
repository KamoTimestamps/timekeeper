// ==UserScript==
// @name         YouTube Timestamp Tool by Vat5aL
// @namespace    http://tampermonkey.net/
// @updateURL https://openuserjs.org/meta/Vat5aL/YouTube_Timestamp_Tool_by_Vat5aL.meta.js
// @downloadURL https://openuserjs.org/install/Vat5aL/YouTube_Timestamp_Tool_by_Vat5aL.user.js
// @version      1.1
// @description  Enhanced timestamp tool for YouTube videos
// @author       Vat5aL
// @match        https://www.youtube.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-end
// @license MIT
// ==/UserScript==

(async function () {
  'use strict';

  if (window.top !== window.self) {
    return; // Don't run in iframes
  }

  // Configuration for timestamp offset
  const OFFSET_KEY = "timestampOffsetSeconds";
  const DEFAULT_OFFSET = -3;

  // Configuration for shift-click time skip interval
  const SHIFT_SKIP_KEY = "shiftClickTimeSkipSeconds";
  const DEFAULT_SHIFT_SKIP = 10;

  // The user can configure 'timestampOffsetSeconds' in ViolentMonkey's script values.
  // Default is -5 seconds (5 seconds before current time).
  // A positive value will make it after current time, negative before.
  let configuredOffset = await GM.getValue(OFFSET_KEY);
  if (typeof configuredOffset === 'undefined') {
    await GM.setValue(OFFSET_KEY, DEFAULT_OFFSET);
    configuredOffset = DEFAULT_OFFSET;
  }

  let configuredShiftSkip = await GM.getValue(SHIFT_SKIP_KEY);
  if (typeof configuredShiftSkip === 'undefined') {
    await GM.setValue(SHIFT_SKIP_KEY, DEFAULT_SHIFT_SKIP);
    configuredShiftSkip = DEFAULT_SHIFT_SKIP;
  }

  let isMouseOverTimestamps = false; // Default to false

  function clearTimestampsDisplay() {
    while (list.firstChild) { // Clear the existing timestamps
      list.removeChild(list.firstChild);
    }
  }

  // Helper function to format time in HH:MM:SS
  function formatTimeString(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function formatTime(e, t) {
    e.textContent = formatTimeString(t);
    e.dataset.time = t;
    const vid = location.search.split(/.+v=|&/)[1] || location.href.split(/\/live\/|\/shorts\/|\?|&/)[1];
    e.href = "https://youtu.be/" + vid + "?t=" + t;
  }

  function handleClick(e) {
    if (e.target.dataset.time) {
      e.preventDefault();
      document.querySelector("video").currentTime = e.target.dataset.time;
    } else if (e.target.dataset.increment) {
      e.preventDefault();
      var t = e.target.parentElement.querySelector('a[data-time]');
      var currTime = parseInt(t.dataset.time);
      var increment = parseInt(e.target.dataset.increment);

      // Check if Shift key is pressed
      if (e.shiftKey) {
        increment *= configuredShiftSkip; // Use configured shift skip interval
      }

      var newTime = Math.max(0, currTime + increment);
      formatTime(t, newTime);
      document.querySelector("video").currentTime = newTime; // Seek to the new timestamp

      // Reorder the timestamp in the list if necessary
      const li = t.closest('li');
      li.remove(); // Remove the current list item

      let inserted = false;
      for (let i = 0; i < list.children.length; i++) {
        const existingTime = parseInt(list.children[i].querySelector('a[data-time]').dataset.time);
        if (newTime < existingTime) {
          list.insertBefore(li, list.children[i]);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        list.appendChild(li); // Append to the end if no earlier timestamp is found
      }

      updateSeekbarMarkers();
      saveTimestamps();
    } else if (e.target.dataset.action === "clear") {
      e.preventDefault();
      list.textContent = "";
      updateSeekbarMarkers();
      updateScroll();
      saveTimestamps();
    }
  }

  function addTimestamp(e, t) {
    var li = document.createElement("li"), timeRow = document.createElement("div"), minus = document.createElement("span"),
      record = document.createElement("span"), plus = document.createElement("span"), a = document.createElement("a"),
      commentInput = document.createElement("input"), del = document.createElement("button");

    timeRow.className = "time-row";
    minus.textContent = "➖"; minus.dataset.increment = -1; minus.style.cursor = "pointer";
    plus.textContent = "➕"; plus.dataset.increment = 1; plus.style.cursor = "pointer";
    record.textContent = "⏺️"; record.style.cursor = "pointer"; record.style.margin = "0 5px;";
    record.title = "Set to current playback time";

    // Add click event to the record button
    record.onclick = () => {
      const video = document.querySelector("video");
      if (video) {
        const currentTime = Math.floor(video.currentTime);
        formatTime(a, currentTime);
        saveTimestamps();
      }
    };

    formatTime(a, e);
    commentInput.value = t || "";
    commentInput.style = "width:200px;margin-top:5px;display:block;";
    commentInput.addEventListener("input", saveTimestamps); // Save timestamps on comment edit
    del.textContent = "🗑️"; del.style = "background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;";
    del.onclick = () => {
      if (li.dataset.deleteConfirmed === "true") {
        li.remove(); // Remove the timestamp
        updateSeekbarMarkers();
        updateScroll();
        saveTimestamps();
      } else {
        li.dataset.deleteConfirmed = "true"; // Mark as ready for deletion
        li.style.background = "darkred"; // Change background to dark red

        // Reset deletion state after 5 seconds
        setTimeout(() => {
          if (li.dataset.deleteConfirmed === "true") {
            li.dataset.deleteConfirmed = "false"; // Reset the flag
            li.style.background = "rgba(255, 255, 255, 0.05)"; // Reset background
          }
        }, 5000);
      }
    };

    timeRow.append(minus, record, plus, a, del);
    li.append(timeRow, commentInput);
    li.style = "display:flex;flex-direction:column;gap:5px;padding:5px;background:rgba(255,255,255,0.05);border-radius:3px;";

    // Insert the new timestamp in the correct order
    let inserted = false;
    for (let i = 0; i < list.children.length; i++) {
      const existingTime = parseInt(list.children[i].querySelector('a[data-time]').dataset.time);
      if (e < existingTime) {
        list.insertBefore(li, list.children[i]);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      list.appendChild(li); // Append to the end if no earlier timestamp is found
    }

    updateScroll();
    updateSeekbarMarkers();
    saveTimestamps();
    return commentInput;
  }

  function updateScroll() {
    var tsCount = list.children.length;
    if (tsCount > 2) {
      list.style.maxHeight = "200px";
      list.style.overflowY = "auto";
    } else {
      list.style.maxHeight = "none";
      list.style.overflowY = "hidden";
    }
  }

  function updateSeekbarMarkers() {
    var video = document.querySelector("video");
    var progressBar = document.querySelector(".ytp-progress-bar");
    if (!video || !progressBar || !isFinite(video.duration)) return;

    var existingMarkers = document.querySelectorAll(".ytls-marker");
    existingMarkers.forEach(marker => marker.remove());

    var timestamps = Array.from(list.children).map(li => {
      var startLink = li.querySelector('a[data-time]');
      var comment = li.querySelector('input').value;
      var startTime = parseInt(startLink.dataset.time);
      return { start: startTime, comment: comment };
    });

    timestamps.forEach(ts => {
      if (ts.start) {
        var marker = document.createElement("div");
        marker.className = "ytls-marker";
        marker.style.position = "absolute";
        marker.style.height = "100%";
        marker.style.width = "2px";
        marker.style.backgroundColor = "#ff0000";
        marker.style.cursor = "pointer";
        marker.style.left = (ts.start / video.duration * 100) + "%";
        marker.dataset.time = ts.start;
        marker.addEventListener("click", () => video.currentTime = ts.start);
        progressBar.appendChild(marker);
      }
    });
  }

  function saveTimestamps() {
    const videoId = getVideoId();
    if (!videoId) return;

    const timestamps = Array.from(list.children).map(li => {
      const startLink = li.querySelector('a[data-time]');
      const comment = li.querySelector('input').value;
      const startTime = parseInt(startLink.dataset.time);
      return { start: startTime, comment: comment };
    });

    if (timestamps.length === 0) {
      // If there are no timestamps, remove the local storage entry
      localStorage.removeItem(`ytls-${videoId}`);
    } else {
      // Save timestamps in the new format
      const data = { video_id: videoId, timestamps: timestamps };
      localStorage.setItem(`ytls-${videoId}`, JSON.stringify(data));
    }
  }

  function saveTimestampsAs(format) {
    const videoId = getVideoId();
    if (!videoId) return;

    const timestamps = Array.from(list.children).map(li => {
      const startLink = li.querySelector('a[data-time]');
      const comment = li.querySelector('input').value;
      const startTime = parseInt(startLink.dataset.time);
      return { start: startTime, comment: comment };
    });

    if (format === "json") {
      const blob = new Blob([JSON.stringify(timestamps, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `timestamps-${videoId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "text") {
      const plainText = timestamps.map(ts => `${formatTimeString(ts.start)} ${ts.comment}`).join("\n");
      const blob = new Blob([plainText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `timestamps-${videoId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  function loadTimestamps() {
    console.log(`loadTimestamps start`);
    const videoId = getVideoId();
    if (!videoId) return;
    console.log(`loadTimestamps for ${videoId}`);

    const savedData = localStorage.getItem(`ytls-${videoId}`);
    if (!savedData) return;

    let data;
    try {
      data = JSON.parse(savedData);
    } catch (e) {
      console.error("Failed to parse saved data:", e);
      return;
    }

    // Check if the data is in the old format (array of timestamps)
    if (Array.isArray(data)) {
      console.log("Converting old timestamp format to new format...");
      const newData = { video_id: videoId, timestamps: data };
      localStorage.setItem(`ytls-${videoId}`, JSON.stringify(newData));
      data = newData;
    }

    // Load timestamps from the new format
    if (data.video_id === videoId && Array.isArray(data.timestamps)) {
      clearTimestampsDisplay();
      data.timestamps.forEach(ts => {
        addTimestamp(ts.start, ts.comment);
      });

      // Automatically open the tool if timestamps are loaded
      pane.classList.remove("minimized");
      updateSeekbarMarkers();
    } else {
      console.error("Invalid timestamp data format.");
    }
  }

  function getVideoId() {
    // Try to get the video ID from the URL first
    const urlParams = new URLSearchParams(location.search);
    const videoId = urlParams.get("v");
    if (videoId) {
      return videoId; // Return the video ID if found in the URL
    }

    // Fallback to the clip method using the meta property
    const clipIdMeta = document.querySelector('meta[itemprop="identifier"]');
    if (clipIdMeta) {
      return clipIdMeta.content; // Return the clip identifier if available
    }

    // Return null if no video ID or clip identifier is found
    return null;
  }

  function highlightNearestTimestamp() {
    const video = document.querySelector("video");
    if (!video) return;

    video.addEventListener("timeupdate", () => {
      if (isMouseOverTimestamps) return; // Skip auto-scrolling if the mouse is over the timestamps window

      const currentTime = Math.floor(video.currentTime);
      let nearestTimestamp = null;
      let smallestDifference = Infinity;

      // Find the nearest timestamp
      Array.from(list.children).forEach(li => {
        const timestamp = parseInt(li.querySelector('a[data-time]').dataset.time);
        const difference = Math.abs(currentTime - timestamp);
        if (difference < smallestDifference) {
          smallestDifference = difference;
          nearestTimestamp = li;
        }
      });

      // Highlight the nearest timestamp
      Array.from(list.children).forEach(li => {
        // Skip resetting the background if it's marked for deletion (dark red)
        if (li.style.background !== "darkred") {
          li.style.background = "rgba(255, 255, 255, 0.05)"; // Reset background
        }
      });

      if (nearestTimestamp && nearestTimestamp.style.background !== "darkred") {
        nearestTimestamp.style.background = "rgba(0, 128, 255, 0.2)"; // Highlight nearest timestamp
        nearestTimestamp.scrollIntoView({ behavior: "smooth", block: "center" }); // Scroll to it
      }
    });
  }

  if (!document.querySelector("#ytls-pane")) {
    // Remove any stray minimized icons before creating a new pane
    document.querySelectorAll("#ytls-pane").forEach(el => el.remove());

    var pane = document.createElement("div"),
      header = document.createElement("div"),
      list = document.createElement("ul"), // Ensure `list` is initialized here
      btns = document.createElement("div"),
      addBtn = document.createElement("button"),
      timeDisplay = document.createElement("span"),
      style = document.createElement("style"),
      minimizeBtn = document.createElement("button");

    // Add event listeners to `list` after it is initialized
    list.addEventListener("mouseenter", () => {
      isMouseOverTimestamps = true;
    });

    list.addEventListener("mouseleave", () => {
      isMouseOverTimestamps = false;
    });

    pane.id = "ytls-pane";
    pane.classList.add("minimized");
    header.style = "display:flex;justify-content:flex-start;align-items:center;padding:5px;"; // Align items to the top-left
    timeDisplay.id = "ytls-current-time";
    timeDisplay.textContent = "CT: ";
    timeDisplay.style = "color:white;font-size:14px;cursor:pointer;"; // Add pointer cursor

    // Enable clicking on the current timestamp to jump to the latest point in the live stream
    timeDisplay.onclick = () => {
      const video = document.querySelector("video");
      video.currentTime = video.seekable.end(video.seekable.length - 1);
    };

    minimizeBtn.textContent = "▶️";
    minimizeBtn.style = "background:transparent;border:none;color:white;cursor:pointer;font-size:16px;margin-right:10px;"; // Adjust margin for spacing
    minimizeBtn.id = "ytls-minimize";
    function updateTime() {
      var v = document.querySelector("video");
      if (v) {
        var t = Math.floor(v.currentTime), h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60;
        timeDisplay.textContent = `CT: ${h ? h + ":" + String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}`;
      }
      requestAnimationFrame(updateTime);
    }
    updateTime();
    btns.id = "ytls-buttons";

    // Update the "Add TS" button to "Add timestamp" and style it similarly to the "Settings" button.
    addBtn.textContent = "🐣 Add timestamp";
    addBtn.style = "background:#555;color:white;font-size:14px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;margin-right:10px;";

    // Update the "Settings" button to include the text "Settings" and style it similarly to the "Add timestamp" button.
    var configBtn = document.createElement("button");
    configBtn.textContent = "⚙️ Settings";
    configBtn.style = "background:#555;color:white;font-size:14px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;";
    configBtn.title = "Settings";

    // Helper function to create a button with common styles and actions
    function createButton(label, title, onClick) {
        const button = document.createElement("button");
        button.textContent = label;
        button.title = title;
        button.style = "width:100%;height:50px;background:#555;color:white;border:none;border-radius:5px;cursor:pointer;font-size:16px;display:flex;justify-content:center;align-items:center;";
        button.onclick = onClick;
        return button;
    }

    // Function to create the settings modal
    function createSettingsModal() {
        const settingsModal = document.createElement("div");
        settingsModal.style = "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:#333;padding:20px;border-radius:10px;z-index:10000;color:white;text-align:center;width:300px;box-shadow:0 0 10px rgba(0,0,0,0.5);";

        const settingsContent = document.createElement("div");
        settingsContent.style = "display:flex;flex-direction:column;gap:10px;align-items:center;";

        const buttonConfigs = [
            { label: "💾 Save", title: "Save", action: saveBtn.onclick },
            { label: "📂 Load", title: "Load", action: loadBtn.onclick },
            { label: "📤 Export", title: "Export", action: exportBtn.onclick },
            { label: "📥 Import", title: "Import", action: importBtn.onclick },
            { label: "Close", title: "Close", action: () => document.body.removeChild(settingsModal) }
        ];

        buttonConfigs.forEach(({ label, title, action }) => {
            const button = createButton(label, title, action);
            settingsContent.appendChild(button);
        });

        settingsModal.appendChild(settingsContent);
        document.body.appendChild(settingsModal);
    }

    configBtn.onclick = createSettingsModal;

    // Move the "Settings" button to the right of the "Add timestamp" button.
    btns.append(addBtn, configBtn);

    // Add a save button to the buttons section
    var saveBtn = document.createElement("button");
    saveBtn.textContent = "💾 Save";
    saveBtn.style = "background:#555;color:white;font-size:12px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;";
    saveBtn.onclick = () => {
      // Create a styled modal for the save format choice
      const modal = document.createElement("div");
      modal.style = "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:#333;padding:20px;border-radius:10px;z-index:10000;color:white;text-align:center;width:300px;box-shadow:0 0 10px rgba(0,0,0,0.5);";

      const message = document.createElement("p");
      message.textContent = "Save as:";
      message.style = "margin-bottom:15px;font-size:16px;";

      const jsonButton = document.createElement("button");
      jsonButton.textContent = "JSON";
      jsonButton.style = "background:#555;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;margin-right:10px;";
      jsonButton.onclick = () => {
        saveTimestampsAs("json");
        document.body.removeChild(modal);
      };

      const textButton = document.createElement("button");
      textButton.textContent = "Plain Text";
      textButton.style = "background:#555;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;";
      textButton.onclick = () => {
        saveTimestampsAs("text");
        document.body.removeChild(modal);
      };

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.style = "background:#444;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;margin-top:15px;display:block;width:100%;";
      cancelButton.onclick = () => {
        document.body.removeChild(modal);
      };

      modal.appendChild(message);
      modal.appendChild(jsonButton);
      modal.appendChild(textButton);
      modal.appendChild(cancelButton);
      document.body.appendChild(modal);
    };

    // Add a load button to the buttons section
    var loadBtn = document.createElement("button");
    loadBtn.textContent = "📂 Load";
    loadBtn.style = "background:#555;color:white;font-size:12px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;";
    loadBtn.onclick = () => {
      // Create a hidden file input element
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json,.txt"; // Accept JSON and plain text files
      fileInput.style = "display:none;";

      fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result.trim();

          if (file.name.endsWith(".json")) {
            // Handle JSON input
            try {
              const timestamps = JSON.parse(content);
              if (Array.isArray(timestamps)) {
                clearTimestampsDisplay();
                updateSeekbarMarkers();
                timestamps.forEach(ts => addTimestamp(ts.start, ts.comment));
                saveTimestamps();
                updateSeekbarMarkers();
                updateScroll();
                alert("Timestamps loaded successfully!");
              } else {
                throw new Error("Invalid JSON format");
              }
            } catch (e) {
              alert("Failed to parse JSON file. Please ensure it is in the correct format.");
            }
          } else if (file.name.endsWith(".txt")) {
            // Handle plain text input
            const lines = content.split("\n").map(line => line.trim()).filter(line => line);
            if (lines.length > 0) {
              clearTimestampsDisplay();
              updateSeekbarMarkers();
              lines.forEach(line => {
                const match = line.match(/^(\d{2}:\d{2}:\d{2})\s+(.*)$/);
                if (match) {
                  const timeParts = match[1].split(":").map(Number);
                  const start = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
                  const comment = match[2];
                  addTimestamp(start, comment);
                }
              });
              saveTimestamps();
              updateSeekbarMarkers();
              updateScroll();
              alert("Timestamps loaded successfully!");
            } else {
              alert("The text file is empty or not in the correct format.");
            }
          } else {
            alert("Unsupported file type. Please upload a .json or .txt file.");
          }
        };

        reader.readAsText(file);
      };

      // Trigger the file input dialog
      fileInput.click();
    };

    // Add export button to the buttons section
    var exportBtn = document.createElement("button");
    exportBtn.textContent = "📤 Export";
    exportBtn.style = "background:#555;color:white;font-size:12px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;";
    exportBtn.onclick = () => {
      const exportData = {};

      // Iterate through localStorage and collect all timestamp data
      for (let key in localStorage) {
        if (key.startsWith("ytls-")) {
          let data = JSON.parse(localStorage.getItem(key));

          // Convert old format (array of timestamps) to new format if necessary
          if (Array.isArray(data)) {
            const videoId = key.replace("ytls-", "");
            data = { video_id: videoId, timestamps: data };
          }

          exportData[key] = data;
        }
      }

      // Create a JSON file for export
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ytls-data.json";
      a.click();
      URL.revokeObjectURL(url);
    };

    // Add import button to the buttons section
    var importBtn = document.createElement("button");
    importBtn.textContent = "📥 Import";
    importBtn.style = "background:#555;color:white;font-size:12px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;";
    importBtn.onclick = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
      fileInput.style = "display:none;";

      fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          try {
            const importedData = JSON.parse(reader.result);
            for (let key in importedData) {
              if (key.startsWith("ytls-")) {
                localStorage.setItem(key, JSON.stringify(importedData[key]));
              }
            }
            alert("Data imported successfully!");
            handleUrlChange(); // Refresh the tool to reflect imported data
          } catch (e) {
            alert("Failed to import data. Please ensure the file is in the correct format.");
          }
        };

        reader.readAsText(file);
      };

      fileInput.click();
    };


    style.textContent = `
      #ytls-pane {
        background: rgba(0, 0, 0, 0.8);
        text-align: right;
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 10px;
        border-radius: 12px; /* Add rounded corners */
        border: 1px solid rgba(85, 85, 85, 0.8); /* Add a thin grey border */
        opacity: 0.9;
        z-index: 5000;
        font-family: Arial, sans-serif;
        width: 300px;
      }
      #ytls-pane.minimized {
        width: 3em; /* Size relative to the icon */
        height: 3em; /* Size relative to the icon */
        overflow: hidden;
        background: rgba(0, 0, 0, 0.8);
        padding: 0;
        border-radius: 1em; /* Fully rounded corners */
        border: 1px solid grey; /* Add a thin grey border */
        display: flex;
        justify-content: center; /* Center the content horizontally */
        align-items: center; /* Center the content vertically */
      }
      #ytls-pane.minimized #ytls-content {
        display: none;
      }
      #ytls-pane.minimized #ytls-minimize {
        display: block;
        font-size: 1.5em; /* Adjust font size for better visibility */
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
      }
      #ytls-pane:hover {
        opacity: 1;
      }
      #ytls-pane ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      #ytls-pane li {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin: 5px 0;
        background: rgba(255, 255, 255, 0.05);
        padding: 5px;
        border-radius: 3px;
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
      #ytls-pane .ytls-marker.end {
        background-color: #00ff00;
      }
      #ytls-pane .ytls-ts-bar {
        position: absolute;
        height: 100%;
        background-color: rgba(255, 255, 0, 0.3);
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
      #ytls-buttons {
        display: flex;
        gap: 5px;
        justify-content: space-between;
        margin-top: 10px;
      }
      #ytls-buttons button {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        font-size: 12px;
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      #ytls-buttons button:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    `;

    minimizeBtn.onclick = () => pane.classList.toggle("minimized");
    list.onclick = (e) => {
      handleClick(e);
      saveTimestamps();
    };
    list.ontouchstart = (e) => {
      handleClick(e);
      saveTimestamps();
    };
    addBtn.onclick = () => {
      // Use the configured offset.
      // The value from GM_getValue is directly used here.
      // For example, if configuredOffset is -2, it adds a timestamp 2 seconds before the current time.
      // If configuredOffset is 5, it adds a timestamp 5 seconds after the current time.
      var input = addTimestamp(Math.max(0, Math.floor(document.querySelector("video").currentTime + configuredOffset)));
      input.focus();
      saveTimestamps();
    };

    // Load pane position from localStorage
    const panePositionKey = "ytls-pane-position";
    function loadPanePosition() {
      const pos = localStorage.getItem(panePositionKey);
      if (pos) {
        try {
          const { left, top, right, bottom } = JSON.parse(pos);
          if (left !== undefined && top !== undefined) {
            pane.style.left = left;
            pane.style.top = top;
            pane.style.right = right;
            pane.style.bottom = bottom;
          }
        } catch { }
      }
    }
    function savePanePosition() {
      const style = pane.style;
      localStorage.setItem(panePositionKey, JSON.stringify({
        left: style.left,
        top: style.top,
        right: style.right,
        bottom: style.bottom
      }));
    }

    // Enable dragging and edge snapping for the pane
    pane.style.position = "fixed";
    pane.style.bottom = "0";
    pane.style.right = "0";
    pane.style.transition = "all 0.2s ease";
    loadPanePosition();

    let isDragging = false;
    let offsetX, offsetY;

    pane.addEventListener("mousedown", (e) => {
      if (e.target !== pane && e.target !== minimizeBtn && e.target !== header) return;

      isDragging = true;
      offsetX = e.clientX - pane.getBoundingClientRect().left;
      offsetY = e.clientY - pane.getBoundingClientRect().top;

      pane.style.transition = "none"; // Disable transition during drag
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      pane.style.left = `${x}px`;
      pane.style.top = `${y}px`;
      pane.style.right = "auto";
      pane.style.bottom = "auto";
    });

    document.addEventListener("mouseup", () => {
      if (!isDragging) return;

      isDragging = false;
      pane.style.transition = "all 0.2s ease"; // Re-enable transition

      // Snap to the nearest edge
      const rect = pane.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate distances to edges
      const distanceToLeft = rect.left;
      const distanceToRight = windowWidth - rect.right;
      const distanceToTop = rect.top;
      const distanceToBottom = windowHeight - rect.bottom;

      // Find the closest edge
      const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

      if (minDistance === distanceToLeft) {
        pane.style.left = "0";
        pane.style.right = "auto";
      } else if (minDistance === distanceToRight) {
        pane.style.left = "auto";
        pane.style.right = "0";
      } else if (minDistance === distanceToTop) {
        pane.style.top = "0";
        pane.style.bottom = "auto";
      } else if (minDistance === distanceToBottom) {
        pane.style.top = "auto";
        pane.style.bottom = "0";
      }
      savePanePosition();
    });

    // Prevent text selection during drag
    pane.addEventListener("dragstart", (e) => e.preventDefault());

    // Ensure the timestamps window is fully onscreen after resizing
    window.addEventListener("resize", () => {
      const rect = pane.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Adjust the pane's position if it goes offscreen
      if (rect.right > windowWidth) {
        pane.style.left = `${windowWidth - rect.width}px`;
        pane.style.right = "auto";
      }
      if (rect.bottom > windowHeight) {
        pane.style.top = `${windowHeight - rect.height}px`;
        pane.style.bottom = "auto";
      }
      if (rect.left < 0) {
        pane.style.left = "0";
        pane.style.right = "auto";
      }
      if (rect.top < 0) {
        pane.style.top = "0";
        pane.style.bottom = "auto";
      }
      savePanePosition();
    });

    header.appendChild(timeDisplay); // Ensure timeDisplay is part of the header
    header.appendChild(minimizeBtn); // Add minimize button to the header
    pane.appendChild(header); // Add header to the pane

    var content = document.createElement("div"); content.id = "ytls-content";
    content.append(header, list, btns);
    pane.append(minimizeBtn, content, style);
    document.body.appendChild(pane);
    loadTimestamps();
    highlightNearestTimestamp();
    updateSeekbarMarkers();
  }

  // Add a function to handle URL changes
  const handleUrlChange = () => {
    // Remove any stray minimized icons or duplicate panes before proceeding
    document.querySelectorAll("#ytls-pane").forEach((el, idx) => {
      if (idx > 0) el.remove();
    });

    const currentVideoId = getVideoId();
    const pageTitle = document.title; // Get the current page title
    console.log("Page Title:", pageTitle); // Log the page title
    console.log("Video ID:", currentVideoId); // Log the video ID
    console.log(window.location.href);

    clearTimestampsDisplay();
    updateSeekbarMarkers();

    if (currentVideoId) {
      const savedTimestamps = localStorage.getItem(`ytls-${currentVideoId}`);
      if (savedTimestamps) {
        console.log(`Found saved timestamps for ${currentVideoId}`);
        // If timestamps exist for the new video, load them
        if (!document.body.contains(pane)) {
          document.body.appendChild(pane); // Re-add the pane if it was removed
        }
        loadTimestamps(); // Load timestamps for the new video
        highlightNearestTimestamp();
        pane.classList.remove("minimized"); // Ensure the pane is not minimized
      } else {
        console.log(`No saved timestamps for ${currentVideoId}`);
        // If no timestamps exist, minimize the timestamper
        pane.classList.add("minimized");
      }
    } else {
      console.log(`No video id found`);
      // If no valid video ID is found, minimize the timestamper
      pane.classList.add("minimized");
    }
  };

  window.addEventListener("yt-navigate-finish", handleUrlChange);

  // Initial call to handle the current URL
  handleUrlChange();
})();
