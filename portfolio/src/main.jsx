import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes";
import { render } from "preact";
import { DataProvider } from "./context/DataContext";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

render(
  <ThemeProvider>
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  </ThemeProvider>,
  document.getElementById("app"),
);
