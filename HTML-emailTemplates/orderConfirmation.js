const generateOrderEmailHTML = (order) => {
    return `
    
    <div style="font-family: 'Arial', sans-serif; background-color: #f7f9fb; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); padding: 24px;">
        <h2 style="color: #007aff; text-align: center;">💙 תודה על ההזמנה שלך</h2>
  
        <p style="font-size: 16px;">, שלום <strong>${order.username}</strong></p>
        <p style="font-size: 15px;">קיבלנו את ההזמנה שלך במעדני שנאל. :הנה הפרטים</p>
        <div style="background-color: #f0f4f8; border-radius: 10px; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📋 :פרטי ההזמנה</h3>
          <p><strong>שם:</strong> ${order.username}</p>
          <p><strong>טלפון:</strong> ${order.phone}</p>
          <p><strong>כתובת:</strong> ${order.address}</p>
          
          <p><strong>נוצר ב:</strong> ${new Date(order.createdAt).toLocaleString("he-IL", {
            dateStyle: "short" ,
            timeStyle: "short"
          })
          } 🕓 </p>
           <p><strong>תפריט על סך: </strong>${order.priceFirst}₪</p>
           <p><strong>נקודות שמומשו:</strong> ${order.usedPoints || 0}</p>
          <p><strong>סה"כ לתשלום: </strong>${order.totalPrice}₪</p>
          <p><strong>נקודות שצברת:</strong> ${order.earnedPoints || 0} ⭐</p>
                <p><strong>הוזמן לתאריך:</strong> ${new Date(order.when).toLocaleString("he-IL", {
            dateStyle: "short" ,
            timeStyle: "short"
          })
          } 🕓 </p>
        </div>
  
        <div>
          <h3> :מה הזמנת 🧺</h3>
          <ul style="padding-left: 20px;">
            ${order.items.map(item => `
              <li style="margin-bottom: 8px;">
                ${item.name} - ₪${item.price}
              </li>`).join("")}
          </ul>
        </div>
  
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 14px; color: #555;">להערות, שינויים או תוספות להזמנה – ניתן להשיב למייל זה או ליצור קשר בוואטסאפ</p>
          <p style="font-size: 13px; color: #888;">💡 הזמנתך נרשמה בהצלחה ונשלחה גם לצוות שלנו.</p>
        </div>
  
        <hr style="margin: 30px 0;" />
  
        <div style="text-align: center; font-size: 12px; color: #aaa;">
          מעדני שנאל © כל הזכויות שמורות<br />
          נשלח אוטומטית ממערכת ההזמנות
        </div>
      </div>
    </div>
    `;
  };
  
  module.exports = generateOrderEmailHTML;
  