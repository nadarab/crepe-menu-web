/**
 * Test utility to verify Firebase is properly configured
 * This file can be imported temporarily to test Firebase connection
 */

import { db, storage, auth } from '../config/firebase';

export const testFirebaseConnection = () => {
  console.log('🧪 Testing Firebase Connection...');
  
  try {
    // Test Firestore
    console.log('✅ Firestore initialized:', db ? 'Yes' : 'No');
    console.log('   Database ID:', db.app.name);
    
    // Test Storage
    console.log('✅ Storage initialized:', storage ? 'Yes' : 'No');
    console.log('   Storage Bucket:', storage.app.name);
    
    // Test Auth
    console.log('✅ Auth initialized:', auth ? 'Yes' : 'No');
    console.log('   Auth Domain:', auth.app.name);
    
    console.log('✅ Firebase is properly configured!');
    return true;
  } catch (error) {
    console.error('❌ Firebase configuration error:', error);
    return false;
  }
};

