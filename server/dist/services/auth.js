// server/src/services/auth.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret';
const expiration = '1h';
/**
 * Reads the Authorization header, verifies the JWT, and
 * returns { user } whose .data matches what signToken signed.
 */
export const authMiddleware = async ({ req, }) => {
    // Grab token from header
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : authHeader;
    if (!token) {
        return { user: null };
    }
    try {
        // Decode the full payload (we signed { data: user })
        const { data } = jwt.verify(token, secretKey);
        // Return exactly the shape resolvers expect
        return { user: { data } };
    }
    catch (err) {
        console.warn('Invalid token', err);
        return { user: null };
    }
};
/**
 * Signs a JWT with the user object under `data`.
 * Resolvers will find decoded.data matching this.
 */
export const signToken = (user) => {
    return jwt.sign({ data: user }, secretKey, {
        expiresIn: expiration,
    });
};
