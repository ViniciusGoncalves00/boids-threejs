/** @type {import('tailwindcss').Config} */
module.exports =
{
  content: ["./src/**/*.{html,css,js,ts}"],
  theme:
  {
    extend:
    {
      dropShadow:
      {
        "custom-shadow-1": "4px 4px 4px rgb(0 0 0 / 0.2)",
        "custom-shadow-2": "4px 4px 4px rgb(0 0 0 / 0.05)"
      },
      colors:
      {
        primary: "rgba(var(--primary))",
        primary_highlight: "rgba(var(--primary_highlight))",
    
        primary_text: "rgba(var(--primary_text))",
        primary_highlight_text:"rgba(var(--primary_highlight_text))",
      }
    },
  },
  plugins: [],
};
