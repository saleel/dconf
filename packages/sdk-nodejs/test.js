const dconf = require('./dist/index');

console.log(dconf)

dconf('facebook', 'production', { setProcessEnv: true }).getConfigValues();

setTimeout(() => {
  console.log(process.env.MAX_TOP_ITEMS);
}, 3000);
