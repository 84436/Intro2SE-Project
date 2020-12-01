// imports, external
const express = require('express')
const cors    = require('cors')
const morgan  = require('morgan')
const db      = require('./database/mongo')
const router  = require('./routes/router')
const invalid = require('./routes/invalid')

// Express
const app = express()
const port = 4687 // INTS

// input data type
// change to urlencoded{extended=true} to parse x-www-form-urlencoded
app.use(express.json())

// enable CORS for ALL requests
// https://stackoverflow.com/a/47317506
app.use(cors())

// Morgan: logging
morgan_instance = morgan(':method :url :status :res[content-length] - :response-time ms')
app.use(morgan_instance)

// App
db.connection.once('open', () => {
    router.setDBObject(db)
    app.use(router.routes)
    app.use(invalid.routes)
    app.listen(port, () => {
        console.log(`InTransit API live at port ${port}. Check morgan output for incoming requests.`)
    })
})
