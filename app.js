const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const resturantList = require('./resturant.json')
const resturantInfo = require('./models/info')
const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/resturant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const storeName = resturantList.results.filter(store => store.name.toLowerCase().includes(keyword.toLowerCase()))

  if (storeName.length !== 0) {
    res.render('index', { resturant: storeName, keyword: keyword })
  } else {
    res.render('no', { keyword: keyword })
  }
})

app.get('/', (req, res) => {
  resturantInfo.find()
    .lean()
    .then(resturant => res.render('index', { resturant: resturant }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const storeId = req.params.id
  const storeContent = resturantList.results.find(store => store.id === Number(storeId))

  res.render('show', { store: storeContent })
})

app.listen(port, () => {
  console.log(`It's listening on the localhost:${port}`)
})
