import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';

import {AuthContext} from "../../shared/context/auth-context";
import {useHttpClient} from "../../shared/hooks/HttpHooks/HttpHooks";

import BookingsControl from "../components/BookingsControl";
import BookingsChart from "../components/BookingsChart";
import BookingList from "../components/BookingList";

import LoadingSpinner from "../../shared/components/LoadingSpinner/principal/LoadingSpinner";
import AlertModal from "../../shared/components/AlertModal/AlertModal";
import ErrorModal from "../../shared/components/ErrorModal/ErrorModal";
import Card from "../../shared/components/UIElement/Card/Card";




const Bookings = () => {


    const [loadedBookings, setLoadedBookings] = useState([]);
    const {idToken} = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [cancelingBooking, setCancelingBooking] = useState(false)
    const [bookingOutputType, setBookingOutputType] = useState("list");

    const [message, setMessage] = useState('');

    const getBookings = useCallback(async () => {

        // language=GraphQL
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        user {
                            _id
                            email
                        }
                        event {
                            _id
                            title
                            price
                        }
                        createdAt
                    }
                }
            `
        }

        try {
            const result = await sendRequest(`http://localhost:5000/graphql`, {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            })

            //console.log(result.data);

            if (result.ok) {
                setLoadedBookings(result.data.bookings || []);
            }

        } catch (e) {
        }

    }, [idToken, sendRequest, setLoadedBookings])

    const cancelBooking = useCallback(async (bookingId) => {

        setCancelingBooking(true);

        // language=GraphQL
        const requestBody = {
            query: `
                mutation cancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id) {
                        _id
                    }
                }
            `,
            variables: {
                id: bookingId
            }
        }
        try {
            const result = await sendRequest(`http://localhost:5000/graphql`, {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            })

            //console.log(result.data);

            if (result.ok) {
                setLoadedBookings(prevLoadedBookings => {
                    return prevLoadedBookings.filter(booking => booking._id !== bookingId);
                });
            }

        } catch (e) {}
        setCancelingBooking(false);

    }, [idToken, sendRequest])

    const changeBookingOutputType = (type) => {
        setBookingOutputType(type);
    }

    useEffect(() => {
        getBookings()
    }, [getBookings])

    return (
        <Fragment>

            {isLoading && <LoadingSpinner overlay/>}

            <AlertModal message={message}
                        onClear={() => setMessage('')}
            />

            <ErrorModal error={error}
                        onClear={clearError}
            />

            {!isLoading && loadedBookings.length === 0 &&
            <div className="booking-list center">
                <Card>
                    <h2>No Booking Found!</h2>
                </Card>
            </div>}

            {(!isLoading || cancelingBooking) && loadedBookings.length > 0 &&
               <Fragment>
                   <BookingsControl active={bookingOutputType}
                                    onChange={changeBookingOutputType}
                   />
                   {bookingOutputType === "list" &&
                   <BookingList items={loadedBookings}
                                onCancel={cancelBooking}
                   />}

                   {bookingOutputType === "chart" &&
                   <BookingsChart bookings={loadedBookings} />
                   }

               </Fragment>
            }

        </Fragment>);
}


export default Bookings;
