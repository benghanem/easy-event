import React, { Fragment, Suspense, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import {AuthContext} from "./shared/context/auth-context";

import MainNavigation from "./shared/components/Navigation/MainNavigation/MainNavigation";
import LoadingSpinner from "./shared/components/LoadingSpinner/principal/LoadingSpinner";
import AllEvents from "./events/pages/AllEvents";
import BookingList from "./bookings/components/BookingList";
import Bookings from "./bookings/pages";


const NewEvent = React.lazy(() => import("./events/pages/NewEvent/NewEvent"));
const Signin = React.lazy(() => import("./Authentication/Signin/Signin"));
const Signup = React.lazy(() => import("./Authentication/Signup/Signup"));
const UserEvents = React.lazy(() => import("./events/pages/UserEvents"));

const App = () => {

    const authContext = useContext(AuthContext);
    const {idToken, isLoading, autoLogin} = authContext;

    useEffect(() => {
        autoLogin();
    }, [autoLogin])


    let routes;
    if (!!idToken) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <AllEvents />
                </Route>
                <Route path="/events" exact>
                    <UserEvents />
                </Route>
                <Route path="/bookings" exact>
                    <Bookings />
                </Route>
                <Route path="/events/new" exact>
                    <NewEvent />
                </Route>
                <Redirect to="/" />
            </Switch>
        )
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <AllEvents />
                </Route>
                <Route path="/login" exact>
                    <Signin />
                </Route>
                <Route path="/register" exact>
                    <Signup />
                </Route>
                <Redirect to="/" />
            </Switch>
        )
    }


    return (
        <Fragment>
            {isLoading && <LoadingSpinner overlay/>}
            {!isLoading &&
            <Router>
                <MainNavigation />
                <main>
                    <Suspense fallback={
                        <div className="center">
                            <LoadingSpinner overlay />
                        </div>
                    }>
                        {routes}
                    </Suspense>
                </main>
            </Router>}
        </Fragment>
    )
}

export default App;
