const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware');
const Movie = require('../models/movieModel')


// Add a Movie

router.post('/add-movie', authMiddleware, async (req, res) => {
    try {
        const newMovie = new Movie(req.body)
        await newMovie.save()
        res.send({
            success: true,
            message: 'Movie added successfully'
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

// Get All Movies

router.get('/get-all-movies', authMiddleware, async (req, res) => {
    try {
        const movies = await Movie.find()
        res.send({
            success: true,
            message: 'Movies fetched successfully',
            data: movies
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})

// Update a Movie 
router.post('/update-movie', authMiddleware, async (req, res) => {
    try {
        await Movie.findByIdAndUpdate(req.body.movieId, req.body);
        res.send({
            success: true,
            message: 'Movie updated successfully'
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

// Delete a Movie 

router.post("/delete-movie", authMiddleware, async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.body.movieId);
        res.send({
            success: true,
            message: "Movie deleted successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


module.exports = router; 