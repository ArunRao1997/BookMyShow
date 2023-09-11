const authMiddleware = require("../middleware/authMiddleware");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const moment = require("moment"); // Import the moment library for date and time manipulation

const router = require("express").Router();
const stripe = require("stripe")(process.env.stripe_key);



router.post("/make-payment", authMiddleware, async (req, res) => {
    try {
        const { token, amount } = req.body;

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });

        const charge = await stripe.charges.create({
            amount: amount,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "Ticket Booked for Movie",
        });

        const transactionId = charge.id;

        res.send({
            success: true,
            message: "Payment successful",
            data: transactionId,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// book shows
router.post("/book-show", authMiddleware, async (req, res) => {
    try {
        // save booking
        const newBooking = new Booking(req.body);
        await newBooking.save();

        const show = await Show.findById(req.body.show);
        // update seats
        await Show.findByIdAndUpdate(req.body.show, {
            bookedSeats: [...show.bookedSeats, ...req.body.seats],
        });

        res.send({
            success: true,
            message: "Show booked successfully",
            data: newBooking,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


router.get("/get-bookings", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.body.userId })
            .populate("show")
            .populate({
                path: "show",
                populate: {
                    path: "movie",
                    model: "movies",
                },
            })
            .populate("user")
            .populate({
                path: "show",
                populate: {
                    path: "theatre",
                    model: "theatres",
                },
            });

        res.send({
            success: true,
            message: "Bookings fetched successfully",
            data: bookings,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// Create a cancel-booking endpoint
router.post("/cancel-booking", authMiddleware, async (req, res) => {
    try {
        // Use req.body.userId as the user ID for cancellation
        const userId = req.body.userId;

        // Find the booking(s) for the user
        const bookings = await Booking.find({ user: userId });

        if (!bookings || bookings.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Bookings not found for the user",
            });
        }

        // You can add further logic here to select a specific booking to cancel, if needed
        const bookingToCancel = bookings[0]; // For example, you can choose the first booking

        // Perform the cancellation logic here, for example, removing the booking
        await Booking.findByIdAndRemove(bookingToCancel._id);

        // Update the show's bookedSeats to free up the seats
        const show = await Show.findById(bookingToCancel.show);
        const updatedBookedSeats = show.bookedSeats.filter(
            (seat) => !bookingToCancel.seats.includes(seat)
        );
        await Show.findByIdAndUpdate(bookingToCancel.show, {
            bookedSeats: updatedBookedSeats,
        });

        res.send({
            success: true,
            message: "Booking canceled successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

// // Create a cancel-booking endpoint
// router.post("/cancel-booking", authMiddleware, async (req, res) => {
//     try {
//         // Use req.body.userId as the user ID for cancellation
//         const userId = req.body.userId;

//         // Find the booking(s) for the user
//         const bookings = await Booking.find({ user: userId });

//         if (!bookings || bookings.length === 0) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Bookings not found for the user",
//             });
//         }

//         // You can add further logic here to select a specific booking to cancel, if needed
//         const bookingToCancel = bookings[0]; // For example, you can choose the first booking

//         // Calculate the time difference between show time and current time
//         const currentTime = moment();
//         const showDateTime = moment(bookingToCancel.show.date + " " + bookingToCancel.show.time, "YYYY-MM-DD HH:mm");
//         const timeDifferenceMinutes = showDateTime.diff(currentTime, "minutes");

//         if (timeDifferenceMinutes >= 60) {
//             // Perform the cancellation logic here, for example, removing the booking
//             await Booking.findByIdAndRemove(bookingToCancel._id);

//             // Update the show's bookedSeats to free up the seats
//             const show = await Show.findById(bookingToCancel.show);
//             const updatedBookedSeats = show.bookedSeats.filter(
//                 (seat) => !bookingToCancel.seats.includes(seat)
//             );
//             await Show.findByIdAndUpdate(bookingToCancel.show, {
//                 bookedSeats: updatedBookedSeats,
//             });

//             res.send({
//                 success: true,
//                 message: "Booking canceled successfully",
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 message: "You can only cancel bookings at least 1 hour before the show.",
//             });
//         }
//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: error.message,
//         });
//     }
// });


module.exports = router;