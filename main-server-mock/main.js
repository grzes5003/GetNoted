const {v4} = require('uuid');
const {ApolloServer, MockList, gql} = require('apollo-server');


const Tasks = ['WWW', 'JPWP', 'UST', 'TR', 'CPS'].map((str, index) => (
    {
        number: index,
        UUID: v4(),
        name: str,
    }
));

const Notes = ['Semestr Letni', 'Staż'].map((str, index) => (
    {
        number: index,
        UUID: v4(),
        name: str,
        tasks: Tasks,
    }
));

const typeDefs = gql`
  type Query {
    hello: String
    resolved: [Note]
    notes: [Note]
    people: [Person]
  }
  
  type Note {
    UUID: String
    number: Int
    name: String
    tasks: [Task]
  }
  
  type Task {
    number: Int
    UUID: String
    name: String
  }
  
  type Person {
    name: String
    age: Int
  }
`;

const resolvers2 = {
    Query: {
        resolved: () => 'Resolved',
        people: () => new MockList([5, 12]),
        notes: () => new MockList([7, 12])
    },
};

const resolvers = {
    Query: {
        resolved: () => 'Resolved',
        people: () => new MockList([5, 12]),
        notes: () =>  {
            return Notes
        }
    }
};

const mocks = {
    Int: () => Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
    Float: () => 22.1,
    String: () => v4(),//'some String',
    Person: () => ({
        name: "name",
        age: () => 15,
    }),
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // mocks: mocks,
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`)
});
