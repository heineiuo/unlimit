module.exports = {
  apps: [{
    name: "@unlimit/http",
    script: __dirname + "/index.js",
    watch: false,
    cwd: __dirname,
    env: {
      "NODE_ENV": "production",
    },
  }]
}
