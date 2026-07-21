const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose); //isko humne use isliye kiya hai username, hashing,salting aur hashpassword automatically implement kr deta hai..

module.exports = mongoose.model("User", userSchema);


