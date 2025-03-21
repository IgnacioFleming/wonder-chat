import { Router } from "express";
import ViewsController from "../controllers/views.ts";

const router = Router();

router.get("/conversations", ViewsController.home);
router.get("/", (req, res) => res.redirect("/conversations"));
router.get("/login", ViewsController.login);
router.get("/register", ViewsController.register);

export default router;
