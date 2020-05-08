import React from 'react';


import './BookingsControl.css';

const BookingsControl = (props) => {


    const changeType = (type) => {
        props.onChange(type);
    }


    return (
        <div className="bookings-control">
            <button className={`bookings-control-item ${props.active === "list" ? 'bookings-control-active' : ''}`}
                    onClick={changeType.bind(this, "list")}
            >List</button>
            <button className={`bookings-control-item ${props.active === "chart" ? 'bookings-control-active' : ''}`}
                    onClick={changeType.bind(this, "chart")}
            >Chart</button>
        </div>
    )
}


export default BookingsControl;
