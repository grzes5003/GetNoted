import React from "react";
import {Redirect} from "react-router-dom";
import {constants} from "../../constants";
import {login} from "../utils/auth";

export const LoginPage = ({isUserLogged, loggedStateHandler}) => {

    const [userData, setUserData] = React.useState({ username: '', password: '', error: '' });

    async function handleSubmit (event) {
        event.preventDefault();
        setUserData({
            ...userData,
            error: ''
        });

        const { username, password } = userData;
        const url = `${constants.HOST_ADDRESS}/api/login`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({ username, password })
            });
            if (response.status === 200) {
                const { jwt_token, jwt_token_expiry } = await response.json();
                await login({ jwt_token, jwt_token_expiry, loggedStateHandler })
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

            const { response } = error;
            setUserData(
                Object.assign({}, userData, {
                    error: response ? response.statusText : error.message
                })
            )
        }
    }

    if(isUserLogged) {
        return <Redirect to='/profile'/>
    }
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Login</label>

            <input
                type='text'
                id='username'
                name='username'
                value={userData.username}
                onChange={event =>
                    setUserData({
                        ...userData,
                        username: event.target.value
                    })
                }
            />
            <input
                type='password'
                id='password'
                name='password'
                value={userData.password}
                onChange={event =>
                    setUserData({
                        ...userData,
                        password: event.target.value
                    })
                }
            />

            <button type='submit'>Login</button>

            {userData.error && <p className='error'>Error: {userData.error}</p>}
        </form>
    )
};
