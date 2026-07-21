const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema} = require("./schema.js")

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req); // This will log the entire request object to the console.,isme hum notice kenge to ek path hoga..
    // console.log(req.path, "..", req.originalUrl); 
    if( !req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // This will store the original URL the user was trying to access in the session, so we can redirect them back after they log in.    
        req.flash("error", "You need to be logged in to create a new listing!");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next) => {  
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // This will make the redirect URL available in the response locals, so we can use it in our templates.
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id); 
    if( !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//validate listing
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body); 
      if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};
//
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
     if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId); 
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
