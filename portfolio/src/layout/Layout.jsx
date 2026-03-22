import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ScrollToTop from "../components/ui/ScrollToTop";
import PageLoader from "../components/ui/PageLoader";
import { getBanner, getBio, getProjects } from "../services/portfolioService";

const Layout = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([getProjects(), getBio(), getBanner()]);
      } catch (_) {
        // still hide loader even if requests fail
      } finally {
        setIsReady(true);
      }
    };
    init();
  }, []);

  if (!isReady) return <PageLoader title="UHAIMONG" />;
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
      {/* Scroll to top */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
