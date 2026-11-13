import Hero from "./Hero";
import About from "./About";
import ProjectsPage from "./ProjectsPage";
import Contact from "./Contact";
import ServicePage from "./services/ServicePage";
import Seo, { personJsonLd } from "../components/Seo";
import { useData } from "../context/DataContext";
import { SITE } from "../config/site";

const Home = () => {
  const { bio } = useData();

  return (
    <div>
      <Seo
        title={SITE.title}
        description={bio?.about || SITE.description}
        path="/"
        image={bio?.avatar || SITE.image}
        jsonLd={personJsonLd(bio)}
      />
      <Hero />
      <About />
      <ProjectsPage />
      <ServicePage />
      <Contact />
    </div>
  );
};

export default Home;
