"use client";

import React from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3 }}
      className="bg-black text-white p-6 rounded-xl border border-gray-700 shadow-md"
    >
      <div className="flex flex-col items-center text-center">
        {icon && <div className="mb-4 text-gray-300 text-3xl">{icon}</div>}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
