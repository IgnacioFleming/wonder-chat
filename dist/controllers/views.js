import UserDAO from "../dao/mongoDB/users.js";
export default class ViewsController {
    static home = async (req, res, next) => {
        const contacts = (await UserDAO.getContacts("67c21a97ef46abfc1c2785bd")).payload;
        res.render("home", { style: "home.css", contacts });
    };
    static login = async (req, res, next) => {
        res.render("login", { style: "auth.css" });
    };
    static register = async (req, res, next) => {
        res.render("register", { style: "auth.css" });
    };
}
