import { useAuthStore } from '../store';
import { UserRole } from '../types';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();

  const isOfficer = user?.role === UserRole.OFFICER;
  const isNormalUser = user?.role === UserRole.NORMAL_USER;

  return {
    user,
    token,
    isAuthenticated,
    isOfficer,
    isNormalUser,
    login,
    logout,
  };
};
