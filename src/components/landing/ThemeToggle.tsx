import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={"theme-toggle-pill " + (isDark ? "theme-is-dark" : "theme-is-light")}
      aria-label={"Switch to " + (isDark ? "light" : "dark") + " mode"}
      title={"Switch to " + (isDark ? "light" : "dark") + " mode"}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-mark theme-toggle-sun"><Sun className="w-3 h-3" /></span>
        <span className="theme-toggle-mark theme-toggle-moon"><Moon className="w-3 h-3" /></span>
        <span className="theme-toggle-thumb">
          {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </span>
      </span>
    </button>
  );
};
