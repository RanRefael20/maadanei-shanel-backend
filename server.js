const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");



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

const registerRoutes = require("./routes/register");
const auth = require("./routes/auth");
const updateUser = require("./routes/updateUser");
const verifyPassword = require("./routes/verifyPassword");
const getUserDetails = require("./routes/getUserDetails");
const orderRoutes = require("./routes/orders");
const savedMenuRoutes = require("./routes/savedMenuRoutes");


const tokenaviv = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2Y2ZWQ5Mzk0MzM0NmUxOWYxZmFhNyIsImlhdCI6MTc0OTMyNzg2NCwiZXhwIjoxNzUxMDU1ODY0fQ.hMJVmEBeTfnLTMw8VP1lyuvGZPi996iXATDm1NptIUE';
const tokenmicha = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2Y2Y2QzMzk0MzM0NmUxOWYxZmE4ZCIsImlhdCI6MTc0OTMyODAyNSwiZXhwIjoxNzUxMDU2MDI1fQ.Ivhj4Ptgmtv4PqwgGx2EdbjE64XPnchEh680bH7y7X4'

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

  res.status(500).json({
    success: false,
    message: "שגיאה בשרת. נסה שוב מאוחר יותר.",
    // רק בסביבת פיתוח תראה פירוט – לא בפרודקשן
    ...(process.env.NODE_ENV === "development" && { error: err.message })
  });
});





app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על פורט ${PORT}`);
  if(tokenaviv == tokenmicha){
  console.log("1111111111111");
}else{
  console.log("0000000000");
  
}
});
