const {v4} = require('uuid');
const {ApolloServer, MockList, gql} = require('apollo-server');

let now = new Date();

const Tasks1 = ['WWW', 'JPWP', 'UST', 'TR', 'CPS'].map((str, index) => (
    {
        number: index,
        UUID: v4(),
        name: str,
        date: now.setDate(now.getDate() + index * 7),
        status: Math.random() >= 0.5
    }
));

const Tasks2 = ['Praca1', 'Praca2', 'CV'].map((str, index) => (
    {
        number: index,
        UUID: v4(),
        name: str,
        date: now.setDate(now.getDate() + index * 7),
        status: Math.random() >= 0.5
    }
));

const Tasks3 = ['Morskie', 'Gory'].map((str, index) => (
    {
        number: index,
        UUID: v4(),
        name: str,
        date: now.setDate(now.getDate() + index * 7),
        status: Math.random() >= 0.5
    }
));

const Tasks = [ Tasks1, Tasks2, Tasks3 ];

let Categories = ['Semestr Letni', 'Staż', 'Wakacje 2020'].map((str, index) => (
    {
        number: index,
        UUID: v4(),
        name: str,
        tasks: Tasks[index],
        date: now.setDate(now.getDate() + index * 7),
    }
));

const typeDefs = gql`
  scalar Date

  type Query {
    hello: String
    resolved: [Category]
    categories: [Category]
    people: [Person]
  }
  
  type Mutation {
    swapCategoryPlaces(first: Int!, second: Int!): Boolean
    addNewCategory
  }
  
  type Category {
    UUID: String
    number: Int
    name: String
    tasks: [Task]
    date: Date
  }
  
  type Task {
    number: Int
    UUID: String
    name: String
    date: Date
    status: Boolean
  }
  
  type Person {
    name: String
    age: Int
  }
`;

let tmpList = [0,1,2,3,4,5,6,7];

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
        categories: () =>  {
            return Categories
        }
    },
    Mutation: {
        swapCategoryPlaces: (_, s) => {
            [Categories[s.first], Categories[s.second]] = [Categories[s.second], Categories[s.first]];

            // let temp = tmpList[s.first];
            // tmpList[s.first] = tmpList[s.second];
            // tmpList[s.second] = temp;

            console.log('swaped places');
            //console.log(tmpList);
            return true;
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
