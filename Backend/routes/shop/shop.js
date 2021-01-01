const shopModel = require("./shopModel").shopModel
const accountModel = require("../account/accountModel").accountModel
const missingKeys = require("../helpers/missingKeys")
const express = require("express")
const app = express()

async function checkID(id) {
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
        r._error = "Invalid ID"
    }

    return r
}

async function checkShopOwnerID(ShopOwnerId,create) {
    let r = { _error: null  }
    try {
        let projection = {
            __v: 0
        }
        let account = await accountModel.findById(ShopOwnerId, projection, (err) => {
            if (err) { r._error = err; return r }
        })
        if (!account) {
            r._error = "No account found with given ID"
            return r
        }
        if (account.ShopID != null && create){
            r._error = "One account have one shop"
        }
        if (account.type != "shopowner" && create){
            r._error = "Only shop owner have shop"
        }
    }
    catch (referenceExc) {
        r._error = "Invalid ID"
    }

    return r
}

async function getByID(id) {
    let r = { _error: null }

    r = {...await checkID(id)}
    if (r._error) return r

    let projection = {
        __v: 0
    }
    let shop = await shopModel.findById(id, projection, (err) => {
        if (err) { r._error = err; return r }
    })
        
    r = {...r, ...shop._doc}
    return r
}

async function add(info) {
    let r = { _error: null }
    let new_shop = new shopModel(info)

    await new_shop.save((err) => {
        if (err) { r._error = err; return r }
    })
    
    await accountModel.findByIdAndUpdate(info.shopOwnerId, {"shopId":new_shop.id}, (err) => {
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
        "name": new_info.name,
        "address": new_info.address,
        "averageRate": new_info.averageRate,
        "hours": new_info.hours,
        "menu": new_info.menu,
        "coupons": new_info.coupons,
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

    await shopModel.findByIdAndUpdate(id, updated_fields, (err) => {
        if (err) { r._error = err; return r }
    })

    return r
}

async function remove(id,shopOwnerId) {
    let r = { _error: null }

    r = {...await checkID(id)}
    if (r._error) return r

    let projection = {
        __v: 0
    }
    let account = await accountModel.findById(ShopOwnerId, projection, (err) => {
        if (err) { r._error = err; return r }
    })
    if (!account) {
        r._error = "No account found with given ID"
        return r
    }
    if (account.shopId != id)
    {
        r._error = "Shop from shopOwnerID not same shop id"
        return r
    }

    await accountModel.findByIdAndUpdate(shopOwnerId, {"shopId":null}, (err) => {
        if (err) { r._error = err; return r }
    })

    await shopModel.findByIdAndRemove(id, (err) => {
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
        "shopOwnerId"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }
    r = await checkShopOwnerID(i.body.shopOwnerId,true)
    if (r._error) return o.send(r)

    r = await add(i.body)
    if (r._error) { o.status(500) }
    else { o.status(200) }
    o.send(r)
})

app.put('/', async (i, o) => {
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

    let r = await edit(id, new_info)
    if (r._error) { o.status(404) }
    else { o.status(200) }
    o.send(r)
})

app.delete('/', async (i, o) => {
    let r = { _error: null }
    let missing = missingKeys(i.body, [
        "id",
        "shopOwnerId"
    ])
    if (missing) {
        o.status(400).send(missing)
        return
    }
    r = await checkShopOwnerID(i.body.shopOwnerId,false)
    if (r._error) return o.send(r)

    r = await remove(i.body.id,i.body.shopOwnerId)
    if (r._error) { o.status(404) }
    else { o.status(200) }
    o.send(r)
})
module.exports = {
    routes: app
}
