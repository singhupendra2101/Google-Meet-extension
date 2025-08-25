"use client";
import React, { useState, useEffect } from "react";
import { Brain, Video, FileText, Sun, Moon } from "lucide-react";

const Header = ({ toggleTheme, darkMode }) => (
  <header
    className={`flex justify-between items-center px-8 py-4 shadow-md ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
    }`}
  >
    <h1 className="text-2xl font-bold text-blue-600">MeetMinds</h1>
    <nav className="flex items-center space-x-6">
      <a href="#features" className="hover:text-blue-600">
        Features
      </a>
      <a href="#how-it-works" className="hover:text-blue-600">
        How it Works
      </a>
      <a href="#download" className="hover:text-blue-600">
        Download
      </a>
      <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Sign Up
      </button>
    </nav>
    {/* Theme Toggle Button */}
    <button
      onClick={toggleTheme}
      className="ml-6 p-2 rounded-full border hover:scale-110 transition"
    >
      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  </header>
);

const HeroSection = ({ darkMode }) => (
  <section
    className={`flex flex-col items-center text-center py-20 ${
      darkMode ? "bg-gray-800 text-white" : "bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800"
    }`}
  >
    <img
      src="https://source.unsplash.com/1200x500/?meeting,office"
      alt="Meeting"
      className="rounded-xl shadow-lg mb-8 max-w-4xl"
    />
    <h2 className="text-4xl font-bold max-w-2xl">
      Smarter Google Meet with AI-Powered Summaries 🚀
    </h2>
    <p className="mt-4 text-lg max-w-xl">
      Get instant key points, action items, and downloadable summaries of your
      meetings.
    </p>
    <button className="mt-6 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
      Add to Chrome
    </button>
  </section>
);

const Features = ({ darkMode }) => (
  <section
    id="features"
    className={`py-16 px-8 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
  >
    <h3 className="text-2xl font-bold text-center">Features</h3>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div className="p-6 shadow-lg rounded-xl bg-gray-100 dark:bg-gray-800">
        <Video className="mx-auto h-10 w-10 text-blue-600" />
        <h4 className="mt-4 font-semibold">Seamless Meet Integration</h4>
        <img
          src="https://source.unsplash.com/400x250/?laptop,meeting"
          alt="Integration"
          className="rounded-lg mt-3"
        />
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Works directly inside Google Meet without interruptions.
        </p>
      </div>
      <div className="p-6 shadow-lg rounded-xl bg-gray-100 dark:bg-gray-800">
        <Brain className="mx-auto h-10 w-10 text-blue-600" />
        <h4 className="mt-4 font-semibold">AI Summaries</h4>
        <img
          src="https://source.unsplash.com/400x250/?ai,brain"
          alt="AI"
          className="rounded-lg mt-3"
        />
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Generate clear, concise summaries in real time.
        </p>
      </div>
      <div className="p-6 shadow-lg rounded-xl bg-gray-100 dark:bg-gray-800">
        <FileText className="mx-auto h-10 w-10 text-blue-600" />
        <h4 className="mt-4 font-semibold">Download Notes</h4>
        <img
          src="https://source.unsplash.com/400x250/?notes,document"
          alt="Download"
          className="rounded-lg mt-3"
        />
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Export summaries as PDF for future reference.
        </p>
      </div>
    </div>
  </section>
);

const HowItWorks = ({ darkMode }) => (
  <section
    id="how-it-works"
    className={`py-16 px-8 ${darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-800"}`}
  >
    <h3 className="text-2xl font-bold text-center">How It Works</h3>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div className="p-6 bg-white dark:bg-gray-700 shadow-md rounded-xl">
        <h4 className="font-semibold text-lg">1. Add Extension</h4>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Install MeetMinds from Chrome Web Store.
        </p>
      </div>
      <div className="p-6 bg-white dark:bg-gray-700 shadow-md rounded-xl">
        <h4 className="font-semibold text-lg">2. Join Meeting</h4>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Start or join your Google Meet as usual.
        </p>
      </div>
      <div className="p-6 bg-white dark:bg-gray-700 shadow-md rounded-xl">
        <h4 className="font-semibold text-lg">3. Get Summary</h4>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          AI generates real-time summaries & downloads notes.
        </p>
      </div>
    </div>
  </section>
);

const Footer = ({ darkMode }) => (
  <footer className={`${darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"} py-12`}>
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 className="text-xl font-bold">MeetMinds</h4>
        <p className="mt-3 text-sm">
          AI-powered summaries to make your meetings smarter.
        </p>
      </div>
      <div>
        <h5 className="font-semibold">Quick Links</h5>
        <ul className="mt-3 space-y-2 text-sm">
          <li><a href="#features" className="hover:underline">Features</a></li>
          <li><a href="#how-it-works" className="hover:underline">How it Works</a></li>
          <li><a href="#download" className="hover:underline">Download</a></li>
        </ul>
      </div>
      <div>
        <h5 className="font-semibold">Follow Us</h5>
        <div className="mt-3 flex gap-4 text-sm">
          <a href="https://twitter.com/yourhandle" target="_blank" className="hover:underline">🐦 Twitter</a>
          <a href="https://linkedin.com/in/yourhandle" target="_blank" className="hover:underline">💼 LinkedIn</a>
          <a href="https://facebook.com/yourhandle" target="_blank" className="hover:underline">📘 Facebook</a>
        </div>
      </div>
    </div>
    <div className="mt-8 text-center text-xs">
      © {new Date().getFullYear()} MeetMinds. All rights reserved.
    </div>
  </footer>
);

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  return (
    <div className={`font-sans ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <Header toggleTheme={() => setDarkMode(!darkMode)} darkMode={darkMode} />
      <HeroSection darkMode={darkMode} />
      <Features darkMode={darkMode} />
      <HowItWorks darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default App;
