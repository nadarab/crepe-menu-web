import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type UploadResult,
} from 'firebase/storage';
import { storage } from '../../config/firebase';

/**
 * Storage Service
 * Handles all Firebase Storage operations for images
 */
export const storageService = {
  /**
   * Upload an image file to Firebase Storage
   * @param file - The image file to upload
   * @param path - Storage path (e.g., 'categories/category-id/image.jpg' or 'items/item-id/image.jpg')
   * @returns Promise resolving to the public download URL
   */
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 10MB');
      }

      // Create a reference to the file location
      const storageRef = ref(storage, path);

      // Upload the file
      const snapshot: UploadResult = await uploadBytes(storageRef, file);

      // Get the public download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  /**
   * Get the download URL for an existing file
   * @param path - Storage path to the file
   * @returns Promise resolving to the public download URL
   */
  async getImageUrl(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error getting image URL:', error);
      throw error;
    }
  },

  /**
   * Delete an image from Firebase Storage
   * @param url - The full download URL of the image to delete
   */
  async deleteImage(url: string): Promise<void> {
    try {
      // Extract the path from the URL
      // Firebase Storage URLs format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
      
      if (!pathMatch) {
        throw new Error('Invalid storage URL format');
      }

      // Decode the path (URLs are encoded)
      const path = decodeURIComponent(pathMatch[1].replace(/%2F/g, '/'));

      // Create a reference and delete
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  /**
   * Helper: Generate storage path for category image
   * @param categoryId - The category ID
   * @param fileName - The image file name (will use original extension)
   */
  getCategoryImagePath(categoryId: string, fileName: string): string {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop();
    return `categories/${categoryId}/${timestamp}.${extension}`;
  },

  /**
   * Helper: Generate storage path for item image
   * @param itemId - The item ID
   * @param fileName - The image file name (will use original extension)
   */
  getItemImagePath(itemId: string, fileName: string): string {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop();
    return `items/${itemId}/${timestamp}.${extension}`;
  },
};

