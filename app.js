const express = require("express");
const { engine } = require("express-handlebars");
const port = 3000;
const app = express();
// const restaurantList = require("./restaurant.json");
const Restaurant = require ('./models/restaurant')
const methodOverride = require("method-override")

const routes = require('./routers')

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



app.use(routes)

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
