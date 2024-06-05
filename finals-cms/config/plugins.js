module.exports = () => ({
    'transformer': {
        enabled: true,
        config: {
          prefix: '/api/',
          responseTransforms: {
            removeAttributesKey: true,
            removeDataKey: true,
          }
        }
    },
    upload: {
      config: {
        providerOptions: {
          localServer: {
            maxage: 300000, // Set max-age header for locally uploaded files
          },
        },
      },
    },
});
