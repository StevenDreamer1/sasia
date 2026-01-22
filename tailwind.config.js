/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        surface: "#111111",
        accent: "#5E5CE6",
        textMuted: "#B3B3B3",
      },
    },
  },
}
