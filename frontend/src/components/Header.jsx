"use client";
// CORRECTED: The extra comma after 'React' has been removed.
import React, { useState } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, MoreVertical, LogOut } from "lucide-react";
import Link from "next/link";

const Header = ({ toggleTheme, darkMode, isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 relative" 
    >
      <div className="animated-gradient absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-black opacity-40 z-0" />
      <div className="relative z-10 flex justify-between items-center px-8 py-4 text-white">
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-white drop-shadow-md">
          MeetMinds
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {["Features", "How it Works", "Download"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="relative group">
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {/* The Sign Up button is removed. If not logged in, this renders nothing. */}
          {isLoggedIn ? (
            <div className="relative">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-white/10"
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
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-900/50 backdrop-blur-md border border-white/20"
                  >
                    <button
                      onClick={onLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;