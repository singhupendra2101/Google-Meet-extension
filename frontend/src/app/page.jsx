"use client";
import React, { useState, useEffect } from "react";
import { Brain, Video, FileText, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
  

// ---------------- Header ----------------
const Header = ({ toggleTheme, darkMode }) => (
  <motion.header
    initial={{ y: -60, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className={`flex justify-between items-center px-8 py-4 shadow-md sticky top-0 z-50 ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
    }`}
  >
    <h1 className="text-2xl font-extrabold text-blue-600 tracking-wide">
      MeetMinds
    </h1>
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {["Features", "How it Works", "Download"].map((item) => (
        <a
          key={item}
          href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
          className="relative group"
        >
          {item}
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
        </a>
      ))}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Sign Up
      </motion.button>
    </nav>
    {/* Theme Toggle Button */}
    <motion.button
      onClick={toggleTheme}
      whileHover={{ rotate: 180 }}
      transition={{ duration: 0.4 }}
      className="ml-6 p-2 rounded-full border hover:scale-110 transition"
    >
      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </motion.button>
  </motion.header>
);

// ---------------- Hero Section ----------------
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
      alt="Meeting"
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

// ---------------- Features ----------------
const FeatureCard = ({ icon: Icon, title, img, desc }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.03 }}
    className="p-6 shadow-lg rounded-xl bg-gray-100 dark:bg-gray-800 hover:shadow-2xl transition"
  >
    <Icon className="mx-auto h-10 w-10 text-blue-600" />
    <h4 className="mt-4 font-semibold">{title}</h4>
    <img src={img} alt={title} className="rounded-lg mt-3" />
    <p className="text-gray-600 dark:text-gray-300 mt-2">{desc}</p>
  </motion.div>
);

const Features = ({ darkMode }) => (
  <section
    id="features"
    className={`py-16 px-8 ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
    }`}
  >
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-3xl font-bold text-center"
    >
      ✨ Features
    </motion.h3>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <FeatureCard
        icon={Video}
        title="Seamless Meet Integration"
        img="https://plus.unsplash.com/premium_photo-1661338951695-c5f24fc85d47?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        desc="Works directly inside Google Meet without interruptions."
      />
      <FeatureCard
        icon={Brain}
        title="AI Summaries"
        img="https://media.istockphoto.com/id/1072525708/photo/young-girl-thinking-with-glowing-brain-illustration.jpg?s=2048x2048&w=is&k=20&c=w-0VAKLHpVt0Q4FKC1IAqKzrBn281oEtMXiqIwIyCeA="
        desc="Generate clear, concise summaries in real time."
      />
      <FeatureCard
        icon={FileText}
        title="Download Notes"
        img="https://plus.unsplash.com/premium_photo-1683417272601-dbbfed0ed718?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        desc="Export summaries as PDF for future reference."
      />
    </div>
  </section>
);

// ---------------- How It Works ----------------
const HowItWorks = ({ darkMode }) => (
  <section
    id="how-it-works"
    className={`py-16 px-8 ${
      darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-800"
    }`}
  >
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-3xl font-bold text-center"
    >
      ⚙️ How It Works
    </motion.h3>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      {[
        { step: "1. Add Extension", text: "Install MeetMinds from Chrome Web Store." },
        { step: "2. Join Meeting", text: "Start or join your Google Meet as usual." },
        { step: "3. Get Summary", text: "AI generates real-time summaries & downloads notes." },
      ].map((item, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-white dark:bg-gray-700 shadow-md rounded-xl"
        >
          <h4 className="font-semibold text-lg">{item.step}</h4>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{item.text}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

// ---------------- Footer ----------------


const Footer = ({ darkMode }) => (
  <footer
    className={`relative ${
      darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"
    } pt-16 pb-8 mt-12`}
  >
    {/* Top Border Accent */}
    {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500"></div> */}

    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h4 className="text-2xl font-bold text-blue-600">MeetMinds</h4>
        <p className="mt-3 text-sm leading-relaxed max-w-xs">
          AI-powered summaries that make every meeting smarter, clearer, and
          more productive.
        </p>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h5 className="font-semibold text-lg mb-3">Quick Links</h5>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#features" className="hover:text-blue-500 transition">
              Features
            </a>
          </li>
          <li>
            <a href="#how-it-works" className="hover:text-blue-500 transition">
              How it Works
            </a>
          </li>
          <li>
            <a href="#download" className="hover:text-blue-500 transition">
              Download
            </a>
          </li>
        </ul>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h5 className="font-semibold text-lg mb-3">Resources</h5>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="hover:text-blue-500 transition">
              Blog
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-500 transition">
              FAQs
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-500 transition">
              Support
            </a>
          </li>
        </ul>
      </motion.div>

      {/* Newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <h5 className="font-semibold text-lg mb-3">Stay Updated</h5>
        <p className="text-sm mb-3">
          Subscribe to get the latest updates and news.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
            Subscribe
          </button>
        </div>
      </motion.div>
    </div>

    {/* Divider */}
    <div
      className={`mt-10 border-t ${
        darkMode ? "border-gray-700" : "border-gray-300"
      }`}
    ></div>

    {/* Bottom */}
    <div className="mt-6 text-center text-xs">
      © {new Date().getFullYear()} MeetMinds. All rights reserved.
    </div>
  </footer>
);



  

// --- App stays here ---
const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  return (
    <div
      className={`font-sans ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <Header toggleTheme={() => setDarkMode(!darkMode)} darkMode={darkMode} />
      <HeroSection darkMode={darkMode} />
      <Features darkMode={darkMode} />
      <HowItWorks darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default App;




