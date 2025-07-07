const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  username: { type: String, required: true },
  email:    { type: String, required: true },
  phone:    { type: String },
  address:  { type: String, required: true },
  items: [
    {
      name: String,
      quantity: { type: Number, default: 1 },
      price: Number,
    }
  ],
  priceFirst:{ type: Number, required: true },
  usedPoints: { type: Number, default: 0 }, // ✅ נקודות שמומשו
  totalPrice: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v >= 500,
      message: "מינימום להזמנה 500 שח",
    },
  },

  earnedPoints: { type: Number, default: 0 }, // ✅ נקודות חדשות
  status: {
    type: String,
    enum: ["הוזמן", "בתהליך", "נשלח", "בוטל"],
    default: "הוזמן"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
    when: {
    type: Date,
    required: true,
    
  },
  orderNumber: {
  type: String,
  required: true,
  unique: true,
}
});

module.exports = mongoose.model("Order", orderSchema);
