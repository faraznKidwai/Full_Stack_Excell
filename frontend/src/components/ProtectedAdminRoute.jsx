import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Changed from local host to relative endpoint pathing for seamless production deployment
        const res = await fetch("/api/admin/check", {
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