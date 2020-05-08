import React, {useCallback} from 'react'
import { useHistory } from 'react-router-dom'

import Button from "../../shared/components/FormElements/Button/Button";
import Input from "../../shared/components/FormElements/Input/Input";
import Card from "../../shared/components/UIElement/Card/Card";

import {Validators} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/FormHooks/FormHooks";

import '../Auth.css';
import LoadingSpinner from "../../shared/components/LoadingSpinner/principal/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal/ErrorModal";
import {useHttpClient} from "../../shared/hooks/HttpHooks/HttpHooks";
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload";

const {useState} = require("react");


const Signup = (props) => {

    const history = useHistory();

    const {isLoading, sendRequest} = useHttpClient();

    const [error, setError] = useState('');

    const {formState, inputControl} = useForm({
        inputs: {
            name: {
              value: '',
              valid: false
            },
            image: {
                value: null,
                valid: false
            },
            email: {
                value: '',
                valid: false
            },
            password: {
                value: '',
                valid: false
            },
            confirmPassword: {
                value: '',
                valid: false
            }
        },
        valid: false
    })

    const signupSubmitHandler = useCallback(async (event) => {

        event.preventDefault();

        setError('');
        //console.log(formState);

        const {name, email, password, image} = formState.inputs;

        try {

            const formData = new FormData();

            formData.append('name', name.value);
            formData.append('email', email.value);
            formData.append('password', password.value);
            formData.append('image', image.value);


            const requestBody = {
                // language=GraphQL
                query: `
                    mutation createUser($name: String!, $email: String!, $password: String!) {
                        createUser (userInput: {name: $name, email: $email, password: $password}) {
                            _id
                            name
                            email
                        }
                    }
                `,
                variables: {
                    name: name.value,
                    email: email.value,
                    password: password.value
                }
            };

            const result = await sendRequest(`http://localhost:5000/graphql`, {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            //console.log(result);

            if (result.ok) {
                history.push('/login');
            } else {
                setError(result.error.message);
            }

        } catch (e) {
            //console.log(e);
        }

    }, [setError, sendRequest, formState, history])

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={() => setError('')}  />
            <Card className="authentication">
                {isLoading && <LoadingSpinner overlay/>}
                <h2>Registration</h2>
                <hr/>
                <form onSubmit={signupSubmitHandler}>
                    <Input id="name"
                           label="Your Name"
                           type='text'
                           error={`Please enter a name!`}
                           onInput={inputControl}
                           validators={[
                               Validators.minlength(3)
                           ]}
                    />
                    <ImageUpload id="image"
                                 onInput={inputControl}
                                 center />
                    <Input id="email"
                           label="email"
                           type='email'
                           error={`Please enter a valid E-mail!`}
                           onInput={inputControl}
                           validators={[
                               Validators.isEmail
                           ]}
                    />
                    <Input id="password"
                           label="Password"
                           type="password"
                           error={`Please enter a valid password, at least 6 characters!`}
                           onInput={inputControl}
                           validators={[
                               Validators.isPassword,
                               Validators.maxlength(20)
                           ]}
                    />
                    <Input id="confirmPassword"
                           label="Confirm Password"
                           type="password"
                           error={`Password do not matches!`}
                           onInput={inputControl}
                           validators={[
                               Validators.doMatch(formState.inputs.password.value)
                           ]}
                    />
                    <Button type="submit" disabled={!formState.valid}>SIGNUP</Button>
                </form>
            </Card>
        </React.Fragment>
    )

}


export default Signup;
