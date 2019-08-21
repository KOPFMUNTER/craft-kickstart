
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const common = require('./webpack.common');
const merge = require('webpack-merge');

module.exports = merge(common,{
  plugins: [
    new BrowserSyncPlugin({
        proxy: process.env.DEFAULT_SITE_URL,
        https: {
            key: "/etc/ssl/localhost/localhost.key",
            cert: "/etc/ssl/localhost/localhost.crt" 
        },
        files: ['dist/', 'templates/**/*']
    })
  ]
});
