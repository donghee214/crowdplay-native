import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-boost';
import { BACKEND_URL_LOCAL, BACKEND_URL_PROD, ENV } from 'react-native-dotenv'

const getBaseUrl = ():string => {
  if(ENV === 'production'){
    return BACKEND_URL_PROD
  }
  if(ENV === 'development'){
    return BACKEND_URL_LOCAL
  }
  return ''
}


const cache = new InMemoryCache({
  addTypename: false
})

const client = new ApolloClient({
  uri: `${getBaseUrl()}/graphql`,
  onError: ({ operation, response, graphQLErrors, networkError, forward}) => {
    console.log(response)
    console.log(graphQLErrors)
    console.log(networkError)
  },
  cache: cache,
  resolvers: {},
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
      roomId: "",
      userHostRoomId: ""
  }
})

export default client