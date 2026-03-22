import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
