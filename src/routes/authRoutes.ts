import { Router } from "express";
import { requiredUserAuth, tokenVerificationCheck } from "../middleware/Validator";
import { register, login, logout } from "../controller/auth";

const router = Router();

//routes
router.post("/register", register);

router.post("/login", login);

router.post("/logout", requiredUserAuth, logout);

router.post("/tokenVerification", tokenVerificationCheck);

export default router;
