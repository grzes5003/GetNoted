import React from "react";
import {Redirect} from 'react-router-dom';

export const HomePage = ({isUserLogged}) => {
    if(isUserLogged) {
        return <Redirect to='/profile'/>
    }
    return (
        <h1>Home</h1>
    )
};
