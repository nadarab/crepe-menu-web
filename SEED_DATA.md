# Seed Data Documentation

This document explains how to populate your Firebase database with sample menu data.

## Overview

The seed script creates 9 sample categories with menu items for testing and demonstration purposes.

## How to Use

### Option 1: Browser Console (Recommended)

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to your admin dashboard (or any page)

3. Open the browser console (F12)

4. Import and run the seed function:
   ```javascript
   // Import the seed function
   import { seedData } from './src/scripts/seedData.ts';
   
   // Run it
   await seedData();
   ```

   Or if you have the script loaded, you can simply:
   ```javascript
   await window.seedData();
   ```

### Option 2: Admin Dashboard Page

Create a temporary seed page in your admin dashboard:

1. Add a seed button to your admin layout (temporary)
2. Import and call `seedData()` when clicked

### Option 3: Manual Import in Component

You can temporarily import and call the seed function in any component:

```typescript
import { seedData } from '../scripts/seedData';

// Call it in useEffect or button click
useEffect(() => {
  // seedData(); // Uncomment to run
}, []);
```

## Sample Data Included

The seed script creates:

- **9 Categories:**
  1. Sweet Crepes (كريب حلو)
  2. Savory Crepes (كريب مالح)
  3. Fruit Crepes (كريب الفواكه)
  4. Special Crepes (كريب خاص)
  5. Breakfast Crepes (كريب الإفطار)
  6. Ice Cream Crepes (كريب الآيس كريم)
  7. Kids Crepes (كريب للأطفال)
  8. Vegan Crepes (كريب نباتي)
  9. Premium Crepes (كريب ممتاز)

- **Multiple items per category** with:
  - Bilingual names (English & Arabic)
  - Prices in JD
  - Order numbers

## Clearing Data

To clear all seeded data:

```javascript
import { clearAllData } from './src/scripts/seedData.ts';
await clearAllData();
```

Or in browser console:
```javascript
await window.clearAllData();
```

⚠️ **Warning:** This will delete ALL categories and items from your database!

## Customizing Seed Data

To customize the sample data:

1. Open `src/scripts/seedData.ts`
2. Modify the `sampleCategories` array
3. Add or remove categories/items as needed
4. Run the seed function again

## Notes

- Images are set to empty strings (`''`) - you'll need to upload images manually through the admin dashboard
- Prices are in Jordanian Dinar (JD)
- All data includes both English and Arabic translations
- Categories are ordered from 1-9
- Items within each category are also ordered

## Troubleshooting

**Error: "Firebase not initialized"**
- Make sure your `.env` file has valid Firebase configuration
- Restart your dev server after updating `.env`

**Error: "Permission denied"**
- Check that your Firebase security rules allow writes
- Ensure you're authenticated (if using auth) or rules allow public writes

**Data not appearing**
- Check browser console for errors
- Verify Firebase connection
- Check Firestore database in Firebase Console

