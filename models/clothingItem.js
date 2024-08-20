const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Clothing item name field is required."],
    minlength: 2,
    maxlength: 30,
    message: "You must enter a name for this item",
  },
  imageUrl: {
    type: String,
    required: [true, "The clothing image URL field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  weather: {
    type: String,
    enum: ["hot", "warm", "cold"],
    required: [true, "The weather type is required."],
    message: "You must choose the appropriate weather for this item.",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
