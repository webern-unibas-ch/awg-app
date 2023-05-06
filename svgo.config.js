module.exports = {
    multipass: true, // boolean, false by default
    js2svg: {
        indent: 2, // string with spaces or number of spaces. 4 by default
        pretty: true, // boolean, false by default
    },
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    // disable default plugins
                    cleanupIds: false,
                    removeViewBox: false,
                    removeXMLProcInst: false,
                },
            },
        },
    ],
};
