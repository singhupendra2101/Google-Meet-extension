let transcript = [];
let observer;

function startObserving() {
  // captions container in Google Meet
  const captionsContainer = document.querySelector('[aria-live="polite"]');

  if (!captionsContainer) {
    console.log("⚠️ Captions not found. Enable Captions in Google Meet.");
    return;
  }

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.innerText) {
          transcript.push(node.innerText);
          console.log("Transcript:", node.innerText);
        }
      });
    });
  });

  observer.observe(captionsContainer, { childList: true, subtree: true });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "stopCapture") {
    if (observer) observer.disconnect();
    sendTranscript();
  }
});

function sendTranscript() {
  fetch("http://localhost:5000/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: transcript.join(" ") })
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("✅ AI Summary:", data.summary);
      alert("📌 Meeting Summary:\n" + data.summary);
    })
    .catch((err) => console.error("❌ Error sending transcript:", err));
}

// Start observing when Meet loads
startObserving();
