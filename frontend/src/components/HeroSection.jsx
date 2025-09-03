"use client";
import React from "react";
import { motion } from "framer-motion";

const HeroSection = ({ darkMode }) => {
  const handleAddToChrome = () => {
    // This will open your extension's page in a new tab.
    // ❗ IMPORTANT: Replace the URL below with your actual Chrome Web Store extension link.
    const extensionUrl = "https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb";
    window.open(extensionUrl, "_blank");
  };

  return (
    <section className="relative flex flex-col h-screen w-full items-center justify-center overflow-hidden">
      <div className="animated-gradient absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-black opacity-50 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full px-6 text-center">
        <motion.h2
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-black text-white max-w-4xl leading-tight drop-shadow-lg"
        >
          Smarter Google Meet with{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            AI-Powered
          </span>{" "}
          Summaries 🚀
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow-md"
        >
          Get instant key points, action items, and downloadable summaries of your
          meetings, right after the call ends.
        </motion.p>

        <motion.button
          onClick={handleAddToChrome}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0,0,0,0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow-xl hover:bg-blue-700 transition transform duration-300 ease-in-out"
        >
          ➕ Add to Chrome
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;