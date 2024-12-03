/** @type {import('tailwindcss').Config} */
module.exports =
{
  content: ["./src/**/*.{html,css,js,ts}"],
  theme:
  {
    extend:
    {
      fontFamily: {
        Montserrat: ["Montserrat"],
        RobotoCondensed: ["Roboto Condensed"],
      },
      dropShadow:
      {
        "custom-shadow-1": "0px 0px 4px rgb(0 0 0 / 0.10)",
        "custom-shadow-2": "4px 4px 4px rgb(0 0 0 / 0.05)"
      },
      colors:
      {
        primary: "rgba(var(--primary))",
        primary_highlight: "rgba(var(--primary_highlight))",
        secondary: "rgba(var(--secondary))",
    
        primary_text: "rgba(var(--primary_text))",
        primary_highlight_text:"rgba(var(--primary_highlight_text))",
      }
    },
  },
  plugins: [],
};
