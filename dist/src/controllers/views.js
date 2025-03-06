export default class ViewsController {
    static home = (req, res, next) => {
        res.render("home", { style: "home.css" });
    };
}
