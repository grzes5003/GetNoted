import React from 'react';
import {render} from 'react-dom';
import {App} from './App';

import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import {ApolloLink, split} from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { getMainDefinition } from 'apollo-utilities';
import {InMemoryCache} from 'apollo-cache-inmemory';
import Cookies from 'universal-cookie';

import {strings} from "./localization";
import {constants} from "./constants";

const cache = new InMemoryCache();

//const GRAPHQL_BASE_URL_HTTP = 'http://localhost:4000/graphql';
//const GRAPHQL_BASE_URL_WS = 'ws://localhost:4000/graphql';

let PROD;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    PROD = false;
} else {
    PROD = true
}

// if production different variables are assigned
const GRAPHQL_BASE_URL_HTTP = PROD ? constants.HOST_ADDRESS + '/graphql' : 'http://192.168.99.100:4000/graphql';
const GRAPHQL_BASE_URL_WS = PROD ? constants.HOST_ADDRESS_WS + '/graphql' : 'ws://192.168.99.100:4000/graphql';

// authLink defines context for every request to server
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');

    console.log(headers);
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? token : "",
        }
    }
});


const cookies = new Cookies();

// definition of http graphql link
const httpLink = new HttpLink({
    uri: GRAPHQL_BASE_URL_HTTP,
});

// definition of websocket graphql link
const wsLink = new WebSocketLink({
    uri: GRAPHQL_BASE_URL_WS,
    options: {
        reconnect: true
    }
});

// link contains all previously defined links
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

// new apollo client
const client = new ApolloClient({
    link: authLink.concat(link),
    cache,
});

const pageLang = cookies.get('page_lang');

// if cookie page_lang exists, the value is check and page language set
// default language is english
if(pageLang) {
    strings.setLanguage(pageLang);
} else {
    strings.setLanguage('eng');
}

// entry point for app
render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

