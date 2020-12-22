const requestModel = require("./requestModel").requestModel
const { removeAccount, getAccountByID } = require("./account")
const missingKeys = require("../helpers/missingKeys")
const express = require("express")
const app = express()

async function checkAdmin(adminID) {
    let r = { _error: null }

    let account = await getAccountByID(adminID, (err) => {
        if (err) { r._error = err; return r }
    })
    if (account.type !== "admin") {
        r._error = "Account is not admin"
        return r
    }

    return r
}

async function checkID(id) {
    let r = { _error: null  }

    try {
        let request = await requestModel.findById(id, (err) => {
            if (err) { r._error = err; return r }
        })
        if (!request) {
            r._error = "No request found with given ID"
        }
    }
    catch (referenceExc) {
        r._error = "Invalid ID"
    }

    return r
}

async function checkAccount(accountID) {
    let r = { _error: null }

    let filter = {
        "accountID": accountID
    }
    let account = await requestModel.findOne(filter, (err) => {
        if (err) { r._error = err }
    })
    if (account) {
        r._error = "Account has already filed a request."
        return r
    }

    return r
}

async function add(requestBody) {
    let r = { _error: null }

    r = {...await checkAccount(requestBody.accountID)}
    if (r._error) return r

    let new_request_info = {
        "accountID": requestBody.accountID,
        "type": requestBody.type,
        "content": requestBody.content
    }
    let new_request = new requestModel(new_request_info)
    await new_request.save((err) => {
        if (err) { r._error = err; return r }
    })

    r = {
        ...r,
        "id": new_request._id
    }
    return r
}

async function remove(id) {
    let r = { _error: null }

    r = {...await checkID(id)}
    if (r._error) return r

    await requestModel.findByIdAndRemove(id, (err) => {
        if (err) { r._error = err; return r }
    })

    return r
}

async function getAll() {
    let r = { _error: null }

    let projection = {
        __v: 0
    }
    let requests = await requestModel.find({}, projection, (err) => {
        if (err) { r._error = err; return r }
    })

    r = {...r, ...requests}
    return r
}

// TODO
async function handleShopOpen(id) {
    let r = { _error: null }

    let filter = {
        "_id": id,
        "type": "shop_open"
    }
    let request = await requestModel.findOne(filter, (err) => {
        if (err) { r._error = err; return r }
    })

    //

    return r
}

// TODO
async function handleShopClose(id) {
    let r = { _error: null }

    let filter = {
        "_id": id,
        "type": "shop_close"
    }
    let request = await requestModel.findOne(filter, (err) => {
        if (err) { r._error = err; return r }
    })

    //

    return r
}

// TODO
async function handleAccountClose(id) {
    let r = { _error: null }

    let filter = {
        "_id": id,
        "type": "account_close"
    }
    let request = await requestModel.findOne(filter, (err) => {
        if (err) { r._error = err; return r }
    })

    // check if this account has a shop

    console.log(`Account ${request.accountID} ready to be deleted`)
    // removeAccount(request.accountID)

    return r
}

/********************************************************************************/

app.get("/", async (i, o) => {
    let missing = missingKeys(i.body, [
        "adminID"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }

    let r = await checkAdmin(i.body.adminID)
    if (r._error) {
        o.status(403).send(r)
        return
    }
    
    r = {...r, ...await getAll()}
    if (r._error) { o.status(500) }
    else { o.status(200) }
    o.send(r)
})

app.post("/", async(i, o) => {
    let missing = missingKeys(i.body, [
        "accountID",
        "type"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }

    // double check: check if ID is valid and admin
    let r = await checkAdmin(i.body.accountID)
    if (!r._error) { // implies account is admin
        r._error = "Admins are not allowed to file requests"
        o.status(403).send(r)
        return
    }

    r = await add(i.body)
    if (r._error) { o.status(500) }
    else { o.status(200) }
    o.send(r)
})

// TODO
app.put("/", async (i, o) => {
    let missing = missingKeys(i.body, [
        "adminID",
        "requestID",
        "approved"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }

    // is admin?
    let r = await checkAdmin(i.body.adminID)
    if (r._error) {
        o.status(403).send(r)
        return
    }

    // request exists?
    r = await checkID(i.body.requestID)
    if (r._error) {
        o.status(404).send(r)
        return
    }

    // approval malformed?
    if (i.body.approved !== true && i.body.approved !== false) {
        r._error = "Invalid decision (please only mark using BOOLEAN true/false)"
        o.status(400).send(r)
        return
    }
    else if (i.body.approved === true) {
        r._error = "Not implemented"
        o.status(501).send(r)
        return
    }
    else { // implies false
        r = await remove(i.body.requestID)
        if (r._error) { o.status(500) }
        else { o.status(200) }
        o.send(r)
    }
})

module.exports = {
    routes: app
}
