/* NOTES:
1. generic libs bundle will be built by gulp - use gulp buildJs (will build libs dev & prod)
2. scss will be built by gulp, webpack makes this process more of a mess than it needs to be
   use gulp buildCss

Available gulp commands:
buildCss buildJs build watchCss
 */

 
const path = require('path');



module.exports = {
    entry: {
        //name: "source_file_path" path must be specified in output
        //"path to export to and file name [path][name]": "source_file_path"
        // "aftc.preloader.js": './src/AFTCPreloader.js',
        "preloader-test-2.js": './src/preloader-test-2.js',
    },
    
    output: {
        // filename: '[name]-[hash].bundle.js'
        // filename: '[name].bundle.js'
        path: path.resolve(__dirname + "/test"),
        filename: '[name]'
    },

    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    // https://webpack.js.org/configuration/
                    // options: {
                    //     presets: ["@babel/preset-env"]
                    // }
                }
            }
        ]
    },

    resolve: {
        extensions: ['.js']
    },

    watch: true,
    watchOptions: {
        ignored: ["node_modules/**"],
    },

    optimization: {
        // https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkschunks
        // runtimeChunk: 'single',
        splitChunks: {
            // chunks: 'all', // all, async, and initial
            // name: "shared",
            // minSize: 20000,
            // minRemainingSize: 0,
            // maxSize: 0,
            // minChunks: 1,
            // maxAsyncRequests: 30,
            // maxInitialRequests: 30,
            // automaticNameDelimiter: '~',
            // enforceSizeThreshold: 50000,
            // cacheGroups: {
            //     defaultVendors: {
            //         test: /[\\/]node_modules[\\/]/,
            //         priority: -10
            //     },
            //     default: {
            //         minChunks: 2,
            //         priority: -20,
            //         reuseExistingChunk: true
            //     }
            // }
            // cacheGroups: {
            //     vendor: {
            //         test: /[\\/]node_modules[\\/]/,
            //         name(module) {
            //             const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            //             return `npm.${packageName.replace('@', '')}`;
            //         },
            //     }
            // }
        }

    }
};