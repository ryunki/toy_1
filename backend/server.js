const axios = require('axios');
const cheerio = require('cheerio');

const { createServer } = require('http');

const express = require('express');

const app = express();

const httpServer = createServer(app);

const api = require('./routes/api')

app.get('/',async (req,res, next)=>{
  res.json({message: 'API running...'})
})

app.use('/api',api);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
