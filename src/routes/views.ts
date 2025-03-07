import { Router } from "express";
import ViewsController from "../controllers/views.ts";

const router = Router();

router.get("/", ViewsController.home);

export default router;
