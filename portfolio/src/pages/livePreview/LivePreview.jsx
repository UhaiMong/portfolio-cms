import { Link, useParams } from "react-router-dom";
import { useState } from "preact/hooks";
import {
  Tablet,
  Monitor,
  SmartphoneIcon,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DeviceButton from "../../components/ui/DeviceButton";
import ErrorState from "../../components/ui/ErrorState";
import useFetch from "../../hooks/useFetch";
import { getProjectBySlug } from "../../services/portfolioService";
import Seo from "../../components/Seo";

const devices = {
  mobile: { width: "375px", label: "Mobile", icon: SmartphoneIcon, size: 14 },
  tablet: { width: "768px", label: "Tablet", icon: Tablet, size: 16 },
  desktop: { width: "100%", label: "Desktop", icon: Monitor, size: 20 },
};

const isHttpUrl = (url) => {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
};

const LivePreview = () => {
  const { slug } = useParams();
  const [activeDevice, setActiveDevice] = useState("desktop");
  const { data: project, loading, error, refetch } = useFetch(
    getProjectBySlug,
    slug,
    [slug],
  );

  const liveUrl = isHttpUrl(project?.liveUrl) ? project.liveUrl : null;
  const currentDevice = devices[activeDevice];

  return (
    <div className="flex flex-col w-full h-screen pt-20">
      <Seo
        title={project ? `Preview · ${project.title}` : "Live Preview"}
        path={`/project/live-preview/${slug}`}
        noindex
      />
      <div className="p-2.5 flex items-center justify-between gap-5 border-b border-gray-800">
        <Link
          className="px-3.5 flex items-center gap-x-2 font-semibold"
          to={`/archives/${slug}`}
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="flex gap-5" role="group" aria-label="Preview device">
          {Object.entries(devices).map(([key, d]) => (
            <DeviceButton
              key={key}
              label={d.label}
              icon={<d.icon size={d.size} />}
              isActive={activeDevice === key}
              onClick={() => setActiveDevice(key)}
            />
          ))}
        </div>

        {liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 flex items-center gap-x-2 font-semibold"
          >
            Open <ExternalLink size={14} />
          </a>
        ) : (
          <span />
        )}
      </div>

      <div className="flex-1 flex justify-center items-center p-5 overflow-auto">
        {loading ? (
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !liveUrl ? (
          <p className="text-sm">This project doesn't have a live demo.</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDevice}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="shadow-2xl border border-gray-300 rounded-sm overflow-hidden h-full max-w-full"
              style={{ width: currentDevice.width }}
            >
              <iframe
                src={liveUrl}
                title={`${project.title} live preview`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default LivePreview;
