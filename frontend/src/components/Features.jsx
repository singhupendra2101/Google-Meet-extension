"use client";
import React from "react";
import { motion } from "framer-motion";
import { Brain, Video, FileText, Target, Clock, Star } from "lucide-react";
import FeatureCard from "./FeatureCard";

// Animation variants for staggering the feature cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Each child will be delayed by 0.2s
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Features = ({ darkMode }) => (
  <section
    id="features"
    className={`py-16 px-4 sm:py-20 sm:px-6 md:px-12 lg:px-24 ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
    }`}
  >
    {/* --- Main Features Section (Your Original Code with Better Animation) --- */}
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400"
    >
      Everything You Need for Smarter Meetings
    </motion.h3>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center"
    >
      {/* Each card is wrapped in motion.div for staggered animation */}
      <motion.div variants={itemVariants}>
        <FeatureCard
          icon={Video}
          title="Seamless Meet Integration"
          img="https://plus.unsplash.com/premium_photo-1661338951695-c5f24fc85d47?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          desc="Works directly inside Google Meet without interruptions."
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <FeatureCard
          icon={Brain}
          title="AI Summaries"
          img="https://media.istockphoto.com/id/1072525708/photo/young-girl-thinking-with-glowing-brain-illustration.jpg?s=2048x2048&w=is&k=20&c=w-0VAKLHpVt0Q4FKC1IAqKzrBn281oEtMXiqIwIyCeA="
          desc="Generate clear, concise summaries in real time."
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <FeatureCard
          icon={FileText}
          title="Download Notes"
          img="https://plus.unsplash.com/premium_photo-1683417272601-dbbfed0ed718?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          desc="Export summaries as PDF for future reference."
        />
      </motion.div>
    </motion.div>

    {/* --- NEW SECTION: Data Highlights (The "Graphs") --- */}
  <div className="mt-16 max-w-5xl mx-auto px-2">
       <motion.h4
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-10"
      >
        Backed by Data
      </motion.h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Target className="h-10 w-10 mx-auto text-blue-500" />
          <p className="text-4xl font-bold mt-3">95%</p>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Summary Accuracy</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Clock className="h-10 w-10 mx-auto text-blue-500" />
          <p className="text-4xl font-bold mt-3">80%</p>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Time Saved on Notes</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Star className="h-10 w-10 mx-auto text-blue-500" />
          <p className="text-4xl font-bold mt-3">4.8/5</p>
          <p className="text-gray-600 dark:text-gray-400 mt-1">User Rating</p>
        </motion.div>
      </div>
    </div>

  </section>
);

export default Features;