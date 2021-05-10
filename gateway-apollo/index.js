const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'users', url: 'http://localhost:4001' },
    { name: 'articles', url: 'http://localhost:4002' },
    { name: 'comments', url: 'http://localhost:4003' },
  ],
  buildService: (service) => {
    return new RemoteGraphQLDataSource({
      url: service.url,
      willSendRequest: ({ request }) => {
        // console.log(request.query);
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  // reporting: true
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
