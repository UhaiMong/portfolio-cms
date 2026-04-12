import { Link, useParams } from "react-router-dom";

import { useState, useMemo } from "react";
import { Tablet, Monitor, SmartphoneIcon, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DeviceButton from "../../components/ui/DeviceButton";

const devices = {
  mobile: { width: "375px", label: "Mobile" },
  tablet: { width: "768px", label: "Tablet" },
  desktop: { width: "100%", label: "Desktop" },
};

const LivePreview = () => {
  const params = useParams();
  const projectUrl = params["*"];
  const [activeDevice, setActiveDevice] = useState("desktop");

  // Memoize device config to avoid recalculations
  const currentDevice = useMemo(() => devices[activeDevice], [activeDevice]);

  return (
    <div className="flex flex-col w-full h-screen mt-20">
      {/* Toolbar */}
      <div className="p-2.5 flex justify-center gap-5 border-b border-gray-800">
        <DeviceButton
          icon={<SmartphoneIcon size={14} />}
          isActive={activeDevice === "mobile"}
          onClick={() => setActiveDevice("mobile")}
        />
        <DeviceButton
          icon={<Tablet size={16} />}
          isActive={activeDevice === "tablet"}
          onClick={() => setActiveDevice("tablet")}
        />
        <DeviceButton
          icon={<Monitor size={20} />}
          isActive={activeDevice === "desktop"}
          onClick={() => setActiveDevice("desktop")}
        />
      </div>

      <Link
        className="px-3.5 flex justify-start items-center gap-x-2 font-semibold"
        to="/archives"
      >
        <ArrowLeft size={16} /> Back
      </Link>
      {/* Preview Area */}
      <div className="flex-1 flex justify-center items-center p-5 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDevice}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shadow-2xl border border-gray-300 rounded-sm overflow-hidden h-full"
            style={{ width: currentDevice.width }}
          >
            <iframe
              src={projectUrl}
              title="Preview"
              style={{ width: "100%", height: "100%", border: "none" }}
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LivePreview;
