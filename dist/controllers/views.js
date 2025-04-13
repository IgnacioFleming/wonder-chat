import UserDAO from "../dao/mongoDB/users.js";
export default class ViewsController {
    static home = async (req, res, next) => {
        const contacts = (await UserDAO.getContacts("67c21a97ef46abfc1c2785bd")).payload;
        console.log(contacts);
        res.render("home", { style: "home.css", contacts });
    };
}
