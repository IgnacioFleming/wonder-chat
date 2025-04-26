import type { Middleware, UserWithId } from "../types/types.d.ts";

export default class ViewsController {
  static home: Middleware = async (req, res, next) => {
    const user = req.user as UserWithId;
    res.render("home", { style: "home.css", name: user.full_name, url: user.photo || "/profile/uploads/avatar1.webp" });
  };
  static login: Middleware = async (req, res, next) => {
    res.render("login", { style: "auth.css" });
  };
  static register: Middleware = async (req, res, next) => {
    res.render("register", { style: "auth.css" });
  };
}
