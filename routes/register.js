const express = require("express");
const router = express.Router();
const User = require("../Model_Schema/usersSchema");

// POST: הרשמה
router.post("/register", async (req, res) => {
  const { username, password, email, phone, birthdate } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "אימייל זה כבר רשום במערכת." });
    }

    const newUser = new User({ username, password, email, phone, birthdate });
    await newUser.save();

    console.log("👤 משתמש חדש נשמר:", newUser);
    res.status(201).json({ message: "נרשמת בהצלחה!", user: newUser });

  } catch (err) {
    console.error("❌ שגיאה בהרשמה:", err);

    // 🧠 שגיאת ולידציה של Mongoose
    if (err.name === "ValidationError") {
      const firstField = Object.keys(err.errors)[0];
      const validationMessage = err.errors[firstField].message;
      return res.status(400).json({ message: validationMessage });
    }

    // 🧠 שגיאת Duplicate Key (למשל username קיים)
    if (err.code === 11000) {
      const duplicatedField = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        message: `ה-${duplicatedField} שהזנת כבר קיים במערכת`
      });
    }

    res.status(500).json({ message: "שגיאה בשמירה למאגר" });
  }
});

module.exports = router;
