/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xl2: "1680px", // Custom name for the breakpoint, e.g., 'xl2'
      },
      fontFamily: {
        sans: ["FiraGO", "sans-serif"],
      },
      colors: {
        Bgcolor: "#6D9FBB", // background color
        brandBg: "#F1F1F1", // Brand background color
        productBg: "#DCEEF8", // Product background color
      },
    },
  },
  plugins: [],
};
