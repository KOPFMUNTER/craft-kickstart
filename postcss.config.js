module.exports = {
    plugins: [
      require("postcss-import", {}),
      require('tailwindcss')('./tailwind.js'),
      require('precss'),
      require('postcss-clean'),
      require('postcss-hexrgba'),
    ]
}