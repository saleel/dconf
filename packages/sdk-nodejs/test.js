const dconf = require('.');

dconf('chainlook', 'production', { setProcessEnv: true, encryptionKey: '!QAZ2wsx' }).getConfigValues()
  .then(console.log)
  .then(() => {
    console.log(process.env.MAX_TOP_ITEMS);
  });
