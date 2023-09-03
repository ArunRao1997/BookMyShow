const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Show = require("../models/showModel");

// Add a show 
router.post("/add-show", authMiddleware, async (req, res) => {
    try {
        const newShow = new Show(req.body);
        await newShow.save();
        res.send({
            success: true,
            message: "Show added successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


// Get shows based on theatres
router.post("/get-all-shows-by-theatre", authMiddleware, async (req, res) => {
    try {
        const shows = await Show.find({ theatre: req.body.theatreId })
            .populate("movie")
            .sort({
                createdAt: -1,
            });

        res.send({
            success: true,
            message: "Shows fetched successfully",
            data: shows,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// Delete a Show 
router.post("/delete-show", authMiddleware, async (req, res) => {
    try {
        await Show.findByIdAndDelete(req.body.showId);
        res.send({
            success: true,
            message: "Show deleted successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router