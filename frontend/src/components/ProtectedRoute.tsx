import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

export default function ProtectedRoute(){
  const { isAuthenticated, loading } = useGlobalContext();
  const location = useLocation();
  if (loading) return <div className="flex h-screen items-center justify-center text-sm text-gray-500">Loading session...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
