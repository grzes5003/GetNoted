import React from "react";
import {Redirect} from 'react-router-dom';

// middleware for profile Component
// arg: Component is component to be returned if user is logged in
export const withAuth = (Component, isUserLogged, setIsUserLogged) => {
    //const isLoggedIn = false;
    return () => {
        if(!isUserLogged) {
            return <Redirect to='/'/>
        }
        return (
            <Component isUserLogged={isUserLogged} setIsUserLogged={setIsUserLogged}/>
        )
    }
};
