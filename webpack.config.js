require('dotenv').config();
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const PATHS = {
   src: path.join(__dirname, 'templates')
}

/**
 * Custom PurgeCSS Extractor
 * https://github.com/FullHuman/purgecss
 * https://github.com/FullHuman/purgecss-webpack-plugin
 */
class TailwindExtractor {
    static extract(content) {
      return content.match(/[A-z0-9-:\/]+/g);
    }
}

module.exports = {
  entry: { main: [
      './src/js/app.js',
    ]},
  output: {
    path: path.resolve(__dirname, 'web/dist'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        loaders: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[ext]'
                }
            },
            {
                loader: 'img-loader',
                options: {
                    plugins: [
                        require('imagemin-gifsicle')({
                            interlaced: true,
                        }),
                        require('imagemin-mozjpeg')({
                            progressive: true,
                            arithmetic: false,
                        }),
                        require('imagemin-optipng')({
                            optimizationLevel: 5,
                        }),
                        require('imagemin-svgo')({
                            plugins: [
                                {convertPathData: false},
                            ]
                        }),
                    ]
                }
            }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
        verbose: true
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new PurgecssPlugin({
        paths: () => glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
        whitelist: ['open','is-active'],
        whitelistPatterns: [/(slick)[a-zA-Z-]*/,/(mfp)[a-zA-Z-]*/],
        whitelistPatternsChildren: [/(slick)[a-zA-Z-]*/,/(mfp)[a-zA-Z-]*/],
        extractors: [
            {
                extractor: TailwindExtractor,
                extensions: ["html", "js", "php", "vue"]
            }
        ]
    }),
    new BrowserSyncPlugin({
        proxy: process.env.DEFAULT_SITE_URL,
        https: true,
        files: ['dist/', 'templates/**/*']
    }),
    new ManifestPlugin(),
    new CopyWebpackPlugin([{
        from: 'img/**/*',
        to: path.resolve(__dirname, 'web/dist'),
        context: 'src/',
    }]),
    new ImageminPlugin(
        {
            pngquant: ({
                quality: '80-95'
            })
        }
    ),
    new WebpackNotifierPlugin({alwaysNotify: true}),
  ]
};
