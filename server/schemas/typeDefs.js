const { gql } = require('apollo-server-express');

// Define GraphQL types using the gql tag
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    books: [Book]  # Add this line
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookInput: BookInput!): User
    removeBook(bookId: ID!): User
  }

  input BookInput {
    authors: [String]
    description: String
    title: String
    bookId: ID
    image: String
    link: String
  }
`;

module.exports = typeDefs;
