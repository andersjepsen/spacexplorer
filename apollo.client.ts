import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { withScalars } from "apollo-link-scalars";
import { buildClientSchema, IntrospectionQuery } from "graphql";
import introspection from "./api/introspection.json";

const schema = buildClientSchema(
  introspection as unknown as IntrospectionQuery
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API,
});

const link = ApolloLink.from([errorLink, withScalars({ schema }), httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          launches: offsetLimitPagination(),
        },
      },
    },
  }),
});

export default client;
