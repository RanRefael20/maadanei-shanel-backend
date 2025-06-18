const mongoose = require("mongoose");

// תת-סכימה לפריט בודד
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "יש להזין שם פריט"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "יש להזין מחיר לפריט"],
    min: [0, "מחיר לא יכול להיות שלילי"]
  },
   category: {
    type: String, // ✅ חייב להיות type
    required: false
  }
});

const savedMenuSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "חובה לציין מזהה משתמש"]
  },
  name: {
    type: String,
    required: [true, "יש להזין שם לתפריט"],
    trim: true,
    minlength: [2, "שם התפריט חייב להכיל לפחות 2 תווים"]
  },
  items: {
    type: [itemSchema],
    validate: {
      validator: function(arr) {
        return Array.isArray(arr) && arr.length > 0;
      },
      message: "יש להזין לפחות פריט אחד בתפריט"
    }
  },
  total: {
    type: Number,
    required: [true, "יש להזין סך כולל לתפריט"],
    min: [0, "הסכום הכולל לא יכול להיות שלילי"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SavedMenu", savedMenuSchema);
