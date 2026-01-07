# Firebase Setup Instructions

This guide will help you set up Firebase for the Crepe Menu Web application.

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "crepe-menu-web")
4. Click **"Continue"**
5. (Optional) Enable Google Analytics if desired
6. Click **"Create project"**
7. Wait for the project to be created, then click **"Continue"**

---

## Step 2: Register Web App

1. In your Firebase project, click on the **Web icon** (`</>`) to add a web app
2. Register your app with a nickname (e.g., "Crepe Menu Web")
3. (Optional) Check "Also set up Firebase Hosting"
4. Click **"Register app"**
5. Copy the Firebase configuration object that appears

---

## Step 3: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase configuration values:

   From the Firebase Console configuration object:
   ```javascript
   {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   }
   ```

   Map them to your `.env` file:
   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX  (optional, only if you enabled Analytics)
   ```

---

## Step 4: Enable Firebase Services

### Enable Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll update rules manually)
4. Choose a location for your database (select the closest region)
5. Click **"Enable"**

### Enable Firebase Storage

1. In Firebase Console, go to **Storage** (left sidebar)
2. Click **"Get started"**
3. Select **"Start in production mode"** (we'll update rules manually)
4. Choose the same location as Firestore (recommended)
5. Click **"Done"**

### Enable Firebase Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click **"Save"**

---

## Step 5: Deploy Security Rules

### Option A: Using Firebase CLI (Recommended)

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   firebase init storage
   ```
   
   When prompted:
   - Select your Firebase project
   - Use existing rules files: `firestore.rules` and `storage.rules`
   - Don't overwrite existing files if asked

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

### Option B: Using Firebase Console (Manual)

#### Firestore Rules:

1. Go to **Firestore Database** > **Rules** tab
2. Copy the contents of `firestore.rules` file
3. Paste into the rules editor
4. Click **"Publish"**

#### Storage Rules:

1. Go to **Storage** > **Rules** tab
2. Copy the contents of `storage.rules` file
3. Paste into the rules editor
4. Click **"Publish"**

---

## Step 6: Create Admin User

1. Go to **Authentication** > **Users** tab
2. Click **"Add user"**
3. Enter an email address for the admin (e.g., admin@crepe-menu.com)
4. Enter a secure password
5. Click **"Add user"**
6. **Save these credentials securely** - you'll use them to log into the admin dashboard

---

## Step 7: Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for any Firebase initialization errors
3. If you see an error about missing configuration, verify your `.env` file is set up correctly

---

## Security Rules Summary

### Firestore Rules:
- **Read**: Public (anyone can read categories and items for menu display)
- **Write**: Authenticated users only (only admin can create/update/delete)

### Storage Rules:
- **Read**: Public (anyone can view images)
- **Write**: Authenticated users only (only admin can upload/delete images)

---

## Troubleshooting

### Error: "Missing required Firebase configuration"
- Check that your `.env` file exists in the project root
- Verify all `VITE_FIREBASE_*` variables are set
- Restart your development server after changing `.env`

### Error: "Firebase app already initialized"
- This is normal if the app is already initialized
- The code handles this automatically

### Rules not working as expected
- Make sure you deployed the rules (see Step 5)
- Check that rules are published in Firebase Console
- Verify your authentication is working correctly

---

## Next Steps

After completing this setup:
1. ✅ Firebase is configured and ready
2. ✅ Security rules are deployed
3. ✅ Admin user is created
4. ➡️ Proceed to Phase 2: Firebase Utilities & Services

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

