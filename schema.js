const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0), // negative value nhi honi chahiye prince ko isliye min(0).
        image: Joi.string().allow("", null), //jo hmari image hai empty bhi hoskti hai, aur chahe to null value bhi dek skte hain.
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // rating 1 se 5 ke beech honi chahiye.
        comment: Joi.string().required()
    }).required()
    
});