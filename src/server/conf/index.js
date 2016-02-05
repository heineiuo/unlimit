
var conf = module.exports = {
  /**
   * 日志输出格式
   */
  morgan: {
    format: ':method :status :req[host] :url',
    options: {}
  },
  /**
   * 是否已经检查
   */
  isChecked: false,
  /**
   * 是否安装
   */
  isInstalled: false,
  //isInstalled: true

  //proxy: {
  //  "api.heineiuo.com": "http://127.0.0.1:8888",
  //  "api.youkuohao.com": "http://127.0.0.1:8888",
  //  "static1.heineiuo.com": "http://127.0.0.1:8001"
  //},
  //
  //block_host: [],

  errorData: {
    ERR_EXCEPTION: {
      error: "ERR_EXCEPTION",
      'zh-CN': '未知错误'
    }
  },

  hostnames: ['es8.youkuohao.com', 'cdn.youkuohao.com']
}
