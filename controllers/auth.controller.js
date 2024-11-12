import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// User signup function
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check for required fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" }); // Use 400 for bad request
  }

  // Hash the password
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

// User signin function
// User signin function
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found")); // Correcting error handling
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials")); // Use next to forward error
    }

    // Generate JWT token
    const token = jwt.sign({ userId: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Save token to database
    validUser.token = token; // Store token
    await validUser.save(); // Ensure to save the user again with updated token

    // Log the token
    console.log("Generated Token: ", token);

    // Preparing the user data to return
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // Calculate 1 hour expiry time

    // Create HTTP-only cookie with the token
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTP only in production
        sameSite: "Strict",
        expires: expiryDate,
      })
      .status(200)
      .json(rest); // Respond with user data excluding hashed password
  } catch (error) {
    next(error); // Catch any errors
  }
};

// User signout function
export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout success!");
};
