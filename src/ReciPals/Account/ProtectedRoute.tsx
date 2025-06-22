import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

// represents the protected route component that prevents users from accessing certain pages unless logged in
export default function ProtectedRoute({
  children,
  requiredRole = "ADMIN",
}: ProtectedRouteProps) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  if (!currentUser) {
    return <Navigate to="/ReciPals/Account/Login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/ReciPals/Home" replace />;
  }

  return <>{children}</>;
}
