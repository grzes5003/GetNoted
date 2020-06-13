const {v4} = require('uuid');
const {ApolloServer, MockList, gql, PubSub} = require('apollo-server');
const { importSchema } = require('graphql-import');

const typeDefs = importSchema('./schema/schema.graphql');
