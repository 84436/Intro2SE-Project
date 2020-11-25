const express = require('express')
const app = express()

const account = require('./account')
const order = require('./order')
const shop = require('./shop')

var db

app.get('/', (i, o) => {
    o.send('Hi. This is InTransit API for... stuff.')
})

app.use('/account', account.routes)
app.use('/order', order.routes)
app.use('/shop', shop.routes)

module.exports = {
    setDBObject: (dbObject) => {
        db = dbObject
        account.setDBObject(db) // propagate changes to subroutes
        order.setDBObject(db)
        shop.setDBObject(db)
    },
    routes: app
}
