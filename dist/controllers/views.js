import UserDAO from "../dao/mongoDB/users.js";
export default class ViewsController {
    static home = async (req, res, next) => {
        const user = req.user;
        const contacts = (await UserDAO.getContacts(user?._id.toString())).payload;
        res.render("home", { style: "home.css", contacts });
    };
    static login = async (req, res, next) => {
        res.render("login", { style: "auth.css" });
    };
    static register = async (req, res, next) => {
        res.render("register", { style: "auth.css" });
    };
}
