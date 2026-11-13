import { useEffect, useState } from "preact/hooks";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function Cursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const spring = { stiffness: 400, damping: 30 };
  const x = useSpring(cursorX, spring);
  const y = useSpring(cursorY, spring);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches && !reduceMotion);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "white",
        mixBlendMode: "exclusion",
        pointerEvents: "none",
        zIndex: 999999,
        x,
        y,
        willChange: "transform",
      }}
    />
  );
}
