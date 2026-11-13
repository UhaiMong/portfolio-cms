import { Outlet, ScrollRestoration } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ScrollToTop from "../components/ui/ScrollToTop";
import ChatBot from "../pages/chatBoot/ChatBoot";
import Cursor from "../components/ui/Cursor";

const Layout = () => {
  return (
    <div>
      <ScrollRestoration />
      <Toaster position="bottom-center" />
      <Cursor />
      <Navbar />
      <Outlet />
      <Footer />
      <ChatBot />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
