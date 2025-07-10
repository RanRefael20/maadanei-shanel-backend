const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const registerRoutes = require("./routes/register");
const auth = require("./routes/auth");
const updateUser = require("./routes/updateUser");
const verifyPassword = require("./routes/verifyPassword");
const getUserDetails = require("./routes/getUserDetails");
const orderRoutes = require("./routes/orders");
const savedMenuRoutes = require("./routes/savedMenuRoutes");
const verifyUser = require("./middleware/verifyUser");
const forgotPassword = require("./routes/forgotPassword");
const sendOrderRoute = require("./routes/sendOrder");
const paymentRoutes = require("./routes/payment"); // הנתיב לפי מיקום הקובץ
const userRoutes = require("./routes/Admin/users");


const checkPointsExpiration = require("./cronJobs/checkPointsExpiration");

checkPointsExpiration();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ חיבור למונגו הצליח!"))
.catch((err) => console.error("❌ שגיאה בחיבור למונגו:", err));




app.get("/", (req, res) => {
  res.json({ message: "שרת פעיל!" });

});




app.use("/api", registerRoutes);
app.use("/api", auth);
app.use("/api", getUserDetails);
app.use("/api", updateUser);
app.use("/api", verifyPassword);
app.use("/api/orders", orderRoutes);
app.use("/api/savedMenus", savedMenuRoutes);
app.use("/api", forgotPassword);
app.use("/api", verifyUser);
app.use("/api", sendOrderRoute);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);





// 404 – אם לא נמצא ראוט מתאים
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "נתיב לא נמצא." });
});

// שגיאות מערכת (500 וכו')
app.use((err, req, res, next) => {
  console.error("🔥 שגיאה גלובלית:");
  console.error("➡️ נתיב:", req.originalUrl);
  console.error("➡️ שיטה:", req.method);
  console.error("➡️ גוף הבקשה:", req.body);
  console.error("➡️ תוכן השגיאה:", err.stack);

    // שגיאת ולידציה של Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: "שגיאת ולידציה",
      errors // זה מערך של הודעות שגיאה מהסכמה
    });
  }

  res.status(500).json({
    success: false,
    message: "שגיאה בשרת. נסה שוב מאוחר יותר.",
    // רק בסביבת פיתוח תראה פירוט – לא בפרודקשן
    ...(process.env.NODE_ENV === "development" && { error: err.message })
  });
});





app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על פורט ${PORT}`);

});
