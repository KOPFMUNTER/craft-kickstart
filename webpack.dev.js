
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const common = require('./webpack.common');
const merge = require('webpack-merge');

module.exports = merge(common,{
  plugins: [
    new BrowserSyncPlugin({
        proxy: process.env.DEFAULT_SITE_URL,
        https: true,
        files: ['dist/', 'templates/**/*']
    })
  ]
});
