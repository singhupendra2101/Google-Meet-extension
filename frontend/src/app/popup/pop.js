// popup.js

const captureBtn = document.getElementById('summarizeBtn');
const summaryResult = document.getElementById('summaryResult');
let isCapturing = false;

// ... (rest of the code is the same) ...

captureBtn.addEventListener('click', () => {
  console.log('Button clicked!'); // <-- ADD THIS LINE

  isCapturing = !isCapturing;
  
  if (isCapturing) {
    console.log('State is now true. Sending "startAudioCapture" message.'); // <-- ADD THIS LINE
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('Found active tab:', tabs[0].url); // <-- ADD THIS LINE
      chrome.runtime.sendMessage({ action: "startAudioCapture", tabId: tabs[0].id }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          summaryResult.innerText = "Error connecting. Refresh the page.";
        } else {
          console.log('Response from background:', response); // <-- ADD THIS LINE
          summaryResult.innerText = response.status;
        }
      });
    });
  } else {
    console.log('State is now false. Sending "stopAudioCapture" message.'); // <-- ADD THIS LINE
    chrome.runtime.sendMessage({ action: "stopAudioCapture" }, (response) => {
      // ... (rest of the stop logic) ...
    });
  }
  
  chrome.storage.local.set({ isCapturing: isCapturing });
  updateButtonUI();
});

// ... (rest of the code is the same) ...