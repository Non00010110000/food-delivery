// Import necessary modules
import mongoose from "mongoose";
import Food from "../models/Food.js";
import User from "../models/User.js";

// Add Products Controller
export const addProducts = async (req, res, next) => {
  try {
    const foodData = req.body;

    // Check if foodData is an array
    if (!Array.isArray(foodData)) {
      return res
        .status(400)
        .json({ error: "Invalid request. Expected an array of foods." });
    }

    // Check if user is an admin
    const adminUser = await User.findById(req.userId);
    if (!adminUser.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Optionally validate and sanitize foodData here

    // Insert multiple food items at once
    const createdFoods = await Food.insertMany(foodData);

    return res
      .status(201)
      .json({ message: "Products added successfully", createdFoods });
  } catch (err) {
    next(err);
  }
};

// Get Food Items Controller
export const getFoodItems = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, ingredients, search } = req.query;
    ingredients = ingredients?.split(",").filter(Boolean);
    categories = categories?.split(",").filter(Boolean);

    const filter = {};

    // Filtering by categories
    if (categories && Array.isArray(categories) && categories.length) {
      filter.category = { $in: categories };
    }

    // Filtering by ingredients
    if (ingredients && Array.isArray(ingredients) && ingredients.length) {
      filter.ingredients = { $in: ingredients };
    }

    // Filtering by price range
    if (maxPrice || minPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price["$gte"] = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter.price["$lte"] = parseFloat(maxPrice);
      }
    }

    // Searching by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { desc: { $regex: new RegExp(search, "i") } },
      ];
    }

    // Fetching food items based on filter
    const foodList = await Food.find(filter);

    return res.status(200).json(foodList);
  } catch (err) {
    next(err);
  }
};

// Middleware for Admin Authentication (for completeness)
export const authAdmin = async (req, res, next) => {
  try {
    const userId = req.userId; // Assuming userId is set in request after verification
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Proceed if user is an admin
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
