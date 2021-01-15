const mongoose = require("mongoose")

var orderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        require: [true, "Customer ID is required"],
    },
    shopId: {
        type: String,
        require: [true, "Shop ID is required"],
    },
    items: {
        type: Object,
        default: {
            "nullItem":0
        },
    },
    coupons: {
        type: Object,
        default: {
            "nullItem":0
        },
    },
    fees: {
        type: Object,
        default: {
            "nullItem":0
        },
    },
    dateTime: {
        type: Date,
        default: Date.now,
    },
    review: {
        type:Object,
        default: {
            "rate": 0,
            "comment": "",
        },
    },
    status: {
        type: String,
        require: [true, "Status is required"],
        enum: ["pending", "cancelled", "accepted", "rejected", "delivered"],
        default: "pending"
    },
})

var orderModel = mongoose.model("order", orderSchema, "orders");

module.exports = {
    orderSchema: orderSchema,
    orderModel: orderModel
}
