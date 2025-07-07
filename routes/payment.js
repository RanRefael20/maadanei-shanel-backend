const express = require("express");
const router = express.Router();
const axios = require("axios");

// יצירת URL לתשלום דרך Cardcom
router.post("/start", async (req, res) => {
  const { username, email, amount, productDescription } = req.body;

  try {
    const response = await axios.post("https://secure.cardcom.solutions/api/v11/LowProfile/Create", {
      TerminalNumber: 1000, // החלף למספר הטרמינל שלך אם שונה
      ApiName: "kzFKfohEvL6AOF8aMEJz",
      ApiPassword: "FIDHIh4pAadw3Slbdsjg", // רק אם נדרש
      ReturnValue: "Z12332X", // אפשר להכניס מזהה ייחודי להזמנה אם תרצה
      Amount: amount,
      SuccessRedirectUrl: "https://www.google.com", // ⬅️ לשנות לכתובת שאתה רוצה לאחר תשלום מוצלח
      FailedRedirectUrl: "https://www.yahoo.com", // ⬅️ לשנות לכתובת לכישלון
      WebHookUrl: "https://yourdomain.com/api/payment/callback",
      Document: {
        To: username,
        Email: email,
        Products: [
          {
            Description: productDescription,
            UnitCost: amount
          }
        ]
      }
    });

    res.json({
      paymentUrl: response.data.Url
    });

  } catch (err) {
    console.error("שגיאה ביצירת לינק לתשלום:", err.response?.data || err.message);
    res.status(500).json({ message: "שגיאה ביצירת לינק לתשלום" });
  }
});

// ✅ זה המקום של ה־callback שאתה שואל עליו
router.post("/callback", async (req, res) => {
  const data = req.body;
  console.log("📩 קיבלנו תשובה מ־Cardcom:", data);

  if (data.ResponseCode === 0 && data.TranzactionInfo?.TranzactionId) {
    // תשלום הצליח - כאן תוכל:
    // 🔒 לשמור הזמנה ב־MongoDB
    // 🟢 לשלוח מייל
    // ⭐ לצבור נקודות
  }

  res.sendStatus(200); // חובה להחזיר 200 כדי ש-Cardcom לא תשלח שוב
});

module.exports = router;


