import { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigation = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation("/");
    }
  }, [isAuthenticated, navigation]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
