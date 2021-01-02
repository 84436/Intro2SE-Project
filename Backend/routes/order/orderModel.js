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
        default: {},
    },
    coupons: {
        type: Object,
        default: {},
    },
    fees: {
        type: Object,
        default: {},
    },
    dateTime: {
        type: Date,
        default: Date.now,
    },
    review: {
        rate: {
            type: Number,
            min: 0,
            max: 5,
        },
        comment: String,
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
