const express = require('express')
const router = express()
const port = 8888

const accounts = require('./app/account').router
const shops = require('./app/shop').router
const orders = require('./app/order').router

// Master route
router.get('/', (req, res) => res.send('Hello World!'))

// Subroutes
router.use('/account', accounts)
router.use('/order', orders)
router.use('/shop', shops)

router.listen(port, () => console.log(`Example router listening on port port!`))
