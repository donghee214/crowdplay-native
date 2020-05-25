import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-boost';

const cache = new InMemoryCache({
  addTypename: false
})

const client = new ApolloClient({
  uri: 'http://192.168.0.12:4000/graphql',
  onError: ({ operation, response, graphQLErrors, networkError, forward}) => {
    // console.log(response)
    // console.log(graphQLErrors)
    // console.log(networkError)
  },
  cache: cache,
  resolvers: {}
});

cache.writeData({
  data: {
      toast: {
          id: "",
          message: ""
      },
      user: {
        id: "",
        display_name: "",
        images: null
      }
  }
})

export default client