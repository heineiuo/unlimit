var express = require('express')
var router = module.exports = express.Router()


// 获取状态(已安装/未安装)
router.route('/').all(function(req, res, next) {
  res.json({
    isChecked: true,
    isInstalled: true,
    logged: true
  })
})
