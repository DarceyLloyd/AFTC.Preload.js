const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    stats: {
        warnings: false
    },
    optimization: {
        usedExports: true,
        minimize: true,
    },
});