import jsonServer from 'json-server';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const server = jsonServer.create();
const router = jsonServer.router(resolve(projectRoot, 'mock-server', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use((request, response, next) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return response.status(405).json({ error: 'The catalog API is read-only.' });
  }
  next();
});
server.use(router);

const port = Number(process.env.PORT ?? 3001);
server.listen(port, '0.0.0.0', () => {
  console.log(`Read-only catalog API listening on port ${port}`);
});