import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const refreshClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});