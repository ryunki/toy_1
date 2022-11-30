const {createServer} = require("http")
const express = require('express')
const app = express()

const httpServer = createServer(app)










const PORT = process.env.PORT || 5000
httpServer.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))