"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

const HomePage = () => {
  // State for Dark Mode
  const [darkMode, setDarkMode] = useState(false);
  
  // State for Login Status (set to true to see the logout menu)
  const [loggedIn, setLoggedIn] = useState(true);

  // Theme management logic
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
  
  // Logout logic
  const handleLogout = () => {
    setLoggedIn(false);
    console.log("User logged out!");
    // You would add your real logout logic here
  };

  return (
    <div
      className={`font-sans ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <Header
        toggleTheme={toggleTheme}
        darkMode={darkMode}
        isLoggedIn={loggedIn}
        onLogout={handleLogout}
      />
      <main>
        <HeroSection />
        <Features darkMode={darkMode} />
        <HowItWorks darkMode={darkMode} />
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default HomePage;