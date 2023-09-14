import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://countries.trevorblades.com",
  cache: new InMemoryCache(),
});

export const GET_COUNTRIES = gql`
  query Query {
    countries {
      name
      code
      phone
      native
      emoji
      currency
      continent {
        name
      }
      languages {
        name
      }
    }
  }
`;
