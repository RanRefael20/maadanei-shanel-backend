const cron = require("node-cron");
const Order = require("../Model_Schema/ordersSchema");
const User = require("../Model_Schema/usersSchema");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OUR_EMAIL,
    pass: process.env.OUR_EMAIL_PASSWORD,
  },
});

const checkPointsExpiration = () => {
  cron.schedule("0 2 * * *", async () => {
    console.log("🔄 בודק תוקף נקודות...");

    const users = await User.find({ points: { $gt: 0 } });

    for (const user of users) {
      const lastOrder = await Order.findOne({ userId: user._id }).sort({ createdAt: -1 });
      if (!lastOrder) continue;

      const expireDate = new Date(lastOrder.createdAt);
      expireDate.setMonth(expireDate.getMonth() + 3);

      const today = new Date();
      const oneMonthBefore = new Date(expireDate);
      oneMonthBefore.setMonth(expireDate.getMonth() - 1);

      if (today >= oneMonthBefore && today < expireDate) {
        const messageText = `
שלום ${user.username},

רק רצינו להזכיר לך 🎉
יש לך ${user.points} נקודות שתקפות עד ${expireDate.toLocaleDateString("he-IL")}

מוזמן/ת להשתמש בהן להזמנה הקרובה במעדני שנאל!

-- מעדני שנאל 💙
`;

        await transporter.sendMail({
          from: '"מעדני שנאל" <nashelcheese@gmail.com>',
          to: user.email,
          subject: "💎 תוקף הנקודות שלך מתקרב לסיום",
          text: messageText,
        });
        console.log(`📬 מייל נשלח ל־ ${user.email}`);
      }
         // 🗑 אם תוקף פג — אפס נקודות
      if (today >= expireDate) {
        user.points = 0;
        await user.save();

            await transporter.sendMail({
          from: '"מעדני שנאל" <nashelcheese@gmail.com>',
          to: user.email,
          subject: "⌛ הנקודות שלך פגו",
          text: `שלום ${user.username},\n\nהנקודות שלך פגו בתאריך ${expireDate.toLocaleDateString("he-IL")}.\n\nנשמח לראות אותך שוב באתר 💙`,
        });

        console.log(`❌ נקודות אופסו עבור ${user.email}`);
      }
    }
  });
};

module.exports = checkPointsExpiration;
