import React from 'react';

import BookingItem from "./BookingItem/BookingItem";
import List from "../../../shared/components/UIElement/List/List";


const BookingList = (props) => {


    return (
        <List>
            {props.items.map(booking => {
                return <BookingItem key={booking._id}
                                    booking={booking._id}
                                    event={booking.event._id}
                                    title={booking.event.title}
                                    price={booking.event.price}
                                    description={booking.event.description}
                                    createdAt={booking.createdAt}
                                    cancel={props.onCancel.bind(this, booking._id)}
                />
            })}
        </List>
    )
}

export default BookingList;
