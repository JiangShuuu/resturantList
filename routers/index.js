const express = require('express')
const router = express.Router()

// 引入路由模組
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

// 使用模組
router.use('/', home)
router.use('/restaurants', restaurants)
router.use('/users', users)

// 輸出模組
module.exports = router