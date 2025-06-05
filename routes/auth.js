const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../Model_Schema/usersSchema");

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "האימייל לא רשום במערכת" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "הסיסמה שגויה" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "20d" }
    );

    res.json({
      success: true,
      message: "התחברת בהצלחה!",
      token : token,
      _id: user._id, // ✅ חשוב מאוד
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address || "",
      birthdate: user.birthdate || "",
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
