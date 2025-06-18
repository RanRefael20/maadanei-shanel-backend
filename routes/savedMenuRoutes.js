const express = require("express");
const router = express.Router();
const SavedMenu = require("../Model_Schema/SavedMenuSchema");
const verifyToken = require(".././middleware/verifyToken");

// POST /api/savedMenus – שמירה
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { name, items, total } = req.body;
    console.log("🎯 לפני שמירה", { name, items, total, userId: req.user.id });

    if (!name || !Array.isArray(items) || typeof total !== "number") {
      return res.status(400).json({ message: "שדות לא תקינים לשמירה" });
    }

    // 🔁 ודא שלכל פריט יש קטגוריה – אם לא, שים 'לא מסווג'
    const sanitizedItems = items.map((item) => ({
      name: item.name,
      price: item.price,
      category: item.category || "לא מסווג"
    }));

    const newMenu = new SavedMenu({
      userId: req.user.id,
      name,
      items: sanitizedItems,
      total
    });

    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    next(err);
  }
});


// GET /api/savedMenus/count – מחזיר כמה תפריטים שמורים יש למשתמש
router.get("/count", verifyToken, async (req, res) => {
  try {
    const count = await SavedMenu.countDocuments({ userId: req.user.id });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בקבלת כמות התפריטים" });
  }
});


// GET /api/savedMenus/:userId – קבלת כל השמורים
router.get("/:userId", verifyToken, async (req, res) => {
  console.log("🔎 userId param:", req.params.userId); // ✅ תוודא מה התקבל
  try {
    const menus = await SavedMenu.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: "בעיה בשליפת הטיוטות" });
  }
});

// GET /api/savedMenus/single/:id – שליפה לפי id
router.get("/single/:id", verifyToken, async (req, res) => {
  console.log("single");
  
  try {
    const menu = await SavedMenu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "לא נמצא" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשליפה" });
  }
});

// DELETE /api/savedMenus/delete/:id
// DELETE /api/savedMenus/delete/:id
router.delete("/delete/:id", verifyToken, async (req, res) => {
  console.log("delete");
  
  try {
    const menu = await SavedMenu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: "טיוטה לא נמצאה" });
    }

    // רק אם זה של המשתמש המחובר
    if (menu.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "אין לך הרשאה למחוק טיוטה זו" });
    }

    await SavedMenu.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "נמחק בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: "בעיה במחיקת הטיוטה" });
  }
});



module.exports = router;