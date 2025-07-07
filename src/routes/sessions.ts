import { Router } from "express";
import SessionsController from "../controllers/sessions.ts";
import passport from "passport";
import { STRATEGIES } from "../types/enums.js";
import { auth } from "../middleware/auth.ts";

const router = Router();

router.post("/register", passport.authenticate(STRATEGIES.REGISTER, { session: false }), SessionsController.register);
router.post("/login", passport.authenticate(STRATEGIES.LOGIN, { session: true }), SessionsController.login);
router.post("/demo-login", passport.authenticate(STRATEGIES.DEMO_LOGIN, { session: true }), SessionsController.demoLogin);

router.get("/current", auth, (req, res) => {
  res.send("Authorized");
});

router.post("/logout", auth, SessionsController.logout);

export default router;
