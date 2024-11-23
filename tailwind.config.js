/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "#000000",
      white: "#FFFFFF",
      gray: "#D9D9D9",
      starkit: {
        text: "#A5A6DB",
        toggleback: "#EBECFE",
        toggleround: "#C4C5FC",
        magnolia: "#F2F2FE",
        lavender: "#B7B8FB",
        bluebell: "#A6A7E4",
        purple: "#6872F7",
        indigo: "#383BDA",
        electric: "#1C24AA",
        red: "#DC3601",
        gray: "#DFDFDF",
        button: "#2E39CE",
        hoverbutton: "#2731AF",
        focusbutton: "#202890",
      },
    },
  },
  plugins: [],
};
