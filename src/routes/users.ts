import { Router } from "express";
import UserController from "../controllers/users.ts";
import { auth } from "../middleware/auth.ts";
import { uploader } from "../middleware/uploader.ts";

const router = Router();
router.use(auth);
router.get("/:id", auth, UserController.getById);
router.get("/", auth, UserController.getAll);
router.post("/", UserController.create);
router.put("/updateProfilePhoto", auth, uploader.single("file"), UserController.updatePhoto);

export default router;
