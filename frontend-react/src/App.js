import React, {useState, useEffect} from 'react';
import {Header} from "./components/layout/Header";
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {Content} from "./components/layout/Content";
import './styles/index.scss'
import {HomePage} from "./components/pagesComponents/HomePage";
import {ProfilePage} from "./components/pagesComponents/ProfilePage";
import {LoginPage} from "./components/pagesComponents/LoginPage";
import {withAuth} from "./components/utils/withAuth";
import {RegisterPage} from "./components/pagesComponents/RegisterPage";
import {constants} from "./constants";
import {login} from "./components/utils/auth";

const IsUserLogged = React.createContext(false);

// Entry for react app
export const App = () => {

    // state informing if user is logged
    // changes every time such event occurs
    const [isUserLogged, setIsUserLogged] = React.useState(false);

    const loggedStateHandler = (val) => {
        console.log('changed logged status to', val.toString());
        setIsUserLogged(val);
    };

    // checks if user is logged in
    async function checkIfLoggedIn() {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if(!token || !username ){
            setIsUserLogged(false);
            return
        }

        const url = `${constants.HOST_ADDRESS}/api/valid`;

        console.log(token);
        console.log(url);

        try {
            // request validation of user token sent to server
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({token, username})
            });
            // if token is valid server returns code 200
            if (response.status === 200) {
                const {token} = await response.json();
                setIsUserLogged(true);
            } else {
                console.log('Bad token or nonexistent.');
                setIsUserLogged(false);
            }
        } catch (error) {
            console.error(
                'error: ',
                error
            );
        }
    }

    // check if user is logged on mount
    React.useEffect(() => {
        checkIfLoggedIn().then(r => {});
    }, []);

    // basic router defining subpages
    return (
        <IsUserLogged.Provider value={false}>
            <Router>
                <Switch>
                    <Route path="/" exact render={(props) => <HomePage {...props} isUserLogged={isUserLogged}/>}/>
                    <Route path="/profile" component={withAuth(ProfilePage, isUserLogged, setIsUserLogged)}/>
                    <Route path="/login" render={(props) => <LoginPage {...props} isUserLogged={isUserLogged} loggedStateHandler={loggedStateHandler}/>}/>
                    <Route path="/register" render={(props) => <RegisterPage {...props} isUserLogged={isUserLogged} loggedStateHandler={loggedStateHandler}/>}/>
                </Switch>
            </Router>
        </IsUserLogged.Provider>
    );
};
