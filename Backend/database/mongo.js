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
        email: {
            type:String,
            required: [true,"email is require"],
            unique: [true,"email is unique"]
        },
        phone: {
            type:String,
            required:[true,"phone is require"],
        },
        password: {
            type:String,
            required:[true,"password is require"],
        },
        name: {
            type:String,
            require:[true,"name is require"],
        },
        address: {
            type:String,
            require:[true,"address is require"],
        }
    }),
    order: new mongoose.Schema({
        id: String,
        price: Number
    }),
    shop: new mongoose.Schema({
        accountEmail: String,
        name: 
        { 
            type:String,
            unique: [true,"Name of shop is unique"]
        },
        address: String,
        averageRate: Number,
        hours: Object,
        menu: Object,
        coupons: Object,
    }),
    token: new mongoose.Schema({
        email: {
            type:String,
        },
        token: {
            type:String,
            require: true,
            unique: true
        }, 
        accountType: {
            type:String,
        }
    })
}

// models = {}
// Object.entries(schemas).forEach((e) => {
//     [eName, eSchema] = e
//     models[eName] = mongoose.model(eName, eSchema)
// })

// compile schemas into models
dbModels = {
    // {model name, schema, collection}
    account: mongoose.model("account", dbSchemas.account, "accounts"),
    order: mongoose.model("order", dbSchemas.order, "orders"),
    shop: mongoose.model("shop", dbSchemas.shop, "shops"),
    token: mongoose.model("token", dbSchemas.token, "tokens")
}

module.exports = {
    mongooseObject : mongoose,
    connection     : dbConnection,
    models         : dbModels
}
