import UserDAO from "../dao/mongoDB/users.ts";
import type { Middleware, UserWithId } from "../types/types.d.ts";

export default class ViewsController {
  static home: Middleware = async (req, res, next) => {
    const user = req.user as UserWithId;
    const contacts = (await UserDAO.getContacts(user?._id.toString())).payload;
    res.render("home", { style: "home.css", contacts });
  };
  static login: Middleware = async (req, res, next) => {
    res.render("login", { style: "auth.css" });
  };
  static register: Middleware = async (req, res, next) => {
    res.render("register", { style: "auth.css" });
  };
}
