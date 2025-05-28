const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "חובה להזין שם משתמש"],
    unique: true,
    minlength: [2, "שם משתמש חייב להכיל לפחות 2 תווים"]
  },
  email: {
    type: String,
    required: [true, "חובה להזין אימייל"],
    match: [/.+@.+\..+/, "יש להזין אימייל תקין עם @"]
  },
  password: {
    type: String,
    required: [true, "חובה להזין סיסמה"],
    minlength: [6, "סיסמה חייבת להיות לפחות 6 תווים"]
  },
  phone: {
    type: String,
    required: [true, "יש להזין מספר טלפון"],
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: "יש להזין מספר טלפון בן 10 ספרות"
    }
  },
  birthdate: {
    type: String // ללא ולידציה כרגע
  },
  coupons: [
    {
      code: String,
      discount: Number
    }
  ]
});

// הצפנת סיסמה לפני שמירה
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// בדיקת סיסמה
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
