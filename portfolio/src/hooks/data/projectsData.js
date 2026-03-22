// src/data/projectsData.js
export const projects = [
  {
    id: "portfolio",
    title: "Personal Portfolio",
    subtitle: "React · Tailwind · Framer Motion",
    mockup: "/images/website_mockup.jpg", // MockUp Image
    screenshot: "/images/fullPage.jpg", // full page Screen shots
    videoId: "", // YouTube VideID If exist
    description:
      "A modern, animated personal portfolio featuring projects, blog and contact integrations. Focus on performance and UX.",
    tech: ["React", "Tailwind", "Framer Motion", "Vite"],
    live: "https://your-portfolio.com", // deployment live site url
    repo: "https://github.com/yourname/portfolio", // github repository link if public
  },
  {
    id: "ecommerce",
    title: "E-Commerce Store",
    subtitle: "Next.js · Stripe · Node",
    mockup: "/images/mocku_2.png",
    screenshot: "/images/fullPage2.png",
    videoId: "",
    description:
      "Full-featured e-commerce platform with payments, product admin and user accounts.",
    tech: ["Next.js", "Node", "Stripe", "Postgres"],
    live: "https://your-ecommerce.com",
    repo: "https://github.com/yourname/ecommerce",
  },
];
