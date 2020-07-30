const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methOverride = require('method-override')


const routes = require('./routes')
require('./config/mongoose')
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'), bodyParser.urlencoded({ extended: true }))
app.use(methOverride('_method'))
app.use(routes) //連結到routes/index.js

//Listen
app.listen(port, () => {
  console.log(`It's listening on the localhost:${port}`)
})
