import { Router } from "express";
import ViewsController from "../controllers/views.ts";
import { auth } from "../middleware/auth.ts";

const router = Router();

router.get("/", auth, ViewsController.home);
router.get("/login", ViewsController.login);
router.get("/register", ViewsController.register);

export default router;
