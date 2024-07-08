const joi = require('joi');
const { join } = require('./seeds/cities');

module.exports.campgroundSchema = joi.object({
    title: joi.string().required(),
    price: joi.number().required().min(0),
    image: joi.string().uri().allow('').optional(),
    location: joi.string().required(),
    description: joi.string().required().allow('').optional() // Allow empty string or make it optional
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required()
    }).required()
})
