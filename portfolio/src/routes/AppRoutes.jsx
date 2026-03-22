import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import ProjectsPage from "../pages/ProjectsPage";
import Blog from "../pages/Blog";
import NotFound from "../pages/NotFound";
import BlogDetails from "../pages/blog/detailPage/BlogDetail";
import Contact from "../pages/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      { path: "blog/:slug", element: <BlogDetails /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
