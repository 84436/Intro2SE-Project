const express = require('express')
const app = express()
var db

app.get('/', async(i, o) => {
    try{
        if (i.body.hasOwnProperty('_id') == false)
        {
            let response = await db.models.shop.find({},{_id:1,name:1},(err) => {
                if (err) throw new Error('Something went in find function');
            })
            return o.status(200).send(response)
        }
        else
        { 
            let doc = await db.models.shop.find({"_id":shopId},(err) => {
                if (err) throw new Error('Something went in find function');
            })
            o.status(200).send(doc)
        }
    }
    catch(e)
    {
        o.status(500).send({"error":e.message})
    }
})

app.post('/', async(i, o) => {
    if (i.body.hasOwnProperty('token') == false)
        return o.status(401).send('Missing token')    
    try
    {
        let doc = await db.models.token.findOne({"token":i.body.token},(err) => {
            if (err) throw new Error('Something went in find function');
        })
        if (!(doc && Object.keys(doc).length > 0))
            return o.status(404).send({"error":'Cannot find token'})
        if (doc.accountType != "shop")
        {
            return o.status(403).send({"error":'Only account shop can make a shop'})
        }
        let acc = await db.models.account.findOne({"email":doc.email},(err)=>{
            if (err) throw new Error('Something went in find function');
        })
        
        if (!(acc && Object.keys(acc).length > 0))
            return o.status(404).send({"error":'Cannot find email from token'}) 
        let doc2 = await db.models.shop.findOne({"accountEmail":acc.email}, (err) => {
            if (err) throw new Error('Something went in find function');
        })
        if (doc2 && Object.keys(doc2).length > 0)
            return o.status(409).send({"error":'Email already exists shop.'})
        let shop = db.models.shop({
            accountEmail: acc.email,
            name: "",
            address: "",
            averageRate: 0,
            hours: null,
            menu: null,
            coupons: null,
        })
        await shop.save()
        o.status(200).send({"ok":"create shop success"})
    }
    catch(e)
    {
        o.status(500).send({"error":e.message})
    }
})

app.put('/', async(i,o) => {
    if (i.body.hasOwnProperty('token') == false)
        return o.status(401).send('Missing token')  
    try{
        let doc = await db.models.token.findOne({"token":i.body.token},(err)=>{
            if (err) throw new Error('Something went in find function');
        })
        if (doc && Object.keys(doc).length > 0)
        {
            let shop = await db.models.shop.findOne({"accountEmail":doc.email},(err)=>{
                if (err) throw new Error('Something went in find function');  
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
                if (err) throw new Error('Something went in update function');
            })
            return o.status(200).send({"ok":"update success"})
        }
        else
        {
            return o.status(404).send({"error":'Cannot find token'}) 
        }
    }
    catch(e)
    {
        return o.status(500).send({"error":e.message}) 
    }
})

app.delete('/', async(i,o) => {
    if (i.body.hasOwnProperty('token') == false)
        return o.status(401).send('Missing token')  
    try
    {
        let doc = await db.models.token.findOne({"token":i.body.token},(err) => {
            if (err) throw new Error('Something went in find function');  
        })
        if (!(doc && Object.keys(doc).length > 0))
            return o.status(404).send({"error":'Cannot find token'})
        let acc = await db.models.account.findOne({"email":doc.email},(err)=>{
            if (err) throw new Error('Something went in find function');
        })   
        if (!(acc && Object.keys(acc).length > 0))
            return o.status(404).send({"error":'Cannot find email from token'})  
        let doc2 = await db.models.shop.findOne({"accountEmail":doc.email},(err)=>{
            if (err) throw new Error('Something went in find function');
        })
        if (!(doc2 && Object.keys(doc2).length > 0))
            return o.status(409).send({"error":'Email not create shop'})
        await db.models.shop.findOneAndRemove({"accountEmail":doc.email},(err)=>{
            if (err) throw new Error('Something went in find function');
        })
        return o.status(200).send({"ok":"Delete success"})
    }
    catch(e)
    {
        return o.status(500).send({"error":e.message})
    }
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}
