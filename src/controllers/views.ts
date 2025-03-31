import type { Middleware } from "../types/types.d.ts";

export default class ViewsController {
  static home: Middleware = async (req, res, next) => {
    res.render("home", { style: "home.css" });
  };
  static login: Middleware = async (req, res, next) => {
    res.render("login", { style: "auth.css" });
  };
  static register: Middleware = async (req, res, next) => {
    res.render("register", { style: "auth.css" });
  };
}
