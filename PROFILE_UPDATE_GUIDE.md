# Profile Update Integration Guide

## Overview
The user profile information is now synchronized between the dashboard (landing page) and the profile page. Users can update their information in the profile page, and it will automatically reflect in the dashboard.

## Changes Made

### 1. Type Definitions (`src/types/index.ts`)
- Added `personalInfo?: PersonalInfo` field to the `User` interface
- This allows the user object to contain detailed personal information

### 2. Auth Store (`src/store/auth-store.ts`)
- Added `updateUserProfile` method to update user information
- This method updates the user object in the store and persists to localStorage

### 3. Mock Auth Service (`src/services/mock-auth-service.ts`)
- Updated mock users to include complete `personalInfo` data
- **Test User 1** (Normal User):
  - Email: `user@test`
  - Name: John Michael Doe
  - Age: 35
  - Location: New York, USA
  - Occupation: Software Engineer

- **Test User 2** (Officer):
  - Email: `officer@te`
  - Name: Jane Marie Smith
  - Age: 37
  - Location: Los Angeles, USA
  - Occupation: KYC Officer

### 4. Profile Page (`src/features/profile/profile-page.tsx`)
- Now loads data from `user.personalInfo` in the auth store
- Saves updates back to the auth store using `updateUserProfile`
- Updates the user's full name based on firstName + lastName
- Automatically calculates age from date of birth

### 5. Landing Page (`src/features/landing/landing-page.tsx`)
- Displays `user.personalInfo.firstName` if available, otherwise falls back to `user.name`
- Profile avatar and user info are clickable and navigate to profile page
- Added hover effects for better UX

## How It Works

### Data Flow
```
Login → Mock Auth Service returns User with personalInfo
      ↓
Auth Store saves user data (persisted to localStorage)
      ↓
Landing Page displays user.personalInfo.firstName
      ↓
Profile Page loads data from user.personalInfo
      ↓
User edits profile → Submit
      ↓
updateUserProfile updates auth store
      ↓
Landing Page automatically reflects new data
```

### Updating Profile Information

1. **Navigate to Profile Page**:
   - Click on the profile avatar or user name in the dashboard header
   - Or use the "My Profile" card in the dashboard

2. **Edit Mode**:
   - Click the "Edit Profile" button
   - All fields become editable (except for Officers viewing their own profile)

3. **Update Fields**:
   - Basic Information: First Name, Middle Name, Last Name, Date of Birth
   - Emails: Add/remove multiple email addresses
   - Phones: Add/remove multiple phone numbers
   - Addresses: Add/remove multiple addresses
   - Occupations: Add/remove job history
   - ID Documents: Upload identification documents

4. **Save Changes**:
   - Click "Save Changes" button
   - Data is saved to the auth store
   - Full name is updated in the dashboard

5. **Cancel**:
   - Click "Cancel" to discard changes
   - Form resets to original values

## Testing

### Test Scenario 1: View Profile Information
1. Login as `user@test` with password `TestPassword1@`
2. Dashboard should show "Welcome back, John"
3. Click on the avatar or user name
4. Profile page should show:
   - Name: John Michael Doe
   - DOB: 1990-01-15 (Age: 35)
   - Email: john.doe@example.com
   - Phone: +1234567890
   - Address: 123 Main St, New York, USA
   - Occupation: Software Engineer (2020 - Present)

### Test Scenario 2: Update Profile Information
1. In profile page, click "Edit Profile"
2. Change First Name to "Johnny"
3. Change Last Name to "DoeLast"
4. Add a new email address
5. Click "Save Changes"
6. Navigate back to dashboard
7. Should now show "Welcome back, Johnny"

### Test Scenario 3: Officer View
1. Login as `officer@te` with password `TestPassword1@`
2. Dashboard should show "Welcome back, Jane"
3. Click on avatar
4. Profile page should be in read-only mode (Officers can view but not edit their profile by default)

## Data Persistence

- All profile data is saved to the browser's localStorage via Zustand persist middleware
- Data persists across page refreshes and browser sessions
- To clear data: Clear browser localStorage or logout

## Future Enhancements

- [ ] Add API integration to save profile to backend
- [ ] Add profile picture upload
- [ ] Add email/phone verification
- [ ] Add change password functionality
- [ ] Add activity log for profile changes
- [ ] Add validation for duplicate emails/phones
