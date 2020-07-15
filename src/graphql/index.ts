import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-boost';
import { BACKEND_URL } from 'react-native-dotenv'

console.log('fdsf', BACKEND_URL)

const cache = new InMemoryCache({
  addTypename: false
})

const client = new ApolloClient({
  uri: `${BACKEND_URL}/graphql`,
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
      },
      roomId: ""
  }
})

export default client