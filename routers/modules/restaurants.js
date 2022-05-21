const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增餐廳
router.post('/', (req, res) => {
  req.body.userId = req.user._id
  // const userId = req.user._id
  // const name = req.body.name
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

// show頁面 指定餐廳詳細資料
router.get("/:id", (req, res) => {
  // const { restaurantId } = req.params
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findById({ _id, userId })
    .lean()
    .then(resInfo => res.render("show", { resInfo }))
    .catch(err => console.log(err))
})

// 編輯餐廳頁面
router.get("/:id/edit", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findById({ _id, userId })
    .lean()
    .then(restaurantData => res.render("edit", { restaurantData }))
    .catch(err => console.log(err))
})

// 更新餐廳
router.put("/:id", (req, res) => {
  req.body.userId = req.user._id
  const _id = req.params.id
  Restaurant.findByIdAndUpdate(_id, req.body)
    //可依照專案發展方向自定編輯後的動作，這邊是導向到瀏覽特定餐廳頁面
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(err => console.log(err))
})

// 刪除餐廳
router.delete("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findByIdAndDelete({ _id, userId })
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

module.exports = router;