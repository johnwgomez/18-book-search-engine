// server/src/services/resolvers.ts
import User from '../models/User.js';
import { signToken } from './auth.js';
import { GraphQLError } from 'graphql';
export const resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (!context.user) {
                throw new GraphQLError('Not logged in', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            return User.findById(context.user.data._id);
        },
    },
    Mutation: {
        addUser: async (_parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            // Coerce _id to string
            const idStr = String(user._id);
            const token = signToken({
                _id: idStr,
                username: user.username,
                email: user.email,
            });
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new GraphQLError('No user found with this email', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new GraphQLError('Incorrect password', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            // Coerce _id to string
            const idStr = String(user._id);
            const token = signToken({
                _id: idStr,
                username: user.username,
                email: user.email,
            });
            return { token, user };
        },
        saveBook: async (_parent, { input }, context) => {
            if (!context.user) {
                throw new GraphQLError('You must be logged in', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            return User.findByIdAndUpdate(context.user.data._id, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true });
        },
        removeBook: async (_parent, { bookId }, context) => {
            if (!context.user) {
                throw new GraphQLError('You must be logged in', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            return User.findByIdAndUpdate(context.user.data._id, { $pull: { savedBooks: { bookId } } }, { new: true });
        },
    },
};
