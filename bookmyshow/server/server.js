const express = require('express')

const app = express()

require('dotenv').config()
const dbConfig = require('./config/dbconfig')

const userRoute = require('./routes/userRoutes')

app.use(express.json())
app.use('/', userRoute)
app.listen(8082, ()=>{
    console.log('Server is up and running')
})