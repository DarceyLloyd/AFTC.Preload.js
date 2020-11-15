module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                debug: true,
                targets: {
                    "browsers": [
                        "last 5 Chrome versions",
                        "last 5 Firefox versions",
                        "last 3 Edge versions",
                        "last 2 Opera versions",
                        "last 3 Safari versions",
                        // "ie >= 11",
                        "ios 12",
                        "safari 12"
                    ]
                },
                "corejs": "3.6.5",
                useBuiltIns: "usage"
            }
        ]
    ],
    plugins: [
        // this will enable es7 class capabilities (#private and public vars between classes)
        "@babel/plugin-proposal-class-properties",
        // "@babel/plugin-transform-classes",
        // "@babel/plugin-proposal-private-methods"
    ],
};
