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
        customerId: {
            type:String,
            require:[true,"customerID is require"],
        },
        shopId: {
            type:String,
            require:[true,"shopID is require"],
        },
        items: {
            type:Object,
            default: {},
        },
        coupons: {
            type:Object,
            default: {},
        },
        fees: {
            type:Object,
            default: {},
        },
        dateTime: {
            type:Date,
            default: Date.now,
        },
        review: {
            rate:{
                type:Number,
                min: 0,
                max: 5,
            },
            comment:String,
            default:{
                "rate":0,
                "comment":"",
            },
        },
        status:{
            type:Number,
            require:[true,"status is require"],
        },
    }),
    shop: new mongoose.Schema({
        accountEmail: {
            type:String,
            unique: [true,"One account have one shop"]
        },
        name: 
        { 
            type:String,
            unique: [true,"Name of shop is unique"]
        },
        address: { 
            type:String,
            default: "",
        },
        averageRate: {
            type:Number,
            default: 0
        },
        hours: {
            type:Object,
            default:{
                "open": 00,
                "close": 00,
            },
        },
        menu: {
            type:Object,
            default:{}
        },
        coupons: {
            type:Object,
            default:{}
        },
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
    token: mongoose.model("token", dbSchemas.token, "tokens"),
}

dbEnum = {
    orderEnum: {"ORDER_PENDING":1, "ORDER_CANCELLED":2, "ORDER_ACCEPTED":3, "ORDER_REJECTED":4,"ORDER_DONE":5,"ORDER_DRAFT":6},
    requestEnum: {"SHOP_OPEN":1,"SHOP_CLOSE":2,"ACCOUNT_DELETE":3}
}

module.exports = {
    mongooseObject : mongoose,
    connection     : dbConnection,
    models         : dbModels,
    enums           : dbEnum
}
