/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        chat: {
          bg:       "#0f1117",
          sidebar:  "#161b22",
          surface:  "#1c2333",
          border:   "#30363d",
          bubble:   "#1e3a5f",
          bubbleOut:"#1a2942",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "slide-in":   "slideIn 0.2s ease-out",
        "fade-in":    "fadeIn 0.15s ease-out",
        "bounce-dot": "bounceDot 1.2s infinite ease-in-out",
      },
      keyframes: {
        slideIn: {
          "0%":   { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)",      opacity: "1" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%":           { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
