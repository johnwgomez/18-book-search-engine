import express from 'express';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import db from './config/connection.js';
import routes from './routes/index.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = parseInt(process.env.PORT || '10000', 10); // Use the default Render port

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve Vite dist as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../../../client/dist')));

app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../../../client/dist/index.html'));
  });
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
