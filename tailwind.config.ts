import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0f7f3",
          100: "#dbede3",
          200: "#badbc9",
          300: "#8ec2a8",
          400: "#5ea383",
          500: "#3e8666",
          600: "#2e6b50",
          700: "#265541",
          800: "#214436",
          900: "#1d392e",
          950: "#0c1f18",
        },
        sprout: {
          50: "#f3fbf5",
          100: "#e3f6ea",
          200: "#c7eed6",
          300: "#9bdeb7",
          400: "#67c592",
          500: "#3ea873",
          600: "#2f895b",
          700: "#276d4a",
          800: "#23573c",
          900: "#1e4733",
        },
        cream: {
          50: "#fdfdfa",
          100: "#faf9f3",
          200: "#f4f1e5",
          300: "#ede7d3",
          400: "#dfd4b7",
          500: "#cbbd97",
        },
        earth: {
          50: "#faf6f3",
          100: "#f3ebe4",
          200: "#e6d5c6",
          300: "#d4b8a2",
          400: "#bc947c",
          500: "#aa785d",
          600: "#96634c",
          700: "#7c503e",
          800: "#664336",
          900: "#54382e",
        },
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(26, 56, 43, 0.06), 0 2px 6px -1px rgba(26, 56, 43, 0.04)",
        card: "0 10px 30px -4px rgba(26, 56, 43, 0.08), 0 4px 8px -2px rgba(26, 56, 43, 0.03)",
        elevated: "0 20px 40px -10px rgba(12, 31, 24, 0.12), 0 8px 16px -4px rgba(12, 31, 24, 0.06)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
export default config;
