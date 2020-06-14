import React from "react";
import {Redirect, useHistory} from 'react-router-dom';
import {constants} from "../../constants";
import {login} from "../utils/auth";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {AccountCircle} from "@material-ui/icons";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import {LogoBig} from "../logos/LogoBig";
import Button from "@material-ui/core/Button";
import {strings} from "../../localization";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";

const useStyles = makeStyles({
    root: {

        maxWidth: '30%',
        width: 'fit-content',
        //display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',

        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    div: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'wrap',
        textAlign: 'center',
        minHeight: '100vh',
    },
    margin: {
        margin: '10px',
        marginLeft: '10px',
    },
});

export const LoginPage = ({isUserLogged, loggedStateHandler}) => {
    const history = useHistory();
    const classes = useStyles();

    const [loginError, setLoginError] = React.useState(false);
    const [passError, setPassError] = React.useState(false);
    const [userData, setUserData] = React.useState({username: '', password: '', error: ''});

    async function handleSubmit(event) {
        setLoginError(false);
        setPassError(false);

        event.preventDefault();
        setUserData({
            ...userData,
            error: ''
        });

        const {username, password} = userData;
        const url = `${constants.HOST_ADDRESS}/api/login`;

        console.log(userData);

        if (username.length === 0) {
            setLoginError(true);
            return
        }
        if (password.length === 0) {
            setPassError(true);
            return
        }

        console.log(url);

        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({username, password})
            });
            if (response.status === 200) {
                const {jwt_token, jwt_token_expiry} = await response.json();
                await login({jwt_token, jwt_token_expiry, loggedStateHandler})
            } else {
                console.log('Login failed.');
                let error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        } catch (error) {
            console.error(
                'error: ',
                error
            );

            const {response} = error;
            setUserData(
                Object.assign({}, userData, {
                    error: response ? response.statusText : error.message
                })
            )
        }
    }

    const homeButton = (e) => {
        e.preventDefault();
        e.stopPropagation();

        history.push("/");
    };

    if (isUserLogged) {
        return <Redirect to='/profile'/>
    }
    return (
        <div className='background-body-div'>
            <div className={classes.margin}>
                <ButtonBase onClick={homeButton}>
                    <LogoBig/>
                </ButtonBase>
            </div>
            <div className={classes.div}>
                <Card className={classes.root}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor='username'>
                                <Typography variant="h6" component="h2">
                                    {strings.login}
                                </Typography>
                            </label>

                            <div>
                                <Grid container spacing={1} alignItems="flex-end">
                                    <Grid item>
                                        <AccountCircle/>
                                    </Grid>
                                    <Grid item>
                                        <TextField error={loginError} id="username" label={strings.usernameOrEmail}
                                                   name='username'
                                                   helperText={loginError ? strings.emptyTextField : ''}
                                                   value={userData.username}
                                                   onChange={event =>
                                                       setUserData({
                                                           ...userData,
                                                           username: event.target.value
                                                       })}
                                                   style={{margin: 8}}
                                                   fullWidth
                                                   margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            </div>

                            <div>
                                <Grid container spacing={1} alignItems="flex-end">
                                    <Grid item>
                                        <VpnKeyIcon/>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            error={passError}
                                            helperText={passError ? strings.emptyTextField : ''}
                                            label={strings.password}
                                            type='password'
                                            id='password'
                                            name='password'
                                            value={userData.password}
                                            autoComplete="current-password"
                                            onChange={event =>
                                                setUserData({
                                                    ...userData,
                                                    password: event.target.value
                                                })
                                            }
                                            style={{margin: 8}}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </div>


                            <Button variant="outlined" color="primary" type='submit'>{strings.login}</Button>
                            {userData.error &&
                            <Typography color="secondary">
                                {userData.error}
                            </Typography>
                            }

                        </form>
                    </CardContent>
                </Card>
            </div>
            <div className='background-text'>
                GetNoted
            </div>
        </div>
    )
};
