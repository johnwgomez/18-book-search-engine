// server/src/services/resolvers.ts

import User from '../models/User.js';
import { signToken } from './auth.js';
import { GraphQLError } from 'graphql';

// Shape we expect after authMiddleware runs
interface Context {
  user: {
    data: {
      _id: string;
      username: string;
      email: string;
    };
  } | null;
}

// Here's where I define all my GraphQL resolvers that handle the actual logic for queries and mutations.
export const resolvers = {
  Query: {
    // "me" lets a logged-in user get their own profile data.
    me: async (_parent: any, _args: any, context: Context) => {
      // First, I want to make sure the user is authenticated before I do anything else.
      if (!context.user) {
        // If they're not logged in, I let them know with a helpful error.
        throw new GraphQLError('Not logged in', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      // If they are logged in, I grab their user data from the database using their ID.
      return User.findById(context.user.data._id);
    },
  },

  Mutation: {
    // "addUser" lets a new user sign up with their username, email, and password.
    addUser: async (
      _parent: any,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      // I create a new user in the database with the info they provided.
      const user = await User.create({ username, email, password });
      // The user's _id might not be a string, so I make sure to convert it.
      const idStr = String(user._id);
      // After creating the user, I sign a JWT token for them so they're instantly logged in.
      const token = signToken({
        _id: idStr,
        username: user.username,
        email: user.email,
      });
      // I return both the token and the new user object.
      return { token, user };
    },

    // "login" lets an existing user log in with their email and password.
    login: async (
      _parent: any,
      { email, password }: { email: string; password: string }
    ) => {
      // First, I try to find a user with the given email.
      const user = await User.findOne({ email });
      if (!user) {
        // If no user exists with that email, I let them know.
        throw new GraphQLError('No user found with this email', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Now I check if the provided password matches the one in the database.
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        // If the password is wrong, I throw an error so they know to try again.
        throw new GraphQLError('Incorrect password', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // If everything checks out, I sign a JWT token for them.
      const idStr = String(user._id);
      const token = signToken({
        _id: idStr,
        username: user.username,
        email: user.email,
      });
      // And I return both the token and the user data.
      return { token, user };
    },

    // "saveBook" lets a logged-in user save a book to their profile.
    saveBook: async (
      _parent: any,
      { input }: { input: any },
      context: Context
    ) => {
      // Only logged-in users should be able to save books.
      if (!context.user) {
        throw new GraphQLError('You must be logged in', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      // I use MongoDB's $addToSet so the same book isn't saved twice.
      return User.findByIdAndUpdate(
        context.user.data._id,
        { $addToSet: { savedBooks: input } },
        { new: true, runValidators: true }
      );
    },

    // "removeBook" lets a logged-in user remove a book from their saved list.
    removeBook: async (
      _parent: any,
      { bookId }: { bookId: string },
      context: Context
    ) => {
      // Again, gotta make sure the user is logged in first!
      if (!context.user) {
        throw new GraphQLError('You must be logged in', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      // I use $pull to remove the book with the matching bookId from their savedBooks array.
      return User.findByIdAndUpdate(
        context.user.data._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};
