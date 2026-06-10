import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/check", {
          credentials: "include",
        });

        const data = await res.json();
        setIsAuth(data.authenticated);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAuth) return <Navigate to="/admin-login" />;

  return children;
};

export default ProtectedAdminRoute;