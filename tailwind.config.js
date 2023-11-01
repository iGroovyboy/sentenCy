const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,vue,ts}"],
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#9ca3a6",
          60: "#7d8087",
          70: "#3d4148",

          100: "#34373d",
          150: "#32353b",
          200: "#2d3035",
          300: "#282b2f",
          400: "#22252a",
          500: "#22252a",
        },
      },
      textShadow: {
        1: "1px 1px 1px black",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      );
    }),
  ],
};
