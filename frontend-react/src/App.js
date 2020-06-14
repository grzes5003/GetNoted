import React, {useState} from 'react';
import {Header} from "./components/layout/Header";
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {Content} from "./components/layout/Content";
import './styles/index.scss'
import {HomePage} from "./components/pagesComponents/HomePage";
import {ProfilePage} from "./components/pagesComponents/ProfilePage";
import {LoginPage} from "./components/pagesComponents/LoginPage";
import {withAuth} from "./components/utils/withAuth";
import {RegisterPage} from "./components/pagesComponents/RegisterPage";

const IsUserLogged = React.createContext(false);

export const App = () => {
    const [isUserLogged, setIsUserLogged] = React.useState(false);

    const loggedStateHandler = (val) => {
        console.log('changed logged status to', val.toString());
        setIsUserLogged(val);
    };

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
