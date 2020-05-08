import React, { useContext } from 'react'

import Button from "../../shared/components/FormElements/Button/Button";
import Input from "../../shared/components/FormElements/Input/Input";
import Card from "../../shared/components/UIElement/Card/Card";
import LoadingSpinner from "../../shared/components/LoadingSpinner/principal/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal/ErrorModal";

import {Validators} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/FormHooks/FormHooks";

import {AuthContext} from "../../shared/context/auth-context";

import '../Auth.css';
import {useHttpClient} from "../../shared/hooks/HttpHooks/HttpHooks";




const Signin = (props) => {

    const authContext = useContext(AuthContext);
    const {login} = authContext;

    const {isLoading, error, sendRequest, clearError} = useHttpClient();


    const {formState, inputControl} = useForm({
        inputs: {
            email: {
                value: '',
                valid: false
            },
            password: {
                value: '',
                valid: false
            }
        },
        valid: false
    })

    const signinSubmitHandler = async (event) => {

        event.preventDefault();

        //console.log(formState);

        const {email, password} = formState.inputs;

        const requestBody = {
            // language=GraphQL
            query: `
                query {
                    login (email: "${email.value}", password: "${password.value}") {
                        _id
                        token
                        tokenExpirationTime
                    }
                }
            `
        };

        try {
            const result = await sendRequest(`http://localhost:5000/graphql`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            //console.log(result);

            if (result.ok) {
                const {_id, token, tokenExpirationTime} = result.data.login;
                login(_id, token, +tokenExpirationTime * 3600000);
            }

        } catch (e) {
            //console.log(e);
        }

    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}  />
            <Card className="authentication">
                {isLoading && <LoadingSpinner overlay/>}
                <h2>Login Required</h2>
                <hr/>
                <form onSubmit={signinSubmitHandler}>
                    <Input id="email"
                           label="email"
                           type='email'
                           error={`Please enter a valid E-mail!`}
                           onInput={inputControl}
                           validators={[
                               Validators.required,
                               Validators.minlength(3),
                               Validators.isEmail
                           ]}
                    />
                    <Input id="password"
                           label="Password"
                           type="password"
                           error={`Please enter a valid password, at least 6 characters!`}
                           onInput={inputControl}
                           validators={[
                               Validators.required,
                               Validators.minlength(6),
                               Validators.maxlength(20)
                           ]}
                    />
                    <Button type="submit" disabled={!formState.valid}>SIGNIN</Button>
                </form>
            </Card>
        </React.Fragment>
    )

}


export default Signin;
