import { LoginCredentials, AuthResponse, User, UserRole, PersonalInfo } from '../types';

// Mock users for testing with passwords
interface MockUser extends User {
  password: string;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'user@test',
    password: 'TestPassword1@',
    name: 'John Doe',
    role: UserRole.NORMAL_USER,
    avatar: '',
    personalInfo: {
      id: 'p1',
      userId: '1',
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      age: 35,
      emails: [{ id: 'e1', email: 'john.doe@example.com', type: 'Personal', preferred: true }],
      phones: [{ id: 'ph1', number: '+1234567890', type: 'Personal', preferred: true }],
      addresses: [
        {
          id: 'a1',
          country: 'United States',
          city: 'New York',
          street: '123 Main St',
          postalCode: '10001',
          type: 'Mailing',
        },
      ],
      identificationDocuments: {},
      occupations: [{ id: 'o1', name: 'Software Engineer', fromYear: 2020, toYear: undefined }],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
  {
    id: '2',
    email: 'officer@te',
    password: 'TestPassword1@',
    name: 'Jane Smith',
    role: UserRole.OFFICER,
    avatar: '',
    personalInfo: {
      id: 'p2',
      userId: '2',
      firstName: 'Jane',
      middleName: 'Marie',
      lastName: 'Smith',
      dateOfBirth: '1988-05-20',
      age: 37,
      emails: [{ id: 'e2', email: 'jane.smith@company.com', type: 'Work', preferred: true }],
      phones: [{ id: 'ph2', number: '+1987654321', type: 'Work', preferred: true }],
      addresses: [
        {
          id: 'a2',
          country: 'United States',
          city: 'Los Angeles',
          street: '456 Oak Ave',
          postalCode: '90001',
          type: 'Work',
        },
      ],
      identificationDocuments: {},
      occupations: [{ id: 'o2', name: 'KYC Officer', fromYear: 2018, toYear: undefined }],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
];

// Mock authentication service for development
export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user by email
    const mockUser = mockUsers.find((u) => u.email === credentials.email);

    if (!mockUser) {
      throw new Error('Invalid email or password');
    }

    // Check password
    if (mockUser.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    // Remove password from user object before returning
    const { password, ...user } = mockUser;

    // Mock token
    const token = `mock-token-${user.id}-${Date.now()}`;

    return {
      user,
      token,
    };
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Return first user as default (without password)
    const { password, ...user } = mockUsers[0];
    return {
      user,
      token: `mock-token-${mockUsers[0].id}`,
    };
  },

  refreshToken: async (): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return `mock-refresh-token-${Date.now()}`;
  },
};
