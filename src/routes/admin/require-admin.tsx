import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { LoadingSpinner } from "@/components/states";

/** Gate that only renders children for authenticated admins. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading, user, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <LoadingSpinner label="Checking access…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ denied: true }} replace />;
  }

  return <>{children}</>;
}
