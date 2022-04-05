import * as path from 'path';
import * as fs from 'fs';
import { resolvers } from './resolvers/resolvers'
import { ApolloServer } from 'apollo-server-express';
import express from 'express';

const srcPath = path.join(__dirname, "../src");

const typeDefs = fs.readFileSync(
  path.join(srcPath, './schema/schema.graphql'),
  'utf8'
)

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = parseInt(process.env.PORT || '3000');
app.get('/', (_:any, res:any) => {
  res.send('The server is working!');
});
app.listen(port, async () => {
  await server.start();
  server.applyMiddleware({ app });
  console.log(`server is listening on ${port} !!!`);
});
