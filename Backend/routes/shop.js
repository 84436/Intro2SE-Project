const express = require('express')
const app = express()
var db

async function ID() {
    var _sym = '1234567890';
    var str = 'SHOP-';
    while(true)
    {
        str = 'SHOP-';
        for(var i = 0; i < 8; i++) {
            str += _sym[parseInt(Math.random() * (_sym.length))];
        }
        let doc = await db.models.shop.findOne({"ID":str}, (err) => {
            if (err)
                return "error"
        })
        if (!(doc && Object.keys(doc).length > 0))
        {
            break
        }
    }
    return str
}
app.get('/', async(i, o) => {
    o.status(501).send({"error":'Not implemented'})
})

app.get('/all', async (i, o) => {
    let response = await db.models.shop.find((error) => {
        if (error) {
            o.status(500).send({"error":'Something went wrong.'})
            return
        }
    })
    o.send(response)
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
        let doc = await db.models.token.findOne({"token":i.body.token},(error) => {
        if (error) {
            o.status(500).send({"error":'Something went wrong.'})
            return
        }
        })
        if (!(doc && Object.keys(doc).length > 0))
            return o.status(404).send({"error":'Cannot find token'})
        if (doc.accountType != "shop")
        {
            return o.status(403).send({"error":'Only account shop can make a shop'})
        }
        let acc = await db.models.account.findOne({"email":doc.email},(err)=>{
            if (err) return o.status(500).send({"error":'Something went wrong.'})
        })
        
        if (!(acc && Object.keys(acc).length > 0))
            return o.status(404).send({"error":'Cannot find email from token'}) 
        let doc2 = await db.models.shop.findOne({"accountEmail":acc.email}, (err) => {
            if (err) return o.status(500).send({"error":'Something went wrong.'})
        })
        if (doc2 && Object.keys(doc2).length > 0)
            return o.status(409).send({"error":'Email already exists shop.'})
        var ID_ = await ID()
        if (ID_.toString() == 'error')
            return o.status(500).send({"error":'Something went wrong.'})
        let shop = db.models.shop({
            ID: ID_,
            accountEmail: acc.email,
            name: "",
            address: "",
            averageRate: 0,
            hours: null,
            menu: null,
            coupons: null,
        })
        await shop.save((err) => {
            if (err)
            {
                o.status(500).send({"error":'Something went wrong.'})
                return
            }
        })
        o.status(200).send({"ok":"create shop success"})
    }
})

app.put('/', async(i,o) => {
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('token'),
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        return o.status(401).send('One or more fields are missing')
    }
    else{
        let doc = await db.models.token.findOne({"token":i.body.token},(err)=>{
            if (err) return o.status(500).send({"error":'Something went wrong.'})
        })
        if (doc && Object.keys(doc).length > 0)
        {
            let shop = await db.models.shop.findOne({"accountEmail":doc.email},(err)=>{
                if (err)
                    return o.status(500).send('Something went wrong.')
                
            })
            if (!(shop && Object.keys(shop).length > 0))
            {
                return o.status(404).send({"error":'Cannot find email from this token'}) 
            }
            if (i.body.hasOwnProperty("hoursopen") && i.body.hasOwnProperty("hoursend"))
            {
                shop.hours = {
                    "open":i.body.hoursopen,
                    "end":i.body.hoursend
                }
            }
            if (i.body.hasOwnProperty("address"))
                shop.address = i.body.address
            if (i.body.hasOwnProperty("averageRate"))
                shop.averageRate = i.body.averageRate
            await db.models.shop.findOneAndUpdate({"accountEmail":doc.email},shop,(err,doc2)=>{
                if (err)
                    return o.status(500).send('Something went wrong.')
            })
            return o.status(200).send({"ok":"update success"})
        }
        else
        {
            return o.status(404).send({"error":'Cannot find token'}) 
        }
    }
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
        let doc = await db.models.token.findOne({"token":i.body.token},(err) => {
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
        let doc2 = await db.models.shop.findOne({"accountEmail":doc.email},(err)=>{
            if (err) return o.status(500).send({"error":'Something went wrong.'})
        })
        if (!(doc2 && Object.keys(doc2).length > 0))
            return o.status(409).send({"error":'Email not create shop'})
        await db.models.shop.findOneAndRemove({"accountEmail":doc.email},(err)=>{
            if (err) return o.status(500).send({"error":'Something went wrong.'})
        })
        return o.status(200).send({"ok":"Delete success"})
    }
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}
