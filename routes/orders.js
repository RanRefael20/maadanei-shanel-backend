const express = require("express");
const router = express.Router();
const Order = require("./../Model_Schema/ordersSchema"); // ודא שהנתיב נכון
const User = require("./../Model_Schema/usersSchema");
const verifyToken = require("../middleware/verifyToken");
const jwt = require("jsonwebtoken");


const generateUniqueOrderNumber = async () => {
  let exists = true;
  let orderNumber = "";

  while (exists) {
    orderNumber = Math.floor(100000 + Math.random() * 900000).toString(); // 6 ספרות
    const existingOrder = await Order.findOne({ orderNumber });
    exists = !!existingOrder;
  }

  return orderNumber;
};

// 📄 שליפת כל ההזמנות (למנהל בלבד)
router.get("/all-orders", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.email !== "nashelcheese@gmail.com") {
      return res.status(403).json({ message: "אין הרשאות גישה" });
    }

    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ שגיאה בשליפת כל ההזמנות:", err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});


// 📦 יצירת הזמנה חדשה
router.post("/create", async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];
    let userId = null;

    // נסה לאמת טוקן אם קיים
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.warn("⚠️ טוקן לא תקין או פג תוקף - ממשיך כלא מחובר");
      }
    }

    const { username, email, phone, address, items, priceFirst, totalPrice, usedPoints = 0 , when } = req.body;

    if (!username || !email || !address || !Array.isArray(items) || !totalPrice) {
      return res.status(400).json({ message: "חסרים פרטים בהזמנה" });
    }
     const parsedDate = new Date(when);
    if (!when || isNaN(parsedDate)) {
      return res.status(400).json({ message: "תאריך ההזמנה לא תקין" });
    }

    const earnedPoints = Math.floor(totalPrice * 0.3);
const orderNumber = await generateUniqueOrderNumber();

    const newOrder = new Order({
      userId, // אם קיים
      username,
      email,
      phone,
      address,
      items,
      priceFirst,
      totalPrice,
      usedPoints,
      earnedPoints,
      createdAt: new Date(),
      when: new Date(when),
      orderNumber
    });

    const savedOrder = await newOrder.save();

    // אם המשתמש מחובר, נעדכן גם נקודות
    if (userId) {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "משתמש לא נמצא" });
      }

      if (usedPoints > (user.points || 0)) {
        return res.status(400).json({ message: "לא ניתן לממש יותר נקודות ממה שיש" });
      }

      const safeUsedPoints = Math.min(user.points || 0, usedPoints);
      user.points = (user.points || 0) - safeUsedPoints + earnedPoints;
      user.lastOrderAt = new Date();
      await user.save();
    }

    res.status(201).json(savedOrder);
} catch (err) {
  console.error("❌ שגיאה ביצירת הזמנה:", err);

  // בדיקת שגיאת ולידציה (כמו totalPrice לא עומד בתנאי)
  if (err.name === "ValidationError") {
    const message =
      err.errors?.totalPrice?.message || // נשלח רק את ההודעה שאתה הגדרת בסכימה
      err.message ||
      "שגיאת ולידציה";



    return res.status(400).json({ message });
  }

  // שגיאה כללית אחרת
  res.status(500).json({ message: "שגיאת שרת בעת יצירת ההזמנה" });
}

});

// 📄 שליפת כל ההזמנות של המשתמש
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ שגיאה בשליפת ההזמנות:", err);
    res.status(500).json({ message: "שגיאה בשליפת ההזמנות" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.email !== "nashelcheese@gmail.com") {
      return res.status(403).json({ message: "אין הרשאה למחוק" });
    }
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "ההזמנה נמחקה" });
  } catch (err) {
    res.status(500).json({ message: "שגיאה במחיקת ההזמנה" });
  }
});


module.exports = router;
