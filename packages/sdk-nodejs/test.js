const dconf = require('./');

dconf('example', 'production', { setProcessEnv: true, host: 'http://127.0.0.1:8000', encryptionKey: '!QAZ2wsx' }).getConfigValues().then(console.log);

setTimeout(() => {
  console.log(process.env.ANALYTICS_ID);
}, 3000);
