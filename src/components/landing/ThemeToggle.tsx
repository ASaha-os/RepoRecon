import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-pill"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className={`theme-toggle-track ${isDark ? "is-dark" : "is-light"}`}>
        <span className="theme-toggle-thumb">
          <Sun
            className={`theme-icon sun-icon ${isDark ? "hidden-icon" : "visible-icon"}`}
          />
          <Moon
            className={`theme-icon moon-icon ${isDark ? "visible-icon" : "hidden-icon"}`}
          />
        </span>
      </span>
    </button>
  );
};
