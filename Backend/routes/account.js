const express = require('express')
const app = express()
const path = require('path')
var db

function hash(params) {
    return params
}

app.get('/', (i, o) => {
    o.status(501).send('Not implemented')
})

app.get('/all', async (i, o) => {
    let response = await db.models.account.find((error) => {
        if (error) {
            o.status(500).send('Something went wrong.')
            return
        }
    })
    o.send(response)
})

app.get('/login',async(i,o)=>{
    o.status(501).send('Not implemented')
    // render file from front end
})

app.post('/login',async(i,o)=>{
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('email'),
        i.body.hasOwnProperty('password'),
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        o.status(400).send('One or more fields are missing')
        return
    }
    else
    {
        await db.models.account.find({ 'email': i.body.email, 'password': hash(i.body.password) },(err,doc)=>{
            if (err) return handleError(err)
            if (doc.length > 0){
                o.status(200).send({'Login success': true})
                return
            }
        })
    }
    o.status(500).send('Login fail')
})

app.get('/register',async(i,o)=>{
    o.status(501).send('Not implemented')
    // render file from front end
    //o.sendFile(path.join(__dirname, 'signup.html'));
})

app.post('/register',async(i, o) => {
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('email'),
        i.body.hasOwnProperty('phone'),
        i.body.hasOwnProperty('password'),
    ]
    test_fields.forEach(each => {test &= each})
    console.log(i.body)
    if (!test) {
        o.status(400).send('One or more fields are missing')
        return
    }

    else {
        await db.models.account.find({ 'email': i.body.email },(err,doc)=>{
            if (err) return handleError(err)
            if (doc.length > 0){
                o.status(500).send('Account is exsist')
                return
            }
        })
        i.body.password = hash(i.body.password)
        await db.models.account.create(i.body, (error, new_account) => {
            if (error) {
                o.status(500).send({'error': 'Something went wrong'})
                return
            }
        })
    }

    o.status(200).send({'ok': true})
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}
