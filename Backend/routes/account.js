const express = require('express')
const app = express()
const crypto = require('crypto')
var db

const ACCOUNT_TYPE_CUSTOMER = 'customer'

function Hash(params) {
    return crypto.createHash('sha256').update(params).digest('hex');;
}

app.get('/', async(i, o) => {
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('token'),
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        o.status(401).send({"error":'One or more fields are missing'})
        return
    }
    // lấy thông tin account
    let doc = await db.models.token.findOne({"token":i.body.token},(err)=>{
        if (err) return o.status(500).send({"error":'Something went wrong.'})
    })
    if (doc && Object.keys(doc).length > 0)
    {
        await db.models.account.findOne({"email":doc.email},(err,res)=>{
            if (res && Object.keys(res).length > 0)
                return o.status(200).send({"email":res.email,"address":res.address,"name":res.name,"phone":res.phone,"accountType":doc.accountType})
            else
                return o.status(404).send({"error":"Cannot find email from this token"})
        })
    }
    else
        return o.status(404).send({"error":'Cannot find token'}) 
})

app.delete('/', async(i, o) => {
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('token')
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        o.status(401).send({"error":'One or more fields are missing'})
        return
    }
    else{
        let doc = await db.models.token.findOne({"token":i.body.token},(err)=>{
            if (err) return o.status(500).send({"error":'Something went wrong.'})
        })
        if (doc && Object.keys(doc).length > 0)
        {
            // find and remove
            let acc = await db.models.account.findOne({"email":doc.email},(err)=>{
                if (err) return o.status(500).send({"error":'Something went wrong.'})
            })
            if (!(acc && Object.keys(acc).length > 0))
                return o.status(404).send({"error":'Cannot find email from token'}) 
            else
            {
                await db.models.account.findOneAndRemove({"email":doc.email},(err)=>{
                    if (err) return o.status(500).send({"error":'Something went wrong.'})
                })
                await db.models.token.findOneAndRemove({"token":i.body.token},(err)=>{
                    if (err) return o.status(500).send({"error":'Something went wrong.'})
                })
                return o.status(200).send({"ok":'Delete success'})
            }
        }
        else
            return o.status(404).send({"error":'Cannot find token'}) 
    }
})

app.put('/', async(i, o) => {
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
            if (i.body.hasOwnProperty('accountType'))
            {
                await db.models.token.findOneAndUpdate({"token":i.body.token},{"accountType":i.body.accountType},(err)=>{
                    if (err) return o.status(500).send('Something went wrong.')
            })}
            let acc = await db.models.account.findOne({"email":doc.email},(err)=>{
                if (err)
                    return o.status(500).send('Something went wrong.')
            })
            if (!(acc && Object.keys(acc).length > 0))
            {
                return o.status(404).send({"error":'Cannot find email from this token'}) 
            }
            // update email of shop
            let doc3 = await db.models.shop.findOne({"accountEmail":doc.email}, (err) => {
                if (err)
                        return o.status(500).send({"error":'Something went wrong.'})
            })
            if (doc3 && Object.keys(doc3).length  > 0){
                await db.models.shop.findOneAndUpdate({"accountEmail":doc.email} ,(err) => {
                    if (err)
                        return o.status(500).send({"error":'Something went wrong.'})
                })
            }
            if (i.body.hasOwnProperty('name'))
                acc.name = i.body.name
            // update token if change email
            if (i.body.hasOwnProperty('email'))
            {
                acc.email = i.body.email
                let doc4 = await db.models.account.findOne({'email': i.body.email}, (err) => {
                    if (err)
                        return o.status(500).send({"error":'Something went wrong.'})
                })
                if (doc4 && Object.keys(doc4).length  > 0){
                    o.status(409).send({"error":'Email update is already exists.'})
                    return
                }
            }
            if (i.body.hasOwnProperty('address'))
                acc.address = i.body.address
            if (i.body.hasOwnProperty('password'))
                acc.password = Hash(i.body.password)
            if (i.body.hasOwnProperty('phone'))
                acc.phone = i.body.phone
            // update
            await db.models.account.findOneAndUpdate({"email":doc.email},acc,(err)=>{
                if (err)
                    return o.status(500).send({"error":'Something went wrong.'})
            })
            if (i.body.hasOwnProperty('email'))
            {
                await db.models.token.findOneAndUpdate({"token":i.body.token},{"email":i.body.email,"token":Hash(i.body.email)},(err)=>{
                    if (err) return o.status(500).send({"error":'Something went wrong.'})})
            }
            return o.status(200).send({"ok":'Update success'})
        }
        else
        {
            return o.status(404).send({"error":'Cannot find token'}) 
        }
    }
})

app.get('/all', async (i, o) => {
    let response = await db.models.account.find((error) => {
        if (error) {
            o.status(500).send({"error":'Something went wrong.'})
            return
        }
    })
    o.send(response)
})

app.post('/login', async(i, o) => {
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('email'),
        i.body.hasOwnProperty('password'),
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        o.status(401).send({"error":'One or more fields are missing'})
        return
    }

    else
    {
        // Login by email and password
        let account = {
            'email': i.body.email,
            'password': Hash(i.body.password)
        }
        let doc = await db.models.account.findOne(account, (err) => { // Verify password, the lazy way
            if (err) {
                return o.status(500).send({"error":'Something went wrong.'})
            }
        })
        if (doc && Object.keys(doc).length > 0) {
            await db.models.token.findOne({'email': i.body.email}, (err, tok) => {
                if (err) {
                    return o.status(500).send({"error":'Something went wrong.'})
                }
                o.status(200).send({
                    'token': tok.token,
                    'accountType': tok.accountType
                })
                return
            })
        }
        else {
            o.status(403).send({"error":'Login failed.'})
            return
        }
    }
})

app.post('/register', async(i, o) => {
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('phone'),
        i.body.hasOwnProperty('email'),
        i.body.hasOwnProperty('password'),
        i.body.hasOwnProperty('name'),
        i.body.hasOwnProperty('address')
    ]
    test_fields.forEach(each => {test &= each})
    
    let token

    if (!test) {
        o.status(400).send({"error":'One or more fields are missing'})
        return
    }

    else {
        // Check if account already exists
        let doc = await db.models.account.findOne({'email': i.body.email}, (err) => {
            if (err)
                return o.status(500).send({"error":'Something went wrong.'})
        })
        if (doc && Object.keys(doc).length  > 0){
            o.status(409).send({"error":'Account already exists.'})
            return
        }
        // Make the email and password a bit more obscure
        token = Hash(i.body.email)
        i.body.password = Hash(i.body.password)

        // Write to Accounts
        let acc = db.models.account({
            'email': i.body.email,
            'phone': i.body.phone,
            'password': i.body.password,
            'name': i.body.name,
            'address': i.body.address,
        })
        await acc.save((err) => {
            if (err)
            {
                o.status(500).send({"error":'Something went wrong.'})
                return
            }
        })

        // Write to Tokens
        let tok = db.models.token({
            'email': i.body.email,
            'token': token,
            'accountType': ACCOUNT_TYPE_CUSTOMER
        })
        await tok.save((err) => {
            if (err)
            {
                o.status(500).send({"error":'Something went wrong.'})
                return
            }
        })
        o.status(200).send({"ok":'Register success'})
    }

    // If everything's OK so far, throw the user that new token
    o.status(200).send({
        'token': token,
        'accountType': ACCOUNT_TYPE_CUSTOMER
    })
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}
