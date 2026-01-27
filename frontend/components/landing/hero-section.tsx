"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen flex items-center">
      {/* Background with gradient instead of image */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6"
        >
          Boost Your Productivity
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-400 mb-12"
        >
          Streamline your tasks, stay organized, and achieve more with our intuitive todo application.
          Designed for individuals and teams who value efficiency.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            href="/signup"
            className="px-8 py-3 rounded-md text-black bg-white font-medium shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Link>
          <Link
            href="/signin"
            className="px-8 py-3 rounded-md text-white border border-gray-400 bg-transparent hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover:scale-105"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
