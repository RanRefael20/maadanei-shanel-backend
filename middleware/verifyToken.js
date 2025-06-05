// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "אין הרשאה (Missing token)" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
req.user = { id: decoded.id }; // ✅ מצמיד את המשתמש
    next();
  } catch (err) {
    console.error("❌ טוקן לא תקף:", err);
    res.status(403).json({ message: "טוקן שגוי או פג תוקף" });
  }
};

module.exports = verifyToken;
