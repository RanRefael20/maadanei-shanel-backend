// routes/getUserDetails.js
const express = require("express");
const router = express.Router();
const User = require("../Model_Schema/usersSchema");
const verifyToken = require("../middleware/verifyToken");

// GET /api/me - מחזיר את פרטי המשתמש שמחובר לפי הטוקן
router.get("/me", verifyToken, async (req, res, next) => {

  try {

const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "משתמש לא נמצא" });
     
    }
  console.log(user._id);
  
    res.json({
/*       success: true,
  _id: user._id, // ← זה חשוב מאוד!
  username: user.username,
  email: user.email,
  phone: user.phone,
  birthdate: user.birthdate,
  address: user.address || "",
  birthdate: user.birthdate,
  lastOrderAt: user.lastOrderAt,
  points: user.points */

    _id: user._id,
  username: user.username,
  email: user.email,
  phone: user.phone,
  birthdate: user.birthdate,
  address: user.address || "",
  lastOrderAt: user.lastOrderAt,
  points: user.points


    });
    


  } catch (err ) {
    next(err); // 👈 השגיאה תועבר ל־middleware הגלובלי
  }
});

module.exports = router;
