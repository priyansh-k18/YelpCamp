const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const campground = require('../models/campground');



main().catch(err => console.log('Oh no no damm it!!!'));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
      console.log("Database connected")
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await campground.deleteMany({});
    for(let i = 0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const c = new campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellendus repellat error consequuntur totam sit perferendis reiciendis alias sapiente cum sunt dicta quo, labore deserunt similique cumque excepturi aliquid nesciunt eos.',
            price
        })
        await c.save();
    }
    
}

seedDB().then(() => {
    mongoose.connection.close();
})