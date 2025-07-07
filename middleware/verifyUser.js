const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const otps = new Map(); // אחסון קודי אימות בזיכרון בלבד

// הגדרות מיילר (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OUR_EMAIL,
    pass: process.env.OUR_EMAIL_PASSWORD,
  },
});

// שליחת קוד אימות לאימייל
router.post("/send-code", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "יש להזין כתובת אימייל" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 4 * 60 * 1000; // תוקף: 4 דקות

  otps.set(email, { code, expiresAt });

  try {
    await transporter.sendMail({
      from:  `"מעדני שנאל" <${process.env.OUR_EMAIL}>`,
      to: email,
      subject: "קוד אימות לחשבון",
      text: `קוד האימות שלך הוא: ${code}\nתוקף הקוד ל־4 דקות בלבד.`,
    });

    return res.status(200).json({ success: true, message: "קוד אימות נשלח למייל" });
  } catch (err) {
    console.error("שגיאה בשליחת מייל:", err);
    return res.status(500).json({ success: false, message: "שליחת אימייל נכשלה" });
  }
});

// אימות הקוד שהוזן
router.post("/verify-code", (req, res) => {
  const { email, code } = req.body;

  const entry = otps.get(email);
  if (!entry) {
    return res.status(400).json({ success: false, message: "לא נמצא קוד אימות למייל הזה" });
  }

  if (Date.now() > entry.expiresAt) {
    otps.delete(email);
    return res.status(400).json({ success: false, message: "הקוד פג תוקף, נסה שוב" });
  }

  if (entry.code !== code) {
    return res.status(400).json({ success: false, message: "קוד שגוי" });
  }

  otps.delete(email); // ✅ מחיקה לאחר הצלחה
  return res.status(200).json({ success: true, message: "הקוד אומת בהצלחה" });
});

module.exports = router;
