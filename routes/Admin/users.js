const express = require("express");
const router = express.Router();
const User = require("../../Model_Schema/usersSchema");
const bcrypt = require("bcrypt");
const verifyToken = require("../../middleware/verifyToken");

// שליפת כל המשתמשים (רק למנהל)
router.get("/all", verifyToken, async (req, res) => {
  try {
    console.log(req.user);
    
    if (req.user.email !== "nashelcheese@gmail.com") {
      return res.status(403).json({ message: "גישה נדחתה" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

// מחיקת משתמש לפי ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.email !== "nashelcheese@gmail.com") {
      return res.status(403).json({ message: "אין הרשאה" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });

    res.json({ message: "המשתמש נמחק בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: "שגיאה במחיקה" });
  }
});

// עדכון שדות של משתמש (שם, טלפון וכו')
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.email !== "nashelcheese@gmail.com") {
      return res.status(403).json({ message: "אין הרשאה" });
    }

    const updates = req.body; // { username, phone, email, etc... }
    const { username, email, phone } = updates;
    if (!username || !email || !phone) {
  return res.status(400).json({ message: "יש למלא את כל השדות החיוניים" });
}
if (!email.includes("@")) {
  return res.status(400).json({ message: "כתובת מייל לא תקינה" });
}
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");

    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון המשתמש" });
  }
});

// אימות סיסמת המנהל
router.post("/verify-admin", verifyToken, async (req, res) => {
  try {
    const { password } = req.body;

    const admin = await User.findOne({ email: "nashelcheese@gmail.com" });
    if (!admin) return res.status(404).json({ message: "מנהל לא נמצא" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "סיסמה שגויה" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "שגיאה באימות סיסמה" });
  }
});

module.exports = router;
