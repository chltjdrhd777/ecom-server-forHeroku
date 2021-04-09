import { Router, Request } from "express";
import { requiredUserAuth } from "../middleware/Validator";
import { getPaymentInfo, createPaymentInfo } from "../controller/payment";

const router = Router();
router.get("/getPaymentInfo", requiredUserAuth, getPaymentInfo);
router.post("/createPaymentInfo", requiredUserAuth, createPaymentInfo);

export default router;
