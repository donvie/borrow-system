module.exports = () => ({
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          service: 'gmail',
          auth: {
            user: '12heridonvitagaban@gmail.com',
            pass: 'gmuvfpxajstvfnch',
          }
        },
        settings: {
          defaultFrom: 'heridonvi_tagaban12@yahoo.com',
          defaultReplyTo: 'heridonvi_tagaban12@yahoo.com',
        },
      },
    },
    // email: {
    //   provider: 'nodemailer',
    //   providerOptions: {
    //     host: 'smtp.gmail.com',
    //     port: 587,
    //     auth: {
    //       user: '12heridonvitagaban@gmail.com', // Replace with your SMTP username
    //       pass: 'cfxm awar iazt lpxb', // Replace with your SMTP password
    //     },
    //     // Optional, see https://nodemailer.com/smtp/
    //     secure: false,
    //     tls: {
    //       rejectUnauthorized: false,
    //     },
    //   },
    //   settings: {
    //     defaultFrom: 'noreply@example.com', // Replace with your default sender address
    //     defaultReplyTo: 'noreply@example.com', // Replace with your default reply-to address
    //   },
    // },
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
