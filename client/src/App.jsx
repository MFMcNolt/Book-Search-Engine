import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: '/graphql', // Adjust the URI based on your server setup
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ApolloProvider>
  );
}

export default App;
