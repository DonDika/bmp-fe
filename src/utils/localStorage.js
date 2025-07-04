const SIDEBAR_KEY = "sidebar_collapsed";

export const getSidebarState = () => {
  const stored = localStorage.getItem(SIDEBAR_KEY);
  return stored === "true";
};

export const setSidebarState = (value) => {
  localStorage.setItem(SIDEBAR_KEY, value.toString());
};