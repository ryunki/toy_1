const express = require('express')
const app = express()

const pgaTour = require('./pgatour')

app.use('/pgatour', pgaTour)

module.exports = app