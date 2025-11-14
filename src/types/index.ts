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
  personalInfo?: PersonalInfo;
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
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  emails: EmailInfo[];
  phones: PhoneInfo[];
  addresses: AddressInfo[];
  identificationDocuments: IdentificationDocument;
  occupations: OccupationInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailInfo {
  id: string;
  email: string;
  type: 'Work' | 'Personal';
  preferred: boolean;
}

export interface PhoneInfo {
  id: string;
  number: string;
  type: 'Work' | 'Personal';
  preferred: boolean;
}

export interface AddressInfo {
  id: string;
  country: string;
  city: string;
  street: string;
  postalCode?: string;
  type: 'Mailing' | 'Work';
}

export interface IdentificationDocument {
  passport?: string; // File URL
  nationalId?: string; // File URL
  driverLicense?: string; // File URL
}

export interface OccupationInfo {
  id: string;
  name: string;
  fromYear: number;
  toYear?: number;
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
