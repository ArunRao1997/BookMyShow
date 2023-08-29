const express = require('express')
var cors = require('cors')

const app = express()
app.use(cors())

require('dotenv').config()
const dbConfig = require('./config/dbconfig')

const userRoute = require('./routes/userRoutes')
const movieRoute = require('./routes/movieRoute')

app.use(express.json())
app.use('/api/users', userRoute)
app.use('/api/users', movieRoute)

app.listen(8082, ()=>{
    console.log('Server is up and running')
})