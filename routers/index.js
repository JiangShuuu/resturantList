const express = require('express')
const router = express.Router()

// 引入 middleware
const { authenticator } = require('../middleware/auth') 

// 引入路由模組
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

// 使用模組
router.use('/restaurants', authenticator, restaurants)
router.use('/users', users)
router.use('/', authenticator, home)

// 輸出模組
module.exports = router