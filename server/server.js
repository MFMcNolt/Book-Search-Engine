const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');

// Import the Apollo Server
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = 3005;

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON data
app.use(express.json());

// If you're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Catch-all route where any route that isn't defined is treated as a 404 error
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client'));
});

// Start the Apollo server
const startServer = async () => {
  // Create a new Apollo server and pass in our schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
    persistedQueries: false,
  });

  // Start the Apollo server
  await server.start();

  // Integrate the Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // Log where to go to test the GQL API
  console.info(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);

  // Import Mongoose connections the first time the connection is opened
  db.once('open', () => {
    // Start the server on successful connection
    app.listen(PORT, () =>
      console.info(`🌍 Now listening on localhost:${PORT}`)
    );
  });
};

// Initialize the Apollo server
startServer();
