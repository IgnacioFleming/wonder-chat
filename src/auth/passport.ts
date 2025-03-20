import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../types/types.js";
import UserDAO from "../dao/mongoDB/users.ts";
import { STATUSES, STRATEGIES } from "../types/enums.js";
const LocalStrategy = Strategy;
export const initializePassport = () => {
  passport.use(
    STRATEGIES.REGISTER,
    new LocalStrategy({ passReqToCallback: true, usernameField: "full_name" }, async (req, username, password, done) => {
      try {
        const { body }: { body: User } = req;
        const result = await UserDAO.create(body);
        if (result.status === STATUSES.ERROR) return done(result.error);
        return done(null, result.payload);
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
        console.log(result);
        if (result.status === STATUSES.ERROR) return done(null, false);
        if (result.payload.password !== password) return done(null, false);
        return done(null, result.payload);
      } catch (error) {
        done(error);
      }
    })
  );
};
