import React from 'react';

import UserEvents from "../UserEvents";



const AllEvents = () => {

    return (
        <React.Fragment>
            <UserEvents all={true} />
        </React.Fragment>
    )
}


export default AllEvents;
