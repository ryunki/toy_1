const express = require('express');
const router = express.Router();

const {getPlayers} = require('../controllers/pgatour')

router.get('/pgatour', getPlayers)

module.exports = router