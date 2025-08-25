
"use client";
import React from "react";
import { motion } from "framer-motion";

const HeroSection = ({ darkMode }) => (
  <section
    className={`flex flex-col items-center text-center py-20 px-6 ${
      darkMode
        ? "bg-gray-800 text-white"
        : "bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800"
    }`}
  >
    <motion.img
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      src="https://burst.shopifycdn.com/photos/business-team-meeting-boardroom.jpg?width=1000&format=pjpg&exif=0&iptc=0"
      alt="Team meeting in a boardroom"
      className="rounded-xl shadow-xl mb-8 max-w-4xl"
    />
    <motion.h2
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-5xl font-extrabold max-w-2xl leading-tight"
    >
      Smarter Google Meet with <span className="text-blue-600">AI-Powered</span>{" "}
      Summaries 🚀
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-4 text-lg max-w-xl"
    >
      Get instant key points, action items, and downloadable summaries of your
      meetings.
    </motion.p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="mt-6 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
    >
      ➕ Add to Chrome
    </motion.button>
  </section>
);

export default HeroSection;