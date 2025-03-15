import { Router } from "express";
import ContactController from "../controllers/contacts.ts";

const router = Router();

router.get("/:id", ContactController.getAll);

export default router;
