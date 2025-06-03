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





app.get("/", (req, res) => {
  res.json({ message: "שרת פעיל!" });
});




app.use("/api", registerRoutes);
app.use("/api", auth);
app.use("/api", getUserDetails);
app.use("/api", updateUser);
app.use("/api", verifyPassword);
app.use("/api/orders", orderRoutes);





app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על פורט ${PORT}`);
});
