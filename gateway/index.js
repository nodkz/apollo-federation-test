const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'accounts', url: 'http://localhost:4001' },
    { name: 'articles', url: 'http://localhost:4002' }
    // more services
  ]
});

const server = new ApolloServer({
  gateway,
  subscriptions: false
  // reporting: true
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
