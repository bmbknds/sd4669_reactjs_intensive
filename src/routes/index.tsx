import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { PublicRoute } from './public-route';
import { UserRole } from '../types';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('../features/auth/login-page'));
const LandingPage = lazy(() => import('../features/landing/landing-page'));
const ProfilePage = lazy(() => import('../features/profile/profile-page'));
const KYCPage = lazy(() => import('../features/kyc/kyc-page'));
const ClientListPage = lazy(() => import('../features/client-list/client-list-page'));
const ReviewPage = lazy(() => import('../features/review/review-page'));
const ResultsPage = lazy(() => import('../features/review/results-page'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/landing" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/landing',
    element: (
      <ProtectedRoute>
        <LandingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/:userId',
    element: (
      <ProtectedRoute requiredRole={UserRole.OFFICER}>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/kyc',
    element: (
      <ProtectedRoute>
        <KYCPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/kyc/:userId',
    element: (
      <ProtectedRoute requiredRole={UserRole.OFFICER}>
        <KYCPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients',
    element: (
      <ProtectedRoute requiredRole={UserRole.OFFICER}>
        <ClientListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/review',
    element: (
      <ProtectedRoute requiredRole={UserRole.OFFICER}>
        <ReviewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/results',
    element: (
      <ProtectedRoute requiredRole={UserRole.OFFICER}>
        <ResultsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/review/:userId',
    element: (
      <ProtectedRoute requiredRole={UserRole.OFFICER}>
        <ReviewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
