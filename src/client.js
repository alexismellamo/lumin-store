import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "https://pangaea-interviews.now.sh/api/graphql"
});

export default client;
