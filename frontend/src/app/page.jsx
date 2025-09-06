"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import FaqComponent from '../components/FAQ'; // Import waisa hi rahega
import Footer from "../components/Footer";
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Baki ka code bilkul same rahega...
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
    console.log("User logged out!");
  };

  return (
    <div
      className={`font-sans ${darkMode ? "bg-background text-foreground" : "bg-background text-foreground"
        }`}
    >
      <Header
        toggleTheme={toggleTheme}
        darkMode={darkMode}
        onLogout={handleLogout}
      />
      <main>
        <HeroSection darkMode={darkMode} />
        <Features darkMode={darkMode} />
        <HowItWorks darkMode={darkMode} />
        {/* FAQ Component se darkMode prop hata diya gaya hai */}
        <FaqComponent />
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default HomePage;