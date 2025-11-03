import { createContext, useState, useEffect } from "react";
import { BASE_URL } from "../config";
export const LikedContext = createContext();

export const LikedProvider = ({ children }) => {
  const [likedProperties, setLikedProperties] = useState([]);

  // Optional: fetch liked properties on app load if user is logged in
  useEffect(() => {
    const fetchLiked = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
  headers: { Authorization: `Bearer ${token}` },
});
        // const res = await fetch("http://localhost:5000/api/auth/me", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        const data = await res.json();
        if (res.ok) setLikedProperties(data.user.likedProperties || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLiked();
  }, []);

  return (
    <LikedContext.Provider value={{ likedProperties, setLikedProperties }}>
      {children}
    </LikedContext.Provider>
  );
};
