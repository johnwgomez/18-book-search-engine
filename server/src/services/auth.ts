// Authentication middleware for GraphQL context integration

import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret';
const expiration = '1h';

// Expected shape of the user context injected into GraphQL resolvers
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
 * Extracts and verifies JWT from Authorization header.  
 * If valid, returns the user payload as context for GraphQL.  
 */
export const authMiddleware = async ({
  req,
}: {
  req: Request;
}): Promise<GraphQLContext> => {
  // Retrieve token from Authorization header
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader;

  if (!token) {
    return { user: null };
  }

  try {
    // Decode JWT and extract user payload
    const { data } = jwt.verify(token, secretKey) as {
      data: { _id: string; username: string; email: string };
    };
    // Return context formatted for resolvers
    return { user: { data } };
  } catch (err) {
    console.warn('Invalid token', err);
    return { user: null };
  }
};

/**
 * Creates a JWT containing user data under the 'data' key.  
 * Used for issuing tokens post-login or signup.  
 */
export const signToken = (user: {
  _id: string;
  username: string;
  email: string;
}): string => {
  return jwt.sign({ data: user }, secretKey, {
    expiresIn: expiration,
  });
};
