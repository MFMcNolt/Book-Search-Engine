const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../auth');

const resolvers = {
  Query: {
    // Example query to get all books
    books: async () => {
      try {
        const books = await Book.find();
        return books;
      } catch (err) {
        console.error(err);
        throw new Error('Error fetching books');
      }
    },

    // Example query to get the currently logged-in user
    me: async (_, __, context) => {
      if (context.user) {
        try {
          const user = await User.findById(context.user._id);
          return user;
        } catch (err) {
          console.error(err);
          throw new Error('Error fetching user');
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    // Example mutation to login
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError('Incorrect email or password');
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError('Incorrect email or password');
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error(err);
        throw new Error('Error during login');
      }
    },

    // Example mutation to add a user
    addUser: async (_, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error(err);
        throw new Error('Error adding user');
      }
    },

    // Example mutation to save a book for the logged-in user
    saveBook: async (_, { input }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $addToSet: { savedBooks: input } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          console.error(err);
          throw new Error('Error saving book');
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    // Example mutation to remove a book for the logged-in user
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $pull: { savedBooks: { _id: bookId } } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          console.error(err);
          throw new Error('Error removing book');
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
