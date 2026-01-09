import type { MenuItem } from './menuItem';

/**
 * Category interface representing a menu category in Firestore
 */
export interface Category {
  id: string;
  order: number;
  mainImage: string; // Firebase Storage URL
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  tagline?: {
    en: string;
    ar: string;
  }; // Optional tagline like "LOVE AT FIRST BITE"
  items?: MenuItem[]; // Items in this category (loaded separately)
  createdAt: Date | any; // Firestore Timestamp
  updatedAt: Date | any; // Firestore Timestamp
}

/**
 * Category data for creating/updating (without id and timestamps)
 */
export interface CategoryData {
  order: number;
  mainImage: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  tagline?: {
    en: string;
    ar: string;
  };
}

