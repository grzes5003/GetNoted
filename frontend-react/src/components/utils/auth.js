import React from "react";
import {Redirect} from 'react-router-dom';
import {constants} from "../../constants";

let inMemoryToken;

export function login ({ jwt_token, jwt_token_expiry, loggedStateHandler }, noRedirect) {
    loggedStateHandler(true);
    inMemoryToken = {
        token: jwt_token,
        expiry: jwt_token_expiry
    };
    if (!noRedirect) {
        return <Redirect to='/profile'/>
    }
}

export async function logout (loggedStateHandler) {
    inMemoryToken = null;
    const url = `${constants.HOST_ADDRESS}/api/logout`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
    });

    console.log('logout action');
    loggedStateHandler(false);

    // to support logging out from all windows
    window.localStorage.setItem('logout', Date.now());
    return <Redirect to='/'/>
}

export function getToken() {
    return inMemoryToken;
}
