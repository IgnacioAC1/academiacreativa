import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
  /** Rol requerido. Si es null, cualquier usuario autenticado puede acceder. */
  role: Role | null;
};

const ProtectedRoute = ({ children, role }: Props) => {
  const { role: userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!userRole) return <Navigate to="/login" replace />;
  if (role !== null && userRole !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
