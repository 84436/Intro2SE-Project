const mongoose = require("mongoose")

var requestSchema = new mongoose.Schema({
    accountID: {
        type: String
    },
    type: {
        type: String,
        enum: ["shop_open", "shop_close", "account_close"]
    },
    content: {
        type: Object,
        default: null
    }
})

var requestModel = mongoose.model("request", requestSchema, "requests")

module.exports = {
    requestSchema: requestSchema,
    requestModel: requestModel
}
