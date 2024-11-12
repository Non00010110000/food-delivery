import express from "express";
const router = express.Router();
import {
  placeOrder,
  getAllOrders,
  handelPayments,
} from "../controllers/order.controller.js";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(createError(401, "You are not authenticated!"));
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(createError(401, "You are not authenticated!"));

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decode.userId;
    req.user = decode;

    return next();
  } catch (err) {
    next(err);
  }
};

router.post("/place-order", verifyToken, placeOrder);
router.get("/orders", verifyToken, getAllOrders); // Changed to use query or userId from token
router.post("/:orderId/checkout", verifyToken, handelPayments);
export default router;
