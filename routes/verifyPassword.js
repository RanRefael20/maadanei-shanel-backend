const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Model_Schema/usersSchema");
const verifyToken = require("../middleware/verifyToken");

router.post("/verify-password", verifyToken, async (req, res) => {
  const { currentPassword } = req.body;

  try {
const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(401).json({ message: "סיסמה שגויה" });

    res.json({ message: "סיסמה תקינה" });
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

module.exports = router;
