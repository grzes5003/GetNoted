import React from "react";
import {Redirect} from "react-router-dom";
import {constants} from "../../constants";
import {login} from "../utils/auth";
import Grid from "@material-ui/core/Grid";
import {AccountCircle} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import {strings} from "../../localization";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {makeStyles} from "@material-ui/core/styles";
import EmailIcon from '@material-ui/icons/Email';
import Button from "@material-ui/core/Button";

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


export const RegisterPage = ({isUserLogged, loggedStateHandler}) => {
    const classes = useStyles();

    const [emailErrorText, setEmailErrorText] = React.useState('');
    const [loginError, setLoginError] = React.useState(false);
    const [passError, setPassError] = React.useState(false);
    const [userData, setUserData] = React.useState({email: '', username: '', password: '', error: '', response: ''});

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    async function handleSubmit(event) {
        setLoginError(false);
        setPassError(false);
        setEmailErrorText('');

        event.preventDefault();
        setUserData({
            ...userData,
            error: '',
            response: '',
        });

        const {email, username, password} = userData;
        const url = `${constants.HOST_ADDRESS}/api/register`;


        if(email.length === 0 ){
            setEmailErrorText(strings.emptyTextField);
            return
        }
        if(!validateEmail(email)){
            setEmailErrorText(strings.badEmail);
            return
        }
        if(username.length === 0){
            setLoginError(true);
            return
        }
        if(password.length === 0){
            setPassError(true);
            return
        }


        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({email, username, password})
            });
            if (response.status === 200) {
                setUserData(
                    Object.assign({}, userData, {
                        response: response ? response.statusText : ''
                    })
                );

                return <Redirect to='/login'/>
            } else {
                console.log('Registration failed.');
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

    if (isUserLogged) {
        return <Redirect to='/profile'/>
    }
    return (
        <div className={classes.div}>
            <Card className={classes.root}>
                <CardContent>
                    <form onSubmit={handleSubmit}>

                        <label htmlFor='username'>
                            <Typography variant="h5" component="h2">
                                {strings.register}
                            </Typography>
                        </label>

                        <div>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <EmailIcon/>
                                </Grid>
                                <Grid item>
                                    <TextField error={emailErrorText.length !== 0} id="email" label={strings.email}
                                               name='email'
                                               helperText={emailErrorText.length !== 0 ? emailErrorText : ''}
                                               value={userData.email}
                                               onChange={event =>
                                                   setUserData({
                                                       ...userData,
                                                       email: event.target.value
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
                                    <AccountCircle/>
                                </Grid>
                                <Grid item>
                                    <TextField error={loginError} id="username" label={strings.username}
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


                        <Button variant="outlined" color="primary" type='submit'>{strings.register}</Button>

                        {userData.error &&
                        <Typography color="secondary">
                            {userData.error}
                        </Typography>
                        }
                        {userData.response &&
                        <Typography color="primary">
                            {userData.response}
                        </Typography>
                        }
                    </form>
                </CardContent>
            </Card>
        </div>
    )
};
