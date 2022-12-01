const axios = require('axios');
const cheerio = require('cheerio');

const { createServer } = require('http');

const express = require('express');

const app = express();

const httpServer = createServer(app);

// const routes = require('./routes/pgatour')

const url = 'https://www.pgatour.com/players.html';
const url2 = 'https://www.pgatour.com/';


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
      const image = $(node).find('img').attr('src');
      if (
        country.localeCompare('korea, republic of', 'en', {sensitivity: 'base',}) === 0
      ) {
        players.push({
          country,
          name: firstname + ' ' + surname,
          image,
        });
      }
    })
    // console.log(players);
    res.send(players);
  } catch (err) {
    console.log(err)
  }
};



// app.use('/api', routes)
// const getPlayers = async (req, res, next) => {
//   try {
//     const data = "hello"
//     return res.send(data);
//   } catch (err) {
//     next(err);
//   }
// };

app.get('/',
async (req,res, next)=>{
  res.json({message: 'API running...'})
}
)
app.get('/api/players',getPlayers );

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
