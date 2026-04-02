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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      // Chat gpt
      { path: "archives", element: <ArchiveGallery /> },
      { path: "archives/:slug", element: <ArrchiveDetails /> },
      // Gemini
      { path: "archives/gemini", element: <ProjectGalleryGemini /> },
      {
        path: "archives/gemini/:slug",
        element: <ProjectGalleryDetailsGemini />,
      },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      { path: "blog/:slug", element: <BlogDetails /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
