const express = require("express")
const app = express()

const account = require("./account/account")
const request = require("./account/request")
const shop = require("./shop/shop")
const order = require("./order/order")
const invalidRoutes = require("./helpers/invalidRoutes")

const greetingMessage = {
    "_error": null,
    "_greeting": "Hi. This is the InTransit API."
}
app.get("/", (i, o) => {
    o.send(greetingMessage)
})

app.use("/account", account.routes)
app.use("/request", request.routes)
app.use("/shop", shop.routes)
app.use("/order", order.routes)
app.use(invalidRoutes)

module.exports = {
    routes: app
}
