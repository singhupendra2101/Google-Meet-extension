"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, MoreVertical, LogOut } from "lucide-react";
import Link from "next/link";

const Header = ({ toggleTheme, darkMode, isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`flex justify-between items-center px-8 py-4 shadow-md sticky top-0 z-50 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Left Side: Logo */}
      <Link href="/" className="text-2xl font-extrabold text-blue-600 tracking-wide">
        MeetMinds
      </Link>

      {/* Center: Navigation Links */}
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
      </nav>

      {/* Right Side: Actions (Sign Up/Menu and Theme Toggle) */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="relative">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
                >
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link href="/signup" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm font-medium"
            >
              Sign Up
            </motion.button>
          </Link>
        )}

        <motion.button
          onClick={toggleTheme}
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.4 }}
          className="p-2 rounded-full border hover:scale-110 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;