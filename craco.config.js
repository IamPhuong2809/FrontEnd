/* craco.config.js */
const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  },
};