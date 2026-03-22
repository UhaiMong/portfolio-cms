import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./src/components/common/ProtectedRoute";
import DashboardLayout from "./src/layouts/DashboardLayout";

// Pages (we'll build these in next steps)
import LoginPage from "./pages/auth/LoginPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProjectsPage from "./pages/projects/ProjectsPage";
import BlogPage from "./pages/blog/BlogPage";
import BioPage from "./pages/bio/BioPage";
import BannerPage from "./pages/banner/BannerPage";
import ResumePage from "./pages/resume/ResumePage";
import ContactPage from "./pages/contact/ContactPage";
import MediaPage from "./pages/media/MediaPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid #374151",
          },
          success: { iconTheme: { primary: "#6366f1", secondary: "#fff" } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="bio" element={<BioPage />} />
          <Route path="banner" element={<BannerPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="media" element={<MediaPage />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
