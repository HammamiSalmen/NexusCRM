const THEME_KEY = "pc-theme";

export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || "light";
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-pc-theme", theme);
};

export const toggleTheme = () => {
  const current = getTheme();
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
};
