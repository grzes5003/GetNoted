import React from 'react';
import {render} from 'react-dom';
import {App} from './App';

import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {strings} from "./localization";

const cache = new InMemoryCache();

//const GRAPHQL_BASE_URL_HTTP = 'http://localhost:4000/graphql';
//const GRAPHQL_BASE_URL_WS = 'ws://localhost:4000/graphql';
const GRAPHQL_BASE_URL_HTTP = 'http://192.168.99.100:4000/graphql';
const GRAPHQL_BASE_URL_WS = 'ws://192.168.99.100:4000/graphql';

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
    link: link,
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

