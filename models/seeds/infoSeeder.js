const mongoose = require('mongoose')
const resturantInfo = require('../info')
const resturantData = require('../../resturant.json').results

console.log(resturantData)

mongoose.connect('mongodb://localhost/resturant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  resturantData.forEach(data =>
    resturantInfo.create({
      name: `${data.name}`,
      name_en: `${data.name_en}`,
      category: `${data.category}`,
      image: `${data.image}`,
      location: `${data.location}`,
      phone: `${data.phone}`,
      google_map: `${data.google_map}`,
      rating: `${data.rating}`,
      description: `${data.description}`,
    }))
  console.log('done!')
})

