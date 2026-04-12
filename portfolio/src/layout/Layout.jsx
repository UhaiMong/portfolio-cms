import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ScrollToTop from "../components/ui/ScrollToTop";
import ChatBot from "../pages/chatBoot/ChatBoot";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
      <ChatBot />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
