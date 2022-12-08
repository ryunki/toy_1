const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs/promises')
const path = require('path')

const { PLAYERS, LEADERBOARD, PGATOUR } = require('../url/pgatour');
const headers = { headers: { 'Accept-Encoding': 'application/json' } };

const writeFile = async(players)=>{
  const names = players.map((player, idx)=>{
    return player.name
  })
  const nameFolder=path.join(__dirname, "../players_info", 'players.txt')
  await fs.writeFile(nameFolder, names.toString())
}

const readFile = async()=>{
  const nameFolder=path.join(__dirname, "../players_info", 'players.txt')
  const players = await fs.readFile(nameFolder)
  return players.toString()
}

const getPlayers = async (req, res, next) => {
  let players=[]
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
      if (country.localeCompare('korea, republic of', 'en', {sensitivity: 'base',}) === 0) {
        const default_headshot = image_src.split('/').at(-1); //to replace the default path
        const image = image_src.replace(default_headshot, image_file);
        players.push({
          country,
          name: firstname + ' ' + surname,
          image,
        });
      }
    });
   
    res.send(players);
  } catch (err) {
    next(err);
  }
  writeFile(players)
};

const getLeaderboard = async (req, res, next) => {
  try {
    const player_names = await readFile()
    const full_name = player_names.split(",")
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(LEADERBOARD);
    // await page.waitForSelector('.wrap .container')

    const leaderboard_page = await page.$eval('.wrap .container', (p, full_name)=>{
///////////////// TOURNAMENT INFO //////////////////////////////
      const banner = p.querySelector('.banner.section')
      const name =  banner.querySelector('.name a').innerText 
      const date = banner.querySelector('.info-data .dates').innerText 
      const vod = banner.querySelectorAll('.vod-carousel-item-button')
      const videos = Array.from(vod).map((item, idx)=>{
        let title = item.getAttribute('data-video-title') 
        let desc = item.getAttribute('data-video-description') 
        let link = item.getAttribute('data-video-link') 
        let player_vod = { title,desc,link } 
        for (let i=0; i < full_name.length; i++){
          if (desc.includes(full_name[i])) {
            return player_vod
          }
        }
      })
      const tournament_info ={
        name,
        date,
        videos
      }
      console.log(tournament_info)
////////////////////// LEADERBORD HEADER /////////////////////////////////////

  let position = p.querySelector('th.position') === null ? "POSITION" : p.querySelector('th.position').innerText
  let player = p.querySelector('th.player-name') === null ? "PLAYER NAME" : p.querySelector('th.player-name').innerText
  let total = p.querySelector('th.total') === null ? "TOTAL SCORE" : p.querySelector('th.total').innerText
  let rounds = p.querySelectorAll('th.round-x')  === null ? "--" : p.querySelectorAll('th.round-x')
  let all_rounds = [...rounds].map((r,idx)=>{
    // return idx
    return r.innerText
  })
  const table_header = {
    position,
    country: "COUNTRY",
    player,
    total,
    all_rounds,
    strokes:"STROKES"
  }

////////////////////// LEADERBOARD ///////////////////////////////////////////
      const row = p.querySelectorAll('tr.line-row')
      const leaderboard = Array.from(row).map((td, idx)=>{
        let position =td.querySelector('.position').innerText
        let country = td.querySelector('.flag').hasAttribute('aria-label')
        let player = td.querySelector('.player-name-col').innerText

        let stroke = td.querySelector('.strokes')
        let total = td.querySelector('.total').innerText
        let round = td.querySelectorAll('td.round-x')
        let all_rounds = [...round].map((r, idx) => {
          return r.innerText
        });
        let strokes
        if(stroke !== null){
          strokes = stroke.innerText
        }else{
          strokes = "--"
        }
      
        let score_board = {
          total,
          rounds: all_rounds,
          strokes
        };
        if(country){
          country = td.querySelector('.flag').getAttribute('aria-label')
        }else{
          country = '--'
        }
        return final_result = {
          position,
          country,
          player,
          score_board
        };
      })
      return {
        tournament_info, 
        table_header,
        leaderboard
      }
    },full_name)

    await browser.close();
    
    res.send(leaderboard_page);
  } catch (err) {
    next(err);
  }
};

const getPlayerDetail = async(req,res,next) =>{
  
  try{
    // const selected_player = decodeURIComponent(req.params.name)
    const selected_player = req.params.name
    // const selected_player = "Seung-Yul Noh"
    console.log("selected player: ",selected_player)
    const browser = await puppeteer.launch(
      // {headless:false}
      );
    const page = await browser.newPage();
    await page.goto(PLAYERS);

    const display_player = await page.$$eval('li.player-card.active', (p,selected_player,PGATOUR)=>{
      let player
      p.map((item,idx)=>{
        const firstname = item.querySelector('.player-firstname').innerText
        const surname = item.querySelector('.player-surname').innerText
        const fullname = firstname+" "+surname
        const link = item.querySelector('a.player-link')
        if(fullname.localeCompare(selected_player, 'en', {sensitivity: 'base',}) === 0){
          return player = {
            fullname : selected_player,
            link : PGATOUR+link.getAttribute('href')
          }
        }
      })
      return player
    }, selected_player,PGATOUR)
    console.log("hey: ",display_player)
    res.send(display_player)
    
    await browser.close();
  }catch(err){
    next(err)
  }
}

module.exports = {
  getPlayers,
  getPlayerDetail,
  getLeaderboard,
};
