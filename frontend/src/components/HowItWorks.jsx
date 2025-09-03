"use client";
import React from "react";
import { motion } from "framer-motion";
import { PlusCircle, Users, Download } from "lucide-react";

// (Animation variants can remain the same)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const HowItWorks = ({ darkMode }) => (
  <section
    id="how-it-works"
    className={`py-16 px-4 sm:py-20 sm:px-6 md:px-12 lg:px-24 ${
      darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-800"
    }`}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-sm font-bold text-center text-blue-500 uppercase tracking-wider">
        Get Started in Seconds
      </h2>
      <h3 className="mt-2 text-4xl font-extrabold text-center">
        So Simple, It Feels Like Magic
      </h3>
    </motion.div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mt-10 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 sm:gap-x-6 md:gap-x-8 items-start"
    >
      {/* Step 1 */}
      <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
        <div className={`mb-4 p-4 rounded-full border-4 ${darkMode ? 'bg-gray-700 border-blue-500' : 'bg-white border-blue-500'}`}>
          <PlusCircle className="h-8 w-8 text-blue-500" />
        </div>
        <h4 className="font-bold text-xl mb-2">1. Add Extension</h4>
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          A single click on the Chrome Web Store is all it takes to integrate MeetMinds directly into your browser.
        </p>
        <motion.a
          href="https://chromewebstore.google.com/" // IMPORTANT: Replace with your actual extension URL
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Add to Chrome
        </motion.a>
      </motion.div>

      {/* Step 2 */}
      <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
        <div className={`mb-4 p-4 rounded-full border-4 ${darkMode ? 'bg-gray-700 border-blue-500' : 'bg-white border-blue-500'}`}>
          <Users className="h-8 w-8 text-blue-500" />
        </div>
        <h4 className="font-bold text-xl mb-2">2. Join Meeting</h4>
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Simply join any Google Meet call. The extension automatically activates in the background.
        </p>
        <motion.a
          href="https://meet.google.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Try a Demo Meeting
        </motion.a>
      </motion.div>

      {/* Step 3 */}
      <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
        <div className={`mb-4 p-4 rounded-full border-4 ${darkMode ? 'bg-gray-700 border-blue-500' : 'bg-white border-blue-500'}`}>
          <Download className="h-8 w-8 text-blue-500" />
        </div>
        <h4 className="font-bold text-xl mb-2">3. Get Summary</h4>
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          The AI provides a concise summary. Click below to download a sample report to see what it looks like.
        </p>
        <motion.a
          href="/downloads/sample-summary.pdf" // IMPORTANT: See instructions below
          download="MeetMinds-Sample-Summary.pdf"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
        >
          Download Sample PDF
        </motion.a>
      </motion.div>
    </motion.div>
  </section>
);

export default HowItWorks;