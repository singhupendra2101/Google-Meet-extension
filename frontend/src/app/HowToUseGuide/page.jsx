'use client';

import React from 'react';
import Link from 'next/link';

const screenshots = {
  install: 'https://www.lifewire.com/thmb/-sFofBHFL-nCZPu8cI-1IeAvWw4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/001_install-extensions-chrome-4103627-1f5e086e25f6440bbf6ceb23ecd13d29.jpg',
  pin: 'https://storage.googleapis.com/support-forums-api/attachment/message-219233689-6490623875140970275.png',
  inMeet: 'https://storage.googleapis.com/support-forums-api/attachment/message-289789021-7569629339266176466.png',
  features: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlJY1VMy_MlColRgoHgItdg8PeTYlqdVKfIw&sy',
  history: 'https://thumbs.dreamstime.com/b/review-meeting-four-little-men-round-table-concept-business-done-periodically-performance-39499802.jpg',
};

function CheckIcon() {
    return (
        <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
    );
}

function BackArrowIcon() {
    return (
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
    );
}

export default function HowToUseGuidePage() {
  const steps = [
    { title: "Install from Chrome Web Store", description: "First, navigate to our extension's page on the Chrome Web Store. Click the 'Add to Chrome' button. A pop-up will appear asking for confirmation. Click 'Add extension' to complete the installation.", image: screenshots.install },
    { title: "Pin for Easy Access", description: "After installation, click the puzzle icon in your Chrome toolbar. Find our extension and click the pin icon next to it. This keeps the extension visible for one-click access.", image: screenshots.pin },
    { title: "Activate in Google Meet", description: "Join any Google Meet call. You'll see our extension's icon in the Meet interface. Click it to open the main menu and start using its features.", image: screenshots.inMeet },
    { title: "Explore the Features", description: "Once activated, you can access all the powerful features. Start a live transcription, generate instant summaries, or use other tools to enhance your meeting experience.", image: screenshots.features },
    { title: "Review Your History", description: "To see past transcriptions and summaries, click the extension icon in your toolbar. This opens a popup where you can view, search, and manage all saved meeting data.", image: screenshots.history },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-800 min-h-screen text-gray-800 dark:text-gray-200 font-sans antialiased">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8">
            <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300 bg-white/50 dark:bg-white/10 hover:bg-white/80 px-4 py-2 rounded-lg shadow-md">
                <BackArrowIcon /> Back to Home
            </Link>
        </div>
        <header className="text-center pt-8 pb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Get Started with <span className="text-blue-600 dark:text-blue-400">Meet Extension</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Follow these simple steps to supercharge your Google Meet experience.</p>
        </header>
        <div className="space-y-20">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-8 md:gap-12 even:md:flex-row-reverse">
              <div className="w-full md:w-1/2">
                <div className="bg-white dark:bg-gray-800/50 p-2 rounded-2xl shadow-xl">
                  <img src={step.image} alt={step.title} className="rounded-xl shadow-lg shadow-blue-500/10 object-cover w-full h-auto aspect-video" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/800x450/e5e7eb/374151?text=Image+Not+Found'; }}/>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="text-blue-600 dark:text-blue-400 mr-4 text-4xl font-mono">{index + 1}</span>{step.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <section className="mt-24 text-center bg-white/70 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/20 p-8 md:p-12 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Key Features at a Glance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {["Live Transcription", "AI-Powered Summaries", "Action Item Detection", "Secure Meeting History"].map(feature => (
                    <div key={feature} className="flex items-center p-4 rounded-lg transition-colors duration-300 hover:bg-blue-100/50 dark:hover:bg-blue-900/50">
                        <CheckIcon /> <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                ))}
            </div>
        </section>
        <footer className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} MEETMINDS. All Rights Reserved.</p>
            <p className="mt-2">
                Need more help? Contact us at&nbsp;
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=yadavvedansh147@gmail.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">yadavvedansh147@gmail.com</a>
                &nbsp;or&nbsp;
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=upendrasingh210199@gmail.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">upendrasingh210199@gmail.com</a>.
            </p>
        </footer>
      </div>
    </div>
  );
}