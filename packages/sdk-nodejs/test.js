const dconf = require('./dist/index');

dconf('example', 'production', { setProcessEnv: true, host: 'http://127.0.0.1:8000' }).getConfigValues();

setTimeout(() => {
  console.log(process.env.ANALYTICS_ID);
}, 3000);
