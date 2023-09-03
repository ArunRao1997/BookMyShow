const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware');
const Show = require('../models/showModel');
const Theatre = require('../models/theatreModel')

// Add a theatre
router.post("/add-theatre", authMiddleware, async (req, res) => {
    try {
        const newTheatre = new Theatre(req.body);
        await newTheatre.save();
        res.send({
            success: true,
            message: "Theatre added successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


//Get all theatres
router.get("/get-all-theatres", authMiddleware, async (req, res) => {
    try {
      const theatres = await Theatre.find().populate('owner')
      res.send({
        success: true,
        message: "Theatres fetched successfully",
        data: theatres,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });

// Get all theatres by owner
router.post("/get-all-theatres-by-owner", authMiddleware, async (req, res) => {
    try {
        const theatres = await Theatre.find({ owner: req.body.owner })
        res.send({
            success: true,
            message: "Theatres fetched successfully",
            data: theatres,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


// Update a Theatre
router.post('/update-theatre', authMiddleware, async (req, res) => {
    try {
        const { theatreId, ...updateData } = req.body;

        await Theatre.findByIdAndUpdate(theatreId, updateData);
        res.send({
            success: true,
            message: 'Theatre updated successfully'
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});


// Delete a Theatre 
router.post("/delete-theatre", authMiddleware, async (req, res) => {
    try {
        await Theatre.findByIdAndDelete(req.body.theatreId);
        res.send({
            success: true,
            message: "Theatre deleted successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// get all unique theatres which have shows of a movie


router.post("/get-all-theatres-by-movie", authMiddleware, async (req, res) => {
    try {
      const { movie, date } = req.body;
  
      // find all shows of a movie
      const shows = await Show.find({ movie, date })
        .populate("theatre")
        .sort({ createdAt: -1 });
  
      // get all unique theatres
      let uniqueTheatres = [];
      shows.forEach((show) => {
        const theatre = uniqueTheatres.find(
          (theatre) => theatre._id == show.theatre._id
        );
  
        if (!theatre) {
          const showsForThisTheatre = shows.filter(
            (showObj) => showObj.theatre._id == show.theatre._id
          );
          uniqueTheatres.push({
            ...show.theatre._doc,
            shows: showsForThisTheatre,
          });
        }
      });
  
      res.send({
        success: true,
        message: "Theatres fetched successfully",
        data: uniqueTheatres,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });  

module.exports = router
