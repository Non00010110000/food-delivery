import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cart.controller.js"; // Adjust the path accordingly
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

// Routes for cart operations
router.post("/add", verifyToken, addToCart);
router.post("/remove", verifyToken, removeFromCart);
router.get("/:userId", verifyToken, getCart);

export default router;
