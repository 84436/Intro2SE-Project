const orderModel = require("./orderModel").orderModel
const missingKeys = require("../helpers/missingKeys")
const express = require("express")
const app = express()

async function checkID(id) {
    let r = { _error: null  }

    try {
        let order = await orderModel.findById(id, (err) => {
            if (err) { r._error = err }
        })
        if (!order) {
            r._error = "No order found with given ID"
        }
    }
    catch (referenceExc) {
        r._error = "Invalid ID"
    }

    return r
}

async function checkAccountID(id,type) {
    let r = { _error: null  }

    try {
        let account = await accountModel.findById(id, (err) => {
            if (err) { r._error = err }
        })
        if (!account) {
            r._error = "No account found with given ID"
        }
        if (account.type != type){
            r._error = "Account type not same"
        }
    }
    catch (referenceExc) {
        r._error = "Invalid ID"
    }

    return r
}

async function add(info) {
    let r = { _error: null }
    let new_order = new orderModel(info)

    await new_order.save((err) => {
        if (err) { r._error = err; return r }
    })
    
    r = {
        ...r,
        "_id": new_shop.id,
        ...new_shop
    }
    return r
}

async function edit(id, new_info) {
    let r = { _error: null }

    r = {...await checkID(id)}
    if (r._error) return r

    let updated_fields = {
        "customerId": new_info.customerId,
        "shopId": new_info.shopId,
        "items": new_info.items,
        "coupons": new_info.coupons,
        "fees": new_info.fees,
        "dateTime": new_info.dateTime,
        "review": new_info.review,
        "status": new_info.status,
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

    await orderModel.findByIdAndUpdate(id, updated_fields, (err) => {
        if (err) { r._error = err; return r }
    })

    return r
}

async function remove(id,accountId,type) {
    let r = { _error: null }

    r = {...await checkID(id)}
    if (r._error) return r

    r = await checkAccountID(accountId,type);
    if (r._error) return o.send(r)

    await orderModel.findOne({"_id":id,"accountID":accountId}, (err,order) =>{
        if (err) { r._error = err; return r }
        if (!order) {r._error = "No found order with this accountID";return r}
    })

    await orderModel.findByIdAndRemove(id, (err) => {
        if (err) { r._error = err; return r }
    })

    return r
}
/********************************************************************************/
app.get('/', async (i, o) => {
    let r = { _error: null }
    let missing = missingKeys(i.body, [
        "id"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }
    r = await getByID(i.body.id)
    if (r._error) { o.status(404) }
    else { o.status(200) }
    o.status(200).send(r)
    return
})

app.post('/', async (i, o) => {
    let r = { _error: null }
    let missing = missingKeys(i.body, [
        "accountId",
        "type"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }
    if (type === "shop"){
        r._error = "Shop can't create order"
        return o.send(r)
    }

    r = await checkAccountID(i.body.accountId,i.body.type)
    if (r._error) return o.send(r)

    r = await add(i.body)
    if (r._error) { o.status(500) }
    else { o.status(200) }
    o.send(r)
})

app.put('/', async (i, o) => {
    let missing = missingKeys(i.body, [
        "id",
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }

    // split i body to id and info
    let id = i.body.id
    let new_info = i.body
    delete(new_info.id)

    let r = await edit(id, new_info)
    if (r._error) { o.status(404) }
    else { o.status(200) }
    o.send(r)
})

app.delete('/', async (i, o) => {
    let r = { _error: null }
    let missing = missingKeys(i.body, [
        "id",
        "accountId",
        "type"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }

    r = await remove(i.body.id,i.body.accountId,i.body.type)
    if (r._error) { o.status(404) }
    else { o.status(200) }
    o.send(r)
})

module.exports = {
    routes: app
}
