/**
 * Menu Item interface representing an item within a category
 */
export interface MenuItem {
  id: string;
  order: number;
  name: {
    en: string;
    ar: string;
  };
  image: string; // Firebase Storage URL
  price?: number; // Optional price
  createdAt: Date | any; // Firestore Timestamp
  updatedAt: Date | any; // Firestore Timestamp
}

/**
 * Menu Item data for creating/updating (without id and timestamps)
 */
export interface MenuItemData {
  order: number;
  name: {
    en: string;
    ar: string;
  };
  image: string;
  price?: number;
}

