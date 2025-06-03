const express = require("express");
const router = express.Router();
const User = require("../Model_Schema/usersSchema");
const jwt = require("jsonwebtoken");

// ✅ עוזר לנקות שדות מחרוזת
const isEmpty = (val) => !val || typeof val !== "string" || val.trim() === "";

// POST: הרשמה
router.post("/register", async (req, res) => {
  console.log("🧾 תוכן שנשלח:", req.body);

  try {
    const { username, password, email, phone, address, birthdate } = req.body;
    console.log("📤 כתובת:", address, "| typeof:", typeof address);

    // 🛡 ולידציה מוקדמת לפני כל גישה ל־DB
    if (isEmpty(username)) return res.status(400).json({ message: "שם משתמש הוא שדה חובה" });
    if (isEmpty(password)) return res.status(400).json({ message: "יש להזין סיסמה" });
    if (isEmpty(email)) return res.status(400).json({ message: "יש להזין אימייל" });
    if (isEmpty(address)) return res.status(400).json({ message: "כתובת היא שדה חובה" });

    // ✋ בדוק אם המשתמש כבר קיים לפי אימייל
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "אימייל זה כבר רשום במערכת." });
    }

    // ✅ צור משתמש חדש
    const newUser = new User({ username, password, email, phone, address, birthdate });

    await newUser.save();

    // 🎟 צור טוקן
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );


    return res.status(201).json({
      message: "נרשמת בהצלחה!",
      token,
      username: newUser.username
    });

  } catch (err) {
    console.error("❌ שגיאה בהרשמה:", err);

    if (err.name === "ValidationError") {
      const firstField = Object.keys(err.errors)[0];
      const validationMessage = err.errors[firstField].message;
      return res.status(400).json({ message: validationMessage });
    }

if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
  return res.status(409).json({
    message: "אימייל זה כבר רשום במערכת."
  });
}


    return res.status(500).json({ message: "שגיאה בשרת. נסה שוב מאוחר יותר." });
  }
});

module.exports = router;
