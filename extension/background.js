// background.js

let mediaRecorder = null;
let audioStream = null;
let assemblyaiSocket = null;
let fullTranscript = "";

// Listen for messages from the popup to start or stop transcription
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleCapture") {
    fullTranscript = ""; // Reset transcript
    startCapture(request.tabId)
      .then(() => sendResponse({ status: "✅ Capturing started..." }))
      .catch(err => sendResponse({ status: `❌ Error: ${err.message}` }));
  } else if (request.action === "stopAudioCapture") {
    stopCapture();
    sendResponse({ status: "⏹️ Capturing stopped. Processing summary..." });
  }
  return true; // Indicates an asynchronous response
});

async function startCapture(tabId) {
  // Get the audio stream from the specified tab
  audioStream = await chrome.tabCapture.capture({ audio: true, video: false });

  // Connect to AssemblyAI's real-time transcription service
  const API_KEY = "YOUR_ASSEMBLYAI_API_KEY"; // 👈 IMPORTANT: Replace with your key
  if (!API_KEY || API_KEY === "f87fdc5f595c462997adfcc61c42c0a0") {
    console.error("AssemblyAI API key is missing or not replaced.");
    throw new Error("API Key is missing.");
  }

  assemblyaiSocket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${API_KEY}`);

  // Handle socket events
  assemblyaiSocket.onopen = () => console.log("WebSocket connected to AssemblyAI.");
  assemblyaiSocket.onerror = (event) => console.error("WebSocket Error:", event);
  assemblyaiSocket.onclose = () => console.log("WebSocket disconnected.");
  assemblyaiSocket.onmessage = (message) => {
    let data = JSON.parse(message.data);
    // We only care about the final transcript text
    if (data.message_type === "FinalTranscript" && data.text) {
      console.log("Transcript received:", data.text);
      fullTranscript += data.text + " ";
    }
  };

  // Use MediaRecorder to get audio chunks in a format the API can handle
  mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0 && assemblyaiSocket.readyState === WebSocket.OPEN) {
      // Send the audio data chunk over the WebSocket
      const reader = new FileReader();
      reader.onload = () => {
        const base64data = reader.result.split(",")[1];
        assemblyaiSocket.send(JSON.stringify({ audio_data: base64data }));
      };
      reader.readAsDataURL(event.data);
    }
  };
  
  // Start recording and send data every 500ms
  mediaRecorder.start(500);
}

function stopCapture() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  // The rest of the cleanup and sending logic will run after the final data is processed.
  mediaRecorder.onstop = () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      audioStream = null;
    }
    if (assemblyaiSocket) {
      assemblyaiSocket.close();
      assemblyaiSocket = null;
    }
    console.log("Final Transcript:", fullTranscript);

    // Send the complete transcript to your Python backend for summarization
    if (fullTranscript.trim().length > 0) {
      sendToBackend(fullTranscript);
    } else {
      console.log("No transcript was captured. Nothing to summarize.");
    }
    mediaRecorder = null;
  };
}

function sendToBackend(text) {
  const backendUrl = 'http://localhost:5000/summarize';
  console.log(`Sending transcript to backend at ${backendUrl}`);

  fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript: text }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ Summary from backend:', data.summary);
  })
  .catch((error) => {
    console.error('❌ Error sending to backend:', error);
  });
}