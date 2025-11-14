import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { UserRole } from '../types';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Redirect authenticated users based on role
    if (user?.role === UserRole.OFFICER) {
      return <Navigate to="/clients" replace />;
    }
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
