const express = require('express');
const router = express.Router();

const {getPlayers, getLeaderboard, getPlayerDetail} = require('../controllers/pgatour')

router.get('/players', getPlayers)
router.get('/player/:name', getPlayerDetail)
router.get('/leaderboard', getLeaderboard)

module.exports = router