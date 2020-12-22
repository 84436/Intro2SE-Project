const Mongoose = require("mongoose")

const dbURI = "mongodb+srv://admin:admin@intransit-main.zcyqf.mongodb.net/main?retryWrites=true&w=majority";
const dbOptions = {
    // https://mongoosejs.com/docs/deprecations.html
    "useNewUrlParser": true,
    "useFindAndModify": false,
    "useCreateIndex": true,
    "useUnifiedTopology": true,
}
Mongoose.connect(dbURI, dbOptions)
Mongoose.connection.on("error", console.error.bind(console, "Connection error:"));

// expose this connection globally
global.mongoose = Mongoose

module.exports = Mongoose
