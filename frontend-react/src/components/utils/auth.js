import React from "react";
import {Redirect} from 'react-router-dom';
import {constants} from "../../constants";

let inMemoryToken;

// login helper
// saves token and redirects to profile
export function login ({ token, token_expiry, loggedStateHandler }, noRedirect) {
    loggedStateHandler(true);
    inMemoryToken = {
        token: token,
        expiry: token_expiry
    };

    localStorage.setItem('token', token);

    if (!noRedirect) {
        return <Redirect to='/profile'/>
    }
}

// logout helper
// deletes token and redirects to home page
export async function logout (loggedStateHandler) {
    inMemoryToken = null;
    const url = `${constants.HOST_ADDRESS}/api/logout`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
    });

    localStorage.clear();

    console.log('logout action');
    loggedStateHandler(false);

    // to support logging out from all windows
    window.localStorage.setItem('logout', Date.now());

    window.location.reload(false);

    return <Redirect to='/'/>
}

export function getToken() {
    return inMemoryToken;
}
