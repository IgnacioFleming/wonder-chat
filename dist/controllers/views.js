export default class ViewsController {
    static home = async (req, res, next) => {
        res.render("home", { style: "home.css" });
    };
    static login = async (req, res, next) => {
        res.render("login", { style: "auth.css" });
    };
    static register = async (req, res, next) => {
        res.render("register", { style: "auth.css" });
    };
}
