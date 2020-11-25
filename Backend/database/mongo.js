const mongoose = require('mongoose')

// create connection
const dbURI = "mongodb+srv://admin:admin@intransit-main.zcyqf.mongodb.net/main?retryWrites=true&w=majority";
const dbOptions = {
    'useNewUrlParser': true,
    'useUnifiedTopology': true // suppress deprecation warning
}
mongoose.connect(dbURI, dbOptions)
var dbConnection = mongoose.connection
dbConnection.on('error', console.error.bind(console, 'Connection error:'));

// define schemas
dbSchemas = {
    account: new mongoose.Schema({
        email: String,
        name: String,
        address: String,
        phone: String
    }),
    order: new mongoose.Schema({
        id: String,
        price: Number
    }),
    shop: new mongoose.Schema({
        id: String,
        address: String,
        hourOpen: Number,
        hourClose: Number
    })
}

// compile schemas into models
// models = {}
// Object.entries(schemas).forEach((e) => {
//     [eName, eSchema] = e
//     models[eName] = mongoose.model(eName, eSchema)
// })

dbModels = {
    // {model name, schema, collection}
    account: mongoose.model("account", dbSchemas.account, "accounts"),
    order: mongoose.model("order", dbSchemas.order, "orders"),
    shop: mongoose.model("shop", dbSchemas.shop, "shops"),
}

module.exports = {
    mongooseObject : mongoose,
    connection     : dbConnection,
    models         : dbModels
}
