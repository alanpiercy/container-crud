import React, { Component } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import Container from '@material-ui/core/Container';

import Job from "./job/Job";

const URL = "http://127.0.0.1:4000";
//const URL = "http://127.0.0.1:4000/graphql";
const httpLink = new HttpLink({
  uri: URL,
});
const cache = new InMemoryCache();
const client = new ApolloClient({
  link: httpLink,
  cache,
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-4">
                </div>
                <div className="col-sm-4">
                </div>
                <div className="col-sm-4">
                  <div className="pull-right">
                  </div>
                </div>
              </div>
            </div>
          </header>
          <Container>
          <h3>Container Manager</h3>
          <Job />
          </Container>
        </div>
      </ApolloProvider>
    );
  }
}
export default App;