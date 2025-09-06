// src/components/HeroSection.jsx

"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = ({ darkMode, isLoggedIn }) => {
  const handleAddToChrome = () => {
    const extensionUrl = "https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb"; // ❗ Replace with your URL
    window.open(extensionUrl, "_blank");
  };

  return (
    <section className="relative flex flex-col h-screen w-full items-center justify-center overflow-hidden">
      {darkMode ? (
        <>
          <div className="animated-gradient absolute inset-0 z-0" />
          <div className="absolute inset-0 bg-black opacity-50 z-10" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 z-0 bg-gray-50" />
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-white via-blue-50 to-purple-100 opacity-80" />
        </>
      )}
      
      <div className="relative z-20 flex flex-col items-center justify-center w-full px-6 text-center">
        <motion.h2
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-5xl md:text-7xl font-black max-w-4xl leading-tight drop-shadow-lg ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Smarter Google Meet with{" "}
          
          {/* --- ANIMATION CHANGE IS HERE --- */}
          <span className="inline-block">
            <span 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text 
                         overflow-hidden whitespace-nowrap inline-block border-r-4 border-r-transparent"
              style={{
                animation: `typing 2s steps(11, end) forwards, blink-caret .75s step-end infinite`,
                borderColor: darkMode ? 'white' : '#1f2937' // Matches text color
              }}
            >
              AI-Powered
            </span>
          </span>
          
          {" "}Summaries 🚀
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-6 text-lg md:text-xl max-w-2xl drop-shadow-md ${
            darkMode ? "text-gray-200" : "text-gray-600"
          }`}
        >
          Get instant key points, action items, and downloadable summaries of your
          meetings, right after the call ends.
        </motion.p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={handleAddToChrome}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(99, 102, 241, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow-xl hover:bg-blue-700 transition transform duration-300 ease-in-out"
          >
            ➕ Add to Chrome
          </motion.button>
          {!isLoggedIn && (
            <Link href="/signup" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-full font-bold text-lg shadow-xl transition transform duration-300 ease-in-out ${
                  darkMode
                    ? "bg-white/10 text-white border border-white/30 hover:bg-white/20"
                    : "bg-gray-800/5 text-gray-700 border border-gray-300 hover:bg-gray-800/10"
                }`}
              >
                Get Started
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;