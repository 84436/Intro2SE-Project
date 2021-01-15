const orderModel = require("./orderModel").orderModel
const accountModel = require("../account/accountModel").accountModel
const shopModel = require("../shop/shopModel").shopModel
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
        r._error = "Invalid order ID"
    }

    return r
}

async function checkShopID(id) {
    let r = { _error: null  }

    try {
        let shop = await shopModel.findById(id, (err) => {
            if (err) { r._error = err }
        })
        if (!shop) {
            r._error = "No shop found with given ID"
        }
    }
    catch (referenceExc) {
        r._error = "Invalid shop ID"
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
        r._error = "Invalid account ID"
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
        "_id": new_order.id,
        ...new_order
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

async function remove(id,customerId,type) {
    let r = { _error: null }

    r = {...await checkID(id)}
    if (r._error) return r

    r = await checkAccountID(customerId,type);
    if (r._error) return o.send(r)

    await orderModel.findOne({"_id":id,"customerId":accountId}, (err,order) =>{
        if (err) { r._error = err; return r }
        if (!order) {r._error = "No found order with this accountId";return r}
    })

    await orderModel.findByIdAndRemove(id, (err) => {
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
    let order = await orderModel.findById(id, projection, (err) => {
        if (err) { r._error = err; return r }
    })
        
    r = {...r, ...order._doc}
    return r
}

async function getAllByShop(shopId) {
    let r = { _error: null }
    var orders = await orderModel.find({"shopId":shopId,"status":"pending"},(err)=>{
        if (err) { r._error = err; return r }
    })        
    r = {...r, orders}
    return r
}

async function getAll(accountId,type) {
    let r = { _error: null }
    if (type === "customer")
    {
        var orders = await orderModel.find({"customerId":accountId},(err)=>{
            if (err) { r._error = err; return r }
        })    
        r = {...r, orders}
        return r
    }
    else
    {
        if (type === "shopowner")
        {
            let account = await accountModel.findById(accountId, (err) => {
                if (err) { r._error = err }
            })
            if (!account) {
                r._error = "No account found with given ID"
                return r
            }
            var orders = await orderModel.find({"shopId":account.shopId,"status":"pending"},(err)=>{
                if (err) { r._error = err; return r }
            })        
            r = {...r, orders}
            return r
        }
    }
    r._error = "Only customer,shopOwner can get all order"
    return r
}
/********************************************************************************/
app.get('/', async (i, o) => {
    let r = { _error: null }
    let missing = missingKeys(i.body, [
        "id",
    ])
    if (missing) {
        let missing2 = missingKeys(i.body, [
            "shopId"
        ])
        if (missing2)
        {
            let missing3 = missingKeys(i.body, [
                "accountId",
                "type"
            ])
            if (missing3) {
                o.status(400).send(missing3)
                return
            }
            r = await checkAccountID(i.body.accountId,i.body.type)
            if (r._error) return o.send(r)
            r = await getAll(i.body.accountId,i.body.type)
            if (r._error) { o.status(404) }
            else { o.status(200) }
            o.status(200).send(r)
            return
        }
        r = await getAllByShop(i.body.shopId)
        if (r._error) { o.status(404) }
        else { o.status(200) }
        o.status(200).send(r)
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
        "customerId",
        "type",
        "shopId",
        "items"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }
    if (i.body.type === "shopowner"){
        r._error = "Shop can't create order"
        return o.send(r)
    }
    r = await checkShopID(i.body.shopId)
    if (r._error) return o.send(r)

    r = await checkAccountID(i.body.customerId,i.body.type)
    if (r._error) return o.send(r)

    r = await add(i.body)
    if (r._error) { o.status(500) }
    else { o.status(200) }
    o.send(r)
})

app.post('/status', async (i, o) => {
    let r = { _error: null }
    let missing = missingKeys(i.body, [
        "id",
        "shopId",
        "status"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }
    r = await checkShopID(i.body.shopId)
    if (r._error) return o.send(r)

    r = await getByID(i.body.id)
    if (r._error) { o.status(404) }

    if (r && r.shopId !== i.body.shopId)
        return o.send("Shop not same");

    r = await edit(i.body.id, {status:i.body.status})
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

/*app.delete('/', async (i, o) => {
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
    if (type != "customer")
    {
        r._error = "Only customer can remove order"
        o.send(r)
        return
    }
    r = await remove(i.body.id,i.body.accountId,i.body.type)
    if (r._error) { o.status(404) }
    else { o.status(200) }
    o.send(r)
})*/

module.exports = {
    routes: app
}
