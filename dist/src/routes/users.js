import { Router } from "express";
import UserController from "../controllers/users.js";
const router = Router();
router.get("/:id", UserController.getById);
router.get("/", UserController.getAll);
router.post("/", UserController.create);
export default router;
