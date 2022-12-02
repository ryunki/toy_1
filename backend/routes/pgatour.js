const express = require('express');
const router = express.Router();

const {getPlayers, getLeaderboard} = require('../controllers/pgatour')

router.get('/players', getPlayers)
router.get('/leaderboard', getLeaderboard)

module.exports = router