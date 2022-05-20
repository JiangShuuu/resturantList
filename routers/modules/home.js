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

router.get("/search", (req, res) => {
  // console.log("req.query", req.query);
  if (!req.query.keywords) {
    res.redirect("/")
  }

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()
  
  Restaurant.find({})
    .lean()
    .then(resData => {
      const filterResData = resData.filter(
        data => data.name.toLowerCase().includes(keyword) || data.category.includes(keyword)
      )
      res.render("index", {resData: filterResData, keywords})
    })
});;

module.exports = router;