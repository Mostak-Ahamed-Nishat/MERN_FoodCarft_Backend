import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, require: true },
  price: { type: Number, required: true },
});

const restaurantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  restaurantName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  deliveryPrice: {
    type: Number,
    required: true,
  },
  estimateDeliveryTime: {
    type: Number,
    required: true,
  },
  cuisine: [
    {
      type: String,
      required: true,
    },
  ],
  menuItem: [menuItemSchema],
  imageUrl: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;