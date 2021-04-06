import { Router, Request } from "express";
import { requiredAdminAuth, uploadPictures } from "../middleware/Validator";
import { createProduct, getProduct, getProductBySlug, getProductById } from "../controller/products";

const router = Router();

router.post("/createProduct", requiredAdminAuth, uploadPictures("array"), createProduct);

router.get("/getProduct", getProduct);
router.get("/:productSlug/:productId", getProductById);

router.get("/:slug", getProductBySlug);

export default router;
