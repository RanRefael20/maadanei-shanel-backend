// Model_Schema/ordersSchema.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // השם של המודל שלך ב־usersSchema
    required: true
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: Number,
  status: {
    type: String,
    enum: ["הוזמן", "בתהליך", "נשלח", "בוטל"],
    default: "הוזמן"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
