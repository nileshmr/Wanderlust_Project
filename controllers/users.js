const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {  //req.login is a passport method that logs in the user after registration.
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        // res.redirect(req.session.redirectUrl); // isse hum user ko uske original page pe redirect karenge jahan se wo login page pe aaya tha.
        let redirectUrl = res.locals.redirectUrl || "/listings"; // agar hmare res.locals ke andar redirectUrl exits krta hai tb to use save krwa do is variable ke andar, nhi to hum aphe /listings pe redirect krna chahte hain.
        res.redirect(redirectUrl); //saveRedirectUrl middleware se humne redirectUrl ko res.locals me store kiya tha, to hum usse yahan access karenge.
};

module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
           return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};