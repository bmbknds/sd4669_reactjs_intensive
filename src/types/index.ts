// User roles
export enum UserRole {
  NORMAL_USER = 'NORMAL_USER',
  OFFICER = 'OFFICER',
}

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Profile types
export interface PersonalInfo {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

// KYC types
export interface KYCData {
  id: string;
  userId: string;
  documentType: 'passport' | 'drivingLicense' | 'nationalId';
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingCountry: string;
  documentFront?: string;
  documentBack?: string;
  selfiePhoto?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  kycId: string;
  reviewerId: string;
  status: 'approved' | 'rejected';
  comments: string;
  reviewedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Client list types (for officers)
export interface Client {
  id: string;
  name: string;
  email: string;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  lastUpdated: string;
}
