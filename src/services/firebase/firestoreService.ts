import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Category, CategoryData } from '../../types/category';
import type { MenuItem, MenuItemData } from '../../types/menuItem';

/**
 * Convert Firestore timestamp to Date
 */
const convertTimestamps = (data: DocumentData): any => {
  const converted = { ...data };
  if (converted.createdAt && converted.createdAt.toDate) {
    converted.createdAt = converted.createdAt.toDate();
  }
  if (converted.updatedAt && converted.updatedAt.toDate) {
    converted.updatedAt = converted.updatedAt.toDate();
  }
  return converted;
};

/**
 * Convert Firestore document to Category with items
 */
const docToCategory = async (
  docSnapshot: QueryDocumentSnapshot<DocumentData>
): Promise<Category> => {
  const data = docSnapshot.data();
  const category = convertTimestamps({
    id: docSnapshot.id,
    ...data,
  }) as Category;

  // Fetch items for this category
  const itemsSnapshot = await getDocs(
    collection(db, 'categories', docSnapshot.id, 'items')
  );
  category.items = itemsSnapshot.docs.map((itemDoc) =>
    convertTimestamps({
      id: itemDoc.id,
      ...itemDoc.data(),
    })
  ) as MenuItem[];

  // Sort items by order
  category.items.sort((a, b) => a.order - b.order);

  return category;
};

/**
 * Firestore Service
 * Handles all Firestore database operations
 */
export const firestoreService = {
  /**
   * Get all categories with their items, sorted by order
   */
  async getCategories(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);

      const categories = await Promise.all(
        snapshot.docs.map((doc) => docToCategory(doc))
      );

      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get a single category by ID with its items
   */
  async getCategory(id: string): Promise<Category | null> {
    try {
      const categoryRef = doc(db, 'categories', id);
      const categorySnapshot = await getDoc(categoryRef);

      if (!categorySnapshot.exists()) {
        return null;
      }

      const category = await docToCategory(
        categorySnapshot as QueryDocumentSnapshot<DocumentData>
      );
      return category;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  /**
   * Create a new category
   */
  async createCategory(data: CategoryData): Promise<string> {
    try {
      const now = Timestamp.now();
      const categoryData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, 'categories'), categoryData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update an existing category
   */
  async updateCategory(id: string, data: Partial<CategoryData>): Promise<void> {
    try {
      const categoryRef = doc(db, 'categories', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(categoryRef, updateData);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  /**
   * Delete a category (this will also delete all items in the category)
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      // First, delete all items in the category
      const itemsSnapshot = await getDocs(
        collection(db, 'categories', id, 'items')
      );
      
      const deleteItemsPromises = itemsSnapshot.docs.map((itemDoc) =>
        deleteDoc(doc(db, 'categories', id, 'items', itemDoc.id))
      );
      await Promise.all(deleteItemsPromises);

      // Then delete the category
      const categoryRef = doc(db, 'categories', id);
      await deleteDoc(categoryRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  /**
   * Create a new item in a category
   */
  async createItem(
    categoryId: string,
    data: MenuItemData
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const itemData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const itemsRef = collection(db, 'categories', categoryId, 'items');
      const docRef = await addDoc(itemsRef, itemData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  /**
   * Update an existing item
   */
  async updateItem(
    categoryId: string,
    itemId: string,
    data: Partial<MenuItemData>
  ): Promise<void> {
    try {
      const itemRef = doc(db, 'categories', categoryId, 'items', itemId);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(itemRef, updateData);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  /**
   * Delete an item from a category
   */
  async deleteItem(categoryId: string, itemId: string): Promise<void> {
    try {
      const itemRef = doc(db, 'categories', categoryId, 'items', itemId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },
};

