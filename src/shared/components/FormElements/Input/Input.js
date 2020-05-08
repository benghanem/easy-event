import React, {useEffect, useReducer} from 'react';

import { validate } from "../../../util/validators";

/* CSS */
import './Input.css';

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.value,
                valid: validate(action.value, action.validators)
            }
        case 'TOUCH':
            return {
                ...state,
                touched: true
            }
        default:
            return state;
    }
}

const Input = (props) => {

    const [inputState, dispatch] = useReducer(
        inputReducer,
        {
            value: props.initialValue || '',
            valid: props.initialValid || false,
            touched: false
        })

    const {id, onInput} = props;
    const { value, valid } = inputState;

    useEffect(() => {
        onInput(id, value, valid);
    }, [id, value, valid, onInput]);

    const inputChangeHandler = (event) => {
        dispatch({
            type: 'CHANGE',
            value: event.target.value,
            validators: props.validators && props.validators.length > 0 ? props.validators :  []
        })
    }

    const inputTouchHandler = () => {
        dispatch({type: 'TOUCH'})
    }

    let input;
    if (props.type) {
        input = (
            <input id={props.id || ''}
                   type={props.type}
                   placeholder={props.placeholder || ''}
                   onChange={inputChangeHandler}
                   onBlur={inputTouchHandler}
                   value={inputState.value}
            />
        )
    } else {
        input = (
            <textarea id={props.id}
                      rows={props.rows || 3}
                      onChange={inputChangeHandler}
                      onBlur={inputTouchHandler}
                      value={inputState.value}
            />
        )
    }

    return (
        <div className={`form-control ${!inputState.valid && inputState.touched ? 'form-control--invalid' : ''}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {input}
            {!inputState.valid && inputState.touched && !!props.error ? <p>{props.error}</p> : null}
        </div>
    )
}


export default Input;
