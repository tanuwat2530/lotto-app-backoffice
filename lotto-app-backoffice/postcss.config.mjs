// postcss.config.js
export default {
  plugins: {
    // Use the new dedicated PostCSS package
    '@tailwindcss/postcss': {}, 
    // You can often remove 'autoprefixer' and 'postcss-import' in v4
    // as their functionality is typically integrated.
  },
};