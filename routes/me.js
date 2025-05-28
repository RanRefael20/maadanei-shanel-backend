// routes/me.js
const express = require("express");
const router = express.Router();
const User = require("../Model_Schema/usersSchema");
const verifyToken = require("../middleware/verifyToken");

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });

    res.json(user);
  } catch (err) {
    console.error("שגיאה בטעינת המשתמש:", err);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

module.exports = router;
