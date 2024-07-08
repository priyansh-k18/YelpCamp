const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


main().catch(err => console.log('Oh no no damm it!!!'));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
      console.log("Database connected")
}

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()))

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.get('/',(req,res) =>{
    res.send('WELCOME HOME')
});

app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error',{err})
})

app.listen(3000, () =>{
      console.log("Get To Go On Port 3000")
});