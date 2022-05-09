import * as path from 'path';
import * as fs from 'fs';
import { resolvers } from './resolvers/resolvers'
import { ApolloServer } from 'apollo-server-express';
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport';
import express from "express"
import passport from 'passport';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

declare global {
  namespace Express {
    interface User {
      id: number
    }
  }
}

const srcPath = path.join(__dirname, "../src");

const typeDefs = fs.readFileSync(
  path.join(srcPath, './schema/schema.graphql'),
  'utf8'
)

AppDataSource.initialize().then(async () => {
  const userRepository = AppDataSource.getRepository(User)

  passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {
      const users = await userRepository.find();
      const matchingUser = users.find(user => email === user.email && password === user.password);
      const error = matchingUser ? null : new Error('no matching user');
      done(error, matchingUser);
    }),
  );
  passport.serializeUser((user:Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id:number, done) => {
    const user = await userRepository.findOneBy({
      id: id
    });
    if (!user) return done('User Not Exist');
    return done(null, user);
  });

  const app = express();

  app.use(passport.initialize());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => buildContext({ req, res }),
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

});

