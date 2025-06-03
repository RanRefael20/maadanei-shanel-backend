import { useEffect, useState } from "react";
import { baseURL } from "../config";

const useAuthSync = () => {
  const [user, setUser] = useState(null); // null = לא מחובר
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${baseURL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          const data = await res.json();
          setUser({ username: data.username }); // תוכל להרחיב לשאר הנתונים
        }
      } catch (err) {
        console.error("❌ שגיאה באימות טוקן:", err);
        localStorage.removeItem("token");
        setUser(null);
      }

      setLoading(false);
    };

    checkToken();
  }, []);

  return { user, loading, setUser };
};

export default useAuthSync;
