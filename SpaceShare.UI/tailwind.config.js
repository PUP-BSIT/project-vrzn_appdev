/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["cupcake", "cmyk"],
 },
  plugins: [
    require('daisyui'),
    require('flowbite/plugin')
  ],
}

