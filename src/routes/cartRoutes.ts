import { Router } from "express";
import { createCart } from "../controller/cart";
import { requiredUserAuth } from "../middleware/Validator";

const router = Router();

router.post("/createCart", requiredUserAuth, createCart);

export default router;
