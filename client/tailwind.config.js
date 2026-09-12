/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0a0e14",
          900: "#0f141c",
          800: "#161c26",
          700: "#1f2733",
          600: "#2a3542",
        },
        accent: {
          DEFAULT: "#3dd9c4",
          dim: "#2ba896",
        },
        risk: {
          safe: "#3dd9c4",
          moderate: "#f2b84b",
          high: "#f2555a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        panel: "0 8px 30px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
