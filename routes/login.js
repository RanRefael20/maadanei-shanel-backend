const express = require("express");
const router = express.Router();
const User = require("../Model_Schema/usersSchema");

// POST /login – התחברות
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "אימייל לא נמצא במערכת" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "סיסמה שגויה" });
    }

    res.status(200).json({
      message: "התחברת בהצלחה!",
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("❌ שגיאה בהתחברות:", err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

module.exports = router;
