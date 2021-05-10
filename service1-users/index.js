const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const users = Array.from(Array(10), (o, i) => {
  return { id: i, username: `User${i}` };
});

const typeDefs = gql`
  type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    username: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[1];
    }
  },
  User: {
    __resolveReference(user, ctx) {
      return users[user.id];
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  context: a => {
    console.dir(a.req.body, { depth: 50 });
    return {};
  },
  formatResponse: r => {
    console.dir(r, { depth: 50 });
    return r;
  }
});

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
