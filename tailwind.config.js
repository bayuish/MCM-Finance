/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1976d2",
          foreground: "#ffffff",
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#1976d2",
          600: "#1976d2",
          700: "#1565c0",
        },
        accent: {
          DEFAULT: "#f1f5f9",
          foreground: "#0d1e38",
        }
      }
    },
  },
  plugins: [],
}
