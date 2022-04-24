const express = require("express");
const { engine } = require("express-handlebars");
const port = 3000;
const app = express();
// const restaurantList = require("./restaurant.json");
const Restaurant = require ('./models/restaurant')

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

  // const restaurantSearch = restaurantList.results.filter((restau) => {
  //   return (
  //     restau.category.toLowerCase().includes(keyword.toLowerCase()) ||
  //     restau.name.toLowerCase().includes(keyword.toLowerCase())
  //   );
  // });
  // res.render("index", { restaurants: restaurantSearch });
});

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
