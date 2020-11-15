const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    stats: {
        warnings: true
    },
    // https://webpack.js.org/configuration/devtool/#special-cases
    devtool: 'inline-source-map',
    // https://webpack.js.org/configuration/optimization/
    optimization: {
        // https://webpack.js.org/configuration/optimization/#optimizationusedexports
        usedExports: true,
        minimize: false,
    }
});