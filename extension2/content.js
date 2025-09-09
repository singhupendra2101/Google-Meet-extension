// content.js - Injects a sidebar on Google Meet

(function() {
  if (window.__meetSidebarInjected) return;
  window.__meetSidebarInjected = true;

  // Create sidebar
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

  // Helper to add or update a caption in the sidebar
  function addCaptionToSidebar(text, speaker) {
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
    // Try to find speaker and text
    let speaker = '';
    let text = '';
    // Speaker: try span with class NWpY1d or similar
    const speakerEl = el.querySelector('.NWpY1d, .zs7s8d, .YTbUzc, .KcIKyf.jxFHg, .KcIKyf, span.NWpY1d, span.zs7s8d');
    if (speakerEl) {
      speaker = speakerEl.textContent.replace(/[:：]$/, '').trim();
    }
    // Text: try .iTTPOb, .iOzk7, or just the element's text
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
        // Find all caption elements (try more selectors)
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

    // Re-attach observer if captions container changes (DOM changes)
    setInterval(() => {
      const container = findMeetCaptionsContainer();
      if (container && container !== lastContainer) {
        attachObserver();
      }
    }, 2000);

    // Initial attach
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
