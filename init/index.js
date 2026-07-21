const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data =initData.data.map((obj) => ({ ...obj, owner: "6a5b9f42df06d9c54d021347" })); //initData ek object hai jisme data property hai jisme listing data stored hai. aur yaha kya horha hai ki har ek listing ke liye owner property set kar rhe hai jisme user ka id hai.
  await Listing.insertMany(initData.data);  //initData ek object hai jisme data property hai jisme listing data stored hai.   
  console.log("data was initialized");
};

initDB();