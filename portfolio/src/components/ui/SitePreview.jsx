import React, { useState } from "react";
import { Smartphone, Tablet, Monitor } from "lucide-react";

const devices = {
  mobile: { width: "375px", height: "667px", label: "Mobile" },
  tablet: { width: "768px", height: "1024px", label: "Tablet" },
  desktop: { width: "100%", height: "100%", label: "Desktop" },
};
const SitePreview = ({ project }) => {
  const [activeDevice, setActiveDevice] = useState("desktop");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#f4f4f4",
      }}
    >
      {/* 1. Switcher Toolbar */}
      <div
        style={{
          padding: "10px",
          background: "#fff",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button
          onClick={() => setActiveDevice("mobile")}
          style={btnStyle(activeDevice === "mobile")}
        >
          <Smartphone size={20} />
        </button>
        <button
          onClick={() => setActiveDevice("tablet")}
          style={btnStyle(activeDevice === "tablet")}
        >
          <Tablet size={20} />
        </button>
        <button
          onClick={() => setActiveDevice("desktop")}
          style={btnStyle(activeDevice === "desktop")}
        >
          <Monitor size={20} />
        </button>
      </div>

      {/* 2. The Preview Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <div
          style={{
            width: devices[activeDevice].width,
            height: devices[activeDevice].height,
            transition: "all 0.3s ease-in-out",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            border: "1px solid #ccc",
            borderRadius: activeDevice === "desktop" ? "0" : "12px",
            overflow: "hidden",
          }}
        >
          <iframe
            src={project?.liveUrl}
            title="Preview"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
};

const btnStyle = (isActive) => ({
  background: isActive ? "#007bff" : "transparent",
  color: isActive ? "#fff" : "#333",
  border: "1px solid #ddd",
  padding: "8px 12px",
  borderRadius: "4px",
  cursor: "pointer",
});

export default SitePreview;
