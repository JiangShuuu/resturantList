const express = require("express");
const session = require('express-session')
const { engine } = require("express-handlebars");
const port = 3000;
const app = express();
const methodOverride = require("method-override")
const routes = require('./routers')
const usePassport = require('./config/passport')
require('./config/mongoose')

app.engine(
  "handlebars",
  engine({ extname: ".handlebars", defaultLayout: "main" })
);
app.set("view engine", "handlebars");

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static("public"));
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))


usePassport(app)

app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
