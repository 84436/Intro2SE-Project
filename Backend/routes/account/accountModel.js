const mongoose = require("mongoose")

var accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        default: null,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        default: null,
        select: false // hide this field when finding accounts
    },
    name: {
        type: String,
        require: [true, "Name is required"],
        default: null,
    },
    address: {
        type: String,
        require: [true, "Address is required"],
        default: null,
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    avatar: {
        type: String,
        default: null
    },
    type: {
        type: String,
        enum: ["customer", "shopowner", "admin"],
        default: "customer"
    },
    shopId:{
        type: String,
        unique: [true,"Shop ID is unique"],
        default: null,
    }
})

var accountModel = mongoose.model("account", accountSchema, "accounts")

module.exports = {
    accountSchema: accountSchema,
    accountModel: accountModel
}
