import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import {AuthContextProvider} from "./shared/context/auth-context-provider";

const Provider = (
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
)

ReactDOM.render(Provider, document.getElementById('root'));
