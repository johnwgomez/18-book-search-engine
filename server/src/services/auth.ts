import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Load secret key and token expiration settings from environment
const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret';
const expiration = '1h';

// Define the structure of the context object used by Apollo Server resolvers
export interface GraphQLContext {
  user: {
    data: {
      _id: string;
      username: string;
      email: string;
    };
  } | null;
}

/**
 * authMiddleware
 * Extracts and verifies JWT from the request headers.
 * Returns a context object with user info if the token is valid.
 */
export const authMiddleware = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  const header = req.headers?.authorization || '';
  
  // Strip 'Bearer ' prefix if present and clean up the token
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : header;

  // Return null user if no token is provided
  if (!token) return { user: null };

  try {
    // Verify and decode token; extract the 'data' object containing user info
    const decoded = jwt.verify(token, secretKey) as {
      data: { _id: string; username: string; email: string };
    };
    return { user: { data: decoded.data } };
  } catch {
    // Return null user if token is invalid or verification fails
    return { user: null };
  }
};

/**
 * signToken
 * Signs a JWT containing the user info under a 'data' field.
 * Used during login and signup to generate tokens for authenticated sessions.
 */
export const signToken = (user: { _id: string; username: string; email: string }): string => {
  return jwt.sign({ data: user }, secretKey, { expiresIn: expiration });
};
