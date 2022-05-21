const express = require("express");
const session = require('express-session')
const { engine } = require("express-handlebars");
const port = 3000;
const app = express();
const methodOverride = require("method-override")
const routes = require('./routers')
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



app.use(routes)

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
