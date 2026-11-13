import React from "react";
import { motion } from "framer-motion";

const DeviceButton = React.memo(({ icon, label, isActive, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-pressed={isActive}
    title={label}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    animate={{
      backgroundColor: isActive ? "#16a34a" : "transparent", // green-600
      color: isActive ? "#fff" : "#374151", // gray-700
      borderColor: isActive ? "#16a34a" : "#d1d5db", // gray-300
    }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
    className="px-3 py-2 rounded-md border"
  >
    {icon}
  </motion.button>
));

export default DeviceButton;
