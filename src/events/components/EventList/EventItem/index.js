import React, {useCallback, useContext, useState} from 'react';

import {AuthContext} from "../../../../shared/context/auth-context";
import {useHttpClient} from "../../../../shared/hooks/HttpHooks/HttpHooks";

import Card from "../../../../shared/components/UIElement/Card/Card";
import Button from "../../../../shared/components/FormElements/Button/Button";
import Modal from "../../../../shared/components/Modal/Modal";
import AlertModal from "../../../../shared/components/AlertModal/AlertModal";
import LoadingSpinner from "../../../../shared/components/LoadingSpinner/principal/LoadingSpinner";
import ErrorModal from "../../../../shared/components/ErrorModal/ErrorModal";


/* CSS */
import './EventItem.css';
import Item from "../../../../shared/components/UIElement/Item/Item";
import ListItem from "../../../../shared/components/UIElement/List/ListItem/ListItem";



const Index = (props) => {

    const {idToken, userId} = useContext(AuthContext)

    const [eventId, setEventId] = useState('');

    const [showAlert, setShowAlert] = useState(false);

    const [alert, setAlert] = useState({
        header: "",
        message: "",
        type: "info"
    })

    const {isLoading, sendRequest, error, clearError} = useHttpClient();


    const startDeleteEventHandler = (id) =>  {
        setShowAlert(true);
        setEventId(id);
    }

    const cancelDeleteEventHandler = () => {
        setShowAlert(false);
        setEventId('');
    }

    const startViewEventDetailsHandler = () => {
        props.onView(props.id);
    }

    const deleteEvent = useCallback(async () => {

        setEventId('');
        try {

            // language=GraphQL
            const requestBody = {
                query: `
                    mutation deleteEvent($id: ID!){
                        deleteEvent(eventInput: $id)
                    }
                `,
                variables: {
                    id: eventId
                }
            }

            const result = await sendRequest(`http://localhost:5000/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                },
                body: JSON.stringify(requestBody)
            })

            if (result.ok) {
                setAlert({
                    header: 'Success',
                    message: 'Event deleted with success',
                    type: "info"
                });
                console.log(result.data);
                props.toDelete(eventId);
            } else {
                setAlert({
                    header: 'Error',
                    message: 'Could not delete this event, please try again!',
                    type: "danger"
                });
            }

        } catch (e) {}

    }, [sendRequest, idToken, eventId, props]);



    const confirmDeleteEventHandler = (event) => {
        event.preventDefault();
        //console.log("deleted!");
        setShowAlert(false);
        deleteEvent();
    }


    return (
        <React.Fragment>

            {isLoading && <LoadingSpinner overlay/>}

            <Modal show={showAlert}
                   header="Confirm"
                   contenClass="event-item__modal-content"
                   footerClass="event-item__modal-actions"
                   footer={
                       <React.Fragment>
                           <Button onClick={confirmDeleteEventHandler} clear={true}>CONFIRM</Button>
                           <Button onClick={cancelDeleteEventHandler}>CANCEL</Button>
                       </React.Fragment>
                   }
            >
                <p>Do you want to proceed and delete this event?</p>
            </Modal>

            <AlertModal message={alert.message}
                        header={alert.header}
                        type={alert.type}
                        onClear={() => setAlert({message: "", type: "info", header: ""})}
            />

            <ErrorModal error={error} onClear={clearError} />

            <ListItem>
                <Item info={props.title}
                      actions={
                          <React.Fragment>
                              <Button inverse onClick={startViewEventDetailsHandler}>
                                  VIEW DETAILS
                              </Button>
                              {!!idToken && userId === props.creator && !props.onlyowner &&
                              <React.Fragment>
                                  <Button danger onClick={() => startDeleteEventHandler(props.id)}>
                                      DELETE
                                  </Button>
                              </React.Fragment>}
                          </React.Fragment>}
                />
            </ListItem>
        </React.Fragment>
    )
}

export default Index;
