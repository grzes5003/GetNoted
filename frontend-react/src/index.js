import React from 'react';
import {render} from 'react-dom';
import {App} from './App';

import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {strings} from "./localization";

const cache = new InMemoryCache();

const GRAPHQL_BASE_URL = 'http://localhost:4000';

const httpLink = new HttpLink({
    uri: GRAPHQL_BASE_URL,
});

const client = new ApolloClient({
    link: httpLink,
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

