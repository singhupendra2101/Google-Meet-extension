// content.js

let observer = null;
let isCapturing = false;
let fullTranscript = "";
console.log('ok');


// Listen for the toggle message from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleCapture") {
    isCapturing = !isCapturing;
    if (isCapturing) {
      startCapturing();
      sendResponse({ status: "✅ Capturing started..." });
    } else {
      stopCapturing();
      sendResponse({ status: "⏹️ Capturing stopped." });
    }
  }
  return true;
});

function startCapturing() {
  // This selector targets the container where caption text appears.
  // IMPORTANT: Google may change this selector in the future, breaking the extension.
  const targetSelector = 'div[jsname="dsyhDe"]';
  const targetNode = document.querySelector(targetSelector);

  if (!targetNode) {
    console.error("Caption container not found. Make sure captions are turned on.");
    alert("Could not find the caption container. Please turn on captions in Google Meet first.");
    isCapturing = false; // Reset state
    return;
  }
  
  console.log("Caption container found. Starting observer.");
  fullTranscript = ""; // Reset transcript

  
  observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        // We look for the specific span that holds the caption text.
        // Google uses a class that might change, here it's 'iTTPOb VbkSUe'
        const captionElement = node.querySelector('span[jsname="nMcdL"]');
        if (captionElement && captionElement.innerText) {
          const newText = captionElement.innerText;
          // Append the new text to our full transcript
          fullTranscript += newText + " ";
          console.log("Captured:", newText);
        }
      });
    });
  });

  // Configuration for the observer
  const config = { childList: true, subtree: true };
  // Start observing the target node
  observer.observe(targetNode, config);
}

function stopCapturing() {
  if (observer) {
    observer.disconnect();
    observer = null;
    console.log("Observer disconnected. Final transcript:");
    console.log(fullTranscript);

    // Send the complete transcript to the background script for processing
    chrome.runtime.sendMessage({
      action: "processTranscript",
      data: fullTranscript
    });
  }
}