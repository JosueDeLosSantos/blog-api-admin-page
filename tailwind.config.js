/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: "#root",
  theme: {
    extend: {},
    fontFamily: {
      PressStart2P: ['"Press Start 2P"'],
    },
    fontSize: {
      sm: "0.75rem",
      base: "16px",
      lg: "24px",
      xl: "32px",
      "2xl": "40px",
      "3xl": "48px",
      "4xl": "56px",
      "5xl": "64px",
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("@tailwindcss/typography")],
  corePlugins: {
    preflight: true,
  },
};
