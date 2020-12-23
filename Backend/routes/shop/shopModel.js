const mongoose = require("mongoose")

var shopSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        default: null,
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
        default: null
    },
    coupons: {
        type: Object,
        default: null
    },
})

var shopModel = mongoose.model("shop", shopSchema, "shops")

module.exports = {
    shopSchema: shopSchema,
    shopModel: shopModel
}
