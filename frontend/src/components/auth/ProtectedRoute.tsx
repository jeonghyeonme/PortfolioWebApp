import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  // While checking the auth state, don't render anything
  if (loading) {
    return null; // Or a loading spinner
  }

  // If the user is authenticated, render the child route
  // Outlet is a placeholder for the actual admin page component
  if (user) {
    return <Outlet />;
  }

  // If the user is not authenticated, redirect to the login page
  return <Navigate to="/admin/login" replace />;
}
