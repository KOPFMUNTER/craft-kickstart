const path = require('path');
const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const common = require('./webpack.common');
const merge = require('webpack-merge');

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

module.exports = merge(common, {
  plugins: [
    new PurgecssPlugin({
        paths: () => glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
        whitelist: ['open','is-active','aos-init','aos-animate'],
        whitelistPatterns: [/(slick)[a-zA-Z-]*/,/(snip)[a-zA-Z-]*/,/(mfp)[a-zA-Z-]*/],
        whitelistPatternsChildren: [/(slick)[a-zA-Z-]*/,/(snip)[a-zA-Z-]*/,/(mfp)[a-zA-Z-]*/],
        extractors: [
            {
                extractor: TailwindExtractor,
                extensions: ["html", "js", "php", "vue"]
            }
        ]
    }),
    new ImageminPlugin(
        {
            pngquant: ({
                quality: '80-95'
            })
        }
    )
  ]
});
