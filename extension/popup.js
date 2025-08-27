// Get references to the UI elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDiv = document.getElementById('status');

// Disable stop button initially
stopBtn.disabled = true;

// Send a "start" message to the background script when the start button is clicked
startBtn.addEventListener('click', () => {
  // Get the current active tab to send its ID to the background script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.runtime.sendMessage(
        { action: "startAudioCapture", tabId: tabs[0].id },
        (response) => {
          statusDiv.textContent = response.status;
          startBtn.disabled = true;
          stopBtn.disabled = false;
        }
      );
    } else {
      statusDiv.textContent = "❌ No active tab found.";
    }
  });
});

// Send a "stop" message to the background script when the stop button is clicked
stopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "stopAudioCapture" }, (response) => {
    statusDiv.textContent = response.status;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    // You'll eventually display the summary here
  });
});