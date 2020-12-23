const accountModel = require("./accountModel").accountModel
const sha256 = require("../helpers/sha256Hash")
const missingKeys = require("../helpers/missingKeys")
const express = require("express")
const app = express()

async function checkID(id) {
    let r = { _error: null  }

    try {
        let account = await accountModel.findById(id, (err) => {
            if (err) { r._error = err }
        })
        if (!account) {
            r._error = "No account found with given ID"
        }
    }
    catch (referenceExc) {
        r._error = "Invalid ID"
    }

    return r
}

async function checkEmail(email) {
    let r = { _error: null }

    let filter = {
        "email": email
    }
    let account = await accountModel.findOne(filter, (err) => {
        if (err) { r._error = err }
    })
    if (account) {
        r._error = "An account already exists with the given email"
    }
    if (account.type != "shopowner")
        r._error = "Only shopOwner can create and edit shop"

    return r
}

async function add(info, type) {
    let r = { _error: null }

    r = {...await checkEmail(info.email)}
    if (r._error) return r

    let new_account_info = {
        "email": info.email,
        "phone": info.phone,
        "password": info.password,
        "name": info.name,
        "address": info.address,
        "avatar": info.avatar,
        "type": type
    }
    let new_account = new accountModel(new_account_info)
    await new_account.save((err) => {
        if (err) { r._error = err; return r }
    })

    // WORKAROUND: GET INFO FROM THAT NEWLY CREATED ACCOUNT
    delete(new_account_info.password)
    new_account_info.joinDate = new_account._doc.joinDate
    r = {
        ...r,
        "_id": new_account.id,
        ...new_account_info
    }
    return r
}

async function remove(id) {
    let r = { _error: null }

    r = {...await checkID(id)}
    if (r._error) return r

    await accountModel.findByIdAndRemove(id, (err) => {
        if (err) { r._error = err; return r }
    })

    return r
}

async function edit(id, new_info) {
    let r = { _error: null }

    r = {...await checkID(id)}
    if (r._error) return r

    r = {...await checkEmail(new_info.email)}
    if (r._error) return r

    let updated_fields = {
        "email": new_info.email,
        "phone": new_info.phone,
        "password": new_info.password,
        "name": new_info.name,
        "address": new_info.address,
        "avatar": new_info.avatar,
    }

    // remove undefined fields
    // https://stackoverflow.com/a/38340374
    Object.keys(updated_fields).forEach(key => {
        (updated_fields[key] === undefined) && (delete updated_fields[key])
    })

    // if everything"s undefined, silently return
    if (Object.keys(updated_fields).length === 0) {
        return r
    }

    await accountModel.findByIdAndUpdate(id, updated_fields, (err) => {
        if (err) { r._error = err; return r }
    })

    return r
}

async function getByID(id) {
    let r = { _error: null }

    r = {...await checkID(id)}
    if (r._error) return r

    let projection = {
        __v: 0
    }
    let account = await accountModel.findById(id, projection, (err) => {
        if (err) { r._error = err; return r }
    })
        
    r = {...r, ...account._doc}
    return r
}

async function getByLogin(email, password) {
    let r = { _error: null }

    let filter = {
        "email": email,
        "password": password
    }
    let projection = {
        __v: 0
    }
    let account = await accountModel.findOne(filter, projection, (err) => {
        if (err) { r._error = err; return r }
    })
    if (!account) {
        r._error = "No account found with given email and password"
        return r
    }

    r = {...r, ...account._doc}
    return r
}

/********************************************************************************/

app.get("/", async (i, o) => {
    let missing = missingKeys(i.body, [
        "id"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }

    let r = await getByID(i.body.id)
    if (r._error) { o.status(404) }
    else { o.status(200) }
    o.send(r)
})

app.delete("/", async (i, o) => {
    let missing = missingKeys(i.body, [
        "id"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }

    let r = await remove(i.body.id)
    if (r._error) { o.status(404) }
    else { o.status(200) }
    o.send(r)
})

app.put("/", async (i, o) => {
    let missing = missingKeys(i.body, [
        "id"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }

    // split i body to id and info
    let id = i.body.id
    let new_info = i.body
    delete(new_info.id)
    if (new_info.password !== undefined) {
        new_info.password = sha256(new_info.password)
    }

    let r = await edit(id, new_info)
    if (r._error) { o.status(404) }
    else { o.status(200) }
    o.send(r)
})

app.post("/login", async (i, o) => {
    let missing = missingKeys(i.body, [
        "email",
        "password"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }

    i.body.password = sha256(i.body.password)

    let r = await getByLogin(i.body.email, i.body.password)
    if (r._error) { o.status(404) }
    else { o.status(200) }
    o.send(r)
})

app.post("/register", async (i, o) => {
    let missing = missingKeys(i.body, [
        "email",
        "name",
        "password",
        "phone",
        "address"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }

    i.body.password = sha256(i.body.password)

    let r = await add(i.body, "customer")
    if (r._error) { o.status(500) }
    else { o.status(200) }
    o.send(r)
})

module.exports = {
    removeAccount: remove,
    getAccountByID: getByID,
    routes: app
}
