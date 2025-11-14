# User Profile Screen - Testing Guide

## ✅ Features Implemented

### 1. **Profile Management System**
- View mode (read-only) for Officers
- Edit mode for Normal Users
- Comprehensive form validation
- Multiple contact information management
- Multiple address management
- Occupation history tracking
- ID document uploads

### 2. **Basic Information Section**
- ✅ First Name (Required)
- ✅ Middle Name (Optional)
- ✅ Last Name (Required)
- ✅ Date of Birth (DD/MM/YYYY format, Required)
- ✅ Age (Auto-calculated from DOB)

### 3. **Contact Information**
- ✅ Multiple Email Addresses
  - Email field (Required, Email format validation)
  - Type: Work or Personal
  - Preferred/Primary flag
  - Add/Remove functionality
- ✅ Multiple Phone Numbers
  - Phone Number (Required)
  - Type: Work or Personal
  - Preferred/Primary flag
  - Add/Remove functionality

### 4. **Address Management**
- ✅ Multiple Residential Addresses
  - Country (Required)
  - City (Required)
  - Street (Required)
  - Postal Code (Optional)
  - Type: Mailing or Work
  - Add/Remove functionality

### 5. **Identification Documents**
- ✅ Passport upload
- ✅ National ID upload
- ✅ Driver's License upload
- At least one document required

### 6. **Occupation and Employment Information**
- ✅ Multiple occupation entries
  - Employer/Position Name (Required)
  - From Year (YYYY format, Required)
  - To Year (YYYY format, Optional, must be greater than From Year)
  - Add/Remove functionality

## 🎯 User Roles & Access

### Normal User
- ✅ Can view their own profile
- ✅ Can edit all fields
- ✅ Has "Edit Profile" button
- ✅ Has "KYC Verification" button
- ✅ Can save changes

### Officer
- ✅ View-only access (read-only mode)
- ✅ Can view all user profiles
- ✅ Cannot edit any information
- ✅ No edit or save buttons visible

## 🧪 Testing Scenarios

### Test 1: View Profile (Normal User)
1. Login as Normal User (`user@test` / `TestPassword1@`)
2. Click "My Profile" from landing page
3. ✅ Should see profile with mock data
4. ✅ Should see "Edit Profile" and "KYC Verification" buttons
5. ✅ All fields should be in read-only mode initially

### Test 2: Edit Mode (Normal User)
1. Login as Normal User
2. Navigate to Profile
3. Click "Edit Profile" button
4. ✅ Should see "Save Changes" and "Cancel" buttons
5. ✅ All input fields should become editable
6. ✅ Add/Remove buttons should appear for arrays

### Test 3: Basic Information Validation
1. Enter edit mode
2. Clear "First Name" field
3. Try to save
4. ✅ Should show error: "First name is required"
5. Clear "Last Name" field
6. ✅ Should show error: "Last name is required"
7. Clear "Date of Birth"
8. ✅ Should show error: "Date of birth is required"

### Test 4: Age Calculation
1. Enter edit mode
2. Change Date of Birth to different dates
3. ✅ Age should auto-calculate correctly
4. ✅ Age field should always be disabled

### Test 5: Add/Remove Email
1. Enter edit mode
2. Click "Add Email" button
3. ✅ New email card should appear
4. Fill in email information
5. Click delete icon on any email (if more than one exists)
6. ✅ Email should be removed
7. ✅ Cannot remove if only one email remains

### Test 6: Email Validation
1. Enter edit mode
2. Enter invalid email (e.g., "notanemail")
3. ✅ Should show error: "Invalid email format"
4. Try to leave email empty
5. ✅ Should show error: "Email is required"

### Test 7: Add/Remove Phone
1. Enter edit mode
2. Click "Add Phone" button
3. ✅ New phone card should appear
4. Fill in phone information
5. Click delete icon on any phone (if more than one exists)
6. ✅ Phone should be removed
7. ✅ Cannot remove if only one phone remains

### Test 8: Add/Remove Address
1. Enter edit mode
2. Click "Add Address" button
3. ✅ New address card should appear
4. Fill in all required fields (Country, City, Street)
5. Leave Postal Code empty
6. ✅ Should be valid (Postal Code is optional)
7. Click delete icon to remove address
8. ✅ Address should be removed

### Test 9: Address Validation
1. Enter edit mode
2. Leave "Country" empty on any address
3. ✅ Should show error: "Country is required"
4. Leave "City" empty
5. ✅ Should show error: "City is required"
6. Leave "Street" empty
7. ✅ Should show error: "Street is required"

### Test 10: Occupation Management
1. Enter edit mode
2. Click "Add Occupation" button
3. ✅ New occupation card should appear
4. Enter occupation name
5. Enter From Year (e.g., 2020)
6. Enter To Year less than From Year (e.g., 2019)
7. ✅ Should show error: "To year must be greater than from year"
8. Enter valid To Year or leave empty
9. ✅ Should be valid

### Test 11: Occupation Validation
1. Enter edit mode
2. Leave "Employer/Position Name" empty
3. ✅ Should show error: "Occupation name is required"
4. Leave "From Year" empty
5. ✅ Should show error: "From year is required"
6. Enter invalid year (e.g., 2050)
7. ✅ Should show error: "Year cannot be in the future"

### Test 12: ID Document Upload
1. Enter edit mode
2. Click upload area for Passport
3. Select a file
4. ✅ File should be added to upload list
5. Repeat for National ID and Driver's License
6. ✅ Can upload maximum 1 file per document type

### Test 13: Save Changes
1. Enter edit mode
2. Make various changes:
   - Update name fields
   - Add new email
   - Add new address
   - Update occupation
3. Click "Save Changes" button
4. ✅ Should show loading state
5. ✅ Should show success message
6. ✅ Should exit edit mode
7. ✅ Changes should be saved

### Test 14: Cancel Changes
1. Enter edit mode
2. Make several changes
3. Click "Cancel" button
4. ✅ Should exit edit mode
5. ✅ Should revert all changes
6. ✅ Should restore original values

### Test 15: Navigate to KYC
1. From profile page
2. Click "KYC Verification" button
3. ✅ Should navigate to KYC screen

### Test 16: Officer View (Read-Only)
1. Login as Officer (`officer@te` / `TestPassword1@`)
2. Navigate to landing page
3. View a client profile
4. ✅ Should see all profile information
5. ✅ Should NOT see "Edit Profile" button
6. ✅ Should NOT see "KYC Verification" button
7. ✅ All fields should be disabled/read-only
8. ✅ No add/remove buttons should be visible

### Test 17: Preferred/Primary Flags
1. Enter edit mode
2. Check "Preferred" on one email
3. ✅ Checkbox should be checked
4. Check "Primary" on one phone
5. ✅ Should be able to mark multiple as preferred
6. Save changes
7. ✅ Preferred flags should be saved

### Test 18: Type Selection
1. Enter edit mode
2. Change email type to "Work"
3. ✅ Should update to Work
4. Change phone type to "Personal"
5. ✅ Should update to Personal
6. Change address type to "Work"
7. ✅ Should update to Work

## 📋 Validation Rules Summary

### Basic Information
| Field | Required | Format | Notes |
|-------|----------|--------|-------|
| First Name | Yes | Text | - |
| Middle Name | No | Text | - |
| Last Name | Yes | Text | - |
| Date of Birth | Yes | DD/MM/YYYY | Date picker |
| Age | N/A | Number | Auto-calculated, disabled |

### Email
| Field | Required | Format | Values |
|-------|----------|--------|--------|
| Email | Yes | Email format | Valid email |
| Type | Yes | Enum | Work, Personal |
| Preferred | Yes | Boolean | Checkbox |

### Phone
| Field | Required | Format | Values |
|-------|----------|--------|--------|
| Number | Yes | String | Phone format |
| Type | Yes | Enum | Work, Personal |
| Preferred | Yes | Boolean | Checkbox |

### Address
| Field | Required | Format | Values |
|-------|----------|--------|--------|
| Country | Yes | Text | - |
| City | Yes | Text | - |
| Street | Yes | Text | - |
| Postal Code | No | Text | Optional |
| Type | Yes | Enum | Mailing, Work |

### Occupation
| Field | Required | Format | Validation |
|-------|----------|--------|------------|
| Name | Yes | Text | - |
| From Year | Yes | YYYY | 1900 - current year |
| To Year | No | YYYY | Must be > From Year |

## 🎨 UI Features

### Layout
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Card-based sections
- ✅ Icon indicators for each section
- ✅ Clean, professional styling

### Form Controls
- ✅ Input fields with validation feedback
- ✅ Date picker for DOB
- ✅ Select dropdowns for enums
- ✅ Checkboxes for boolean fields
- ✅ Number inputs for years
- ✅ Upload components for documents

### Buttons
- ✅ Primary action buttons (Edit, Save)
- ✅ Secondary action buttons (Cancel, KYC)
- ✅ Dashed buttons for adding items
- ✅ Icon buttons for deletion
- ✅ Loading states

### Visual Feedback
- ✅ Error messages below fields
- ✅ Success message on save
- ✅ Disabled state for read-only mode
- ✅ Hover effects on cards
- ✅ Icons for visual context

## 🔄 State Management

- ✅ Edit mode toggle
- ✅ Form state management with React Hook Form
- ✅ Array field management (useFieldArray)
- ✅ Real-time validation
- ✅ Age auto-calculation
- ✅ Role-based access control

## 📱 Responsive Design

### Desktop (>992px)
- 3-column layout for basic info
- Side-by-side cards
- Full-width forms

### Tablet (768px - 992px)
- 2-column layout
- Stacked cards
- Compact forms

### Mobile (<768px)
- Single column layout
- Full-width buttons
- Touch-friendly controls

## 🐛 Known Limitations

1. **File Upload**: Files are not actually uploaded (frontend only)
2. **API Integration**: Currently uses mock data
3. **Image Preview**: Upload preview is basic
4. **Data Persistence**: Changes are not saved to backend

## 🚀 Next Steps

After testing the profile page, proceed to implement:

1. **KYC Screen** - Document submission form
2. **Client List** - Officer view of all clients
3. **Review Page** - KYC approval interface

## 📝 Notes

- The profile page works with mock data
- All validation is client-side only
- Officers always see read-only view
- Normal users can edit their own profile
- Age is calculated automatically from DOB
- Multiple items can be added/removed for contacts, addresses, and occupations
