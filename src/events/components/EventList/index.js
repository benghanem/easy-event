import React, {Fragment, useContext, useState} from 'react';

import {AuthContext} from "../../../shared/context/auth-context";


/** Components **/
import EventItem from "./EventItem";

/** UI **/
import Card from "../../../shared/components/UIElement/Card/Card";
import Button from "../../../shared/components/FormElements/Button/Button";

/** CSS **/
import './EventList.css';
import List from "../../../shared/components/UIElement/List/List";


const EventList = (props) => {

    const {userId, isLoggedIn} = useContext(AuthContext)

    return (
        <Fragment>

            {isLoggedIn && <div className="event-list center">
                <Card>
                    <h2>Do you want to create a new event?</h2>
                    <Button onClick={props.onAdd}>CREATE EVENT</Button>
                </Card>
            </div>}

            {props.items.length === 0 &&
            <div className="event-list center">
                <Card>
                    <h2>No Event Found!</h2>
                </Card>
            </div>}

            {props.items.length > 0 &&
            <List>
                {props.items.map(event => {

                    if (!props.showAll && userId !== event.creator._id)
                        return null;

                    return <EventItem key={event._id}
                                      id={event._id}
                                      creator={event.creator._id}
                                      name={event.creator.name}
                                      title={event.title}
                                      price={event.price}
                                      date={event.date}
                                      description={event.description}
                                      toDelete={props.onDelete}
                                      onlyowner={props.showAll}
                                      onView={props.viewDetails}

                    />

                })}
            </List>}
        </Fragment>

    )
}

export default EventList;
