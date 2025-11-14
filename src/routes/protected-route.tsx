import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate page based on role
    if (user?.role === UserRole.OFFICER) {
      return <Navigate to="/clients" replace />;
    }
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
