import { Router } from "express";
import UserController from "../controllers/users.ts";

const router = Router();

router.get("/:id", UserController.getById);
router.post("/", UserController.create);

export default router;
