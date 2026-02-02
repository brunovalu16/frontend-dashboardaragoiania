import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { authArago } from "../data/firebase-config"; // 🔥 auth do App RN

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(authArago, (user) => {
      setIsAuth(!!user);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // evita render quebrado enquanto valida auth
  if (loading) return null;

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
