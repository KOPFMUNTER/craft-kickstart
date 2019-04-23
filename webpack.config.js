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
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new PurgecssPlugin({
        paths: () => glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    }),
    new BrowserSyncPlugin({
        proxy: 'https://test1.loc/',
        https: true,
        files: ['dist/', 'templates/**/*']
    }),
    new ManifestPlugin(),
    new CleanWebpackPlugin({
        verbose: true
    }),
    new CopyWebpackPlugin([{
        from: 'img/**/**',
        to: path.resolve(__dirname, 'web/dist/'),
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
  ],
  watch: true
};
