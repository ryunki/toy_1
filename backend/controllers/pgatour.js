const axios = require('axios')
const cheerio = require('cheerio')

const {PLAYERS,LEADERBOARD} = require('../url/pgatour')
const headers = { headers: { 'Accept-Encoding': 'application/json',}}

const getPlayers = async (req,res,next) => {
  let players = [];
  try {
    let x = await axios.get(PLAYERS, headers);
    const $ = cheerio.load(x.data);
    /// for active players this year
    const $activePlayersList = $('.player-card.active');
    $activePlayersList.each((idx, node) => {
      const firstname = $(node).find('.hidden-small > .player-firstname').text();
      const surname = $(node).find('.hidden-small > .player-surname').text();
      const country = $(node).find('.player-country-title').text();
      const image_src = $(node).find('img').attr('src'); //default picture path
      const image_file = $(node).find('img').attr('data-src'); //real picture file
      if (
        country.localeCompare('korea, republic of', 'en', {sensitivity: 'base',}) === 0
      ) {
        const default_headshot = image_src.split('/').at(-1) //to replace the default path
        const image = image_src.replace(default_headshot, image_file)
        players.push({
          country,
          name: firstname + ' ' + surname,
          image
        });
      }
    })
    res.send(players);
  } catch (err) {
    next(err)
  }
};

const getLeaderboard = async(req,res,next)=>{
  try{
    let x = await axios.get(LEADERBOARD, headers);
    const $ = cheerio.load(x.data);
    console.log($)
    // const $tounamentInfo = $('div.tounament-banner')
    // console.log($tounamentInfo)
    const $players = $('tbody > tr.line-row');
    // const $players = $('.player-name-col');
    console.log($players)
    
    $players.each((idx, node)=>{
      console.log(idx)
      // const player = $(node).find('player-name-col').text()
      // console.log(player)
      // const x = $(node).find('.player-name .KOR')
      // if()
      // console.log(x)
    })
    res.send("hey")
  }catch(err){
    next(err)
  }
  console.log("leaderboard")
} 
module.exports = {
  getPlayers, getLeaderboard
};
