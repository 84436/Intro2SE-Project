const express = require('express')
const app = express()
const crypto = require('crypto')
var db

const ACCOUNT_TYPE_CUSTOMER = 'customer'

function Hash(params) {
    return crypto.createHash('sha256').update(params).digest('hex');;
}

app.get('/', async(i, o) => {
    try{
        if (i.body.hasOwnProperty('token') == false)
        {
            let response = await db.models.account.find({}, {password:0},(err) => {
                if (err) throw new Error('Something went in find function');
            })
            return o.status(200).send(response)
        }
        else
        {
            // lấy thông tin account
            let doc = await db.models.token.findOne({"token":token.token},(err)=>{
                if (err) throw new Error('Something went wrong with find function.');
            })
            if (doc && Object.keys(doc).length > 0)
            {
                await db.models.account.findOne({"email":token.email},(err,acc)=>{
                    if (err) throw new Error('Something went wrong with find function.');
                    if (acc && Object.keys(acc).length > 0)
                        return o.status(200).send(
                            {"name":acc.name,
                            "email":acc.email,
                            "phone":acc.phone,
                            "address":acc.address,
                            "dateRegister":acc.dateRegister,
                            "accountType":doc.accountType});
                    else
                        return o.status(404).send({"error":"Cannot find email from this token"});
                })
            }
            else
                return o.status(404).send({"error":'Cannot find token'});
        }
    }catch(e){
        o.status(500).send({"error":e.message})
    }
})

app.delete('/', async(i, o) => {
    if (i.body.hasOwnProperty('token') == false)
        return o.status(401).send({"error":'Missing token'})
    try{
        let doc = await db.models.token.findOne({"token":i.body.token},(err)=>{
            if (err) throw new Error('Something went in find function.');
        })
        if (doc && Object.keys(doc).length > 0)
        {
            // find and remove
            let acc = await db.models.account.findOne({"email":doc.email},(err)=>{
                if (err) throw new Error('Something went in find function.');
            })
            if (!(acc && Object.keys(acc).length > 0))
                return o.status(404).send({"error":'Cannot find email from token'}) 
            else
            {
                await db.models.account.findOneAndRemove({"email":doc.email},(err)=>{
                    if (err) throw new Error('Something went in find and remove function');
                })
                await db.models.token.findOneAndRemove({"token":i.body.token},(err)=>{
                    if (err) throw new Error('Something went in find and remove function');
                })
                return o.status(200).send({"ok":'Delete success'})
            }
        }
        else
            return o.status(404).send({"error":'Cannot find token'}) 
    }catch(e){
        o.status(500).send({"error":e.message})
    }
})

app.put('/', async(i, o) => {
    if (i.body.hasOwnProperty('token') == false)
        return o.status(401).send({"error":'Missing token'})
    try{
        let doc = await db.models.token.findOne({"token":i.body.token},(err)=>{
            if (err) throw new Error('Something went in find and remove function');
        })
        if (doc && Object.keys(doc).length > 0)
        {
            if (i.body.hasOwnProperty('accountType'))
            {
                await db.models.token.findOneAndUpdate({"token":i.body.token},{"accountType":i.body.accountType},(err)=>{
                    if (err) throw new Error('Something went in update function');
            })}
            let acc = await db.models.account.findOne({"email":doc.email},(err)=>{
                if (err) throw new Error('Something went in find function');
            })
            if (!(acc && Object.keys(acc).length > 0))
            {
                return o.status(404).send({"error":'Cannot find email from this token'}) 
            }
            if (i.body.hasOwnProperty('name'))
                acc.name = i.body.name
            // update token if change email
            if (i.body.hasOwnProperty('email'))
            {
                acc.email = i.body.email
                let doc4 = await db.models.account.findOne({'email': i.body.email}, (err) => {
                    if (err) throw new Error('Something went in find function');
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
                if (err) throw new Error('Something went in update function');
            })
            if (i.body.hasOwnProperty('email'))
            {
                await db.models.token.findOneAndUpdate({"token":i.body.token},{"email":i.body.email,"token":Hash(i.body.email)},(err)=>{
                    if (err) throw new Error('Something went in update function');
                })
                // update email of shop
                let doc3 = await db.models.shop.findOne({"accountEmail":doc.email}, (err) => {
                    if (err) throw new Error('Something went in find function');
                })
                if (doc3 && Object.keys(doc3).length  > 0){
                    await db.models.shop.findOneAndUpdate({"accountEmail":doc.email},{"accountEmail":i.body.email} ,(err) => {
                        if (err) throw new Error('Something went in update function');
                    })
                }
            }
            return o.status(200).send({"ok":'Update success'})
        }
        else
        {
            return o.status(404).send({"error":'Cannot find token'}) 
        }
    }catch(e){
        o.status(500).send({"error":e.message})
    }
})

app.post('/login', async(i, o) => {
    try
    {
        let acc = db.models.account(i.body)
        let error = acc.validateSync();
        if(error)
            throw error
        // Login by email and password
        let account = {
            'email': i.body.email,
            'password': Hash(i.body.password)
        }
        acc = await db.models.account.findOne(account, (err) => { // Verify password, the lazy way
            if (err) throw new Error('Something went in find function');
        })
        if (acc && Object.keys(acc).length > 0) {
            await db.models.token.findOne({'email': i.body.email}, (err, tok) => {
                if (err) throw new Error('Something went in find function');
                o.status(200).send({
                    "name":acc.name,
                    "email":acc.email,
                    "phone":acc.phone,
                    "address":acc.address,
                    "dateRegister":acc.dateRegister,
                    'token': tok.token,
                    'accountType': tok.accountType,
                })
                return
            })
        }
        else {
            o.status(403).send({"error":'Login failed.'})
            return
        }
    }catch(e){
        return o.status(500).send({"error":e.message})
    }
})

app.post('/register', async(i, o) => {
    if (i.body.hasOwnProperty('password'))
    {
        i.body.password = Hash(i.body.password);
    }
    let token;
    let acc;
    try
    {
        // Write to Accounts
        acc = db.models.account(i.body)
        await acc.save()
        token = Hash(i.body.email)
        // Write to Tokens
        let tok = db.models.token({
            'email': i.body.email,
            'token': token,
            'accountType': ACCOUNT_TYPE_CUSTOMER
        })
        await tok.save()
    }catch(e){
        return o.status(500).send({"error":e.message})
    }
    // If everything's OK so far, throw the user that new token
    o.status(200).send({
        "name":acc.name,
        "email":acc.email,
        "phone":acc.phone,
        "address":acc.address,
        "dateRegister":acc.dateRegister,
        'token': token,
        'accountType': ACCOUNT_TYPE_CUSTOMER
    })
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}
