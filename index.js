const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { dbConnection } = require('./database/config')

const app = express()

//b
dbConnection()

//cors
app.use(cors())
//public
app.use(express.static('public'))

//parse body
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))

//404

app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on port ${process.env.APP_PORT}...`)
})
