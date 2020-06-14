import React from "react";
import {Redirect} from 'react-router-dom';

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
