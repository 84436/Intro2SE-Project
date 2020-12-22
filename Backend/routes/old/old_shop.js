const express = require("express")
const app = express()
var db

//#region : Database schema


//#endregion

//#region : Database logic

//#endregion

//#region : Route map

//#endregion

app.get("/", async (i, o) => {
    try {
        if (i.body.hasOwnProperty("id") == false) {
            let response = await shopModel.find({}, { _id: 1, name: 1 }, (err) => {
                if (err) throw new Error("Something went in find function");
            })
            return o.status(200).send(response)
        }
        else {
            let doc = await shopModel.findById(i.body.id, (err) => {
                if (err) throw new Error("Something went in find function");
            })
            o.status(200).send(doc)
        }
    }
    catch (e) {
        o.status(500).send({ "error": e.message })
    }
})

app.post("/", async (i, o) => {
    if (i.body.hasOwnProperty("token") == false)
        return o.status(401).send("Missing token")
    try {
        let doc = await db.models.token.findOne({ "token": i.body.token }, (err) => {
            if (err) throw new Error("Something went in find function");
        })
        if (!(doc && Object.keys(doc).length > 0))
            return o.status(404).send({ "error": "Cannot find token" })
        if (doc.accountType != "shop") {
            return o.status(403).send({ "error": "Only account shop can make a shop" })
        }
        let acc = await db.models.account.findOne({ "email": doc.email }, (err) => {
            if (err) throw new Error("Something went in find function");
        })

        if (!(acc && Object.keys(acc).length > 0))
            return o.status(404).send({ "error": "Cannot find email from token" })
        let doc2 = await shopModel.findOne({ "accountEmail": acc.email }, (err) => {
            if (err) throw new Error("Something went in find function");
        })
        if (doc2 && Object.keys(doc2).length > 0)
            return o.status(409).send({ "error": "Email already exists shop." })
        let shop = shopModel(i.body)
        await shop.save()
        o.status(200).send({ "ok": "create shop success" })
    }
    catch (e) {
        o.status(500).send({ "error": e.message })
    }
})

app.put("/", async (i, o) => {
    if (i.body.hasOwnProperty("token") == false)
        return o.status(401).send("Missing token")
    try {
        let doc = await db.models.token.findOne({ "token": i.body.token }, (err) => {
            if (err) throw new Error("Something went in find function");
        })
        if (doc && Object.keys(doc).length > 0) {
            let shop = await shopModel.findOne({ "accountEmail": doc.email }, (err) => {
                if (err) throw new Error("Something went in find function");
            })
            if (!(shop && Object.keys(shop).length > 0)) {
                return o.status(404).send({ "error": "Cannot find email from this token" })
            }
            if (i.body.hasOwnProperty("hours")) {
                shop.hours = i.body.hours
            }
            if (i.body.hasOwnProperty("address"))
                shop.address = i.body.address
            await shopModel.findOneAndUpdate({ "accountEmail": doc.email }, shop, (err, doc2) => {
                if (err) throw new Error("Something went in update function");
            })
            return o.status(200).send({ "ok": "update success" })
        }
        else {
            return o.status(404).send({ "error": "Cannot find token" })
        }
    }
    catch (e) {
        return o.status(500).send({ "error": e.message })
    }
})

app.delete("/", async (i, o) => {
    if (i.body.hasOwnProperty("token") == false)
        return o.status(401).send("Missing token")
    try {
        let doc = await db.models.token.findOne({ "token": i.body.token }, (err) => {
            if (err) throw new Error("Something went in find function");
        })
        if (!(doc && Object.keys(doc).length > 0))
            return o.status(404).send({ "error": "Cannot find token" })
        let acc = await db.models.account.findOne({ "email": doc.email }, (err) => {
            if (err) throw new Error("Something went in find function");
        })
        if (!(acc && Object.keys(acc).length > 0))
            return o.status(404).send({ "error": "Cannot find email from token" })
        let doc2 = await shopModel.findOne({ "accountEmail": doc.email }, (err) => {
            if (err) throw new Error("Something went in find function");
        })
        if (!(doc2 && Object.keys(doc2).length > 0))
            return o.status(409).send({ "error": "Email not create shop" })
        await shopModel.findOneAndRemove({ "accountEmail": doc.email }, (err) => {
            if (err) throw new Error("Something went in find function");
        })
        return o.status(200).send({ "ok": "Delete success" })
    }
    catch (e) {
        return o.status(500).send({ "error": e.message })
    }
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}
