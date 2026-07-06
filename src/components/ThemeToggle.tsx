import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="relative w-9 h-9 rounded-full flex items-center justify-center text-gold-bright/80 hover:text-gold-bright transition-colors"
    >
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden className="transition-transform duration-500" style={{ transform: isLight ? "rotate(180deg)" : "rotate(0deg)" }}>
        {isLight ? (
          // Sun
          <g stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </g>
        ) : (
          // Moon
          <path
            d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
