chrome.runtime.onInstalled.addListener(() => {
  console.log("Google Meet Summarizer Extension Installed ✅");
});

// listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "stopCapture") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "stopCapture" });
    });
  }
});
