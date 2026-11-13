import { lazy, Suspense } from "preact/compat";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import RouteError from "../pages/RouteError";
import PageLoader from "../components/ui/PageLoader";

// Heavy / less-visited routes — split from the home bundle
const Blog = lazy(() => import("../pages/Blog"));
const BlogDetails = lazy(() => import("../pages/blog/detailPage/BlogDetail"));
const ArchiveGallery = lazy(() => import("../pages/archives/ArchiveGallery"));
const ArchiveDetails = lazy(() => import("../pages/archives/ArchiveDetails"));
const LivePreview = lazy(() => import("../pages/livePreview/LivePreview"));
const NotFound = lazy(() => import("../pages/NotFound"));

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader title="Loading" />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "archives", element: withSuspense(ArchiveGallery) },
      { path: "project/live-preview/:slug", element: withSuspense(LivePreview) },
      { path: "archives/:slug", element: withSuspense(ArchiveDetails) },
      { path: "blog", element: withSuspense(Blog) },
      { path: "blog/:slug", element: withSuspense(BlogDetails) },
      { path: "*", element: withSuspense(NotFound) },
    ],
  },
]);

export default router;
