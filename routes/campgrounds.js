const express = require('express');
const router = express.Router();
const catchAsync = require('../utilitis/catchAsync');
const ExpressError = require('../utilitis/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js')



const validateCampground = (req,res,next) =>{
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
     const msg = error.details.map(el => el.message).join(',');
     throw new ExpressError(msg, 400);
    }
    else{
       next();
    }
};

router.get('/', catchAsync(async(req,res) =>{
    const campgrounds =  await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}));

router.get('/new', (req,res) =>{
    res.render('campgrounds/new');
});
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    try {
        const campgroundData = { ...req.body };

        // Provide default values for missing fields
        if (!campgroundData.image) {
            campgroundData.image = ''; // Provide a default empty string for the image field
        }
        if (!campgroundData.description) {
            campgroundData.description = ''; // Provide a default empty string for the description field
        }

        const campground = new Campground(campgroundData);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
}));

router.get('/:id', catchAsync(async(req,res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show',{campground});
}));

router.get('/:id/edit', catchAsync(async(req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', {camp})

}));

router.put('/:id', catchAsync(async(req,res) =>{
    const {id} = req.params;
    const { title, price, image, location, description } = req.body;
    const campground = await Campground.findByIdAndUpdate(id, { title, price, image, location, description });
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async(req,res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;