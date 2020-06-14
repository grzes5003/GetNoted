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

import {strings} from "./localization";

const cache = new InMemoryCache();

//const GRAPHQL_BASE_URL_HTTP = 'http://localhost:4000/graphql';
//const GRAPHQL_BASE_URL_WS = 'ws://localhost:4000/graphql';
const GRAPHQL_BASE_URL_HTTP = 'http://192.168.99.100:4000/graphql';
const GRAPHQL_BASE_URL_WS = 'ws://192.168.99.100:4000/graphql';


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



// const authLink = new ApolloLink((operation, forward) => {
//     // get the authentication token from local storage if it exists
//     const token = localStorage.getItem('token');
//     // return the headers to the context so httpLink can read them
//
//     console.log('token is: ', token);
//
//
//     operation.setContext({
//         headers: {
//             authorization: token ? token : ''
//         }
//     });
//
//     return forward(operation);
// });

const httpLink = new HttpLink({
    uri: GRAPHQL_BASE_URL_HTTP,
});

const wsLink = new WebSocketLink({
    uri: GRAPHQL_BASE_URL_WS,
    options: {
        reconnect: true
    }
});

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

const client = new ApolloClient({
    link: authLink.concat(link),
    cache,
});

strings.setLanguage('pl');

render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

