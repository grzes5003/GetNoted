import React from "react";
import {Redirect, useHistory} from 'react-router-dom';
import {LogoBig} from "../logos/LogoBig";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {strings} from "../../localization";
import {RegisterPage} from "./RegisterPage";
import {Footer} from "../layout/Footer";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: '10px',
        marginLeft: '10px',
    },
    loginButton: {
        position:'absolute',
        top:'15px',
        right:'15px',
    }
}));

// Home page with registration Component included
export const HomePage = ({isUserLogged}) => {
    const history = useHistory();
    const classes = useStyles();

    const handleLoginHrefButton = (e) => {
        e.stopPropagation();

        history.push("/login");
    };

    if (isUserLogged) {
        return <Redirect to='/profile'/>
    }
    return (
        <div className='background-body-div'>
            <div className={classes.margin}>
                <LogoBig/>
            </div>
            <div >
                <Button variant="outlined" color="primary" onClick={handleLoginHrefButton} className={classes.loginButton}>
                    {strings.login}
                </Button>
            </div>
            <RegisterPage/>
            <div className='background-text'>
                GetNoted
            </div>
            <Footer/>
        </div>
    )
};
