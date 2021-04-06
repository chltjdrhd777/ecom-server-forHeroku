import { Router } from "express";
import { requiredUserAuth } from "../middleware/Validator";
import { addAddress, deleteAddress, getAddress, recentlyUsedAddress } from "../controller/adress";

const router = Router();

router.get("/getAddress", requiredUserAuth, getAddress);
router.post("/addAddress", requiredUserAuth, addAddress);
router.post("/deleteAddreess", requiredUserAuth, deleteAddress);
router.post("/recentlyUsed", requiredUserAuth, recentlyUsedAddress);

export default router;
