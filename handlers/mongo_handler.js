const mongoose = require("mongoose")
const client = require("../client/discordBot.js");

const mongoDBURL = client.config.mongoDB_url;

module.exports = () => {

    if (!mongoDBURL) return

    mongoose.connect(mongoDBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB Database!"))
    .catch(err => console.log(err))
};