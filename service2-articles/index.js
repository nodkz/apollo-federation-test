const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const articles = Array.from(Array(10), (o, i) => {
  return { id: i, title: `Article ${i}`, authorId: i % 3 };
});

const typeDefs = gql`
  type Query {
    articles: [Article]
  }

  type Article @key(fields: "id") {
    id: ID!
    title: String
    authorId: Int
    author: User
  }

  extend type User @key(fields: "id") {
    id: ID! @external
  }
`;

const resolvers = {
  Query: {
    articles() {
      return articles;
    },
  },
  Article: {
    author: (s) => ({ id: s.authorId }),
    __resolveReference(article, ctx) {
      return articles[article.id];
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
