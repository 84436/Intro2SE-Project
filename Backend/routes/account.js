const express = require('express')
const app = express()
var db

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

app.post('/', (i, o) => {
    let test = true
    let test_fields = [
        i.body.hasOwnProperty('name'),
        i.body.hasOwnProperty('email'),
        i.body.hasOwnProperty('address'),
        i.body.hasOwnProperty('phone')
    ]
    test_fields.forEach(each => {test &= each})

    if (!test) {
        o.status(400).send('One or more fields are missing')
        return
    }

    else {
        db.models.account.create(i.body, (error, new_account) => {
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
