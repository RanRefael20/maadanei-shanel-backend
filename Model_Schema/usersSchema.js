const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    
    required: [true, "חובה להזין שם משתמש"],
    
    minlength: [2, "שם משתמש חייב להכיל לפחות 2 תווים"]
  },
  email: {
    type: String,
    required: [true, "חובה להזין אימייל"],
    unique: true,
    match: [/.+@.+\..+/, "יש להזין אימייל תקין עם @"]
  },
  password: {
    type: String,
    required: [true, "חובה להזין סיסמה"],
    minlength: [6, "סיסמה חייבת להיות לפחות 6 תווים"]
  },
  phone: {
    type: String,
    match: [/^\d{9,10}$/, "מספר טלפון לא תקין"]
  },



address: {
  type: String,
  required: [true, "חובה להזין כתובת"],
  validate: {
    validator: function (v) {
      return typeof v === "string" && v.trim().length > 0;
    },
    message: "כתובת לא יכולה להיות ריקה"
  }
},

  birthdate: {
    type: Date
  }


});

// הצפנת סיסמה לפני שמירה
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// פונקציית השוואת סיסמה
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
