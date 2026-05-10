/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: "#1c1917",
        cream: "#faf6f1",
        sand: "#f3ece2",
        rose: {
          50: "#fbf3f1",
          100: "#f5e3df",
          200: "#ecc7be",
          300: "#dca194",
          400: "#c87a6b",
          500: "#a85949",
          600: "#8a4338",
          700: "#6e342c",
        },
        gold: {
          400: "#c8a86b",
          500: "#a98a4b",
          600: "#866a37",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(36, 22, 17, 0.18)",
      },
    },
  },
  plugins: [],
};
