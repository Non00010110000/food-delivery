// middleware/authAdmin.js

import User from "../models/User.js"; // Adjust the path to your User model as needed

export const authAdmin = async (req, res, next) => {
  try {
    const userId = req.userId; // Assuming the userId is attached to the request object after token verification
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // User is an admin, proceed to the next middleware/route handler
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
