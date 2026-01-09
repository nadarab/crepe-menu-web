# Work Plan: Crepe Menu Web Application
## From Firebase Setup to Full Menu Implementation

---

## 📋 Overview

This document outlines the complete work plan for implementing a dynamic menu section with Firebase backend and admin dashboard. The plan is divided into phases, with each phase building upon the previous one.

---

## Phase 1: Firebase Setup & Configuration

### 1.1 Firebase Project Setup
- [ ] Create/Verify Firebase project in Firebase Console
- [ ] Register web app in Firebase project
- [ ] Obtain Firebase configuration (API keys, project ID, etc.)

### 1.2 Firebase Configuration in Codebase
- [ ] Create `src/config/firebase.ts` file
- [ ] Initialize Firebase App
- [ ] Initialize Firestore Database
- [ ] Initialize Firebase Storage
- [ ] Initialize Firebase Authentication
- [ ] Add Firebase config to `.env` file (and `.env.example`)
- [ ] Add `.env` to `.gitignore`

### 1.3 Firebase Security Rules Setup
- [ ] Create Firestore security rules:
  - Read access: Public (for menu display)
  - Write access: Authenticated admin only
- [ ] Create Storage security rules:
  - Read access: Public (for images)
  - Write access: Authenticated admin only
- [ ] Deploy security rules to Firebase

### 1.4 Database Schema Design
- [ ] Define Firestore collections structure:
  ```
  categories/
    {categoryId}/
      - id: string
      - order: number (for sorting)
      - mainImage: string (Storage URL)
      - title: {
          en: string
          ar: string
        }
      - description: {
          en: string
          ar: string
        }
      - createdAt: timestamp
      - updatedAt: timestamp
      items/ (subcollection)
        {itemId}/
          - id: string
          - order: number (for sorting within category)
          - name: {
              en: string
              ar: string
            }
          - image: string (Storage URL)
          - price: number (optional)
          - createdAt: timestamp
          - updatedAt: timestamp
  ```
- [ ] Create TypeScript interfaces/types for data structure

---

## Phase 2: Firebase Utilities & Services

### 2.1 Firebase Service Layer
- [ ] Create `src/services/firebase/` directory
- [ ] Create `firebaseService.ts` - Main Firebase service
- [ ] Create `firestoreService.ts` - Firestore operations:
  - `getCategories()` - Fetch all categories with items
  - `getCategory(id)` - Fetch single category
  - `createCategory(data)` - Create new category
  - `updateCategory(id, data)` - Update category
  - `deleteCategory(id)` - Delete category
  - `createItem(categoryId, data)` - Create item in category
  - `updateItem(categoryId, itemId, data)` - Update item
  - `deleteItem(categoryId, itemId)` - Delete item
- [ ] Create `storageService.ts` - Storage operations:
  - `uploadImage(file, path)` - Upload image to Storage
  - `deleteImage(url)` - Delete image from Storage
  - `getImageUrl(path)` - Get public URL
- [ ] Create `authService.ts` - Authentication operations:
  - `signIn(email, password)` - Admin login
  - `signOut()` - Logout
  - `getCurrentUser()` - Get current authenticated user
  - `onAuthStateChanged(callback)` - Listen to auth state

### 2.2 Type Definitions
- [ ] Create `src/types/` directory
- [ ] Create `category.ts` - Category interface
- [ ] Create `menuItem.ts` - Menu item interface
- [ ] Create `firebase.ts` - Firebase-related types

---

## Phase 3: Admin Authentication

### 3.1 Auth Context & Provider
- [ ] Create `src/contexts/AuthContext.tsx`
- [ ] Implement auth state management
- [ ] Create `AuthProvider` component
- [ ] Add auth state listener
- [ ] Wrap App with AuthProvider

### 3.2 Admin Login Page
- [ ] Create `src/pages/Admin/Login.tsx`
- [ ] Design login form (email, password)
- [ ] Implement login functionality
- [ ] Add error handling and validation
- [ ] Add loading states
- [ ] Support EN/AR translations
- [ ] Add "Remember me" functionality (optional)

### 3.3 Protected Routes
- [ ] Create `src/components/ProtectedRoute.tsx`
- [ ] Implement route protection logic
- [ ] Redirect to login if not authenticated
- [ ] Create admin routes structure

---

## Phase 4: Admin Dashboard - Category Management

### 4.1 Admin Layout
- [ ] Create `src/components/Admin/AdminLayout.tsx`
- [ ] Create admin navigation/sidebar
- [ ] Add logout functionality
- [ ] Show current admin email/name
- [ ] Support EN/AR translations

### 4.2 Category List Page
- [ ] Create `src/pages/Admin/Categories.tsx`
- [ ] Display list of all categories
- [ ] Show category order, title, description preview
- [ ] Add "Create New Category" button
- [ ] Implement category deletion
- [ ] Add drag-and-drop for reordering (optional)
- [ ] Add search/filter functionality
- [ ] Show loading and error states

### 4.3 Category Form Component
- [ ] Create `src/components/Admin/CategoryForm.tsx`
- [ ] Form fields:
  - Title (EN/AR)
  - Description (EN/AR)
  - Main Image upload
  - Order number
- [ ] Image upload with preview
- [ ] Form validation
- [ ] Handle both create and edit modes
- [ ] Save to Firestore

### 4.4 Category Edit Page
- [ ] Create `src/pages/Admin/CategoryEdit.tsx`
- [ ] Load category data by ID
- [ ] Pre-populate CategoryForm
- [ ] Update category in Firestore
- [ ] Handle image updates (delete old, upload new)

---

## Phase 5: Admin Dashboard - Item Management

### 5.1 Item List Page
- [ ] Create `src/pages/Admin/Items.tsx`
- [ ] Display items grouped by category
- [ ] Filter items by category
- [ ] Show item name, image, price
- [ ] Add "Create New Item" button
- [ ] Implement item deletion
- [ ] Add search functionality
- [ ] Show loading and error states

### 5.2 Item Form Component
- [ ] Create `src/components/Admin/ItemForm.tsx`
- [ ] Form fields:
  - Category selection (dropdown)
  - Name (EN/AR)
  - Image upload
  - Price (optional, number input)
  - Order number
- [ ] Image upload with preview
- [ ] Form validation
- [ ] Handle both create and edit modes
- [ ] Save to Firestore

### 5.3 Item Edit Page
- [ ] Create `src/pages/Admin/ItemEdit.tsx`
- [ ] Load item data by ID
- [ ] Pre-populate ItemForm
- [ ] Update item in Firestore
- [ ] Handle image updates

---

## Phase 6: Admin Dashboard - Image Management

### 6.1 Image Upload Component
- [ ] Create `src/components/Admin/ImageUpload.tsx`
- [ ] File input with drag-and-drop support
- [ ] Image preview before upload
- [ ] Upload progress indicator
- [ ] Image compression/resizing (optional)
- [ ] Error handling for large files
- [ ] Support for multiple image formats

### 6.2 Image Optimization
- [ ] Implement image compression before upload
- [ ] Set max file size limits
- [ ] Generate thumbnail versions (optional)

---

## Phase 7: Data Seeding & Initial Setup

### 7.1 Seed Script (Optional)
- [ ] Create `src/scripts/seedData.ts`
- [ ] Add sample categories and items
- [ ] Script to populate Firebase with initial data
- [ ] Document seed script usage

### 7.2 Admin User Creation
- [ ] Create first admin user in Firebase Console
- [ ] Document admin credentials setup
- [ ] Test admin login flow

---

## Phase 8: Menu Section Component - Core Structure

### 8.1 Menu Component Setup
- [ ] Create `src/components/Menu/MenuSection.tsx`
- [ ] Set up component structure
- [ ] Add section container with full-height sections
- [ ] Implement scroll detection
- [ ] Add loading state while fetching data

### 8.2 Data Fetching
- [ ] Integrate Firestore service
- [ ] Fetch all categories with items
- [ ] Order categories by `order` field
- [ ] Cache data (optional)
- [ ] Handle error states

### 8.3 Category Sections
- [ ] Create individual category section component
- [ ] Each section takes full viewport height
- [ ] Position sections sequentially
- [ ] Add section IDs for navigation

---

## Phase 9: Menu Section - Content Display

### 9.1 Main Content Display
- [ ] Display category main image
- [ ] Display category title (EN/AR based on i18n)
- [ ] Display category description (EN/AR)
- [ ] Style according to design system

### 9.2 Items Display
- [ ] Create `src/components/Menu/MenuItem.tsx`
- [ ] Display item image
- [ ] Display item name (EN/AR)
- [ ] Display item price (if available)
- [ ] Grid/list layout for items
- [ ] Responsive design (mobile, tablet, desktop)

---

## Phase 10: Menu Section - Scroll Animations

### 10.1 Scroll Detection
- [ ] Implement Intersection Observer API
- [ ] Detect when category section enters viewport
- [ ] Track active category index
- [ ] Handle scroll direction (up/down)

### 10.2 Animation Implementation
- [ ] Use Framer Motion for animations
- [ ] Animate main image transitions:
  - Fade in/out
  - Slide transitions
  - Cross-fade effect
- [ ] Animate title changes:
  - Slide in from side
  - Fade with scale
- [ ] Animate description changes:
  - Fade transitions
- [ ] Animate items list:
  - Stagger animations for items
  - Enter/exit animations

### 10.3 Smooth Scrolling
- [ ] Implement smooth scroll behavior
- [ ] Add snap scroll points (optional)
- [ ] Handle scroll locking during animations (optional)

---

## Phase 11: Menu Section - Advanced Features

### 11.1 Navigation
- [ ] Add category indicator dots/numbers
- [ ] Add "Next/Previous" buttons
- [ ] Click to jump to specific category
- [ ] Show current category in navigation

### 11.2 Performance Optimization
- [ ] Lazy load images
- [ ] Implement image placeholders/blur
- [ ] Optimize re-renders (React.memo, useMemo)
- [ ] Debounce scroll events

### 11.3 Accessibility
- [ ] Add ARIA labels
- [ ] Keyboard navigation support
- [ ] Screen reader friendly
- [ ] Focus management

---

## Phase 12: Integration & Testing

### 12.1 Routing Integration
- [ ] Add menu route in App.tsx
- [ ] Update navigation links
- [ ] Test navigation from Hero section
- [ ] Add scroll-to-menu functionality

### 12.2 Responsive Design
- [ ] Test on mobile devices
- [ ] Test on tablets
- [ ] Test on desktop
- [ ] Adjust animations for mobile (optional: simpler animations)
- [ ] Test image loading on slow connections

### 12.3 Error Handling
- [ ] Handle network errors
- [ ] Handle empty data states
- [ ] Show user-friendly error messages
- [ ] Implement retry mechanisms

### 12.4 Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Fix cross-browser compatibility issues

---

## Phase 13: Polish & Final Touches

### 13.1 Loading States
- [ ] Add skeleton loaders for images
- [ ] Add loading spinners
- [ ] Smooth loading transitions

### 13.2 Transitions
- [ ] Smooth page transitions
- [ ] Loading state transitions
- [ ] Error state transitions

### 13.3 Documentation
- [ ] Document admin dashboard usage
- [ ] Create README for Firebase setup
- [ ] Document environment variables
- [ ] Add code comments where needed

---

## Phase 14: Deployment Preparation

### 14.1 Environment Variables
- [ ] Set up production Firebase config
- [ ] Create `.env.production` file
- [ ] Document all required environment variables

### 14.2 Build Optimization
- [ ] Test production build
- [ ] Optimize bundle size
- [ ] Check for console errors/warnings
- [ ] Test Firebase rules in production

### 14.3 Security Review
- [ ] Review Firebase security rules
- [ ] Ensure admin routes are protected
- [ ] Verify public data is read-only
- [ ] Test authentication flow

---

## 📝 Notes

- **Priority Order**: Phases should be completed sequentially
- **Testing**: Test each phase before moving to the next
- **Breaking Changes**: Document any breaking changes
- **Rollback Plan**: Keep backups of working versions

---

## 🎯 Success Criteria

- [ ] Firebase is configured and working
- [ ] Admin can log in securely
- [ ] Admin can create/edit/delete categories
- [ ] Admin can create/edit/delete items
- [ ] Admin can upload images
- [ ] Menu section displays all categories and items
- [ ] Scroll animations work smoothly
- [ ] Responsive design works on all devices
- [ ] Multi-language support (EN/AR) works
- [ ] No console errors
- [ ] Good performance (fast loading, smooth animations)

---

## 📅 Estimated Timeline

- **Phase 1-2**: Firebase Setup - 2-3 hours
- **Phase 3**: Admin Auth - 2-3 hours
- **Phase 4-5**: Admin Dashboard - 6-8 hours
- **Phase 6**: Image Management - 2-3 hours
- **Phase 7**: Data Seeding - 1 hour
- **Phase 8-9**: Menu Core - 4-5 hours
- **Phase 10**: Scroll Animations - 4-6 hours
- **Phase 11**: Advanced Features - 3-4 hours
- **Phase 12-13**: Integration & Polish - 4-5 hours
- **Phase 14**: Deployment Prep - 2-3 hours

**Total Estimated Time**: 30-41 hours

---

*This work plan is a living document and can be updated as the project progresses.*

