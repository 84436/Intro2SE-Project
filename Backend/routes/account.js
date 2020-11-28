const express = require('express')
const app = express()
const mongoose = require('mongoose')
const crypto = require('crypto')
app.use(express.json())
const accountModel = mongoose.model("account")
const tokenModel = mongoose.model("token")
var db

function Hash(params) {
    return crypto.createHash('sha256').update(params).digest('hex');;
}

app.get('/', async(i, o) => { // OK
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('token'),
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        o.status(401).send('One or more fields are missing')
        return
    }
    let doc = await db.models.token.findOne({"token":i.body.token},(err)=>{
        if (err) return o.status(500).send('Something went wrong.')
    })
    if (doc && Object.keys(doc).length > 0)
    {
        await db.models.account.findOne({"email":doc.email},(err,res)=>{
            if (res && Object.keys(res).length > 0)
                return o.status(200).send({"email":res.email,"address":res.address,"name":res.name,"phone":res.phone,"accountType":doc.accountType})
            else
                return o.status(404).send("Can not find email from this token")
        })
    }
    else
        return o.status(404).send('Can not find token') 
})

app.delete('/',async(i,o)=>{
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('token')
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        o.status(401).send('One or more fields are missing')
        return
    }
    else{
        let doc = await db.models.token.findOne({"token":i.body.token},(err)=>{
            if (err) return o.status(500).send('Something went wrong.')
        })
        if (doc && Object.keys(doc).length > 0)
        {
            let acc = await db.models.account.findOne({"email":doc.email},(err)=>{
                if (err) return o.status(500).send('Something went wrong.')
            })
            if (!(acc && Object.keys(acc).length > 0))
                return o.status(404).send('Can not find email from token') 
            else
            {
                await db.models.account.findOneAndRemove({"email":doc.email},(err)=>{
                    if (err) return o.status(500).send('Something went wrong.')
                })
                await db.models.token.findOneAndRemove({"token":i.body.token},(err)=>{
                    if (err) return o.status(500).send('Something went wrong.')
                })
                return o.status(200).send('Delete success')
            }
        }
        else
            return o.status(404).send('Can not find token') 
    }
})

app.put('/', async(i, o)=>{// OK
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
            if (err) return o.status(500).send('Something went wrong.')
        })
        if (doc && Object.keys(doc).length > 0)
        {
            if (i.body.hasOwnProperty('accountType'))
            {
                await db.models.token.findOneAndUpdate({"token":i.body.token},{"accountType":i.body.accountType},(err)=>{
                    if (err) return o.status(500).send('Something went wrong.')
            })}
            let acc = await db.models.account.findOne({"email":doc.email},(err,doc2)=>{
                if (err)
                    return o.status(500).send('Something went wrong.')
                if (!doc2)
                {
                    return o.status(404).send('Can not find email from this token') 
                }
            })
            if (i.body.hasOwnProperty('name'))
                acc.name = i.body.name
            if (i.body.hasOwnProperty('email'))
                acc.email = i.body.email
            if (i.body.hasOwnProperty('address'))
                acc.address = i.body.address
            if (i.body.hasOwnProperty('password'))
                acc.password = Hash(i.body.password)
            if (i.body.hasOwnProperty('phone'))
                acc.phone = i.body.phone
            await db.models.account.findOneAndUpdate({"email":doc.email},acc,(err)=>{
                if (err)
                    return o.status(500).send('Something went wrong.')
            })
            if (i.body.hasOwnProperty('email'))
            {
                await db.models.token.findOneAndUpdate({"token":i.body.token},{"email":i.body.email,"token":Hash(i.body.email)},(err)=>{
                    if (err) return o.status(500).send('Something went wrong.')})
            }
            return o.status(200).send('Update success')
        }
        else
        {
            return o.status(404).send('Can not find token') 
        }
    }
})

app.get('/all', async (i, o) => { // OK
    let response = await db.models.account.find((error) => {
        if (error) {
            o.status(500).send('Something went wrong.')
            return
        }
    })
    o.send(response)
})

app.post('/login',async(i,o)=>{ // OK
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('email'),
        i.body.hasOwnProperty('password'),
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        o.status(401).send('One or more fields are missing')
        return
    }
    else
    {
        if (i.body.hasOwnProperty('token')) // login by token
        {
            await db.models.token.findOne({ 'email': i.body.email},(err,tok)=>{
                if (err) return o.status(500).send('Something went wrong.')
                if (tok && Object.keys(tok).length  > 0)
                    return o.status(200).send({"token":tok.token})
                else
                    return o.status(404).send('Login fail')
            })
        }
        // login by email and password
        let doc=await db.models.account.findOne({ 'email': i.body.email, 'password': Hash(i.body.password) },(err)=>{
            if (err) return o.status(500).send('Something went wrong.')
        })
        if (doc && Object.keys(doc).length  > 0){
            await db.models.token.findOne({ 'email': i.body.email},(err,tok)=>{
                if (err) return o.status(500).send('Something went wrong.')
                if (tok && Object.keys(tok).length  > 0)
                    return o.status(200).send({"token":tok.token})
                else
                    return o.status(404).send('Login fail')
            })
        }
        else
            return o.status(404).send('Login fail')
    }
})

app.post('/register',async(i, o) => {// OK
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('email'),
        i.body.hasOwnProperty('phone'),
        i.body.hasOwnProperty('password'),
    ]
    test_fields.forEach(each => {test &= each})
    let token = ""
    if (!test) {
        o.status(400).send('One or more fields are missing')
        return
    }
    else {
        await db.models.account.findOne({ 'email': i.body.email },(err,doc)=>{
            if (err) return handleError(err)
            if (doc && Object.keys(doc).length  > 0){
                o.status(404).send('Account is exsist')
                return
            }
        })
        i.body.password = Hash(i.body.password)
        var acc = new accountModel();
        acc.email = i.body.email
        acc.phone = i.body.phone
        acc.password = i.body.password
        acc.address = null
        acc.name = null
        await acc.save((err,doc)=>{
            if (err)
            {
                o.status(500).send('Something went wrong.')
                return
            }
        })
        token = Hash(i.body.email)
        var tok = new tokenModel()
        tok.email = i.body.email
        tok.token = token
        tok.accountType = "Customer"
        await tok.save((err,doc)=>{
            if (err)
            {
                o.status(500).send('Something went wrong.')
                return
            }
        })
    }
    o.status(200).send({'token': token})
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}
