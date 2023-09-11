import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { message, Row, Col, Button } from "antd";
import { GetBookingsOfUser, CancelBookingsOfUser } from "../../apicalls/bookings";
import moment from "moment";

function Bookings() {
    const [bookings = [], setBookings] = useState([]);
    const dispatch = useDispatch();
    const [nonExpiredBookings, setNonExpiredBookings] = useState([]);
    const [expiredBookings, setExpiredBookings] = useState([]);
    const [showExpired, setShowExpired] = useState(false); // State to control showing expired bookings
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = (id) => {
        setIsHovering(true);
    };

    const handleMouseLeave = (id) => {
        setIsHovering(false);
    };

    const getData = async () => {
        try {
            dispatch(ShowLoading());
            const response = await GetBookingsOfUser();
            if (response.success) {
                setBookings(response.data);

                // Separate non-expired and expired bookings based on current date and time
                const currentDate = moment();
                const nonExpired = [];
                const expired = [];

                response.data.forEach((booking) => {
                    const bookingDateTime = moment(booking.show.date + " " + booking.show.time, "YYYY-MM-DD HH:mm");

                    if (bookingDateTime.isAfter(currentDate)) {
                        nonExpired.push(booking);
                    } else {
                        expired.push(booking);
                    }
                });

                setNonExpiredBookings(nonExpired);
                setExpiredBookings(expired);
            } else {
                message.error(response.message);
            }
            dispatch(HideLoading());
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const toggleShowExpired = () => {
        setShowExpired(!showExpired); // Toggle the state to show/hide expired bookings
    };

    const cancelBooking = async (bookingId, showTime) => {
        try {
            dispatch(ShowLoading());
            const response = await CancelBookingsOfUser(bookingId, showTime);

            if (response.success) {
                // Booking canceled successfully, update the UI or fetch data again
                getData(); // Fetch updated booking data
                message.success(response.message);
            } else {
                message.error(response.message);
            }
            dispatch(HideLoading());
        } catch (error) {
            message.error("An error occurred while canceling the booking");
            dispatch(HideLoading());
        }
    };

    return (
        <div>
            {/* Button to toggle showing expired bookings */}
            <Button onClick={toggleShowExpired}>
                {showExpired ? "Hide Inactive Bookings" : "Show Inactive Bookings"}
            </Button>

            {/* Display non-expired bookings */}
            <h2>Active Bookings</h2>
            <Row gutter={[16, 16]}>
                {nonExpiredBookings.map((booking) => (
                    <Col span={12} key={booking._id}>
                        {/* Your card rendering for non-expired bookings */}
                        <div className="card p-2 flex justify-between uppercase">
                            <div>
                                <h1 className="text-xl">
                                    {booking.show.movie.title} ({booking.show.movie.language})
                                </h1>
                                <div className="divider"></div>
                                <h1 className="text-sm">
                                    {booking.show.theatre.name} ({booking.show.theatre.address})
                                </h1>
                                <h1 className="text-sm">
                                    Date & Time: {moment(booking.show.date).format("MMM Do YYYY")}{" "}
                                    - {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                                </h1>
                                <h1 className="text-sm">
                                    Amount : ₹ {booking.show.ticketPrice * booking.seats.length}
                                </h1>
                                <h1 className="text-sm">Booking ID: {booking._id}</h1>
                            </div>
                            <div>
                                <img
                                    src={booking.show.movie.poster}
                                    alt=""
                                    height={100}
                                    width={100}
                                    className="br-1"
                                />
                                <h1 className="text-sm">Seats: {booking.seats.join(", ")}</h1>
                            </div>
                            {/* Button to cancel the booking */}
                            <Button
                            className="card p-1 cursor-pointer border-primary"
                                style={{
                                    backgroundColor: isHovering ? '#DF1827' : 'white',
                                    color: isHovering ? 'white' : '#DF1827',
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => cancelBooking(booking._id, booking.show.time)}
                            >
                                Cancel Booking
                            </Button>
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Display expired bookings if the state is true */}
            {showExpired && (
                <>
                    <h2>Inactive Bookings</h2>
                    <Row gutter={[16, 16]}>
                        {expiredBookings.map((booking) => (
                            <Col span={12} key={booking._id}>
                                {/* card rendering for expired bookings */}
                                <div className="card p-2 flex justify-between uppercase">
                                    <div>
                                        <h1 className="text-xl">
                                            {booking.show.movie.title} ({booking.show.movie.language})
                                        </h1>
                                        <div className="divider"></div>
                                        <h1 className="text-sm">
                                            {booking.show.theatre.name} ({booking.show.theatre.address})
                                        </h1>
                                        <h1 className="text-sm">
                                            Date & Time: {moment(booking.show.date).format("MMM Do YYYY")}{" "}
                                            - {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                                        </h1>
                                        <h1 className="text-sm">
                                            Amount : ₹ {booking.show.ticketPrice * booking.seats.length}
                                        </h1>
                                        <h1 className="text-sm">Booking ID: {booking._id}</h1>
                                    </div>
                                    <div>
                                        <img
                                            src={booking.show.movie.poster}
                                            alt=""
                                            height={100}
                                            width={100}
                                            className="br-1"
                                        />
                                        <h1 className="text-sm">Seats: {booking.seats.join(", ")}</h1>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </div>
    );
}

export default Bookings;
