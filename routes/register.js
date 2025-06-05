const express = require("express");
const router = express.Router();
const User = require("../Model_Schema/usersSchema");
const jwt = require("jsonwebtoken");

// ✅ עוזר לנקות שדות מחרוזת
const isEmpty = (val) => !val || typeof val !== "string" || val.trim() === "";

// POST: הרשמה
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, email, phone, address, birthdate } = req.body;

    // 🛡 ולידציה מוקדמת
    if (isEmpty(username)) {
      return res.status(400).json({ success: false, message: "שם משתמש הוא שדה חובה" });
    }
    if (isEmpty(password)) {
      return res.status(400).json({ success: false, message: "יש להזין סיסמה" });
    }
    if (isEmpty(email)) {
      return res.status(400).json({ success: false, message: "יש להזין אימייל" });
    }
    if (isEmpty(address)) {
      return res.status(400).json({ success: false, message: "כתובת היא שדה חובה" });
    }

    // ✋ בדיקה אם כבר קיים משתמש
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "אימייל זה כבר רשום במערכת." });
    }

    // ✅ יצירת משתמש חדש
    const newUser = new User({ username, password, email, phone, address, birthdate });
    await newUser.save();

    // 🎟 טוקן התחברות
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      success: true,
      message: "נרשמת בהצלחה!",
      token,
      username: newUser.username,
    });
  } catch (err) {
    // שגיאת ולידציה ממונגוס
    if (err.name === "ValidationError") {
      const firstField = Object.keys(err.errors)[0];
      const validationMessage = err.errors[firstField].message;
      return res.status(400).json({ success: false, message: validationMessage });
    }

    // כפילות מפתח ייחודי (כמו אימייל)
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).json({ success: false, message: "אימייל זה כבר רשום במערכת." });
    }

    // העברת שגיאה לאמצעי טיפול גלובלי
    next(err);
  }
});

module.exports = router;
