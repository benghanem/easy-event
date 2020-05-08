import React, {Fragment, useContext} from 'react';
import LoadingSpinner from "../../../shared/components/LoadingSpinner/principal/LoadingSpinner";
import Modal from "../../../shared/components/Modal/Modal";
import Button from "../../../shared/components/FormElements/Button/Button";
import {AuthContext} from "../../../shared/context/auth-context";
import {useHttpClient} from "../../../shared/hooks/HttpHooks/HttpHooks";




const NewBooking = props => {

    //console.log(props);

    const {isLoggedIn, userId, idToken} = useContext(AuthContext);


    const {isLoading, sendRequest} = useHttpClient();

    const bookingSubmitHandler = async (event) => {

        event.preventDefault();

        props.informations(true, "", "");

        //console.log("userID => ", userId, idToken)


        const { _id } = props.event;

        try {

            // language=GraphQL
            const requestBody = {
                query: `
                    mutation {
                           bookEvent (eventId: "${_id}") {
                               _id
                               createdAt
                               updatedAt
                        }
                    }
                `
            }


            const result = await sendRequest(`http://localhost:5000/graphql`, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            })

            let error = '';
            let message = '';

            if (result.ok) {
                //console.log(result.data.bookEvent)
                //props.onEventAdded(result.data.bookEvent)
                message = "Event added with success";
            } else {
                error = "Adding event failed, please try again!"
            }

            props.informations(false, message, error);
            props.onClose();

        } catch (e) {

        }

    }

    console.log(props);

    return (
        <Fragment>

            {isLoading &&
            <LoadingSpinner overlay />}

            {!isLoading &&
            <Modal show={props.show}
                   onSubmit={bookingSubmitHandler}
                   header={props.event.title}
                   footer={(
                       <React.Fragment>
                           {isLoggedIn && props.event.creator._id !== userId &&
                           <Button clear
                                   submit>
                               Book
                           </Button>}
                           <Button danger
                                   onClick={props.onClose}>
                               Close
                           </Button>
                       </React.Fragment>
                   )}
            >

                <h3>Created on {new Date(props.event.date).toLocaleDateString()} by {props.event.creator.name}</h3>
                <h4>{props.event.price} euro</h4>
                <p>{props.event.description}</p>

            </Modal>}
        </Fragment>
    )
}


export default NewBooking;
