module.exports = {
  apps : [{
    name        : "gateway",
    script      : __dirname + "/dist/gateway.js",
    watch       : false,
    env: {
      "NODE_ENV": "production",
    },
  }]
}
