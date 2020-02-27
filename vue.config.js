module.exports = {
    productionSourceMap: false,
    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'src/service-worker.js',
            swDest: 'service-worker.js',
            importsDirectory: 'workbox-assets',
        },
    },
}