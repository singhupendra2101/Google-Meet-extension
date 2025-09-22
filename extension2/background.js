// extension2/background.js (Updated & Corrected)

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openLoginPage') {
    chrome.tabs.create({ url: chrome.runtime.getURL('login.html') });
  } 
  else if (request.action === 'openSignupPage') {
    chrome.tabs.create({ url: chrome.runtime.getURL('signup.html') });
  }
  else if (request.action === 'openProfilePage') {
    chrome.tabs.create({ url: chrome.runtime.getURL('profile.html') });
  }
  else if (request.action === "checkUser") {
    chrome.storage.local.get('user', (data) => {
      if (data.user && data.user.token) {
        sendResponse({ loggedIn: true });
      } else {
        sendResponse({ loggedIn: false });
      }
    });
    return true; // Required for asynchronous responses
  }
  // ======== NEW: HANDLES THE TRANSCRIPT UPLOAD ========
  else if (request.action === "uploadTranscript") {
    // **Step 2: Background script receives the data from the content script.**
    const transcriptData = request.payload;
    
    chrome.storage.local.get('user', (storageData) => {
      if (!storageData.user || !storageData.user.token) {
        sendResponse({ success: false, error: 'Authentication required. Please log in.' });
        return;
      }
      
      const token = storageData.user.token;

      // **Step 3: Perform the fetch call to the backend.**
      fetch('http://localhost:5000/api/meet/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transcriptData),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message || 'Server responded with an error') });
        }
        return response.json();
      })
      .then(data => {
        // Send a success response back to content.js
        sendResponse({ success: true, data: data });
      })
      .catch(error => {
        // Send a failure response back to content.js
        console.error('Background fetch error:', error);
        sendResponse({ success: false, error: error.message });
      });
    });
    
    return true; // **Crucial**: Keeps the message channel open for the async fetch call.
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get('user', (data) => {
    if (data.user && data.user.token) {
      chrome.tabs.create({ url: chrome.runtime.getURL('profile.html') });
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL('login.html') });
    }
  });
});