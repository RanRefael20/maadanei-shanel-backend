// routes/forgotPassword.js
const express = require("express");
const router = express.Router();
const User = require("../Model_Schema/usersSchema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "יש להזין אימייל" });

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "לא נמצא משתמש עם אימייל זה" });
  }


    // סיסמה זמנית
    const tempPassword = Math.random().toString(36).slice(-6);
   // עדכון הסיסמה במסד
    user.password = tempPassword;
    await user.save();


  // שליחת מייל עם הסיסמה החדשה
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.OUR_EMAIL,
      pass: process.env.OUR_EMAIL_PASSWORD, // חייב להיות App Password
    },
  });

  const mailOptions = {
    from: process.env.OUR_EMAIL,
    to: email,
    subject: "איפוס סיסמה - מעדני שנאל",
    text: `
שלום ${user.username},

סיסמה חדשה הוגדרה עבורך : ${tempPassword}

אנא התחבר עם הסיסמה הזו ואז שנה אותה מההגדרות.

בהצלחה,
צוות מעדני שנאל
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "הסיסמה נשלחה למייל" });
  } catch (error) {
    console.error("שגיאה בשליחת המייל:", error);
    res.status(500).json({ message: "שליחת מייל נכשלה" });
  }
});

module.exports = router;
