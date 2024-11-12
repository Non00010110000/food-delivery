import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    total_amount: {
      type: Number,
      required: true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for order tracking
OrderSchema.virtual("tracking_url").get(function () {
  return `/track-order/${this._id}`;
});

export default mongoose.model("Orders", OrderSchema);
