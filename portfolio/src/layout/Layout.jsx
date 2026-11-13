import { Outlet, ScrollRestoration } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ScrollToTop from "../components/ui/ScrollToTop";
import ChatBot from "../pages/chatBoot/ChatBoot";
import Cursor from "../components/ui/Cursor";
import CommandPalette from "../components/CommandPalette";

const Layout = () => {
  return (
    <div className="page-surface min-h-screen">
      <ScrollRestoration />
      <Toaster position="bottom-center" />
      <Cursor />
      <CommandPalette />
      <Navbar />
      <Outlet />
      <Footer />
      <ChatBot />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
