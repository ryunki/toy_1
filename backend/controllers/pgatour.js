const axios = require('axios')
const cheerio = require('cheerio')

const getPlayers = async (req, res, next) => {
  try {
    const data = await axios.get('https://www.pgatour.com/players.html')
    const $ = cheerio.load(data)
    const $countryList = $('player-card')
    // console.log($countryList)
    let countries = []
    $countryList.each((idx, node) => {
      console.log(idx)
      // const title = $(node).find('.player-country-title').text();
    })
    console.log($)
  } catch (err) {
    next(err)
  }
};

module.exports = {
  getPlayers,
};
