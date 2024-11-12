import express from "express";

import { signin, signout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

// router.post("/cart", verifyToken, addToCart);
// router.get("/cart", verifyToken, getAllCartItems);
// router.patch("/cart", verifyToken, removeFromCart);

// router.post("/favorite", verifyToken, addToFavorites);
// router.get("/favorite", verifyToken, getUserFavorites);
// router.patch("/favorite", verifyToken, removeFromFavorites);

// router.post("/order", verifyToken, placeOrder);
// router.get("/order", verifyToken, getAllOrders);

export default router;
