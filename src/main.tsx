import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const preloadProjects = () => {
  if (typeof document === "undefined") {
    return;
  }
  if (document.querySelector('link[data-preload="projects"]')) {
    return;
  }
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "fetch";
  link.href = `${window.location.origin}/api/projects`;
  link.crossOrigin = "anonymous";
  link.setAttribute("data-preload", "projects");
  document.head.appendChild(link);
};

preloadProjects();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
