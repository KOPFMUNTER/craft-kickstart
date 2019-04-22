const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const PATHS = {
   src: path.join(__dirname, 'templates')
}

module.exports = {
  entry: { main: [
      './src/js/app.js',
    ]},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
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
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loaders: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash].[ext]'
                }
            },
            {
                loader: 'img-loader',
                options: {
                    plugins: [
                      require('imagemin-gifsicle')({
                        interlaced: false
                      }),
                      require('imagemin-mozjpeg')({
                        progressive: true,
                        arithmetic: false
                      }),
                      require('imagemin-webp')({
                        quality: 75
                      }),
                      require('imagemin-pngquant')({
                        floyd: 0.5,
                        speed: 2
                      }),
                      require('imagemin-svgo')({
                        plugins: [
                          { removeTitle: true },
                          { convertPathData: false }
                        ]
                      })
                    ]
                }
            }
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new PurgecssPlugin({
        paths: () => glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    }),
    new WebpackNotifierPlugin({alwaysNotify: true}),
  ]
};

/*

TODO:
- Long-Term-Caching

*/
