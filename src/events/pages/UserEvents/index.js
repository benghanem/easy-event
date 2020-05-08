import React, {useEffect, useContext, useState, Fragment, useCallback} from 'react';
import { useParams } from 'react-router-dom';

import {AuthContext} from "../../../shared/context/auth-context";

import EventList from "../../components/EventList";
import {useHttpClient} from "../../../shared/hooks/HttpHooks/HttpHooks";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/principal/LoadingSpinner";
import ErrorModal from "../../../shared/components/ErrorModal/ErrorModal";
import AlertModal from "../../../shared/components/AlertModal/AlertModal";
import NewEvent from "../NewEvent/NewEvent";
import NewBooking from "../../../bookings/pages/NewBooking/NewBooking";

const UserEvents = (props) => {

    //const all = props.all
    const uid = useParams().uid;

    const {isLoading, sendRequest, error, setError, clearError} = useHttpClient();
    const {userId, idToken} = useContext(AuthContext);

    const [selectedEvent, setSelectedEvent] = useState(null);

    const [loadedEvents, setLoadedEvents] = useState([]);
    const [creatingEvent, setCreatingEvent] = useState(false);
    const [message, setMessage] = useState('');

    const [showNewEventModal, setShowNewEventModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);


    const eventAddedHandler = ({_id, title, description, price, creator}) => {
        setLoadedEvents(prevLoadedEvents => {
            return [
                ...prevLoadedEvents,
                {
                    _id,
                    title,
                    description,
                    price,
                    creator
                }
            ]
        })
    }

    const deleteEventHandler = (eid) => {
        console.log("eid ==> ", eid);
        setLoadedEvents(loadedEvents => {
            return loadedEvents.filter(event => event._id !== eid);
        })
        //console.log(loadedEvents);
    }

    const getEventsByUserId = useCallback(async () => {

        //console.log(props.all)

        let requestBody;
        if (props.all) {
            // language=GraphQL
            requestBody = {
                query: `
                    query {
                        allEvents {
                            _id
                            title
                            price
                            date
                            description
                            creator {
                                _id
                                name
                                email
                            }
                        }
                    }
                `
            }
        } else {
            // language=GraphQL
            requestBody = {
                query: `
                    query {
                        events {
                            _id
                            title
                            price
                            date
                            description
                            creator {
                                _id
                                name
                                email
                            }
                        }
                    }
                `
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

            console.log(result.data);

            if (result.ok) {
                setLoadedEvents(result.data.events || result.data.allEvents || []);
            }

        } catch (e) {}

    }, [idToken, props.all, sendRequest])


    const informationsChangedHandler = (isLoading, message, error) => {
        setCreatingEvent(isLoading);
        setMessage(message);
        setError(error);
        //console.log(isLoading, message, error)
    }

    const openNewEventHandler = () => {
        setShowNewEventModal(true);
    }

    const closeNewEventHandler = () => {
        setShowNewEventModal(false);
    }

    const viewEventDetailHandler = useCallback((eventId) => {
        const selectedEvent = loadedEvents.find(event => event._id === eventId);
        console.log(selectedEvent);
        setSelectedEvent(selectedEvent);
        setShowBookingModal(true);
    }, [loadedEvents])

    const closeEventDetailsHandler = () => {
        setShowBookingModal(false);
    }


    useEffect(() => {

        getEventsByUserId();

    }, [getEventsByUserId])

    return (
        <Fragment>

            <NewEvent show={showNewEventModal}
                      onEventAdded={eventAddedHandler}
                      informations={informationsChangedHandler}
                      onClose={closeNewEventHandler}/>

            {showBookingModal && selectedEvent &&
            <NewBooking show={showBookingModal}
                        event={selectedEvent}
                        informations={informationsChangedHandler}
                        onClose={closeEventDetailsHandler}
            />}

            <AlertModal message={message} onClear={() => setMessage('')}/>

            <ErrorModal error={error}
                        onClear={clearError}/>

            {(isLoading || creatingEvent) &&
            <LoadingSpinner overlay/>}

            {!isLoading && loadedEvents &&
            <EventList onDelete={deleteEventHandler}
                       onAdd={openNewEventHandler}
                       showAll={props.all}
                       items={loadedEvents}
                       viewDetails={viewEventDetailHandler}

            />}
        </Fragment>
    )
}

export default UserEvents;
