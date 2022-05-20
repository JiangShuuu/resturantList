const express = require('express')
const router = express.Router()

// 引入路由模組
const home = require('./modules/home')

// 使用模組
router.use('/', home)

module.exports = router