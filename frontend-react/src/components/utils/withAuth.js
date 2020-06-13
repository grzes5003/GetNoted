import React from "react";
import {Redirect} from 'react-router-dom';

export const withAuth = (Component) => {
    const isLoggedIn = true;
    return () => {
        if(!isLoggedIn) {
            return <Redirect to='/login'/>
        }
        return (
            <Component/>
        )
    }
};
