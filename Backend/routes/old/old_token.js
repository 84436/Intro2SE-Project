const mongoose = require("mongoose")
const accountModel = require("./account").accountModel

//#region : Database schema

var tokenSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    token: {
        type: String,
        require: true,
        unique: true
    },
    accountType: {
        type: String,
    }
})

var tokenModel = mongoose.model("token", tokenSchema, "tokens")

//#endregion

//#region : Database logic

function accountGetLegacy(token) {
    let this_err = undefined

    // Token to email
    let tokenFilter = { token: token }
    let tokenFind = tokenModel.find(tokenFilter, (err) => { this_err = err })
    if (!tokenFind || this_err) {
        return null;
    }
    
    // Email to account
    let accountFilter = { email: tokenFind.email }
    let accountFind = accountModel.find(accountFilter, (err) => { this_err = err })
    if (this_err) {
        return null;
    }
    return accountFind;
}

//#endregion

module.exports = {
    tokenSchema: tokenSchema,
    tokenModel: tokenModel,
    accountGetLegacy: accountGetLegacy
}
