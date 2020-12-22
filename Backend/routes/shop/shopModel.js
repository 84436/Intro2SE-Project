const mongoose = require("mongoose")

var shopSchema = new mongoose.Schema({
    accountEmail: {
        type: String,
        unique: [true, "One account have one shop"]
    },
    name:
    {
        type: String,
        unique: [true, "Name of shop is unique"]
    },
    address: {
        type: String,
        default: "",
    },
    averageRate: {
        type: Number,
        default: 0
    },
    hours: {
        type: Object,
        default: {
            "open": Number(0),
            "close": Number(0),
        },
    },
    menu: {
        type: Object,
        default: {}
    },
    coupons: {
        type: Object,
        default: {}
    },
})

var shopModel = mongoose.model("shop", shopSchema, "shops")

module.exports = {
    shopSchema: shopSchema,
    shopModel: shopModel
}
