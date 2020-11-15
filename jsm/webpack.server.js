const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const distPath = path.resolve(__dirname, 'dist')

module.exports = merge(common, {
    mode: 'development',
    stats: {
        warnings: true
    },
    devtool: 'inline-source-map',
    plugins: [
        // new webpack.ProvidePlugin({
        //     THREE: 'three'
        // }),

        // new CleanWebpackPlugin(['public/js', 'public/css']),
        // new HtmlWebpackPlugin({
        //     template: 'src/index.html',
        //     inject: true
        // }),
        // new webpack.HotModuleReplacementPlugin(), // Enable HMR
        // new webpack.HashedModuleIdsPlugin(),
        new BrowserSyncPlugin(
            {
                server: { baseDir: [distPath] },
                // proxy: 'http://localhost:8080/',
                host: 'localhost',
                port: 3001,
                open: true,
                files: [
                    {
                        match: ['**/*.html'],
                        fn: event => {
                            if (event === 'change') {
                                const bs = require('browser-sync').get(
                                    'bs-webpack-plugin'
                                )
                                bs.reload()
                            }
                        }
                    }
                ]
            },
            {
                reload: false
            }
        ),
        // new MiniCssExtractPlugin({
        //     filename: 'css/[name].[hash].css',
        // }),
        // new OptimizeThreePlugin()
    ],
    devServer: {
        hot: true, // Tell the dev-server we're using HMR
        contentBase: path.resolve(__dirname, 'dist'),
    },
    

    // devServer: {
    //     contentBase: path.resolve(__dirname, './dist'),
    //     port: 4000
    // },    
    optimization: {
        usedExports: true,
        minimize: false,
    }
});