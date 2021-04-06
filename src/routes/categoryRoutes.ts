import { Router } from "express";
import { createCategory, getCategory, updateCategory, deleteCategories } from "../controller/category";
import { requiredAdminAuth, uploadPictures } from "../middleware/Validator";

const router = Router();

router.get("/getCategory", getCategory);
router.post("/createCategory", requiredAdminAuth, uploadPictures("single"), createCategory);
router.post("/update", requiredAdminAuth, uploadPictures("array"), updateCategory);
router.post("/delete", requiredAdminAuth, deleteCategories);

export default router;
