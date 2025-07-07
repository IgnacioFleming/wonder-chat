import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../types/types.js";
import UserDAO from "../dao/mongoDB/users.ts";
import { STATUSES, STRATEGIES } from "../types/enums.js";
import bcrypt from "bcrypt";
const LocalStrategy = Strategy;
export const initializePassport = () => {
  passport.use(
    STRATEGIES.REGISTER,
    new LocalStrategy({ passReqToCallback: true, usernameField: "full_name" }, async (req, username, password, done) => {
      try {
        const { body }: { body: User } = req;
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const result = await UserDAO.create({ ...body, password: hashedPassword });
        if (result.status === STATUSES.ERROR) return done(result.error);
        return done(null, result.payload);
      } catch (error) {
        done(error);
      }
    })
  );

  passport.use(
    STRATEGIES.DEMO_LOGIN,
    new LocalStrategy({ usernameField: "full_name" }, async (username, password, done) => {
      try {
        const result = await UserDAO.getbyFullName(username);
        if (result.status === STATUSES.SUCCESS) return done(null, result.payload);
        const demoPwd = "123";
        const createDemoUser = await UserDAO.create({ full_name: username, password: demoPwd });
        if (createDemoUser.status === STATUSES.ERROR) return done(createDemoUser.error);
        const demoUser = await UserDAO.getbyFullName(username);
        return done(null, demoUser.payload);
      } catch (error) {
        done(error);
      }
    })
  );

  passport.use(
    STRATEGIES.LOGIN,
    new LocalStrategy({ usernameField: "full_name" }, async (username, password, done) => {
      try {
        const result = await UserDAO.getbyFullName(username);
        if (result.status === STATUSES.ERROR) return done(null, false);
        const isValidPassword = await bcrypt.compare(password, result.payload.password);
        if (!isValidPassword) return done(null, false);
        return done(null, result.payload);
      } catch (error) {
        done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    const result = await UserDAO.getbyId(id);
    if (result.status !== STATUSES.SUCCESS) return done(null, false);
    return done(null, result.payload);
  });
};
