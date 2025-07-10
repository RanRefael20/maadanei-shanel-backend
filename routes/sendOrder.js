const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const generateOrderEmailHTML = require("./../HTML-emailTemplates/orderConfirmation"); // תבנית HTML מותאמת

router.post("/send-order", async (req, res) => {
  const { to, subject, order, sendBy, status  } = req.body; // status: "before" | "after"
console.log("fff" , to, subject, order, sendBy, status );
  if (!order || !to || !sendBy) {
    return res.status(400).json({ message: "נתונים חסרים" });
  }
  if (sendBy === "email" && !subject) {
    return res.status(400).json({ message: "חסר נושא למייל" });
  }
  
  

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.OUR_EMAIL,
      pass: process.env.OUR_EMAIL_PASSWORD,
    },
  });

  // אם ההזמנה לאחר תשלום – נשתמש בתבנית HTML
  if (sendBy === "email" && status === "after") {
    try {
      await transporter.sendMail({
        from: `"מעדני שנאל" <${process.env.OUR_EMAIL}>`,
        to: order.email,
        subject: "🧾 ההזמנה שלך התקבלה - מעדני שנאל",
        html: generateOrderEmailHTML(order),
      });

      // שליחה לעסק (עותק)
      await transporter.sendMail({
        from: `"מעדני שנאל" <${process.env.OUR_EMAIL}>`,
        to: "ranrefaelbiton@gmail.com",
        subject: `📥 הזמנה חדשה התקבלה מהאתר`,
        html: generateOrderEmailHTML(order),
      });

      return res.status(200).json({ success: true, message: "המייל נשלח בהצלחה ✅" });
    } catch (error) {
      console.error("❌ שגיאה בשליחת מייל HTML:", error);
      return res.status(500).json({ message: "שליחת מייל HTML נכשלה" });
    }
  }

  // אם זה לפני תשלום – הודעת טקסט פשוטה
  else if (sendBy === "email" && status === "before"  ) {
    const messageText = `
היי מה קורה,

הכנתי לנו תפריט אצל מעדני שנאל
ורציתי להתייעץ איתך אם הפריטים והכמות מתאימים לנו?

פרטי המזמין:
שם: ${order.name}
טלפון: ${order.phone}
כתובת: ${order.address}


פריטים שבחרתי:
${order.items.map((item) => `• ${item.name} - ₪${item.price}`).join("\n")}

סה"כ: ₪${order.total}

אם תרצה/י לשנות או להוסיף משהו – זה הזמן!
`;

    try {
      await transporter.sendMail({
        from: `"מעדני שנאל" <${process.env.OUR_EMAIL}>`,
        to,
        subject,
        text: messageText,
      });

      return res.status(200).json({ success: true, message: "המייל נשלח כהתייעצות לפני תשלום ✅" });
    } catch (error) {
      console.error("❌ שגיאה בשליחת מייל טקסט:", error);
      return res.status(500).json({ message: "שליחת מייל נכשלה" });
    }
  }

  // שליחה ב־WhatsApp
  else if (sendBy === "whatsapp") {
    const messageText =
      status === "after"
        ? `שלום ${order.username}, תודה על ההזמנה שלך ממעדני שנאל! 💙\n\nתאריך ההזמנה: ${new Date(order.createdAt).toLocaleString("he-IL", {
          dateStyle: "short",
          timeStyle: "short"
        })
        }\nסה"כ לתשלום: ₪${order.totalPrice}\nנקודות שצברת : ${order.earnedPoints || 0}\n\n🧺\n${order.items.map((item) => `• ${item.name} - ₪${item.price}`).join("\n")}`
        : `
היי מה קורה,

הכנתי לנו תפריט אצל מעדני שנאל
ורציתי להתייעץ איתך אם הפריטים והכמות מתאימים לנו?

פרטי המזמין:
שם: ${order.name}
טלפון: ${order.phone}
כתובת: ${order.address}


פריטים שבחרתי:
${order.items.map((item) => `• ${item.name} - ₪${item.price}`).join("\n")}

סה"כ: ₪${order.total}

אם תרצה/י לשנות או להוסיף משהו – זה הזמן!
`;

    const phone = "972" + to.substring(1);
    const encodedMsg = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
    return res.json({ success: true, whatsappUrl });
  }

  return res.status(400).json({ message: "שיטת שליחה לא נתמכת" });
});

module.exports = router;
