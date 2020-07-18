const express = require('express')
const exphbs = require('express-handlebars')
const resturantList = require('./restaurant.json')
const app = express()
const port = 3000

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
  res.render('index', { resturant: resturantList.results })
})

app.get('/restaurants/:id', (req, res) => {
  const storeId = req.params.id
  const storeContent = resturantList.results.find(store => store.id === Number(storeId))

  res.render('show', { store: storeContent })
})

app.listen(port, () => {
  console.log(`It's work on the localhost:${port}`)
})