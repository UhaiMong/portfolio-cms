import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Blog from "../pages/Blog";
import NotFound from "../pages/NotFound";
import BlogDetails from "../pages/blog/detailPage/BlogDetail";
import Contact from "../pages/Contact";
import ArchiveGallery from "../pages/archives/ArchiveGallery";
import ProjectGalleryGemini from "../pages/archives/ArchiveGemini";
import ProjectGalleryDetailsGemini from "../pages/archives/ArchiveGeminiDetails";
import ArrchiveDetails from "../pages/archives/ArchiveDetails";
import LivePreview from "../pages/livePreview/LivePreview";
import RouteError from "../pages/RouteError";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "archives", element: <ArchiveGallery /> },
      { path: "project/live-preview/:slug", element: <LivePreview /> },
      { path: "archives/:slug", element: <ArrchiveDetails /> },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      { path: "blog/:slug", element: <BlogDetails /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
