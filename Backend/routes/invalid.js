// Blocking all non-existent routes
const express = require('express')
const app = express()

const o_invalid = (i, o) => {
    o.status(404).send('Endpoint not exists.')
}

// Method list from Postman
app.get         ('*', o_invalid)
app.post        ('*', o_invalid)
app.put         ('*', o_invalid)
app.patch       ('*', o_invalid)
app.delete      ('*', o_invalid)
app.copy        ('*', o_invalid)
app.head        ('*', o_invalid)
app.options     ('*', o_invalid)
app.purge       ('*', o_invalid)
app.lock        ('*', o_invalid)
app.unlock      ('*', o_invalid)
app.propfind    ('*', o_invalid)

module.exports = {
    routes: app
}
