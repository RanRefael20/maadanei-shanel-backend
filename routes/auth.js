const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../Model_Schema/usersSchema");


router.post("/login", async (req, res) => {
  const { email, password } = req.body;


  try {
    const user = await User.findOne({ email });
   if (!user) {
      return res.status(401).json({ message: "האימייל לא רשום במערכת" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "הסיסמה שגוילללללה" });
    }

    // ✅ יצירת טוקן עם JWT_SECRET מה־.env
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "20d" }
);



    // ✅ שליחת טוקן + פרטים נוספים
res.json({
  message: "התחברת בהצלחה!",
  token: token,
  username: user.username,
  email: user.email
});

  } catch (err) {
    console.error("❌ שגיאה בהתחברות:", err);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

module.exports = router;
