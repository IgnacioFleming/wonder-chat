import { Router } from "express";
import SessionsController from "../controllers/sessions.ts";
import passport from "passport";
import { STRATEGIES } from "../types/enums.js";

const router = Router();

router.post("/register", passport.authenticate(STRATEGIES.REGISTER, { session: false }), SessionsController.register);
router.post("/login", passport.authenticate(STRATEGIES.LOGIN, { session: false }), SessionsController.login);

export default router;
