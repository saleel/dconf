const dconf = require('.');

dconf('example', 'production', { setProcessEnv: true }).getConfigValues()
  .then(console.log)
  .then(() => {
    console.log(process.env.ANALYTICS_ID);
  });
