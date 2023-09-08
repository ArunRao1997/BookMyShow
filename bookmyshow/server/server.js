const express = require('express')
var cors = require('cors')

const path = require("path");
__dirname = path.resolve();

const app = express()
app.use(cors())

require('dotenv').config()
const dbConfig = require('./config/dbconfig')

const userRoute = require('./routes/userRoutes')
const movieRoute = require('./routes/movieRoute')
const theatreRoute = require('./routes/theatreRoute')
const showRoute = require('./routes/showRoute')
const bookingRoute = require('./routes/bookingRoute')
const upcomingRoute = require('./routes/upcomingMovieRoute')


app.use(express.json())
app.use('/api/users', userRoute)
app.use('/api/movies', movieRoute)
app.use('/api/theatres', theatreRoute)
app.use('/api/shows', showRoute)
app.use('/api/bookings', bookingRoute)
app.use('/api/upcoming', upcomingRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
  }

app.listen(8082, () => {
    console.log('Server is up and running')
})