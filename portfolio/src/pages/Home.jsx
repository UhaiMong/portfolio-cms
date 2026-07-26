import Hero from "./Hero";
import About from "./About";
import ProjectsPage from "./ProjectsPage";
import Contact from "./Contact";
import { Suspense } from "react";
import { CgSpinner } from "react-icons/cg";
import Skeleton from "../components/ui/SkeletonCard";
import ServicePage from "./services/ServicePage";

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <ProjectsPage />
      <ServicePage />
      <Contact />
    </div>
  );
};

export default Home;
