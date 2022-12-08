const express = require('express')
const app = express()

const pgatour = require('./pgatour')

app.use('/pgatour', pgatour)

module.exports = app