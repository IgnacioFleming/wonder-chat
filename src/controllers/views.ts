import UserDAO from "../dao/mongoDB/users.ts";
import type { Middleware } from "../types/types.d.ts";

export default class ViewsController {
  static home: Middleware = async (req, res, next) => {
    const contacts = (await UserDAO.getContacts("67c21a97ef46abfc1c2785bd")).payload;
    res.render("home", { style: "home.css", contacts });
  };
}
