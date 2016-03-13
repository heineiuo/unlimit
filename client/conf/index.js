var conf = module.exports = {
  hrefPrefix: '',
  routeScope: '',
  development: false
}

if (typeof window != 'undefined') {
  window.conf = conf
}