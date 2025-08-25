"use client";
import React from "react";
import { motion } from "framer-motion";

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

export default FeatureCard;