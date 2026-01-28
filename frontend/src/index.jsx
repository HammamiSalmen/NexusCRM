import "./i18n";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/600.css";
import { getTheme, setTheme } from "./utils/theme";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
setTheme(getTheme());
