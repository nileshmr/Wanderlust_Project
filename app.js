if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require("node:console");


// const MongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

async function main() {
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public"))); // to serve static files from the public directory

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60, // time period in seconds
});

store.on("error",(err) => {
    console.log("Error in MOngo Session Store",err);
});

const sessionOptions = {
    store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()  + 7 * 24 * 60 * 60 * 1000,
        maxAge: + 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.use(session(sessionOptions)); 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //serializeUser() ganerates a function that is used t serialize user into the session. It is used to store user information in the session after successful authentication.
passport.deserializeUser(User.deserializeUser()); //deserializeUser() generates a function that is used to deserialize user from the session. It is used to retrieve user information from the session and attach it to the request object for subsequent requests.


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    // console.log(res.locals.success); 
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "demo-user"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld"); //register() is a method provided by passport-local-mongoose to register a new user with a hashed password. It takes the user object and the password as arguments and saves the user to the database. aur ye automaticaly check rk lega ki ye use name uniqe hai ya nhi phale se exoits krta hai kinhi, isme hme if else wala condition nhi likhn apdta hai.
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter); // Use the listings router for all routes starting with /listings
app.use("/listings/:id/reviews", reviewRouter); // Use the reviews router for all routes starting with /listings/:id/reviews
app.use("/", userRouter); // Use the user router for all routes starting with /

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="something went wrong!"} = err;
    // res.status(statusCode).send(message);
    // res.render("error.ejs",{err});
    res.status(statusCode).render("error.ejs",{ message });
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
}); 
