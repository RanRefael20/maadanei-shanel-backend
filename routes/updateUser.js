// routes/updateUser.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Model_Schema/usersSchema");
const verifyToken = require("../middleware/verifyToken");

router.put("/update", verifyToken, async (req, res) => {
  const { username, email, password, phone, birthdate, address } = req.body;
console.log(req.body)
  try {
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (birthdate) updates.birthdate = birthdate;
    if (typeof address !== "undefined") updates.address = address;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    res.json({
      message: "הפרטים עודכנו בהצלחה",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        birthdate: updatedUser.birthdate,
        address: updatedUser.address
      }
    });

  } catch (err) {
    console.error("❌ שגיאה בעדכון:", err);
    res.status(500).json({ message: "שגיאה בעדכון פרטי המשתמש" });
  }
});

module.exports = router;
