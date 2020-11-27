const express = require('express')
const app = express()
app.use(express.urlencoded())
app.use(express.urlencoded({
  extended: true
}));
var db

function hash(params) {
    return params
}

app.get('/', (i, o) => {
    o.status(501).send('Not implemented')
})

app.get('/:userID', (i, o) => {
    // chua biet noi luu token : email
    /*var userid = req.params.userid;
    var email = ""
    db.models..findOne({ userId: userid}, function(err, docs) {
    if (err)
        res.send(err);
    email = docs.email
    });

    db.models..findOne({"email":email},function(err,docs){
        if (docs.length > 0)
        {
            docs.password = ""
            res.json(docs)
        }
    })*/
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

app.post('/login/:userId',async(i,o)=>{
    // chua biet noi luu token : email
    /*var userID = i.params.userId
    await db.models.find({},(err,doc)=>{
        if (err) return handleError(err)
        if (doc.length > 0){
            o.status(200).send({'Login success': true})
            return
        }
    })*/
})

app.get('/login',async(i,o)=>{
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
    // render file from front end
})

app.post('/register',async(i, o) => {
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('email'),
        i.body.hasOwnProperty('phone'),
        i.body.hasOwnProperty('password'),
    ]
    test_fields.forEach(each => {test &= each})

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
