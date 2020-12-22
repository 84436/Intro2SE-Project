import { response } from "express"
import express from "express"
const app = express()
var db

app.get("/", async (i, o) => {
    if (i.body.hasOwnProperty("token") == false)
        return o.status(401).send({ "error": "Missing token" })
    try {
        let doc = await db.models.token.findOne({ "token": i.body.token }, (err) => {
            if (err) throw new Error("Something went in find function");
        })
        if (doc && Object.keys(doc).length > 0) {
            let acc = await db.models.account.findOne({ "email": doc.email }, (err) => {
                if (err) throw new Error("Something went in find function.");
            })
            if (!(acc && Object.keys(acc).length > 0))
                return o.status(404).send({ "error": "Cannot find email from token" })
            if (doc.accountType == "customer") {
                if (i.body.hasOwnProperty("_id") == true) {
                    let response = await db.models.order.findOne({ "_id": i.body._id, "customerID": acc._id }, (err) => {
                        if (err) throw new Error("Something went in find function");
                    })
                    if (response && Object.keys(response).length > 0)
                        o.status(200).send(response)
                    else
                        o.status(200).send({ "error": "Not found this id" })
                }
                else {
                    let response = await db.models.order.find({ "customerID": acc._id }, { _id: 1, shopId: 1, customerId: 1, dateTime: 1, status: 1 }, (err) => {
                        if (err) throw new Error("Something went in find function");
                    })
                    if (response && Object.keys(response).length > 0)
                        o.status(200).send(response)
                    else
                        o.status(200).send([])
                }
            }
            else {
                if (i.body.hasOwnProperty("_id") == true) {
                    let response = await db.models.order.findOne({ "_id": i.body._id, "shopID": acc._id }, (err) => {
                        if (err) throw new Error("Something went in find function");
                    })
                    if (response && Object.keys(response).length > 0)
                        o.status(200).send(response)
                    else
                        o.status(200).send({ "error": "Not found this id" })
                }
                else {
                    let response = await db.models.order.find({ "shopID": acc._id, "status": db.enums.dbEnum.orderEnum.ORDER_PENDING }, { _id: 1, shopId: 1, customerId: 1, dateTime: 1 }, (err) => {
                        if (err) throw new Error("Something went in find function");
                    })
                    if (response && Object.keys(response).length > 0)
                        o.status(200).send(response)
                    else
                        o.status(200).send([])
                }
            }
        }
    } catch (e) {
        o.status(500).send({ "error": e.message })
    }
})

app.post("/", async (i, o) => {
    try {
        let order = db.models.order(i.body)
        order.status = db.enums.dbEnum.orderEnum[order.status] // Convert to enum
        await order.save()
    } catch (e) {
        return o.status(500).send({ "error": e.message })
    }
    return o.status(200).send({ "ok": "Create success" })
})

app.put("/", async (i, o) => {
    try {
        if (i.body.hasOwnProperty("_id") && i.body.hasOwnProperty("status") && i.body.hasOwnProperty("token")) {
            let doc = await db.models.token.findOne({ "token": i.body.token }, (err) => {
                if (err) throw new Error("Something went in find function");
            })
            if (doc && Object.keys(doc).length > 0) {
                let acc = await db.models.account.findOne({ "email": doc.email }, (err) => {
                    if (err) throw new Error("Something went in find function.");
                })
                if (!(acc && Object.keys(acc).length > 0))
                    return o.status(404).send({ "error": "Cannot find email from token" })
                var statusString = i.body.status
                if (doc.accountType == "customer") {
                    let order = await db.models.order.findOne({ "_id": i.body._id, "customerID": acc._id }, (err) => {
                        if (err) throw new Error("Something went in find function");
                    })
                    if (order && Object.keys(order).length > 0) {
                        if (order.status == db.enums.dbEnum.orderEnum.ORDER_PENDING && db.enums.dbEnum.orderEnum[statusString] == db.enums.dbEnum.orderEnum.ORDER_DRAFT) {
                            return o.status(409).send({ "error": "Order pending can not become draft" })
                        }
                        if (i.body.hasOwnProperty("dateTime")) {
                            order.dateTime = i.body.dateTime
                        }
                        if (i.body.hasOwnProperty("coupons")) {
                            order.coupons = i.body.coupons
                        }
                        if (i.body.hasOwnProperty("items")) {
                            order.items = i.body.items
                        }
                        if (i.body.hasOwnProperty("fees")) {
                            order.fees = i.body.fees
                        }
                        if (i.body.hasOwnProperty("review")) {
                            order.review = i.body.review
                        }
                        await db.models.order.findOneAndUpdate({ "_id": i.body._id, "customerID": acc._id }, order, (err) => {
                            if (err) throw new Error("Something went in find function");
                        })
                        return o.status(200).send({ "ok": "Update success" })
                    }
                }
                else {
                    let response = await db.models.order.find({ "_id": i.body._id, "shopID": acc._id }, (err) => {
                        if (err) throw new Error("Something went in find function");
                    })
                    if (response && Object.keys(response).length > 0) {
                        if (db.enums.dbEnum.orderEnum[statusString] != db.enums.dbEnum.orderEnum.ORDER_CANCELLED
                            && db.enums.dbEnum.orderEnum[statusString] != db.enums.dbEnum.orderEnum.ORDER_ACCEPTED
                            && db.enums.dbEnum.orderEnum[statusString] != db.enums.dbEnum.orderEnum.ORDER_DONE) {
                            return o.status(409).send({ "error": "Undefined this order status of shop owner" })
                        }
                        else {
                            await db.models.order.findOneAndUpdate({ "_id": i.body._id, "shopID": acc._id }, { "status": db.enums.dbEnum.orderEnum[statusString] }, (err) => {
                                if (err) throw new Error("Something went in find function");
                            })
                            return o.status(200).send({ "ok": "Update success" })
                        }
                    }
                }
            }
            else {
                return o.status(401).send({ "error": "Missing _id or status or token" })
            }
        }
    } catch (e) {
        o.status(500).send({ "error": e.message })
    }
})

export function setDBObject(dbObject) { db = dbObject }
export const routes = app
