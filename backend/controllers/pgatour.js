const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const { PLAYERS, LEADERBOARD } = require('../url/pgatour');
const headers = { headers: { 'Accept-Encoding': 'application/json' } };

const getPlayers = async (req, res, next) => {
  let players = [];
  try {
    let x = await axios.get(PLAYERS, headers);
    const $ = cheerio.load(x.data);
    /// for active players this year
    const $activePlayersList = $('.player-card.active');
    $activePlayersList.each((idx, node) => {
      const firstname = $(node)
        .find('.hidden-small > .player-firstname')
        .text();
      const surname = $(node).find('.hidden-small > .player-surname').text();
      const country = $(node).find('.player-country-title').text();
      const image_src = $(node).find('img').attr('src'); //default picture path
      const image_file = $(node).find('img').attr('data-src'); //real picture file
      if (
        country.localeCompare('korea, republic of', 'en', {
          sensitivity: 'base',
        }) === 0
      ) {
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
};

const getLeaderboard = async (req, res, next) => {
  try {
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(LEADERBOARD);

    const d = '#stroke-play-container';
    // const d = '#leaderboard-container';
    await page.waitForSelector(d);
    // const html = await page.$$('tbody tr.line-row .player-name-col');
    // console.log(html)

    const html2 = await page.$$eval('tr.line-row', (tr) => {
      let all_rounds
      
      const results = tr.map((td, idx) => {
        let round = td.querySelectorAll('.round-x')
        
        all_rounds = [...round].map((r, idx)=>{
          return r.innerText
        })
        const score_board = {
          total: td.querySelector('.total').innerText,
          // tee_time: info.querySelector('.tee-time').innerText,
          rounds: all_rounds,
          strokes: td.querySelector('.strokes').innerText,
        };
        const final_result = {
          position: td.querySelector('.position').innerText,
          country: td.querySelector('.flag').getAttribute('aria-label'),
          player: td.querySelector('.player-name-col').innerText,
          score_board,
        };
        return final_result;
      });
      return results;
    });
    console.log('$$eval: ', html2);
    // console.log("array: ",html2[0].score_board.rounds[0])
    // const html2 = await page.$eval(d, el => el.outerHTML);
    // console.log("$eval: ",html2)
    // await page.click(x);

    // const links = await page.evaluate(resultsSelector => {
    //   return [...document.querySelectorAll(resultsSelector)].map(anchor => {
    //     const title = anchor.textContent.split('|')[0].trim();
    //     return `${title} - ${anchor.href}`;
    //   });
    // }, resultsSelector);
    // console.log(links.join('\n'));
    await browser.close();

    res.send(html2);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPlayers,
  getLeaderboard,
};
