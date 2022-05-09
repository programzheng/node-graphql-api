import passport from 'passport'
const LocalStrategy = require('passport-local').Strategy;
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"

declare global {
  namespace Express {
    interface User {
      id: number
    }
  }
}

const userRepository = AppDataSource.getRepository(User);

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

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await userRepository.findOneBy({
      email: email
    });
    if (!user) {
      return done(null, false, 'Invalid Credentials');
    }
    if (user.password !== password) {
      return done(null, false, 'Invalid credentials');
    }
    return done(null, user);
  })
);

function login({email, password, req}:{email:string, password:string, req:any}){
  return new Promise<any>((resolve, reject) => {
    console.log(req);
    passport.authenticate('local', (err, user) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        return reject(new Error('Invalid credentials.'));
      }

      return req.login(user, () => resolve(user));
    })({ body: { email, password } });
  })
}

export default { login };
