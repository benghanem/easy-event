import React, {useState, useContext} from 'react';

import {useForm} from "../../../shared/hooks/FormHooks/FormHooks";
import {useHttpClient} from "../../../shared/hooks/HttpHooks/HttpHooks";

import {Validators} from "../../../shared/util/validators";
import {AuthContext} from "../../../shared/context/auth-context";

import Button from "../../../shared/components/FormElements/Button/Button";
import Input from "../../../shared/components/FormElements/Input/Input";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/principal/LoadingSpinner";
import Modal from "../../../shared/components/Modal/Modal";

import '../EventForm.css';



const NewEvent = (props) => {

    const {isLoading, sendRequest} = useHttpClient();

    const {userId, idToken, login} = useContext(AuthContext)

    const {formState, inputControl} = useForm({

        inputs: {
            title: {
                value: '',
                valid: false
            },
            description: {
                value: '',
                valid: false
            },
            price: {
                value: 0,
                valid: false
            },
            date: {
                value: '',
                valid: false
            }
        },
        valid: false
    })

    const eventSubmitHandler = async (event) => {

        event.preventDefault();

        props.informations(true, "", "");

        //console.log("userID => ", userId, idToken)

        //console.log(formState.inputs);

        const {title, description, price, date} = formState.inputs;

        try {

            // language=GraphQL
            const requestBody = {
                query: `
                    mutation createEvent($creator: ID!, $title: String!, $price: Float!, $description: String!, $date: String!) {
                        createEvent(eventInput: {creator: $creator, title: $title, price: $price, description: $description, date: $date}) {
                            createdEvent {
                                _id
                                title
                                price
                                description
                                date
                                creator {
                                    _id
                                }
                            },
                            tokenInformations {
                                _id
                                token
                                tokenExpirationTime
                            }
                        }
                    }
                `,
                variables: {
                    creator: userId,
                    title: title.value,
                    price: +price.value,
                    description: description.value,
                    date: date.value
                }
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
                console.log(result)
                props.onEventAdded(result.data.createEvent.createdEvent)
                const {_id, token, tokenExpirationTime} = result.data.createEvent.tokenInformations;
                login(_id, token, +tokenExpirationTime * 3600000);
                message = "Event added with success";
            } else {
                error = "Adding event failed, please try again!"
            }

            props.informations(false, message, error);
            props.onClose();

        } catch (e) {}

    }

    return (
        <React.Fragment>
            {isLoading && <LoadingSpinner overlay/>}

            <Modal show={props.show}
                   onSubmit={eventSubmitHandler}
                   onClose={props.onClose}
                   header="Add Event"
                   footer={(
                       <React.Fragment>
                           <Button type="submit" disabled={!formState.valid}>ADD Event</Button>
                           <Button type="button" onClick={props.onClose}>Close</Button>
                       </React.Fragment>
                   )}
            >

                <Input id="title"
                       label="Title"
                       type='text'
                       error={`Please enter a valid Title, at least 3 characters!`}
                       onInput={inputControl}
                       initialValue={''}
                       initialValid={false}
                       validators={[
                           Validators.required,
                           Validators.minlength(3)
                       ]}
                />
                <Input id="price"
                       label="Price"
                       type='number'
                       error={`Please enter a valid number!`}
                       onInput={inputControl}
                       initialValue={0}
                       initialValid={false}
                       validators={[
                           Validators.required,
                           Validators.min(1)
                       ]}
                />
                <Input id="date"
                       label="Date"
                       type='date'
                       error={`Please enter a valid date!`}
                       onInput={inputControl}
                       initialValue={''}
                       initialValid={false}
                       validators={[
                           Validators.required,
                           Validators.minlength(2)
                       ]}
                />
                <Input id="description"
                       label="Description"
                       error={`Please enter a valid description, at least 6 characters!`}
                       onInput={inputControl}
                       initialValue={''}
                       initialValid={false}
                       validators={[
                           Validators.required,
                           Validators.minlength(6),
                           Validators.maxlength(400)
                       ]}
                />

            </Modal>

        </React.Fragment>
    )
}

export default NewEvent;
