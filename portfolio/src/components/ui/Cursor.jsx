import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const Cursor = React.memo(() => {
  // Use MotionValues for smooth, non-render-blocking movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Adjusted spring settings:
  // Stiffness: Higher = faster/more "snappy", Lower = more "floaty"
  // Damping: Higher = less "springy/bouncey"
  const springConfig = { stiffness: 400, damping: 30 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // clientX and clientY are already relative to viewport
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 32, // Adjust based on your design
        height: 32,
        borderRadius: "50%",
        backgroundColor: "white",
        mixBlendMode: "exclusion",
        pointerEvents: "none",
        zIndex: 999999,
        // Center the cursor exactly on the mouse tip
        x: cursorXSpring,
        y: cursorYSpring,
        transform: "translate(-50%, -50%)",
        willChange: "transform", // Optimizes GPU performance
      }}
    />
  );
});

export default Cursor;
