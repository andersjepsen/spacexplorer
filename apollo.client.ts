import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { withScalars } from "apollo-link-scalars";
import { buildClientSchema, IntrospectionQuery } from "graphql";
import introspection from "./api/introspection.json";

const schema = buildClientSchema(
  introspection as unknown as IntrospectionQuery
);

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API,
});

const link = ApolloLink.from([withScalars({ schema }), httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
