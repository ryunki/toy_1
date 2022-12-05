const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs/promises')
const path = require('path')

const { PLAYERS, LEADERBOARD } = require('../url/pgatour');
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
    // console.log("name: ",JSON.stringify(players))
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
    // console.log(full_name)
    // full_name.map((item,idx)=>{
    //   console.log(idx)
    // })
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(LEADERBOARD);
    ////////////////// TOURNAMENT INFO ////////////////////
    
    const tournament_info = await page.$eval('.banner.section', (info,full_name)=>{ 
        const name =  info.querySelector('.name a').innerText
        const date = info.querySelector('.info-data .dates').innerText
        const vod = info.querySelectorAll('.vod-carousel-item-button')
        
        const videos = [...vod].map((item, idx)=>{
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

        const result ={
          name,
          date,
          videos
        }
        return result
      },full_name)

    ////////////////// LEADER BOARD ////////////////////////
    const leaderboard = await page.$$eval('tr.line-row', (tr) => {
      const results = tr.map((td, idx) => {
        // let strokes = td.querySelector('.strokes')
        let strokes = td.querySelector('.total')
        if(strokes !== null){
          strokes = strokes.innerText
        }
        let round = td.querySelectorAll('td.round-x');
        let all_rounds
        all_rounds = [...round].map((r, idx) => {
          return r.innerText
        });
        const score_board = {
          total: td.querySelector('.total').innerText,
          // tee_time: info.querySelector('.tee-time').innerText,
          rounds: all_rounds,
          strokes
        };
        const final_result = {
          position: td.querySelector('.position').innerText,
          country: td.querySelector('.flag').getAttribute('aria-label'),
          player: td.querySelector('.player-name-col').innerText,
          score_board
        };
        return final_result;
      });
      return results;
    });

    await browser.close();
    const leaderboard_page = {
      tournament_info, 
      leaderboard
    }
    res.send(leaderboard_page);
    // res.send(leaderboard);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPlayers,
  getLeaderboard,
};
