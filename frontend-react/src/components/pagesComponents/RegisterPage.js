import React from "react";
import {Redirect} from "react-router-dom";
import {constants} from "../../constants";
import {login} from "../utils/auth";

export const RegisterPage = ({isUserLogged, loggedStateHandler}) => {

    const [userData, setUserData] = React.useState({ email: '', username: '', password: '', error: '' });

    async function handleSubmit (event) {
        event.preventDefault();
        setUserData({
            ...userData,
            error: ''
        });

        const { email, username, password } = userData;
        const url = `${constants.HOST_ADDRESS}/api/register`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({ email, username, password })
            });
            if (response.status === 200) {
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
            <label htmlFor='username'>Register</label>

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
                type='text'
                id='email'
                name='email'
                value={userData.username}
                onChange={event =>
                    setUserData({
                        ...userData,
                        email: event.target.value
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

            <button type='submit'>Register</button>

            {userData.error && <p className='error'>Error: {userData.error}</p>}
        </form>
    )
};
