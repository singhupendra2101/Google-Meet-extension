// content.js - Google Meet Sidebar with recording and save summary

(function() {
  if (window.__meetSidebarInjected) return;
  window.__meetSidebarInjected = true;

  // --- Sidebar UI ---
  const sidebar = document.createElement('div');
  sidebar.id = 'meet-sidebar-extension';
  sidebar.style.position = 'fixed';
  sidebar.style.top = '0';
  sidebar.style.right = '0';
  sidebar.style.width = '320px';
  sidebar.style.height = '100%';
  sidebar.style.background = '#fff';
  sidebar.style.boxShadow = '-2px 0 8px rgba(0,0,0,0.15)';
  sidebar.style.zIndex = '999999';
  sidebar.style.display = 'flex';
  sidebar.style.flexDirection = 'column';
  sidebar.style.borderLeft = '1px solid #e0e0e0';
  sidebar.style.transition = 'transform 0.3s';
  sidebar.style.transform = 'translateX(0)';

  // Header
  const header = document.createElement('div');
  header.style.padding = '16px';
  header.style.background = '#1a73e8';
  header.style.color = '#fff';
  header.style.fontWeight = 'bold';
  header.style.fontSize = '18px';
  header.textContent = 'Google Meet Sidebar';
  sidebar.appendChild(header);

  // Captions container
  const captionsContainer = document.createElement('div');
  captionsContainer.id = 'meet-captions-list';
  captionsContainer.style.flex = '1';
  captionsContainer.style.padding = '16px';
  captionsContainer.style.overflowY = 'auto';
  captionsContainer.style.background = '#fafbfc';
  captionsContainer.innerHTML = '<p style="color:#888">No captions yet. Start speaking to see captions here.</p>';
  sidebar.appendChild(captionsContainer);

  // Controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.style.padding = '16px';
  controlsContainer.style.borderTop = '1px solid #e0e0e0';
  controlsContainer.style.background = '#f1f3f4';
  controlsContainer.innerHTML = `
    <button id="start-rec-btn" style="width:100%; padding: 10px; border:none; background:#28a745; color:white; border-radius:4px; cursor:pointer; margin-bottom:8px;">Start Recording</button>
    <button id="stop-rec-btn" style="width:100%; padding: 10px; border:none; background:#dc3545; color:white; border-radius:4px; cursor:pointer; margin-bottom:8px; display:none;">Stop Recording</button>
    <button id="save-summary-btn" style="width:100%; padding: 10px; border:none; background:#007bff; color:white; border-radius:4px; cursor:pointer; margin-bottom:8px; display:none;">Save Meeting Summary</button>
    <div id="status-text" style="text-align:center; margin-top:10px; color:#555; font-size:14px;">Status: Idle</div>
    <div id="summary-result" style="margin-top: 15px; padding: 12px; background: #e9ecef; border-radius: 4px; font-size: 14px; display: none; line-height: 1.6;"></div>
  `;
  sidebar.appendChild(controlsContainer);

  // Recording state
  let isRecording = false;
  let recordedCaptions = [];

  // Get button and status elements
  const startBtn = sidebar.querySelector('#start-rec-btn');
  const stopBtn = sidebar.querySelector('#stop-rec-btn');
  const saveSummaryBtn = sidebar.querySelector('#save-summary-btn');
  const statusText = sidebar.querySelector('#status-text');
  const summaryResultDiv = sidebar.querySelector('#summary-result');

  // --- Event Listeners ---

  startBtn.onclick = function() {
    isRecording = true;
    recordedCaptions = [];
    statusText.textContent = 'Status: Recording...';
    statusText.style.color = 'green';
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    saveSummaryBtn.style.display = 'none';
    summaryResultDiv.style.display = 'none';
    captionsContainer.innerHTML = '<p style="color:#888">Recording started. Captions will appear here.</p>';
  };

  // Stop button logic
  stopBtn.onclick = function() {
    isRecording = false;
    statusText.textContent = 'Status: Stopped. You can now save the summary.';
    statusText.style.color = 'red';
    stopBtn.style.display = 'none';
    startBtn.style.display = 'block';
    if (recordedCaptions.length > 0) {
      saveSummaryBtn.style.display = 'block';
    }
  };

  // Save summary button logic
  saveSummaryBtn.onclick = async function() {
    if (recordedCaptions.length === 0) {
      alert('No captions were recorded. Please start recording first.');
      return;
    }
    statusText.textContent = 'Status: Summarizing and saving...';
    summaryResultDiv.style.display = 'block';
    summaryResultDiv.innerHTML = '🧠 Please wait, processing your meeting...';

    try {
      // Call the backend to summarize and save in one step
      const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: recordedCaptions }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      const summaryText = data.summary;

      summaryResultDiv.innerHTML = `<strong>Summary:</strong><br>${summaryText}`;
      statusText.textContent = 'Status: Summary generated and saved successfully!';
      saveSummaryBtn.style.display = 'none';

    } catch (error) {
      summaryResultDiv.innerHTML = `<strong>Error:</strong> Could not process summary.<br><small>${error.message}</small>`;
      statusText.textContent = 'Status: Error!';
    }
  };

  // Helper to add or update a caption in the sidebar and recording array
  function addOrUpdateCaption(speaker, text) {
    if (!isRecording) return;
    // Remove "no captions" message
    const noCaptions = captionsContainer.querySelector('p');
    if (noCaptions && noCaptions.textContent.includes('No captions')) {
      captionsContainer.innerHTML = '';
    }
    // Find the last entry
    const entries = captionsContainer.querySelectorAll('.caption-entry');
    const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
    // If last entry is from the same speaker, update it
    if (lastEntry && lastEntry.dataset.speaker === (speaker || '')) {
      const textSpan = lastEntry.querySelector('.caption-text');
      if (textSpan) {
        textSpan.textContent = text;
      }
      // Update last in recordedCaptions
      if (recordedCaptions.length > 0) {
        recordedCaptions[recordedCaptions.length - 1].text = text;
      }
    } else {
      // Otherwise, add a new entry
      const entry = document.createElement('div');
      entry.className = 'caption-entry';
      entry.dataset.speaker = speaker || '';
      entry.style.marginBottom = '10px';
      entry.style.padding = '8px 10px';
      entry.style.background = '#fff';
      entry.style.borderRadius = '6px';
      entry.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
      entry.style.fontSize = '15px';
      entry.style.color = '#222';
      if (speaker) {
        const speakerSpan = document.createElement('span');
        speakerSpan.style.fontWeight = 'bold';
        speakerSpan.style.color = '#1a73e8';
        speakerSpan.textContent = speaker + ': ';
        entry.appendChild(speakerSpan);
      }
      const textSpan = document.createElement('span');
      textSpan.className = 'caption-text';
      textSpan.textContent = text;
      entry.appendChild(textSpan);
      captionsContainer.appendChild(entry);
      // Add to recordedCaptions
      recordedCaptions.push({ speaker, text });
      // Scroll to bottom
      captionsContainer.scrollTop = captionsContainer.scrollHeight;
    }
  }

  // Find the captions container in Google Meet
  function findMeetCaptionsContainer() {
    // Try selectors for 2025 Google Meet
    const selectors = [
      'div[role="region"][aria-label="Captions"]',
      '.TBMuR.buGMKc',
      '.nMcdL.bj4p3b',
      '.adE6rb',
      '.iOzk7'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  // Extract speaker and text from a caption element
  function extractCaptionData(el) {
    let speaker = '';
    let text = '';
    const speakerEl = el.querySelector('.NWpY1d, .zs7s8d, .YTbUzc, .KcIKyf.jxFHg, .KcIKyf, span.NWpY1d, span.zs7s8d');
    if (speakerEl) {
      speaker = speakerEl.textContent.replace(/[:：]$/, '').trim();
    }
    const textEl = el.querySelector('.iTTPOb, .iOzk7');
    if (textEl) {
      text = textEl.textContent.trim();
    } else {
      text = el.textContent.trim();
      if (speaker && text.startsWith(speaker)) {
        text = text.slice(speaker.length).replace(/^[:：\s]+/, '');
      }
    }
    return { speaker, text };
  }

  // Observe captions in Google Meet (robust, reattaches if container changes)
  function observeMeetCaptions() {
    let lastCaption = '';
    let lastSpeaker = '';
    let observer = null;
    let lastContainer = null;

    function attachObserver() {
      const container = findMeetCaptionsContainer();
      if (!container) return;
      if (observer) observer.disconnect();
      lastContainer = container;
      observer = new MutationObserver(() => {
        const captionEls = Array.from(container.querySelectorAll('.nMcdL.bj4p3b, [data-self-name], [data-participant-id]'));
        if (captionEls.length === 0) return;
        const lastEl = captionEls[captionEls.length - 1];
        const { speaker, text } = extractCaptionData(lastEl);
        if (text && text !== lastCaption) {
          addCaptionToSidebar(text, speaker);
          lastCaption = text;
          lastSpeaker = speaker;
        }
      });
      observer.observe(container, { childList: true, subtree: true, characterData: true });
    }

    setInterval(() => {
      const container = findMeetCaptionsContainer();
      if (container && container !== lastContainer) {
        attachObserver();
      }
    }, 2000);

    attachObserver();
  }

  // Wait for captions container to appear, then observe
  function waitForCaptionsAndObserve() {
    let tried = 0;
    const tryObserve = () => {
      const container = findMeetCaptionsContainer();
      if (container) {
        observeMeetCaptions();
      } else {
        tried++;
        if (tried > 20) {
          captionsContainer.innerHTML = '<p style="color:#c00">Could not detect captions. Make sure captions are enabled in Google Meet.</p>';
        } else {
          setTimeout(tryObserve, 1500);
        }
      }
    };
    tryObserve();
  }

  waitForCaptionsAndObserve();

  // Close button (hides sidebar, shows toggle)
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '8px';
  closeBtn.style.right = '12px';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '24px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.color = '#fff';
  closeBtn.onclick = function() {
    sidebar.style.transform = 'translateX(340px)';
    setTimeout(() => {
      sidebar.style.display = 'none';
      toggleBtn.style.display = 'block';
    }, 300);
  };
  header.appendChild(closeBtn);

  // Toggle button (shows sidebar)
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'meet-sidebar-toggle';
  toggleBtn.textContent = '☰';
  toggleBtn.title = 'Show sidebar';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.top = '50%';
  toggleBtn.style.right = '10px';
  toggleBtn.style.transform = 'translateY(-50%)';
  toggleBtn.style.zIndex = '1000000';
  toggleBtn.style.background = '#1a73e8';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.border = 'none';
  toggleBtn.style.borderRadius = '50%';
  toggleBtn.style.width = '48px';
  toggleBtn.style.height = '48px';
  toggleBtn.style.fontSize = '28px';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
  toggleBtn.style.display = 'none';
  toggleBtn.onclick = function() {
    sidebar.style.display = 'flex';
    setTimeout(() => {
      sidebar.style.transform = 'translateX(0)';
    }, 10);
    toggleBtn.style.display = 'none';
  };
  document.body.appendChild(toggleBtn);

  document.body.appendChild(sidebar);
})();