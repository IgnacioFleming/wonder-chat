import { Router } from "express";
import ViewsController from "../controllers/views.ts";

const router = Router();

router.get("/", ViewsController.home);
router.get("/login", ViewsController.login);
router.get("/register", ViewsController.register);

export default router;
