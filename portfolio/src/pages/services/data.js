export const serviceCapabilities = [
  {
    id: "full-stack",
    title: "Full-Stack Web Engineering",
    description:
      "End-to-end web applications built with React, Next.js, Node.js, and robust databases (PostgreSQL/MongoDB).",
    icon: "Code2",
    features: [
      "Responsive UI/UX",
      "RESTful & GraphQL APIs",
      "Prisma/Mongoose ORM",
      "State Management (Redux)",
    ],
  },
  {
    id: "ai-integration",
    title: "AI & Smart System Integration",
    description:
      "Leverage modern AI workflows, LLM APIs, and intelligent automation directly into your web applications.",
    icon: "Bot",
    features: [
      "OpenAI & LLM API Integration",
      "Custom AI Workflows",
      "Automated Pipelines",
      "Smart Analytics & Search",
    ],
  },
  {
    id: "architecture-optimization",
    title: "Performance & Code Architecture",
    description:
      "Refactoring, bug fixing, database tuning, and speed optimization for high-traffic web applications.",
    icon: "Zap",
    features: [
      "Speed & SEO Optimization",
      "Clean Code Refactoring",
      "Database Query Tuning",
      "Security & CORS Audit",
    ],
  },
];

export const pricingPackages = [
  {
    id: "mvp-sprint",
    name: "MVP Web Launch",
    tagline:
      "Perfect for startups and early-stage ideas needing speed to market.",
    popular: false,
    badge: "Fast Turnaround",
    startingPrice: "Custom Quote",
    deliveryTime: "1-2 Weeks",
    inclusions: [
      "Custom Modern Frontend (React / Tailwind)",
      "Essential Backend Setup & Database Wiring",
      "Fully Responsive & Animated UI",
      "Basic SEO & Analytics Integration",
      "Source Code & Deployment Handover",
    ],
    ctaText: "Request MVP Scope",
  },
  {
    id: "ai-fullstack",
    name: "AI & Full-Stack Application",
    tagline:
      "End-to-end scalable platform equipped with smart AI capabilities.",
    popular: true,
    badge: "Most Popular",
    startingPrice: "Custom Quote",
    deliveryTime: "3-4 Weeks",
    inclusions: [
      "Complex Multi-Role Authentication (JWT/OAuth)",
      "AI API Integration (LLMs / Automation)",
      "Next.js / Node.js / PostgreSQL / MongoDB Stack",
      "State Management & Real-time WebSockets",
      "Complete Admin Dashboard & CMS Integration",
      "30 Days Post-Launch Maintenance Support",
    ],
    ctaText: "Build Full-Stack App",
  },
  {
    id: "audit-optimization",
    name: "Code Audit & Refactoring",
    tagline:
      "Fix persistent bugs, optimize query performance, and upgrade stack.",
    popular: false,
    badge: "For Existing Products",
    startingPrice: "Custom Quote",
    deliveryTime: "3-7 Days",
    inclusions: [
      "Deep Codebase & Security Review",
      "React/Node Performance Optimization",
      "Database Schema & Prisma/Mongoose Tuning",
      "UI/UX Accessibility & Responsive Fixes",
      "Comprehensive Architectural Action Report",
    ],
    ctaText: "Book Code Audit",
  },
];
