import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
};

// local host
const client = new ApolloClient({
  link: createHttpLink(
    {
      uri: "http://localhost:5000/hrai",
      credentials: 'same-origin'
    }),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export const execGql = function (gqlType, gqlTypeName, gqlVariables) {

  const promise = new Promise((resolve, reject) => {

    if (gqlType == 'mutation') {

      client.mutate({ mutation: gqlTypeName, variables: gqlVariables })
        .then(result => { resolve(result) })
        .catch(err => {

          const errorsGql = err.graphQLErrors.map(graphQLerror => graphQLerror.message);
          const errorMessageGql = errorsGql.join();
          reject({ 'errorsGql': errorsGql, 'errorMessageGql': errorMessageGql })
        })

    }
    if (gqlType == 'query') {

      client.query({ query: gqlTypeName, variables: gqlVariables })
        .then(result => { resolve(result) })
        .catch(err => {
          const errorsGql = err.graphQLErrors.map(graphQLerror => graphQLerror.message);
          const errorMessageGql = errorsGql.join();
          reject({ 'errorsGql': errorsGql, 'errorMessageGql': errorMessageGql })
        })

    }

  });
  return promise;
}


