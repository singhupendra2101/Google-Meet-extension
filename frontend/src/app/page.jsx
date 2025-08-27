"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header"; // Path check kar lein
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import { useRouter } from 'next/navigation'; // Logout ke liye zaroori

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Theme management logic (yeh theek hai)
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Asli logout logic
  const handleLogout = () => {
    // Storage se token hata dein
    localStorage.removeItem('token');
    // Auth page par wapas bhej dein
    router.push('/auth');
    console.log("User logged out!");
  };

  return (
    <div
      className={`font-sans ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
    >
      {/* Header ab apna login status khud check karega */}
      <Header
        toggleTheme={toggleTheme}
        darkMode={darkMode}
        onLogout={handleLogout} // Asli logout function pass karein
      />
      <main>
        <HeroSection darkMode={darkMode} />
        <Features darkMode={darkMode} />
        <HowItWorks darkMode={darkMode} />
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default HomePage;