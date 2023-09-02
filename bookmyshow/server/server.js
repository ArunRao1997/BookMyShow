const express = require('express')
var cors = require('cors')

const app = express()
app.use(cors())

require('dotenv').config()
const dbConfig = require('./config/dbconfig')

const userRoute = require('./routes/userRoutes')
const movieRoute = require('./routes/movieRoute')
const theatreRoute = require('./routes/theatreRoute')
const showRoute = require('./routes/showRoute')

app.use(express.json())
app.use('/api/users', userRoute)
app.use('/api/movies', movieRoute)
app.use('/api/theatres', theatreRoute)
app.use('/api/shows', showRoute)

app.listen(8082, () => {
    console.log('Server is up and running')
})