const express = require('express')
const app = express()
var db

function ID() {
    var _sym = '1234567890',
    while (true)
    {
        var str = 'SHOP-';

        for(var i = 0; i < 8; i++) {
            str += _sym[parseInt(Math.random() * (_sym.length))];
        }
        db.models.shops.findOne({"ID":str}, (err,doc) => {
            if (err)
                return "Error"
            if (!(doc && Object.keys(doc).length > 0))
                return str
        })
    }
}
app.get('/', async(i, o) => {
    o.status(501).send({"error":'Not implemented'})
})

app.post('/', async(i, o) => {
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('token'),
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        return o.status(401).send({"error":'One or more fields are missing'})
    }
    else
    {
        let doc = db.models.token.findOne({"token":i.body.token}, (err) => {
            if (err)
                return o.status(500).send({"error":'Something went wrong.'})  
        })
        if (!(doc && Object.keys(doc).length > 0))
            return o.status(404).send({"error":'Cannot find token'})
        let acc = await db.models.account.findOne({"email":doc.email},(err)=>{
                if (err) return o.status(500).send({"error":'Something went wrong.'})
        })
        if (!(acc && Object.keys(acc).length > 0))
            return o.status(404).send({"error":'Cannot find email from token'}) 
        db.models.shop.findOne({"accountEmail":acc.email}, (err,doc2) => {
            if (doc2 && Object.keys(doc2).length > 0)
                return o.status(409).send({"error":'Email already exists shop.'})
        })
        var ID_ = ID()
        if (ID_.toString() == 'error')
            return o.status(500).send({"error":'Something went wrong.'})
        let shop = db.models.shop({
            ID: ID_,
            accountEmail: acc.email,
            name: "",
            address: "",
            averageRate: 0,
            hours: {},
            menu: {},
            coupons: {},
        })
        let doc3 = await shop.save((err) => {
            if (err)
            {
                o.status(500).send({"error":'Something went wrong.'})
                return
            }
        })
        o.status(200).send(doc3)
    }
})

app.put('/', async(i,o) => {
    o.status(501).send({"error":'Not implemented'})
})

app.delete('/', async(i,o) => {
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('token'),
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        return o.status(401).send({"error":'One or more fields are missing'})
    }
    else
    {
        let doc = db.models.token.findOne({"token":i.body.token}, (err) => {
            if (err)
                return o.status(500).send({"error":'Something went wrong.'})  
        })
        if (!(doc && Object.keys(doc).length > 0))
            return o.status(404).send({"error":'Cannot find token'})
        let acc = await db.models.account.findOne({"email":doc.email},(err)=>{
                if (err) return o.status(500).send('Something went wrong.')
        })
        if (!(acc && Object.keys(acc).length > 0))
            return o.status(404).send({"error":'Cannot find email from token'}) 
        db.models.shop.findOne({"accountEmail":acc.email}, (err,doc2) => {
            if (!(doc2 && Object.keys(doc2).length > 0))
                return o.status(409).send({"error":'Email not create shop'})
        })
        await db.models.token.findOneAndRemove({"accountEmail":acc.email},(err)=>{
            if (err) return o.status(500).send({"error":'Something went wrong.'})
        })
        o.status(200).send({"ok":"Delete success"})
    }
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}
