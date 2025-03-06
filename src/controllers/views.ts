import type { Middleware } from "../types/types.d.ts";

export default class ViewsController {
  static home: Middleware = (req, res, next) => {
    res.render("home", { style: "home.css" });
  };
}
