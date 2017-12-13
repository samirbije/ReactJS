function buildConfig(env) {
    console.log(env);
    return require('./webpack_config/' + env + '.config.js')({ env: env })
}


module.exports = buildConfig;