import User from "../models/User.js"; // Adjust the path as necessary
import Food from "../models/Food.js"; // Assuming Food is in models as well

// Add food to the cart
export const addToCart = async (req, res) => {
  const { userId, foodId, quantity, img } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the food item exists
    const foodItem = await Food.findById(foodId);
    if (!foodItem) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Check if the item already exists in the cart
    const existingCartItem = user.cart.find(
      (item) => item.product.toString() === foodId
    );

    if (existingCartItem) {
      // Update quantity if the item already exists in the cart
      existingCartItem.quantity += quantity;
    } else {
      // Add new item to the cart
      user.cart.push({ product: foodId, quantity });
    }

    // Save updated user
    await user.save();
    return res
      .status(200)
      .json({ message: "Item added to cart", cart: user.cart });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Remove food from the cart
export const removeFromCart = async (req, res) => {
  const { userId, foodId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the food item from the cart
    user.cart = user.cart.filter((item) => item.product.toString() !== foodId);

    // Save updated user
    await user.save();
    return res
      .status(200)
      .json({ message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Fetch user's cart
export const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ cart: user.cart });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
