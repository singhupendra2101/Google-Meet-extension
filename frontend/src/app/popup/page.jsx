"use client";
import React, { useState } from "react";

export default function Popup() {
  const [status, setStatus] = useState("Idle");

  const startCapture = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => console.log("Transcript capture started...")
      });
    });
    setStatus("Capturing transcript...");
  };

  const stopCapture = () => {
    chrome.runtime.sendMessage({ action: "stopCapture" });
    setStatus("Processing summary...");
  };

  return (
    <div style={{ width: "220px", padding: "10px", fontFamily: "Arial" }}>
      <h3>Meet Summarizer</h3>
      <button
        onClick={startCapture}
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
      >
        Start Capture
      </button>
      <button
        onClick={stopCapture}
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
      >
        Stop & Summarize
      </button>
      <div style={{ marginTop: "10px" }}>
        Status: <b>{status}</b>
      </div>
    </div>
  );
}
