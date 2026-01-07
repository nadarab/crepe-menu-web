# Admin Dashboard Setup Guide

## Unique URL-Based Access

The admin dashboard uses a **unique URL secret** instead of username/password authentication. This means only people who know the secret URL can access the admin panel.

## Setup Instructions

### 1. Generate Your Admin Secret

1. Open your `.env` file
2. Find the line: `VITE_ADMIN_SECRET=change-this-to-a-unique-secret-key`
3. Replace `change-this-to-a-unique-secret-key` with a long, random string

**Example:**
```
VITE_ADMIN_SECRET=my-super-secret-key-xyz789abc123
```

**How to generate a secure secret:**
- Use a password generator
- Or use a long random string (at least 20 characters)
- Make it unique and hard to guess

### 2. Access Your Admin Dashboard

Once you've set your secret in `.env`:

1. Restart your development server (if running)
2. Navigate to: `http://localhost:5173/admin/{your-secret-key}`

**Example:**
If your secret is `my-super-secret-key-xyz789abc123`, visit:
```
http://localhost:5173/admin/my-super-secret-key-xyz789abc123
```

### 3. Security Notes

⚠️ **Important Security Considerations:**

1. **Keep your secret URL private** - Anyone with the URL can access your admin dashboard
2. **Don't share the URL** - Treat it like a password
3. **Change it regularly** - If you suspect it's been compromised, change it in `.env`
4. **Use HTTPS in production** - The secret will be visible in the URL, so use HTTPS to encrypt it

### 4. Firebase Security Rules

Since we're not using Firebase Authentication, the security rules need to be updated to allow writes. The current rules require authentication, which won't work without a login system.

**Option 1: Allow Public Writes (Less Secure)**
- Anyone who knows your Firebase project can write to it
- Only use this if you're okay with the risk
- Security relies entirely on keeping your admin URL secret

**Option 2: Use Firebase App Check (Recommended for Production)**
- Add an extra layer of security
- Requires additional setup

For now, we'll update the rules to allow writes. **Make sure to keep your admin URL secret!**

## Next Steps

1. Set your `VITE_ADMIN_SECRET` in `.env`
2. Restart your dev server
3. Access your admin dashboard at `/admin/{your-secret}`
4. Proceed with Phase 4: Admin Dashboard implementation

