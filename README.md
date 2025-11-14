# React KYC Management System

A comprehensive KYC (Know Your Customer) management application built with React 18, TypeScript, and Ant Design.

## 🚀 Features

- **Role-Based Access Control (RBAC)**
  - Normal User: Access to personal profile and KYC submission
  - Officer: Access to all user profiles, client list, and review functionality

- **Authentication & Authorization**
  - Secure login system
  - Role-based route protection
  - JWT token management

- **User Management**
  - Profile management
  - KYC document submission
  - Document upload functionality

- **Officer Features**
  - Client list management
  - KYC review and approval
  - Access to all user data

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **Ant Design** - UI components
- **Zustand** - State management
- **React Hook Form** - Form validation
- **Axios** - API calls
- **Sass** - Styling
- **Vite** - Build tool

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── loading/
│   └── error-message/
├── features/           # Feature-specific components
│   ├── auth/           # Login functionality
│   ├── profile/        # User profile
│   ├── kyc/            # KYC submission
│   ├── client-list/    # Client management (Officer)
│   └── review/         # Review functionality (Officer)
├── hooks/              # Custom React hooks
│   ├── use-auth.ts
│   └── use-fetch.ts
├── routes/             # Route configuration
│   ├── index.tsx
│   ├── protected-route.tsx
│   └── public-route.tsx
├── services/           # API services
│   ├── api-client.ts
│   ├── auth-service.ts
│   ├── profile-service.ts
│   ├── kyc-service.ts
│   ├── client-service.ts
│   └── review-service.ts
├── store/              # Zustand global state
│   ├── auth-store.ts
│   └── client-store.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Helper functions
│   ├── string.ts
│   ├── date.ts
│   └── validation.ts
└── styles/             # Global styles
    └── variables.scss
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ReactJSIntensive
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update the API base URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

Run the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 🔐 User Roles

### Normal User
- Access to personal profile page
- KYC submission
- View own review results

### Officer
- Access to all user profiles
- Client list management
- KYC review and approval
- Access to all review results

## 🎨 Code Quality

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type safety
- **Component organization** - One component per file
- **Feature-based structure** - Clear separation of concerns

## 📝 API Integration

The application uses Axios for API calls with:
- Request interceptors for authentication
- Response interceptors for error handling
- Automatic token management
- Loading and error states

## 🔄 State Management

- **Local State**: Component-specific data (forms, toggles)
- **Global State (Zustand)**: 
  - User authentication
  - Selected client data
  - Shared application state

## 🎯 Performance Optimization

- **Code Splitting**: Lazy loading of route components
- **React.lazy & Suspense**: Dynamic imports
- **Memoization**: useMemo and useCallback where appropriate

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 🤝 Contributing

1. Follow the folder structure guidelines
2. One component per file
3. Use TypeScript for type safety
4. Write reusable components
5. Follow the established naming conventions
6. Add proper error handling

## 📄 License

This project is part of a React training assignment.
