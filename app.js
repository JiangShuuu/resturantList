const express = require("express");
const { engine } = require("express-handlebars");
const port = 3000;
const app = express();
// const restaurantList = require("./restaurant.json");
const Restaurant = require ('./models/restaurant')
const methodOverride = require("method-override")

require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine(
  "handlebars",
  engine({ extname: ".handlebars", defaultLayout: "main" })
);
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))

// index頁面 餐廳data
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then( resData => res.render('index', { resData }))
    .catch(err => console.log(err))
});

// show頁面 餐廳詳細資料
app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(resInfo => res.render("show", { resInfo }))
    .catch(err => console.log(err))
});



//search功能
app.get("/search", (req, res) => {
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
});

// 新增餐廳
app.post("/restaurants", (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 編輯餐廳頁面
app.get("/restaurants/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render("edit", { restaurantData }))
    .catch(err => console.log(err))
})

// 更新餐廳
app.put("/restaurants/:restaurantId", (req, res) => {
  console.log(1)
  const { restaurantId } = req.params
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    //可依照專案發展方向自定編輯後的動作，這邊是導向到瀏覽特定餐廳頁面
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch(err => console.log(err))
})

// 刪除餐廳
app.delete("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
