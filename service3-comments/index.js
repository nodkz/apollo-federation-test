const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const comments = Array.from(Array(100), (o, i) => {
  return { id: i, text: `Comment ${i}`, articleId: i % 3, authorId: i % 6 };
});

const typeDefs = gql`
  type Query {
    comments: [Comment]
  }

  type Comment @key(fields: "id") {
    id: ID!
    text: String
    articleId: Int
    article: Article
    authorId: Int
    author: User
  }

  extend type User @key(fields: "id") {
    id: ID! @external
  }

  extend type Article @key(fields: "id") {
    id: ID! @external
    comments: [Comment]
  }
`;

const resolvers = {
  Query: {
    comments() {
      return comments;
    },
  },
  Comment: {
    author: (s) => ({ id: s.authorId }),
    article: (s) => ({ id: s.articleId }),
  },
  Article: {
    comments: (s) => {
      return comments.filter((c) => c.articleId == s.id);
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

server.listen(4003).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

setTimeout(() => {
  // server.stop();
}, 10000);
