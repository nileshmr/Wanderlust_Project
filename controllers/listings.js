const Listing = require("../models/listing");
const USER_AGENT = "wanderlust-app/1.0";


module.exports.index = async (req, res) => {
    const AllListings = await Listing.find({});
    res.render("listings/index.ejs", { AllListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate: {path:"author",},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    console.log(listing); 
    res.render("listings/show.ejs", { listing });
};

module.exports.CreateListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing); 

 //for map ,niche jo likha hai ...
    const address = `${newListing.location}, ${newListing.country}`;

   const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
    {
        headers: {
            "User-Agent": USER_AGENT,
        },
    }
);

const data = await response.json();

if (data.length === 0) {
    req.flash("error", "Invalid Location!");
    return res.redirect("/listings/new");
}

newListing.geometry = {
    type: "Point",
    coordinates: [
        parseFloat(data[0].lon),
        parseFloat(data[0].lat),
    ],
};
//yahatk

    newListing.owner = req.user._id // yaha pe listing ke owner ko set kar rhe hai, jisme currently logged in user ka id hai. newListing.owner = req.user._id is used to set the owner of the new listing to the currently logged-in user's ID. This ensures that each listing is associated with the user who created it.
    newListing.image = {url, filename}; // yaha pe listing ke image ko set kar rhe hai, jisme currently uploaded image ka url and filename hai. newListing.image = {url, filename} is used to set the image of the new listing to an object containing the URL and filename of the uploaded image. This allows the application to store and reference the image associated with the listing.
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm =  async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for Edit does not exist!");
       return res.redirect("/listings");
    }

    let originalImageUrl =listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl});
};

module.exports.updateListing =  async (req, res) => {
    let { id } = req.params;
    // const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {new: true});
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing, });   // ... is used to spread the properties of req.body.listing into the update object.  deconstruct.
    // res.redirect("/listings");
    
    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename}; // yaha pe listing ke image ko set kar rhe hai, jisme currently uploaded image ka url and filename hai. listing.image = {url, filename} is used to update the image of the existing listing to an object containing the URL and filename of the newly uploaded image. This allows the application to update and reference the new image associated with the listing.
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing =  async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};