import express from "express";
import { addProducts, getFoodItems } from "../controllers/Food.js";
import { verifyToken } from "../middleware/verifyUser.js";
import { authAdmin } from "../middleware/authAdmin.js";
const router = express.Router();

router.post("/add", verifyToken, authAdmin, addProducts);
router.get("/", verifyToken, getFoodItems);

export default router;
