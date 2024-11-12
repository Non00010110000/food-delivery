import jwt from "jsonwebtoken";
import { createError } from "../error.js";
export const verifyToken = async (req, res, next) => {
  try {
    // Check if the Authorization header is present
    if (!req.headers.authorization) {
      return next(createError(401, "You are not authenticated!"));
    }

    // Get the token from the Authorization header (Bearer token structure)
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(createError(401, "You are not authenticated!"));

    // Decode the token using the secret key
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // Assign the userId to req.userId for further use in the application
    req.userId = decode.userId; // Adjust according to your JWT structure
    req.user = decode; // You can still store the full user object if needed

    return next(); // Call the next middleware
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
};
