const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 定義首頁路由
router.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then( resData => res.render('index', { resData }))
    .catch(err => console.log(err))
});

module.exports = router;