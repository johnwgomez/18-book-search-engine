// server/src/server.ts

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import db from './config/connection.js';
import { typeDefs } from './services/typeDef.js';
import { resolvers } from './services/resolvers.js';
import { authMiddleware } from './services/auth.js';

const PORT = process.env.PORT || 3001;

async function startServer() {
  // Step 1: Set up the Apollo GraphQL server
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  // Step 2: Set up Express so we can handle incoming requests
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Step 3: Connect Apollo Server to our Express app using middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => authMiddleware({ req }),
    })
  );

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  // Step 4: Start the server and listen on the specified port
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`);
  });

  // Step 5: Log MongoDB connection events so we know if it works or not
  db.on('error', (err) => console.error('❌ MongoDB connection error:', err));
  db.once('open', () => console.log('✅ MongoDB connected'));
}

// Finally, run everything to launch our app
startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
