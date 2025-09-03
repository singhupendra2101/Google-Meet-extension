"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Twitter, Linkedin, Github, ArrowUpCircle } from "lucide-react";

const Footer = ({ darkMode }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      // Here you would typically handle the form submission, e.g., send to an API
      console.log("Subscribed with:", email);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
      <footer className="relative mt-20 w-full">
      {/* Decorative SVG Wave */}
      <div className={`absolute top-0 left-0 w-full overflow-hidden leading-[0] ${darkMode ? "text-gray-900" : "text-gray-100"}`}>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[150px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-current"
          ></path>
        </svg>
      </div>

      <div className={`relative pt-24 pb-8 ${darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand & Socials */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h4 className="text-2xl font-bold text-blue-600">MeetMinds</h4>
            <p className="mt-3 text-sm leading-relaxed max-w-xs">
              AI-powered summaries that make every meeting smarter and more productive.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-blue-500 transition-transform hover:scale-110"><Twitter /></a>
              <a href="#" className="hover:text-blue-500 transition-transform hover:scale-110"><Linkedin /></a>
              <a href="#" className="hover:text-blue-500 transition-transform hover:scale-110"><Github /></a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h5 className="font-semibold text-lg mb-3">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-blue-500 transition">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-500 transition">How it Works</a></li>
              <li><a href="#download" className="hover:text-blue-500 transition">Download</a></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h5 className="font-semibold text-lg mb-3">Resources</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition">Blog</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">FAQs</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Support</a></li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <h5 className="font-semibold text-lg mb-3">Stay Updated</h5>
            <p className="text-sm mb-3">Subscribe to get the latest updates and news.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-white rounded-lg transition text-sm ${subscribed ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {subscribed ? 'Sent!' : <Send className="w-4 h-4" />}
              </motion.button>
            </form>
          </motion.div>
        </div>

        <div className={`mt-12 border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs px-2">
          <p className="text-center">© {new Date().getFullYear()} MeetMinds. All rights reserved.</p>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 hover:text-blue-500 mt-2 sm:mt-0"
          >
            Back to Top <ArrowUpCircle className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;