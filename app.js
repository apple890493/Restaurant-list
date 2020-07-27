const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Restaurant = require('./models/info')

let dataError = false
const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'), bodyParser.urlencoded({ extended: true }))

//---GET method---
// 搜尋
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find({ name: { $regex: keyword, $options: "i" } })
    .lean()
    .then(restaurant => {
      if (restaurant.length !== 0)
        res.render('index', { restaurant: restaurant })
      else res.render('no', { keyword: keyword })
    })
    .catch(error => console.log(error))
})

// 全部
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

// 新增
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

// 特定
app.get('/restaurants/:id', (req, res) => {
  const storeId = req.params.id
  return Restaurant.findById(storeId)
    .lean()
    .then((store) => res.render('show', { store }))
    .catch(error => console.log(error))
})

// 編輯
app.get('/restaurants/:id/edit', (req, res) => {
  const storeId = req.params.id
  return Restaurant.findById(storeId)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

//POST method
app.post('/restaurants', (req, res) => {
  const data = req.body
  let image = req.body.image
  if (!image.length) {
    image = 'https://i.imgur.com/kXNxrm9.jpg'
  } else {
    image = image
  }

  const restaurant = new Restaurant({
    name: `${data.name}`,
    name_en: `${data.name_en}`,
    category: `${data.category}`,
    location: `${data.location}`,
    phone: `${data.phone}`,
    google_map: `${data.google_map}`,
    rating: `${data.rating}`,
    description: `${data.description}`,
    image: `${image}`,
  })
  return restaurant.save()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const storeId = req.params.id
  const item = req.body
  Restaurant.findById(storeId)
    .then(restaurant => {
      for (let i in restaurant) {
        if (item[i] && typeof item[i] !== "function") {
          restaurant[i] = item[i]
        }
        restaurant.save()
      }
    })
    .then(() => res.redirect(`/restaurants/${storeId}/edit`), { dataError })
    .catch(error => res.redirect(`/restaurants/${storeId}/edit`))
})

app.post('/restaurants/:id/delete', (req, res) => {
  const storeId = req.params.id
  return Restaurant.findById(storeId)
    .then(data => data.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Listen
app.listen(port, () => {
  console.log(`It's listening on the localhost:${port}`)
})
