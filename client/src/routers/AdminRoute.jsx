import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  return user && user.role === "admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;
