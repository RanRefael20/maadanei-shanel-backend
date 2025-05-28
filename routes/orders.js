// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../Model_Schema/ordersSchema");

// יצירת הזמנה חדשה
router.post("/create", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("שגיאה ביצירת הזמנה:", err);
    res.status(500).json({ message: "שגיאה ביצירת הזמנה" });
  }
});

// שליפת כל ההזמנות למשתמש לפי userId
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("שגיאה בשליפת הזמנות:", err);
    res.status(500).json({ message: "שגיאה בשליפת הזמנות" });
  }
});

module.exports = router;
