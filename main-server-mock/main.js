const {ApolloServer, MockList, gql} = require('apollo-server');

const typeDefs = gql`
  type Query {
    hello: String
    resolved: [Note]
    notes: [Note]
    people: [Person]
  }
  
  type Note {
    name: String
    tasks: [Task]
  }
  
  type Task {
    name: String
  }
  
  type Person {
    name: String
    age: Int
  }
`;

const resolvers = {
    Query: {
        resolved: () => 'Resolved',
        people: () => new MockList([5, 12]),
        notes: () => new MockList([7, 12])
    },
};

const mocks = {
    Int: () => 6,
    Float: () => 22.1,
    String: () => 'some String',
    Person: () => ({
        name: "name",
        age: () => 15,
    }),
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    mocks: mocks,
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`)
});
