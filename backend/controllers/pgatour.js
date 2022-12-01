const axios = require('axios')
const cheerio = require('cheerio')

const url = 'https://www.pgatour.com/players.html';

const getPlayers = async (req,res,next) => {
  let countries = [];
  let players = [];
  try {
    let x = await axios.get(url, { headers: { 'Accept-Encoding': 'application/json',}});
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
        console.log(image)
        // console.log(image.split('/').pop())
        // console.log(image)
        players.push({
          country,
          name: firstname + ' ' + surname,
          image
        });
      }
    })
    res.send(players);
  } catch (err) {
    console.log(err)
  }
};

module.exports = {
  getPlayers,
};
