import { Router, Request, Response } from "express";
import { register, login, adminLogout } from "../controller/auth.admin";
import { formValidators, formLoginValidators, validatedResult, requiredAdminAuth, tokenVerificationCheck } from "../middleware/Validator";

const router = Router();

//routes
router.post("/register", formValidators, validatedResult, register);

router.post("/login", formLoginValidators, validatedResult, login);

router.post("/logout", requiredAdminAuth, adminLogout);

router.post("/tokenVerification", tokenVerificationCheck);
export default router;
